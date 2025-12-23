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

#### 학습 로드맵 (node-basic/)

단계별 폴더 구조로 기초부터 실전까지 학습:

1. **01-basics/** - Node.js 기본 문법과 모듈 시스템
2. **02-async/** - 비동기 처리 (callback → promise → async/await)
3. **03-fs/** - 파일 시스템 다루기
4. **04-path-process/** - Path, Process, 환경변수
5. **05-http/** - HTTP 서버 만들기 (프레임워크 없이)
6. **06-events/** - EventEmitter와 이벤트 기반 프로그래밍
7. **07-streams/** - Stream 처리 (파일, 네트워크)
8. **08-error-handling/** - 에러 처리 패턴
9. **09-npm-packages/** - 외부 패키지 활용
10. **10-mini-projects/** - 실전 미니 프로젝트

각 폴더 안에는 `01-주제.js`, `02-주제.js` 형식으로 실행 가능한 예제 파일이 있습니다.

```bash
cd node-basic/01-basics
node 01-hello-world.js
```

---

### 2. Node + TS

Node + TS 는 새로운 런타임이 아니라,
Node.js 위에서 TypeScript를 사용하기 위한 개발 방식이다.

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

NestJS는 Node.js + TypeScript 기반의 서버 프레임워크로,
Controller / Service / Module 구조와 DI를 제공한다.

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