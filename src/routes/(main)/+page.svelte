<script lang="ts">
	import { fade } from 'svelte/transition';
    import { openMarkdownFile } from "$lib/utils/fileHandler";
    import { appSettings, compiledMarkdown, editMode, isUnsaved, openedPagePath, rawMarkdown } from "$lib/utils/stores";
    import { Button, CodeMirror, ScrollArea } from "$components";
    import { saveMarkdownFile } from "$lib/utils/fileHandler";
</script>

<div class="grid grid-flow-col grid-cols-[1fr]">
    <div
        class="flex flex-1 h-full overflow-hidden gap-4 pt-4 justify-around"
        class:flex-col-reverse={$appSettings.horizontalEditor}
        class:items-center={$appSettings.horizontalEditor}
    >
        <!-- Markdown Editor Pane -->
        {#if $editMode}
            <div
                class="flex flex-col flex-[1_1_50%] w-full max-w-[980px] overflow-auto"
                transition:fade
            >
                <!-- Raw Markdown Textarea -->
                <CodeMirror />

                <!-- Save Button -->
                {#if $isUnsaved}
                    <div class="flex w-full gap-4 justify-center mt-4" transition:fade>
                        {#if $openedPagePath}
                            <div class="flex justify-center">
                                <Button on:click={() => saveMarkdownFile()}>Save</Button>
                            </div>
                        {/if}
                        <div class="flex justify-center">
                            <Button on:click={() => saveMarkdownFile({isSaveAs: true})}>Save As...</Button>
                        </div>
                    </div>
                {/if}
            </div>
        {/if}

        

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
            >
                    {@html $compiledMarkdown}
            </ScrollArea>
        {/if}
    </div>
</div>