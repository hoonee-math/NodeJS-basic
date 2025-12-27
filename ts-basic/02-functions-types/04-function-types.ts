/**
 * 04-function-types.ts
 * 함수 타입 별칭과 고차 함수
 */

// 1. 함수 타입 별칭 기본
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (x, y) => x + y;
const subtract: MathOperation = (x, y) => x - y;
const multiply: MathOperation = (x, y) => x * y;

console.log('=== 함수 타입 별칭 ===');
console.log(`add(10, 5) = ${add(10, 5)}`);
console.log(`subtract(10, 5) = ${subtract(10, 5)}`);
console.log(`multiply(10, 5) = ${multiply(10, 5)}`);

// 2. 함수 타입 재사용
type Validator = (value: string) => boolean;

const isEmail: Validator = (value) => value.includes('@');
const isNotEmpty: Validator = (value) => value.length > 0;
const isAlphanumeric: Validator = (value) => /^[a-zA-Z0-9]+$/.test(value);

console.log('\n=== 함수 타입 재사용 ===');
console.log(`isEmail('test@example.com'): ${isEmail('test@example.com')}`);
console.log(`isNotEmpty(''): ${isNotEmpty('')}`);
console.log(`isAlphanumeric('abc123'): ${isAlphanumeric('abc123')}`);

// 3. 고차 함수 (Higher-Order Functions) - 함수를 반환
type Multiplier = (factor: number) => (value: number) => number;

const createMultiplier: Multiplier = (factor) => {
  return (value) => value * factor;
};

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log('\n=== 고차 함수: 함수 반환 ===');
console.log(`double(5) = ${double(5)}`);
console.log(`triple(5) = ${triple(5)}`);

// 4. 고차 함수 - 함수를 매개변수로 받음
type Predicate<T> = (item: T) => boolean;

function filter<T>(array: T[], predicate: Predicate<T>): T[] {
  const result: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
}

console.log('\n=== 고차 함수: 함수를 매개변수로 ===');
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = filter(numbers, (n) => n % 2 === 0);
const greaterThanFive = filter(numbers, (n) => n > 5);

console.log('Evens:', evens);
console.log('Greater than 5:', greaterThanFive);

// 5. 함수 타입으로 콜백 정의
type Callback<T> = (error: Error | null, result?: T) => void;

function asyncOperation<T>(
  value: T,
  delay: number,
  callback: Callback<T>
): void {
  setTimeout(() => {
    if (Math.random() > 0.8) {
      callback(new Error('Random error occurred'));
    } else {
      callback(null, value);
    }
  }, delay);
}

console.log('\n=== 콜백 타입 정의 ===');
asyncOperation('Success!', 100, (error, result) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Result:', result);
  }
});

// 6. 함수 시그니처 여러 개
type StringFormatter = {
  (value: string): string; // 기본 시그니처
  uppercase: (value: string) => string; // 메서드
  lowercase: (value: string) => string; // 메서드
};

const formatter: StringFormatter = ((value: string) => value.trim()) as any;
formatter.uppercase = (value) => value.toUpperCase();
formatter.lowercase = (value) => value.toLowerCase();

console.log('\n=== 여러 시그니처 ===');
console.log(`formatter('  hello  ') = "${formatter('  hello  ')}"`);
console.log(`formatter.uppercase('hello') = ${formatter.uppercase('hello')}`);
console.log(`formatter.lowercase('WORLD') = ${formatter.lowercase('WORLD')}`);

// 7. 제네릭 함수 타입
type Mapper<T, U> = (item: T) => U;

function map<T, U>(array: T[], mapper: Mapper<T, U>): U[] {
  return array.map(mapper);
}

console.log('\n=== 제네릭 함수 타입 ===');
const lengths = map(['a', 'ab', 'abc'], (s) => s.length);
const doubled = map([1, 2, 3], (n) => n * 2);

console.log('Lengths:', lengths);
console.log('Doubled:', doubled);

// 8. 함수 조합 (Function Composition)
type UnaryFunction<T, R> = (arg: T) => R;

function compose<A, B, C>(
  f: UnaryFunction<B, C>,
  g: UnaryFunction<A, B>
): UnaryFunction<A, C> {
  return (arg: A) => f(g(arg));
}

const addOne = (n: number) => n + 1;
const doubleNum = (n: number) => n * 2;
const addOneThenDouble = compose(doubleNum, addOne);

console.log('\n=== 함수 조합 ===');
console.log(`addOneThenDouble(5) = ${addOneThenDouble(5)}`); // (5 + 1) * 2 = 12

// 9. 이벤트 핸들러 타입
type EventHandler<T extends Event = Event> = (event: T) => void;

type MouseEventHandler = EventHandler<MouseEvent>;
type KeyboardEventHandler = EventHandler<KeyboardEvent>;

const handleClick: MouseEventHandler = (event) => {
  console.log(`Clicked at (${event.clientX}, ${event.clientY})`);
};

const handleKeyPress: KeyboardEventHandler = (event) => {
  console.log(`Key pressed: ${event.key}`);
};

console.log('\n=== 이벤트 핸들러 타입 ===');
console.log('Event handlers defined');

// 10. 함수 팩토리 패턴
type LoggerConfig = {
  prefix: string;
  level: 'info' | 'warn' | 'error';
};

type Logger = (message: string) => void;

