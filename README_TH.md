# Our Memories Web App — คู่มือภาษาไทย

Web App ชุดนี้ออกแบบตามโครงที่ต้องการ:
- โทนฟ้าพาสเทล + ชมพูพาสเทล
- หน้าใส่ PIN 6 หลัก
- กดไอคอนแม่กุญแจเพื่อ Login
- PIN ผิด: กล่อง/แม่กุญแจสั่น
- PIN ถูก: แม่กุญแจปลดล็อก
- หน้า Showcase กด Next ไปทีละหน้า
- หน้า Our Memories เป็น Timeline แนวตั้ง
- จุด Timeline กดเพื่อเปิดวันที่/ชื่อเหตุการณ์
- กดวันที่อีกครั้งเพื่อเปิดรูปอีกฝั่งของเส้น
- รูปทุกใบเป็นกรอบ Polaroid
- Timeline สลับซ้าย/ขวาอัตโนมัติ
- วันสำคัญ (`"special": true`) ใช้กรอบทองและประกาย
- Apps Script ดึง `app.html` + `data.json` จาก GitHub Pages
- GitHub Pages หน้า `/` ทำหน้าที่เป็นลิงก์สั้น/ลิงก์สวย แล้ว Redirect ไป Apps Script

---

## โครงสร้างไฟล์

```text
our-memories-webapp/
├─ index.html                 ← ลิงก์สั้น GitHub Pages → Redirect ไป Apps Script
├─ app.html                   ← หน้า Web App จริง (Apps Script จะดึงไฟล์นี้)
├─ data.json                  ← ข้อมูล Showcase + Timeline
├─ assets/
│  ├─ sample-1.svg
│  ├─ sample-2.svg
│  ├─ sample-3.svg
│  └─ sample-4.svg
└─ apps-script/
   ├─ Code.gs                 ← นำไปวางใน Google Apps Script
   └─ appsscript.json         ← Manifest (ไม่จำเป็นต้องวางด้วยมือถ้าไม่ใช้)
```

---

# PART 1 — สร้าง GitHub Repository

## 1) สร้าง Repository

1. เข้า GitHub
2. กด **New repository**
3. ตั้งชื่อ:
   `our-memories`
4. เลือก **Public**
5. กด **Create repository**

> หมายเหตุ: GitHub Pages บน GitHub Free ใช้งานกับ public repository ได้ง่ายที่สุด

## 2) อัปโหลดไฟล์

ให้อัปโหลดไฟล์จากโฟลเดอร์นี้ขึ้น Repository โดย **ไม่ต้องอัปโหลดโฟลเดอร์ `apps-script` ก็ได้**
แต่แนะนำให้อัปโหลดทั้งหมดเพื่อเก็บสำรอง

โครงสร้างบน GitHub ต้องคล้าย:

```text
index.html
app.html
data.json
assets/
apps-script/
```

## 3) เปิด GitHub Pages

1. เข้า Repository `our-memories`
2. กด **Settings**
3. เมนูซ้ายกด **Pages**
4. ส่วน **Build and deployment**
5. Source เลือก **Deploy from a branch**
6. Branch เลือก `main`
7. Folder เลือก `/(root)`
8. กด **Save**

รอ GitHub Pages สร้างเว็บ

URL จะมีรูปแบบประมาณ:

```text
https://YOUR_USERNAME.github.io/our-memories/
```

---

# PART 2 — แก้ URL ใน data.json

เปิดไฟล์ `data.json`

หา:

```json
"assetBaseUrl": "https://YOUR_USERNAME.github.io/our-memories"
```

เปลี่ยน `YOUR_USERNAME` เป็นชื่อบัญชี GitHub ของคุณ

ตัวอย่าง:

```json
"assetBaseUrl": "https://somchai.github.io/our-memories"
```

Commit การแก้ไข

---

# PART 3 — สร้าง Google Apps Script

## 1) สร้างโปรเจกต์

1. ไปที่ `script.google.com`
2. กด **New project**
3. ตั้งชื่อ เช่น:
   `Our Memories`

## 2) วาง Code.gs

เปิดไฟล์:

```text
apps-script/Code.gs
```

Copy ทั้งหมด แล้วนำไปแทนโค้ดเดิมใน Apps Script

## 3) แก้ GitHub URL

ใน `Code.gs` หา:

