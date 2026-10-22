# Javalingo — เรียน Java แบบเกม

เว็บเรียนภาษา Java และแนวคิด OOP แบบ gamified ใช้ HTML/CSS/JavaScript, Java + Spring Boot และ Supabase Auth/Postgres โดยแยกโครงสร้างหลังบ้านตามแนว OOP

## ฟีเจอร์ที่มีในโปรเจกต์

- สมัครสมาชิก / เข้าสู่ระบบ / ออกจากระบบด้วย Supabase Auth
- โหมดตัวอย่าง (Demo) สำหรับทดลองหน้าจอและทำแบบทดสอบได้ทันที โดยข้อมูล Demo อยู่ใน `localStorage` ของเบราว์เซอร์นี้เท่านั้น
- เส้นทางเรียน 6 บท: Java พื้นฐาน, ตัวแปร, if/else, loops, class/object และ inheritance/polymorphism
- แบบทดสอบบทละ 5 ข้อ พร้อมเฉลยทันทีและเกณฑ์ผ่าน 3/5 ข้อ
- บันทึก best score, จำนวนครั้งที่ทำ, สถานะผ่านบท และ XP ไปที่ Supabase
- ตารางคะแนนจาก XP ของผู้ใช้ใน Supabase
- SQL function ให้คะแนน XP ฝั่งฐานข้อมูล และ Row Level Security (RLS) จำกัดข้อมูลความคืบหน้าให้เจ้าของบัญชีอ่านได้เท่านั้น
- Responsive layout สำหรับ desktop, tablet และ mobile
- เส้นทางบทเรียนแบบแผนที่ พร้อมเมนูนำทางล่างบนมือถือ
- เปลี่ยนชื่อแบรนด์เป็น Javalingo โดยย้ายข้อมูล Demo เดิมจาก localStorage key ของ JavaWave ให้อัตโนมัติเมื่อเปิดหน้าเว็บ

## เทคโนโลยีและโครงสร้าง

```text
javalingo/
├── pom.xml
├── supabase/schema.sql
└── src/
    ├── main/java/com/javalingo/app/
    │   ├── config/        # Properties / HTTP client configuration
    │   ├── controller/    # REST API endpoints
    │   ├── dto/           # Request DTO + validation
    │   ├── model/         # Domain model (Lesson record)
    │   ├── service/       # Lesson catalog, auth and progress business logic
    │   └── supabase/      # Supabase Auth + PostgREST adapter
    ├── main/resources/
    │   ├── application.properties
    │   └── static/        # HTML, CSS, JavaScript
    └── test/java/         # Unit tests for lesson catalog
```

### OOP ในโปรเจกต์

- **Model**: `Lesson` เป็น immutable domain model
- **Service**: `LessonCatalog`, `ProgressService`, `AuthService` เก็บ business logic
- **Gateway/Adapter**: `SupabaseGateway` แยกการเรียก Supabase HTTP API ออกจาก business logic
- **Controller**: รับ HTTP request และส่งต่อไปยัง service
- **DTO**: `CompleteLessonRequest` ตรวจสอบข้อมูลคะแนนก่อนทำงาน

## วิธีตั้งค่า Supabase

