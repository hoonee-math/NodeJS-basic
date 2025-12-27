/**
 * 02-access-modifiers.ts
 * 접근 제어자로 캡슐화 구현
 */

// 1. public - 기본 접근 제어자
class PublicExample {
  public name: string; // public은 생략 가능 (기본값)
  age: number; // public과 동일

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  public greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

console.log('=== public 접근 제어자 ===');
const pub = new PublicExample('Alice', 30);
console.log(pub.name); // OK
console.log(pub.age); // OK
console.log(pub.greet()); // OK

// 2. private - 클래스 내부에서만 접근
class BankAccount {
  private balance: number = 0;

  deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
      console.log(`Deposited: $${amount}`);
    }
  }

  withdraw(amount: number): boolean {
    if (amount > 0 && this.balance >= amount) {
      this.balance -= amount;
      console.log(`Withdrawn: $${amount}`);
      return true;
    }
    console.log('Insufficient funds');
    return false;
  }

  getBalance(): number {
    return this.balance;
  }
}

console.log('\n=== private 접근 제어자 ===');
const account = new BankAccount();
account.deposit(1000);
account.withdraw(300);
console.log(`Balance: $${account.getBalance()}`);
// console.log(account.balance); // ❌ 에러: private 접근 불가

// 3. protected - 클래스와 자식에서 접근
class Employee {
  protected employeeId: number;
  protected department: string;

  constructor(id: number, department: string) {
    this.employeeId = id;
    this.department = department;
  }

  protected getDetails(): string {
    return `ID: ${this.employeeId}, Dept: ${this.department}`;
  }
}

class Manager extends Employee {
  private teamSize: number;

  constructor(id: number, department: string, teamSize: number) {
    super(id, department);
    this.teamSize = teamSize;
  }

  getManagerInfo(): string {
    // protected 멤버에 접근 가능
    return `${this.getDetails()}, Team: ${this.teamSize}`;
  }
}

console.log('\n=== protected 접근 제어자 ===');
const manager = new Manager(101, 'Engineering', 5);
console.log(manager.getManagerInfo());
// console.log(manager.employeeId); // ❌ 에러: protected 외부 접근 불가

// 4. readonly - 초기화 후 변경 불가
class User {
  readonly id: number;
  readonly createdAt: Date;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
  }

  updateName(newName: string): void {
    this.name = newName; // OK
    // this.id = 999; // ❌ 에러: readonly는 변경 불가
  }
}

console.log('\n=== readonly 프로퍼티 ===');
const user = new User(1, 'Alice');
console.log(`User: ${user.name}, ID: ${user.id}`);
user.updateName('Alice Updated');
console.log(`Updated name: ${user.name}`);
// user.id = 2; // ❌ 에러

// 5. 매개변수 프로퍼티 (Parameter Properties)
class Product {
  // 생성자 매개변수에 접근 제어자를 붙이면 자동으로 프로퍼티 생성
  constructor(
    public name: string,
    private price: number,
    protected category: string,
    readonly sku: string
  ) {
    // 자동으로 this.name = name 등이 실행됨
  }

  getPrice(): number {
    return this.price;
  }

  getInfo(): string {
    return `${this.name} (${this.category}): $${this.price}`;
  }
}

console.log('\n=== 매개변수 프로퍼티 ===');
const product = new Product('Laptop', 1200, 'Electronics', 'SKU-12345');
console.log(product.name); // public
console.log(product.sku); // readonly
console.log(product.getInfo());
// console.log(product.price); // ❌ 에러: private

// 6. private vs # (ECMAScript Private Fields)
class ModernPrivate {
  #reallyPrivate: string = 'secret';
  private tsPrivate: string = 'ts private';

  getSecrets(): string {
    return `TS: ${this.tsPrivate}, JS: ${this.#reallyPrivate}`;
  }
}

console.log('\n=== private vs # ===');
const modern = new ModernPrivate();
console.log(modern.getSecrets());
// # private은 런타임에도 private, TypeScript private은 컴파일 후 사라짐

// 7. 접근 제어자 조합
class ComplexClass {
  public publicProp: string = 'public';
  private privateProp: string = 'private';
  protected protectedProp: string = 'protected';
  readonly readonlyProp: string = 'readonly';
  private readonly privateReadonly: string = 'private + readonly';

  constructor() {
    // 생성자에서는 모두 접근 가능
    console.log(this.publicProp);
    console.log(this.privateProp);
    console.log(this.protectedProp);
    console.log(this.readonlyProp);
    console.log(this.privateReadonly);
  }
}

