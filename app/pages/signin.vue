<script setup lang="ts">
import * as z from 'zod'
import { useAuth } from '~/composables/core/useAuth'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import { useQuickToasts } from '~/composables/utility/useQuickToasts'

definePageMeta({
    middleware: ['already-has-valid-session']
})

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
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
}]

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string('Password is required').min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

async function onSubmit(payload: FormSubmitEvent<Schema>) {
    loading.value = true
    try {
        const user = await $auth.signin(payload.data.email, payload.data.password)
        if (user) {
            $qt.success('Successfully Signed In!')
            await navigateTo('/')
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
                    title="Sign In"
                    description="Enter your credentials to get more PDF summaries."
                    icon="i-lucide-user"
                    :fields="fields"
                    @submit="onSubmit"
                    :loading
                >
                    <template #footer>
                        Don't have an account? <ULink to="/signup" class="text-primary font-medium">Sign Up</ULink>
                    </template>
                </UAuthForm>
            </UPageCard>
        </UMain>
    </div>
</template>

