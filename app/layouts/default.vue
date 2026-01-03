<script setup lang="ts">
import { useSummaries } from '~/composables/core/useSummaries'

const $route = useRoute()
const $sum = useSummaries()
const { data: summaries, pending: loadingSummaries, refresh, error } = await useAsyncData('data.summaries', () => $sum.getSummaries())
const groups = computed(() => ([
    {
        id: 'summaries',
        label: 'Summaries',
        items: unref(summaries)?.map(i => ({
            label: i.name,
            suffix: `${new Date(i.createdAt).toDateString()} (${i.id.slice(0, 6)})`
        }))
    }
]))
</script>

<template>
    <AuthState v-slot="{loggedIn}">
        <template v-if="loggedIn">
            <UDashboardGroup>
                <SummarizerDashboardSidebar :summaries="summaries || []" :pending="loadingSummaries" :refresh="refresh" />
                <UDashboardPanel>
                    <UDashboardSearch :groups="groups" :loading="loadingSummaries"/>
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