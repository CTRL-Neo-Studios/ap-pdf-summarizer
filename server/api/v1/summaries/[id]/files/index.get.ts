import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'
import {z} from 'zod'

const RouterSchema = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $file = useServerFiles()

    const { id: summaryId } = await getValidatedRouterParams(event, RouterSchema.parse)

    return await $file.getFilesFromSummaries(user.user.id, [summaryId])
})