<script setup lang="ts">

</script>


<template>
    <UMain class="flex flex-col justify-center items-center select-none">
        <AuthState v-slot="{loggedIn}">
            <UEmpty
                v-if="loggedIn"
                title="Your AP Subject PDF Summarizer."
                description="Create a summary by clicking on the create button on the left sidebar."
                icon="i-lucide-file-text"
                variant="naked"
            />
            <UEmpty
                v-else
                title="Your AP Subject PDF Summarizer."
                description="Please sign-in/sign-up to access all features."
                icon="i-lucide-file-text"
                variant="naked"
                :actions="[
                    {
                        icon: 'i-lucide-log-in',
                        label: 'Sign In',
                        variant: 'solid',
                        to: '/signin'
                    },
                    {
                        icon: 'i-lucide-user-plus',
                        label: 'Sign Up',
                        variant: 'subtle',
                        color: 'neutral',
                        to: '/signup'
                    }
                ]"
            />
        </AuthState>
    </UMain>
</template>

<style scoped>

</style>