use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;
use image::GenericImageView;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageInfo {
    pub id: String,
    pub filename: String,
    pub original_name: String,
    pub width: u32,
    pub height: u32,
    pub size: u64,
    pub created_at: u64,
    pub imported_at: u64,
    pub source: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub parent_id: Option<String>,
    pub order: i32,
    pub created_at: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ImageTagRelation {
    pub image_id: String,
    pub tag_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TagsData {
    pub tags: Vec<Tag>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImageTagsData {
    pub relations: Vec<ImageTagRelation>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ImagesData {
    pub images: Vec<ImageInfo>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    pub version: u32,
    pub data_path: String,
    pub theme: String,
    pub last_opened_at: u64,
}

fn get_config_dir() -> PathBuf {
    dirs::config_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("gallery-cache")
}

fn ensure_data_dirs(data_path: &str) -> Result<(), String> {
    let base = PathBuf::from(data_path);
    let images_dir = base.join("images");
    let metadata_dir = base.join("metadata");

    fs::create_dir_all(&images_dir).map_err(|e| e.to_string())?;
    fs::create_dir_all(&metadata_dir).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn get_config() -> Result<AppConfig, String> {
    let config_path = get_config_dir().join("config.json");

    if config_path.exists() {
        let content = fs::read_to_string(&config_path).map_err(|e| e.to_string())?;
        serde_json::from_str(&content).map_err(|e| e.to_string())
    } else {
        Err("No config found".to_string())
    }
}

#[tauri::command]
fn save_config(config: AppConfig) -> Result<(), String> {
    let config_dir = get_config_dir();
    fs::create_dir_all(&config_dir).map_err(|e| e.to_string())?;

    let config_path = config_dir.join("config.json");
    let content = serde_json::to_string_pretty(&config).map_err(|e| e.to_string())?;
    fs::write(&config_path, content).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn init_data_dir(data_path: String) -> Result<(), String> {
    ensure_data_dirs(&data_path)?;

    let metadata_dir = PathBuf::from(&data_path).join("metadata");

    let tags_path = metadata_dir.join("tags.json");
    if !tags_path.exists() {
        let tags_data = TagsData { tags: vec![] };
        let content = serde_json::to_string_pretty(&tags_data).map_err(|e| e.to_string())?;
        fs::write(&tags_path, content).map_err(|e| e.to_string())?;
    }

    let image_tags_path = metadata_dir.join("image-tags.json");
    if !image_tags_path.exists() {
        let image_tags_data = ImageTagsData { relations: vec![] };
        let content = serde_json::to_string_pretty(&image_tags_data).map_err(|e| e.to_string())?;
        fs::write(&image_tags_path, content).map_err(|e| e.to_string())?;
    }

    let images_path = metadata_dir.join("images.json");
    if !images_path.exists() {
        let images_data = ImagesData { images: vec![] };
        let content = serde_json::to_string_pretty(&images_data).map_err(|e| e.to_string())?;
        fs::write(&images_path, content).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
fn load_tags(data_path: String) -> Result<TagsData, String> {
    let tags_path = PathBuf::from(&data_path).join("metadata").join("tags.json");
    let content = fs::read_to_string(&tags_path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_tags(data_path: String, tags_data: TagsData) -> Result<(), String> {
    let tags_path = PathBuf::from(&data_path).join("metadata").join("tags.json");
    let content = serde_json::to_string_pretty(&tags_data).map_err(|e| e.to_string())?;
    fs::write(&tags_path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_image_tags(data_path: String) -> Result<ImageTagsData, String> {
    let path = PathBuf::from(&data_path).join("metadata").join("image-tags.json");
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_image_tags(data_path: String, image_tags_data: ImageTagsData) -> Result<(), String> {
    let path = PathBuf::from(&data_path).join("metadata").join("image-tags.json");
    let content = serde_json::to_string_pretty(&image_tags_data).map_err(|e| e.to_string())?;
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_images(data_path: String) -> Result<ImagesData, String> {
    let path = PathBuf::from(&data_path).join("metadata").join("images.json");
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&content).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_images(data_path: String, images_data: ImagesData) -> Result<(), String> {
    let path = PathBuf::from(&data_path).join("metadata").join("images.json");
    let content = serde_json::to_string_pretty(&images_data).map_err(|e| e.to_string())?;
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
fn save_image_from_base64(data_path: String, base64_data: String, source: String) -> Result<ImageInfo, String> {
    let images_dir = PathBuf::from(&data_path).join("images");

    let id = Uuid::new_v4().to_string();
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    let image_data = base64_data
        .replace("data:image/png;base64,", "")
        .replace("data:image/jpeg;base64,", "")
        .replace("data:image/gif;base64,", "")
        .replace("data:image/webp;base64,", "");

    let decoded = base64::Engine::decode(
        &base64::engine::general_purpose::STANDARD,
        &image_data
    ).map_err(|e| e.to_string())?;

    let ext = if base64_data.contains("data:image/png") {
        "png"
    } else if base64_data.contains("data:image/gif") {
        "gif"
    } else if base64_data.contains("data:image/webp") {
        "webp"
    } else {
        "jpg"
    };

    let filename = format!("{}.{}", id, ext);

    let (width, height) = match image::load_from_memory(&decoded) {
        Ok(img) => {
            let (w, h) = img.dimensions();
            (w, h)
        }
        Err(_) => (0, 0),
    };

    let file_path = images_dir.join(&filename);
    fs::write(&file_path, &decoded).map_err(|e| e.to_string())?;

    let size = decoded.len() as u64;

    Ok(ImageInfo {
        id,
        filename,
        original_name: String::new(),
        width,
        height,
        size,
        created_at: now,
        imported_at: now,
        source,
    })
}

#[tauri::command]
fn download_image(data_path: String, url: String) -> Result<ImageInfo, String> {
    let images_dir = PathBuf::from(&data_path).join("images");

    let id = Uuid::new_v4().to_string();
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as u64;

    let response = reqwest::blocking::get(&url).map_err(|e| e.to_string())?;
    let bytes = response.bytes().map_err(|e| e.to_string())?;

    let ext = if url.contains(".png") {
        "png"
    } else if url.contains(".gif") {
        "gif"
    } else if url.contains(".webp") {
        "webp"
    } else {
        "jpg"
    };

    let filename = format!("{}.{}", id, ext);
    let file_path = images_dir.join(&filename);
    fs::write(&file_path, &bytes).map_err(|e| e.to_string())?;

    let (width, height) = match image::load_from_memory(&bytes) {
        Ok(img) => img.dimensions(),
        Err(_) => (0, 0),
    };

    let size = bytes.len() as u64;

    let original_name = url
        .split('/')
        .last()
        .unwrap_or("")
        .split('?')
        .next()
        .unwrap_or("")
        .to_string();

    Ok(ImageInfo {
        id,
        filename,
        original_name,
        width,
        height,
        size,
        created_at: now,
        imported_at: now,
        source: "cdn".to_string(),
    })
}

#[tauri::command]
fn delete_image(data_path: String, _image_id: String, filename: String) -> Result<(), String> {
    let file_path = PathBuf::from(&data_path).join("images").join(&filename);
    if file_path.exists() {
        fs::remove_file(&file_path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn get_image_path(data_path: String, filename: String) -> String {
    PathBuf::from(&data_path)
        .join("images")
        .join(&filename)
        .to_string_lossy()
        .to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_config,
            save_config,
            init_data_dir,
            load_tags,
            save_tags,
            load_image_tags,
            save_image_tags,
            load_images,
            save_images,
            save_image_from_base64,
            download_image,
            delete_image,
            get_image_path,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
