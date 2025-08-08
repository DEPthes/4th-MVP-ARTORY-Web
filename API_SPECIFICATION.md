# ARTORY API 명세서

## 인증 관련 API

### 1. 구글 로그인

**POST** `/api/auth/google`

**Request Body:**

```json
{
  "accessToken": "google_access_token_here"
}
```

**Response (성공):**

```json
{
  "accessToken": "jwt_access_token",
  "refreshToken": "jwt_refresh_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "사용자 이름",
    "picture": "https://profile_image_url"
  },
  "isNewUser": true
}
```

**Response (실패):**

```json
{
  "message": "인증에 실패했습니다."
}
```

### 2. 현재 사용자 정보 조회

**GET** `/api/auth/me`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Response:**

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "사용자 이름",
  "picture": "https://profile_image_url",
  "job": "artist"
}
```

### 3. 토큰 갱신

**POST** `/api/auth/refresh`

**Request Body:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "accessToken": "new_jwt_access_token"
}
```

### 4. 프로필 완료 (직업 설정)

**POST** `/api/auth/complete-profile`

**Headers:**

```
Authorization: Bearer {access_token}
```

**Request Body:**

```json
{
  "job": "artist"
}
```

**Response (성공):**

```json
{
  "success": true,
  "message": "프로필이 완료되었습니다."
}
```

**Response (실패):**

```json
{
  "success": false,
  "message": "프로필 설정에 실패했습니다."
}
```

## 구현 가이드

### 스프링 백엔드에서 구현해야 할 사항:

1. **Google OAuth 검증**

   - 프론트엔드에서 받은 Google access token을 Google API로 검증
   - 사용자 정보 추출 (이메일, 이름, 프로필 이미지 등)

2. **JWT 토큰 생성**

   - 검증된 Google 정보로 JWT access token과 refresh token 생성
   - 적절한 만료 시간 설정 (access: 1시간, refresh: 7일 등)

3. **사용자 데이터베이스 관리**

   - 최초 로그인 시 사용자 정보 저장
   - 기존 사용자 정보 업데이트
   - `isNewUser` 필드를 응답에 포함하여 최초 가입자인지 판단

4. **프로필 완료 API**

   - 사용자의 직업 정보를 저장하는 API 구현
   - 직업 정보가 없는 사용자는 프로필 완료 페이지로 리다이렉트

5. **보안 설정**
   - CORS 설정 (프론트엔드 도메인 허용)
   - JWT 토큰 검증 미들웨어

### 예상되는 스프링 의존성:

```xml
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt</artifactId>
    <version>0.9.1</version>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
```

### 환경 변수 설정:

```properties
# Google OAuth
google.client.id=your_google_client_id
google.client.secret=your_google_client_secret

# JWT
jwt.secret=your_jwt_secret_key
jwt.access-token-validity=3600
jwt.refresh-token-validity=604800
```

### 데이터베이스 스키마 예시:

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    picture VARCHAR(500),
    job VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
