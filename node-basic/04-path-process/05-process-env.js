/**
 * 05-process-env.js
 *
 * 환경 변수 (Environment Variables)
 * process.env 활용법
 */

console.log('=== 환경 변수 (process.env) ===\n');

// ============================================
// 1. process.env 기본
// ============================================
console.log('1. process.env 기본\n');

console.log('   주요 환경 변수:');
console.log('   - NODE_ENV:', process.env.NODE_ENV || '(설정 안 됨)');
console.log('   - PORT:', process.env.PORT || '(설정 안 됨)');
console.log('   - HOME:', process.env.HOME || process.env.USERPROFILE);
console.log('   - PATH 개수:', process.env.PATH.split(require('path').delimiter).length);
console.log('\n   → process.env는 시스템 환경 변수 객체\n');

// ============================================
// 2. 환경 변수 읽기
// ============================================
console.log('2. 환경 변수 읽기\n');

const nodeEnv = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

console.log('   읽어온 값:');
console.log(`   - NODE_ENV: ${nodeEnv}`);
console.log(`   - PORT: ${port}`);
console.log(`   - HOST: ${host}`);
console.log('\n   → 기본값 패턴: process.env.KEY || defaultValue\n');

// ============================================
// 3. 환경 변수 설정 (런타임)
// ============================================
console.log('3. 환경 변수 설정 (런타임)\n');

// 런타임에 환경 변수 추가/변경
process.env.MY_CUSTOM_VAR = 'custom-value';
process.env.API_KEY = 'secret-key-12345';

console.log('   설정한 변수:');
console.log('   - MY_CUSTOM_VAR:', process.env.MY_CUSTOM_VAR);
console.log('   - API_KEY:', process.env.API_KEY);
console.log('\n   ⚠️  런타임 변경은 현재 프로세스에만 영향\n');

// ============================================
// 4. 환경별 설정 분기
// ============================================
console.log('4. 환경별 설정 분기\n');

function getConfig() {
  const env = process.env.NODE_ENV || 'development';

  const configs = {
    development: {
      port: 3000,
      dbUrl: 'mongodb://localhost:27017/dev',
      logLevel: 'debug'
    },
    production: {
      port: process.env.PORT || 80,
      dbUrl: process.env.DATABASE_URL,
      logLevel: 'error'
    },
    test: {
      port: 4000,
      dbUrl: 'mongodb://localhost:27017/test',
      logLevel: 'silent'
    }
  };

  return configs[env] || configs.development;
}

const config = getConfig();
console.log('   현재 환경:', process.env.NODE_ENV || 'development');
console.log('   설정:', config);
console.log('\n   → NODE_ENV로 환경별 설정 관리\n');

// ============================================
// 5. boolean 환경 변수 처리
// ============================================
console.log('5. boolean 환경 변수 처리\n');

// 환경 변수는 항상 문자열!
process.env.DEBUG = 'true';
process.env.ENABLE_CACHE = 'false';

// ❌ 잘못된 방법
const debugWrong = process.env.DEBUG;  // 'true' (문자열, truthy!)
const cacheWrong = process.env.ENABLE_CACHE;  // 'false' (문자열, truthy!)

// ✅ 올바른 방법
const debugCorrect = process.env.DEBUG === 'true';
const cacheCorrect = process.env.ENABLE_CACHE === 'true';

console.log('   잘못된 방법:');
console.log('   - DEBUG:', debugWrong, typeof debugWrong);
console.log('   - if (debugWrong) → 항상 true! (문자열이므로)');
console.log();
console.log('   올바른 방법:');
console.log('   - DEBUG:', debugCorrect, typeof debugCorrect);
console.log('   - ENABLE_CACHE:', cacheCorrect, typeof cacheCorrect);
console.log('\n   → 반드시 === "true"로 비교\n');

// ============================================
// 6. 숫자 환경 변수 변환
// ============================================
console.log('6. 숫자 환경 변수 변환\n');

process.env.MAX_CONNECTIONS = '100';
process.env.TIMEOUT = '30';

function getEnvNumber(key, defaultValue) {
  const value = process.env[key];
  if (!value) return defaultValue;

  const num = parseInt(value, 10);
  if (isNaN(num)) {
    console.warn(`   ⚠️  ${key}="${value}"는 유효한 숫자가 아닙니다`);
    return defaultValue;
  }

  return num;
}

const maxConnections = getEnvNumber('MAX_CONNECTIONS', 50);
const timeout = getEnvNumber('TIMEOUT', 10);

console.log('   변환 결과:');
console.log('   - MAX_CONNECTIONS:', maxConnections, typeof maxConnections);
console.log('   - TIMEOUT:', timeout, typeof timeout);
console.log('\n   → parseInt()로 안전하게 변환\n');

