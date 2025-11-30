# Temporarily commented out ECR resources to avoid recreation issues
# resource "aws_kms_key" "ecr" {
#   description             = "CMK for ECR images for ${local.project_name}"
#   deletion_window_in_days = 30
#   enable_key_rotation     = true

#   tags = local.tags
# }

# resource "aws_ecr_repository" "app" {
#   name                 = lower("${local.project_name}-${local.environment}")
#   image_tag_mutability = var.container_image_mutability
#   force_delete         = true

#   image_scanning_configuration {
#     scan_on_push = var.container_scan_on_push
#   }

#   encryption_configuration {
#     encryption_type = "KMS"
#     kms_key         = aws_kms_key.ecr.arn
#   }

#   tags = merge(
#     local.tags,
#     {
#       Name = "${local.project_name}-${local.environment}-ecr"
#     },
#   )
# }

# resource "aws_ecr_lifecycle_policy" "app" {
#   repository = aws_ecr_repository.app.name

#   policy = jsonencode({
#     rules = [
#       {
#         rulePriority = 1
#         description  = "Keep the last 15 images"
#         selection = {
#           tagStatus   = "any"
#           countType   = "imageCountMoreThan"
#           countNumber = 15
#         }
#         action = {
#           type = "expire"
#         }
#       }
#     ]
#   })
# }

