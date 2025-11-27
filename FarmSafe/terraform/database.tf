resource "aws_db_subnet_group" "main" {
  name       = "${local.project_name}-${local.environment}-db-subnets"
  subnet_ids = [for subnet in aws_subnet.private : subnet.id]

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-db-subnets"
    },
  )
}

resource "aws_security_group" "db" {
  name        = "${local.project_name}-${local.environment}-db-sg"
  description = "Allow DB access from application instances"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "DB access from application SG"
    from_port       = var.db_port
    to_port         = var.db_port
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
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
      Name = "${local.project_name}-${local.environment}-db-sg"
    },
  )
}

resource "aws_db_instance" "main" {
  identifier                          = "${local.project_name}-${local.environment}-db"
  engine                              = "postgres"
  instance_class                      = var.db_instance_class
  username                            = var.db_username
  password                            = var.db_password
  db_name                             = var.db_name
  port                                = var.db_port
  allocated_storage                   = var.db_allocated_storage
  max_allocated_storage               = var.db_allocated_storage * 2
  multi_az                            = var.db_multi_az
  storage_encrypted                   = true
  publicly_accessible                 = false
  skip_final_snapshot                 = true
  deletion_protection                 = true
  backup_retention_period             = var.db_backup_retention
  auto_minor_version_upgrade          = true
  iam_database_authentication_enabled = true
  performance_insights_enabled        = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-db"
    },
  )
}