package com.justfeeling.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long messageId;
    
    @Column(nullable = false)
    private Long chatRoomId;
    
    @Column(nullable = false)
    private Long senderID;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    // 기본 생성자
    public ChatMessage() {
        this.timestamp = LocalDateTime.now();
    }
    
    // 생성자
    public ChatMessage(Long chatRoomId, Long senderID, String content) {
        this.chatRoomId = chatRoomId;
        this.senderID = senderID;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getMessageId() {
        return messageId;
    }
    
    public void setMessageId(Long messageId) {
        this.messageId = messageId;
    }
    
    public Long getChatRoomId() {
        return chatRoomId;
    }
    
    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
    }
    
    public Long getSenderID() {
        return senderID;
    }
    
    public void setSenderID(Long senderID) {
        this.senderID = senderID;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
} 