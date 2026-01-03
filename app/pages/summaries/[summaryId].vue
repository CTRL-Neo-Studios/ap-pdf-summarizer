<script setup lang="ts">
import { useSummaries } from '~/composables/core/useSummaries'
import { getFileName, streamDownload } from '~/utils/utility/filepath'
import { useSummariesStore } from '~/stores/core/useSummariesStore'
import { useQuickToasts } from '~/composables/utility/useQuickToasts'

definePageMeta({
    middleware: ['valid-session']
})

const $route = useRoute()
const $sum = useSummariesStore()
const $qt = useQuickToasts()
const summaryId = computed(() => $route.params.summaryId as string)

const uploadedFile = ref<File | null>(null)
const uploading = ref(false)

const summary = $sum.getSummaryById(unref(summaryId))
const summaryFiles = $sum.getFilesBySummaryId(unref(summaryId))
const savingSummary = $sum.isSaving(unref(summaryId))
const generatingSummary = computed(() => unref($sum.isGenerating(unref(summaryId))))
const upload = useUpload(`/api/v1/summaries/${unref(summaryId)}/upload`, {
    headers: useRequestHeaders(['cookie'])
})
const summaryPrompt = ref<string>('')
const summaryContent = ref<string>('')

const hasFiles = computed(() => (unref(summaryFiles) || []).length > 0)
const canGenerate = computed(() => unref(hasFiles) && summaryPrompt.value.trim().length > 0 && !unref(uploading))
const existingChanges = ref(false), loadingSummary = ref(true)

defineShortcuts({
    'meta_s': {
        async handler() {
            $qt.info('Auto-Save is Active.', 'Everytime you change your prompt or summary, we\'ll autosave your changes (1 second delay).')
        },
        usingInput: true
    }
})

onMounted(async () => {
    loadingSummary.value = true
    await Promise.all([
        $sum.fetchSummary(unref(summaryId)),
        $sum.fetchSummaryFiles(unref(summaryId))
    ])

    summaryPrompt.value = summary.value?.prompt ?? ''
    summaryContent.value = summary.value?.response ?? ''
    loadingSummary.value = false
})

debouncedWatch(summaryPrompt, async (value) => {
    if (value !== summary.value?.prompt) {
        await $sum.updateSummary(unref(summaryId), { prompt: value })
        existingChanges.value = false
    }
}, {
    debounce: 1000,
    maxWait: 2000
})

debouncedWatch(summaryContent, async (value) => {
    if (value !== summary.value?.response) {
        await $sum.updateSummary(unref(summaryId), { response: value })
        existingChanges.value = false
    }
}, {
    debounce: 1000,
    maxWait: 2000
})


async function uploadFile() {
    if (!uploadedFile.value) return

    uploading.value = true
    try {
        await upload(uploadedFile.value)
        // Force refresh files from server
        await $sum.fetchSummaryFiles(unref(summaryId), true)
        uploadedFile.value = null
        $qt.success('File uploaded')
    } catch (e: any) {
        console.error('Upload failed:', e)
        $qt.error('Failed to upload file', e.statusMessage)
    } finally {
        uploading.value = false
    }
}

async function deleteFile(fileId: string) {
    try {
        await $sum.deleteFile(unref(summaryId), fileId)
    } catch (e: any) {
        console.error('Delete failed:', e)
        $qt.error('Failed to delete file', e.statusMessage)
    }
}

async function handleGenerateSummary() {
    if (!canGenerate.value) return

    try {
        const updated = await $sum.generateSummary(unref(summaryId))
        summaryContent.value = updated.response ?? ''
        $qt.success('Generation complete')
    } catch (e: any) {
        console.error('Generation failed:', e)
        $qt.error('Failed to generate summary', e.statusMessage)
    }
}

</script>

