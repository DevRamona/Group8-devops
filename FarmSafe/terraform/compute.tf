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
  description = "Allow SSH access to bastion host"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH from trusted CIDR"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
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

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
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

  root_block_device {
    volume_size = var.bastion_root_volume_size
    volume_type = "gp3"
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

resource "aws_instance" "app" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = var.app_instance_type
  subnet_id                   = aws_subnet.private["0"].id
  key_name                    = var.key_name
  vpc_security_group_ids      = [aws_security_group.app.id]
  associate_public_ip_address = false

  root_block_device {
    volume_size = var.app_root_volume_size
    volume_type = "gp3"
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-app"
      Role = "application"
    },
  )
}

