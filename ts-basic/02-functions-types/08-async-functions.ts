/**
 * 08-async-functions.ts
 * 비동기 함수의 타입 처리
 */

// 1. async 함수 기본
async function fetchUser(): Promise<string> {
  return 'User data';
}

console.log('=== async 함수 기본 ===');
fetchUser().then((data) => console.log(data));

// 2. async 함수는 항상 Promise 반환
async function getValue(): Promise<number> {
  // return 42; 와 동일하게 Promise.resolve(42) 반환
  return 42;
}

console.log('\n=== async 함수 반환 타입 ===');
getValue().then((value) => console.log('Value:', value));

// 3. await로 Promise 언래핑
async function processData(): Promise<string> {
  const data = await fetchUser(); // data는 string (Promise<string>이 아님)
  return data.toUpperCase();
}

console.log('\n=== await 언래핑 ===');
processData().then((result) => console.log('Processed:', result));

// 4. 여러 await
async function multipleAwaits(): Promise<void> {
  const user = await fetchUser();
  const value = await getValue();

  console.log(`User: ${user}, Value: ${value}`);
}

console.log('\n=== 여러 await ===');
multipleAwaits();

// 5. Promise.all로 병렬 처리
async function parallelFetch(): Promise<void> {
  const [user, value] = await Promise.all([fetchUser(), getValue()]);

  console.log(`Parallel - User: ${user}, Value: ${value}`);
}

console.log('\n=== Promise.all 병렬 처리 ===');
parallelFetch();

// 6. 에러 처리 - try/catch
async function fetchWithErrorHandling(): Promise<string | null> {
  try {
    const response = await fetch('https://api.example.com/data');
    return 'Success';
  } catch (error: unknown) {
    // catch의 error는 unknown 타입
    if (error instanceof Error) {
      console.log('Error:', error.message);
    }
    return null;
  }
}

console.log('\n=== 에러 처리 ===');
// fetchWithErrorHandling(); // fetch는 브라우저 환경에서만

// 7. 타입 가드로 에러 처리
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

async function safeOperation(): Promise<void> {
  try {
    throw new Error('Something went wrong');
  } catch (error: unknown) {
    if (isError(error)) {
      console.log('Safe error handling:', error.message);
    } else {
      console.log('Unknown error');
    }
  }
}

console.log('\n=== 타입 가드 에러 처리 ===');
safeOperation();

// 8. 제네릭 async 함수
async function fetchData<T>(url: string): Promise<T> {
  console.log(`Fetching ${url}...`);
  // 실제로는 fetch 사용
  return { data: 'mock data' } as T;
}

console.log('\n=== 제네릭 async 함수 ===');
interface User {
  id: number;
  name: string;
}

fetchData<User>('https://api.example.com/user/1').then((user) => {
  console.log('User:', user);
});

// 9. Promise 타입 유틸리티 - Awaited<T>
type PromiseType = Promise<string>;
type UnwrappedType = Awaited<PromiseType>; // string

async function getAwaited(): Promise<UnwrappedType> {
  return 'unwrapped';
}

console.log('\n=== Awaited<T> 유틸리티 ===');
getAwaited().then((value) => console.log('Awaited value:', value));

// 10. Promise.race
async function raceExample(): Promise<void> {
  const promise1 = new Promise<string>((resolve) =>
    setTimeout(() => resolve('First'), 100)
  );
  const promise2 = new Promise<string>((resolve) =>
    setTimeout(() => resolve('Second'), 200)
  );

  const winner = await Promise.race([promise1, promise2]);
  console.log('Race winner:', winner);
}

console.log('\n=== Promise.race ===');
raceExample();

// 11. Promise.allSettled
async function allSettledExample(): Promise<void> {
  const promise1 = Promise.resolve('Success 1');
  const promise2 = Promise.reject(new Error('Failure'));
  const promise3 = Promise.resolve('Success 2');

  const results = await Promise.allSettled([promise1, promise2, promise3]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(`${index}: Fulfilled -`, result.value);
    } else {
      console.log(`${index}: Rejected -`, result.reason.message);
    }
  });
}

console.log('\n=== Promise.allSettled ===');
allSettledExample();

// 12. async 함수와 void
async function logData(): Promise<void> {
  const data = await fetchUser();
  console.log('Data:', data);
  // return 없음 (void)
}

console.log('\n=== async void ===');
logData();

// 13. 타입 안전한 에러 클래스
class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithCustomError(): Promise<string> {
  try {
    throw new ApiError(404, 'Not Found');
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      console.log(`API Error ${error.statusCode}: ${error.message}`);
    }
    throw error;
  }
}

console.log('\n=== 커스텀 에러 클래스 ===');
fetchWithCustomError().catch(() => {});

// 14. async IIFE (즉시 실행)
console.log('\n=== async IIFE ===');
(async () => {
  const result = await getValue();
  console.log('IIFE result:', result);
})();

// 15. 조건부 async
function conditionalAsync(useAsync: boolean): Promise<number> | number {
  if (useAsync) {
    return Promise.resolve(42);
  }
  return 42;
}

async function handleConditional(): Promise<void> {
  const result1 = await conditionalAsync(true);
  const result2 = await conditionalAsync(false);

  console.log('Conditional results:', result1, result2);
}

console.log('\n=== 조건부 async ===');
handleConditional();

