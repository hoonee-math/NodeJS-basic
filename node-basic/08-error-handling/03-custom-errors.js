/**
 * 03-custom-errors.js
 *
 * 커스텀 Error 클래스 만들기
 */

console.log('=== 커스텀 Error 클래스 ===\n');

// 1. 기본 커스텀 Error
console.log('1. 기본 커스텀 Error\n');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

try {
  console.log('→ ValidationError 발생');
  throw new ValidationError('유효성 검사 실패');
} catch (err) {
  console.log(`   이름: ${err.name}`);
  console.log(`   메시지: ${err.message}`);
  console.log(`   타입 확인: ${err instanceof ValidationError}`);
}

console.log();

// 2. 추가 속성을 가진 커스텀 Error
console.log('2. 추가 속성을 가진 커스텀 Error\n');

class DatabaseError extends Error {
  constructor(message, code, query) {
    super(message);
    this.name = 'DatabaseError';
    this.code = code;
    this.query = query;
    this.timestamp = new Date();
  }
}

try {
  console.log('→ DatabaseError 발생');
  throw new DatabaseError(
    '쿼리 실행 실패',
    'DB001',
    'SELECT * FROM users'
  );
} catch (err) {
  if (err instanceof DatabaseError) {
    console.log(`   [${err.name}] ${err.message}`);
    console.log(`   코드: ${err.code}`);
    console.log(`   쿼리: ${err.query}`);
    console.log(`   시간: ${err.timestamp.toISOString()}`);
  }
}

console.log();

// 3. HTTP 에러 클래스
console.log('3. HTTP 에러 클래스 계층\n');

class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
  }
}

class BadRequestError extends HttpError {
  constructor(message = 'Bad Request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

class NotFoundError extends HttpError {
  constructor(message = 'Not Found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

function handleHttpRequest(url, isAuthenticated = false) {
  console.log(`→ 요청: ${url}`);

  try {
    if (!isAuthenticated && url.includes('admin')) {
      throw new UnauthorizedError('관리자 권한 필요');
    }

    if (url.includes('invalid')) {
      throw new BadRequestError('잘못된 요청');
    }

    if (url === '/not-found') {
      throw new NotFoundError('페이지를 찾을 수 없음');
    }

    console.log('   성공: 200 OK\n');
    return { status: 200, data: 'Success' };
  } catch (err) {
    if (err instanceof HttpError) {
      console.log(`   [${err.statusCode}] ${err.name}: ${err.message}\n`);
      return { status: err.statusCode, error: err.message };
    }
    throw err;
  }
}

handleHttpRequest('/home');
handleHttpRequest('/admin', false);
handleHttpRequest('/invalid');
handleHttpRequest('/not-found');

// 4. 비즈니스 로직 에러
console.log('4. 비즈니스 로직 에러\n');

class InsufficientFundsError extends Error {
  constructor(balance, amount) {
    super(`잔액 부족: ${balance}원 (필요: ${amount}원)`);
    this.name = 'InsufficientFundsError';
    this.balance = balance;
    this.required = amount;
    this.shortage = amount - balance;
  }
}

class Account {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }

  withdraw(amount) {
    console.log(`→ ${this.owner}: ${amount}원 출금 시도`);

    if (amount > this.balance) {
      throw new InsufficientFundsError(this.balance, amount);
    }

    this.balance -= amount;
    console.log(`   성공! 잔액: ${this.balance}원\n`);
    return amount;
  }
}

const account = new Account('Alice', 10000);

try {
  account.withdraw(5000);
  account.withdraw(8000);
} catch (err) {
  if (err instanceof InsufficientFundsError) {
    console.log(`   [에러] ${err.message}`);
    console.log(`   부족액: ${err.shortage}원\n`);
  }
}

// 5. 에러 원인 체이닝
console.log('5. 에러 원인 체이닝 (cause)\n');

class ApplicationError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'ApplicationError';
    this.cause = cause;  // 원인이 된 에러
  }
}

function lowLevelFunction() {
  throw new Error('파일을 읽을 수 없음');
}

function midLevelFunction() {
  try {
    lowLevelFunction();
  } catch (err) {
    throw new ApplicationError('데이터 로드 실패', err);
  }
}

function highLevelFunction() {
  try {
    console.log('→ 애플리케이션 초기화');
    midLevelFunction();
  } catch (err) {
    if (err instanceof ApplicationError) {
      console.log(`   [에러] ${err.message}`);
      console.log(`   원인: ${err.cause.message}`);
    }
  }
}

highLevelFunction();
console.log();

// 6. 에러 팩토리 패턴
console.log('6. 에러 팩토리 패턴\n');

class ErrorFactory {
  static validation(field, value) {
    return new ValidationError(
      `유효하지 않은 ${field}: "${value}"`
    );
  }

