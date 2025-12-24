# CommonJS vs ES Modules (ESM)

Node.js의 두 가지 모듈 시스템을 비교 정리합니다.

## 1. CommonJS란?

- Node.js가 처음부터 사용해온 **전통적인 모듈 시스템**
- 2009년에 만들어진 **Node.js 전용 규격**
- `require()`와 `module.exports` 사용
- **동기적(Synchronous)** 로딩
- 파일 확장자: `.js` (기본)

```javascript
// CommonJS
const fs = require('fs');
module.exports = { myFunc };
```

---

## 2. ES Modules (ESM)란?

- **ES6(ES2015)**에 추가된 **JavaScript 공식 표준**
- 브라우저와 Node.js **모두에서 사용 가능**
- `import`와 `export` 사용 ← **Vue, React에서 쓰는 그것!**
- **비동기적(Asynchronous)** 로딩 가능
- 파일 확장자: `.mjs` 또는 `package.json`에 `"type": "module"` 설정

```javascript
// ES Modules
import fs from 'fs';
export { myFunc };
```

---

## 3. 문법 비교

### 모듈 불러오기

```javascript
// CommonJS
const fs = require('fs');
const { readFile } = require('fs');
const myModule = require('./myModule');

// ES Modules
import fs from 'fs';
import { readFile } from 'fs';
import myModule from './myModule.js';  // 확장자 필수!
```

### 모듈 내보내기

```javascript
// CommonJS
module.exports = { func1, func2 };
module.exports = function() {};
exports.name = 'value';

// ES Modules
export { func1, func2 };
export default function() {};
export const name = 'value';
```

---

## 4. 주요 차이점

| 구분 | CommonJS | ES Modules |
|------|----------|------------|
| **키워드** | `require` / `module.exports` | `import` / `export` |
| **로딩 방식** | 동기 (Synchronous) | 비동기 가능 |
| **사용처** | Node.js 전용 | 브라우저 + Node.js |
| **표준** | Node.js 규격 | JavaScript 공식 표준 (ES6) |
| **확장자** | `.js` | `.mjs` 또는 설정 필요 |
| **this** | `exports` 객체 | `undefined` |
| **__dirname** | 사용 가능 ✅ | 사용 불가 ❌ |
| **Top-level await** | 불가능 ❌ | 가능 ✅ |
| **역사** | 2009년부터 | 2015년부터 |

---

## 5. Vue/React에서 보던 import/export

**Vue, React에서 사용하는 것이 바로 ES Modules입니다!**

```javascript
// Vue 컴포넌트
import { ref } from 'vue';
export default {
  setup() { ... }
}

// React 컴포넌트
import React from 'react';
export default function App() {
  return <div>Hello</div>;
}
```

브라우저에서는 **ES Modules가 표준**이에요. 그래서 프론트엔드 개발에서는 ESM을 사용합니다.

---

## 6. Node.js에서 ES Modules 사용하기

### 방법 1: 파일 확장자를 `.mjs`로 변경

```javascript
// app.mjs
import { readFile } from 'fs/promises';

const data = await readFile('./file.txt', 'utf-8');
console.log(data);
```

```bash
node app.mjs
```

### 방법 2: `package.json`에 `"type": "module"` 추가

```json
{
  "name": "my-app",
  "type": "module",    ← 이것 추가
  "version": "1.0.0"
}
```

이렇게 설정하면 `.js` 파일에서도 `import`/`export` 사용 가능

### 방법 3: `.cjs` 확장자 사용 (CommonJS 강제)

`"type": "module"` 설정 후에도 CommonJS를 쓰려면 `.cjs` 확장자 사용

```javascript
// config.cjs
module.exports = { port: 3000 };
```

---

## 7. 상호 호환성

### CommonJS에서 ES Modules 불러오기 ✅

```javascript
// CommonJS 파일 (app.js)
(async () => {
  const esmModule = await import('./esm-module.mjs');
  esmModule.default();
})();
```

동적 `import()`를 사용하면 가능 (Promise 반환)

### ES Modules에서 CommonJS 불러오기 ✅

```javascript
// ES Modules 파일 (app.mjs)
import cjsModule from './cjs-module.js';  // 자동으로 변환됨
```

Node.js가 자동으로 변환해줌

---

## 8. 언제 무엇을 사용할까?

### CommonJS를 사용하는 경우

- ✅ 기존 Node.js 프로젝트 (레거시 코드)
- ✅ npm 패키지 대부분이 여전히 CommonJS
- ✅ 빠른 프로토타이핑
- ✅ 동기적 로딩이 필요한 경우
- ✅ `__dirname`, `__filename` 사용이 필요할 때

### ES Modules를 사용하는 경우

- ✅ 새로운 프로젝트 시작
- ✅ 브라우저와 코드를 공유해야 할 때
- ✅ 최신 JavaScript 기능 활용
- ✅ TypeScript와 함께 사용
- ✅ Vue, React 등 프론트엔드 개발
- ✅ Top-level `await` 필요할 때

---

## 9. 실전 예제

### CommonJS 예제

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = { add, subtract };
```

```javascript
// app.js
const math = require('./math');
console.log(math.add(5, 3));  // 8
```

### ES Modules 예제

```javascript
// math.mjs
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```

```javascript
// app.mjs
import { add, subtract } from './math.mjs';
console.log(add(5, 3));  // 8
```

---

## 10. 현실적인 조언

### 📌 Node.js 학습 단계에서는 CommonJS부터

- 대부분의 튜토리얼과 예제가 CommonJS
- npm 패키지의 대다수가 여전히 CommonJS
- 기본부터 차근차근 익히기

### 📌 실무에서는 점차 ES Modules로 전환 중

- 최신 프로젝트는 ESM 권장
- TypeScript는 기본적으로 ESM 지향
- 브라우저 호환성 좋음

### 📌 두 방식 모두 알아두기

- **기존 코드 이해**: CommonJS
- **새 코드 작성**: ES Modules
- 상황에 맞게 선택할 수 있는 능력

---

## 요약 정리

| 항목 | CommonJS | ES Modules |
|------|----------|------------|
| **구문** | `require()` / `module.exports` | `import` / `export` |
| **태생** | Node.js 전용 규격 | JavaScript 표준 (ES6) |
| **사용처** | Node.js | 브라우저 + Node.js |
| **대표 사용** | 대부분의 npm 패키지 | Vue, React, 최신 프론트엔드 |
| **파일** | `.js` | `.mjs` 또는 설정 |
| **미래** | 레거시로 전환 중 | 표준으로 자리잡는 중 |

**핵심**:
- CommonJS = Node.js 전통 방식 (`require`)
- ES Modules = JavaScript 표준 (`import`) ← Vue/React가 이거!

---

## 참고 자료

- [Node.js Modules 공식 문서](https://nodejs.org/api/modules.html)
- [Node.js ECMAScript Modules](https://nodejs.org/api/esm.html)
- [MDN - JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
