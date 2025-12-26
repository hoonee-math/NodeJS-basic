/**
 * 05-error-patterns.js
 *
 * 실전 에러 처리 패턴
 */

console.log('=== 실전 에러 처리 패턴 ===\n');

// 1. 에러 래핑 패턴
console.log('1. 에러 래핑 패턴\n');

function wrapError(fn, context) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      console.log(`→ [${context}] 에러 발생: ${err.message}`);
      throw new Error(`${context} 실패: ${err.message}`);
    }
  };
}

async function riskyOperation() {
  throw new Error('데이터베이스 연결 실패');
}

const safeOperation = wrapError(riskyOperation, '사용자 조회');

safeOperation()
  .catch((err) => {
    console.log(`   최종 에러: ${err.message}\n`);
  });

// 2. Result 패턴 (성공/실패 명시)
setTimeout(() => {
  console.log('2. Result 패턴 (Rust-style)\n');

  class Result {
    constructor(success, value, error) {
      this.success = success;
      this.value = value;
      this.error = error;
    }

    static ok(value) {
      return new Result(true, value, null);
    }

    static err(error) {
      return new Result(false, null, error);
    }

    isOk() {
      return this.success;
    }

    isErr() {
      return !this.success;
    }

    unwrap() {
      if (this.isErr()) {
        throw this.error;
      }
      return this.value;
    }

    unwrapOr(defaultValue) {
      return this.isOk() ? this.value : defaultValue;
    }
  }

  function divide(a, b) {
    console.log(`→ ${a} ÷ ${b}`);

    if (b === 0) {
      return Result.err(new Error('0으로 나눌 수 없습니다'));
    }

    return Result.ok(a / b);
  }

  const result1 = divide(10, 2);
  if (result1.isOk()) {
    console.log(`   성공: ${result1.value}\n`);
  }

  const result2 = divide(10, 0);
  if (result2.isErr()) {
    console.log(`   실패: ${result2.error.message}`);
    console.log(`   기본값 사용: ${result2.unwrapOr(Infinity)}\n`);
  }
}, 100);

// 3. Either 패턴 (Left/Right)
setTimeout(() => {
  console.log('3. Either 패턴 (함수형)\n');

  class Either {
    constructor(type, value) {
      this.type = type;  // 'left' | 'right'
      this.value = value;
    }

    static left(value) {
      return new Either('left', value);
    }

    static right(value) {
      return new Either('right', value);
    }

    isLeft() {
      return this.type === 'left';
    }

    isRight() {
      return this.type === 'right';
    }

    map(fn) {
      return this.isRight()
        ? Either.right(fn(this.value))
        : this;
    }

    fold(leftFn, rightFn) {
      return this.isLeft()
        ? leftFn(this.value)
        : rightFn(this.value);
    }
  }

  function parseJSON(str) {
    console.log(`→ JSON 파싱: "${str}"`);

    try {
      const result = JSON.parse(str);
      return Either.right(result);
    } catch (err) {
      return Either.left(err.message);
    }
  }

  const either1 = parseJSON('{"name": "Alice"}');
  console.log(either1.fold(
    (err) => `   실패: ${err}`,
    (data) => `   성공: name=${data.name}`
  ));

  const either2 = parseJSON('{invalid}');
  console.log(either2.fold(
    (err) => `   실패: ${err}`,
    (data) => `   성공: ${data}`
  ));

  console.log();
}, 200);

// 4. 재시도 패턴 (지수 백오프)
setTimeout(async () => {
  console.log('4. 재시도 패턴 (지수 백오프)\n');

  async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 100) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`→ 시도 ${attempt + 1}/${maxRetries}`);
        return await fn();
      } catch (err) {
        const isLastAttempt = attempt === maxRetries - 1;

        if (isLastAttempt) {
          console.log(`   최종 실패: ${err.message}\n`);
          throw err;
        }

        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`   실패, ${delay}ms 후 재시도...`);

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  let attempt = 0;

  async function unreliableAPI() {
    attempt++;
    if (attempt < 3) {
      throw new Error(`일시적 오류 (${attempt}회)`);
    }
    return '성공!';
  }

  try {
    const result = await retryWithBackoff(unreliableAPI, 3, 50);
    console.log(`   결과: ${result}\n`);
  } catch (err) {
    console.log(`   [에러] ${err.message}\n`);
  }
}, 400);

