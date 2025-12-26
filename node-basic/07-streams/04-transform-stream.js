/**
 * 04-transform-stream.js
 *
 * Transform Stream으로 데이터 변환하기
 */

const { Transform, pipeline } = require('stream');
const { Readable, Writable } = require('stream');
const fs = require('fs');

console.log('=== Transform Stream ===\n');

// 1. 기본 Transform Stream
console.log('1. 기본 Transform (대문자 변환)\n');

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    const transformed = chunk.toString().toUpperCase();
    console.log(`→ 변환: "${chunk}" → "${transformed}"`);
    this.push(transformed);
    callback();
  }
});

const input = Readable.from(['hello\n', 'world\n']);
const output = new Writable({
  write(chunk, encoding, callback) {
    console.log(`   출력: ${chunk}`);
    callback();
  }
});

pipeline(input, upperCaseTransform, output, (err) => {
  if (err) console.error(err);
  else console.log('→ 완료\n');
});

// 2. JSON 파싱 Transform
setTimeout(() => {
  console.log('2. JSON 파싱 Transform\n');

  const jsonParser = new Transform({
    objectMode: true,  // 객체 입출력
    transform(chunk, encoding, callback) {
      try {
        const obj = JSON.parse(chunk.toString());
        console.log(`→ 파싱: ${chunk.toString().trim()}`);
        this.push(obj);
        callback();
      } catch (err) {
        callback(err);
      }
    }
  });

  const jsonInput = Readable.from([
    '{"name": "Alice", "age": 30}\n',
    '{"name": "Bob", "age": 25}\n'
  ]);

  const jsonOutput = new Writable({
    objectMode: true,
    write(obj, encoding, callback) {
      console.log(`   객체: name=${obj.name}, age=${obj.age}`);
      callback();
    }
  });

  pipeline(jsonInput, jsonParser, jsonOutput, (err) => {
    if (err) console.error(err);
    else console.log('→ JSON 파싱 완료\n');
  });
}, 500);

// 3. CSV to JSON Transform
setTimeout(() => {
  console.log('3. CSV to JSON Transform\n');

  const csvToJson = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const line = chunk.toString().trim();

      if (line) {
        const [name, age, city] = line.split(',');
        const obj = { name, age: parseInt(age), city };
        console.log(`→ CSV: "${line}"`);
        console.log(`   JSON: ${JSON.stringify(obj)}`);
        this.push(obj);
      }

      callback();
    }
  });

  const csvInput = Readable.from([
    'Alice,30,Seoul\n',
    'Bob,25,Busan\n',
    'Charlie,35,Daegu\n'
  ]);

  const jsonOutput = new Writable({
    objectMode: true,
    write(obj, encoding, callback) {
      console.log(`   저장: ${obj.name} (${obj.city})`);
      callback();
    }
  });

  pipeline(csvInput, csvToJson, jsonOutput, (err) => {
    if (err) console.error(err);
    else console.log('→ CSV 변환 완료\n');
  });
}, 1500);

// 4. 필터 Transform (조건 필터링)
setTimeout(() => {
  console.log('4. 필터 Transform (짝수만)\n');

  const evenFilter = new Transform({
    objectMode: true,
    transform(num, encoding, callback) {
      console.log(`→ 입력: ${num}`);

      if (num % 2 === 0) {
        console.log(`   ✓ 통과 (짝수)`);
        this.push(num);
      } else {
        console.log(`   ✗ 필터링 (홀수)`);
      }

      callback();
    }
  });

  const numbers = Readable.from([1, 2, 3, 4, 5, 6, 7, 8]);

  const output = new Writable({
    objectMode: true,
    write(num, encoding, callback) {
      console.log(`   결과: ${num}`);
      callback();
    }
  });

  pipeline(numbers, evenFilter, output, (err) => {
    if (err) console.error(err);
    else console.log('→ 필터링 완료\n');
  });
}, 2500);

