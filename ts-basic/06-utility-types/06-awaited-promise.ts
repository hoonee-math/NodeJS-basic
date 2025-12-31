/**
 * 06-awaited-promise.ts
 * Awaited - Promise 타입 풀기
 *
 * async 함수는 항상 Promise를 반환하고, 중첩된 Promise를 다룰 때도 있습니다.
 * Awaited<T>는 Promise<T>를 풀어서 T를 추출하며, 중첩된 Promise도 재귀적으로 풀어냅니다.
 * 이 파일에서는 Awaited<T>로 Promise 내부 타입 추출, 중첩 Promise 처리, async 함수 반환 타입, Promise.all/race/allSettled 타입, ReturnType + Awaited 조합, 그리고 실무 API 클라이언트 타입 예제를 다룹니다.
 */

// ============================================================
// 1. Awaited<T> 기본 - Promise 풀기
// ============================================================
console.log('\n=== 1. Awaited<T> 기본 ===');

type PromiseString = Promise<string>;

// Promise<string>을 풀어서 string 추출
type UnwrappedString = Awaited<PromiseString>; // string

const str: UnwrappedString = 'hello';
console.log('Unwrapped String:', str);

// async 함수 반환 타입
async function fetchData(): Promise<number> {
  return 42;
}

type FetchDataResult = Awaited<ReturnType<typeof fetchData>>; // number

const result: FetchDataResult = 42;
console.log('Fetch Data Result:', result);

// ============================================================
// 2. 중첩 Promise 처리
// ============================================================
console.log('\n=== 2. 중첩 Promise 처리 ===');

type NestedPromise = Promise<Promise<Promise<string>>>;

// 재귀적으로 모든 Promise 풀기
type Unwrapped = Awaited<NestedPromise>; // string

const unwrapped: Unwrapped = 'deeply nested';
console.log('Deeply Unwrapped:', unwrapped);

// 실제 예제
async function getNestedData(): Promise<Promise<number>> {
  return Promise.resolve(100);
}

type NestedResult = Awaited<ReturnType<typeof getNestedData>>; // number

const nestedResult: NestedResult = 100;
console.log('Nested Result:', nestedResult);

// ============================================================
// 3. async 함수 반환 타입
// ============================================================
console.log('\n=== 3. async 함수 반환 타입 ===');

async function fetchUser(id: string) {
  return {
    id,
    name: 'Alice',
    email: 'alice@example.com',
  };
}

// ReturnType은 Promise<{...}>를 반환
type FetchUserPromise = ReturnType<typeof fetchUser>;

// Awaited로 Promise 풀기
type User = Awaited<FetchUserPromise>;

const user: User = {
  id: 'u1',
  name: 'Bob',
  email: 'bob@example.com',
};

console.log('User:', user);

// 한 줄로 작성
type UserDirect = Awaited<ReturnType<typeof fetchUser>>;

// ============================================================
// 4. Promise.all 타입
// ============================================================
console.log('\n=== 4. Promise.all 타입 ===');

async function fetchUserData() {
  return { id: 'u1', name: 'Alice' };
}

async function fetchUserPosts() {
  return [
    { id: 'p1', title: 'Post 1' },
    { id: 'p2', title: 'Post 2' },
  ];
}

async function loadUserPage() {
  const [userData, userPosts] = await Promise.all([
    fetchUserData(),
    fetchUserPosts(),
  ]);

  return { userData, userPosts };
}

// Promise.all의 반환 타입
type UserPageData = Awaited<ReturnType<typeof loadUserPage>>;

const pageData: UserPageData = {
  userData: { id: 'u1', name: 'Alice' },
  userPosts: [{ id: 'p1', title: 'Post 1' }],
};

console.log('User Page Data:', pageData);

// ============================================================
// 5. Promise.race 타입
// ============================================================
console.log('\n=== 5. Promise.race 타입 ===');

async function fetchFromCache(): Promise<string> {
  return 'cached data';
}

async function fetchFromApi(): Promise<string> {
  return 'api data';
}

async function fetchFastest() {
  return Promise.race([fetchFromCache(), fetchFromApi()]);
}

// race는 첫 번째로 완료된 Promise의 타입
type FastestData = Awaited<ReturnType<typeof fetchFastest>>; // string

const fastestData: FastestData = 'data';
console.log('Fastest Data:', fastestData);

// ============================================================
// 6. Promise.allSettled 타입
// ============================================================
console.log('\n=== 6. Promise.allSettled 타입 ===');

async function task1(): Promise<number> {
  return 1;
}

async function task2(): Promise<string> {
  return 'two';
}

async function task3(): Promise<boolean> {
  throw new Error('Failed');
}

async function runAllTasks() {
  return Promise.allSettled([task1(), task2(), task3()]);
}

// allSettled는 { status, value/reason } 배열
type AllTasksResult = Awaited<ReturnType<typeof runAllTasks>>;

// AllTasksResult = Array<
//   | { status: 'fulfilled'; value: number }
//   | { status: 'fulfilled'; value: string }
//   | { status: 'fulfilled'; value: boolean }
//   | { status: 'rejected'; reason: any }
// >

console.log('allSettled returns array of settled results');

// ============================================================
// 7. 제네릭 async 함수
// ============================================================
console.log('\n=== 7. 제네릭 async 함수 ===');

async function fetchById<T>(id: string): Promise<T> {
  // 실제로는 API 호출
  return { id } as T;
}

// 구체적인 타입으로 호출
type Product = { id: string; name: string; price: number };
const fetchProduct = () => fetchById<Product>('p1');

