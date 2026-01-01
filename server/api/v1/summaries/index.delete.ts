import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'

const QuerySchema = z.object({
    ids: z.array(z.uuid())
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const $file = useServerFiles()

    const { ids } = await getValidatedQuery(event, QuerySchema.parse)

    const summaries = await $sum.deleteSummaries(user.user.id, ids)
    const summaryIds = summaries.map((i: any) => i.id)

    await $file.deleteBlobsFromSummaries(user.user.id, summaryIds)
    return summaries
})