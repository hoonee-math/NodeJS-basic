/**
 * 07-fs-promises.js
 *
 * fs.promises API - Promise 기반 파일 시스템
 * async/await와 함께 사용하기 좋은 최신 API
 */

const fs = require('fs').promises;  // Promise 버전!
const path = require('path');

console.log('=== fs.promises API ===\n');

// ============================================
// 1. fs.promises란?
// ============================================
console.log('1. fs.promises란?\n');
console.log('   - Promise를 반환하는 fs 메서드');
console.log('   - async/await와 함께 사용');
console.log('   - Callback Hell 방지');
console.log('   - 현대적이고 깔끔한 코드\n');

// ============================================
// 2. 기본 사용법 - async/await
// ============================================
(async () => {
  console.log('2. async/await와 함께 사용\n');

  try {
    const filePath = path.join(__dirname, 'promises-test.txt');

    // 파일 쓰기
    await fs.writeFile(filePath, 'Hello from fs.promises!');
    console.log('   ✅ 파일 생성');

    // 파일 읽기
    const data = await fs.readFile(filePath, 'utf-8');
    console.log('   읽은 내용:', data);

    console.log('\n   → Callback 없이 동기 코드처럼 작성!\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

})();

// ============================================
// 3. 순차적 파일 처리
// ============================================
setTimeout(async () => {
  console.log('3. 순차적 파일 처리\n');

  try {
    const file1 = path.join(__dirname, 'seq-1.txt');
    const file2 = path.join(__dirname, 'seq-2.txt');
    const file3 = path.join(__dirname, 'seq-3.txt');

    // 순차적으로 파일 생성
    await fs.writeFile(file1, 'File 1');
    console.log('   ✅ seq-1.txt 생성');

    await fs.writeFile(file2, 'File 2');
    console.log('   ✅ seq-2.txt 생성');

    await fs.writeFile(file3, 'File 3');
    console.log('   ✅ seq-3.txt 생성');

    console.log('\n   → await로 순서 보장\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 500);

// ============================================
// 4. 병렬 처리 - Promise.all
// ============================================
setTimeout(async () => {
  console.log('4. 병렬 처리 - Promise.all\n');

  try {
    console.time('   병렬 처리 시간');

    const files = [
      fs.writeFile(path.join(__dirname, 'parallel-1.txt'), 'Content 1'),
      fs.writeFile(path.join(__dirname, 'parallel-2.txt'), 'Content 2'),
      fs.writeFile(path.join(__dirname, 'parallel-3.txt'), 'Content 3')
    ];

    await Promise.all(files);

    console.timeEnd('   병렬 처리 시간');
    console.log('   ✅ 3개 파일 동시 생성');
    console.log('\n   → Promise.all로 병렬 처리\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 1500);

// ============================================
// 5. 에러 처리 - try-catch
// ============================================
setTimeout(async () => {
  console.log('5. 에러 처리 - try-catch\n');

  try {
    const data = await fs.readFile('nonexistent.txt', 'utf-8');
    console.log('   데이터:', data);
  } catch (error) {
    console.log('   ❌ 에러 코드:', error.code);
    console.log('   메시지:', error.message);
    console.log('\n   → try-catch로 깔끔한 에러 처리\n');
  }

}, 2000);

// ============================================
// 6. 파일 복사 + 읽기 예제
// ============================================
setTimeout(async () => {
  console.log('6. 파일 복사 + 내용 확인\n');

  try {
    const source = path.join(__dirname, 'sample.txt');
    const destination = path.join(__dirname, 'sample-copy.txt');

    // 파일 복사
    await fs.copyFile(source, destination);
    console.log('   ✅ 파일 복사 완료');

    // 복사된 파일 읽기
    const content = await fs.readFile(destination, 'utf-8');
    console.log('   첫 줄:', content.split('\n')[0]);
    console.log('\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 2500);

// ============================================
// 7. 디렉토리 작업
// ============================================
setTimeout(async () => {
  console.log('7. 디렉토리 작업\n');

  try {
    const dirPath = path.join(__dirname, 'promises-dir');

    // 디렉토리 생성
    await fs.mkdir(dirPath, { recursive: true });
    console.log('   ✅ promises-dir 생성');

    // 파일 생성
    await fs.writeFile(path.join(dirPath, 'file.txt'), 'Content');
    console.log('   ✅ file.txt 생성');

    // 디렉토리 읽기
    const files = await fs.readdir(dirPath);
    console.log('   폴더 내용:', files);
    console.log('\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 3000);

// ============================================
// 8. 파일 정보 조회
// ============================================
setTimeout(async () => {
  console.log('8. 파일 정보 조회\n');

  try {
    const filePath = path.join(__dirname, 'sample.txt');
    const stats = await fs.stat(filePath);

    console.log('   파일:', stats.isFile());
    console.log('   크기:', (stats.size / 1024).toFixed(2), 'KB');
    console.log('   수정:', stats.mtime.toLocaleString());
    console.log('\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 3500);

// ============================================
// 9. 실전: JSON 파일 읽기/수정/쓰기
// ============================================
setTimeout(async () => {
  console.log('9. 실전: JSON 파일 CRUD\n');

  try {
    const jsonPath = path.join(__dirname, 'config.json');

    // 1. JSON 생성
    const config = {
      port: 3000,
      host: 'localhost',
      debug: true
    };

    await fs.writeFile(jsonPath, JSON.stringify(config, null, 2));
    console.log('   ✅ JSON 생성');

    // 2. JSON 읽기
    const jsonString = await fs.readFile(jsonPath, 'utf-8');
    const data = JSON.parse(jsonString);
    console.log('   읽은 데이터:', data);

    // 3. 데이터 수정
    data.port = 4000;
    data.updated = new Date().toISOString();

    // 4. 다시 저장
    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2));
    console.log('   ✅ JSON 수정 완료');
    console.log('\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 4000);

// ============================================
// 10. Promise vs Callback 비교
// ============================================
setTimeout(() => {
  console.log('10. Promise vs Callback 비교\n');

  console.log('   [Callback 방식]');
  console.log(`
   const fs = require('fs');

   fs.readFile('file.txt', 'utf-8', (err, data) => {
     if (err) return console.error(err);
     fs.writeFile('output.txt', data, (err) => {
       if (err) return console.error(err);
       console.log('완료');
     });
   });
  `);

  console.log('   [Promise 방식]');
  console.log(`
   const fs = require('fs').promises;

   async function copyFile() {
     try {
       const data = await fs.readFile('file.txt', 'utf-8');
       await fs.writeFile('output.txt', data);
       console.log('완료');
     } catch (error) {
       console.error(error);
     }
   }
  `);

  console.log('   → Promise 방식이 훨씬 깔끔!\n');

}, 4500);

// ============================================
// 11. 여러 파일 동시 읽기
// ============================================
setTimeout(async () => {
  console.log('11. 여러 파일 동시 읽기\n');

  try {
    const files = [
      fs.readFile(path.join(__dirname, 'sample.txt'), 'utf-8'),
      fs.readFile(path.join(__dirname, 'README.md'), 'utf-8').catch(() => '(없음)'),
      fs.readFile(path.join(__dirname, '01-read-file-sync.js'), 'utf-8')
    ];

    console.time('   읽기 시간');
    const [file1, file2, file3] = await Promise.all(files);
    console.timeEnd('   읽기 시간');

    console.log('   file1 크기:', file1.length, 'bytes');
    console.log('   file2:', file2.substring(0, 20));
    console.log('   file3 크기:', file3.length, 'bytes');
    console.log('\n   → Promise.all로 병렬 읽기\n');

  } catch (error) {
    console.error('   에러:', error.message);
  }

}, 5000);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('fs.promises 정리');
  console.log('='.repeat(60));
  console.log(`
✅ const fs = require('fs').promises

주요 메서드:
- fs.readFile(path, encoding)
- fs.writeFile(path, data)
- fs.appendFile(path, data)
- fs.copyFile(src, dest)
- fs.unlink(path)
- fs.rename(oldPath, newPath)
- fs.mkdir(path, options)
- fs.readdir(path, options)
- fs.rm(path, options)
- fs.stat(path)

장점:
✅ async/await와 완벽 호환
✅ Callback Hell 방지
✅ try-catch로 에러 처리
✅ Promise.all로 병렬 처리
✅ 현대적이고 깔끔한 코드

권장: 새 코드는 fs.promises 사용!

03-fs 완료! 🎉
파일 시스템의 모든 것을 배웠습니다!
  `);
}, 6000);

/**
 * 핵심 정리:
 *
 * fs.promises:
 * const fs = require('fs').promises;
 *
 * async/await 사용:
 * async function example() {
 *   try {
 *     const data = await fs.readFile('file.txt', 'utf-8');
 *     await fs.writeFile('output.txt', data);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * }
 *
 * 병렬 처리:
 * const [file1, file2] = await Promise.all([
 *   fs.readFile('1.txt', 'utf-8'),
 *   fs.readFile('2.txt', 'utf-8')
 * ]);
 */

/**
 * 실행:
 * node 07-fs-promises.js
 */
