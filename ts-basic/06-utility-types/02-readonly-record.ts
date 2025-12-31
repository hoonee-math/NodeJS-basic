/**
 * 02-readonly-record.ts
 * Readonly, Record - 불변성과 키-값 맵
 *
 * 상태 객체는 변경을 막아야 하고, 설정 맵은 타입 안전하게 정의해야 합니다.
 * Readonly<T>는 모든 프로퍼티를 읽기 전용으로 만들고, Record<K, T>는 키 K에 값 T를 매핑하는 타입을 생성합니다.
 * 이 파일에서는 Readonly<T>의 기본 사용법, Record<K, T>로 타입 안전한 맵 생성, Readonly의 얕은 불변성 한계, DeepReadonly 커스텀 타입, Record로 enum 대체, 그리고 실무 설정 상수 패턴을 다룹니다.
 */

// ============================================================
// 1. Readonly<T> 기본 - 모든 프로퍼티를 읽기 전용으로
// ============================================================
console.log('\n=== 1. Readonly<T> 기본 ===');

interface Point {
  x: number;
  y: number;
}

type ReadonlyPoint = Readonly<Point>;

const point: ReadonlyPoint = { x: 10, y: 20 };

console.log('Point:', point);

// point.x = 30; // ❌ Error: Cannot assign to 'x' because it is a read-only property

// 함수 매개변수로 불변성 보장
function movePoint(point: Readonly<Point>, dx: number, dy: number): Point {
  // point를 변경하지 않고 새 객체 반환
  return { x: point.x + dx, y: point.y + dy };
}

const movedPoint = movePoint(point, 5, 10);
console.log('Moved Point:', movedPoint);

// ============================================================
// 2. Record<K, T> 기본 - 키-값 맵
// ============================================================
console.log('\n=== 2. Record<K, T> 기본 ===');

// string 키에 number 값
type StringToNumber = Record<string, number>;

const ages: StringToNumber = {
  alice: 30,
  bob: 25,
  charlie: 35,
};

console.log('Ages:', ages);

// 특정 문자열 리터럴을 키로
type Status = 'pending' | 'approved' | 'rejected';
type StatusColors = Record<Status, string>;

const statusColors: StatusColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};

console.log('Status Colors:', statusColors);

// ============================================================
// 3. Readonly의 얕은 불변성 문제
// ============================================================
console.log('\n=== 3. Readonly의 얕은 불변성 문제 ===');

interface User {
  id: string;
  name: string;
  address: {
    city: string;
    zipCode: string;
  };
}

const user: Readonly<User> = {
  id: 'u1',
  name: 'Alice',
  address: {
    city: 'Seoul',
    zipCode: '12345',
  },
};

// user.name = 'Bob'; // ❌ Error: read-only
user.address.city = 'Busan'; // ✅ OK! address 내부는 변경 가능

console.log('User after mutation:', user);
// Readonly는 얕은 불변성만 제공

// ============================================================
// 4. DeepReadonly 커스텀 타입
// ============================================================
console.log('\n=== 4. DeepReadonly 커스텀 타입 ===');

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

const deepReadonlyUser: DeepReadonly<User> = {
  id: 'u2',
  name: 'Bob',
  address: {
    city: 'Busan',
    zipCode: '54321',
  },
};

// deepReadonlyUser.name = 'Charlie'; // ❌ Error
// deepReadonlyUser.address.city = 'Seoul'; // ❌ Error (깊은 불변성)

console.log('Deep Readonly User:', deepReadonlyUser);

// ============================================================
// 5. Record로 enum 대체
// ============================================================
console.log('\n=== 5. Record로 enum 대체 ===');

// enum은 런타임 코드를 생성하고 번들 크기를 늘림
// Record + union literal로 대체 가능

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const httpMethodDescriptions: Record<HttpMethod, string> = {
  GET: 'Retrieve data',
  POST: 'Create new resource',
  PUT: 'Update existing resource',
  DELETE: 'Remove resource',
};

console.log('HTTP Methods:', httpMethodDescriptions);

// 모든 키를 정의하지 않으면 컴파일 에러
// const incomplete: Record<HttpMethod, string> = {
//   GET: 'Get',
// }; // ❌ Error: 'POST', 'PUT', 'DELETE' missing

// ============================================================
// 6. 타입 안전한 Dictionary 패턴
// ============================================================
console.log('\n=== 6. 타입 안전한 Dictionary 패턴 ===');

interface Product {
  id: string;
  name: string;
  price: number;
}

type ProductMap = Record<string, Product>;

const products: ProductMap = {
  p1: { id: 'p1', name: 'Laptop', price: 1000 },
  p2: { id: 'p2', name: 'Mouse', price: 30 },
};

function getProduct(id: string): Product | undefined {
  return products[id];
}

const product = getProduct('p1');
console.log('Product:', product);

