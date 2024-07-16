<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Button, SideMenu, Switch, Label } from "$components";
    import { editMode, openedPagePath } from '$lib/utils/stores';
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
    <!-- LEFT CONTENT -->
    <div class="flex gap-2">
        <span title="Menu">
            <SideMenu />
        </span>

        <div class="flex items-center gap-2">
            <Switch id="editmode-switch" bind:checked={$editMode} title="Toggle Edit" class="data-[state=checked]:bg-muted-foreground" />
            <span class="sr-only">Toggle Edit</span>
            <!-- <Label for="editmode-switch">Edit</Label> -->
        </div>
    </div>

    <!-- CENTER CONTENT -->
    <div class="flex items-center gap-10" data-tauri-drag-region>
        <small class="text-sm font-medium leading-none pointer-events-none">
            {$openedPagePath}
        </small>
    </div>

    <!-- RIGHT CONTENT -->
    <div class="flex">
        <Button variant="toolbar" size="toolbar" on:click={minimize} title="Minimize">
            <Icon icon="mdi:minus" />
			<span class="sr-only">Minimize</span>
		</Button>

        <Button variant="toolbar" size="toolbar" on:click={toggleMaximize} title="Maximize">
            <Icon icon={isMaximized ? "mdi:window-restore" : "mdi:window-maximize"} />
			<span class="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
		</Button>

        <Button variant="toolbar" size="toolbar" on:click={close} title="Close">
            <Icon icon="mdi:close" />
			<span class="sr-only">Close</span>
		</Button>
    </div>
</header>
