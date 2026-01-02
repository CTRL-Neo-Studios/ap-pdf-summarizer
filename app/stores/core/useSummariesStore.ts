import { defineStore } from 'pinia'
import type { Summary, SummaryFile, SummaryInsert } from '#shared/types/db'
import { useSummaries } from '~/composables/core/useSummaries'

export const useSummariesStore = defineStore('summaries', () => {
    // Use the existing composable
    const $sum = useSummaries()

    // State - just for caching and UI optimization
    const summaries = ref<Map<string, Summary>>(new Map())
    const summaryFiles = ref<Map<string, SummaryFile[]>>(new Map())
    const saving = ref<Set<string>>(new Set())
    const generating = ref<Set<string>>(new Set())

    // Getters
    const getSummaryById = (id: string) => computed(() => summaries.value.get(id))
    const getFilesBySummaryId = (id: string) => computed<SummaryFile[]>(() => summaryFiles.value.get(id) || [])
    const isSaving = (id: string) => computed<boolean>(() => saving.value.has(id))
    const isGenerating = (id: string) => computed(() => generating.value.has(id))

    // Actions - just add caching layer on top of composable
    async function fetchSummary(summaryId: string, force = false) {
        if (!force && summaries.value.has(summaryId)) {
            return summaries.value.get(summaryId)
        }

        const data = await $sum.getSummary(summaryId)
        summaries.value.set(summaryId, data)
        return data
    }

    async function fetchSummaryFiles(summaryId: string, force = false) {
        if (!force && summaryFiles.value.has(summaryId)) {
            return summaryFiles.value.get(summaryId)
        }

        const data = await $sum.getSummaryFiles(summaryId)
        summaryFiles.value.set(summaryId, data)
        return data
    }

    async function updateSummary(summaryId: string, values: Partial<SummaryInsert>) {
        // Optimistic update
        const current = summaries.value.get(summaryId)
        if (current) {
            summaries.value.set(summaryId, { ...current, ...values })
        }

        saving.value.add(summaryId)
        try {
            await $sum.editSummary(summaryId, values as SummaryInsert)
            // Re-fetch to get server state
            const updated = await $sum.getSummary(summaryId)
            summaries.value.set(summaryId, updated)
            return updated
        } catch (error) {
            // Rollback on error
            if (current) {
                summaries.value.set(summaryId, current)
            }
            throw error
        } finally {
            saving.value.delete(summaryId)
        }
    }

    async function generateSummary(summaryId: string) {
        generating.value.add(summaryId)
        try {
            const updated = await $sum.generateSummary(summaryId)
            summaries.value.set(summaryId, updated)
            return updated
        } catch (error) {
            throw error
        } finally {
            generating.value.delete(summaryId)
        }
    }

    async function deleteFile(summaryId: string, fileId: string) {
        // Optimistic update
        const files = summaryFiles.value.get(summaryId) || []
        const filtered = files.filter(f => f.id !== fileId)
        summaryFiles.value.set(summaryId, filtered)

        try {
            await $sum.deleteSummaryFiles(summaryId, [fileId])
        } catch (error) {
            // Rollback on error
            summaryFiles.value.set(summaryId, files)
            throw error
        }
    }

    async function addFile(summaryId: string, file: SummaryFile) {
        const files = summaryFiles.value.get(summaryId) || []
        summaryFiles.value.set(summaryId, [...files, file])
    }

    async function createSummary(userId: string) {
        const summary = await $sum.createSummary(userId)
        summaries.value.set(summary.id, summary)
        return summary
    }

    async function deleteSummaries(summaryIds: string[]) {
        await $sum.deleteSummaries(summaryIds)
        summaryIds.forEach(id => {
            summaries.value.delete(id)
            summaryFiles.value.delete(id)
        })
    }

    return {
        summaries,
        summaryFiles,
        getSummaryById,
        getFilesBySummaryId,
        isSaving,
        isGenerating,
        fetchSummary,
        fetchSummaryFiles,
        updateSummary,
        generateSummary,
        deleteFile,
        addFile,
        createSummary,
        deleteSummaries
    }
})