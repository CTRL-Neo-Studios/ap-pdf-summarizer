import { db as $db } from 'hub:db'
import { blob as $blob } from 'hub:blob'
import { and, eq, inArray } from 'drizzle-orm'
import { files, users } from 'hub:db:schema'

export function useServerFiles() {
    async function addFile(userId: string, summaryId: string, pathname: string) {
        const [row] = await $db.insert(files)
            .values({
                userId: userId,
                blobPath: pathname,
                summaryId: summaryId
            })
            .returning()
        return row
    }

    async function getFile(userId: string, fileId: string) {
        return await $db.query.files.findFirst({
            where: and(eq(files.userId, userId), eq(files.id, fileId))
        })
    }

    async function getFilesById(fileIds: string[]) {
        return await $db.query.files.findMany({
            where: inArray(files.id, fileIds)
        })
    }

    async function getFilesFromSummaries(userId: string, summaryIds: string[]) {
        return await $db.query.files.findMany({
            where: and(eq(files.userId, userId), inArray(files.summaryId, summaryIds))
        })
    }

    async function getFileBlobHeadsFromSummaries(userId: string, summaryIds: string[]) {
        const fs = await $db.query.files.findMany({
            where: and(eq(files.userId, userId), inArray(files.summaryId, summaryIds))
        })

        let fshead = []
        for (const f of fs) {
            fshead.push(await blob.head(f.blobPath))
        }

        return fshead
    }

    async function getFileBlobsFromSummaries(userId: string, summaryIds: string[]) {
        const fs = await $db.query.files.findMany({
            where: and(eq(files.userId, userId), inArray(files.summaryId, summaryIds))
        })

        let fshead = []
        for (const f of fs) {
            fshead.push(await blob.get(f.blobPath))
        }

        return fshead
    }

    async function getFileDataFromSummaries(userId: string, summaryIds: string[]) {
        const fs = await $db.query.files.findMany({
            where: and(eq(files.userId, userId), inArray(files.summaryId, summaryIds))
        })

        let fshead = []
        for (const f of fs) {
            fshead.push({ blob: await blob.get(f.blobPath), head: await blob.head(f.blobPath) })
        }

        return fshead
    }

    async function deleteFile(userId: string, fileId: string) {
        const [row] = await $db.delete(files)
            .where(and(
                eq(files.userId, userId),
                eq(files.id, fileId)
            ))
            .returning()
        return row
    }

    async function deleteFiles(userId: string, fileIds: string[]) {
        return await $db.delete(files)
            .where(and(
                eq(files.userId, userId),
                inArray(files.id, fileIds)
            ))
            .returning()
    }

    async function hasFile(userId: string, fileId: string) {
        return (await getFile(userId, fileId)) != null
    }

    async function deleteFileAndBlob(userId: string, fileId: string) {
        const file = await deleteFile(userId, fileId)
        if (!file) return;
        await $blob.delete(file.blobPath)
        return file
    }

    async function deleteFilesAndBlobs(userId: string, fileIds: string[]) {
        const files = await deleteFiles(userId, fileIds)
        if (!files.length) return;
        for (const file of files) {
            await $blob.delete(file.blobPath)
        }
        return files
    }

    async function deleteBlobsFromSummaries(userId: string, summaryIds: string[]) {
        // Deletes the blobs only, but not the entry files
        const files = await getFilesFromSummaries(userId, summaryIds)
        if(!files.length) return
        for (const file of files) {
            await $blob.delete(file.blobPath)
        }
        return files
    }

    async function deleteFilesAndBlobsFromSummaries(userId: string, summaryIds: string[]) {
        // Deletes the blobs only, but not the entry files
        const files = await getFilesFromSummaries(userId, summaryIds)
        if(!files.length) return
        return await deleteFilesAndBlobs(userId, files.map(i => i.id))
    }

    return {
        addFile,
        getFile,
        deleteFile,
        deleteFiles,
        hasFile,
        deleteFileAndBlob,
        deleteFilesAndBlobs,
        getFilesFromSummaries,
        deleteBlobsFromSummaries,
        deleteFilesAndBlobsFromSummaries,
        getFileBlobHeadsFromSummaries,
        getFileBlobsFromSummaries,
        getFileDataFromSummaries,
        getFilesById
    }
}