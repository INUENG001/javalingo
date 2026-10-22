package com.javawave.app.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record CompleteLessonRequest(
        @NotBlank String lessonId,
        @Min(0) @Max(100) int score,
        @Min(1) @Max(100) int maxScore
) { }
