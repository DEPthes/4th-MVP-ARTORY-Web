# 🚀 ARTORY 웹 애플리케이션 배포 가이드

## 📋 배포 전 준비사항

### 1. 환경 변수 설정

다음 환경 변수들을 설정해야 합니다:

```bash
# Google OAuth 설정
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# API 서버 설정
VITE_API_BASE_URL=http://13.209.252.181:8080

# 리다이렉트 URI (도메인에 따라 변경)
VITE_GOOGLE_REDIRECT_URI=https://your-domain.vercel.app/auth/google/callback
```

### 2. Google OAuth 설정 업데이트

Google Cloud Console에서 승인된 리디렉션 URI에 프로덕션 도메인 추가:

- `https://your-domain.vercel.app/auth/google/callback`

---

## 🌟 추천 배포 방법: Vercel

### 장점

- React/Vite 프로젝트 최적화
- 자동 HTTPS, CDN, 무료 SSL
- GitHub 연동 자동 배포
- 환경 변수 관리 용이
- 무료 플랜으로 충분

### 배포 단계

#### 1. Vercel 계정 생성 및 연결

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login
```

#### 2. 프로젝트 배포

```bash
# 프로젝트 루트에서 실행
vercel

# 또는 GitHub 연동하여 자동 배포 설정
```

#### 3. 환경 변수 설정

Vercel 대시보드에서 환경 변수 추가:

- Settings > Environment Variables
- 위의 환경 변수들을 모두 추가

#### 4. 도메인 설정 (선택사항)

- Vercel 대시보드에서 커스텀 도메인 추가 가능

---

## 🔧 기타 배포 옵션

### 2. Netlify

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 빌드 및 배포
npm run build
netlify deploy --prod --dir=dist
```

### 3. AWS S3 + CloudFront

```bash
# 빌드
npm run build

# AWS CLI로 S3에 업로드
aws s3 sync dist/ s3://your-bucket-name --delete
```

### 4. GitHub Pages

```bash
# gh-pages 패키지 설치
npm install --save-dev gh-pages

# package.json에 스크립트 추가
"homepage": "https://username.github.io/repository-name",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# 배포
npm run deploy
```

---

## ⚙️ 배포 후 확인사항

### 1. 기능 테스트

- [ ] 로그인/로그아웃 기능
- [ ] API 통신 정상 동작
- [ ] 라우팅 정상 동작
- [ ] 반응형 디자인 확인

### 2. 성능 최적화

- [ ] Lighthouse 점수 확인
- [ ] 이미지 최적화
- [ ] 번들 크기 최적화

### 3. SEO 및 메타태그

- [ ] Open Graph 태그 설정
- [ ] 파비콘 설정
- [ ] 메타 디스크립션 설정

---

## 🔒 보안 고려사항

1. **환경 변수 관리**

   - 민감한 정보는 반드시 환경 변수로 관리
   - `.env` 파일은 절대 커밋하지 않기

2. **HTTPS 강제**

   - 프로덕션에서는 HTTPS 사용 필수
   - HTTP 요청을 HTTPS로 리다이렉트

3. **CORS 설정**
   - API 서버에서 적절한 CORS 정책 설정
   - 신뢰할 수 있는 도메인만 허용

---

## 📈 모니터링 및 분석

### 추천 도구

- **Vercel Analytics**: 기본 성능 분석
- **Google Analytics**: 사용자 행동 분석
- **Sentry**: 에러 모니터링
- **LogRocket**: 사용자 세션 녹화

### 설정 방법

```bash
# Sentry 설치 (에러 모니터링)
npm install @sentry/react @sentry/tracing

# Google Analytics 설치
npm install react-ga4
```

---

## 🚨 문제 해결

### 자주 발생하는 문제

1. **라우팅 404 에러**

   - SPA 라우팅을 위한 fallback 설정 필요
   - `vercel.json`에 rewrites 설정됨

2. **환경 변수 인식 안됨**

   - `VITE_` 접두사 확인
   - 배포 플랫폼에서 환경 변수 설정 확인

3. **API 통신 오류**

   - CORS 설정 확인
   - API 서버 상태 확인
   - 네트워크 연결 확인

4. **Google OAuth 오류**
   - 리다이렉트 URI 설정 확인
   - 클라이언트 ID 정확성 확인
   - 도메인 승인 상태 확인
