package com.justfeeling.dto;


public class EmotionRecordDTO {

    private String userId;  // 사용자 ID
    private String emotion;  // 감정
    private int score;  // 감정 점수

    // 기본 생성자
    public EmotionRecordDTO() {}

    // 생성자
    public EmotionRecordDTO(String userId, String emotion, int score) {
        this.userId = userId;
        this.emotion = emotion;
        this.score = score;
    }

    // Getters and setters
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
        return "EmotionRecordDTO{" +
                "userId=" + userId +
                ", emotion='" + emotion + '\'' +
                ", score=" + score +
                '}';
    }
}
