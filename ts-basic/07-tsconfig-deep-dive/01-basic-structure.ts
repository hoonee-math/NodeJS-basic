/**
 * 01-basic-structure.ts
 * tsconfig.json 기본 구조
 *
 * TypeScript 프로젝트의 컴파일러 동작을 제어하는 tsconfig.json의 기본 구조를 이해해야 합니다.
 * 이 파일에서는 tsconfig.json의 주요 섹션(compilerOptions, include, exclude, files), extends로 설정 상속하기, include/exclude 패턴, 그리고 설정 우선순위를 다룹니다.
 */

// ============================================================
// 1. tsconfig.json 기본 구조
// ============================================================
console.log('\n=== 1. tsconfig.json 기본 구조 ===');

// tsconfig.json 기본 템플릿:
//
// {
//   "compilerOptions": {
//     "target": "esnext",
//     "module": "nodenext",
//     "strict": true
//   },
//   "include": [
//     "src/**/*"
//   ],
//   "exclude": [
//     "node_modules",
//     "dist"
//   ],
//   "files": [
//     "src/index.ts"
//   ]
// }

console.log('tsconfig.json은 4가지 주요 섹션으로 구성됨:');
console.log('- compilerOptions: 컴파일러 옵션');
console.log('- include: 컴파일할 파일 패턴');
console.log('- exclude: 제외할 파일 패턴');
console.log('- files: 명시적으로 포함할 파일 목록');

// ============================================================
// 2. extends - 설정 상속
// ============================================================
console.log('\n=== 2. extends - 설정 상속 ===');

/*
베이스 설정 상속 예제:

// tsconfig.base.json
{
  "compilerOptions": {
    "target": "esnext",
    "strict": true,
    "esModuleInterop": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",    // 추가 옵션
    "strict": false      // 오버라이드
  }
}
*/

console.log('extends로 설정을 상속받을 수 있음:');
console.log('- npm 패키지 상속: "@tsconfig/node20/tsconfig.json"');
console.log('- 로컬 파일 상속: "./tsconfig.base.json"');
console.log('- 자식 설정이 부모 설정을 오버라이드');

// ============================================================
// 3. include/exclude 패턴
// ============================================================
console.log('\n=== 3. include/exclude 패턴 ===');

// Glob 패턴 사용:
//
// {
//   "include": [
//     "src/**/*",
//     "tests/**/*.test.ts"
//   ],
//   "exclude": [
//     "node_modules",
//     "**/*.spec.ts",
//     "dist",
//     "**/*.d.ts"
//   ]
// }

console.log('Glob 패턴 사용 예제:');
console.log('- *: 한 단계 디렉토리/파일 매칭');
console.log('- **: 모든 하위 디렉토리 매칭');
console.log('- ?: 한 글자 매칭');
console.log('- [abc]: a, b, c 중 하나 매칭');

// ============================================================
// 4. files vs include
// ============================================================
console.log('\n=== 4. files vs include ===');

// 차이점:
//
// files: 명시적 파일 목록 (소규모 프로젝트)
// {
//   "files": [
//     "src/index.ts",
//     "src/app.ts"
//   ]
// }
//
// include: 패턴 매칭 (일반적)
// {
//   "include": [
//     "src/**/*"
//   ]
// }

console.log('files vs include:');
console.log('- files: 정확한 파일 경로 목록 (glob 패턴 불가)');
console.log('- include: glob 패턴 사용 (일반적으로 사용)');
console.log('- files가 include보다 우선순위 높음');

// ============================================================
// 5. 설정 우선순위
// ============================================================
console.log('\n=== 5. 설정 우선순위 ===');

/*
우선순위 (높음 → 낮음):

1. CLI 옵션: tsc --target es5
2. tsconfig.json의 compilerOptions
3. extends로 상속받은 설정
4. 기본값
*/

console.log('설정 우선순위:');
console.log('1. CLI 옵션 (tsc --target es5)');
console.log('2. tsconfig.json의 compilerOptions');
console.log('3. extends로 상속받은 설정');
console.log('4. TypeScript 기본값');

// ============================================================
// 6. 프로젝트 범위
// ============================================================
console.log('\n=== 6. 프로젝트 범위 ===');

/*
tsconfig.json 위치:

project/
├── tsconfig.json       ← 프로젝트 루트
├── src/
│   ├── index.ts
│   └── utils/
│       └── helper.ts
└── node_modules/

프로젝트 범위:
- tsconfig.json이 있는 디렉토리부터 하위 모든 .ts 파일
- tsc 명령을 실행하면 tsconfig.json을 자동으로 찾음
*/

console.log('프로젝트 범위:');
console.log('- tsconfig.json이 있는 디렉토리가 프로젝트 루트');
console.log('- tsc는 현재 디렉토리부터 상위로 tsconfig.json 탐색');
console.log('- tsc -p <path>로 특정 tsconfig.json 지정 가능');

// ============================================================
// 7. 실무 팁
// ============================================================
console.log('\n=== 7. 실무 팁 ===');

console.log('실무에서 자주 사용하는 패턴:');
console.log('');
console.log('1. 환경별 설정 분리:');
console.log('   - tsconfig.json (공통)');
console.log('   - tsconfig.build.json (프로덕션 빌드)');
console.log('   - tsconfig.test.json (테스트)');
console.log('');
console.log('2. Monorepo 설정:');
console.log('   - packages/*/tsconfig.json (개별 패키지)');
console.log('   - tsconfig.base.json (공통 설정)');
console.log('');
console.log('3. 추천 npm 패키지:');
console.log('   - @tsconfig/node20 (Node.js 20)');
console.log('   - @tsconfig/react (React)');
console.log('   - @tsconfig/recommended (범용)');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. tsconfig.json 구조
 *    - compilerOptions: 컴파일러 옵션
 *    - include: 컴파일할 파일 패턴
 *    - exclude: 제외할 파일 패턴
 *    - files: 명시적 파일 목록
 *
 * 2. extends
 *    - 베이스 설정 상속
 *    - npm 패키지 또는 로컬 파일
 *    - 자식 설정이 부모 오버라이드
 *
 * 3. include/exclude
 *    - Glob 패턴 사용 (*, **, ?, [])
 *    - exclude는 기본적으로 node_modules 포함
 *    - include가 없으면 모든 .ts 파일 포함
 *
 * 4. 우선순위
 *    - CLI > tsconfig.json > extends > 기본값
 *
 * 5. 실무 패턴
 *    - 환경별 설정 분리
 *    - Monorepo 공통 설정
 *    - npm 베이스 설정 활용
 */

console.log(`
예제:
  {
    "extends": "@tsconfig/node20/tsconfig.json",
    "compilerOptions": { "outDir": "dist" },
    "include": ["src/**/*"],
    "exclude": ["**/*.test.ts"]
  }
`);
