# Node.js 핵심 개념

Node.js를 이해하는 데 필요한 핵심 개념을 정리합니다.

## Node.js란?

> **Node.js는 Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임 환경입니다.**

### 핵심 정의

- **Runtime Environment**: JavaScript를 브라우저 밖에서 실행할 수 있게 해주는 플랫폼
- **V8 Engine**: Google Chrome에서 사용하는 JavaScript 엔진 (C++로 작성)
- **Event-driven, Non-blocking I/O**: 비동기 이벤트 기반 아키텍처

```
┌─────────────────────────┐
│   JavaScript Code       │
├─────────────────────────┤
│   Node.js APIs          │  ← fs, http, path 등
│   (libuv + bindings)    │
├─────────────────────────┤
│   V8 Engine             │  ← JavaScript 실행
├─────────────────────────┤
│   Operating System      │  ← Windows, Linux, macOS
└─────────────────────────┘
```

**참고**: [Node.js 소개](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)

---

## V8 JavaScript 엔진

Google이 개발한 고성능 JavaScript 엔진으로, Node.js의 핵심입니다.

**주요 특징:**
- **JIT 컴파일**: JavaScript → 기계어 직접 컴파일 (인터프리터 아님)
- **최적화**: 자주 실행되는 코드를 추가 최적화
- **가비지 컬렉션**: 자동 메모리 관리

```javascript
// 이 코드를 V8이 기계어로 변환해서 실행
function add(a, b) {
  return a + b;
}
```

