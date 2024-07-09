import { saveMarkdownFile } from "$utils/fileHandler";

function handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        saveMarkdownFile();
    }
}

export function initKeydownListener() {
    window.addEventListener('keydown', handleKeydown);
}

export function removeKeydownListener() {
    window.removeEventListener('keydown', handleKeydown);
}