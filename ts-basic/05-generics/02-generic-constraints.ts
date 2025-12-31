/**
 * 02-generic-constraints.ts
 * 제약 조건으로 타입 제한
 *
 * 제네릭만 사용하면 모든 타입을 받을 수 있어서 특정 프로퍼티나 메서드에 접근할 수 없습니다.
 * 제약 조건(T extends Type)을 사용하면 "이 타입은 최소한 이런 속성은 있어야 해"라고 제한할 수 있습니다.
 * 이 파일에서는
 * extends 키워드로 기본 제약 조건 설정하기,
 * 인터페이스 제약으로 특정 프로퍼티 보장하기,
 * keyof 제약으로 객체 키 안전하게 접근하기,
 * 다중 제약 조건(A & B) 적용하기,
 * 생성자 타입 제약(new () => T)으로 팩토리 패턴 구현하기,
 * 그리고 실무 Repository와 Validator 패턴을 다룹니다.
 */

// 1. 기본 제약 조건 (T extends Type)
console.log('=== 1. 기본 제약 조건 ===');

// ❌ 제약 없이는 length 접근 불가
// function getLength<T>(arg: T): number {
//   return arg.length; // Error: Property 'length' does not exist on type 'T'
// }

// ✅ length 프로퍼티가 있는 타입만 허용
interface Lengthy {
  length: number;
}

function getLength<T extends Lengthy>(arg: T): number {
  return arg.length; // OK
}

console.log('String length:', getLength('hello')); // 5
console.log('Array length:', getLength([1, 2, 3])); // 3
// console.log(getLength(123)); // Error: number에는 length가 없음

// 2. 인터페이스 제약 조건
console.log('\n=== 2. 인터페이스 제약 조건 ===');

interface HasName {
  name: string;
}

function printName<T extends HasName>(obj: T): void {
  console.log(`Name: ${obj.name}`);
}

printName({ name: 'Alice', age: 30 }); // OK
printName({ name: 'Bob' }); // OK
// printName({ age: 30 }); // Error: name이 없음

// 3. keyof 제약 조건 (K extends keyof T)
console.log('\n=== 3. keyof 제약 조건 ===');

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  name: 'Charlie',
  age: 25,
  email: 'charlie@example.com',
};

console.log('User name:', getProperty(user, 'name')); // OK
console.log('User age:', getProperty(user, 'age')); // OK
// console.log(getProperty(user, 'address')); // Error: 'address'는 user의 키가 아님

// 4. 다중 제약 조건 (T extends A & B)
console.log('\n=== 4. 다중 제약 조건 ===');

interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

function execute<T extends Printable & Loggable>(obj: T): void {
  obj.print(); // OK
  obj.log(); // OK
}

const doc = {
  print: () => console.log('Printing...'),
  log: () => console.log('Logging...'),
};

execute(doc);

// 5. 배열 요소 제약
console.log('\n=== 5. 배열 요소 제약 ===');

function findMax<T extends number | string>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;

  // arr.length > 0 체크를 했으므로 arr[0]은 항상 존재
  let max = arr[0]!;
  for (const item of arr) {
    if (item > max) {
      max = item;
    }
  }
  return max;
}

console.log('Max number:', findMax([1, 5, 3, 9, 2])); // 9
console.log('Max string:', findMax(['apple', 'banana', 'cherry'])); // "cherry"

// 6. 생성자 타입 제약 (new () => T)
console.log('\n=== 6. 생성자 타입 제약 ===');

class Animal {
  constructor(public name: string) {}

