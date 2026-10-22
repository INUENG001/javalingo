package com.javalingo.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class HttpClientConfig {
    @Bean
    RestClient supabaseRestClient(RestClient.Builder builder) {
        return builder.build();
    }
}
