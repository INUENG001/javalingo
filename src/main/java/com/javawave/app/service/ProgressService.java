package com.javawave.app.service;

import com.javawave.app.dto.CompleteLessonRequest;
import com.javawave.app.model.Lesson;
import com.javawave.app.supabase.SupabaseGateway;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressService {
    private final SupabaseGateway supabaseGateway;
    private final LessonCatalog lessonCatalog;

    public ProgressService(SupabaseGateway supabaseGateway, LessonCatalog lessonCatalog) {
        this.supabaseGateway = supabaseGateway;
        this.lessonCatalog = lessonCatalog;
    }

    public List<Map<String, Object>> getProgress(String accessToken, String userId) {
        return supabaseGateway.getProgress(accessToken, userId);
    }

    public Map<String, Object> complete(String accessToken, CompleteLessonRequest request) {
        Lesson lesson = lessonCatalog.findById(request.lessonId())
                .orElseThrow(() -> new IllegalArgumentException("ไม่พบบทเรียนนี้"));
        if (request.maxScore() != lesson.totalQuestions()) {
            throw new IllegalArgumentException("จำนวนข้อสอบไม่ตรงกับบทเรียน");
        }
        if (request.score() > request.maxScore()) {
            throw new IllegalArgumentException("คะแนนเกินจำนวนข้อสอบ");
        }
        Map<String, Object> response = supabaseGateway.completeLesson(accessToken, request);
        return response == null ? new LinkedHashMap<>() : response;
    }
}
