/**
 * 01-basic-emitter.js
 *
 * EventEmitter 기본 사용법
 */

const EventEmitter = require('events');

// EventEmitter 인스턴스 생성
const emitter = new EventEmitter();

console.log('=== EventEmitter 기본 예제 ===\n');

// 1. 이벤트 리스너 등록
console.log('1. 이벤트 리스너 등록\n');

emitter.on('greeting', () => {
  console.log('→ greeting 이벤트 발생!');
  console.log('   안녕하세요!');
});

emitter.on('farewell', () => {
  console.log('→ farewell 이벤트 발생!');
  console.log('   안녕히 가세요!');
});

// 2. 이벤트 발생시키기
console.log('\n2. 이벤트 발생\n');

emitter.emit('greeting');
emitter.emit('farewell');

// 3. 여러 리스너 등록 가능
console.log('\n3. 같은 이벤트에 여러 리스너\n');

emitter.on('message', () => {
  console.log('→ 첫 번째 리스너');
});

emitter.on('message', () => {
  console.log('→ 두 번째 리스너');
});

emitter.on('message', () => {
  console.log('→ 세 번째 리스너');
});

emitter.emit('message');

// 4. 리스너 개수 확인
console.log('\n4. 등록된 리스너 확인\n');

console.log('message 이벤트 리스너 개수:', emitter.listenerCount('message'));
console.log('greeting 이벤트 리스너 개수:', emitter.listenerCount('greeting'));

// 5. 등록된 이벤트 이름 목록
console.log('\n5. 등록된 이벤트 목록\n');

console.log('이벤트 이름들:', emitter.eventNames());

/**
 * 실행:
 * node 01-basic-emitter.js
 *
 * 핵심 개념:
 * - EventEmitter : Node.js 내장 이벤트 시스템
 * - on(event, listener) : 이벤트 리스너 등록
 * - emit(event) : 이벤트 발생
 * - 하나의 이벤트에 여러 리스너 등록 가능
 * - 리스너는 등록된 순서대로 실행됨
 *
 * 주요 메서드:
 * - emitter.on(event, listener) : 리스너 등록
 * - emitter.emit(event, ...args) : 이벤트 발생
 * - emitter.listenerCount(event) : 리스너 개수
 * - emitter.eventNames() : 등록된 이벤트 이름 배열
 *
 * 사용 예시:
 * - 비동기 작업 완료 알림
 * - 여러 컴포넌트 간 통신
 * - Pub/Sub 패턴 구현
 */
