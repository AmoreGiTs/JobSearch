import json
import boto3
import os
from datetime import datetime, timedelta
from boto3.dynamodb.conditions import Key, Attr
from aws_lambda_powertools import Logger

logger = Logger()
dynamodb = boto3.resource('dynamodb')
ses = boto3.client('ses')
structured_table = dynamodb.Table(os.environ['STRUCTURED_JOBS_TABLE'])

def lambda_handler(event, context):
    logger.info("Starting Daily Job Summary Notification Service")
    
    sender = os.environ['SENDER_EMAIL']
    recipient = os.environ['RECIPIENT_EMAIL']
    
    # 1. Calculate the 24h cutoff
    cutoff = (datetime.utcnow() - timedelta(hours=24)).isoformat()
    
    # 2. Query GSI for high-fit jobs
    # Note: DynamoDB doesn't support >= on GSI partition key directly with Query if it's the only key,
    # but since we have a range key (analyzed_at), we can use it.
    # However, to get ALL scores >= 70, we'd need multiple queries or a Scan with Filter.
    # PRO TIP: For a daily summary, a Scan with Filter on analyzed_at > cutoff AND fit_score > 70
    # is often more efficient than querying multiple score buckets.
    
    try:
        # Use GSI if we just want to query specific high scores, 
        # but here Scan with Filter is better for "all high scores in last 24h"
        response = structured_table.scan(
            FilterExpression=Attr('fit_score').gte(70) & Attr('analyzed_at').gt(cutoff)
        )
        jobs = response.get('Items', [])
        logger.info(f"Found {len(jobs)} jobs matching criteria since {cutoff}")
        
    except Exception as e:
        logger.exception("Failed to fetch jobs from DynamoDB")
        raise e

    if not jobs:
        logger.info("No high-fit jobs found in the last 24 hours. Skipping email.")
        return {"statusCode": 200, "body": "No new jobs to notify."}

    # 3. Format and send email
    # Sort by score descending
    jobs.sort(key=lambda x: x.get('fit_score', 0), reverse=True)
    
    html_body = "<h2>Your AI Job Agent Daily Digest</h2>"
    html_body += f"<p>Found {len(jobs)} high-fit opportunities in the last 24 hours.</p><hr/>"
    
    for job in jobs[:5]: # Top 5
        html_body += f"""
        <div style='margin-bottom: 20px;'>
            <h3 style='color: #2563eb;'>{job.get('job_title')} (Match: {job.get('fit_score')}%)</h3>
            <p><strong>Company:</strong> {job.get('company_name', 'N/A')}</p>
            <p><strong>Location:</strong> {job.get('location')} ({job.get('remote_policy')})</p>
            <p><strong>Top Skills:</strong> {', '.join(job.get('required_skills', [])[:5])}</p>
            <p><a href='#'>View Details in Dashboard</a></p>
        </div>
        <hr/>
        """

    try:
        ses.send_email(
            Source=sender,
            Destination={'ToAddresses': [recipient]},
            Message={
                'Subject': {'Data': f"🚀 {len(jobs)} New Job Matches for You!"},
                'Body': {'Html': {'Data': html_body}}
            }
        )
        logger.info("Email sent successfully")
    except Exception as e:
        logger.exception("Failed to send email via SES")
        raise e

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Summary email sent", "count": len(jobs)})
    }
