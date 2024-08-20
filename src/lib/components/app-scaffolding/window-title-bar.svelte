<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Button, SideMenu, SwitchEdit } from "$components";
    import { editMode, openedPagePath } from '$utils/stores';
    import { appWindow } from '@tauri-apps/api/window';
    const { minimize, toggleMaximize, close } = appWindow;

    let isMaximized = false;
    appWindow.onResized(async () => {
        isMaximized = await appWindow.isMaximized();
    });

    let isFocused = true;
    appWindow.onFocusChanged(async ({ payload: focused }) => {
        isFocused = focused;
    });
    $: textFocusClass = isFocused ? 'text-foreground' : 'text-foreground/50';
</script>

<header
    class="flex justify-between top-0 left-0 right-0 max-w-[100vw] select-none h-10 bg-secondary {textFocusClass}"
    data-tauri-drag-region
>
    <!-- LEFT CONTENT -->
    <div class="flex gap-2">
        <span title="Menu">
            <SideMenu />
        </span>

        <div class="flex items-center gap-2">
            <SwitchEdit id="editmode-switch" bind:checked={$editMode} title="Toggle Edit" class="data-[state=checked]:bg-primary" />
            <span class="sr-only">Toggle Edit</span>
        </div>
    </div>

    <!-- CENTER CONTENT -->
    <small
        class="text-sm font-medium leading-none whitespace-nowrap text-ellipsis overflow-hidden px-10 content-center"
        style="direction: rtl"
        title={$openedPagePath}
        data-tauri-drag-region
    >
        {$openedPagePath}
    </small>

    <!-- RIGHT CONTENT -->
    <div class="flex">
        <Button class="{textFocusClass}" variant="toolbar" size="toolbar" on:click={minimize} title="Minimize">
            <Icon icon="mdi:minus" />
			<span class="sr-only">Minimize</span>
		</Button>

        <Button class="{textFocusClass}" variant="toolbar" size="toolbar" on:click={toggleMaximize} title="Maximize">
            <Icon icon={isMaximized ? "mdi:window-restore" : "mdi:window-maximize"} />
			<span class="sr-only">{isMaximized ? "Restore" : "Maximize"}</span>
		</Button>

        <Button class="{textFocusClass}" variant="toolbar" size="toolbar" on:click={close} title="Close">
            <Icon icon="mdi:close" />
			<span class="sr-only">Close</span>
		</Button>
    </div>
</header>
