-- AlterTable
ALTER TABLE "discussion_prompt_logs" ADD COLUMN     "mirror_ended_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "mirrored_messages" (
    "lounge_message_id" TEXT NOT NULL,
    "thread_message_id" TEXT NOT NULL,
    "prompt_log_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "author_display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mirrored_messages_pkey" PRIMARY KEY ("lounge_message_id")
);

-- CreateIndex
CREATE INDEX "mirrored_messages_prompt_log_id_idx" ON "mirrored_messages"("prompt_log_id");

-- AddForeignKey
ALTER TABLE "mirrored_messages" ADD CONSTRAINT "mirrored_messages_prompt_log_id_fkey" FOREIGN KEY ("prompt_log_id") REFERENCES "discussion_prompt_logs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
