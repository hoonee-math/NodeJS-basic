/**
 * 03-event-arguments.js
 *
 * 이벤트에 데이터 전달하기
 */

const EventEmitter = require('events');
const emitter = new EventEmitter();

console.log('=== 이벤트 인자 전달 ===\n');

// 1. 단일 인자 전달
console.log('1. 단일 인자\n');

emitter.on('user:login', (username) => {
  console.log(`→ 사용자 로그인: ${username}`);
});

emitter.emit('user:login', 'Alice');
emitter.emit('user:login', 'Bob');

// 2. 여러 인자 전달
console.log('\n2. 여러 인자\n');

emitter.on('order:created', (orderId, amount, product) => {
  console.log(`→ 주문 생성`);
  console.log(`   주문 ID: ${orderId}`);
  console.log(`   금액: ${amount}원`);
  console.log(`   상품: ${product}`);
});

emitter.emit('order:created', 1001, 25000, '노트북');

// 3. 객체로 전달 (권장)
console.log('\n3. 객체로 전달 (가독성 좋음)\n');

emitter.on('task:completed', (data) => {
  console.log(`→ 작업 완료`);
  console.log(`   작업명: ${data.taskName}`);
  console.log(`   소요 시간: ${data.duration}ms`);
  console.log(`   성공 여부: ${data.success ? '성공' : '실패'}`);
});

emitter.emit('task:completed', {
  taskName: '데이터 백업',
  duration: 3500,
  success: true
});

// 4. 배열 전달
console.log('\n4. 배열 전달\n');

emitter.on('data:batch', (items) => {
  console.log(`→ ${items.length}개의 아이템 수신`);
  items.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item}`);
  });
});

emitter.emit('data:batch', ['사과', '바나나', '오렌지']);

// 5. 실전 예제: 진행률 이벤트
console.log('\n5. 실전 예제: 파일 다운로드 진행률\n');

const downloader = new EventEmitter();

downloader.on('progress', (data) => {
  const percent = ((data.current / data.total) * 100).toFixed(1);
  console.log(`→ 다운로드 진행: ${percent}% (${data.current}/${data.total} bytes)`);
});

downloader.on('complete', (data) => {
  console.log(`→ 다운로드 완료!`);
  console.log(`   파일명: ${data.filename}`);
  console.log(`   크기: ${data.size} bytes`);
});

// 다운로드 시뮬레이션
const totalSize = 1000;
let downloaded = 0;

const interval = setInterval(() => {
  downloaded += 250;

  downloader.emit('progress', {
    current: downloaded,
    total: totalSize
  });

  if (downloaded >= totalSize) {
    clearInterval(interval);
    downloader.emit('complete', {
      filename: 'document.pdf',
      size: totalSize
    });
  }
}, 100);

/**
 * 실행:
 * node 03-event-arguments.js
 *
 * 핵심 개념:
 * - emit(event, ...args) : 원하는 개수만큼 인자 전달 가능
 * - 리스너는 전달된 인자를 파라미터로 받음
 * - 객체로 전달하면 확장성과 가독성이 좋음
 *
 * 인자 전달 패턴:
 * - 단일 값: emit('event', value)
 * - 여러 값: emit('event', val1, val2, val3)
 * - 객체 (권장): emit('event', { key1: val1, key2: val2 })
 * - 배열: emit('event', [...items])
 *
 * 실전 활용:
 * - 진행률 업데이트 (current, total)
 * - 에러 전달 (error 객체)
 * - 상태 변경 (oldState, newState)
 * - 데이터 처리 (data 객체)
 */
