use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::{env, io};

const HTML: &str = include_str!("../public/index.html");
const PROFILE_IMAGE: &[u8] = include_bytes!("../public/profile.jpg");

fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0_u8; 2048];
    let bytes_read = match stream.read(&mut buffer) {
        Ok(bytes) => bytes,
        Err(error) => {
            eprintln!("Failed to read request: {error}");
            return;
        }
    };

    let request = String::from_utf8_lossy(&buffer[..bytes_read]);
    let first_line = request.lines().next().unwrap_or_default();
    let path = first_line.split_whitespace().nth(1).unwrap_or("/");

    if path == "/profile.jpg" {
        let headers = format!(
            "HTTP/1.1 200 OK\r\nContent-Type: image/jpeg\r\nContent-Length: {}\r\nConnection: close\r\n\r\n",
            PROFILE_IMAGE.len()
        );

        if let Err(error) = stream.write_all(headers.as_bytes()) {
            eprintln!("Failed to write image headers: {error}");
            return;
        }

        if let Err(error) = stream.write_all(PROFILE_IMAGE) {
            eprintln!("Failed to write image body: {error}");
        }

        return;
    }

    let (status_line, body) = if path == "/" {
        ("HTTP/1.1 200 OK", HTML)
    } else {
        (
            "HTTP/1.1 404 NOT FOUND",
            "<!DOCTYPE html><html><body style=\"font-family:Segoe UI,sans-serif;background:#08111e;color:#fff;display:grid;place-items:center;height:100vh;\"><div><h1>404</h1><p>Page not found</p></div></body></html>",
        )
    };

    let response = format!(
        "{status_line}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
        body.len()
    );

    if let Err(error) = stream.write_all(response.as_bytes()) {
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
