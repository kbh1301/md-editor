<script lang="ts">
    import { appSettings, activeDoc } from "$lib/stores";
    import { ScrollArea, MdCheckbox, CopyButton } from "$components";
    import { afterUpdate } from "svelte";

    export let previewViewport: HTMLElement;

    function createCheckboxComponents() {
        const checkboxes = previewViewport.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            const listItem = checkbox.parentElement!;
            const checked = checkbox.getAttribute('checked') !== null;

            // Alter list styles
            listItem.style.listStyle = "none";

            // Add new checkbox
            new MdCheckbox({
                target: listItem,
                props: { checked },
                anchor: listItem.firstChild as Element
            });

            // Remove original checkbox
            checkbox.remove();
        });
    }

    function createCodeCopyButtons() {
        const codeBlocks = previewViewport.querySelectorAll("pre");

        codeBlocks.forEach((block) => {
            block.style.paddingTop = "32px";

            new CopyButton({
                target: block,
                props: { parentElement: block }
            });
        });
    }

    afterUpdate(() => {
        createCheckboxComponents();
        createCodeCopyButtons();
    });
</script>

<ScrollArea
    class="markdown-body relative box-border w-full min-w-[200px] max-w-[980px] my-0 overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]"
    orientation="both"
    bind:viewportElement={previewViewport}
>
    <div
        class="p-[45px]"
        style="font-size: {$appSettings.fontSize}px;"
    >
        {@html $activeDoc?.compiled ?? ""}
    </div>
</ScrollArea>