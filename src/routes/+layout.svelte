<script lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
    import { onDestroy, onMount } from "svelte";
    import { launchFromFile } from "$utils/fileHandler";
    import { loadSettings, toggleLightMode } from "$utils/settingsHandler";
    import { fly } from 'svelte/transition';
    import { WindowTitleBar, Toaster } from "$components";
    import "$root/app.postcss";
    import "$root/markdown.postcss";
    import { setModeCurrent, setModeUserPrefers, modeCurrent } from "$components/app-scaffolding/light-switch/light-switch.js";
    import { appSettings, editMode, openedPagePath } from "$utils/stores";
    import { initKeydownListener, removeKeydownListener } from "$utils/keybindHandler";

    export let data;
    let lightmode: boolean;
    
    // TODO: move this to a more appropriate place where code loads before app?
    onMount(async () => {
        // Call to backend; If application opened via .md file, set openedPagePath
        invoke('get_filepath').then((message) => {
            if (message) { openedPagePath.set(message as string); }
        });

        // load settings and file on initialization
        await loadSettings();
        await launchFromFile();

        // initialize keybind listener
        initKeydownListener();

        $editMode = $appSettings.startEditMode;

        // TODO: move this and rework light-switch.svelte?
        lightmode = $appSettings.lightmode;
        $modeCurrent = lightmode;

		// Sync lightswitch with the theme
		if (!('modeCurrent' in localStorage)) {
			setModeCurrent(lightmode);
		}

        setModeUserPrefers($modeCurrent);
		setModeCurrent($modeCurrent);
        toggleLightMode($modeCurrent);
    });

    onDestroy(() => {
        // remove keybind listener
        removeKeydownListener();
    })
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