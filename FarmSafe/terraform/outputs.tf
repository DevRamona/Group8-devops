output "vpc_id" {
  description = "ID of the created VPC."
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets."
  value       = [for subnet in aws_subnet.public : subnet.id]
}

output "private_subnet_ids" {
  description = "IDs of the private subnets."
  value       = [for subnet in aws_subnet.private : subnet.id]
}

output "bastion_public_ip" {
  description = "Public IP of the bastion host."
  value       = aws_eip.bastion.public_ip
}

output "app_private_ip" {
  description = "Private IP of the application instance."
  value       = aws_instance.app.private_ip
}

output "db_endpoint" {
  description = "DNS endpoint of the RDS instance."
  value       = aws_db_instance.main.address
}

# Temporarily commented out ECR output
# output "ecr_repository_url" {
#   description = "URL of the ECR repository."
#   value       = aws_ecr_repository.app.repository_url
# }

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer."
  value       = aws_lb.app.dns_name
}


output "app_public_ip" {
  description = "Public IP of the application instance."
  value       = aws_instance.app.public_ip
}
