# Common Assume Role Policy
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# 1. Scraper Role & Policy
resource "aws_iam_role" "scraper_role" {
  name               = "${var.project_name}-scraper-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "scraper_policy" {
  name = "${var.project_name}-scraper-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["dynamodb:PutItem"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.raw_jobs.arn]
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "scraper_attach" {
  role       = aws_iam_role.scraper_role.name
  policy_arn = aws_iam_policy.scraper_policy.arn
}

# 2. Analyzer Role & Policy
resource "aws_iam_role" "analyzer_role" {
  name               = "${var.project_name}-analyzer-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "analyzer_policy" {
  name = "${var.project_name}-analyzer-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["dynamodb:GetItem", "dynamodb:DescribeStream", "dynamodb:GetRecords", "dynamodb:GetShardIterator", "dynamodb:ListStreams"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.raw_jobs.arn, "${aws_dynamodb_table.raw_jobs.arn}/stream/*"]
      },
      {
        Action   = ["dynamodb:PutItem"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.structured_jobs.arn]
      },
      {
        Action   = ["bedrock:InvokeModel"]
        Effect   = "Allow"
        Resource = "arn:aws:bedrock:${var.aws_region}::foundation-model/anthropic.claude-3-haiku-20240307-v1:0"
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "analyzer_attach" {
  role       = aws_iam_role.analyzer_role.name
  policy_arn = aws_iam_policy.analyzer_policy.arn
}

# 3. Scoring Role & Policy
resource "aws_iam_role" "scoring_role" {
  name               = "${var.project_name}-scoring-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "scoring_policy" {
  name = "${var.project_name}-scoring-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["dynamodb:GetItem", "dynamodb:DescribeStream", "dynamodb:GetRecords", "dynamodb:GetShardIterator", "dynamodb:ListStreams"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.structured_jobs.arn, "${aws_dynamodb_table.structured_jobs.arn}/stream/*"]
      },
      {
        Action   = ["dynamodb:GetItem"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.user_profile.arn]
      },
      {
        Action   = ["dynamodb:UpdateItem"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.structured_jobs.arn]
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "scoring_attach" {
  role       = aws_iam_role.scoring_role.name
  policy_arn = aws_iam_policy.scoring_policy.arn
}

# 4. Notifications Role & Policy
resource "aws_iam_role" "notifications_role" {
  name               = "${var.project_name}-notifications-role-${var.environment}"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}

resource "aws_iam_policy" "notifications_policy" {
  name = "${var.project_name}-notifications-policy-${var.environment}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["dynamodb:Query", "dynamodb:Scan"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.structured_jobs.arn, "${aws_dynamodb_table.structured_jobs.arn}/index/*"]
      },
      {
        Action   = ["ses:SendEmail", "ses:SendRawEmail"]
        Effect   = "Allow"
        Resource = "*" # Scoping to specific identities is recommended in prod
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Effect   = "Allow"
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "notifications_attach" {
  role       = aws_iam_role.notifications_role.name
  policy_arn = aws_iam_policy.notifications_policy.arn
}

# 5. n8n Dedicated User (Outside AWS Integration)
resource "aws_iam_user" "n8n_user" {
  name = "${var.project_name}-n8n-user-${var.environment}"
  tags = {
    Name = "n8nServiceUser"
  }
}

resource "aws_iam_access_key" "n8n_key" {
  user = aws_iam_user.n8n_user.name
}

resource "aws_iam_user_policy" "n8n_policy" {
  name = "${var.project_name}-n8n-policy-${var.environment}"
  user = aws_iam_user.n8n_user.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = ["dynamodb:PutItem"]
        Effect   = "Allow"
        Resource = [aws_dynamodb_table.raw_jobs.arn]
      }
    ]
  })
}

output "n8n_access_key_id" {
  value = aws_iam_access_key.n8n_key.id
}

output "n8n_secret_access_key" {
  value     = aws_iam_access_key.n8n_key.secret
  sensitive = true
}
