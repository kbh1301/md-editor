<script lang="ts">
    import { invoke } from '@tauri-apps/api/tauri';
	import { Button, Sheet, Label, Switch, LightSwitch, Separator, BtnOpenFile, BtnNewFile } from "$components";
    import Icon from '@iconify/svelte';
    import { appSettings } from "$utils/stores";
    import { fontIncrease, fontDecrease, fontReset } from "$utils/settingsHandler";
    import { onMount } from 'svelte';

	let open = false;
    let version = '';

    onMount(async () => {
        version = await invoke<string>('get_version');
    });

    // Styles
    const sectionStyles = "flex flex-col sm:flex-col items-center gap-1 rounded-lg p-4 bg-background";
    const labelStyles = "flex items-center gap-2 h-7 w-full justify-between";
    const separatorStyles = "my-3";
</script>

<Sheet.Root bind:open>

    <!-- MENU BUTTON -->
	<Sheet.Trigger asChild let:builder>
		<Button variant="toolbar" size="toolbar" builders={[builder]}>
            <Icon icon="mdi:menu" />
			<span class="sr-only">Toggle Menu</span>
		</Button>
	</Sheet.Trigger>
	<Sheet.Content side="left" class="flex flex-col justify-between bg-secondary">

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
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight self-center mb-4">Menu</h4>
                <div class="flex flex-col gap-3">
                    <BtnOpenFile />
                    <BtnNewFile />
                </div>
            </div>

            <!-- SETTINGS SECTION -->
            <div class={sectionStyles}>
                <h4 class="scroll-m-20 text-xl font-semibold tracking-tight self-center mb-4">Settings</h4>

                <div class="flex items-center justify-between w-full">
                    <Label class={labelStyles}><span>Font Size:</span></Label>
                    <div class="flex gap-4 items-center">
                        {#if $appSettings.fontSize != 16}
                            <Button size="sm" on:click={fontReset}><p>Reset</p></Button>
                        {/if}
                        
                        <div class="flex gap-1 items-center">
                            <Button size="xs" on:click={fontDecrease}>
                                <Icon icon="ic:round-minus" />
                            </Button>

                            <span class="inline-block w-[4ch] text-center">{$appSettings.fontSize}px</span>

                            <Button size="xs" on:click={fontIncrease}>
                                <Icon icon="ic:round-plus" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator class={separatorStyles} />

                <Label class={labelStyles}>
                    <span>Start in Edit Mode:</span>
                    <Switch bind:checked={$appSettings.startEditMode} />
                </Label>

                <Label class={labelStyles}>
                    <span>Hide markdown toolbar:</span>
                    <Switch bind:checked={$appSettings.toolbarHidden} />
                </Label>

                <Separator class={separatorStyles} />

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
            <Button variant="icon_primary" size="icon" href="https://www.linkedin.com/in/kylehulvey/" title="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Icon icon="mdi:linkedin" />
                <span class="sr-only">LinkedIn</span>
            </Button>

            <!-- GITHUB LINK -->
            <Button variant="icon_primary" size="icon" href="https://github.com/kbh1301/md-editor" title="GitHub" target="_blank" rel="noopener noreferrer">
                <Icon icon="mdi:github" />
                <span class="sr-only">GitHub</span>
            </Button>

            <!-- VERSION -->
            <p class="absolute left-2 bottom-2 text-xs text-foreground/50">
                v{version}
            </p>
        </Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>