**참고**: [V8 공식 사이트](https://v8.dev/)

---

## Event Loop

Node.js의 비동기 처리를 가능하게 하는 핵심 메커니즘입니다.

```
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  I/O 콜백
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  내부용
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  I/O 이벤트 대기
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  소켓 종료 등
   └───────────────────────────┘
```

**동작 방식:**
1. JavaScript 코드 실행 (Call Stack)
2. 비동기 작업은 백그라운드로 위임 (libuv)
3. 작업 완료 시 콜백을 큐에 추가
4. Event Loop가 큐에서 콜백을 꺼내 실행

```javascript
console.log('1: 시작');

setTimeout(() => {
  console.log('2: Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('3: Promise');
});

console.log('4: 끝');

// 출력 순서: 1 → 4 → 3 → 2
// (동기 코드 → Microtask(Promise) → Macrotask(setTimeout))
```

**참고**: [Node.js Event Loop 공식 가이드](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

---

## Non-blocking I/O

I/O 작업(파일, 네트워크)이 완료될 때까지 기다리지 않고 다른 작업을 계속 처리합니다.

### Blocking vs Non-blocking

```javascript
// ❌ Blocking (동기)
const fs = require('fs');
const data = fs.readFileSync('file.txt'); // 파일 읽기 완료까지 대기
console.log(data);
console.log('다음 작업'); // 위 작업이 끝나야 실행

// ✅ Non-blocking (비동기)
fs.readFile('file.txt', (err, data) => {
  console.log(data); // 파일 읽기 완료 후 실행
});
console.log('다음 작업'); // 즉시 실행!
```

**장점:**
- 하나의 I/O 작업이 다른 작업을 차단하지 않음
- 동시에 수천 개의 요청 처리 가능
- 리소스 효율적

**참고**: [Blocking vs Non-blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking)

---

## 브라우저 vs Node.js

같은 JavaScript 언어를 사용하지만 실행 환경이 다릅니다.

| 특성 | 브라우저 | Node.js |
|------|---------|---------|
| **목적** | 웹 페이지 인터랙션 | 서버/시스템 프로그래밍 |
| **전역 객체** | `window` | `global`, `globalThis` |
| **모듈 시스템** | ES Modules (import/export) | CommonJS (require) + ES Modules |
| **주요 API** | DOM, BOM, Fetch | fs, http, path, process |

### 브라우저에만 있는 것
```javascript
window, document, DOM, localStorage,
fetch (최근 Node.js에도 추가됨),
alert, prompt, confirm
```

### Node.js에만 있는 것
```javascript
process, Buffer, __dirname, __filename,
fs, http, path, os, crypto,
require, module, exports
```

### 공통으로 있는 것
```javascript
console, setTimeout, setInterval,
Promise, async/await,
Array, Object, String 등 기본 타입
```

**참고**: [Node.js와 브라우저의 차이](https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser)

---

## 모듈 시스템

코드를 재사용 가능한 단위로 분리하고 관리합니다.

### CommonJS (전통적)

```javascript
// math.js
function add(a, b) {
  return a + b;
}

module.exports = { add };

// app.js
const math = require('./math');
console.log(math.add(2, 3)); // 5
```

### ES Modules (최신)

```javascript
// math.mjs (또는 package.json에 "type": "module")
export function add(a, b) {
  return a + b;
}

// app.mjs
import { add } from './math.mjs';
console.log(add(2, 3)); // 5
```

### 내장 모듈 vs 외부 모듈

```javascript
// 내장 모듈 (Node.js에 기본 포함)
const fs = require('fs');
const path = require('path');
const http = require('http');

// 외부 모듈 (npm install 필요)
const express = require('express');
const axios = require('axios');

// 내가 만든 모듈
const myModule = require('./myModule');
```

**참고**: [Node.js 모듈 시스템](https://nodejs.org/api/modules.html)

---

## libuv

Node.js의 비동기 I/O를 실제로 처리하는 C 라이브러리입니다.

**역할:**
- Event Loop 구현
- 파일 시스템 작업
- 네트워크 작업
- Thread Pool 관리 (CPU 집약적 작업용)

```
JavaScript 코드
      ↓
   V8 Engine
      ↓
  Node.js Bindings
      ↓
    libuv  ← 실제 I/O 처리
      ↓
Operating System
```

**참고**: [libuv 공식 문서](http://docs.libuv.org/)

---

## 주요 내장 모듈

Node.js가 기본으로 제공하는 핵심 모듈들입니다.

| 모듈 | 용도 | 예시 |
|------|------|------|
| `fs` | 파일 시스템 | `fs.readFile()`, `fs.writeFile()` |
| `http` / `https` | HTTP 서버/클라이언트 | `http.createServer()` |
| `path` | 경로 처리 | `path.join()`, `path.resolve()` |
| `os` | 운영체제 정보 | `os.platform()`, `os.cpus()` |
| `process` | 프로세스 정보 | `process.env`, `process.argv` |
| `events` | 이벤트 | `EventEmitter` |
| `stream` | 스트림 처리 | `Readable`, `Writable` |
| `crypto` | 암호화 | `crypto.createHash()` |
| `url` | URL 파싱 | `url.parse()` |
| `buffer` | 바이너리 데이터 | `Buffer.from()` |

```javascript
// 예시
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log(os.platform()); // 'win32', 'linux', 'darwin'
console.log(path.join(__dirname, 'file.txt'));
```

**참고**: [Node.js API 문서](https://nodejs.org/docs/latest/api/)

---

## npm (Node Package Manager)

Node.js의 패키지 생태계를 관리하는 도구입니다.

### 기본 명령어

```bash
npm init                 # package.json 생성
npm install express      # 패키지 설치
npm install -D jest      # 개발 의존성 설치
npm install              # package.json의 모든 의존성 설치
npm run start            # scripts 실행
npm uninstall express    # 패키지 제거
```

### package.json

프로젝트의 메타데이터와 의존성을 정의합니다.

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

**참고**: [npm 공식 문서](https://docs.npmjs.com/)

---

## 환경 변수 (Environment Variables)

실행 환경에 따라 다른 설정을 사용할 수 있습니다.

```javascript
// process.env로 접근
const port = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

console.log(process.env.NODE_ENV); // 'development', 'production' 등
```

### .env 파일 사용 (dotenv 패키지)

```bash
# .env
PORT=3000
DATABASE_URL=mongodb://localhost/mydb
API_KEY=secret123
```

```javascript
// app.js
require('dotenv').config();

console.log(process.env.PORT); // 3000
console.log(process.env.API_KEY); // secret123
```

**참고**: [Process 환경 변수](https://nodejs.org/api/process.html#processenv)

---

## 추가 학습 자료

### 공식 문서
- [Node.js 공식 문서](https://nodejs.org/docs/)
- [Node.js Learning Center](https://nodejs.org/en/learn)
- [Node.js API 레퍼런스](https://nodejs.org/docs/latest/api/)

### 핵심 가이드
- [Event Loop 이해하기](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [Blocking vs Non-blocking](https://nodejs.org/en/learn/asynchronous-work/overview-of-blocking-vs-non-blocking)
- [모듈 시스템](https://nodejs.org/api/modules.html)

### 외부 자료
- [V8 Engine](https://v8.dev/)
- [libuv 문서](http://docs.libuv.org/)
- [npm 문서](https://docs.npmjs.com/)