type FetchedProduct = Awaited<ReturnType<typeof fetchProduct>>;

const product: FetchedProduct = {
  id: 'p1',
  name: 'Laptop',
  price: 1500,
};

console.log('Fetched Product:', product);

// ============================================================
// 8. 비동기 유틸리티 함수
// ============================================================
console.log('\n=== 8. 비동기 유틸리티 함수 ===');

async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
  }
  throw new Error('Max retries exceeded');
}

async function fetchWithRetry() {
  return retry(() => fetchUser('u1'), 3);
}

type RetriedUser = Awaited<ReturnType<typeof fetchWithRetry>>;

console.log('Retry utility preserves return type');

// ============================================================
// 9. ReturnType + Awaited 조합
// ============================================================
console.log('\n=== 9. ReturnType + Awaited 조합 ===');

const apiEndpoints = {
  async getUser(id: string) {
    return { id, name: 'Alice', email: 'alice@example.com' };
  },
  async getProducts() {
    return [
      { id: 'p1', name: 'Product 1' },
      { id: 'p2', name: 'Product 2' },
    ];
  },
  async createOrder(userId: string, productIds: string[]) {
    return { orderId: 'o1', userId, productIds, status: 'pending' as const };
  },
};

// API 응답 타입 추출
type UserResponse = Awaited<ReturnType<typeof apiEndpoints.getUser>>;
type ProductsResponse = Awaited<ReturnType<typeof apiEndpoints.getProducts>>;
type OrderResponse = Awaited<ReturnType<typeof apiEndpoints.createOrder>>;

const userRes: UserResponse = { id: 'u1', name: 'Bob', email: 'bob@example.com' };
const productsRes: ProductsResponse = [{ id: 'p1', name: 'Product 1' }];
const orderRes: OrderResponse = {
  orderId: 'o1',
  userId: 'u1',
  productIds: ['p1'],
  status: 'pending',
};

console.log('API Responses:', { userRes, productsRes, orderRes });

// ============================================================
// 10. 실무 예제: API 클라이언트
// ============================================================
console.log('\n=== 10. 실무 예제: API 클라이언트 ===');

class ApiClient {
  async login(email: string, password: string) {
    return {
      success: true as const,
      token: 'jwt-token',
      user: { id: 'u1', email },
    };
  }

  async getUserProfile(userId: string) {
    return {
      id: userId,
      name: 'Alice',
      bio: 'Developer',
      followers: 100,
    };
  }

  async updateProfile(userId: string, data: { name?: string; bio?: string }) {
    return {
      success: true as const,
      updatedFields: Object.keys(data),
    };
  }
}

const client = new ApiClient();

// API 응답 타입 자동 추론
type LoginResponse = Awaited<ReturnType<typeof client.login>>;
type ProfileResponse = Awaited<ReturnType<typeof client.getUserProfile>>;
type UpdateResponse = Awaited<ReturnType<typeof client.updateProfile>>;

const loginRes: LoginResponse = {
  success: true,
  token: 'new-token',
  user: { id: 'u2', email: 'user@example.com' },
};

console.log('Login Response:', loginRes);

// ============================================================
// 11. 에러 처리 타입
// ============================================================
console.log('\n=== 11. 에러 처리 타입 ===');

type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safefetch<T>(url: string): Promise<Result<T>> {
  try {
    // 실제로는 fetch 호출
    const data = { id: '1', value: 'data' } as T;
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

type SafeFetchUser = Awaited<ReturnType<typeof safeFunc>>;

async function safeFunc() {
  return safefetch<User>('https://api.example.com/user');
}

console.log('Safe fetch with Result type');

// ============================================================
// 12. thenable 타입
// ============================================================
console.log('\n=== 12. thenable 타입 ===');

interface CustomThenable<T> {
  then<R>(
    onfulfilled: (value: T) => R,
    onrejected?: (reason: any) => R
  ): CustomThenable<R>;
}

// Awaited는 thenable 객체도 처리
type CustomThenableString = CustomThenable<string>;
type UnwrappedThenable = Awaited<CustomThenableString>; // string

console.log('Awaited works with thenable objects');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Awaited<T>
 *    - Promise<T>를 풀어서 T 추출
 *    - 용도: async 함수 반환 타입, Promise 체인
 *    - 구현: 재귀적으로 Promise 풀기
 *    - 예: Awaited<Promise<string>> → string
 *
 * 2. 중첩 Promise
 *    - Promise<Promise<T>>도 재귀적으로 풀기
 *    - Awaited<Promise<Promise<string>>> → string
 *
 * 3. async 함수
 *    - ReturnType은 Promise<T> 반환
 *    - Awaited<ReturnType<...>>로 T 추출
 *
 * 4. Promise 유틸리티
 *    - Promise.all: 튜플 타입 유지
 *    - Promise.race: 유니온 타입
 *    - Promise.allSettled: { status, value/reason }[]
 *
 * 5. 실무 패턴
 *    - API 응답 타입: Awaited<ReturnType<typeof api.method>>
 *    - 제네릭 async: async function<T>(): Promise<T>
 *    - 에러 처리: Result<T, E> 패턴
 *
 * 6. thenable
 *    - Awaited는 Promise뿐 아니라 thenable 객체도 처리
 *    - then 메서드가 있는 모든 객체
 */

console.log(`
예제:
  type User = Awaited<Promise<{ id: string; name: string }>>;
  type ApiResponse = Awaited<ReturnType<typeof fetchUser>>;
  type AllResults = Awaited<ReturnType<typeof Promise.all>>;
  type RaceResult = Awaited<ReturnType<typeof Promise.race>>;
`);
