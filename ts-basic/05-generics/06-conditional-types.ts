/**
 * 06-conditional-types.ts
 * 조건부 타입 고급
 *
 * 조건부 타입(T extends U ? X : Y)을 사용하면 타입을 동적으로 분기할 수 있습니다.
 * 04-advanced-types에서 기초를 배웠다면, 이제 분배 법칙, 재귀, 유니온 필터링 같은 고급 패턴을 다룹니다.
 * 이 파일에서는
 * 조건부 타입 기본 복습,
 * 분배 법칙(Distributive Conditional Types)으로 유니온 각 멤버에 조건 적용하기,
 * 중첩 조건부 타입으로 복잡한 분기 만들기,
 * 조건부 타입과 never로 불가능한 타입 표현하기,
 * 내장 조건부 타입(Exclude, Extract, NonNullable, ReturnType, Parameters) 이해하기,
 * 재귀 조건부 타입으로 깊은 타입 변환하기,
 * 그리고 조건부 타입으로 유니온 필터링하는 패턴을 다룹니다.
 */

// 1. 조건부 타입 기본 복습
console.log('=== 1. 조건부 타입 기본 ===');

type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // "yes"
type B = IsString<number>; // "no"
type C = IsString<'hello'>; // "yes"

const a: A = 'yes';
const b: B = 'no';
const c: C = 'yes';

console.log('IsString<string>:', a);
console.log('IsString<number>:', b);
console.log('IsString<"hello">:', c);

// 2. 분배 법칙 (Distributive Conditional Types)
console.log('\n=== 2. 분배 법칙 ===');

type ToArray<T> = T extends unknown ? T[] : never;

// 유니온 타입에 적용하면 각 멤버에 분배됨
type D = ToArray<string | number>; // string[] | number[]

// 분배 방지: 대괄호로 감싸기
type ToArrayNonDistributive<T> = [T] extends [unknown] ? T[] : never;
type E = ToArrayNonDistributive<string | number>; // (string | number)[]

console.log('Distributive: string[] | number[]');
console.log('Non-distributive: (string | number)[]');

// 3. 중첩 조건부 타입
console.log('\n=== 3. 중첩 조건부 타입 ===');

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

type F = TypeName<string>; // "string"
type G = TypeName<42>; // "number"
type H = TypeName<() => void>; // "function"
type I = TypeName<{}>; // "object"

console.log('TypeName<string>: "string"');
console.log('TypeName<42>: "number"');
console.log('TypeName<() => void>: "function"');
console.log('TypeName<{}>: "object"');

// 4. 조건부 타입과 never
console.log('\n=== 4. 조건부 타입과 never ===');

type ExtractStrings<T> = T extends string ? T : never;

type J = ExtractStrings<string | number | boolean>; // string
type K = ExtractStrings<number>; // never

console.log('ExtractStrings<string | number | boolean>: string');
console.log('ExtractStrings<number>: never');

// 5. 내장 조건부 타입: Exclude
console.log('\n=== 5. Exclude<T, U> ===');

// T에서 U에 할당 가능한 타입 제거
type MyExclude<T, U> = T extends U ? never : T;

type L = Exclude<'a' | 'b' | 'c', 'a'>; // "b" | "c"
type M = Exclude<string | number | boolean, boolean>; // string | number

console.log('Exclude<"a" | "b" | "c", "a">: "b" | "c"');
console.log('Exclude<string | number | boolean, boolean>: string | number');

// 6. 내장 조건부 타입: Extract
console.log('\n=== 6. Extract<T, U> ===');

// T에서 U에 할당 가능한 타입만 추출
type MyExtract<T, U> = T extends U ? T : never;

type N = Extract<'a' | 'b' | 'c', 'a' | 'f'>; // "a"
type O = Extract<string | number | boolean, boolean>; // boolean

console.log('Extract<"a" | "b" | "c", "a" | "f">: "a"');
console.log('Extract<string | number | boolean, boolean>: boolean');

// 7. 내장 조건부 타입: NonNullable
console.log('\n=== 7. NonNullable<T> ===');

// T에서 null과 undefined 제거
type MyNonNullable<T> = T extends null | undefined ? never : T;

type P = NonNullable<string | null | undefined>; // string
type Q = NonNullable<number | null>; // number

console.log('NonNullable<string | null | undefined>: string');
console.log('NonNullable<number | null>: number');

// 8. 내장 조건부 타입: ReturnType
console.log('\n=== 8. ReturnType<T> ===');

// 함수 반환 타입 추출
type MyReturnType<T> = T extends (...args: unknown[]) => infer R ? R : never;

function getString(): string {
  return 'hello';
}

function getNumber(): number {
  return 42;
}

