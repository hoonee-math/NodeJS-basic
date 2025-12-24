# Node.js 기초부터 실전까지

바닐라 Node.js를 단계별로 학습하는 프로젝트입니다. 프레임워크 없이 순수 Node.js의 핵심 개념을 익힙니다.

## 학습 방법

실행가능한 예제 파일을 확인해 볼 수 있습니다.

```bash
cd 01-topic
node 01-subTopic.js
# ...
```

## 학습 로드맵

### 01-basics (Node.js 기초)
**목표**: Node.js의 기본 동작 원리와 모듈 시스템 이해

- Hello World와 Node.js 실행 환경
- CommonJS 모듈 시스템 (`require`, `module.exports`)
- 내장 모듈 vs 외부 모듈
- `package.json`의 역할

**핵심 개념**: 모듈 시스템, 런타임 환경

---

### 02-async (비동기 처리)
**목표**: JavaScript/Node.js의 비동기 처리 패턴 완벽 이해

- Callback 함수와 Callback Hell
- Promise의 등장 배경과 사용법
- Promise 체이닝과 에러 처리
- async/await 문법
- 동시성 처리 (Promise.all, Promise.race)

**핵심 개념**: Event Loop, Non-blocking I/O, 비동기 제어 흐름

---

### 03-fs (파일 시스템)
**목표**: 파일과 디렉토리 다루기

- 파일 읽기 (동기 vs 비동기)
- 파일 쓰기, 수정, 삭제
- 디렉토리 생성 및 탐색
- `fs.promises` API 사용
- 파일 메타데이터 (stats)

**핵심 개념**: File I/O, Buffer, 동기/비동기 차이

---

### 04-path-process (경로와 프로세스)
**목표**: 경로 처리와 프로세스 정보 다루기

- `path` 모듈 (join, resolve, dirname, basename 등)
- `process.env` - 환경 변수
- `process.argv` - 커맨드라인 인자
- `process.cwd()` - 현재 작업 디렉토리
- `__dirname`, `__filename`

**핵심 개념**: 플랫폼 독립적 경로 처리, 환경 설정

---

### 05-http (HTTP 서버)
**목표**: 프레임워크 없이 HTTP 서버 만들기

- `http.createServer()` 기본
- Request/Response 객체
- 라우팅 직접 구현
- 정적 파일 서빙
- REST API 기초

**핵심 개념**: HTTP 프로토콜, 서버-클라이언트 통신

---

### 06-events (이벤트)
**목표**: 이벤트 기반 프로그래밍 패턴 이해

- `EventEmitter` 클래스
- `on()`, `emit()`, `once()`, `off()`
- 커스텀 이벤트 만들기
- 이벤트 기반 아키텍처 설계

**핵심 개념**: Pub/Sub 패턴, 이벤트 드리븐

---

### 07-streams (스트림)
**목표**: 대용량 데이터를 효율적으로 처리하기

- Readable Stream
- Writable Stream
- Transform Stream
- 파이프라인 (pipe)
- 스트림을 사용한 대용량 파일 처리

**핵심 개념**: 메모리 효율성, 백프레셔(backpressure)

---

### 08-error-handling (에러 처리)
**목표**: 안정적인 애플리케이션을 위한 에러 처리

- try-catch와 동기 에러
- Promise rejection 처리
- async/await의 에러 처리
- 전역 에러 핸들러
- 커스텀 에러 클래스

**핵심 개념**: 에러 전파, 복구 전략

---

### 09-npm-packages (외부 패키지)
**목표**: npm 생태계 활용하기

- `npm install` 사용법
- 인기 있는 유틸리티 라이브러리 (lodash, axios, dotenv 등)
- `package.json` 관리
- devDependencies vs dependencies

**핵심 개념**: 패키지 관리, 의존성

---

### 10-mini-projects (실전 프로젝트)
**목표**: 지금까지 배운 내용을 종합해서 실전 프로젝트 만들기

프로젝트 예시:
- CLI 도구 (파일 관리, 로그 분석 등)
- 간단한 웹 크롤러
- REST API 서버
- 파일 업로드/다운로드 서버
- 실시간 로그 모니터링

**핵심 개념**: 통합, 실전 응용

---

## 참고 자료
- [Node.js 공식 문서](https://nodejs.org/docs/)
- [Node.js 공식 문서 최신 버전](https://nodejs.org/docs/latest/api/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)
- [Node.js Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
