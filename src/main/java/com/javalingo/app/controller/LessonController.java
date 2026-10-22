package com.javalingo.app.controller;

import com.javalingo.app.model.Lesson;
import com.javalingo.app.service.LessonCatalog;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {
    private final LessonCatalog lessonCatalog;

    public LessonController(LessonCatalog lessonCatalog) {
        this.lessonCatalog = lessonCatalog;
    }

    @GetMapping
    public List<Lesson> getLessons() {
        return lessonCatalog.findAll();
    }
}
