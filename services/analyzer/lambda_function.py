import json
import boto3
import os
from datetime import datetime
from aws_lambda_powertools import Logger
from prompts import SYSTEM_PROMPT, USER_PROMPT_TEMPLATE

logger = Logger()
bedrock = boto3.client(service_name='bedrock-runtime', region_name=os.environ.get('BEDROCK_REGION', 'us-east-1'))
structured_table = boto3.resource('dynamodb').Table(os.environ['STRUCTURED_JOBS_TABLE'])

def analyze_job(job_text):
    prompt = f"{SYSTEM_PROMPT}\n\n{USER_PROMPT_TEMPLATE.format(job_description=job_text)}"
    
    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}]
    })

    try:
        response = bedrock.invoke_model(
            modelId='anthropic.claude-3-haiku-20240307-v1:0',
            body=body
        )
        response_body = json.loads(response.get('body').read())
        structured_json_str = response_body['content'][0]['text']
        
        # Clean up possible markdown artifacts
        if "```json" in structured_json_str:
            structured_json_str = structured_json_str.split("```json")[1].split("```")[0].strip()
            
        return json.loads(structured_json_str)
    except Exception as e:
        logger.error(f"Error calling Bedrock or parsing JSON: {str(e)}")
        return None

@logger.inject_lambda_context
def lambda_handler(event, context):
    processed_count = 0
    
    # Handle DynamoDB Stream event
    records = event.get('Records', [])
    for record in records:
        if record['eventName'] != 'INSERT':
            continue
            
        try:
            # Extract data from DynamoDB Stream NewImage
            new_image = record['dynamodb']['NewImage']
            job_id = new_image['job_id']['S']
            job_text = new_image['raw_description']['S']
            
            logger.info(f"Analyzing job {job_id}")
            
            structured_data = analyze_job(job_text)
            
            if structured_data:
                structured_data['job_id'] = job_id
                structured_data['analyzed_at'] = datetime.utcnow().isoformat()
                # Ensure fit_score exists for GSI even before scoring
                structured_data['fit_score'] = structured_data.get('fit_score', 0)
                
                structured_table.put_item(Item=structured_data)
                processed_count += 1
                logger.info(f"Successfully analyzed and stored job {job_id}")
            else:
                logger.warning(f"Failed to extract structured data for job {job_id}")
                
        except Exception as e:
            logger.exception(f"Error processing stream record: {str(e)}")
            # DLQ will handle the failure if configured for the event source
            raise e

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"Processed {processed_count} jobs",
            "processed_count": processed_count
        })
    }
