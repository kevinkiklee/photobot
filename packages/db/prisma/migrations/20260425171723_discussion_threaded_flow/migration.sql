/*
  Warnings:

  - You are about to drop the `discussion_schedules` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "discussion_prompt_logs" ADD COLUMN     "discussions_message_id" TEXT,
ADD COLUMN     "last_announced_at" TIMESTAMP(3),
ADD COLUMN     "thread_id" TEXT;

-- DropTable
DROP TABLE "discussion_schedules";

-- CreateTable
CREATE TABLE "discussion_config" (
    "id" TEXT NOT NULL,
    "discussions_channel_id" TEXT NOT NULL,
    "lounge_channel_id" TEXT NOT NULL,
    "category_filter" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_updated_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discussion_config_pkey" PRIMARY KEY ("id")
);
