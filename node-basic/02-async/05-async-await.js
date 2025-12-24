/**
 * 05-async-await.js
 *
 * async/await 문법
 * Promise를 더 쉽게 사용하는 최신 문법 (ES2017)
 */

console.log('=== async/await ===\n');

// ============================================
// 1. async/await란?
// ============================================
console.log('1. async/await란?\n');
console.log('   - ES2017(ES8)에 추가된 비동기 처리 문법');
console.log('   - Promise를 더 쉽게 사용할 수 있게 해주는 syntactic sugar');
console.log('   - 동기 코드처럼 보이지만 비동기로 동작\n');

// ============================================
// 2. async 함수 기본
// ============================================
console.log('2. async 함수 기본\n');

// async 함수는 항상 Promise를 반환
async function hello() {
  return 'Hello';  // 자동으로 Promise.resolve('Hello')로 변환
}

hello().then((result) => {
  console.log('   async 함수 결과:', result);
  console.log('   → async 함수는 항상 Promise를 반환\n');
});

// ============================================
// 3. await 키워드
// ============================================
setTimeout(async () => {
  console.log('3. await 키워드\n');

  function delay(ms, value) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), ms);
    });
  }

  // Promise 방식
  console.log('   [Promise 방식]');
  delay(1000, '완료')
    .then((result) => {
      console.log('   ', result);
    });

  // async/await 방식
  console.log('\n   [async/await 방식]');
  const result = await delay(1000, '완료');  // Promise가 완료될 때까지 대기
  console.log('   ', result);
  console.log('   → await는 Promise가 완료될 때까지 기다림\n');

}, 100);

// ============================================
// 4. 순차적 비동기 작업
// ============================================
setTimeout(async () => {
  console.log('4. 순차적 비동기 작업\n');

  function fetchUser(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('   User 조회 완료');
        resolve({ id, name: 'Alice' });
      }, 1000);
    });
  }

  function fetchPosts(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('   Posts 조회 완료');
        resolve([{ id: 1, title: 'Post 1' }]);
      }, 1000);
    });
  }

  function fetchComments(postId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('   Comments 조회 완료');
        resolve([{ id: 1, text: 'Great!' }]);
      }, 1000);
    });
  }

  // async/await로 깔끔하게!
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);

  console.log('   최종 결과:', comments);
  console.log('   → 동기 코드처럼 읽기 쉬움!\n');

}, 2500);

// ============================================
// 5. try-catch로 에러 처리
// ============================================
setTimeout(async () => {
  console.log('5. try-catch로 에러 처리\n');

  function failingPromise() {
    return Promise.reject(new Error('의도적 실패'));
  }

  // Promise 방식
  console.log('   [Promise 방식]');
  failingPromise()
    .then((result) => {
      console.log('   성공:', result);
    })
    .catch((error) => {
      console.log('   .catch() 에러:', error.message);
    });

  // async/await 방식
  console.log('\n   [async/await 방식]');
  try {
    const result = await failingPromise();
    console.log('   성공:', result);
  } catch (error) {
    console.log('   try-catch 에러:', error.message);
  }

  console.log('   → try-catch로 직관적인 에러 처리\n');

}, 6000);

// ============================================
// 6. Promise vs async/await 비교
// ============================================
setTimeout(async () => {
  console.log('6. Promise vs async/await 비교\n');

  function step1() {
    return Promise.resolve('Step 1');
  }
  function step2() {
    return Promise.resolve('Step 2');
  }
  function step3() {
    return Promise.resolve('Step 3');
  }

  // Promise 체이닝
  console.log('   [Promise 체이닝]');
  step1()
    .then((result1) => {
      console.log('   ', result1);
      return step2();
    })
    .then((result2) => {
      console.log('   ', result2);
      return step3();
    })
    .then((result3) => {
      console.log('   ', result3);
    });

  // async/await
  console.log('\n   [async/await]');
  const result1 = await step1();
  console.log('   ', result1);
  const result2 = await step2();
  console.log('   ', result2);
  const result3 = await step3();
  console.log('   ', result3);

  console.log('\n   → async/await가 훨씬 읽기 쉬움!\n');

}, 7000);

// ============================================
// 7. 이전 값 사용하기
// ============================================
setTimeout(async () => {
  console.log('7. 이전 값 사용하기\n');

  function getUser() {
    return Promise.resolve({ id: 1, name: 'Alice' });
  }
  function getPosts(userId) {
    return Promise.resolve([{ id: 1, userId }]);
  }
  function getComments(postId) {
    return Promise.resolve([{ id: 1, postId }]);
  }

  // async/await는 변수에 저장하기 쉬움!
  const user = await getUser();
  const posts = await getPosts(user.id);
  const comments = await getComments(posts[0].id);

  console.log('   User:', user.name);
  console.log('   Posts:', posts.length);
  console.log('   Comments:', comments.length);
  console.log('   → 모든 값을 변수로 쉽게 저장 가능!\n');

}, 8000);

