/**
 * 01-sync-errors.js
 *
 * 동기 코드의 에러 처리
 */

console.log('=== 동기 코드 에러 처리 ===\n');

// 1. 기본 try-catch
console.log('1. 기본 try-catch\n');

try {
  console.log('→ 정상 실행');
  throw new Error('의도적인 에러 발생!');
  console.log('→ 이 코드는 실행되지 않음');
} catch (err) {
  console.log(`   [에러 캐치] ${err.message}`);
}

console.log('→ 프로그램 계속 실행\n');

// 2. Error 객체 속성
console.log('2. Error 객체 속성\n');

try {
  const data = JSON.parse('{ invalid json }');
} catch (err) {
  console.log(`→ 에러 타입: ${err.name}`);
  console.log(`   메시지: ${err.message}`);
  console.log(`   스택:\n${err.stack.split('\n').slice(0, 3).join('\n')}`);
}

console.log();

// 3. 여러 타입의 에러
console.log('3. 에러 타입별 처리\n');

function processValue(value) {
  try {
    if (value === null || value === undefined) {
      throw new TypeError('값이 null 또는 undefined입니다');
    }

    if (typeof value !== 'number') {
      throw new TypeError('숫자가 아닙니다');
    }

    if (value < 0) {
      throw new RangeError('음수는 허용되지 않습니다');
    }

    if (value > 100) {
      throw new RangeError('100을 초과할 수 없습니다');
    }

    return value * 2;
  } catch (err) {
    if (err instanceof TypeError) {
      console.log(`   [TypeError] ${err.message}`);
    } else if (err instanceof RangeError) {
      console.log(`   [RangeError] ${err.message}`);
    } else {
      console.log(`   [Unknown Error] ${err.message}`);
    }
    return null;
  }
}

console.log('→ processValue(50):', processValue(50));
console.log('→ processValue("abc"):', processValue('abc'));
console.log('→ processValue(-5):', processValue(-5));
console.log('→ processValue(150):', processValue(150));
console.log();

// 4. 중첩된 try-catch
console.log('4. 중첩된 try-catch\n');

try {
  console.log('→ 외부 try 블록 시작');

  try {
    console.log('   내부 try 블록 시작');
    throw new Error('내부 에러');
  } catch (innerErr) {
    console.log(`   [내부 catch] ${innerErr.message}`);
    throw new Error('내부에서 다시 던진 에러');
  }
} catch (outerErr) {
  console.log(`   [외부 catch] ${outerErr.message}`);
}

console.log();

// 5. finally 블록
console.log('5. finally 블록 (항상 실행)\n');

function testFinally(shouldThrow) {
  console.log(`→ testFinally(${shouldThrow})`);

  try {
    console.log('   try 블록 실행');

    if (shouldThrow) {
      throw new Error('에러 발생!');
    }

    console.log('   try 블록 완료');
    return 'success';
  } catch (err) {
    console.log(`   catch 블록: ${err.message}`);
    return 'error';
  } finally {
    console.log('   finally 블록 (항상 실행)');
  }
}

const result1 = testFinally(false);
console.log(`   결과: ${result1}\n`);

const result2 = testFinally(true);
console.log(`   결과: ${result2}\n`);

// 6. 리소스 정리 패턴
console.log('6. 리소스 정리 패턴\n');

const fs = require('fs');

function readFileSafely(filename) {
  let fd = null;

  try {
    console.log(`→ 파일 열기: ${filename}`);
    fd = fs.openSync(filename, 'r');

    const stats = fs.fstatSync(fd);
    console.log(`   파일 크기: ${stats.size} bytes`);

    const buffer = Buffer.alloc(stats.size);
    fs.readSync(fd, buffer, 0, stats.size, 0);

    console.log(`   읽기 완료`);
    return buffer.toString();
  } catch (err) {
    console.log(`   [에러] ${err.message}`);
    return null;
  } finally {
    if (fd !== null) {
      console.log(`   파일 닫기`);
      fs.closeSync(fd);
    }
  }
}

// 테스트용 파일 생성
fs.writeFileSync('test.txt', 'Hello, Error Handling!');

