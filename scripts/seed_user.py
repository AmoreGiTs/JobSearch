import boto3
import os

def seed_user():
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('ai-job-agent-user-profile-dev')
    
    user_profile = {
        "user_id": "default_user",
        "name": "Alex DevSecOps",
        "skills": [
            "AWS", "Terraform", "Python", "CI/CD", "Docker", 
            "Kubernetes", "IAM", "Security", "GitHub Actions", "Linux"
        ],
        "years_experience": 5,
        "target_titles": ["Senior DevOps Engineer", "Cloud Security Engineer", "DevSecOps Engineer"],
        "preferences": {
            "remote": True,
            "locations": ["Nairobi", "Remote", "Berlin", "London"],
            "min_salary": 100000
        }
    }
    
    print(f"Seeding user profile for {user_profile['name']}...")
    try:
        table.put_item(Item=user_profile)
        print("User profile seeded successfully!")
    except Exception as e:
        print(f"Error seeding user: {e}")

if __name__ == "__main__":
    # Ensure you have AWS credentials configured and the table exists
    seed_user()
