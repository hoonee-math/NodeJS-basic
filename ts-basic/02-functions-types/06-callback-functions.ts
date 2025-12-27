/**
 * 06-callback-functions.ts
 * 콜백 함수의 타입 정의
 */

// 1. 콜백 함수 기본
type Callback = (message: string) => void;

function greet(name: string, callback: Callback): void {
  const message = `Hello, ${name}!`;
  callback(message);
}

console.log('=== 콜백 함수 기본 ===');
greet('Alice', (msg) => console.log(msg));
greet('Bob', (msg) => console.log(`Message: ${msg}`));

// 2. 에러 우선 콜백 (Error-First Callback)
type ErrorFirstCallback<T> = (error: Error | null, result?: T) => void;

function readFile(filename: string, callback: ErrorFirstCallback<string>): void {
  console.log(`Reading ${filename}...`);

  // 에러 시뮬레이션
  if (filename === 'error.txt') {
    callback(new Error('File not found'));
    return;
  }

  // 성공 시뮬레이션
  setTimeout(() => {
    callback(null, `Content of ${filename}`);
  }, 100);
}

console.log('\n=== 에러 우선 콜백 ===');
readFile('test.txt', (error, result) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Success:', result);
  }
});

readFile('error.txt', (error, result) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Success:', result);
  }
});

// 3. 배열 메서드 콜백
const numbers = [1, 2, 3, 4, 5];

// map 콜백: (value, index, array) => newValue
const doubled = numbers.map((value, index) => {
  console.log(`map: index ${index}, value ${value}`);
  return value * 2;
});

console.log('\n=== 배열 메서드 콜백 ===');
console.log('Doubled:', doubled);

// filter 콜백: (value, index, array) => boolean
const evens = numbers.filter((value) => value % 2 === 0);
console.log('Evens:', evens);

// reduce 콜백: (accumulator, value, index, array) => accumulator
const sum = numbers.reduce((acc, value) => acc + value, 0);
console.log('Sum:', sum);

// 4. 커스텀 배열 메서드 콜백 타입
type MapCallback<T, U> = (value: T, index: number, array: T[]) => U;
type FilterCallback<T> = (value: T, index: number, array: T[]) => boolean;

function customMap<T, U>(array: T[], callback: MapCallback<T, U>): U[] {
  const result: U[] = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

console.log('\n=== 커스텀 배열 메서드 ===');
const squared = customMap([1, 2, 3, 4, 5], (n) => n * n);
console.log('Squared:', squared);

// 5. 비동기 콜백
type AsyncCallback<T> = (error: Error | null, data?: T) => void;

function fetchData<T>(url: string, callback: AsyncCallback<T>): void {
  console.log(`Fetching ${url}...`);

  setTimeout(() => {
    if (url.includes('error')) {
      callback(new Error('Network error'));
    } else {
      callback(null, { url, data: 'Sample data' } as T);
    }
  }, 500);
}

console.log('\n=== 비동기 콜백 ===');
fetchData('https://api.example.com/users', (error, data) => {
  if (error) {
    console.log('Fetch error:', error.message);
  } else {
    console.log('Fetch success:', data);
  }
});

// 6. 이벤트 핸들러 콜백
type EventHandler<T = Event> = (event: T) => void;

interface MouseEvent {
  clientX: number;
  clientY: number;
  button: number;
}

interface KeyboardEvent {
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
}

const handleClick: EventHandler<MouseEvent> = (event) => {
  console.log(`Clicked at (${event.clientX}, ${event.clientY})`);
};

const handleKeyPress: EventHandler<KeyboardEvent> = (event) => {
  console.log(`Key pressed: ${event.key}`);
};

console.log('\n=== 이벤트 핸들러 ===');
handleClick({ clientX: 100, clientY: 200, button: 0 });
handleKeyPress({ key: 'Enter', ctrlKey: false, shiftKey: false });

// 7. 옵셔널 콜백
function processData(data: string, callback?: (result: string) => void): void {
  const result = data.toUpperCase();
  console.log('Processed:', result);

  // 콜백이 있으면 호출
  if (callback) {
    callback(result);
  }
}

console.log('\n=== 옵셔널 콜백 ===');
processData('hello');
processData('world', (result) => console.log('Callback received:', result));

// 8. 콜백 체이닝
type ChainCallback<T> = (value: T, next: (newValue: T) => void) => void;

function chain<T>(
  initialValue: T,
  ...callbacks: ChainCallback<T>[]
): void {
  let currentValue = initialValue;
  let index = 0;

  const next = (newValue: T) => {
    currentValue = newValue;
    index++;
    if (index < callbacks.length) {
      callbacks[index](currentValue, next);
    }
  };

  if (callbacks.length > 0) {
    callbacks[0](currentValue, next);
  }
}

console.log('\n=== 콜백 체이닝 ===');
chain(
  5,
  (value, next) => {
    console.log(`Step 1: ${value}`);
    next(value + 1);
  },
  (value, next) => {
    console.log(`Step 2: ${value}`);
    next(value * 2);
  },
  (value, next) => {
    console.log(`Step 3: ${value}`);
  }
);

// 9. 타이머 콜백
type TimerCallback = () => void;

function delay(ms: number, callback: TimerCallback): void {
  setTimeout(callback, ms);
}

console.log('\n=== 타이머 콜백 ===');
console.log('Starting timer...');
delay(1000, () => console.log('Timer completed!'));

// 10. 여러 콜백 패턴
interface CallbackOptions<T> {
  onSuccess: (data: T) => void;
  onError: (error: Error) => void;
  onComplete?: () => void;
}

function execute<T>(
  operation: () => T,
  options: CallbackOptions<T>
): void {
  try {
    const result = operation();
    options.onSuccess(result);
  } catch (error) {
    options.onError(error as Error);
  } finally {
    options.onComplete?.();
  }
}

console.log('\n=== 여러 콜백 패턴 ===');
execute(
  () => 42,
  {
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.log('Error:', error.message),
    onComplete: () => console.log('Complete!'),
  }
);

// 11. forEach 스타일 콜백
type ForEachCallback<T> = (item: T, index: number) => void;

function forEach<T>(array: T[], callback: ForEachCallback<T>): void {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i);
  }
}

