import { get, writable, type Writable } from 'svelte/store';
import { getModeOsPrefers } from '../components/light-switch/light-switch';

export const appSettings:Writable<AppSettings> = writable({
    lightmode: getModeOsPrefers(),
    mdTheme: 'github-md.min.css',
    startEditMode: false,
});

// TODO: delete
// export const openedPagePath = writable('C:\\Users\\Kyle\\Downloads\\Codex\\lorem.md');
export const openedPagePath = writable('');

export const rawMarkdown:Writable<string> = writable('');
export const compiledMarkdown:Writable<string|Promise<string>> = writable('');

export const editMode = writable(get(appSettings).startEditMode);

export const isUnsaved = writable(false);