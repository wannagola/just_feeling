package com.justfeeling.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트에서 메시지를 받을 prefix 설정
        config.setApplicationDestinationPrefixes("/app");
        
        // 클라이언트로 메시지를 보낼 prefix 설정 (구독)
        config.enableSimpleBroker("/topic", "/queue");
        
        // 사용자별 개인 메시지를 위한 prefix (옵션)
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // WebSocket 연결 엔드포인트 설정
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000")  // CORS 설정
                .withSockJS();  // SockJS 지원 (WebSocket 미지원 브라우저 대응)
    }
} 