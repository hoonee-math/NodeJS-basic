/**
 * 03-pipe-pipeline.js
 *
 * pipe와 pipeline으로 스트림 연결하기
 */

const { Readable, Writable, Transform, pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

console.log('=== pipe와 pipeline ===\n');

// 1. 기본 pipe 사용
console.log('1. 기본 pipe (Readable → Writable)\n');

const source = Readable.from(['Hello ', 'pipe ', 'world!\n']);

const dest = new Writable({
  write(chunk, encoding, callback) {
    console.log(`→ 받음: "${chunk.toString()}"`);
    callback();
  }
});

dest.on('finish', () => {
  console.log('→ Pipe 완료\n');
});

source.pipe(dest);

// 2. 파일 복사 (pipe 사용)
setTimeout(() => {
  console.log('2. 파일 복사 (pipe)\n');

  // 원본 파일 생성
  fs.writeFileSync('source.txt', 'This is source file content.\nLine 2\nLine 3\n');

  const readStream = fs.createReadStream('source.txt');
  const writeStream = fs.createWriteStream('destination.txt');

  console.log('→ 파일 복사 시작');

  readStream.pipe(writeStream);

  writeStream.on('finish', () => {
    console.log('→ 파일 복사 완료');

    // 결과 확인
    const content = fs.readFileSync('destination.txt', 'utf8');
    console.log(`   내용: "${content.trim()}"`);

    // 테스트 파일 삭제
    fs.unlinkSync('source.txt');
    fs.unlinkSync('destination.txt');
    console.log();
  });
}, 500);

// 3. pipe 체이닝 (Readable → Transform → Writable)
setTimeout(() => {
  console.log('3. pipe 체이닝 (대문자 변환)\n');

  const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      const text = chunk.toString().toUpperCase();
      console.log(`   [Transform] "${chunk.toString().trim()}" → "${text.trim()}"`);
      this.push(text);
      callback();
    }
  });

  const input = Readable.from(['hello\n', 'world\n']);
  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log(`→ 결과: "${chunk.toString().trim()}"`);
      callback();
    }
  });

  output.on('finish', () => {
    console.log('→ 체이닝 완료\n');
  });

  input.pipe(upperCaseTransform).pipe(output);
}, 1500);

// 4. pipeline (권장 방법)
setTimeout(() => {
  console.log('4. pipeline (에러 처리 포함)\n');

  // 테스트 파일 생성
  fs.writeFileSync('test.txt', 'Hello pipeline!\nThis is a test.\n');

  const readable = fs.createReadStream('test.txt');
  const writable = fs.createWriteStream('test-copy.txt');

  console.log('→ pipeline 시작');

  pipeline(
    readable,
    writable,
    (err) => {
      if (err) {
        console.log(`   [에러] ${err.message}`);
      } else {
        console.log('→ pipeline 완료');

        // 결과 확인
        const content = fs.readFileSync('test-copy.txt', 'utf8');
        console.log(`   내용: "${content.trim()}"`);

        // 테스트 파일 삭제
        fs.unlinkSync('test.txt');
        fs.unlinkSync('test-copy.txt');
        console.log();
      }
    }
  );
}, 2500);

// 5. pipeline + Transform (파일 압축)
setTimeout(() => {
  console.log('5. 파일 압축 (pipeline + gzip)\n');

  // 원본 파일 생성
  const originalContent = 'This is a test file.\n'.repeat(100);
  fs.writeFileSync('original.txt', originalContent);

  const originalSize = fs.statSync('original.txt').size;
  console.log(`→ 원본 파일: ${originalSize} bytes`);

  pipeline(
    fs.createReadStream('original.txt'),
    zlib.createGzip(),  // 압축 Transform
    fs.createWriteStream('original.txt.gz'),
    (err) => {
      if (err) {
        console.log(`   [에러] ${err.message}`);
      } else {
        const compressedSize = fs.statSync('original.txt.gz').size;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(1);

        console.log(`→ 압축 완료`);
        console.log(`   압축 파일: ${compressedSize} bytes`);
        console.log(`   압축률: ${ratio}%`);

        // 테스트 파일 삭제
        fs.unlinkSync('original.txt');
        fs.unlinkSync('original.txt.gz');
        console.log();
      }
    }
  );
}, 3500);

