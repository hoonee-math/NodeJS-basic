/**
 * 05-file-streaming.js
 *
 * 파일 스트리밍 실전 활용
 */

const fs = require('fs');
const { pipeline } = require('stream');
const zlib = require('zlib');
const crypto = require('crypto');

console.log('=== 파일 스트리밍 ===\n');

// 1. 대용량 파일 읽기 (메모리 효율)
console.log('1. 대용량 파일 스트리밍 읽기\n');

// 큰 파일 생성 (10MB)
const largeContent = 'This is a line of text.\n'.repeat(500000);
fs.writeFileSync('large-file.txt', largeContent);

const fileSize = fs.statSync('large-file.txt').size;
console.log(`→ 파일 크기: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

let chunks = 0;
let bytesRead = 0;

const readStream = fs.createReadStream('large-file.txt', {
  highWaterMark: 64 * 1024  // 64KB씩 읽기
});

readStream.on('data', (chunk) => {
  chunks++;
  bytesRead += chunk.length;

  if (chunks % 50 === 0) {
    const progress = (bytesRead / fileSize * 100).toFixed(1);
    console.log(`   진행: ${progress}% (${chunks} chunks)`);
  }
});

readStream.on('end', () => {
  console.log(`→ 읽기 완료: ${chunks}개 청크, ${bytesRead} bytes`);
  fs.unlinkSync('large-file.txt');
  console.log();
});

// 2. 파일 복사 (스트림 vs 일반)
setTimeout(() => {
  console.log('2. 파일 복사 성능 비교\n');

  // 테스트 파일 생성 (5MB)
  const testContent = 'X'.repeat(5 * 1024 * 1024);
  fs.writeFileSync('test-copy.txt', testContent);

  // (a) 일반 복사 (전체 파일을 메모리에 로드)
  console.log('(a) 일반 복사 (메모리 로드):');
  const start1 = Date.now();

  const content = fs.readFileSync('test-copy.txt');
  fs.writeFileSync('copy1.txt', content);

  console.log(`   시간: ${Date.now() - start1}ms`);
  console.log(`   메모리: 전체 파일 크기만큼 사용\n`);

  fs.unlinkSync('copy1.txt');

  // (b) 스트림 복사 (청크 단위로 처리)
  console.log('(b) 스트림 복사 (청크 처리):');
  const start2 = Date.now();

  const readStream = fs.createReadStream('test-copy.txt');
  const writeStream = fs.createWriteStream('copy2.txt');

  pipeline(readStream, writeStream, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`   시간: ${Date.now() - start2}ms`);
      console.log(`   메모리: 청크 크기만큼만 사용 (효율적)\n`);

      fs.unlinkSync('test-copy.txt');
      fs.unlinkSync('copy2.txt');
    }
  });
}, 2000);

// 3. 파일 압축
setTimeout(() => {
  console.log('3. 파일 압축 (gzip)\n');

  // 원본 파일 생성
  const original = 'Hello compression!\n'.repeat(1000);
  fs.writeFileSync('data.txt', original);

  const originalSize = fs.statSync('data.txt').size;
  console.log(`→ 원본: ${originalSize} bytes`);

  pipeline(
    fs.createReadStream('data.txt'),
    zlib.createGzip(),
    fs.createWriteStream('data.txt.gz'),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        const compressedSize = fs.statSync('data.txt.gz').size;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

        console.log(`→ 압축: ${compressedSize} bytes`);
        console.log(`→ 압축률: ${ratio}%\n`);

        fs.unlinkSync('data.txt');
        fs.unlinkSync('data.txt.gz');
      }
    }
  );
}, 4000);

// 4. 파일 암호화
setTimeout(() => {
  console.log('4. 파일 암호화 (AES-256)\n');

  // 암호화할 파일 생성
  fs.writeFileSync('secret.txt', 'This is a secret message!');

  const password = 'my-secret-password';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = Buffer.alloc(16, 0);  // 초기화 벡터

  console.log('→ 암호화 중...');

  pipeline(
    fs.createReadStream('secret.txt'),
    crypto.createCipheriv('aes-256-cbc', key, iv),
    fs.createWriteStream('secret.txt.encrypted'),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('→ 암호화 완료');

        // 암호화된 파일 읽기
        const encrypted = fs.readFileSync('secret.txt.encrypted');
        console.log(`   암호화 데이터: ${encrypted.toString('hex').substring(0, 40)}...`);

        // 복호화
        console.log('\n→ 복호화 중...');

        pipeline(
          fs.createReadStream('secret.txt.encrypted'),
          crypto.createDecipheriv('aes-256-cbc', key, iv),
          fs.createWriteStream('secret-decrypted.txt'),
          (err) => {
            if (err) {
              console.error(err);
            } else {
              const decrypted = fs.readFileSync('secret-decrypted.txt', 'utf8');
              console.log('→ 복호화 완료');
              console.log(`   원본: "${decrypted}"\n`);

              // 테스트 파일 삭제
              fs.unlinkSync('secret.txt');
              fs.unlinkSync('secret.txt.encrypted');
              fs.unlinkSync('secret-decrypted.txt');
            }
          }
        );
      }
    }
  );
}, 5000);

// 5. 파일 해시 계산 (MD5)
setTimeout(() => {
  console.log('5. 파일 해시 계산 (MD5)\n');

  // 테스트 파일 생성
  fs.writeFileSync('file-to-hash.txt', 'Hello, this is a file to hash!');

  console.log('→ 해시 계산 중...');

  const hash = crypto.createHash('md5');
  const stream = fs.createReadStream('file-to-hash.txt');

  stream.on('data', (chunk) => {
    hash.update(chunk);
  });

  stream.on('end', () => {
    const fileHash = hash.digest('hex');
    console.log(`→ MD5 해시: ${fileHash}\n`);

    fs.unlinkSync('file-to-hash.txt');
  });
}, 7000);

// 6. 라인별 파일 처리
setTimeout(() => {
  console.log('6. 라인별 파일 처리\n');

  // 여러 줄 파일 생성
  const lines = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}`).join('\n');
  fs.writeFileSync('lines.txt', lines);

  const readline = require('readline');

  const rl = readline.createInterface({
    input: fs.createReadStream('lines.txt'),
    crlfDelay: Infinity
  });

  let lineCount = 0;

  rl.on('line', (line) => {
    lineCount++;

    if (lineCount <= 5 || lineCount > 95) {
      console.log(`→ ${line}`);
    } else if (lineCount === 6) {
      console.log('   ...');
    }
  });

  rl.on('close', () => {
    console.log(`\n→ 총 ${lineCount}줄 처리 완료\n`);
    fs.unlinkSync('lines.txt');
  });
}, 8000);

