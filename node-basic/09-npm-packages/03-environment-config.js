/**
 * 03-environment-config.js
 *
 * 환경 설정 관리 (dotenv)
 *
 * 설치 필요:
 * npm install dotenv
 */

console.log('=== 환경 설정 관리 ===\n');

const fs = require('fs');
const path = require('path');

// 패키지 가용성 확인
function checkPackage(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (err) {
    return false;
  }
}

// 1. 환경 변수란?
console.log('1. 환경 변수란?\n');

console.log('→ 환경 변수 (Environment Variables):');
console.log('   - 애플리케이션 외부에서 설정값 주입');
console.log('   - 민감한 정보 (API 키, DB 비밀번호) 보호');
console.log('   - 환경별 설정 분리 (개발/스테이징/프로덕션)');
console.log('   - Git에 커밋하지 않음\n');

// 2. process.env
console.log('2. process.env - 기본 환경 변수\n');

console.log('→ Node.js 기본 환경 변수:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '(설정 안 됨)'}`);
console.log(`   PATH: ${process.env.PATH?.substring(0, 50)}...`);
console.log(`   HOME: ${process.env.HOME || process.env.USERPROFILE}`);
console.log();

// 3. .env 파일 생성
console.log('3. .env 파일 생성\n');

const envContent = `# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_db
DB_USER=admin
DB_PASSWORD=secret123

# API 설정
API_KEY=abc123xyz789
API_URL=https://api.example.com

# 앱 설정
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# 외부 서비스
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=user@gmail.com
SMTP_PASS=email_password
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('→ .env 파일 생성됨');
} else {
  console.log('→ .env 파일이 이미 존재함');
}

console.log('→ .env 파일 내용:');
console.log(envContent);

// 4. dotenv 사용
console.log('4. dotenv로 환경 변수 로드\n');

if (checkPackage('dotenv')) {
  require('dotenv').config();

  console.log('→ 로드된 환경 변수:');
  console.log(`   DB_HOST: ${process.env.DB_HOST}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME}`);
  console.log(`   DB_USER: ${process.env.DB_USER}`);
  console.log(`   DB_PASSWORD: ${'*'.repeat(process.env.DB_PASSWORD?.length || 0)}`);
  console.log();

  console.log('→ API 설정:');
  console.log(`   API_KEY: ${process.env.API_KEY?.substring(0, 6)}...`);
  console.log(`   API_URL: ${process.env.API_URL}`);
  console.log();

  console.log('→ 앱 설정:');
  console.log(`   PORT: ${process.env.PORT}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`   LOG_LEVEL: ${process.env.LOG_LEVEL}`);
  console.log();
} else {
  console.log('→ dotenv가 설치되지 않았습니다');
  console.log('   설치: npm install dotenv');
  console.log();
}

// 5. 환경별 설정 분리
setTimeout(() => {
  console.log('5. 환경별 설정 분리\n');

  const environments = {
    development: {
      name: '개발 환경',
      config: {
        DB_HOST: 'localhost',
        API_URL: 'http://localhost:3000',
        DEBUG: 'true',
        LOG_LEVEL: 'debug'
      }
    },
    staging: {
      name: '스테이징 환경',
      config: {
        DB_HOST: 'staging-db.example.com',
        API_URL: 'https://staging-api.example.com',
        DEBUG: 'false',
        LOG_LEVEL: 'info'
      }
    },
    production: {
      name: '프로덕션 환경',
      config: {
        DB_HOST: 'prod-db.example.com',
        API_URL: 'https://api.example.com',
        DEBUG: 'false',
        LOG_LEVEL: 'error'
      }
    }
  };

  Object.entries(environments).forEach(([env, { name, config }]) => {
    console.log(`→ ${name} (.env.${env}):`);
    Object.entries(config).forEach(([key, value]) => {
      console.log(`   ${key}=${value}`);
    });
    console.log();
  });
}, 100);

