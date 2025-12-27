/**
 * 01-npm-basics.js
 *
 * npm (Node Package Manager) 기본 개념
 */

console.log('=== npm 기본 개념 ===\n');

// 1. npm이란?
console.log('1. npm이란?\n');
console.log('→ npm (Node Package Manager)');
console.log('   - Node.js의 공식 패키지 관리자');
console.log('   - 오픈소스 라이브러리를 쉽게 설치하고 관리');
console.log('   - 현재 세계 최대 소프트웨어 레지스트리');
console.log('   - https://www.npmjs.com\n');

// 2. package.json
console.log('2. package.json - 프로젝트 설정 파일\n');

const examplePackageJson = {
  name: 'my-project',
  version: '1.0.0',
  description: '프로젝트 설명',
  main: 'index.js',
  scripts: {
    start: 'node index.js',
    test: 'echo "Error: no test specified" && exit 1'
  },
  keywords: ['node', 'example'],
  author: 'Your Name',
  license: 'MIT',
  dependencies: {
    axios: '^1.6.0',
    lodash: '^4.17.21'
  },
  devDependencies: {
    nodemon: '^3.0.0'
  }
};

console.log('→ package.json 구조:');
console.log(JSON.stringify(examplePackageJson, null, 2));
console.log();

// 3. 주요 필드 설명
console.log('3. package.json 주요 필드\n');

const fields = [
  {
    field: 'name',
    description: '패키지 이름 (소문자, 하이픈 또는 언더스코어)',
    example: '"my-awesome-package"'
  },
  {
    field: 'version',
    description: '버전 (Semantic Versioning: major.minor.patch)',
    example: '"1.2.3"'
  },
  {
    field: 'description',
    description: '프로젝트 설명',
    example: '"A simple Node.js app"'
  },
  {
    field: 'main',
    description: '진입점 파일',
    example: '"index.js"'
  },
  {
    field: 'scripts',
    description: 'npm 스크립트 명령어',
    example: '{"start": "node index.js"}'
  },
  {
    field: 'dependencies',
    description: '프로덕션 의존성 (배포 시 필요)',
    example: '{"express": "^4.18.0"}'
  },
  {
    field: 'devDependencies',
    description: '개발 의존성 (개발 중에만 필요)',
    example: '{"nodemon": "^3.0.0"}'
  }
];

fields.forEach(({ field, description, example }) => {
  console.log(`→ ${field}:`);
  console.log(`   ${description}`);
  console.log(`   예시: ${example}\n`);
});

// 4. npm 명령어
console.log('4. 주요 npm 명령어\n');

const commands = [
  {
    command: 'npm init',
    description: '새 package.json 생성 (대화형)',
    example: 'npm init'
  },
  {
    command: 'npm init -y',
    description: '기본 설정으로 package.json 생성',
    example: 'npm init -y'
  },
  {
    command: 'npm install',
    description: 'package.json의 모든 의존성 설치',
    example: 'npm install'
  },
  {
    command: 'npm install <패키지>',
    description: '특정 패키지 설치 (dependencies)',
    example: 'npm install axios'
  },
  {
    command: 'npm install <패키지> --save-dev',
    description: '개발 의존성으로 설치 (devDependencies)',
    example: 'npm install nodemon --save-dev'
  },
  {
    command: 'npm install <패키지>@<버전>',
    description: '특정 버전 설치',
    example: 'npm install lodash@4.17.20'
  },
  {
    command: 'npm uninstall <패키지>',
    description: '패키지 제거',
    example: 'npm uninstall axios'
  },
  {
    command: 'npm update',
    description: '패키지 업데이트',
    example: 'npm update'
  },
  {
    command: 'npm outdated',
    description: '오래된 패키지 확인',
    example: 'npm outdated'
  },
  {
    command: 'npm list',
    description: '설치된 패키지 목록',
    example: 'npm list --depth=0'
  }
];

commands.forEach(({ command, description, example }) => {
  console.log(`→ ${command}`);
  console.log(`   ${description}`);
  console.log(`   $ ${example}\n`);
});

// 5. dependencies vs devDependencies
console.log('5. dependencies vs devDependencies\n');

console.log('→ dependencies (프로덕션 의존성):');
console.log('   - 앱이 실행되는 데 필요한 패키지');
console.log('   - 배포 시에도 포함됨');
console.log('   - 예: express, axios, lodash\n');

console.log('→ devDependencies (개발 의존성):');
console.log('   - 개발 중에만 필요한 패키지');
console.log('   - 배포 시 제외됨 (npm install --production)');
console.log('   - 예: nodemon, jest, eslint\n');

