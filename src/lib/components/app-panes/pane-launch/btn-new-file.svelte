<script lang="ts">
    import { Button } from "$components";
    import { createNewDocument } from "$utils/documentsHandler";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleClick() {
        createNewDocument();
        dispatch('done');
    }
</script>

<Button variant="default" size="default" on:click={handleClick}>
    <span>New File...</span>
    <span class="sr-only">New File</span>
</Button>