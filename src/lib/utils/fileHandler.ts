import { open as tauriOpen, save as tauriSave} from '@tauri-apps/api/dialog';
import { writeTextFile } from '@tauri-apps/api/fs';
import { openedPagePath, rawMarkdown, isUnsaved, initRawMarkdown } from "$lib/utils/stores";
import { setCompiledMarkdown } from '$lib/utils/markdownParsing';
import { get } from 'svelte/store';
import { toast } from 'svelte-sonner';

/**
 * Opens a markdown file using a file picker dialog. If a file is selected, it sets the file path and compiles the markdown content.
 *
 * @returns {Promise<boolean>} A promise that resolves to `true` if no file is selected, and `false` if a file is successfully opened.
 */
export async function openMarkdownFile(): Promise<boolean> {
    let isFileSelected = false;

    const filePath = await tauriOpen({
        filters: [{
            name: 'Markdown Files',
            extensions: ['md']
        }]
    });

    if (filePath && typeof filePath === 'string') {
        openedPagePath.set(filePath);
        setCompiledMarkdown(filePath);
        isFileSelected = true;
    }

    return !isFileSelected;
}

/**
 * Saves the current markdown file. If no path is available or `isSaveAs` is true, 
 * prompts the user to select a file path. The file is then written to disk.
 * 
 * @param {Object} [options] - The options object.
 * @param {boolean} [options.isSaveAs=false] - If true, prompts the user to "Save As" instead of overwriting.
 * @returns {Promise<void>} - A promise that resolves when the file is saved or the operation is canceled.
 */
export async function saveMarkdownFile({isSaveAs = false}: { isSaveAs?: boolean; } = {}): Promise<void> {
    let path = get(openedPagePath);
    let saveFilePromise;

    if (!get(isUnsaved)) return;

    if(!path || isSaveAs) {
        const newPath = await tauriSave({
            filters: [{
                name: 'Markdown',
                extensions: ['md']
            }]
        });

        if (newPath) {
            openedPagePath.set(newPath);
            path = get(openedPagePath);
        } else {
            return;
        }
    }

    saveFilePromise = new Promise((resolve, reject) => {
        writeTextFile({
            path: path,
            contents: get(rawMarkdown)
        })
        .then(() => resolve({ message: "Save successful" }))
        .catch(reject);
    });

    interface SaveFileSuccess { message: string; }
    interface SaveFileError { message: string; }
    toast.promise(saveFilePromise, {
        loading: 'Saving...',
        success: (data) => {
            initRawMarkdown.set(
                get(rawMarkdown)
            );
            isUnsaved.set(false);
            return (data as SaveFileSuccess).message
        },
        error: (error) => {
            return (error as SaveFileError).message || 'Error while saving...';
        }
    });
}