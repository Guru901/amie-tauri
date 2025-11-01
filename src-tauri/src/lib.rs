use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default().setup(|app| {
        let main_window = app.get_webview_window("main").unwrap();

        #[cfg(target_os = "macos")]
        {
            use cocoa::appkit::NSWindow;
            use cocoa::base::id;
            unsafe {
                use cocoa::base::NO;

                let ns_window = main_window.ns_window().unwrap() as id;
                ns_window.setCollectionBehavior_(
                    cocoa::appkit::NSWindowCollectionBehavior::NSWindowCollectionBehaviorCanJoinAllSpaces
                        | cocoa::appkit::NSWindowCollectionBehavior::NSWindowCollectionBehaviorFullScreenAuxiliary,
                );
                ns_window.setLevel_((cocoa::appkit::NSMainMenuWindowLevel + 2).into()); // float above normal windows
                ns_window.setHidesOnDeactivate_(NO); // don’t hide when switching apps
            }

        }

        Ok(())

    })
        .plugin(tauri_plugin_autostart::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
