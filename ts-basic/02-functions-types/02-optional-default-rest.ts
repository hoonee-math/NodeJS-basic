/**
 * 02-optional-default-rest.ts
 * 다양한 매개변수 패턴
 */

// 1. 선택적 매개변수 (Optional Parameters)
function greet(name: string, greeting?: string): string {
  if (greeting) {
    return `${greeting}, ${name}!`;
  }
  return `Hello, ${name}!`;
}

console.log('=== 선택적 매개변수 ===');
console.log(greet('Alice'));
console.log(greet('Bob', 'Hi'));
console.log(greet('Charlie', 'Good morning'));

// 2. 선택적 매개변수는 undefined 유니온과 동일
function logMessage(message: string, level?: string): void {
  // level의 타입: string | undefined
  const logLevel = level ?? 'INFO';
  console.log(`[${logLevel}] ${message}`);
}

console.log('\n=== 선택적 매개변수 = undefined 유니온 ===');
logMessage('Application started');
logMessage('Error occurred', 'ERROR');

// 3. 선택적 매개변수 순서 규칙
// ❌ 선택적 매개변수가 필수 매개변수보다 앞에 오면 안됨
// function wrong(optional?: string, required: number) { }

// ✅ 필수 매개변수가 먼저
function correct(required: number, optional?: string): void {
  console.log(`Required: ${required}, Optional: ${optional ?? 'N/A'}`);
}

console.log('\n=== 매개변수 순서 ===');
correct(10);
correct(20, 'test');

// 4. 기본 매개변수 (Default Parameters)
function createUser(name: string, role: string = 'user', active: boolean = true) {
  return { name, role, active };
}

console.log('\n=== 기본 매개변수 ===');
console.log(createUser('Alice'));
console.log(createUser('Bob', 'admin'));
console.log(createUser('Charlie', 'moderator', false));

// 5. 기본값이 있으면 타입 추론됨
function multiply(a: number, b = 2) {
  // b의 타입은 자동으로 number로 추론됨
  return a * b;
}

console.log('\n=== 기본 매개변수 타입 추론 ===');
console.log(`5 * 기본값 = ${multiply(5)}`);
console.log(`5 * 3 = ${multiply(5, 3)}`);

// 6. 기본 매개변수는 순서 무관 (undefined로 스킵 가능)
function buildUrl(protocol: string = 'https', domain: string, port: number = 443) {
  return `${protocol}://${domain}:${port}`;
}

console.log('\n=== 기본 매개변수 순서 ===');
console.log(buildUrl(undefined, 'example.com'));
console.log(buildUrl('http', 'example.com', 8080));

// 7. 나머지 매개변수 (Rest Parameters)
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

console.log('\n=== 나머지 매개변수 ===');
console.log(`sum() = ${sum()}`);
console.log(`sum(1, 2, 3) = ${sum(1, 2, 3)}`);
console.log(`sum(10, 20, 30, 40, 50) = ${sum(10, 20, 30, 40, 50)}`);

// 8. 나머지 매개변수는 항상 배열
function printAll(...items: string[]): void {
  items.forEach((item, index) => {
    console.log(`  ${index + 1}. ${item}`);
  });
}

console.log('\n=== 나머지 매개변수는 배열 ===');
printAll('Apple', 'Banana', 'Cherry');

// 9. 필수 + 나머지 매개변수
function formatMessage(template: string, ...values: (string | number)[]): string {
  let result = template;
  values.forEach((value, index) => {
    result = result.replace(`{${index}}`, String(value));
  });
  return result;
}

console.log('\n=== 필수 + 나머지 매개변수 ===');
console.log(formatMessage('Hello, {0}! You have {1} messages.', 'Alice', 5));

// 10. 매개변수 순서 종합
function fullExample(
  required: string,
  optional?: number,
  defaultParam: boolean = false,
  ...rest: string[]
): void {
  console.log('Required:', required);
  console.log('Optional:', optional);
  console.log('Default:', defaultParam);
  console.log('Rest:', rest);
}

console.log('\n=== 매개변수 순서 종합 ===');
fullExample('test');
fullExample('test', 42);
fullExample('test', 42, true);
fullExample('test', 42, true, 'a', 'b', 'c');

// 11. 구조 분해와 선택적 매개변수
interface UserOptions {
  name: string;
  age?: number;
  email?: string;
}

function createUserFromOptions(options: UserOptions): void {
  const { name, age = 0, email = 'N/A' } = options;
  console.log(`Name: ${name}, Age: ${age}, Email: ${email}`);
}

