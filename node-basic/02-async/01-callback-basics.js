/**
 * 01-callback-basics.js
 *
 * Callback 함수의 기초
 * Node.js에서 비동기 처리를 하는 전통적인 방법
 */

console.log('=== Callback 함수 기초 ===\n');

// ============================================
// 1. Callback 함수란?
// ============================================
console.log('1. Callback 함수란?\n');

// 일반 함수
function greet(name) {
  return `Hello, ${name}!`;
}

// Callback을 받는 함수
function greetAsync(name, callback) {
  const message = `Hello, ${name}!`;
  callback(message);  // 콜백 함수 실행
}

// 사용
greetAsync('Alice', (message) => {
  console.log('   ', message);
});

console.log('\n   → Callback: 다른 함수에 인자로 전달되어 나중에 실행되는 함수\n');

// ============================================
// 2. 동기 vs 비동기
// ============================================
console.log('2. 동기 vs 비동기\n');

console.log('   [동기 코드 - 순서대로 실행]');
console.log('   1번 작업');
console.log('   2번 작업');
console.log('   3번 작업');

console.log('\n   [비동기 코드 - 나중에 실행]');
console.log('   시작');

setTimeout(() => {
  console.log('   ⏰ 2초 후 실행됨 (비동기)');
}, 2000);

console.log('   끝 (먼저 출력됨)');
console.log('   → 비동기는 완료를 기다리지 않고 다음 코드 실행\n');

// ============================================
// 3. setTimeout - 가장 기본적인 비동기 함수
// ============================================
setTimeout(() => {
  console.log('\n3. setTimeout 예제\n');

  console.log('   3초 뒤에 실행되는 메시지입니다.');
  console.log('   setTimeout(callback, milliseconds)');

  // ============================================
  // 4. Error-First Callback 패턴
  // ============================================
  console.log('\n4. Error-First Callback (Node.js 표준 패턴)\n');

  // Node.js에서 콜백의 첫 번째 인자는 항상 에러
  function divide(a, b, callback) {
    if (b === 0) {
      callback(new Error('0으로 나눌 수 없습니다'), null);
    } else {
      callback(null, a / b);  // 첫 번째: 에러, 두 번째: 결과
    }
  }

  // 성공 케이스
  divide(10, 2, (err, result) => {
    if (err) {
      console.error('   에러:', err.message);
    } else {
      console.log('   10 ÷ 2 =', result);
    }
  });

  // 에러 케이스
  divide(10, 0, (err, result) => {
    if (err) {
      console.error('   에러:', err.message);
    } else {
      console.log('   결과:', result);
    }
  });

  console.log('\n   → Node.js 콜백 패턴: callback(error, result)');
  console.log('   → 항상 에러를 먼저 체크해야 함!\n');

  // ============================================
  // 5. 파일 시스템 비동기 작업
  // ============================================
  console.log('5. 파일 시스템 예제 (fs 모듈)\n');

  const fs = require('fs');

  // 비동기 파일 읽기
  console.log('   파일 읽기 시작...');

  // 현재 파일 자신을 읽어봅시다
  fs.readFile(__filename, 'utf-8', (err, data) => {
    if (err) {
      console.error('   파일 읽기 실패:', err);
      return;
    }

    const lines = data.split('\n').length;
    console.log(`   ✅ 파일 읽기 성공! (총 ${lines}줄)`);
    console.log('   파일 첫 줄:', data.split('\n')[0]);
  });

  console.log('   다음 코드 실행 (파일 읽기 완료 전)');
  console.log('   → fs.readFile은 비동기로 동작\n');

  // ============================================
  // 6. 콜백을 사용하는 이유
  // ============================================
  setTimeout(() => {
    console.log('\n6. 왜 Callback을 사용할까?\n');
    console.log('   ✅ I/O 작업이 완료될 때까지 기다리지 않음');
    console.log('   ✅ 다른 작업을 동시에 처리 가능 (Non-blocking)');
    console.log('   ✅ 서버가 여러 요청을 효율적으로 처리');
    console.log('   ❌ 단점: Callback Hell (다음 파일에서 확인)');

    // ============================================
    // 7. 실전 예제: 여러 단계의 비동기 작업
    // ============================================
    console.log('\n7. 실전 예제: 순차적 비동기 작업\n');

    function step1(callback) {
      console.log('   [Step 1] 사용자 인증 중...');
      setTimeout(() => {
        console.log('   [Step 1] ✅ 인증 완료');
        callback(null, { userId: 123, name: 'Alice' });
      }, 1000);
    }

    function step2(user, callback) {
      console.log('   [Step 2] 사용자 데이터 불러오는 중...');
      setTimeout(() => {
        console.log('   [Step 2] ✅ 데이터 로드 완료');
        callback(null, { ...user, posts: 10, followers: 50 });
      }, 1000);
    }

    function step3(userData, callback) {
      console.log('   [Step 3] 최종 처리 중...');
      setTimeout(() => {
        console.log('   [Step 3] ✅ 완료');
        callback(null, `Welcome, ${userData.name}!`);
      }, 1000);
    }

    // 실행 (중첩된 콜백)
    step1((err, user) => {
      if (err) return console.error(err);

      step2(user, (err, userData) => {
        if (err) return console.error(err);

        step3(userData, (err, message) => {
          if (err) return console.error(err);

          console.log('\n   최종 결과:', message);
          console.log('\n   → 이렇게 중첩이 깊어지면 Callback Hell 발생!');
          console.log('   → 다음 파일에서 이 문제를 확인해봅시다.\n');
        });
      });
    });

  }, 100);  // fs.readFile이 먼저 실행되도록 약간의 딜레이

}, 3000);

/**
 * 핵심 정리:
 *
 * 1. Callback = 나중에 실행될 함수
 * 2. 비동기 = 완료를 기다리지 않고 다음 코드 실행
 * 3. Error-First Callback = Node.js 표준 패턴
 *    - callback(err, result)
 *    - 첫 번째 인자는 항상 에러
 * 4. 비동기의 장점 = Non-blocking, 효율적인 리소스 사용
 * 5. 비동기의 단점 = Callback Hell (중첩 문제)
 *
 * 다음: 02-callback-hell.js
 */

/**
 * 실행:
 * node 01-callback-basics.js
 *
 * 출력 순서를 주의깊게 관찰하세요!
 * 비동기 코드는 나중에 실행됩니다.
 */
