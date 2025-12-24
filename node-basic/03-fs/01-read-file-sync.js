/**
 * 01-read-file-sync.js
 *
 * 동기 파일 읽기 (Synchronous)
 * fs.readFileSync()와 fs.writeFileSync() 사용법
 */

const fs = require('fs');
const path = require('path');

console.log('=== 동기 파일 읽기 (Sync) ===\n');

// ============================================
// 1. 동기 vs 비동기
// ============================================
console.log('1. 동기 (Synchronous) vs 비동기 (Asynchronous)\n');
console.log('   동기 (Sync):');
console.log('   - 작업이 완료될 때까지 다음 코드 실행 안 됨');
console.log('   - Blocking - 다른 작업 차단');
console.log('   - 간단한 스크립트, 초기화 코드에 적합');
console.log('   - 메서드 이름에 "Sync" 붙음\n');

console.log('   비동기 (Async):');
console.log('   - 작업 완료를 기다리지 않고 다음 코드 실행');
console.log('   - Non-blocking - 다른 작업 계속 가능');
console.log('   - 서버 애플리케이션에 필수');
console.log('   - Callback 또는 Promise 사용\n');

// ============================================
// 2. fs.readFileSync() 기본
// ============================================
console.log('2. fs.readFileSync() 기본 사용\n');

try {
  // 파일 경로 (절대 경로 사용 권장)
  const filePath = path.join(__dirname, 'sample.txt');

  // 인코딩 없이 읽기 → Buffer 반환
  const bufferData = fs.readFileSync(filePath);
  console.log('   Buffer:', bufferData);
  console.log('   타입:', typeof bufferData);

  // 인코딩 지정 → 문자열 반환
  const textData = fs.readFileSync(filePath, 'utf-8');
  console.log('\n   문자열:', textData);
  console.log('   타입:', typeof textData);

} catch (error) {
  console.error('   에러:', error.message);
}

console.log('\n   → 인코딩 지정 안 하면 Buffer, 지정하면 문자열\n');

// ============================================
// 3. 실행 순서 확인
// ============================================
console.log('3. 동기 실행 순서 확인\n');

console.log('   [1] 파일 읽기 시작');

const filePath = path.join(__dirname, 'sample.txt');
const content = fs.readFileSync(filePath, 'utf-8');

console.log('   [2] 파일 읽기 완료');
console.log('   [3] 다음 코드 실행');

console.log('\n   → 순서대로 1, 2, 3 실행됨 (Blocking)\n');

// ============================================
// 4. 현재 파일 자신 읽기
// ============================================
console.log('4. 현재 실행 중인 파일 읽기\n');

try {
  const thisFile = fs.readFileSync(__filename, 'utf-8');
  const lines = thisFile.split('\n');

  console.log(`   총 ${lines.length}줄`);
  console.log('   첫 10줄:');
  lines.slice(0, 10).forEach((line, i) => {
    console.log(`   ${i + 1}: ${line}`);
  });

} catch (error) {
  console.error('   에러:', error.message);
}

console.log('\n   → __filename으로 현재 파일 경로 얻기\n');

// ============================================
// 5. 에러 처리
// ============================================
console.log('5. 에러 처리 - try-catch 필수\n');

try {
  const data = fs.readFileSync('없는파일.txt', 'utf-8');
  console.log('   데이터:', data);
} catch (error) {
  console.log('   ❌ 에러 발생:', error.code);
  console.log('   메시지:', error.message);
}

console.log('\n   → 동기 메서드는 에러 발생 시 예외 throw\n');

// ============================================
// 6. fs.writeFileSync() - 파일 쓰기
// ============================================
console.log('6. fs.writeFileSync() - 파일 쓰기\n');

try {
  const outputPath = path.join(__dirname, 'output-sync.txt');
  const message = `Hello from writeFileSync!\n생성 시간: ${new Date().toLocaleString()}`;

  fs.writeFileSync(outputPath, message, 'utf-8');
  console.log('   ✅ 파일 생성 완료:', outputPath);

  // 방금 쓴 파일 읽어보기
  const written = fs.readFileSync(outputPath, 'utf-8');
  console.log('   내용:', written);

} catch (error) {
  console.error('   에러:', error.message);
}

console.log('\n   → writeFileSync는 파일이 없으면 생성, 있으면 덮어씀\n');

// ============================================
// 7. 파일 내용 수정하기
// ============================================
console.log('7. 파일 내용 수정하기\n');

