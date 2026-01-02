import DOMPurify from 'dompurify'
import { marked } from 'marked'
import TurndownService from 'turndown'
// @ts-ignore
import { gfm, tables } from 'turndown-plugin-gfm'


export function useServerParsing() {
    marked.setOptions({
        gfm: true,
        breaks: true,
        pedantic: false,
    })

    function htmlToMarkdown(content: string) {
        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        })
        turndownService.use(gfm)
        turndownService.use(tables)
        return turndownService.turndown(DOMPurify.sanitize(content))
    }

    async function markdownToHtml(content: string) {
        // Validate input
        if (!content) {
            console.warn('Empty content passed to markdownToHtml')
            return ''
        }

        if (typeof content !== 'string') {
            console.error('Invalid content type:', typeof content)
            return ''
        }

        try {
            // Parse with async: false to ensure string return
            const html = marked.parse(content, { async: false }) as string

            if (!html || html === '<p></p>\n') {
                console.warn('Markdown parse resulted in empty HTML for content:', content.substring(0, 100))
            }

            return html
        } catch (error) {
            console.error('Markdown parsing error:', error)
            return `<p>${content}</p>` // Fallback to plain text
        }
    }

    /**
     * Isolates the file name from a given path string.
     *
     * @param path The input file path (e.g., "/usr/local/bin/node").
     * @returns The file name with its extension (e.g., "node").
     */
    function getFileName(path: string): string {
        // Use the last index of a forward or backward slash to find the start of the file name.
        const lastSlashIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));

        // If a slash is found, return the substring starting after the slash.
        if (lastSlashIndex !== -1) {
            return path.substring(lastSlashIndex + 1);
        }

        // If no slash is found, the whole string is likely the file name or an empty string.
        return path;
    }

    function getMediaType(blobPath: string): string {
        const ext = blobPath.split('.').pop()?.toLowerCase()
        const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'txt': 'text/plain',
            'md': 'text/markdown',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
        }
        return mimeTypes[ext || ''] || 'application/octet-stream'
    }

    return {
        htmlToMarkdown,
        getFileName,
        markdownToHtml,
        getMediaType
    }
}