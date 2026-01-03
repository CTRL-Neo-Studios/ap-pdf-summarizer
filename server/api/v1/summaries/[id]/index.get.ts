import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import { z } from 'zod'

const RouterParams = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const { id } = await getValidatedRouterParams(event, RouterParams.parse)

    // console.log(event.toString())
    return await $sum.getSummary(user.user.id, id)
})