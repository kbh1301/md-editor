<script lang="ts">
	import { ScrollArea as ScrollAreaPrimitive } from "bits-ui";
	import { Scrollbar } from "./index.js";
	import { cn } from "$root/lib/utils/utils.js";
    import { onMount } from "svelte";

	type $$Props = ScrollAreaPrimitive.Props & {
		orientation?: "vertical" | "horizontal" | "both";
		scrollbarXClasses?: string;
		scrollbarYClasses?: string;
        viewportElement?: HTMLElement;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
	export let orientation = "vertical";
	export let scrollbarXClasses: string = "";
	export let scrollbarYClasses: string = "";

    let viewport: ScrollAreaPrimitive.Viewport;
    export let viewportElement: HTMLElement|undefined;

    onMount(() => {
        // Bind the viewport's DOM element
        viewportElement = viewport.$$.ctx[0];
	});
</script>

<ScrollAreaPrimitive.Root {...$$restProps} class={cn("relative overflow-hidden", className)}>
	<ScrollAreaPrimitive.Viewport bind:this={viewport} class="h-full w-full">
		<ScrollAreaPrimitive.Content>
			<slot />
		</ScrollAreaPrimitive.Content>
	</ScrollAreaPrimitive.Viewport>
	{#if orientation === "vertical" || orientation === "both"}
		<Scrollbar orientation="vertical" class={scrollbarYClasses} />
	{/if}
	{#if orientation === "horizontal" || orientation === "both"}
		<Scrollbar orientation="horizontal" class={scrollbarXClasses} />
	{/if}
	<ScrollAreaPrimitive.Corner />
</ScrollAreaPrimitive.Root>
