/**
 * 04-promise-chaining.js
 *
 * Promise 체이닝 (Chaining)
 * 여러 비동기 작업을 순차적으로 처리하기
 */

console.log('=== Promise Chaining (체이닝) ===\n');

// ============================================
// 1. Promise Chaining이란?
// ============================================
console.log('1. Promise Chaining이란?\n');
console.log('   - .then()을 연속으로 연결하여 순차적 작업 수행');
console.log('   - 각 .then()은 새로운 Promise를 반환');
console.log('   - Callback Hell을 평탄하게 만듦\n');

// ============================================
// 2. 기본 체이닝
// ============================================
console.log('2. 기본 체이닝 예제\n');

Promise.resolve(1)
  .then((num) => {
    console.log('   첫 번째 then:', num);
    return num + 1;  // 다음 then으로 전달
  })
  .then((num) => {
    console.log('   두 번째 then:', num);
    return num + 1;
  })
  .then((num) => {
    console.log('   세 번째 then:', num);
    console.log('   → 각 then의 return 값이 다음 then으로 전달됨\n');
  });

// ============================================
// 3. Promise를 return하는 체이닝
// ============================================
setTimeout(() => {
  console.log('3. Promise를 return하는 체이닝\n');

  function delay(ms, value) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(value), ms);
    });
  }

  delay(1000, '첫 번째')
    .then((result) => {
      console.log('   ', result, '완료');
      return delay(1000, '두 번째');  // Promise 반환
    })
    .then((result) => {
      console.log('   ', result, '완료');
      return delay(1000, '세 번째');
    })
    .then((result) => {
      console.log('   ', result, '완료');
      console.log('   → Promise를 return하면 그것이 완료될 때까지 대기\n');
    });

}, 100);

// ============================================
// 4. 실전 예제: API 호출 시뮬레이션
// ============================================
setTimeout(() => {
  console.log('4. 실전 예제: 순차적 API 호출\n');

  // API 시뮬레이션 함수들
  function fetchUser(id) {
    console.log(`   [API] User ${id} 요청 중...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, name: 'Alice', email: 'alice@example.com' });
      }, 1000);
    });
  }

  function fetchPosts(userId) {
    console.log(`   [API] User ${userId}의 Posts 요청 중...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, userId, title: 'First Post' },
          { id: 2, userId, title: 'Second Post' }
        ]);
      }, 1000);
    });
  }

  function fetchComments(postId) {
    console.log(`   [API] Post ${postId}의 Comments 요청 중...`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, postId, text: 'Great post!' },
          { id: 2, postId, text: 'Thanks for sharing' }
        ]);
      }, 1000);
    });
  }

  // Promise 체이닝으로 순차 실행
  fetchUser(1)
    .then((user) => {
      console.log('   ✅ User:', user.name);
      return fetchPosts(user.id);  // user.id를 사용
    })
    .then((posts) => {
      console.log('   ✅ Posts:', posts.length, '개');
      return fetchComments(posts[0].id);  // 첫 번째 포스트의 댓글
    })
    .then((comments) => {
      console.log('   ✅ Comments:', comments.length, '개');
      console.log('   → 깔끔한 순차 실행!\n');
    })
    .catch((error) => {
      console.error('   ❌ 에러:', error);
    });

}, 4000);

// ============================================
// 5. 값을 누적하면서 체이닝
// ============================================
setTimeout(() => {
  console.log('5. 값을 누적하면서 체이닝\n');

  console.log('   문제: 이전 단계의 값도 필요한 경우는?\n');

  // 방법 1: 변수로 저장 (추천하지 않음)
  let userData;
  let postsData;

  fetchUser(1)
    .then((user) => {
      userData = user;  // 나중을 위해 저장
      return fetchPosts(user.id);
    })
    .then((posts) => {
      postsData = posts;
      return fetchComments(posts[0].id);
    })
    .then((comments) => {
      console.log('   방법 1 결과:');
      console.log('   User:', userData.name);
      console.log('   Posts:', postsData.length);
      console.log('   Comments:', comments.length);
      console.log('   → 작동은 하지만 좋은 방법은 아님\n');
    });

}, 8000);

// ============================================
// 6. 더 나은 방법: 객체로 누적
// ============================================
setTimeout(() => {
  console.log('6. 더 나은 방법: 객체로 전달\n');

  fetchUser(1)
    .then((user) => {
      return fetchPosts(user.id)
        .then((posts) => ({ user, posts }));  // 객체로 전달
    })
    .then(({ user, posts }) => {
      return fetchComments(posts[0].id)
        .then((comments) => ({ user, posts, comments }));
    })
    .then(({ user, posts, comments }) => {
      console.log('   방법 2 결과:');
      console.log('   User:', user.name);
      console.log('   Posts:', posts.length);
      console.log('   Comments:', comments.length);
      console.log('   → 모든 값을 유지하면서 전달\n');
    });

}, 12000);

