<script setup lang="ts">
import { useSummariesStore } from '~/stores/core/useSummariesStore'
import { useQuickToasts } from '~/composables/utility/useQuickToasts'
import {z} from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui'

const props = defineProps<{
    summaryName: string
    summaryId: string
    refreshSummaries(): Promise<void>
}>()
const $store = useSummariesStore()
const $qt = useQuickToasts()

const emit = defineEmits<{ close: [boolean] }>()
const renamingSummary = ref(false)

const schema = z.object({
    newName: z.string('Cannot be empty')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
    newName: props.summaryName
})

async function renameSummary(newName: string) {
    renamingSummary.value = true
    try {
        await $store.updateSummary(props.summaryId, {
            name: newName
        })
        $qt.success(`Summary renamed.`)
        emit('close', true)
    } catch (e: any) {
        console.error(e)
        $qt.error('Error occurred while renaming summary.', e.statusMessage)
    } finally {
        renamingSummary.value = false
    }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
    await renameSummary(event.data.newName)
    await props.refreshSummaries()
}
</script>

<template>
    <UModal
        :close="{ onClick: () => { if(!renamingSummary) emit('close', false) } }"
        title="Renaming Summary"
        :dismissable="false"
    >
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4 w-full grid grid-cols-1" @submit="onSubmit" :disabled="renamingSummary">
                <UFormField label="New Name" name="newName" required class="w-full" size="xl">
                    <UInput v-model="state.newName" class="w-full"/>
                </UFormField>
            </UForm>
        </template>
    </UModal>
</template>
