package com.justfeeling.controller;

import com.justfeeling.dto.CreatePostRequest;
import com.justfeeling.entity.Post;
import com.justfeeling.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {
    
    @Autowired
    private PostRepository postRepository;
    
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(posts);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUser(@PathVariable String userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(posts);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@RequestBody CreatePostRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Post newPost = new Post(
                request.getUserId(),
                request.getEmotion(),
                request.getContentText(),
                request.getContentImage()
            );
            
            Post savedPost = postRepository.save(newPost);
            
            response.put("success", true);
            response.put("message", "포스트가 성공적으로 생성되었습니다.");
            response.put("post", savedPost);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "포스트 생성 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{postId}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Long postId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            postRepository.deleteById(postId);
            response.put("success", true);
            response.put("message", "포스트가 삭제되었습니다.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "포스트 삭제 중 오류가 발생했습니다.");
            return ResponseEntity.badRequest().body(response);
        }
    }
} 