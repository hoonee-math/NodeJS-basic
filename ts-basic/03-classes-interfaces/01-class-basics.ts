/**
 * 01-class-basics.ts
 * 클래스의 기본 구조와 사용법
 */

// 1. 클래스 기본 선언
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
  }
}

console.log('=== 클래스 기본 ===');
const person1 = new Person('Alice', 30);
console.log(person1.greet());
console.log(`Name: ${person1.name}, Age: ${person1.age}`);

// 2. 프로퍼티 초기값 설정
class Counter {
  count: number = 0; // 기본값 설정

  increment(): void {
    this.count++;
  }

  decrement(): void {
    this.count--;
  }

  getValue(): number {
    return this.count;
  }
}

console.log('\n=== 프로퍼티 기본값 ===');
const counter = new Counter();
console.log(`Initial: ${counter.getValue()}`);
counter.increment();
counter.increment();
console.log(`After increment: ${counter.getValue()}`);
counter.decrement();
console.log(`After decrement: ${counter.getValue()}`);

// 3. 메서드 체이닝
class Calculator {
  private result: number = 0;

  add(value: number): this {
    this.result += value;
    return this;
  }

  subtract(value: number): this {
    this.result -= value;
    return this;
  }

  multiply(value: number): this {
    this.result *= value;
    return this;
  }

  getResult(): number {
    return this.result;
  }
}

console.log('\n=== 메서드 체이닝 ===');
const calc = new Calculator();
const result = calc.add(10).subtract(3).multiply(2).getResult();
console.log(`Result: ${result}`); // (10 - 3) * 2 = 14

// 4. 생성자 오버로딩 (오버로드 시그니처 사용)
class Point {
  x: number;
  y: number;

  constructor(x: number, y: number);
  constructor(coords: { x: number; y: number });
  constructor(xOrCoords: number | { x: number; y: number }, y?: number) {
    if (typeof xOrCoords === 'number') {
      this.x = xOrCoords;
      this.y = y!;
    } else {
      this.x = xOrCoords.x;
      this.y = xOrCoords.y;
    }
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

console.log('\n=== 생성자 오버로딩 ===');
const point1 = new Point(10, 20);
const point2 = new Point({ x: 30, y: 40 });
console.log(`Point 1: ${point1.toString()}`);
console.log(`Point 2: ${point2.toString()}`);

// 5. this 타입
class Box {
  content: string = '';

  setContent(content: string): this {
    this.content = content;
    return this;
  }

  getContent(): string {
    return this.content;
  }
}

console.log('\n=== this 타입 ===');
const box = new Box();
box.setContent('TypeScript').setContent('Hello ' + box.getContent());
console.log(box.getContent());

// 6. 타입으로서의 클래스
class User {
  constructor(
    public id: number,
    public username: string
  ) {}
}

// 클래스 자체가 타입으로 사용됨
function printUser(user: User): void {
  console.log(`User #${user.id}: ${user.username}`);
}

console.log('\n=== 타입으로서의 클래스 ===');
const user = new User(1, 'alice');
printUser(user);

// 구조적 타이핑: 같은 구조면 호환됨
const userLike = { id: 2, username: 'bob' };
printUser(userLike); // OK - 구조가 같음

// 7. 클래스 표현식
const Rectangle = class {
  constructor(
    public width: number,
    public height: number
  ) {}

  getArea(): number {
    return this.width * this.height;
  }
};

console.log('\n=== 클래스 표현식 ===');
const rect = new Rectangle(10, 20);
console.log(`Area: ${rect.getArea()}`);

// 8. 인스턴스 타입 체크
console.log('\n=== 인스턴스 타입 체크 ===');
console.log(`person1 instanceof Person: ${person1 instanceof Person}`);
console.log(`user instanceof User: ${user instanceof User}`);
console.log(`userLike instanceof User: ${userLike instanceof User}`); // false

// 9. 프로퍼티 vs 메서드
class Example {
  // 프로퍼티 (인스턴스마다 별도 생성)
  propertyMethod = () => {
    return 'Property method';
  };

  // 메서드 (프로토타입에 공유)
  prototypeMethod() {
    return 'Prototype method';
  }
}

console.log('\n=== 프로퍼티 vs 메서드 ===');
const ex1 = new Example();
const ex2 = new Example();

console.log('Property methods equal:', ex1.propertyMethod === ex2.propertyMethod); // false
console.log('Prototype methods equal:', ex1.prototypeMethod === ex2.prototypeMethod); // true

// 10. 옵셔널 프로퍼티
class Product {
  name: string;
  price: number;
  description?: string; // 옵셔널

  constructor(name: string, price: number, description?: string) {
    this.name = name;
    this.price = price;
    this.description = description;
  }

  getInfo(): string {
    return this.description
      ? `${this.name}: $${this.price} - ${this.description}`
      : `${this.name}: $${this.price}`;
  }
}

console.log('\n=== 옵셔널 프로퍼티 ===');
const product1 = new Product('Laptop', 1200);
const product2 = new Product('Mouse', 25, 'Wireless mouse');
console.log(product1.getInfo());
console.log(product2.getInfo());

// 11. 읽기 전용 프로퍼티
class Circle {
  readonly PI: number = 3.14159;
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  getArea(): number {
    return this.PI * this.radius ** 2;
  }
}

console.log('\n=== 읽기 전용 프로퍼티 ===');
const circle = new Circle(10);
console.log(`Area: ${circle.getArea()}`);
// circle.radius = 20; // ❌ 에러: readonly

// 12. 클래스 내부 타입
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }

