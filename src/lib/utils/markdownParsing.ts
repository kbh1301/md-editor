import { readTextFile } from '@tauri-apps/api/fs';
import { Marked } from 'marked';
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';
import { initRawMarkdown, rawMarkdown, compiledMarkdown, isUnsaved } from '$utils/stores';
import { get } from 'svelte/store';

/**
 * Accept path to file then:
 * 1. Get raw markdown from text file and set store value
 * 2. Initialize markdown converter
 * 3. When raw markdown changes, get compiled markdown and set store value
 * @param filePath 
 */
export async function setCompiledMarkdown(filePath: string) {
    // Get raw markdown from text file and set store values
    if (filePath) {
        rawMarkdown.set(
            await readTextFile(filePath)
        );

        initRawMarkdown.set(
            get(rawMarkdown)
        );
    }

    // Initialize markdown converter
    const marked = setupMarkedCompiler();

    // When raw markdown changes, get compiled markdown and set store value
    rawMarkdown.subscribe((value) => {
        const compiled = marked.parse(value);
        compiledMarkdown.set(compiled);

        if (value !== get(initRawMarkdown)) {
            isUnsaved.set(true);
        } else {
            isUnsaved.set(false);
        }
    })

    return;


    
    /**
     * Setup markedJS compiler with highlightJS and add open-in-new-window functionality to any HTML link/anchor tags generated by compiler
     */
    function setupMarkedCompiler() {
        const renderer = {
            // HTML link/anchor tags open in new window
            link(href: string, title: string | null | undefined, text: string) {
                const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`);
                const html = marked.Renderer.prototype.link.call(this, href, title, text);
                return localLink
                    ? html
                    : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
            },
            // HTML headings and their content are collapsible
            heading(text: string, level: number) {
                const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const headingTag = `<h${level} id="${id}">${text}</h${level}>`;
                return `
                    <details class="collapsible" open>
                        <summary class="collapsible-summary">
                            <div class="collapsible-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <path fill="currentColor" fill-rule="evenodd" d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z" />
                                </svg>
                            </div>
                            ${headingTag}
                        </summary>
                    <div class="collapsible-content">
                `;
            },
        };

        // highlightJS
        const marked = new Marked(
            markedHighlight({
                langPrefix: 'hljs language-',
                highlight(code, lang) {
                  const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                  return hljs.highlight(code, { language }).value;
                }
            })
        ).use({
            renderer
        });

        return marked;
    }
}