import json
import boto3
import os
from aws_lambda_powertools import Logger

logger = Logger()
dynamodb = boto3.resource('dynamodb')
structured_table = dynamodb.Table(os.environ['STRUCTURED_JOBS_TABLE'])
user_table = dynamodb.Table(os.environ['USER_PROFILE_TABLE'])

def calculate_score(job_data, user_profile):
    score = 0
    weights = {
        "skills": 50,
        "location": 20,
        "experience": 20,
        "title": 10
    }

    # 1. Skill Matching (Case-insensitive)
    job_skills = {s.lower() for s in job_data.get('required_skills', [])}
    user_skills = {s.lower() for s in user_profile.get('top_skills', [])}
    
    if job_skills:
        overlap = job_skills.intersection(user_skills)
        skill_score = (len(overlap) / len(job_skills)) * weights['skills']
        score += skill_score
        logger.info(f"Skill score: {skill_score} (Overlap: {overlap})")

    # 2. Location & Remote Matching
    job_remote = job_data.get('remote_policy', '').lower()
    user_pref_remote = user_profile.get('preferences', {}).get('remote_only', False)
    
    if user_pref_remote and 'remote' in job_remote:
        score += weights['location']
    elif not user_pref_remote:
        # Check location match if not remote only
        job_loc = job_data.get('location', '').lower()
        user_locs = [l.lower() for l in user_profile.get('preferences', {}).get('locations', [])]
        if any(loc in job_loc for loc in user_locs):
            score += weights['location']

    # 3. Experience Matching
    job_exp = job_data.get('years_of_experience', {})
    user_exp = user_profile.get('years_of_experience', 0)
    
    min_req = job_exp.get('min')
    if min_req is not None:
        if user_exp >= min_req:
            score += weights['experience']
        elif user_exp >= (min_req - 2): # Partial credit
            score += (weights['experience'] * 0.5)

    # 4. Title Matching
    job_title = job_data.get('job_title', '').lower()
    user_titles = [t.lower() for t in user_profile.get('target_titles', [])]
    if any(t in job_title for t in user_titles):
        score += weights['title']

    return round(min(score, 100), 2)

@logger.inject_lambda_context
def lambda_handler(event, context):
    processed_count = 0
    
    # Fetch default user profile for MVP
    # In production, user_id would come from the record/meta
    try:
        user_response = user_table.get_item(Key={'user_id': 'default_user'})
        user_profile = user_response.get('Item')
        if not user_profile:
            logger.error("Default user profile not found")
            return {"statusCode": 404, "body": "User profile missing"}
    except Exception as e:
        logger.exception("Failed to fetch user profile")
        raise e

    records = event.get('Records', [])
    for record in records:
        # Only trigger on INSERT of structured data (or MODIFY if we want re-scoring)
        if record['eventName'] not in ['INSERT', 'MODIFY']:
            continue
            
        try:
            # Check if this record was already scored to avoid infinite loops (if stream triggers on self-update)
            # However, scoring updates 'fit_score' which triggers MODIFY.
            # Best practice: Filter by 'fit_score' existence or source
            new_image = record['dynamodb']['NewImage']
            job_id = new_image['job_id']['S']
            
            # Simple guard: if fit_score already exists and this is a MODIFY, skip unless requested
            if 'fit_score' in new_image and record['eventName'] == 'MODIFY':
                continue

            # Convert DynamoDB image to plain dict for calculate_score
            # (Note: For brevity using a simple mapper, production should use TypeSerializer)
            job_data = {k: list(v.values())[0] for k, v in new_image.items()}
            
            # required_skills is a List in Dynamo
            if 'required_skills' in new_image:
                job_data['required_skills'] = [s['S'] for s in new_image['required_skills']['L']]
            
            logger.info(f"Scoring job {job_id}")
            fit_score = calculate_score(job_data, user_profile)
            
            structured_table.update_item(
                Key={'job_id': job_id},
                UpdateExpression="set fit_score = :s",
                ExpressionAttributeValues={':s': fit_score}
            )
            processed_count += 1
            logger.info(f"Job {job_id} scored: {fit_score}")
            
        except Exception as e:
            logger.exception(f"Error scoring job {job_id}")
            raise e

    return {
        "statusCode": 200,
        "body": json.dumps({"processed": processed_count})
    }
