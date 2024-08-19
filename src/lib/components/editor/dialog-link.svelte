<script lang="ts">
    import { getSelection, insertLink } from "./editor-toolbar.js";
    import Icon from "@iconify/svelte";
    import { Button, Label, Input, Dialog } from "$components";
    import type { EditorView } from "@codemirror/view";

    export let view: EditorView;;
    export let type: 'link' | 'img';

    let linkUrl = "";
    let linkText = "";
    let selectionRange = {
        start: 0,
        end: 0
    }

    function handleBuild() {
        const selection = getSelection(view);
        linkText = selection?.selection ?? '';
        selectionRange.start = selection?.start ?? 0;
        selectionRange.end = selection?.end ?? 0;
    }

    function handleSubmit() {
        insertLink(view, type, linkUrl, linkText, selectionRange);
        linkUrl = linkText = "";
    }
</script>

<Dialog.Root>
    <Dialog.Trigger asChild let:builder>
        <Button
            variant="toolbar"
            size="toolbar"
            builders={[builder]}
            on:click={handleBuild}
            title={type === 'link' ? 'Link' : 'Image'}
        >
            <Icon icon={type === 'link' ? "fa-solid:link" : "fa-solid:image"} />
            <span class="sr-only">{type === 'link' ? "Link" : "Image"}</span>
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Insert {type === 'link' ? "Link" : "Image"}</Dialog.Title>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="linkUrl" class="text-right">URL</Label>
                <Input id="linkUrl" bind:value={linkUrl} class="col-span-3" autocomplete="off" />
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <Label for="linkText" class="text-right">{type === 'link' ? "Text" : "Alt text (optional)"}</Label>
                <Input id="linkText" bind:value={linkText} class="col-span-3" autocomplete="off" />
            </div>
        </div>
        <Dialog.Close class="flex w-full justify-end">
            <Button type="submit" on:click={handleSubmit}>OK</Button>
        </Dialog.Close>
    </Dialog.Content>
</Dialog.Root>
