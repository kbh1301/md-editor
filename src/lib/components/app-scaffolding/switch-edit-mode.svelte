<script lang="ts">
    import Icon from '@iconify/svelte';
	import { Switch as SwitchPrimitive } from "bits-ui";
	import { cn } from "$utils/utils.js";

	type $$Props = SwitchPrimitive.Props;
	type $$Events = SwitchPrimitive.Events;

	let className: $$Props["class"] = undefined;
	export let checked: $$Props["checked"] = undefined;
	export { className as class };
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		"peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
>
	<SwitchPrimitive.Thumb asChild>
        <Icon
            icon="icon-park-solid:edit"
            class={cn(
                "pointer-events-none block h-full w-1/2 p-[3px] rounded-full bg-primary-foreground shadow-lg ring-0 transition-transform text-primary",
                "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
                // "data-[state=checked]:text-primary data-[state=unchecked]:text-input"
            )}
            data-state={checked ? "checked" : "unchecked"}
        />
    </SwitchPrimitive.Thumb>
</SwitchPrimitive.Root>