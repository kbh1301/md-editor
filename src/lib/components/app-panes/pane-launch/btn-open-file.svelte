<script lang="ts">
    import { Button } from "$components";
    import { openMarkdownFile } from "$lib/utils/fileHandler";
</script>

<Button variant="default" size="default" on:click={() => openMarkdownFile()}>
    <span>Open File...</span>
    <span class="sr-only">Open File</span>
</Button>