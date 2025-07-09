package com.justfeeling.controller;

import com.justfeeling.dto.CreatePostRequest;
import com.justfeeling.dto.UpdatePostRequest;
import com.justfeeling.entity.Post;
import com.justfeeling.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/emoai/posts")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Posts", description = "감정 게시글 관리 API")
public class PostController {
    
    @Autowired
    private PostService postService;
    
    @Operation(summary = "모든 게시글 조회", description = "최신순으로 정렬된 모든 감정 게시글을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "게시글 목록 조회 성공")
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }
    
    @Operation(summary = "특정 사용자 게시글 조회", description = "특정 사용자가 작성한 모든 게시글을 조회합니다.")
    @ApiResponse(responseCode = "200", description = "사용자 게시글 목록 조회 성공")
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(
        @Parameter(description = "사용자 ID", required = true)
        @PathVariable String userId) {
        List<Post> posts = postService.getPostsByUser(userId);
        return ResponseEntity.ok(posts);
    }
    
    @Operation(summary = "새 게시글 작성", description = "새로운 감정 게시글을 작성합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "게시글 작성 성공"),
        @ApiResponse(responseCode = "400", description = "게시글 작성 실패")
    })
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
        @Parameter(description = "게시글 작성 요청 정보", required = true)
        @Valid @RequestBody CreatePostRequest request) {
        
        Map<String, Object> response = postService.createPost(request);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @Operation(summary = "게시글 삭제", description = "특정 게시글을 삭제합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "게시글 삭제 성공"),
        @ApiResponse(responseCode = "400", description = "게시글 삭제 실패")
    })
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(
        @Parameter(description = "삭제할 게시글 ID", required = true)
        @PathVariable Long postId) {
        
        Map<String, Object> response = postService.deletePost(postId);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
    
    @Operation(summary = "게시글 수정", description = "특정 게시글을 수정합니다.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "게시글 수정 성공"),
        @ApiResponse(responseCode = "400", description = "게시글 수정 실패")
    })
    @PutMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> updatePost(
        @Parameter(description = "수정할 게시글 ID", required = true)
        @PathVariable Long postId,
        @Parameter(description = "게시글 수정 요청 정보", required = true)
        @Valid @RequestBody UpdatePostRequest request) {
        
        Map<String, Object> response = postService.updatePost(postId, request);
        boolean success = (Boolean) response.get("success");
        
        return success ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(response);
    }
} 