// ============================================
// 8. 병렬 실행 - await는 순차적!
// ============================================
setTimeout(async () => {
  console.log('8. 병렬 vs 순차 실행\n');

  function fetchData(name, ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`   ${name} 완료`);
        resolve(name);
      }, ms);
    });
  }

  // 순차 실행 (느림!)
  console.log('   [순차 실행 - 6초 걸림]');
  console.time('   순차');
  const a = await fetchData('A', 2000);
  const b = await fetchData('B', 2000);
  const c = await fetchData('C', 2000);
  console.timeEnd('   순차');
  console.log('   결과:', a, b, c);

  // 병렬 실행 (빠름!)
  console.log('\n   [병렬 실행 - 2초 걸림]');
  console.time('   병렬');
  const [d, e, f] = await Promise.all([
    fetchData('D', 2000),
    fetchData('E', 2000),
    fetchData('F', 2000)
  ]);
  console.timeEnd('   병렬');
  console.log('   결과:', d, e, f);
  console.log('   → 병렬이 3배 빠름! (Promise.all 사용)\n');

}, 9000);

// ============================================
// 9. finally와 함께 사용
// ============================================
setTimeout(async () => {
  console.log('9. finally와 함께 사용\n');

  function fetchData(shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('실패!'));
        } else {
          resolve('성공!');
        }
      }, 1000);
    });
  }

  async function processData() {
    console.log('   작업 시작...');
    try {
      const result = await fetchData(false);
      console.log('   결과:', result);
    } catch (error) {
      console.error('   에러:', error.message);
    } finally {
      console.log('   정리 작업 (항상 실행)');
    }
  }

  await processData();
  console.log('\n   → try-catch-finally로 완벽한 제어\n');

}, 19000);

// ============================================
// 10. Top-level await (ES2022)
// ============================================
setTimeout(async () => {
  console.log('10. Top-level await\n');

  console.log('   ES2022부터는 async 함수 밖에서도 await 사용 가능!');
  console.log('   단, ES Modules에서만 (.mjs 파일 또는 "type": "module")\n');

  console.log('   [일반적인 방법]');
  console.log(`
   (async () => {
     const data = await fetchData();
   })();
  `);

  console.log('   [Top-level await - ESM에서만]');
  console.log(`
   // .mjs 파일에서
   const data = await fetchData();  // async 함수 없이 바로 사용
  `);

}, 22000);

// ============================================
// 11. 실전 팁
// ============================================
setTimeout(async () => {
  console.log('11. async/await 실전 팁\n');

  console.log('   ✅ 새로운 코드는 async/await 사용');
  console.log('   ✅ 항상 try-catch로 에러 처리');
  console.log('   ✅ 독립적인 작업은 Promise.all로 병렬 처리');
  console.log('   ✅ async 함수는 항상 Promise 반환 (await 또는 .then 필요)');
  console.log('   ✅ await는 async 함수 내부에서만 사용 가능');
  console.log('   ❌ await를 루프 안에서 남용하지 말 것 (느려짐)\n');

  // Bad: 순차적으로 느림
  console.log('   [Bad - 느림]');
  console.log(`
   for (const id of [1, 2, 3]) {
     await fetchData(id);  // 하나씩 대기
   }
  `);

  // Good: 병렬 처리
  console.log('   [Good - 빠름]');
  console.log(`
   const promises = [1, 2, 3].map(id => fetchData(id));
   await Promise.all(promises);  // 동시에 실행
  `);

}, 23000);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('async/await 정리');
  console.log('='.repeat(60));
  console.log(`
✅ async 함수는 항상 Promise 반환
✅ await는 Promise가 완료될 때까지 대기
✅ try-catch로 에러 처리
✅ 동기 코드처럼 읽기 쉬움
✅ 가장 현대적이고 권장되는 방법

Callback → Promise → async/await
점점 더 읽기 쉽고 사용하기 편해짐!

다음: 06-promise-all-race.js
여러 Promise를 동시에 처리하는 방법을 배워봅시다!
  `);
}, 24000);

/**
 * 핵심 정리:
 *
 * async/await 기본:
 * async function name() {
 *   const result = await promise;  // Promise 완료까지 대기
 *   return result;  // Promise.resolve(result)로 변환됨
 * }
 *
 * 에러 처리:
 * async function name() {
 *   try {
 *     const result = await promise;
 *   } catch (error) {
 *     // 에러 처리
 *   } finally {
 *     // 정리 작업
 *   }
 * }
 *
 * 장점:
 * - 가장 읽기 쉬운 비동기 코드
 * - try-catch로 직관적 에러 처리
 * - 변수 저장 및 재사용 쉬움
 * - 현대 JavaScript 표준
 */

/**
 * 실행:
 * node 05-async-await.js
 *
 * Promise 체이닝보다 얼마나 깔끔한지 비교해보세요!
 */
