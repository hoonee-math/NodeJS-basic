/**
 * 02-writable-stream.js
 *
 * Writable Stream 기본 사용법
 */

const { Writable } = require('stream');
const fs = require('fs');

console.log('=== Writable Stream ===\n');

// 1. 기본 Writable Stream 생성
console.log('1. 커스텀 Writable Stream\n');

const customWritable = new Writable({
  write(chunk, encoding, callback) {
    // chunk: 쓸 데이터, encoding: 인코딩, callback: 완료 시 호출
    console.log(`→ 데이터 쓰기: "${chunk.toString()}"`);
    callback();  // 쓰기 완료 알림 (필수!)
  }
});

customWritable.on('finish', () => {
  console.log('→ 스트림 종료\n');
});

customWritable.write('Hello ');
customWritable.write('Writable ');
customWritable.write('Stream!\n');
customWritable.end();  // 스트림 종료

// 2. 파일 쓰기 스트림
setTimeout(() => {
  console.log('2. 파일 쓰기 스트림\n');

  const fileStream = fs.createWriteStream('test-write.txt', {
    encoding: 'utf8'
  });

  fileStream.on('finish', () => {
    console.log('→ 파일 쓰기 완료');

    // 결과 확인
    const content = fs.readFileSync('test-write.txt', 'utf8');
    console.log(`   내용: "${content}"`);
    fs.unlinkSync('test-write.txt');  // 테스트 파일 삭제
    console.log();
  });

  fileStream.write('Line 1\n');
  console.log('→ Write: Line 1');
  fileStream.write('Line 2\n');
  console.log('→ Write: Line 2');
  fileStream.write('Line 3\n');
  console.log('→ Write: Line 3');
  fileStream.end();
}, 500);

// 3. write() 반환값과 drain 이벤트
setTimeout(() => {
  console.log('3. Backpressure 처리 (drain 이벤트)\n');

  const backpressureStream = new Writable({
    highWaterMark: 10,  // 버퍼 크기를 작게 설정
    write(chunk, encoding, callback) {
      console.log(`→ 쓰기: "${chunk.toString().trim()}" (버퍼 크기: ${this.writableLength})`);
      callback();
    }
  });

  backpressureStream.on('drain', () => {
    console.log('   [Drain] 버퍼가 비워짐, 쓰기 재개 가능');
  });

  backpressureStream.on('finish', () => {
    console.log('→ Backpressure 스트림 종료\n');
  });

  // 버퍼보다 큰 데이터 쓰기
  const canContinue1 = backpressureStream.write('This is a long text 1\n');
  console.log(`   버퍼 여유 있음? ${canContinue1}`);

  const canContinue2 = backpressureStream.write('This is a long text 2\n');
  console.log(`   버퍼 여유 있음? ${canContinue2}`);

  backpressureStream.end();
}, 1500);

// 4. objectMode - 객체 쓰기
setTimeout(() => {
  console.log('4. Object Mode (객체 쓰기)\n');

  const objectStream = new Writable({
    objectMode: true,
    write(obj, encoding, callback) {
      console.log(`→ 객체 쓰기: { id: ${obj.id}, name: "${obj.name}" }`);
      callback();
    }
  });

  objectStream.on('finish', () => {
    console.log('→ 객체 스트림 종료\n');
  });

  objectStream.write({ id: 1, name: 'Alice' });
  objectStream.write({ id: 2, name: 'Bob' });
  objectStream.write({ id: 3, name: 'Charlie' });
  objectStream.end();
}, 2500);

// 5. 로그 파일 스트림 (실전 예제)
setTimeout(() => {
  console.log('5. 실전: 로그 파일 스트림\n');

  const logStream = fs.createWriteStream('app.log', {
    flags: 'a',  // append 모드
    encoding: 'utf8'
  });

  function log(level, message) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`;
    console.log(`→ 로그: ${logLine.trim()}`);
    logStream.write(logLine);
  }

  log('info', '앱 시작');
  log('warn', '설정 파일 없음');
  log('error', '데이터베이스 연결 실패');
  log('info', '앱 종료');

  logStream.end(() => {
    console.log('→ 로그 파일 저장 완료');

    // 결과 확인
    const logs = fs.readFileSync('app.log', 'utf8');
    console.log('\n파일 내용:');
    console.log(logs);
    fs.unlinkSync('app.log');  // 테스트 파일 삭제
  });
}, 3500);

// 6. 에러 처리
setTimeout(() => {
  console.log('6. 에러 처리\n');

  const errorStream = new Writable({
    write(chunk, encoding, callback) {
      const text = chunk.toString().trim();

      if (text === 'ERROR') {
        console.log(`→ 에러 발생: "${text}"`);
        callback(new Error('잘못된 데이터'));
      } else {
        console.log(`→ 정상 쓰기: "${text}"`);
        callback();
      }
    }
  });

  errorStream.on('error', (err) => {
    console.log(`   [에러 캐치] ${err.message}\n`);
  });

  errorStream.on('finish', () => {
    console.log('→ 에러 스트림 종료\n');
  });

  errorStream.write('OK\n');
  errorStream.write('ERROR\n');
  errorStream.write('OK AGAIN\n');
  errorStream.end();
}, 5000);

/**
 * 실행:
 * node 02-writable-stream.js
 *
 * 핵심 개념:
 * - Writable Stream: 데이터를 쓸 수 있는 스트림
 * - write(chunk, callback): 데이터 쓰기
 * - end(): 스트림 종료 (더 이상 쓰기 없음)
 * - fs.createWriteStream(): 파일에 스트림으로 쓰기
 *
 * 주요 이벤트:
 * - 'finish': end() 호출 후 모든 데이터가 쓰여졌을 때
 * - 'drain': 버퍼가 비워져서 다시 쓸 수 있을 때
 * - 'error': 쓰기 에러 발생 시
 * - 'close': 스트림이 닫힐 때
 *
 * write() 반환값:
 * - true: 버퍼에 여유가 있어서 계속 쓸 수 있음
 * - false: 버퍼가 가득 참, drain 이벤트를 기다려야 함
 *
 * Backpressure:
 * - 쓰기 속도가 너무 빠르면 버퍼가 넘칠 수 있음
 * - write()가 false 반환 시 일시정지
 * - 'drain' 이벤트 후 쓰기 재개
 *
 * 옵션:
 * - encoding: 문자 인코딩
 * - highWaterMark: 버퍼 크기 (기본 16KB)
 * - objectMode: 객체를 직접 쓰기
 * - flags: 파일 열기 모드 ('w', 'a', 'wx', etc.)
 *
 * 활용:
 * - 파일 쓰기 (로그, 데이터 저장)
 * - HTTP 응답 전송
 * - 압축 스트림
 * - 네트워크 전송
 *
 * Best Practices:
 * - 항상 callback() 호출 (안 하면 스트림 멈춤)
 * - error 이벤트 리스너 등록
 * - Backpressure 처리 (write 반환값 확인)
 * - 사용 후 end() 호출
 */
