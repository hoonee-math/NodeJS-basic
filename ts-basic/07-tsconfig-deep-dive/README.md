# 07. tsconfig.json 완전 정복

tsconfig.json은 TypeScript 프로젝트의 **컴파일러 동작을 제어하는 핵심 설정 파일**입니다. 이 모듈에서는 실무에서 자주 마주치는 설정들을 완전히 이해합니다.

## 학습 목표

- **tsconfig.json 구조**와 주요 옵션 이해
- **strict 플래그**의 의미와 각 옵션 상세
- **모듈 시스템** 설정 (CommonJS, ES Module, NodeNext)
- **경로 매핑**과 **프로젝트 참조** 활용
- **프로젝트 타입별 최적 설정** (Node.js, React, Library 등)

## 목차

### 기본 구조
- [01-basic-structure.ts](#01-basic-structurets) - tsconfig.json 기본 구조
- [02-compiler-options.ts](#02-compiler-optionsts) - compilerOptions 핵심 옵션
- [03-strict-flags.ts](#03-strict-flagsts) - strict 플래그 상세

### 모듈과 경로
- [04-module-resolution.ts](#04-module-resolutionts) - 모듈 해석 전략
- [05-path-mapping.ts](#05-path-mappingts) - 경로 매핑 (paths, baseUrl)
- [06-project-references.ts](#06-project-referencests) - 프로젝트 참조

### 타입 처리
- [07-type-checking.ts](#07-type-checkingts) - 타입 체크 옵션
- [08-emit-options.ts](#08-emit-optionsts) - 출력 파일 제어

### 실전 설정
- [09-practical-configs.ts](#09-practical-configsts) - 프로젝트별 최적 설정

## 예제 파일 개요

### 01-basic-structure.ts
**tsconfig.json 기본 구조**

- 파일 구조 (compilerOptions, include, exclude, files)
- extends로 설정 상속
- include/exclude 패턴
- tsconfig.json 위치와 프로젝트 범위
- 설정 우선순위
- CLI 옵션 vs tsconfig.json

### 02-compiler-options.ts
**compilerOptions 핵심 옵션**

- target - 컴파일 대상 JavaScript 버전
- module - 모듈 시스템 (CommonJS, ES2015, ESNext, NodeNext)
- lib - 포함할 라이브러리 정의 파일
- outDir, rootDir - 출력/입력 디렉토리
- sourceMap, declaration - 소스맵과 타입 정의 파일
- jsx - JSX 처리 방식 (React, Preserve 등)

### 03-strict-flags.ts
**strict 플래그 상세**

- strict - 모든 엄격 모드 플래그 활성화
- noImplicitAny - 암시적 any 금지
- strictNullChecks - null/undefined 엄격 체크
- strictFunctionTypes - 함수 타입 엄격 체크
- strictBindCallApply - bind/call/apply 타입 체크
- strictPropertyInitialization - 클래스 프로퍼티 초기화 체크
- noImplicitThis - this 타입 명시 강제
- alwaysStrict - "use strict" 자동 추가

### 04-module-resolution.ts
**모듈 해석 전략**

- moduleResolution - Node, Classic, NodeNext, Bundler
- esModuleInterop - CommonJS/ES Module 상호 운용
- allowSyntheticDefaultImports - default import 허용
- resolveJsonModule - JSON 파일 import
- node_modules/@types 자동 탐색
- typeRoots, types - 타입 정의 경로 커스터마이징

### 05-path-mapping.ts
**경로 매핑 (paths, baseUrl)**

- baseUrl - 상대 경로 기준점
- paths - 별칭 경로 매핑 (`@/`, `~/` 등)
- rootDirs - 가상 디렉토리 병합
- 절대 경로 import로 상대 경로 지옥 탈출
- Monorepo에서 경로 매핑
- Webpack/Vite와 paths 동기화

### 06-project-references.ts
**프로젝트 참조**

- composite - 프로젝트 참조 활성화
- references - 다른 프로젝트 참조
- 빌드 모드 (--build)
- 증분 빌드 (tsbuildinfo)
- Monorepo에서 프로젝트 참조
- 순환 참조 방지

### 07-type-checking.ts
**타입 체크 옵션**

- noUnusedLocals - 사용하지 않는 로컬 변수 경고
- noUnusedParameters - 사용하지 않는 매개변수 경고
- noImplicitReturns - 모든 경로에서 반환 강제
- noFallthroughCasesInSwitch - switch fallthrough 금지
- noUncheckedIndexedAccess - 인덱스 접근 시 undefined 체크
- exactOptionalPropertyTypes - 옵셔널 프로퍼티 엄격 처리
- noPropertyAccessFromIndexSignature - 인덱스 시그니처 프로퍼티 접근 제한

### 08-emit-options.ts
**출력 파일 제어**

- removeComments - 주석 제거
- importHelpers - tslib 헬퍼 사용
- downlevelIteration - 하위 버전 반복자 지원
- inlineSourceMap, inlineSources - 인라인 소스맵
- newLine - 줄바꿈 문자 (LF, CRLF)
- preserveConstEnums - const enum 유지
- noEmit - 출력 파일 생성 안 함 (타입 체크만)
- emitDeclarationOnly - .d.ts 파일만 생성

### 09-practical-configs.ts
**프로젝트별 최적 설정**

- Node.js 서버 설정
- React 프로젝트 설정
- 라이브러리 설정
- Monorepo 설정
- Next.js 설정
- Vite 설정
- 테스트 환경 설정
- 설정 베이스 공유 (extends)

## 핵심 개념 요약

### 주요 컴파일러 옵션

| 옵션 | 설명 | 권장 값 | 사용 이유 |
|------|------|---------|-----------|
| **target** | 컴파일 대상 JS 버전 | `esnext` (Node), `es2015` (브라우저) | 최신 기능 vs 호환성 |
| **module** | 모듈 시스템 | `nodenext` (Node), `esnext` (번들러) | 프로젝트 환경에 맞게 |
| **lib** | 포함 라이브러리 | `["esnext"]` (Node) | 사용 가능한 API |
| **strict** | 모든 엄격 모드 | `true` | 타입 안전성 |
| **esModuleInterop** | CJS/ESM 상호 운용 | `true` | import 편의성 |
| **skipLibCheck** | .d.ts 체크 스킵 | `true` | 빌드 속도 |

### strict 플래그 구성

| 옵션 | 효과 | 예시 |
|------|------|------|
| **noImplicitAny** | 암시적 any 금지 | `function f(x)` → 에러 |
| **strictNullChecks** | null/undefined 엄격 체크 | `string`에 `null` 할당 불가 |
| **strictFunctionTypes** | 함수 매개변수 반공변성 | 타입 안전한 콜백 |
| **strictBindCallApply** | bind/call/apply 타입 체크 | 매개변수 타입 검증 |
| **strictPropertyInitialization** | 클래스 프로퍼티 초기화 | 생성자에서 초기화 강제 |
| **noImplicitThis** | this 타입 명시 | 함수에서 this 사용 시 타입 필요 |
| **alwaysStrict** | "use strict" 추가 | 엄격 모드 JavaScript |

### 모듈 해석 (moduleResolution)

| 전략 | 설명 | 사용 시기 |
|------|------|-----------|
| **Node** | Node.js 방식 (레거시) | 오래된 프로젝트 |
| **NodeNext** | Node.js ESM 지원 | 최신 Node.js 프로젝트 |
| **Bundler** | Webpack/Vite 등 번들러 | 프론트엔드 프로젝트 |
| **Classic** | 구식 방식 (사용 안 함) | - |

### 경로 매핑

| 옵션 | 역할 | 예시 |
|------|------|------|
| **baseUrl** | 상대 경로 기준점 | `"baseUrl": "./"` |
| **paths** | 별칭 경로 | `"@/*": ["src/*"]` |
| **rootDirs** | 가상 디렉토리 병합 | `["src", "generated"]` |

## 언제 무엇을 쓸까?

| 프로젝트 타입 | target | module | lib | moduleResolution |
|---------------|--------|--------|-----|------------------|
| **Node.js 서버** | esnext | nodenext | esnext | nodenext |
| **React (Vite)** | esnext | esnext | dom, esnext | bundler |
| **라이브러리** | es2015 | esnext | esnext | bundler |
| **Next.js** | es2017 | esnext | dom, esnext | bundler |
| **레거시 브라우저** | es5 | commonjs | dom, es5 | node |

## 자주 하는 실수

### 1. strict 비활성화
❌ `"strict": false` - 타입 안전성 포기
✅ `"strict": true` - 모든 프로젝트에서 활성화

### 2. target과 lib 불일치
❌ `target: "es5"`, `lib: ["esnext"]` - Promise 등 사용 불가
✅ target에 맞는 lib 설정

### 3. module과 moduleResolution 불일치
❌ `module: "nodenext"`, `moduleResolution: "node"` - 비권장
✅ `moduleResolution: "nodenext"` 사용

### 4. paths 설정했는데 실행 시 에러
❌ paths는 컴파일만, 런타임은 별도 설정 필요
✅ ts-node, ts-jest, webpack/vite에도 paths 설정

### 5. skipLibCheck 남용
❌ 타입 에러를 숨기려고 사용
✅ 빌드 속도 향상용으로만 사용

## Best Practices

**✅ 모든 프로젝트에서 strict: true**
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**✅ 경로 매핑으로 import 단순화**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

**✅ 설정 공유 (extends)**
```json
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

**✅ noEmit으로 타입 체크만**
```json
{
  "compilerOptions": {
    "noEmit": true  // Babel, Vite 등 다른 도구로 트랜스파일
  }
}
```

**✅ 프로젝트 참조로 Monorepo 관리**
```json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../shared" }
  ]
}
```

## 프로젝트별 추천 설정

### Node.js 서버

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "lib": ["esnext"],
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### React (Vite)

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "lib": ["dom", "esnext"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 라이브러리

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "esnext",
    "lib": ["esnext"],
    "moduleResolution": "bundler",
    "strict": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

## 다음 단계

이 모듈을 완료했다면:
- **[08-type-vs-runtime](../08-type-vs-runtime/)** - 타입 소거와 런타임 이해
- **[09-practical-patterns](../09-practical-patterns/)** - interface vs type, enum 문제점

## 참고 자료

### 공식 문서
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig) - 모든 옵션 상세 설명
- [Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

### 추천 베이스 설정
- [@tsconfig/node20](https://github.com/tsconfig/bases) - Node.js 20 설정
- [@tsconfig/react](https://github.com/tsconfig/bases) - React 설정
- [@tsconfig/recommended](https://github.com/tsconfig/bases) - 범용 권장 설정

---

**시작하기:** [01-basic-structure.ts](./01-basic-structure.ts)
