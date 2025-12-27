/**
 * 05-interface-basics.ts
 * 인터페이스로 객체 구조 정의
 */

// 1. 인터페이스 기본
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
};

console.log('=== 인터페이스 기본 ===');
console.log('User:', user);

// 2. 선택적 프로퍼티 (Optional Properties)
interface Product {
  name: string;
  price: number;
  description?: string; // 선택적
  category?: string; // 선택적
}

const product1: Product = {
  name: 'Laptop',
  price: 1200,
};

const product2: Product = {
  name: 'Mouse',
  price: 25,
  description: 'Wireless mouse',
  category: 'Electronics',
};

console.log('\n=== 선택적 프로퍼티 ===');
console.log('Product 1:', product1);
console.log('Product 2:', product2);

// 3. readonly 프로퍼티
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
  retries?: number;
}

const config: Config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
};

console.log('\n=== readonly 프로퍼티 ===');
console.log('Config:', config);
// config.apiUrl = 'new url'; // ❌ 에러: readonly

// 4. 메서드 시그니처
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calculator: Calculator = {
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
};

console.log('\n=== 메서드 시그니처 ===');
console.log(`10 + 5 = ${calculator.add(10, 5)}`);
console.log(`10 - 5 = ${calculator.subtract(10, 5)}`);

// 5. 인덱스 시그니처 (Index Signature)
interface StringDictionary {
  [key: string]: string;
}

const dictionary: StringDictionary = {
  hello: '안녕하세요',
  goodbye: '안녕히 가세요',
  thanks: '감사합니다',
};

console.log('\n=== 인덱스 시그니처 ===');
console.log(dictionary['hello']);
console.log(dictionary['thanks']);

// 6. 숫자 인덱스
interface NumberArray {
  [index: number]: string;
}

const fruits: NumberArray = ['Apple', 'Banana', 'Cherry'];

console.log('\n=== 숫자 인덱스 ===');
console.log(fruits[0]);
console.log(fruits[1]);

// 7. 함수 타입 인터페이스
interface MathOperation {
  (a: number, b: number): number;
}

const multiply: MathOperation = (a, b) => a * b;
const divide: MathOperation = (a, b) => a / b;

console.log('\n=== 함수 타입 인터페이스 ===');
console.log(`10 * 5 = ${multiply(10, 5)}`);
console.log(`10 / 5 = ${divide(10, 5)}`);

// 8. 하이브리드 타입 (함수 + 프로퍼티)
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function createCounter(): Counter {
  const counter = function (start: number) {
    return `Count: ${start}`;
  } as Counter;

  counter.interval = 1;
  counter.reset = function () {
    console.log('Counter reset');
  };

  return counter;
}

console.log('\n=== 하이브리드 타입 ===');
const counter = createCounter();
console.log(counter(10));
console.log(`Interval: ${counter.interval}`);
counter.reset();

// 9. 제네릭 인터페이스
interface Box<T> {
  value: T;
  getValue(): T;
}

const numberBox: Box<number> = {
  value: 42,
  getValue() {
    return this.value;
  },
};

const stringBox: Box<string> = {
  value: 'Hello',
  getValue() {
    return this.value;
  },
};

console.log('\n=== 제네릭 인터페이스 ===');
console.log('Number box:', numberBox.getValue());
console.log('String box:', stringBox.getValue());

// 10. 중첩된 인터페이스
interface Address {
  street: string;
  city: string;
  country: string;
}

interface Person {
  name: string;
  age: number;
  address: Address;
}

const person: Person = {
  name: 'Bob',
  age: 25,
  address: {
    street: '123 Main St',
    city: 'Seoul',
    country: 'Korea',
  },
};

console.log('\n=== 중첩된 인터페이스 ===');
console.log('Person:', person);
console.log(`Lives in ${person.address.city}`);

// 11. 읽기 전용 배열
interface ReadonlyStringArray {
  readonly [index: number]: string;
  readonly length: number;
}

const colors: ReadonlyStringArray = ['Red', 'Green', 'Blue'];

console.log('\n=== 읽기 전용 배열 ===');
console.log('Colors:', colors);
// colors[0] = 'Yellow'; // ❌ 에러: readonly

// 12. 인터페이스와 타입 별칭 비교
// 인터페이스
interface Point2D {
  x: number;
  y: number;
}

// 타입 별칭
type Point3D = {
  x: number;
  y: number;
  z: number;
};

const point2d: Point2D = { x: 10, y: 20 };
const point3d: Point3D = { x: 10, y: 20, z: 30 };

console.log('\n=== 인터페이스 vs 타입 ===');
console.log('2D Point:', point2d);
console.log('3D Point:', point3d);

// 13. 선택적 메서드
interface Logger {
  log(message: string): void;
  warn?(message: string): void; // 선택적
  error?(message: string): void; // 선택적
}

