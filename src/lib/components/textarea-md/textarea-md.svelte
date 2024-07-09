<script lang="ts">
    import { editMode } from "$lib/utils/stores";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import type { TextareaEvents } from "./index.js";
	import { cn } from "$lib/utils.js";
    import EditorToolbar from "./editor-toolbar.svelte";
    import { Accordion } from "$components";
    import { onMount } from "svelte";
    import { handleTextareaKeydown } from "./editor-toolbar.js";

	type $$Props = HTMLTextareaAttributes;
	type $$Events = TextareaEvents;

	let className: $$Props["class"] = undefined;
	export let value: $$Props["value"] = undefined;
	export { className as class };

	// Workaround for https://github.com/sveltejs/svelte/issues/9305
	// Fixed in Svelte 5, but not backported to 4.x.
	export let readonly: $$Props["readonly"] = undefined;

    let textarea: HTMLTextAreaElement;
</script>

<!-- Editor Toolbar -->
{#if $editMode}
    <Accordion.Root value="toolbar">
        <Accordion.Item value="toolbar" class="px-2 bg-background rounded-lg">
            <Accordion.Trigger class="pb-1 pt-2 !place-content-end"></Accordion.Trigger>
            <Accordion.Content>
                <!-- Editor Buttons -->
                <EditorToolbar {textarea} />
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
{/if}
<!-- Editor Textarea -->
<textarea
	class={cn(
		"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
    bind:this={textarea}
	bind:value
	{readonly}
	on:blur
	on:change
	on:click
	on:focus
	on:keydown={(event) => handleTextareaKeydown(event, textarea)}
	on:keypress
	on:keyup
	on:mouseover
	on:mouseenter
	on:mouseleave
	on:paste
	on:input
	{...$$restProps}
></textarea>
