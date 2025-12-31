/**
 * 02-compiler-options.ts
 * compilerOptions 핵심 옵션
 *
 * compilerOptions는 TypeScript 컴파일러의 동작을 세밀하게 제어합니다.
 * 이 파일에서는 target(컴파일 대상 JavaScript 버전), module(모듈 시스템), lib(포함할 라이브러리), outDir/rootDir(출력/입력 디렉토리), 그리고 sourceMap/declaration(소스맵과 타입 정의 파일)을 다룹니다.
 */

// ============================================================
// 1. target - 컴파일 대상 JavaScript 버전
// ============================================================
console.log('\n=== 1. target - 컴파일 대상 JavaScript 버전 ===');

/*
{
  "compilerOptions": {
    "target": "esnext"  // "es3", "es5", "es2015", "es2020", "esnext"
  }
}

효과:
- async/await → Promise 체인 (ES5)
- ?? (nullish coalescing) → 삼항 연산자 (ES2020 이하)
- class 필드 → 생성자 할당 (ES2021 이하)
*/

console.log('target 옵션:');
console.log('- es5: 레거시 브라우저 지원 (IE11)');
console.log('- es2015 (es6): 모던 브라우저');
console.log('- es2020: 최신 문법 일부');
console.log('- esnext: 최신 JavaScript (Node.js 권장)');
console.log('');
console.log('주의: target이 낮으면 번들 크기 증가 (폴리필 필요)');

// ============================================================
// 2. module - 모듈 시스템
// ============================================================
console.log('\n=== 2. module - 모듈 시스템 ===');

/*
{
  "compilerOptions": {
    "module": "nodenext"  // "commonjs", "es2015", "esnext", "nodenext"
  }
}

모듈 변환:
- commonjs: require/module.exports (Node.js 전통)
- es2015/esnext: import/export (표준)
- nodenext: Node.js ESM 지원 (.mjs, package.json "type": "module")
*/

console.log('module 옵션:');
console.log('- commonjs: Node.js 전통 방식 (require)');
console.log('- esnext: ES Module (import/export)');
console.log('- nodenext: Node.js 최신 ESM 지원');
console.log('- umd/amd: 브라우저/AMD 로더용');
console.log('');
console.log('권장: Node.js는 nodenext, 브라우저/번들러는 esnext');

// ============================================================
// 3. lib - 포함할 라이브러리 정의 파일
// ============================================================
console.log('\n=== 3. lib - 포함할 라이브러리 정의 파일 ===');

/*
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["esnext", "dom"]
  }
}

lib 설정:
- lib 미지정 시 target에 따라 자동 설정
- "dom": window, document 등 브라우저 API
- "esnext": Promise, Map, Set 등 최신 JavaScript
- "dom.iterable": NodeList.forEach 등
- "webworker": Web Worker API
*/

console.log('lib 옵션:');
console.log('- esnext: 최신 JavaScript API');
console.log('- dom: 브라우저 API (window, document)');
console.log('- dom.iterable: NodeList.forEach 등');
console.log('- es2015: Promise, Map, Set');
console.log('');
console.log('Node.js: ["esnext"]');
console.log('React: ["esnext", "dom", "dom.iterable"]');

// ============================================================
// 4. outDir / rootDir - 출력/입력 디렉토리
// ============================================================
console.log('\n=== 4. outDir / rootDir - 출력/입력 디렉토리 ===');

/*
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist"
  }
}

프로젝트 구조:
src/
├── index.ts
└── utils/
    └── helper.ts

컴파일 후:
dist/
├── index.js
└── utils/
    └── helper.js

rootDir 미지정 시 가장 긴 공통 경로가 자동으로 rootDir이 됨
*/

console.log('outDir / rootDir:');
console.log('- rootDir: 소스 파일 루트 (기본값: 자동 계산)');
console.log('- outDir: 컴파일된 파일 출력 경로');
console.log('- rootDir 지정 시 디렉토리 구조 유지');

// ============================================================
// 5. sourceMap / declaration - 소스맵과 타입 정의
// ============================================================
console.log('\n=== 5. sourceMap / declaration ===');

/*
{
  "compilerOptions": {
    "sourceMap": true,       // .js.map 파일 생성
    "declaration": true,     // .d.ts 파일 생성
    "declarationMap": true   // .d.ts.map 파일 생성
  }
}

용도:
- sourceMap: 디버깅 시 원본 .ts 위치 표시
- declaration: 라이브러리 타입 정의 제공
- declarationMap: declaration 소스 추적
*/

console.log('sourceMap / declaration:');
console.log('- sourceMap: 디버깅용 소스맵 생성');
console.log('- declaration: 타입 정의 파일 생성 (라이브러리 필수)');
console.log('- declarationMap: 타입 정의 소스 추적');
console.log('');
console.log('라이브러리: declaration + declarationMap');
console.log('앱: sourceMap만 (프로덕션에서는 제거)');

// ============================================================
// 6. jsx - JSX 처리 방식
// ============================================================
console.log('\n=== 6. jsx - JSX 처리 방식 ===');

/*
{
  "compilerOptions": {
    "jsx": "react-jsx"  // "preserve", "react", "react-jsx", "react-jsxdev"
  }
}

변환 방식:
- preserve: JSX 유지 (.jsx 출력, Babel이 처리)
- react: React.createElement로 변환
- react-jsx: jsx() 함수로 변환 (React 17+)
- react-jsxdev: 개발 모드용 (디버그 정보 포함)
*/

console.log('jsx 옵션:');
console.log('- preserve: JSX 그대로 유지 (Babel/Vite가 처리)');
console.log('- react: React.createElement (레거시)');
console.log('- react-jsx: jsx() 함수 (React 17+, 권장)');
console.log('- react-jsxdev: 개발 모드 (디버그 정보)');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. target
 *    - 컴파일 대상 JavaScript 버전
 *    - 낮을수록 호환성 ↑, 번들 크기 ↑
 *    - Node.js: esnext, 브라우저: es2015+
 *
 * 2. module
 *    - 모듈 시스템 지정
 *    - Node.js: nodenext, 번들러: esnext
 *    - commonjs는 레거시
 *
 * 3. lib
 *    - 사용 가능한 API 지정
 *    - Node.js: ["esnext"], React: ["esnext", "dom"]
 *    - target에 따라 자동 설정되지만 명시 권장
 *
 * 4. outDir / rootDir
 *    - 입력/출력 디렉토리
 *    - rootDir 지정 시 구조 유지
 *
 * 5. sourceMap / declaration
 *    - sourceMap: 디버깅용
 *    - declaration: 라이브러리용 타입 정의
 *
 * 6. jsx
 *    - React: react-jsx (React 17+)
 *    - Vite/Babel: preserve
 */

console.log(`
Node.js 서버 권장:
  "target": "esnext",
  "module": "nodenext",
  "lib": ["esnext"],
  "outDir": "dist",
  "rootDir": "src"

React 프로젝트 권장:
  "target": "esnext",
  "module": "esnext",
  "lib": ["esnext", "dom"],
  "jsx": "react-jsx"
`);
