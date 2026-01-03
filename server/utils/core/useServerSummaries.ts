import { db as $db } from 'hub:db'
import { and, desc, eq, inArray } from 'drizzle-orm'
import { summaries } from 'hub:db:schema'
import { SummaryInsert } from '#shared/types/db'

export function useServerSummaries() {

    async function getSummaries(userId: string) {
        return await $db.query.summaries.findMany({
            where: eq(summaries.userId, userId),
            columns: {
                prompt: false,
                response: false,
                config: false
            },
            orderBy: desc(summaries.updatedAt)
        }).execute()
    }

    async function getSummary(userId: string, summaryId: string) {
        return await $db.query.summaries.findFirst({
            where: and(eq(summaries.userId, userId), eq(summaries.id, summaryId)),
            with: {
                files: true
            }
        })
    }

    async function editSummary(userId: string, summaryId: string, summary: SummaryInsert) {
        const [row] = await $db.update(summaries)
            .set(summary)
            .where(
                and(
                    eq(summaries.userId, userId),
                    eq(summaries.id, summaryId)
                )
            )
            .returning()
        return row
    }

    async function deleteSummaries(userId: string, summaryIds: string[]) {
        return await $db.delete(summaries)
            .where(
                and(
                    eq(summaries.userId, userId),
                    inArray(summaries.id, summaryIds)
                )
            )
            .returning()
    }

    async function createSummary(userId: string, values: SummaryInsert) {
        const { id, createdAt, updatedAt, userId: uid, ...safeValues } = values
        const [row] = await $db.insert(summaries).values({...safeValues, userId: userId}).returning()
        return row
    }

    async function hasSummary(userId: string, summaryId: string) {
        return (await getSummary(userId, summaryId)) != null
    }

    return {
        getSummaries,
        getSummary,
        editSummary,
        deleteSummaries,
        createSummary,
        hasSummary
    }
}