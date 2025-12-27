/**
 * 03-inheritance.ts
 * 클래스 상속으로 재사용성 확보
 */

// 1. 기본 상속 (extends)
class Animal {
  constructor(public name: string) {}

  makeSound(): string {
    return 'Some generic sound';
  }

  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof! Woof!';
  }
}

console.log('=== 기본 상속 ===');
const dog = new Dog('Buddy');
console.log(`${dog.name} says: ${dog.makeSound()}`);
dog.move();

// 2. super 키워드 - 부모 생성자 호출
class Vehicle {
  constructor(
    public brand: string,
    public model: string
  ) {
    console.log(`Vehicle created: ${brand} ${model}`);
  }
}

class Car extends Vehicle {
  constructor(
    brand: string,
    model: string,
    public year: number
  ) {
    // 자식 생성자에서는 super() 호출 필수
    super(brand, model);
    console.log(`Car year: ${year}`);
  }
}

console.log('\n=== super 생성자 ===');
const car = new Car('Toyota', 'Camry', 2024);

// 3. 메서드 오버라이딩
class Shape {
  constructor(public color: string) {}

  getInfo(): string {
    return `Shape with color: ${this.color}`;
  }
}

class Circle extends Shape {
  constructor(
    color: string,
    public radius: number
  ) {
    super(color);
  }

