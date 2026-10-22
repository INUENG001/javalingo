package com.javawave.app.controller;

import com.javawave.app.service.AuthService;
import com.javawave.app.supabase.SupabaseGateway;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AccountController {
    private final AuthService authService;
    private final SupabaseGateway supabaseGateway;

    public AccountController(AuthService authService, SupabaseGateway supabaseGateway) {
        this.authService = authService;
        this.supabaseGateway = supabaseGateway;
    }

    @GetMapping("/me")
    public Map<String, Object> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        String token = authService.requireAccessToken(authorization);
        Map<String, Object> user = authService.requireUser(authorization);
        String userId = authService.userId(user);
        List<Map<String, Object>> profiles = supabaseGateway.getProfile(token, userId);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", userId);
        result.put("email", user.getOrDefault("email", ""));
        Object metadataObject = user.get("user_metadata");
        String username = emailPrefix(user);
        if (metadataObject instanceof Map<?, ?> metadata && metadata.get("username") != null) {
            username = String.valueOf(metadata.get("username"));
        }
        result.put("username", username);
        result.put("total_xp", 0);
        if (profiles != null && !profiles.isEmpty()) {
            result.putAll(profiles.get(0));
        }
        return result;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "app", "JavaWave");
    }

    private String emailPrefix(Map<String, Object> user) {
        String email = String.valueOf(user.getOrDefault("email", "ผู้เรียน"));
        return email.contains("@") ? email.substring(0, email.indexOf('@')) : email;
    }
}
