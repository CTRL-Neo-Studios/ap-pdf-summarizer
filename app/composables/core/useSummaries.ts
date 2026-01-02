import type { SummaryFile } from '#shared/types/db'

export function useSummaries() {
    async function getSummary(summaryId: string): Promise<Summary> {
        return await $fetch<Summary>(`/api/v1/summaries/${summaryId}`, {
            method: 'get',
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function getSummaryFiles(summaryId: string) {
        return await $fetch<SummaryFile[]>(`/api/v1/summaries/${summaryId}/files`, {
            method: 'get',
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function getSummaries() {
        return await $fetch<Summary[]>('/api/v1/summaries', {
            method: 'get',
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function createSummary(name: string = 'Untitled Summary') {
        return await $fetch<Summary>('/api/v1/summaries', {
            method: 'post',
            body: {
                values: {
                    name: name,
                    prompt: '',
                    response: ''
                }
            },
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function editSummary(summaryId: string, values: SummaryInsert) {
        return await $fetch<Summary>(`/api/v1/summaries/${summaryId}`, {
            method: 'patch',
            body: {
                values: values
            },
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function deleteSummaries(summaryIds: string[]) {
        return await $fetch<Summary[]>('/api/v1/summaries', {
            method: 'delete',
            query: {
                ids: summaryIds
            },
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function deleteSummaryFiles(summaryId: string, fileIds: string[]) {
        return await $fetch<SummaryFile[]>(`/api/v1/summaries/${summaryId}/files`, {
            method: 'delete',
            query: {
                ids: fileIds
            },
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function generateSummary(summaryId: string) {
        return await $fetch<Summary>(`/api/v1/summaries/${summaryId}/generate`, {
            method: 'post',
            headers: useRequestHeaders(['cookie'])
        })
    }

    return {
        getSummary,
        getSummaries,
        createSummary,
        editSummary,
        deleteSummaries,
        deleteSummaryFiles,
        getSummaryFiles,
        generateSummary
    }
}