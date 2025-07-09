package com.justfeeling.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Validation 오류 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        
        Map<String, Object> response = new HashMap<>();
        Map<String, String> errors = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        response.put("success", false);
        response.put("message", "입력 데이터 검증에 실패했습니다");
        response.put("errors", errors);
        
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * JWT 관련 오류 처리
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleJwtException(RuntimeException ex) {
        Map<String, Object> response = new HashMap<>();
        
        if (ex.getMessage().contains("JWT") || ex.getMessage().contains("token")) {
            response.put("success", false);
            response.put("message", "인증 토큰이 유효하지 않습니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        // 기타 RuntimeException
        response.put("success", false);
        response.put("message", "서버 처리 중 오류가 발생했습니다");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    /**
     * IllegalArgumentException 처리
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "잘못된 요청입니다");
        
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * NullPointerException 처리
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(
            NullPointerException ex) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "필수 데이터가 누락되었습니다");
        
        return ResponseEntity.badRequest().body(response);
    }

    /**
     * 일반적인 Exception 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", "서버 내부 오류가 발생했습니다");
        
        // 개발 환경에서는 상세 오류 메시지 포함 (프로덕션에서는 제거 권장)
        response.put("details", ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
} 