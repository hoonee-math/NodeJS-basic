/**
 * 06-type-alias.ts
 * 타입 별칭 (Type Alias)
 * 재사용 가능한 타입 정의
 */

// 1. 기본 타입 별칭
type UserID = string | number;
type Age = number;
type Email = string;

let id1: UserID = 'abc123';
let id2: UserID = 12345;
let age: Age = 30;
let email: Email = 'user@example.com';

console.log('=== 기본 타입 별칭 ===');
console.log(`ID (string): ${id1}`);
console.log(`ID (number): ${id2}`);
console.log(`Age: ${age}`);
console.log(`Email: ${email}`);

// 2. 객체 타입 별칭
type Point = {
  x: number;
  y: number;
};

let point1: Point = { x: 10, y: 20 };
let point2: Point = { x: -5, y: 15 };

console.log('\n=== 객체 타입 별칭 ===');
console.log('point1:', point1);
console.log('point2:', point2);

// 3. 복잡한 객체 타입 별칭
type User = {
  id: UserID;
  name: string;
  email: Email;
  age?: Age;
  isActive: boolean;
  createdAt: Date;
};

let user: User = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
  createdAt: new Date(),
};

console.log('\n=== 복잡한 객체 타입 ===');
console.log('user:', user);

// 4. 배열 타입 별칭
type NumberArray = number[];
type StringArray = Array<string>;
type UserArray = User[];

let numbers: NumberArray = [1, 2, 3, 4, 5];
let names: StringArray = ['Alice', 'Bob', 'Charlie'];
let users: UserArray = [user];

console.log('\n=== 배열 타입 별칭 ===');
console.log('numbers:', numbers);
console.log('names:', names);
console.log('users:', users.length, '명');

// 5. 함수 타입 별칭
type MathOperation = (a: number, b: number) => number;
type Predicate<T> = (value: T) => boolean;
type Callback = () => void;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;

const isPositive: Predicate<number> = (n) => n > 0;
const isEmpty: Predicate<string> = (s) => s.length === 0;

const logMessage: Callback = () => console.log('Callback executed');

console.log('\n=== 함수 타입 별칭 ===');
console.log(`add(5, 3) = ${add(5, 3)}`);
console.log(`multiply(5, 3) = ${multiply(5, 3)}`);
console.log(`isPositive(10) = ${isPositive(10)}`);
console.log(`isEmpty('') = ${isEmpty('')}`);
logMessage();

// 6. 유니온 타입 별칭
type Status = 'pending' | 'approved' | 'rejected';
type ID = string | number;
type Result = 'success' | 'error';

let orderStatus: Status = 'pending';
let userId: ID = 123;
let result: Result = 'success';

console.log('\n=== 유니온 타입 별칭 ===');
console.log(`주문 상태: ${orderStatus}`);
console.log(`사용자 ID: ${userId}`);
console.log(`결과: ${result}`);

// 7. 리터럴 타입 별칭 (enum 대안)
type Direction = 'north' | 'south' | 'east' | 'west';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type Color = 'red' | 'green' | 'blue';

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

function request(method: HttpMethod, url: string): void {
  console.log(`${method} ${url}`);
}

console.log('\n=== 리터럴 타입 별칭 ===');
move('north');
request('GET', '/api/users');

// 8. 튜플 타입 별칭
type Coordinate = [number, number];
type RGB = [number, number, number];
type Person = [string, number]; // [name, age]

let position: Coordinate = [10.5, 20.3];
let color: RGB = [255, 0, 128];
let person: Person = ['John', 30];

console.log('\n=== 튜플 타입 별칭 ===');
console.log('position:', position);
console.log('color:', color);
console.log('person:', person);

// 9. 교집합 타입 별칭 (Intersection)
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type WithID = {
  id: string;
};

type Entity = WithID & Timestamped;

type Product = Entity & {
  name: string;
  price: number;
};

