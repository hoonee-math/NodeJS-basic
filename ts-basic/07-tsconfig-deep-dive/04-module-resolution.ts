/**
 * 04-module-resolution.ts
 * 모듈 해석 전략
 *
 * TypeScript가 import 문에서 모듈을 찾는 방식을 설정합니다.
 * 이 파일에서는 moduleResolution(Node, NodeNext, Bundler), esModuleInterop(CommonJS/ES Module 상호 운용), resolveJsonModule(JSON 파일 import), 그리고 typeRoots/types(타입 정의 경로 커스터마이징)를 다룹니다.
 */

// ============================================================
// 1. moduleResolution - 모듈 해석 전략
// ============================================================
console.log('\n=== 1. moduleResolution ===');

/*
{
  "compilerOptions": {
    "moduleResolution": "nodenext"  // "node", "nodenext", "bundler", "classic"
  }
}

전략 비교:
- node: 전통적인 Node.js 방식 (레거시)
- nodenext: Node.js ESM 지원 (.mjs, package.json "type")
- bundler: Webpack/Vite 등 번들러 (확장자 생략 가능)
- classic: 구식 (사용 안 함)
*/

console.log('moduleResolution 전략:');
console.log('- node: Node.js 전통 방식 (레거시)');
console.log('- nodenext: Node.js 최신 ESM 지원');
console.log('- bundler: Webpack/Vite (확장자 생략)');
console.log('');
console.log('권장: Node.js는 nodenext, React/Vue는 bundler');

// ============================================================
// 2. esModuleInterop - CJS/ESM 상호 운용
// ============================================================
console.log('\n=== 2. esModuleInterop ===');

/*
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}

효과:
// CommonJS 모듈 (예: express)
// ❌ esModuleInterop: false
import * as express from 'express';
const app = express();  // Error

// ✅ esModuleInterop: true
import express from 'express';
const app = express();  // OK
*/

console.log('esModuleInterop: CommonJS 모듈을 ES Module처럼 import');
console.log('대부분의 npm 패키지가 CommonJS이므로 true 권장');
console.log('allowSyntheticDefaultImports도 자동 활성화');

// ============================================================
// 3. resolveJsonModule - JSON import
// ============================================================
console.log('\n=== 3. resolveJsonModule ===');

/*
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}

사용 예:
// package.json
{
  "name": "my-app",
  "version": "1.0.0"
}

// TypeScript
import pkg from './package.json';
console.log(pkg.version);  // "1.0.0"
*/

console.log('resolveJsonModule: JSON 파일을 import 가능');
console.log('설정 파일, package.json 등을 타입 안전하게 import');
console.log('JSON은 자동으로 타입 추론');

// ============================================================
// 4. typeRoots / types - 타입 정의 경로
// ============================================================
console.log('\n=== 4. typeRoots / types ===');

/*
{
  "compilerOptions": {
    "typeRoots": ["./node_modules/@types", "./types"],  // 타입 정의 폴더
    "types": ["node", "jest"]  // 포함할 타입 정의 패키지
  }
}

기본 동작:
- typeRoots 미지정 시 ./node_modules/@types 자동 탐색
- types 미지정 시 typeRoots의 모든 패키지 포함
- types 지정 시 명시된 패키지만 포함
*/

console.log('typeRoots / types:');
console.log('- typeRoots: 타입 정의 폴더 지정');
console.log('- types: 포함할 타입 패키지 명시');
console.log('- 기본값: node_modules/@types의 모든 패키지');
console.log('');
console.log('주의: types 지정 시 다른 @types는 제외됨');

// ============================================================
// 5. allowSyntheticDefaultImports
// ============================================================
console.log('\n=== 5. allowSyntheticDefaultImports ===');

/*
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true
  }
}

효과:
// default export가 없는 모듈
// ❌ allowSyntheticDefaultImports: false
import * as React from 'react';

// ✅ allowSyntheticDefaultImports: true
import React from 'react';  // OK
*/

console.log('allowSyntheticDefaultImports:');
console.log('default export 없는 모듈을 default import 가능');
console.log('esModuleInterop: true 시 자동 활성화');
console.log('타입 체크만 영향, 실제 변환은 Babel/Vite가 처리');

// ============================================================
// 6. 실무 권장 설정
// ============================================================
console.log('\n=== 6. 실무 권장 설정 ===');

console.log('프로젝트별 권장:');
console.log('');
console.log('Node.js 서버:');
console.log('  "moduleResolution": "nodenext",');
console.log('  "esModuleInterop": true,');
console.log('  "resolveJsonModule": true');
console.log('');
console.log('React/Vite:');
console.log('  "moduleResolution": "bundler",');
console.log('  "esModuleInterop": true,');
console.log('  "allowSyntheticDefaultImports": true');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. moduleResolution
 *    - Node.js: nodenext
 *    - Webpack/Vite: bundler
 *    - classic은 사용 안 함
 *
 * 2. esModuleInterop
 *    - CommonJS 모듈 import 편의성
 *    - 대부분 true 권장
 *
 * 3. resolveJsonModule
 *    - JSON 파일 import 가능
 *    - 설정 파일 import에 유용
 *
 * 4. typeRoots / types
 *    - 타입 정의 경로 커스터마이징
 *    - types 지정 시 주의 (다른 @types 제외됨)
 *
 * 5. allowSyntheticDefaultImports
 *    - default import 허용
 *    - esModuleInterop이 자동 활성화
 */

console.log(`
권장 설정 (Node.js):
  "moduleResolution": "nodenext",
  "esModuleInterop": true,
  "resolveJsonModule": true
`);
