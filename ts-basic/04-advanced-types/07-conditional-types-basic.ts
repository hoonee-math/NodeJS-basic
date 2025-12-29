/**
 * 07-conditional-types-basic.ts
 * 조건부 타입 (Conditional Types) 기초
 * 고급 내용은 05-generics에서 다룹니다.
 */

// 1. 기본 조건부 타입 (T extends U ? X : Y)
console.log('=== 1. 기본 조건부 타입 ===');

// T가 U를 확장(상속)하면 X, 아니면 Y
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
type C = IsString<'hello'>; // "yes" (string literal은 string 확장)

const a: A = 'yes';
const b: B = 'no';
const c: C = 'yes';

console.log('IsString<string>:', a);
console.log('IsString<number>:', b);
console.log('IsString<"hello">:', c);

// 2. extends 키워드 이해
console.log('\n=== 2. extends 키워드 ===');

// extends는 "확장하다", "포함하다", "할당 가능하다"의 의미
type IsArray<T> = T extends unknown[] ? 'array' : 'not array';

type D = IsArray<string[]>; // "array"
type E = IsArray<number>; // "not array"

console.log('IsArray<string[]>:', 'array' as D);
console.log('IsArray<number>:', 'not array' as E);

// 3. 조건부 타입으로 타입 필터링
console.log('\n=== 3. 타입 필터링 ===');

// 원시 타입만 추출
type ExtractPrimitive<T> = T extends string | number | boolean ? T : never;

type F = ExtractPrimitive<string>; // string
type G = ExtractPrimitive<number[]>; // never

console.log('ExtractPrimitive<string>: string');
console.log('ExtractPrimitive<number[]>: never');

// 4. 타입 분배 (Distributive Conditional Types)
console.log('\n=== 4. 타입 분배 ===');

// 유니온 타입에 적용하면 각 멤버에 분배됨
type ToArray<T> = T extends unknown ? T[] : never;

type H = ToArray<string | number>; // string[] | number[] (분배됨)

// 분배 방지: 대괄호로 감싸기
type ToArrayNonDistributive<T> = [T] extends [unknown] ? T[] : never;

type I = ToArrayNonDistributive<string | number>; // (string | number)[]

console.log('ToArray<string | number>: string[] | number[] (분배)');
console.log('ToArrayNonDistributive<string | number>: (string | number)[] (분배 안 됨)');

// 5. infer 키워드 기초
console.log('\n=== 5. infer 키워드 기초 ===');

// 함수 반환 타입 추출
type ReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

function getString(): string {
  return 'hello';
}

function getNumber(): number {
  return 42;
}

type J = ReturnType<typeof getString>; // string
type K = ReturnType<typeof getNumber>; // number

const j: J = 'hello';
const k: K = 42;

console.log('ReturnType<getString>:', j);
console.log('ReturnType<getNumber>:', k);

// 6. 배열 요소 타입 추출 (infer)
console.log('\n=== 6. 배열 요소 타입 추출 ===');

type ElementType<T> = T extends (infer E)[] ? E : never;

type L = ElementType<string[]>; // string
type M = ElementType<number[]>; // number
type N = ElementType<boolean>; // never

console.log('ElementType<string[]>: string');
console.log('ElementType<number[]>: number');
console.log('ElementType<boolean>: never');

// 7. 내장 조건부 타입: Exclude
console.log('\n=== 7. Exclude<T, U> ===');

// T에서 U에 할당 가능한 타입 제거
type MyExclude<T, U> = T extends U ? never : T;

type O = Exclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
type P = Exclude<string | number | boolean, boolean>; // string | number

console.log('Exclude<"a" | "b" | "c", "a">: "b" | "c"');
console.log('Exclude<string | number | boolean, boolean>: string | number');

// 8. 내장 조건부 타입: Extract
console.log('\n=== 8. Extract<T, U> ===');

// T에서 U에 할당 가능한 타입만 추출
type MyExtract<T, U> = T extends U ? T : never;

type Q = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // "a"
type R = Extract<string | number | boolean, boolean>; // boolean

