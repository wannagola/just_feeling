package com.justfeeling.repository;

import com.justfeeling.entity.EmotionRecord;
import com.justfeeling.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmotionRecordRepository extends JpaRepository<EmotionRecord, Long> {
    
    // 사용자에 해당하는 감정 기록 조회
    List<EmotionRecord> findByUserId(String userId);
}
