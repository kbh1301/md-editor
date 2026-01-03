<script lang="ts">
    import { editMode, isSyncing, activeDoc } from "$lib/stores";
    import { PaneLaunch, PaneEditor, PanePreview } from "$components";

    let previewViewport: HTMLElement;
    let editorViewport: HTMLElement;

    function syncScroll(source: HTMLElement, target: HTMLElement) {
        if ($isSyncing) return;
        $isSyncing = true;
        
        const offsetTop = source.scrollTop / (source.scrollHeight - source.clientHeight);
        target.scrollTop = offsetTop * (target.scrollHeight - target.clientHeight);

        requestAnimationFrame(() => {
            $isSyncing = false;
        });
    }

    function addScrollSyncListeners() {
        if (!previewViewport || !editorViewport) return;

        const handleEditorScroll = () => syncScroll(editorViewport, previewViewport);
        const handlePreviewScroll = () => syncScroll(previewViewport, editorViewport);

        editorViewport.addEventListener('scroll', handleEditorScroll);
        previewViewport.addEventListener('scroll', handlePreviewScroll);
    }

    $: {
        if (editorViewport && previewViewport) {
            syncScroll(previewViewport, editorViewport);
            addScrollSyncListeners();
        }
    }
</script>

<div class="grid grid-flow-col grid-cols-[1fr]">
    <div class="flex flex-col-reverse items-center flex-1 h-full overflow-hidden gap-4 justify-around lg:flex-row lg:items-stretch">
        <!-- Compiled Markdown Preview Pane -->
        {#if !$activeDoc}
            <PaneLaunch />
        {:else}
            <!-- Markdown Editor Pane -->
            {#if $editMode}
                <PaneEditor bind:editorViewport />
            {/if}
            <!-- Markdown Preview Pane -->
            <PanePreview bind:previewViewport />
        {/if}
    </div>
</div>