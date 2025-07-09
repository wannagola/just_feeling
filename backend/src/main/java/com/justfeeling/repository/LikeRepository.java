package com.justfeeling.repository;

import com.justfeeling.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    
    // 특정 게시글의 좋아요 수 조회
    long countByPostId(Long postId);
    
    // 특정 사용자가 특정 게시글에 좋아요를 눌렀는지 확인
    Optional<Like> findByPostIdAndUserId(Long postId, String userId);
    
    // 특정 사용자가 특정 게시글에 좋아요를 눌렀는지 확인 (boolean)
    boolean existsByPostIdAndUserId(Long postId, String userId);
    
    // 특정 게시글의 모든 좋아요 삭제 (게시글 삭제 시 사용)
    void deleteByPostId(Long postId);
    
    // 특정 사용자가 누른 좋아요를 특정 게시글에서 삭제
    void deleteByPostIdAndUserId(Long postId, String userId);
} 