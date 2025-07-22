package com.justfeeling.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
    
    @NotBlank(message = "사용자명은 필수입니다")
    @Size(min = 2, max = 20, message = "사용자명은 2자 이상 20자 이하여야 합니다")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다")
    private String userName;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 형식이 아닙니다")
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, max = 100, message = "비밀번호는 8자 이상 100자 이하여야 합니다")
    @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*\\d).+$", message = "비밀번호는 영문과 숫자를 포함해야 합니다")
    private String password;
    
    // 기본 생성자
    public RegisterRequest() {}
    
    // 생성자
    public RegisterRequest(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
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
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
} 