/**
 * 08-emit-options.ts
 * 출력 파일 제어
 *
 * 컴파일된 JavaScript 파일의 생성 방식을 제어하는 옵션들입니다.
 * 이 파일에서는 removeComments(주석 제거), importHelpers(tslib 사용), noEmit(출력 파일 생성 안 함), emitDeclarationOnly(.d.ts만 생성), 그리고 downlevelIteration(하위 버전 반복자 지원)을 다룹니다.
 */

// ============================================================
// 1. noEmit - 출력 파일 생성 안 함
// ============================================================
console.log('\n=== 1. noEmit ===');

/*
{
  "compilerOptions": {
    "noEmit": true
  }
}

용도:
- Babel, Vite, esbuild 등 다른 도구로 트랜스파일
- TypeScript는 타입 체크만 담당
- .js 파일 생성 안 함

적용 사례:
- Vite/Webpack 프로젝트
- ts-node로 실행
- 타입 체크만 필요한 경우
*/

console.log('noEmit: 출력 파일 생성 안 함 (타입 체크만)');
console.log('Babel/Vite 사용 시 권장');
console.log('tsc는 타입 체크, 빌드는 다른 도구');

// ============================================================
// 2. emitDeclarationOnly - .d.ts만 생성
// ============================================================
console.log('\n=== 2. emitDeclarationOnly ===');

/*
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": true
  }
}

용도:
- 타입 정의만 생성
- JavaScript는 다른 도구로 빌드
- 라이브러리 개발 시 유용

사용 사례:
- Rollup/Vite로 .js 빌드
- TypeScript로 .d.ts만 생성
*/

console.log('emitDeclarationOnly: .d.ts 파일만 생성');
console.log('.js는 Rollup/Vite가, .d.ts는 TypeScript가 생성');
console.log('라이브러리 빌드에 유용');

// ============================================================
// 3. removeComments - 주석 제거
// ============================================================
console.log('\n=== 3. removeComments ===');

/*
{
  "compilerOptions": {
    "removeComments": true
  }
}

효과:
// TypeScript
function add(a: number, b: number) {
  // 두 수를 더함
  return a + b;
}

// JavaScript (removeComments: true)
function add(a, b) {
  return a + b;
}

장점:
- 번들 크기 감소
- 주석 유출 방지
*/

console.log('removeComments: 컴파일된 .js에서 주석 제거');
console.log('번들 크기 감소, 프로덕션 빌드에 권장');
console.log('JSDoc 주석도 제거됨 (주의)');

// ============================================================
// 4. importHelpers - tslib 사용
// ============================================================
console.log('\n=== 4. importHelpers ===');

/*
{
  "compilerOptions": {
    "importHelpers": true
  }
}

효과:
// async/await, spread 등을 polyfill 할 때
// ❌ importHelpers: false (각 파일마다 헬퍼 코드 삽입)
// 파일 1
var __awaiter = function() {...};  // 헬퍼 중복
// 파일 2
var __awaiter = function() {...};  // 헬퍼 중복

// ✅ importHelpers: true (tslib에서 import)
import { __awaiter } from "tslib";

사용:
npm install tslib

장점:
- 번들 크기 감소
- 코드 중복 제거
*/

console.log('importHelpers: tslib에서 헬퍼 함수 import');
console.log('각 파일에 헬퍼 중복 삽입 방지');
console.log('npm install tslib 필요');

// ============================================================
// 5. downlevelIteration - 하위 버전 반복자
// ============================================================
console.log('\n=== 5. downlevelIteration ===');

/*
{
  "compilerOptions": {
    "target": "es5",
    "downlevelIteration": true
  }
}

효과:
// for-of, spread, destructuring 정확한 변환
// ❌ downlevelIteration: false (간단한 변환, Symbol.iterator 무시)
var arr = [1, 2, 3];
for (var i = 0; i < arr.length; i++) {...}

// ✅ downlevelIteration: true (정확한 변환, Symbol.iterator 지원)
var arr = [1, 2, 3];
var __read = tslib.__read;
for (var _i = 0, arr_1 = __read(arr); _i < arr_1.length; _i++) {...}

필요한 경우:
- target: es5 + for-of/spread 사용
- Symbol.iterator 지원 필요
*/

console.log('downlevelIteration: for-of/spread 정확한 변환');
console.log('target: es5일 때 Symbol.iterator 지원');
console.log('번들 크기 증가, 필요할 때만 사용');

// ============================================================
// 6. 실무 권장 설정
// ============================================================
console.log('\n=== 6. 실무 권장 설정 ===');

console.log('프로젝트별 권장:');
console.log('');
console.log('Vite/Webpack 프로젝트:');
console.log('  "noEmit": true  // 타입 체크만');
console.log('');
console.log('라이브러리:');
console.log('  "declaration": true,');
console.log('  "declarationMap": true,');
console.log('  "removeComments": true,');
console.log('  "importHelpers": true');
console.log('');
console.log('Node.js 서버:');
console.log('  "sourceMap": true,');
console.log('  "declaration": true');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. noEmit
 *    - 출력 파일 생성 안 함
 *    - Vite/Babel 사용 시 권장
 *    - TypeScript는 타입 체크만
 *
 * 2. emitDeclarationOnly
 *    - .d.ts 파일만 생성
 *    - .js는 다른 도구로 빌드
 *    - 라이브러리 개발
 *
 * 3. removeComments
 *    - 주석 제거
 *    - 번들 크기 감소
 *    - 프로덕션 빌드
 *
 * 4. importHelpers
 *    - tslib 사용
 *    - 헬퍼 중복 제거
 *    - npm install tslib
 *
 * 5. downlevelIteration
 *    - for-of/spread 정확한 변환
 *    - target: es5 + 반복자 사용
 *    - 번들 크기 증가
 *
 * 6. 권장사항
 *    - Vite: noEmit: true
 *    - 라이브러리: declaration + removeComments + importHelpers
 */

console.log(`
Vite 프로젝트:
  "noEmit": true

라이브러리:
  "declaration": true,
  "removeComments": true,
  "importHelpers": true
`);
