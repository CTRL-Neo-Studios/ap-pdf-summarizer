import type { UserMe } from '#shared/types/fetch'

export function useAuth() {
    async function signin(email: string, password: string) {
        return await $fetch('/api/v1/auth/signin', {
            method: 'POST',
            body: {
                email: email,
                password: password
            },
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function signup(email: string, username: string, password: string) {
        return await $fetch('/api/v1/auth/signup', {
            method: 'POST',
            body: {
                email: email,
                password: password,
                username: username
            },
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function me() {
        return await $fetch('/api/v1/auth/me', {
            method: 'get',
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function signout() {
        return await $fetch('/api/v1/auth/signout', {
            method: 'post',
            headers: useRequestHeaders(['cookie'])
        })
    }

    return {
        signout,
        me
    }
}