  // 부모 메서드 오버라이드
  getInfo(): string {
    return `Circle (${this.color}) with radius: ${this.radius}`;
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

console.log('\n=== 메서드 오버라이딩 ===');
const circle = new Circle('red', 10);
console.log(circle.getInfo());
console.log(`Area: ${circle.getArea().toFixed(2)}`);

// 4. super로 부모 메서드 호출
class Logger {
  log(message: string): void {
    console.log(`[LOG] ${message}`);
  }
}

class TimestampLogger extends Logger {
  log(message: string): void {
    const timestamp = new Date().toISOString();
    // 부모 메서드 호출 + 추가 기능
    super.log(`[${timestamp}] ${message}`);
  }
}

console.log('\n=== super로 부모 메서드 호출 ===');
const logger = new TimestampLogger();
logger.log('Application started');

// 5. protected와 상속
class Person {
  constructor(
    public name: string,
    protected age: number
  ) {}

  protected getDetails(): string {
    return `${this.name}, ${this.age}`;
  }
}

class Employee extends Person {
  constructor(
    name: string,
    age: number,
    public employeeId: number
  ) {
    super(name, age);
  }

  getEmployeeInfo(): string {
    // protected 멤버에 접근 가능
    return `ID: ${this.employeeId}, ${this.getDetails()}`;
  }
}

console.log('\n=== protected와 상속 ===');
const employee = new Employee('Alice', 30, 101);
console.log(employee.getEmployeeInfo());

// 6. 타입 호환성과 다형성
class Bird {
  fly(): void {
    console.log('Flying...');
  }
}

class Sparrow extends Bird {
  chirp(): void {
    console.log('Chirp chirp!');
  }
}

function makeBirdFly(bird: Bird): void {
  bird.fly();
}

console.log('\n=== 다형성 ===');
const sparrow = new Sparrow();
makeBirdFly(sparrow); // 자식은 부모 타입으로 사용 가능
sparrow.chirp();

// 7. instanceof로 타입 체크
console.log('\n=== instanceof 타입 체크 ===');
console.log(`sparrow instanceof Bird: ${sparrow instanceof Bird}`);
console.log(`sparrow instanceof Sparrow: ${sparrow instanceof Sparrow}`);

function processAnimal(animal: Animal): void {
  if (animal instanceof Dog) {
    console.log('This is a dog!');
  }
  console.log(animal.makeSound());
}

processAnimal(dog);

// 8. 상속 체인
class LivingBeing {
  breathe(): void {
    console.log('Breathing...');
  }
}

class Mammal extends LivingBeing {
  feedMilk(): void {
    console.log('Feeding milk...');
  }
}

class Cat extends Mammal {
  meow(): void {
    console.log('Meow!');
  }
}

console.log('\n=== 상속 체인 ===');
const cat = new Cat();
cat.breathe(); // LivingBeing
cat.feedMilk(); // Mammal
cat.meow(); // Cat

// 9. 생성자 없는 상속
class Base {
  value: number = 42;

  getValue(): number {
    return this.value;
  }
}

class Derived extends Base {
  // 생성자 없으면 부모 생성자 자동 호출
  doubled(): number {
    return this.value * 2;
  }
}

console.log('\n=== 생성자 없는 상속 ===');
const derived = new Derived();
console.log(`Value: ${derived.getValue()}`);
console.log(`Doubled: ${derived.doubled()}`);

// 10. 프로퍼티 오버라이드
class Parent {
  message: string = 'Parent message';

  getMessage(): string {
    return this.message;
  }
}

class Child extends Parent {
  message: string = 'Child message'; // 프로퍼티 오버라이드

  getMessage(): string {
    return `Child says: ${this.message}`;
  }
}

console.log('\n=== 프로퍼티 오버라이드 ===');
const child = new Child();
console.log(child.getMessage());

// 11. 상속과 private
class SecretBase {
  private secret: string = 'base secret';

  getSecret(): string {
    return this.secret;
  }
}

class SecretDerived extends SecretBase {
  test(): void {
    // this.secret  // ❌ 에러: private은 자식에서 접근 불가
    console.log(this.getSecret()); // 부모 메서드로 접근
  }
}

console.log('\n=== private와 상속 ===');
const secretDerived = new SecretDerived();
secretDerived.test();

// 12. 생성자 매개변수와 상속
class Rectangle {
  constructor(
    public width: number,
    public height: number
  ) {}

  getArea(): number {
    return this.width * this.height;
  }
}

class ColoredRectangle extends Rectangle {
  constructor(
    width: number,
    height: number,
    public color: string
  ) {
    super(width, height);
  }

  getDescription(): string {
    return `${this.color} rectangle (${this.width}x${this.height})`;
  }
}

console.log('\n=== 생성자 매개변수 상속 ===');
const coloredRect = new ColoredRectangle(10, 20, 'blue');
console.log(coloredRect.getDescription());
console.log(`Area: ${coloredRect.getArea()}`);

// 13. 메서드 체이닝과 상속
class Chainable {
  protected value: number = 0;

  add(n: number): this {
    this.value += n;
    return this;
  }

  getValue(): number {
    return this.value;
  }
}

class ExtendedChainable extends Chainable {
  multiply(n: number): this {
    this.value *= n;
    return this;
  }
}

console.log('\n=== 메서드 체이닝 상속 ===');
const chainable = new ExtendedChainable();
const result = chainable.add(10).multiply(2).add(5).getValue();
console.log(`Result: ${result}`); // (10 * 2) + 5 = 25

// 14. 타입 좁히기 (Type Narrowing)
class Fish {
  swim(): void {
    console.log('Swimming...');
  }
}

class FlyingFish extends Fish {
  fly(): void {
    console.log('Flying fish!');
  }
}

function handleFish(fish: Fish): void {
  fish.swim();

  // 타입 좁히기
  if (fish instanceof FlyingFish) {
    fish.fly(); // FlyingFish로 좁혀짐
  }
}

console.log('\n=== 타입 좁히기 ===');
const flyingFish = new FlyingFish();
handleFish(flyingFish);

// 15. 실전 예제: 계층적 UI 컴포넌트
class UIComponent {
  constructor(
    public id: string,
    protected visible: boolean = true
  ) {}

  render(): void {
    if (this.visible) {
      console.log(`Rendering ${this.id}`);
    }
  }

  show(): void {
    this.visible = true;
  }

  hide(): void {
    this.visible = false;
  }
}

class Button extends UIComponent {
  constructor(
    id: string,
    public label: string,
    private onClick?: () => void
  ) {
    super(id);
  }

  render(): void {
    super.render();
    if (this.visible) {
      console.log(`  Button: "${this.label}"`);
    }
  }

  click(): void {
    if (this.onClick) {
      console.log(`Button "${this.label}" clicked`);
      this.onClick();
    }
  }
}

class IconButton extends Button {
  constructor(
    id: string,
    label: string,
    public icon: string,
    onClick?: () => void
  ) {
    super(id, label, onClick);
  }

  render(): void {
    super.render();
    if (this.visible) {
      console.log(`  Icon: ${this.icon}`);
    }
  }
}

console.log('\n=== 실전: UI 컴포넌트 계층 ===');
const saveButton = new IconButton(
  'btn-save',
  'Save',
  '💾',
  () => console.log('Saving...')
);

saveButton.render();
saveButton.click();

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 상속 기본
 *    - extends 키워드로 상속
 *      class Child extends Parent { }
 *
 * 2. super 키워드
 *    - 부모 생성자 호출
 *      constructor() {
 *        super(); // 필수
 *      }
 *
 *    - 부모 메서드 호출
 *      super.method();
 *
 * 3. 메서드 오버라이딩
 *    - 부모 메서드를 자식에서 재정의
 *    - super.method()로 부모 메서드 호출 가능
 *
 * 4. 접근 제어자와 상속
 *    - public: 자식에서 접근 가능
 *    - protected: 자식에서 접근 가능
 *    - private: 자식에서 접근 불가
 *
 * 5. 다형성 (Polymorphism)
 *    - 자식은 부모 타입으로 사용 가능
 *      function f(parent: Parent) { }
 *      f(new Child()); // OK
 *
 * 6. instanceof 연산자
 *    - 런타임 타입 체크
 *      if (obj instanceof Child) { }
 *
 * 7. 상속 체인
 *    - A → B → C 형태로 여러 단계 상속 가능
 *    - 모든 부모의 멤버에 접근 가능
 *
 * 8. 생성자 규칙
 *    - 자식 생성자에서 super() 필수
 *    - super() 호출 전에 this 사용 불가
 *    - 생성자 없으면 자동으로 super() 호출
 *
 * 9. 프로퍼티 오버라이드
 *    - 부모 프로퍼티를 자식에서 재정의
 *    - 타입 호환성 유지 필요
 *
 * 10. 타입 좁히기
 *     - instanceof로 타입 좁히기
 *     - 자식 타입의 멤버 안전하게 접근
 *
 * 11. this 타입
 *     - 메서드 체이닝 지원
 *     - this 반환으로 자식 타입 유지
 *
 * 12. 상속 vs 구성
 *     상속 (Inheritance):
 *     - "is-a" 관계 (Dog은 Animal이다)
 *     - extends 키워드
 *     - 단일 상속만 가능
 *
 *     구성 (Composition):
 *     - "has-a" 관계 (Car는 Engine을 가진다)
 *     - 프로퍼티로 포함
 *     - 더 유연함
 *
 * 13. 상속의 장점
 *     ✅ 코드 재사용
 *     ✅ 계층 구조 표현
 *     ✅ 다형성 활용
 *
 * 14. 상속의 단점
 *     ❌ 강한 결합
 *     ❌ 단일 상속 제한
 *     ❌ 잘못된 계층 구조 시 복잡도 증가
 *
 * 15. Best Practices
 *     ✅ "is-a" 관계만 상속 사용
 *     ✅ 얕은 상속 계층 유지 (2-3단계)
 *     ✅ protected로 확장 지점 제공
 *     ✅ 깊은 계층보다는 구성 선호
 *     ✅ 리스코프 치환 원칙 준수
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html#extends-clauses
 */
