package com.javawave.app.service;

import com.javawave.app.supabase.SupabaseGateway;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {
    private final SupabaseGateway supabaseGateway;

    public AuthService(SupabaseGateway supabaseGateway) {
        this.supabaseGateway = supabaseGateway;
    }

    public String requireAccessToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ") || authorizationHeader.length() <= 7) {
            throw new UnauthorizedException("กรุณาเข้าสู่ระบบก่อนใช้งาน");
        }
        return authorizationHeader.substring(7).trim();
    }

    public Map<String, Object> requireUser(String authorizationHeader) {
        String token = requireAccessToken(authorizationHeader);
        try {
            Map<String, Object> user = supabaseGateway.verifyAccessToken(token);
            if (user == null || user.get("id") == null) {
                throw new UnauthorizedException("เซสชันไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
            }
            return user;
        } catch (UnauthorizedException ex) {
            throw ex;
        } catch (RuntimeException ex) {
            throw new UnauthorizedException("เซสชันหมดอายุหรือไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
        }
    }

    public String userId(Map<String, Object> user) {
        return String.valueOf(user.get("id"));
    }

    public static class UnauthorizedException extends RuntimeException {
        public UnauthorizedException(String message) { super(message); }
    }
}
