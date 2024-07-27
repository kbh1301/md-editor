<script lang="ts">
    import Check from "lucide-svelte/icons/check";
    import ChevronsUpDown from "lucide-svelte/icons/chevrons-up-down";
    import { Command, Popover, Button } from "$components";
    import { cn } from "$lib/utils.js";
    import { tick } from "svelte";
    import { appSettings } from "$lib/utils/stores";
    import { loadTheme, writeToSettingsFile } from "$lib/utils/settingsHandler";

    const themes = [
        {
            value: "github-md.min.css",
            label: "GitHub",
        },{
            value: "github-dark-md.min.css",
            label: "GitHub Dark",
        },
    ];

    let open = false;

    $: selectedValue =
        themes.find((f) => f.value === $appSettings.mdTheme)?.label ??
        "Select a theme...";

    function handleSelect(currVal: string, ids: { content?: string; trigger: any; }) {
        appSettings.update(val => {
            val.mdTheme = currVal;
            return val;
        });
        writeToSettingsFile();
        closeAndFocusTrigger(ids.trigger);
    }

    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });

        loadTheme();
    }
</script>

<Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
        <Button
            builders={[builder]}
            role="combobox"
            aria-expanded={open}
            class="w-[200px] justify-between ml-auto"
        >
            {selectedValue}
            <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    </Popover.Trigger>
    <Popover.Content class="w-[200px] p-0">
        <Command.Root>
            <!-- <Command.Input placeholder="Search themes..." /> -->
            <Command.Empty>No theme found.</Command.Empty>
            <Command.Group class="bg-primary text-primary-foreground">
                {#each themes as theme}
                    <Command.Item
                        value={theme.value}
                        onSelect={currVal => handleSelect(currVal, ids)}
                    >
                        <Check
                            class={cn(
                                "mr-2 h-4 w-4",
                                $appSettings.mdTheme !== theme.value && "text-transparent",
                            )}
                        />
                        {theme.label}
                    </Command.Item>
                {/each}
            </Command.Group>
        </Command.Root>
    </Popover.Content>
</Popover.Root>
