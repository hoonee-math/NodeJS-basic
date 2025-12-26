# 08. 에러 처리와 디버깅

Node.js에서 에러를 효과적으로 처리하고 디버깅하는 방법을 학습합니다. 동기/비동기 에러 처리, 커스텀 에러 클래스, 전역 에러 핸들러, 다양한 에러 처리 패턴, 그리고 디버깅 기법을 다룹니다.

## 학습 목표

- 동기/비동기 코드의 에러 처리 이해하기
- 커스텀 Error 클래스 만들기
- 전역 에러 핸들러 설정하기
- 실전 에러 처리 패턴 적용하기
- 효과적인 디버깅 기법 익히기
- 프로덕션 환경의 에러 관리 전략 수립하기

## 목차

1. **[01-sync-errors.js](#01-sync-errorsjs)** - 동기 코드의 에러 처리
2. **[02-async-errors.js](#02-async-errorsjs)** - 비동기 코드의 에러 처리
3. **[03-custom-errors.js](#03-custom-errorsjs)** - 커스텀 Error 클래스
4. **[04-global-handlers.js](#04-global-handlersjs)** - 전역 에러 핸들러
5. **[05-error-patterns.js](#05-error-patternsjs)** - 실전 에러 처리 패턴
6. **[06-debugging.js](#06-debuggingjs)** - 디버깅 기법과 도구
7. **[07-real-world-example.js](#07-real-world-examplejs)** - 실전: 사용자 관리 API

---

## 예제 파일 상세

### [01-sync-errors.js](01-sync-errors.js)

**주제**: 동기 코드의 에러 처리

**사용 메서드/속성**:
- `try-catch` - 에러를 잡아서 처리하는 구문
- `throw` - 에러를 발생시키는 키워드
- `finally` - 에러 여부와 상관없이 항상 실행되는 블록
- `Error` - 일반 에러 객체
- `TypeError` - 타입 관련 에러 (잘못된 타입 사용 시)
- `RangeError` - 범위 초과 에러 (유효하지 않은 값 범위)
- `ReferenceError` - 존재하지 않는 변수 참조 에러
- `SyntaxError` - 문법 에러
- `err.name` - 에러 타입 이름
- `err.message` - 에러 메시지
- `err.stack` - 스택 트레이스 (호출 경로)
- `instanceof` - 에러 타입 확인

**핵심 개념**:
- try 블록에서 에러가 발생하면 catch 블록으로 이동
- finally 블록은 에러 여부와 상관없이 항상 실행 (리소스 정리에 유용)
- 에러를 다시 던져서 상위 레벨로 전파 가능
- 리소스 정리는 finally 블록에서 수행

**활용**: 파일 처리, 데이터 검증, 리소스 정리 (파일 닫기, 연결 종료)

---

### [02-async-errors.js](02-async-errors.js)

**주제**: 비동기 코드의 에러 처리

**사용 메서드/속성**:
- **콜백 에러 처리**:
  - `err-first callback` - Node.js 표준 콜백 패턴 `(err, data) => {}`
  - 첫 번째 인자가 에러, 두 번째가 데이터
- **Promise 에러 처리**:
  - `.catch(err => {})` - Promise rejection 처리
  - `.finally(() => {})` - 완료 후 항상 실행
  - `Promise.all([...])` - 하나라도 실패하면 전체 실패
  - `Promise.allSettled([...])` - 모든 결과 확인 (성공/실패)
  - `Promise.race([...])` - 가장 먼저 완료된 것 반환
  - `Promise.any([...])` - 가장 먼저 성공한 것 반환
- **async/await 에러 처리**:
  - `try-catch` - async 함수에서 동기 코드처럼 사용
  - `await` - Promise를 기다림, 에러 시 throw

**핵심 개념**:
- 콜백: err가 null이면 성공, 있으면 실패
- Promise: .catch()로 rejection 처리, 체이닝 중 에러는 다음 .catch로 전파
- async/await: await가 있는 Promise만 try-catch로 처리 가능
- async 함수의 에러는 자동으로 Promise rejection으로 변환
- 타임아웃 패턴: Promise.race로 구현
- 재시도 패턴: for 루프와 try-catch로 구현

**활용**: 파일 I/O, HTTP 요청, 데이터베이스 쿼리, 외부 API 호출

---

### [03-custom-errors.js](03-custom-errors.js)

**주제**: 커스텀 Error 클래스 만들기

**사용 메서드/속성**:
- `class MyError extends Error` - Error 클래스 상속
- `super(message)` - 부모 클래스 생성자 호출 (필수)
- `this.name` - 에러 타입 이름 설정
- `this.code` - 에러 코드 (사용자 정의)
- `this.statusCode` - HTTP 상태 코드
- `this.details` - 추가 정보 객체
- `toJSON()` - 에러를 JSON으로 직렬화
- `Error.captureStackTrace(this, constructor)` - 스택 트레이스 최적화 (V8 엔진)
- `instanceof` - 에러 타입 확인

**에러 클래스 패턴**:
```javascript
class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CustomError';
    // 추가 속성...
  }
}
```

**계층적 에러 구조**:
```
Error
 ├─ ValidationError
 ├─ DatabaseError
 │   ├─ ConnectionError
 │   └─ QueryError
 └─ HttpError
     ├─ BadRequestError (400)
     ├─ UnauthorizedError (401)
     └─ NotFoundError (404)
```

**활용**: API 에러 응답, 비즈니스 로직 에러, 데이터베이스 에러, 유효성 검사

---

### [04-global-handlers.js](04-global-handlers.js)

**주제**: 전역 에러 핸들러와 프로세스 이벤트

**사용 메서드/속성**:
- **프로세스 이벤트**:
  - `process.on('uncaughtException', callback)` - 잡히지 않은 동기 에러
  - `process.on('unhandledRejection', callback)` - 처리되지 않은 Promise rejection
  - `process.on('warning', callback)` - Node.js 경고
  - `process.on('exit', callback)` - 프로세스 종료 직전 (동기 작업만)
  - `process.on('beforeExit', callback)` - 이벤트 루프가 비었을 때
- **프로세스 신호**:
  - `process.on('SIGINT', callback)` - Ctrl+C 인터럽트
  - `process.on('SIGTERM', callback)` - 종료 요청
  - `process.on('SIGHUP', callback)` - 터미널 연결 종료
- **기타**:
  - `process.exit(code)` - 프로세스 종료
  - `process.emitWarning(message, options)` - 커스텀 경고 발생

**핵심 개념**:

**uncaughtException**:
- try-catch로 잡히지 않은 에러
- 프로세스가 불안정한 상태
- 로그 저장 후 종료 권장 (복구 시도는 위험)

**unhandledRejection**:
- .catch()가 없는 Promise rejection
- Node.js 15+에서는 기본적으로 프로세스 종료
- 모든 Promise에 에러 처리 필수

**Graceful Shutdown** (우아한 종료):
1. 신호 수신 (SIGINT/SIGTERM)
2. 새 요청 거부
3. 진행 중인 작업 완료 대기
4. 리소스 정리 (DB 연결, 파일 등)
5. 프로세스 종료

**활용**: 서버 애플리케이션, 프로덕션 환경, 무중단 배포

---

### [05-error-patterns.js](05-error-patterns.js)

**주제**: 실전 에러 처리 패턴

**패턴**:

**1. 에러 래핑 패턴**:
- 저수준 에러를 고수준 에러로 변환
- 컨텍스트 정보 추가
- 일관된 에러 형식 제공

**2. Result 패턴** (Rust-style):
- 에러를 값으로 표현
- `Result.ok(value)` / `Result.err(error)`
- 명시적인 성공/실패 처리
- `unwrap()`, `unwrapOr(default)` 메서드

**3. Either 패턴** (함수형):
- Left (에러), Right (성공)
- `map()`, `fold()` 메서드로 체이닝
- 함수형 프로그래밍 스타일

**4. 재시도 패턴** (지수 백오프):
- 일시적 오류 대응
- 재시도 간격: baseDelay * 2^attempt
- 최대 재시도 횟수 설정

**5. Circuit Breaker 패턴**:
- 연쇄 장애 방지
- 상태: CLOSED (정상), OPEN (차단), HALF_OPEN (재시도)
- 실패 임계값 초과 시 차단

**6. Error Boundary 패턴**:
- 에러 격리
- Fallback 로직 제공
- 애플리케이션 전체 중단 방지

**7. 에러 집계 패턴**:
- 여러 에러 수집
- 폼 검증 등에 유용
- 모든 문제를 한 번에 보고

**8. Fail-Fast vs Fail-Safe**:
- Fail-Fast: 즉시 에러 발생, 명확한 피드백
- Fail-Safe: 안전한 기본값, 계속 실행

**활용**: API 호출 재시도, 마이크로서비스 통신, 폼 검증, 외부 서비스 연동

---

### [06-debugging.js](06-debugging.js)

**주제**: 디버깅 기법과 도구

**사용 메서드/속성**:

**console 메서드**:
- `console.log()` - 일반 로그
- `console.error()` - 에러 로그 (stderr 출력)
- `console.warn()` - 경고 로그
- `console.info()` - 정보 로그
- `console.trace()` - 호출 스택 출력
- `console.table(data)` - 테이블 형식 출력
- `console.time(label)` / `console.timeEnd(label)` - 성능 측정
- `console.assert(condition, message)` - 조건 검증
- `console.dir(obj, options)` - 객체 상세 출력

**util 모듈**:
- `util.inspect(obj, options)` - 객체 상세 출력
  - `depth` - 출력 깊이 (null은 무제한)
  - `colors` - 색상 적용
  - `showHidden` - 숨겨진 속성 표시

**debugger**:
- `debugger` - 중단점 설정 키워드

**프로세스 정보**:
- `process.memoryUsage()` - 메모리 사용량
  - `rss` - 전체 메모리 (Resident Set Size)
  - `heapUsed` - V8 힙 사용량
  - `heapTotal` - V8 힙 총량
  - `external` - C++ 객체 메모리
- `process.hrtime.bigint()` - 고정밀 타이머 (나노초)
- `process.uptime()` - 프로세스 실행 시간

**디버깅 명령어**:
```bash
node inspect 파일.js           # 내장 CLI 디버거
node --inspect 파일.js         # Chrome DevTools 연동
node --inspect-brk 파일.js     # 첫 줄에서 중단
```

**Chrome DevTools 사용**:
1. `node --inspect 파일.js` 실행
2. `chrome://inspect` 접속
3. Remote Target 연결
4. GUI로 디버깅

**활용**: 버그 수정, 성능 최적화, 메모리 누수 추적

---

### [07-real-world-example.js](07-real-world-example.js)

**주제**: 실전 - 사용자 관리 REST API 서버

**구현 내용**:
- RESTful API 서버 (GET, POST, PUT, DELETE)
- 커스텀 에러 클래스 계층 (ApiError, NotFoundError, ValidationError)
- 유효성 검사 및 에러 집계
- 요청 파싱 및 에러 처리
- 라우터 패턴
- 전역 에러 핸들러
- 우아한 종료 (graceful shutdown)
- 요청 로깅 및 성능 측정

**API 엔드포인트**:
```
GET    /users       - 모든 사용자 조회
GET    /users/:id   - 특정 사용자 조회
POST   /users       - 사용자 생성
PUT    /users/:id   - 사용자 업데이트
DELETE /users/:id   - 사용자 삭제
```

**에러 처리 전략**:
1. 예상된 에러 (ApiError): HTTP 상태 코드로 응답, 상세 정보 포함
2. 예상치 못한 에러: 500 Internal Server Error, 스택 트레이스 로깅
3. 전역 에러: uncaughtException/unhandledRejection 처리

**테스트 명령어**:
```bash
# 사용자 조회
curl http://localhost:3000/users

# 사용자 생성
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Charlie","email":"charlie@example.com","age":35}'

# 에러 테스트 (404)
curl http://localhost:3000/users/999

# 유효성 검사 에러 (400)
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid"}'
```

**활용**: REST API 서버, 마이크로서비스, 백엔드 애플리케이션

---

## 핵심 정리

### 에러 처리 기본

**동기 코드**:
```javascript
try {
  // 에러가 발생할 수 있는 코드
  throw new Error('에러 발생');
} catch (err) {
  // 에러 처리
  console.error(err.message);
} finally {
  // 항상 실행 (리소스 정리)
}
```

**비동기 코드** (async/await):
```javascript
async function fetchData() {
  try {
    const data = await someAsyncOperation();
    return data;
  } catch (err) {
    console.error('에러:', err);
    throw err;
  }
}
```

**Promise**:
```javascript
somePromise()
  .then(result => {
    // 성공 처리
  })
  .catch(err => {
    // 에러 처리
  })
  .finally(() => {
    // 항상 실행
  });
```

### 커스텀 Error 클래스

```javascript
class ApiError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.statusCode,
        message: this.message,
        details: this.details
      }
    };
  }
}

// 사용
throw new ApiError(404, '리소스를 찾을 수 없습니다');
```

### 전역 에러 핸들러

```javascript
// uncaughtException - 잡히지 않은 동기 에러
process.on('uncaughtException', (err) => {
  console.error('Fatal error:', err);
  process.exit(1);  // 프로세스 종료
});

// unhandledRejection - 처리되지 않은 Promise rejection
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  // 프로덕션에서는 종료 고려
});

// 우아한 종료
process.on('SIGINT', () => {
  console.log('Shutting down...');
  // 리소스 정리
  server.close(() => {
    process.exit(0);
  });
});
```

### 에러 처리 패턴

**재시도 (지수 백오프)**:
```javascript
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxRetries - 1) throw err;

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**Circuit Breaker**:
```javascript
class CircuitBreaker {
  constructor(threshold = 3, timeout = 5000) {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      throw new Error('Circuit breaker is OPEN');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }
}
```

---

## 디버깅 기법

### console 메서드

```javascript
// 기본 로깅
console.log('일반 로그');
console.error('에러 로그');
console.warn('경고 로그');

// 스택 트레이스
console.trace('호출 경로');

// 테이블 형식
console.table([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]);

// 성능 측정
console.time('작업');
// ... 작업 수행
console.timeEnd('작업');

// 조건 검증
console.assert(condition, '조건 실패');
```

### Node.js 디버거

```bash
# CLI 디버거
node inspect 파일.js

# Chrome DevTools
node --inspect 파일.js
# chrome://inspect 접속

# 첫 줄에서 중단
node --inspect-brk 파일.js
```

### VS Code 디버깅

**launch.json**:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Program",
      "program": "${file}",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

---

## Best Practices

### 1. 에러 처리

- ✅ 모든 Promise에 `.catch()` 또는 `try-catch` 추가
- ✅ 에러 타입에 따라 다르게 처리
- ✅ 의미 있는 에러 메시지 작성
- ✅ 에러 로깅 및 모니터링
- ❌ 에러를 무시하거나 빈 catch 블록 사용
- ❌ 너무 넓은 범위의 try-catch

### 2. 커스텀 에러

- ✅ 도메인별 에러 클래스 정의
- ✅ 계층적 에러 구조
- ✅ 유용한 추가 정보 포함 (code, statusCode, details)
- ✅ `toJSON()` 메서드로 직렬화 지원
- ❌ 너무 많은 에러 클래스 (복잡도 증가)

### 3. 전역 핸들러

- ✅ `uncaughtException` 발생 시 프로세스 종료
- ✅ `unhandledRejection` 리스너 등록
- ✅ 우아한 종료 (graceful shutdown) 구현
- ✅ SIGINT/SIGTERM 신호 처리
- ❌ `uncaughtException` 후 복구 시도

### 4. 디버깅

- ✅ 구조화된 로깅 (JSON)
- ✅ 환경변수로 디버그 모드 제어
- ✅ 외부 로깅 서비스 사용 (Winston, Bunyan)
- ✅ 에러 모니터링 툴 (Sentry, Datadog)
- ❌ 프로덕션에서 민감한 정보 로깅

---

## 프로덕션 체크리스트

### 에러 처리

- [ ] 모든 async 함수에 에러 처리
- [ ] 전역 에러 핸들러 등록
- [ ] 커스텀 에러 클래스 정의
- [ ] HTTP 상태 코드 적절히 사용
- [ ] 민감한 정보 숨김

### 로깅

- [ ] 구조화된 로깅 (JSON)
- [ ] 로그 레벨 설정 (debug, info, warn, error)
- [ ] 외부 로깅 시스템 연동
- [ ] Request ID 추적
- [ ] 성능 메트릭 수집

### 모니터링

- [ ] 에러 모니터링 툴 (Sentry)
- [ ] APM 도구 (New Relic, Datadog)
- [ ] 헬스 체크 엔드포인트
- [ ] 알림 시스템 구축
- [ ] 대시보드 구성

### 배포

- [ ] 프로세스 매니저 (PM2, systemd)
- [ ] 클러스터 모드
- [ ] 우아한 종료
- [ ] 자동 재시작
- [ ] 무중단 배포

---

## 참고 자료

- [Node.js Error Handling](https://nodejs.org/api/errors.html)
- [MDN Error](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Node.js Debugging Guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

## 다음 단계

- **09-npm-packages** - 외부 패키지 활용
- **10-mini-projects** - 실전 미니 프로젝트

---

## 실습 가이드

### 1. 기본 에러 처리 연습

```bash
cd node-basic/08-error-handling

# 동기 에러
node 01-sync-errors.js

# 비동기 에러
node 02-async-errors.js

# 커스텀 에러
node 03-custom-errors.js
```

### 2. 전역 핸들러 테스트

```bash
# 전역 에러 핸들러
node 04-global-handlers.js

# Ctrl+C로 종료 신호 테스트
```

### 3. 에러 패턴 적용

```bash
# 다양한 에러 처리 패턴
node 05-error-patterns.js
```

### 4. 디버깅 실습

```bash
# 디버깅 기법
node 06-debugging.js

# Chrome DevTools로 디버깅
node --inspect 06-debugging.js
# chrome://inspect 접속

# VS Code에서 F5로 디버깅
```

### 5. 실전 API 서버

```bash
# API 서버 실행
node 07-real-world-example.js

# 다른 터미널에서 테스트
curl http://localhost:3000/users
curl http://localhost:3000/users/1
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","age":25}'
```