console.log('\n=== 접근 제어자 조합 ===');
new ComplexClass();

// 8. Getter/Setter와 접근 제어
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error('Temperature below absolute zero');
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value: number) {
    this.celsius = ((value - 32) * 5) / 9;
  }
}

console.log('\n=== Getter/Setter ===');
const temp = new Temperature();
temp.celsius = 25;
console.log(`${temp.celsius}°C = ${temp.fahrenheit}°F`);
temp.fahrenheit = 86;
console.log(`${temp.fahrenheit}°F = ${temp.celsius}°C`);

// 9. 정적 멤버 접근 제어
class Counter {
  private static count: number = 0;
  private static readonly MAX_COUNT: number = 100;

  static increment(): void {
    if (this.count < this.MAX_COUNT) {
      this.count++;
    }
  }

  static getCount(): number {
    return this.count;
  }
}

console.log('\n=== 정적 멤버 접근 제어 ===');
Counter.increment();
Counter.increment();
Counter.increment();
console.log(`Count: ${Counter.getCount()}`);
// console.log(Counter.count); // ❌ 에러: private

// 10. 상속과 접근 제어자
class Base {
  public publicField = 'public';
  protected protectedField = 'protected';
  private privateField = 'private';

  public publicMethod(): void {}
  protected protectedMethod(): void {}
  private privateMethod(): void {}
}

class Derived extends Base {
  test(): void {
    console.log(this.publicField); // OK
    console.log(this.protectedField); // OK
    // console.log(this.privateField); // ❌ 에러: private은 부모에서만

    this.publicMethod(); // OK
    this.protectedMethod(); // OK
    // this.privateMethod(); // ❌ 에러
  }
}

console.log('\n=== 상속과 접근 제어 ===');
const derived = new Derived();
derived.test();

// 11. 캡슐화 예제: Stack
class Stack<T> {
  private items: T[] = [];
  private readonly maxSize: number;

  constructor(maxSize: number = 10) {
    this.maxSize = maxSize;
  }

