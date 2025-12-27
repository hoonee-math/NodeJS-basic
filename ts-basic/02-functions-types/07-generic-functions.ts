/**
 * 07-generic-functions.ts
 * 제네릭으로 범용 함수 작성
 */

// 1. 제네릭 함수 기본
function identity<T>(value: T): T {
  return value;
}

console.log('=== 제네릭 함수 기본 ===');
console.log(identity<string>('hello')); // 명시적 타입
console.log(identity<number>(42)); // 명시적 타입
console.log(identity('auto')); // 타입 추론
console.log(identity(100)); // 타입 추론

// 2. 배열의 첫 번째 요소 반환
function first<T>(array: T[]): T | undefined {
  return array[0];
}

console.log('\n=== 배열 첫 요소 ===');
console.log(first([1, 2, 3])); // number
console.log(first(['a', 'b', 'c'])); // string
console.log(first([])); // undefined

// 3. 배열의 마지막 요소
function last<T>(array: T[]): T | undefined {
  return array[array.length - 1];
}

console.log('\n=== 배열 마지막 요소 ===');
console.log(last([10, 20, 30]));
console.log(last(['x', 'y', 'z']));

// 4. 여러 제네릭 타입 매개변수
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

console.log('\n=== 여러 제네릭 매개변수 ===');
console.log(pair('age', 30)); // [string, number]
console.log(pair(true, 'yes')); // [boolean, string]

// 5. 제네릭 제약 조건 (extends)
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): void {
  console.log(`Length: ${value.length}`);
}

console.log('\n=== 제네릭 제약 조건 ===');
logLength('hello'); // string은 length 있음
logLength([1, 2, 3]); // array는 length 있음
logLength({ length: 10 }); // 객체도 length 있으면 OK
// logLength(123); // ❌ 에러: number는 length 없음

// 6. keyof 제약 조건
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

console.log('\n=== keyof 제약 조건 ===');
const person = { name: 'Alice', age: 30, city: 'Seoul' };

console.log(getProperty(person, 'name')); // 'Alice'
console.log(getProperty(person, 'age')); // 30
// console.log(getProperty(person, 'invalid')); // ❌ 에러

// 7. 제네릭 배열 함수
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of array) {
    result.push(fn(item));
  }
  return result;
}

console.log('\n=== 제네릭 map ===');
const doubled = map([1, 2, 3], (n) => n * 2);
const lengths = map(['a', 'ab', 'abc'], (s) => s.length);

console.log('Doubled:', doubled);
console.log('Lengths:', lengths);

// 8. 제네릭 filter
function filter<T>(array: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of array) {
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
}

console.log('\n=== 제네릭 filter ===');
const evens = filter([1, 2, 3, 4, 5], (n) => n % 2 === 0);
const longWords = filter(['a', 'ab', 'abc', 'abcd'], (s) => s.length > 2);

console.log('Evens:', evens);
console.log('Long words:', longWords);

// 9. 제네릭 reduce
function reduce<T, U>(
  array: T[],
  fn: (acc: U, item: T) => U,
  initial: U
): U {
  let result = initial;
  for (const item of array) {
    result = fn(result, item);
  }
  return result;
}

console.log('\n=== 제네릭 reduce ===');
const sum = reduce([1, 2, 3, 4, 5], (acc, n) => acc + n, 0);
const product = reduce([1, 2, 3, 4, 5], (acc, n) => acc * n, 1);

console.log('Sum:', sum);
console.log('Product:', product);

// 10. 제네릭 클래스와 메서드
class Box<T> {
  constructor(private value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }

  // 제네릭 메서드
  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }
}

console.log('\n=== 제네릭 클래스 ===');
const numberBox = new Box(42);
console.log('Number box:', numberBox.getValue());

const stringBox = numberBox.map((n) => n.toString());
console.log('String box:', stringBox.getValue());

// 11. 여러 제약 조건
interface Printable {
  print(): void;
}

function printAndReturn<T extends Printable & HasLength>(value: T): T {
  value.print();
  console.log(`Length: ${value.length}`);
  return value;
}

console.log('\n=== 여러 제약 조건 ===');
const printableString = {
  length: 5,
  print() {
    console.log('Printing...');
  },
};
printAndReturn(printableString);

// 12. 조건부 타입과 제네릭
type IsArray<T> = T extends any[] ? 'array' : 'not array';

function checkArray<T>(value: T): IsArray<T> {
  return (Array.isArray(value) ? 'array' : 'not array') as IsArray<T>;
}

console.log('\n=== 조건부 타입 ===');
console.log(checkArray([1, 2, 3]));
console.log(checkArray('hello'));

// 13. 제네릭 Promise 함수
function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

console.log('\n=== 제네릭 Promise ===');
delay(100, 'Delayed value').then((value) => console.log(value));

// 14. 타입 가드와 제네릭
function isString<T>(value: T): value is Extract<T, string> {
  return typeof value === 'string';
}

