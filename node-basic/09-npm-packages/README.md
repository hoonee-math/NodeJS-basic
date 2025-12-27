# 09. npm 패키지 관리

Node.js 애플리케이션 개발에서 npm(Node Package Manager)은 필수적인 도구입니다. 이 모듈에서는 npm의 기본 개념부터 실전 활용, 보안까지 체계적으로 학습합니다.

## 학습 목표

- npm의 기본 개념과 package.json 구조 이해
- 자주 사용되는 패키지 활용법 습득
- 환경 설정 및 데이터 검증 방법 학습
- 파일 관리 유틸리티 활용
- npm scripts를 통한 작업 자동화
- 실전 CLI 도구 개발 경험
- Semantic Versioning(SemVer) 이해
- 패키지 매니저 비교 및 선택
- npm 보안 best practices 습득
- 글로벌 vs 로컬 설치 전략 이해

## 목차

### JavaScript 예제 파일

1. [01-npm-basics.js](#01-npm-basicsjs) - npm 기본 개념: package.json, dependencies, scripts
2. [02-popular-packages.js](#02-popular-packagesjs) - 인기 패키지 활용: axios, lodash, chalk, dayjs 등 실무 필수 도구
3. [03-environment-config.js](#03-environment-configjs) - 환경 변수 설정: dotenv로 안전한 설정 관리
4. [04-validation.js](#04-validationjs) - 데이터 검증: joi, validator로 데이터 무결성 확보
5. [05-file-utilities.js](#05-file-utilitiesjs) - 파일 유틸리티: fs-extra, glob, chokidar 고급 파일 처리
6. [06-package-scripts.js](#06-package-scriptsjs) - npm scripts, nodemon, cross-env
7. [07-real-world-example.js](#07-real-world-examplejs) - 실전 CLI 도구: commander, inquirer, ora로 전문가급 도구 제작

### Markdown 문서

8. [08-semver.md](#08-semvermd) - Semantic Versioning, 버전 관리: SemVer 완전 이해
9. [09-package-managers.md](#09-package-managersmd) - 패키지 매니저 비교: npm, yarn, pnpm 선택 가이드
10. [10-security.md](#10-securitymd) - npm 보안: npm audit, 취약점 대응
11. [11-global-vs-local.md](#11-global-vs-localmd) - 설치 전략: 로컬 vs 글로벌, npx 활용

## 예제 파일 상세

### 01-npm-basics.js

npm의 핵심 개념을 학습합니다.

**주요 내용:**
- npm이란 무엇인가?
- package.json 구조와 주요 필드
- 주요 npm 명령어
- dependencies vs devDependencies
- Semantic Versioning 기본

**핵심 개념:**
```javascript
// package.json 기본 구조
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "프로젝트 설명",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.0"  // 프로덕션 의존성
  },
  "devDependencies": {
    "jest": "^29.0.0"     // 개발 의존성
  }
}
```

**주요 명령어:**
- `npm init` - 프로젝트 초기화
- `npm install` - 패키지 설치
- `npm install <package>` - 특정 패키지 설치
- `npm install --save-dev <package>` - 개발 의존성 설치
- `npm uninstall <package>` - 패키지 제거
- `npm update` - 패키지 업데이트

### 02-popular-packages.js

실무에서 자주 사용되는 패키지를 실습합니다.

**필요 패키지:**
```bash
npm install axios lodash chalk dayjs
```

**주요 패키지:**

1. **axios** - HTTP 클라이언트
   ```javascript
   const axios = require('axios');
   const response = await axios.get('https://api.example.com/data');
   ```

2. **lodash** - JavaScript 유틸리티
   ```javascript
   const _ = require('lodash');
   const sum = _.sum([1, 2, 3, 4, 5]);
   const chunks = _.chunk([1, 2, 3, 4, 5], 2);
   ```

3. **chalk** - 터미널 색상
   ```javascript
   const chalk = require('chalk');
   console.log(chalk.green('성공!'));
   console.log(chalk.red.bold('에러!'));
   ```

4. **dayjs** - 날짜/시간 처리
   ```javascript
   const dayjs = require('dayjs');
   const now = dayjs();
   const formatted = now.format('YYYY-MM-DD HH:mm:ss');
   ```

**활용 사례:**
- API 통신 (axios)
- 데이터 변환 및 조작 (lodash)
- CLI 도구 출력 향상 (chalk)
- 날짜 포맷팅 (dayjs)

### 03-environment-config.js

환경 변수를 안전하게 관리하는 방법을 학습합니다.

**필요 패키지:**
```bash
npm install dotenv
```

**주요 내용:**
- `.env` 파일 생성 및 관리
- `dotenv` 패키지 사용
- 환경별 설정 분리
- 환경 변수 검증

**핵심 패턴:**
```javascript
require('dotenv').config();

// 환경 변수 접근
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Config 클래스 패턴
class Config {
  constructor() {
    this.database = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME
    };
  }
}
```

**.env 파일 예시:**
```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
API_KEY=your-secret-key
```

**보안 주의사항:**
- `.env` 파일을 `.gitignore`에 추가
- 민감한 정보는 절대 코드에 하드코딩하지 않기
- 프로덕션 환경에서는 환경 변수로 관리

### 04-validation.js

데이터 검증 라이브러리를 활용합니다.

**필요 패키지:**
```bash
npm install joi validator
```

**주요 패키지:**

1. **joi** - 스키마 기반 검증
   ```javascript
   const Joi = require('joi');

   const userSchema = Joi.object({
     name: Joi.string().min(2).max(50).required(),
     email: Joi.string().email().required(),
     age: Joi.number().integer().min(0).max(150)
   });

   const { error, value } = userSchema.validate(data);
   ```

2. **validator** - 문자열 검증
   ```javascript
   const validator = require('validator');

   validator.isEmail('test@example.com');     // true
   validator.isURL('https://example.com');    // true
   validator.isCreditCard('1234-5678-9012-3456');
   ```

**활용 사례:**
- API 요청 데이터 검증
- 폼 입력 검증
- 설정 파일 검증
- 데이터 무결성 확인

### 05-file-utilities.js

파일 시스템 작업을 더 쉽게 만드는 유틸리티를 학습합니다.

**필요 패키지:**
```bash
npm install fs-extra glob chokidar
```

**주요 패키지:**

1. **fs-extra** - 향상된 파일 시스템
   ```javascript
   const fs = require('fs-extra');

   await fs.ensureDir('/path/to/dir');        // 디렉토리 생성 (부모 포함)
   await fs.copy('/src', '/dest');            // 복사
   await fs.move('/old', '/new');             // 이동
   await fs.readJson('data.json');            // JSON 읽기
   await fs.writeJson('data.json', obj);      // JSON 쓰기
   ```

2. **glob** - 파일 패턴 매칭
   ```javascript
   const glob = require('glob');

   const jsFiles = glob.sync('**/*.js');      // 모든 .js 파일
   const testFiles = glob.sync('test/**/*.test.js');
   ```

3. **chokidar** - 파일 감시
   ```javascript
   const chokidar = require('chokidar');

   const watcher = chokidar.watch('src/**/*');
   watcher.on('change', (path) => {
     console.log(`파일 변경: ${path}`);
   });
   ```

**활용 사례:**
- 파일 복사/이동/삭제
- 설정 파일 관리
- 빌드 도구 개발
- 파일 감시 및 자동화

### 06-package-scripts.js

npm scripts를 통한 작업 자동화를 학습합니다.

**필요 패키지:**
```bash
npm install --save-dev nodemon cross-env npm-run-all
```

**주요 내용:**
- npm scripts 기본 개념
- pre/post 스크립트 훅
- 환경 변수 설정 (cross-env)
- 병렬 실행 (npm-run-all)

**package.json scripts 예시:**
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "build": "webpack --config webpack.config.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write src/**/*.js",
    "prebuild": "npm run lint",
    "postbuild": "npm run test",
    "clean": "rm -rf dist",
    "all": "npm-run-all clean build test"
  }
}
```

**유용한 패키지:**
- **nodemon** - 파일 변경 감지 및 자동 재시작
- **cross-env** - 크로스 플랫폼 환경 변수 설정
- **npm-run-all** - 여러 스크립트 병렬/순차 실행

### 07-real-world-example.js

실전 CLI 도구를 개발하며 종합적으로 학습합니다.

**필요 패키지:**
```bash
npm install commander inquirer ora chalk
```

**프로젝트 개요:**
파일 정리 유틸리티 - 디렉토리의 파일을 확장자별로 자동 정리

**주요 패키지:**

1. **commander** - CLI 프레임워크
   ```javascript
   const { program } = require('commander');

   program
     .command('organize')
     .description('파일을 확장자별로 정리')
     .option('-d, --dir <directory>', '대상 디렉토리')
     .action((options) => {
       // 실행 로직
     });
   ```

2. **inquirer** - 대화형 프롬프트
   ```javascript
   const inquirer = require('inquirer');

   const answers = await inquirer.prompt([
     {
       type: 'confirm',
       name: 'proceed',
       message: '계속하시겠습니까?'
     }
   ]);
   ```

3. **ora** - 로딩 스피너
   ```javascript
   const ora = require('ora');

   const spinner = ora('처리 중...').start();
   // 작업 수행
   spinner.succeed('완료!');
   ```

4. **chalk** - 터미널 색상 (재활용)

**명령어 예시:**
```bash
node 07-real-world-example.js organize
node 07-real-world-example.js organize -d ./test
node 07-real-world-example.js stats
node 07-real-world-example.js clean
```

## Markdown 문서

### 08-semver.md

Semantic Versioning(시맨틱 버전 관리) 완전 가이드

**주요 내용:**
- MAJOR.MINOR.PATCH 버전 체계
- 버전 범위 표기법 (^, ~, exact)
- Pre-release 버전 (alpha, beta, rc)
- npm version 명령어
- 버전 선택 best practices

**핵심 개념:**
```
1.2.3
│ │ └─ PATCH: 버그 수정
│ └─── MINOR: 기능 추가 (하위 호환)
└───── MAJOR: Breaking changes

^1.2.3  → 1.2.3 이상 2.0.0 미만
~1.2.3  → 1.2.3 이상 1.3.0 미만
1.2.3   → 정확히 1.2.3
```

### 09-package-managers.md

npm, yarn, pnpm 패키지 매니저 비교 가이드

**주요 내용:**
- npm, yarn, pnpm 특징 비교
- 성능 및 디스크 사용량 벤치마크
- 명령어 비교표
- Lock 파일 형식 비교
- 워크스페이스/모노레포 지원
- 선택 가이드

**비교 요약:**
| 항목 | npm | yarn | pnpm |
|------|-----|------|------|
| 속도 | ⚡ | ⚡⚡ | ⚡⚡⚡ |
| 디스크 | 💾💾💾 | 💾💾💾 | 💾 |
| 학습 곡선 | 쉬움 | 보통 | 보통 |
| 커뮤니티 | 최대 | 큼 | 성장 중 |

### 10-security.md

npm 보안 완전 가이드

**주요 내용:**
- npm audit 사용법
- 취약점 대응 전략
- package-lock.json의 중요성
- 악성 패키지 방지
- Typosquatting 공격 주의
- 환경 변수 보안
- 의존성 트리 관리
- 보안 체크리스트
- CI/CD 보안 설정

**핵심 명령어:**
```bash
npm audit              # 취약점 검사
npm audit fix          # 자동 수정
npm audit fix --force  # 강제 수정
npm ci                 # 클린 설치 (CI/CD)
```

### 11-global-vs-local.md

글로벌 vs 로컬 패키지 설치 완전 가이드

**주요 내용:**
- 로컬 설치 vs 글로벌 설치
- 설치 위치 및 사용법
- npx의 등장과 활용
- 비교표 및 선택 가이드
- 권한 문제 해결
- Best practices

**핵심 원칙:**
```
1. 기본은 로컬 설치
2. CLI 도구만 글로벌 설치
3. 일회성 명령은 npx 사용
4. 팀 프로젝트는 package.json에 모두 기록
```

## 실습 가이드

### 1. 패키지 설치

```bash
# 디렉토리 이동
cd node-basic/09-npm-packages

# 모든 패키지 설치
npm install
```

### 2. 기본 예제 실행

```bash
# npm 기본 개념
npm run basics

# 인기 패키지 활용
npm run popular

# 환경 변수 설정
npm run env

# 데이터 검증
npm run validation

# 파일 유틸리티
npm run file

# npm scripts
npm run scripts
```

### 3. CLI 도구 실행

```bash
# 파일 정리 (대화형)
npm run organize

# 파일 정리 (자동 확인)
npm run organize:yes

# 파일 통계
npm run stats

# 빈 디렉토리 정리
npm run clean
```

### 4. 개발 모드

```bash
# nodemon으로 자동 재시작
npm run dev
```

### 5. 모든 예제 순차 실행

```bash
npm run all
```

## 핵심 정리

### npm 기본 워크플로우

```bash
# 1. 프로젝트 초기화
npm init -y

# 2. 패키지 설치
npm install express
npm install --save-dev jest

# 3. 스크립트 실행
npm start
npm test

# 4. 업데이트
npm update

# 5. 보안 검사
npm audit
npm audit fix
```

### package.json 핵심 구조

```json
{
  "name": "project-name",
  "version": "1.0.0",
  "description": "프로젝트 설명",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 자주 사용하는 패키지 카테고리

**웹 프레임워크:**
- express, koa, fastify

**HTTP 클라이언트:**
- axios, node-fetch

**유틸리티:**
- lodash, ramda, underscore

**날짜/시간:**
- dayjs, moment (deprecated), date-fns

**검증:**
- joi, yup, validator, zod

**환경 설정:**
- dotenv, config

**테스트:**
- jest, mocha, chai, supertest

**빌드 도구:**
- webpack, vite, rollup

**CLI 도구:**
- commander, inquirer, chalk, ora

**파일 작업:**
- fs-extra, glob, chokidar

### Semantic Versioning 요약

```
버전 표기법:
^1.2.3  → MINOR, PATCH 업데이트 허용 (권장)
~1.2.3  → PATCH만 허용 (안정성 중시)
1.2.3   → 정확한 버전 고정
>=1.2.3 → 1.2.3 이상
*       → 모든 버전 (비권장)

버전 증가 규칙:
1.0.0 → 1.0.1  (PATCH: 버그 수정)
1.0.1 → 1.1.0  (MINOR: 기능 추가)
1.1.0 → 2.0.0  (MAJOR: Breaking change)
```

### 보안 체크리스트

**설치 전:**
- [ ] 패키지 이름 정확히 확인 (typosquatting 주의)
- [ ] GitHub 저장소 확인 (stars, 활동성)
- [ ] 다운로드 수 확인
- [ ] 라이선스 확인

**설치 후:**
- [ ] `npm audit` 실행
- [ ] `package-lock.json` 커밋
- [ ] `.env` 파일을 `.gitignore`에 추가
- [ ] 의존성 트리 검토

**정기적으로:**
- [ ] 주간/월간 `npm audit` 실행
- [ ] 패키지 업데이트 (`npm update`)
- [ ] 사용하지 않는 패키지 제거

### Best Practices

1. **package.json 관리**
   - 정확한 버전 범위 사용 (^, ~)
   - engines 필드로 Node.js 버전 명시
   - scripts로 작업 자동화

2. **의존성 관리**
   - 필요한 패키지만 설치
   - dependencies vs devDependencies 구분
   - package-lock.json 항상 커밋

3. **보안**
   - 정기적으로 `npm audit` 실행
   - 환경 변수로 민감 정보 관리
   - 신뢰할 수 있는 패키지만 사용

4. **개발 효율성**
   - npm scripts로 반복 작업 자동화
   - nodemon으로 개발 서버 자동 재시작
   - 로컬 설치 우선, CLI 도구만 글로벌

5. **협업**
   - package-lock.json 공유
   - README에 설치 방법 명시
   - CI/CD에서 `npm ci` 사용

## 참고 자료

### 공식 문서

- [npm 공식 문서](https://docs.npmjs.com/)
- [package.json 문서](https://docs.npmjs.com/cli/configuring-npm/package-json)
- [Semantic Versioning](https://semver.org/)
- [Node.js 공식 문서](https://nodejs.org/docs/)

### 패키지 문서

- [axios](https://axios-http.com/)
- [lodash](https://lodash.com/)
- [dotenv](https://github.com/motdotla/dotenv)
- [joi](https://joi.dev/)
- [commander](https://github.com/tj/commander.js)
- [inquirer](https://github.com/SBoudrias/Inquirer.js)

### 학습 자료

- [npm-check - 패키지 업데이트 도구](https://www.npmjs.com/package/npm-check)
- [Snyk - 보안 스캐너](https://snyk.io/)
- [npm trends - 패키지 트렌드](https://npmtrends.com/)
- [bundlephobia - 패키지 크기 확인](https://bundlephobia.com/)

### 보안

- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [GitHub Security Advisories](https://github.com/advisories)
- [Snyk Vulnerability Database](https://snyk.io/vuln/)

## 다음 단계

09-npm-packages 모듈을 완료했다면:

1. **10-mini-projects/** - 실전 미니 프로젝트로 종합 응용
2. **ts-basic/** - TypeScript로 타입 안전성 추가
3. **nest-basic/** - NestJS 프레임워크 학습

## 추가 실습 아이디어

1. **나만의 CLI 도구 만들기**
   - commander, inquirer 활용
   - npm에 퍼블리시

2. **환경별 설정 관리**
   - development, staging, production 분리
   - dotenv-flow 활용

3. **자동화 스크립트**
   - 배포 자동화
   - 테스트 자동화
   - 코드 품질 검사 자동화

4. **모노레포 구성**
   - npm workspaces 또는 pnpm 활용
   - 여러 패키지를 하나의 저장소에서 관리

5. **npm 패키지 퍼블리시**
   - 유용한 유틸리티 라이브러리 개발
   - npm에 공개하여 다른 개발자와 공유
