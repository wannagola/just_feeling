package com.justfeeling.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chatRoomId;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String participants; // JSON 형태로 저장
    
    @Column(nullable = false)
    private Long senderID;
    
    // 기본 생성자
    public ChatRoom() {}
    
    // 생성자
    public ChatRoom(String title, String participants, Long senderID) {
        this.title = title;
        this.participants = participants;
        this.senderID = senderID;
    }
    
    // Getters and Setters
    public Long getChatRoomId() {
        return chatRoomId;
    }
    
    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getParticipants() {
        return participants;
    }
    
    public void setParticipants(String participants) {
        this.participants = participants;
    }
    
    public Long getSenderID() {
        return senderID;
    }
    
    public void setSenderID(Long senderID) {
        this.senderID = senderID;
    }
} 