function processValue<T extends string | number>(value: T): void {
  if (isString(value)) {
    console.log(`String: ${value.toUpperCase()}`);
  } else {
    console.log(`Number: ${value.toFixed(2)}`);
  }
}

console.log('\n=== 타입 가드 + 제네릭 ===');
processValue('hello');
processValue(42.12345);

// 15. 제네릭 팩토리 함수
function createPair<T, U>(first: T, second: U) {
  return {
    first,
    second,
    swap(): { first: U; second: T } {
      return { first: second, second: first };
    },
  };
}

console.log('\n=== 제네릭 팩토리 ===');
const numStrPair = createPair(10, 'ten');
console.log('Original:', numStrPair);
console.log('Swapped:', numStrPair.swap());

// 16. 제네릭 유틸리티 함수
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

console.log('\n=== 제네릭 clone ===');
const original = { name: 'Alice', age: 30 };
const cloned = clone(original);
console.log('Cloned:', cloned);

// 17. 제네릭 merge
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

console.log('\n=== 제네릭 merge ===');
const merged = merge({ name: 'Bob' }, { age: 25 });
console.log('Merged:', merged);

// 18. 제네릭 배열 유틸리티
function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

console.log('\n=== 제네릭 unique ===');
console.log(unique([1, 2, 2, 3, 3, 4]));
console.log(unique(['a', 'b', 'a', 'c', 'b']));

// 19. 제네릭 타입 추론
function toArray<T>(...items: T[]): T[] {
  return items;
}

console.log('\n=== 제네릭 타입 추론 ===');
const numArray = toArray(1, 2, 3); // number[]
const strArray = toArray('a', 'b', 'c'); // string[]
const mixedArray = toArray(1, 'a', true); // (string | number | boolean)[]

console.log('Numbers:', numArray);
console.log('Strings:', strArray);
console.log('Mixed:', mixedArray);

// 20. 실전 예제: API 응답 래퍼
interface ApiResponse<T> {
  status: number;
  data: T;
  error?: string;
}

function createResponse<T>(
  data: T,
  status: number = 200
): ApiResponse<T> {
  return { status, data };
}

function createErrorResponse<T>(
  error: string,
  status: number = 500
): ApiResponse<T> {
  return { status, data: null as any, error };
}

console.log('\n=== 실전: API 응답 래퍼 ===');
const userResponse = createResponse({ id: 1, name: 'Alice' });
const errorResponse = createErrorResponse('Not found', 404);

console.log('Success:', userResponse);
console.log('Error:', errorResponse);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 제네릭 함수 기본
 *    function identity<T>(value: T): T {
 *      return value;
 *    }
 *
 * 2. 타입 추론
 *    identity('hello'); // T는 string으로 추론
 *    identity<number>(42); // 명시적 타입
 *
 * 3. 여러 타입 매개변수
 *    function pair<T, U>(a: T, b: U): [T, U] { }
 *
 * 4. 제약 조건 (extends)
 *    - 기본 제약
 *      function f<T extends HasLength>(x: T) { }
 *
 *    - keyof 제약
 *      function f<T, K extends keyof T>(obj: T, key: K) { }
 *
 *    - 여러 제약
 *      function f<T extends A & B>(x: T) { }
 *
 * 5. 제네릭 배열 함수
 *    function map<T, U>(arr: T[], fn: (item: T) => U): U[] { }
 *    function filter<T>(arr: T[], fn: (item: T) => boolean): T[] { }
 *
 * 6. 제네릭 클래스
 *    class Box<T> {
 *      constructor(private value: T) {}
 *      getValue(): T { return this.value; }
 *    }
 *
 * 7. 제네릭 메서드
 *    class Container<T> {
 *      map<U>(fn: (value: T) => U): Container<U> { }
 *    }
 *
 * 8. 조건부 타입
 *    type IsArray<T> = T extends any[] ? 'yes' : 'no';
 *
 * 9. 타입 가드
 *    function isString<T>(x: T): x is Extract<T, string> { }
 *
 * 10. 제네릭 유틸리티
 *     - Parameters<T>: 함수 매개변수 타입
 *     - ReturnType<T>: 함수 반환 타입
 *     - Awaited<T>: Promise 언래핑
 *
 * 11. 실전 활용
 *     ✅ API 응답 래퍼
 *     ✅ 배열 유틸리티
 *     ✅ 팩토리 함수
 *     ✅ 데이터 변환
 *     ✅ 타입 안전한 컬렉션
 *
 * 12. Best Practices
 *     ✅ 필요한 곳에만 제네릭 사용
 *     ✅ 제약 조건으로 타입 안전성 확보
 *     ✅ 타입 추론 활용 (명시 최소화)
 *     ✅ 의미 있는 타입 매개변수 이름 (T, U, K, V)
 *     ✅ 복잡하면 타입 별칭 사용
 *
 * 13. 타입 매개변수 네이밍 컨벤션
 *     - T: Type (일반적인 타입)
 *     - K: Key (객체 키)
 *     - V: Value (값)
 *     - E: Element (배열 요소)
 *     - U: 두 번째 타입
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/generics.html
 */
