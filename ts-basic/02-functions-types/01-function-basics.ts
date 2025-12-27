/**
 * 01-function-basics.ts
 * 함수의 기본 타입 지정 방법
 */

// 1. 함수 선언문 (Function Declaration)
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log('=== 함수 선언문 ===');
console.log(greet('Alice'));
// greet(123); // ❌ 에러: number는 string에 할당 불가

// 2. 함수 표현식 (Function Expression)
const add = function (a: number, b: number): number {
  return a + b;
};

console.log('\n=== 함수 표현식 ===');
console.log(`10 + 20 = ${add(10, 20)}`);

// 3. 화살표 함수 (Arrow Function)
const multiply = (a: number, b: number): number => {
  return a * b;
};

// 단일 표현식은 중괄호와 return 생략 가능
const divide = (a: number, b: number): number => a / b;

console.log('\n=== 화살표 함수 ===');
console.log(`5 * 3 = ${multiply(5, 3)}`);
console.log(`10 / 2 = ${divide(10, 2)}`);

// 4. 매개변수 타입 어노테이션 (필수)
function logMessage(message: string, level: string): void {
  console.log(`[${level.toUpperCase()}] ${message}`);
}

console.log('\n=== 매개변수 타입 ===');
logMessage('Application started', 'info');
// logMessage(123, 'error'); // ❌ 에러

// 5. 반환 타입 명시
function getFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`;
}

// 반환 타입은 생략 가능 (추론됨)
function getAge(birthYear: number) {
  return new Date().getFullYear() - birthYear;
}

console.log('\n=== 반환 타입 ===');
console.log(`이름: ${getFullName('John', 'Doe')}`);
console.log(`나이: ${getAge(1990)}세`);

// 6. void 타입 - 반환값 없음
function printHeader(title: string): void {
  console.log('='.repeat(40));
  console.log(title);
  console.log('='.repeat(40));
  // return undefined; // void는 undefined 반환 가능
  // return 123; // ❌ 에러: number는 void에 할당 불가
}

console.log('\n=== void 타입 ===');
printHeader('TypeScript Functions');

// 7. never 타입 - 절대 반환하지 않음
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // 무한 루프
  }
}

console.log('\n=== never 타입 ===');
console.log('never: 절대 반환하지 않는 함수');
console.log('예: 항상 예외 발생, 무한 루프');
// throwError('Something went wrong'); // 실행하면 프로그램 종료

// 8. 익명 함수와 타입 추론
const numbers = [1, 2, 3, 4, 5];

// 콜백 함수의 매개변수 타입은 문맥으로 추론됨
numbers.forEach((num) => {
  // num의 타입이 자동으로 number로 추론됨
  console.log(num * 2);
});

console.log('\n=== 익명 함수 타입 추론 ===');
console.log('배열 메서드의 콜백 매개변수는 자동으로 타입 추론됨');

// 9. 함수 타입 어노테이션
let calculate: (x: number, y: number) => number;

calculate = function (a, b) {
  return a + b;
};

console.log('\n=== 함수 타입 어노테이션 ===');
console.log(`5 + 7 = ${calculate(5, 7)}`);

// calculate = function (a, b) {
//   return a.toString(); // ❌ 에러: string은 number에 할당 불가
// };

// 10. 선택적 반환값
function findUser(id: number): string | undefined {
  const users = ['Alice', 'Bob', 'Charlie'];
  return users[id];
}

console.log('\n=== 선택적 반환값 ===');
console.log(`User 0: ${findUser(0)}`);
console.log(`User 10: ${findUser(10)}`); // undefined

// 11. 여러 타입 반환
function formatValue(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}

console.log('\n=== 여러 타입 반환 ===');
console.log(formatValue('hello'));
console.log(formatValue(42.12345));

// 12. 함수 시그니처 타입
type MathOperation = (a: number, b: number) => number;

const subtract: MathOperation = (x, y) => x - y;
const power: MathOperation = (x, y) => x ** y;

console.log('\n=== 함수 시그니처 타입 ===');
console.log(`10 - 3 = ${subtract(10, 3)}`);
console.log(`2^8 = ${power(2, 8)}`);

// 13. 즉시 실행 함수 (IIFE)
const result = (function (x: number, y: number): number {
  return x * y;
})(5, 10);

console.log('\n=== 즉시 실행 함수 ===');
console.log(`결과: ${result}`);

// 14. 함수 내부에서 타입 검증
function processInput(input: string | number): void {
  if (typeof input === 'string') {
    // 이 블록에서 input은 string
    console.log(`문자열 길이: ${input.length}`);
  } else {
    // 이 블록에서 input은 number
    console.log(`숫자의 제곱: ${input * input}`);
  }
}

console.log('\n=== 타입 검증 ===');
processInput('TypeScript');
processInput(7);

// 15. 객체를 반환하는 함수
interface User {
  id: number;
  name: string;
  email: string;
}

function createUser(name: string, email: string): User {
  return {
    id: Date.now(),
    name,
    email,
  };
}

console.log('\n=== 객체 반환 ===');
const newUser = createUser('Alice', 'alice@example.com');
console.log('새 사용자:', newUser);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 함수 정의 방식
 *    - 함수 선언문: function name(params): returnType { }
 *    - 함수 표현식: const name = function(params): returnType { }
 *    - 화살표 함수: const name = (params): returnType => { }
 *
 * 2. 매개변수 타입 어노테이션
 *    - TypeScript에서 매개변수 타입은 필수
 *      function greet(name: string) { }
 *
 * 3. 반환 타입 명시
 *    - 명시 권장 (특히 공개 API)
 *      function add(a: number, b: number): number { }
 *
 *    - 생략 가능 (타입 추론)
 *      function add(a: number, b: number) { return a + b; }
 *
 * 4. void 타입
 *    - 반환값이 없는 함수
 *      function log(msg: string): void { console.log(msg); }
 *
 * 5. never 타입
 *    - 절대 반환하지 않는 함수
 *      function error(msg: string): never { throw new Error(msg); }
 *
 * 6. 익명 함수 타입 추론
 *    - 콜백 함수의 매개변수는 문맥으로 자동 추론
 *      [1, 2, 3].forEach((num) => { }); // num은 number
 *
 * 7. 함수 타입 어노테이션
 *    - 변수에 함수 타입 지정
 *      let func: (x: number) => number;
 *
 * 8. 함수 시그니처 타입
 *    - type 별칭으로 재사용
 *      type MathOp = (a: number, b: number) => number;
 *
 * 9. 유니온 타입 반환
 *    - 여러 타입 중 하나 반환
 *      function find(id: number): User | undefined { }
 *
 * 10. 타입 검증
 *     - 함수 내부에서 타입 가드 사용
 *       if (typeof value === 'string') { ... }
 *
 * 11. Best Practices
 *     ✅ 매개변수는 항상 타입 명시
 *     ✅ 공개 API는 반환 타입 명시
 *     ✅ 내부 함수는 타입 추론 활용
 *     ✅ void와 never를 적절히 구분
 *     ✅ 유니온 타입으로 유연성 확보
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/functions.html
 */
