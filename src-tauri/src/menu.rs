use tauri::menu::{Menu, MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::{AppHandle, Emitter, Runtime};

pub const MAIN_WINDOW_LABEL: &str = "main";

const MENU_EVENTS: [&str; 8] = [
    "menu:navigate-home",
    "menu:navigate-workspace",
    "menu:navigate-activity",
    "menu:toggle-sidebar",
    "menu:toggle-inspector",
    "menu:open-palette",
    "menu:open-settings",
    "menu:open-about",
];

pub fn resolve_menu_event(id: &str) -> Option<&'static str> {
    MENU_EVENTS.iter().copied().find(|event| *event == id)
}

pub fn build_menu<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let settings = MenuItemBuilder::with_id("menu:open-settings", "Settings…")
        .accelerator("CmdOrCtrl+,")
        .build(app)?;

    let view_home = MenuItemBuilder::with_id("menu:navigate-home", "Studio")
        .accelerator("CmdOrCtrl+1")
        .build(app)?;
    let view_workspace = MenuItemBuilder::with_id("menu:navigate-workspace", "Canvas")
        .accelerator("CmdOrCtrl+2")
        .build(app)?;
    let view_activity = MenuItemBuilder::with_id("menu:navigate-activity", "Stream")
        .accelerator("CmdOrCtrl+3")
        .build(app)?;
    let toggle_sidebar = MenuItemBuilder::with_id("menu:toggle-sidebar", "Toggle Sidebar")
        .accelerator("CmdOrCtrl+\\")
        .build(app)?;
    let toggle_inspector = MenuItemBuilder::with_id("menu:toggle-inspector", "Toggle Inspector")
        .accelerator("CmdOrCtrl+I")
        .build(app)?;
    let open_palette = MenuItemBuilder::with_id("menu:open-palette", "Command Palette…")
        .accelerator("CmdOrCtrl+K")
        .build(app)?;

    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&view_home)
        .item(&view_workspace)
        .item(&view_activity)
        .separator()
        .item(&toggle_sidebar)
        .item(&toggle_inspector)
        .separator()
        .item(&open_palette)
        .build()?;

    let mut builder = MenuBuilder::new(app);

    #[cfg(target_os = "macos")]
    {
        let about = MenuItemBuilder::with_id("menu:open-about", "About Tauri Canvas Shell")
            .build(app)?;
        let app_menu = SubmenuBuilder::new(app, "Tauri Canvas Shell")
            .item(&about)
            .separator()
            .item(&settings)
            .separator()
            .services()
            .separator()
            .hide()
            .hide_others()
            .show_all()
            .separator()
            .quit()
            .build()?;

        let edit_menu = SubmenuBuilder::new(app, "Edit")
            .cut()
            .copy()
            .paste()
            .select_all()
            .build()?;

        let window_menu = SubmenuBuilder::new(app, "Window")
            .minimize()
            .maximize()
            .fullscreen()
            .close_window()
            .build()?;

        builder = builder
            .item(&app_menu)
            .item(&edit_menu)
            .item(&view_menu)
            .item(&window_menu);
    }

    #[cfg(not(target_os = "macos"))]
    {
        let file_menu = SubmenuBuilder::new(app, "File")
            .item(&settings)
            .separator()
            .quit()
            .build()?;

        builder = builder.item(&file_menu).item(&view_menu);
    }

    builder.build()
}

pub fn handle_menu_event<R: Runtime>(app: &AppHandle<R>, id: &str) {
    if let Some(event) = resolve_menu_event(id) {
        let _ = app.emit_to(MAIN_WINDOW_LABEL, event, ());
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resolves_known_menu_events_and_ignores_unknown_ids() {
        assert_eq!(
            resolve_menu_event("menu:open-palette"),
            Some("menu:open-palette")
        );
        assert_eq!(
            resolve_menu_event("menu:toggle-sidebar"),
            Some("menu:toggle-sidebar")
        );
        assert_eq!(resolve_menu_event("unknown:command"), None);
    }
}
