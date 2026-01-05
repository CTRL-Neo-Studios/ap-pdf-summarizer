import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'
import {z} from 'zod'
import { summaryAbilities } from '#shared/abilities/summaryAbilities'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'

const RouterSchema = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $file = useServerFiles()
    const $sum = useServerSummaries()

    const { id: summaryId } = await getValidatedRouterParams(event, RouterSchema.parse)

    const [summary]: Summary[] = await $sum.getSummariesById([summaryId], true)

    await authorize(event, summaryAbilities().readOrUpdateOrDeleteSummary, [summary])

    return summary?.files || []
})