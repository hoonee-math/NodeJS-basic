/**
 * 03-type-annotations.ts
 * 타입 어노테이션 (Type Annotations)
 * 명시적으로 타입을 지정하는 방법
 */

// 1. 변수 타입 어노테이션
let userName: string;
let age: number;
let isActive: boolean;

userName = 'John Doe';
age = 30;
isActive = true;

console.log('=== 변수 타입 어노테이션 ===');
console.log(`이름: ${userName}`);
console.log(`나이: ${age}`);
console.log(`활성: ${isActive}`);

// userName = 123; // ❌ 에러: number를 string에 할당 불가

// 2. 함수 매개변수 타입 어노테이션
function greet(name: string): string {
  return `Hello, ${name}!`;
}

function add(a: number, b: number): number {
  return a + b;
}

function multiply(x: number, y: number): number {
  return x * y;
}

console.log('\n=== 함수 타입 어노테이션 ===');
console.log(greet('TypeScript'));
console.log(`10 + 20 = ${add(10, 20)}`);
console.log(`5 * 3 = ${multiply(5, 3)}`);

// 3. 선택적 매개변수 (Optional Parameters)
function buildName(firstName: string, lastName?: string): string {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName;
}

console.log('\n=== 선택적 매개변수 ===');
console.log(buildName('John')); // 'John'
console.log(buildName('John', 'Doe')); // 'John Doe'

// 4. 기본값이 있는 매개변수 (Default Parameters)
function createUser(name: string, age: number = 18, role: string = 'user'): void {
  console.log(`User: ${name}, Age: ${age}, Role: ${role}`);
}

console.log('\n=== 기본 매개변수 ===');
createUser('Alice'); // age=18, role='user'
createUser('Bob', 25); // role='user'
createUser('Charlie', 30, 'admin');

// 기본값이 있으면 타입 추론됨
function greetWithDefault(name: string, greeting = 'Hello') {
  // greeting은 string으로 추론됨
  return `${greeting}, ${name}`;
}

// 5. 나머지 매개변수 (Rest Parameters)
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log('\n=== 나머지 매개변수 ===');
console.log(`sum(1, 2, 3) = ${sum(1, 2, 3)}`);
console.log(`sum(10, 20, 30, 40) = ${sum(10, 20, 30, 40)}`);

// 6. 반환 타입 명시
// void - 반환값 없음
function logMessage(message: string): void {
  console.log(message);
}

// never - 절대 반환하지 않음
function throwError(message: string): never {
  throw new Error(message);
}

// 구체적인 타입 반환
function getUser(id: number): { id: number; name: string } {
  return { id, name: 'User' + id };
}

console.log('\n=== 반환 타입 ===');
logMessage('로그 메시지');
console.log(getUser(123));

// 7. 배열 타입 어노테이션
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: Array<string> = ['a', 'b', 'c']; // 제네릭 문법
let booleans: boolean[] = [true, false, true];

console.log('\n=== 배열 타입 ===');
console.log('numbers:', numbers);
console.log('strings:', strings);
console.log('booleans:', booleans);

// 8. 객체 타입 어노테이션
let user: {
  id: number;
  name: string;
  email: string;
  age?: number; // 선택적 프로퍼티
} = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
};

console.log('\n=== 객체 타입 ===');
console.log('user:', user);

// age는 선택적이므로 없어도 됨
let user2: { id: number; name: string; age?: number } = {
  id: 2,
  name: 'Jane',
  // age 생략 가능
};

// 9. 함수 타입 어노테이션
let myAdd: (a: number, b: number) => number;

myAdd = function (x, y) {
  return x + y;
};

// 화살표 함수로도 가능
let myMultiply: (a: number, b: number) => number = (x, y) => x * y;

console.log('\n=== 함수 타입 ===');
console.log(`myAdd(5, 3) = ${myAdd(5, 3)}`);
console.log(`myMultiply(5, 3) = ${myMultiply(5, 3)}`);

// 10. 유니온 타입 (Union Types)
let id: string | number;

id = 'abc123'; // OK
console.log('\n=== 유니온 타입 ===');
console.log(`id (string): ${id}`);

id = 12345; // OK
console.log(`id (number): ${id}`);

// id = true; // ❌ 에러: boolean은 허용 안됨

function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

printId('abc');
printId(123);

// 11. 타입 단언 (Type Assertion)
let someValue: unknown = 'this is a string';

// 방법 1: as 문법 (권장)
let strLength1: number = (someValue as string).length;

// 방법 2: angle-bracket 문법 (JSX와 충돌 가능)
let strLength2: number = (<string>someValue).length;

console.log('\n=== 타입 단언 ===');
console.log(`문자열 길이: ${strLength1}`);

// 12. 리터럴 타입
let status: 'pending' | 'approved' | 'rejected';

status = 'pending'; // OK
console.log('\n=== 리터럴 타입 ===');
console.log(`상태: ${status}`);

status = 'approved'; // OK
console.log(`상태: ${status}`);

// status = 'invalid'; // ❌ 에러

// 13. 타입 어노테이션이 필요한 경우
// Case 1: 나중에 할당될 변수
let futureValue: string;
// ... 로직 ...
futureValue = 'assigned later';

// Case 2: 함수 매개변수 (필수!)
function process(data: string) {
  console.log(data);
}

// Case 3: 반환 타입 (공개 API에서 권장)
function getData(): { id: number; name: string } {
  return { id: 1, name: 'Data' };
}

// Case 4: any에서 벗어나기
let value: string = JSON.parse('{"key": "value"}');

console.log('\n=== 타입 어노테이션 활용 ===');
console.log('명시적 타입으로 안전성 확보');

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 타입 어노테이션 (Type Annotation)
 *    - 명시적으로 타입을 지정
 *      let name: string = 'John';
 *
 * 2. 변수 타입 어노테이션
 *    - 변수 선언 시 타입 지정
 *      let age: number;
 *      age = 30;
 *
 * 3. 함수 타입 어노테이션
 *    - 매개변수 타입 (필수)
 *      function greet(name: string): string { ... }
 *
 *    - 반환 타입 (권장)
 *      function add(a: number, b: number): number { ... }
 *
 * 4. 선택적 매개변수
 *    - ? 연산자로 선택적 매개변수 표시
 *      function build(first: string, last?: string) { ... }
 *
 * 5. 기본 매개변수
 *    - 기본값 제공 (타입 추론됨)
 *      function create(name: string, age = 18) { ... }
 *
 * 6. 나머지 매개변수
 *    - ... 연산자로 가변 인자 처리
 *      function sum(...numbers: number[]): number { ... }
 *
 * 7. 배열 타입
 *    - number[] 또는 Array<number>
 *      let nums: number[] = [1, 2, 3];
 *
 * 8. 객체 타입
 *    - 인라인 타입 정의
 *      let user: { name: string; age: number } = { ... };
 *
 * 9. 함수 타입
 *    - (param: type) => returnType
 *      let add: (a: number, b: number) => number;
 *
 * 10. 유니온 타입
 *     - | 연산자로 여러 타입 허용
 *       let id: string | number;
 *
 * 11. 리터럴 타입
 *     - 정확한 값으로 타입 제한
 *       let status: 'pending' | 'approved';
 *
 * 12. 타입 단언
 *     - 개발자가 타입을 확신할 때
 *       (value as string).length
 *
 * 13. 타입 어노테이션이 필요한 경우
 *     ✅ 함수 매개변수 (필수)
 *     ✅ 공개 API 반환 타입
 *     ✅ 나중에 할당될 변수
 *     ✅ 복잡한 객체 구조
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 */
