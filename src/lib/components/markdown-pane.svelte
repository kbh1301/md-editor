<script lang="ts">
    import { rawMarkdown, compiledMarkdown, editMode } from "$lib/utils/stores";
    import { Button, TextareaMd } from "$components";
	import { saveMarkdownFile } from "$lib/utils/fileHandler";
    import { onMount } from "svelte";
    import { wait } from "$lib/utils";

    let textarea: TextareaMd;
    // let rows = [];

    // // Watch for changes in $rawMarkdown and update rows accordingly
    // $: {
    //     if ($rawMarkdown) {
    //     rows = parseMarkdownTableRows($rawMarkdown);
    //     }
    // }

    // function parseMarkdownTableRows(textareaValue) {
    //     const rows = textareaValue.split('\n');
    //     const markdownTableRows = rows.filter(row => /^\|\s.*\s\|$/.test(row.trim()));
    //     return markdownTableRows;
    // }

    // function renderRowsWithDragHandles(rows) {
    //     return rows.map((row, index) => {
    //         return `
    //         <div class="row">
    //             <div class="drag-handle">☰</div> <!-- Example handle, customize as needed -->
    //             ${row}
    //         </div>
    //         `;
    //     }).join('');
    // }

    // onMount(async () => {
    //     await wait(100)
    //     rows = parseMarkdownTableRows($rawMarkdown)
    //     renderRowsWithDragHandles(rows)
    //     console.log(rows)
    // })

</script>



<!-- TODO: setting for horizontal split (flex-col-reverse) -->
<!-- TODO: setting for inline markdown editor -->
<!-- TODO: setting for Textarea on:change (or keyup or something) to save changes to rawMarkdown after a time -->
<div class="flex flex-1 h-full overflow-hidden gap-4 pt-4 justify-around">
    <!-- Markdown Editor Pane -->
    {#if $editMode}
        <div class="flex flex-col flex-[1_1_50%] gap-4 max-w-[980px]">
            <!-- Raw Markdown Textarea -->
            <TextareaMd
                class="flex-1 resize-none rounded-lg"
                style="box-shadow: none;"
                bind:this={textarea}
                bind:value={$rawMarkdown}
                placeholder="Write markdown here"
                spellcheck="true"
            />

            <!-- Save Button -->
            <div class="flex justify-center">
                <Button on:click={saveMarkdownFile}>
                    Save
                </Button>
            </div>
        </div>
    {/if}

    <div class="markdown-body overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]">
        {@html $compiledMarkdown}
    </div>
</div>



<style lang="postcss">
    .markdown-body {
        @apply box-border min-w-[200px] max-w-[980px] my-0 p-[45px]
    }
</style>