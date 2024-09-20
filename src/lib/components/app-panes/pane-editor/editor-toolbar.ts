import type { EditorView } from "@codemirror/view";

export function getSelection(view: EditorView) {
    if (view) {
        const { from, to } = view.state.selection.main;
        const text = view.state.sliceDoc(from, to);

        // Get the start and end positions of each line within the selection
        const lines = [];
        for (let pos = from; pos <= to;) {
            const line = view.state.doc.lineAt(pos);
            const lineText = line.text;
            const lineStart = line.from;
            const lineEnd = Math.min(line.to, to); // Ensure we don't go beyond the selection

            lines.push({ lineText, lineStart, lineEnd });
            pos = line.to + 1; // Move to the next line
        }

        return { text, start: from, end: to, lines };
    }
    return null;
}

function setSelection(view: EditorView, start: number, end: number) {
    if (view) {
        view.dispatch({
            selection: {
                anchor: start,
                head: end
            }
        })
    }
}

function getRange(view: EditorView, start: number, end: number) {
    if (view) {
        return view.state.sliceDoc(start, end);
    }
}

function replaceRange(view: EditorView, start: number, end: number, newValue: string) {
    if (view) {
        return view.dispatch({
            changes: {
                from: start,
                to: end,
                insert: newValue
            }
        });
    }
}

function handleChange(view: EditorView, prefix: string, suffix: string | null = null) {
    const selection = getSelection(view);
    if (!selection) return;

    const text = selection.text;
    let start = selection.start;
    let end = selection.end;

    const textOuter = getRange(view, start - (prefix?.length || 0), end + (suffix?.length || 0));

    // Handle prefix and suffix together
    if (suffix !== null) {
        if (textOuter!.startsWith(prefix) && textOuter!.endsWith(suffix)) {
            let modifiedValue = textOuter!.slice(prefix.length, -suffix.length);
            replaceRange(view, start - prefix.length, end + suffix.length, modifiedValue);
            setSelection(view, start - prefix.length, end - suffix.length);
        } else {
            replaceRange(view, start, end, prefix + text + suffix);
            setSelection(view, start + prefix.length, end + suffix.length);
        }
    }
    // Handle prefix only
    else {
        const lines = selection.lines;
        const allLinesHavePrefix = lines.every(line => line.lineText.startsWith(prefix));
        const headingRegex = /^(#+)\s*/;

        let offset = 0;

        lines.forEach((line, index) => {
            let { lineText, lineStart, lineEnd } = line;

            lineStart += offset;
            lineEnd += offset;

            if (allLinesHavePrefix) {
                if (lineText.startsWith(prefix)) {
                    replaceRange(view, lineStart, lineStart + prefix.length, "");
                    offset -= prefix.length;
                    end -= prefix.length;
                }
            } else {
                if (lineText.startsWith(prefix)) return;
                const headingMatch = lineText.match(headingRegex);

                // Remove existing heading prefix if there is one
                if (headingMatch) {
                    const headingLength = headingMatch[0].length;
                    replaceRange(view, lineStart, lineStart + headingLength, "");
                    offset -= headingLength;
                    end -= headingLength;
                    lineText = lineText.slice(headingLength);
                }

                // Apply the new prefix
                replaceRange(view, lineStart, lineStart, prefix + "");
                offset += prefix.length;
                end += prefix.length;
            }
        });

        setSelection(view, start, end);
    }
}

export function modifySelection(view: EditorView, prefix: string, suffix: string | null = null) {
    const selection = getSelection(view);
    let start = selection?.start;
    let end = selection?.end;
    
    if (start === null || end === null) return;
    
    view.focus();

    // if no selection, set selection at beginning and end of line where cursor is
    if (start === end) {
        const cursor = view.state.selection.main.head;
        start = view.state.doc.lineAt(cursor).from;
        end = view.state.doc.lineAt(cursor).to;

        setSelection(view, start, end);
    }

    handleChange(view, prefix, suffix);
}

export function insertLink(view: EditorView, type: 'link' | 'img', url: string, text: string, selectionRange: { start: number; end: number; }) {
    const { start, end } = selectionRange;
    const mdOutput = type === 'link' ? `[${text}](${url})` : `![${text}](${url})`;

    view.focus();
    replaceRange(view, start, end, mdOutput);
}