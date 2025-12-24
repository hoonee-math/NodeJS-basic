/**
 * 02-callback-hell.js
 *
 * Callback Hell (콜백 지옥)
 * 콜백이 중첩되어 발생하는 문제점과 해결 방법
 */

console.log('=== Callback Hell (콜백 지옥) ===\n');

// ============================================
// 1. Callback Hell이란?
// ============================================
console.log('1. Callback Hell이란?\n');
console.log('   콜백 안에 콜백이 계속 중첩되어');
console.log('   코드가 피라미드 모양으로 깊어지는 현상\n');

// ============================================
// 2. Callback Hell 예제
// ============================================
console.log('2. Callback Hell 실제 예제\n');

function getUser(userId, callback) {
  setTimeout(() => {
    console.log(`   [1단계] User ${userId} 조회 완료`);
    callback(null, { id: userId, name: 'Alice' });
  }, 1000);
}

function getPosts(userId, callback) {
  setTimeout(() => {
    console.log(`   [2단계] User ${userId}의 Posts 조회 완료`);
    callback(null, [
      { id: 1, title: 'Post 1' },
      { id: 2, title: 'Post 2' }
    ]);
  }, 1000);
}

function getComments(postId, callback) {
  setTimeout(() => {
    console.log(`   [3단계] Post ${postId}의 Comments 조회 완료`);
    callback(null, [
      { id: 1, text: 'Great!' },
      { id: 2, text: 'Nice!' }
    ]);
  }, 1000);
}

function getLikes(commentId, callback) {
  setTimeout(() => {
    console.log(`   [4단계] Comment ${commentId}의 Likes 조회 완료`);
    callback(null, { count: 42 });
  }, 1000);
}

// 😱 Callback Hell 시작!
console.log('   작업 시작...\n');

getUser(1, (err, user) => {
  if (err) return console.error(err);

  getPosts(user.id, (err, posts) => {
    if (err) return console.error(err);

    getComments(posts[0].id, (err, comments) => {
      if (err) return console.error(err);

      getLikes(comments[0].id, (err, likes) => {
        if (err) return console.error(err);

        console.log('\n   최종 결과:', likes);
        console.log('   → 4단계 중첩! 더 깊어질 수도 있음 😱\n');

        // ============================================
        // 3. Callback Hell의 문제점
        // ============================================
        setTimeout(() => {
          console.log('3. Callback Hell의 문제점\n');
          console.log('   ❌ 가독성: 코드 흐름 파악 어려움');
          console.log('   ❌ 유지보수: 수정하기 힘듦');
          console.log('   ❌ 에러 처리: 각 단계마다 에러 체크 필요');
          console.log('   ❌ 디버깅: 어디서 문제가 생겼는지 찾기 어려움');
          console.log('   ❌ 테스트: 각 단계를 독립적으로 테스트하기 힘듦\n');

          // ============================================
          // 4. 코드 비교
          // ============================================
          console.log('4. 이상적인 코드 vs Callback Hell\n');
          console.log('   [이상적인 코드]');
          console.log(`
   const user = getUser(1);
   const posts = getPosts(user.id);
   const comments = getComments(posts[0].id);
   const likes = getLikes(comments[0].id);
          `);

          console.log('   [실제 Callback Hell]');
          console.log(`
   getUser(1, (err, user) => {
     getPosts(user.id, (err, posts) => {
       getComments(posts[0].id, (err, comments) => {
         getLikes(comments[0].id, (err, likes) => {
           // 여기까지 4단계 중첩!
         });
       });
     });
   });
          `);

          // ============================================
          // 5. 해결 방법 미리보기
          // ============================================
          console.log('\n5. Callback Hell 해결 방법\n');
          console.log('   방법 1: Named Functions (함수 이름 지정)');
          console.log('   방법 2: Promise 사용 ← 다음 파일에서!');
          console.log('   방법 3: async/await 사용 ← 5번째 파일에서!\n');

          // ============================================
          // 6. 방법 1: Named Functions로 개선
          // ============================================
          console.log('6. 방법 1: Named Functions로 개선\n');
          console.log('   콜백을 익명 함수 대신 이름있는 함수로 분리\n');

          // 각 단계를 독립적인 함수로 분리
          function handleUser(err, user) {
            if (err) return console.error(err);
            console.log('   Step 1: User 처리');
            getPosts(user.id, handlePosts);
          }

          function handlePosts(err, posts) {
            if (err) return console.error(err);
            console.log('   Step 2: Posts 처리');
            getComments(posts[0].id, handleComments);
          }

          function handleComments(err, comments) {
            if (err) return console.error(err);
            console.log('   Step 3: Comments 처리');
            getLikes(comments[0].id, handleLikes);
          }

          function handleLikes(err, likes) {
            if (err) return console.error(err);
            console.log('   Step 4: Likes 처리 -', likes);
          }

          // 실행
          getUser(1, handleUser);

          setTimeout(() => {
            console.log('\n   ✅ 중첩은 줄었지만 여전히 불편함!');
            console.log('   → Promise를 사용하면 더 깔끔해집니다.\n');

            // ============================================
            // 7. 실전 팁
            // ============================================
            console.log('7. Callback Hell 피하는 팁\n');
            console.log('   1. 콜백 중첩은 2~3단계까지만');
            console.log('   2. 함수를 분리해서 이름 붙이기');
            console.log('   3. 가능하면 Promise 사용');
            console.log('   4. 최신 코드는 async/await 사용');
            console.log('   5. 에러 처리를 잊지 말 것!\n');

            console.log('='.repeat(60));
            console.log('다음: 03-promise-basics.js');
            console.log('Promise로 이 문제를 어떻게 해결하는지 확인해봅시다!');
            console.log('='.repeat(60));

          }, 4500);

        }, 500);

      });
    });
  });
});

/**
 * 핵심 정리:
 *
 * Callback Hell이란?
 * - 콜백 안에 콜백이 중첩되어 코드가 오른쪽으로 깊어지는 현상
 * - "Pyramid of Doom" (파멸의 피라미드)라고도 함
 *
 * 문제점:
 * - 가독성 저하
 * - 에러 처리 복잡
 * - 유지보수 어려움
 * - 디버깅 힘듦
 *
 * 해결책:
 * 1. Named Functions (임시방편)
 * 2. Promise (권장)
 * 3. async/await (가장 권장)
 *
 * 다음 파일에서 Promise로 이 문제를 해결해봅시다!
 */

/**
 * 실행:
 * node 02-callback-hell.js
 *
 * 코드를 읽으면서 중첩이 얼마나 불편한지 느껴보세요!
 */
