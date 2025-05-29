# HawkMage Architecture

This document outlines the planned architecture for the HawkMage application. It is based on the latest design goals and should be used as a reference for future development.

## 1. Overview

HawkMage is a serverless web application that allows users to generate `stackhawk.yml` configuration files via a form-driven UI. The YAML is synthesized using OpenAI and returned to the user for download. The primary goal is to streamline and standardize StackHawk scan configuration.

## 2. High-Level Architecture

```
[Client - React Frontend (Amplify)]
        |
        v
[API Gateway - REST Endpoint (Manually Configured)]
        |
        v
[AWS Lambda - YAML Generation Logic (Go)]
        |
        v
[OpenAI API - GPT-4 or Fine-Tuned Model]
        |
        v
[Response to Client - YAML Output Displayed + Downloaded]
```

## 3. Components

### 3.1 Frontend (React + Amplify)
- Deployed via AWS Amplify Hosting (static site)
- Dynamic form renders 40+ configuration fields
- Handles input validation, submission, and YAML output display
- Optional integration with Cognito for authentication (Phase 2+)

### 3.2 API Gateway
- Manually configured REST endpoint
- Integrated with Lambda using custom Terraform, CDK, or other IaC tooling

### 3.3 Lambda Function
- Implemented in **Go** for performance and reliability
- Source code managed in GitHub and deployed via GitHub Actions
- Receives structured form data, constructs an OpenAI prompt, and returns generated YAML
- Uses environment variables (e.g. `OPENAI_API_KEY`) for secrets

### 3.4 OpenAI Integration
- Utilizes GPT-4 API or a future fine-tuned model
- Prompt is built from form inputs
- API key stored securely in Lambda environment variables

## 4. Security Considerations

### 4.1 Authentication (Phase 2+)
- AWS Cognito will restrict access to the YAML generation endpoint
- Supports OAuth and federated logins when needed

### 4.2 Token Protection
- API Gateway enforces rate limiting and throttling
- Requests are logged to CloudWatch
- Future work may include per-user quotas

### 4.3 Data Handling
- No PII is stored or persisted
- Form data is transient and only used to generate YAML
- HTTPS enforced for all client and API interactions

### 4.4 Model Interaction
- Outbound requests to OpenAI only
- Optionally proxied through a VPC NAT Gateway
- Requests exclude customer-sensitive metadata

## 5. Observability
- CloudWatch logging on Lambda and API Gateway
- Error tracking and usage analytics under consideration
- Potential integration with Datadog or similar tools

## 6. Deployment & CI/CD
- Frontend deployed via Amplify Hosting with GitHub CI
- Backend (Go Lambda) deployed via GitHub Actions
- Infrastructure managed with Terraform or CDK
- Secrets stored in GitHub or AWS SSM

## 7. Future Enhancements
- Repository pull request automation (GitHub App)
- YAML validation service
- Hosting a fine-tuned OpenAI model in a dedicated environment

