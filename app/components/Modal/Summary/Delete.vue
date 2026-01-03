<script setup lang="ts">
import { useSummariesStore } from '~/stores/core/useSummariesStore'
import { useQuickToasts } from '~/composables/utility/useQuickToasts'

const props = defineProps<{
    summaryName: string,
    summaryId: string
    refreshSummaries(): Promise<void>
}>()
const $store = useSummariesStore()
const $qt = useQuickToasts()

const emit = defineEmits<{ close: [boolean] }>()
const deletingSummary = ref(false)

async function deleteSummary() {
    deletingSummary.value = true
    try {
        await $store.deleteSummaries([props.summaryId])
        await props.refreshSummaries()
        $qt.success(`Summary "${props.summaryName}" deleted.`)
        emit('close', true)
    } catch (e: any) {
        console.error(e)
        $qt.error('Error occurred while deleting summary.', e.statusMessage)
    } finally {
        deletingSummary.value = false
    }
}
</script>

<template>
    <UModal
        :close="{ onClick: () => { if(!deletingSummary) emit('close', false) } }"
        :title="`Are you sure you want to delete '${summaryName}'?`"
        :dismissable="false"
    >
        <template #footer>
            <div class="flex gap-2 items-center justify-end">
                <UButton color="neutral" label="Cancel" @click="emit('close', false)" :disabled="deletingSummary"/>
                <UButton color="error" label="Delete" @click="deleteSummary" :loading="deletingSummary"/>
            </div>
        </template>
    </UModal>
</template>