let product: Product = {
  id: 'prod-001',
  name: 'Laptop',
  price: 1200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('\n=== 교집합 타입 별칭 ===');
console.log('product:', product);

// 10. 제네릭 타입 별칭
type Container<T> = {
  value: T;
};

type Pair<T, U> = {
  first: T;
  second: U;
};

let numberContainer: Container<number> = { value: 42 };
let stringContainer: Container<string> = { value: 'hello' };

let pair: Pair<string, number> = { first: 'age', second: 30 };

console.log('\n=== 제네릭 타입 별칭 ===');
console.log('numberContainer:', numberContainer);
console.log('stringContainer:', stringContainer);
console.log('pair:', pair);

// 11. 중첩 타입 별칭
type Address = {
  street: string;
  city: string;
  zipCode: string;
};

type Company = {
  name: string;
  address: Address;
};

type Employee = {
  id: number;
  name: string;
  company: Company;
};

let employee: Employee = {
  id: 1,
  name: 'Alice',
  company: {
    name: 'Tech Corp',
    address: {
      street: '123 Main St',
      city: 'New York',
      zipCode: '10001',
    },
  },
};

console.log('\n=== 중첩 타입 별칭 ===');
console.log('employee:', employee);

// 12. 타입 별칭으로 복잡한 타입 간소화
// Before: 복잡한 인라인 타입
function processUser1(user: {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}): void {
  console.log(user);
}

// After: 타입 별칭 사용
type UserRole = 'admin' | 'user' | 'guest';
type SimpleUser = {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
};

function processUser2(user: SimpleUser): void {
  console.log(user);
}

console.log('\n=== 타입 별칭으로 간소화 ===');
console.log('복잡한 타입을 재사용 가능한 이름으로 표현');

// 13. API 응답 타입 별칭
type ApiResponse<T> = {
  status: number;
  data: T;
  error?: string;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type TodosResponse = ApiResponse<Todo[]>;
type TodoResponse = ApiResponse<Todo>;

let todosResponse: TodosResponse = {
  status: 200,
  data: [
    { id: 1, title: 'Learn TypeScript', completed: false },
    { id: 2, title: 'Build a project', completed: false },
  ],
};

console.log('\n=== API 응답 타입 ===');
console.log('todosResponse:', todosResponse);

// 14. 조건부 타입 별칭 (고급)
type IsString<T> = T extends string ? 'yes' : 'no';

type Test1 = IsString<string>; // 'yes'
type Test2 = IsString<number>; // 'no'

console.log('\n=== 조건부 타입 ===');
console.log('IsString<string> = "yes"');
console.log('IsString<number> = "no"');

// 15. 타입 별칭 vs 인터페이스 미리보기
// 타입 별칭: 모든 타입 표현 가능
type StringOrNumber = string | number;
type NameOrAge = [string, number];

// 인터페이스: 객체 구조만 정의 (다음 챕터에서 상세히)
interface IUser {
  name: string;
  age: number;
}

console.log('\n=== 타입 별칭 vs 인터페이스 ===');
console.log('타입 별칭: 모든 타입 표현 가능');
console.log('인터페이스: 주로 객체 구조 정의');
console.log('상세한 차이는 03-classes-interfaces에서 학습');

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 타입 별칭 (Type Alias)
 *    - type 키워드로 타입에 이름 부여
 *      type UserID = string | number;
 *
 * 2. 타입 별칭의 장점
 *    - 코드 재사용성 향상
 *    - 복잡한 타입을 의미 있는 이름으로 표현
 *    - 타입 변경 시 한 곳만 수정
 *
 * 3. 기본 타입 별칭
 *    type Age = number;
 *    type Email = string;
 *
 * 4. 객체 타입 별칭
 *    type User = {
 *      name: string;
 *      age: number;
 *    };
 *
 * 5. 함수 타입 별칭
 *    type Operation = (a: number, b: number) => number;
 *    type Callback = () => void;
 *
 * 6. 유니온 타입 별칭
 *    type Status = 'pending' | 'approved' | 'rejected';
 *    type ID = string | number;
 *
 * 7. 리터럴 타입 별칭 (enum 대안)
 *    type Direction = 'north' | 'south' | 'east' | 'west';
 *
 * 8. 튜플 타입 별칭
 *    type Point = [number, number];
 *    type RGB = [number, number, number];
 *
 * 9. 교집합 타입 별칭
 *    type AB = A & B;
 *
 * 10. 제네릭 타입 별칭
 *     type Container<T> = { value: T };
 *     type Pair<T, U> = { first: T; second: U };
 *
 * 11. API 응답 패턴
 *     type ApiResponse<T> = {
 *       status: number;
 *       data: T;
 *       error?: string;
 *     };
 *
 * 12. 중첩 타입
 *     - 타입 별칭을 조합하여 복잡한 구조 표현
 *       type Employee = {
 *         company: Company;
 *       };
 *
 * 13. 타입 별칭 활용 사례
 *     ✅ 유니온 타입에 이름 부여
 *     ✅ 복잡한 객체 구조 정의
 *     ✅ 함수 시그니처 재사용
 *     ✅ API 응답 타입
 *     ✅ 도메인 모델 정의
 *
 * 14. 타입 별칭 vs 인터페이스 (간단 비교)
 *     타입 별칭:
 *     - 모든 타입 표현 가능 (유니온, 튜플 등)
 *     - type 키워드 사용
 *     - 재선언 불가
 *
 *     인터페이스:
 *     - 주로 객체 구조 정의
 *     - interface 키워드 사용
 *     - 선언 병합 가능 (Declaration Merging)
 *     - 상세한 차이는 09-practical-patterns에서 학습
 *
 * 15. Best Practices
 *     ✅ 의미 있는 이름 사용
 *     ✅ 복잡한 타입은 별칭으로 추출
 *     ✅ 재사용 가능한 타입 정의
 *     ✅ 도메인 용어로 타입 이름 지정
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases
 */