  speak(): void {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks`);
  }
}

// 생성 가능한 타입만 허용
function createInstance<T extends Animal>(
  Constructor: new (name: string) => T,
  name: string
): T {
  return new Constructor(name);
}

const dog = createInstance(Dog, 'Buddy');
dog.speak(); // "Buddy barks"

// 7. 제네릭 함수에서 프로퍼티 접근
console.log('\n=== 7. 제네릭 함수에서 프로퍼티 접근 ===');

interface Product {
  id: number;
  name: string;
  price: number;
}

function sortByProperty<T, K extends keyof T>(arr: T[], key: K): T[] {
  return arr.slice().sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}

const products: Product[] = [
  { id: 3, name: 'Laptop', price: 1000 },
  { id: 1, name: 'Mouse', price: 20 },
  { id: 2, name: 'Keyboard', price: 50 },
];

console.log('Sort by id:', sortByProperty(products, 'id'));
console.log('Sort by name:', sortByProperty(products, 'name'));
console.log('Sort by price:', sortByProperty(products, 'price'));

// 8. 제약 조건과 타입 추론
console.log('\n=== 8. 제약 조건과 타입 추론 ===');

function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Alice' }, { age: 30 });
console.log('Merged object:', merged); // { name: "Alice", age: 30 }

// merged.name; // OK
// merged.age; // OK

// 9. 실무 패턴 1: Repository 패턴
console.log('\n=== 9. 실무: Repository 패턴 ===');

interface Entity {
  id: number;
}

class Repository<T extends Entity> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  findById(id: number): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  findAll(): T[] {
    return this.items;
  }

  remove(id: number): boolean {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

interface User extends Entity {
  name: string;
  email: string;
}

const userRepo = new Repository<User>();
userRepo.add({ id: 1, name: 'Alice', email: 'alice@example.com' });
userRepo.add({ id: 2, name: 'Bob', email: 'bob@example.com' });

console.log('Find user by id:', userRepo.findById(1));
console.log('All users:', userRepo.findAll());

// 10. 실무 패턴 2: Validator 패턴
console.log('\n=== 10. 실무: Validator 패턴 ===');

type ValidationRule<T> = (value: T) => boolean;

class Validator<T> {
  private rules: ValidationRule<T>[] = [];

  addRule(rule: ValidationRule<T>): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): boolean {
    return this.rules.every((rule) => rule(value));
  }
}

const emailValidator = new Validator<string>()
  .addRule((email) => email.includes('@'))
  .addRule((email) => email.length >= 5);

console.log('Valid email:', emailValidator.validate('test@example.com')); // true
console.log('Invalid email:', emailValidator.validate('test')); // false

const ageValidator = new Validator<number>()
  .addRule((age) => age >= 0)
  .addRule((age) => age <= 120);

console.log('Valid age:', ageValidator.validate(30)); // true
console.log('Invalid age:', ageValidator.validate(150)); // false

// 11. 제약 조건 조합
console.log('\n=== 11. 제약 조건 조합 ===');

interface Identifiable {
  id: string | number;
}

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

function updateTimestamp<T extends Identifiable & Timestamped>(entity: T): T {
  return {
    ...entity,
    updatedAt: new Date(),
  };
}

const article = {
  id: 1,
  title: 'TypeScript Guide',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const updated = updateTimestamp(article);
console.log('Updated article:', updated);

/**
 * 핵심 정리:
 *
 * 1. 제약 조건 기본 문법:
 *    function fn<T extends Type>(arg: T) { ... }
 *
 * 2. 제약 조건 종류:
 *    - extends Type: 특정 타입 상속
 *    - extends { prop: type }: 특정 프로퍼티 보장
 *    - extends keyof T: 객체 키만 허용
 *    - extends A & B: 다중 제약
 *    - extends new () => T: 생성 가능한 타입
 *
 * 3. keyof 제약의 장점:
 *    - 타입 안전한 객체 키 접근
 *    - 런타임 에러 방지
 *    - 자동완성 지원
 *
 * 4. 생성자 타입 제약:
 *    - new () => T: 매개변수 없는 생성자
 *    - new (...args: any[]) => T: 매개변수 있는 생성자
 *
 * 5. 실무 활용:
 *    - Repository 패턴: Entity 제약으로 id 보장
 *    - Validator 패턴: 제네릭으로 모든 타입 검증
 *    - 정렬/필터링: keyof로 안전한 프로퍼티 접근
 *
 * 6. 제약 조건 vs any:
 *    - 제약 조건: 타입 안전성 유지, 특정 기능 보장
 *    - any: 타입 안전성 손실, 모든 제약 없음
 */
