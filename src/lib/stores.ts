import { get, writable, derived } from 'svelte/store';
import { getModeOsPrefers } from '$lib/components/app-scaffolding/light-switch/light-switch';
import type { DocId, MarkdownDoc } from '$lib/types';

export const appSettings = writable({
    lightmode: getModeOsPrefers(),
    mdTheme: 'github-md.min.css',
    startEditMode: false,
    toolbarHidden: false,
    fontSize: 16,
});
export const editMode = writable(get(appSettings).startEditMode);
export const isSyncing = writable(false);

export const documents = writable<Map<DocId, MarkdownDoc>>(new Map());
export const activeDocId = writable<DocId | null>(null);
export const activeDoc = derived(
    [documents, activeDocId],
    ([$docs, $id]) => ($id ? $docs.get($id) ?? null : null)
);