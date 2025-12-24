/**
 * 03-promise-basics.js
 *
 * Promise 기초
 * Callback Hell을 해결하기 위한 ES6의 새로운 방법
 */

console.log('=== Promise 기초 ===\n');

// ============================================
// 1. Promise란?
// ============================================
console.log('1. Promise란?\n');
console.log('   - 비동기 작업의 완료 또는 실패를 나타내는 객체');
console.log('   - ES6(ES2015)에 추가됨');
console.log('   - Callback Hell을 해결하기 위해 만들어짐\n');

// ============================================
// 2. Promise의 3가지 상태
// ============================================
console.log('2. Promise의 3가지 상태\n');
console.log('   Pending (대기): 초기 상태, 아직 완료되지 않음');
console.log('   Fulfilled (이행): 작업이 성공적으로 완료됨');
console.log('   Rejected (거부): 작업이 실패함\n');

console.log('   Pending → Fulfilled (resolve 호출)');
console.log('   Pending → Rejected (reject 호출)');
console.log('   한 번 상태가 변하면 다시는 변하지 않음!\n');

// ============================================
// 3. Promise 만들기
// ============================================
console.log('3. Promise 만들기\n');

// 기본 Promise 생성
const simplePromise = new Promise((resolve, reject) => {
  // resolve: 성공 시 호출
  // reject: 실패 시 호출

  const success = true;

  if (success) {
    resolve('작업 성공!');  // Fulfilled 상태로 변경
  } else {
    reject('작업 실패!');   // Rejected 상태로 변경
  }
});

console.log('   Promise 생성:', simplePromise);
console.log('   → Promise { <pending> 또는 이미 완료된 상태 }\n');

// ============================================
// 4. Promise 사용하기 - then, catch
// ============================================
console.log('4. Promise 사용하기\n');

// 성공하는 Promise
const successPromise = new Promise((resolve) => {
  setTimeout(() => {
    resolve('✅ 성공 결과');
  }, 1000);
});

successPromise
  .then((result) => {
    console.log('   .then() 실행:', result);
  });

// 실패하는 Promise
const failPromise = new Promise((_, reject) => {
  setTimeout(() => {
    reject(new Error('❌ 실패 원인'));
  }, 1500);
});

failPromise
  .catch((error) => {
    console.log('   .catch() 실행:', error.message);
  });

// ============================================
// 5. then과 catch 모두 사용
// ============================================
setTimeout(() => {
  console.log('\n5. then과 catch 함께 사용\n');

  function randomPromise() {
    return new Promise((resolve, reject) => {
      const random = Math.random();

      setTimeout(() => {
        if (random > 0.5) {
          resolve(`성공! (${random.toFixed(2)})`);
        } else {
          reject(new Error(`실패... (${random.toFixed(2)})`));
        }
      }, 1000);
    });
  }

  randomPromise()
    .then((result) => {
      console.log('   ✅', result);
    })
    .catch((error) => {
      console.log('   ❌', error.message);
    });

}, 2000);

// ============================================
// 6. finally - 성공/실패 관계없이 실행
// ============================================
setTimeout(() => {
  console.log('\n6. finally - 항상 실행\n');

  new Promise((resolve) => {
    setTimeout(() => resolve('완료'), 1000);
  })
    .then((result) => {
      console.log('   결과:', result);
    })
    .catch((error) => {
      console.log('   에러:', error);
    })
    .finally(() => {
      console.log('   finally: 성공/실패 관계없이 실행됨');
      console.log('   → 정리 작업(cleanup)에 유용\n');
    });

}, 3500);

// ============================================
// 7. Promise vs Callback 비교
// ============================================
setTimeout(() => {
  console.log('7. Promise vs Callback 비교\n');

  // Callback 방식
  console.log('   [Callback 방식]');
  function fetchDataCallback(callback) {
    setTimeout(() => {
      callback(null, '데이터');
    }, 1000);
  }

  fetchDataCallback((err, data) => {
    if (err) return console.error(err);
    console.log('   Callback 결과:', data);
  });

  // Promise 방식
  console.log('\n   [Promise 방식]');
  function fetchDataPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('데이터');
      }, 1000);
    });
  }

  fetchDataPromise()
    .then((data) => {
      console.log('   Promise 결과:', data);
    })
    .catch((err) => {
      console.error(err);
    });

  console.log('\n   → Promise가 더 깔끔하고 이해하기 쉬움!\n');

}, 5000);

