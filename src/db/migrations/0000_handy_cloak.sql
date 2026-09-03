CREATE TYPE "public"."user_role" AS ENUM('STUDENT', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."challenge_difficulty" AS ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');--> statement-breakpoint
CREATE TYPE "public"."challenge_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('QUEUED', 'RUNNING', 'TESTING', 'BENCHMARKING', 'COMPLETED', 'FAILED', 'TIMEOUT', 'ERROR');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"username" varchar(64) NOT NULL,
	"email" varchar(255),
	"email_verified" timestamp,
	"image" text,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'STUDENT' NOT NULL,
	"password_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"provider_account_id" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_token" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verification_tokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "challenge_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_version_id" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"language" varchar(32) NOT NULL,
	"content" text NOT NULL,
	"is_readonly" boolean DEFAULT false NOT NULL,
	"is_hidden" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"spec" jsonb NOT NULL,
	"levels" jsonb NOT NULL,
	"starter_templates" jsonb NOT NULL,
	"test_definitions" jsonb NOT NULL,
	"created_by" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"tagline" varchar(255),
	"description" text NOT NULL,
	"difficulty" "challenge_difficulty" DEFAULT 'INTERMEDIATE' NOT NULL,
	"status" "challenge_status" DEFAULT 'DRAFT' NOT NULL,
	"supported_languages" jsonb DEFAULT '["python","cpp"]'::jsonb NOT NULL,
	"current_version_number" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "challenges_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "submission_files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"filename" varchar(255) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "submission_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"correctness_passed" integer DEFAULT 0 NOT NULL,
	"correctness_total" integer DEFAULT 0 NOT NULL,
	"correctness_score" numeric(5, 4) DEFAULT '0.0000' NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"throughput_ops_sec" numeric(12, 2),
	"latency_p50_ms" numeric(10, 4),
	"latency_p95_ms" numeric(10, 4),
	"latency_p99_ms" numeric(10, 4),
	"memory_bytes" bigint,
	"cpu_time_ms" numeric(10, 2),
	"baseline_throughput" numeric(12, 2),
	"score" numeric(10, 4) DEFAULT '0.0000' NOT NULL,
	"improvement_pct" numeric(8, 4) DEFAULT '0.0000' NOT NULL,
	"is_invalidated" boolean DEFAULT false NOT NULL,
	"invalidated_by" uuid,
	"invalidated_at" timestamp,
	"invalidation_reason" text,
	"raw_metrics" jsonb,
	"test_output" text,
	"error_output" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "submission_results_submission_id_unique" UNIQUE("submission_id")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_id" uuid NOT NULL,
	"challenge_version_id" uuid NOT NULL,
	"language" varchar(32) NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"status" "submission_status" DEFAULT 'QUEUED' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"started_at" timestamp,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "benchmark_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_version_id" uuid NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"workloads" jsonb NOT NULL,
	"iterations" integer DEFAULT 5 NOT NULL,
	"warmup_iterations" integer DEFAULT 2 NOT NULL,
	"timeout_seconds" integer DEFAULT 60 NOT NULL,
	"cpu_limit" numeric(4, 2) DEFAULT '1.00' NOT NULL,
	"memory_limit_mb" integer DEFAULT 256 NOT NULL,
	"baseline_code" jsonb,
	"baseline_metrics" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "benchmark_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"benchmark_config_id" uuid NOT NULL,
	"status" text NOT NULL,
	"raw_metrics" jsonb NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "leaderboard_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"submission_id" uuid NOT NULL,
	"score" numeric(10, 4) NOT NULL,
	"throughput_ops_sec" numeric(12, 2) NOT NULL,
	"latency_p99_ms" numeric(10, 4),
	"memory_bytes" bigint,
	"rank" integer DEFAULT 0 NOT NULL,
	"is_verified" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_leaderboard_challenge_user" UNIQUE("challenge_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "user_challenge_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"challenge_id" uuid NOT NULL,
	"highest_level_unlocked" integer DEFAULT 1 NOT NULL,
	"best_score" numeric(10, 4) DEFAULT '0.0000' NOT NULL,
	"best_submission_id" uuid,
	"is_completed" boolean DEFAULT false NOT NULL,
	"submission_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uq_progress_user_challenge" UNIQUE("user_id","challenge_id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"action" varchar(64) NOT NULL,
	"resource" varchar(64) NOT NULL,
	"resource_id" uuid,
	"metadata" jsonb,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"event_type" varchar(64) NOT NULL,
	"challenge_id" uuid,
	"submission_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_files" ADD CONSTRAINT "challenge_files_challenge_version_id_challenge_versions_id_fk" FOREIGN KEY ("challenge_version_id") REFERENCES "public"."challenge_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_versions" ADD CONSTRAINT "challenge_versions_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_versions" ADD CONSTRAINT "challenge_versions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_files" ADD CONSTRAINT "submission_files_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_results" ADD CONSTRAINT "submission_results_invalidated_by_users_id_fk" FOREIGN KEY ("invalidated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challenge_version_id_challenge_versions_id_fk" FOREIGN KEY ("challenge_version_id") REFERENCES "public"."challenge_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "benchmark_configs" ADD CONSTRAINT "benchmark_configs_challenge_version_id_challenge_versions_id_fk" FOREIGN KEY ("challenge_version_id") REFERENCES "public"."challenge_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "benchmark_runs" ADD CONSTRAINT "benchmark_runs_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "benchmark_runs" ADD CONSTRAINT "benchmark_runs_benchmark_config_id_benchmark_configs_id_fk" FOREIGN KEY ("benchmark_config_id") REFERENCES "public"."benchmark_configs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leaderboard_entries" ADD CONSTRAINT "leaderboard_entries_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenge_progress" ADD CONSTRAINT "user_challenge_progress_best_submission_id_submissions_id_fk" FOREIGN KEY ("best_submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;