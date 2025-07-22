package com.justfeeling.service;

import com.justfeeling.dto.CreatePostRequest;
import com.justfeeling.dto.UpdatePostRequest;
import com.justfeeling.entity.Post;
import com.justfeeling.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeService likeService;

    @Autowired
    private EmotionClient emotionClient;  // 감정분석 클라이언트 주입

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Object> createPost(CreatePostRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // 사용자 입력 검증: emotion 필드는 더 이상 검증하지 않습니다
            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자 ID는 필수입니다.");
                return response;
            }
            if (request.getContentText() == null || request.getContentText().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "게시글 내용은 필수입니다.");
                return response;
            }

            // 감정분석 API 호출: 사용자 입력 대신 모델 추론 결과 사용
            String detectedEmotion = emotionClient.analyze(request.getContentText().trim());

            // 새로운 Post 엔티티 생성 및 저장
            Post newPost = new Post(
                request.getUserId().trim(),
                detectedEmotion,
                request.getContentText().trim(),
                request.getContentImage()
            );
            newPost.setLikeCount(0);
            newPost.setCreatedAt(LocalDateTime.now());

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
            if (!postRepository.existsById(postId)) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return response;
            }

            // 관련 좋아요 삭제 후 게시글 삭제
            likeService.deleteAllLikesByPostId(postId);
            postRepository.deleteById(postId);

            response.put("success", true);
            response.put("message", "포스트가 삭제되었습니다.");

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "포스트 삭제 중 오류가 발생했습니다: " + e.getMessage());
        }

        return response;
    }

    public Map<String, Object> updatePost(Long postId, UpdatePostRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Post> optionalPost = postRepository.findById(postId);
            if (optionalPost.isEmpty()) {
                response.put("success", false);
                response.put("message", "존재하지 않는 게시글입니다.");
                return response;
            }
            if (request.getContentText() == null || request.getContentText().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "게시글 내용은 필수입니다.");
                return response;
            }

            // 감정 재분석
            String newEmotion = emotionClient.analyze(request.getContentText().trim());

            // 게시글 업데이트 및 저장
            Post post = optionalPost.get();
            post.setContentText(request.getContentText().trim());
            post.setContentImage(request.getContentImage());
            post.setEmotion(newEmotion);

            Post updatedPost = postRepository.save(post);

            response.put("success", true);
            response.put("message", "포스트가 성공적으로 수정되었습니다.");
            response.put("data", updatedPost);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "포스트 수정 중 오류가 발생했습니다: " + e.getMessage());
        }

        return response;
    }
}
