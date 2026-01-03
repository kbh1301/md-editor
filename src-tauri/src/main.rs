// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use window_shadows::set_shadow;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            let paths: Vec<String> = argv
                .iter()
                .filter(|arg| arg.ends_with(".md"))
                .cloned()
                .collect();

            if !paths.is_empty() {
                app.emit_all("open-files", paths).unwrap();
            }
        }))
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_version, set_title])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_version() -> Result<String, String> {
    let context = tauri::generate_context!();
    let config = context.config();
    let version = &config.package.version;

    match version {
        Some(v) => Ok(v.clone()),
        None => Err("Version not found in tauri.conf.json".into()),
    }
}

#[tauri::command]
fn set_title(app: tauri::AppHandle, title: String) {
    let window = app.get_window("main").unwrap();
    window.set_title(&title).unwrap();
}