/**
 * 05-path-mapping.ts
 * 경로 매핑 (paths, baseUrl)
 *
 * 상대 경로 지옥에서 벗어나기 위해 경로 매핑을 사용합니다.
 * 이 파일에서는 baseUrl(상대 경로 기준점), paths(별칭 경로 매핑), 절대 경로 import, 그리고 Webpack/Vite와 paths 동기화 방법을 다룹니다.
 */

// ============================================================
// 1. baseUrl - 상대 경로 기준점
// ============================================================
console.log('\n=== 1. baseUrl ===');

/*
{
  "compilerOptions": {
    "baseUrl": "."
  }
}

프로젝트 구조:
project/
├── tsconfig.json
├── src/
│   ├── components/
│   │   └── Button.tsx
│   └── utils/
│       └── helper.ts

// ❌ baseUrl 없이
import { helper } from '../../../utils/helper';

// ✅ baseUrl: "."
import { helper } from 'src/utils/helper';
*/

console.log('baseUrl: import의 기준 경로 설정');
console.log('일반적으로 "." (tsconfig.json 위치)');
console.log('상대 경로 지옥 해결');

// ============================================================
// 2. paths - 별칭 경로 매핑
// ============================================================
console.log('\n=== 2. paths - 별칭 경로 매핑 ===');

/*
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"],
      "~/*": ["src/*"]
    }
  }
}

사용 예:
import { Button } from '@/components/Button';
import { helper } from '@utils/helper';
import { API } from '~/services/api';
*/

console.log('paths: 별칭 경로 매핑');
console.log('- @/*: src 디렉토리 별칭');
console.log('- @components/*: components 직접 접근');
console.log('- ~/*: src 별칭 (다른 관례)');
console.log('');
console.log('주의: paths는 컴파일만! 런타임 설정 별도 필요');

// ============================================================
// 3. 상대 경로 vs 절대 경로
// ============================================================
console.log('\n=== 3. 상대 경로 vs 절대 경로 ===');

/*
파일 구조:
src/
├── pages/
│   └── user/
│       └── profile/
│           └── Edit.tsx
└── components/
    └── Button.tsx

// ❌ 상대 경로
import { Button } from '../../../components/Button';

// ✅ 절대 경로 (paths 사용)
import { Button } from '@/components/Button';

장점:
- 파일 이동 시 import 경로 변경 불필요
- 가독성 향상
- 리팩토링 용이
*/

console.log('절대 경로 장점:');
console.log('- 파일 이동 시 import 경로 유지');
console.log('- ../../../ 지옥 탈출');
console.log('- 코드 가독성 향상');

// ============================================================
// 4. Webpack/Vite와 동기화
// ============================================================
console.log('\n=== 4. Webpack/Vite와 동기화 ===');

/*
paths는 TypeScript 컴파일만 영향!
런타임(Webpack/Vite)에도 설정 필요:

// Vite (vite.config.ts)
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
});

// Webpack (webpack.config.js)
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
};
*/

console.log('paths 동기화:');
console.log('- TypeScript: tsconfig.json의 paths');
console.log('- Vite: vite.config.ts의 resolve.alias');
console.log('- Webpack: webpack.config.js의 resolve.alias');
console.log('');
console.log('ts-node, ts-jest도 별도 설정 필요');

// ============================================================
// 5. 실무 권장 패턴
// ============================================================
console.log('\n=== 5. 실무 권장 패턴 ===');

console.log('일반적인 paths 설정:');
console.log('');
console.log('React/Vue:');
console.log('  "@/*": ["src/*"],');
console.log('  "@components/*": ["src/components/*"],');
console.log('  "@hooks/*": ["src/hooks/*"]');
console.log('');
console.log('Node.js:');
console.log('  "@/*": ["src/*"],');
console.log('  "@models/*": ["src/models/*"],');
console.log('  "@services/*": ["src/services/*"]');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. baseUrl
 *    - import의 기준 경로
 *    - 일반적으로 "." (루트)
 *
 * 2. paths
 *    - 별칭 경로 매핑
 *    - @/*, @components/* 등
 *    - baseUrl 필요
 *
 * 3. 장점
 *    - 상대 경로 지옥 탈출
 *    - 파일 이동 시 import 유지
 *    - 가독성 향상
 *
 * 4. 주의사항
 *    - TypeScript 컴파일만 영향
 *    - 런타임 설정 별도 필요
 *    - Webpack/Vite와 동기화
 *
 * 5. 권장 설정
 *    - @/*: src 디렉토리
 *    - @components, @utils 등 세부 별칭
 */

console.log(`
권장 설정:
  {
    "compilerOptions": {
      "baseUrl": ".",
      "paths": {
        "@/*": ["src/*"],
        "@components/*": ["src/components/*"]
      }
    }
  }
`);
