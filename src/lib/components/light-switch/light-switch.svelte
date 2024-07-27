<!-- 
Derived from SkeletonUI:  https://github.com/skeletonlabs/skeleton/blob/master/packages/skeleton/src/lib/utilities/LightSwitch/LightSwitch.svelte
 -->

<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
	import { setInitialClassState } from '$lib/components/light-switch/light-switch';
	import { Moon, Sun } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import {
		getModeOsPrefers,
		modeCurrent,
		setModeCurrent,
		setModeUserPrefers
	} from './light-switch';
    import { toggleLightMode } from '$root/lib/utils/settingsHandler';
    import { get } from 'svelte/store';
    import { appSettings } from '$root/lib/utils/stores';

	type OnKeyDownEvent = KeyboardEvent & {
		currentTarget: EventTarget & HTMLDivElement;
	};
    type $$Props = HTMLAttributes<HTMLDivElement>;

    let lightmode: boolean;
    let className: $$Props["class"] = undefined;
	export { className as class };

	function onToggleHandler(): void {
		$modeCurrent = !$modeCurrent;
		setModeUserPrefers($modeCurrent);
		setModeCurrent($modeCurrent);
        toggleLightMode($modeCurrent);
	}

	// A11y Input Handlers
	function onKeyDown(event: OnKeyDownEvent): void {
		// Enter/Space triggers selection event
		if (['Enter', 'Space'].includes(event.code)) {
			event.preventDefault();
			event.currentTarget.click();
		}
	}
</script>

<svelte:head>
	<!-- This causes the new eslint-plugin-svelte: https://github.com/sveltejs/eslint-plugin-svelte/issues/492 -->
	{@html `<\u{73}cript nonce="%sveltekit.nonce%">(${setInitialClassState.toString()})();</script>`}
</svelte:head>

<div
	on:click={onToggleHandler}
	on:click
	on:keydown={onKeyDown}
	on:keydown
	on:keyup
	on:keypress
	role="switch"
	aria-label="Light Switch"
	aria-checked={$modeCurrent}
	title="Toggle {$modeCurrent === true ? 'Dark' : 'Light'} Mode"
	tabindex="0"
    class={cn("", className)}
>
	<div
		class={cn(
			buttonVariants({
				size: 'sm',
			}),
			'w-9 px-0 rounded-full'
		)}
	>
		{#if $modeCurrent}
			<Moon class="h-5 w-5" />
			<span class="sr-only">Dark</span>
		{:else}
			<Sun class="h-5 w-5" />
			<span class="sr-only">Light</span>
		{/if}
	</div>
</div>
