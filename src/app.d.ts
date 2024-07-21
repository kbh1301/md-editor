// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import { type FileEntry } from '@tauri-apps/api/fs';

declare global {
    declare namespace App {}

    // TODO: delete
    // declare type Book = {
    //     name: string,
    //     path: string,
    //     hue: string,
    // }
    
    declare type AppSettings = {
        lightmode: boolean,
        mdTheme: string,
        startEditMode: boolean,
        horizontalEditor: boolean,
        toolbarHidden: boolean,
    }

    // declare type DirEntry = FileEntry & {
    //     fileType?: string;
    // }
}
