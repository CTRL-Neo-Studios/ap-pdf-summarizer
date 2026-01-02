<script setup lang="ts">
import { useSummaries } from '~/composables/core/useSummaries'
import { useAuth } from '~/composables/core/useAuth'
import type { UserMe } from '#shared/types/fetch'

const $route = useRoute()
const summaryId = computed(() => $route.params.summaryId as string)
const $sum = useSummaries()
const $auth = useAuth()
const user = ref()

const creatingSummary = ref(false)
const signingOut = ref(false)

onMounted(async () => {
    user.value = await $auth.me()
})

const { data: summaries, pending: loadingSummaries, refresh, error } = await useAsyncData('data.summaries', () => $sum.getSummaries())

async function newSummary() {
    creatingSummary.value = true
    // @ts-ignore
    await $sum.createSummary(user.value?.profile?.id)
    await refresh()
    creatingSummary.value = false
}

async function signout() {
    signingOut.value = true
    await $auth.signout()
    signingOut.value = false
    location.reload()
}
</script>

<template>
    <UDashboardSidebar :collapsible="false" resizable class="bg-inverted/2" :ui="{ footer: 'border-t border-default' }">
        <template #header="{collapsed}">
            <div class="flex items-center w-full select-none gap-2">
                <UIcon name="i-lucide-file-text" class="size-6 text-primary"/>
                <div v-if="!collapsed" class="text-primary text-left font-bold text-lg">Summarizer</div>
                <div class="flex-grow"/>
                <UTooltip text="New Summary">
                    <UButton :loading="creatingSummary" icon="i-lucide-plus" @click="newSummary"/>
                </UTooltip>
            </div>
        </template>

        <template #default="{collapsed}">
            <UDashboardSearchButton/>
            <div v-if="loadingSummaries" class="w-full inline-flex items-center justify-center">
                <UIcon name="i-lucide-loader-circle" class="animate-spin size-4"/>
            </div>
            <UScrollArea
                v-else
                v-slot="{ item, index }"
                :items="summaries || []"
                orientation="vertical"
                :virtualize="{
                    gap: 4,
                    lanes: 1
                }"
            >
                <div class="w-full flex inline-flex gap-1 items-center justify-center" :key="index">
                    <UButton
                        v-if="item"
                        class="text-left w-full"
                        :label="item.name || 'Untitled Summary'"
                        :color="summaryId == item.id ? 'primary' : 'neutral'"
                        :variant="summaryId == item.id ? 'soft' : 'ghost'"
                        :to="`/summaries/${item.id}`"
                    />
                    <UButton
                        v-if="item && summaryId == item.id"
                        icon="i-lucide-ellipsis"
                        color="neutral"
                        variant="soft"
                    />
                </div>
            </UScrollArea>
        </template>

        <template #footer="{ collapsed }">
            <UDropdownMenu
                :items="[[
                    {
                        disabled: unref(signingOut),
                        label: 'Sign Out',
                        icon: 'i-lucide-log-out',
                        async onSelect() {
                            await signout()
                        }
                    }
                ]]"
            >
                <UButton
                    icon="i-lucide-user"
                    :label="collapsed ? undefined : (user?.profile?.username || 'Loading...')"
                    color="neutral"
                    variant="ghost"
                    class="w-full"
                    :block="collapsed"
                />
            </UDropdownMenu>
        </template>
    </UDashboardSidebar>
</template>

<style scoped>

</style>