package com.justfeeling.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;

@Service
public class EmotionClient {
    private final WebClient wc;

    public EmotionClient(@Value("${emotion.api.url}") String apiUrl) {
        this.wc = WebClient.builder()
            .baseUrl(apiUrl)
            .build();
    }

    public String analyze(String text) {
        JsonNode resp = wc.post()
            .uri("/predict")
            .bodyValue(Collections.singletonMap("text", text))
            .retrieve()
            .bodyToMono(JsonNode.class)
            .block();
        return resp.get("label").asText();
    }
}
