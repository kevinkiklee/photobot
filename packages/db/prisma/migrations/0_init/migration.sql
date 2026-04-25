-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TargetType" AS ENUM ('SERVER', 'ROLE', 'CHANNEL');

-- CreateEnum
CREATE TYPE "VoteDirection" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "TagSuggestionAction" AS ENUM ('ADD', 'REMOVE');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "feature_configs" (
    "id" TEXT NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "feature_key" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "config_audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "target_type" "TargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "feature_key" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "config_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_schedules" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "category_filter" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussion_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discussion_prompt_logs" (
    "id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "prompt_text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "posted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussion_prompt_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "original_category" TEXT NOT NULL,
    "submitted_by" TEXT,
    "submitted_by_username" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_tags" (
    "id" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "prompt_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_votes" (
    "id" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "discord_username" TEXT NOT NULL,
    "vote" "VoteDirection" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_duplicate_flags" (
    "id" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_duplicate_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_tag_suggestions" (
    "id" TEXT NOT NULL,
    "prompt_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "action" "TagSuggestionAction" NOT NULL,
    "discord_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_tag_suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "feature_configs_feature_key_idx" ON "feature_configs"("feature_key");

-- CreateIndex
CREATE UNIQUE INDEX "feature_configs_target_type_target_id_feature_key_key" ON "feature_configs"("target_type", "target_id", "feature_key");

-- CreateIndex
CREATE INDEX "config_audit_logs_created_at_idx" ON "config_audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "discussion_schedules_channel_id_key" ON "discussion_schedules"("channel_id");

-- CreateIndex
CREATE INDEX "discussion_prompt_logs_posted_at_idx" ON "discussion_prompt_logs"("posted_at");

-- CreateIndex
CREATE INDEX "discussion_prompt_logs_channel_id_idx" ON "discussion_prompt_logs"("channel_id");

-- CreateIndex
CREATE INDEX "prompt_tags_tag_idx" ON "prompt_tags"("tag");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_tags_prompt_id_tag_key" ON "prompt_tags"("prompt_id", "tag");

-- CreateIndex
CREATE INDEX "prompt_votes_discord_user_id_idx" ON "prompt_votes"("discord_user_id");

-- CreateIndex
CREATE INDEX "prompt_votes_prompt_id_idx" ON "prompt_votes"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_votes_prompt_id_discord_user_id_key" ON "prompt_votes"("prompt_id", "discord_user_id");

-- CreateIndex
CREATE INDEX "prompt_duplicate_flags_prompt_id_idx" ON "prompt_duplicate_flags"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_duplicate_flags_prompt_id_discord_user_id_key" ON "prompt_duplicate_flags"("prompt_id", "discord_user_id");

-- CreateIndex
CREATE INDEX "prompt_tag_suggestions_prompt_id_tag_idx" ON "prompt_tag_suggestions"("prompt_id", "tag");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_tag_suggestions_prompt_id_tag_discord_user_id_key" ON "prompt_tag_suggestions"("prompt_id", "tag", "discord_user_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_tags" ADD CONSTRAINT "prompt_tags_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_votes" ADD CONSTRAINT "prompt_votes_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_duplicate_flags" ADD CONSTRAINT "prompt_duplicate_flags_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_tag_suggestions" ADD CONSTRAINT "prompt_tag_suggestions_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

