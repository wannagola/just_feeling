package com.justfeeling.controller;

import com.justfeeling.dto.SendMessageRequest;
import com.justfeeling.entity.ChatMessage;
import com.justfeeling.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * 채팅방에 메시지 전송
     * 클라이언트에서 /app/chat/{chatRoomId}로 메시지를 보내면
     * 해당 채팅방의 모든 구독자에게 메시지를 브로드캐스트
     */
    @MessageMapping("/chat/{chatRoomId}")
    @SendTo("/topic/chat/{chatRoomId}")
    public ChatMessage sendMessage(@DestinationVariable Long chatRoomId, SendMessageRequest request) {
        try {
            // 채팅방 ID 설정 (URL에서 가져온 값으로 오버라이드)
            request.setChatRoomId(chatRoomId);
            
            // ChatService를 통해 메시지 저장
            Map<String, Object> response = chatService.sendMessage(request);
            
            if ((Boolean) response.get("success")) {
                // 저장된 메시지를 반환 (구독자들에게 브로드캐스트됨)
                return (ChatMessage) response.get("chatMessage");
            } else {
                // 오류 발생 시 에러 메시지를 포함한 ChatMessage 생성
                ChatMessage errorMessage = new ChatMessage();
                errorMessage.setChatRoomId(chatRoomId);
                errorMessage.setSenderID(-1L); // 시스템 메시지 표시
                errorMessage.setContent("메시지 전송 실패: " + response.get("message"));
                return errorMessage;
            }
            
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지 생성
            ChatMessage errorMessage = new ChatMessage();
            errorMessage.setChatRoomId(chatRoomId);
            errorMessage.setSenderID(-1L); // 시스템 메시지 표시
            errorMessage.setContent("메시지 전송 중 오류가 발생했습니다: " + e.getMessage());
            return errorMessage;
        }
    }
    
    /**
     * 사용자가 채팅방에 입장했을 때
     */
    @MessageMapping("/chat/{chatRoomId}/join")
    public void userJoined(@DestinationVariable Long chatRoomId, Map<String, Object> userInfo) {
        try {
            String username = (String) userInfo.get("username");
            Long userId = Long.valueOf(userInfo.get("userId").toString());
            
            // 입장 알림 메시지 생성
            ChatMessage joinMessage = new ChatMessage();
            joinMessage.setChatRoomId(chatRoomId);
            joinMessage.setSenderID(-1L); // 시스템 메시지
            joinMessage.setContent(username + "님이 채팅방에 입장했습니다.");
            
            // 해당 채팅방의 모든 구독자에게 입장 알림 전송
            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, joinMessage);
            
        } catch (Exception e) {
            System.err.println("사용자 입장 처리 중 오류: " + e.getMessage());
        }
    }
    
    /**
     * 사용자가 채팅방에서 나갔을 때
     */
    @MessageMapping("/chat/{chatRoomId}/leave")
    public void userLeft(@DestinationVariable Long chatRoomId, Map<String, Object> userInfo) {
        try {
            String username = (String) userInfo.get("username");
            Long userId = Long.valueOf(userInfo.get("userId").toString());
            
            // 퇴장 알림 메시지 생성
            ChatMessage leaveMessage = new ChatMessage();
            leaveMessage.setChatRoomId(chatRoomId);
            leaveMessage.setSenderID(-1L); // 시스템 메시지
            leaveMessage.setContent(username + "님이 채팅방을 나갔습니다.");
            
            // 해당 채팅방의 모든 구독자에게 퇴장 알림 전송
            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, leaveMessage);
            
        } catch (Exception e) {
            System.err.println("사용자 퇴장 처리 중 오류: " + e.getMessage());
        }
    }
    
    /**
     * 타이핑 상태 알림
     */
    @MessageMapping("/chat/{chatRoomId}/typing")
    public void userTyping(@DestinationVariable Long chatRoomId, Map<String, Object> typingInfo) {
        try {
            // 타이핑 상태를 다른 사용자들에게 알림 (본인 제외)
            messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId + "/typing", typingInfo);
            
        } catch (Exception e) {
            System.err.println("타이핑 상태 처리 중 오류: " + e.getMessage());
        }
    }
} 