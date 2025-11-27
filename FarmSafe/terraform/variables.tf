variable "project_name" {
  type        = string
  description = "Human friendly name of the project used for tagging."
}

variable "environment" {
  type        = string
  description = "Deployment environment name (e.g., dev, staging, prod)."
  default     = "dev"
}

variable "aws_region" {
  type        = string
  description = "AWS region to deploy all resources."
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC."
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for the public subnets (must align with available AZs)."
}

variable "private_subnet_cidrs" {
  type        = list(string)
  description = "CIDR blocks for the private subnets (must align with available AZs)."
}

variable "allowed_ssh_cidr" {
  type        = string
  description = "CIDR allowed to SSH into the bastion host."
}

variable "key_name" {
  type        = string
  description = "Existing EC2 Key Pair name for SSH access."
}

variable "bastion_instance_type" {
  type        = string
  description = "Instance type for the bastion host."
  default     = "t3.micro"
}

variable "app_instance_type" {
  type        = string
  description = "Instance type for the private application server."
  default     = "t3.small"
}

variable "bastion_root_volume_size" {
  type        = number
  description = "Root volume size in GiB for the bastion host."
  default     = 20
}

variable "app_root_volume_size" {
  type        = number
  description = "Root volume size in GiB for the application server."
  default     = 40
}

variable "db_username" {
  type        = string
  description = "Master username for the RDS database."
}

variable "db_password" {
  type        = string
  description = "Master password for the RDS database."
  sensitive   = true
}

variable "db_name" {
  type        = string
  description = "Default database name."
  default     = "farmsafe"
}

variable "db_instance_class" {
  type        = string
  description = "RDS instance size."
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  type        = number
  description = "Storage size in GiB for RDS."
  default     = 20
}

variable "db_backup_retention" {
  type        = number
  description = "Number of days to retain automated backups."
  default     = 7
}

variable "db_multi_az" {
  type        = bool
  description = "Whether to enable Multi-AZ for RDS."
  default     = false
}

variable "db_engine_version" {
  type        = string
  description = "Engine version for RDS PostgreSQL."
  default     = "15.5"
}

variable "db_port" {
  type        = number
  description = "Port for the database listener."
  default     = 5432
}

variable "container_image_mutability" {
  type        = string
  description = "Image tag mutability setting for ECR (MUTABLE or IMMUTABLE)."
  default     = "IMMUTABLE"
}

variable "container_scan_on_push" {
  type        = bool
  description = "Enable image scanning on push for ECR."
  default     = true
}

variable "additional_tags" {
  type        = map(string)
  description = "Optional additional tags applied to all taggable resources."
  default     = {}
}

