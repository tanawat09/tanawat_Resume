# Tanawat Resume in Rust

โปรเจกต์นี้เป็นหน้าเรซุเม่แบบ modern single-page ที่เสิร์ฟผ่าน Rust โดยไม่ใช้ dependency ภายนอก และพร้อมรันใน Docker

## โครงสร้าง

- `Cargo.toml` ตั้งค่าโปรเจกต์ Rust
- `src/main.rs` เว็บเซิร์ฟเวอร์ขนาดเล็ก
- `public/index.html` หน้าเรซุเม่
- `public/profile.jpg` รูปโปรไฟล์
- `Dockerfile` สำหรับ build และ run ใน container

## รันด้วย Docker

```powershell
docker build -t tanawat-resume .
docker run --rm -p 8080:8080 tanawat-resume
```

จากนั้นเปิด `http://127.0.0.1:8080`

## รันด้วย Docker Compose

```powershell
docker compose up --build
```

ถ้าต้องการรันแบบ background:

```powershell
docker compose up -d --build
```

หยุดการทำงาน:

```powershell
docker compose down
```

หมายเหตุ:

- แอปรองรับ `PORT` environment variable แล้ว จึงย้ายไปรันบน Docker, VPS หรือ PaaS ได้ง่ายขึ้น
- ถ้าจะเปลี่ยนพอร์ต ให้เปลี่ยนทั้งค่า `PORT` และ mapping ทางฝั่ง `ports` ใน `docker-compose.yml`

## Deploy ขึ้น Rancher

มีไฟล์ Kubernetes manifests ให้แล้วในโฟลเดอร์ `deploy/rancher`

- `deploy/rancher/deployment.yaml`
- `deploy/rancher/service.yaml`
- `deploy/rancher/ingress.yaml`

ก่อน deploy ให้แก้ 2 จุดนี้ก่อน:

1. เปลี่ยน image ใน `deployment.yaml`
2. เปลี่ยนโดเมน `resume.example.com` ใน `ingress.yaml`

ถ้าใช้ `kubectl`:

```powershell
kubectl apply -f deploy/rancher/deployment.yaml
kubectl apply -f deploy/rancher/service.yaml
kubectl apply -f deploy/rancher/ingress.yaml
```

## รันแบบตรงด้วย Rust

1. ติดตั้ง Rust จาก [rustup.rs](https://rustup.rs/)
2. เปิด terminal ในโฟลเดอร์นี้
3. รันคำสั่ง:

```powershell
cargo run
```

4. เปิดเบราว์เซอร์ที่ `http://127.0.0.1:8080`

## จุดเด่นของดีไซน์

- โทน glassmorphism + animated gradient
- hero section แบบ cinematic
- skill orbit พร้อม animated skill bars
- timeline งานแบบ modern
- responsive ใช้งานได้ทั้ง desktop และ mobile
