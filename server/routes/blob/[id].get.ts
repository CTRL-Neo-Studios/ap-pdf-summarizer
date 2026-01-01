import {z} from 'zod';
import { db as $db } from 'hub:db'
import {blob} from 'hub:blob'
import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { and, eq } from 'drizzle-orm'
import { files } from '~~/server/db/schema'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'

const schema = z.object({
    id: z.string()
})
export default defineEventHandler(async (event) => {
    const {id} = await getValidatedRouterParams(event, schema.parse)
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $file = useServerFiles()

    const file = await $file.getFile(user.user.id, id)

    if (file) {
        setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
        return blob.serve(event, file.blobPath)
    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'File not found.'
        })
    }
})