// 5. Circuit Breaker 패턴
setTimeout(() => {
  console.log('5. Circuit Breaker 패턴\n');

  class CircuitBreaker {
    constructor(threshold = 3, timeout = 5000) {
      this.failureThreshold = threshold;
      this.timeout = timeout;
      this.failureCount = 0;
      this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
      this.nextAttempt = Date.now();
    }

    async execute(fn) {
      if (this.state === 'OPEN') {
        if (Date.now() < this.nextAttempt) {
          console.log('   [Circuit OPEN] 요청 차단');
          throw new Error('Circuit breaker is OPEN');
        }

        console.log('   [Circuit HALF_OPEN] 재시도 허용');
        this.state = 'HALF_OPEN';
      }

      try {
        const result = await fn();
        this.onSuccess();
        return result;
      } catch (err) {
        this.onFailure();
        throw err;
      }
    }

    onSuccess() {
      this.failureCount = 0;

      if (this.state === 'HALF_OPEN') {
        console.log('   [Circuit → CLOSED] 정상화');
        this.state = 'CLOSED';
      }
    }

    onFailure() {
      this.failureCount++;
      console.log(`   실패 카운트: ${this.failureCount}/${this.failureThreshold}`);

      if (this.failureCount >= this.failureThreshold) {
        console.log('   [Circuit → OPEN] 차단 시작');
        this.state = 'OPEN';
        this.nextAttempt = Date.now() + this.timeout;
      }
    }
  }

  const breaker = new CircuitBreaker(2, 1000);

  async function flakyService(shouldFail) {
    if (shouldFail) {
      throw new Error('서비스 오류');
    }
    return 'OK';
  }

  async function testCircuitBreaker() {
    const tests = [
      { fail: true, desc: '첫 번째 실패' },
      { fail: true, desc: '두 번째 실패 (Circuit OPEN)' },
      { fail: false, desc: '세 번째 요청 (차단됨)' },
      { fail: false, desc: '네 번째 요청 (차단됨)' }
    ];

    for (const test of tests) {
      console.log(`\n→ ${test.desc}`);

      try {
        await breaker.execute(() => flakyService(test.fail));
        console.log('   성공');
      } catch (err) {
        console.log(`   [에러] ${err.message}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  testCircuitBreaker();
}, 700);

// 6. Error Boundary 패턴 (React-style for Node.js)
setTimeout(() => {
  console.log('\n6. Error Boundary 패턴\n');

  class ErrorBoundary {
    constructor(fallback) {
      this.fallback = fallback;
    }

    async execute(fn) {
      try {
        return await fn();
      } catch (err) {
        console.log(`→ [ErrorBoundary] 에러 캐치: ${err.message}`);
        return this.fallback(err);
      }
    }
  }

  const boundary = new ErrorBoundary((err) => {
    return { error: true, message: err.message };
  });

  async function riskyTask() {
    throw new Error('예상된 에러');
  }

  boundary.execute(riskyTask).then((result) => {
    console.log(`   Fallback 결과: ${JSON.stringify(result)}\n`);
  });
}, 1600);

// 7. 에러 집계 패턴
setTimeout(() => {
  console.log('7. 에러 집계 패턴\n');

  class ErrorAggregator {
    constructor() {
      this.errors = [];
    }

    add(error, context = {}) {
      this.errors.push({
        error,
        context,
        timestamp: new Date()
      });
    }

    hasErrors() {
      return this.errors.length > 0;
    }

    getErrors() {
      return this.errors;
    }

    throw() {
      if (this.hasErrors()) {
        const error = new Error(`${this.errors.length}개의 에러 발생`);
        error.errors = this.errors;
        throw error;
      }
    }
  }

  function validateForm(data) {
    const aggregator = new ErrorAggregator();

    console.log('→ 폼 검증 시작');

    if (!data.name) {
      aggregator.add(new Error('이름 필수'), { field: 'name' });
    }

    if (!data.email || !data.email.includes('@')) {
      aggregator.add(new Error('유효한 이메일 필요'), { field: 'email' });
    }

    if (data.age < 0 || data.age > 150) {
      aggregator.add(new Error('유효하지 않은 나이'), { field: 'age' });
    }

    aggregator.throw();
  }

  try {
    validateForm({ name: '', email: 'invalid', age: -5 });
  } catch (err) {
    console.log(`   [에러] ${err.message}`);
    err.errors.forEach(({ error, context }) => {
      console.log(`   - ${context.field}: ${error.message}`);
    });
  }

  console.log();
}, 1700);

// 8. Fail-Fast vs Fail-Safe
setTimeout(() => {
  console.log('8. Fail-Fast vs Fail-Safe\n');

  // Fail-Fast: 즉시 에러 발생
  function failFast(value) {
    console.log('→ Fail-Fast 방식');

    if (value < 0) {
      throw new Error('음수는 허용되지 않습니다');
    }

    console.log(`   처리: ${value * 2}\n`);
    return value * 2;
  }

  // Fail-Safe: 안전한 기본값 반환
  function failSafe(value) {
    console.log('→ Fail-Safe 방식');

    if (value < 0) {
      console.log('   경고: 음수 입력, 0으로 처리');
      value = 0;
    }

    console.log(`   처리: ${value * 2}\n`);
    return value * 2;
  }

  try {
    failFast(-5);
  } catch (err) {
    console.log(`   [에러] ${err.message}\n`);
  }

  failSafe(-5);
}, 1800);

/**
 * 실행:
 * node 05-error-patterns.js
 *
 * 핵심 개념:
 * - 다양한 에러 처리 패턴
 * - 상황에 맞는 패턴 선택
 * - 에러 복구 전략
 *
 * 에러 래핑:
 * - 저수준 에러를 고수준 에러로 변환
 * - 컨텍스트 정보 추가
 * - 일관된 에러 형식
 *
 * Result 패턴:
 * - 에러를 값으로 표현
 * - 명시적인 성공/실패 처리
 * - 타입 안전성
 *
 * Either 패턴:
 * - 함수형 프로그래밍 스타일
 * - Left (에러), Right (성공)
 * - 체이닝 가능
 *
 * 재시도 패턴:
 * - 일시적 오류 대응
 * - 지수 백오프로 부하 분산
 * - 최대 재시도 횟수 설정
 *
 * Circuit Breaker:
 * - 연쇄 장애 방지
 * - 3가지 상태: CLOSED, OPEN, HALF_OPEN
 * - 실패 임계값 초과 시 차단
 *
 * Error Boundary:
 * - 에러 격리
 * - Fallback 로직 제공
 * - 애플리케이션 전체 중단 방지
 *
 * 에러 집계:
 * - 여러 에러 수집
 * - 폼 검증 등에 유용
 * - 모든 문제를 한 번에 보고
 *
 * Fail-Fast vs Fail-Safe:
 * - Fail-Fast: 빠른 실패, 명확한 에러
 * - Fail-Safe: 안전한 기본값, 계속 실행
 * - 상황에 따라 선택
 *
 * Best Practices:
 * - 도메인에 맞는 패턴 선택
 * - 일관된 에러 처리 전략
 * - 로깅과 모니터링
 * - 테스트 가능한 코드
 *
 * 활용:
 * - API 호출 재시도
 * - 마이크로서비스 통신
 * - 폼 검증
 * - 외부 서비스 연동
 */
