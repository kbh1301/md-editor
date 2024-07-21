<script lang="ts">
    import { cn } from "$lib/utils.js";
    import { compiledMarkdown, editMode, isUnsaved, rawMarkdown, appSettings } from "$utils/stores";
    import { onMount, tick } from "svelte";
    import CodeMirror from "svelte-codemirror-editor";
    import type { HTMLTextareaAttributes } from "svelte/elements";
    import DragHandle from "./drag-handle.svelte";
    import EditorToolbar from "./editor-toolbar.svelte";
    import { Accordion } from "$components";
    import type { EditorView } from "@codemirror/view";
    import ScrollArea from "../ui/scroll-area/scroll-area.svelte";

    type $$Props = HTMLTextareaAttributes;
    let className: $$Props["class"] = undefined;
    export { className as class };

    let view: EditorView;

    async function updateDragHandles() {
        await tick();

        const cmLineNumElmts: NodeListOf<HTMLElement> = document.querySelectorAll('.cm-gutter.cm-lineNumbers .cm-gutterElement');
        const cmContentElmts: NodeListOf<HTMLElement> = document.querySelectorAll(".cm-content .cm-line");

        if (cmLineNumElmts && cmContentElmts) {
            cmLineNumElmts[0].parentElement!.style.overflow = "visible";

            cmLineNumElmts.forEach((lineNumElmt) => {
                const index = parseInt(lineNumElmt.textContent!) - 1;
                const content = cmContentElmts[index]?.textContent;
                const cmContent = { index, content };

                if (!lineNumElmt.querySelector(".drag-handle")) {
                    lineNumElmt.style.setProperty('position', 'relative');
                    new DragHandle({ target: lineNumElmt, props: { cmContentElmts, cmContent, cmLineNumElmts } });
                } else {
                    const dragHandles = cmLineNumElmts[0].parentElement!.querySelectorAll(".drag-handle");
                    dragHandles.forEach((handle) => handle.remove());
                }
            });
        }
    }

    function handleEditorChange() {
        $isUnsaved = true;
    }

    onMount(() => {
        updateDragHandles();
    });
    $: if ($compiledMarkdown) {
        updateDragHandles();
    }
    $: editMode.subscribe(() => {
        updateDragHandles();
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
            "bg-background text-primary overflow-hidden",
            className
        )}
        bind:value={$rawMarkdown}
        lineWrapping
        placeholder="Enter markdown here..."
        on:ready={(e) => view = e.detail}
        on:change={handleEditorChange}
    />
</ScrollArea>