data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }
}

resource "aws_security_group" "bastion" {
  name        = "${local.project_name}-${local.environment}-bastion-sg"
  description = "Allow SSH and HTTP access to bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from allowed CIDR"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow egress within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-bastion-sg"
    },
  )
}

resource "aws_security_group" "app" {
  name        = "${local.project_name}-${local.environment}-app-sg"
  description = "Allow SSH and HTTP(S) from private network"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "SSH from bastion"
    from_port       = 22
    to_port         = 22
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  ingress {
    description     = "HTTP from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  ingress {
    description = "HTTP from anywhere (temporary for testing)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description     = "HTTPS from ALB"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    description = "Allow egress within VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app-sg"
    },
  )
}

resource "aws_security_group" "alb" {
  name        = "${local.project_name}-${local.environment}-alb-sg"
  description = "Allow HTTP and HTTPS access to ALB"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "HTTP from anywhere"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from anywhere"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow egress to VPC"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = [var.vpc_cidr]
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-alb-sg"
    },
  )
}

resource "aws_instance" "bastion" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.bastion_instance_type
  subnet_id                   = aws_subnet.public["0"].id
  associate_public_ip_address = true
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.bastion.id]

  user_data = base64encode(templatefile("${path.module}/../ansible/user-data.sh", {
    aws_region      = var.aws_region
    docker_registry = data.aws_ecr_repository.app.repository_url
    docker_image    = "${data.aws_ecr_repository.app.repository_url}:latest"
  }))

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    volume_size = var.bastion_root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-bastion"
      Role = "bastion"
    },
  )
}

resource "aws_eip" "bastion" {
  instance = aws_instance.bastion.id
  domain   = "vpc"

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-bastion-eip"
    },
  )
}

// IAM role for app instance to access ECR
data "aws_iam_policy_document" "app_instance_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "app_instance" {
  name               = "${local.project_name}-${local.environment}-app-instance-role"
  assume_role_policy = data.aws_iam_policy_document.app_instance_assume.json

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app-instance-role"
    },
  )
}

data "aws_iam_policy_document" "app_instance_ecr" {
  // GetAuthorizationToken must use "*" resource - this is an AWS requirement
  # tfsec:ignore:aws-iam-no-policy-wildcards
  statement {
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = ["*"]
  }

  // Repository-specific actions scoped to our ECR repository
  statement {
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage"
    ]
    resources = [
      data.aws_ecr_repository.app.arn
    ]
  }
}

resource "aws_iam_role_policy" "app_instance_ecr" {
  name   = "${local.project_name}-${local.environment}-app-instance-ecr-policy"
  role   = aws_iam_role.app_instance.id
  policy = data.aws_iam_policy_document.app_instance_ecr.json
}

resource "aws_iam_instance_profile" "app_instance" {
  name = "${local.project_name}-${local.environment}-app-instance-profile"
  role = aws_iam_role.app_instance.name

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app-instance-profile"
    },
  )
}

resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.app_instance_type
  subnet_id                   = aws_subnet.public["0"].id  # Temporarily public for testing
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = true  # Temporarily public for testing
  iam_instance_profile        = aws_iam_instance_profile.app_instance.name

  user_data = base64encode(templatefile("${path.module}/../ansible/user-data.sh", {
    aws_region      = var.aws_region
    docker_registry = data.aws_ecr_repository.app.repository_url
    docker_image    = "${data.aws_ecr_repository.app.repository_url}:latest"
  }))

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  root_block_device {
    volume_size = var.app_root_volume_size
    volume_type = "gp3"
    encrypted   = true
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app"
      Role = "application"
    },
  )
}

resource "aws_lb_target_group" "app" {
  name        = "${local.project_name}-${local.environment}-app-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "instance"

  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app-tg"
    },
  )
}

resource "aws_lb_target_group_attachment" "app" {
  target_group_arn = aws_lb_target_group.app.arn
  target_id        = aws_instance.app.id
  port             = 80
}

resource "aws_lb" "app" {
  name               = "${local.project_name}-${local.environment}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = [for subnet in aws_subnet.public : subnet.id]

  enable_deletion_protection = false

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-alb"
    },
  )
}

resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

