// TODO: Cleanup this shitshow



/**
     * Finds the positions of the nearest newlines to the left and right of a selection in a textarea.
     * 
     * @param {HTMLTextAreaElement} textarea - The textarea element containing the text.
     * @param {number} start - The starting position of the selection.
     * @param {number} end - The ending position of the selection.
     * 
     * @returns {{leftNewline: number, rightNewline: number}} An object containing the positions of the nearest newlines.
     */
function findNewlinePositions(textarea: HTMLTextAreaElement, start: number, end: number): { leftNewline: number; rightNewline: number; } {
    const currentValue = textarea.value;

    let leftNewline = -1;
    let rightNewline = -1;

    // Search left of the selected text
    for (let i = start - 1; i >= 0; i--) {
        if (currentValue[i] === '\n') {
            leftNewline = i;
            break;
        }
    }

    // Search right of the selected text
    for (let i = end; i < currentValue.length; i++) {
        if (currentValue[i] === '\n') {
            rightNewline = i;
            break;
        }
    }

    return { leftNewline, rightNewline };
}

export function modifySelection(textarea: HTMLTextAreaElement, prefix: string, suffix = '') {
    const currentValue = textarea.value;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;
    
    textarea.focus();

    // Adjust start and end to exclude leading whitespace
    while (start < end && /\s/.test(currentValue[start])) {
        start++;
    }
    while (end > start && /\s/.test(currentValue[end - 1])) {
        end--;
    }

    // if no selection or suffix, place insertion at beginning and end of line where cursor is
    if (start === end || suffix === '') {
        const { leftNewline, rightNewline } = findNewlinePositions(textarea, start, end);
        start = leftNewline + 1;
        end = rightNewline;
    }

    textarea.setSelectionRange(start, end);

    let textSelected = textarea.value.substring(start, end);
    let textSelectedOuter = textarea.value.substring(start - prefix.length, end + suffix.length);
    
    // Add or remove insertion at selection
    if (textSelectedOuter.startsWith(prefix) && textSelectedOuter.endsWith(suffix)) {
        let modifiedValue = currentValue.slice(0, start - prefix.length) + currentValue.slice(start);
        modifiedValue = modifiedValue.slice(0, end - suffix.length) + modifiedValue.slice(end);

        document.execCommand('selectAll', false, undefined);
        document.execCommand('insertText', false, modifiedValue);
        textarea.setSelectionRange(start - prefix.length, end - suffix.length);
    } else {
        document.execCommand('insertText', false, prefix + textSelected + suffix);
        textarea.setSelectionRange(start + prefix.length, end + suffix.length);
    }
}

export function modifyLine(textarea: HTMLTextAreaElement, prefix: string) {
    const { value, selectionStart, selectionEnd } = textarea;

    // Determine the start and end positions of the current line or selected text
    let start = selectionStart;
    let end = selectionEnd;
    
    // Expand the selection to cover the whole lines
    while (start > 0 && value[start - 1] !== '\n') {
        start--;
    }
    while (end < value.length && value[end] !== '\n') {
        end++;
    }

    // Get the selected text including full lines
    const selectedText = value.slice(start, end);
    
    // Split the selected text into lines
    const lines = selectedText.split('\n');
    
    // Determine if the prefix is present on all lines
    const allLinesHavePrefix = lines.every(line => line.startsWith(prefix));
    
    // Modify lines based on whether they all have the prefix or not
    const modifiedLines = lines.map(line => {
        if (allLinesHavePrefix) {
            return line.startsWith(prefix) ? line.slice(prefix.length) : line;
        } else {
            return line.startsWith(prefix) ? line : prefix + line;
        }
    });

    // Join the modified lines back into a single string
    const modifiedText = modifiedLines.join('\n');
    
    // Construct the new value for the textarea
    const newValue = value.slice(0, start) + modifiedText + value.slice(end);
    
    // Update the textarea value and restore the selection
    document.execCommand('selectAll', false, undefined);
    document.execCommand('insertText', false, newValue);
    textarea.setSelectionRange(start, start + modifiedText.length);
    textarea.focus();
}