// 6. node_modules
console.log('6. node_modules 디렉토리\n');

console.log('→ node_modules:');
console.log('   - 설치된 패키지들이 저장되는 폴더');
console.log('   - 패키지와 그 의존성들이 모두 포함');
console.log('   - Git에 커밋하지 않음 (.gitignore)');
console.log('   - npm install로 재생성 가능\n');

// 7. package-lock.json
console.log('7. package-lock.json\n');

console.log('→ package-lock.json:');
console.log('   - 정확한 의존성 트리 기록');
console.log('   - 버전 고정으로 일관된 설치 보장');
console.log('   - 팀원 간 동일한 패키지 버전 유지');
console.log('   - Git에 커밋해야 함');
console.log('   - 자동 생성됨 (수동 편집 금지)\n');

// 8. 버전 표기법 (Semantic Versioning)
console.log('8. 버전 표기법 (SemVer)\n');

const versionExamples = [
  {
    notation: '^1.2.3',
    description: '1.x.x (minor와 patch 업데이트 허용)',
    example: '1.2.3, 1.3.0, 1.9.9 가능, 2.0.0 불가'
  },
  {
    notation: '~1.2.3',
    description: '1.2.x (patch 업데이트만 허용)',
    example: '1.2.3, 1.2.4, 1.2.9 가능, 1.3.0 불가'
  },
  {
    notation: '1.2.3',
    description: '정확히 1.2.3 (고정 버전)',
    example: '1.2.3만 가능'
  },
  {
    notation: '>=1.2.3',
    description: '1.2.3 이상',
    example: '1.2.3, 1.2.4, 2.0.0 모두 가능'
  },
  {
    notation: '*',
    description: '모든 버전',
    example: '최신 버전 (권장하지 않음)'
  }
];

versionExamples.forEach(({ notation, description, example }) => {
  console.log(`→ ${notation}`);
  console.log(`   ${description}`);
  console.log(`   ${example}\n`);
});

// 9. npm scripts
console.log('9. npm scripts\n');

console.log('→ npm scripts 실행:');
console.log('   npm start      # "start" 스크립트 실행');
console.log('   npm test       # "test" 스크립트 실행');
console.log('   npm run build  # "build" 스크립트 실행');
console.log('   npm run dev    # "dev" 스크립트 실행\n');

const scriptsExample = {
  scripts: {
    start: 'node index.js',
    dev: 'nodemon index.js',
    test: 'jest',
    build: 'webpack --mode production',
    lint: 'eslint .'
  }
};

console.log('→ scripts 예시:');
console.log(JSON.stringify(scriptsExample, null, 2));
console.log();

// 10. 실습 가이드
console.log('10. 실습 가이드\n');

console.log('→ 새 프로젝트 시작:');
console.log('   1. mkdir my-project && cd my-project');
console.log('   2. npm init -y');
console.log('   3. npm install axios');
console.log('   4. npm install nodemon --save-dev');
console.log('   5. package.json의 scripts 수정');
console.log('   6. npm start로 실행\n');

/**
 * 실행:
 * node 01-npm-basics.js
 *
 * 핵심 개념:
 * - npm: Node.js 패키지 관리자
 * - package.json: 프로젝트 설정 및 의존성 정의
 * - node_modules: 설치된 패키지 저장소
 * - package-lock.json: 정확한 버전 고정
 *
 * 주요 명령어:
 * - npm init: 프로젝트 초기화
 * - npm install: 패키지 설치
 * - npm uninstall: 패키지 제거
 * - npm update: 패키지 업데이트
 * - npm run <script>: 스크립트 실행
 *
 * 의존성 타입:
 * - dependencies: 프로덕션 의존성 (배포 시 필요)
 * - devDependencies: 개발 의존성 (개발 중에만)
 *
 * SemVer (Semantic Versioning):
 * - major.minor.patch (예: 1.2.3)
 * - ^: minor, patch 업데이트 허용
 * - ~: patch 업데이트만 허용
 * - 정확한 버전: 고정
 *
 * Best Practices:
 * - package.json과 package-lock.json 모두 커밋
 * - node_modules는 .gitignore에 추가
 * - 프로덕션 의존성과 개발 의존성 구분
 * - npm scripts로 일관된 명령어 사용
 * - 버전 범위 신중하게 지정 (^보다 ~가 안전)
 *
 * 주의사항:
 * - package-lock.json 수동 편집 금지
 * - node_modules 직접 수정 금지
 * - npm install 전에 package.json 확인
 * - 전역 패키지는 최소화
 *
 * 다음 단계:
 * - 인기 패키지 활용
 * - 환경 설정 관리
 * - 패키지 보안
 */