function createLogger(config: LoggerConfig): Logger {
  return (message: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${config.level.toUpperCase()}] ${config.prefix}: ${message}`);
  };
}

console.log('\n=== 함수 팩토리 패턴 ===');
const infoLogger = createLogger({ prefix: 'APP', level: 'info' });
const errorLogger = createLogger({ prefix: 'APP', level: 'error' });

infoLogger('Application started');
errorLogger('An error occurred');

// 11. 커링 (Currying)
type CurriedAdd = (a: number) => (b: number) => (c: number) => number;

const curriedAdd: CurriedAdd = (a) => (b) => (c) => a + b + c;

console.log('\n=== 커링 ===');
console.log(`curriedAdd(1)(2)(3) = ${curriedAdd(1)(2)(3)}`);

const addOne2 = curriedAdd(1);
const addOneAndTwo = addOne2(2);
console.log(`addOneAndTwo(3) = ${addOneAndTwo(3)}`);

// 12. 파이프 함수
type PipeFunction = <T>(value: T, ...fns: UnaryFunction<any, any>[]) => any;

const pipe: PipeFunction = (value, ...fns) => {
  return fns.reduce((acc, fn) => fn(acc), value);
};

const increment = (n: number) => n + 1;
const square = (n: number) => n * n;
const halve = (n: number) => n / 2;

console.log('\n=== 파이프 함수 ===');
const result = pipe(5, increment, square, halve); // ((5 + 1)^2) / 2 = 18
console.log(`pipe(5, increment, square, halve) = ${result}`);

// 13. 메모이제이션 함수 타입
type MemoizedFunction<T extends (...args: any[]) => any> = T & {
  cache: Map<string, ReturnType<T>>;
};

function memoize<T extends (...args: any[]) => any>(fn: T): MemoizedFunction<T> {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log(`  (cached)`);
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as MemoizedFunction<T>;

  memoized.cache = cache;
  return memoized;
}

const expensiveCalculation = memoize((n: number) => {
  console.log(`  Computing ${n}^2...`);
  return n * n;
});

console.log('\n=== 메모이제이션 ===');
console.log(`First call: ${expensiveCalculation(5)}`);
console.log(`Second call: ${expensiveCalculation(5)}`);
console.log(`Third call: ${expensiveCalculation(10)}`);

// 14. 함수 타입 유틸리티
type ExtractFunctionType<T> = T extends (...args: infer Args) => infer Ret
  ? (...args: Args) => Ret
  : never;

type MyFunc = (a: number, b: string) => boolean;
type Extracted = ExtractFunctionType<MyFunc>; // (a: number, b: string) => boolean

console.log('\n=== 함수 타입 유틸리티 ===');
console.log('ExtractFunctionType로 함수 타입 추출');

// 15. 실전 예제: API 클라이언트 타입
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type RequestHandler<T = any> = (
  url: string,
  options?: {
    method?: ApiMethod;
    body?: any;
    headers?: Record<string, string>;
  }
) => Promise<T>;

const request: RequestHandler = async (url, options = {}) => {
  const { method = 'GET', body, headers = {} } = options;
  console.log(`${method} ${url}`);
  return { status: 200, data: body };
};

console.log('\n=== 실전: API 클라이언트 ===');
request('/api/users', { method: 'GET' }).then((res) =>
  console.log('Response:', res)
);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 함수 타입 별칭
 *    - type으로 함수 타입 정의
 *      type MathOp = (a: number, b: number) => number;
 *
 *    - 재사용 가능
 *      const add: MathOp = (x, y) => x + y;
 *
 * 2. 고차 함수 (Higher-Order Functions)
 *    - 함수를 반환
 *      const createMultiplier = (n: number) => (x: number) => x * n;
 *
 *    - 함수를 매개변수로
 *      function filter<T>(arr: T[], predicate: (item: T) => boolean)
 *
 * 3. 콜백 타입 정의
 *    - 에러 우선 콜백
 *      type Callback<T> = (error: Error | null, result?: T) => void;
 *
 * 4. 함수 시그니처 확장
 *    - 함수 + 메서드
 *      type Formatter = {
 *        (value: string): string;
 *        uppercase: (value: string) => string;
 *      };
 *
 * 5. 제네릭 함수 타입
 *    - 타입 매개변수 사용
 *      type Mapper<T, U> = (item: T) => U;
 *
 * 6. 함수 조합 (Composition)
 *    - 여러 함수를 하나로
 *      compose(f, g)(x) === f(g(x))
 *
 * 7. 이벤트 핸들러 타입
 *    - 제네릭으로 이벤트 타입 지정
 *      type EventHandler<T extends Event> = (event: T) => void;
 *
 * 8. 함수 팩토리 패턴
 *    - 설정으로 함수 생성
 *      const logger = createLogger({ prefix: 'APP' });
 *
 * 9. 커링 (Currying)
 *    - 다중 매개변수를 단일 매개변수로
 *      const add = (a) => (b) => (c) => a + b + c;
 *
 * 10. 파이프 함수
 *     - 함수 연쇄 실행
 *       pipe(value, fn1, fn2, fn3)
 *
 * 11. 메모이제이션
 *     - 결과 캐싱
 *       const memoized = memoize(expensiveFunc);
 *
 * 12. 함수 타입 유틸리티
 *     - Parameters<T>: 매개변수 타입 추출
 *     - ReturnType<T>: 반환 타입 추출
 *
 * 13. 실전 패턴
 *     ✅ API 클라이언트
 *     ✅ 이벤트 핸들러
 *     ✅ 미들웨어
 *     ✅ 플러그인 시스템
 *     ✅ 함수형 프로그래밍
 *
 * 14. Best Practices
 *     ✅ 재사용되는 함수 타입은 별칭 사용
 *     ✅ 제네릭으로 유연성 확보
 *     ✅ 고차 함수로 추상화
 *     ✅ 타입 안전성 유지
 *     ✅ 함수형 패턴 활용
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/functions.html
 */
