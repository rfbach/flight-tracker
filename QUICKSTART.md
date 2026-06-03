# AWS Deployment Quick Reference

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites
```bash
# Install AWS CLI
# https://aws.amazon.com/cli/

# Install Terraform
# https://www.terraform.io/downloads

# Verify
aws --version
terraform --version

# Configure AWS credentials
aws configure
```

### 2. Configure Your Deployment
```bash
# Copy example config
cp terraform/terraform.tfvars.example terraform/terraform.tfvars

# Edit with your values
code terraform/terraform.tfvars
```

**Required field in `terraform.tfvars`:**
- `bucket_name` - Must be globally unique (e.g., `flight-tracker-prod-20260603`)

### 3. Deploy
```bash
# Run automated deployment (builds + deploys)
npm run deploy
```

**Or manually:**
```bash
npm run build
cd terraform
terraform init
terraform plan
terraform apply
```

**Or using PowerShell directly:**
```powershell
.\deploy.ps1
```

## 📋 What Gets Deployed

| Resource | Purpose | Cost |
|----------|---------|------|
| **S3 Bucket** | Stores static website files | ~$0.02/month |
| **Website Hosting** | Serves HTML/CSS/JS files via HTTPS | Included in S3 |

## 🌐 Access Your Site

After deployment completes:

```
https://flight-tracker-prod-12345.s3.us-east-1.amazonaws.com
```

Get the exact URL:
```bash
cd terraform
terraform output website_url
```

## 📤 Update Your Site

After code changes:
```bash
npm run deploy
```

The script will:
- Rebuild your app
- Upload new files to S3

## 🗑️ Remove Everything

To delete all AWS resources:
```bash
cd terraform
terraform destroy
# Confirm by typing: yes
```

## 🔍 View Configuration

```bash
# See all outputs
cd terraform
terraform output

# See specific value
terraform output website_url
terraform output s3_bucket_name
```

## 🆘 Common Issues

### "Bucket already exists"
→ Change `bucket_name` in `terraform.tfvars` to something unique

### 404 errors on page refresh (SPA routing)
→ Configuration includes automatic fix - should work automatically

## 📚 Full Documentation

See `DEPLOYMENT.md` for:
- Detailed setup instructions
- Advanced configuration
- Monitoring and troubleshooting
- Cost breakdown

## 📁 Files Added

```
terraform/
├── main.tf                    # AWS resources configuration
├── variables.tf               # Input variables
├── outputs.tf                 # Output values
├── versions.tf                # Terraform version requirements
├── terraform.tfvars.example   # Configuration template
├── README.md                  # Terraform-specific docs
└── .gitignore                 # Ignore state files

deploy.ps1                      # PowerShell deployment script
DEPLOYMENT.md                   # Complete deployment guide
```

## npm Scripts Available

```bash
npm run build              # Build your Angular app
npm run deploy             # Full deployment (build + AWS)
npm run terraform:init     # Initialize Terraform
npm run terraform:plan     # Preview infrastructure changes
npm run terraform:apply    # Apply infrastructure changes
npm run terraform:destroy  # Delete all AWS resources
```

---

**Need Help?** See DEPLOYMENT.md for complete documentation.

