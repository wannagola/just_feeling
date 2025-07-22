package com.justfeeling.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI justFeelingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Just Feeling API")
                        .description("감정 공유 소셜 네트워크 플랫폼 API 문서")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Just Feeling Team")
                                .email("contact@justfeeling.com")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Development Server")
                ));
    }
} 