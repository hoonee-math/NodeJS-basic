/**
 * 01-generic-functions.ts
 * 제네릭 함수 기초
 *
 * any를 쓰면 타입 안전성이 사라지고, 구체적인 타입마다 함수를 만들면 코드 중복이 심해집니다.
 * 제네릭 함수(<T>)를 사용하면 타입을 매개변수처럼 전달해 재사용 가능하면서도 타입 안전한 함수를 만들 수 있습니다.
 * 이 파일에서는
 * 기본 제네릭 함수 문법(<T>),
 * 타입 매개변수 명명 규칙(T, U, K, V 등),
 * 제네릭 화살표 함수,
 * 타입 추론 vs 명시적 타입 지정,
 * 제네릭 배열 함수(map, filter, reduce),
 * 다중 반환 타입,
 * 그리고 제네릭 콜백 함수 패턴을 다룹니다.
 */

// 1. 기본 제네릭 함수 (<T>)
console.log('=== 1. 기본 제네릭 함수 ===');

// ❌ any 사용 - 타입 정보 손실
function badIdentity(arg: any): any {
  return arg;
}

const result1 = badIdentity('hello'); // any 타입 (타입 안전성 없음)

// ✅ 제네릭 사용 - 타입 정보 유지
function identity<T>(arg: T): T {
  return arg;
}

const result2 = identity('hello'); // string 타입 (타입 추론)
const result3 = identity<number>(42); // number 타입 (명시적 지정)

console.log('any version:', result1);
console.log('Generic version:', result2, result3);

// 2. 타입 매개변수 명명 규칙
console.log('\n=== 2. 타입 매개변수 명명 규칙 ===');

// 일반적인 규칙:
// T (Type) - 가장 일반적인 타입 매개변수
// K (Key) - 객체 키
// V (Value) - 값
// E (Element) - 배열 요소
// R (Return) - 반환 타입

function wrapInArray<T>(value: T): T[] {
  return [value];
}

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

console.log('Wrapped:', wrapInArray(10)); // [10]
console.log('Property:', getProperty({ name: 'Alice', age: 30 }, 'name')); // "Alice"

// 3. 제네릭 화살표 함수
console.log('\n=== 3. 제네릭 화살표 함수 ===');

// 화살표 함수도 제네릭으로 만들 수 있음
const reverse = <T>(arr: T[]): T[] => {
  return arr.slice().reverse();
};

const numbers = [1, 2, 3, 4, 5];
const strings = ['a', 'b', 'c'];

console.log('Reversed numbers:', reverse(numbers)); // [5, 4, 3, 2, 1]
console.log('Reversed strings:', reverse(strings)); // ["c", "b", "a"]

// 4. 타입 추론 vs 명시적 타입 지정
console.log('\n=== 4. 타입 추론 vs 명시적 타입 지정 ===');

function createPair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// 타입 추론 (권장)
const pair1 = createPair('hello', 42); // [string, number]

// 명시적 타입 지정 (타입 추론이 어려운 경우)
const pair2 = createPair<string, boolean>('world', true); // [string, boolean]

console.log('Pair 1:', pair1);
console.log('Pair 2:', pair2);

// 5. 제네릭 배열 함수 (map, filter, reduce)
console.log('\n=== 5. 제네릭 배열 함수 ===');

// 커스텀 map 함수
function customMap<T, U>(arr: T[], fn: (item: T) => U): U[] {
  const result: U[] = [];
  for (const item of arr) {
    result.push(fn(item));
  }
  return result;
}

const nums = [1, 2, 3, 4, 5];
const doubled = customMap(nums, (n) => n * 2); // number[]
const stringified = customMap(nums, (n) => `Number: ${n}`); // string[]

console.log('Doubled:', doubled);
console.log('Stringified:', stringified);

// 커스텀 filter 함수
function customFilter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  const result: T[] = [];
  for (const item of arr) {
    if (predicate(item)) {
      result.push(item);
    }
  }
  return result;
}

