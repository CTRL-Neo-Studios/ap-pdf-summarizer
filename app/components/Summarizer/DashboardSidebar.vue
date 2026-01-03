<script setup lang="ts">
import { useSummaries } from '~/composables/core/useSummaries'
import { useAuth } from '~/composables/core/useAuth'
import type { UserMe } from '#shared/types/fetch'
import { useSummariesStore } from '~/stores/core/useSummariesStore'
import { ModalSummaryRename, ModalSummaryDelete } from '#components'
import type { Summary } from "#shared/types/db"

const props = defineProps<{summaries: Summary[], pending: boolean, refresh(): Promise<void>}>()

const $route = useRoute()
const summaryId = computed(() => $route.params.summaryId as string)
const $sum = useSummaries()
const $auth = useAuth()
const $ov = useOverlay()
const user = ref()

const creatingSummary = ref(false)
const signingOut = ref(false)

const deleteSummaryModal = $ov.create(ModalSummaryDelete)
const renameSummaryModal = $ov.create(ModalSummaryRename)

onMounted(async () => {
    user.value = await $auth.me()
})

async function newSummary() {
    creatingSummary.value = true
    // @ts-ignore
    await $sum.createSummary()
    await props.refresh()
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
            <div class="flex items-center w-full select-none gap-1">
                <NuxtImg src="/icon.png" class="object-contain size-8"/>
                <div v-if="!collapsed" class="text-neutral text-left font-bold text-lg">Summarizer</div>
                <div class="flex-grow"/>
                <UTooltip text="New Summary">
                    <UButton :loading="creatingSummary" icon="i-lucide-plus" @click="newSummary"/>
                </UTooltip>
            </div>
        </template>

        <template #default="{collapsed}">
            <UDashboardSearchButton/>
            <div v-if="props.pending" class="w-full inline-flex items-center justify-center">
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
                <div class="w-full inline-flex gap-1 items-center justify-center group relative" :key="index">
                    <UButton
                        v-if="item"
                        class="text-left w-full"
                        :label="item.name || 'Untitled Summary'"
                        color="neutral"
                        :variant="summaryId == item.id ? 'soft' : 'ghost'"
                        :to="`/summaries/${item.id}`"
                    />
                    <UDropdownMenu
                        :items="[
                            [
                                {
                                    label: 'Rename',
                                    icon: 'i-lucide-pen-line',
                                    async onSelect() {
                                        await renameSummaryModal.open({
                                            summaryId: item.id,
                                            summaryName: item.name,
                                            refreshSummaries: refresh
                                        })
                                        await refresh()
                                    }
                                }
                            ],
                            [
                                {
                                    label: 'Delete',
                                    color: 'error',
                                    icon: 'i-lucide-trash',
                                    async onSelect() {
                                        await deleteSummaryModal.open({
                                            summaryId: item.id,
                                            summaryName: item.name,
                                            refreshSummaries: refresh
                                        })
                                    }
                                }
                            ]
                        ]"
                    >
                        <UButton
                            v-if="item"
                            icon="i-lucide-ellipsis"
                            color="neutral"
                            variant="ghost"
                            class="absolute right-0 z-10 group-hover:visible invisible"
                        />
                    </UDropdownMenu>
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
                    :label="collapsed ? undefined : (user?.profile?.username || 'Loading...')"
                    color="neutral"
                    variant="ghost"
                    class="w-full"
                    :block="collapsed"
                >
                    <template #leading>
                        <UAvatar
                            :src="user?.profile?.avatar"
                            :alt="user?.profile?.username || 'Loading...'"
                            icon="i-lucide-user"
                        />
                    </template>
                </UButton>
            </UDropdownMenu>
        </template>
    </UDashboardSidebar>
</template>

<style scoped>

</style>