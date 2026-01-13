// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Emitter, Manager};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            let paths: Vec<String> = argv
                .iter()
                .filter(|arg| arg.ends_with(".md"))
                .cloned()
                .collect();

            if !paths.is_empty() {
                app.emit("open-files", paths).unwrap();
            }
        }))
        .setup(|_app| Ok(()))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_version, set_title])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_version(app: tauri::AppHandle) -> Result<String, String> {
    let config = app.config();
    let version = config
        .version
        .as_ref()
        .map(|v| v.as_str())
        .unwrap_or("0.1.0");

    Ok(version.to_string())
}

#[tauri::command]
fn set_title(app: tauri::AppHandle, window_label: String, title: String) {
    if let Some(window) = app.get_webview_window(&window_label) {
        window.set_title(&title).unwrap_or_else(|e| {
            eprintln!("Failed to set title for window {}: {}", window_label, e);
        });
    }
}
