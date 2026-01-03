import { open as tauriOpen, save as tauriSave } from '@tauri-apps/api/dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/api/fs';
import { toast } from 'svelte-sonner';
import { get } from 'svelte/store';
import {
    activateTab,
    findDocByPath,
    handleExternalFileOpen,
} from '$utils/documentsHandler';
import { documents, activeDoc } from '$lib/stores';

/** ===========================================
 * Open a single markdown file via file picker or path
=========================================== **/
export async function openMarkdownFile(filePath?: string): Promise<void> {
    let path = filePath;

    // Ask user if no path provided
    if (!path) {
        const result = await tauriOpen({
            multiple: false,
            filters: [{ name: 'Markdown', extensions: ['md'] }]
        });

        if (!result || typeof result !== 'string') return; // nothing selected
        path = result;
    }

    // Prevent duplicate opens
    const existing = findDocByPath(path);
    if (existing) {
        await activateTab(existing.id);
        return;
    }

    // Read file content
    let content = '';
    try {
        content = await readTextFile(path);
    } catch (err) {
        toast.error(`Failed to read file: ${err}`);
        return;
    }

    // Open in store and activate
    await handleExternalFileOpen(path, content);
}

/** ===========================================
 * Save the active markdown file
=========================================== **/
export async function saveMarkdownFile({
    docId,
    isSaveAs = false
}: { docId?: string; isSaveAs?: boolean } = {}): Promise<void> {
    const doc = docId ? get(documents).get(docId) : get(activeDoc);
    if (!doc) {
        toast.error('No active document to save.');
        return;
    }

    let path = doc.path;

    // If "Save As" or no path, prompt
    if (!path || isSaveAs) {
        const newPath = await tauriSave({
            defaultPath: doc.path ?? 'Untitled.md',
            filters: [{ name: 'Markdown', extensions: ['md'] }]
        });

        if (!newPath) return; // user canceled
        path = newPath;
    }

    // Write file
    const savePromise = writeTextFile({ path, contents: doc.raw });

    toast.promise(
        savePromise.then(async () => {
            // Update store synchronously
            documents.update((docs) => {
                const d = docs.get(doc.id);
                if (!d) return docs;

                d.path = path;
                d.title = path.split("\\").pop()!;
                d.initialRaw = d.raw;
                d.isDirty = false;

                return docs;
            });
        }),
        {
            loading: 'Saving...',
            success: 'Save successful',
            error: (err) => `Error saving file: ${err}`
        }
    );
}
