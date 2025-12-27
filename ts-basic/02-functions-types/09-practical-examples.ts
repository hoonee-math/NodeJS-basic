/**
 * 09-practical-examples.ts
 * 실전에서 자주 사용하는 함수 패턴
 */

// 1. API 클라이언트 - 기본 구조
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
}

class HttpClient {
  constructor(private baseUrl: string) {}

  async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;
    const url = `${this.baseUrl}${endpoint}`;

    console.log(`${method} ${url}`);

    // 실제로는 fetch 사용
    return {
      id: 1,
      data: 'mock response',
    } as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

console.log('=== API 클라이언트 ===');
const api = new HttpClient('https://api.example.com');

interface User {
  id: number;
  name: string;
}

api.get<User>('/users/1').then((user) => console.log('User:', user));

// 2. 디바운스 (Debounce)
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

console.log('\n=== 디바운스 ===');
const debouncedLog = debounce((message: string) => {
  console.log('Debounced:', message);
}, 300);

debouncedLog('First call');
debouncedLog('Second call');
debouncedLog('Third call'); // 마지막 호출만 실행됨

// 3. 쓰로틀 (Throttle)
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

console.log('\n=== 쓰로틀 ===');
const throttledLog = throttle((message: string) => {
  console.log('Throttled:', message);
}, 1000);

throttledLog('First');
setTimeout(() => throttledLog('Second'), 500);
setTimeout(() => throttledLog('Third'), 1500);

// 4. 메모이제이션 (Memoization)
function memoize<T extends (...args: any[]) => any>(
  fn: T
): T & { cache: Map<string, ReturnType<T>> } {
  const cache = new Map<string, ReturnType<T>>();

  const memoized = ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('  (from cache)');
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T & { cache: Map<string, ReturnType<T>> };

  memoized.cache = cache;
  return memoized;
}

console.log('\n=== 메모이제이션 ===');
const expensiveCalc = memoize((n: number) => {
  console.log(`  Computing ${n}^2...`);
  return n * n;
});

console.log('Result:', expensiveCalc(5));
console.log('Result:', expensiveCalc(5)); // 캐시에서 가져옴
console.log('Result:', expensiveCalc(10));

// 5. 파이프 (Pipe)
type PipeFunction = <T>(...fns: ((arg: T) => T)[]) => (arg: T) => T;

const pipe: PipeFunction = (...fns) => {
  return (arg) => fns.reduce((acc, fn) => fn(acc), arg);
};

console.log('\n=== 파이프 ===');
const increment = (n: number) => n + 1;
const double = (n: number) => n * 2;
const square = (n: number) => n * n;

const transform = pipe(increment, double, square);
console.log('pipe(5):', transform(5)); // ((5 + 1) * 2)^2 = 144

// 6. 컴포즈 (Compose)
type ComposeFunction = <T>(...fns: ((arg: T) => T)[]) => (arg: T) => T;

const compose: ComposeFunction = (...fns) => {
  return (arg) => fns.reduceRight((acc, fn) => fn(acc), arg);
};

console.log('\n=== 컴포즈 ===');
const transform2 = compose(square, double, increment);
console.log('compose(5):', transform2(5)); // ((5 + 1) * 2)^2 = 144

// 7. 커링 (Currying)
function curry<A, B, C>(
  fn: (a: A, b: B) => C
): (a: A) => (b: B) => C {
  return (a: A) => (b: B) => fn(a, b);
}

console.log('\n=== 커링 ===');
const add = (a: number, b: number) => a + b;
const curriedAdd = curry(add);

const add5 = curriedAdd(5);
console.log('add5(10):', add5(10));
console.log('add5(20):', add5(20));

// 8. 부분 적용 (Partial Application)
function partial<T extends any[], U extends any[], R>(
  fn: (...args: [...T, ...U]) => R,
  ...args1: T
): (...args2: U) => R {
  return (...args2: U) => fn(...args1, ...args2);
}

console.log('\n=== 부분 적용 ===');
const multiply = (a: number, b: number, c: number) => a * b * c;
const multiplyBy2 = partial(multiply, 2);

console.log('multiplyBy2(3, 4):', multiplyBy2(3, 4)); // 2 * 3 * 4 = 24

// 9. 재시도 로직
async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    backoff?: number;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delay = 1000, backoff = 2 } = options;

  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Retry ${i + 1}/${maxRetries} failed`);

      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(backoff, i);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError;
}

console.log('\n=== 재시도 로직 ===');
let attemptCount = 0;
retry(async () => {
  attemptCount++;
  if (attemptCount < 3) {
    throw new Error('Temporary error');
  }
  return 'Success!';
})
  .then((result) => console.log('Retry result:', result))
  .catch((err) => console.log('Failed:', err));

// 10. 타임아웃 래퍼
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Timeout after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

console.log('\n=== 타임아웃 래퍼 ===');
const slowOperation = new Promise<string>((resolve) => {
  setTimeout(() => resolve('Done'), 2000);
});

withTimeout(slowOperation, 1000)
  .then((result) => console.log('Result:', result))
  .catch((error) => console.log('Timeout:', error.message));

// 11. 배치 처리
async function batchProcess<T, U>(
  items: T[],
  processor: (item: T) => Promise<U>,
  batchSize: number = 5
): Promise<U[]> {
  const results: U[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    console.log(`Processed batch ${i / batchSize + 1}`);
  }

  return results;
}

console.log('\n=== 배치 처리 ===');
const numbers = Array.from({ length: 12 }, (_, i) => i + 1);
batchProcess(
  numbers,
  async (n) => {
    return n * 2;
  },
  5
).then((results) => console.log('Batch results:', results));

// 12. 이벤트 에미터 패턴
type EventHandler<T = any> = (data: T) => void;

class EventEmitter<Events extends Record<string, any>> {
  private events = new Map<keyof Events, Set<EventHandler<any>>>();

  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);
  }

  off<K extends keyof Events>(
    event: K,
    handler: EventHandler<Events[K]>
  ): void {
    this.events.get(event)?.delete(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.events.get(event)?.forEach((handler) => handler(data));
  }
}

console.log('\n=== 이벤트 에미터 ===');
interface MyEvents {
  userLogin: { userId: number; name: string };
  userLogout: { userId: number };
}

const emitter = new EventEmitter<MyEvents>();

emitter.on('userLogin', (data) => {
  console.log(`User ${data.name} logged in`);
});

emitter.emit('userLogin', { userId: 1, name: 'Alice' });

// 13. 유효성 검사 체이닝
type Validator<T> = (value: T) => boolean | string;

function createValidator<T>() {
  const validators: Validator<T>[] = [];

  return {
    addRule(validator: Validator<T>) {
      validators.push(validator);
      return this;
    },
    validate(value: T): { valid: boolean; errors: string[] } {
      const errors: string[] = [];

      for (const validator of validators) {
        const result = validator(value);
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : 'Validation failed');
        }
      }

      return { valid: errors.length === 0, errors };
    },
  };
}

console.log('\n=== 유효성 검사 체이닝 ===');
const passwordValidator = createValidator<string>()
  .addRule((v) => v.length >= 8 || 'Must be at least 8 characters')
  .addRule((v) => /[A-Z]/.test(v) || 'Must contain uppercase letter')
  .addRule((v) => /[0-9]/.test(v) || 'Must contain number');

console.log(passwordValidator.validate('weak'));
console.log(passwordValidator.validate('StrongPass123'));

// 14. 캐시 데코레이터 패턴
function cached<T extends (...args: any[]) => any>(
  target: any,
  propertyName: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  const originalMethod = descriptor.value!;
  const cache = new Map<string, ReturnType<T>>();

  descriptor.value = function (this: any, ...args: Parameters<T>) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('  (cached)');
      return cache.get(key)!;
    }

    const result = originalMethod.apply(this, args);
    cache.set(key, result);
    return result;
  } as T;

  return descriptor;
}

class Calculator {
  @cached
  fibonacci(n: number): number {
    console.log(`  Computing fibonacci(${n})`);
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}

console.log('\n=== 캐시 데코레이터 ===');
const calc = new Calculator();
console.log('Result:', calc.fibonacci(10));

// 15. 실전 종합 예제: 타입 안전 상태 관리
interface State {
  user: { id: number; name: string } | null;
  count: number;
}

type Action =
  | { type: 'LOGIN'; payload: { id: number; name: string } }
  | { type: 'LOGOUT' }
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' };

type Reducer<S, A> = (state: S, action: A) => S;
type Listener<S> = (state: S) => void;

class Store<S, A> {
  private state: S;
  private listeners = new Set<Listener<S>>();

  constructor(
    private reducer: Reducer<S, A>,
    initialState: S
  ) {
    this.state = initialState;
  }

  getState(): S {
    return this.state;
  }

  dispatch(action: A): void {
    this.state = this.reducer(this.state, action);
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Listener<S>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

console.log('\n=== 실전: 상태 관리 ===');
const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
};

const store = new Store(reducer, { user: null, count: 0 });

store.subscribe((state) => {
  console.log('State updated:', state);
});

store.dispatch({ type: 'LOGIN', payload: { id: 1, name: 'Alice' } });
store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'INCREMENT' });

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. API 클라이언트
 *    - 제네릭으로 타입 안전한 응답
 *    - 오버로드로 메서드별 타입 정의
 *      async get<T>(url: string): Promise<T>
 *
 * 2. 디바운스 (Debounce)
 *    - 연속 호출 시 마지막만 실행
 *    - Parameters<T>, ReturnType<T> 활용
 *      function debounce<T extends Function>(fn: T, delay: number)
 *
 * 3. 쓰로틀 (Throttle)
 *    - 일정 시간마다 한 번만 실행
 *    - 스크롤, 리사이즈 이벤트에 유용
 *
 * 4. 메모이제이션 (Memoization)
 *    - 함수 결과 캐싱
 *    - 비용이 큰 계산 최적화
 *      const memoized = memoize(expensiveFn);
 *
 * 5. 파이프 (Pipe)
 *    - 왼쪽에서 오른쪽으로 함수 조합
 *      pipe(fn1, fn2, fn3)(value)
 *
 * 6. 컴포즈 (Compose)
 *    - 오른쪽에서 왼쪽으로 함수 조합
 *      compose(fn3, fn2, fn1)(value)
 *
 * 7. 커링 (Currying)
 *    - 다중 매개변수를 단일 매개변수로 변환
 *      curry(add)(5)(10)
 *
 * 8. 부분 적용 (Partial Application)
 *    - 일부 매개변수를 미리 적용
 *      partial(multiply, 2)(3, 4)
 *
 * 9. 재시도 로직
 *    - 실패 시 자동 재시도
 *    - 지수 백오프 지원
 *      retry(asyncFn, { maxRetries: 3, backoff: 2 })
 *
 * 10. 타임아웃 래퍼
 *     - Promise에 타임아웃 추가
 *       withTimeout(promise, 5000)
 *
 * 11. 배치 처리
 *     - 대량 데이터를 배치로 처리
 *       batchProcess(items, processor, batchSize)
 *
 * 12. 이벤트 에미터
 *     - 타입 안전한 이벤트 시스템
 *       emitter.on('event', handler)
 *       emitter.emit('event', data)
 *
 * 13. 유효성 검사 체이닝
 *     - 여러 규칙을 체인으로 연결
 *       validator.addRule(...).addRule(...).validate()
 *
 * 14. 캐시 데코레이터
 *     - 메서드 결과 자동 캐싱
 *       @cached
 *       method() { }
 *
 * 15. 상태 관리
 *     - Redux 스타일 상태 관리
 *     - Reducer, Action, Store 패턴
 *
 * 16. 타입 유틸리티
 *     - Parameters<T>: 함수 매개변수 타입
 *     - ReturnType<T>: 함수 반환 타입
 *     - Awaited<T>: Promise 언래핑
 *
 * 17. Best Practices
 *     ✅ 제네릭으로 재사용성 확보
 *     ✅ 타입 안전성 유지
 *     ✅ 함수형 프로그래밍 패턴 활용
 *     ✅ 에러 처리 철저히
 *     ✅ 성능 최적화 고려
 *
 * 18. 실전 활용
 *     ✅ API 클라이언트
 *     ✅ 이벤트 처리 (debounce/throttle)
 *     ✅ 데이터 변환 (pipe/compose)
 *     ✅ 상태 관리
 *     ✅ 유효성 검사
 *
 * @see https://www.typescriptlang.org/docs/handbook/utility-types.html
 */
