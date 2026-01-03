<script lang="ts">
    import Icon from "@iconify/svelte";
    import { cn } from "$utils/utils";
    import { activateTab, closeTab, createNewDocument } from "$utils/documentsHandler";
    import { activeDoc, activeDocId, documents } from "$lib/stores";

    export let className: string = "";
</script>

<div class={cn("flex flex-wrap w-full h-full border-b border-border", className)}>
    {#if $activeDoc}
        {#each $documents.values() as tab (tab.id)}
        {@const isActive = tab.id === $activeDocId}
            <button
                class={cn(
                    "group flex items-center h-9 max-w-60 px-3 text-sm border-r border-border relative cursor-pointer",
                    isActive
                        ? "bg-background text-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
                title={tab.path}
                on:click={() => activateTab(tab.id)}
            >
                <span class="truncate">{tab.title}</span>

                <button
                    class="ml-2 h-6 w-6 shrink-0 rounded-sm flex items-center justify-center hover:bg-muted-foreground/20"
                    on:click|stopPropagation={() => closeTab(tab.id)}
                    aria-label={`Close ${tab.title}`}
                >
                    {#if tab.isDirty}
                        <!-- Dirty dot (default) -->
                        <span
                            class="h-1.5 w-1.5 rounded-full bg-primary/80
                    group-hover:hidden"
                        />
                        <!-- Close icon (on hover) -->
                        <Icon
                            icon="mdi:close"
                            class="h-5 w-5 hidden group-hover:block"
                        />
                    {:else}
                        <!-- Clean tab: close only on hover -->
                        <Icon
                            icon="mdi:close"
                            class="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                    {/if}
                </button>

                {#if isActive}
                    <div
                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                {/if}
            </button>
        {/each}
        <button
            class="group  flex items-center h-9 px-3 relative cursor-pointer bg-muted text-muted-foreground/80 hover:text-foreground"
            on:click={createNewDocument}
        >
            <Icon
                icon="mdi:plus"
                class="h-5 w-5"
            />
        </button>
    {/if}
</div>
