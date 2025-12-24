/**
 * 03-write-file.js
 *
 * 파일 쓰기의 다양한 방법
 * 텍스트, JSON, CSV 파일 작성
 */

const fs = require('fs');
const path = require('path');

console.log('=== 파일 쓰기 다양한 방법 ===\n');

// ============================================
// 1. writeFile vs appendFile
// ============================================
console.log('1. writeFile vs appendFile\n');

const testPath = path.join(__dirname, 'write-test.txt');

// writeFile - 덮어쓰기
fs.writeFile(testPath, '첫 번째 줄\n', (err) => {
  if (err) return console.error(err);
  console.log('   ✅ writeFile: 파일 생성');

  // 다시 writeFile - 기존 내용 삭제되고 새로 씀
  fs.writeFile(testPath, '두 번째 줄 (첫 번째 삭제됨)\n', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ writeFile: 덮어쓰기');

    // appendFile - 끝에 추가
    fs.appendFile(testPath, '세 번째 줄 (추가됨)\n', (err) => {
      if (err) return console.error(err);
      console.log('   ✅ appendFile: 내용 추가');

      // 최종 결과 확인
      fs.readFile(testPath, 'utf-8', (err, data) => {
        if (err) return console.error(err);
        console.log('\n   최종 내용:');
        console.log(data);
        console.log('   → writeFile은 덮어쓰기, appendFile은 추가\n');
      });
    });
  });
});

// ============================================
// 2. 플래그 옵션
// ============================================
setTimeout(() => {
  console.log('2. 파일 플래그 옵션\n');

  const filePath = path.join(__dirname, 'flag-test.txt');

  // 'w' (기본값) - write, 덮어쓰기
  fs.writeFile(filePath, '첫 번째\n', { flag: 'w' }, (err) => {
    if (err) return console.error(err);
    console.log('   ✅ flag: w (덮어쓰기)');

    // 'a' - append, 추가
    fs.writeFile(filePath, '두 번째\n', { flag: 'a' }, (err) => {
      if (err) return console.error(err);
      console.log('   ✅ flag: a (추가)');

      fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) return console.error(err);
        console.log('\n   내용:', data);
      });
    });
  });

  console.log('\n   주요 플래그:');
  console.log('   - w: write (덮어쓰기, 기본값)');
  console.log('   - a: append (추가)');
  console.log('   - r: read (읽기 전용)');
  console.log('   - wx: write exclusive (파일 없을 때만 생성)\n');

}, 1500);

// ============================================
// 3. JSON 파일 쓰기
// ============================================
setTimeout(() => {
  console.log('3. JSON 파일 쓰기\n');

  const jsonPath = path.join(__dirname, 'users.json');

  const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];

  // JSON.stringify(data, replacer, space)
  // - data: 변환할 객체
  // - replacer: null (사용 안 함)
  // - space: 들여쓰기 (2 = 2칸)
  const jsonString = JSON.stringify(users, null, 2);

  fs.writeFile(jsonPath, jsonString, 'utf-8', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ JSON 파일 생성');

    // 읽어서 확인
    fs.readFile(jsonPath, 'utf-8', (err, data) => {
      if (err) return console.error(err);

      const parsed = JSON.parse(data);
      console.log('   사용자 수:', parsed.length);
      console.log('   첫 사용자:', parsed[0]);
      console.log('\n   → JSON.stringify로 객체를 문자열로 변환\n');
    });
  });

}, 2500);

// ============================================
// 4. CSV 파일 쓰기
// ============================================
setTimeout(() => {
  console.log('4. CSV 파일 쓰기\n');

  const csvPath = path.join(__dirname, 'products.csv');

  const products = [
    ['ID', 'Name', 'Price', 'Stock'],
    ['1', 'Laptop', '1200', '10'],
    ['2', 'Mouse', '25', '50'],
    ['3', 'Keyboard', '75', '30']
  ];

  // 배열을 CSV 형식으로 변환
  const csvContent = products
    .map(row => row.join(','))  // 각 행을 쉼표로 연결
    .join('\n');                // 행들을 줄바꿈으로 연결

  fs.writeFile(csvPath, csvContent, 'utf-8', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ CSV 파일 생성');
    console.log('   내용:');
    console.log(csvContent);
    console.log('\n   → join()으로 CSV 형식 만들기\n');
  });

}, 3500);

// ============================================
// 5. 로그 파일 (append 활용)
// ============================================
setTimeout(() => {
  console.log('5. 로그 파일 작성 (append)\n');

  const logPath = path.join(__dirname, 'app.log');

  function log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFile(logPath, logEntry, (err) => {
      if (err) console.error('로그 실패:', err);
    });
  }

  // 여러 로그 작성
  log('애플리케이션 시작');
  log('사용자 로그인: alice');
  log('데이터 조회 완료');
  log('애플리케이션 종료');

  setTimeout(() => {
    fs.readFile(logPath, 'utf-8', (err, data) => {
      if (err) return console.error(err);
      console.log('   로그 파일 내용:');
      console.log(data);
      console.log('   → appendFile로 로그 누적\n');
    });
  }, 500);

}, 4500);

