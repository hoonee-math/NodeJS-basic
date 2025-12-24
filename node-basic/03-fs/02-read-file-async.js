/**
 * 02-read-file-async.js
 *
 * 비동기 파일 읽기 (Asynchronous)
 * fs.readFile()과 fs.writeFile() - Callback 방식
 */

const fs = require('fs');
const path = require('path');

console.log('=== 비동기 파일 읽기 (Async) ===\n');

// ============================================
// 1. 비동기 방식의 중요성
// ============================================
console.log('1. 왜 비동기가 중요한가?\n');
console.log('   Node.js의 핵심 = Non-blocking I/O');
console.log('   - 파일 읽는 동안 다른 작업 가능');
console.log('   - 서버가 여러 요청 동시 처리');
console.log('   - I/O 대기 시간 동안 CPU 활용');
console.log('   - 서버 애플리케이션에서 필수!\n');

// ============================================
// 2. fs.readFile() 기본
// ============================================
console.log('2. fs.readFile() 기본 사용\n');

const filePath = path.join(__dirname, 'sample.txt');

console.log('   [1] 파일 읽기 시작');

fs.readFile(filePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('   에러:', err.message);
    return;
  }

  console.log('   [3] 파일 읽기 완료');
  console.log('   내용:', data);
});

console.log('   [2] 다음 코드 실행 (파일 읽기 완료 전!)');
console.log('\n   → 비동기: 완료를 기다리지 않고 다음 코드 실행\n');

// ============================================
// 3. Error-First Callback 패턴
// ============================================
setTimeout(() => {
  console.log('3. Error-First Callback 패턴\n');
  console.log('   Node.js의 표준 콜백 패턴:');
  console.log('   callback(error, result)');
  console.log('   - 첫 번째 인자: 에러 (없으면 null)');
  console.log('   - 두 번째 인자: 결과 데이터\n');

  // 성공 케이스
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      console.error('   에러:', err);
      return;  // 에러 시 즉시 종료
    }

    console.log('   ✅ 파일 읽기 성공');
    console.log('   줄 수:', data.split('\n').length);
  });

  // 실패 케이스
  fs.readFile('없는파일.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log('\n   ❌ 파일 없음:', err.code);
      console.log('   → 항상 err를 먼저 체크!\n');
      return;
    }

    console.log('   데이터:', data);
  });

}, 500);

// ============================================
// 4. fs.writeFile() - 비동기 쓰기
// ============================================
setTimeout(() => {
  console.log('4. fs.writeFile() - 비동기 파일 쓰기\n');

  const outputPath = path.join(__dirname, 'output-async.txt');
  const content = `Hello from writeFile!\n비동기로 생성됨: ${new Date().toLocaleString()}`;

  console.log('   파일 쓰기 시작...');

  fs.writeFile(outputPath, content, 'utf-8', (err) => {
    if (err) {
      console.error('   에러:', err.message);
      return;
    }

    console.log('   ✅ 파일 생성 완료');

    // 방금 쓴 파일 읽기
    fs.readFile(outputPath, 'utf-8', (err, data) => {
      if (err) {
        console.error('   에러:', err.message);
        return;
      }

      console.log('   내용:', data);
      console.log('\n   → 비동기는 콜백 안에 콜백 (중첩)\n');
    });
  });

}, 1500);

// ============================================
// 5. fs.appendFile() - 파일 끝에 추가
// ============================================
setTimeout(() => {
  console.log('5. fs.appendFile() - 내용 추가\n');

  const filePath = path.join(__dirname, 'output-async.txt');
  const additionalContent = '\n이 줄은 추가됨!';

  fs.appendFile(filePath, additionalContent, 'utf-8', (err) => {
    if (err) {
      console.error('   에러:', err.message);
      return;
    }

    console.log('   ✅ 내용 추가 완료');

    // 확인
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return console.error(err);
      console.log('   전체 내용:', data);
      console.log('\n   → appendFile은 기존 내용 유지하고 끝에 추가\n');
    });
  });

}, 2500);

// ============================================
// 6. fs.unlink() - 파일 삭제
// ============================================
setTimeout(() => {
  console.log('6. fs.unlink() - 파일 삭제\n');

  const tempPath = path.join(__dirname, 'temp.txt');

  // 먼저 파일 생성
  fs.writeFile(tempPath, 'Temporary file', (err) => {
    if (err) {
      console.error('   에러:', err.message);
      return;
    }

    console.log('   ✅ temp.txt 생성');

    // 1초 후 삭제
    setTimeout(() => {
      fs.unlink(tempPath, (err) => {
        if (err) {
          console.error('   에러:', err.message);
          return;
        }

        console.log('   ✅ temp.txt 삭제');
        console.log('\n   → unlink로 파일 삭제\n');
      });
    }, 1000);
  });

}, 3500);

