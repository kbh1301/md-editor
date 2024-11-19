<script lang="ts">
    import { Button } from "$components";
    import { saveMarkdownFile } from "$lib/utils/fileHandler";
</script>

<Button variant="default" size="default" on:click={() => saveMarkdownFile({isNewFile: true})}>
    <span>New File...</span>
    <span class="sr-only">New File</span>
</Button>