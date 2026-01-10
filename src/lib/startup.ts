import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { appConfigDir } from '@tauri-apps/api/path';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { activateTab, handleExternalFileOpen } from '$utils/documentsHandler';
import { loadSettings } from "$utils/settingsHandler";
import { initKeydownListener } from "$utils/keybindHandler";
import { activeDoc } from "$lib/stores";
import { createNewDocument } from '$utils/documentsHandler'
const appWindow = getCurrentWebviewWindow()

export async function appStartup() {
    let openedAny = false;

    await listen<string[]>('open-files', async (event) => {
        openedAny = true;

        for (const path of event.payload) {
            const content = await readTextFile(path);
            const id = await handleExternalFileOpen(path, content);
            await activateTab(id);
        }
    });

    // DEV: simulate opening initial files
    // Example .env variable: VITE_DEV_OPEN_FILES_JSON=["C:\\Users\\<User>\\File1.md","C:\\Users\\<User>\\File2.md"]
    if (import.meta.env.DEV) {
        try {
            const files = JSON.parse(
                import.meta.env.VITE_DEV_OPEN_FILES_JSON ?? 'null'
            );

            if (Array.isArray(files)) {
                appWindow.emit('open-files', files);
            }
        } catch {
            console.warn('[DEV] Invalid VITE_DEV_OPEN_FILES_JSON');
        }
    }

    // Load settings file
    await loadSettings();

    // Initialize keybinds
    initKeydownListener();

    // Watch for changes in activeDoc and update the window title
    activeDoc.subscribe((doc) => {
        if (!doc) {
            invoke('tauri', { cmd: 'set_title', title: 'md-editor' });
            return;
        }

        const fileName =
            doc.path?.split(/[/\\]/).pop() ??
            'Untitled.md';

        invoke('tauri', { cmd: 'set_title', title: fileName });
    });

    // default to new document if no files opened
    setTimeout(() => {
        if (!openedAny) {
            createNewDocument();
        }
    }, 1);
}