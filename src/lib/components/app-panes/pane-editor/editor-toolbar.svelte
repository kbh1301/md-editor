<script lang="ts">
    import { modifySelection } from "./editor-toolbar.js";
    import { Button, Separator, DialogGuide, DialogLink } from "$components";
    import Icon from '@iconify/svelte';
    import type { EditorView } from "@codemirror/view";

    export let view: EditorView;

    const group1 = [
        {
            label: 'Bold',
            icon: 'fa-solid:bold',
            action: () => modifySelection(view, '**', '**')
        },{
            label: 'Italic',
            icon: 'fa-solid:italic',
            action: () => modifySelection(view, '*', '*')
        },{
            label: 'Strikethrough',
            icon: 'fa-solid:strikethrough',
            action: () => modifySelection(view, '~~', '~~')
        }
    ];
        
    const group2 = [{
            label: 'Heading 1',
            icon: 'lucide:heading-1',
            action: () => modifySelection(view, '# ')
        },{
            label: 'Heading 2',
            icon: 'lucide:heading-2',
            action: () => modifySelection(view, '## ')
        },{
            label: 'Heading 3',
            icon: 'lucide:heading-3',
            action: () => modifySelection(view, '### ')
        },{
            label: 'Heading 4',
            icon: 'lucide:heading-4',
            action: () => modifySelection(view, '#### ')
        },{
            label: 'Heading 5',
            icon: 'lucide:heading-5',
            action: () => modifySelection(view, '##### ')
        },{
            label: 'Heading 6',
            icon: 'lucide:heading-6',
            action: () => modifySelection(view, '###### ')
        }
    ];

    const group3 = [{
            label: 'Quote',
            icon: 'fa-solid:quote-left',
            action: () => modifySelection(view, '> ')
        },{
            label: 'Generic List',
            icon: 'fa-solid:list-ul',
            action: () => modifySelection(view, '- ')
        },{
            label: 'Numbered List',
            icon: 'fa-solid:list-ol',
            action: () => modifySelection(view, '1. ')
        },{
            label: 'Checkbox',
            icon: 'fa-solid:check-square',
            action: () => modifySelection(view, '- [ ] ')
        }
    ];
</script>

<div class="flex justify-center flex-wrap pt-2">
    {#each group1 as group}
        <Button variant="toolbar_edit" size="toolbar" on:click={group.action} title={group.label}>
            <Icon icon={group.icon} />
            <span class="sr-only">{group.label}</span>
        </Button>
    {/each}

    <Separator orientation="vertical" class="h-auto bg-primary-foreground" />

    {#each group2 as group}
        <Button variant="toolbar_edit" size="toolbar" on:click={group.action} title={group.label}>
            <Icon icon={group.icon} />
            <span class="sr-only">{group.label}</span>
        </Button>
    {/each}

    <Separator orientation="vertical" class="h-auto bg-primary-foreground" />

    {#each group3 as group}
        <Button variant="toolbar_edit" size="toolbar" on:click={group.action} title={group.label}>
            <Icon icon={group.icon} />
            <span class="sr-only">{group.label}</span>
        </Button>
    {/each}

    <Separator orientation="vertical" class="h-auto bg-primary-foreground" />

    <DialogLink type="link" {view} />
    <DialogLink type="img" {view} />

    <Separator orientation="vertical" class="h-auto bg-primary-foreground" />

    <DialogGuide />
</div>