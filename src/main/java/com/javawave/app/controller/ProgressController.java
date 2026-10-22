package com.javawave.app.controller;

import com.javawave.app.dto.CompleteLessonRequest;
import com.javawave.app.service.AuthService;
import com.javawave.app.service.ProgressService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final AuthService authService;
    private final ProgressService progressService;

    public ProgressController(AuthService authService, ProgressService progressService) {
        this.authService = authService;
        this.progressService = progressService;
    }

    @GetMapping
    public List<Map<String, Object>> getProgress(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = authService.requireAccessToken(authorization);
        Map<String, Object> user = authService.requireUser(authorization);
        return progressService.getProgress(token, authService.userId(user));
    }

    @PostMapping("/complete")
    public Map<String, Object> complete(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody CompleteLessonRequest request) {
        String token = authService.requireAccessToken(authorization);
        authService.requireUser(authorization);
        return progressService.complete(token, request);
    }
}
