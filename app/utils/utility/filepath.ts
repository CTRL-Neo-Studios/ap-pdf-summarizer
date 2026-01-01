/**
 * Isolates the file name from a given path string.
 *
 * @param path The input file path (e.g., "/usr/local/bin/node").
 * @returns The file name with its extension (e.g., "node").
 */
export function getFileName(path: string): string {
    // Use the last index of a forward or backward slash to find the start of the file name.
    const lastSlashIndex = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));

    // If a slash is found, return the substring starting after the slash.
    if (lastSlashIndex !== -1) {
        return path.substring(lastSlashIndex + 1);
    }

    // If no slash is found, the whole string is likely the file name or an empty string.
    return path;
}

export function streamDownload(url: string, filename: string) {
    const a = document.createElement('a')
    a.href = url

    // This attribute tells the browser:
    // "Don't open this. Save it. And name it this."
    a.setAttribute('download', filename)

    // (Optional) Open in new tab just in case the browser
    // ignores 'download' and tries to render the PDF.
    // This prevents the user from losing their current page state.
    a.target = '_blank'

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}