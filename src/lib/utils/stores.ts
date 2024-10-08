import { get, writable, type Writable } from 'svelte/store';
import { getModeOsPrefers } from '$lib/components/app-scaffolding/light-switch/light-switch';

export const appSettings:Writable<AppSettings> = writable({
    lightmode: getModeOsPrefers(),
    mdTheme: 'github-md.min.css',
    startEditMode: false,
    toolbarHidden: false,
    fontSize: 16,
});

// TODO: delete
// export const openedPagePath = writable(process.env.NODE_ENV === 'production' ? '' : 'C:\\Users\\Kyle\\Downloads\\Codex\\lorem.md');
export const openedPagePath = writable(process.env.NODE_ENV === 'production' ? '' : 'C:\\Users\\Kyle\\Downloads\\Codex\\Onboarding Notes.md');

export const initRawMarkdown:Writable<string> = writable('');
export const rawMarkdown:Writable<string> = writable('');
export const compiledMarkdown:Writable<string|Promise<string>> = writable('');

export const editMode = writable(get(appSettings).startEditMode);

export const isUnsaved = writable(false);

export const isSyncing = writable(false);