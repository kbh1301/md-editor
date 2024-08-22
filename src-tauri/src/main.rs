// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use window_shadows::set_shadow;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_watch::init())
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            set_shadow(&window, true).expect("Unsupported platform!");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_filepath, get_version])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn get_filepath() -> Result<String, String> {
    // Retrieve the command line arguments passed to the application
    let args: Vec<String> = std::env::args().collect();
    
    // The first argument should be the path of the .md file that opened the app
    if let Some(file_path) = args.get(1) {
        Ok(file_path.clone())
    } else {
        Ok("".into())
    }
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