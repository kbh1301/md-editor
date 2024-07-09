import { exists, createDir, writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/api/fs';
import { appSettings } from '$lib/utils/stores';
import { get } from 'svelte/store';

const settingsFilePath = { dir: BaseDirectory.AppConfig };
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
    appSettings.set(JSON.parse(settingsFileContents));

    // Overwrite settings.json whenever appSettings store value is updated
    appSettings.subscribe(async () => {
        await writeToSettingsFile();
    });
}

/**
 * Create a settings file in $AppConfig path if it doesn't already exist.
 * 
 * Default path: 'C:\Users\{username}\AppData\Roaming\com.{appname}\settings.json'
 */
async function createSettingsFile() {

    // If $AppConfig path does not exist, create it
    const configFolderExists = await exists('', settingsFilePath);
    if (!configFolderExists) await createDir('', settingsFilePath);

    await writeToSettingsFile();
}

/**
 * Creates or overwrites settings.json with appSettings store value
 */
export async function writeToSettingsFile() {

    await writeTextFile(
        {
            path: settingsFileName,
            contents: JSON.stringify(get(appSettings))
        },
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

// TODO: document
/**
 * 
 * @param themeFileName 
 */
export async function loadTheme() {
    const themeFileName = get(appSettings).mdTheme;

    //Remove any previously loaded theme
    const existingLink = document.getElementById('dynamic-md-theme');
    if (existingLink) {
        existingLink.remove();
    }

    // Read content of theme css file
    const themeFileContents = await readTextFile('themes-md\\' + themeFileName, settingsFilePath);

    // Create a new style element to load the new theme
    const style = document.createElement('style');
    style.id = 'dynamic-md-theme';
    style.textContent = themeFileContents;
    document.head.appendChild(style);
}

// TODO: Delete
// /**
//  * Open native explorer window then:
//  * 1. Add selected directory to appSettings.library
//  * 2. Open newly selected book
//  */
// export async function addBookToLibrary() {
//     const selected = await open({
//         directory: true,
//         multiple: false,
//         recursive: true,
//         defaultPath: BaseDirectory.Home.toString(),
//     });

//     if(!selected) return;
//     else {
//         const path = selected.toString();
//         const name = path.substring(path.lastIndexOf('\\') + 1);

//         // add book to library
//         appSettings.update(val => {
//             val.library.push(
//                 {
//                     name,
//                     path,
//                     hue: "218"
//                 }
//             )
    
//             return val;
//         });

//         // set openedBook to newly added book
//         const library = get(appSettings).library;
//         // return openedBook.set(library[library.length - 1]);
//     }
// }