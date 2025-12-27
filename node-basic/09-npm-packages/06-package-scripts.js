/**
 * 06-package-scripts.js
 *
 * npm scripts 활용
 */

console.log('=== npm scripts 활용 ===\n');

// 1. npm scripts란?
console.log('1. npm scripts란?\n');

console.log('→ npm scripts:');
console.log('   - package.json의 "scripts" 섹션에 정의');
console.log('   - 자주 사용하는 명령어를 단축어로 실행');
console.log('   - 팀 전체가 동일한 명령어 사용');
console.log('   - CI/CD 파이프라인 자동화\n');

// 2. 기본 scripts
console.log('2. 기본 scripts\n');

const basicScripts = {
  scripts: {
    start: 'node index.js',
    test: 'jest',
    build: 'webpack --mode production',
    dev: 'nodemon index.js',
    lint: 'eslint .',
    format: 'prettier --write "**/*.js"'
  }
};

console.log('→ package.json 예시:');
console.log(JSON.stringify(basicScripts, null, 2));
console.log();

console.log('→ 실행 방법:');
console.log('   npm start    # "start" 스크립트');
console.log('   npm test     # "test" 스크립트');
console.log('   npm run dev  # "dev" 스크립트');
console.log('   npm run lint # "lint" 스크립트\n');

// 3. Pre & Post 스크립트
console.log('3. Pre & Post 스크립트\n');

const lifecycleScripts = {
  scripts: {
    prebuild: 'npm run clean',
    build: 'webpack --mode production',
    postbuild: 'npm run test',

    pretest: 'npm run lint',
    test: 'jest',
    posttest: 'echo "Tests completed"',

    clean: 'rm -rf dist',
    deploy: 'npm run build && npm run upload'
  }
};

console.log('→ 라이프사이클 스크립트:');
console.log(JSON.stringify(lifecycleScripts, null, 2));
console.log();

console.log('→ 실행 순서:');
console.log('   npm run build');
console.log('   1. prebuild (clean 실행)');
console.log('   2. build (webpack 실행)');
console.log('   3. postbuild (test 실행)\n');

// 4. 환경 변수 전달
console.log('4. 환경 변수 전달\n');

const envScripts = {
  scripts: {
    'start:dev': 'NODE_ENV=development node index.js',
    'start:prod': 'NODE_ENV=production node index.js',
    'start:debug': 'DEBUG=* node index.js'
  }
};

console.log('→ 환경별 스크립트:');
console.log(JSON.stringify(envScripts, null, 2));
console.log();

console.log('→ Windows에서는 cross-env 사용:');
console.log('   npm install --save-dev cross-env');
console.log();

const crossEnvScripts = {
  scripts: {
    'start:dev': 'cross-env NODE_ENV=development node index.js',
    'start:prod': 'cross-env NODE_ENV=production node index.js'
  }
};

console.log(JSON.stringify(crossEnvScripts, null, 2));
console.log();

// 5. 병렬 실행
console.log('5. 병렬/순차 실행\n');

console.log('→ 순차 실행 (&&):');
console.log('   "build": "npm run clean && npm run compile && npm run test"');
console.log('   순서대로 실행, 하나라도 실패하면 중단\n');

console.log('→ 병렬 실행 (&):');
console.log('   "dev": "npm run server & npm run client"');
console.log('   동시에 실행 (Windows에서 제한적)\n');

console.log('→ npm-run-all 사용 (권장):');
console.log('   npm install --save-dev npm-run-all');
console.log();

const runAllScripts = {
  scripts: {
    'build:js': 'babel src -d dist',
    'build:css': 'postcss src/styles.css -o dist/styles.css',
    'build': 'npm-run-all build:*',

    'watch:js': 'babel src -d dist --watch',
    'watch:css': 'postcss src/styles.css -o dist/styles.css --watch',
    'watch': 'npm-run-all --parallel watch:*',

    'lint:js': 'eslint .',
    'lint:css': 'stylelint "**/*.css"',
    'lint': 'npm-run-all lint:*'
  }
};

console.log(JSON.stringify(runAllScripts, null, 2));
console.log();

// 6. 인자 전달
console.log('6. 인자 전달\n');

const argsScripts = {
  scripts: {
    test: 'jest',
    'test:watch': 'jest --watch',
    'test:coverage': 'jest --coverage',
    'test:file': 'jest'  // npm run test:file -- path/to/test.js
  }
};

console.log('→ 인자 전달 예시:');
console.log(JSON.stringify(argsScripts, null, 2));
console.log();

console.log('→ 사용법:');
console.log('   npm test -- --watch');
console.log('   npm run test:file -- src/app.test.js\n');

// 7. 실전 scripts 모음
console.log('7. 실전 scripts 모음\n');

