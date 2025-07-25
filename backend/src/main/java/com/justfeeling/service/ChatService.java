package com.justfeeling.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.justfeeling.dto.SendMessageRequest;
import com.justfeeling.entity.ChatMessage;
import com.justfeeling.entity.ChatRoom;
import com.justfeeling.repository.ChatMessageRepository;
import com.justfeeling.repository.ChatRoomRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ChatService {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * 모든 채팅방 조회
     */
    public List<ChatRoom> getAllChatRooms() {
        return chatRoomRepository.findAll();
    }
    
    /**
     * 특정 사용자가 참여한 채팅방만 조회
     */
    public List<ChatRoom> getChatRoomsByUser(Long userId) {
        List<ChatRoom> allChatRooms = chatRoomRepository.findAll();
        
        return allChatRooms.stream()
            .filter(chatRoom -> isUserParticipant(chatRoom, userId))
            .collect(Collectors.toList());
    }
    
    /**
     * 사용자가 채팅방 참여자인지 확인
     */
    private boolean isUserParticipant(ChatRoom chatRoom, Long userId) {
        try {
            String participantsJson = chatRoom.getParticipants();
            if (participantsJson == null || participantsJson.trim().isEmpty()) {
                return false;
            }
            
            // JSON 배열을 Long 리스트로 파싱
            List<Long> participantIds = objectMapper.readValue(
                participantsJson, 
                new TypeReference<List<Long>>() {}
            );
            
            return participantIds.contains(userId);
            
        } catch (JsonProcessingException e) {
            // JSON 파싱 실패 시, 문자열로 직접 확인 (fallback)
            String participantsStr = chatRoom.getParticipants();
            return participantsStr.contains(userId.toString());
        }
    }
    
    /**
     * 특정 채팅방의 메시지 조회
     */
    public List<ChatMessage> getChatMessages(Long chatRoomId) {
        return chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
    }
    
    /**
     * 메시지 전송
     */
    public Map<String, Object> sendMessage(@Valid SendMessageRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 채팅방 존재 여부 확인
            Optional<ChatRoom> chatRoom = chatRoomRepository.findById(request.getChatRoomId());
            if (chatRoom.isEmpty()) {
                response.put("success", false);
                response.put("message", "존재하지 않는 채팅방입니다.");
                return response;
            }
            
            // 메시지 생성 및 저장
            ChatMessage newMessage = new ChatMessage(
                request.getChatRoomId(),
                request.getSenderID(),
                request.getContent()
            );
            
            ChatMessage savedMessage = chatMessageRepository.save(newMessage);
            
            response.put("success", true);
            response.put("message", "메시지가 전송되었습니다.");
            response.put("chatMessage", savedMessage);
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "메시지 전송 중 오류가 발생했습니다: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * 채팅방 생성
     */
    public Map<String, Object> createChatRoom(String title, String participants, Long senderID) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 입력 검증
            if (title == null || title.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "채팅방 제목이 필요합니다.");
                return response;
            }
            
            if (senderID == null) {
                response.put("success", false);
                response.put("message", "생성자 ID가 필요합니다.");
                return response;
            }
            
            ChatRoom newChatRoom = new ChatRoom(title.trim(), participants, senderID);
            ChatRoom savedChatRoom = chatRoomRepository.save(newChatRoom);
            
            response.put("success", true);
            response.put("message", "채팅방이 생성되었습니다.");
            response.put("chatRoom", savedChatRoom);
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "채팅방 생성 중 오류가 발생했습니다: " + e.getMessage());
            return response;
        }
    }
    
    /**
     * 채팅방 삭제
     */
    public Map<String, Object> deleteChatRoom(Long chatRoomId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);
            if (chatRoom.isEmpty()) {
                response.put("success", false);
                response.put("message", "존재하지 않는 채팅방입니다.");
                return response;
            }
            
            // 채팅방의 모든 메시지도 함께 삭제
            chatMessageRepository.deleteAll(chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId));
            chatRoomRepository.deleteById(chatRoomId);
            
            response.put("success", true);
            response.put("message", "채팅방이 삭제되었습니다.");
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "채팅방 삭제 중 오류가 발생했습니다: " + e.getMessage());
            return response;
        }
    }
} 