// ============================================================
// 7. Record + Readonly 조합
// ============================================================
console.log('\n=== 7. Record + Readonly 조합 ===');

type ImmutableConfig = Readonly<Record<string, string>>;

const config: ImmutableConfig = {
  apiUrl: 'https://api.example.com',
  apiKey: 'secret-key',
};

console.log('Config:', config);

// config.apiUrl = 'https://new-api.com'; // ❌ Error: read-only
// config.newKey = 'value'; // ❌ Error: read-only

// ============================================================
// 8. 상수 객체 타입 정의
// ============================================================
console.log('\n=== 8. 상수 객체 타입 정의 ===');

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES]; // 'admin' | 'user' | 'guest'

type RolePermissions = Record<Role, string[]>;

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};

console.log('Permissions:', permissions);

// ============================================================
// 9. Record with union keys
// ============================================================
console.log('\n=== 9. Record with union keys ===');

type Environment = 'development' | 'staging' | 'production';

interface EnvConfig {
  apiUrl: string;
  debug: boolean;
}

const envConfigs: Record<Environment, EnvConfig> = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true,
  },
  staging: {
    apiUrl: 'https://staging.example.com',
    debug: true,
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
  },
};

function getEnvConfig(env: Environment): EnvConfig {
  return envConfigs[env];
}

const devConfig = getEnvConfig('development');
console.log('Dev Config:', devConfig);

// ============================================================
// 10. 실무 예제: 설정 상수
// ============================================================
console.log('\n=== 10. 실무 예제: 설정 상수 ===');

type ErrorCode = 'NOT_FOUND' | 'UNAUTHORIZED' | 'FORBIDDEN' | 'INTERNAL_ERROR';

interface ErrorInfo {
  statusCode: number;
  message: string;
}

const ERROR_CONFIGS: Readonly<Record<ErrorCode, ErrorInfo>> = {
  NOT_FOUND: {
    statusCode: 404,
    message: 'Resource not found',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    message: 'Authentication required',
  },
  FORBIDDEN: {
    statusCode: 403,
    message: 'Access denied',
  },
  INTERNAL_ERROR: {
    statusCode: 500,
    message: 'Internal server error',
  },
};

function getErrorInfo(code: ErrorCode): ErrorInfo {
  return ERROR_CONFIGS[code];
}

const notFoundError = getErrorInfo('NOT_FOUND');
console.log('Error Info:', notFoundError);

// ERROR_CONFIGS.NOT_FOUND.statusCode = 400; // ✅ OK (얕은 불변성)
// ERROR_CONFIGS.NOT_FOUND = { ... }; // ❌ Error (최상위는 읽기 전용)

// ============================================================
// 11. Record 타입 가드
// ============================================================
console.log('\n=== 11. Record 타입 가드 ===');

type DataRecord = Record<string, unknown>;

function isValidUser(data: DataRecord): data is { id: string; name: string } {
  return typeof data.id === 'string' && typeof data.name === 'string';
}

const userData: DataRecord = {
  id: 'u1',
  name: 'Alice',
  extra: 'ignored',
};

if (isValidUser(userData)) {
  console.log(`Valid user: ${userData.id} - ${userData.name}`);
}

// ============================================================
// 12. Record<never, T>와 빈 객체
// ============================================================
console.log('\n=== 12. Record<never, T>와 빈 객체 ===');

// never를 키로 사용하면 빈 객체 타입
type EmptyObject = Record<never, unknown>;

const empty: EmptyObject = {};
// const notEmpty: EmptyObject = { key: 'value' }; // ❌ Error

console.log('Empty Object:', empty);

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Readonly<T>
 *    - 모든 프로퍼티를 읽기 전용으로 만듦
 *    - 용도: 불변 상태, 함수 매개변수 보호
 *    - 구현: { readonly [P in keyof T]: T[P] }
 *    - 한계: 얕은 불변성 (중첩 객체는 변경 가능)
 *
 * 2. Record<K, T>
 *    - K 타입의 키에 T 타입의 값을 매핑
 *    - 용도: Dictionary, 설정 맵, enum 대체
 *    - 구현: { [P in K]: T }
 *
 * 3. DeepReadonly
 *    - Readonly의 한계 극복 (재귀적 불변성)
 *    - type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }
 *
 * 4. Record + union literal
 *    - enum 대체로 번들 크기 감소
 *    - 모든 키를 정의하지 않으면 컴파일 에러
 *
 * 5. Record + Readonly
 *    - 불변 설정 객체
 *    - Readonly<Record<K, T>>
 *
 * 6. Record<string, unknown>
 *    - 타입 안전한 Dictionary
 *    - 타입 가드와 함께 사용
 */

console.log(`
예제:
  type ReadonlyState = Readonly<State>;
  type StatusMap = Record<Status, string>;
  type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
  const config: Readonly<Record<string, string>> = { ... };
`);
