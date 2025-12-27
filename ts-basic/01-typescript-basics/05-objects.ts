/**
 * 05-objects.ts
 * 객체 타입
 */

// 1. 객체 타입 인라인 정의
let user: { name: string; age: number } = {
  name: 'John',
  age: 30,
};

console.log('=== 인라인 객체 타입 ===');
console.log('user:', user);

// 2. 선택적 프로퍼티 (Optional Properties)
let product: {
  name: string;
  price: number;
  description?: string; // 선택적
  category?: string; // 선택적
} = {
  name: 'Laptop',
  price: 1200,
};

console.log('\n=== 선택적 프로퍼티 ===');
console.log('product (description 없음):', product);

product.description = 'High-performance laptop';
console.log('product (description 추가):', product);

// 3. 읽기 전용 프로퍼티 (Readonly Properties)
let config: {
  readonly apiUrl: string;
  readonly apiKey: string;
  timeout: number;
} = {
  apiUrl: 'https://api.example.com',
  apiKey: 'secret-key-123',
  timeout: 3000,
};

console.log('\n=== 읽기 전용 프로퍼티 ===');
console.log('config:', config);

config.timeout = 5000; // OK - timeout은 수정 가능
console.log('timeout 수정:', config.timeout);

// config.apiUrl = 'new-url'; // ❌ 에러: 읽기 전용
// config.apiKey = 'new-key'; // ❌ 에러: 읽기 전용

// 4. 인덱스 시그니처 (Index Signatures)
// 동적으로 프로퍼티를 추가할 수 있는 객체
let scores: {
  [studentName: string]: number;
} = {
  john: 90,
  jane: 95,
  bob: 85,
};

console.log('\n=== 인덱스 시그니처 ===');
console.log('scores:', scores);

scores.alice = 92; // 동적으로 추가 가능
console.log('alice 점수 추가:', scores);

// 5. 인덱스 시그니처 + 고정 프로퍼티
let userDatabase: {
  admin: string; // 고정 프로퍼티
  [username: string]: string; // 동적 프로퍼티
} = {
  admin: 'admin@example.com',
  john: 'john@example.com',
  jane: 'jane@example.com',
};

console.log('\n=== 인덱스 시그니처 + 고정 프로퍼티 ===');
console.log('userDatabase:', userDatabase);
console.log('admin:', userDatabase.admin);
console.log('john:', userDatabase.john);

// 6. 중첩 객체 (Nested Objects)
let employee: {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
  skills: string[];
} = {
  id: 1,
  name: 'John Doe',
  address: {
    street: '123 Main St',
    city: 'New York',
    zipCode: '10001',
  },
  skills: ['TypeScript', 'Node.js', 'React'],
};

console.log('\n=== 중첩 객체 ===');
console.log('employee:', employee);
console.log('address:', employee.address);
console.log('skills:', employee.skills);

// 7. 객체 타입 vs 인터페이스 vs 타입 별칭
// 방법 1: 인라인 객체 타입
let user1: { name: string; age: number } = { name: 'Alice', age: 25 };

// 방법 2: 타입 별칭 (다음 파일에서 상세히)
type User = {
  name: string;
  age: number;
};
let user2: User = { name: 'Bob', age: 30 };

// 방법 3: 인터페이스 (03-classes-interfaces에서 상세히)
interface IUser {
  name: string;
  age: number;
}
let user3: IUser = { name: 'Charlie', age: 35 };

console.log('\n=== 객체 타입 정의 방법 ===');
console.log('인라인:', user1);
console.log('타입 별칭:', user2);
console.log('인터페이스:', user3);

// 8. 메서드가 있는 객체 타입
let calculator: {
  value: number;
  add: (n: number) => void;
  subtract: (n: number) => void;
  getValue: () => number;
} = {
  value: 0,
  add(n) {
    this.value += n;
  },
  subtract(n) {
    this.value -= n;
  },
  getValue() {
    return this.value;
  },
};

console.log('\n=== 메서드가 있는 객체 ===');
calculator.add(10);
calculator.add(5);
console.log('10 + 5 =', calculator.getValue());
calculator.subtract(3);
console.log('15 - 3 =', calculator.getValue());

// 9. 타입 추론으로 객체 생성
let inferredUser = {
  name: 'David',
  age: 28,
  email: 'david@example.com',
};
// inferredUser의 타입이 자동으로 추론됨:
// { name: string; age: number; email: string; }

console.log('\n=== 타입 추론 객체 ===');
console.log('inferredUser:', inferredUser);

// 추론된 프로퍼티만 사용 가능
// inferredUser.phone = '123-456'; // ❌ 에러: phone 프로퍼티 없음

// 10. 객체의 구조 분해와 타입
function printUserInfo({ name, age }: { name: string; age: number }): void {
  console.log(`Name: ${name}, Age: ${age}`);
}

