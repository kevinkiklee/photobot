-- AlterTable
ALTER TABLE "discussion_prompt_logs" ADD COLUMN "prompt_channel_id" TEXT;

-- Backfill active rows so the mirror keeps working post-deploy.
-- Daily-cycle rows host the prompt in the configured lounge channel.
UPDATE "discussion_prompt_logs"
SET "prompt_channel_id" = (SELECT "lounge_channel_id" FROM "discussion_config" WHERE "id" = 'singleton')
WHERE "lounge_prompt_message_id" IS NOT NULL
  AND "mirror_ended_at" IS NULL
  AND "prompt_channel_id" IS NULL;
