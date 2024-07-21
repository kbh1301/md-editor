<script lang="ts">
	import { Button, Sheet, ThemeCombo, Label, Switch } from "$components";
    import Icon from '@iconify/svelte';
    import { openMarkdownFile } from "$lib/utils/fileHandler";
    import LightSwitch from "./light-switch/light-switch.svelte";
    import { appSettings } from "$utils/stores";
    import { writeToSettingsFile } from "$utils/settingsHandler";

	let open = false;

    function handleSettingsFileUpdate() {
        writeToSettingsFile();
    }

    async function openFileExplorer() {
        open = await openMarkdownFile();
    }

    // Styles
    const sectionStyles = "flex flex-col sm:flex-col items-center gap-1 bg-muted rounded-lg p-4";
    const labelStyles = "flex items-center gap-2 w-full justify-between";
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger asChild let:builder>
		<Button variant="toolbar" size="toolbar" builders={[builder]}>
            <Icon icon="mdi:menu" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="flex flex-col justify-between">
        <!-- SHEET HEADER -->
        <Sheet.Header>
            <Sheet.Title>
                
            </Sheet.Title>
            <Sheet.Description>
                
            </Sheet.Description>
        </Sheet.Header>
        
        <!-- SHEET CONTENT -->
        <div class="flex flex-col h-full gap-10 justify-evenly">
            <!-- MENU SECTION -->
            <div class={sectionStyles}>
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight self-center">Menu</h4>

                <!-- OPEN FILE -->
                <Button variant="muted" size="default" on:click={openFileExplorer}>
                    <span>Open File...</span>
                    <span class="sr-only">Open File</span>
                </Button>
            </div>

            <!-- SETTINGS SECTION -->
            <div class={sectionStyles}>
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight self-center">Settings</h4>

                <Label class={labelStyles}>
                    <span>Start in Edit Mode:</span>
                    <Switch on:click={handleSettingsFileUpdate} bind:checked={$appSettings.startEditMode} class="data-[state=checked]:bg-muted-foreground" />
                </Label>

                <Label class={labelStyles}>
                    <span>Horizontal editor:</span>
                    <Switch on:click={handleSettingsFileUpdate} bind:checked={$appSettings.horizontalEditor} class="data-[state=checked]:bg-muted-foreground" />
                </Label>

                <Label class={labelStyles}>
                    <span>Hide markdown toolbar:</span>
                    <Switch on:click={handleSettingsFileUpdate} bind:checked={$appSettings.toolbarHidden} class="data-[state=checked]:bg-muted-foreground" />
                </Label>

                <!-- THEME SELECTOR -->
                <Label class={labelStyles + " mt-5"}>
                    <span>Markdown Theme:</span>
                    <ThemeCombo />
                </Label>

                <!-- DARK MODE TOGGLE -->
                <Label class={labelStyles + " mt-5"}>
                    <span>Dark Mode:</span>
                    <LightSwitch class="" />
                </Label>
            </div>
        </div>

        <!-- SHEET FOOTER -->
        <Sheet.Footer class="flex !justify-center">
            <!-- LINKEDIN LINK -->
            <Button variant="ghost" size="icon" href="https://www.linkedin.com/in/kylehulvey/" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Icon icon="mdi:linkedin" />
                <span class="sr-only">LinkedIn</span>
            </Button>

            <!-- GITHUB LINK -->
            <Button variant="ghost" size="icon" href="https://github.com/kbh1301" title="GitHub" target="_blank" rel="noopener noreferrer">
                <Icon icon="mdi:github" />
                <span class="sr-only">GitHub</span>
            </Button>
        </Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>