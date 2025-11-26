resource "aws_ecr_repository" "app" {
  name                 = lower("${local.project_name}-${local.environment}")
  image_tag_mutability = var.container_image_mutability

  image_scanning_configuration {
    scan_on_push = var.container_scan_on_push
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-ecr"
    },
  )
}

resource "aws_ecr_lifecycle_policy" "app" {
  repository = aws_ecr_repository.app.name

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

