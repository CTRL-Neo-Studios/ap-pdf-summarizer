import {blob} from 'hub:blob'
import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import {z} from 'zod';
import { useServerFiles } from '~~/server/utils/core/useServerFiles'
import { summaryAbilities } from '#shared/abilities/summaryAbilities'

const RouterParams = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const $file = useServerFiles()
    const { id } = await getValidatedRouterParams(event, RouterParams.parse)

    const [summary]: Summary[] = await $sum.getSummariesById([id])
    await authorize(event, summaryAbilities().readOrUpdateOrDeleteSummary, [summary])

    const blobObjects = await blob.handleUpload(event, {
        formKey: 'files',
        multiple: false,
        ensure: {
            maxSize: '16MB',
            types: ['application/pdf', 'text/plain', 'text/markdown', 'image/jpeg', 'image/png'],
        },
        put: {
            addRandomSuffix: true,
            prefix: `uploads/${user.user.id}/${id}`,
            access: 'public'
        }
    })

    if (!blobObjects.length)
        throw createError({
            statusMessage: 'No uploaded file',
            statusCode: 400
        })

    const [obj] = blobObjects

    await $file.addFile(user.user.id, id, obj.pathname)

    return blobObjects
})