const simpleLogger: Logger = {
  log(message) {
    console.log(`[LOG] ${message}`);
  },
};

const fullLogger: Logger = {
  log(message) {
    console.log(`[LOG] ${message}`);
  },
  warn(message) {
    console.log(`[WARN] ${message}`);
  },
  error(message) {
    console.log(`[ERROR] ${message}`);
  },
};

console.log('\n=== 선택적 메서드 ===');
simpleLogger.log('Simple logger');
fullLogger.log('Full logger');
fullLogger.warn?.('Warning message');

// 14. 함수 매개변수로 인터페이스
interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

function handleResponse<T>(response: ApiResponse<T>): void {
  console.log(`Status: ${response.status}`);
  console.log('Data:', response.data);
  if (response.message) {
    console.log(`Message: ${response.message}`);
  }
}

console.log('\n=== 함수 매개변수로 인터페이스 ===');
handleResponse({ status: 200, data: { id: 1, name: 'Alice' } });
handleResponse({
  status: 404,
  data: null,
  message: 'Not found',
});

// 15. 실전 예제: API 클라이언트 인터페이스
interface HttpClient {
  get<T>(url: string): Promise<T>;
  post<T>(url: string, data: any): Promise<T>;
  put<T>(url: string, data: any): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

class ApiClient implements HttpClient {
  constructor(
    private baseUrl: string,
    private config?: RequestConfig
  ) {}

  async get<T>(url: string): Promise<T> {
    console.log(`GET ${this.baseUrl}${url}`);
    return {} as T;
  }

  async post<T>(url: string, data: any): Promise<T> {
    console.log(`POST ${this.baseUrl}${url}`, data);
    return {} as T;
  }

  async put<T>(url: string, data: any): Promise<T> {
    console.log(`PUT ${this.baseUrl}${url}`, data);
    return {} as T;
  }

  async delete<T>(url: string): Promise<T> {
    console.log(`DELETE ${this.baseUrl}${url}`);
    return {} as T;
  }
}

console.log('\n=== 실전: API 클라이언트 ===');
const api = new ApiClient('https://api.example.com', {
  timeout: 5000,
  retries: 3,
});

api.get('/users/1');
api.post('/users', { name: 'Alice' });

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 인터페이스 정의
 *    interface InterfaceName {
 *      property: type;
 *      method(): returnType;
 *    }
 *
 * 2. 선택적 프로퍼티
 *    - ? 연산자로 선택적 표시
 *      property?: type;
 *
 * 3. readonly 프로퍼티
 *    - 초기화 후 변경 불가
 *      readonly property: type;
 *
 * 4. 메서드 시그니처
 *    - 두 가지 문법
 *      method(): returnType;
 *      method: () => returnType;
 *
 * 5. 인덱스 시그니처
 *    - 동적 프로퍼티 허용
 *      [key: string]: type;
 *      [index: number]: type;
 *
 * 6. 함수 타입 인터페이스
 *    interface Func {
 *      (param: type): returnType;
 *    }
 *
 * 7. 하이브리드 타입
 *    - 함수이면서 프로퍼티도 가짐
 *      interface Hybrid {
 *        (param: type): returnType;
 *        property: type;
 *      }
 *
 * 8. 제네릭 인터페이스
 *    interface Generic<T> {
 *      value: T;
 *    }
 *
 * 9. 중첩 인터페이스
 *    - 인터페이스 안에 인터페이스
 *      interface Outer {
 *        inner: InnerInterface;
 *      }
 *
 * 10. 인터페이스 vs 타입
 *     인터페이스:
 *     - 확장 가능 (extends)
 *     - 선언 병합 가능
 *     - 객체 구조에 적합
 *
 *     타입:
 *     - 유니온, 인터섹션 가능
 *     - 유틸리티 타입 조합 가능
 *     - 원시 타입도 정의 가능
 *
 * 11. 선택적 메서드
 *     - 메서드도 선택적 가능
 *       method?(): void;
 *
 * 12. 인터페이스의 장점
 *     ✅ 명확한 계약 정의
 *     ✅ 타입 체크 강화
 *     ✅ 자동완성 지원
 *     ✅ 리팩토링 안전
 *     ✅ 문서화 역할
 *
 * 13. 사용 시기
 *     ✅ 객체 구조 정의
 *     ✅ API 응답 타입
 *     ✅ 함수 매개변수
 *     ✅ 클래스 계약
 *     ✅ 라이브러리 API
 *
 * 14. Best Practices
 *     ✅ 명확한 이름 사용
 *     ✅ 단일 책임 원칙
 *     ✅ 선택적 프로퍼티 최소화
 *     ✅ readonly로 불변성 명시
 *     ✅ 제네릭으로 재사용성 향상
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html
 */
