<script lang="ts">
    import { openMarkdownFile } from "$lib/utils/fileHandler";
    import { compiledMarkdown, editMode, rawMarkdown } from "$lib/utils/stores";
    import { Button, CodeMirror, ScrollArea } from "$components";
    import { afterUpdate } from 'svelte';

    let previewViewport: HTMLElement;
    let editorViewport: HTMLElement;
    let isSyncing = false;

    function syncScroll(source: HTMLElement, target: HTMLElement) {
        if (isSyncing) return;
        isSyncing = true;
        
        const offsetTop = source.scrollTop / (source.scrollHeight - source.clientHeight);
        target.scrollTop = offsetTop * (target.scrollHeight - target.clientHeight);

        requestAnimationFrame(() => {
            isSyncing = false;
        });
    }

    function addScrollSyncListeners() {
        if (!previewViewport || !editorViewport) return;

        const handleEditorScroll = () => syncScroll(editorViewport, previewViewport);
        const handlePreviewScroll = () => syncScroll(previewViewport, editorViewport);

        editorViewport.addEventListener('scroll', handleEditorScroll);
        previewViewport.addEventListener('scroll', handlePreviewScroll);

        syncScroll(previewViewport, editorViewport);
    }

    afterUpdate(() => {
        addScrollSyncListeners();
    });
</script>

<div class="grid grid-flow-col grid-cols-[1fr]">
    <div class="flex flex-col-reverse items-center flex-1 h-full overflow-hidden gap-4 pt-4 justify-around lg:flex-row lg:items-stretch">
        <!-- Markdown Editor Pane -->
        {#if $editMode}
            <CodeMirror bind:scrollViewport={editorViewport} />
        {/if}

        <!-- Compiled Markdown Preview Pane -->
        {#if $rawMarkdown === ''}
            <div class="markdown-body flex flex-col items-center justify-center box-border w-full min-w-[200px] max-w-[980px] my-0 p-[45px] overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]">
                <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl !mb-10">md-editor</h1>
                <Button variant="muted" size="default" on:click={openMarkdownFile}>
                    <span>Open File...</span>
                    <span class="sr-only">Open File</span>
                </Button>
            </div>
        {:else}
            <ScrollArea
                class="markdown-body relative box-border w-full min-w-[200px] max-w-[980px] my-0 p-[45px] overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]"
                orientation="both"
                bind:viewportElement={previewViewport}
            >
                    {@html $compiledMarkdown}
            </ScrollArea>
        {/if}
    </div>
</div>