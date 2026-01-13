import { invoke } from '@tauri-apps/api/core';
import { readTextFile } from '@tauri-apps/plugin-fs';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
import { activateTab, handleExternalFileOpen } from '$utils/documentsHandler';
import { loadSettings } from "$utils/settingsHandler";
import { initKeydownListener } from "$utils/keybindHandler";
import { activeDoc } from "$lib/stores";
import { createNewDocument } from '$utils/documentsHandler'

const appWindow = getCurrentWebviewWindow()

export async function appStartup() {
    let openedAny = false;

    const windowLabel = appWindow.label;
    const isMainWindow = windowLabel === 'main';

    await appWindow.listen<string[]>('open-files', async (event) => {
        openedAny = true;

        for (const path of event.payload) {
            const content = await readTextFile(path);
            const id = await handleExternalFileOpen(path, content);
            await activateTab(id);
        }
    });
    await appWindow.emit(`window-ready:${windowLabel}`);

    // DEV: simulate opening initial files
    // Example .env variable: VITE_DEV_OPEN_FILES_JSON=["C:\\Users\\<User>\\File1.md","C:\\Users\\<User>\\File2.md"]
    if (import.meta.env.DEV && isMainWindow) {
        try {
            const files = JSON.parse(
                import.meta.env.VITE_DEV_OPEN_FILES_JSON ?? 'null'
            );

            if (Array.isArray(files)) {
                appWindow.emitTo('main', 'open-files', files);
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
    activeDoc.subscribe(async (doc) => {
        try {
            if (!doc) {
                await invoke('set_title', { windowLabel, title: 'md-editor' });
                return;
            }

            const fileName =
                doc.path?.split(/[/\\]/).pop() ??
                'Untitled.md';

            await invoke('set_title', { windowLabel, title: fileName });
        } catch (error) {
            console.error('Error setting window title:', error);
        }
    });

    // If no files were opened after a short delay, create a new document
    setTimeout(() => {
        if (!openedAny) {
            createNewDocument();
        }
    }, 1);
}