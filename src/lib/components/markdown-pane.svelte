<script lang="ts">
    import { fade } from 'svelte/transition';
    import { openMarkdownFile } from "$lib/utils/fileHandler";
    import { compiledMarkdown, editMode, isUnsaved, openedPagePath, rawMarkdown } from "$lib/utils/stores";
    import { Button, CodeMirror } from "$components";
    import { saveMarkdownFile } from "$lib/utils/fileHandler";
    import ScrollArea from './ui/scroll-area/scroll-area.svelte';
</script>

<!-- TODO: setting for horizontal split (flex-col-reverse) -->
<!-- TODO: setting for inline markdown editor -->
<!-- TODO: setting for Textarea on:change (or keyup or something) to save changes to rawMarkdown after a time -->
<div class="flex flex-1 h-full overflow-hidden gap-4 pt-4 justify-around">
    <!-- Markdown Editor Pane -->
    {#if $editMode}
        <div class="flex flex-col flex-[1_1_50%] gap-4 max-w-[980px]" transition:fade>
            <!-- Raw Markdown Textarea -->
            <CodeMirror />

            <!-- Save Button -->
            {#if $isUnsaved}
                <div class="flex w-full gap-4 justify-center">
                    {#if $openedPagePath}
                        <div class="flex justify-center" transition:fade>
                            <Button on:click={() => saveMarkdownFile()}>Save</Button>
                        </div>
                    {/if}
                    <div class="flex justify-center" transition:fade>
                        <Button on:click={() => saveMarkdownFile({isSaveAs: true})}>Save As...</Button>
                    </div>
                </div>
            {/if}
        </div>
    {/if}

    <ScrollArea class="markdown-body relative box-border min-w-[200px] max-w-[980px] my-0 p-[45px] overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]" orientation="both">
        {#if $rawMarkdown === ''}
            <div class="flex w-full h-full justify-center">
                <Button variant="muted" size="default" on:click={openMarkdownFile}>
                    <span>Open File...</span>
                    <span class="sr-only">Open File</span>
                </Button>
            </div>
        {:else}
            {@html $compiledMarkdown}
        {/if}
    </ScrollArea>
</div>
