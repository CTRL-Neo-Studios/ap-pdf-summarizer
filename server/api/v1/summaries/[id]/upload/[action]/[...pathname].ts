import { blob } from 'hub:blob'
import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import {z} from 'zod';
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'

const RouterParams = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {

    // Temporarily disable this multipart upload solution.
    throw createError({
        statusMessage: 'Unimplemented',
        statusCode: 500
    })

    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const { id } = await getValidatedRouterParams(event, RouterParams.parse)

    if (!(await $sum.hasSummary(user.user.id, id)))
        throw createError({
            statusMessage: 'Unauthorzied',
            statusCode: 403
        })

    return blob.handleMultipartUpload(event, {
        access: 'public',
        prefix: `uploads/${user.user.id}/${id}`
    })
})