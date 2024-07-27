<script lang="ts">
    import { cn } from "$root/lib/utils/utils.js";
    import { rawMarkdown, appSettings, editMode } from "$utils/stores";
    import CodeMirror from "svelte-codemirror-editor";
    import type { HTMLTextareaAttributes } from "svelte/elements";
    import DragHandle from "./drag-handle.svelte";
    import EditorToolbar from "./editor-toolbar.svelte";
    import { Accordion, ScrollArea } from "$components";
    import type { EditorView } from "@codemirror/view";
    import { onMount, tick } from "svelte";

    type $$Props = HTMLTextareaAttributes;
    let className: $$Props["class"] = undefined;
    export { className as class };

    let view: EditorView;

    async function updateDragHandles() {
        const cmLineNumElmts: NodeListOf<HTMLElement> = document.querySelectorAll('.cm-gutter.cm-lineNumbers .cm-gutterElement');
        const cmContentElmts: NodeListOf<HTMLElement> = document.querySelectorAll(".cm-content .cm-line");

        if (cmLineNumElmts && cmContentElmts) {
            cmLineNumElmts.forEach((lineNumElmt, index) => {
                if (!lineNumElmt.querySelector(".drag-handle")) {
                    lineNumElmt.style.setProperty('position', 'relative');
                    new DragHandle({ target: lineNumElmt, props: { thisIndex: index } });
                }
            });
        }
    }

    function handleEditorReady(event: { detail: EditorView; }) {
        const targetElmt = document.querySelector('.cm-content');

        // Debounce function to limit the rate of function calls
        function debounce(func: Function, wait: number) {
            let timeout: number | undefined;
            return function(this: any, ...args: any[]) {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, wait);
            };
        }

        // Create a debounced version of updateDragHandles
        const debouncedUpdateDragHandles = debounce(updateDragHandles, 300);

        // Define the callback function to be called on mutations
        const handleMutations = (mutations: MutationRecord[]) => {
            mutations.forEach(mutation => {
                // Use the debounced function here
                debouncedUpdateDragHandles();
            });
        };

        // Create a MutationObserver instance and pass the callback function
        const observer = new MutationObserver(handleMutations);

        // Configure the observer to watch for childList changes
        const config = { childList: true, subtree: true };
        observer.observe(targetElmt!, config);

        return view = event.detail;
    }

    $: editMode.subscribe(async () => {
        await tick();
        updateDragHandles();
    });

    onMount(() => {
        document.querySelector('cm-gutters')?.classList.add('bg-background');
    });
</script>

<!-- Editor Buttons -->
{#if !$appSettings.toolbarHidden}
    <Accordion.Root value="toolbar">
        <Accordion.Item value="toolbar" class="px-2 bg-background rounded-lg">
            <Accordion.Trigger class="pb-1 pt-2 !place-content-end"></Accordion.Trigger>
            <Accordion.Content>
                <EditorToolbar {view} />
            </Accordion.Content>
        </Accordion.Item>
    </Accordion.Root>
{/if}

<ScrollArea class="rounded-lg" orientation="both">
    <CodeMirror
        class={cn(
            "bg-background text-foreground overflow-hidden",
            className
        )}
        styles={{
            ".cm-content": {
                fontSize: "11pt",
                fontFamily: "'Inconsolata', monospace"
            },
            ".cm-activeLineGutter": {
                background: "hsl(var(--primary) / .2)"
                // background: "none"
            },
            ".cm-activeLine": {
                background: "hsl(var(--primary) / .2)"
                // background: "none"
            },
            ".cm-selectionBackground": {
                background: "hsl(var(--primary) / .5) !important"
            },
            ".cm-cursor": {
                borderLeftColor: "hsl(var(--primary)) !important"
            }
        }}
        bind:value={$rawMarkdown}
        lineWrapping
        placeholder="Enter markdown here..."
        on:ready={handleEditorReady}
    />
</ScrollArea>