const productionScripts = {
  scripts: {
    // 개발
    dev: 'nodemon src/index.js',
    'dev:debug': 'nodemon --inspect src/index.js',

    // 빌드
    clean: 'rm -rf dist',
    build: 'npm run clean && babel src -d dist',
    'build:watch': 'babel src -d dist --watch',

    // 테스트
    test: 'jest',
    'test:watch': 'jest --watch',
    'test:coverage': 'jest --coverage',
    'test:e2e': 'cypress run',

    // 린트
    lint: 'eslint src',
    'lint:fix': 'eslint src --fix',
    format: 'prettier --write "src/**/*.js"',
    'check:format': 'prettier --check "src/**/*.js"',

    // 타입 체크
    'type-check': 'tsc --noEmit',
    'type-check:watch': 'tsc --noEmit --watch',

    // 프로덕션
    start: 'node dist/index.js',
    'start:prod': 'cross-env NODE_ENV=production node dist/index.js',

    // CI/CD
    ci: 'npm run lint && npm run type-check && npm run test',
    prepare: 'npm run build',

    // 유틸리티
    'deps:update': 'npm update',
    'deps:check': 'npm outdated',
    'security:audit': 'npm audit',
    'security:fix': 'npm audit fix'
  }
};

console.log('→ 프로덕션 환경 scripts:');
console.log(JSON.stringify(productionScripts, null, 2));
console.log();

// 8. nodemon 설정
console.log('8. nodemon 자동 재시작\n');

console.log('→ nodemon 사용:');
console.log('   npm install --save-dev nodemon');
console.log();

const nodemonConfig = {
  scripts: {
    dev: 'nodemon src/index.js',
    'dev:debug': 'nodemon --inspect src/index.js'
  },
  nodemonConfig: {
    watch: ['src'],
    ext: 'js,json',
    ignore: ['src/**/*.test.js'],
    delay: '1000'
  }
};

console.log('→ nodemon 설정:');
console.log(JSON.stringify(nodemonConfig, null, 2));
console.log();

// 9. Best Practices
console.log('9. Best Practices\n');

const practices = [
  {
    title: '명명 규칙',
    items: [
      'start: 프로덕션 시작',
      'dev: 개발 모드',
      'test: 테스트 실행',
      'build: 빌드',
      'lint: 린트',
      '콜론(:)으로 그룹화 (test:watch, test:coverage)'
    ]
  },
  {
    title: '크로스 플랫폼',
    items: [
      'cross-env로 환경변수',
      'rimraf로 파일 삭제 (rm -rf 대신)',
      'npm-run-all로 병렬 실행',
      '플랫폼별 분기 최소화'
    ]
  },
  {
    title: '성능',
    items: [
      '병렬 실행 활용',
      '캐싱 활용',
      '증분 빌드',
      '불필요한 작업 제거'
    ]
  },
  {
    title: '협업',
    items: [
      '명확한 스크립트 이름',
      'README에 사용법 문서화',
      '일관된 네이밍',
      'package.json 주석 활용'
    ]
  }
];

practices.forEach(({ title, items }) => {
  console.log(`→ ${title}:`);
  items.forEach((item) => {
    console.log(`   - ${item}`);
  });
  console.log();
});

// 10. 유용한 패키지
console.log('10. 유용한 패키지\n');

const packages = [
  {
    name: 'nodemon',
    purpose: '파일 변경 시 자동 재시작',
    install: 'npm install --save-dev nodemon'
  },
  {
    name: 'cross-env',
    purpose: '크로스 플랫폼 환경변수',
    install: 'npm install --save-dev cross-env'
  },
  {
    name: 'npm-run-all',
    purpose: '여러 스크립트 병렬/순차 실행',
    install: 'npm install --save-dev npm-run-all'
  },
  {
    name: 'rimraf',
    purpose: '크로스 플랫폼 파일 삭제',
    install: 'npm install --save-dev rimraf'
  },
  {
    name: 'concurrently',
    purpose: '여러 명령어 동시 실행',
    install: 'npm install --save-dev concurrently'
  }
];

packages.forEach(({ name, purpose, install }) => {
  console.log(`→ ${name}:`);
  console.log(`   용도: ${purpose}`);
  console.log(`   설치: ${install}`);
  console.log();
});

/**
 * 실행:
 * node 06-package-scripts.js
 *
 * 핵심 개념:
 * - npm scripts: package.json의 자동화 도구
 * - 팀 전체가 동일한 명령어 사용
 * - CI/CD 파이프라인 구성
 *
 * 기본 명령어:
 * - npm start - start 스크립트 (run 생략 가능)
 * - npm test - test 스크립트 (run 생략 가능)
 * - npm run <script> - 그 외 스크립트
 *
 * 라이프사이클:
 * - pre<script> - 스크립트 실행 전
 * - <script> - 메인 스크립트
 * - post<script> - 스크립트 실행 후
 *
 * 연산자:
 * - && : 순차 실행 (하나 실패하면 중단)
 * - & : 병렬 실행 (플랫폼 의존적)
 * - || : 앞 명령 실패 시 다음 실행
 * - ; : 에러 무시하고 계속
 *
 * 환경 변수:
 * - Linux/Mac: NODE_ENV=production node app.js
 * - Windows: cross-env NODE_ENV=production node app.js
 * - 크로스 플랫폼: cross-env 사용 권장
 *
 * 병렬 실행:
 * - npm-run-all --parallel script1 script2
 * - concurrently "script1" "script2"
 *
 * Best Practices:
 * - 명확하고 일관된 네이밍
 * - 크로스 플랫폼 호환성
 * - 문서화 (README)
 * - 그룹화 (test:*, build:*)
 * - pre/post 훅 활용
 *
 * 활용:
 * - 개발 환경 자동화
 * - 빌드 파이프라인
 * - 테스트 자동화
 * - 배포 스크립트
 * - 코드 품질 검사
 */
