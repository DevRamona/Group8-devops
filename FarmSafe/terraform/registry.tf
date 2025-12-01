resource "aws_kms_key" "ecr" {
  description             = "CMK for ECR images for ${local.project_name}"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = local.tags
}

data "aws_ecr_repository" "app" {
  name = "farmsafe-dev"
}

resource "aws_ecr_lifecycle_policy" "app" {
  repository = data.aws_ecr_repository.app.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep the last 15 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 15
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}