console.log('\n=== 구조 분해 + 선택적 매개변수 ===');
createUserFromOptions({ name: 'Alice' });
createUserFromOptions({ name: 'Bob', age: 30 });
createUserFromOptions({ name: 'Charlie', age: 25, email: 'charlie@example.com' });

// 12. 객체 매개변수의 기본값
function drawRect({
  width = 100,
  height = 100,
  color = 'black',
}: {
  width?: number;
  height?: number;
  color?: string;
} = {}): void {
  console.log(`Drawing ${width}x${height} rectangle in ${color}`);
}

console.log('\n=== 객체 매개변수 기본값 ===');
drawRect();
drawRect({ width: 200 });
drawRect({ width: 150, height: 75, color: 'red' });

// 13. 튜플과 나머지 매개변수
function logPair(...pair: [string, number]): void {
  const [label, value] = pair;
  console.log(`${label}: ${value}`);
}

console.log('\n=== 튜플 나머지 매개변수 ===');
logPair('Score', 95);
// logPair('Score', 95, 'extra'); // ❌ 에러: 튜플은 정확히 2개

// 14. 선택적 매개변수 vs undefined 타입
function example1(value?: string): void {
  // value: string | undefined
  console.log(value?.toUpperCase() ?? 'NO VALUE');
}

function example2(value: string | undefined): void {
  // 명시적으로 undefined 전달 필요
  console.log(value?.toUpperCase() ?? 'NO VALUE');
}

console.log('\n=== 선택적 vs undefined 타입 ===');
example1();
example1('hello');
// example2(); // ❌ 에러: 매개변수 필요
example2(undefined);
example2('world');

// 15. 실전 예제: 설정 객체 패턴
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

function fetchData(url: string, options: FetchOptions = {}): void {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 30000,
  } = options;

  console.log(`${method} ${url}`);
  console.log(`Headers:`, headers);
  console.log(`Body:`, body ?? 'N/A');
  console.log(`Timeout: ${timeout}ms`);
}

console.log('\n=== 실전: 설정 객체 패턴 ===');
fetchData('https://api.example.com/users');
fetchData('https://api.example.com/users/1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: { name: 'Alice' },
});

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 선택적 매개변수 (?)
 *    - 생략 가능한 매개변수
 *      function greet(name: string, greeting?: string) { }
 *
 *    - string | undefined와 동일
 *      greeting?: string === greeting: string | undefined
 *
 * 2. 선택적 매개변수 규칙
 *    - 필수 매개변수 뒤에 위치
 *      ✅ function f(a: number, b?: string)
 *      ❌ function f(a?: number, b: string)
 *
 * 3. 기본 매개변수 (=)
 *    - 기본값 제공
 *      function greet(name = 'Guest') { }
 *
 *    - 타입 자동 추론
 *      function multiply(a: number, b = 2) { } // b는 number
 *
 *    - undefined로 기본값 사용
 *      multiply(5, undefined) // b는 2
 *
 * 4. 나머지 매개변수 (...)
 *    - 가변 인자를 배열로 수집
 *      function sum(...numbers: number[]) { }
 *
 *    - 항상 배열 타입
 *      ...numbers: number[]
 *
 *    - 마지막 위치에만 가능
 *      function f(a: string, ...rest: number[])
 *
 * 5. 매개변수 순서
 *    필수 → 선택적 → 기본값 → 나머지
 *    function f(
 *      required: string,
 *      optional?: number,
 *      defaultParam = false,
 *      ...rest: string[]
 *    )
 *
 * 6. 구조 분해 매개변수
 *    - 객체 구조 분해 + 기본값
 *      function f({ width = 100, height = 100 } = {}) { }
 *
 * 7. 선택적 vs undefined
 *    - 선택적: 생략 가능
 *      function f(x?: string) { } // f() OK
 *
 *    - undefined: 명시 필요
 *      function f(x: string | undefined) { } // f() ❌
 *
 * 8. 튜플 나머지 매개변수
 *    - 정확한 개수와 타입
 *      function f(...pair: [string, number]) { }
 *
 * 9. 설정 객체 패턴
 *    - 옵션이 많을 때 객체 사용
 *      function fetch(url: string, options: FetchOptions = {})
 *
 * 10. Best Practices
 *     ✅ 옵션이 많으면 객체로 전달
 *     ✅ 기본값은 합리적인 값으로
 *     ✅ 선택적 매개변수는 뒤에 배치
 *     ✅ 나머지 매개변수는 마지막에
 *     ✅ 구조 분해로 코드 간결화
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/functions.html#optional-parameters
 */
