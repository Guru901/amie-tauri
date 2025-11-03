use tauri::{Manager, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            #[cfg(target_os = "macos")]
            {
                // Apply settings to all existing windows
                for window in app.webview_windows().values() {
                    apply_mac_always_on_top(window);
                }

                // Listen for new webview windows being created
                let app_handle = app.handle().clone();
                tauri::async_runtime::spawn(async move {
                    use std::sync::Arc;
                    use tauri::Listener;

                    let app_handle_arc = Arc::new(app_handle);
                    let event_app_handle = Arc::clone(&app_handle_arc);

                    event_app_handle.listen("tauri://window-created", {
                        let event_app_handle = Arc::clone(&event_app_handle);
                        move |event| {
                            let label = event.payload();
                            if let Some(window) = event_app_handle.get_webview_window(label) {
                                apply_mac_always_on_top(&window);
                            }
                        }
                    });
                });
            }
            Ok(())
        })
        .on_window_event(|event_window, window_event| {
            #[cfg(target_os = "macos")]
            {
                // On certain window events, reapply behaviors
                if let WindowEvent::Focused(true) = window_event {
                    // Reapply settings when window gains focus
                    for webview_win in event_window.webview_windows().values() {
                        apply_mac_always_on_top(&webview_win);
                    }
                }
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "macos")]
fn apply_mac_always_on_top(window: &tauri::WebviewWindow) {
    if window.label() == "settings" {
        return;
    }

    use cocoa::appkit::{NSMainMenuWindowLevel, NSWindow, NSWindowCollectionBehavior};
    use cocoa::base::id;

    unsafe {
        let ns_window: id = match window.ns_window() {
            Ok(ptr) => ptr as id,
            Err(_) => return,
        };

        // Set window collection behaviors to appear on all desktops/spaces
        let behaviors = NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary
            | NSWindowCollectionBehavior::NSWindowCollectionBehaviorStationary;
        ns_window.setCollectionBehavior_(behaviors);

        // Set window level to float above everything, even fullscreen content
        ns_window.setLevel_(NSMainMenuWindowLevel as i64);

        // Don't hide when app loses focus
        ns_window.setHidesOnDeactivate_(false);

        // Uncomment if you want click-through mode (mouse events are ignored)
        // use cocoa::base::YES;
        // ns_window.setIgnoresMouseEvents_(YES);
    }

    // Use Tauri's built-in APIs
    let _ = window.set_always_on_top(true);

    // This makes the window visible on all workspaces/desktops (Tauri v2 API)
    let _ = window.set_visible_on_all_workspaces(true);
}
