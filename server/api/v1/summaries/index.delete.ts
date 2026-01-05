import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'
import { summaryAbilities } from '#shared/abilities/summaryAbilities'

const QuerySchema = z.object({
    ids: z.union([z.uuid(), z.array(z.uuid())])
        .transform((val) => {
            // If it's a string, wrap it in an array.
            // If it's already an array, leave it alone.
            return Array.isArray(val) ? val : [val]
        })
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const $file = useServerFiles()

    const { ids } = await getValidatedQuery(event, QuerySchema.parse)

    const s: Summary[] = await $sum.getSummariesById(ids)

    await authorize(event, summaryAbilities().readOrUpdateOrDeleteSummary, s)

    await $file.deleteFilesAndBlobsFromSummaries(user.user.id, ids)

    return await $sum.deleteSummaries(user.user.id, ids)
})