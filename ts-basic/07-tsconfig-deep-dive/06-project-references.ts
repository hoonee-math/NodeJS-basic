/**
 * 06-project-references.ts
 * 프로젝트 참조
 *
 * Monorepo나 대규모 프로젝트에서 여러 TypeScript 프로젝트를 연결합니다.
 * 이 파일에서는 composite(프로젝트 참조 활성화), references(다른 프로젝트 참조), 빌드 모드(--build), 그리고 Monorepo에서의 활용 방법을 다룹니다.
 */

// ============================================================
// 1. composite - 프로젝트 참조 활성화
// ============================================================
console.log('\n=== 1. composite ===');

/*
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,      // composite은 declaration 필요
    "declarationMap": true,
    "outDir": "./dist"
  }
}

composite: true 효과:
- 프로젝트를 다른 프로젝트가 참조 가능
- 증분 빌드 지원 (tsbuildin fo)
- declaration 필수
*/

console.log('composite: 프로젝트 참조 기능 활성화');
console.log('- 다른 프로젝트가 이 프로젝트를 참조 가능');
console.log('- 증분 빌드 지원 (빌드 속도 향상)');
console.log('- declaration: true 필수');

// ============================================================
// 2. references - 다른 프로젝트 참조
// ============================================================
console.log('\n=== 2. references ===');

/*
Monorepo 구조:
packages/
├── shared/
│   ├── tsconfig.json
│   └── src/
│       └── utils.ts
└── app/
    ├── tsconfig.json  (shared 참조)
    └── src/
        └── index.ts

// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  }
}

// packages/app/tsconfig.json
{
  "compilerOptions": {
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ]
}

// packages/app/src/index.ts
import { utils } from '@shared/utils';  // shared 참조
*/

console.log('references: 다른 TypeScript 프로젝트 참조');
console.log('- path로 참조할 프로젝트 지정');
console.log('- 참조된 프로젝트는 composite: true 필요');
console.log('- Monorepo에서 패키지 간 의존성 관리');

// ============================================================
// 3. 빌드 모드 (--build)
// ============================================================
console.log('\n=== 3. 빌드 모드 (--build) ===');

/*
// 일반 빌드
tsc

// 프로젝트 참조 빌드
tsc --build (or tsc -b)

--build 옵션:
- tsc -b: 프로젝트와 의존성 모두 빌드
- tsc -b --clean: 빌드 결과물 삭제
- tsc -b --force: 증분 빌드 무시하고 전체 빌드
- tsc -b --watch: watch 모드

증분 빌드:
- .tsbuildinfo 파일 생성
- 변경된 파일만 재컴파일
- 빌드 속도 대폭 향상
*/

console.log('tsc --build (tsc -b):');
console.log('- 프로젝트 참조를 따라 순서대로 빌드');
console.log('- 증분 빌드로 속도 향상');
console.log('- --clean: 빌드 결과물 삭제');
console.log('- --watch: 변경 감지 자동 빌드');

// ============================================================
// 4. Monorepo 설정 예제
// ============================================================
console.log('\n=== 4. Monorepo 설정 예제 ===');

/*
packages/
├── tsconfig.base.json        (공통 설정)
├── shared/
│   ├── tsconfig.json
│   └── src/
│       └── index.ts
├── server/
│   ├── tsconfig.json          (shared 참조)
│   └── src/
│       └── index.ts
└── client/
    ├── tsconfig.json          (shared 참조)
    └── src/
        └── index.tsx

// tsconfig.base.json (공통 설정)
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

// packages/shared/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

// packages/server/tsconfig.json
{
  "extends": "../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "references": [
    { "path": "../shared" }
  ]
}

// 루트에서 빌드
tsc -b packages/server packages/client
*/

console.log('Monorepo 설정:');
console.log('- 공통 설정을 base로 분리');
console.log('- 각 패키지는 composite: true');
console.log('- 의존성을 references로 명시');
console.log('- 루트에서 tsc -b로 전체 빌드');

// ============================================================
// 5. 순환 참조 방지
// ============================================================
console.log('\n=== 5. 순환 참조 방지 ===');

/*
// ❌ 순환 참조
packages/
├── A/
│   └── tsconfig.json  (references B)
└── B/
    └── tsconfig.json  (references A)

// ✅ 계층 구조
packages/
├── shared/            (하위 레이어)
│   └── tsconfig.json
├── server/            (상위 레이어)
│   └── tsconfig.json  (references shared)
└── client/            (상위 레이어)
    └── tsconfig.json  (references shared)
*/

console.log('순환 참조 방지:');
console.log('- 의존성 방향을 단방향으로 유지');
console.log('- 공통 코드는 shared 패키지로 분리');
console.log('- 계층 구조 설계 (shared → app → ui)');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. composite
 *    - 프로젝트 참조 활성화
 *    - declaration: true 필수
 *    - 증분 빌드 지원
 *
 * 2. references
 *    - 다른 프로젝트 참조
 *    - Monorepo 의존성 관리
 *    - path로 참조 프로젝트 지정
 *
 * 3. tsc --build
 *    - 프로젝트 참조 빌드
 *    - 의존성 순서대로 빌드
 *    - 증분 빌드로 속도 향상
 *
 * 4. Monorepo
 *    - 공통 설정 분리 (base)
 *    - 패키지별 composite: true
 *    - references로 의존성 명시
 *
 * 5. 주의사항
 *    - 순환 참조 방지
 *    - 계층 구조 설계
 */

console.log(`
Monorepo 권장 구조:
  packages/
  ├── tsconfig.base.json
  ├── shared/
  │   └── tsconfig.json (composite: true)
  └── app/
      └── tsconfig.json (references: ../shared)
`);