// 6. 복잡한 pipeline (읽기 → 압축 → 압축 해제 → 쓰기)
setTimeout(() => {
  console.log('6. 복잡한 pipeline (압축 + 압축 해제)\n');

  // 테스트 데이터
  fs.writeFileSync('data.txt', 'Hello compression!\n'.repeat(50));

  console.log('→ 파이프라인: Read → Gzip → Gunzip → Write');

  pipeline(
    fs.createReadStream('data.txt'),
    zlib.createGzip(),
    zlib.createGunzip(),
    fs.createWriteStream('data-copy.txt'),
    (err) => {
      if (err) {
        console.log(`   [에러] ${err.message}`);
      } else {
        console.log('→ 파이프라인 완료');

        // 결과 확인
        const original = fs.readFileSync('data.txt', 'utf8');
        const copied = fs.readFileSync('data-copy.txt', 'utf8');

        console.log(`   원본과 동일? ${original === copied ? 'Yes' : 'No'}`);

        // 테스트 파일 삭제
        fs.unlinkSync('data.txt');
        fs.unlinkSync('data-copy.txt');
        console.log();
      }
    }
  );
}, 4500);

// 7. 에러 처리 비교
setTimeout(() => {
  console.log('7. 에러 처리 비교\n');

  // (a) pipe - 에러 처리가 번거로움
  console.log('(a) pipe 방식:\n');

  const read1 = fs.createReadStream('nonexistent.txt');
  const write1 = fs.createWriteStream('output1.txt');

  read1.on('error', (err) => {
    console.log(`   [pipe 에러] ${err.message.split(':')[0]}`);
  });

  write1.on('error', (err) => {
    console.log(`   [pipe 에러] ${err.message}`);
  });

  read1.pipe(write1);

  setTimeout(() => {
    console.log();

    // (b) pipeline - 에러 처리가 간단
    console.log('(b) pipeline 방식:\n');

    const read2 = fs.createReadStream('nonexistent.txt');
    const write2 = fs.createWriteStream('output2.txt');

    pipeline(read2, write2, (err) => {
      if (err) {
        console.log(`   [pipeline 에러] ${err.message.split(':')[0]}`);
      }
      console.log();
    });
  }, 100);
}, 5500);

/**
 * 실행:
 * node 03-pipe-pipeline.js
 *
 * 핵심 개념:
 * - pipe(): 스트림 연결 (source.pipe(destination))
 * - pipeline(): 에러 처리가 개선된 pipe (Node.js 10+)
 * - 체이닝: readable.pipe(transform).pipe(writable)
 *
 * pipe vs pipeline:
 *
 * pipe():
 * - 기본 스트림 연결 메서드
 * - 각 스트림의 에러를 개별적으로 처리해야 함
 * - 에러 발생 시 자동 정리 없음
 * - 반환값: destination 스트림 (체이닝 가능)
 *
 * pipeline():
 * - 권장되는 방법 (Node.js 10+)
 * - 단일 에러 핸들러로 모든 스트림 처리
 * - 에러 발생 시 모든 스트림 자동 정리
 * - 메모리 누수 방지
 *
 * 사용 패턴:
 *
 * // pipe
 * source.pipe(dest);
 * source.pipe(transform).pipe(dest);
 *
 * // pipeline
 * pipeline(source, dest, callback);
 * pipeline(source, transform, dest, callback);
 * pipeline(source, transform1, transform2, dest, callback);
 *
 * 활용:
 * - 파일 복사
 * - 파일 압축/압축 해제
 * - 데이터 변환 파이프라인
 * - HTTP 요청/응답 처리
 *
 * Best Practices:
 * - 새 코드는 pipeline() 사용 (에러 처리 간단)
 * - 복잡한 파이프라인은 pipeline()으로 관리
 * - 에러 핸들러는 필수
 * - 모든 스트림의 에러 이벤트 처리
 *
 * 주의사항:
 * - pipe()는 destination 반환 (source 아님)
 * - pipeline()은 반환값 없음
 * - 에러 처리 누락 시 메모리 누수 가능
 */
