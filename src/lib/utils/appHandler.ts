import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { listen } from "@tauri-apps/api/event";
import { closeTab } from "$utils/documentsHandler";
import { get } from "svelte/store";
import { documents } from "$lib/stores";
import type { DocId, MarkdownDoc } from "$lib/types";

// Queue to ensure windows are created sequentially
let windowCreationQueue: Promise<void> = Promise.resolve();

export async function moveTabToNewWindow(tabId: DocId) {
    const doc = get(documents).get(tabId);
    if (!doc) {
        console.error("Document not found for tabId:", tabId);
        return;
    }

    // Queue this window creation to ensure sequential creation
    windowCreationQueue = windowCreationQueue.then(async () => {
        await createWindowForTab(tabId, doc);
    }).catch((error) => {
        console.error("Error in window creation queue:", error);
    });

    return windowCreationQueue;
}

async function createWindowForTab(tabId: DocId, doc: MarkdownDoc) {
    if (!doc) return;

    const windowLabel = 'window_' + crypto.randomUUID();

    try {
        // Create new WebviewWindow
        const newWindow = new WebviewWindow(windowLabel, {
            url: "/",
            title: "md-editor",
            width: 1024,
            height: 768,
            minWidth: 600,
            minHeight: 400,
            resizable: true,
            decorations: false,
            shadow: true,
            fullscreen: false,
        });

        // Wait for the new window to be ready
        await new Promise<void>(async (resolve, reject) => {
            const unlisten = await listen<string>(`window-ready:${windowLabel}`, async (e) => {
                unlisten();
                resolve();
            });

            newWindow.once("tauri://error", reject);
        });

        // Send the document path to the new window to open the file
        await newWindow.emitTo(windowLabel, "open-files", [doc.path]);

        // Close the tab in the current window
        await closeTab(tabId);
    } catch (error) {
        console.error("Failed to move tab to new window:", error);
        throw error;
    }
}