/**
 * 08-utility-type-creation.ts
 * 커스텀 유틸리티 타입 만들기
 *
 * TypeScript에는 Partial, Pick, Omit 같은 내장 유틸리티 타입이 있지만, 실무에서는 더 특화된 타입이 필요할 때가 많습니다.
 * 제네릭, 조건부 타입, 매핑 타입, infer를 조합하면 프로젝트에 맞는 커스텀 유틸리티 타입을 만들 수 있습니다.
 * 이 파일에서는
 * DeepReadonly로 중첩 객체의 모든 속성을 readonly로 만들기,
 * DeepPartial로 중첩 객체의 모든 속성을 optional로 만들기,
 * RequiredKeys와 OptionalKeys로 필수/선택 프로퍼티 키 추출하기,
 * Mutable로 readonly 제거하기,
 * NonNullableProperties로 null/undefined 프로퍼티 제거하기,
 * PickByType으로 타입별 프로퍼티 선택하기,
 * FunctionKeys로 함수 프로퍼티만 추출하기,
 * 그리고 Promisify로 함수를 Promise 반환으로 변환하는 패턴을 다룹니다.
 */

// 1. DeepReadonly - 깊은 불변성
console.log('=== 1. DeepReadonly ===');

type DeepReadonly<T> = T extends object
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>;
    }
  : T;

interface NestedObject {
  a: {
    b: {
      c: number;
    };
  };
  d: string;
}

type ReadonlyNested = DeepReadonly<NestedObject>;
// {
//   readonly a: {
//     readonly b: {
//       readonly c: number;
//     };
//   };
//   readonly d: string;
// }

const obj: ReadonlyNested = {
  a: { b: { c: 42 } },
  d: 'hello',
};

// obj.a.b.c = 10; // ❌ Error: readonly
console.log('DeepReadonly: All nested properties are readonly');

// 2. DeepPartial - 깊은 선택적 프로퍼티
console.log('\n=== 2. DeepPartial ===');

type DeepPartial<T> = T extends object
  ? {
      [K in keyof T]?: DeepPartial<T[K]>;
    }
  : T;

interface Config {
  server: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
    };
  };
  database: {
    url: string;
    poolSize: number;
  };
}

type PartialConfig = DeepPartial<Config>;

const config1: PartialConfig = {}; // OK
const config2: PartialConfig = {
  server: {
    port: 3000, // host, ssl 생략 가능
  },
};

console.log('DeepPartial: All nested properties are optional');
console.log('Config:', config2);

// 3. RequiredKeys - 필수 프로퍼티 키 추출
console.log('\n=== 3. RequiredKeys ===');

type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

interface User {
  id: number;
  name: string;
  email?: string;
  age?: number;
}

type UserRequiredKeys = RequiredKeys<User>; // "id" | "name"

console.log('RequiredKeys<User>: "id" | "name"');

// 4. OptionalKeys - 선택적 프로퍼티 키 추출
console.log('\n=== 4. OptionalKeys ===');

type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

type UserOptionalKeys = OptionalKeys<User>; // "email" | "age"

console.log('OptionalKeys<User>: "email" | "age"');

// 5. Mutable - readonly 제거
console.log('\n=== 5. Mutable ===');

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

interface ReadonlyUser {
  readonly id: number;
  readonly name: string;
}

type MutableUser = Mutable<ReadonlyUser>;
// {
//   id: number;
//   name: string;
// }

const mutableUser: MutableUser = { id: 1, name: 'Alice' };
mutableUser.name = 'Bob'; // ✅ OK

console.log('Mutable: readonly removed');
console.log('Mutable user:', mutableUser);

// 6. NonNullableProperties - null/undefined 프로퍼티 제거
console.log('\n=== 6. NonNullableProperties ===');

type NonNullableProperties<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

interface NullableUser {
  id: number;
  name: string | null;
  email: string | undefined;
  age: number | null | undefined;
}

type NonNullUser = NonNullableProperties<NullableUser>;
// {
//   id: number;
//   name: string;
//   email: string;
//   age: number;
// }

console.log('NonNullableProperties: null/undefined removed from all properties');

// 7. PickByType - 타입으로 프로퍼티 선택
console.log('\n=== 7. PickByType ===');

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

// 8. OmitByType - 타입으로 프로퍼티 제거
console.log('\n=== 8. OmitByType ===');

type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

type NonStringFields = OmitByType<Article, string>; // { id: number; views: number; published: boolean }

console.log('OmitByType<Article, string>: { id, views, published }');

