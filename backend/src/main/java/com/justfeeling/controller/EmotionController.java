// EmotionController.java

package com.justfeeling.controller;

import com.justfeeling.dto.EmotionRecordDTO;
import com.justfeeling.entity.EmotionRecord;
import com.justfeeling.entity.User;
import com.justfeeling.service.EmotionRecordService;
import com.justfeeling.controller.UserController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/emotion")
public class EmotionController {

    @Autowired
    private EmotionRecordService emotionRecordService;

    @Autowired
    private UserController userController;

    // 사용자의 감정 기록 조회
    @GetMapping("/records/{userName}")
    public List<EmotionRecordDTO> getEmotionRecords(@PathVariable String userId) {
        List<EmotionRecord> records = emotionRecordService.findByUserId(userId);
        
        // EmotionRecord를 EmotionRecordDTO로 변환
        return records.stream()
            .map(record -> new EmotionRecordDTO(record.getUserId(), record.getEmotion(), record.getScore()))
            .collect(Collectors.toList());
    }

    // 사용자의 감정 기록 업데이트 (감정 점수 추가)
    @PostMapping("/update")
    public void updateEmotionRecord(@RequestBody EmotionRecordDTO emotionRecordDTO) {
        
        emotionRecordService.updateEmotionRecord(emotionRecordDTO.getUserId(), emotionRecordDTO.getEmotion(), emotionRecordDTO.getScore());
    }
}