// 5. 여러 Transform 체이닝
setTimeout(() => {
  console.log('5. Transform 체이닝 (trim + uppercase + exclamation)\n');

  const trimTransform = new Transform({
    transform(chunk, encoding, callback) {
      const trimmed = chunk.toString().trim();
      this.push(trimmed);
      callback();
    }
  });

  const upperTransform = new Transform({
    transform(chunk, encoding, callback) {
      const upper = chunk.toString().toUpperCase();
      this.push(upper);
      callback();
    }
  });

  const exclamationTransform = new Transform({
    transform(chunk, encoding, callback) {
      const result = chunk.toString() + '!!!';
      this.push(result);
      callback();
    }
  });

  const input = Readable.from(['  hello  \n', '  world  \n']);

  const output = new Writable({
    write(chunk, encoding, callback) {
      console.log(`→ 최종 결과: "${chunk}"`);
      callback();
    }
  });

  pipeline(
    input,
    trimTransform,
    upperTransform,
    exclamationTransform,
    output,
    (err) => {
      if (err) console.error(err);
      else console.log('→ 체이닝 완료\n');
    }
  );
}, 3500);

// 6. 실전 예제: 로그 파일 처리
setTimeout(() => {
  console.log('6. 실전: 로그 파일 필터링 (ERROR만)\n');

  // 테스트 로그 파일 생성
  const logs = [
    '[INFO] 앱 시작\n',
    '[ERROR] 데이터베이스 연결 실패\n',
    '[WARN] 캐시 만료\n',
    '[ERROR] 파일 읽기 실패\n',
    '[INFO] 요청 처리 완료\n'
  ].join('');

  fs.writeFileSync('app.log', logs);

  // ERROR 로그만 필터링하는 Transform
  const errorFilter = new Transform({
    transform(chunk, encoding, callback) {
      const line = chunk.toString();

      if (line.includes('[ERROR]')) {
        console.log(`→ ERROR 발견: ${line.trim()}`);
        this.push(line);
      }

      callback();
    }
  });

  pipeline(
    fs.createReadStream('app.log'),
    errorFilter,
    fs.createWriteStream('errors.log'),
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('→ 에러 로그 추출 완료');

        // 결과 확인
        const errors = fs.readFileSync('errors.log', 'utf8');
        console.log('\n에러 로그:');
        console.log(errors);

        // 테스트 파일 삭제
        fs.unlinkSync('app.log');
        fs.unlinkSync('errors.log');
      }
    }
  );
}, 4500);

/**
 * 실행:
 * node 04-transform-stream.js
 *
 * 핵심 개념:
 * - Transform Stream: Readable과 Writable의 조합
 * - transform(chunk, encoding, callback): 변환 로직 구현
 * - this.push(data): 변환된 데이터를 다음 스트림으로 전달
 * - callback(): 변환 완료 신호 (필수!)
 *
 * Transform vs Readable/Writable:
 * - Readable: 데이터 생성만
 * - Writable: 데이터 소비만
 * - Transform: 데이터 입력 → 변환 → 출력
 *
 * transform() 메서드:
 * - chunk: 입력 데이터
 * - encoding: 인코딩 타입
 * - callback(err, data): 완료 콜백
 *   - callback() 만 호출: push()로 전달한 데이터 사용
 *   - callback(null, data): 이 데이터를 push
 *   - callback(err): 에러 발생
 *
 * 주요 활용:
 * - 데이터 포맷 변환 (CSV → JSON, XML → JSON)
 * - 텍스트 변환 (대문자, 소문자, 암호화)
 * - 필터링 (조건에 맞는 데이터만 통과)
 * - 집계/통계 (데이터 카운트, 합계)
 * - 파싱 (로그 파싱, 텍스트 파싱)
 *
 * objectMode:
 * - false (기본): Buffer/String 스트림
 * - true: 객체 스트림 (JSON, 커스텀 객체 등)
 *
 * 메서드:
 * - this.push(data): 다음 스트림으로 데이터 전달
 * - this.push(null): 스트림 종료
 * - callback(): transform 완료 신호
 *
 * flush() 메서드 (선택):
 * - 스트림 종료 직전 호출
 * - 남은 데이터 처리 (버퍼링된 데이터 등)
 *
 * Best Practices:
 * - 항상 callback() 호출 (안 하면 스트림 멈춤)
 * - 에러는 callback(err)로 전달
 * - 복잡한 변환은 여러 Transform으로 나누기
 * - objectMode는 필요할 때만 사용
 */
