# 1. Scraper Trigger: Daily at 8 AM
resource "aws_cloudwatch_event_rule" "daily_scraper" {
  name                = "${var.project_name}-scraper-trigger-${var.environment}"
  description         = "Triggers the Job Scraper daily at 8 AM UTC"
  schedule_expression = "cron(0 8 * * ? *)"
}

resource "aws_cloudwatch_event_target" "scraper_target" {
  rule      = aws_cloudwatch_event_rule.daily_scraper.name
  target_id = "TriggerScraper"
  arn       = aws_lambda_function.scraper.arn
}

resource "aws_lambda_permission" "allow_eventbridge_scraper" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.scraper.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_scraper.arn
}

# 2. Analyzer Trigger: DynamoDB Stream from RawJobs
resource "aws_lambda_event_source_mapping" "analyzer_trigger" {
  event_source_arn  = aws_dynamodb_table.raw_jobs.stream_arn
  function_name     = aws_lambda_function.analyzer.arn
  starting_position = "LATEST"
  batch_size        = 10 # Process up to 10 jobs at once
}

# 3. Scoring Trigger: DynamoDB Stream from StructuredJobs
resource "aws_lambda_event_source_mapping" "scoring_trigger" {
  event_source_arn  = aws_dynamodb_table.structured_jobs.stream_arn
  function_name     = aws_lambda_function.scoring.arn
  starting_position = "LATEST"
  batch_size        = 1
}

# 4. Notifications Trigger: Daily at 9 AM (after processing)
resource "aws_cloudwatch_event_rule" "daily_notifications" {
  name                = "${var.project_name}-notifications-trigger-${var.environment}"
  description         = "Triggers the Daily Email Digest at 9 AM UTC"
  schedule_expression = "cron(0 9 * * ? *)"
}

resource "aws_cloudwatch_event_target" "notifications_target" {
  rule      = aws_cloudwatch_event_rule.daily_notifications.name
  target_id = "TriggerNotifications"
  arn       = aws_lambda_function.notifications.arn
}

resource "aws_lambda_permission" "allow_eventbridge_notifications" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.notifications.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.daily_notifications.arn
}
