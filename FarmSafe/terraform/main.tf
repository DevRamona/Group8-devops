locals {
  project_name = var.project_name
  environment  = var.environment

  tags = merge(
    {
      Project     = local.project_name
      Environment = local.environment
      ManagedBy   = "Terraform"
    },
    var.additional_tags,
  )
}

data "aws_availability_zones" "available" {
  state = "available"
}

