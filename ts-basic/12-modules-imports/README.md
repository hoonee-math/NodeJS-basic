# 12. 모듈과 Import (Modules & Imports)

TypeScript의 **모듈 시스템**을 완전히 이해합니다. ES6 모듈, CommonJS, 그리고 두 시스템 간의 상호 운용을 타입 안전하게 다루는 방법을 배웁니다.

## 학습 목표

- **ES6 모듈 (import/export)** 타입
- **CommonJS (require/module.exports)** 타입
- **ESM ↔ CJS 상호 운용**
- **module, moduleResolution** 설정 이해
- **타입 선언 파일** (.d.ts) 작성

## 목차

### ES6 모듈
- [01-esm-basics.ts](#01-esm-basicsts) - import/export 기본
- [02-esm-types.ts](#02-esm-typests) - import type, export type
- [03-namespace-imports.ts](#03-namespace-importsts) - import * as

### CommonJS
- [04-commonjs-types.ts](#04-commonjs-typests) - require/module.exports 타입
- [05-esm-cjs-interop.ts](#05-esm-cjs-interopt) - ESM ↔ CJS 상호 운용

### 타입 선언
- [06-declaration-files.ts](#06-declaration-filests) - .d.ts 파일 작성
- [07-ambient-declarations.ts](#07-ambient-declarationsts) - declare 키워드
- [08-module-augmentation.ts](#08-module-augmentationt) - 모듈 확장

### 실전
- [09-practical-examples.ts](#09-practical-examplests) - 실전 모듈 패턴

## 예제 파일 개요

### 01-esm-basics.ts
**import/export 기본**

- named export, default export
- named import, default import
- export { ... }, import { ... }
- re-export (export { ... } from)
- import side-effects만
- export * from
- 타입과 값 동시 export

### 02-esm-types.ts
**import type, export type**

- import type (타입만 import)
- export type (타입만 export)
- type과 값 구분
- isolatedModules 설정
- 컴파일 후 제거되는 import
- verbatimModuleSyntax 옵션

### 03-namespace-imports.ts
**import * as**

- import * as namespace
- 네임스페이스 타입
- default export와 함께 사용
- 타입 네임스페이스
- re-export with namespace

### 04-commonjs-types.ts
**require/module.exports 타입**

- require 타입
- module.exports 타입
- exports vs module.exports
- @types/node 의존성
- tsconfig module: "commonjs"
- require한 모듈 타입 추론

### 05-esm-cjs-interop.ts
**ESM ↔ CJS 상호 운용**

- esModuleInterop 옵션
- allowSyntheticDefaultImports 옵션
- default import from CJS
- import * as vs import default
- __esModule 플래그
- 실전 호환성 패턴

### 06-declaration-files.ts
**.d.ts 파일 작성**

- .d.ts 파일 구조
- declare module
- declare global
- 타입 선언과 구현 분리
- .d.ts 자동 생성 (declaration: true)
- Triple-Slash Directives

### 07-ambient-declarations.ts
**declare 키워드**

- declare var, declare const
- declare function
- declare class
- declare namespace
- declare module (외부 라이브러리)
- global 타입 확장

### 08-module-augmentation.ts
**모듈 확장 (Module Augmentation)**

- declare module '...' 확장
- 외부 라이브러리 타입 확장
- Express Request 확장 예시
- 글로벌 타입 확장
- 타입 안전하게 확장

### 09-practical-examples.ts
**실전 모듈 패턴**

- 타입 안전한 barrel exports
- Monorepo 모듈 구조
- 라이브러리 타입 작성
- package.json exports 필드
- 타입 패키지 배포
- 모듈 해석 전략

## 핵심 개념 요약

### ES6 모듈 vs CommonJS

| 구분 | ES6 모듈 (ESM) | CommonJS (CJS) |
|------|----------------|----------------|
| **문법** | `import/export` | `require/module.exports` |
| **정적/동적** | 정적 (컴파일 타임) | 동적 (런타임) |
| **Tree Shaking** | ✅ 가능 | ❌ 어려움 |
| **Top-Level await** | ✅ 가능 | ❌ 불가능 |
| **브라우저** | ✅ 지원 | ❌ 번들러 필요 |
| **Node.js** | ✅ 지원 (.mjs, "type": "module") | ✅ 기본 |
| **tsconfig module** | `esnext`, `nodenext` | `commonjs` |

### import 타입

| 문법 | 설명 | 사용 |
|------|------|------|
| `import { foo } from './mod'` | named import | 값, 타입 모두 |
| `import type { Foo } from './mod'` | 타입만 import | 타입만 (컴파일 후 제거) |
| `import * as mod from './mod'` | namespace import | 모든 export |
| `import './mod'` | side-effects만 | 초기화 코드 실행 |
| `import mod from './mod'` | default import | default export |

### export 타입

| 문법 | 설명 |
|------|------|
| `export { foo }` | named export |
| `export type { Foo }` | 타입만 export |
| `export default foo` | default export |
| `export * from './mod'` | re-export all |
| `export { foo } from './mod'` | re-export named |

### tsconfig 모듈 설정

| 옵션 | 값 | 설명 |
|------|-----|------|
| **module** | `nodenext` | Node.js ESM (권장) |
|  | `esnext` | 최신 ESM |
|  | `commonjs` | CommonJS |
| **moduleResolution** | `nodenext` | Node.js (권장) |
|  | `bundler` | Webpack/Vite |
| **esModuleInterop** | `true` | CJS import 편의성 |
| **isolatedModules** | `true` | 파일별 독립 컴파일 |

## 언제 무엇을 쓸까?

| 상황 | 선택 | 이유 |
|------|------|------|
| 새 Node.js 프로젝트 | ESM | 표준, 최신 기능 |
| 브라우저 번들러 | ESM | Tree shaking |
| 레거시 Node.js | CommonJS | 호환성 |
| 타입만 import | `import type` | 번들 크기 감소 |
| 라이브러리 타입 | .d.ts | 타입 선언 분리 |

## 자주 하는 실수

### 1. import type 빠뜨림
❌ `import { User } from './types'` - 런타임 import
✅ `import type { User } from './types'` - 타입만, 컴파일 후 제거

### 2. default export/import 혼동
❌ `export = foo` (CommonJS 스타일)
✅ `export default foo` (ES6)

### 3. CJS를 ESM처럼 import
❌ `import express from 'express'` - esModuleInterop 없으면 에러
✅ `import * as express from 'express'` 또는 esModuleInterop: true

### 4. .d.ts에서 구현 코드 작성
❌ .d.ts에 함수 구현
✅ declare로 타입만 선언

### 5. module vs moduleResolution 불일치
❌ `module: "nodenext"`, `moduleResolution: "node"`
✅ `moduleResolution: "nodenext"` 사용

## Best Practices

**✅ import type으로 타입만 import**
```typescript
import type { User, Product } from './types';
import { fetchUser } from './api';  // 값만 import

// 컴파일 후: import type은 완전히 제거됨
```

**✅ barrel exports로 모듈 정리**
```typescript
// src/index.ts (barrel file)
export { User } from './user';
export { Product } from './product';
export type { Config } from './config';

// 사용
import { User, Product, type Config } from './src';
```

**✅ .d.ts로 타입 선언 분리**
```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}

// math.d.ts (자동 생성 또는 수동)
export declare function add(a: number, b: number): number;
```

**✅ declare module로 외부 라이브러리 타입 확장**
```typescript
// types/express.d.ts
declare module 'express' {
  interface Request {
    user?: {
      id: string;
      name: string;
    };
  }
}

// 이제 req.user를 타입 안전하게 사용 가능
```

**✅ ESM + CJS 호환 설정**
```json
{
  "compilerOptions": {
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**✅ package.json exports 필드**
```json
{
  "name": "my-lib",
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## ESM vs CJS 예제 비교

```typescript
// ========== ESM ==========
// export.ts
export const value = 42;
export function greet(name: string) {
  return `Hello, ${name}!`;
}
export default class MyClass {}

// import.ts
import MyClass, { value, greet } from './export';
import type { SomeType } from './types';

// ========== CommonJS ==========
// export.js
exports.value = 42;
exports.greet = function(name) {
  return `Hello, ${name}!`;
};
class MyClass {}
module.exports = MyClass;
module.exports.value = exports.value;
module.exports.greet = exports.greet;

// import.js (TypeScript)
import MyClass = require('./export');
const { value, greet } = require('./export');
```

## 다음 단계

이 모듈을 완료했다면:
- **[13-decorators](../13-decorators/)** - 데코레이터 패턴 (NestJS 준비)
- **[14-dependency-injection](../14-dependency-injection/)** - DI 패턴 이해

## 참고 자료

### 공식 문서
- [TypeScript Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
- [Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)

### Node.js
- [ECMAScript Modules](https://nodejs.org/api/esm.html)
- [package.json exports](https://nodejs.org/api/packages.html#exports)

---

**시작하기:** [01-esm-basics.ts](./01-esm-basics.ts)
