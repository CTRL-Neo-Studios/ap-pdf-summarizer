<script setup lang="ts">
import * as z from 'zod'
import { useAuth } from '~/composables/core/useAuth'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { useQuickToasts } from '~/composables/utility/useQuickToasts'

const $auth = useAuth()
const $qt = useQuickToasts()
const loading = ref(false)

const fields: AuthFormField[] = [{
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
}, {
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username',
    required: true
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
}]

const schema = z.object({
    email: z.email('Invalid email'),
    username: z.string('Username is required').min(3),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        const user = await $auth.signup(payload.data.email, payload.data.username, payload.data.password)
        if (user) {
            $qt.success('Successfully Signed Up!')
            await navigateTo('/signin')
            location.reload()
        }
    } catch (e: any) {
        $qt.error('Error signing you in', e.statusMessage)
    }
    loading.value = false
}
</script>

<template>
    <div>
        <UMain class="flex flex-col items-center justify-center gap-4 p-4">
            <UPageCard class="w-full max-w-md">
                <UAuthForm
                    :schema="schema"
                    title="Sign Up"
                    description="Create an account to get more PDF summaries."
                    icon="i-lucide-user"
                    :fields="fields"
                    @submit="onSubmit"
                    :loading
                >
                    <template #footer>
                        Already have an account? <ULink to="/signin" class="text-primary font-medium">Sign In</ULink>
                    </template>
                </UAuthForm>
            </UPageCard>
        </UMain>
    </div>
</template>

