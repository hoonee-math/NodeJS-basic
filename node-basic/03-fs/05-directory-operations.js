/**
 * 05-directory-operations.js
 *
 * 디렉토리 생성, 읽기, 삭제
 */

const fs = require('fs');
const path = require('path');

console.log('=== 디렉토리 작업 ===\n');

// ============================================
// 1. fs.mkdir() - 디렉토리 생성
// ============================================
console.log('1. fs.mkdir() - 디렉토리 생성\n');

const newDir = path.join(__dirname, 'test-directory');

fs.mkdir(newDir, (err) => {
  if (err) {
    if (err.code === 'EEXIST') {
      console.log('   디렉토리가 이미 존재함');
    } else {
      console.error('   에러:', err.message);
    }
  } else {
    console.log('   ✅ test-directory 생성');
  }

  console.log('\n   → mkdir로 디렉토리 생성\n');
});

// ============================================
// 2. 중첩 디렉토리 생성
// ============================================
setTimeout(() => {
  console.log('2. 중첩 디렉토리 생성\n');

  const nestedDir = path.join(__dirname, 'parent', 'child', 'grandchild');

  // recursive: true 옵션으로 부모 디렉토리도 함께 생성
  fs.mkdir(nestedDir, { recursive: true }, (err) => {
    if (err) {
      console.error('   에러:', err.message);
    } else {
      console.log('   ✅ parent/child/grandchild 생성');
      console.log('\n   → recursive: true로 중첩 디렉토리 생성\n');
    }
  });

}, 500);

// ============================================
// 3. fs.readdir() - 디렉토리 내용 읽기
// ============================================
setTimeout(() => {
  console.log('3. fs.readdir() - 디렉토리 읽기\n');

  fs.readdir(__dirname, (err, files) => {
    if (err) return console.error(err);

    console.log(`   현재 디렉토리 파일/폴더 (총 ${files.length}개):`);
    files.slice(0, 10).forEach(file => {
      console.log('   -', file);
    });
    if (files.length > 10) {
      console.log(`   ... 외 ${files.length - 10}개`);
    }
    console.log('\n   → readdir는 파일명 배열 반환\n');
  });

}, 1000);

// ============================================
// 4. withFileTypes 옵션 - 상세 정보
// ============================================
setTimeout(() => {
  console.log('4. withFileTypes 옵션 - 파일 타입 구분\n');

  fs.readdir(__dirname, { withFileTypes: true }, (err, entries) => {
    if (err) return console.error(err);

    console.log('   파일과 디렉토리 구분:');
    entries.slice(0, 10).forEach(entry => {
      const type = entry.isDirectory() ? '📁' : '📄';
      console.log(`   ${type} ${entry.name}`);
    });

    console.log('\n   Dirent 메서드:');
    console.log('   - isFile() : 파일인지 확인');
    console.log('   - isDirectory() : 디렉토리인지 확인');
    console.log('   - isSymbolicLink() : 심볼릭 링크인지 확인\n');
  });

}, 1500);

// ============================================
// 5. 디렉토리만 필터링
// ============================================
setTimeout(() => {
  console.log('5. 디렉토리만 필터링\n');

  fs.readdir(__dirname, { withFileTypes: true }, (err, entries) => {
    if (err) return console.error(err);

    const directories = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);

    console.log('   디렉토리 목록:');
    directories.forEach(dir => {
      console.log('   📁', dir);
    });
    console.log('\n   → filter와 isDirectory()로 필터링\n');
  });

}, 2000);

// ============================================
// 6. 특정 확장자 파일 찾기
// ============================================
setTimeout(() => {
  console.log('6. 특정 확장자 파일 찾기\n');

  fs.readdir(__dirname, (err, files) => {
    if (err) return console.error(err);

    const jsFiles = files.filter(file => file.endsWith('.js'));

    console.log('   .js 파일:');
    jsFiles.forEach(file => {
      console.log('   -', file);
    });
    console.log('\n   → filter와 endsWith()로 확장자 필터링\n');
  });

}, 2500);

