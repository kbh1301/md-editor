import { Menu } from "@tauri-apps/api/menu";
import { closeTab, closeTabAll, closeTabOthers, getDocPathToClipboard } from "$utils/documentsHandler";
import { openDocInExplorer } from "$utils/fileSystemHandler";
import { moveTabToNewWindow } from "$utils/appHandler";
import type { DocId } from "$lib/types";

async function createTabContextMenu(tabId: DocId): Promise<Menu> {
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
            { id: "tab-pin", text: "Pin" },
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