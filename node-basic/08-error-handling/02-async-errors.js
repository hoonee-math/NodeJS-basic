/**
 * 02-async-errors.js
 *
 * 비동기 코드의 에러 처리
 */

console.log('=== 비동기 에러 처리 ===\n');

// 1. 콜백 에러 처리 (Node.js 스타일)
console.log('1. 콜백 에러 처리 (err-first callback)\n');

const fs = require('fs');

// 테스트 파일 생성
fs.writeFileSync('test.txt', 'Hello, Async Errors!');

fs.readFile('test.txt', 'utf8', (err, data) => {
  if (err) {
    console.log(`   [에러] ${err.message}`);
    return;
  }

  console.log(`→ 파일 읽기 성공: "${data}"`);
});

// 존재하지 않는 파일
fs.readFile('nonexistent.txt', 'utf8', (err, data) => {
  if (err) {
    console.log(`→ [에러] ${err.code}: ${err.message.split(':')[0]}`);
    return;
  }

  console.log(`   데이터: ${data}`);
});

// 2. Promise 에러 처리 (.catch)
setTimeout(() => {
  console.log('\n2. Promise 에러 처리 (.catch)\n');

  const { promisify } = require('util');
  const readFileAsync = promisify(fs.readFile);

  readFileAsync('test.txt', 'utf8')
    .then((data) => {
      console.log(`→ 성공: "${data}"`);
    })
    .catch((err) => {
      console.log(`   [에러] ${err.message}`);
    });

  readFileAsync('nonexistent.txt', 'utf8')
    .then((data) => {
      console.log(`   데이터: ${data}`);
    })
    .catch((err) => {
      console.log(`→ [에러] ${err.code}: ${err.message.split(':')[0]}`);
    });
}, 100);

// 3. Promise 체이닝에서 에러 처리
setTimeout(() => {
  console.log('\n3. Promise 체이닝 에러 처리\n');

  Promise.resolve(10)
    .then((num) => {
      console.log(`→ 단계 1: ${num}`);
      return num * 2;
    })
    .then((num) => {
      console.log(`→ 단계 2: ${num}`);
      throw new Error('의도적 에러!');
    })
    .then((num) => {
      console.log(`→ 단계 3: ${num} (실행 안 됨)`);
    })
    .catch((err) => {
      console.log(`→ [catch] ${err.message}`);
    })
    .finally(() => {
      console.log('→ [finally] 항상 실행');
    });
}, 200);

// 4. async/await 에러 처리
setTimeout(async () => {
  console.log('\n4. async/await 에러 처리\n');

  const { promisify } = require('util');
  const readFileAsync = promisify(fs.readFile);

  // 성공 케이스
  try {
    console.log('→ 파일 읽기 시도...');
    const data = await readFileAsync('test.txt', 'utf8');
    console.log(`   성공: "${data}"`);
  } catch (err) {
    console.log(`   [에러] ${err.message}`);
  }

  // 실패 케이스
  try {
    console.log('→ 존재하지 않는 파일 읽기...');
    const data = await readFileAsync('nonexistent.txt', 'utf8');
    console.log(`   데이터: ${data}`);
  } catch (err) {
    console.log(`   [에러] ${err.code}: ${err.message.split(':')[0]}`);
  }

  console.log('→ 프로그램 계속 실행');
}, 300);

// 5. 여러 Promise 에러 처리
setTimeout(async () => {
  console.log('\n5. 여러 Promise 에러 처리\n');

  function asyncTask(id, shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          console.log(`   Task ${id}: 실패`);
          reject(new Error(`Task ${id} failed`));
        } else {
          console.log(`   Task ${id}: 성공`);
          resolve(`Result ${id}`);
        }
      }, Math.random() * 100);
    });
  }

  // Promise.all - 하나라도 실패하면 전체 실패
  console.log('(a) Promise.all (하나 실패 시 전체 실패):\n');

  try {
    const results = await Promise.all([
      asyncTask(1),
      asyncTask(2, true),
      asyncTask(3)
    ]);
    console.log('   모든 작업 성공:', results);
  } catch (err) {
    console.log(`→ [에러] ${err.message}`);
  }
}, 500);

setTimeout(async () => {
  console.log('\n(b) Promise.allSettled (모든 결과 확인):\n');

  function asyncTask(id, shouldFail = false) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error(`Task ${id} failed`));
        } else {
          resolve(`Result ${id}`);
        }
      }, 50);
    });
  }

  const results = await Promise.allSettled([
    asyncTask(1),
    asyncTask(2, true),
    asyncTask(3)
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`→ Task ${index + 1}: 성공 - ${result.value}`);
    } else {
      console.log(`→ Task ${index + 1}: 실패 - ${result.reason.message}`);
    }
  });
}, 800);

