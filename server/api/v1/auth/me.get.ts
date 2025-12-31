import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { UserMe } from '#shared/types/fetch'

export default defineEventHandler(async (event) => {
    const { requireUser } = useServerAuth()

    const data = await requireUser(event)

    // Return sanitized data (never return the password hash!)
    return {
        user: {
            id: data.user.id,
            email: data.user.email,
        },
        profile: data.profile
    } satisfies UserMe
})