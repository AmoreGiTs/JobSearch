resource "aws_lambda_function" "scraper" {
  filename      = "scraper.zip"
  function_name = "${var.project_name}-scraper-${var.environment}"
  role          = aws_iam_role.scraper_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.11"
  timeout       = 300
  memory_size   = 128

  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }

  environment {
    variables = {
      RAW_JOBS_TABLE = aws_dynamodb_table.raw_jobs.name
    }
  }

  depends_on = [aws_cloudwatch_log_group.scraper]

  tags = {
    Name = "JobScraper"
  }
}

resource "aws_lambda_function" "analyzer" {
  filename      = "analyzer.zip"
  function_name = "${var.project_name}-analyzer-${var.environment}"
  role          = aws_iam_role.analyzer_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.11"
  timeout       = 300
  memory_size   = 512

  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }

  environment {
    variables = {
      RAW_JOBS_TABLE        = aws_dynamodb_table.raw_jobs.name
      STRUCTURED_JOBS_TABLE = aws_dynamodb_table.structured_jobs.name
      BEDROCK_REGION        = var.aws_region
    }
  }

  depends_on = [aws_cloudwatch_log_group.analyzer]

  tags = {
    Name = "JobAnalyzer"
  }
}

resource "aws_lambda_function" "scoring" {
  filename      = "scoring.zip"
  function_name = "${var.project_name}-scoring-${var.environment}"
  role          = aws_iam_role.scoring_role.arn
  handler       = "lambda_function.lambda_handler"
  runtime       = "python3.11"
  timeout       = 60
  memory_size   = 128

  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }

  environment {
    variables = {
      STRUCTURED_JOBS_TABLE = aws_dynamodb_table.structured_jobs.name
      USER_PROFILE_TABLE    = aws_dynamodb_table.user_profile.name
    }
  }

  depends_on = [aws_cloudwatch_log_group.scoring]

  tags = {
    Name = "JobScoring"
  }
}

resource "aws_lambda_function" "notifications" {
  filename      = "notifications.zip"
  function_name = "${var.project_name}-notifications-${var.environment}"
  role          = aws_iam_role.notifications_role.arn
  handler       = "email_summary.lambda_handler"
  runtime       = "python3.11"
  timeout       = 60
  memory_size   = 128

  dead_letter_config {
    target_arn = aws_sqs_queue.lambda_dlq.arn
  }

  environment {
    variables = {
      STRUCTURED_JOBS_TABLE = aws_dynamodb_table.structured_jobs.name
      SENDER_EMAIL          = "verified@example.com"
      RECIPIENT_EMAIL       = "user@example.com"
    }
  }

  depends_on = [aws_cloudwatch_log_group.notifications]

  tags = {
    Name = "JobNotifications"
  }
}
