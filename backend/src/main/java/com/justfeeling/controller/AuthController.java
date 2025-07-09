package com.justfeeling.controller;

import com.justfeeling.dto.LoginRequest;
import com.justfeeling.dto.RegisterRequest;
import com.justfeeling.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/emoai/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Authentication", description = "사용자 인증 관련 API")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @Operation(summary = "사용자 로그인", description = "이메일과 비밀번호로 로그인하여 토큰을 발급받습니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "로그인 성공", 
                    content = @Content(mediaType = "application/json")),
        @ApiResponse(responseCode = "400", description = "로그인 실패 - 잘못된 이메일 또는 비밀번호",
                    content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
        @Parameter(description = "로그인 요청 정보", required = true)
        @Valid @RequestBody LoginRequest loginRequest) {
        
        Map<String, Object> response = authService.login(loginRequest);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @Operation(summary = "사용자 회원가입", description = "새로운 사용자 계정을 생성합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "회원가입 성공"),
        @ApiResponse(responseCode = "400", description = "회원가입 실패 - 이메일 또는 사용자명 중복")
    })
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(
        @Parameter(description = "회원가입 요청 정보", required = true)
        @Valid @RequestBody RegisterRequest request) {
        
        Map<String, Object> response = authService.register(
            request.getUserName(), 
            request.getEmail(), 
            request.getPassword()
        );
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @Operation(summary = "사용자 로그아웃", description = "현재 세션을 종료합니다.")
    @ApiResponse(responseCode = "200", description = "로그아웃 성공")
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = authService.logout();
        return ResponseEntity.ok(response);
    }
    
    @Operation(summary = "토큰 검증", description = "JWT 토큰의 유효성을 검증합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "토큰 검증 성공"),
        @ApiResponse(responseCode = "400", description = "토큰 검증 실패")
    })
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(
        @Parameter(description = "검증할 JWT 토큰", required = true)
        @RequestHeader("Authorization") String token) {
        
        Map<String, Object> response = authService.validateToken(token);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
} 