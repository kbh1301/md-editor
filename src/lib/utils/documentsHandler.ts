import { get } from 'svelte/store';
import { compileMarkdown } from '$lib/components/app-panes/pane-preview/markdownParsing';
import { documents, activeDocId, editMode } from '$lib/stores';
import type { DocId, MarkdownDoc } from '$lib/types';

export function findDocByPath(path: string): MarkdownDoc | null {
    for (const doc of get(documents).values()) {
        if (doc.path === path) return doc;
    }
    return null;
}

export async function handleExternalFileOpen(path: string, content: string) {
    // If file already open, focus tab
    const existing = findDocByPath(path);
    if (existing) {
        await activateTab(existing.id);
        return existing.id;
    }

    const id = crypto.randomUUID(); // internal store ID

    documents.update((docs) => {
        docs.set(id, {
            id,
            path,
            title: path?.split("\\").pop() ?? "Untitled",
            raw: content,
            initialRaw: content,
            compiled: null,
            isDirty: false,
            lastCompiledHash: null,
            lastAccessed: Date.now(),
        });
        return docs;
    });

    // TODO: consider if activeTab should not be called here; maybe leave to caller
    await activateTab(id);
    return id;
}

export function hash(input: string): string {
    let h = 0x811c9dc5; // FNV-1a offset basis

    for (let i = 0; i < input.length; i++) {
        h ^= input.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }

    // convert to unsigned hex string
    return (h >>> 0).toString(16);
}

let activeCompileToken = 0;

async function compileDoc(docId: string) {
    const token = ++activeCompileToken;

    const doc = get(documents).get(docId);
    if (!doc) return;

    const rawHash = hash(doc.raw);
    if (doc.compiled && doc.lastCompiledHash === rawHash) return;

    const result = await compileMarkdown(doc.raw);
    if (token !== activeCompileToken) return;

    documents.update((docs) => {
        const d = docs.get(docId);
        if (!d) return docs;

        d.compiled = result;
        d.lastCompiledHash = rawHash;
        return docs;
    });
}

export async function activateTab(docId: string) {
    activeDocId.set(docId);

    documents.update((docs) => {
        const doc = docs.get(docId);
        if (doc) doc.lastAccessed = Date.now();
        return docs;
    });

    await compileDoc(docId);
}


export async function closeTab(docId: DocId) {
    let nextActiveId: DocId | null = null;
    const wasActive = get(activeDocId) === docId;

    documents.update((docs) => {
        docs.delete(docId);

        if (wasActive && docs.size > 0) {
            nextActiveId =
                [...docs.values()]
                    .sort((a, b) => b.lastAccessed - a.lastAccessed)[0].id;
        }

        return docs;
    });

    // invalidate in-flight compile work
    activeCompileToken++;

    if (!wasActive) return;

    if (nextActiveId) {
        await activateTab(nextActiveId);
    } else {
        activeDocId.set(null);
    }
}


let compileTimeout: NodeJS.Timeout | null = null;

export function onRawChange(newRaw: string, docId: string) {
    let shouldCompile = false;

    documents.update((docs) => {
        const doc = docs.get(docId);
        if (!doc) return docs;

        doc.raw = newRaw;
        doc.isDirty = doc.raw !== doc.initialRaw;

        if (get(activeDocId) === docId) shouldCompile = true;

        return docs;
    });

    if (!shouldCompile) return;

    if (compileTimeout) clearTimeout(compileTimeout);
    compileTimeout = setTimeout(() => compileDoc(docId), 300);
}

export async function createNewDocument() {
    const id = crypto.randomUUID();

    // Find a unique untitled name
    const existingTitles = new Set(
        [...get(documents).values()]
            .map(d => d.title)
    );

    let newTitle = "Untitled.md";
    let i = 2;
    while (existingTitles.has(newTitle)) {
        newTitle = `Untitled ${i++}.md`;
    }

    documents.update(docs => {
        docs.set(id, {
            id,
            path: null,
            title: newTitle,
            raw: "",
            initialRaw: "",
            compiled: null,
            isDirty: false,
            lastCompiledHash: null,
            lastAccessed: Date.now(),
        });
        return docs;
    });

    await activateTab(id);
    editMode.set(true);
    return id;
}
