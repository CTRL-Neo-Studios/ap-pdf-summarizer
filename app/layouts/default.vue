<script setup lang="ts">
const actions = ref([
    {
        label: 'Sign In',
        to: '/signin',
        trailingIcon: 'i-lucide-log-in'
    }
])
</script>

<template>
    <AuthState v-slot="{loggedIn}">
        <UBanner :actions="actions" v-if="!loggedIn" title="Unregistered users only get one PDF summary a day. Sign up for more summaries per day." icon="i-lucide-info"/>
    </AuthState>
    <slot/>
</template>

<style scoped>

</style>