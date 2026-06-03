# Flight Tracker - AWS S3 Deployment

This guide explains how to deploy the Flight Tracker application to AWS S3 with HTTPS support.

## Architecture Overview

```
┌──────────────────────────────────┐
│   End Users (HTTPS)              │
└────────────────┬─────────────────┘
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
   
   **Important**: The `.env` file must be present before running the deployment script. Vite injects environment variables at build time, so they must be configured during the build process.

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

Or use npm:
```bash
npm run deploy
```

The script will:
1. Build your Angular application
2. Initialize Terraform (if not done)
3. Plan infrastructure changes
4. Apply the Terraform configuration
5. Upload build files to S3
6. Display the deployment summary

#### Manual Deployment (alternative):

```bash
# Build the app
npm run build

# Deploy infrastructure
cd terraform
terraform apply
cd ..

# Upload to S3
aws s3 sync dist/flight-tracker/browser s3://YOUR-BUCKET-NAME --delete
```

## Accessing Your Site

After deployment, your site is available at the S3 website endpoint:

```
https://flight-tracker-prod-12345.s3.us-east-1.amazonaws.com
```

Or get the exact URL from Terraform:
```bash
cd terraform
terraform output website_url
```

## Updating Your Deployment

### Redeploy After Code Changes

```bash
# Update your code
# Then:

npm run build
aws s3 sync dist/flight-tracker/browser s3://YOUR-BUCKET-NAME --delete
```

Or use the deployment script again:
```powershell
.\deploy.ps1
```

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
- `website_url` - Your website URL
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

### 403 Forbidden errors
- Ensure the bucket policy allows public access (created automatically)
- Check that public access block is disabled (created automatically)
- Verify the object permissions allow public read

### SPA routing issues (404 on refresh)
The S3 configuration includes an error document that serves `index.html` for 404 errors, enabling SPA routing. This should work automatically.

### Files not updating
Clear your browser cache or use a private/incognito window to force a fresh download.

## Costs

Typical monthly costs (varies by region and traffic):
- **S3 Storage**: ~$0.023 per GB (minimal for static files)
- **S3 Data Transfer**: ~$0.09 per GB (first 1GB free per month)

For a small application with modest traffic, expect $1-2/month.

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

