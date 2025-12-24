# Node.js FAQ - 자주 묻는 질문과 흔한 오해

## 기본 개념

### Q: Node.js는 프레임워크인가요?
**A: 아니요, 런타임 환경입니다.**

- Node.js는 JavaScript **실행 환경**(Runtime Environment)
- Express, NestJS 등이 Node.js 위에서 동작하는 프레임워크

### Q: JavaScript와 Node.js의 차이는?
**A: JavaScript는 언어, Node.js는 실행 환경입니다.**

- **JavaScript**: 프로그래밍 언어 자체
- **Node.js**: JavaScript를 서버/OS 환경에서 실행할 수 있게 해주는 플랫폼
- 비유: Java(언어) vs JVM(실행 환경)

### Q: 브라우저 JavaScript와 Node.js의 차이점은?
**A: 실행 환경이 다르므로 사용 가능한 API가 다릅니다.**

| 구분 | 브라우저 JavaScript | Node.js |
|------|-------------------|---------|
| 실행 환경 | 웹 브라우저 | 운영체제 |
| 전역 객체 | `window` | `global` |
| 주요 API | DOM, BOM, Fetch API | fs, http, path, process |
| 용도 | 웹 페이지 인터랙션 | 서버, CLI, 스크립트 |

**공통점**: 둘 다 JavaScript 언어를 사용하고, V8 엔진(Chrome, Node.js)을 쓸 수 있음

```javascript
// 브라우저에서만 동작
document.getElementById('app');
window.location.href;

// Node.js에서만 동작
const fs = require('fs');
process.env.PORT;
```

---

## 사용 시기

### Q: Node.js는 언제 사용하나요?
**A: I/O 작업이 많고 동시 연결이 많은 경우에 적합합니다.**

**적합한 경우:**
- REST API 서버
- 실시간 애플리케이션 (채팅, 알림)
- 마이크로서비스
- CLI 도구
- 빌드 도구 (Webpack, Vite 등)
- 크롤러, 데이터 수집

**부적합한 경우:**
- CPU 집약적인 작업 (이미지/비디오 처리, 머신러닝)
- 복잡한 계산이 많은 경우

### Q: Node.js는 Single Thread인데 어떻게 많은 요청을 처리하나요?
**A: Non-blocking I/O와 Event Loop 덕분입니다.**

```javascript
// Blocking (동기)
const data = fs.readFileSync('file.txt'); // 파일을 읽을 때까지 대기
console.log(data);

// Non-blocking (비동기)
fs.readFile('file.txt', (err, data) => {
  console.log(data); // 파일을 읽는 동안 다른 작업 가능
});
```

- **Single Thread**: JavaScript 코드는 하나의 스레드에서 실행
- **Event Loop**: I/O 작업은 백그라운드에서 처리하고, 완료되면 콜백 실행
- **결과**: 하나의 요청이 I/O 대기 중일 때 다른 요청 처리 가능

---

## 흔한 오해와 진실

### ❌ 오해 1: "Node.js는 새로운 프로그래밍 언어다"
✅ **진실**: Node.js는 JavaScript를 실행하는 환경일 뿐, 언어 자체는 JavaScript입니다.

### ❌ 오해 2: "Node.js는 서버 전용이다"
✅ **진실**: CLI 도구, 빌드 스크립트, 데스크톱 앱(Electron) 등 다양하게 사용됩니다.

### ❌ 오해 3: "Single Thread라서 느리다"
✅ **진실**: I/O 작업에서는 오히려 빠릅니다. CPU 집약적 작업에는 부적합할 뿐입니다.

### ❌ 오해 4: "Node.js = Express"
✅ **진실**: Express는 Node.js 위에서 동작하는 웹 프레임워크 중 하나일 뿐입니다.

```javascript
// Node.js 내장 http 모듈만으로도 서버 가능
const http = require('http');
http.createServer((req, res) => {
  res.end('Hello without Express!');
}).listen(3000);
```

### ❌ 오해 5: "비동기 = 빠르다"
✅ **진실**: 비동기는 **동시성**을 위한 것이지, **속도**를 위한 것이 아닙니다.

---

## 기술적 질문

### Q: V8 엔진이 뭔가요?
**A: JavaScript 코드를 기계어로 변환해서 실행하는 엔진입니다.**

- Google이 개발한 오픈소스 JavaScript 엔진
- Chrome 브라우저와 Node.js에서 사용
- JavaScript 코드를 직접 기계어로 컴파일 (JIT 컴파일)

### Q: npm은 뭔가요?
**A: Node Package Manager, Node.js의 패키지 관리 도구입니다.**

- Node.js 설치 시 함께 설치됨
- 외부 라이브러리를 쉽게 설치/관리
- 세계 최대 규모의 오픈소스 생태계

```bash
npm install express    # 패키지 설치
npm init              # package.json 생성
npm run start         # 스크립트 실행
```

### Q: CommonJS와 ES Modules의 차이는?
**A: Node.js의 두 가지 모듈 시스템입니다.**

```javascript
// CommonJS (전통적인 방식)
const express = require('express');
module.exports = { app };

// ES Modules (최신 방식)
import express from 'express';
export { app };
```

- **CommonJS**: Node.js 기본, 동기적 로딩
- **ES Modules**: 표준, 브라우저와 호환, 비동기 로딩 가능
- `.mjs` 확장자 또는 `package.json`에 `"type": "module"` 설정 필요

---

## 버전 관리

### Q: LTS 버전이 뭔가요?
**A: Long Term Support, 장기 지원 버전입니다.**

- **LTS**: 안정성 중시, 프로덕션 환경 권장 (짝수 버전: 18, 20, 22...)
- **Current**: 최신 기능, 실험적 기능 포함

### Q: Node.js 버전 관리는 어떻게 하나요?
**A: nvm(Node Version Manager)을 사용하세요.**

```bash
# nvm으로 버전 관리
nvm install 20        # Node.js 20 설치
nvm use 20           # 버전 전환
nvm list             # 설치된 버전 목록
```

---

## 참고 자료

- [Node.js 공식 FAQ](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
- [Node.js Event Loop 설명](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)
- [브라우저 vs Node.js](https://nodejs.org/en/learn/getting-started/differences-between-nodejs-and-the-browser)
