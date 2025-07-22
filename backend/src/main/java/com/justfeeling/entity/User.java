package com.justfeeling.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userID;
    
    @NotBlank(message = "사용자명은 필수입니다")
    @Size(min = 2, max = 20, message = "사용자명은 2자 이상 20자 이하여야 합니다")
    @Column(unique = true, nullable = false, length = 20)
    private String userName;
    
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "유효한 이메일 형식이 아닙니다")
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @NotBlank(message = "비밀번호는 필수입니다")
    @Column(nullable = false, length = 255)
    private String password;
    
    // 기본 생성자
    public User() {}
    
    // 생성자
    public User(String userName, String email, String password) {
        this.userName = userName;
        this.email = email;
        this.password = password;
    }
    
    // Getters and Setters
    public Long getUserID() {
        return userID;
    }
    
    public void setUserID(Long userID) {
        this.userID = userID;
    }
    
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