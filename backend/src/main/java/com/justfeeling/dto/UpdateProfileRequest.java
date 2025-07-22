package com.justfeeling.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {
    
    @Size(min = 2, max = 20, message = "사용자명은 2자 이상 20자 이하여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다")
    private String userName;
    
    @Email(message = "유효한 이메일 형식이 아닙니다")
    private String email;
    
    // 기본 생성자
    public UpdateProfileRequest() {}
    
    // 생성자
    public UpdateProfileRequest(String userName, String email) {
        this.userName = userName;
        this.email = email;
    }
    
    // Getters and Setters
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
} 