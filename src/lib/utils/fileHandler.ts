import { open as tauriOpen} from '@tauri-apps/api/dialog';
import { exists, createDir, writeTextFile, renameFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { openedPagePath, rawMarkdown } from "$lib/utils/stores";
import { setCompiledMarkdown } from '$lib/utils/markdownParsing';
import { get } from 'svelte/store';
import { toast } from 'svelte-sonner';

// TODO: add documentation
/**
 * 
 * @returns 
 */
export async function launchFromFile() {
    // TODO: when app is opened from .md file, set openedPagePath here

    // Loads file if available
    if(get(openedPagePath)) {
        setCompiledMarkdown(get(openedPagePath));
    }
}

// TODO: add documentation
/**
 * 
 * @returns 
 */
export async function openMarkdownFile() {
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

// TODO: add documentation
/**
 * 
 * @returns 
 */
export async function saveMarkdownFile() {
    const fileExists = await exists(get(openedPagePath));
    if(!fileExists) return;

    interface SaveFileSuccess {
        message: string;
    }

    const saveFilePromise = new Promise((resolve, reject) => {
        writeTextFile({
            path: get(openedPagePath),
            contents: get(rawMarkdown)
        })
        .then(() => resolve({ message: "Save successful" }))
        .catch(reject);
    });
    
    toast.promise(saveFilePromise, {
        loading: 'Saving...',
        success: (data) => (data as SaveFileSuccess).message,
        error: 'Error while saving...'
    });

    // TODO: delete
    // try {
    //     await writeTextFile({
    //         path: get(openedPagePath),
    //         contents: get(rawMarkdown)
    //     });
    //     toast.success("Save successful...");
    // } catch(e) {
    //     console.error(e);
    //     toast.error("Error while saving...");
    // }
}

// TODO: delete
// /**
//  * 
//  * @param dirEntry 
//  */
// export async function renameDirEntry(dirEntry: DirEntry, newName: string) {
//     const { name, path: filePath } = dirEntry;

//     const fileExists = await exists(filePath);
//     if(!fileExists || !name) return;

//     const newFilePath = filePath.replace(name, newName);

//     try {
//         await renameFile(filePath, newFilePath);
//     } catch (e) {
//         console.error(e);
//     }
// }