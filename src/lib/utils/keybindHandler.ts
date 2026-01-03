import { fontIncrease, fontDecrease } from "$utils/settingsHandler";
import { saveMarkdownFile } from "$utils/fileSystemHandler";
import { createNewDocument } from '$utils/documentsHandler';

function handleKeydown(event: KeyboardEvent) {
    // ctrl keybinds
    if (event.ctrlKey) {
        // ctrl + s
        if (event.key === 's') {
            event.preventDefault();
            saveMarkdownFile();
        }

        // ctrl + n
        if (event.key === 'n') {
            event.preventDefault();
            createNewDocument();
        }

        // ctrl + -
        if (event.key === '-') {
            event.preventDefault();
            fontDecrease();
        }

        // ctrl + =
        if (event.key === '=') {
            event.preventDefault();
            fontIncrease();
        }
    }
}

function handleWheel(event: WheelEvent) {
    // ctrl keybinds
    if (event.ctrlKey) {
        // ctrl + wheeldown
        if (event.deltaY > 0) {
            fontDecrease();
        }

        // ctrl + wheelup
        if (event.deltaY < 0) {
            fontIncrease();
        }
    }
}

export function initKeydownListener() {
    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('wheel', handleWheel);
}

export function removeKeydownListener() {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('wheel', handleWheel);
}