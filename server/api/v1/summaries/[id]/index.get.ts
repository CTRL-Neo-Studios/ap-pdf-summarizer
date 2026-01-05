import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import { z } from 'zod'
import { summaryAbilities } from '#shared/abilities/summaryAbilities'

const RouterParams = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const { id } = await getValidatedRouterParams(event, RouterParams.parse)

    const [s]: Summary[] = await $sum.getSummariesById([id], true)

    await authorize(event, summaryAbilities().readOrUpdateOrDeleteSummary, [s])

    return s
})