// ============================================
// 8. 실전 예제: 파일 읽기를 Promise로
// ============================================
setTimeout(() => {
  console.log('8. 실전 예제: fs.promises 사용\n');

  const fs = require('fs').promises;  // Promise 버전의 fs 모듈

  // Promise 방식으로 파일 읽기
  fs.readFile(__filename, 'utf-8')
    .then((data) => {
      const lines = data.split('\n').length;
      console.log(`   ✅ 파일 읽기 성공! (총 ${lines}줄)`);
      return lines;  // 다음 then으로 전달
    })
    .then((lines) => {
      console.log(`   줄 수를 받았습니다: ${lines}`);
    })
    .catch((error) => {
      console.error('   ❌ 파일 읽기 실패:', error);
    })
    .finally(() => {
      console.log('   파일 읽기 작업 완료\n');
    });

}, 7500);

// ============================================
// 9. Promise 유틸리티 메서드
// ============================================
setTimeout(() => {
  console.log('9. Promise 유틸리티 메서드\n');

  // Promise.resolve() - 즉시 성공하는 Promise
  Promise.resolve('즉시 성공')
    .then((result) => {
      console.log('   Promise.resolve():', result);
    });

  // Promise.reject() - 즉시 실패하는 Promise
  Promise.reject(new Error('즉시 실패'))
    .catch((error) => {
      console.log('   Promise.reject():', error.message);
    });

  console.log('\n   → 이미 있는 값을 Promise로 감쌀 때 유용\n');

}, 9000);

// ============================================
// 10. Callback Hell을 Promise로 개선
// ============================================
setTimeout(() => {
  console.log('10. Callback Hell을 Promise로 개선\n');

  function getUser(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('   [1단계] User 조회');
        resolve({ id: userId, name: 'Alice' });
      }, 500);
    });
  }

  function getPosts(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('   [2단계] Posts 조회');
        resolve([{ id: 1, title: 'Post 1' }]);
      }, 500);
    });
  }

  function getComments(postId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('   [3단계] Comments 조회');
        resolve([{ id: 1, text: 'Great!' }]);
      }, 500);
    });
  }

  // Promise 체이닝 (다음 파일에서 자세히!)
  getUser(1)
    .then((user) => getPosts(user.id))
    .then((posts) => getComments(posts[0].id))
    .then((comments) => {
      console.log('   최종 결과:', comments);
      console.log('\n   ✅ 중첩 없이 깔끔한 코드!');
    })
    .catch((error) => {
      console.error('   에러:', error);
    });

}, 10000);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('Promise 정리');
  console.log('='.repeat(60));
  console.log(`
✅ Promise는 비동기 작업을 나타내는 객체
✅ 3가지 상태: Pending → Fulfilled/Rejected
✅ .then() : 성공 처리
✅ .catch() : 실패 처리
✅ .finally() : 항상 실행
✅ Callback보다 가독성 좋음

다음: 04-promise-chaining.js
Promise 체이닝으로 순차적 비동기 작업을 처리해봅시다!
  `);

}, 12000);

/**
 * 핵심 정리:
 *
 * Promise 생성:
 * new Promise((resolve, reject) => {
 *   if (성공) resolve(결과);
 *   else reject(에러);
 * })
 *
 * Promise 사용:
 * promise
 *   .then(result => { ... })   // 성공 시
 *   .catch(error => { ... })   // 실패 시
 *   .finally(() => { ... })    // 항상
 *
 * 장점:
 * - Callback Hell 해결
 * - 에러 처리 간편
 * - 가독성 향상
 */

/**
 * 실행:
 * node 03-promise-basics.js
 *
 * 각 단계가 순차적으로 실행되는 것을 확인하세요!
 */
