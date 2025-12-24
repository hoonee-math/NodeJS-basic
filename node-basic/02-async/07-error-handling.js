/**
 * 07-error-handling.js
 *
 * 비동기 에러 처리
 * Callback, Promise, async/await의 에러 처리 방법
 */

console.log('=== 비동기 에러 처리 ===\n');

// ============================================
// 1. 왜 에러 처리가 중요한가?
// ============================================
console.log('1. 왜 에러 처리가 중요한가?\n');
console.log('   - 비동기 작업은 언제든 실패할 수 있음');
console.log('   - 네트워크 오류, 파일 없음, 타임아웃 등');
console.log('   - 처리하지 않으면 앱이 크래시하거나 이상 동작');
console.log('   - Node.js에서는 UnhandledPromiseRejection 경고\n');

// ============================================
// 2. Callback 에러 처리
// ============================================
setTimeout(() => {
  console.log('2. Callback 에러 처리 (Error-First Pattern)\n');

  function readFileCallback(filename, callback) {
    setTimeout(() => {
      if (filename === 'error.txt') {
        callback(new Error('파일을 찾을 수 없습니다'), null);
      } else {
        callback(null, '파일 내용');
      }
    }, 1000);
  }

  // 올바른 에러 처리
  readFileCallback('data.txt', (err, data) => {
    if (err) {
      console.log('   ❌ 에러 발생:', err.message);
      return;  // 에러 시 즉시 종료
    }
    console.log('   ✅ 데이터:', data);
  });

  // 에러 케이스
  readFileCallback('error.txt', (err, data) => {
    if (err) {
      console.log('   ❌ 에러 발생:', err.message);
      return;
    }
    console.log('   ✅ 데이터:', data);
  });

  console.log('\n   → 첫 번째 인자는 항상 에러 체크!\n');

}, 100);

// ============================================
// 3. Promise 에러 처리 - .catch()
// ============================================
setTimeout(() => {
  console.log('3. Promise 에러 처리 - .catch()\n');

  function readFilePromise(filename) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (filename === 'error.txt') {
          reject(new Error('파일을 찾을 수 없습니다'));
        } else {
          resolve('파일 내용');
        }
      }, 1000);
    });
  }

  // .catch()로 에러 처리
  readFilePromise('data.txt')
    .then((data) => {
      console.log('   ✅ 데이터:', data);
    })
    .catch((error) => {
      console.log('   ❌ 에러:', error.message);
    });

  readFilePromise('error.txt')
    .then((data) => {
      console.log('   ✅ 데이터:', data);
    })
    .catch((error) => {
      console.log('   ❌ 에러:', error.message);
    });

  console.log('\n   → .catch()가 체인 어디서든 에러 포착\n');

}, 2500);

// ============================================
// 4. Promise 체인에서의 에러 전파
// ============================================
setTimeout(() => {
  console.log('4. Promise 체인에서 에러 전파\n');

  Promise.resolve('시작')
    .then((result) => {
      console.log('   Step 1:', result);
      return 'Step 2로';
    })
    .then((result) => {
      console.log('   Step 2:', result);
      throw new Error('Step 2에서 에러!');  // 여기서 에러 발생
    })
    .then((result) => {
      console.log('   Step 3: 실행 안 됨', result);
    })
    .catch((error) => {
      console.log('   ❌ catch에서 포착:', error.message);
      console.log('   → 에러 발생 후 모든 .then() 건너뛰고 .catch()로\n');
    });

}, 5000);

// ============================================
// 5. .catch() 후 체이닝 계속하기
// ============================================
setTimeout(() => {
  console.log('5. .catch() 후 복구 및 계속 진행\n');

  Promise.resolve('시작')
    .then((result) => {
      console.log('   Step 1:', result);
      throw new Error('에러 발생!');
    })
    .catch((error) => {
      console.log('   ❌ 에러 처리:', error.message);
      return '복구됨';  // 값을 return하면 다시 정상 흐름
    })
    .then((result) => {
      console.log('   ✅ Step 2:', result);
      console.log('   → .catch()에서 return하면 체이닝 계속!\n');
    });

}, 6000);

// ============================================
// 6. async/await 에러 처리 - try-catch
// ============================================
setTimeout(async () => {
  console.log('6. async/await 에러 처리 - try-catch\n');

  function asyncOperation(shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('작업 실패'));
        } else {
          resolve('작업 성공');
        }
      }, 1000);
    });
  }

  // 성공 케이스
  try {
    const result = await asyncOperation(false);
    console.log('   ✅', result);
  } catch (error) {
    console.log('   ❌', error.message);
  }

  // 실패 케이스
  try {
    const result = await asyncOperation(true);
    console.log('   ✅', result);
  } catch (error) {
    console.log('   ❌', error.message);
  }

  console.log('   → try-catch로 동기 코드처럼 에러 처리\n');

}, 7000);

// ============================================
// 7. finally - 항상 실행되는 정리 작업
// ============================================
setTimeout(async () => {
  console.log('7. finally - 정리 작업\n');

  function fetchData(shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error('네트워크 에러'));
        } else {
          resolve('데이터');
        }
      }, 1000);
    });
  }

  // Promise 방식
  console.log('   [Promise 방식]');
  fetchData(false)
    .then((data) => {
      console.log('   데이터:', data);
    })
    .catch((error) => {
      console.log('   에러:', error.message);
    })
    .finally(() => {
      console.log('   로딩 종료 (항상 실행)');
    });

  // async/await 방식
  console.log('\n   [async/await 방식]');
  try {
    const data = await fetchData(true);
    console.log('   데이터:', data);
  } catch (error) {
    console.log('   에러:', error.message);
  } finally {
    console.log('   로딩 종료 (항상 실행)');
  }

  console.log('\n   → finally는 성공/실패 관계없이 실행\n');

}, 10000);

