import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'

const BodySchema = z.object({
    values: z.custom<SummaryInsert>()
})

const RouterSchema = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()

    const {values} = await readValidatedBody(event, BodySchema.parse)
    const {id} = await getValidatedRouterParams(event, RouterSchema.parse)

    console.log(event.toString())
    return await $sum.editSummary(user.user.id, id, values)
})