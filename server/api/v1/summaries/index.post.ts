import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod'
import { summaryAbilities } from '#shared/abilities/summaryAbilities'

const BodySchema = z.object({
    values: z.custom<Omit<SummaryInsert, 'userId'>>()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()

    await authorize(event, summaryAbilities().createSummary)
    
    const {values} = await readValidatedBody(event, BodySchema.parse)
    const {id, createdAt, updatedAt, ...safeValues} = values
    return await $sum.createSummary(user.user.id, { ...safeValues, userId: user.user.id})
})