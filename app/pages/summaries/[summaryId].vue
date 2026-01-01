<script setup lang="ts">
import { useSummaries } from '~/composables/core/useSummaries'
import { getFileName, streamDownload } from '~/utils/utility/filepath'

const $route = useRoute()
const $sum = useSummaries()
const summaryId = computed(() => $route.params.summaryId as string)

const uploadedFile = ref<File | null>(null)
const uploading = ref(false)
const upload = useUpload(`/api/v1/summaries/${unref(summaryId)}/upload`, {
    headers: useRequestHeaders(['cookie'])
})

const { data: summary, pending: loadingSummary, refresh: refreshSummary } = await useAsyncData(`summary.${unref(summaryId)}`, () => $sum.getSummary(unref(summaryId)))
const { data: summaryFiles, pending: loadingSummaryFiles, refresh: refreshSummaryFiles } = await useAsyncData(`summary.${unref(summaryId)}.files`, () => $sum.getSummaryFiles(unref(summaryId)))
const hasFiles = computed(() => (unref(summaryFiles) || []).length != 0)

async function uploadFile() {
    uploading.value = true
    try {
        const f = await upload(uploadedFile.value)
        await refreshSummaryFiles()
    } catch (e) {

    } finally {
        uploading.value = false
    }
}

async function deleteFile(fileId: string) {
    await $sum.deleteSummaryFiles(unref(summaryId), [fileId])
    await refreshSummaryFiles()
}

</script>

<template>
    <UScrollArea orientation="vertical">
        <UMain>
            <UPage>
                <UCard>
                    <template #header>

                    </template>
                    <div
                        class="mx-auto justify-center grid grid-cols-1 gap-2"
                        v-if="hasFiles"
                    >
                        <div
                            class="rounded-lg border border-default gap-2 flex inflex-flex items-center justify-center group transition-all duration-300 p-2"
                            v-for="(file, index) in summaryFiles"
                            :key="index"
                        >
                            <UIcon name="i-lucide-file" class="text-neutral size-4"/>
                            <div class="text-ellipsis overflow-hidden flex-grow">{{getFileName(file?.blobPath)}}</div>
                            <UButton @click="streamDownload(`/blob/${file?.id}`, getFileName(file?.blobPath))" color="neutral" variant="ghost" icon="i-lucide-download" class="group-hover:opacity-100 opacity-0 transition-all duration-200"/>
                            <UButton @click="deleteFile(file?.id)" color="error" variant="ghost" icon="i-lucide-trash-2" class="group-hover:opacity-100 opacity-0 transition-all duration-200"/>
                        </div>
                    </div>
                    <template v-else>
                        <UAlert variant="subtle" title="Notice" description="You can only upload one file; after you generate the summary, you cannot upload another file after you delete the uploaded one."/>
                        <UFileUpload
                            label="Drop your PDF/image/text file here"
                            description="PDF, .txt, .png, .jpeg, etc."
                            class="mx-auto justify-center"
                            accept=".pdf,.txt,.md,.png,.jpg,.jpeg"
                            v-model="uploadedFile"
                            :disabled="uploading"
                            layout="list"
                        >
                            <template #files-bottom="{ removeFile, files }">
                                <UButton
                                    v-if="files?.length"
                                    label="Remove all files"
                                    color="neutral"
                                    @click="removeFile()"
                                />
                            </template>
                        </UFileUpload>
                        <UButton @click="uploadFile" label="testupload"/>
                    </template>
                </UCard>
            </UPage>
        </UMain>
    </UScrollArea>
</template>

<style scoped>

</style>