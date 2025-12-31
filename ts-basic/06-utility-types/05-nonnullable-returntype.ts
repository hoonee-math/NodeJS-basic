/**
 * 05-nonnullable-returntype.ts
 * NonNullable, ReturnType, Parameters - null 제거와 함수 타입 추출
 *
 * 옵셔널 체이닝 후 null을 제거해야 하고, 함수의 반환 타입이나 매개변수 타입을 재사용해야 할 때가 있습니다.
 * NonNullable<T>는 T에서 null과 undefined를 제거하고, ReturnType<T>는 함수의 반환 타입을, Parameters<T>는 함수의 매개변수 타입을 튜플로 추출합니다.
 * 이 파일에서는 NonNullable<T>로 null/undefined 제거, ReturnType<T>로 함수 반환 타입 재사용, Parameters<T>로 매개변수 타입 추출, 고차 함수 타입 정의, async 함수 처리, 그리고 실무 API 함수 타입 추출 예제를 다룹니다.
 */

// ============================================================
// 1. NonNullable<T> 기본 - null, undefined 제거
// ============================================================
console.log('\n=== 1. NonNullable<T> 기본 ===');

type MaybeString = string | null | undefined;

// null과 undefined 제거 → string
type DefiniteString = NonNullable<MaybeString>;

const definite: DefiniteString = 'hello';
// const invalid: DefiniteString = null; // ❌ Error

console.log('Definite String:', definite);

// 배열 요소에서 null 제거
type MaybeNumbers = (number | null)[];
type Numbers = NonNullable<MaybeNumbers[number]>[]; // number[]

const numbers: Numbers = [1, 2, 3];
console.log('Numbers:', numbers);

// ============================================================
// 2. ReturnType<T> 기본 - 함수 반환 타입 추출
// ============================================================
console.log('\n=== 2. ReturnType<T> 기본 ===');

function getUser() {
  return {
    id: 'u1',
    name: 'Alice',
    email: 'alice@example.com',
  };
}

// getUser의 반환 타입 추출
type User = ReturnType<typeof getUser>;

const user: User = {
  id: 'u2',
  name: 'Bob',
  email: 'bob@example.com',
};

console.log('User:', user);

// 화살표 함수
const getProduct = () => ({
  id: 'p1',
  name: 'Laptop',
  price: 1500,
});

type Product = ReturnType<typeof getProduct>;

const product: Product = {
  id: 'p2',
  name: 'Mouse',
  price: 30,
};

console.log('Product:', product);

// ============================================================
// 3. Parameters<T> 기본 - 함수 매개변수 타입 추출
// ============================================================
console.log('\n=== 3. Parameters<T> 기본 ===');

function createUser(id: string, name: string, age: number) {
  return { id, name, age };
}

// 매개변수 타입을 튜플로 추출 → [string, string, number]
type CreateUserParams = Parameters<typeof createUser>;

const params: CreateUserParams = ['u1', 'Alice', 30];

// spread로 함수 호출
const newUser = createUser(...params);
console.log('New User:', newUser);

// ============================================================
// 4. 옵셔널 체이닝과 NonNullable
// ============================================================
console.log('\n=== 4. 옵셔널 체이닝과 NonNullable ===');

interface Config {
  database?: {
    host: string;
    port: number;
  };
}

const config: Config = {
  database: {
    host: 'localhost',
    port: 5432,
  },
};

// database는 undefined일 수 있음
type MaybeDatabase = Config['database']; // { host: string; port: number } | undefined

// undefined 제거
type Database = NonNullable<Config['database']>;

function connectToDatabase(db: Database) {
  console.log(`Connecting to ${db.host}:${db.port}`);
}

if (config.database) {
  // 타입 가드로 좁히기
  connectToDatabase(config.database);
}

// ============================================================
// 5. 함수 반환 타입 재사용
// ============================================================
console.log('\n=== 5. 함수 반환 타입 재사용 ===');

function fetchUserData() {
  return {
    user: {
      id: 'u1',
      name: 'Alice',
    },
    posts: [
      { id: 'p1', title: 'Hello' },
      { id: 'p2', title: 'World' },
    ],
  };
}

type UserData = ReturnType<typeof fetchUserData>;
type UserInfo = UserData['user'];
type Post = UserData['posts'][number];

const userData: UserData = fetchUserData();
const userInfo: UserInfo = userData.user;
const post: Post = userData.posts[0]!;

console.log('User Info:', userInfo);
console.log('Post:', post);

// ============================================================
// 6. 함수 매개변수 타입 재사용
// ============================================================
console.log('\n=== 6. 함수 매개변수 타입 재사용 ===');

function processOrder(
  orderId: string,
  items: Array<{ productId: string; quantity: number }>,
  options: { express: boolean; giftWrap: boolean }
) {
  console.log(`Processing order ${orderId}`);
  return { orderId, itemCount: items.length, options };
}

type ProcessOrderParams = Parameters<typeof processOrder>;

// 첫 번째 매개변수 타입
type OrderId = ProcessOrderParams[0]; // string

// 두 번째 매개변수 타입
type OrderItems = ProcessOrderParams[1]; // Array<{...}>

// 세 번째 매개변수 타입
type OrderOptions = ProcessOrderParams[2]; // { express: boolean; ... }

const orderId: OrderId = 'o1';
const items: OrderItems = [{ productId: 'p1', quantity: 2 }];
const options: OrderOptions = { express: true, giftWrap: false };

processOrder(orderId, items, options);

// ============================================================
// 7. 고차 함수 타입
// ============================================================
console.log('\n=== 7. 고차 함수 타입 ===');

