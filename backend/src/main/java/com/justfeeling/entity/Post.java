package com.justfeeling.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String userId;
    
    @Column(nullable = false)
    private String emotion;
    
    @Column(columnDefinition = "TEXT")
    private String contentText;
    
    private String contentImage;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // 기본 생성자
    public Post() {
        this.createdAt = LocalDateTime.now();
    }
    
    // 생성자
    public Post(String userId, String emotion, String contentText, String contentImage) {
        this.userId = userId;
        this.emotion = emotion;
        this.contentText = contentText;
        this.contentImage = contentImage;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getEmotion() {
        return emotion;
    }
    
    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }
    
    public String getContentText() {
        return contentText;
    }
    
    public void setContentText(String contentText) {
        this.contentText = contentText;
    }
    
    public String getContentImage() {
        return contentImage;
    }
    
    public void setContentImage(String contentImage) {
        this.contentImage = contentImage;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
} 