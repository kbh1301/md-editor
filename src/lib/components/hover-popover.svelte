<script lang="ts">
    import { Button, Popover } from "$components";
    import Icon from '@iconify/svelte';

    let headingsOpen = false;

    export let triggerIcon;
</script>

<Popover.Root bind:open={headingsOpen} portal={null}>
    <Popover.Trigger asChild let:builder>
        <button
            class="cursor-auto"
            on:mouseenter={() => headingsOpen = true}
            on:mouseleave={() => headingsOpen = false}
            on:focus={() => headingsOpen = true}
            on:click={() => headingsOpen = true}
        >
            <Button
                builders={[builder]}
                variant="toolbar_edit"
                size="toolbar"
                class="gap-0 items-end pointer-events-none"
            >
                <Icon icon={triggerIcon} />
                <Icon icon="iwwa:arrow-down" width="8px" />
                <span class="sr-only">Heading popover</span>
            </Button>
        </button>
    </Popover.Trigger>
    <Popover.Content class="bg-primary w-fit p-0 rounded-none border-none">
        <button
            class="border cursor-auto"
            on:mouseenter={() => headingsOpen = true}
            on:mouseleave={() => headingsOpen = false}
        >
            <Popover.Close>
                <slot />
            </Popover.Close>
        </button>
    </Popover.Content>
</Popover.Root>