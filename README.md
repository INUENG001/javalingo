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
