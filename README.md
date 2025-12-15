# Gesturenews - Deployment and Naver API setup

이 저장소는 로컬 및 Render에 배포 가능한 Express 서버(`api/server.js`)와 정적 프론트엔드를 포함합니다. 네이버 Open API는 서버 사이드에서 프록시 요청으로 처리되어 클라이언트에 비밀키가 노출되지 않습니다.

## 필수 환경변수

Render 또는 로컬에서 다음 환경변수를 설정하세요:

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `PORT` (선택, 기본값: 3000)

로컬 개발 시 `.env.example` 파일을 복사하여 `.env`로 만들고 값을 채우세요.

## Render 배포 시 환경변수 설정 (간단 가이드)

1. Render에 로그인하고 서비스(웹 서비스)를 선택합니다.
2. `Environment` → `Environment Variables` 또는 `Settings` 섹션으로 이동합니다.
3. `NAVER_CLIENT_ID`와 `NAVER_CLIENT_SECRET`을 추가하고 값을 입력합니다.
4. 변경 후 배포를 재시작합니다.

참고: 현재 `api/server.js`는 환경변수가 누락된 경우에도 서버는 시작되지만, `/api/news`와 `/api/blog`는 503을 반환합니다. 배포 후 `Settings`에서 환경변수를 추가한 뒤 재배포하면 API가 정상 동작합니다.

## 테스트

배포가 완료되면 다음을 통해 서버와 API를 확인하세요 (예: `https://your-render-url`):

- 헬스체크: `GET /api/health`

  ```bash
  curl https://your-render-url/api/health
  ```

- 네이버 자격증명 확인: `GET /api/verify`

  ```bash
  curl "https://your-render-url/api/verify"
  ```

- 뉴스 검색: `GET /api/news?query=테스트`

  ```bash
  curl "https://your-render-url/api/news?query=테스트"
  ```

- 블로그 검색: `GET /api/blog?query=테스트`
  ```bash
  curl "https://your-render-url/api/blog?query=테스트"
  ```

응답으로 503이 나온다면 환경변수가 설정되지 않은 상태입니다. Render 대시보드에서 환경변수를 설정하고 서비스를 재시작하세요. 배포 후 문제가 있다면 Render의 `Logs` 탭에서 에러 메시지를 확인해 주세요.

## 로컬 실행

```bash
cp .env.example .env
# .env 파일에 NAVER_KEYS 추가
npm install
npm start
# 브라우저 열기: http://localhost:3000
```

문제가 있거나 배포 설정을 제가 대신 확인/수정하길 원하시면 알려주세요.
