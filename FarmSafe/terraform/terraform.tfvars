project_name = "farmsafe"
environment  = "dev"
aws_region   = "us-east-1"
vpc_cidr     = "10.0.0.0/16"
public_subnet_cidrs = [
  "10.0.1.0/24",
  "10.0.2.0/24",
]
private_subnet_cidrs = [
  "10.0.101.0/24",
  "10.0.102.0/24",
]
allowed_ssh_cidr           = "0.0.0.0/0"
key_name                   = "farmsafe-key-3"
bastion_instance_type      = "t3.micro"
app_instance_type          = "t3.small"
bastion_root_volume_size   = 30
app_root_volume_size       = 40
db_username                = "farmsafe_admin"
db_password                = "7ZznUA7J0xDevVJ0Ix8QqFjjPoaQ53SCC8ZUmicww8="
db_name                    = "farmsafe"
db_instance_class          = "db.t3.micro"
db_allocated_storage       = 20
db_backup_retention        = 1
db_multi_az                = false
db_engine_version          = "15.4"
db_port                    = 5432
container_image_mutability = "MUTABLE"
container_scan_on_push     = true
additional_tags = {
  Owner = "devops-team"
}