1. สร้างโปรเจกต์ใน [Supabase](https://supabase.com/).
2. เปิด **SQL Editor** แล้วคัดลอกเนื้อหาจาก `supabase/schema.sql` ไป Run
3. ไปที่ **Project Settings → API Keys** คัดลอก Project URL และ Publishable key (หรือ legacy `anon` key) ห้ามนำ `service_role` หรือ secret key ไปใส่ใน Frontend
4. เปิดไฟล์ `src/main/resources/static/js/config.js` แล้วแก้ค่าให้เป็นของโปรเจกต์ เช่น

   ```js
   window.JAVALINGO_CONFIG = {
     SUPABASE_URL: "https://your-project-ref.supabase.co",
     SUPABASE_PUBLISHABLE_KEY: "sb_publishable_..."
   };
   ```

   ค่า URL และ Publishable key ในไฟล์นี้ต้องตรงกับค่าของ Spring Boot ใน `src/main/resources/application.properties` หรือ environment variables ด้านล่าง

5. ใน Supabase Dashboard เข้า **Authentication → URL Configuration** ตั้ง Site URL เป็น `http://localhost:8080` สำหรับ local development
6. หากเปิด Email confirmation ไว้ ให้ยืนยันอีเมลที่ได้รับก่อนเข้าสู่ระบบ หรือปรับการยืนยันอีเมลใน Supabase Auth ตามความต้องการของโปรเจกต์
7. ตรวจให้แน่ใจว่าเปิด Data API สำหรับตาราง `profiles` และ `user_progress` แล้ว หากโปรเจกต์จำกัด schema exposure ให้เปิด schema `public` ตามนโยบายของโปรเจกต์

> `config.js` เก็บเฉพาะ Publishable/anon key ซึ่งออกแบบให้ใช้ใน client ได้ ความปลอดภัยของตารางอาศัย grants และ RLS ตาม SQL ที่ให้ไว้ ห้ามใส่ service role key ในไฟล์นี้

> หากเคยใช้โหมดตัวอย่างก่อนเปลี่ยนชื่อ ข้อมูลความคืบหน้า โปรไฟล์ทดลอง streak และภารกิจวันนี้จะถูกอ่านจาก key เดิมและย้ายไป key ของ Javalingo โดยอัตโนมัติในเบราว์เซอร์เดิม

## วิธีรันใน VS Code

สิ่งที่ต้องมี: JDK 21, Maven 3.9+ และ VS Code พร้อม Extension Pack for Java และ Spring Boot Extension Pack

1. เปิดโฟลเดอร์ `javalingo` ใน VS Code
2. เปิด Terminal ในโฟลเดอร์โปรเจกต์
3. ค่าเริ่มต้นของ Spring Boot ตั้งให้ตรงกับ `config.js` ใน repository นี้แล้ว หากใช้ Supabase โปรเจกต์อื่น ให้กำหนด URL และ key ก่อนเริ่มแอป (สำหรับ PowerShell):

   ```powershell
   $env:SUPABASE_URL="https://your-project-ref.supabase.co"
   $env:SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
   mvn spring-boot:run
   ```

   สำหรับ macOS/Linux:

   ```bash
   export SUPABASE_URL="https://your-project-ref.supabase.co"
   export SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
   mvn spring-boot:run
   ```

4. เปิด `http://localhost:8080`
5. ถ้ายังไม่ได้ตั้งค่า Supabase ก็เปิดหน้าเว็บและเลือก **ลองใช้งานโหมดตัวอย่าง** ได้ ส่วน login จริง, save progress จริง และ leaderboard จริง ต้องตั้งค่า Supabase และรัน Spring Boot

## API ที่มี

| Method | Endpoint | รายละเอียด |
|---|---|---|
| GET | `/api/health` | ตรวจสอบว่า backend ทำงาน |
| GET | `/api/lessons` | ข้อมูลบทเรียนจาก Java `LessonCatalog` |
| GET | `/api/me` | ตรวจ Supabase access token และดึงโปรไฟล์ตัวเอง (ต้อง login) |
| GET | `/api/progress` | ดึงความคืบหน้าของตัวเอง (ต้อง login) |
| POST | `/api/progress/complete` | บันทึกคะแนนผ่าน RPC `complete_lesson` (ต้อง login) |
| GET | `/api/leaderboard` | อ่าน username และ XP ที่เปิดเผยสำหรับจัดอันดับ |

### ทดสอบ API เบื้องต้น

หลังเปิดเซิร์ฟเวอร์แล้ว:

```bash
curl http://localhost:8080/api/health
curl http://localhost:8080/api/lessons
curl http://localhost:8080/api/leaderboard
```

Endpoint ที่ต้อง login ต้องส่ง `Authorization: Bearer <Supabase access_token>` ซึ่งหน้าเว็บจัดการให้หลัง sign in

## วิธีตรวจสอบหลังปรับ UI

1. เปิดหน้าเว็บที่ `http://localhost:8080` แล้วลองสมัคร/เข้าสู่ระบบ และตรวจว่าหน้า Auth, ภาพรวม และโปรไฟล์แสดงชื่อ Javalingo
2. ทำบทเรียนให้ได้อย่างน้อย 3/5 ตรวจ XP, สถานะผ่าน, การปลดล็อกบทถัดไป และ leaderboard ทั้งโหมดตัวอย่างกับบัญชี Supabase
3. รีเฟรชหน้าในโหมดตัวอย่างเพื่อยืนยันว่าความคืบหน้าจากเบราว์เซอร์เดิมยังอยู่
4. ตรวจหน้าเส้นทางเรียนด้วยหน้าจอ Desktop, Tablet และ Mobile; บนมือถือให้ลองเมนูด้านล่าง ปุ่มเริ่มบทเรียน และหน้าต่างแบบทดสอบ
5. ตรวจ DevTools ว่าไม่มี request ที่ใช้ service-role/secret key และ endpoint ที่ต้องล็อกอินตอบกลับ `401` เมื่อไม่มี access token

## กติกาคะแนน

- ผ่านเมื่อทำถูกอย่างน้อย 3/5 ข้อ
- เมื่อผ่านบทนั้นครั้งแรก จะได้รับ XP ตามรางวัลของบท (25–60 XP)
- การทำซ้ำอัปเดต best score และ attempts แต่ไม่ให้ XP ซ้ำ
- บทถัดไปจะปลดล็อกเมื่อผ่านบทก่อนหน้า

## หมายเหตุสำหรับการนำไปใช้งานจริง

- โหมด Demo ไม่ใช่ระบบบัญชีจริง และเก็บข้อมูลไว้ใน browser เครื่องนั้นเท่านั้น
- ตารางคะแนนแสดงเฉพาะ `username` และ `total_xp` ที่ตั้งใจให้เป็นข้อมูลสาธารณะ ไม่แสดงอีเมล
- การบันทึกความคืบหน้าจริงทำผ่าน SQL RPC ที่ตรวจ user จาก `auth.uid()` และมี RLS ที่ `user_progress`
- ตัวอย่างนี้เป็น starter project สำหรับการเรียนรู้ ควรเพิ่ม rate limiting, logging/monitoring, password recovery UI, profile editing และการทดสอบ integration ก่อน deploy ใช้งานจริง

- ตัวเลข streak รายวันในหน้าจอเป็นข้อมูลใน browser (`localStorage`) ไม่ได้ sync ข้ามอุปกรณ์ ส่วนคะแนน XP และความคืบหน้าบทเรียนจะ sync ผ่าน Supabase เมื่อเข้าสู่ระบบจริง

## Git เริ่มต้น

```bash
git init
git add .
git commit -m "Initial Javalingo learning app"
```
