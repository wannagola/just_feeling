package com.justfeeling.config;

import com.justfeeling.entity.User;
import com.justfeeling.entity.Post;
import com.justfeeling.entity.ChatRoom;
import com.justfeeling.entity.ChatMessage;
import com.justfeeling.repository.UserRepository;
import com.justfeeling.repository.PostRepository;
import com.justfeeling.repository.ChatRoomRepository;
import com.justfeeling.repository.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private ChatRoomRepository chatRoomRepository;
    
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // 사용자 데이터 초기화
        if (userRepository.count() == 0) {
            // 테스트용 사용자들 (패스워드 암호화 적용)
            String encodedPassword = passwordEncoder.encode("password");
            userRepository.save(new User("T7", "test1@example.com", encodedPassword));
            userRepository.save(new User("A1", "test2@example.com", encodedPassword));
            userRepository.save(new User("Z9", "test3@example.com", encodedPassword));
            userRepository.save(new User("seyopppii", "seyop@example.com", encodedPassword));
            userRepository.save(new User("siuuuuuuuu", "siu@example.com", encodedPassword));
            userRepository.save(new User("dobum_man", "dobum@example.com", encodedPassword));
        }
        
        // 포스트 데이터 초기화
        if (postRepository.count() == 0) {
            postRepository.save(new Post("seyopppii", "😊 기쁨", "오늘 드디어 꿈의 회사에 합격했어요! 🎉", "/images/happy.jpeg"));
            postRepository.save(new Post("siuuuuuuuu", "😢 슬픔", "오늘은 제가 좋아하는 축구선수가 하늘의 별이 된 날이에요. 너무 슬퍼요.", "/images/sad-photo.png"));
            postRepository.save(new Post("dobum_man", "🥶 Fear", "아 진짜 옷장위에 귀신.. 진짜 때리고 싶어.. 너무 무서웠어ㅠㅠ #무서운경험", "/images/ghost.png"));
        }
        
        // 채팅방 데이터 초기화
        if (chatRoomRepository.count() == 0) {
            chatRoomRepository.save(new ChatRoom("가족 단체 채팅", "[1, 2, 3, 4]", 1L));
            chatRoomRepository.save(new ChatRoom("친구와의 수다", "[2, 3, 4]", 2L));
            chatRoomRepository.save(new ChatRoom("프로젝트 팀", "[3, 4, 5, 6]", 3L));
            chatRoomRepository.save(new ChatRoom("스터디 모임", "[4, 5, 6, 7, 8]", 4L));
            chatRoomRepository.save(new ChatRoom("회사 공지", "[1, 2, 3, 4, 5, 6]", 1L));
        }
        
        // 채팅 메시지 데이터 초기화
        if (chatMessageRepository.count() == 0) {
            // 채팅방 1의 메시지들
            chatMessageRepository.save(new ChatMessage(1L, 1L, "안녕하세요, 가족 여러분!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"));
            chatMessageRepository.save(new ChatMessage(1L, 2L, "오늘 저녁은 뭐 먹을까요?"));
            chatMessageRepository.save(new ChatMessage(1L, 3L, "저는 치킨이 먹고 싶어요!"));
            
            // 채팅방 2의 메시지들
            chatMessageRepository.save(new ChatMessage(2L, 2L, "내일 모임 몇 시에 할까?"));
            chatMessageRepository.save(new ChatMessage(2L, 3L, "오후 7시 괜찮아."));
            chatMessageRepository.save(new ChatMessage(2L, 4L, "장소는 어디로 할까?"));
            chatMessageRepository.save(new ChatMessage(2L, 2L, "카페가 좋을 것 같아!"));
        }
    }
} 