// ============================================
// 6. 대용량 텍스트 파일 생성
// ============================================
setTimeout(() => {
  console.log('6. 대용량 텍스트 파일 생성\n');

  const bigFilePath = path.join(__dirname, 'big-file.txt');
  let content = '';

  // 10,000줄 생성
  for (let i = 1; i <= 10000; i++) {
    content += `Line ${i}: This is line number ${i}\n`;
  }

  console.log('   파일 쓰기 중...');
  console.time('   쓰기 시간');

  fs.writeFile(bigFilePath, content, 'utf-8', (err) => {
    if (err) return console.error(err);

    console.timeEnd('   쓰기 시간');

    // 파일 크기 확인
    fs.stat(bigFilePath, (err, stats) => {
      if (err) return console.error(err);

      const sizeInKB = (stats.size / 1024).toFixed(2);
      console.log(`   ✅ 파일 생성: ${sizeInKB} KB`);
      console.log(`   줄 수: 10,000줄\n`);
    });
  });

}, 5500);

// ============================================
// 7. 멀티라인 문자열 쓰기
// ============================================
setTimeout(() => {
  console.log('7. 멀티라인 문자열 쓰기\n');

  const htmlPath = path.join(__dirname, 'template.html');

  // 템플릿 리터럴로 멀티라인 작성
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Node.js File</title>
</head>
<body>
  <h1>Hello from Node.js!</h1>
  <p>This file was created by fs.writeFile()</p>
</body>
</html>
  `.trim();

  fs.writeFile(htmlPath, htmlContent, 'utf-8', (err) => {
    if (err) return console.error(err);
    console.log('   ✅ HTML 파일 생성');
    console.log('   내용:');
    console.log(htmlContent);
    console.log('\n   → 템플릿 리터럴로 멀티라인 작성\n');
  });

}, 7000);

// ============================================
// 8. 파일 쓰기 에러 처리
// ============================================
setTimeout(() => {
  console.log('8. 파일 쓰기 에러 처리\n');

  // 잘못된 경로 (존재하지 않는 디렉토리)
  const invalidPath = path.join(__dirname, 'nonexistent', 'file.txt');

  fs.writeFile(invalidPath, 'content', (err) => {
    if (err) {
      console.log('   ❌ 에러 발생:', err.code);
      console.log('   메시지:', err.message);
      console.log('\n   → 디렉토리가 없으면 파일 생성 실패\n');
      return;
    }

    console.log('   파일 생성 성공');
  });

}, 8000);

// ============================================
// 9. 안전한 파일 쓰기 패턴
// ============================================
setTimeout(() => {
  console.log('9. 안전한 파일 쓰기 (임시 파일 활용)\n');

  const targetPath = path.join(__dirname, 'important-data.json');
  const tempPath = targetPath + '.tmp';

  const data = { version: 2, content: 'important data' };

  // 1. 임시 파일에 쓰기
  fs.writeFile(tempPath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error('   쓰기 실패:', err.message);
      return;
    }

    console.log('   ✅ 임시 파일 작성');

    // 2. 임시 파일을 실제 파일로 이동 (atomic operation)
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        console.error('   이동 실패:', err.message);
        // 실패 시 임시 파일 삭제
        fs.unlink(tempPath, () => {});
        return;
      }

      console.log('   ✅ 파일로 이동 완료');
      console.log('\n   → 임시 파일 사용으로 원자성 보장\n');
    });
  });

}, 9000);

// ============================================
// 10. 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('파일 쓰기 정리');
  console.log('='.repeat(60));
  console.log(`
✅ fs.writeFile() - 덮어쓰기
✅ fs.appendFile() - 끝에 추가
✅ JSON: JSON.stringify(data, null, 2)
✅ CSV: array.map().join()
✅ 로그: appendFile 활용
✅ 안전한 쓰기: 임시 파일 + rename

다음: 04-file-operations.js
파일 복사, 이동, 삭제를 배워봅시다!
  `);
}, 10000);

/**
 * 핵심 정리:
 *
 * 파일 쓰기:
 * - fs.writeFile() - 덮어쓰기
 * - fs.appendFile() - 추가
 * - options: { flag: 'w|a|r', encoding: 'utf-8' }
 *
 * 파일 형식:
 * - JSON: JSON.stringify(obj, null, 2)
 * - CSV: rows.map(row => row.join(',')).join('\n')
 * - 멀티라인: 템플릿 리터럴
 *
 * 안전한 쓰기:
 * - 임시 파일 작성 → rename으로 이동
 */

/**
 * 실행:
 * node 03-write-file.js
 *
 * 생성되는 파일:
 * - write-test.txt
 * - users.json
 * - products.csv
 * - app.log
 * - big-file.txt
 * - template.html
 * - important-data.json
 */