console.log('Extract<"a" | "b" | "c", "a" | "f">: "a"');
console.log('Extract<string | number | boolean, boolean>: boolean');

// 9. 내장 조건부 타입: NonNullable
console.log('\n=== 9. NonNullable<T> ===');

// T에서 null과 undefined 제거
type MyNonNullable<T> = T extends null | undefined ? never : T;

type S = NonNullable<string | null | undefined>; // string
type T = NonNullable<number | null>; // number

console.log('NonNullable<string | null | undefined>: string');
console.log('NonNullable<number | null>: number');

// 10. 실전 예제: API 응답 타입 추출
console.log('\n=== 10. 실전: API 응답 타입 ===');

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ApiResponse에서 data 타입만 추출
type ExtractData<T> = T extends ApiResponse<infer D> ? D : never;

type UserData = ExtractData<ApiResponse<{ id: number; name: string }>>; // { id: number; name: string }

const userData: UserData = { id: 1, name: 'Alice' };
console.log('Extracted data:', userData);

// 11. 실전 예제: 함수 매개변수 타입 추출
console.log('\n=== 11. 실전: 함수 매개변수 타입 ===');

type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;

function greet(name: string, age: number): void {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

type GreetParams = Parameters<typeof greet>; // [string, number]

const params: GreetParams = ['Bob', 25];
console.log('Greet parameters:', params);

// 12. 실전 예제: Promise 언래핑
console.log('\n=== 12. 실전: Promise 언래핑 ===');

type Awaited<T> = T extends Promise<infer U> ? U : T;

type U = Awaited<Promise<string>>; // string
type V = Awaited<Promise<number>>; // number
type W = Awaited<string>; // string (Promise가 아니면 그대로)

console.log('Awaited<Promise<string>>: string');
console.log('Awaited<Promise<number>>: number');
console.log('Awaited<string>: string');

// 13. 실전 예제: 읽기 전용 타입 만들기
console.log('\n=== 13. 실전: 읽기 전용 타입 ===');

type IsReadonly<T, K extends keyof T> = {
  readonly [P in K]: T[P];
} extends { [P in K]: T[P] }
  ? false
  : true;

// 조건부 타입으로 필드 선택
type OnlyFunctions<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  getName: () => string;
  setName: (name: string) => void;
}

type UserFunctions = OnlyFunctions<User>; // "getName" | "setName"

console.log('User functions: getName, setName');

// 14. 조건부 타입 중첩
console.log('\n=== 14. 조건부 타입 중첩 ===');

type TypeName<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends undefined
        ? 'undefined'
        : T extends (...args: unknown[]) => unknown
          ? 'function'
          : 'object';

type X = TypeName<string>; // "string"
type Y = TypeName<42>; // "number"
type Z = TypeName<() => void>; // "function"

console.log('TypeName<string>: "string"');
console.log('TypeName<42>: "number"');
console.log('TypeName<() => void>: "function"');

/**
 * 핵심 정리:
 *
 * 1. 조건부 타입: T extends U ? X : Y
 *    - T가 U를 확장하면 X, 아니면 Y
 *
 * 2. extends 의미:
 *    - "확장하다", "포함하다", "할당 가능하다"
 *
 * 3. 타입 분배 (Distributive):
 *    - 유니온 타입에 적용하면 각 멤버에 분배
 *    - [T] extends [U]로 분배 방지 가능
 *
 * 4. infer 키워드:
 *    - 타입 추론 (함수 반환 타입, 배열 요소 타입 등)
 *
 * 5. 내장 조건부 타입:
 *    - Exclude<T, U>: T에서 U 제거
 *    - Extract<T, U>: T에서 U만 추출
 *    - NonNullable<T>: null/undefined 제거
 *
 * 6. 실무 활용:
 *    - 함수 반환 타입 추출 (ReturnType)
 *    - 함수 매개변수 타입 추출 (Parameters)
 *    - Promise 언래핑 (Awaited)
 *    - 특정 타입만 필터링
 *
 * 7. 고급 내용:
 *    - 제네릭과 조합
 *    - 재귀 조건부 타입
 *    - 매핑 타입과 조합
 *    → 05-generics에서 학습
 */