  get length(): number {
    return this.items.length;
  }
}

console.log('\n=== 제네릭 클래스 ===');
const numberContainer = new Container<number>();
numberContainer.add(1);
numberContainer.add(2);
numberContainer.add(3);
console.log('Numbers:', numberContainer.getAll());
console.log('Length:', numberContainer.length);

// 13. 클래스 메서드 타입
class Formatter {
  format(value: string): string;
  format(value: number): string;
  format(value: string | number): string {
    return typeof value === 'string' ? value.toUpperCase() : value.toFixed(2);
  }
}

console.log('\n=== 메서드 오버로드 ===');
const formatter = new Formatter();
console.log(formatter.format('hello'));
console.log(formatter.format(42.12345));

// 14. 초기화되지 않은 프로퍼티
class LazyInit {
  // ! 단언 - 생성자 외부에서 초기화됨을 알림
  value!: string;

  initialize(value: string): void {
    this.value = value;
  }
}

console.log('\n=== 단언 연산자 ===');
const lazy = new LazyInit();
lazy.initialize('Initialized');
console.log('Value:', lazy.value);

// 15. 클래스 상속 미리보기
class Animal {
  constructor(public name: string) {}

  makeSound(): string {
    return 'Some sound';
  }
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof!';
  }
}

console.log('\n=== 상속 미리보기 ===');
const dog = new Dog('Buddy');
console.log(`${dog.name} says: ${dog.makeSound()}`);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 클래스 선언
 *    class ClassName {
 *      property: type;
 *      constructor(param: type) {
 *        this.property = param;
 *      }
 *      method(): returnType { }
 *    }
 *
 * 2. 생성자 (constructor)
 *    - new 키워드로 인스턴스 생성 시 실행
 *    - this로 프로퍼티 초기화
 *      constructor(name: string) {
 *        this.name = name;
 *      }
 *
 * 3. 프로퍼티
 *    - 클래스 내부 변수
 *    - 타입 어노테이션 필수
 *    - 초기값 또는 생성자에서 할당
 *      name: string = 'default';
 *
 * 4. 메서드
 *    - 클래스 내부 함수
 *    - this로 프로퍼티 접근
 *      greet(): string {
 *        return `Hello, ${this.name}`;
 *      }
 *
 * 5. this 타입
 *    - 메서드가 자신의 인스턴스 반환
 *    - 메서드 체이닝 가능
 *      setName(name: string): this {
 *        this.name = name;
 *        return this;
 *      }
 *
 * 6. 타입으로서의 클래스
 *    - 클래스는 값이자 타입
 *      function f(user: User) { }
 *
 * 7. 구조적 타이핑
 *    - 같은 구조면 호환됨
 *    - 클래스 인스턴스가 아니어도 OK
 *
 * 8. 인스턴스 체크
 *    - instanceof 연산자 사용
 *      obj instanceof ClassName
 *
 * 9. 옵셔널 프로퍼티
 *    - ? 연산자로 선택적 프로퍼티
 *      description?: string;
 *
 * 10. readonly 프로퍼티
 *     - 초기화 후 변경 불가
 *       readonly id: number;
 *
 * 11. 프로퍼티 초기화
 *     - 선언 시 기본값
 *     - 생성자에서 할당
 *     - ! 단언 (나중에 초기화)
 *
 * 12. 제네릭 클래스
 *     - 타입 매개변수 사용
 *       class Box<T> { }
 *
 * 13. 메서드 오버로드
 *     - 여러 시그니처 정의 가능
 *
 * 14. 클래스 표현식
 *     - 변수에 클래스 할당
 *       const MyClass = class { };
 *
 * 15. Best Practices
 *     ✅ 프로퍼티는 명시적 타입 지정
 *     ✅ 생성자에서 초기화
 *     ✅ 메서드는 프로토타입 공유 (화살표 함수 지양)
 *     ✅ this 타입으로 체이닝 지원
 *     ✅ readonly로 불변성 보장
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html
 */
