import { Marked, Renderer } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import * as emoji from 'node-emoji';

export function createMarkdownCompiler() {
    const renderer = new Renderer();
    let currentLevel = 0;

    // Override link
    renderer.link = function (href, title, text) {
        const localLink = href?.startsWith(`${location.protocol}//${location.hostname}`);
        const html = Renderer.prototype.link.call(this, href, title, text);
        return localLink
            ? html
            : html.replace(/^<a /, `<a target="_blank" rel="noreferrer noopener nofollow" `);
    };

    // Override heading
    renderer.heading = function (text, level, raw) {
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const headingTag = `<h${level} id="${id}">${text}</h${level}>`;

        let result = '';
        if (level <= currentLevel) {
            for (let i = currentLevel; i >= level; i--) {
                result += '</div></details>';
            }
        }

        currentLevel = level;

        result += `
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
        return result;
    };

    // Compile function
    const marked = new Marked(
        markedHighlight({
            langPrefix: 'hljs language-',
            highlight(code, lang) {
                const language = hljs.getLanguage(lang) ? lang : 'plaintext';
                return hljs.highlight(code, { language }).value;
            }
        })
    ).use({ gfm: true, breaks: true, renderer });

    const originalParse = marked.parse.bind(marked);
    marked.parse = (raw: string) => {
        const result = originalParse(raw);
        if (result instanceof Promise) {
            return result.then((res) => emoji.emojify(res + closeAllSections(currentLevel)));
        } else {
            return emoji.emojify(result + closeAllSections(currentLevel));
        }
    };

    function closeAllSections(level: number) {
        let html = '';
        for (let i = level; i > 0; i--) html += '</div></details>';
        return html;
    }

    return marked;
}


export function compileMarkdown(raw: string): string | Promise<string> {
    const compiler = createMarkdownCompiler(); // fresh state
    return compiler.parse(raw);
}