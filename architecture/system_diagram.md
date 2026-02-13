# System Architecture

The AI Job Search Automation Agent uses a serverless, event-driven architecture on AWS.

## High-Level Data Flow

1.  **Job Scraper (Lambda)**: Triggered daily (EventBridge). Fetches raw job data from defined sources and writes to `RawJobs` DynamoDB table.
2.  **Job Analyzer (Lambda)**: Triggered by new items in `RawJobs` (DynamoDB Streams) or batch schedule. Invokes AWS Bedrock (Claude 3) to parse text into JSON. Writes to `StructuredJobs` table.
3.  **Scoring Engine (Lambda)**: Triggered by new items in `StructuredJobs`. Reads `UserProfile` table. Calculates `fit_score`. Updates `StructuredJobs` with score.
4.  **Notification Service (Lambda)**: Triggered daily (EventBridge). Scans `StructuredJobs` for `fit_score > 70` created in the last 24h. Formats HTML email and sends via SES.

## Diagram

```mermaid
graph TD
    EB[EventBridge Schedule] -->|Triggers| Scraper[Scraper Lambda]
    Scraper -->|PutItem| RawDB[(DynamoDB: RawJobs)]
    
    RawDB -->|Stream/Trigger| Analyzer[Analyzer Lambda]
    Analyzer -->|Invoke Model| Bedrock[AWS Bedrock (Claude 3)]
    Bedrock -->|JSON Response| Analyzer
    Analyzer -->|PutItem| StructDB[(DynamoDB: StructuredJobs)]
    
    StructDB -->|Stream/Trigger| Scorer[Scoring Lambda]
    ProfileDB[(DynamoDB: UserProfile)] -->|Read Profile| Scorer
    Scorer -->|UpdateItem (Score)| StructDB
    
    EB2[Daily Email Schedule] -->|Triggers| Notify[Notification Lambda]
    Notify -->|Query > 70| StructDB
    Notify -->|SendEmail| SES[Amazon SES]
    SES -->|Deliver| UserEmail[User Email]
```

## Security Model

- **IAM Roles**: Each Lambda has a dedicated role with minimal permissions (e.g., Scraper can only `PutItem` to `RawJobs`).
- **Secret Management**: API keys (if needed) stored in Secrets Manager (planned for production).
- **VPC**: Can be configured to run within a VPC for enhanced network security.
