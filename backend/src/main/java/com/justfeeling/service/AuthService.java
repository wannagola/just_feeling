package com.justfeeling.service;

import com.justfeeling.dto.LoginRequest;
import com.justfeeling.dto.UpdateProfileRequest;
import com.justfeeling.dto.ChangePasswordRequest;
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
    
    public Map<String, Object> validateToken(String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Authorization 헤더에서 Bearer 토큰 추출
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "유효하지 않은 토큰 형식입니다.");
                return response;
            }
            
            String token = authHeader.substring(7); // "Bearer " 제거
            
            // JWT 토큰 검증
            if (jwtService.validateToken(token)) {
                String email = jwtService.extractEmail(token);
                Long userId = jwtService.extractUserId(token);
                String userName = jwtService.extractUserName(token);
                
                response.put("success", true);
                response.put("message", "토큰이 유효합니다.");
                response.put("user", Map.of(
                    "userID", userId,
                    "userName", userName,
                    "email", email
                ));
            } else {
                response.put("success", false);
                response.put("message", "토큰이 만료되었거나 유효하지 않습니다.");
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "토큰 검증 중 오류가 발생했습니다.");
        }
        
        return response;
    }
    
    public Map<String, Object> updateProfile(Long userId, UpdateProfileRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                response.put("success", false);
                response.put("message", "사용자를 찾을 수 없습니다.");
                return response;
            }
            
            User user = userOptional.get();
            
            // 사용자명 중복 체크 (현재 사용자 제외)
            if (request.getUserName() != null && !request.getUserName().equals(user.getUserName())) {
                if (userRepository.existsByUserName(request.getUserName())) {
                    response.put("success", false);
                    response.put("message", "이미 존재하는 사용자명입니다.");
                    return response;
                }
                user.setUserName(request.getUserName());
            }
            
            // 이메일 중복 체크 (현재 사용자 제외)
            if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    response.put("success", false);
                    response.put("message", "이미 존재하는 이메일입니다.");
                    return response;
                }
                user.setEmail(request.getEmail());
            }
            
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "프로필이 성공적으로 업데이트되었습니다.");
            response.put("user", Map.of(
                "userID", user.getUserID(),
                "userName", user.getUserName(),
                "email", user.getEmail()
            ));
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "프로필 업데이트 중 오류가 발생했습니다.");
        }
        
        return response;
    }
    
    public Map<String, Object> changePassword(Long userId, ChangePasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (!userOptional.isPresent()) {
                response.put("success", false);
                response.put("message", "사용자를 찾을 수 없습니다.");
                return response;
            }
            
            User user = userOptional.get();
            
            // 현재 비밀번호 확인
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "현재 비밀번호가 일치하지 않습니다.");
                return response;
            }
            
            // 새 비밀번호 암호화 및 저장
            String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPassword(encodedNewPassword);
            userRepository.save(user);
            
            response.put("success", true);
            response.put("message", "비밀번호가 성공적으로 변경되었습니다.");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "비밀번호 변경 중 오류가 발생했습니다.");
        }
        
        return response;
    }
} 