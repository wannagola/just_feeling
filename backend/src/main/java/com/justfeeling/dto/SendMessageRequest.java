package com.justfeeling.dto;

public class SendMessageRequest {
    private Long chatRoomId;
    private Long senderID;
    private String content;
    
    // 기본 생성자
    public SendMessageRequest() {}
    
    // 생성자
    public SendMessageRequest(Long chatRoomId, Long senderID, String content) {
        this.chatRoomId = chatRoomId;
        this.senderID = senderID;
        this.content = content;
    }
    
    // Getters and Setters
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
} 