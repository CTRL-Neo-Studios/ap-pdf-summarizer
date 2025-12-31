import type { UserMe } from '#shared/types/fetch'

export function useAuth() {
    async function signin(email: string, password: string) {
        return await $fetch('/api/v1/auth/signin', {
            method: 'POST',
            body: {
                email: email,
                password: password
            }
        })
    }

    async function signup(email: string, username: string, password: string) {
        return await $fetch('/api/v1/auth/signup', {
            method: 'POST',
            body: {
                email: email,
                password: password,
                username: username
            }
        })
    }

    async function me() {
        return await $fetch('/api/v1/auth/me', {
            method: 'get'
        })
    }

    async function signout() {
        return await $fetch('/api/v1/auth/signout', {
            method: 'post'
        })
    }

    return {
        signin,
        signup,
        signout,
        me
    }
}