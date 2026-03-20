use fancy_regex::Regex;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn talk(message: &str) -> String {
    format!("You said: {}", message)
}

#[tauri::command]
fn regex_match(pattern: &str, text: &str) -> Result<Vec<String>, String> {
    let re = Regex::new(pattern).map_err(|e| e.to_string())?;
    let matches: Vec<String> = re
        .find_iter(text)
        .filter_map(|m| m.ok())
        .map(|m| m.as_str().to_string())
        .collect();
    Ok(matches)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, talk, regex_match])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
