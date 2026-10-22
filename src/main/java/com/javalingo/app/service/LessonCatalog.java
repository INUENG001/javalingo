package com.javalingo.app.service;

import com.javalingo.app.model.Lesson;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/** Catalog of lessons; keeping curriculum data in a domain service makes it easy to extend. */
@Service
public class LessonCatalog {
    private final List<Lesson> lessons = List.of(
            new Lesson("java-basics", "เริ่มต้นกับ Java", "Hello, Java!", "รู้จักโครงสร้างโปรแกรมและคำสั่งแสดงผล", "☕", "เริ่มต้น", 1, 5, 25),
            new Lesson("variables", "ตัวแปรและชนิดข้อมูล", "เก็บข้อมูลให้เป็น", "ฝึกใช้ int, double, String และ boolean", "🧩", "เริ่มต้น", 2, 5, 30),
            new Lesson("conditions", "เงื่อนไข if / else", "ให้โปรแกรมตัดสินใจ", "ใช้เงื่อนไขเพื่อเลือกเส้นทางการทำงาน", "🔀", "พื้นฐาน", 3, 5, 35),
            new Lesson("loops", "ลูป for และ while", "ทำซ้ำอย่างฉลาด", "เรียนรู้การทำซ้ำและควบคุมรอบลูป", "🔁", "พื้นฐาน", 4, 5, 40),
            new Lesson("oop-classes", "คลาสและออบเจ็กต์", "หัวใจของ OOP", "สร้าง class, object, field และ method", "🏗️", "OOP", 5, 5, 50),
            new Lesson("oop-inheritance", "การสืบทอดและ Polymorphism", "ต่อยอดคลาสให้ทรงพลัง", "ฝึก extends, override และ polymorphism", "🧬", "OOP", 6, 5, 60)
    );

    public List<Lesson> findAll() {
        return lessons;
    }

    public Optional<Lesson> findById(String id) {
        return lessons.stream().filter(lesson -> lesson.id().equals(id)).findFirst();
    }
}
