/**
 * 04-file-operations.js
 *
 * 파일 복사, 이동, 삭제, 존재 확인
 */

const fs = require('fs');
const path = require('path');

console.log('=== 파일 복사/이동/삭제 ===\n');

// 준비 작업
const testDir = __dirname;
const source = path.join(testDir, 'source.txt');

// 테스트용 파일 생성
fs.writeFileSync(source, 'This is the source file content.\nLine 2\nLine 3');

// ============================================
// 1. fs.copyFile() - 파일 복사
// ============================================
console.log('1. fs.copyFile() - 파일 복사\n');

const copyDest = path.join(testDir, 'copy.txt');

fs.copyFile(source, copyDest, (err) => {
  if (err) return console.error(err);
  console.log('   ✅ 파일 복사 완료');

  // 복사된 파일 확인
  fs.readFile(copyDest, 'utf-8', (err, data) => {
    if (err) return console.error(err);
    console.log('   복사된 내용:', data.split('\n')[0]);
    console.log('\n   → copyFile로 파일 복사\n');
  });
});

// ============================================
// 2. fs.rename() - 파일 이름 변경
// ============================================
setTimeout(() => {
  console.log('2. fs.rename() - 이름 변경\n');

  const oldName = path.join(testDir, 'old.txt');
  const newName = path.join(testDir, 'renamed.txt');

  fs.writeFile(oldName, 'Content', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ old.txt 생성');

    fs.rename(oldName, newName, (err) => {
      if (err) return console.error(err);
      console.log('   ✅ renamed.txt로 변경');
      console.log('\n   → rename으로 이름 변경\n');
    });
  });

}, 500);

// ============================================
// 3. fs.rename() - 파일 이동
// ============================================
setTimeout(() => {
  console.log('3. fs.rename() - 파일 이동\n');

  // 하위 디렉토리 생성
  const subDir = path.join(testDir, 'moved-files');
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir);
  }

  const fileToMove = path.join(testDir, 'move-me.txt');
  const destination = path.join(subDir, 'moved.txt');

  fs.writeFile(fileToMove, 'Move me!', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ move-me.txt 생성');

    fs.rename(fileToMove, destination, (err) => {
      if (err) return console.error(err);
      console.log('   ✅ moved-files/moved.txt로 이동');
      console.log('\n   → 다른 디렉토리로 이동 가능\n');
    });
  });

}, 1000);

// ============================================
// 4. fs.unlink() - 파일 삭제
// ============================================
setTimeout(() => {
  console.log('4. fs.unlink() - 파일 삭제\n');

  const fileToDelete = path.join(testDir, 'delete-me.txt');

  fs.writeFile(fileToDelete, 'Delete me', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ delete-me.txt 생성');

    setTimeout(() => {
      fs.unlink(fileToDelete, (err) => {
        if (err) return console.error(err);
        console.log('   ✅ delete-me.txt 삭제');
        console.log('\n   → unlink로 파일 삭제\n');
      });
    }, 500);
  });

}, 1500);

// ============================================
// 5. fs.existsSync() - 파일 존재 확인
// ============================================
setTimeout(() => {
  console.log('5. fs.existsSync() - 파일 존재 확인\n');

  const exists = fs.existsSync(source);
  console.log('   source.txt 존재:', exists);

  const notExists = fs.existsSync('nonexistent.txt');
  console.log('   nonexistent.txt 존재:', notExists);

  console.log('\n   → existsSync는 동기 메서드 (boolean 반환)\n');

}, 2500);

// ============================================
// 6. fs.access() - 접근 가능 여부 확인
// ============================================
setTimeout(() => {
  console.log('6. fs.access() - 접근 가능 여부 확인\n');

  fs.access(source, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('   ❌ 파일 없음');
    } else {
      console.log('   ✅ 파일 존재 (읽기 가능)');
    }
  });

  fs.access(source, fs.constants.W_OK, (err) => {
    if (err) {
      console.log('   ❌ 쓰기 불가');
    } else {
      console.log('   ✅ 쓰기 가능');
    }
  });

  console.log('\n   fs.constants:');
  console.log('   - F_OK: 파일 존재');
  console.log('   - R_OK: 읽기 가능');
  console.log('   - W_OK: 쓰기 가능');
  console.log('   - X_OK: 실행 가능\n');

}, 3000);

// ============================================
// 7. 안전한 파일 삭제
// ============================================
setTimeout(() => {
  console.log('7. 안전한 파일 삭제 (존재 확인 후)\n');

  const fileToCheck = path.join(testDir, 'maybe-exists.txt');

  function safeDelete(filePath) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.log('   파일이 없어서 삭제 생략');
        return;
      }

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('   삭제 실패:', err.message);
        } else {
          console.log('   ✅ 파일 삭제 완료');
        }
      });
    });
  }

  safeDelete(fileToCheck);
  console.log('\n   → access로 존재 확인 후 삭제\n');

}, 3500);

// ============================================
// 8. 파일 복사 + 원본 삭제 = 이동
// ============================================
setTimeout(() => {
  console.log('8. copyFile + unlink = 이동\n');

  const originalFile = path.join(testDir, 'original.txt');
  const movedFile = path.join(testDir, 'manually-moved.txt');

  fs.writeFile(originalFile, 'Content', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ original.txt 생성');

    // 1. 복사
    fs.copyFile(originalFile, movedFile, (err) => {
      if (err) return console.error(err);
      console.log('   ✅ manually-moved.txt로 복사');

      // 2. 원본 삭제
      fs.unlink(originalFile, (err) => {
        if (err) return console.error(err);
        console.log('   ✅ original.txt 삭제');
        console.log('\n   → 복사 + 삭제 = 이동 (rename과 동일 효과)\n');
      });
    });
  });

}, 4000);

// ============================================
// 9. 파일 백업
// ============================================
setTimeout(() => {
  console.log('9. 파일 백업 (타임스탬프 추가)\n');

  const originalFile = path.join(testDir, 'important.txt');
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupFile = path.join(testDir, `important.backup.${timestamp}.txt`);

  fs.writeFile(originalFile, 'Important data', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ important.txt 생성');

    fs.copyFile(originalFile, backupFile, (err) => {
      if (err) return console.error(err);
      console.log('   ✅ 백업 파일 생성');
      console.log('   백업:', path.basename(backupFile));
      console.log('\n   → 타임스탬프로 백업 파일명 구분\n');
    });
  });

}, 5000);

// ============================================
// 10. 정리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('파일 작업 정리');
  console.log('='.repeat(60));
  console.log(`
✅ fs.copyFile(src, dest, cb) - 파일 복사
✅ fs.rename(old, new, cb) - 이름 변경/이동
✅ fs.unlink(path, cb) - 파일 삭제
✅ fs.existsSync(path) - 존재 확인 (동기)
✅ fs.access(path, mode, cb) - 접근 가능 확인

패턴:
- 안전한 삭제: access → unlink
- 수동 이동: copyFile → unlink
- 백업: copyFile + 타임스탬프

다음: 05-directory-operations.js
디렉토리 생성, 읽기, 삭제를 배워봅시다!
  `);
}, 6000);

/**
 * 실행:
 * node 04-file-operations.js
 *
 * 생성되는 파일/폴더:
 * - source.txt
 * - copy.txt
 * - renamed.txt
 * - moved-files/moved.txt
 * - manually-moved.txt
 * - important.txt + 백업 파일
 */