// 6. 타임아웃과 에러 처리
setTimeout(async () => {
  console.log('\n6. 타임아웃과 에러 처리\n');

  function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('타임아웃!')), ms);
    });

    return Promise.race([promise, timeout]);
  }

  function slowTask(delay) {
    console.log(`→ 작업 시작 (${delay}ms 소요)`);
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`   작업 완료`);
        resolve('완료');
      }, delay);
    });
  }

  // 성공 케이스
  try {
    const result = await withTimeout(slowTask(100), 200);
    console.log(`   결과: ${result}`);
  } catch (err) {
    console.log(`   [에러] ${err.message}`);
  }

  // 타임아웃 케이스
  try {
    console.log();
    const result = await withTimeout(slowTask(300), 200);
    console.log(`   결과: ${result}`);
  } catch (err) {
    console.log(`→ [에러] ${err.message}`);
  }
}, 1100);

// 7. 에러 재시도 패턴
setTimeout(async () => {
  console.log('\n7. 에러 재시도 패턴\n');

  let attemptCount = 0;

  async function unreliableTask() {
    attemptCount++;
    console.log(`   시도 #${attemptCount}`);

    if (attemptCount < 3) {
      throw new Error('일시적 오류');
    }

    return '성공!';
  }

  async function retry(fn, maxRetries = 3, delay = 100) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`→ 재시도 ${i + 1}/${maxRetries}`);
        const result = await fn();
        console.log(`   결과: ${result}`);
        return result;
      } catch (err) {
        console.log(`   실패: ${err.message}`);

        if (i === maxRetries - 1) {
          throw new Error(`${maxRetries}번 재시도 후 실패`);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  try {
    await retry(unreliableTask, 5, 50);
  } catch (err) {
    console.log(`→ [최종 실패] ${err.message}`);
  }
}, 1600);

// 8. async 함수의 에러는 항상 Promise rejection
setTimeout(() => {
  console.log('\n8. async 함수 에러 = Promise rejection\n');

  async function asyncFunction() {
    throw new Error('async 함수 에러');
  }

  // async 함수는 항상 Promise를 반환
  asyncFunction()
    .then(() => {
      console.log('   성공 (실행 안 됨)');
    })
    .catch((err) => {
      console.log(`→ [catch] ${err.message}`);
    });

  // try-catch로는 잡을 수 없음
  try {
    asyncFunction();  // Promise를 반환하지만 에러는 잡히지 않음
    console.log('→ try-catch는 async 함수의 에러를 못 잡음');
  } catch (err) {
    console.log(`   이 코드는 실행되지 않음: ${err.message}`);
  }
}, 2000);

// 정리
setTimeout(() => {
  console.log();
  fs.unlinkSync('test.txt');
}, 2500);

/**
 * 실행:
 * node 02-async-errors.js
 *
 * 핵심 개념:
 * - 콜백: err-first callback 패턴 (err, data)
 * - Promise: .catch() 또는 try-await-catch
 * - async/await: 동기 코드처럼 try-catch 사용 가능
 *
 * 콜백 에러 처리:
 * - 첫 번째 인자는 항상 에러
 * - err가 null이면 성공, 있으면 실패
 * - early return으로 에러 시 즉시 반환
 *
 * Promise 에러 처리:
 * - .catch(err => ...) 메서드 사용
 * - .finally(() => ...) 항상 실행
 * - 체이닝 중 에러 발생 시 다음 .then 건너뜀
 *
 * async/await 에러 처리:
 * - try-catch로 동기 코드처럼 처리
 * - await는 Promise를 기다림
 * - async 함수는 항상 Promise 반환
 *
 * Promise 조합:
 * - Promise.all([...]) - 하나라도 실패하면 전체 실패
 * - Promise.allSettled([...]) - 모든 결과 확인 (성공/실패)
 * - Promise.race([...]) - 가장 먼저 완료된 것
 * - Promise.any([...]) - 가장 먼저 성공한 것
 *
 * 에러 전파:
 * - Promise 체이닝: 에러가 발생하면 다음 .catch로 전파
 * - async/await: throw하면 Promise rejection으로 변환
 * - catch 없으면 unhandledRejection 발생
 *
 * 타임아웃 패턴:
 * - Promise.race로 구현
 * - 원래 Promise와 timeout Promise 경쟁
 * - 먼저 완료되는 것 사용
 *
 * 재시도 패턴:
 * - for 루프로 최대 재시도 횟수 제어
 * - try-catch로 실패 감지
 * - 지수 백오프 사용 가능
 *
 * Best Practices:
 * - 콜백보다 Promise/async-await 선호
 * - 모든 Promise에 .catch 또는 try-catch
 * - async 함수는 항상 await와 함께
 * - Promise.all보다 Promise.allSettled 고려
 * - 타임아웃 설정으로 무한 대기 방지
 *
 * 주의사항:
 * - async 함수의 에러는 Promise rejection
 * - try-catch는 await가 있는 Promise만 처리
 * - await 없이 호출하면 에러를 못 잡음
 * - unhandledRejection 리스너 필수
 */
