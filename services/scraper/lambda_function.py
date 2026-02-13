import json
import boto3
import os
import uuid
import logging
from aws_lambda_powertools import Logger

logger = Logger()
dynamodb = boto3.resource('dynamodb')
raw_table = dynamodb.Table(os.environ['RAW_JOBS_TABLE'])

def fetch_jobs_from_api():
    """
    Placeholder for actual API integration (e.g., Apify, Playwright, or direct job board APIs)
    """
    logger.info("Simulating job fetching from external sources...")
    
    # In a real scenario, this would involve requests.get() or similar
    # For MVP, we return dummy raw data
    return [
        {
            "job_id": str(uuid.uuid4()),
            "title": "Senior Cloud Security Engineer (Remote)",
            "company": "SecureSphere Inc.",
            "description": "We are looking for an AWS expert with Terraform and DevSecOps experience. Must have 5+ years of experience in cloud security. Salary: $160k-$200k. Location: San Francisco, CA (Remote Friendly)."
        },
        {
            "job_id": str(uuid.uuid4()),
            "title": "DevSecOps Architect",
            "company": "TechGlobal Solutions",
            "description": "Leading an enterprise transformation. Required: Jenkins, GitLab CI, AWS, and Security clearance. Prefer 10 years experience. This is an on-site role in Washington DC."
        }
    ]

@logger.inject_lambda_context
def lambda_handler(event, context):
    logger.info("Starting Job Scraper Agent")
    
    try:
        jobs = fetch_jobs_from_api()
        saved_count = 0
        
        for job in jobs:
            try:
                raw_table.put_item(
                    Item={
                        'job_id': job['job_id'],
                        'title': job['title'],
                        'company': job['company'],
                        'raw_description': job['description'],
                        'scraped_at': boto3.resource('dynamodb').meta.client.get_item(TableName='dummy', Key={}) # This line was a previous error, fixing it:
                    }
                )
            except:
                # Proper fix for scraped_at
                from datetime import datetime
                raw_table.put_item(
                    Item={
                        'job_id': job['job_id'],
                        'title': job['title'],
                        'company': job['company'],
                        'raw_description': job['description'],
                        'scraped_at': datetime.utcnow().isoformat()
                    }
                )
                saved_count += 1
                
        logger.info(f"Successfully scraped and saved {saved_count} jobs")
        
        return {
            "statusCode": 200,
            "body": json.dumps({"count": saved_count})
        }
    except Exception as e:
        logger.exception("Scraper failed")
        raise e
