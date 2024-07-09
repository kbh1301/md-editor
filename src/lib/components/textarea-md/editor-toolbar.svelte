<script lang="ts">
    import { modifyLine, modifyLineHeading, modifySelection } from "./editor-toolbar.js";
    import { Button, Separator, DialogGuide, DialogLink } from "$components";
    import Icon from '@iconify/svelte';

    export let textarea: HTMLTextAreaElement;

    const group1 = [
        {
            label: 'Bold',
            icon: 'fa-solid:bold',
            action: () => modifySelection(textarea, '**', '**')
        },{
            label: 'Italic',
            icon: 'fa-solid:italic',
            action: () => modifySelection(textarea, '*', '*')
        },{
            label: 'Strikethrough',
            icon: 'fa-solid:strikethrough',
            action: () => modifySelection(textarea, '~~', '~~')
        }
    ];
        
    const group2 = [{
            label: 'Heading 1',
            icon: 'lucide:heading-1',
            action: () => modifyLineHeading(textarea, '# ')
        },{
            label: 'Heading 2',
            icon: 'lucide:heading-2',
            action: () => modifyLineHeading(textarea, '## ')
        },{
            label: 'Heading 3',
            icon: 'lucide:heading-3',
            action: () => modifyLineHeading(textarea, '### ')
        },{
            label: 'Heading 4',
            icon: 'lucide:heading-4',
            action: () => modifyLineHeading(textarea, '#### ')
        },{
            label: 'Heading 5',
            icon: 'lucide:heading-5',
            action: () => modifyLineHeading(textarea, '##### ')
        },{
            label: 'Heading 6',
            icon: 'lucide:heading-6',
            action: () => modifyLineHeading(textarea, '###### ')
        }
    ];

    const group3 = [{
            label: 'Quote',
            icon: 'fa-solid:quote-left',
            action: () => modifyLine(textarea, '> ')
        },{
            label: 'Generic List',
            icon: 'fa-solid:list-ul',
            action: () => modifyLine(textarea, '- ')
        },{
            label: 'Numbered List',
            icon: 'fa-solid:list-ol',
            action: () => modifyLine(textarea, '1. ')
        },{
            label: 'Checkbox',
            icon: 'fa-solid:check-square',
            action: () => modifyLine(textarea, '- [ ] ')
        }
    ];
</script>

<div class="flex justify-center flex-wrap">
    {#each group1 as group}
        <Button variant="toolbar" size="toolbar" on:click={group.action}>
            <Icon icon={group.icon} />
            <span class="sr-only">{group.label}</span>
        </Button>
    {/each}

    <Separator orientation="vertical" class="h-auto" />

    {#each group2 as group}
        <Button variant="toolbar" size="toolbar" on:click={group.action}>
            <Icon icon={group.icon} />
            <span class="sr-only">{group.label}</span>
        </Button>
    {/each}

    <Separator orientation="vertical" class="h-auto" />

    {#each group3 as group}
        <Button variant="toolbar" size="toolbar" on:click={group.action}>
            <Icon icon={group.icon} />
            <span class="sr-only">{group.label}</span>
        </Button>
    {/each}

    <Separator orientation="vertical" class="h-auto" />

    <DialogLink type="link" {textarea} />
    <DialogLink type="img" {textarea} />

    <Separator orientation="vertical" class="h-auto" />

    <DialogGuide />
</div>