<script lang="ts">
    import { Button } from "$components";
    import Icon from '@iconify/svelte';

    export let parentElement: HTMLElement;
    let copied = false;

    function copyToClipboard() {
        const clipboardContent = parentElement.querySelector("code")?.textContent || '';
        navigator.clipboard.writeText(clipboardContent);

        // Set the copied state to true, then revert after 1 second
        copied = true;
        setTimeout(() => {
            copied = false;
        }, 1500);
    }

</script>

<Button
    class="sticky bottom-full left-[97%] -mt-8 -mr-4 p-2"
    variant="ghost"
    size="icon"
    on:click={copyToClipboard}
>
    {#if copied}
        <Icon icon="material-symbols:check" />
    {:else}
        <Icon icon="mage:copy" />
    {/if}
</Button>