```javascript
GITHUB_APP_URL: 'https://YOUR_USERNAME.github.io/our-memories/app.html',
GITHUB_DATA_URL: 'https://YOUR_USERNAME.github.io/our-memories/data.json',
```

เปลี่ยน `YOUR_USERNAME` เป็น Username GitHub

จากนั้นกด Save

---

# PART 4 — ตั้งรหัสผ่าน 6 หลัก

**ไม่ควรใส่รหัสผ่านไว้ใน GitHub**

ให้เก็บ PIN ใน Apps Script Script Properties

1. Apps Script → ด้านซ้ายกด **Project Settings**
2. เลื่อนหา **Script Properties**
3. กด **Add script property**
4. Property:
   `APP_PIN`
5. Value:
   ใส่ PIN 6 ตัวของคุณ เช่น `110445`
6. กด Save

รหัสนี้จะไม่อยู่ใน `app.html` หรือ `data.json`

---

# PART 5 — ทดสอบการเชื่อม GitHub

ใน Apps Script:

1. ด้านบนเลือก Function:
   `testGitHubConnection`
2. กด **Run**
3. ครั้งแรก Google จะขอสิทธิ์
4. อนุญาตสิทธิ์
5. เปิด Execution log

ผลที่ต้องการ:

```text
appStatus: 200
dataStatus: 200
```

ถ้าเป็น 404:
- ตรวจ Username
- ตรวจชื่อ Repository
- ตรวจว่า GitHub Pages เปิดแล้ว
- ตรวจว่า `app.html` และ `data.json` อยู่ root

---

# PART 6 — Deploy เป็น Web App

1. Apps Script มุมขวาบนกด **Deploy**
2. กด **New deployment**
3. กดไอคอนรูปเฟือง/Select type
4. เลือก **Web app**
5. Description:
   `Our Memories v1`
6. Execute as:
   **Me**
7. Who has access:
   เลือกตัวเลือกที่เปิดให้แฟนเข้าถึงได้
   (ถ้าบัญชีของคุณมีตัวเลือก Anonymous/Anyone ให้เลือกตัวเลือกที่ไม่บังคับแฟนล็อกอิน Google)
8. กด **Deploy**
9. Copy URL ที่ลงท้ายด้วย:
   `/exec`

ตัวอย่าง:

```text
https://script.google.com/macros/s/xxxxxxxxxxxxxxxx/exec
```

เก็บ URL นี้ไว้

---

# PART 7 — ทำลิงก์สั้น/ลิงก์สวยด้วย GitHub Pages

แทนที่จะส่ง URL Apps Script ยาว ๆ ให้แฟน
ชุดนี้ใช้หน้า GitHub Pages `/` เป็นทางเข้า

ตัวอย่างลิงก์ที่ส่งให้แฟน:

```text
https://YOUR_USERNAME.github.io/our-memories/
```

เมื่อเปิดแล้ว ระบบจะ Redirect ไป Apps Script โดยอัตโนมัติ

## วิธีตั้ง

1. เปิด `index.html`
2. ค้นหา:
   `YOUR_APPS_SCRIPT_EXEC_URL`
3. มีทั้งหมด 2 จุด
4. แทนด้วย URL `/exec` จาก Apps Script

ตัวอย่าง:

```html
<meta http-equiv="refresh" content="0;url=https://script.google.com/macros/s/AAAA/exec">
```

และ

```javascript
const APP_URL = 'https://script.google.com/macros/s/AAAA/exec';
```

Commit การแก้ไข

หลังจากนี้ลิงก์:

```text
https://YOUR_USERNAME.github.io/our-memories/
```

จะเป็นลิงก์เข้าระบบแบบสั้นกว่าและจำง่ายกว่า Apps Script URL

---

# PART 8 — เพิ่มรูปจริง

ให้นำรูปไปใส่ใน:

```text
assets/
```

ตัวอย่าง:

```text
assets/first-date.jpg
assets/birthday.jpg
assets/trip-01.jpg
assets/trip-02.jpg
```

แล้วเปิด `data.json`

ตัวอย่าง Memory 1 รูป:

```json
{
  "date": "2026-04-11",
  "displayDate": "11/04/69",
  "title": "วันแรกของเรา",
  "description": "วันที่เรื่องราวของเราเริ่มต้น ♡",
  "special": true,
  "photos": [
    {
      "src": "assets/first-date.jpg",
      "caption": "Our first day ♡"
    }
  ]
}
```

---

# PART 9 — เพิ่มหลายรูปในวันเดียว

