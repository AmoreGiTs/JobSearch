variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "ai-job-agent"
}

variable "environment" {
  description = "Development environment"
  type        = string
  default     = "dev"
}
