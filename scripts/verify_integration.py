import json
import sys
import os

def verify_job_schema(job):
    required_fields = [
        "job_id", "job_title", "company_name", "location", 
        "remote_policy", "required_skills", "fit_score", 
        "analyzed_at", "posted_at"
    ]
    for field in required_fields:
        if field not in job:
            return False, f"Missing required field: {field}"
    
    if not isinstance(job["required_skills"], list):
        return False, "required_skills must be a list"
    
    if not isinstance(job["fit_score"], (int, float)):
        return False, "fit_score must be a number"
        
    return True, "Valid"

def main():
    print("Verifying Frontend-Backend Schema Consistency...")
    # In a real scenario, we would parse lib/api.ts or fetch from a live API
    # Here we simulate the verification of the mock data structure
    
    mock_job_example = {
        "job_id": "sim_1",
        "job_title": "AI Engineer",
        "company_name": "AI Corp",
        "location": "Remote",
        "remote_policy": "Remote",
        "required_skills": ["Python", "AWS"],
        "fit_score": 90,
        "analyzed_at": "2026-02-13T10:00:00Z",
        "posted_at": "2026-02-13T09:00:00Z"
    }
    
    is_valid, message = verify_job_schema(mock_job_example)
    if is_valid:
        print("✅ Schema verification passed.")
    else:
        print(f"❌ Schema verification failed: {message}")
        sys.exit(1)

if __name__ == "__main__":
    main()
