#![forbid(unsafe_code)]

mod commands;
mod menu;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Reveal the initially hidden main window unconditionally before any
            // fallible initialization so the app can never stay invisible.
            if let Some(window) = app.get_webview_window(menu::MAIN_WINDOW_LABEL) {
                let _ = window.show();
            }
            Ok(())
        })
        .menu(menu::build_menu)
        .on_menu_event(|app, event| menu::handle_menu_event(app, event.id().as_ref()))
        .invoke_handler(tauri::generate_handler![
            commands::get_app_info,
            commands::list_starter_items,
            commands::set_native_theme
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri canvas shell");
}
