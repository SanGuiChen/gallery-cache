use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use uuid::Uuid;
use image::GenericImageView;
use reqwest::header::CONTENT_TYPE;

fn infer_image_extension(url: &str, content_type: Option<&str>, bytes: &[u8]) -> &'static str {
    let normalized_content_type = content_type
        .unwrap_or_default()
        .split(';')
        .next()
        .unwrap_or_default()
        .trim()
        .to_ascii_lowercase();

    match normalized_content_type.as_str() {
        "image/png" => return "png",
        "image/gif" => return "gif",
        "image/webp" => return "webp",
        "image/bmp" => return "bmp",
        "image/svg+xml" => return "svg",
        "image/avif" => return "avif",
        "image/jpeg" | "image/jpg" => return "jpg",
        _ => {}
    }

    if let Ok(format) = image::guess_format(bytes) {
        return match format {
            image::ImageFormat::Png => "png",
            image::ImageFormat::Gif => "gif",
            image::ImageFormat::WebP => "webp",
            image::ImageFormat::Bmp => "bmp",
            image::ImageFormat::Avif => "avif",
            image::ImageFormat::Jpeg => "jpg",
            _ => infer_extension_from_url(url),
        };
    }

    infer_extension_from_url(url)
}

fn infer_extension_from_url(url: &str) -> &'static str {
    let normalized_url = url.to_ascii_lowercase();

    if normalized_url.contains(".png") {
        "png"
    } else if normalized_url.contains(".gif") {
        "gif"
    } else if normalized_url.contains(".webp") {
        "webp"
    } else if normalized_url.contains(".bmp") {
        "bmp"
    } else if normalized_url.contains(".svg") {
        "svg"
    } else if normalized_url.contains(".avif") {
        "avif"
    } else {
        "jpg"
    }
}

fn derive_original_name(url: &str, fallback_ext: &str) -> String {
    let last_segment = url
        .split('/')
        .last()
        .unwrap_or("")
        .split('?')
        .next()
        .unwrap_or("")
        .trim();

    if !last_segment.is_empty() {
        return last_segment.to_string();
    }

    format!("cdn-image.{}", fallback_ext)
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ImageInfo {
    pub id: String,
    pub filename: String,
    #[serde(alias = "original_name")]
    pub original_name: String,
    pub width: u32,
    pub height: u32,
    pub size: u64,
    #[serde(alias = "created_at")]
    pub created_at: u64,
    #[serde(alias = "imported_at")]
    pub imported_at: u64,
    pub source: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Tag {
    pub id: String,
    pub name: String,
    #[serde(alias = "parent_id")]
    pub parent_id: Option<String>,
    pub order: i32,
    #[serde(alias = "created_at")]
    pub created_at: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ImageTagRelation {
    #[serde(alias = "image_id")]
    pub image_id: String,
    #[serde(alias = "tag_id")]
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
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub version: u32,
    #[serde(alias = "data_path")]
    pub data_path: String,
    pub theme: String,
    #[serde(alias = "last_opened_at")]
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
fn save_image_from_base64(
    data_path: String,
    base64_data: String,
    source: String,
    original_name: Option<String>,
) -> Result<ImageInfo, String> {
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
        original_name: original_name.unwrap_or_default(),
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
    let content_type = response
        .headers()
        .get(CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .map(|value| value.to_string());
    let bytes = response.bytes().map_err(|e| e.to_string())?;

    let ext = infer_image_extension(&url, content_type.as_deref(), &bytes);

    let filename = format!("{}.{}", id, ext);
    let file_path = images_dir.join(&filename);
    fs::write(&file_path, &bytes).map_err(|e| e.to_string())?;

    let (width, height) = match image::load_from_memory(&bytes) {
        Ok(img) => img.dimensions(),
        Err(_) => (0, 0),
    };

    let size = bytes.len() as u64;

    let original_name = derive_original_name(&url, ext);

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

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::io::{Read, Write};
    use std::net::TcpListener;
    use std::thread;

    const SAMPLE_PNG_BASE64: &str = "iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFUlEQVR4nGP8z8Dwn4GBgYEJRIAwAB8XAgICR7MUAAAAAElFTkSuQmCC";
    const SAMPLE_PNG_BYTES: &[u8] = &[
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
        0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x02,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x72, 0xB6, 0x0D, 0x24, 0x00, 0x00, 0x00,
        0x15, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0xFC, 0xCF, 0xC0, 0xF0,
        0x9F, 0x81, 0x81, 0x81, 0x81, 0x09, 0x44, 0x80, 0x30, 0x00, 0x1F, 0x17,
        0x02, 0x02, 0x02, 0x47, 0xB3, 0x14, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45,
        0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82,
    ];

    fn create_temp_dir(name: &str) -> PathBuf {
        let dir = std::env::temp_dir().join(format!("gallery-cache-test-{}-{}", name, Uuid::new_v4()));
        fs::create_dir_all(&dir).unwrap();
        dir
    }

    #[test]
    fn init_data_dir_creates_expected_structure() {
        let temp_dir = create_temp_dir("init");
        init_data_dir(temp_dir.to_string_lossy().to_string()).unwrap();

        assert!(temp_dir.join("images").exists());
        assert!(temp_dir.join("metadata").join("tags.json").exists());
        assert!(temp_dir.join("metadata").join("image-tags.json").exists());
        assert!(temp_dir.join("metadata").join("images.json").exists());

        fs::remove_dir_all(temp_dir).unwrap();
    }

    #[test]
    fn save_image_from_base64_persists_png_image() {
        let temp_dir = create_temp_dir("base64");
        init_data_dir(temp_dir.to_string_lossy().to_string()).unwrap();

        let image = save_image_from_base64(
            temp_dir.to_string_lossy().to_string(),
            format!("data:image/png;base64,{}", SAMPLE_PNG_BASE64),
            "paste".to_string(),
            Some("sample.png".to_string()),
        )
        .unwrap();

        assert_eq!(image.source, "paste");
        assert_eq!(image.original_name, "sample.png");
        assert_eq!((image.width, image.height), (2, 2));
        assert!(temp_dir.join("images").join(&image.filename).exists());

        fs::remove_dir_all(temp_dir).unwrap();
    }

    #[test]
    #[ignore = "requires opening a local HTTP listener"]
    fn download_image_persists_response_body() {
        let temp_dir = create_temp_dir("download");
        init_data_dir(temp_dir.to_string_lossy().to_string()).unwrap();

        let listener = TcpListener::bind("127.0.0.1:0").unwrap();
        let address = listener.local_addr().unwrap();
        let server = thread::spawn(move || {
            if let Ok((mut stream, _)) = listener.accept() {
                let mut buffer = [0u8; 1024];
                let _ = stream.read(&mut buffer);
                let response = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: image/png\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
                    SAMPLE_PNG_BYTES.len()
                );
                stream.write_all(response.as_bytes()).unwrap();
                stream.write_all(SAMPLE_PNG_BYTES).unwrap();
            }
        });

        let image = download_image(
            temp_dir.to_string_lossy().to_string(),
            format!("http://{}/sample.png", address),
        )
        .unwrap();

        server.join().unwrap();

        assert_eq!(image.source, "cdn");
        assert_eq!(image.original_name, "sample.png");
        assert_eq!((image.width, image.height), (2, 2));
        assert!(temp_dir.join("images").join(&image.filename).exists());

        fs::remove_dir_all(temp_dir).unwrap();
    }
}