// 9. FunctionKeys - 함수 프로퍼티만 추출
console.log('\n=== 9. FunctionKeys ===');

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? K : never;
}[keyof T];

interface UserService {
  users: User[];
  getUser: (id: number) => User | undefined;
  addUser: (user: User) => void;
  removeUser: (id: number) => boolean;
}

type UserServiceFunctions = FunctionKeys<UserService>; // "getUser" | "addUser" | "removeUser"

console.log('FunctionKeys<UserService>: "getUser" | "addUser" | "removeUser"');

// 10. FunctionProperties - 함수 프로퍼티만 선택
console.log('\n=== 10. FunctionProperties ===');

type FunctionProperties<T> = Pick<T, FunctionKeys<T>>;

type UserServiceMethods = FunctionProperties<UserService>;
// {
//   getUser: (id: number) => User | undefined;
//   addUser: (user: User) => void;
//   removeUser: (id: number) => boolean;
// }

console.log('FunctionProperties: Only function properties');

// 11. Promisify - 함수를 Promise 반환으로 변환
console.log('\n=== 11. Promisify ===');

type Promisify<T> = T extends (...args: infer P) => infer R
  ? (...args: P) => Promise<R>
  : T;

type SyncFunction = (a: number, b: number) => number;
type AsyncFunction = Promisify<SyncFunction>; // (a: number, b: number) => Promise<number>

console.log('Promisify<SyncFunction>: (a, b) => Promise<number>');

// 12. PromisifyAll - 모든 메서드를 Promise 반환으로 변환
console.log('\n=== 12. PromisifyAll ===');

type PromisifyAll<T> = {
  [K in keyof T]: T[K] extends (...args: infer P) => infer R
    ? (...args: P) => Promise<R>
    : T[K];
};

interface SyncAPI {
  getUser: (id: number) => User;
  deleteUser: (id: number) => boolean;
  count: number;
}

type AsyncAPI = PromisifyAll<SyncAPI>;
// {
//   getUser: (id: number) => Promise<User>;
//   deleteUser: (id: number) => Promise<boolean>;
//   count: number; // 함수가 아니므로 그대로
// }

console.log('PromisifyAll: All methods return Promise');

// 13. Flatten - 유니온 타입 평탄화
console.log('\n=== 13. Flatten ===');

type Flatten<T> = T extends unknown[] ? T[number] : T;

type A = Flatten<(string | number)[]>; // string | number
type B = Flatten<string[]>; // string
type C = Flatten<string>; // string

console.log('Flatten<(string | number)[]>: string | number');
console.log('Flatten<string[]>: string');
console.log('Flatten<string>: string');

// 14. DeepMutable - readonly를 재귀적으로 제거
console.log('\n=== 14. DeepMutable ===');

type DeepMutable<T> = T extends object
  ? {
      -readonly [K in keyof T]: DeepMutable<T[K]>;
    }
  : T;

type DeepReadonlyNested = DeepReadonly<NestedObject>;
type DeepMutableNested = DeepMutable<DeepReadonlyNested>;
// readonly가 모두 제거됨

console.log('DeepMutable: All readonly removed recursively');

/**
 * 핵심 정리:
 *
 * 1. 재귀 유틸리티 타입:
 *    - DeepReadonly: 중첩 readonly
 *    - DeepPartial: 중첩 optional
 *    - DeepMutable: 중첩 readonly 제거
 *
 * 2. 키 추출 타입:
 *    - RequiredKeys: 필수 프로퍼티 키
 *    - OptionalKeys: 선택 프로퍼티 키
 *    - FunctionKeys: 함수 프로퍼티 키
 *
 * 3. 프로퍼티 선택 타입:
 *    - PickByType: 타입으로 선택
 *    - OmitByType: 타입으로 제거
 *    - FunctionProperties: 함수만 선택
 *
 * 4. 타입 변환:
 *    - Mutable: readonly 제거
 *    - NonNullableProperties: null/undefined 제거
 *    - Promisify: Promise 반환으로 변환
 *
 * 5. 고급 패턴:
 *    - 조건부 타입 + 매핑 타입
 *    - infer로 타입 추출
 *    - 재귀적 타입 변환
 *
 * 6. 실무 활용:
 *    - DeepPartial: Config 오버라이드
 *    - PickByType: 타입별 필터링
 *    - PromisifyAll: Sync → Async 변환
 *
 * 7. 유틸리티 타입 조합:
 *    - 여러 유틸리티 타입 중첩
 *    - Pick<T, FunctionKeys<T>>
 *    - DeepReadonly<DeepPartial<T>>
 */