// ============================================
// 7. 에러 처리 - catch의 위치
// ============================================
setTimeout(() => {
  console.log('7. 에러 처리 - catch의 위치\n');

  function failingPromise() {
    return Promise.reject(new Error('의도적 실패'));
  }

  Promise.resolve('시작')
    .then((result) => {
      console.log('   Step 1:', result);
      return '계속';
    })
    .then((result) => {
      console.log('   Step 2:', result);
      return failingPromise();  // 여기서 에러 발생!
    })
    .then((result) => {
      console.log('   Step 3: 실행 안 됨', result);
    })
    .catch((error) => {
      console.log('   ❌ 에러 포착:', error.message);
      console.log('   → 체인 어디서든 에러 발생 시 catch로 이동\n');
    });

}, 16000);

// ============================================
// 8. catch 후 체이닝 계속하기
// ============================================
setTimeout(() => {
  console.log('8. catch 후 체이닝 계속하기\n');

  Promise.resolve('시작')
    .then((result) => {
      console.log('   Step 1:', result);
      throw new Error('에러 발생!');
    })
    .catch((error) => {
      console.log('   에러 처리:', error.message);
      return '복구됨';  // 값을 return하면 체이닝 계속
    })
    .then((result) => {
      console.log('   Step 2:', result);
      console.log('   → catch 후에도 체이닝 계속 가능\n');
    });

}, 17000);

// ============================================
// 9. Callback Hell vs Promise Chaining 비교
// ============================================
setTimeout(() => {
  console.log('9. Callback Hell vs Promise Chaining 비교\n');

  console.log('   [Callback Hell]');
  console.log(`
   getUser(1, (err, user) => {
     if (err) return handleError(err);
     getPosts(user.id, (err, posts) => {
       if (err) return handleError(err);
       getComments(posts[0].id, (err, comments) => {
         if (err) return handleError(err);
         // 3단계 중첩!
       });
     });
   });
  `);

  console.log('   [Promise Chaining]');
  console.log(`
   getUser(1)
     .then(user => getPosts(user.id))
     .then(posts => getComments(posts[0].id))
     .then(comments => { /* 평탄한 코드! */ })
     .catch(handleError);  // 에러 처리도 한 곳에서!
  `);

  console.log('   → Promise가 훨씬 읽기 쉽고 깔끔함!\n');

}, 18000);

// ============================================
// 10. 체이닝 Best Practices
// ============================================
setTimeout(() => {
  console.log('10. Promise Chaining 모범 사례\n');

  console.log('   ✅ 항상 .catch()를 체인 끝에 추가');
  console.log('   ✅ .then()에서 Promise를 return');
  console.log('   ✅ 한 .then()에 하나의 작업만');
  console.log('   ✅ .finally()로 정리 작업');
  console.log('   ❌ .then() 안에서 .then() 중첩 금지 (다시 Callback Hell!)');
  console.log('   ❌ 에러를 무시하지 말 것\n');

  // Good Example
  console.log('   [Good Example]');
  fetchUser(1)
    .then(user => fetchPosts(user.id))
    .then(posts => fetchComments(posts[0].id))
    .then(comments => console.log('   ✅ Comments:', comments.length))
    .catch(error => console.error('   Error:', error))
    .finally(() => console.log('   Done!\n'));

}, 19000);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('Promise Chaining 정리');
  console.log('='.repeat(60));
  console.log(`
✅ .then()을 연결하여 순차적 작업
✅ 각 .then()은 값 또는 Promise를 return
✅ 에러는 가장 가까운 .catch()로 이동
✅ Callback Hell을 평탄하게 만듦
✅ 코드 흐름이 위에서 아래로 읽힘

하지만 여전히 .then()이 많으면 불편할 수 있습니다.
다음: 05-async-await.js
더 쉬운 방법인 async/await를 배워봅시다!
  `);
}, 23000);

/**
 * 핵심 정리:
 *
 * Promise Chaining:
 * promise
 *   .then(result1 => {
 *     return nextPromise();  // Promise 반환
 *   })
 *   .then(result2 => {
 *     return value;  // 값 반환
 *   })
 *   .catch(error => {
 *     // 에러 처리
 *   })
 *   .finally(() => {
 *     // 정리 작업
 *   });
 *
 * 규칙:
 * 1. .then()에서 반드시 return
 * 2. Promise를 return하면 대기
 * 3. 값을 return하면 즉시 다음 단계로
 * 4. .catch()는 체인 어디서든 에러 포착
 */

/**
 * 실행:
 * node 04-promise-chaining.js
 *
 * 순차적으로 실행되는 것을 확인하세요!
 */
