package com.justfeeling.service;

import com.justfeeling.dto.LoginRequest;
import com.justfeeling.entity.User;
import com.justfeeling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtService jwtService;
    
    public Map<String, Object> login(LoginRequest loginRequest) {
        Map<String, Object> response = new HashMap<>();
        
        // 사용자 존재 여부 확인
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());
        
        if (user.isPresent() && passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            // JWT 토큰 생성
            String token = jwtService.generateToken(
                user.get().getEmail(),
                user.get().getUserID(),
                user.get().getUserName()
            );
            
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("token", token);
            response.put("user", Map.of(
                "userID", user.get().getUserID(),
                "userName", user.get().getUserName(),
                "email", user.get().getEmail()
            ));
        } else {
            response.put("success", false);
            response.put("message", "이메일 또는 비밀번호가 잘못되었습니다.");
        }
        
        return response;
    }
    
    public Map<String, Object> register(String userName, String email, String password) {
        Map<String, Object> response = new HashMap<>();
        
        // 이메일 중복 체크
        if (userRepository.existsByEmail(email)) {
            response.put("success", false);
            response.put("message", "이미 존재하는 이메일입니다.");
            return response;
        }
        
        // 사용자명 중복 체크
        if (userRepository.existsByUserName(userName)) {
            response.put("success", false);
            response.put("message", "이미 존재하는 사용자명입니다.");
            return response;
        }
        
        // 패스워드 암호화
        String encodedPassword = passwordEncoder.encode(password);
        
        // 새 사용자 생성
        User newUser = new User(userName, email, encodedPassword);
        userRepository.save(newUser);
        
        response.put("success", true);
        response.put("message", "회원가입 성공");
        return response;
    }
    
    public Map<String, Object> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "로그아웃 성공");
        return response;
    }
} 