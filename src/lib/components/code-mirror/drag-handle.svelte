<script lang="ts">
    import Icon from "@iconify/svelte";
    import { onMount } from "svelte";

    export let cmContentElmts: NodeListOf<HTMLElement>;
    export let cmContent: { index: number, content: string | null };
    export let cmLineNumElmts: NodeListOf<HTMLElement>;

    let target: HTMLDivElement;
    let initialIndex: number;
    let initialY: number;
    let initialContent: string|null = '';
    let finalIndex: number;
    let finalContent: string|null = '';

    function handleMouseDown(event: MouseEvent) {
        // event.preventDefault();
        window.focus();

        // Set initial content
        initialIndex = Array.from(target.parentElement!.parentElement!.children).indexOf(target.parentElement!) -1;
        initialContent = cmContent.content;

        // Set cursor type while dragging
        document.body.style.setProperty('cursor', 'grabbing');
        target.style.setProperty('cursor', 'grabbing');

        // Set initial cursor position
        initialY = event.clientY;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }

    function handleMouseMove(event: MouseEvent) {
        // Move dragged element with cursor
        const deltaY = event.clientY - initialY;
        target.style.setProperty('top', `${deltaY}px`);
        target.style.setProperty('zIndex', '1000');
        target.style.setProperty('opacity', '1');

        // Detect hover over other handles and swap positions
        const handles = document.querySelectorAll('.drag-handle');
        handles.forEach((otherElmt) => {
            if (otherElmt !== target) {
                const rect = otherElmt.getBoundingClientRect();
                if (event.clientY > rect.top && event.clientY < rect.bottom) {
                    // Find indices of handles
                    const grandparent = target.parentElement!.parentElement!;
                    const currentIndex = Array.from(grandparent.children).indexOf(target.parentElement!);
                    finalIndex = Array.from(grandparent.children).indexOf(otherElmt.parentElement!);

                    // Swap handles in the DOM
                    if (currentIndex !== -1 && finalIndex !== -1) {
                        cmLineNumElmts[finalIndex].appendChild(target);
                        cmLineNumElmts[currentIndex].appendChild(otherElmt);
                        initialY = currentIndex < finalIndex ? event.clientY + rect.height/2 : event.clientY - rect.height/2;
                    }
                }
            }
        });
    }

    function handleMouseUp() {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        // Reset styles
        document.body.style.removeProperty('cursor');
        target.style.removeProperty('cursor');
        target.style.removeProperty('top');
        target.style.removeProperty('zIndex');
        target.style.removeProperty('opacity');

        // Set final content and update codeMirror
        if (finalIndex) {
            finalContent = cmContentElmts[finalIndex - 1].textContent;
            cmContentElmts[finalIndex - 1].textContent = initialContent;
            cmContentElmts[initialIndex].textContent = finalContent;
        }
    }

    onMount(() => {
        target.addEventListener('mousedown', handleMouseDown);
        const contentWidth = document.querySelector('.cm-content.cm-lineWrapping')?.clientWidth;
        target.querySelector('div')?.style.setProperty('width', `${contentWidth}px`);
    });
</script>

<div class="drag-handle absolute left-0 top-0 w-full h-full cursor-grab select-none text-primary bg-background border-primary border-[1px] text-wrap text-left opacity-0" bind:this={target}>
    <Icon icon="material-symbols:drag-handle" />
    <div class="absolute min-h-full left-full top-1/2 transform -translate-y-1/2 px-2 border-primary border-[1px] bg-background pointer-events-none">
        {cmContent.content}
    </div>
</div>

