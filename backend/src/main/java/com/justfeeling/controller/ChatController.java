package com.justfeeling.controller;

import com.justfeeling.dto.SendMessageRequest;
import com.justfeeling.entity.ChatMessage;
import com.justfeeling.entity.ChatRoom;
import com.justfeeling.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emoai/chat")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Chat", description = "실시간 채팅 관리 API")
public class ChatController {
    
    @Autowired
    private ChatService chatService;
    
    @Operation(summary = "모든 채팅방 조회", description = "모든 채팅방을 조회합니다. (관리자용)")
    @ApiResponse(responseCode = "200", description = "채팅방 목록 조회 성공")
    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getAllChatRooms() {
        List<ChatRoom> chatRooms = chatService.getAllChatRooms();
        return ResponseEntity.ok(chatRooms);
    }
    
    @Operation(summary = "사용자별 채팅방 조회", description = "특정 사용자가 참여 중인 채팅방만 조회합니다.")
    @ApiResponse(responseCode = "200", description = "사용자 채팅방 목록 조회 성공")
    @GetMapping("/rooms/user/{userId}")
    public ResponseEntity<List<ChatRoom>> getChatRoomsByUser(
        @Parameter(description = "사용자 ID", required = true)
        @PathVariable Long userId) {
        List<ChatRoom> chatRooms = chatService.getChatRoomsByUser(userId);
        return ResponseEntity.ok(chatRooms);
    }
    
    @Operation(summary = "특정 채팅방 조회", description = "특정 채팅방의 정보를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "채팅방 정보 조회 성공")
    @GetMapping("/{chatRoomId}")
    public ResponseEntity<ChatRoom> getChatRoom(
        @Parameter(description = "채팅방 ID", required = true)
        @PathVariable Long chatRoomId) {
        try {
            // ChatService에 해당 메서드가 없으므로 임시로 직접 구현
            List<ChatRoom> rooms = chatService.getAllChatRooms();
            ChatRoom room = rooms.stream()
                .filter(r -> r.getChatRoomId().equals(chatRoomId))
                .findFirst()
                .orElse(null);
            
            if (room != null) {
                return ResponseEntity.ok(room);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(summary = "채팅방 메시지 조회", description = "특정 채팅방의 모든 메시지를 시간순으로 조회합니다.")
    @ApiResponse(responseCode = "200", description = "메시지 목록 조회 성공")
    @GetMapping("/rooms/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessage>> getChatMessages(
        @Parameter(description = "채팅방 ID", required = true)
        @PathVariable Long chatRoomId) {
        List<ChatMessage> messages = chatService.getChatMessages(chatRoomId);
        return ResponseEntity.ok(messages);
    }
    
    @Operation(summary = "메시지 전송", description = "채팅방에 새로운 메시지를 전송합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
        @ApiResponse(responseCode = "400", description = "메시지 전송 실패")
    })
    @PostMapping("/messages")
    public ResponseEntity<Map<String, Object>> sendMessage(
        @Parameter(description = "메시지 전송 요청 정보", required = true)
        @Valid @RequestBody SendMessageRequest request) {
        
        Map<String, Object> response = chatService.sendMessage(request);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @Operation(summary = "채팅방 생성", description = "새로운 채팅방을 생성합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "채팅방 생성 성공"),
        @ApiResponse(responseCode = "400", description = "채팅방 생성 실패")
    })
    @PostMapping("/rooms")
    public ResponseEntity<Map<String, Object>> createChatRoom(
        @Parameter(description = "채팅방 생성 요청 정보", required = true)
        @RequestBody Map<String, Object> request) {
        
        String title = (String) request.get("title");
        String participants = (String) request.get("participants");
        Long senderID = request.get("senderID") != null ? 
            Long.valueOf(request.get("senderID").toString()) : null;
        
        Map<String, Object> response = chatService.createChatRoom(title, participants, senderID);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @Operation(summary = "채팅방 삭제", description = "특정 채팅방과 관련된 모든 메시지를 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "채팅방 삭제 성공"),
        @ApiResponse(responseCode = "400", description = "채팅방 삭제 실패")
    })
    @DeleteMapping("/rooms/{chatRoomId}")
    public ResponseEntity<Map<String, Object>> deleteChatRoom(
        @Parameter(description = "삭제할 채팅방 ID", required = true)
        @PathVariable Long chatRoomId) {
        
        Map<String, Object> response = chatService.deleteChatRoom(chatRoomId);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
} 