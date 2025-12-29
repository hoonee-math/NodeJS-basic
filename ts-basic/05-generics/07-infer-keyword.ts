/**
 * 07-infer-keyword.ts
 * infer로 타입 추출
 *
 * 조건부 타입에서 infer 키워드를 사용하면 타입의 일부를 추론하여 꺼낼 수 있습니다.
 * 함수의 반환 타입이나 Promise의 값 타입처럼 구조 안에 숨겨진 타입을 자동으로 추출할 때 유용합니다.
 * 이 파일에서는
 * infer 키워드 기초와 문법,
 * 함수 반환 타입 추출(infer R),
 * 함수 매개변수 타입 추출,
 * 배열 요소 타입 추출,
 * Promise 타입 추출(Awaited<T>),
 * 중첩 타입에서 여러 번 infer 사용하기,
 * 튜플에서 첫/마지막 요소 추출하기,
 * 그리고 API 응답 타입 자동 추출 같은 실전 패턴을 다룹니다.
 */

// 1. infer 키워드 기초
console.log('=== 1. infer 키워드 기초 ===');

// infer는 조건부 타입 내에서만 사용 가능
// T extends SomePattern<infer U> ? U : never

type GetValueType<T> = T extends { value: infer V } ? V : never;

type A = GetValueType<{ value: string }>; // string
type B = GetValueType<{ value: number }>; // number
type C = GetValueType<{ other: boolean }>; // never

console.log('GetValueType<{ value: string }>: string');
console.log('GetValueType<{ value: number }>: number');
console.log('GetValueType<{ other: boolean }>: never');

// 2. 함수 반환 타입 추출 (infer R)
console.log('\n=== 2. 함수 반환 타입 추출 ===');

type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

function getString(): string {
  return 'hello';
}

function getNumber(): number {
  return 42;
}

function getObject(): { name: string; age: number } {
  return { name: 'Alice', age: 30 };
}

type D = ReturnType<typeof getString>; // string
type E = ReturnType<typeof getNumber>; // number
type F = ReturnType<typeof getObject>; // { name: string; age: number }

console.log('ReturnType<typeof getString>: string');
console.log('ReturnType<typeof getNumber>: number');
console.log('ReturnType<typeof getObject>: { name: string; age: number }');

// 3. 함수 매개변수 타입 추출
console.log('\n=== 3. 함수 매개변수 타입 추출 ===');

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;