console.log('\n=== forEach 콜백 ===');
forEach(['a', 'b', 'c'], (item, index) => {
  console.log(`${index}: ${item}`);
});

// 12. 비교 함수 콜백
type Comparator<T> = (a: T, b: T) => number;

function customSort<T>(array: T[], compare: Comparator<T>): T[] {
  return array.slice().sort(compare);
}

console.log('\n=== 비교 함수 콜백 ===');
const nums = [5, 2, 8, 1, 9];
const ascending = customSort(nums, (a, b) => a - b);
const descending = customSort(nums, (a, b) => b - a);

console.log('Ascending:', ascending);
console.log('Descending:', descending);

// 13. 미들웨어 패턴
type Middleware<T> = (value: T, next: () => void) => void;

function runMiddleware<T>(
  value: T,
  middlewares: Middleware<T>[]
): void {
  let index = 0;

  const next = () => {
    if (index < middlewares.length) {
      const middleware = middlewares[index++];
      middleware(value, next);
    }
  };

  next();
}

console.log('\n=== 미들웨어 패턴 ===');
runMiddleware('request', [
  (value, next) => {
    console.log('Middleware 1:', value);
    next();
  },
  (value, next) => {
    console.log('Middleware 2:', value);
    next();
  },
  (value, next) => {
    console.log('Middleware 3:', value);
  },
]);

// 14. 구독자 패턴
type Subscriber<T> = (data: T) => void;

class EventEmitter<T> {
  private subscribers: Subscriber<T>[] = [];

  subscribe(callback: Subscriber<T>): () => void {
    this.subscribers.push(callback);

    // 구독 해제 함수 반환
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  emit(data: T): void {
    this.subscribers.forEach((callback) => callback(data));
  }
}

console.log('\n=== 구독자 패턴 ===');
const emitter = new EventEmitter<string>();

const unsubscribe1 = emitter.subscribe((data) => console.log('Subscriber 1:', data));
const unsubscribe2 = emitter.subscribe((data) => console.log('Subscriber 2:', data));

emitter.emit('Hello');
unsubscribe1();
emitter.emit('World');

// 15. 실전 예제: Promise를 콜백으로 변환
function promiseToCallback<T>(
  promise: Promise<T>,
  callback: ErrorFirstCallback<T>
): void {
  promise
    .then((result) => callback(null, result))
    .catch((error) => callback(error));
}

console.log('\n=== 실전: Promise → Callback ===');
const promise = Promise.resolve('Async result');
promiseToCallback(promise, (error, result) => {
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Result:', result);
  }
});

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 콜백 함수 기본 타입
 *    type Callback = (param: Type) => void;
 *
 * 2. 에러 우선 콜백 (Node.js 스타일)
 *    type ErrorFirstCallback<T> = (
 *      error: Error | null,
 *      result?: T
 *    ) => void;
 *
 * 3. 배열 메서드 콜백
 *    - map: (value: T, index: number, array: T[]) => U
 *    - filter: (value: T, index: number, array: T[]) => boolean
 *    - reduce: (acc: U, value: T, index: number, array: T[]) => U
 *
 * 4. 이벤트 핸들러 콜백
 *    type EventHandler<T = Event> = (event: T) => void;
 *
 * 5. 옵셔널 콜백
 *    function f(callback?: (result: T) => void) {
 *      callback?.(result);
 *    }
 *
 * 6. 비동기 콜백
 *    - setTimeout, setInterval
 *    - 네트워크 요청
 *    - 파일 I/O
 *
 * 7. 콜백 체이닝
 *    - 콜백 안에서 다음 콜백 호출
 *    - next 함수 패턴
 *
 * 8. 여러 콜백 옵션
 *    interface Options {
 *      onSuccess: (data: T) => void;
 *      onError: (error: Error) => void;
 *      onComplete?: () => void;
 *    }
 *
 * 9. 비교 함수
 *    type Comparator<T> = (a: T, b: T) => number;
 *
 * 10. 미들웨어 패턴
 *     type Middleware<T> = (value: T, next: () => void) => void;
 *
 * 11. 구독자 패턴
 *     type Subscriber<T> = (data: T) => void;
 *
 * 12. 콜백 헬 (Callback Hell)
 *     - 중첩된 콜백은 가독성 저하
 *     - Promise, async/await로 개선
 *
 * 13. 실전 활용
 *     ✅ 이벤트 리스너
 *     ✅ 배열 메서드
 *     ✅ 타이머 함수
 *     ✅ 미들웨어
 *     ✅ 구독/발행 패턴
 *
 * 14. Best Practices
 *     ✅ 에러 처리 명확히
 *     ✅ 콜백 타입 명시
 *     ✅ 옵셔널 콜백 고려
 *     ✅ 제네릭으로 유연성 확보
 *     ✅ 콜백 헬 피하기 (Promise 사용)
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/functions.html
 */
