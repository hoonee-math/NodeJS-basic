/**
 * 08-mapped-types-basic.ts
 * 매핑 타입 (Mapped Types) 기초
 *
 * 기존 타입의 모든 프로퍼티를 순회하면서 새로운 타입으로 변환하고 싶을 때 매핑 타입({ [K in keyof T]: ... })을 사용합니다.
 * 이 파일에서는 
 * keyof로 모든 키 추출하기, 
 * in 연산자로 타입 순회하기, 
 * readonly/optional(?) 수정자 추가 및 제거(-readonly, -?), 
 * 모든 프로퍼티를 다른 타입으로 변환하기, 
 * 템플릿 리터럴과 as 키워드로 키 이름 변경하기, 
 * 내장 매핑 타입(Partial, Required, Readonly, Pick, Omit) 이해하기, 
 * 그리고 얕은(Shallow) 변환과 깊은(Deep) 변환의 차이를 다룹니다.
 * 고급 내용(재귀 매핑 타입 등)은 06-utility-types에서 다룹니다.
 */

// 1. 기본 매핑 타입 ({ [K in keyof T]: ... })
console.log('=== 1. 기본 매핑 타입 ===');

interface User {
  id: number;
  name: string;
  email: string;
}

// 모든 프로퍼티를 string으로 변환
type StringifyUser = {
  [K in keyof User]: string;
};

const stringUser: StringifyUser = {
  id: '123', // string
  name: 'Alice',
  email: 'alice@example.com',
};

console.log('Stringified user:', stringUser);

// 2. keyof 연산자
console.log('\n=== 2. keyof 연산자 ===');

// keyof는 객체 타입의 모든 키를 유니온으로 추출
type UserKeys = keyof User; // "id" | "name" | "email"

const key1: UserKeys = 'id';
const key2: UserKeys = 'name';
// const key3: UserKeys = 'age'; // ❌ Error: 'age'는 User에 없음

console.log('User keys:', key1, key2);

// 3. in 연산자로 순회
console.log('\n=== 3. in 연산자 순회 ===');

type Flags = {
  [K in 'option1' | 'option2' | 'option3']: boolean;
};

const flags: Flags = {
  option1: true,
  option2: false,
  option3: true,
};

console.log('Flags:', flags);

// 4. 프로퍼티 수정자: readonly 추가
console.log('\n=== 4. readonly 수정자 추가 ===');

type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

const readonlyUser: ReadonlyUser = {
  id: 1,
  name: 'Bob',
  email: 'bob@example.com',
};

// readonlyUser.name = 'Charlie'; // ❌ Error: readonly 프로퍼티
console.log('Readonly user:', readonlyUser);

// 5. 프로퍼티 수정자: optional (?) 추가
console.log('\n=== 5. optional (?) 수정자 추가 ===');

type PartialUser = {
  [K in keyof User]?: User[K];
};

const partialUser1: PartialUser = {
  name: 'Charlie',
}; // id, email은 optional

const partialUser2: PartialUser = {}; // 모든 프로퍼티 optional

console.log('Partial user 1:', partialUser1);
console.log('Partial user 2:', partialUser2);

// 6. 프로퍼티 수정자: readonly, optional 동시 추가
console.log('\n=== 6. readonly + optional ===');

type ReadonlyPartialUser = {
  readonly [K in keyof User]?: User[K];
};

const rpUser: ReadonlyPartialUser = {
  name: 'David',
};

// rpUser.name = 'Eve'; // ❌ Error: readonly
console.log('Readonly partial user:', rpUser);

// 7. 수정자 제거: -readonly, -?
console.log('\n=== 7. 수정자 제거 ===');

interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

// readonly 제거
type MutablePerson = {
  -readonly [K in keyof ReadonlyPerson]: ReadonlyPerson[K];
};

const mutablePerson: MutablePerson = {
  name: 'Frank',
  age: 30,
};

mutablePerson.name = 'George'; // ✅ OK: readonly 제거됨
console.log('Mutable person:', mutablePerson);

// optional 제거
interface OptionalAddress {
  street?: string;
  city?: string;
}

type RequiredAddress = {
  [K in keyof OptionalAddress]-?: OptionalAddress[K];
};

const requiredAddress: RequiredAddress = {
  street: '123 Main St', // 필수
  city: 'Seoul', // 필수
};

console.log('Required address:', requiredAddress);

// 8. 타입 변환: 모든 프로퍼티를 배열로
console.log('\n=== 8. 타입 변환: 배열로 ===');

type ArrayifyUser = {
  [K in keyof User]: User[K][];
};

const arrayUser: ArrayifyUser = {
  id: [1, 2, 3],
  name: ['Alice', 'Bob'],
  email: ['alice@example.com'],
};