console.log('\n=== 구조 분해와 타입 ===');
printUserInfo({ name: 'Emma', age: 22 });

// 11. 선택적 프로퍼티와 기본값
function createUser({
  name,
  age = 18,
  role = 'user',
}: {
  name: string;
  age?: number;
  role?: string;
}): void {
  console.log(`User: ${name}, Age: ${age}, Role: ${role}`);
}

console.log('\n=== 선택적 프로퍼티와 기본값 ===');
createUser({ name: 'Frank' });
createUser({ name: 'Grace', age: 25 });
createUser({ name: 'Henry', age: 30, role: 'admin' });

// 12. 교집합 타입 (Intersection Types)
type Person = {
  name: string;
  age: number;
};

type Employee2 = {
  employeeId: number;
  department: string;
};

type Staff = Person & Employee2;

let staff: Staff = {
  name: 'Isabel',
  age: 28,
  employeeId: 12345,
  department: 'Engineering',
};

console.log('\n=== 교집합 타입 ===');
console.log('staff:', staff);

// 13. 유니온 타입 객체
type SuccessResponse = {
  status: 'success';
  data: any;
};

type ErrorResponse = {
  status: 'error';
  message: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

let response1: ApiResponse = {
  status: 'success',
  data: { id: 1, name: 'Item' },
};

let response2: ApiResponse = {
  status: 'error',
  message: 'Something went wrong',
};

console.log('\n=== 유니온 타입 객체 ===');
console.log('성공 응답:', response1);
console.log('에러 응답:', response2);

// 14. 객체 불변성 - Readonly 유틸리티 타입
type Config = {
  apiUrl: string;
  apiKey: string;
  timeout: number;
};

let mutableConfig: Config = {
  apiUrl: 'https://api.example.com',
  apiKey: 'key123',
  timeout: 3000,
};

let immutableConfig: Readonly<Config> = {
  apiUrl: 'https://api.example.com',
  apiKey: 'key123',
  timeout: 3000,
};

console.log('\n=== Readonly 유틸리티 타입 ===');
console.log('mutableConfig:', mutableConfig);
console.log('immutableConfig:', immutableConfig);

mutableConfig.timeout = 5000; // OK
// immutableConfig.timeout = 5000; // ❌ 에러: 읽기 전용

// 15. 객체 타입 확장
type Animal = {
  name: string;
  age: number;
};

type Dog = Animal & {
  breed: string;
  bark: () => void;
};

let myDog: Dog = {
  name: 'Max',
  age: 3,
  breed: 'Golden Retriever',
  bark() {
    console.log('Woof! Woof!');
  },
};

console.log('\n=== 객체 타입 확장 ===');
console.log('myDog:', { name: myDog.name, age: myDog.age, breed: myDog.breed });
myDog.bark();

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 객체 타입 정의
 *    - 인라인 타입
 *      let user: { name: string; age: number } = { ... };
 *
 * 2. 선택적 프로퍼티
 *    - ? 연산자
 *      let product: { name: string; description?: string };
 *
 * 3. 읽기 전용 프로퍼티
 *    - readonly 키워드
 *      let config: { readonly apiUrl: string };
 *
 * 4. 인덱스 시그니처
 *    - 동적 프로퍼티 허용
 *      let obj: { [key: string]: number } = {};
 *      obj.anything = 123;
 *
 * 5. 중첩 객체
 *    - 객체 안에 객체
 *      type User = {
 *        address: {
 *          city: string;
 *        }
 *      };
 *
 * 6. 메서드 타입
 *    - 객체의 메서드 타입 정의
 *      type Calculator = {
 *        add: (n: number) => void;
 *      };
 *
 * 7. 객체 타입 정의 방법 3가지
 *    - 인라인: let x: { name: string };
 *    - 타입 별칭: type User = { name: string };
 *    - 인터페이스: interface User { name: string; }
 *
 * 8. 교집합 타입 (Intersection)
 *    - & 연산자로 타입 결합
 *      type AB = A & B;
 *
 * 9. 유니온 타입 객체
 *    - | 연산자로 여러 객체 타입 중 하나
 *      type Response = Success | Error;
 *
 * 10. Readonly 유틸리티 타입
 *     - 모든 프로퍼티를 읽기 전용으로
 *       Readonly<Config>
 *
 * 11. 구조 분해와 타입
 *     - 매개변수 구조 분해 시 타입 지정
 *       function f({ name, age }: { name: string; age: number }) { }
 *
 * 12. 타입 확장
 *     - 기존 타입에 프로퍼티 추가
 *       type Dog = Animal & { breed: string };
 *
 * 13. Best Practices
 *     ✅ 복잡한 객체는 타입 별칭이나 인터페이스 사용
 *     ✅ 변경하면 안 되는 값은 readonly
 *     ✅ 동적 키가 필요하면 인덱스 시그니처
 *     ✅ 선택적 프로퍼티는 ? 사용
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html
 */
