<script lang="ts">
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import { WindowTitleBar, Toaster } from "$components";
    import "$root/app.postcss";
    import "$root/markdown.postcss";
    
    import { appInitialize } from "$root/lib/utils/appInitialize.js";

    export let data;
    
    onMount(async () => {
        await appInitialize();
    });
</script>

<div class="relative grid grid-rows-[auto_1fr] h-screen overflow-hidden border border-black/40 bg-secondary" id="window-grid">
    <WindowTitleBar />

    {#key data.url}
        <div
            id="page-transition-wrapper"
            class="grid grid-rows-1 grid-cols-1 overflow-hidden mx-4 mb-4"
            in:fly={{ y: -50, duration: 250, delay: 300 }}
            out:fly={{ y: -50, duration: 250 }}
        >
            <slot />
        </div>
    {/key}
</div>

<Toaster richColors position="bottom-right" />