function greet(name: string, age: number): void {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

function calculate(a: number, b: number, operation: string): number {
  return operation === 'add' ? a + b : a - b;
}

type G = Parameters<typeof greet>; // [string, number]
type H = Parameters<typeof calculate>; // [number, number, string]

const params1: G = ['Alice', 30];
const params2: H = [10, 5, 'add'];

console.log('Parameters<typeof greet>:', params1);
console.log('Parameters<typeof calculate>:', params2);

// 4. 배열 요소 타입 추출
console.log('\n=== 4. 배열 요소 타입 추출 ===');

type ElementType<T> = T extends (infer E)[] ? E : never;

type I = ElementType<string[]>; // string
type J = ElementType<number[]>; // number
type K = ElementType<{ id: number; name: string }[]>; // { id: number; name: string }

console.log('ElementType<string[]>: string');
console.log('ElementType<number[]>: number');
console.log('ElementType<{ id, name }[]>: { id: number; name: string }');

// 5. Promise 타입 추출 (Awaited<T>)
console.log('\n=== 5. Promise 타입 추출 ===');

type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type L = Awaited<Promise<string>>; // string
type M = Awaited<Promise<Promise<number>>>; // number (재귀적으로 언래핑)
type N = Awaited<string>; // string (Promise가 아니면 그대로)

console.log('Awaited<Promise<string>>: string');
console.log('Awaited<Promise<Promise<number>>>: number');
console.log('Awaited<string>: string');

async function fetchUser(): Promise<{ id: number; name: string }> {
  return { id: 1, name: 'Alice' };
}

type UserData = Awaited<ReturnType<typeof fetchUser>>; // { id: number; name: string }

console.log('Awaited<ReturnType<typeof fetchUser>>: { id: number; name: string }');

// 6. 중첩 타입에서 여러 번 infer 사용
console.log('\n=== 6. 중첩 타입에서 여러 번 infer ===');

type UnwrapArray<T> = T extends Array<infer U>
  ? U extends Array<infer V>
    ? V
    : U
  : T;

type O = UnwrapArray<string[][]>; // string
type P = UnwrapArray<number[]>; // number
type Q = UnwrapArray<boolean>; // boolean

console.log('UnwrapArray<string[][]>: string');
console.log('UnwrapArray<number[]>: number');
console.log('UnwrapArray<boolean>: boolean');

// 7. 튜플에서 첫 요소 추출
console.log('\n=== 7. 튜플에서 첫 요소 추출 ===');

type First<T extends unknown[]> = T extends [infer F, ...unknown[]] ? F : never;

type R = First<[string, number, boolean]>; // string
type S = First<[number]>; // number
type T = First<[]>; // never

console.log('First<[string, number, boolean]>: string');
console.log('First<[number]>: number');
console.log('First<[]>: never');

// 8. 튜플에서 마지막 요소 추출
console.log('\n=== 8. 튜플에서 마지막 요소 추출 ===');

type Last<T extends unknown[]> = T extends [...unknown[], infer L] ? L : never;

type U = Last<[string, number, boolean]>; // boolean
type V = Last<[number]>; // number
type W = Last<[]>; // never

console.log('Last<[string, number, boolean]>: boolean');
console.log('Last<[number]>: number');
console.log('Last<[]>: never');

// 9. 튜플에서 첫 요소 제거
console.log('\n=== 9. 튜플에서 첫 요소 제거 ===');

type Tail<T extends unknown[]> = T extends [unknown, ...infer Rest] ? Rest : [];

type X = Tail<[string, number, boolean]>; // [number, boolean]
type Y = Tail<[number]>; // []
type Z = Tail<[]>; // []

console.log('Tail<[string, number, boolean]>: [number, boolean]');
console.log('Tail<[number]>: []');
console.log('Tail<[]>: []');

// 10. 함수의 첫 번째 인자 타입 추출
console.log('\n=== 10. 함수의 첫 번째 인자 타입 추출 ===');

type FirstParameter<T> = T extends (arg: infer P, ...args: unknown[]) => unknown
  ? P
  : never;

function example(name: string, age: number, active: boolean): void {
  console.log(name, age, active);
}

type AA = FirstParameter<typeof example>; // string

console.log('FirstParameter<typeof example>: string');

// 11. 실전: API 응답 타입 추출
console.log('\n=== 11. 실전: API 응답 타입 추출 ===');

type ExtractData<T> = T extends { data: infer D } ? D : never;

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

type UserResponse = ApiResponse<{ id: number; name: string; email: string }>;
type BB = ExtractData<UserResponse>; // { id: number; name: string; email: string }

console.log('ExtractData<UserResponse>: { id, name, email }');

// 12. 실전: 이벤트 핸들러 타입 추출
console.log('\n=== 12. 실전: 이벤트 핸들러 타입 추출 ===');

type ExtractEventType<T> = T extends (event: infer E) => unknown ? E : never;

type ClickHandler = (event: MouseEvent) => void;
type KeyPressHandler = (event: KeyboardEvent) => void;

type CC = ExtractEventType<ClickHandler>; // MouseEvent
type DD = ExtractEventType<KeyPressHandler>; // KeyboardEvent

console.log('ExtractEventType<ClickHandler>: MouseEvent');
console.log('ExtractEventType<KeyPressHandler>: KeyboardEvent');

// 13. 실전: 생성자 매개변수 타입 추출
console.log('\n=== 13. 실전: 생성자 매개변수 타입 추출 ===');

type ConstructorParameters<T> = T extends new (...args: infer P) => unknown ? P : never;

class User {
  constructor(
    public name: string,
    public age: number
  ) {}
}

type EE = ConstructorParameters<typeof User>; // [string, number]

const userParams: EE = ['Alice', 30];
console.log('ConstructorParameters<typeof User>:', userParams);

// 14. 실전: 인스턴스 타입 추출
console.log('\n=== 14. 실전: 인스턴스 타입 추출 ===');

type InstanceType<T> = T extends new (...args: unknown[]) => infer I ? I : never;

class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number
  ) {}
}

type FF = InstanceType<typeof Product>; // Product

console.log('InstanceType<typeof Product>: Product');

/**
 * 핵심 정리:
 *
 * 1. infer 키워드:
 *    - 조건부 타입 내에서만 사용
 *    - T extends Pattern<infer U> ? U : never
 *
 * 2. 함수 타입 추출:
 *    - ReturnType: (...args) => infer R
 *    - Parameters: (...args: infer P) => unknown
 *    - FirstParameter: (arg: infer P, ...args) => unknown
 *
 * 3. 배열/튜플 타입 추출:
 *    - ElementType: (infer E)[]
 *    - First: [infer F, ...unknown[]]
 *    - Last: [...unknown[], infer L]
 *    - Tail: [unknown, ...infer Rest]
 *
 * 4. Promise 언래핑:
 *    - Awaited: Promise<infer U> (재귀적)
 *
 * 5. 생성자 타입 추출:
 *    - ConstructorParameters: new (...args: infer P) => unknown
 *    - InstanceType: new (...args) => infer I
 *
 * 6. 실무 활용:
 *    - API 응답 데이터 타입 추출
 *    - 이벤트 핸들러 타입 추출
 *    - 함수/클래스 시그니처 분석
 *
 * 7. infer의 위치:
 *    - 함수 반환: => infer R
 *    - 함수 인자: (infer P)
 *    - 배열 요소: (infer E)[]
 *    - 객체 프로퍼티: { value: infer V }
 *    - 튜플 요소: [infer F, ...infer Rest]
 *
 * 8. 주의사항:
 *    - infer는 extends 절에서만 사용
 *    - 여러 번 infer 가능 (중첩)
 *    - 재귀적으로 사용 가능
 */