console.log('Array user:', arrayUser);

// 9. 템플릿 리터럴과 매핑 타입
console.log('\n=== 9. 템플릿 리터럴과 매핑 타입 ===');

type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Product {
  id: number;
  name: string;
  price: number;
}

type ProductGetters = Getters<Product>;
// {
//   getId: () => number;
//   getName: () => string;
//   getPrice: () => number;
// }

const productGetters: ProductGetters = {
  getId: () => 1,
  getName: () => 'Laptop',
  getPrice: () => 1000,
};

console.log('Product getters:', {
  id: productGetters.getId(),
  name: productGetters.getName(),
  price: productGetters.getPrice(),
});

// 10. 내장 매핑 타입: Partial
console.log('\n=== 10. Partial<T> ===');

// 모든 프로퍼티를 optional로
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

type PartialProduct = Partial<Product>;

const partialProduct: PartialProduct = {
  name: 'Mouse', // id, price는 optional
};

console.log('Partial product:', partialProduct);

// 11. 내장 매핑 타입: Required
console.log('\n=== 11. Required<T> ===');

// 모든 프로퍼티를 필수로
type MyRequired<T> = {
  [K in keyof T]-?: T[K];
};

interface Config {
  apiUrl?: string;
  timeout?: number;
}

type RequiredConfig = Required<Config>;

const config: RequiredConfig = {
  apiUrl: 'https://api.example.com', // 필수
  timeout: 5000, // 필수
};

console.log('Required config:', config);

// 12. 내장 매핑 타입: Readonly
console.log('\n=== 12. Readonly<T> ===');

// 모든 프로퍼티를 readonly로
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyProduct = Readonly<Product>;

const readonlyProduct: ReadonlyProduct = {
  id: 2,
  name: 'Keyboard',
  price: 50,
};

// readonlyProduct.price = 60; // ❌ Error: readonly
console.log('Readonly product:', readonlyProduct);

// 13. 내장 매핑 타입: Pick
console.log('\n=== 13. Pick<T, K> ===');

// T에서 K 프로퍼티만 선택
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type ProductSummary = Pick<Product, 'id' | 'name'>;

const productSummary: ProductSummary = {
  id: 3,
  name: 'Monitor',
  // price 없음
};

console.log('Product summary:', productSummary);

// 14. 내장 매핑 타입: Omit
console.log('\n=== 14. Omit<T, K> ===');

// T에서 K 프로퍼티 제거
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type ProductWithoutPrice = Omit<Product, 'price'>;

const productWithoutPrice: ProductWithoutPrice = {
  id: 4,
  name: 'Mouse',
  // price 없음
};

console.log('Product without price:', productWithoutPrice);

// 15. 실전: 중첩된 객체 타입 변환
console.log('\n=== 15. 실전: 중첩된 객체 타입 변환 ===');

interface NestedUser {
  id: number;
  profile: {
    name: string;
    age: number;
  };
}

// 1단계만 Partial (중첩 객체는 그대로)
type ShallowPartialUser = Partial<NestedUser>;

const shallowPartial: ShallowPartialUser = {
  profile: {
    name: 'Helen',
    age: 28, // age는 필수 (Partial이 1단계만 적용)
  },
};

console.log('Shallow partial user:', shallowPartial);

// 깊은 Partial은 재귀적으로 구현 필요 (고급, 06-utility-types에서 학습)

/**
 * 핵심 정리:
 *
 * 1. 매핑 타입: { [K in keyof T]: ... }
 *    - 객체 타입의 모든 프로퍼티 순회
 *    - 타입 변환, 수정자 추가/제거
 *
 * 2. keyof 연산자:
 *    - 객체 타입의 모든 키를 유니온으로 추출
 *
 * 3. in 연산자:
 *    - 타입 순회 (for...in과 유사)
 *
 * 4. 프로퍼티 수정자:
 *    - readonly: 읽기 전용
 *    - ?: optional
 *    - -readonly: readonly 제거
 *    - -?: optional 제거
 *
 * 5. 내장 매핑 타입:
 *    - Partial<T>: 모든 프로퍼티 optional
 *    - Required<T>: 모든 프로퍼티 필수
 *    - Readonly<T>: 모든 프로퍼티 readonly
 *    - Pick<T, K>: K 프로퍼티만 선택
 *    - Omit<T, K>: K 프로퍼티 제거
 *
 * 6. 템플릿 리터럴과 매핑:
 *    - as 키워드로 키 이름 변환
 *    - Capitalize, Uppercase 등 활용
 *
 * 7. 고급 내용:
 *    - 재귀 매핑 타입 (Deep Partial, Deep Readonly)
 *    - 조건부 타입과 매핑 타입 조합
 *    → 06-utility-types에서 학습
 */
