<script lang="ts">
    import { Button } from "$components";
    import { openMarkdownFile } from "$utils/fileSystemHandler";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleClick() {
        openMarkdownFile();
        dispatch('done');
    }
</script>

<Button variant="default" size="default" on:click={handleClick}>
    <span>Open File...</span>
    <span class="sr-only">Open File</span>
</Button>