type R = ReturnType<typeof getString>; // string
type S = ReturnType<typeof getNumber>; // number

console.log('ReturnType<typeof getString>: string');
console.log('ReturnType<typeof getNumber>: number');

// 9. 내장 조건부 타입: Parameters
console.log('\n=== 9. Parameters<T> ===');

// 함수 매개변수 타입 추출
type MyParameters<T> = T extends (...args: infer P) => unknown ? P : never;

function greet(name: string, age: number): void {
  console.log(`Hello, ${name}! You are ${age} years old.`);
}

type T = Parameters<typeof greet>; // [string, number]

const params: T = ['Alice', 30];
console.log('Parameters<typeof greet>:', params);

// 10. 재귀 조건부 타입
console.log('\n=== 10. 재귀 조건부 타입 ===');

// 배열을 평탄화 (깊이 무제한)
type DeepFlatten<T> = T extends (infer U)[]
  ? U extends unknown[]
    ? DeepFlatten<U>
    : U
  : T;

type U = DeepFlatten<number[][][]>; // number

console.log('DeepFlatten<number[][][]>: number');

// 깊은 Readonly
type DeepReadonly<T> = T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

interface NestedObject {
  a: {
    b: {
      c: number;
    };
  };
}

type V = DeepReadonly<NestedObject>;
// {
//   readonly a: {
//     readonly b: {
//       readonly c: number;
//     };
//   };
// }

console.log('DeepReadonly: All properties are readonly recursively');

// 11. 조건부 타입으로 유니온 필터링
console.log('\n=== 11. 유니온 필터링 ===');

type FilterByType<T, U> = T extends U ? T : never;

type OnlyStrings = FilterByType<string | number | boolean, string>; // string
type OnlyNumbers = FilterByType<string | number | boolean, number>; // number

console.log('FilterByType<string | number | boolean, string>: string');
console.log('FilterByType<string | number | boolean, number>: number');

// 12. 실전: 함수 타입 필터
console.log('\n=== 12. 실전: 함수 타입 필터 ===');

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

interface User {
  id: number;
  name: string;
  getName: () => string;
  setName: (name: string) => void;
  age: number;
}

type UserFunctionKeys = FunctionKeys<User>; // "getName" | "setName"

console.log('User function keys: "getName" | "setName"');

// 13. 실전: Promise 언래핑
console.log('\n=== 13. 실전: Promise 언래핑 ===');

type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

type W = Awaited<Promise<string>>; // string
type X = Awaited<Promise<Promise<number>>>; // number (재귀적으로 언래핑)
type Y = Awaited<string>; // string (Promise가 아니면 그대로)

console.log('Awaited<Promise<string>>: string');
console.log('Awaited<Promise<Promise<number>>>: number');
console.log('Awaited<string>: string');

// 14. 실전: 객체 키 필터링
console.log('\n=== 14. 실전: 객체 키 필터링 ===');

type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

interface Article {
  id: number;
  title: string;
  content: string;
  views: number;
  published: boolean;
}

type StringFields = PickByType<Article, string>; // { title: string; content: string }
type NumberFields = PickByType<Article, number>; // { id: number; views: number }

console.log('PickByType<Article, string>: { title, content }');
console.log('PickByType<Article, number>: { id, views }');

/**
 * 핵심 정리:
 *
 * 1. 조건부 타입 기본:
 *    T extends U ? X : Y
 *
 * 2. 분배 법칙 (Distributive):
 *    - T가 유니온이면 각 멤버에 적용
 *    - [T] extends [U]로 분배 방지
 *
 * 3. 중첩 조건부 타입:
 *    - 여러 조건을 연쇄적으로 체크
 *    - if-else-if-else와 유사
 *
 * 4. never 타입 활용:
 *    - 조건에 맞지 않으면 never
 *    - 유니온에서 never는 제거됨
 *
 * 5. 내장 조건부 타입:
 *    - Exclude<T, U>: T에서 U 제거
 *    - Extract<T, U>: T에서 U만 추출
 *    - NonNullable<T>: null/undefined 제거
 *    - ReturnType<T>: 함수 반환 타입
 *    - Parameters<T>: 함수 매개변수 타입
 *
 * 6. 재귀 조건부 타입:
 *    - DeepReadonly, DeepPartial
 *    - Awaited (Promise 언래핑)
 *    - DeepFlatten (배열 평탄화)
 *
 * 7. 유니온 필터링:
 *    - FilterByType<T, U>
 *    - PickByType<T, U>
 *    - FunctionKeys<T>
 *
 * 8. 실무 활용:
 *    - 타입 추출 및 변환
 *    - 유틸리티 타입 제작
 *    - 타입 안전성 강화
 */
