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
                        icon: 'i-lucide-github',
                        label: 'Sign In/Sign Up with Github',
                        variant: 'solid',
                        to: '/api/v1/auth/github',
                        color: 'neutral',
                        external: true
                    }
                ]"
            />
        </AuthState>
    </UMain>
</template>

<style scoped>

</style>