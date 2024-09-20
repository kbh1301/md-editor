import { invoke } from '@tauri-apps/api/tauri';
import { get } from 'svelte/store';
import { openedPagePath, appSettings, editMode } from "$lib/utils/stores";
import { setCompiledMarkdown } from '$lib/components/app-panes/pane-preview/markdownParsing';
import { loadSettings, toggleLightMode } from "$utils/settingsHandler";
import { initKeydownListener } from "$utils/keybindHandler";
import { setModeCurrent, setModeUserPrefers, modeCurrent } from "$components/app-scaffolding/light-switch/light-switch.js";

export async function appInitialize() {
    // If opened from md file, open md file
    await launchFromFile();

    // Load settings file
    await loadSettings();

    // Set edit mode based on settings file
    editMode.set(get(appSettings).startEditMode);

    // Set theme based on settings file
    const lightmode = get(appSettings).lightmode;
    modeCurrent.set(lightmode);

    // Sync lightswitch with the theme
    if (!('modeCurrent' in localStorage)) {
        setModeCurrent(lightmode);
    }
    setModeUserPrefers(lightmode);
    setModeCurrent(lightmode);
    toggleLightMode(lightmode);

    // Initialize keybinds
    initKeydownListener();
}

/**
 * Checks if the application was opened via a `.md` file by invoking the backend method
 * `get_filepath`. If a valid file path is returned, it sets the `openedPagePath` to the file path and 
 * updates the compiled Markdown content using the current file path.
 * 
 * @returns {Promise<void>} A promise that resolves when the file path has been retrieved and the Markdown content is set.
 */
async function launchFromFile(): Promise<void> {
    // Call to backend; If application opened via .md file, set openedPagePath
    await invoke('get_filepath').then((message) => {
        if (message) { openedPagePath.set(message as string); }
    });

    setCompiledMarkdown(get(openedPagePath));
}