/**
 * 09-practical-configs.ts
 * 프로젝트별 최적 설정
 *
 * 프로젝트 종류에 따라 최적화된 tsconfig.json 설정이 다릅니다.
 * 이 파일에서는 Node.js 서버, React 프로젝트, 라이브러리, Monorepo, Next.js, Vite 프로젝트의 권장 설정과 extends를 통한 설정 공유 방법을 다룹니다.
 */

// ============================================================
// 1. Node.js 서버 설정
// ============================================================
console.log('\n=== 1. Node.js 서버 설정 ===');

// {
//   "compilerOptions": {
//     "target": "esnext",
//     "module": "nodenext",
//     "lib": ["esnext"],
//     "moduleResolution": "nodenext",
//
//     "strict": true,
//     "noUncheckedIndexedAccess": true,
//
//     "esModuleInterop": true,
//     "resolveJsonModule": true,
//     "allowSyntheticDefaultImports": true,
//
//     "outDir": "./dist",
//     "rootDir": "./src",
//     "sourceMap": true,
//     "declaration": true,
//
//     "skipLibCheck": true,
//     "forceConsistentCasingInFileNames": true
//   },
//   "include": ["src/**/*"],
//   "exclude": ["node_modules", "dist"]
// }

console.log('Node.js 서버 권장 설정:');
console.log('- target: esnext (최신 Node.js)');
console.log('- module: nodenext (ESM 지원)');
console.log('- strict + noUncheckedIndexedAccess');
console.log('- outDir: dist, sourceMap: true');

// ============================================================
// 2. React 프로젝트 (Vite)
// ============================================================
console.log('\n=== 2. React 프로젝트 (Vite) ===');

/*
{
  "compilerOptions": {
    // 환경
    "target": "esnext",
    "module": "esnext",
    "lib": ["esnext", "dom", "dom.iterable"],
    "moduleResolution": "bundler",

    // JSX
    "jsx": "react-jsx",

    // 엄격 모드
    "strict": true,
    "noUncheckedIndexedAccess": true,

    // 모듈 처리
    "esModuleInterop": true,
    "resolveJsonModule": true,

    // Vite가 빌드 담당
    "noEmit": true,

    // 경로 매핑
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },

    // 최적화
    "skipLibCheck": true,
    "isolatedModules": true  // Vite 필수
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

// tsconfig.node.json (Vite 설정 파일용)
{
  "compilerOptions": {
    "composite": true,
    "module": "esnext",
    "moduleResolution": "bundler"
  },
  "include": ["vite.config.ts"]
}
*/

console.log('React (Vite) 권장 설정:');
console.log('- moduleResolution: bundler');
console.log('- jsx: react-jsx (React 17+)');
console.log('- noEmit: true (Vite가 빌드)');
console.log('- isolatedModules: true (필수)');
console.log('- paths로 @/* 별칭');

// ============================================================
// 3. 라이브러리 설정
// ============================================================
console.log('\n=== 3. 라이브러리 설정 ===');

// {
//   "compilerOptions": {
//     "target": "es2015",
//     "module": "esnext",
//     "lib": ["es2015"],
//     "moduleResolution": "bundler",
//
//     "strict": true,
//
//     "outDir": "./dist",
//     "rootDir": "./src",
//     "declaration": true,
//     "declarationMap": true,
//     "sourceMap": true,
//
//     "removeComments": true,
//     "importHelpers": true,
//
//     "skipLibCheck": true,
//     "forceConsistentCasingInFileNames": true
//   },
//   "include": ["src"],
//   "exclude": ["**/*.test.ts", "**/*.spec.ts"]
// }
//
// package.json:
// {
//   "main": "./dist/index.js",
//   "types": "./dist/index.d.ts",
//   "files": ["dist"],
//   "devDependencies": {
//     "tslib": "^2.0.0"
//   }
// }

console.log('라이브러리 권장 설정:');
console.log('- target: es2015 (넓은 호환성)');
console.log('- declaration: true (필수)');
console.log('- removeComments + importHelpers');
console.log('- 테스트 파일 exclude');

// ============================================================
// 4. Monorepo 설정
// ============================================================
console.log('\n=== 4. Monorepo 설정 ===');

