package com.justfeeling.service;

import com.justfeeling.entity.EmotionRecord;
import com.justfeeling.entity.User;
import com.justfeeling.repository.EmotionRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmotionRecordService {

    @Autowired
    private EmotionRecordRepository emotionRecordRepository;

    // 사용자의 감정 기록을 조회하는 메서드
    public List<EmotionRecord> findByUserId(String userId) {
        return emotionRecordRepository.findByUserId(userId);
    }

    // 감정 기록을 업데이트하는 메서드
    @Transactional
    public void updateEmotionRecord(String userId, String emotion, int scoreChange) {
        // 사용자에 해당하는 감정 기록을 조회
        List<EmotionRecord> records = emotionRecordRepository.findByUserId(userId);

        // 해당 감정 기록이 존재하면 점수를 갱신
        for (EmotionRecord record : records) {
            if (record.getEmotion().equals(emotion)) {
                record.setScore(record.getScore() + scoreChange);
                emotionRecordRepository.save(record);
                return;
            }
        }

        // 기록이 없으면 새로운 감정 기록을 추가
        EmotionRecord newRecord = new EmotionRecord(userId, emotion, scoreChange);
        emotionRecordRepository.save(newRecord);
    }
}
