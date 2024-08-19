<script lang="ts">
    import { compiledMarkdown } from "$utils/stores";
    import { ScrollArea, MdCheckbox } from "$components";
    import { afterUpdate } from "svelte";

    export let previewViewport: HTMLElement;

    function createCheckboxComponents() {
        const placeholders = document.querySelectorAll('.checkbox-placeholder');

        placeholders.forEach((placeholder) => {
            const checked = placeholder.getAttribute('data-checked') === 'true';
            const text = placeholder.getAttribute('data-text') || '';

            placeholder.innerHTML = '';

            // Replace placeholder with MdCheckbox component
            new MdCheckbox({
                target: placeholder,
                props: { checked, text }
            });
        });
    }

    afterUpdate(() => {
        createCheckboxComponents();
    });
</script>

<ScrollArea
    class="markdown-body relative box-border w-full min-w-[200px] max-w-[980px] my-0 p-[45px] overflow-auto rounded-lg drop-shadow-md flex-[1_1_50%]"
    orientation="both"
    bind:viewportElement={previewViewport}
>
        {@html $compiledMarkdown}
</ScrollArea>