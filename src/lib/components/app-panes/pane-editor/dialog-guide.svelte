<!-- TODO: finish markdown guide -->
<script lang="ts">
    import Icon from "@iconify/svelte";
    import { Button, Dialog, Table, ScrollArea } from "$components";

    const basicElements = [
        {
            element: "Heading",
            syntax: `
                # H1
                ## H2
                ### H3
            `,
            link: "https://www.markdownguide.org/basic-syntax/#headings"
        },{
            element: "Bold",
            syntax: "**bold text**",
            link: "https://www.markdownguide.org/basic-syntax/#bold"
        },{
            element: "Italic",
            syntax: "*italicized text*",
            link: "https://www.markdownguide.org/basic-syntax/#italic"
        },{
            element: "Blockquote",
            syntax: "> blockquote",
            link: "https://www.markdownguide.org/basic-syntax/#blockquotes-1"
        },{
            element: "Ordered List",
            syntax: `
                1. First item
                2. Second item
                3. Third item
            `,
            link: "https://www.markdownguide.org/basic-syntax/#ordered-lists"
        },{
            element: "Unordered List",
            syntax: `
                - First item
                - Second item
                - Third item
            `,
            link: "https://www.markdownguide.org/basic-syntax/#unordered-lists"
        },{
            element: "Code",
            syntax: "`code`",
            link: "https://www.markdownguide.org/basic-syntax/#code"
        },{
            element: "Horizontal Rule",
            syntax: "---",
            link: "https://www.markdownguide.org/basic-syntax/#horizontal-rules"
        },{
            element: "Link",
            syntax: "[title](https://www.example.com)",
            link: "https://www.markdownguide.org/basic-syntax/#links"
        },{
            element: "Image",
            syntax: "![alt text](image.jpg)",
            link: "https://www.markdownguide.org/basic-syntax/#images-1"
        }
    ];

    const extendedElements = [
        {
            element: "Table",
            syntax: `
                | Syntax | Description |
                | ----------- | ----------- |
                | Header | Title |
                | Paragraph | Text |
            `,
            link: "https://www.markdownguide.org/extended-syntax/#tables"
        },{
            element: "Fenced Code Block",
            syntax: `
                \`\`\`
                {
                "firstName": "John",
                "lastName": "Smith",
                "age": 25
                }
                \`\`\`
            `,
            link: "https://www.markdownguide.org/extended-syntax/#fenced-code-blocks"
        },{
            element: "Footnote",
            syntax: `
                Here's a sentence with a footnote. [^1]

                [^1]: This is the footnote.
            `,
            link: "https://www.markdownguide.org/extended-syntax/#footnotes"
        },{
            element: "Heading ID",
            syntax: "### My great Heading {#custom-id}",
            link: "https://www.markdownguide.org/extended-syntax/#heading-ids"
        },{
            element: "Definition List",
            syntax: `
                term
                : definition
            `,
            link: "https://www.markdownguide.org/extended-syntax/#definition-lists"
        },{
            element: "Strikethrough",
            syntax: "~~The world is flat.~~",
            link: "https://www.markdownguide.org/extended-syntax/#strikethrough"
        },{
            element: "Task List",
            syntax: `
                - [x] Write the press release
                - [ ] Update the website
                - [ ] Contact the media
            `,
            link: "https://www.markdownguide.org/extended-syntax/#task-lists"
        },{
            element: "Emoji",
            syntax: "That is so funny! :joy:",
            link: "https://www.markdownguide.org/extended-syntax/#emoji"
        },{
            element: "Highlight",
            syntax: "I need to highlight these ==very important words==.",
            link: "https://www.markdownguide.org/extended-syntax/#highlight"
        },{
            element: "Subscript",
            syntax: "H~2~O",
            link: "https://www.markdownguide.org/extended-syntax/#subscript"
        },{
            element: "Superscript",
            syntax: "X^2^",
            link: "https://www.markdownguide.org/extended-syntax/#superscript"
        }
    ]
</script>

<Dialog.Root>
    <Dialog.Trigger asChild let:builder>
        <Button variant="toolbar_edit" size="toolbar" builders={[builder]} title="Markdown Guide">
            <Icon icon="fa-solid:question-circle" />
            <span class="sr-only">Markdown Guide</span>
        </Button>
    </Dialog.Trigger>
    <Dialog.Content class="flex !w-fit max-w-[75%] max-h-[75%]">
        <!-- <Dialog.Header>
            <Dialog.Title class="opacity-50 pr-14" style="text-orientation: upright; writing-mode: vertical-lr;">
                Markdown Guide
            </Dialog.Title>
        </Dialog.Header> -->

        <ScrollArea class="max-h-[75%]">
            <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Basic Syntax</h2>
            <Table.Root>
                <Table.Header>
                <Table.Row>
                    <Table.Head class="w-[100px]">Element</Table.Head>
                    <Table.Head>Syntax</Table.Head>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                {#each basicElements as element, i (i)}
                    <Table.Row class="whitespace-pre-line">
                    <Table.Cell><a href={element.link} target="_blank" class="link">{element.element}</a></Table.Cell>
                    <Table.Cell>{element.syntax}</Table.Cell>
                    </Table.Row>
                {/each}
                </Table.Body>
            </Table.Root>

            <h2 class="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">Extended Syntax</h2>
            <Table.Root>
                <Table.Header>
                <Table.Row>
                    <Table.Head class="w-[100px]">Element</Table.Head>
                    <Table.Head>Syntax</Table.Head>
                </Table.Row>
                </Table.Header>
                <Table.Body>
                {#each extendedElements as element, i (i)}
                    <Table.Row class="whitespace-pre-line">
                    <Table.Cell><a href={element.link} target="_blank" class="link">{element.element}</a></Table.Cell>
                    <Table.Cell>{element.syntax}</Table.Cell>
                    </Table.Row>
                {/each}
                </Table.Body>
            </Table.Root>
        </ScrollArea>
    </Dialog.Content>
</Dialog.Root>
