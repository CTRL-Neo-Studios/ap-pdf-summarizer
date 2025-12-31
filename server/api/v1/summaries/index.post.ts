import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'

const BodySchema = z.object({
    values: z.custom<SummaryInsert>()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    
    const {values} = await readValidatedBody(event, BodySchema.parse)

    return await $sum.createSummary(user.user.id, values)
})