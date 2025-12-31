import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'

const QuerySchema = z.object({
    ids: z.array(z.uuid())
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()

    const { ids } = await getValidatedQuery(event, QuerySchema.parse)

    return await $sum.deleteSummaries(user.user.id, ids)
})