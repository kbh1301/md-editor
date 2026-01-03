<!-- TODO: Code cleanup -->
<script lang="ts">
    import { isSyncing } from "$lib/stores";
    import { type EditorView } from "@codemirror/view";
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";

    export let thisIndex: number;
    export let view: EditorView;
    let curHandle: HTMLDivElement;
    let curIndex: number;
    let initialY: number;
    let targetIndex: number;
    let handles: NodeListOf<HTMLElement>;
    let curRect: DOMRect;

    function handleMouseDown(event: MouseEvent) {
        $isSyncing = false;
        window.focus();

        // Set initial variables
        curIndex = thisIndex -1;
        handles = document.querySelectorAll('.drag-handle');
        curRect = curHandle.getBoundingClientRect();
        
        // Set styles while dragging
        document.body.style.setProperty('cursor', 'grabbing');
        curHandle.style.setProperty('cursor', 'grabbing');
        curHandle.style.setProperty('z-index', '1000');
        curHandle.style.setProperty('opacity', '1');

        // Set initial cursor position
        initialY = event.clientY;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent) {
        // Move dragged element with cursor
        const deltaY = event.clientY - initialY;
        curHandle.style.setProperty('top', `${deltaY}px`);

        // Detect hover over other handles and swap positions
        handles.forEach((targetElmt, index) => {
            // Break if dragged out of bounds
            if (index-1 < 0) return;

            const rect = targetElmt === curHandle ? curRect : targetElmt.getBoundingClientRect();

            if (event.clientY > rect.top && event.clientY < rect.bottom) {
                targetIndex = index - 1;

                if (curIndex !== targetIndex) {
                    const editor = view.state.doc;
                    const curLine = editor.line(curIndex + 1);
                    const targetLine = editor.line(targetIndex + 1);

                    // Create a transaction to swap the lines
                    view.dispatch({
                        changes: [
                            { from: curLine.from, to: curLine.to, insert: targetLine.text },
                            { from: targetLine.from, to: targetLine.to, insert: curLine.text }
                        ]
                    });

                    // Update the curHandle index
                    curIndex = targetIndex;
                }
            }
        });
    }

    function handleMouseUp() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        // Reset styles
        document.body.style.removeProperty('cursor');
        curHandle.style.removeProperty('cursor');
        curHandle.style.removeProperty('top');
        curHandle.style.removeProperty('z-index');
        curHandle.style.removeProperty('opacity');
    }

    onMount(() => {
        const contentWidth = document.querySelector('.cm-content.cm-lineWrapping')?.clientWidth;
        curHandle.querySelector('div')?.style.setProperty('width', `${contentWidth}px`);
    });
</script>

<!-- TODO: Define aria role for drag-handle -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="drag-handle flex items-center justify-center absolute left-0 top-0 w-full h-full cursor-grab select-none text-background bg-primary border-primary border-[1px] rounded-sm text-wrap text-left opacity-0"
    bind:this={curHandle}
    on:mousedown={handleMouseDown}
>
    <Icon icon="material-symbols:drag-handle" />
</div>

