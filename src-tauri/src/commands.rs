use serde::Serialize;
use tauri::{AppHandle, Manager, Theme, window::Color};

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AppInfo {
    pub name: String,
    pub version: String,
    pub platform: String,
    pub runtime: &'static str,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StarterItem {
    pub id: String,
    pub title: String,
    pub subtitle: String,
    pub status: &'static str,
    pub progress: u8,
    pub updated_at: &'static str,
}

#[tauri::command]
pub fn get_app_info(app: AppHandle) -> AppInfo {
    let package = app.package_info();
    AppInfo {
        name: package.name.clone(),
        version: package.version.to_string(),
        platform: std::env::consts::OS.to_owned(),
        runtime: "tauri",
    }
}

#[tauri::command]
pub fn list_starter_items() -> Vec<StarterItem> {
    vec![
        StarterItem {
            id: "item-1".to_owned(),
            title: "Shell Architecture".to_owned(),
            subtitle: "Canvas-embedded sidebar + floating inset panel".to_owned(),
            status: "active",
            progress: 72,
            updated_at: "Just now",
        },
        StarterItem {
            id: "item-2".to_owned(),
            title: "Motion & Transitions".to_owned(),
            subtitle: "View Transitions, motion/mini nudge, and top-layer dialogs".to_owned(),
            status: "ready",
            progress: 100,
            updated_at: "5m ago",
        },
        StarterItem {
            id: "item-3".to_owned(),
            title: "Tauri IPC & TanStack".to_owned(),
            subtitle: "Typed invoke bridge backed by TanStack Query cache".to_owned(),
            status: "ready",
            progress: 45,
            updated_at: "18m ago",
        },
    ]
}

/// Syncs native OS window chrome (titlebar, dialogs, menu surfaces) with the
/// user's theme preference. Passing `"system"` resets to OS-managed chrome.
#[tauri::command]
pub fn set_native_theme(app: AppHandle, theme: String) -> Result<(), String> {
    let (native_theme, background) = match theme.as_str() {
        "dark" => (Some(Theme::Dark), Some(Color(7, 8, 17, 255))),
        "light" => (Some(Theme::Light), Some(Color(243, 245, 252, 255))),
        "system" => (None, None),
        _ => return Err(format!("unsupported theme value: {theme}")),
    };

    for window in app.webview_windows().values() {
        let _ = window.set_theme(native_theme);
        if let Some(bg) = background {
            let _ = window.set_background_color(Some(bg));
        } else if let Ok(resolved) = window.theme() {
            let bg = match resolved {
                Theme::Light => Color(243, 245, 252, 255),
                _ => Color(7, 8, 17, 255),
            };
            let _ = window.set_background_color(Some(bg));
        }
    }

    Ok(())
}