// 16. 타임아웃이 있는 Promise
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), timeoutMs)
  );

  return Promise.race([promise, timeoutPromise]);
}

console.log('\n=== 타임아웃 Promise ===');
withTimeout(delay(500), 1000)
  .then(() => console.log('Completed before timeout'))
  .catch((error) => console.log('Timeout error:', error.message));

// 17. 재시도 로직
async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Retry ${i + 1}/${maxRetries} failed`);
      await delay(100 * (i + 1)); // 지수 백오프
    }
  }

  throw lastError;
}

console.log('\n=== 재시도 로직 ===');
let attemptCount = 0;
retry(async () => {
  attemptCount++;
  if (attemptCount < 3) {
    throw new Error('Temporary failure');
  }
  return 'Success!';
})
  .then((result) => console.log('Retry result:', result))
  .catch((error) => console.log('Retry failed:', error.message));

// 18. async 함수 타입 별칭
type AsyncFunction<T> = () => Promise<T>;

const getData: AsyncFunction<string> = async () => {
  await delay(100);
  return 'Data';
};

console.log('\n=== async 함수 타입 ===');
getData().then((data) => console.log('Fetched:', data));

// 19. 체이닝 async 함수
async function step1(): Promise<number> {
  console.log('Step 1');
  return 1;
}

async function step2(value: number): Promise<number> {
  console.log('Step 2');
  return value + 1;
}

async function step3(value: number): Promise<string> {
  console.log('Step 3');
  return `Result: ${value}`;
}

async function pipeline(): Promise<void> {
  const result = await step1()
    .then(step2)
    .then(step3);

  console.log(result);
}

console.log('\n=== 체이닝 async ===');
pipeline();

// 20. 실전 예제: API 클라이언트
interface ApiResponse<T> {
  status: number;
  data: T;
}

class ApiClient {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    console.log(`GET ${url}`);

    try {
      await delay(100);
      return {
        status: 200,
        data: { id: 1, name: 'Sample' } as T,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new ApiError(500, error.message);
      }
      throw error;
    }
  }

  async post<T, D>(url: string, data: D): Promise<ApiResponse<T>> {
    console.log(`POST ${url}`, data);

    await delay(100);
    return {
      status: 201,
      data: data as unknown as T,
    };
  }
}

console.log('\n=== 실전: API 클라이언트 ===');
const api = new ApiClient();

interface Post {
  id: number;
  title: string;
}

api
  .get<Post>('/api/posts/1')
  .then((response) => console.log('GET response:', response));

api
  .post<Post, { title: string }>('/api/posts', { title: 'New Post' })
  .then((response) => console.log('POST response:', response));

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. async 함수 기본
 *    - async 키워드로 정의
 *    - 항상 Promise<T> 반환
 *      async function f(): Promise<T> { return value; }
 *
 * 2. 반환 타입
 *    - return 42 → Promise<number>
 *    - return 없음 → Promise<void>
 *    - async는 자동으로 Promise 래핑
 *
 * 3. await 키워드
 *    - Promise를 언래핑
 *      const data: T = await promise; // Promise<T> → T
 *
 *    - async 함수 내부에서만 사용
 *
 * 4. 에러 처리
 *    - try/catch 사용
 *    - catch의 error는 unknown 타입
 *      catch (error: unknown) {
 *        if (error instanceof Error) { ... }
 *      }
 *
 * 5. Promise 유틸리티
 *    - Promise.all([p1, p2]) → 모두 성공 시 결과
 *    - Promise.race([p1, p2]) → 가장 먼저 완료된 것
 *    - Promise.allSettled([...]) → 성공/실패 모두 반환
 *
 * 6. Awaited<T> 타입
 *    - Promise에서 타입 추출
 *      type T = Awaited<Promise<string>>; // string
 *
 * 7. 제네릭 async 함수
 *    async function fetch<T>(url: string): Promise<T> { }
 *
 * 8. 타입 안전한 에러
 *    - Error 클래스 확장
 *    - instanceof로 타입 체크
 *
 * 9. async IIFE
 *    (async () => {
 *      const result = await someAsync();
 *    })();
 *
 * 10. 유용한 패턴
 *     - 타임아웃: Promise.race([promise, timeout])
 *     - 재시도: for 루프 + try/catch
 *     - 병렬 처리: Promise.all()
 *     - 순차 처리: await를 순서대로
 *
 * 11. void vs Promise<void>
 *     - void: 동기 함수, 반환값 무시
 *     - Promise<void>: 비동기 함수, 완료 대기 가능
 *
 * 12. 실전 활용
 *     ✅ API 클라이언트
 *     ✅ 데이터베이스 쿼리
 *     ✅ 파일 I/O
 *     ✅ 타이머/지연
 *     ✅ 외부 서비스 호출
 *
 * 13. Best Practices
 *     ✅ 반환 타입 명시 (Promise<T>)
 *     ✅ 에러는 try/catch로 처리
 *     ✅ 병렬 가능하면 Promise.all 사용
 *     ✅ 타임아웃 설정 고려
 *     ✅ 재시도 로직 구현
 *     ✅ 에러 타입 좁히기 (instanceof)
 *
 * 14. 주의사항
 *     ❌ await 없이 Promise 반환하면 처리 안 됨
 *     ❌ 에러 처리 빠뜨리지 않기
 *     ❌ 불필요한 순차 처리 (병렬 가능하면 병렬로)
 *
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html#asyncawait
 */
