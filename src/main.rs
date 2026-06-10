use std::fs;
use std::io::{self, Read, Write};
use std::net::{TcpListener, TcpStream};
use std::path::{Path, PathBuf};
use std::{env, str};

const INDEX_HTML: &str = include_str!("../public/index.html");

fn content_type(path: &Path) -> &'static str {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("html") => "text/html; charset=UTF-8",
        Some("css") => "text/css; charset=UTF-8",
        Some("js") => "application/javascript; charset=UTF-8",
        Some("jpg") | Some("jpeg") => "image/jpeg",
        Some("png") => "image/png",
        Some("webp") => "image/webp",
        Some("svg") => "image/svg+xml",
        _ => "application/octet-stream",
    }
}

fn not_found_response() -> Vec<u8> {
    let body = "<!DOCTYPE html><html><body style=\"font-family:Segoe UI,sans-serif;background:#08111e;color:#fff;display:grid;place-items:center;height:100vh;\"><div><h1>404</h1><p>Page not found</p></div></body></html>";
    format!(
        "HTTP/1.1 404 NOT FOUND\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
        body.len(),
        body
    )
    .into_bytes()
}

fn ok_response(body: &[u8], content_type: &str) -> Vec<u8> {
    let mut response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: {content_type}\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
        body.len()
    )
    .into_bytes();
    response.extend_from_slice(body);
    response
}

fn resolve_public_path(request_path: &str) -> Option<PathBuf> {
    let public_root = Path::new("public").canonicalize().ok()?;
    let relative = if request_path == "/" {
        PathBuf::from("index.html")
    } else {
        PathBuf::from(request_path.trim_start_matches('/'))
    };

    let joined = public_root.join(relative);
    let canonical = joined.canonicalize().ok()?;

    if canonical.starts_with(&public_root) {
        Some(canonical)
    } else {
        None
    }
}

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0_u8; 4096];
    let bytes_read = match stream.read(&mut buffer) {
        Ok(bytes) => bytes,
        Err(error) => {
            eprintln!("Failed to read request: {error}");
            return;
        }
    };

    let request = match str::from_utf8(&buffer[..bytes_read]) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("Invalid request encoding: {error}");
            return;
        }
    };

    let first_line = request.lines().next().unwrap_or_default();
    let path = first_line.split_whitespace().nth(1).unwrap_or("/");

    let response = match resolve_public_path(path) {
        Some(file_path) => match fs::read(&file_path) {
            Ok(bytes) => ok_response(&bytes, content_type(&file_path)),
            Err(error) => {
                eprintln!("Failed to read file {}: {error}", file_path.display());
                not_found_response()
            }
        },
        None if path == "/" => ok_response(INDEX_HTML.as_bytes(), "text/html; charset=UTF-8"),
        None => not_found_response(),
    };

    if let Err(error) = stream.write_all(&response) {
        eprintln!("Failed to write response: {error}");
    }
}

fn main() -> io::Result<()> {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let address = format!("0.0.0.0:{port}");
    let listener = TcpListener::bind(&address)?;
    println!("Resume server is running at http://{address}");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => handle_client(stream),
            Err(error) => eprintln!("Connection failed: {error}"),
        }
    }

    Ok(())
}
