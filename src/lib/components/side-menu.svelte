<script lang="ts">
	import { Button, Sheet, ThemeCombo } from "$components";
    import Icon from '@iconify/svelte';
    import { openMarkdownFile } from "$lib/utils/fileHandler";
    import LightSwitch from "./light-switch/light-switch.svelte";

	let open = false;

    async function openFileExplorer() {
        open = await openMarkdownFile();
    }
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button variant="toolbar" size="toolbar" builders={[builder]}>
            <Icon icon="mdi:menu" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="flex flex-col justify-between">
        <Sheet.Header>
            <Sheet.Title>Pile of Sheet</Sheet.Title>
            <Sheet.Description>
                GitHub link?
            </Sheet.Description>
        </Sheet.Header>
        
        <!-- Sheet Content -->
        <div class="flex-1">
            <Button variant="default" size="default" on:click={openFileExplorer}>
                <span>Open File...</span>
                <span class="sr-only">Open File</span>
            </Button>
        </div>

        <Sheet.Footer>
            <!-- Theme Selector -->
            <ThemeCombo />
            <!-- Dark Mode Toggle -->
            <LightSwitch />
        </Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>