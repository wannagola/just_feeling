package com.justfeeling.service;

import com.justfeeling.dto.CreatePostRequest;
import com.justfeeling.entity.Post;
import com.justfeeling.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Map<String, Object> createPost(CreatePostRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 입력 검증
            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 ID는 필수입니다.");
                return response;
            }
            
            if (request.getEmotion() == null || request.getEmotion().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "감정 정보는 필수입니다.");
                return response;
            }
            
            if (request.getContentText() == null || request.getContentText().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "게시글 내용은 필수입니다.");
                return response;
            }
            
            // 새 게시글 생성
            Post newPost = new Post(
                request.getUserId().trim(),
                request.getEmotion().trim(),
                request.getContentText().trim(),
                request.getContentImage()
            );
            
            Post savedPost = postRepository.save(newPost);
            
            response.put("success", true);
            response.put("message", "포스트가 성공적으로 생성되었습니다.");
            response.put("data", savedPost);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "포스트 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return response;
    }
    
    public Map<String, Object> deletePost(Long postId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 게시글 존재 여부 확인
            if (!postRepository.existsById(postId)) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return response;
            }
            
            postRepository.deleteById(postId);
            response.put("success", true);
            response.put("message", "포스트가 삭제되었습니다.");
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "포스트 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return response;
    }
} 