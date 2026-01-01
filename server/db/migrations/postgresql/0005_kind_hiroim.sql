ALTER TABLE "files" DROP CONSTRAINT "files_summaryId_summaries_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_summaryId_summaries_id_fk" FOREIGN KEY ("summaryId") REFERENCES "public"."summaries"("id") ON DELETE cascade ON UPDATE no action;