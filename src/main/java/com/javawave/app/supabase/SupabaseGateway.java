package com.javawave.app.supabase;

import com.javawave.app.config.SupabaseProperties;
import com.javawave.app.dto.CompleteLessonRequest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/** Small adapter around Supabase Auth and PostgREST, keeping HTTP details out of services. */
@Component
public class SupabaseGateway {
    private final SupabaseProperties properties;
    private final RestClient restClient;

    public SupabaseGateway(SupabaseProperties properties, RestClient supabaseRestClient) {
        this.properties = properties;
        this.restClient = supabaseRestClient;
    }

    public boolean isConfigured() {
        return properties.isConfigured();
    }

    public Map<String, Object> verifyAccessToken(String accessToken) {
        requireConfiguration();
        return restClient.get()
                .uri(properties.getUrl() + "/auth/v1/user")
                .headers(headers -> addUserHeaders(headers, accessToken))
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() { });
    }

    public List<Map<String, Object>> getProfile(String accessToken, String userId) {
        requireConfiguration();
        return restClient.get()
                .uri(properties.getUrl() + "/rest/v1/profiles?select=id,username,total_xp&id=eq." + userId + "&limit=1")
                .headers(headers -> addUserHeaders(headers, accessToken))
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() { });
    }

    public List<Map<String, Object>> getProgress(String accessToken, String userId) {
        requireConfiguration();
        return restClient.get()
                .uri(properties.getUrl() + "/rest/v1/user_progress?select=lesson_id,score,max_score,completed,attempts,updated_at&user_id=eq." + userId + "&order=updated_at.desc")
                .headers(headers -> addUserHeaders(headers, accessToken))
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() { });
    }

    public List<Map<String, Object>> getLeaderboard() {
        if (!isConfigured()) return List.of();
        return restClient.get()
                .uri(properties.getUrl() + "/rest/v1/profiles?select=id,username,total_xp&order=total_xp.desc,username.asc&limit=20")
                .header("apikey", properties.getPublishableKey())
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() { });
    }

    public Map<String, Object> completeLesson(String accessToken, CompleteLessonRequest request) {
        requireConfiguration();
        return restClient.post()
                .uri(properties.getUrl() + "/rest/v1/rpc/complete_lesson")
                .headers(headers -> addUserHeaders(headers, accessToken))
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "p_lesson_id", request.lessonId(),
                        "p_score", request.score(),
                        "p_max_score", request.maxScore()
                ))
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() { });
    }

    private void addUserHeaders(HttpHeaders headers, String accessToken) {
        headers.set("apikey", properties.getPublishableKey());
        headers.setBearerAuth(accessToken);
    }

    private void requireConfiguration() {
        if (!isConfigured()) {
            throw new IllegalStateException("Supabase is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.");
        }
    }
}
