output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "s3_bucket_region" {
  description = "AWS region of the S3 bucket"
  value       = var.aws_region
}

output "website_url" {
  description = "S3 website endpoint URL (HTTPS)"
  value       = aws_s3_bucket_website_configuration.website.website_endpoint
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name (HTTPS)"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_url" {
  description = "CloudFront distribution URL with HTTPS"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}