// ============================================
// 8. 여러 에러 처리 패턴
// ============================================
setTimeout(async () => {
  console.log('8. 여러 에러 처리 패턴\n');

  function operation(step) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (step === 2) {
          reject(new Error(`Step ${step} 실패`));
        } else {
          resolve(`Step ${step} 성공`);
        }
      }, 500);
    });
  }

  // 패턴 1: 각 단계마다 try-catch
  console.log('   [패턴 1: 각 단계 개별 처리]');
  try {
    const result1 = await operation(1);
    console.log('   ', result1);
  } catch (error) {
    console.log('   에러:', error.message);
  }

  try {
    const result2 = await operation(2);
    console.log('   ', result2);
  } catch (error) {
    console.log('   에러:', error.message);
  }

  try {
    const result3 = await operation(3);
    console.log('   ', result3);
  } catch (error) {
    console.log('   에러:', error.message);
  }

  console.log('   → 각 단계를 독립적으로 처리\n');

}, 13500);

// ============================================
// 9. 전체를 하나의 try-catch로
// ============================================
setTimeout(async () => {
  console.log('9. 전체를 하나의 try-catch로\n');

  function operation(step) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (step === 2) {
          reject(new Error(`Step ${step} 실패`));
        } else {
          resolve(`Step ${step} 성공`);
        }
      }, 500);
    });
  }

  try {
    const result1 = await operation(1);
    console.log('   ', result1);

    const result2 = await operation(2);  // 여기서 에러!
    console.log('   ', result2);

    const result3 = await operation(3);  // 실행 안 됨
    console.log('   ', result3);
  } catch (error) {
    console.log('   ❌ 전체 중단:', error.message);
    console.log('   → 하나 실패하면 나머지 실행 안 됨\n');
  }

}, 15500);

// ============================================
// 10. Promise.allSettled로 부분 실패 처리
// ============================================
setTimeout(async () => {
  console.log('10. Promise.allSettled - 부분 실패 허용\n');

  function task(id, shouldFail) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error(`Task ${id} 실패`));
        } else {
          resolve(`Task ${id} 성공`);
        }
      }, 500);
    });
  }

  const results = await Promise.allSettled([
    task(1, false),
    task(2, true),   // 실패
    task(3, false),
    task(4, true)    // 실패
  ]);

  results.forEach((result, i) => {
    if (result.status === 'fulfilled') {
      console.log(`   [${i + 1}] ✅`, result.value);
    } else {
      console.log(`   [${i + 1}] ❌`, result.reason.message);
    }
  });

  console.log('   → 일부 실패해도 모든 결과 확인 가능!\n');

}, 17000);

// ============================================
// 11. 에러 처리 Best Practices
// ============================================
setTimeout(() => {
  console.log('11. 에러 처리 Best Practices\n');

  console.log('   ✅ 항상 에러 처리 코드 작성');
  console.log('   ✅ Promise는 .catch() 필수');
  console.log('   ✅ async/await는 try-catch 사용');
  console.log('   ✅ finally로 정리 작업 (리소스 해제 등)');
  console.log('   ✅ 의미있는 에러 메시지 작성');
  console.log('   ✅ 필요시 에러 로깅');
  console.log('   ❌ 에러를 무시하지 말 것 (catch 안에 빈 블록)');
  console.log('   ❌ 모든 에러를 하나로 처리하지 말 것');

  console.log('\n   [Good Example]');
  console.log(`
   async function fetchData() {
     try {
       const data = await api.get('/data');
       return data;
     } catch (error) {
       console.error('데이터 조회 실패:', error);
       throw error;  // 상위로 전파
     } finally {
       console.log('API 호출 완료');
     }
   }
  `);

  console.log('   [Bad Example]');
  console.log(`
   async function fetchData() {
     const data = await api.get('/data');  // 에러 처리 없음!
     return data;
   }
  `);

}, 18500);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('\n' + '='.repeat(60));
  console.log('비동기 에러 처리 정리');
  console.log('='.repeat(60));
  console.log(`
✅ Callback: Error-first 패턴 (err, result)
✅ Promise: .catch()로 에러 처리
✅ async/await: try-catch 사용
✅ finally: 항상 실행 (정리 작업)
✅ Promise.allSettled: 부분 실패 허용

에러 처리는 필수!
- 네트워크, 파일, DB 등 모든 I/O 작업은 실패할 수 있음
- 처리하지 않으면 앱 크래시나 이상 동작
- 항상 에러를 예상하고 처리하는 습관!

02-async 완료! 🎉
비동기 처리의 모든 것을 배웠습니다.
다음 단계에서 실제 파일 시스템 작업에 적용해봅시다!
  `);
}, 19500);

/**
 * 핵심 정리:
 *
 * 1. Callback 에러 처리:
 * callback(err, result)
 * if (err) return console.error(err);
 *
 * 2. Promise 에러 처리:
 * promise
 *   .then(...)
 *   .catch(error => { ... })
 *   .finally(() => { ... });
 *
 * 3. async/await 에러 처리:
 * try {
 *   const result = await promise;
 * } catch (error) {
 *   // 에러 처리
 * } finally {
 *   // 정리 작업
 * }
 *
 * 항상 기억:
 * - 에러 처리는 필수!
 * - 모든 비동기 작업은 실패할 수 있음
 * - 적절한 에러 메시지와 로깅
 */

/**
 * 실행:
 * node 07-error-handling.js
 *
 * 다양한 에러 처리 패턴을 확인하세요!
 */