<template>
    <UMain class="w-full flex items-center justify-center select-none" v-if="loadingSummary">
        <div class="m-auto space-y-4">
            <div class="w-full text-center text-muted text-sm">Loading Summary...</div>
            <UProgress class="min-w-xs"/>
        </div>
    </UMain>
    <UScrollArea
        v-else
        orientation="vertical"
        :ui="{
            viewport: 'relative'
        }"
    >
        <div class="sticky left-2 top-2 w-fit flex inline-flex justify-center items-center">
            <UBadge :label="savingSummary ? 'Saving...' : 'Saved'" :color="savingSummary ? 'secondary' : 'neutral'" variant="subtle"/>
        </div>
        <UMain class="w-full">
            <UPage>
                <UPageBody>
                    <div class="max-w-4xl mx-auto sm:px-10 space-y-4">
                        <UPageCard
                            variant="naked"
                            title="Files"
                        >
                            <div
                                class="w-full grid grid-cols-1 gap-2"
                                v-if="hasFiles"
                            >
                                <TransitionGroup name="file-list">
                                    <div
                                        class="rounded-lg border border-default gap-2 flex items-center p-2"
                                        v-for="file in summaryFiles"
                                        :key="file.id"
                                    >
                                        <UIcon name="i-lucide-file" class="text-neutral size-5"/>
                                        <div class="text-ellipsis overflow-hidden flex-grow">
                                            {{ getFileName(file?.blobPath) }}
                                        </div>
                                        <UButton
                                            @click="streamDownload(`/blob/${file?.id}`, getFileName(file?.blobPath))"
                                            color="neutral"
                                            variant="ghost"
                                            icon="i-lucide-download"
                                        />
                                        <UButton
                                            @click="deleteFile(file?.id)"
                                            color="error"
                                            variant="ghost"
                                            icon="i-lucide-trash-2"
                                            :disabled="generatingSummary"
                                        />
                                    </div>
                                </TransitionGroup>
                            </div>
                            <template v-else>
                                <UFileUpload
                                    label="Drop your PDF/image/text file here"
                                    description="PDF, .txt, .png, .jpeg, etc."
                                    class="w-full"
                                    accept="application/pdf,text/plain,text/markdown,image/png,image/jpeg"
                                    v-model="uploadedFile"
                                    :disabled="uploading"
                                    layout="list"
                                >
                                    <template #files-bottom="{ removeFile, files }">
                                        <div class="w-full grid grid-cols-2 text-center gap-2" v-if="!uploading">
                                            <UButton
                                                v-if="files"
                                                label="Confirm Upload"
                                                color="neutral"
                                                class="justify-center"
                                                @click="uploadFile"
                                            />
                                            <UButton
                                                v-if="files"
                                                label="Remove all files"
                                                color="neutral"
                                                variant="soft"
                                                class="justify-center"
                                                @click="removeFile()"
                                            />
                                        </div>
                                        <UProgress color="neutral" class="w-full" v-else/>
                                    </template>
                                </UFileUpload>
                            </template>
                        </UPageCard>
                        <UPageCard
                            variant="naked"
                            title="Prompting"
                        >
                            <UTextarea v-model="summaryPrompt"/>
                        </UPageCard>
                        <UPageCard
                            variant="naked"
                            title="Response"
                            class="space-y-4"
                        >
                            <UAlert
                                v-if="!canGenerate && !generatingSummary"
                                variant="subtle"
                                color="warning"
                                icon="i-lucide-triangle-alert"
                                :title="!hasFiles ? 'Please upload a file first.' : 'Please enter a prompt.'"
                            />
                            <UButton
                                @click="handleGenerateSummary"
                                label="Generate Summary"
                                icon="i-lucide-rocket"
                                :loading="generatingSummary"
                                :disabled="!canGenerate"
                                size="lg"
                                block
                            />
                            <SummarizerEditor :disabled="generatingSummary" v-model="summaryContent"/>
                        </UPageCard>
                    </div>
                </UPageBody>
            </UPage>
        </UMain>
    </UScrollArea>
</template>

<style scoped>
.file-list-move,
.file-list-enter-active,
.file-list-leave-active {
    transition: all 0.3s ease;
}

.file-list-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.file-list-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.file-list-leave-active {
    position: absolute;
    width: 100%;
}
</style>