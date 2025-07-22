package com.justfeeling.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePostRequest {
    
    @NotBlank(message = "사용자 ID는 필수입니다")
    private String userId;
    
    @NotBlank(message = "감정 정보는 필수입니다")
    private String emotion;
    
    @NotBlank(message = "게시글 내용은 필수입니다")
    @Size(max = 1000, message = "게시글 내용은 1000자를 초과할 수 없습니다")
    private String contentText;
    
    private String contentImage; // 선택적 필드
    
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