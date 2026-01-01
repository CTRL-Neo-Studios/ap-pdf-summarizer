import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'

const QuerySchema = z.object({
    ids: z.union([z.uuid(), z.array(z.uuid())])
        .transform((val) => {
            // If it's a string, wrap it in an array.
            // If it's already an array, leave it alone.
            return Array.isArray(val) ? val : [val]
        })
})

const RouterSchema = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const $file = useServerFiles()

    const { ids: fileIds } = await getValidatedQuery(event, QuerySchema.parse)
    const { id: summaryId } = await getValidatedRouterParams(event, RouterSchema.parse)

    if (!(await $sum.hasSummary(user.user.id, summaryId)))
        throw createError({
            statusMessage: 'Unauthorized',
            statusCode: 403
        })

    console.log(event.toString())

    return await $file.deleteFilesAndBlobs(user.user.id, fileIds)
})