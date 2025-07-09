package com.justfeeling.controller;

import com.justfeeling.dto.SendMessageRequest;
import com.justfeeling.entity.ChatMessage;
import com.justfeeling.entity.ChatRoom;
import com.justfeeling.repository.ChatMessageRepository;
import com.justfeeling.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emoai/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms() {
        List<ChatRoom> chatRooms = chatRoomRepository.findAll();
        return ResponseEntity.ok(chatRooms);
    }
    
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long chatRoomId) {
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderByTimestampAsc(chatRoomId);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(@RequestBody SendMessageRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            ChatMessage newMessage = new ChatMessage(
                request.getChatRoomId(),
                request.getSenderID(),
                request.getContent()
            );
            
            ChatMessage savedMessage = chatMessageRepository.save(newMessage);
            
            response.put("success", true);
            response.put("message", "메시지가 전송되었습니다.");
            response.put("chatMessage", savedMessage);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "메시지 전송 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/rooms")
    public ResponseEntity<Map<String, Object>> createChatRoom(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String title = (String) request.get("title");
            String participants = (String) request.get("participants");
            Long senderID = Long.valueOf(request.get("senderID").toString());
            
            ChatRoom newChatRoom = new ChatRoom(title, participants, senderID);
            ChatRoom savedChatRoom = chatRoomRepository.save(newChatRoom);
            
            response.put("success", true);
            response.put("message", "채팅방이 생성되었습니다.");
            response.put("chatRoom", savedChatRoom);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "채팅방 생성 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
} 