const content = readFileSafely('test.txt');
if (content) {
  console.log(`   내용: "${content}"`);
}

console.log();

// 존재하지 않는 파일
readFileSafely('nonexistent.txt');
console.log();

// 테스트 파일 삭제
fs.unlinkSync('test.txt');

// 7. 에러 다시 던지기 (re-throw)
console.log('7. 에러 다시 던지기\n');

function validateAge(age) {
  if (typeof age !== 'number') {
    throw new TypeError('나이는 숫자여야 합니다');
  }

  if (age < 0 || age > 150) {
    throw new RangeError('유효하지 않은 나이입니다');
  }

  return true;
}

function createUser(name, age) {
  try {
    console.log(`→ 사용자 생성: ${name}, ${age}세`);
    validateAge(age);
    console.log('   검증 통과');
    return { name, age };
  } catch (err) {
    console.log(`   [에러 발생] ${err.message}`);

    // 특정 에러는 처리하고, 나머지는 다시 던짐
    if (err instanceof TypeError) {
      console.log('   TypeError를 처리하고 기본값 사용');
      return { name, age: 0 };
    }

    // RangeError는 다시 던짐
    console.log('   에러를 상위로 전파');
    throw err;
  }
}

try {
  createUser('Alice', 30);
  createUser('Bob', 'invalid');
  createUser('Charlie', -5);
} catch (err) {
  console.log(`   [최종 catch] ${err.message}`);
}

console.log();

// 8. 조건부 에러 처리
console.log('8. 조건부 에러 처리\n');

function divide(a, b, options = {}) {
  const { strict = false } = options;

  try {
    console.log(`→ ${a} ÷ ${b}`);

    if (b === 0) {
      if (strict) {
        throw new Error('0으로 나눌 수 없습니다');
      }
      console.log('   경고: 0으로 나눔, Infinity 반환');
      return Infinity;
    }

    return a / b;
  } catch (err) {
    console.log(`   [에러] ${err.message}`);
    return NaN;
  }
}

console.log(`   결과 (느슨): ${divide(10, 0)}`);
console.log(`   결과 (엄격): ${divide(10, 0, { strict: true })}`);

/**
 * 실행:
 * node 01-sync-errors.js
 *
 * 핵심 개념:
 * - try-catch: 에러를 잡아서 처리
 * - throw: 에러를 발생시킴
 * - finally: 에러 여부와 상관없이 항상 실행
 * - Error 객체: name, message, stack 속성
 *
 * 기본 Error 타입:
 * - Error: 일반 에러
 * - TypeError: 타입 관련 에러
 * - RangeError: 범위 초과 에러
 * - ReferenceError: 존재하지 않는 변수 참조
 * - SyntaxError: 문법 에러
 *
 * Error 객체 속성:
 * - name: 에러 타입 이름
 * - message: 에러 메시지
 * - stack: 스택 트레이스 (디버깅용)
 *
 * try-catch-finally 흐름:
 * 1. try 블록 실행
 * 2. 에러 발생 시 catch 블록 실행
 * 3. finally 블록은 항상 실행
 * 4. return이 있어도 finally는 실행됨
 *
 * 에러 타입 확인:
 * - err instanceof TypeError
 * - err.name === 'TypeError'
 * - typeof err.code === 'string'
 *
 * 에러 다시 던지기:
 * - catch에서 일부 처리 후 throw err
 * - 상위 레벨로 에러 전파
 * - 계층적 에러 처리 가능
 *
 * 리소스 정리:
 * - finally 블록에서 파일, 연결 등 정리
 * - try-finally (catch 없이도 가능)
 * - 에러 여부와 상관없이 정리 보장
 *
 * Best Practices:
 * - 예상 가능한 에러만 try-catch로 처리
 * - 프로그래밍 실수는 에러로 잡지 말고 수정
 * - finally로 리소스 정리
 * - 에러 메시지는 명확하게
 * - instanceof로 에러 타입 확인
 *
 * 주의사항:
 * - try-catch는 동기 코드만 처리
 * - 비동기 에러는 다른 방법 필요
 * - 너무 넓은 범위의 try-catch는 지양
 * - 에러를 무시하지 말 것
 */
