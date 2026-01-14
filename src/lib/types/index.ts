export type DocId = string;
export interface MarkdownDoc {
    id: DocId;

    // file info
    path: string | null;
    title: string | null;

    // content
    initialRaw: string;
    raw: string;

    // compiled content
    compiled: string | null;

    // state
    isDirty: boolean;
    lastCompiledHash: string | null;

    // perf flags
    lastAccessed: number;

    // pin state
    isPinned: boolean;
}