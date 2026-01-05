import { useServerAuth } from '~~/server/utils/auth/useServerAuth'
import { useServerSummaries } from '~~/server/utils/core/useServerSummaries'
import { useServerFiles } from '~~/server/utils/core/useServerFiles'
import { generateText } from 'ai'
import { z } from 'zod'
import { useServerParsing } from '~~/server/utils/utility/useServerParsing'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { blob } from 'hub:blob'
import { summaryAbilities } from '#shared/abilities/summaryAbilities'

const RouterParams = z.object({
    id: z.uuid()
})

export default defineEventHandler(async (event) => {
    const $auth = useServerAuth()
    const user = await $auth.requireUser(event)
    const $sum = useServerSummaries()
    const $file = useServerFiles()
    const $parse = useServerParsing()
    const $rc = useRuntimeConfig()

    const { id } = await getValidatedRouterParams(event, RouterParams.parse)
    const [summary]: Summary[] = await $sum.getSummariesById([id])
    await authorize(event, summaryAbilities().readOrUpdateOrDeleteSummary, [summary])
    const files = await $file.getFileDataFromSummaries(user.user.id, [id])
    const openrouter = createOpenRouter({
        apiKey: $rc.openrouter.apiKey,
        headers: {
            'HTTP-Referer': 'https://summarizer.ctrl-neo.dev',
            'X-Title': 'AP PDF Summarizer'
        }
    })

    if (!files || files.length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No files found for this summary'
        })
    }

    if (!summary?.prompt || summary?.prompt.trim().length === 0) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Summary prompt is required'
        })
    }

    try {
        const results = await Promise.all(
            files.map(async (file) => {
                if (!file.blob) return null; // Return null instead of continue

                return {
                    type: 'file' as const,
                    data: await file.blob.arrayBuffer(),
                    mediaType: file.head.contentType || 'application/octet-stream',
                };
            })
        );

        const fileContents = results.filter((result) => result !== null);

        // Generate summary using AI SDK
        const result = await generateText({
            model: openrouter.chat($rc.openrouter.modelId || 'anthropic/claude-sonnet-4.5'),
            messages: [
                {
                    role: 'user',
                    content: [
                        // Add downloaded file parts
                        ...fileContents,
                        // Add the user's prompt
                        {
                            type: 'text' as const,
                            text: summary?.prompt ?? ''
                        }
                    ]
                }
            ],
        })

        console.log(event.toString())

        const html = await $parse.markdownToHtml(result.text)
        return await $sum.editSummary(user.user.id, id, {
            response: html,
            userId: user.user.id
        })
    } catch (error) {
        console.error('Generation failed:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to generate summary',
            cause: error
        })
    }
})