// ============================================
// 7. fs.rename() - 파일 이름 변경/이동
// ============================================
setTimeout(() => {
  console.log('7. fs.rename() - 이름 변경/이동\n');

  const oldPath = path.join(__dirname, 'old-name.txt');
  const newPath = path.join(__dirname, 'new-name.txt');

  // 파일 생성
  fs.writeFile(oldPath, 'Content', (err) => {
    if (err) return console.error(err);

    console.log('   ✅ old-name.txt 생성');

    // 이름 변경
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        console.error('   에러:', err.message);
        return;
      }

      console.log('   ✅ new-name.txt로 이름 변경');
      console.log('\n   → rename으로 이름 변경 또는 이동\n');
    });
  });

}, 5500);

// ============================================
// 8. 여러 파일 동시 읽기 (병렬)
// ============================================
setTimeout(() => {
  console.log('8. 여러 파일 동시 읽기 (병렬 처리)\n');

  // 3개 파일 생성
  const files = ['async1.txt', 'async2.txt', 'async3.txt'];

  files.forEach((filename, index) => {
    const filePath = path.join(__dirname, filename);
    fs.writeFile(filePath, `Content ${index + 1}`, (err) => {
      if (err) return console.error(err);
      console.log(`   ✅ ${filename} 생성`);
    });
  });

  // 모든 파일 동시에 읽기 시작
  console.log('\n   3개 파일 동시 읽기 시작...');
  console.time('   읽기 시간');

  let completed = 0;
  files.forEach((filename) => {
    const filePath = path.join(__dirname, filename);

    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) return console.error(err);

      console.log(`   ${filename}: ${data}`);
      completed++;

      if (completed === files.length) {
        console.timeEnd('   읽기 시간');
        console.log('\n   → 비동기는 여러 파일 동시 처리 가능!\n');
      }
    });
  });

}, 6500);

// ============================================
// 9. Callback Hell 예제
// ============================================
setTimeout(() => {
  console.log('9. Callback Hell (콜백 지옥)\n');

  const file1 = path.join(__dirname, 'step1.txt');
  const file2 = path.join(__dirname, 'step2.txt');
  const file3 = path.join(__dirname, 'step3.txt');

  fs.writeFile(file1, 'Step 1', (err) => {
    if (err) return console.error(err);
    console.log('   Step 1 완료');

    fs.writeFile(file2, 'Step 2', (err) => {
      if (err) return console.error(err);
      console.log('   Step 2 완료');

      fs.writeFile(file3, 'Step 3', (err) => {
        if (err) return console.error(err);
        console.log('   Step 3 완료');
        console.log('\n   → 중첩이 깊어짐 (Callback Hell)');
        console.log('   → Promise나 async/await로 해결 (다음 파일에서!)\n');
      });
    });
  });

}, 8000);

// ============================================
// 10. 비동기 방식의 장단점
// ============================================
setTimeout(() => {
  console.log('10. 비동기 방식의 장단점\n');

  console.log('   ✅ 장점:');
  console.log('   - Non-blocking - 다른 작업 동시 진행');
  console.log('   - 여러 파일 동시 처리 (병렬)');
  console.log('   - 서버 성능 향상');
  console.log('   - Node.js의 강점 활용\n');

  console.log('   ❌ 단점:');
  console.log('   - Callback Hell 가능성');
  console.log('   - 에러 처리 복잡');
  console.log('   - 실행 순서 예측 어려움');
  console.log('   - 디버깅 힘듦\n');

  console.log('   📌 해결책:');
  console.log('   - Promise 사용');
  console.log('   - async/await 사용 (07번 파일에서!)');
  console.log('   - fs.promises API 활용\n');

}, 9000);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('비동기 파일 읽기/쓰기 정리');
  console.log('='.repeat(60));
  console.log(`
✅ fs.readFile(path, encoding, callback)
✅ fs.writeFile(path, data, callback)
✅ fs.appendFile(path, data, callback)
✅ fs.unlink(path, callback)
✅ fs.rename(oldPath, newPath, callback)

✅ Non-blocking - 성능 좋음
✅ 병렬 처리 가능
❌ Callback Hell 주의

다음: 03-write-file.js
파일 쓰기의 다양한 방법을 배워봅시다!
  `);
}, 10000);

/**
 * 핵심 정리:
 *
 * 비동기 메서드:
 * - fs.readFile(path, encoding, callback)
 * - fs.writeFile(path, data, callback)
 * - fs.appendFile(path, data, callback)
 * - fs.unlink(path, callback)
 * - fs.rename(oldPath, newPath, callback)
 *
 * Error-First Callback:
 * callback(err, data) {
 *   if (err) return console.error(err);
 *   // 데이터 처리
 * }
 *
 * 특징:
 * - Non-blocking (다른 작업 계속 가능)
 * - 병렬 처리 가능
 * - 서버 애플리케이션에 필수
 */

/**
 * 실행:
 * node 02-read-file-async.js
 *
 * 생성되는 파일:
 * - output-async.txt
 * - async1.txt, async2.txt, async3.txt
 * - step1.txt, step2.txt, step3.txt
 * - new-name.txt
 */
