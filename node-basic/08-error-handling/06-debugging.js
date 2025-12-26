/**
 * 06-debugging.js
 *
 * 디버깅 기법과 도구
 */

console.log('=== 디버깅 기법 ===\n');

// 1. console 메서드 활용
console.log('1. console 메서드 활용\n');

console.log('→ console.log: 일반 로그');
console.error('→ console.error: 에러 로그 (stderr)');
console.warn('→ console.warn: 경고 로그');
console.info('→ console.info: 정보 로그');

console.log();

// 2. console.trace - 스택 트레이스
console.log('2. console.trace (호출 스택)\n');

function level3() {
  console.trace('→ 여기서 호출됨');
}

function level2() {
  level3();
}

function level1() {
  level2();
}

level1();
console.log();

// 3. console.table - 테이블 형식
console.log('3. console.table (데이터 시각화)\n');

const users = [
  { id: 1, name: 'Alice', age: 30 },
  { id: 2, name: 'Bob', age: 25 },
  { id: 3, name: 'Charlie', age: 35 }
];

console.table(users);
console.log();

// 4. console.time - 성능 측정
console.log('4. console.time (성능 측정)\n');

console.time('작업 시간');

let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += i;
}

console.timeEnd('작업 시간');
console.log(`→ 결과: ${sum}\n`);

// 5. console.assert - 조건 검증
console.log('5. console.assert (조건 검증)\n');

function divide(a, b) {
  console.assert(b !== 0, '0으로 나눌 수 없습니다', { a, b });
  return a / b;
}

console.log(`→ 10 ÷ 2 = ${divide(10, 2)}`);
divide(10, 0);  // assertion 실패
console.log();

// 6. 디버거 사용
console.log('6. debugger 키워드\n');

function problematicFunction(x) {
  console.log(`→ 함수 시작: x = ${x}`);

  // debugger;  // 주석 해제 시 디버거 중단점

  const result = x * 2;

  console.log(`   결과: ${result}`);

  return result;
}

problematicFunction(5);
console.log();

// 7. util.inspect - 객체 상세 출력
console.log('7. util.inspect (객체 상세 정보)\n');

const util = require('util');

const complexObject = {
  name: 'Complex',
  nested: {
    level1: {
      level2: {
        level3: 'deep value'
      }
    }
  },
  circular: null
};

// 순환 참조 생성
complexObject.circular = complexObject;

console.log('→ 기본 출력:');
console.log(complexObject);  // [Circular]

console.log('\n→ util.inspect 사용:');
console.log(util.inspect(complexObject, {
  depth: null,  // 모든 깊이
  colors: true,  // 색상
  showHidden: false
}));

console.log();

// 8. Error 스택 파싱
console.log('8. Error 스택 분석\n');

function parseStack(err) {
  console.log('→ 에러 스택 파싱');

  const stack = err.stack.split('\n');

  console.log(`   에러: ${stack[0]}`);
  console.log('   호출 스택:');

  stack.slice(1, 4).forEach((line, index) => {
    const match = line.trim().match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);

    if (match) {
      const [, func, file, line, col] = match;
      console.log(`   ${index + 1}. ${func}`);
      console.log(`      파일: ${file}:${line}:${col}`);
    }
  });
}

try {
  throw new Error('스택 분석 테스트');
} catch (err) {
  parseStack(err);
}

console.log();

// 9. 메모리 사용량 모니터링
console.log('9. 메모리 사용량 모니터링\n');

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function logMemoryUsage() {
  const usage = process.memoryUsage();

  console.log('→ 메모리 사용량:');
  console.log(`   RSS (전체): ${formatBytes(usage.rss)}`);
  console.log(`   Heap 사용: ${formatBytes(usage.heapUsed)}`);
  console.log(`   Heap 총량: ${formatBytes(usage.heapTotal)}`);
  console.log(`   External: ${formatBytes(usage.external)}`);
}

logMemoryUsage();
console.log();

// 10. 커스텀 디버그 로거
console.log('10. 커스텀 디버그 로거\n');

class DebugLogger {
  constructor(namespace) {
    this.namespace = namespace;
    this.enabled = process.env.DEBUG === namespace || process.env.DEBUG === '*';
  }

  log(...args) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${this.namespace}]`, ...args);
  }

  error(...args) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${this.namespace}] ERROR:`, ...args);
  }

  time(label) {
    if (!this.enabled) return;
    console.time(`[${this.namespace}] ${label}`);
  }

  timeEnd(label) {
    if (!this.enabled) return;
    console.timeEnd(`[${this.namespace}] ${label}`);
  }
}

// 사용 예시
const debug = new DebugLogger('app:db');

debug.log('→ 데이터베이스 연결 시작');
debug.time('쿼리 실행');

setTimeout(() => {
  debug.timeEnd('쿼리 실행');
  debug.log('→ 쿼리 완료');
}, 100);

console.log('   (DEBUG=app:db 환경변수로 활성화)\n');

