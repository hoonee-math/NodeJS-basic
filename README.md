# NodeJS

## How and When

### 1. 기본 Node.js

#### NodeJS는 언제 쓰이나

- 서버 실행 환경
- API 서버
- 스크립트, 배치, 크롤러
- Express, Fastify 같은 서버 프레임워크의 기반

#### 시작 명령어

```bash
# npm 초기화
npm init -y
```

---

### 2. Node + TS

#### 'Node + TS' 는 언제 쓰이나

- 대규모 프로젝트
- 협업
- 타입 안정성
- NestJS, React, Vue, 백엔드 거의 필수

#### 시작 명령어

```bash
# npm 초기화
npm init -y
# 타입스크립트 설치
npm install -D typescript ts-node @types/node
# ts 설정 파일 생성
npx tsc --init
# 실행
npx ts-node src/index.ts
```

---

### 3. NestJS

#### NestJS는 언제 쓰이나

- REST API 서버
- 인증 서버
- 대규모 백엔드
- DDD, 모듈 구조, 테스트 중요할 때

#### 시작 명령어

```bash
# Nest CLI 설치
npm install -g @nestjs/cli
# 프로젝트 생성
nest new nest-basic
# 실행
cd nest-basic
npm run start:dev
```