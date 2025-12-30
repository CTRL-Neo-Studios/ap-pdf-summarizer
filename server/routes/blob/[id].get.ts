import {z} from 'zod';
import {blob} from 'hub:blob'
import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerDb } from '~~/server/utils/core/useServerDb'
import { and, eq } from 'drizzle-orm'
import { files } from '~~/server/db/schema'

const schema = z.object({
    id: z.string()
})
export default defineEventHandler(async (event) => {
    const {id} = await getValidatedRouterParams(event, schema.parse)
    const $auth = useServerAuth()
    const $db = useServerDb()
    const user = await $auth.requireUser(event)

    const file = await $db.query.files.findFirst({
        where: and(eq(files.id, id), eq(files.userId, user.user.id))
    })

    if (file) {
        setHeader(event, 'Content-Security-Policy', 'default-src \'none\';')
        return blob.serve(event, file.summaryId)
    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'File not found.'
        })
    }
})