// ============================================
// 7. 필수 환경 변수 검증
// ============================================
console.log('7. 필수 환경 변수 검증\n');

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`필수 환경 변수가 설정되지 않았습니다: ${key}`);
  }
  return value;
}

// 테스트용 설정
process.env.DATABASE_URL = 'mongodb://localhost:27017';

try {
  const dbUrl = requireEnv('DATABASE_URL');
  console.log('   ✅ DATABASE_URL:', dbUrl);

  // 없는 변수 테스트
  // const missing = requireEnv('MISSING_VAR');  // 에러 발생
  console.log('   ✅ 필수 변수 검증 통과');
} catch (err) {
  console.log('   ❌', err.message);
}

console.log('\n   → 시작 시 필수 변수 확인으로 빠른 실패\n');

// ============================================
// 8. 환경 변수 리스트 파싱
// ============================================
console.log('8. 환경 변수 리스트 파싱\n');

process.env.ALLOWED_ORIGINS = 'http://localhost:3000,http://localhost:8080,https://example.com';

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : [];

console.log('   원본:', process.env.ALLOWED_ORIGINS);
console.log('   파싱:', allowedOrigins);
console.log('\n   → 쉼표로 구분된 리스트 처리\n');

// ============================================
// 9. 민감한 정보 보호
// ============================================
console.log('9. 민감한 정보 보호\n');

process.env.API_SECRET = 'super-secret-key-12345';
process.env.DB_PASSWORD = 'my-password';

function maskSecret(value) {
  if (!value || value.length < 4) return '***';
  return value.slice(0, 3) + '*'.repeat(value.length - 3);
}

console.log('   민감한 정보 로깅:');
console.log('   - API_SECRET:', maskSecret(process.env.API_SECRET));
console.log('   - DB_PASSWORD:', maskSecret(process.env.DB_PASSWORD));
console.log('\n   ⚠️  실제 값은 절대 로그에 출력하지 마세요!\n');

// ============================================
// 10. 환경 변수 요약
// ============================================
setTimeout(() => {
  console.log('10. 환경 변수 요약\n');

  // 프로젝트 관련 환경 변수만 필터링
  const projectEnvs = Object.entries(process.env)
    .filter(([key]) => {
      return key.startsWith('NODE_') ||
             key.startsWith('npm_') ||
             ['PORT', 'HOST', 'DATABASE_URL', 'API_KEY', 'MY_CUSTOM_VAR'].includes(key);
    })
    .reduce((acc, [key, value]) => {
      // 민감한 정보는 마스킹
      if (key.includes('SECRET') || key.includes('PASSWORD') || key.includes('KEY')) {
        acc[key] = maskSecret(value);
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});

  console.log('   프로젝트 환경 변수:');
  Object.entries(projectEnvs).slice(0, 10).forEach(([key, value]) => {
    console.log(`   - ${key}: ${value}`);
  });

  if (Object.keys(projectEnvs).length > 10) {
    console.log(`   ... 외 ${Object.keys(projectEnvs).length - 10}개\n`);
  }
}, 100);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('환경 변수 처리 정리');
  console.log('='.repeat(60));
  console.log(`
✅ process.env - 환경 변수 객체
✅ 기본값 패턴 - env.KEY || defaultValue
✅ 타입 변환 - parseInt(), === "true"
✅ 필수 변수 검증 - requireEnv()
✅ 리스트 파싱 - split(',')
✅ 민감 정보 보호 - 마스킹 또는 숨김

환경별 분기:
→ development: 로컬 개발
→ test: 자동화 테스트
→ production: 실서버

보안 원칙:
→ .env 파일은 .gitignore에 추가
→ 민감한 정보는 로그에 출력 금지
→ 프로덕션에서는 시스템 환경 변수 사용

실행 방법:
→ NODE_ENV=production PORT=8080 node script.js
→ Windows: set NODE_ENV=production && node script.js

다음: 06-process-stdin.js
표준 입력 처리를 배워봅시다!
  `);
}, 200);

/**
 * 실행 예시:
 *
 * # Linux/macOS
 * NODE_ENV=production PORT=8080 node 05-process-env.js
 *
 * # Windows (cmd)
 * set NODE_ENV=production && set PORT=8080 && node 05-process-env.js
 *
 * # Windows (PowerShell)
 * $env:NODE_ENV="production"; $env:PORT="8080"; node 05-process-env.js
 *
 * # .env 파일 사용 (dotenv 패키지)
 * npm install dotenv
 * require('dotenv').config();
 */