// 11. 에러 추적 및 로깅
setTimeout(() => {
  console.log('11. 에러 추적 시스템\n');

  class ErrorTracker {
    constructor() {
      this.errors = [];
    }

    track(err, context = {}) {
      const errorInfo = {
        message: err.message,
        name: err.name,
        stack: err.stack,
        context,
        timestamp: new Date(),
        process: {
          pid: process.pid,
          uptime: process.uptime(),
          memory: process.memoryUsage()
        }
      };

      this.errors.push(errorInfo);

      console.log('→ 에러 추적됨:');
      console.log(`   메시지: ${err.message}`);
      console.log(`   컨텍스트: ${JSON.stringify(context)}`);
      console.log(`   시간: ${errorInfo.timestamp.toISOString()}`);
    }

    getReport() {
      return {
        total: this.errors.length,
        recent: this.errors.slice(-5),
        summary: this.errors.reduce((acc, err) => {
          acc[err.name] = (acc[err.name] || 0) + 1;
          return acc;
        }, {})
      };
    }
  }

  const tracker = new ErrorTracker();

  try {
    throw new Error('테스트 에러 1');
  } catch (err) {
    tracker.track(err, { userId: 123, action: 'login' });
  }

  try {
    throw new TypeError('테스트 에러 2');
  } catch (err) {
    tracker.track(err, { userId: 456, action: 'signup' });
  }

  console.log('\n→ 에러 리포트:');
  console.log(JSON.stringify(tracker.getReport(), null, 2));
}, 200);

// 12. 실행 시간 프로파일링
setTimeout(() => {
  console.log('\n12. 함수 실행 시간 프로파일링\n');

  function profile(fn, name) {
    return async (...args) => {
      const start = process.hrtime.bigint();

      try {
        const result = await fn(...args);

        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000;  // ms

        console.log(`→ [Profile] ${name}: ${duration.toFixed(2)}ms`);

        return result;
      } catch (err) {
        const end = process.hrtime.bigint();
        const duration = Number(end - start) / 1000000;

        console.log(`→ [Profile] ${name}: ${duration.toFixed(2)}ms (에러 발생)`);

        throw err;
      }
    };
  }

  async function slowFunction() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return 'done';
  }

  const profiledFunction = profile(slowFunction, 'slowFunction');

  profiledFunction();
}, 500);

/**
 * 실행:
 * node 06-debugging.js
 *
 * 디버깅 명령어:
 * node inspect 06-debugging.js           # 내장 디버거
 * node --inspect 06-debugging.js         # Chrome DevTools
 * node --inspect-brk 06-debugging.js     # 첫 줄에서 중단
 *
 * 핵심 개념:
 * - console 메서드로 로깅
 * - debugger 키워드로 중단점
 * - 스택 트레이스 분석
 * - 메모리 사용량 모니터링
 *
 * console 메서드:
 * - log, error, warn, info: 기본 로그
 * - trace: 호출 스택 출력
 * - table: 테이블 형식
 * - time/timeEnd: 성능 측정
 * - assert: 조건 검증
 * - dir: 객체 상세 출력
 *
 * util.inspect:
 * - 깊은 객체 출력
 * - 순환 참조 처리
 * - 색상 지원
 * - 숨겨진 속성 표시
 *
 * Node.js 디버거:
 * - node inspect: 내장 CLI 디버거
 * - node --inspect: Chrome DevTools 연동
 * - debugger 키워드: 중단점 설정
 * - 실시간 변수 검사
 *
 * Chrome DevTools:
 * 1. node --inspect 파일.js 실행
 * 2. chrome://inspect 접속
 * 3. Remote Target 연결
 * 4. GUI로 디버깅
 *
 * 메모리 모니터링:
 * - process.memoryUsage(): 현재 메모리 사용량
 * - rss: 전체 메모리 (Resident Set Size)
 * - heapUsed: V8 힙 사용량
 * - heapTotal: V8 힙 총량
 * - external: C++ 객체 메모리
 *
 * 성능 측정:
 * - console.time/timeEnd: 간단한 측정
 * - process.hrtime.bigint(): 고정밀 타이머
 * - performance API: 브라우저 호환
 *
 * 에러 추적:
 * - 에러 발생 시점, 컨텍스트 기록
 * - 스택 트레이스 저장
 * - 통계 및 리포트
 *
 * Best Practices:
 * - 프로덕션에서는 DEBUG 플래그로 제어
 * - 민감한 정보 로그에 포함 금지
 * - 구조화된 로깅 (JSON)
 * - 외부 로깅 서비스 사용 (Winston, Bunyan)
 * - 에러 모니터링 툴 (Sentry, Datadog)
 *
 * VS Code 디버깅:
 * 1. launch.json 설정
 * 2. F5로 디버그 시작
 * 3. 중단점 설정
 * 4. 변수 검사, 스택 확인
 *
 * 프로덕션 디버깅:
 * - 로그 레벨로 제어
 * - 환경변수로 디버그 모드
 * - APM 도구 활용
 * - 분산 추적 (Jaeger, Zipkin)
 *
 * 도구:
 * - Chrome DevTools: GUI 디버깅
 * - VS Code: IDE 통합
 * - Winston/Bunyan: 로깅
 * - Sentry: 에러 모니터링
 * - PM2: 프로세스 관리
 */
