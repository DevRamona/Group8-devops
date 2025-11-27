resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-vpc"
    },
  )
}

resource "aws_cloudwatch_log_group" "vpc_flow" {
  name              = "/aws/vpc/${local.project_name}-${local.environment}"
  retention_in_days = 30
  kms_key_id        = aws_kms_key.observability.arn

  tags = local.tags
}

data "aws_iam_policy_document" "vpc_flow_assume" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["vpc-flow-logs.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "vpc_flow" {
  name               = "${local.project_name}-${local.environment}-vpc-flow-role"
  assume_role_policy = data.aws_iam_policy_document.vpc_flow_assume.json
}

data "aws_iam_policy_document" "vpc_flow_permissions" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents",
      "logs:DescribeLogGroups",
      "logs:DescribeLogStreams"
    ]
    resources = [
      aws_cloudwatch_log_group.vpc_flow.arn,
      "${aws_cloudwatch_log_group.vpc_flow.arn}:log-stream:*"
    ]
  }
}

resource "aws_iam_role_policy" "vpc_flow" {
  name   = "${local.project_name}-${local.environment}-vpc-flow-policy"
  role   = aws_iam_role.vpc_flow.id
  policy = data.aws_iam_policy_document.vpc_flow_permissions.json
}

resource "aws_flow_log" "vpc" {
  log_destination      = aws_cloudwatch_log_group.vpc_flow.arn
  iam_role_arn         = aws_iam_role.vpc_flow.arn
  traffic_type         = "ALL"
  vpc_id               = aws_vpc.main.id
  log_destination_type = "cloud-watch-logs"
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-igw"
    },
  )
}

resource "aws_subnet" "public" {
  for_each = {
    for idx, cidr in var.public_subnet_cidrs :
    idx => cidr
  }

  vpc_id                  = aws_vpc.main.id
  cidr_block              = each.value
  map_public_ip_on_launch = true
  availability_zone       = data.aws_availability_zones.available.names[tonumber(each.key) % length(data.aws_availability_zones.available.names)]

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-public-${tonumber(each.key) + 1}"
      Tier = "public"
    },
  )
}

resource "aws_subnet" "private" {
  for_each = {
    for idx, cidr in var.private_subnet_cidrs :
    idx => cidr
  }

  vpc_id            = aws_vpc.main.id
  cidr_block        = each.value
  availability_zone = data.aws_availability_zones.available.names[tonumber(each.key) % length(data.aws_availability_zones.available.names)]

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-private-${tonumber(each.key) + 1}"
      Tier = "private"
    },
  )
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-nat-eip"
    },
  )
}

resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public["0"].id

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-nat"
    },
  )

  depends_on = [aws_internet_gateway.main]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-public-rt"
    },
  )
}

resource "aws_route_table_association" "public" {
  for_each = aws_subnet.public

  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = merge(
    local.tags,
    {
      Name = "${local.project_name}-${local.environment}-private-rt"
    },
  )
}

resource "aws_route_table_association" "private" {
  for_each = aws_subnet.private

  subnet_id      = each.value.id
  route_table_id = aws_route_table.private.id
}

