<script lang="ts">
    import { compiledMarkdown, appSettings } from "$utils/stores";
    import { ScrollArea, MdCheckbox, CopyButton } from "$components";
    import { afterUpdate } from "svelte";

    export let previewViewport: HTMLElement;

    function createCheckboxComponents() {
        const placeholders = document.querySelectorAll('.checkbox-placeholder');

        placeholders.forEach((placeholder) => {
            const checked = placeholder.getAttribute('data-checked') === 'true';
            const text = placeholder.getAttribute('data-text') || '';

            new MdCheckbox({
                target: placeholder.parentElement!,
                props: { checked, text }
            });

            placeholder.remove();
        });
    }

    function createCodeCopyButtons() {
        const codeBlocks = document.querySelectorAll("pre");

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
        {@html $compiledMarkdown}
    </div>
</ScrollArea>