```json
{
  "date": "2026-08-14",
  "displayDate": "14/08/69",
  "title": "A special day",
  "description": "วันนี้มีรูปหลายรูป",
  "special": true,
  "photos": [
    {
      "src": "assets/photo-01.jpg",
      "caption": "Photo 1 ♡"
    },
    {
      "src": "assets/photo-02.jpg",
      "caption": "Photo 2"
    },
    {
      "src": "assets/photo-03.jpg",
      "caption": "Photo 3"
    },
    {
      "src": "assets/photo-04.jpg",
      "caption": "Photo 4"
    }
  ]
}
```

Web App จะสร้าง Polaroid ให้ทุกรูปอัตโนมัติ

---

# PART 10 — วันธรรมดากับวันสำคัญ

Memory ปกติ:

```json
"special": false
```

วันสำคัญ:

```json
"special": true
```

เมื่อเป็น `true` ระบบจะ:
- เปลี่ยนจุด Timeline เป็นสีทอง
- ปุ่มวันที่ใช้สีทอง
- กรอบ Polaroid มีขอบทอง
- มีประกายเล็ก ๆ

---

# PART 11 — เพิ่ม Memory ใหม่

Copy Object เดิมใน `memories` แล้วแก้ข้อมูล

สิ่งสำคัญ:
- `date` ใช้ `YYYY-MM-DD`
- `displayDate` แสดงอย่างไรก็ได้ เช่น `110445` หรือ `11/04/45`
- ระบบเรียง Timeline จาก `date` อัตโนมัติ

ตัวอย่าง:

```json
{
  "date": "2026-09-01",
  "displayDate": "010969",
  "title": "ไปเที่ยวด้วยกัน",
  "description": "ความทรงจำอีกหนึ่งวัน",
  "special": false,
  "photos": [
    {
      "src": "assets/trip.jpg",
      "caption": "Our trip ♡"
    }
  ]
}
```

---

# PART 12 — แก้ Showcase

ใน `data.json`:

```json
"showcase": [
  {
    "eyebrow": "01 • Our Story",
    "accent": "♡",
    "title": "You & Me",
    "body": "ข้อความของคุณ"
  }
]
```

เพิ่มได้หลายหน้า
Web App จะสร้างปุ่ม Next และจุดสถานะให้อัตโนมัติ

---

# PART 13 — เมื่อแก้ GitHub แล้วเว็บยังไม่เปลี่ยน

Apps Script มี Cache เล็กน้อยเพื่อให้เว็บเปิดเร็ว

โดยปกติรอประมาณ 1–2 นาที

หากต้องการล้างทันที:

1. Apps Script
2. เลือก Function:
   `clearAppCache`
3. กด Run
4. Refresh Web App

---

# ความเป็นส่วนตัว

สถาปัตยกรรมนี้เก็บ PIN ใน Apps Script จึงดีกว่าการใส่ PIN ลงใน GitHub

อย่างไรก็ตาม:
- Repository/Public GitHub Pages สามารถเข้าถึง `data.json`
- รูปที่อยู่บน GitHub Pages ก็มี URL สาธารณะ

ดังนั้น PIN นี้ป้องกัน **หน้า Web App** แต่ไม่ได้ทำให้ไฟล์รูปบน Public GitHub เป็นไฟล์ลับจริง ๆ

ถ้ารูป/ข้อความเป็นส่วนตัวมาก ควรทำเวอร์ชัน Private Storage ภายหลัง เช่นเก็บรูปไว้ในพื้นที่ที่ต้องผ่าน Apps Script ก่อนถึงจะอ่านได้

---

# สรุปลำดับการทำครั้งแรก

1. สร้าง GitHub Repo `our-memories`
2. อัปโหลดไฟล์
3. เปิด GitHub Pages
4. แก้ `YOUR_USERNAME` ใน `data.json`
5. สร้าง Apps Script
6. Copy `Code.gs`
7. แก้ `YOUR_USERNAME` ใน `Code.gs`
8. ตั้ง Script Property `APP_PIN`
9. Run `testGitHubConnection`
10. Deploy Apps Script เป็น Web App
11. Copy URL `/exec`
12. นำ URL `/exec` ไปใส่ `index.html`
13. Commit
14. เปิดลิงก์ GitHub Pages `/`
15. ทดลอง PIN → Showcase → Timeline → Polaroid

เสร็จแล้ว ♡
