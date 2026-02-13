# Backend-Frontend Integration Guide

This document outlines the communication protocols, data structures, and lifecycle events that coordinate the serverless backend (AWS) with the high-fidelity frontend (Next.js).

## 🛰️ API Communication

The frontend interacts with the backend via Amazon API Gateway, which triggers Lambda functions for data processing.

### 1. Unified Job Interface
All job-related data follows a strict TypeScript interface to ensure consistency between the LLM extraction (Analyzer) and the UI render (Frontend).

```typescript
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description: string;
  skills: string[];
  posted_at: string;
  fit_score?: number;
  status: 'new' | 'applied' | 'interviewing' | 'rejected' | 'offer';
  lat?: number;
  lng?: number;
}
```

### 2. Mock API Layer (`lib/api.ts`)
During development or in scenarios without a live AWS connection, the frontend utilizes a robust mock API that simulates network latency and complex search/filter operations.

**Key Endpoints Simulated:**
- `getJobs()`: Fetches all active postings.
- `getUserProfile()`: Retrieves user preferences and scoring metadata.
- `updateUserSettings()`: Persists notification and appearance toggles.

## 🔄 Data Lifecycle

1. **Extraction (Backend)**: Analyzer Lambda parses raw text -> Structured Job JSON.
2. **Synchronization (n8n)**: 
   - `job_scraper.json`: Orchestrates third-party scraping into DynamoDB.
   - `match_notification.json`: Triggers SES alerts for high-fit roles (≥ 85%).
3. **Scoring (Backend)**: Scoring engine calculates `fit_score` based on the `UserProfile` stored in DynamoDB.
4. **Visualization (Frontend)**: Next.js fetches jobs and provides a **Direct Apply** path for high-fit roles to maintain speed and performance.
5. **Geospatial Sync**: Coordinates (`lat`, `lng`) are injected during analysis for the **Job Intelligence Map**.

## 🛡️ Security Protocol

### Authentication
- **Current**: Simulating user session tokens in local storage.
- **Production Roadmap**: Integration with **Amazon Cognito** for JWT-based auth and OIDC providers.

### Input Sanitization
The frontend implements basic sanitization for search queries and profile updates (see `lib/api.ts`). **IMPORTANT**: While the frontend handles initial filtering, the backend must implement rigorous sanitization and validation (e.g., using Pydantic or Mangum) before persisting data to DynamoDB.

### IAM Bridging
Lambdas operate under the **Principle of Least Privilege**. The IAM roles used by the API Gateway are restricted to `BatchGetItem` and `PutItem` on specific DynamoDB tables.

## 🗺️ Intelligence Map Coordination

The **Job Intelligence Map** uses **Mapbox GL**. Coordinates are derived from the `location` string using a geocoding service (simulated in MVP) before being stored in the `Job` record.

---

*Last Updated: February 2026*
