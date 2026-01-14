import { Menu } from "@tauri-apps/api/menu";
import { get } from "svelte/store";
import { closeTab, closeTabAll, closeTabOthers, getDocPathToClipboard, togglePinTab } from "$utils/documentsHandler";
import { openDocInExplorer } from "$utils/fileSystemHandler";
import { moveTabToNewWindow } from "$utils/appHandler";
import { documents } from "$lib/stores";
import type { DocId } from "$lib/types";

async function createTabContextMenu(tabId: DocId): Promise<Menu> {
    const doc = get(documents).get(tabId);
    const isPinned = doc?.isPinned ?? false;

    return Menu.new({
        items: [
            { id: "tab-close", text: "Close", action: () => { closeTab(tabId) } },
            { id: "tab-close-others", text: "Close Others", action: () => { closeTabOthers(tabId) } },
            // { id: "tab-close-right", text: "Close to the Right" },
            { id: "tab-close-all", text: "Close All", action: () => { closeTabAll() } },
            { item: "Separator" },
            // ----------------------------------
            { id: "tab-copy-path", text: "Copy Path", action: () => { getDocPathToClipboard(tabId) } },
            { item: "Separator" },
            // ----------------------------------
            { id: "tab-open-explorer", text: "Reveal in File Explorer", action: () => { openDocInExplorer(tabId) } },
            { item: "Separator" },
            // ----------------------------------
            { id: "tab-pin", text: isPinned ? "Unpin" : "Pin", action: () => { togglePinTab(tabId) } },
            { item: "Separator" },
            // ----------------------------------
            { id: "tab-new-window", text: "Move into New Window", action: () => { moveTabToNewWindow(tabId) } },
        ]
    });
}

export async function showTabContextMenu(event: MouseEvent, tabId: DocId) {
    event.preventDefault();
    const tabContextMenu = await createTabContextMenu(tabId);
    await tabContextMenu.popup();
}