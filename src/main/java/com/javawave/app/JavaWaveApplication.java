package com.javawave.app;

import com.javawave.app.config.SupabaseProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(SupabaseProperties.class)
public class JavaWaveApplication {
    public static void main(String[] args) {
        SpringApplication.run(JavaWaveApplication.class, args);
    }
}
