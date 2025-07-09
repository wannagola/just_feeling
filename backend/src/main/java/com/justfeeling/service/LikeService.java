package com.justfeeling.service;

import com.justfeeling.entity.Like;
import com.justfeeling.entity.Post;
import com.justfeeling.repository.LikeRepository;
import com.justfeeling.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class LikeService {
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    /**
     * 좋아요 토글 (좋아요가 있으면 취소, 없으면 추가)
     */
    public Map<String, Object> toggleLike(Long postId, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 게시글 존재 여부 확인
            Optional<Post> optionalPost = postRepository.findById(postId);
            if (!optionalPost.isPresent()) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return response;
            }
            
            Post post = optionalPost.get();
            
            // 사용자 ID 검증
            if (userId == null || userId.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 ID는 필수입니다.");
                return response;
            }
            
            // 기존 좋아요 확인
            Optional<Like> existingLike = likeRepository.findByPostIdAndUserId(postId, userId);
            
            boolean isLiked;
            if (existingLike.isPresent()) {
                // 좋아요 취소
                likeRepository.delete(existingLike.get());
                post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
                isLiked = false;
            } else {
                // 좋아요 추가
                Like newLike = new Like(postId, userId);
                likeRepository.save(newLike);
                post.setLikeCount(post.getLikeCount() + 1);
                isLiked = true;
            }
            
            // 게시글의 좋아요 수 업데이트
            postRepository.save(post);
            
            response.put("success", true);
            response.put("message", isLiked ? "좋아요를 눌렀습니다." : "좋아요를 취소했습니다.");
            response.put("isLiked", isLiked);
            response.put("likeCount", post.getLikeCount());
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "좋아요 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return response;
    }
    
    /**
     * 특정 게시글의 좋아요 정보 조회
     */
    public Map<String, Object> getLikeInfo(Long postId, String userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // 게시글 존재 여부 확인
            Optional<Post> optionalPost = postRepository.findById(postId);
            if (!optionalPost.isPresent()) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return response;
            }
            
            Post post = optionalPost.get();
            
            // 사용자가 좋아요를 눌렀는지 확인
            boolean isLiked = false;
            if (userId != null && !userId.trim().isEmpty()) {
                isLiked = likeRepository.existsByPostIdAndUserId(postId, userId);
            }
            
            response.put("success", true);
            response.put("likeCount", post.getLikeCount());
            response.put("isLiked", isLiked);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "좋아요 정보 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
        
        return response;
    }
    
    /**
     * 게시글 삭제 시 관련 좋아요도 함께 삭제
     */
    public void deleteAllLikesByPostId(Long postId) {
        likeRepository.deleteByPostId(postId);
    }
} 