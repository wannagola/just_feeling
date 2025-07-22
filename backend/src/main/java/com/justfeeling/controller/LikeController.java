package com.justfeeling.controller;

import com.justfeeling.service.LikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/emoai/likes")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Likes", description = "게시글 좋아요 관리 API")
public class LikeController {
    
    private static final Logger logger = LoggerFactory.getLogger(LikeController.class);
    
    @Autowired
    private LikeService likeService;
    
    @Operation(summary = "좋아요 토글", description = "게시글에 좋아요를 추가하거나 취소합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "좋아요 처리 성공"),
        @ApiResponse(responseCode = "400", description = "좋아요 처리 실패")
    })
    @PostMapping("/posts/{postId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleLike(
        @Parameter(description = "게시글 ID", required = true)
        @PathVariable Long postId,
        @Parameter(description = "사용자 ID", required = true)
        @RequestParam String userId) {
        
        logger.info("좋아요 토글 요청 - postId: {}, userId: {}", postId, userId);
        
        try {
            Map<String, Object> response = likeService.toggleLike(postId, userId);
            boolean success = (Boolean) response.get("success");
            
            logger.info("좋아요 토글 결과 - success: {}, response: {}", success, response);
            
            return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("좋아요 토글 중 오류 발생 - postId: {}, userId: {}", postId, userId, e);
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "좋아요 처리 중 오류가 발생했습니다: " + e.getMessage()
            );
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @Operation(summary = "좋아요 정보 조회", description = "특정 게시글의 좋아요 수와 사용자의 좋아요 상태를 조회합니다.")
    @ApiResponse(responseCode = "200", description = "좋아요 정보 조회 성공")
    @GetMapping("/posts/{postId}")
    public ResponseEntity<Map<String, Object>> getLikeInfo(
        @Parameter(description = "게시글 ID", required = true)
        @PathVariable Long postId,
        @Parameter(description = "사용자 ID (선택사항)")
        @RequestParam(required = false) String userId) {
        
        logger.info("좋아요 정보 조회 요청 - postId: {}, userId: {}", postId, userId);
        
        try {
            Map<String, Object> response = likeService.getLikeInfo(postId, userId);
            boolean success = (Boolean) response.get("success");
            
            logger.info("좋아요 정보 조회 결과 - success: {}, response: {}", success, response);
            
            return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("좋아요 정보 조회 중 오류 발생 - postId: {}, userId: {}", postId, userId, e);
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "message", "좋아요 정보 조회 중 오류가 발생했습니다: " + e.getMessage()
            );
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
} 