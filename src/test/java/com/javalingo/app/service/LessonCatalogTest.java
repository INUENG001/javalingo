package com.javalingo.app.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class LessonCatalogTest {
    private final LessonCatalog catalog = new LessonCatalog();

    @Test
    void catalogHasSixOrderedLessons() {
        assertEquals(6, catalog.findAll().size());
        assertEquals(1, catalog.findAll().get(0).order());
        assertEquals(6, catalog.findAll().get(5).order());
    }

    @Test
    void findByIdReturnsEmptyForUnknownLesson() {
        assertTrue(catalog.findById("not-a-real-lesson").isEmpty());
    }
}