function createLogger(prefix: string) {
  return (message: string) => {
    console.log(`[${prefix}] ${message}`);
  };
}

// createLogger의 반환 타입 (함수)
type Logger = ReturnType<typeof createLogger>;

// Logger 함수의 매개변수
type LoggerParams = Parameters<Logger>; // [string]

const logger: Logger = createLogger('INFO');
logger('Application started');

// ============================================================
// 8. async 함수와 ReturnType
// ============================================================
console.log('\n=== 8. async 함수와 ReturnType ===');

async function fetchUser(id: string) {
  // 실제로는 API 호출
  return {
    id,
    name: 'Alice',
    email: 'alice@example.com',
  };
}

// ReturnType은 Promise<{...}>를 반환
type FetchUserReturn = ReturnType<typeof fetchUser>; // Promise<{...}>

// Promise를 풀려면 Awaited 사용 (다음 파일에서 다룸)
type UnwrappedUser = Awaited<ReturnType<typeof fetchUser>>;

const unwrappedUser: UnwrappedUser = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
};

console.log('Unwrapped User:', unwrappedUser);

// ============================================================
// 9. 제네릭 함수와 함께 사용
// ============================================================
console.log('\n=== 9. 제네릭 함수와 함께 사용 ===');

function wrapInArray<T>(value: T): T[] {
  return [value];
}

// 제네릭 함수의 반환 타입은 T[]
type WrapReturn = ReturnType<typeof wrapInArray>; // unknown[] (구체적인 T 없음)

// 구체적인 타입으로 호출
const wrappedNumbers = wrapInArray(42); // number[]
const wrappedStrings = wrapInArray('hello'); // string[]

console.log('Wrapped Numbers:', wrappedNumbers);
console.log('Wrapped Strings:', wrappedStrings);

// ============================================================
// 10. 실무 예제: API 함수 타입 추출
// ============================================================
console.log('\n=== 10. 실무 예제: API 함수 타입 추출 ===');

async function loginUser(email: string, password: string) {
  // 실제로는 API 호출
  return {
    success: true as const,
    token: 'jwt-token',
    user: {
      id: 'u1',
      email,
    },
  };
}

async function getUserProfile(userId: string) {
  return {
    id: userId,
    name: 'Alice',
    bio: 'Developer',
    followers: 100,
  };
}

// API 응답 타입 추출
type LoginResponse = Awaited<ReturnType<typeof loginUser>>;
type UserProfile = Awaited<ReturnType<typeof getUserProfile>>;

// API 매개변수 타입 추출
type LoginParams = Parameters<typeof loginUser>; // [string, string]

const loginResponse: LoginResponse = {
  success: true,
  token: 'new-token',
  user: { id: 'u2', email: 'user@example.com' },
};

const profile: UserProfile = {
  id: 'u1',
  name: 'Bob',
  bio: 'Designer',
  followers: 50,
};

console.log('Login Response:', loginResponse);
console.log('User Profile:', profile);

// ============================================================
// 11. 타입 안전한 래퍼 함수
// ============================================================
console.log('\n=== 11. 타입 안전한 래퍼 함수 ===');

function measure<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  const start = Date.now();
  const result = fn(...args);
  const duration = Date.now() - start;
  console.log(`Function executed in ${duration}ms`);
  return result;
}

function add(a: number, b: number): number {
  return a + b;
}

const result = measure(add, 10, 20); // number
console.log('Result:', result);

// ============================================================
// 12. NonNullable with mapped types
// ============================================================
console.log('\n=== 12. NonNullable with mapped types ===');

interface UserWithOptionals {
  id: string;
  name: string | null;
  email: string | undefined;
  age: number | null | undefined;
}

// 모든 프로퍼티에서 null/undefined 제거
type RequiredUser = {
  [K in keyof UserWithOptionals]: NonNullable<UserWithOptionals[K]>;
};

const requiredUser: RequiredUser = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
};

console.log('Required User:', requiredUser);

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. NonNullable<T>
 *    - T에서 null과 undefined 제거
 *    - 용도: 옵셔널 체이닝 후 타입 좁히기
 *    - 구현: Exclude<T, null | undefined>
 *    - 예: NonNullable<string | null> → string
 *
 * 2. ReturnType<T>
 *    - 함수 T의 반환 타입 추출
 *    - 용도: 함수 반환 타입 재사용
 *    - 구현: T extends (...args: any) => infer R ? R : any
 *    - 예: ReturnType<() => string> → string
 *
 * 3. Parameters<T>
 *    - 함수 T의 매개변수 타입을 튜플로 추출
 *    - 용도: 함수 매개변수 타입 재사용, 래퍼 함수
 *    - 구현: T extends (...args: infer P) => any ? P : never
 *    - 예: Parameters<(a: string, b: number) => void> → [string, number]
 *
 * 4. async 함수
 *    - ReturnType은 Promise<T> 반환
 *    - Awaited<ReturnType<...>>로 Promise 풀기
 *
 * 5. 실무 패턴
 *    - API 응답 타입: Awaited<ReturnType<typeof apiFunc>>
 *    - 매개변수 타입: Parameters<typeof func>
 *    - 타입 안전한 래퍼: fn: T, ...args: Parameters<T>
 *
 * 6. 타입 추출 조합
 *    - type User = ReturnType<typeof getUser>
 *    - type UserId = User['id']
 *    - type Params = Parameters<typeof func>
 */

console.log(`
예제:
  type DefiniteString = NonNullable<string | null>;
  type User = ReturnType<typeof getUser>;
  type Params = Parameters<typeof createUser>;
  type ApiResponse = Awaited<ReturnType<typeof fetchData>>;
`);
