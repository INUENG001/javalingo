package com.javawave.app.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "supabase")
public class SupabaseProperties {
    private String url = "";
    private String publishableKey = "";

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url == null ? "" : url.replaceAll("/+$", ""); }
    public String getPublishableKey() { return publishableKey; }
    public void setPublishableKey(String publishableKey) { this.publishableKey = publishableKey == null ? "" : publishableKey; }

    public boolean isConfigured() {
        return !url.isBlank() && !publishableKey.isBlank()
                && !url.contains("YOUR_PROJECT") && !publishableKey.contains("YOUR_");
    }
}