export function modifyLineHeading(textarea: HTMLTextAreaElement, prefix: string) {
    const { value, selectionStart, selectionEnd } = textarea;

    // Determine the start and end positions of the current line or selected text
    let start = selectionStart;
    let end = selectionEnd;
    
    // Expand the selection to cover the whole lines
    while (start > 0 && value[start - 1] !== '\n') {
        start--;
    }
    while (end < value.length && value[end] !== '\n') {
        end++;
    }

    // Get the selected text including full lines
    const selectedText = value.slice(start, end);
    
    // Split the selected text into lines
    const lines = selectedText.split('\n');
    
    // Check if any line starts with Markdown heading symbols and remove them if prefix matches
    const modifiedLines = lines.map(line => {
        // TODO: Delete
        // if (line.startsWith(prefix)) {
        //     const strippedLine = line.slice(prefix.length).trimStart();
        //     if (strippedLine.startsWith('#')) {
        //         return prefix + strippedLine.slice(1).trimStart();
        //     }
        //     return strippedLine;
        // } else if (line.match(/^#+\s/)) {
        //     const headingPrefix = line.match(/^#+/)[0];
        //     return prefix + line.slice(headingPrefix.length).trimStart();
        // } else {
        //     return prefix + line;
        // }
        if (line.startsWith(prefix)) {
            const strippedLine = line.slice(prefix.length).trimStart();
            if (strippedLine.startsWith('#')) {
                return prefix + strippedLine.slice(1).trimStart();
            }
            return strippedLine;
        } else {
            const matchResult = line.match(/^#+\s/);
            if (matchResult && matchResult.length > 0) {
                const headingPrefix = matchResult[0];
                return prefix + line.slice(headingPrefix.length).trimStart();
            } else {
                return prefix + line;
            }
        }
    });

    // Join the modified lines back into a single string
    const modifiedText = modifiedLines.join('\n');
    
    // Construct the new value for the textarea
    const newValue = value.slice(0, start) + modifiedText + value.slice(end);
    
    // Update the textarea value and restore the selection
    document.execCommand('selectAll', false, undefined);
    document.execCommand('insertText', false, newValue);
    textarea.setSelectionRange(start, start + modifiedText.length);
    textarea.focus();
}

export function insertLink(textarea: HTMLTextAreaElement, type: 'link' | 'img', url: string, text: string) {
    const mdOutput = type === 'link' ? `[${text}](${url})` : `![${text}](${url})`;

    textarea.focus();
    document.execCommand('insertText', false, mdOutput);
}

function insertOrWrapText(textarea: HTMLTextAreaElement, open: string, close: string) {
    const text = textarea.value;
    let start = textarea.selectionStart;
    let end = textarea.selectionEnd;

    // Adjust start and end to exclude leading whitespace
    while (start < end && /\s/.test(text[start])) {
        start++;
    }
    while (end > start && /\s/.test(text[end - 1])) {
        end--;
    }

    textarea.setSelectionRange(start, end);
    const selectedText = text.slice(start, end);

    if (selectedText) {
        // Wrap selected text
        document.execCommand('insertText', false, open + selectedText + close);
        textarea.setSelectionRange(start + open.length, end + open.length);
    } else {
        // Insert pair at cursor position
        document.execCommand('insertText', false, open + close);
        textarea.setSelectionRange(start + open.length, start + open.length);
    }
}

export function handleTextareaKeydown(event: KeyboardEvent, textarea: HTMLTextAreaElement) {
    const { key, shiftKey } = event;
    const autoClosePairs: Record<string, string> = {
        '(': ')',
        '[': ']',
        '{': '}',
        '*': '*',
        '_': '_',
        '~': '~',
        '"': '"',
        "'": "'",
    };

    // Handle auto-closing pairs and smart symbol insertion
    if (key in autoClosePairs) {
        event.preventDefault();
        const open = key;
        const close = autoClosePairs[key];
        insertOrWrapText(textarea, open, close);
    }
}