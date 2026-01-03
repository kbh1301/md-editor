<script lang="ts">
    import { Button } from "$components";
    import { saveMarkdownFile } from "$utils/fileSystemHandler";
    import { activeDoc } from "$lib/stores";
    import { createEventDispatcher } from 'svelte';
    
    export let isSaveAs = false;
    
    const dispatch = createEventDispatcher();
    const label = isSaveAs ? 'Save As...' : 'Save';

    function handleClick() {
        saveMarkdownFile({ docId: $activeDoc?.id, isSaveAs });
        dispatch('done');
    }
</script>

<Button variant="default" size="default" on:click={handleClick}>
    <span>{label}</span>
    <span class="sr-only">{label}</span>
</Button>