try {
  const filePath = path.join(__dirname, 'output-sync.txt');

  // 1. 읽기
  let content = fs.readFileSync(filePath, 'utf-8');
  console.log('   원본:', content);

  // 2. 수정
  content = content + '\n추가된 줄!';

  // 3. 쓰기
  fs.writeFileSync(filePath, content, 'utf-8');

  // 4. 확인
  const updated = fs.readFileSync(filePath, 'utf-8');
  console.log('\n   수정 후:', updated);

} catch (error) {
  console.error('   에러:', error.message);
}

console.log('\n   → 읽기 → 수정 → 쓰기 패턴\n');

// ============================================
// 8. 여러 파일 순차 처리
// ============================================
console.log('8. 여러 파일 순차 처리\n');

try {
  // 3개 파일 생성
  for (let i = 1; i <= 3; i++) {
    const filePath = path.join(__dirname, `file${i}.txt`);
    fs.writeFileSync(filePath, `This is file ${i}`);
    console.log(`   ✅ file${i}.txt 생성`);
  }

  // 3개 파일 읽기
  console.log('\n   생성된 파일 읽기:');
  for (let i = 1; i <= 3; i++) {
    const filePath = path.join(__dirname, `file${i}.txt`);
    const content = fs.readFileSync(filePath, 'utf-8');
    console.log(`   file${i}.txt: ${content}`);
  }

} catch (error) {
  console.error('   에러:', error.message);
}

console.log('\n   → 동기 방식은 순서대로 하나씩 처리\n');

// ============================================
// 9. JSON 파일 다루기
// ============================================
console.log('9. JSON 파일 읽기/쓰기\n');

try {
  const jsonPath = path.join(__dirname, 'data.json');

  // JSON 쓰기
  const data = {
    name: 'Alice',
    age: 25,
    hobbies: ['reading', 'coding']
  };

  // JSON.stringify로 객체를 문자열로 변환
  // null, 2는 보기 좋게 포맷팅 (들여쓰기 2칸)
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
  console.log('   ✅ JSON 파일 생성');

  // JSON 읽기
  const jsonString = fs.readFileSync(jsonPath, 'utf-8');
  const parsedData = JSON.parse(jsonString);

  console.log('   읽은 데이터:', parsedData);
  console.log('   이름:', parsedData.name);
  console.log('   취미:', parsedData.hobbies.join(', '));

} catch (error) {
  console.error('   에러:', error.message);
}

console.log('\n   → JSON.stringify와 JSON.parse 사용\n');

// ============================================
// 10. 동기 방식의 장단점
// ============================================
console.log('10. 동기 방식 (Sync)의 장단점\n');

console.log('   ✅ 장점:');
console.log('   - 코드가 간단하고 직관적');
console.log('   - 순서 보장 (위에서 아래로)');
console.log('   - 에러 처리가 쉬움 (try-catch)');
console.log('   - 스크립트/CLI 도구에 적합\n');

console.log('   ❌ 단점:');
console.log('   - Blocking - 파일 읽는 동안 아무것도 못 함');
console.log('   - 서버에서 사용 시 모든 요청 차단');
console.log('   - 느린 I/O 작업 시 성능 저하');
console.log('   - 여러 파일 동시 처리 불가\n');

console.log('   📌 권장 사용처:');
console.log('   - 설정 파일 로드 (앱 시작 시)');
console.log('   - 간단한 CLI 도구');
console.log('   - 빌드 스크립트');
console.log('   - 테스트 코드\n');

console.log('   ⚠️ 피해야 할 곳:');
console.log('   - HTTP 서버 (Express, Fastify 등)');
console.log('   - 실시간 애플리케이션');
console.log('   - 많은 파일 처리\n');

// ============================================
// 마무리
// ============================================
console.log('='.repeat(60));
console.log('동기 파일 읽기/쓰기 정리');
console.log('='.repeat(60));
console.log(`
✅ fs.readFileSync(path, 'utf-8') - 동기 읽기
✅ fs.writeFileSync(path, data) - 동기 쓰기
✅ try-catch로 에러 처리
✅ 간단하고 직관적
❌ Blocking - 서버에서 사용 금지

다음: 02-read-file-async.js
비동기 방식으로 Non-blocking 파일 처리를 배워봅시다!
`);

/**
 * 핵심 정리:
 *
 * 동기 메서드:
 * - fs.readFileSync(path, encoding)
 * - fs.writeFileSync(path, data, encoding)
 *
 * 특징:
 * - 작업 완료까지 대기 (Blocking)
 * - 순서 보장
 * - try-catch로 에러 처리
 *
 * 사용 시기:
 * - 스크립트, CLI, 초기화 코드
 * - 서버 애플리케이션에서는 절대 사용 금지!
 */

/**
 * 실행:
 * node 01-read-file-sync.js
 *
 * 생성되는 파일:
 * - output-sync.txt
 * - file1.txt, file2.txt, file3.txt
 * - data.json
 */
