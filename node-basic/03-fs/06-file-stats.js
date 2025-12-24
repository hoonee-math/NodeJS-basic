/**
 * 06-file-stats.js
 *
 * 파일/디렉토리 정보 조회 (크기, 날짜 등)
 * fs.stat()과 Stats 객체
 */

const fs = require('fs');
const path = require('path');

console.log('=== 파일 정보 조회 (Stats) ===\n');

// 테스트 파일 생성
const testFile = path.join(__dirname, 'test-stats.txt');
fs.writeFileSync(testFile, 'Hello World!\nThis is a test file.');

// ============================================
// 1. fs.stat() - 파일 정보 조회
// ============================================
console.log('1. fs.stat() - 파일/디렉토리 정보\n');

fs.stat(testFile, (err, stats) => {
  if (err) return console.error(err);

  console.log('   전체 Stats 객체:');
  console.log(stats);
  console.log('\n   → fs.stat()는 Stats 객체 반환\n');
});

// ============================================
// 2. Stats 객체 주요 메서드
// ============================================
setTimeout(() => {
  console.log('2. Stats 객체 메서드\n');

  fs.stat(testFile, (err, stats) => {
    if (err) return console.error(err);

    console.log('   파일 타입:');
    console.log('   - isFile():', stats.isFile());
    console.log('   - isDirectory():', stats.isDirectory());
    console.log('   - isSymbolicLink():', stats.isSymbolicLink());
    console.log('\n');
  });

}, 500);

// ============================================
// 3. 파일 크기
// ============================================
setTimeout(() => {
  console.log('3. 파일 크기 확인\n');

  fs.stat(testFile, (err, stats) => {
    if (err) return console.error(err);

    console.log('   크기 (바이트):', stats.size);
    console.log('   크기 (KB):', (stats.size / 1024).toFixed(2), 'KB');
    console.log('   크기 (MB):', (stats.size / 1024 / 1024).toFixed(2), 'MB');
    console.log('\n   → stats.size는 바이트 단위\n');
  });

}, 1000);

// ============================================
// 4. 파일 날짜 정보
// ============================================
setTimeout(() => {
  console.log('4. 파일 날짜 정보\n');

  fs.stat(testFile, (err, stats) => {
    if (err) return console.error(err);

    console.log('   birthtime:', stats.birthtime);      // 생성 시간
    console.log('   mtime:', stats.mtime);              // 수정 시간 (Modified)
    console.log('   atime:', stats.atime);              // 접근 시간 (Access)
    console.log('   ctime:', stats.ctime);              // 변경 시간 (Change, 메타데이터)

    console.log('\n   날짜 타입:', typeof stats.birthtime);
    console.log('   포맷 예시:', stats.mtime.toLocaleString());
    console.log('\n');
  });

}, 1500);

// ============================================
// 5. 파일이 최근에 수정되었는지 확인
// ============================================
setTimeout(() => {
  console.log('5. 최근 수정 파일 확인\n');

  fs.stat(testFile, (err, stats) => {
    if (err) return console.error(err);

    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    const isRecent = stats.mtimeMs > oneHourAgo;

    console.log('   수정 시간:', stats.mtime.toLocaleString());
    console.log('   1시간 이내 수정:', isRecent);
    console.log('\n   → mtimeMs로 밀리초 단위 비교\n');
  });

}, 2000);

// ============================================
// 6. 여러 파일 크기 비교
// ============================================
setTimeout(() => {
  console.log('6. 여러 파일 크기 비교\n');

  const files = ['sample.txt', 'README.md', '01-read-file-sync.js'];

  files.forEach(filename => {
    const filePath = path.join(__dirname, filename);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.log(`   ${filename}: 파일 없음`);
        return;
      }

      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   ${filename}: ${sizeKB} KB`);
    });
  });

  console.log('\n');

}, 2500);

// ============================================
// 7. 디렉토리 정보 조회
// ============================================
setTimeout(() => {
  console.log('7. 디렉토리 정보 조회\n');

  fs.stat(__dirname, (err, stats) => {
    if (err) return console.error(err);

    console.log('   isDirectory():', stats.isDirectory());
    console.log('   생성 시간:', stats.birthtime.toLocaleString());
    console.log('   수정 시간:', stats.mtime.toLocaleString());
    console.log('\n   → 디렉토리도 stat로 정보 조회 가능\n');
  });

}, 3500);

// ============================================
// 8. 파일 존재 확인 + 정보 조회
// ============================================
setTimeout(() => {
  console.log('8. 안전한 파일 정보 조회\n');

  function getFileInfo(filePath) {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(`   ${path.basename(filePath)}: 파일 없음`);
        } else {
          console.error(`   에러: ${err.message}`);
        }
        return;
      }

      console.log(`   ${path.basename(filePath)}:`);
      console.log(`   - 타입: ${stats.isFile() ? '파일' : '디렉토리'}`);
      console.log(`   - 크기: ${(stats.size / 1024).toFixed(2)} KB`);
      console.log(`   - 수정: ${stats.mtime.toLocaleString()}`);
    });
  }

  getFileInfo(testFile);
  getFileInfo(path.join(__dirname, 'nonexistent.txt'));

  console.log('\n');

}, 4000);

// ============================================
// 9. 파일 크기별 분류
// ============================================
setTimeout(() => {
  console.log('9. 파일 크기별 분류\n');

  fs.readdir(__dirname, (err, files) => {
    if (err) return console.error(err);

    const jsFiles = files.filter(f => f.endsWith('.js'));

    let small = 0;   // < 5KB
    let medium = 0;  // 5KB ~ 10KB
    let large = 0;   // > 10KB

    jsFiles.forEach(filename => {
      const filePath = path.join(__dirname, filename);

      fs.stat(filePath, (err, stats) => {
        if (err) return;

        const sizeKB = stats.size / 1024;

        if (sizeKB < 5) {
          small++;
        } else if (sizeKB < 10) {
          medium++;
        } else {
          large++;
        }

        // 마지막 파일 처리 후 결과 출력
        if (small + medium + large === jsFiles.length) {
          console.log('   파일 크기별 분류:');
          console.log(`   < 5KB: ${small}개`);
          console.log(`   5~10KB: ${medium}개`);
          console.log(`   > 10KB: ${large}개`);
          console.log('\n');
        }
      });
    });
  });

}, 5000);

// ============================================
// 10. 정리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('파일 정보 조회 정리');
  console.log('='.repeat(60));
  console.log(`
✅ fs.stat(path, cb) - 파일/디렉토리 정보

Stats 메서드:
- isFile() - 파일인지
- isDirectory() - 디렉토리인지
- isSymbolicLink() - 심볼릭 링크인지

Stats 속성:
- size - 파일 크기 (바이트)
- birthtime - 생성 시간
- mtime - 수정 시간 (Modified)
- atime - 접근 시간 (Access)
- ctime - 변경 시간 (Change, 메타데이터)

활용:
- 파일 크기 확인
- 최근 수정 파일 찾기
- 파일 타입 확인

다음: 07-fs-promises.js
Promise 기반 fs API로 더 쉽게 파일을 다뤄봅시다!
  `);
}, 6000);

/**
 * 실행:
 * node 06-file-stats.js
 */