const evenNumbers = customFilter(nums, (n) => n % 2 === 0);
console.log('Even numbers:', evenNumbers);

// 6. 다중 반환 타입
console.log('\n=== 6. 다중 반환 타입 ===');

function findFirst<T>(arr: T[], predicate: (item: T) => boolean): T | undefined {
  for (const item of arr) {
    if (predicate(item)) {
      return item;
    }
  }
  return undefined;
}

const firstEven = findFirst([1, 3, 5, 8, 9], (n) => n % 2 === 0);
console.log('First even:', firstEven); // 8

const notFound = findFirst([1, 3, 5], (n) => n > 10);
console.log('Not found:', notFound); // undefined

// 7. 제네릭 콜백 함수
console.log('\n=== 7. 제네릭 콜백 함수 ===');

function fetchData<T>(url: string, callback: (data: T) => void): void {
  // 실제로는 fetch를 사용하지만, 여기서는 시뮬레이션
  setTimeout(() => {
    const mockData = { url, timestamp: new Date() } as T;
    callback(mockData);
  }, 100);
}

interface User {
  url: string;
  timestamp: Date;
}

fetchData<User>('/api/user', (data) => {
  console.log('Fetched user data:', data);
});

// 8. 제네릭과 타입 가드 조합
console.log('\n=== 8. 제네릭과 타입 가드 ===');

function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

function ensureArray<T>(value: T | T[]): T[] {
  if (isArray(value)) {
    return value;
  }
  return [value];
}

console.log('Ensure array (single):', ensureArray(10)); // [10]
console.log('Ensure array (array):', ensureArray([10, 20])); // [10, 20]

// 9. 제네릭 기본값 (Default Type Parameters)
console.log('\n=== 9. 제네릭 기본값 ===');

function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

const defaultArray = createArray(3, 'x'); // string[] 추론
const numberArray = createArray<number>(3, 0); // number[] 명시

console.log('Default array:', defaultArray); // ["x", "x", "x"]
console.log('Number array:', numberArray); // [0, 0, 0]

// 10. 실전 예제: 제네릭 유틸리티 함수
console.log('\n=== 10. 실전: 제네릭 유틸리티 함수 ===');

// 배열에서 중복 제거
function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

// 배열 청크로 나누기
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// 배열 평탄화 (1 depth)
function flatten<T>(arr: (T | T[])[]): T[] {
  const result: T[] = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...item);
    } else {
      result.push(item);
    }
  }
  return result;
}

console.log('Unique:', unique([1, 2, 2, 3, 3, 3, 4])); // [1, 2, 3, 4]
console.log('Chunk:', chunk([1, 2, 3, 4, 5, 6], 2)); // [[1, 2], [3, 4], [5, 6]]
console.log('Flatten:', flatten([1, [2, 3], 4, [5]])); // [1, 2, 3, 4, 5]

/**
 * 핵심 정리:
 *
 * 1. 제네릭 함수 기본 문법:
 *    function name<T>(arg: T): T { ... }
 *
 * 2. any vs 제네릭:
 *    - any: 타입 정보 손실, 타입 안전성 없음
 *    - 제네릭: 타입 정보 유지, 재사용 가능
 *
 * 3. 타입 매개변수 명명:
 *    - T (Type), K (Key), V (Value), E (Element), R (Return)
 *
 * 4. 타입 지정 방법:
 *    - 타입 추론: identity('hello') → string
 *    - 명시적 지정: identity<number>(42) → number
 *
 * 5. 제네릭 화살표 함수:
 *    const fn = <T>(arg: T): T => { ... }
 *
 * 6. 제네릭 배열 함수:
 *    - map: T[] → U[]
 *    - filter: T[] → T[]
 *    - reduce: T[] → U
 *
 * 7. 제네릭 기본값:
 *    function fn<T = string>(arg: T) { ... }
 *
 * 8. 실무 활용:
 *    - unique, chunk, flatten 같은 유틸리티 함수
 *    - 타입 안전한 콜백
 *    - 다형성(Polymorphism) 구현
 */
