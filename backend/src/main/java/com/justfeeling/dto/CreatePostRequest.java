package com.justfeeling.dto;

public class CreatePostRequest {
    private String userId;
    private String emotion;
    private String contentText;
    private String contentImage;
    
    // 기본 생성자
    public CreatePostRequest() {}
    
    // 생성자
    public CreatePostRequest(String userId, String emotion, String contentText, String contentImage) {
        this.userId = userId;
        this.emotion = emotion;
        this.contentText = contentText;
        this.contentImage = contentImage;
    }
    
    // Getters and Setters
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
} 