/*
packages/
├── tsconfig.base.json
├── shared/
│   └── tsconfig.json
└── app/
    └── tsconfig.json

// tsconfig.base.json (공통 설정)
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

// packages/shared/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src"]
}

// packages/app/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "references": [
    { "path": "../shared" }
  ],
  "include": ["src"]
}

// 루트 빌드
tsc -b packages/shared packages/app
*/

console.log('Monorepo 권장 구조:');
console.log('- tsconfig.base.json (공통 설정)');
console.log('- 각 패키지는 extends로 상속');
console.log('- shared는 composite: true');
console.log('- app은 references로 shared 참조');

// ============================================================
// 5. Next.js 설정
// ============================================================
console.log('\n=== 5. Next.js 설정 ===');

// {
//   "compilerOptions": {
//     "target": "es5",
//     "lib": ["dom", "dom.iterable", "esnext"],
//     "allowJs": true,
//     "skipLibCheck": true,
//     "strict": true,
//     "noEmit": true,
//     "esModuleInterop": true,
//     "module": "esnext",
//     "moduleResolution": "bundler",
//     "resolveJsonModule": true,
//     "isolatedModules": true,
//     "jsx": "preserve",
//     "incremental": true,
//     "plugins": [
//       {
//         "name": "next"
//       }
//     ],
//     "paths": {
//       "@/*": ["./*"]
//     }
//   },
//   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
//   "exclude": ["node_modules"]
// }

console.log('Next.js 권장 설정:');
console.log('- jsx: preserve (Next.js가 처리)');
console.log('- noEmit: true');
console.log('- paths: @/* 별칭');
console.log('- plugins: next');

// ============================================================
// 6. extends로 설정 공유
// ============================================================
console.log('\n=== 6. extends로 설정 공유 ===');

/*
// npm 패키지 사용
{
  "extends": "@tsconfig/node20/tsconfig.json",
  "compilerOptions": {
    "outDir": "dist"
  }
}

추천 베이스:
- @tsconfig/node20: Node.js 20
- @tsconfig/node18: Node.js 18
- @tsconfig/react: React
- @tsconfig/recommended: 범용
- @tsconfig/vite-react: Vite + React

설치:
npm install -D @tsconfig/node20
*/

console.log('extends 활용:');
console.log('- @tsconfig/node20 (Node.js 20)');
console.log('- @tsconfig/react (React)');
console.log('- @tsconfig/recommended (범용)');
console.log('');
console.log('npm install -D @tsconfig/node20');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Node.js 서버
 *    - target: esnext, module: nodenext
 *    - sourceMap: true, declaration: true
 *    - strict + noUncheckedIndexedAccess
 *
 * 2. React (Vite)
 *    - moduleResolution: bundler
 *    - jsx: react-jsx, noEmit: true
 *    - isolatedModules: true (필수)
 *
 * 3. 라이브러리
 *    - target: es2015 (넓은 호환성)
 *    - declaration: true (필수)
 *    - removeComments + importHelpers
 *
 * 4. Monorepo
 *    - tsconfig.base.json (공통)
 *    - composite + references
 *    - tsc -b로 빌드
 *
 * 5. Next.js
 *    - jsx: preserve
 *    - noEmit: true
 *    - plugins: next
 *
 * 6. extends
 *    - @tsconfig/* 패키지 활용
 *    - 환경별 베이스 설정
 */

console.log(`
빠른 시작:
  npm install -D @tsconfig/node20

  {
    "extends": "@tsconfig/node20/tsconfig.json",
    "compilerOptions": {
      "outDir": "dist"
    }
  }
`);

// ============================================================
// 프로젝트별 요약
// ============================================================
console.log('\n=== 프로젝트별 요약 ===');

console.log('');
console.log('Node.js 서버: target=esnext, module=nodenext');
console.log('React (Vite): noEmit=true, jsx=react-jsx');
console.log('라이브러리: declaration=true, removeComments=true');
console.log('Monorepo: composite + references');
console.log('Next.js: jsx=preserve, plugins=next');
console.log('');
console.log('공통: strict=true, noUncheckedIndexedAccess=true');
