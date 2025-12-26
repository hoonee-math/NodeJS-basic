/**
 * 02-on-once-off.js
 *
 * 이벤트 리스너 등록/제거 (on, once, off)
 */

const EventEmitter = require('events');
const emitter = new EventEmitter();

console.log('=== on, once, off 메서드 ===\n');

// 1. on() - 계속 실행
console.log('1. on() - 이벤트가 발생할 때마다 실행\n');

emitter.on('data', () => {
  console.log('→ on: 데이터 수신');
});

emitter.emit('data');
emitter.emit('data');
emitter.emit('data');

// 2. once() - 한 번만 실행
console.log('\n2. once() - 한 번만 실행 후 자동 제거\n');

emitter.once('connect', () => {
  console.log('→ once: 연결 성공!');
});

emitter.emit('connect');
emitter.emit('connect');  // 실행 안 됨
emitter.emit('connect');  // 실행 안 됨

console.log('connect 리스너 개수:', emitter.listenerCount('connect'));  // 0

// 3. off() / removeListener() - 리스너 제거
console.log('\n3. off() - 리스너 제거\n');

function onMessage() {
  console.log('→ 메시지 받음');
}

emitter.on('message', onMessage);

console.log('제거 전 리스너 개수:', emitter.listenerCount('message'));

emitter.off('message', onMessage);  // removeListener()와 동일

console.log('제거 후 리스너 개수:', emitter.listenerCount('message'));

emitter.emit('message');  // 실행 안 됨

// 4. removeAllListeners() - 모든 리스너 제거
console.log('\n4. removeAllListeners() - 모든 리스너 제거\n');

emitter.on('test', () => console.log('→ 테스트 1'));
emitter.on('test', () => console.log('→ 테스트 2'));
emitter.on('test', () => console.log('→ 테스트 3'));

console.log('제거 전:', emitter.listenerCount('test'), '개');

emitter.removeAllListeners('test');

console.log('제거 후:', emitter.listenerCount('test'), '개');

emitter.emit('test');  // 아무것도 실행 안 됨

// 5. 실전 예제: 일회성 초기화
console.log('\n5. 실전 예제: 일회성 초기화\n');

const app = new EventEmitter();

app.once('ready', () => {
  console.log('→ 앱 초기화 완료!');
  console.log('   데이터베이스 연결됨');
  console.log('   서버 시작됨');
});

// 앱 시작
setTimeout(() => {
  app.emit('ready');
}, 100);

// 나중에 다시 호출해도 실행 안 됨
setTimeout(() => {
  app.emit('ready');  // 무시됨
  console.log('\nready 이벤트 재발생 시도 (무시됨)');
}, 200);

/**
 * 실행:
 * node 02-on-once-off.js
 *
 * 핵심 개념:
 * - on() : 이벤트가 발생할 때마다 계속 실행
 * - once() : 첫 번째 이벤트만 처리하고 자동 제거
 * - off() : 특정 리스너 제거 (removeListener 별칭)
 * - removeAllListeners() : 모든 리스너 제거
 *
 * 사용 사례:
 * - on() : 지속적인 이벤트 처리 (데이터 수신, 클릭 등)
 * - once() : 일회성 이벤트 (초기화, 첫 연결 등)
 * - off() : 메모리 누수 방지, 더 이상 필요 없는 리스너 제거
 *
 * 주의사항:
 * - off()로 제거하려면 리스너가 named function이어야 함
 * - 화살표 함수나 익명 함수는 제거 불가능
 */