  push(item: T): boolean {
    if (this.items.length >= this.maxSize) {
      console.log('Stack overflow');
      return false;
    }
    this.items.push(item);
    return true;
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

console.log('\n=== 캡슐화: Stack ===');
const stack = new Stack<number>(5);
stack.push(1);
stack.push(2);
stack.push(3);
console.log(`Size: ${stack.size}`);
console.log(`Peek: ${stack.peek()}`);
console.log(`Pop: ${stack.pop()}`);
console.log(`Size after pop: ${stack.size}`);

// 12. 불변 객체 패턴
class ImmutablePoint {
  constructor(
    readonly x: number,
    readonly y: number
  ) {}

  // 새 인스턴스를 반환하여 불변성 유지
  move(dx: number, dy: number): ImmutablePoint {
    return new ImmutablePoint(this.x + dx, this.y + dy);
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}

console.log('\n=== 불변 객체 패턴 ===');
const point = new ImmutablePoint(10, 20);
console.log(`Original: ${point.toString()}`);
const movedPoint = point.move(5, 10);
console.log(`Original: ${point.toString()}`); // 변경 안 됨
console.log(`Moved: ${movedPoint.toString()}`);

// 13. private 생성자 (싱글톤 패턴)
class Singleton {
  private static instance: Singleton;
  private constructor(private data: string) {}

  static getInstance(data?: string): Singleton {
    if (!Singleton.instance) {
      if (!data) {
        throw new Error('Data required for first initialization');
      }
      Singleton.instance = new Singleton(data);
    }
    return Singleton.instance;
  }

  getData(): string {
    return this.data;
  }
}

console.log('\n=== private 생성자 (싱글톤) ===');
const singleton1 = Singleton.getInstance('First');
const singleton2 = Singleton.getInstance('Second'); // 무시됨
console.log('Same instance:', singleton1 === singleton2);
console.log('Data:', singleton1.getData());

// 14. 접근 제어자와 인터페이스
interface ILogger {
  log(message: string): void;
}

class Logger implements ILogger {
  private logHistory: string[] = [];

  log(message: string): void {
    // 인터페이스 메서드는 public이어야 함
    const timestamp = new Date().toISOString();
    this.logHistory.push(`[${timestamp}] ${message}`);
    console.log(`[${timestamp}] ${message}`);
  }

  private getHistory(): string[] {
    return [...this.logHistory];
  }

  printHistory(): void {
    console.log('=== Log History ===');
    this.getHistory().forEach((log) => console.log(log));
  }
}

console.log('\n=== 접근 제어자와 인터페이스 ===');
const logger = new Logger();
logger.log('Application started');
logger.log('User logged in');
logger.printHistory();

// 15. 실전 예제: 은행 계좌 시스템
class SecureBankAccount {
  private static nextAccountId: number = 1000;

  readonly accountId: number;
  private _balance: number;
  protected transactionHistory: string[] = [];

  constructor(
    public readonly ownerName: string,
    initialDeposit: number
  ) {
    this.accountId = SecureBankAccount.nextAccountId++;
    this._balance = initialDeposit;
    this.logTransaction(`Account opened with $${initialDeposit}`);
  }

  get balance(): number {
    return this._balance;
  }

  deposit(amount: number): boolean {
    if (amount <= 0) {
      console.log('Invalid deposit amount');
      return false;
    }
    this._balance += amount;
    this.logTransaction(`Deposit: +$${amount}`);
    return true;
  }

  withdraw(amount: number): boolean {
    if (amount <= 0 || amount > this._balance) {
      console.log('Invalid withdrawal');
      return false;
    }
    this._balance -= amount;
    this.logTransaction(`Withdraw: -$${amount}`);
    return true;
  }

  protected logTransaction(description: string): void {
    const timestamp = new Date().toISOString();
    this.transactionHistory.push(`[${timestamp}] ${description}`);
  }

  printStatement(): void {
    console.log(`\n=== Account Statement: ${this.ownerName} ===`);
    console.log(`Account ID: ${this.accountId}`);
    console.log(`Balance: $${this.balance}`);
    console.log('Transactions:');
    this.transactionHistory.forEach((t) => console.log(`  ${t}`));
  }
}

console.log('\n=== 실전: 은행 계좌 시스템 ===');
const bankAccount = new SecureBankAccount('Alice', 1000);
bankAccount.deposit(500);
bankAccount.withdraw(200);
bankAccount.printStatement();

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 접근 제어자 종류
 *    - public: 어디서나 접근 가능 (기본값)
 *    - private: 클래스 내부에서만
 *    - protected: 클래스와 자식 클래스에서만
 *    - readonly: 초기화 후 변경 불가
 *
 * 2. public
 *    - 명시하지 않아도 기본값
 *      public name: string;
 *      name: string;  // 동일
 *
 * 3. private
 *    - 클래스 외부에서 접근 불가
 *    - 자식 클래스에서도 접근 불가
 *      private balance: number;
 *
 *    - # 문법 (ECMAScript private)
 *      #reallyPrivate: string;
 *
 * 4. protected
 *    - 클래스와 자식에서만 접근
 *      protected employeeId: number;
 *
 * 5. readonly
 *    - 초기화 후 변경 불가
 *    - 선언 시 또는 생성자에서만 할당
 *      readonly id: number;
 *
 * 6. 매개변수 프로퍼티
 *    - 생성자 매개변수에 접근 제어자
 *    - 자동으로 프로퍼티 생성 및 할당
 *      constructor(public name: string) { }
 *
 * 7. 접근 제어자 조합
 *    - private readonly: 불변 private 프로퍼티
 *    - public readonly: 불변 public 프로퍼티
 *
 * 8. Getter/Setter
 *    - get/set 키워드
 *    - private 프로퍼티를 안전하게 노출
 *      get value() { return this._value; }
 *
 * 9. 정적 멤버 접근 제어
 *    - static과 접근 제어자 조합
 *      private static count: number;
 *
 * 10. private 생성자
 *     - 외부에서 인스턴스 생성 차단
 *     - 싱글톤 패턴에 활용
 *       private constructor() { }
 *
 * 11. 캡슐화 (Encapsulation)
 *     - private으로 내부 상태 숨김
 *     - public 메서드로 안전한 접근 제공
 *
 * 12. 불변성 (Immutability)
 *     - readonly로 변경 방지
 *     - 새 인스턴스 반환으로 불변성 유지
 *
 * 13. 인터페이스와 접근 제어자
 *     - 인터페이스 메서드는 public이어야 함
 *
 * 14. Best Practices
 *     ✅ 기본은 private, 필요시에만 public
 *     ✅ readonly로 불변성 보장
 *     ✅ getter/setter로 검증 로직 추가
 *     ✅ 매개변수 프로퍼티로 간결하게
 *     ✅ 캡슐화로 내부 구현 숨김
 *
 * 15. 안티패턴
 *     ❌ 모든 것을 public으로
 *     ❌ private 없이 내부 상태 노출
 *     ❌ readonly 미사용으로 예상치 못한 변경
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility
 */
