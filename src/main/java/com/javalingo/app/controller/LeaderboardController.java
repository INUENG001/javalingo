package com.javalingo.app.controller;

import com.javalingo.app.supabase.SupabaseGateway;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {
    private final SupabaseGateway supabaseGateway;

    public LeaderboardController(SupabaseGateway supabaseGateway) {
        this.supabaseGateway = supabaseGateway;
    }

    @GetMapping
    public List<Map<String, Object>> getLeaderboard() {
        return supabaseGateway.getLeaderboard();
    }
}
