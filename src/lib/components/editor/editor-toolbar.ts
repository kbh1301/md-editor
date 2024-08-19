// TODO: Cleanup this shitshow
// TODO: Add documentation



import type { EditorView } from "@codemirror/view";
import { SearchCursor } from "@codemirror/search"

export function getSelection(view: EditorView) {
    if (view) {
        const selection = view.state.sliceDoc(view.state.selection.main.from, view.state.selection.main.to);
        const start = view.state.selection.main.from;
        const end = view.state.selection.main.to;
        return { selection, start, end };
    }
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

// function getValue(view: EditorView) {
//     if (view) {
//         return view.state.doc.toString();
//     }
// }

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

function findSubstring(view: EditorView, substring: string) {
    if (view) {
        let cursor = new SearchCursor(view.state.doc, substring);
        return cursor.next().value;
    }
}

function handlePrefixSuffix(view: EditorView, start: number, end: number, prefix: string, suffix: string) {
    let textSelected = getSelection(view)?.selection;
    let textSelectedOuter = getRange(view, start - prefix.length, end + suffix.length);

    // Add or remove insertion at selection
    if (textSelectedOuter!.startsWith(prefix) && textSelectedOuter!.endsWith(suffix)) {
        let modifiedValue = textSelectedOuter!.slice(suffix.length, -prefix.length);
        replaceRange(
            view,
            start - prefix.length,
            end + suffix.length,
            modifiedValue
        );
        setSelection(
            view,
            start - prefix.length,
            end - suffix.length
        );
    } else {
        replaceRange(
            view,
            start,
            end,
            prefix + textSelected + suffix
        );
        setSelection(
            view,
            start + prefix.length,
            end + suffix.length
        );
    }
}

function handleHeading() {

}

function handlePrefixOnly(view: EditorView, prefix: string) {
    const selectionLines = getSelection(view)?.selection.split('\n');
    const allLinesHavePrefix = selectionLines?.every(line => line.startsWith(prefix));
    
    if (!selectionLines || selectionLines.length === 0) return;

    let startLineStart: number | null = null;
    let endLineEnd: number | null = null;

    selectionLines.forEach((line, index) => {
        const { from: lineStart, to: lineEnd } = findSubstring(view, line)!;
        
        if (index === 0) startLineStart = lineStart;
        if (index === selectionLines.length - 1) endLineEnd = lineEnd;

        if (allLinesHavePrefix) {
            if (line.startsWith(prefix)) {
                const lineOuter = getRange(view, lineStart, lineEnd);
                const modifiedValue = lineOuter!.replace(prefix, '');
                replaceRange(view, lineStart, lineEnd, modifiedValue);
            }
        } else {
            if (!line.startsWith(prefix)) {
                replaceRange(view, lineStart, lineStart, prefix);
            }
        }
    });

    if (startLineStart !== null && endLineEnd !== null) {
        setSelection(view, startLineStart, endLineEnd + (allLinesHavePrefix ? -prefix.length : prefix.length));
    }
}

export function modifySelection(view: EditorView, prefix: string, suffix = '') {
    let start = getSelection(view)?.start;
    let end = getSelection(view)?.end;

    if (!start || !end) return;
    
    view.focus();

    // if no selection, set selection at beginning and end of line where cursor is
    if (start === end) {
        const cursor = view.state.selection.main.head;
        start = view.state.doc.lineAt(cursor).from;
        end = view.state.doc.lineAt(cursor).to;

        setSelection(view, start, end);
    }

    if (suffix) {
        handlePrefixSuffix(view, start, end, prefix, suffix);
    } else {
        handlePrefixOnly(view, prefix);
    }
}

// export function modifyLineHeading(textarea: HTMLTextAreaElement, prefix: string) {
//     const { value, selectionStart, selectionEnd } = textarea;

//     // Determine the start and end positions of the current line or selected text
//     let start = selectionStart;
//     let end = selectionEnd;
    
//     // Expand the selection to cover the whole lines
//     while (start > 0 && value[start - 1] !== '\n') {
//         start--;
//     }
//     while (end < value.length && value[end] !== '\n') {
//         end++;
//     }

//     // Get the selected text including full lines
//     const selectedText = value.slice(start, end);
    
//     // Split the selected text into lines
//     const lines = selectedText.split('\n');
    
//     // Check if any line starts with Markdown heading symbols and remove them if prefix matches
//     const modifiedLines = lines.map(line => {
//         if (line.startsWith(prefix)) {
//             const strippedLine = line.slice(prefix.length).trimStart();
//             if (strippedLine.startsWith('#')) {
//                 return prefix + strippedLine.slice(1).trimStart();
//             }
//             return strippedLine;
//         } else {
//             const matchResult = line.match(/^#+\s/);
//             if (matchResult && matchResult.length > 0) {
//                 const headingPrefix = matchResult[0];
//                 return prefix + line.slice(headingPrefix.length).trimStart();
//             } else {
//                 return prefix + line;
//             }
//         }
//     });

//     // Join the modified lines back into a single string
//     const modifiedText = modifiedLines.join('\n');
    
//     // Construct the new value for the textarea
//     const newValue = value.slice(0, start) + modifiedText + value.slice(end);
    
//     // Update the textarea value and restore the selection
//     document.execCommand('selectAll', false, undefined);
//     document.execCommand('insertText', false, newValue);
//     textarea.setSelectionRange(start, start + modifiedText.length);
//     textarea.focus();
// }

export function insertLink(view: EditorView, type: 'link' | 'img', url: string, text: string, selectionRange: { start: number; end: number; }) {
    const { start, end } = selectionRange;
    const mdOutput = type === 'link' ? `[${text}](${url})` : `![${text}](${url})`;

    view.focus();
    replaceRange(view, start, end, mdOutput);
}

// function insertOrWrapText(textarea: HTMLTextAreaElement, open: string, close: string) {
//     const text = textarea.value;
//     let start = textarea.selectionStart;
//     let end = textarea.selectionEnd;

//     // Adjust start and end to exclude leading whitespace
//     while (start < end && /\s/.test(text[start])) {
//         start++;
//     }
//     while (end > start && /\s/.test(text[end - 1])) {
//         end--;
//     }

//     textarea.setSelectionRange(start, end);
//     const selectedText = text.slice(start, end);

//     if (selectedText) {
//         // Wrap selected text
//         document.execCommand('insertText', false, open + selectedText + close);
//         textarea.setSelectionRange(start + open.length, end + open.length);
//     } else {
//         // Insert pair at cursor position
//         document.execCommand('insertText', false, open + close);
//         textarea.setSelectionRange(start + open.length, start + open.length);
//     }
// }

// export function handleTextareaKeydown(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
//     const { key, shiftKey } = event;
//     const autoClosePairs: Record<string, string> = {
//         '(': ')',
//         '[': ']',
//         '{': '}',
//         '*': '*',
//         '_': '_',
//         '~': '~',
//         '"': '"',
//         "'": "'",
//     };

//     // Handle auto-closing pairs and smart symbol insertion
//     if (key in autoClosePairs) {
//         event.preventDefault();
//         const open = key;
//         const close = autoClosePairs[key];
//         insertOrWrapText(textarea, open, close);
//     }
// }