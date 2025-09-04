# AWS Deployment Guide

## Infrastructure Requirements

- S3 bucket configured for static website hosting
- CloudFront distribution pointing to S3 bucket
- IAM user with S3 and CloudFront permissions
- Slack workspace for deployment notifications

## GitHub Repository Configuration

### Required Secrets

Configure these secrets in GitHub repository settings for each environment:

| Secret Name | Purpose |
|-------------|---------|
| ENV_{ENV} | Application environment variables |
| AWS_ACCESS_KEY_ID_{ENV} | AWS access key |
| AWS_SECRET_ACCESS_KEY_{ENV} | AWS secret key |
| AWS_S3_BUCKET_REGION_{ENV} | AWS region |
| AWS_S3_BUCKET_{ENV} | Target S3 bucket |
| CLOUDFRONT_DISTRIBUTION_ID_{ENV} | CloudFront ID |
| SLACK_WEBHOOK_URL | Slack notifications |

Note: Replace {ENV} with environment name (e.g., DEV, PILOT, PROD)

## Deployment Pipeline

The workflow performs these steps:
1. Builds React application using Node.js 20.17.0
2. Uploads build artifacts to S3
3. Invalidates CloudFront cache
4. Sends deployment status to Slack

### Pipeline Configuration

1. Create workflow file in `.github/workflows/`
2. Configure branch triggers as needed
3. Ensure AWS CLI is available in pipeline
4. Set up Slack notifications

Example workflow file structure provided in `.github/workflows/uba-depwd-pilot-provider-ui.yaml`

## Required AWS Permissions

IAM policy requirements:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:ListBucket",
                "s3:DeleteObject",
                "cloudfront:CreateInvalidation"
            ],
            "Resource": [
                "arn:aws:s3:::{bucket-name}/*",
                "arn:aws:s3:::{bucket-name}",
                "arn:aws:cloudfront::{account-id}:distribution/{distribution-id}"
            ]
        }
    ]
}
```

## Monitoring

- Check GitHub Actions for build/deployment status
- Monitor CloudFront distribution metrics
- Configure Slack channel for deployment notifications