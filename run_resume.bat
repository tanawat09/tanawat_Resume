@echo off
cargo run >nul 2>&1
if %errorlevel% neq 0 (
    echo Cargo not found. Starting Python HTTP server instead...
    cd public
    python -m http.server 8080
)
pause
