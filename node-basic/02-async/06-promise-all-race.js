/**
 * 06-promise-all-race.js
 *
 * Promise 동시성 처리
 * 여러 Promise를 동시에 처리하는 방법들
 */

console.log('=== Promise 동시성 처리 ===\n');

// ============================================
// 1. 왜 동시성 처리가 필요한가?
// ============================================
console.log('1. 왜 동시성 처리가 필요한가?\n');

function fetchData(name, ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`   ${name} 완료 (${ms}ms)`);
      resolve(name);
    }, ms);
  });
}

// 순차 실행 (느림!)
console.log('   [순차 실행]');
console.time('   순차');

fetchData('A', 1000)
  .then(() => fetchData('B', 1000))
  .then(() => fetchData('C', 1000))
  .then(() => {
    console.timeEnd('   순차');
    console.log('   → 총 3000ms 걸림 (1000 + 1000 + 1000)\n');

    // 병렬 실행 (빠름!)
    console.log('   [병렬 실행 - Promise.all]');
    console.time('   병렬');

    Promise.all([
      fetchData('D', 1000),
      fetchData('E', 1000),
      fetchData('F', 1000)
    ]).then(() => {
      console.timeEnd('   병렬');
      console.log('   → 총 1000ms 걸림 (동시 실행!)\n');

      continueDemo();
    });
  });

