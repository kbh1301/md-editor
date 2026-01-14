<script lang="ts">
    import Icon from "@iconify/svelte";
    import { cn } from "$utils/utils";
    import { activateTab, closeTab, createNewDocument } from "$utils/documentsHandler";
    import { activeDoc, activeDocId, documents } from "$lib/stores";
    import { showTabContextMenu } from "$utils/contextMenus";
    import { Popover } from "$components";
    import { tick } from "svelte";

    export let className: string = "";

    let popoverOpen = false;
    let popoverContent: HTMLElement | null = null;

    $: if (popoverOpen && popoverContent) {
        // Focus the active document element when popover opens
        tick().then(() => {
            const activeButton = popoverContent?.querySelector(`[data-doc-id="${$activeDocId}"]`) as HTMLElement;
            if (activeButton) {
                activeButton.scrollIntoView({ block: "nearest", behavior: "smooth" });
                activeButton.focus();
            }
        });
    }

    function handleDocumentClick(docId: string) {
        activateTab(docId);
        popoverOpen = false;
    }

    $: sortedDocumentsForPopover = (() => {
        const docs = Array.from($documents.values());
        const pinned = docs.filter(doc => doc.isPinned);
        const unpinned = docs.filter(doc => !doc.isPinned);
        // Preserve insertion order within each group
        return [...pinned, ...unpinned];
    })();
</script>

<div class={cn("flex flex-wrap w-full h-full border-b border-border", className)}>
    {#if $activeDoc}
        {@const sortedTabs = (() => {
            const docs = Array.from($documents.values());
            const pinned = docs.filter(doc => doc.isPinned);
            const unpinned = docs.filter(doc => !doc.isPinned);
            // Preserve insertion order within each group
            return [...pinned, ...unpinned];
        })()}
        {#each sortedTabs as tab (tab.id)}
        {@const isActive = tab.id === $activeDocId}
            <button
                class={cn(
                    "group flex items-center h-9 max-w-60 pl-3 pr-1 text-sm border-r border-border relative cursor-pointer",
                    isActive
                        ? "bg-background text-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
                title={tab.path}
                on:click={() => activateTab(tab.id)}
                on:contextmenu={(e) => showTabContextMenu(e, tab.id)}
            >
                {#if tab.isPinned}
                    <Icon
                        icon="mdi:pin"
                        class="h-4 w-4 mr-1.5 shrink-0 text-muted-foreground"
                    />
                {/if}
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
    {#if $documents.size > 0}
        <Popover.Root bind:open={popoverOpen}>
            <Popover.Trigger
                class="group flex items-center h-9 px-3 relative cursor-pointer bg-muted text-muted-foreground/80 hover:text-foreground border-l border-border"
                aria-label="Show all documents"
            >
                <Icon
                    icon="mdi:chevron-down"
                    class="h-5 w-5"
                />
            </Popover.Trigger>
            <Popover.Content class="w-80 max-h-96 p-0" align="end">
                <div bind:this={popoverContent} class="max-h-96 overflow-y-auto">
                    <div class="p-2">
                        {#each sortedDocumentsForPopover as doc (doc.id)}
                            {@const isActive = doc.id === $activeDocId}
                            <button
                                data-doc-id={doc.id}
                                class={cn(
                                    "w-full text-left px-3 py-2 text-sm rounded-sm flex items-center justify-between hover:bg-accent focus:bg-accent focus:outline-none",
                                    isActive ? "bg-accent font-medium" : ""
                                )}
                                on:click={() => handleDocumentClick(doc.id)}
                                tabindex={isActive ? 0 : -1}
                            >
                                <div class="flex items-center flex-1 min-w-0">
                                    {#if doc.isPinned}
                                        <Icon
                                            icon="mdi:pin"
                                            class="h-3.5 w-3.5 mr-1.5 shrink-0 text-muted-foreground"
                                        />
                                    {/if}
                                    <span class="truncate" title={doc.path || doc.title}>
                                        {doc.title}
                                    </span>
                                </div>
                                {#if doc.isDirty}
                                    <span class="h-1.5 w-1.5 rounded-full bg-primary/80 ml-2 shrink-0" />
                                {/if}
                            </button>
                        {/each}
                    </div>
                </div>
            </Popover.Content>
        </Popover.Root>
    {/if}
</div>
