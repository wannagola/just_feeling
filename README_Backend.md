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
 - 'http://localhost:8080/swagger-ui.html' 에서 API 명세를 확인하세용~