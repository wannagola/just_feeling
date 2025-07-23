package com.justfeeling.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "emotionrecords")
public class EmotionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userId;  // 사용자 ID

    @Column(nullable = false)
    private String emotion;  // 감정

    @Column(nullable = false)
    private int score;  // 감정 점수

    // 기본 생성자
    public EmotionRecord() {}

    // 생성자
    public EmotionRecord(String userId, String emotion, int score) {
        this.userId = userId;
        this.emotion = emotion;
        this.score = score;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return this.userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getEmotion() {
        return emotion;
    }

    public void setEmotion(String emotion) {
        this.emotion = emotion;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    @Override
    public String toString() {
        return "EmotionRecord{" +
                "id=" + id +
                "userId='" + userId + '\'' +
                ", emotion='" + emotion + '\'' +
                ", score=" + score +
                '}';
    }
}
