import { useServerAuth } from '~~/server/utils/auth/useServerAuth'

export default defineOAuthGitHubEventHandler({
    config: {
        emailRequired: true
    },
    async onSuccess(event, { user }) {
        const $auth = useServerAuth()
        if (user.email)
            await $auth.createOrLoginUserFromGithub(event, user.id, user.email, user.name, user.avatar_url)
        else
            throw createError({
                statusCode: 401,
                statusMessage: 'Must require an email from user.'
            })
        return sendRedirect(event, '/')
    },
    onError(event, error) {
        console.error('GitHub OAuth error:', error)
        return sendRedirect(event, '/')
    },
})