// ============================================
// 2. Promise.all() - 모두 성공해야 함
// ============================================
function continueDemo() {
  setTimeout(() => {
    console.log('2. Promise.all() - 모두 완료까지 대기\n');

    const promises = [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3)
    ];

    Promise.all(promises).then((results) => {
      console.log('   결과 배열:', results);
      console.log('   → 모든 Promise의 결과를 배열로 반환\n');
    });

  }, 100);

  // ============================================
  // 3. Promise.all() 실전 예제
  // ============================================
  setTimeout(async () => {
    console.log('3. Promise.all() 실전 예제\n');

    function fetchUser(id) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id, name: `User ${id}` });
        }, 1000);
      });
    }

    // 여러 사용자를 동시에 조회
    console.log('   3명의 사용자 동시 조회 중...');
    console.time('   조회 시간');

    const users = await Promise.all([
      fetchUser(1),
      fetchUser(2),
      fetchUser(3)
    ]);

    console.timeEnd('   조회 시간');
    console.log('   결과:', users);
    console.log('   → 순차 실행이면 3000ms, 병렬은 1000ms!\n');

  }, 1500);

  // ============================================
  // 4. Promise.all() - 하나라도 실패하면 전체 실패
  // ============================================
  setTimeout(() => {
    console.log('4. Promise.all() - 하나라도 실패하면?\n');

    const promises = [
      Promise.resolve('성공 1'),
      Promise.reject(new Error('실패!')),  // 이것 때문에
      Promise.resolve('성공 3')
    ];

    Promise.all(promises)
      .then((results) => {
        console.log('   성공:', results);
      })
      .catch((error) => {
        console.log('   ❌ 전체 실패:', error.message);
        console.log('   → 하나라도 실패하면 즉시 reject (fail-fast)\n');
      });

  }, 3000);

  // ============================================
  // 5. Promise.race() - 가장 먼저 완료되는 것
  // ============================================
  setTimeout(() => {
    console.log('5. Promise.race() - 가장 빠른 것 반환\n');

    const promises = [
      fetchData('느림', 3000),
      fetchData('중간', 2000),
      fetchData('빠름', 1000)
    ];

    Promise.race(promises).then((result) => {
      console.log('   가장 빠른 결과:', result);
      console.log('   → 첫 번째로 완료된 Promise만 반환\n');
    });

  }, 3500);

  // ============================================
  // 6. Promise.race() 실전: 타임아웃 구현
  // ============================================
  setTimeout(async () => {
    console.log('6. Promise.race() 실전: 타임아웃\n');

    function timeout(ms) {
      return new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`${ms}ms 타임아웃!`));
        }, ms);
      });
    }

    function slowAPI() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('API 응답');
        }, 5000);  // 5초 걸림
      });
    }

    try {
      const result = await Promise.race([
        slowAPI(),
        timeout(2000)  // 2초 제한
      ]);
      console.log('   성공:', result);
    } catch (error) {
      console.log('   ❌', error.message);
      console.log('   → API가 너무 느려서 타임아웃!\n');
    }

  }, 7500);

  // ============================================
  // 7. Promise.allSettled() - 모든 결과 확인
  // ============================================
  setTimeout(async () => {
    console.log('7. Promise.allSettled() - 성공/실패 모두 확인\n');

    const promises = [
      Promise.resolve('성공 1'),
      Promise.reject(new Error('실패!')),
      Promise.resolve('성공 3')
    ];

    const results = await Promise.allSettled(promises);

    console.log('   모든 결과:');
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') {
        console.log(`   [${i}] ✅ 성공:`, result.value);
      } else {
        console.log(`   [${i}] ❌ 실패:`, result.reason.message);
      }
    });

    console.log('   → 실패해도 다른 Promise 결과를 볼 수 있음!\n');

  }, 10000);

  // ============================================
  // 8. Promise.any() - 첫 번째 성공 (ES2021)
  // ============================================
  setTimeout(async () => {
    console.log('8. Promise.any() - 첫 번째 성공 반환\n');

    const promises = [
      Promise.reject(new Error('실패 1')),
      Promise.resolve('성공!'),
      Promise.reject(new Error('실패 2'))
    ];

    try {
      const result = await Promise.any(promises);
      console.log('   첫 성공:', result);
      console.log('   → 실패는 무시하고 첫 성공만 반환\n');
    } catch (error) {
      console.log('   모두 실패:', error);
    }

  }, 10500);

  // ============================================
  // 9. 비교 정리
  // ============================================
  setTimeout(() => {
    console.log('9. Promise 메서드 비교\n');

    console.log('┌──────────────┬────────────────┬────────────────┐');
    console.log('│ 메서드       │ 완료 조건      │ 반환값         │');
    console.log('├──────────────┼────────────────┼────────────────┤');
    console.log('│ Promise.all  │ 모두 성공      │ 결과 배열      │');
    console.log('│              │ (하나 실패→실패)│               │');
    console.log('├──────────────┼────────────────┼────────────────┤');
    console.log('│ Promise.race │ 첫 완료        │ 첫 결과 하나   │');
    console.log('│              │ (성공/실패 무관)│               │');
    console.log('├──────────────┼────────────────┼────────────────┤');
    console.log('│ allSettled   │ 모두 완료      │ 상태+결과 배열 │');
    console.log('│              │ (실패 포함)    │               │');
    console.log('├──────────────┼────────────────┼────────────────┤');
    console.log('│ Promise.any  │ 첫 성공        │ 첫 성공 하나   │');
    console.log('│              │ (모두 실패→실패)│               │');
    console.log('└──────────────┴────────────────┴────────────────┘\n');

  }, 11000);

  // ============================================
  // 10. 실전 사용 예시
  // ============================================
  setTimeout(async () => {
    console.log('10. 실전 사용 예시\n');

    console.log('   [Promise.all - 여러 API 동시 호출]');
    console.log(`
   const [users, posts, comments] = await Promise.all([
     fetchUsers(),
     fetchPosts(),
     fetchComments()
   ]);
    `);

    console.log('   [Promise.race - 타임아웃]');
    console.log(`
   const result = await Promise.race([
     fetchData(),
     timeout(5000)
   ]);
    `);

    console.log('   [Promise.allSettled - 부분 실패 허용]');
    console.log(`
   const results = await Promise.allSettled([
     api1(),
     api2(),
     api3()
   ]);
   // 일부 실패해도 나머지 결과 사용 가능
    `);

    console.log('   [Promise.any - 가장 빠른 서버]');
    console.log(`
   const data = await Promise.any([
     fetchFromServer1(),
     fetchFromServer2(),
     fetchFromServer3()
   ]);
   // 가장 빠른 서버의 응답 사용
    `);

  }, 11500);

  // ============================================
  // 마무리
  // ============================================
  setTimeout(() => {
    console.log('\n' + '='.repeat(60));
    console.log('Promise 동시성 정리');
    console.log('='.repeat(60));
    console.log(`
✅ Promise.all - 모두 성공해야 함 (병렬 처리)
✅ Promise.race - 가장 빠른 것 (타임아웃)
✅ Promise.allSettled - 성공/실패 모두 확인
✅ Promise.any - 첫 성공 (여러 서버 중 하나)

적절한 메서드 선택으로 효율적인 비동기 처리!

다음: 07-error-handling.js
비동기 에러 처리의 모든 것을 배워봅시다!
    `);
  }, 12500);
}

/**
 * 핵심 정리:
 *
 * 병렬 처리의 중요성:
 * - 순차: await를 여러 번 → 느림
 * - 병렬: Promise.all → 빠름
 *
 * 메서드 선택:
 * - 모두 필요 & 실패하면 안 됨 → Promise.all
 * - 타임아웃 필요 → Promise.race
 * - 부분 실패 허용 → Promise.allSettled
 * - 하나만 성공하면 됨 → Promise.any
 *
 * 성능 팁:
 * - 독립적인 작업은 항상 병렬로!
 * - Promise.all로 시간 절약
 * - 의존성 있는 작업만 순차적으로
 */

/**
 * 실행:
 * node 06-promise-all-race.js
 *
 * 순차 vs 병렬 실행 시간 차이를 확인하세요!
 */
