import { setModeCurrent, setModeUserPrefers, modeCurrent } from "$components/app-scaffolding/light-switch/light-switch.js";
import { exists, mkdir, writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { appSettings, editMode } from '$lib/stores';
import { get } from 'svelte/store';

const settingsFilePath = { baseDir: BaseDirectory.AppConfig };
const settingsFileName = 'settings.json';

/**
 * Calls createSettingsFile() if settings.json does not exist.
 * Otherwise, sets appSettings store with settings.json content.
 */
export async function loadSettings() {

    // If settings.json does not exist, create it
    const settingsFileExists = await exists(settingsFileName, settingsFilePath);
    if (!settingsFileExists) return await createSettingsFile();

    // Set appSettings store with existing settingsFile contents
    const settingsFileContents = await readTextFile(settingsFileName, settingsFilePath);

    try {
        appSettings.set(JSON.parse(settingsFileContents));
    } catch(ex) {
        console.error(ex);
    }

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

    // Overwrite settings.json whenever appSettings store value is updated
    // TODO: Debounce
    appSettings.subscribe(async () => {
        await writeToSettingsFile();
    });
}

/**
 * Create a settings file in $AppConfig path if it doesn't already exist.
 * 
 * Default path: 'C:\Users\{username}\AppData\Roaming\{appname}\settings.json'
 */
async function createSettingsFile() {

    // If $AppConfig path does not exist, create it
    const configFolderExists = await exists('', settingsFilePath);
    if (!configFolderExists) await mkdir('', { baseDir: settingsFilePath.baseDir, recursive: true });

    await writeToSettingsFile();
}

/**
 * Creates or overwrites settings.json with appSettings store value
 */
async function writeToSettingsFile() {

    await writeTextFile(
        settingsFileName,
        JSON.stringify(get(appSettings)),
        settingsFilePath
    );
}

/**
 * Set light/dark mode in settings file.
 * @param isLightMode 
 */
export async function toggleLightMode(isLightMode: boolean) {
    appSettings.update(val => {
        val.lightmode = isLightMode;
        return val;
    });
}

export function fontDecrease() {
    appSettings.update(appSettings => {
        appSettings.fontSize = Math.max(6, appSettings.fontSize - 2);
        return appSettings;
    });
}

export function fontIncrease() {
    appSettings.update(appSettings => {
        appSettings.fontSize = Math.min(50, appSettings.fontSize + 2);
        return appSettings;
    });
}

export function fontReset() {
    appSettings.update(appSettings => {
        appSettings.fontSize = 16;
        return appSettings;
    });
}