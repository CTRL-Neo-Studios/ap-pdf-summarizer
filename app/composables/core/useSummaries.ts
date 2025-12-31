export function useSummaries() {
    async function getSummary(summaryId: string) {
        return await $fetch(`/api/v1/summaries/${summaryId}`, {
            method: 'get'
        })
    }

    async function getSummaries() {
        return await $fetch('/api/v1/summaries', {
            method: 'get',
            headers: useRequestHeaders(['cookie'])
        })
    }

    async function createSummary(userId: string) {
        return await $fetch('/api/v1/summaries', {
            method: 'post',
            body: {
                values: {
                    userId: userId
                } satisfies SummaryInsert
            }
        })
    }

    async function editSummary(summaryId: string, values: SummaryInsert) {
        return await $fetch(`/api/v1/summaries/${summaryId}`, {
            method: 'patch',
            body: {
                values: values
            }
        })
    }

    async function deleteSummaries(summaryIds: string[]) {
        return await $fetch('/api/v1/summaries', {
            method: 'delete',
            query: {
                ids: summaryIds
            }
        })
    }

    return {
        getSummary,
        getSummaries,
        createSummary,
        editSummary,
        deleteSummaries
    }
}