  static database(operation, details) {
    return new DatabaseError(
      `데이터베이스 ${operation} 실패`,
      'DB_ERROR',
      details
    );
  }

  static http(statusCode, message) {
    const errors = {
      400: BadRequestError,
      401: UnauthorizedError,
      404: NotFoundError
    };

    const ErrorClass = errors[statusCode] || HttpError;
    return new ErrorClass(message);
  }
}

try {
  console.log('→ 사용자 등록');

  const email = 'invalid-email';

  if (!email.includes('@')) {
    throw ErrorFactory.validation('이메일', email);
  }
} catch (err) {
  console.log(`   [${err.name}] ${err.message}`);
}

console.log();

// 7. 에러 직렬화 (JSON 변환)
console.log('7. 에러 직렬화 (로깅용)\n');

class SerializableError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'SerializableError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack.split('\n').slice(0, 3)
    };
  }
}

try {
  console.log('→ SerializableError 발생');

  throw new SerializableError(
    '처리 중 오류 발생',
    'ERR_PROCESSING',
    { userId: 123, action: 'update' }
  );
} catch (err) {
  const errorLog = JSON.stringify(err.toJSON(), null, 2);
  console.log('   에러 로그:\n' + errorLog);
}

console.log();

// 8. 실전: API 에러 응답 클래스
console.log('8. 실전: API 에러 응답\n');

class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }

  toResponse() {
    return {
      success: false,
      error: {
        code: this.statusCode,
        message: this.message,
        details: this.errors
      }
    };
  }
}

function validateUser(data) {
  const errors = [];

  if (!data.name) {
    errors.push({ field: 'name', message: '이름은 필수입니다' });
  }

  if (!data.email || !data.email.includes('@')) {
    errors.push({ field: 'email', message: '유효한 이메일이 필요합니다' });
  }

  if (data.age && (data.age < 0 || data.age > 150)) {
    errors.push({ field: 'age', message: '유효하지 않은 나이입니다' });
  }

  if (errors.length > 0) {
    throw new ApiError(400, '유효성 검사 실패', errors);
  }

  return true;
}

try {
  console.log('→ 사용자 데이터 검증');

  validateUser({
    name: '',
    email: 'invalid',
    age: 200
  });
} catch (err) {
  if (err instanceof ApiError) {
    const response = err.toResponse();
    console.log('   API 응답:');
    console.log(JSON.stringify(response, null, 2));
  }
}

/**
 * 실행:
 * node 03-custom-errors.js
 *
 * 핵심 개념:
 * - 커스텀 Error 클래스로 에러 타입 구분
 * - 추가 속성으로 에러 정보 확장
 * - 에러 계층 구조로 분류
 * - instanceof로 타입 확인
 *
 * 커스텀 Error 만들기:
 * class MyError extends Error {
 *   constructor(message) {
 *     super(message);
 *     this.name = 'MyError';
 *   }
 * }
 *
 * 기본 구조:
 * - super(message): 부모 클래스 생성자 호출
 * - this.name: 에러 이름 설정
 * - 추가 속성: code, statusCode, details 등
 *
 * 에러 계층:
 * Error
 *  ├─ ValidationError
 *  ├─ DatabaseError
 *  └─ HttpError
 *      ├─ BadRequestError (400)
 *      ├─ UnauthorizedError (401)
 *      └─ NotFoundError (404)
 *
 * 에러 원인 체이닝:
 * - cause 속성으로 원인 에러 저장
 * - 에러 발생 경로 추적 가능
 * - 디버깅에 유용
 *
 * 에러 팩토리:
 * - 정적 메서드로 에러 생성
 * - 일관된 에러 생성 보장
 * - 사용하기 편리
 *
 * 에러 직렬화:
 * - toJSON() 메서드 구현
 * - 로깅, API 응답에 활용
 * - JSON.stringify() 자동 호출
 *
 * Best Practices:
 * - 의미 있는 에러 타입 만들기
 * - name 속성 설정하기
 * - 에러 계층 구조 설계
 * - instanceof로 타입 확인
 * - 필요한 정보만 포함
 *
 * 활용 사례:
 * - API 에러 응답
 * - 비즈니스 로직 에러
 * - 데이터베이스 에러
 * - HTTP 상태 코드 매핑
 * - 유효성 검사 에러
 *
 * 주의사항:
 * - super(message) 필수 호출
 * - this.name 설정 권장
 * - 너무 많은 커스텀 에러는 복잡도 증가
 * - 표준 에러 타입도 적절히 사용
 */
