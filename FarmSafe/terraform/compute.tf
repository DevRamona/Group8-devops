data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name    = "name"
    values  = ["al2023-ami-*-x86_64"]
  }

  filter {
    name    = "architecture"
    values  = ["x86_64"]
  }
}

resource "aws_security_group" "bastion" {
  name        = "${local.project_name}-${local.environment}-bastion-sg"
  description = "Allow SSH and HTTP(S) access to bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from allowed CIDR"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr] # Use variable for security
  }

  # tfsec:ignore:aws-ec2-no-public-ingress-sgr
  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    # FIX: Restricting HTTP to your IP (102.22.143.250/32) or remove this block entirely.
    cidr_blocks = ["102.22.143.250/32"] 
  }

  # tfsec:ignore:aws-ec2-no-public-ingress-sgr
  ingress {
    description = "HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    # FIX: Restricting HTTPS to your IP (102.22.143.250/32) 
    # NOTE: It's best practice to REMOVE this block if the Bastion is NOT a web server.
    cidr_blocks = ["102.22.143.250/32"]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    # FIX: Bastion needs to talk OUT to the internet (0.0.0.0/0) for updates and services.
    cidr_blocks = ["0.0.0.0/0"] 
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
    description = "HTTP from VPC"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description = "HTTPS from VPC"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [aws_vpc.main.cidr_block]
  }

  ingress {
    description     = "Backend API from bastion"
    from_port       = 5000
    to_port         = 5000
    protocol        = "tcp"
    security_groups = [aws_security_group.bastion.id]
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    # FIX: Application needs to talk OUT to the internet (0.0.0.0/0) for ECR, S3, etc.
    cidr_blocks = ["0.0.0.0/0"] 
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app-sg"
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
  name                = "${local.project_name}-${local.environment}-app-instance-role"
  assume_role_policy  = data.aws_iam_policy_document.app_instance_assume.json

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app-instance-role"
    },
  )
}

// Policy to allow ECR access
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
      aws_ecr_repository.app.arn
    ]
  }
}

resource "aws_iam_role_policy" "app_instance_ecr" {
  name    = "${local.project_name}-${local.environment}-app-instance-ecr-policy"
  role    = aws_iam_role.app_instance.id
  policy  = data.aws_iam_policy_document.app_instance_ecr.json
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
  subnet_id                   = aws_subnet.private["0"].id
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.app_instance.name

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