resource "aws_dynamodb_table" "raw_jobs" {
  name             = "${var.project_name}-raw-jobs-${var.environment}"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "job_id"
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  attribute {
    name = "job_id"
    type = "S"
  }

  tags = {
    Name = "RawJobs"
  }
}

resource "aws_dynamodb_table" "structured_jobs" {
  name             = "${var.project_name}-structured-jobs-${var.environment}"
  billing_mode     = "PAY_PER_REQUEST"
  hash_key         = "job_id"
  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  attribute {
    name = "job_id"
    type = "S"
  }

  attribute {
    name = "fit_score"
    type = "N"
  }

  attribute {
    name = "analyzed_at"
    type = "S"
  }

  global_secondary_index {
    name               = "FitScoreIndex"
    hash_key           = "fit_score"
    range_key          = "analyzed_at"
    write_capacity     = 0
    read_capacity      = 0
    projection_type    = "ALL"
  }

  tags = {
    Name = "StructuredJobs"
  }
}

resource "aws_dynamodb_table" "user_profile" {
  name         = "${var.project_name}-user-profile-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }

  tags = {
    Name = "UserProfile"
  }
}
