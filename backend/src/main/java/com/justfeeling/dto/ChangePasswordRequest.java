package com.justfeeling.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ChangePasswordRequest {
    
    @NotBlank(message = "현재 비밀번호는 필수입니다")
    private String currentPassword;
    
    @NotBlank(message = "새 비밀번호는 필수입니다")
    @Size(min = 8, max = 100, message = "새 비밀번호는 8자 이상 100자 이하여야 합니다")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).+$", message = "새 비밀번호는 영문과 숫자를 포함해야 합니다")
    private String newPassword;
    
    // 기본 생성자
    public ChangePasswordRequest() {}
    
    // 생성자
    public ChangePasswordRequest(String currentPassword, String newPassword) {
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
    }
    
    // Getters and Setters
    public String getCurrentPassword() {
        return currentPassword;
    }
    
    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }
    
    public String getNewPassword() {
        return newPassword;
    }
    
    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
} 