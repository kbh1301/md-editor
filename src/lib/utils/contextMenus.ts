import { Menu } from "@tauri-apps/api/menu";
import { closeTab, closeTabAll, closeTabOthers, getDocPathToClipboard } from "$utils/documentsHandler";
import { openDocInExplorer } from "$utils/fileSystemHandler";
import type { DocId } from "$lib/types";

let activeContextTabId: DocId;

const tabContextMenu = Menu.new({
    items: [
        { id: "tab-close", text: "Close", action: () => { closeTab(activeContextTabId) } },
        { id: "tab-close-others", text: "Close Others", action: () => { closeTabOthers(activeContextTabId) } },
        // { id: "tab-close-right", text: "Close to the Right" },
        { id: "tab-close-all", text: "Close All", action: () => { closeTabAll() } },
        { item: "Separator" },
        // ----------------------------------
        { id: "tab-copy-path", text: "Copy Path", action: () => { getDocPathToClipboard(activeContextTabId) } },
        { item: "Separator" },
        // ----------------------------------
        { id: "tab-open-explorer", text: "Reveal in File Explorer", action: () => { openDocInExplorer(activeContextTabId) } },
        { item: "Separator" },
        // ----------------------------------
        { id: "tab-pin", text: "Pin" },
        { item: "Separator" },
        // ----------------------------------
        { id: "tab-new-window", text: "Move into New Window" },
    ]
})

export async function showTabContextMenu(event: MouseEvent, tabId: DocId) {
    event.preventDefault();
    activeContextTabId = tabId;
    (await tabContextMenu).popup();
}