/**
 * 실행:
 * node 05-file-streaming.js
 *
 * 핵심 개념:
 * - 스트림을 사용하면 대용량 파일을 메모리 효율적으로 처리
 * - fs.createReadStream(): 파일 읽기 스트림
 * - fs.createWriteStream(): 파일 쓰기 스트림
 * - pipeline(): 여러 스트림 연결
 *
 * 스트림 vs 일반 파일 I/O:
 *
 * 일반 방식 (readFileSync/writeFileSync):
 * - 전체 파일을 메모리에 로드
 * - 간단하지만 대용량 파일에는 부적합
 * - 메모리 부족 에러 가능
 *
 * 스트림 방식:
 * - 청크 단위로 처리 (기본 64KB)
 * - 메모리 효율적
 * - 대용량 파일 처리 가능
 * - 실시간 처리 가능
 *
 * 주요 옵션:
 * - encoding: 문자 인코딩 ('utf8', 'ascii', etc.)
 * - highWaterMark: 청크 크기 (기본 64KB)
 * - start: 읽기 시작 위치
 * - end: 읽기 종료 위치
 * - flags: 파일 열기 모드 ('r', 'w', 'a', etc.)
 *
 * 활용 사례:
 * - 대용량 로그 파일 처리
 * - 파일 복사/이동
 * - 파일 압축/압축 해제
 * - 파일 암호화/복호화
 * - 파일 해시 계산
 * - CSV/JSON 파일 파싱
 *
 * Transform 스트림 조합:
 * - zlib.createGzip(): 압축
 * - zlib.createGunzip(): 압축 해제
 * - crypto.createCipheriv(): 암호화
 * - crypto.createDecipheriv(): 복호화
 * - crypto.createHash(): 해시
 *
 * Best Practices:
 * - 대용량 파일은 항상 스트림 사용
 * - pipeline()으로 에러 처리
 * - highWaterMark 적절히 조정
 * - 파일 처리 후 정리 (unlink)
 *
 * 성능 팁:
 * - highWaterMark를 크게 하면 빠르지만 메모리 많이 사용
 * - 네트워크 전송은 작은 청크 사용
 * - SSD는 큰 청크, HDD는 작은 청크
 */
