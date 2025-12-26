/**
 * 01-readable-stream.js
 *
 * Readable Stream 기본 사용법
 */

const { Readable } = require('stream');
const fs = require('fs');

console.log('=== Readable Stream ===\n');

// 1. 기본 Readable Stream 생성
console.log('1. 커스텀 Readable Stream\n');

const customReadable = new Readable({
  read() {
    // 데이터를 push하면 읽을 수 있게 됨
  }
});

customReadable.on('data', (chunk) => {
  console.log(`→ 데이터 수신: "${chunk.toString()}"`);
});

customReadable.on('end', () => {
  console.log('→ 스트림 종료\n');
});

// 데이터 push
customReadable.push('Hello ');
customReadable.push('Streams!\n');
customReadable.push(null);  // null은 스트림 종료를 의미

// 2. 배열로부터 Readable Stream 생성
setTimeout(() => {
  console.log('2. 배열 데이터 스트림\n');

  const data = ['apple', 'banana', 'cherry', 'date'];
  let index = 0;

  const arrayStream = new Readable({
    read() {
      if (index < data.length) {
        const item = data[index++];
        console.log(`→ Push: ${item}`);
        this.push(item + '\n');
      } else {
        this.push(null);  // 데이터 끝
      }
    }
  });

  arrayStream.on('data', (chunk) => {
    console.log(`   수신: ${chunk.toString().trim()}`);
  });

  arrayStream.on('end', () => {
    console.log('   완료\n');
  });
}, 500);

// 3. Readable.from() - 이터러블로부터 생성
setTimeout(() => {
  console.log('3. Readable.from() 사용\n');

  const numbers = [1, 2, 3, 4, 5];
  const numberStream = Readable.from(numbers);

  numberStream.on('data', (num) => {
    console.log(`→ 숫자: ${num}`);
  });

  numberStream.on('end', () => {
    console.log('→ 숫자 스트림 종료\n');
  });
}, 1000);

// 4. 파일 읽기 스트림
setTimeout(() => {
  console.log('4. 파일 읽기 스트림\n');

  // 테스트용 파일 생성
  fs.writeFileSync('test-read.txt', 'Line 1\nLine 2\nLine 3\n');

  const fileStream = fs.createReadStream('test-read.txt', {
    encoding: 'utf8',
    highWaterMark: 10  // 버퍼 크기 (작게 설정하여 여러 청크로 나눔)
  });

  fileStream.on('data', (chunk) => {
    console.log(`→ 청크 수신 (${chunk.length}바이트): "${chunk}"`);
  });

  fileStream.on('end', () => {
    console.log('→ 파일 읽기 완료');
    fs.unlinkSync('test-read.txt');  // 테스트 파일 삭제
    console.log();
  });

  fileStream.on('error', (err) => {
    console.log(`→ 에러: ${err.message}`);
  });
}, 1500);

// 5. pause/resume 제어
setTimeout(() => {
  console.log('5. pause/resume 제어\n');

  const controlStream = Readable.from(['A', 'B', 'C', 'D', 'E']);
  let count = 0;

  controlStream.on('data', (chunk) => {
    count++;
    console.log(`→ 데이터 #${count}: ${chunk}`);

    if (count === 2) {
      console.log('   일시정지 (1초 후 재개)');
      controlStream.pause();

      setTimeout(() => {
        console.log('   재개!');
        controlStream.resume();
      }, 1000);
    }
  });

  controlStream.on('end', () => {
    console.log('→ 제어 스트림 종료\n');
  });
}, 2500);

// 6. objectMode - 객체 스트림
setTimeout(() => {
  console.log('6. Object Mode (객체 스트림)\n');

  const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' }
  ];

  const objectStream = Readable.from(users, { objectMode: true });

  objectStream.on('data', (user) => {
    console.log(`→ 사용자: #${user.id} - ${user.name}`);
  });

  objectStream.on('end', () => {
    console.log('→ 객체 스트림 종료\n');
  });
}, 4000);

/**
 * 실행:
 * node 01-readable-stream.js
 *
 * 핵심 개념:
 * - Readable Stream: 데이터를 읽을 수 있는 스트림
 * - push(data): 스트림에 데이터 추가
 * - push(null): 스트림 종료 신호
 * - Readable.from(): 이터러블을 스트림으로 변환
 * - fs.createReadStream(): 파일을 스트림으로 읽기
 *
 * 주요 이벤트:
 * - 'data': 데이터가 준비되면 발생 (chunk 단위)
 * - 'end': 모든 데이터를 읽었을 때 발생
 * - 'error': 에러 발생 시
 * - 'close': 스트림이 닫힐 때
 *
 * 제어 메서드:
 * - pause(): 데이터 읽기 일시정지
 * - resume(): 데이터 읽기 재개
 * - isPaused(): 일시정지 상태 확인
 *
 * 옵션:
 * - encoding: 문자 인코딩 ('utf8', 'ascii', etc.)
 * - highWaterMark: 내부 버퍼 크기 (기본 16KB)
 * - objectMode: 객체를 직접 스트리밍 (기본 false)
 *
 * 활용:
 * - 대용량 파일 읽기 (메모리 효율적)
 * - HTTP 응답 스트리밍
 * - 데이터베이스 결과 스트리밍
 * - 실시간 데이터 처리
 *
 * 장점:
 * - 메모리 효율적: 전체 데이터를 한 번에 로드하지 않음
 * - 즉시 처리 가능: 데이터가 도착하는 대로 처리
 * - Backpressure 자동 처리: 소비 속도에 맞춰 조절
 */
