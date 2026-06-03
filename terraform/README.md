# AWS Deployment Configuration

This directory contains Terraform configurations to deploy the Flight Tracker application to AWS with HTTPS support.

## Quick Start

1. **Install prerequisites** (if not already installed):
   - [AWS CLI](https://aws.amazon.com/cli/)
   - [Terraform](https://www.terraform.io/downloads)

2. **Configure AWS credentials**:
   ```bash
   aws configure
   ```

3. **Create your configuration** from the example:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

4. **Edit** `terraform.tfvars` with your values:
   - `bucket_name` - Must be globally unique (add a timestamp or ID)

5. **Deploy using one of these methods**:

   **Option A: PowerShell script (recommended)**
   ```powershell
   # From project root
   .\deploy.ps1
   ```

   **Option B: npm command**
   ```bash
   npm run deploy
   ```

   **Option C: Manual Terraform**
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

## What Gets Created

- **S3 Bucket** - Stores your static website files
- **Static Website Hosting** - Serves HTML/CSS/JS via HTTPS
- **Security** - Bucket is publicly readable for website access

## File Structure

- `main.tf` - S3 bucket and website configuration
- `variables.tf` - Input variables
- `outputs.tf` - Output values after deployment
- `versions.tf` - Provider version requirements
- `terraform.tfvars.example` - Template for your configuration
- `.gitignore` - Excludes sensitive files from version control

## Common Commands

```bash
# View current infrastructure
terraform show

# See what will change
terraform plan

# Apply changes
terraform apply

# View output values
terraform output

# Destroy all resources (careful!)
terraform destroy
```

## For More Details

See [DEPLOYMENT.md](../DEPLOYMENT.md) in the project root for:
- Architecture overview
- Troubleshooting guide
- Cost estimates
- Advanced configuration

## Support

- AWS Docs: https://docs.aws.amazon.com/
- Terraform Docs: https://www.terraform.io/docs
- Flight Tracker README: ../README.md
