package com.justfeeling.controller;

import com.justfeeling.entity.User;
import com.justfeeling.repository.UserRepository;
import com.justfeeling.service.AuthService;
import com.justfeeling.dto.UpdateProfileRequest;
import com.justfeeling.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/emoai/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AuthService authService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        // 비밀번호 제거
        users.forEach(user -> user.setPassword(null));
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User foundUser = user.get();
            foundUser.setPassword(null); // 비밀번호 제거
            return ResponseEntity.ok(foundUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/username/{userName}")
    public ResponseEntity<User> getUserByUserName(@PathVariable String userName) {
        Optional<User> user = userRepository.findByUserName(userName);
        if (user.isPresent()) {
            User foundUser = user.get();
            foundUser.setPassword(null); // 비밀번호 제거
            return ResponseEntity.ok(foundUser);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{userId}/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        
        Map<String, Object> response = authService.updateProfile(userId, request);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @PutMapping("/{userId}/password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody ChangePasswordRequest request) {
        
        Map<String, Object> response = authService.changePassword(userId, request);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
} 