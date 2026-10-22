package com.javalingo.app;

import com.javalingo.app.config.SupabaseProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(SupabaseProperties.class)
public class JavalingoApplication {
    public static void main(String[] args) {
        SpringApplication.run(JavalingoApplication.class, args);
    }
}