// ============================================
// 7. fs.rmdir() - 빈 디렉토리 삭제
// ============================================
setTimeout(() => {
  console.log('7. fs.rmdir() - 빈 디렉토리 삭제\n');

  const emptyDir = path.join(__dirname, 'empty-dir');

  fs.mkdir(emptyDir, (err) => {
    if (err && err.code !== 'EEXIST') return console.error(err);

    console.log('   ✅ empty-dir 생성');

    fs.rmdir(emptyDir, (err) => {
      if (err) return console.error('   삭제 실패:', err.message);
      console.log('   ✅ empty-dir 삭제');
      console.log('\n   → rmdir는 빈 디렉토리만 삭제 가능\n');
    });
  });

}, 3000);

// ============================================
// 8. fs.rm() - 내용 포함 삭제 (Node.js 14.14+)
// ============================================
setTimeout(() => {
  console.log('8. fs.rm() - 내용 포함 삭제\n');

  const dirWithFiles = path.join(__dirname, 'dir-with-files');

  // 디렉토리와 파일 생성
  fs.mkdir(dirWithFiles, { recursive: true }, (err) => {
    if (err) return console.error(err);

    fs.writeFile(path.join(dirWithFiles, 'file1.txt'), 'Content', (err) => {
      if (err) return console.error(err);

      fs.writeFile(path.join(dirWithFiles, 'file2.txt'), 'Content', (err) => {
        if (err) return console.error(err);

        console.log('   ✅ 디렉토리와 파일 생성');

        // recursive: true로 내용 포함 삭제
        fs.rm(dirWithFiles, { recursive: true }, (err) => {
          if (err) return console.error('   삭제 실패:', err.message);
          console.log('   ✅ 디렉토리와 내용 전체 삭제');
          console.log('\n   → fs.rm(..., { recursive: true })\n');
        });
      });
    });
  });

}, 3500);

// ============================================
// 9. 재귀적 디렉토리 탐색
// ============================================
setTimeout(() => {
  console.log('9. 재귀적 디렉토리 탐색\n');

  function listFilesRecursive(dir, indent = '') {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      entries.forEach(entry => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          console.log(`${indent}📁 ${entry.name}/`);
          listFilesRecursive(fullPath, indent + '  ');
        } else {
          console.log(`${indent}📄 ${entry.name}`);
        }
      });
    } catch (err) {
      console.error(`${indent}❌ ${err.message}`);
    }
  }

  const testDir = path.join(__dirname, 'parent');
  if (fs.existsSync(testDir)) {
    console.log('   재귀 탐색:');
    listFilesRecursive(testDir);
    console.log('\n   → 재귀 함수로 하위 디렉토리까지 탐색\n');
  } else {
    console.log('   (parent 디렉토리 없음)\n');
  }

}, 4500);

// ============================================
// 10. 정리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('디렉토리 작업 정리');
  console.log('='.repeat(60));
  console.log(`
✅ fs.mkdir(path, { recursive: true }, cb) - 디렉토리 생성
✅ fs.readdir(path, cb) - 내용 읽기
✅ fs.readdir(path, { withFileTypes: true }, cb) - 상세 정보
✅ fs.rmdir(path, cb) - 빈 디렉토리 삭제
✅ fs.rm(path, { recursive: true }, cb) - 내용 포함 삭제

Dirent 객체:
- isFile() - 파일
- isDirectory() - 디렉토리
- isSymbolicLink() - 심볼릭 링크

다음: 06-file-stats.js
파일 정보 (크기, 날짜 등)를 조회해봅시다!
  `);
}, 5000);

/**
 * 실행:
 * node 05-directory-operations.js
 *
 * 생성되는 폴더:
 * - test-directory/
 * - parent/child/grandchild/
 */
