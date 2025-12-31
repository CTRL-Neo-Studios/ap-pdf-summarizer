<script setup lang="ts">
</script>

<template>
    <AuthState v-slot="{loggedIn}">
        <template v-if="loggedIn">
            <UDashboardGroup>
                <SummarizerDashboardSidebar/>
                <UDashboardPanel>
                    <UDashboardSearch/>
                    <slot/>
                </UDashboardPanel>
            </UDashboardGroup>
        </template>
        <template v-else>
            <slot/>
        </template>
    </AuthState>
</template>

<style scoped>

</style>