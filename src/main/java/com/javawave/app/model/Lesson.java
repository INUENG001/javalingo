package com.javawave.app.model;

/** Immutable domain model for one unit in the Java learning path. */
public record Lesson(
        String id,
        String title,
        String subtitle,
        String description,
        String icon,
        String level,
        int order,
        int totalQuestions,
        int xpReward
) { }
