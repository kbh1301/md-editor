<script lang="ts">
    import { cn } from "$utils/utils.js";
    import { saveMarkdownFile } from "$utils/fileHandler";
    import { rawMarkdown, appSettings, editMode, isUnsaved, openedPagePath } from "$utils/stores";
    import CodeMirror from "svelte-codemirror-editor";
    import type { HTMLTextareaAttributes } from "svelte/elements";
    import { Accordion, ScrollArea, Button, DragHandle, EditorToolbar } from "$components";
    import { EditorView } from "@codemirror/view";
    import { tick } from "svelte";
    import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
    import { oneDark } from '@codemirror/theme-one-dark'
    import { fade } from 'svelte/transition';

    type $$Props = HTMLTextareaAttributes & {
        editorViewport: HTMLElement;
    };
    let className: $$Props["class"] = undefined;
    export { className as class };

    let view: EditorView;
    export let editorViewport: HTMLElement;

    async function updateDragHandles() {
        const cmLineNumElmts: NodeListOf<HTMLElement> = document.querySelectorAll('.cm-gutter.cm-lineNumbers .cm-gutterElement');
        const cmContentElmts: NodeListOf<HTMLElement> = document.querySelectorAll(".cm-content .cm-line");

        if (cmLineNumElmts && cmContentElmts) {
            cmLineNumElmts.forEach((lineNumElmt, index) => {
                if (!lineNumElmt.querySelector(".drag-handle")) {
                    lineNumElmt.style.setProperty('position', 'relative');
                    new DragHandle({ target: lineNumElmt, props: { thisIndex: index, view } });
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

    const customTheme = EditorView.theme({
        '&': {
            backgroundColor: 'hsl(var(--background) / var(--tw-bg-opacity)) !important',
            color: 'hsl(var(--foreground) / var(--tw-text-opacity)) !important'
        },
        '.cm-content': {
            fontSize: '11pt',
            fontFamily: '"Inter", monospace'
        },
        '.cm-gutters': {
            background: 'hsl(var(--background) / 1) !important'
        },
        '.cm-activeLineGutter': {
            background: 'hsl(var(--primary) / .2)'
        },
        '.cm-activeLine': {
            background: 'hsl(var(--primary) / .2)'
        },
        '.cm-selectionBackground': {
            background: 'hsl(var(--primary) / .5) !important'
        },
        '.cm-cursor': {
            borderLeftColor: 'hsl(var(--foreground)) !important',
            borderLeft: '3px solid black'
        }
    });
</script>

<div
    class="flex flex-col flex-[1_1_50%] w-full max-w-[980px] overflow-auto bg-background rounded-lg"
    transition:fade
>
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

    <!-- Editor -->
    <ScrollArea
        class="rounded-lg"
        orientation="both"
        bind:viewportElement={editorViewport}
    >
        <CodeMirror
            class={cn(
                "text-foreground overflow-hidden",
                className
            )}
            bind:value={$rawMarkdown}
            on:ready={handleEditorReady}
            lineWrapping
            tabSize={4}
            placeholder="Enter markdown here..."
            extensions={[
                markdown({ base: markdownLanguage }),
            ]}
            theme={[
                $appSettings.lightmode ? [] : [oneDark],
                customTheme,
            ]}
        />
    </ScrollArea>

    <!-- Save Buttons -->
    <div class="flex w-full gap-4 justify-center mt-4 h-24" transition:fade>
        {#if $isUnsaved}
            {#if $openedPagePath}
                <div class="flex justify-center">
                    <Button on:click={() => saveMarkdownFile()}>Save</Button>
                </div>
            {/if}
            <div class="flex justify-center">
                <Button on:click={() => saveMarkdownFile({isSaveAs: true})}>Save As...</Button>
            </div>
        {/if}
    </div>
</div>