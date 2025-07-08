package com.justfeeling.controller;

import com.justfeeling.dto.LoginRequest;
import com.justfeeling.entity.User;
import com.justfeeling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        // 간단한 로그인 처리 (실제로는 패스워드 암호화 필요)
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        
        if (user.isPresent() && user.get().getPassword().equals(loginRequest.getPassword())) {
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("token", "mock-jwt-token");
            response.put("user", Map.of(
                "userID", user.get().getUserID(),
                "userName", user.get().getUserName(),
                "email", user.get().getEmail()
            ));
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "이메일 또는 비밀번호가 잘못되었습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        
        String email = request.get("email");
        String password = request.get("password");
        String userName = request.get("userName");
        
        // 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "이미 존재하는 이메일입니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // 사용자명 중복 체크
        if (userRepository.existsByUserName(userName)) {
            response.put("success", false);
            response.put("message", "이미 존재하는 사용자명입니다.");
            return ResponseEntity.badRequest().body(response);
        }
        
        // 새 사용자 생성
        User newUser = new User(userName, email, password);
        userRepository.save(newUser);
        
        response.put("success", true);
        response.put("message", "회원가입 성공");
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "로그아웃 성공");
        return ResponseEntity.ok(response);
    }
} 