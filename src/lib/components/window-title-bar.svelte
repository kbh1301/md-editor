<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Button, SideMenu, Switch, Label } from "$components";
    import { editMode } from '$lib/utils/stores';
    import { appWindow } from '@tauri-apps/api/window';
    const { minimize, toggleMaximize, close } = appWindow;

    let isMaximized = false;

    appWindow.onResized(async () => {
        isMaximized = await appWindow.isMaximized();
    });
</script>

<!-- TODO: fix a11y below -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<header
    class="supports-[backdrop-filter]:bg-background/60 flex justify-between top-0 left-0 right-0 select-none h-10 bg-background/95 border-b border-foreground/30 backdrop-blur"
    data-tauri-drag-region
>
    <div class="flex">
        <SideMenu />
    </div>

    <div class="flex items-center gap-10">
        <div class="flex items-center gap-1">
            <Label for="editmode-switch">Edit Mode</Label>
            <Switch id="editmode-switch" bind:checked={$editMode} />
        </div>
    </div>

    <div class="flex">
        <Button variant="toolbar" size="toolbar" on:click={minimize}>
            <Icon icon="mdi:minus" />
			<span class="sr-only">Minimize</span>
		</Button>

        <Button variant="toolbar" size="toolbar" on:click={toggleMaximize}>
            <Icon icon={isMaximized ? "mdi:window-restore" : "mdi:window-maximize"} />
			<span class="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
		</Button>

        <Button variant="toolbar" size="toolbar" on:click={close}>
            <Icon icon="mdi:close" />
			<span class="sr-only">Close</span>
		</Button>
    </div>
</header>
