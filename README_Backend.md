# Just Feeling - Spring Boot 백엔드

## 실행 방법

### 1. Java 설치 확인
Java 17 이상이 설치되어 있는지 확인하세요:
```bash
java -version
```

### 2. 백엔드 서버 실행

#### Maven 사용:
```bash
cd just_feeling/backend
mvn spring-boot:run
```

#### 또는 컴파일 후 실행:
```bash
cd just_feeling/backend
mvn clean package
java -jar target/just-feeling-backend-0.0.1-SNAPSHOT.jar
```

### 3. 서버 확인
- 서버는 `http://localhost:8080`에서 실행됩니다
- H2 데이터베이스 콘솔: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:testdb`
  - Username: `sa`
  - Password: (비어있음)

## API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/logout` - 로그아웃

### 포스트
- `GET /api/posts` - 모든 포스트 조회
- `POST /api/posts` - 포스트 생성
- `GET /api/posts/user/{userId}` - 특정 사용자 포스트 조회

### 사용자
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/{userId}` - 특정 사용자 조회
- `GET /api/users/username/{userName}` - 사용자명으로 조회

### 채팅
- `GET /api/chat/rooms` - 채팅방 목록 조회
- `GET /api/chat/rooms/{chatRoomId}/messages` - 채팅 메시지 조회
- `POST /api/chat/messages` - 메시지 전송
- `POST /api/chat/rooms` - 채팅방 생성

## 주의사항

- 프론트엔드가 `http://localhost:5173`에서 실행되어야 CORS가 올바르게 작동합니다.
- 백엔드 서버가 먼저 실행된 후 프론트엔드를 실행하세요.
- 데이터베이스는 인메모리 H2를 사용하므로 서버 재시작 시 데이터가 초기화됩니다.

## 테스트용 계정
초기 데이터로 다음 계정들이 생성됩니다:
- seyop@example.com / password
- siu@example.com / password  
- dobum@example.com / password 