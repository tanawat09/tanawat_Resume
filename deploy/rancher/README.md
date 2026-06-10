# Rancher Deploy

ไฟล์ชุดนี้ใช้สำหรับ deploy โปรเจกต์ขึ้น Rancher/Kubernetes

## ไฟล์

- `deployment.yaml` สร้างแอป `tanawat-resume`
- `service.yaml` เปิด service ภายใน cluster
- `ingress.yaml` เปิดเว็บผ่านโดเมน

## ก่อนใช้งาน

1. เปลี่ยน image ใน `deployment.yaml`
   - ค่าเริ่มต้นคือ `ghcr.io/tanawat09/test-max:latest`
2. เปลี่ยน host ใน `ingress.yaml`
   - ค่าเริ่มต้นคือ `resume.example.com`
3. ถ้า cluster ของคุณไม่ได้ใช้ `nginx` ingress class ให้แก้ `ingressClassName`

## วิธีใช้ใน Rancher

1. เข้า Cluster ใน Rancher
2. ไปที่ `Workloads` หรือ `Import YAML`
3. อัปโหลดหรือวาง YAML ทั้ง 3 ไฟล์
4. กด Deploy

## apply ผ่าน kubectl

```powershell
kubectl apply -f deploy/rancher/deployment.yaml
kubectl apply -f deploy/rancher/service.yaml
kubectl apply -f deploy/rancher/ingress.yaml
```
