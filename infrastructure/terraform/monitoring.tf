# 1. Dead Letter Queue for Failed Lambda Executions
resource "aws_sqs_queue" "lambda_dlq" {
  name                      = "${var.project_name}-lambda-dlq-${var.environment}"
  message_retention_seconds = 1209600 # 14 days
}

# 2. CloudWatch Log Groups with Retention
resource "aws_cloudwatch_log_group" "scraper" {
  name              = "/aws/lambda/${aws_lambda_function.scraper.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "analyzer" {
  name              = "/aws/lambda/${aws_lambda_function.analyzer.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "scoring" {
  name              = "/aws/lambda/${aws_lambda_function.scoring.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "notifications" {
  name              = "/aws/lambda/${aws_lambda_function.notifications.function_name}"
  retention_in_days = 7
}

# 3. Custom Metric Namespace (Example)
# (In production, you'd add Metric Filters or use Powertools to publish metrics)
