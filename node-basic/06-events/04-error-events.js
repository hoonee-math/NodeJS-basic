/**
 * 04-error-events.js
 *
 * error 이벤트 처리
 */

const EventEmitter = require('events');

console.log('=== error 이벤트 처리 ===\n');

// 1. error 이벤트의 특별한 점
console.log('1. error 이벤트는 특별합니다\n');
console.log('   - 리스너가 없으면 프로세스가 강제 종료됨');
console.log('   - 반드시 error 이벤트 리스너를 등록해야 함\n');

// 2. 안전한 error 처리
console.log('2. error 리스너 등록 (안전)\n');

const safeEmitter = new EventEmitter();

safeEmitter.on('error', (err) => {
  console.log('→ 에러 발생:', err.message);
  console.log('   (하지만 프로세스는 계속 실행됨)');
});

safeEmitter.emit('error', new Error('뭔가 잘못됨'));

console.log('   프로그램 계속 실행 중...\n');

// 3. 일반 이벤트 vs error 이벤트
console.log('3. 일반 이벤트는 리스너 없어도 괜찮음\n');

const emitter = new EventEmitter();

emitter.emit('someEvent');  // 리스너 없어도 괜찮음
console.log('   일반 이벤트는 무시됨 (에러 없음)\n');

// 4. 실전 예제: 파일 처리
console.log('4. 실전 예제: 파일 처리 시뮬레이션\n');

const fileProcessor = new EventEmitter();

// 성공 처리
fileProcessor.on('success', (filename) => {
  console.log(`→ 파일 처리 성공: ${filename}`);
});

// 에러 처리 (필수!)
fileProcessor.on('error', (err) => {
  console.log(`→ 파일 처리 실패: ${err.message}`);
  console.log(`   에러 코드: ${err.code}`);
});

// 파일 처리 시뮬레이션
function processFile(filename) {
  console.log(`\n파일 처리 시도: ${filename}`);

  if (filename.endsWith('.txt')) {
    fileProcessor.emit('success', filename);
  } else {
    const error = new Error('지원하지 않는 파일 형식');
    error.code = 'UNSUPPORTED_FORMAT';
    fileProcessor.emit('error', error);
  }
}

processFile('document.txt');
processFile('image.png');
processFile('data.txt');

// 5. 에러 처리 패턴
console.log('\n5. 에러 처리 Best Practice\n');

const api = new EventEmitter();

// 항상 가장 먼저 error 리스너 등록!
api.on('error', (err) => {
  console.log(`→ API 에러: ${err.message}`);

  // 에러 타입에 따른 처리
  if (err.code === 'NETWORK_ERROR') {
    console.log('   재시도 중...');
  } else if (err.code === 'AUTH_FAILED') {
    console.log('   로그인 필요');
  } else {
    console.log('   알 수 없는 에러');
  }
});

api.on('response', (data) => {
  console.log(`→ API 응답: ${data}`);
});

// API 호출 시뮬레이션
setTimeout(() => {
  const success = Math.random() > 0.5;

  if (success) {
    api.emit('response', '{ "status": "ok" }');
  } else {
    const error = new Error('네트워크 연결 실패');
    error.code = 'NETWORK_ERROR';
    api.emit('error', error);
  }
}, 100);

/**
 * 실행:
 * node 04-error-events.js
 *
 * 핵심 개념:
 * - error 이벤트는 특별함: 리스너 없으면 프로세스 종료
 * - 모든 EventEmitter에 error 리스너를 꼭 등록할 것
 * - Error 객체에 code, statusCode 등 추가 정보 포함 가능
 *
 * Best Practices:
 * 1. EventEmitter 생성 직후 error 리스너 등록
 * 2. Error 객체 사용 (문자열 대신)
 * 3. 에러에 코드나 타입 정보 추가
 * 4. 에러 타입별로 다른 처리
 *
 * 주의사항:
 * - error 이벤트 리스너 없이 emit('error')하면 프로세스 crash
 * - 프로덕션 환경에서는 반드시 error 처리 필요
 *
 * 위험한 코드 (절대 금지):
 * const emitter = new EventEmitter();
 * emitter.emit('error', new Error('boom')); // crash!
 */
