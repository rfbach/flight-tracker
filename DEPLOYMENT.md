# Flight Tracker - AWS S3 + CloudFront Deployment

This guide explains how to deploy the Flight Tracker application to AWS S3 with HTTPS support via CloudFront.

## Architecture Overview

```
┌──────────────────────────────────┐
│   End Users (HTTPS)              │
└────────────────┬─────────────────┘
                 │
        CloudFront Distribution
       (Global HTTPS CDN)
                 │
        AWS S3 Bucket
       (Static Website)
         - HTML, JS, CSS
         - SPA Routing (via error pages)
```

## Prerequisites

1. **AWS Account** - with permissions to create:
   - S3 buckets
   - S3 website hosting

2. **Tools Installation**:
   ```bash
   # AWS CLI
   # Download from: https://aws.amazon.com/cli/
   
   # Terraform
   # Download from: https://www.terraform.io/downloads
   
   # Verify installations
   aws --version
   terraform --version
   ```

3. **AWS Credentials** - Configure AWS CLI:
   ```bash
   aws configure
   # Enter your AWS Access Key ID
   # Enter your AWS Secret Access Key
   # Default region: us-east-1
   # Default output format: json
   ```

4. **Environment Variables** - Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API credentials:
   ```
   VITE_AIRLABS_API_KEY=your_actual_api_key_here
   ```
   
   **Important**: The `.env` file must be present before running the deployment script. The deployment script loads environment variables from `.env` at build time and injects them into your application code.

## Setup Instructions

### Step 1: Configure Terraform Variables

1. Copy the example configuration:
   ```bash
   cp terraform/terraform.tfvars.example terraform/terraform.tfvars
   ```

2. Edit `terraform/terraform.tfvars` with your values:
   ```hcl
   aws_region   = "us-east-1"
   project_name = "flight-tracker"
   environment  = "production"
   bucket_name  = "flight-tracker-prod-YOUR-UNIQUE-ID"  # MUST be globally unique!
   ```

   **Important**: The S3 bucket name must be globally unique across all AWS accounts!

### Step 2: Initialize and Plan Infrastructure

```bash
cd terraform
terraform init
terraform plan
```

Review the plan to see what resources will be created.

### Step 3: Deploy Using the Automated Script

Run the PowerShell deployment script:

```powershell
.\deploy.ps1
```

Select option `1` for full deployment, and the script will:
1. Build your Angular application
2. Initialize Terraform (if not done)
3. Plan infrastructure changes
4. Apply the Terraform configuration (creates S3 bucket and CloudFront distribution)
5. Upload build files to S3
6. Display the deployment summary with your CloudFront URL

**First deployment may take 5-15 minutes for CloudFront to fully activate globally.**

#### Manual Deployment (alternative):

```bash
# Build the app
npm run build

# Deploy infrastructure
cd terraform
terraform plan
terraform apply
cd ..

# Upload to S3
aws s3 sync dist/flight-tracker/browser s3://YOUR-BUCKET-NAME --delete
```

## Accessing Your Site

After deployment, your site is available at your CloudFront HTTPS endpoint:

```
https://d1234567890ab.cloudfront.net
```

Get the exact URL from the deployment script output or from Terraform:
```bash
cd terraform
terraform output cloudfront_url
```

## Updating Your Deployment

### Redeploy After Code Changes

Use the deployment script with upload-only mode (option 2):
```powershell
.\deploy.ps1
```

Select option `2` (Upload only) to:
1. Rebuild your Angular application
2. Upload new files to S3
3. CloudFront automatically serves the updated files

CloudFront caches files for 1 hour by default. To clear the cache immediately, use a CloudFront invalidation (see Monitoring and Management section).

### Modifying Infrastructure

If you need to change infrastructure:

1. Edit `terraform/terraform.tfvars`
2. Run `terraform plan` to preview changes
3. Run `terraform apply` to apply changes

## Monitoring and Management

### View Deployment Outputs

```bash
cd terraform
terraform output
```

Key outputs:
- `s3_bucket_name` - Your S3 bucket
- `cloudfront_url` - Your HTTPS CloudFront URL (use this to access your site)
- `cloudfront_domain_name` - CloudFront domain name
- `s3_bucket_arn` - S3 bucket ARN

### Check S3 Bucket Contents

```bash
aws s3 ls s3://YOUR-BUCKET-NAME --recursive
```

### View Bucket Properties

```bash
aws s3api get-bucket-website --bucket YOUR-BUCKET-NAME
```

## Troubleshooting

### "Bucket already exists" error
The S3 bucket name must be globally unique. Change the `bucket_name` in `terraform.tfvars`.

### Site shows old files after update
CloudFront caches files for 1 hour. You can:
1. Wait for the cache to expire (1 hour)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Use a CloudFront invalidation (AWS Console > CloudFront > select distribution > Invalidations > Create)

### SPA routing issues (404 on refresh)
CloudFront is configured with a custom error response that serves `index.html` for 404 errors, enabling SPA routing. This should work automatically.

### Site not accessible after deployment
CloudFront may still be deploying globally (can take 5-15 minutes). Check the AWS Console for the distribution status.

### 403 Forbidden errors
- Ensure the S3 bucket policy allows public access (created automatically)
- Check that public access block is disabled (created automatically)
- Verify CloudFront Origin Access Control is configured (created automatically)

## Costs

Typical monthly costs (varies by region and traffic):
- **S3 Storage**: ~$0.023 per GB (minimal for static files)
- **CloudFront Data Transfer**: ~$0.085 per GB (first 1GB free per month)
- **CloudFront Requests**: ~$0.0075 per 10,000 HTTP/HTTPS requests

For a small application with modest traffic, expect $1-3/month. CloudFront pricing varies by region, but provides global HTTPS delivery at low cost.

## Cleanup

To remove all AWS resources and avoid charges:

```bash
cd terraform

# View what will be destroyed
terraform plan -destroy

# Destroy all resources
terraform destroy

# Clean up local Terraform files
rm -rf .terraform terraform.tfstate* .terraform.lock.hcl
```

## Advanced Configuration

### Custom Domain with Route53

To use a custom domain, you can set up Route53:

1. Create a Route53 hosted zone for your domain
2. Point your domain registrar to Route53 nameservers
3. Create a CNAME record pointing to your S3 bucket
4. Use an SSL certificate from ACM

However, for the basic S3 setup, you can use the S3 website endpoint directly.

### S3 Access Logging

Add to `terraform/main.tf` to log all access:

```hcl
resource "aws_s3_bucket_logging" "website" {
  bucket = aws_s3_bucket.website.id

  target_bucket = aws_s3_bucket.logs.id
  target_prefix = "logs/"
}
```

### CORS Configuration

If your app needs CORS, add to `terraform/main.tf`:

```hcl
resource "aws_s3_bucket_cors_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}
```

## Support & Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [Angular Build Documentation](https://angular.io/guide/build)

---

**Last Updated**: June 2026
**Application**: Flight Tracker v1.0