// 6. 설정 검증
setTimeout(() => {
  console.log('6. 설정 검증\n');

  function validateConfig() {
    const required = [
      'DB_HOST',
      'DB_PORT',
      'DB_NAME',
      'API_KEY',
      'PORT'
    ];

    const missing = [];

    console.log('→ 필수 환경 변수 확인:');

    required.forEach((key) => {
      if (process.env[key]) {
        console.log(`   ✓ ${key}: 설정됨`);
      } else {
        console.log(`   ✗ ${key}: 누락!`);
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      console.log(`\n   [경고] ${missing.length}개 환경 변수 누락`);
      console.log(`   누락된 변수: ${missing.join(', ')}`);
    } else {
      console.log('\n   모든 필수 환경 변수가 설정됨');
    }
  }

  validateConfig();
  console.log();
}, 200);

// 7. 타입 변환
setTimeout(() => {
  console.log('7. 환경 변수 타입 변환\n');

  console.log('→ 환경 변수는 모두 문자열:');

  const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    debug: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    maxConnections: parseInt(process.env.MAX_CONNECTIONS || '10', 10),
    timeout: parseFloat(process.env.TIMEOUT || '30.0')
  };

  console.log('   타입 변환된 설정:');
  Object.entries(config).forEach(([key, value]) => {
    console.log(`   ${key}: ${value} (${typeof value})`);
  });
  console.log();
}, 300);

// 8. Config 클래스 패턴
setTimeout(() => {
  console.log('8. Config 클래스 패턴\n');

  class Config {
    constructor() {
      this.load();
    }

    load() {
      this.database = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        name: process.env.DB_NAME || 'myapp',
        user: process.env.DB_USER || 'admin',
        password: process.env.DB_PASSWORD || ''
      };

      this.api = {
        key: process.env.API_KEY || '',
        url: process.env.API_URL || '',
        timeout: parseInt(process.env.API_TIMEOUT || '5000', 10)
      };

      this.app = {
        port: parseInt(process.env.PORT || '3000', 10),
        env: process.env.NODE_ENV || 'development',
        logLevel: process.env.LOG_LEVEL || 'info'
      };
    }

    validate() {
      if (!this.database.password) {
        throw new Error('DB_PASSWORD is required');
      }

      if (!this.api.key) {
        throw new Error('API_KEY is required');
      }

      return true;
    }

    getConnectionString() {
      const { host, port, name, user, password } = this.database;
      return `postgresql://${user}:${password}@${host}:${port}/${name}`;
    }

    isDevelopment() {
      return this.app.env === 'development';
    }

    isProduction() {
      return this.app.env === 'production';
    }
  }

  const config = new Config();

  console.log('→ Config 클래스 사용:');
  console.log('   데이터베이스:', config.database.host);
  console.log('   API URL:', config.api.url);
  console.log('   포트:', config.app.port);
  console.log('   개발 환경?', config.isDevelopment());
  console.log('   프로덕션?', config.isProduction());
  console.log();
}, 400);

// 9. .gitignore
setTimeout(() => {
  console.log('9. .gitignore 설정\n');

  const gitignoreContent = `# 환경 변수 파일
.env
.env.local
.env.*.local

# 프로덕션 환경 변수 (절대 커밋 금지!)
.env.production

# 로그 파일
*.log

# 의존성
node_modules/

# 빌드 결과
dist/
build/
`;

  console.log('→ .gitignore 에 추가해야 할 항목:');
  console.log(gitignoreContent);

  // .env.example 생성
  const envExampleContent = `# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp_db
DB_USER=your_username
DB_PASSWORD=your_password

# API 설정
API_KEY=your_api_key
API_URL=https://api.example.com

# 앱 설정
PORT=3000
NODE_ENV=development
`;

  const envExamplePath = path.join(__dirname, '.env.example');

  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envExampleContent);
    console.log('→ .env.example 파일 생성됨 (Git에 커밋)');
  }

  console.log();
}, 500);

// 10. Best Practices
setTimeout(() => {
  console.log('10. Best Practices\n');

  const practices = [
    {
      title: '.env 파일 관리',
      items: [
        '.env 파일은 Git에 커밋하지 않기',
        '.env.example을 Git에 커밋하여 템플릿 제공',
        '환경별 파일 분리 (.env.development, .env.production)',
        '민감한 정보는 절대 코드에 하드코딩 금지'
      ]
    },
    {
      title: '환경 변수 네이밍',
      items: [
        '대문자와 언더스코어 사용 (DB_HOST)',
        '접두사로 그룹화 (DB_*, API_*, SMTP_*)',
        '명확하고 설명적인 이름 사용',
        '일관된 네이밍 컨벤션 유지'
      ]
    },
    {
      title: '보안',
      items: [
        'API 키, 비밀번호는 환경 변수로만',
        '프로덕션 환경 변수는 별도 관리',
        '로그에 민감한 정보 출력 금지',
        '정기적으로 비밀번호 변경'
      ]
    },
    {
      title: '검증',
      items: [
        '애플리케이션 시작 시 필수 변수 확인',
        '타입 변환 및 검증',
        '기본값 설정',
        '명확한 에러 메시지'
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
}, 600);

/**
 * 실행:
 * npm install dotenv
 * node 03-environment-config.js
 *
 * 핵심 개념:
 * - 환경 변수: 애플리케이션 외부 설정
 * - .env 파일: 환경 변수 정의
 * - dotenv: .env 파일을 process.env로 로드
 * - 환경별 분리: 개발/스테이징/프로덕션
 *
 * dotenv 사용법:
 * 1. npm install dotenv
 * 2. .env 파일 생성
 * 3. require('dotenv').config()
 * 4. process.env.VARIABLE_NAME 사용
 *
 * .env 파일 구조:
 * KEY=value
 * DB_HOST=localhost
 * API_KEY=abc123
 *
 * 환경별 파일:
 * - .env - 기본 설정
 * - .env.development - 개발 환경
 * - .env.staging - 스테이징 환경
 * - .env.production - 프로덕션 환경
 * - .env.example - Git 커밋용 템플릿
 *
 * 타입 변환:
 * - parseInt(process.env.PORT, 10) - 숫자
 * - process.env.DEBUG === 'true' - 불린
 * - parseFloat(process.env.TIMEOUT) - 실수
 *
 * Best Practices:
 * - .env는 Git에 커밋 금지
 * - .env.example은 Git에 커밋
 * - 민감한 정보는 환경 변수로만
 * - 애플리케이션 시작 시 검증
 * - 기본값 제공
 *
 * 주의사항:
 * - 모든 환경 변수는 문자열
 * - 타입 변환 필요 (parseInt, parseFloat 등)
 * - .env 파일은 로컬 개발용
 * - 프로덕션은 서버 환경 변수 사용
 */
