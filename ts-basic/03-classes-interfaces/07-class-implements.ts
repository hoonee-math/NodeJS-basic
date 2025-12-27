/**
 * 07-class-implements.ts
 * 클래스로 인터페이스 구현
 */

// 1. 기본 implements
interface Printable {
  print(): void;
}

class Document implements Printable {
  constructor(private content: string) {}

  print(): void {
    console.log(this.content);
  }
}

console.log('=== 기본 implements ===');
const doc = new Document('Hello, TypeScript!');
doc.print();

// 2. 다중 인터페이스 구현
interface Readable {
  read(): string;
}

interface Writable {
  write(content: string): void;
}

class File implements Readable, Writable {
  private content: string = '';

  read(): string {
    return this.content;
  }

  write(content: string): void {
    this.content = content;
  }
}

console.log('\n=== 다중 인터페이스 구현 ===');
const file = new File();
file.write('File content');
console.log('Read:', file.read());

// 3. 인터페이스 + 상속
interface Vehicle {
  start(): void;
  stop(): void;
}

class BaseVehicle {
  constructor(protected brand: string) {}

  getInfo(): string {
    return `Vehicle: ${this.brand}`;
  }
}

class Car extends BaseVehicle implements Vehicle {
  start(): void {
    console.log(`${this.brand} starting...`);
  }

  stop(): void {
    console.log(`${this.brand} stopping...`);
  }
}

console.log('\n=== 인터페이스 + 상속 ===');
const car = new Car('Toyota');
console.log(car.getInfo());
car.start();
car.stop();

// 4. 제네릭 인터페이스 구현
interface Repository<T> {
  getAll(): T[];
  getById(id: string): T | undefined;
  add(item: T): void;
}

interface User {
  id: string;
  name: string;
}

class UserRepository implements Repository<User> {
  private users: User[] = [];

  getAll(): User[] {
    return [...this.users];
  }

  getById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  add(user: User): void {
    this.users.push(user);
  }
}

console.log('\n=== 제네릭 인터페이스 구현 ===');
const userRepo = new UserRepository();
userRepo.add({ id: '1', name: 'Alice' });
userRepo.add({ id: '2', name: 'Bob' });
console.log('All users:', userRepo.getAll());
console.log('User 1:', userRepo.getById('1'));

// 5. 인터페이스 타입으로 사용
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[CONSOLE] ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE] ${message}`);
  }
}

function useLogger(logger: Logger): void {
  logger.log('This is a log message');
}

console.log('\n=== 인터페이스 타입으로 사용 ===');
useLogger(new ConsoleLogger());
useLogger(new FileLogger());

// 6. 선택적 메서드 구현
interface Optional {
  required(): void;
  optional?(): void;
}

class Implementation implements Optional {
  required(): void {
    console.log('Required method');
  }
  // optional은 구현 안 해도 됨
}

console.log('\n=== 선택적 메서드 ===');
const impl = new Implementation();
impl.required();

// 7. 인터페이스 프로퍼티 구현
interface Config {
  readonly apiUrl: string;
  timeout: number;
}

class AppConfig implements Config {
  readonly apiUrl: string;
  timeout: number;

  constructor(apiUrl: string, timeout: number = 5000) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
  }
}

console.log('\n=== 인터페이스 프로퍼티 ===');
const config = new AppConfig('https://api.example.com');
console.log(`API: ${config.apiUrl}, Timeout: ${config.timeout}`);

// 8. 추상 클래스 + 인터페이스
interface Drawable {
  draw(): void;
}

abstract class Shape {
  constructor(public color: string) {}

  abstract getArea(): number;
}

class Circle extends Shape implements Drawable {
  constructor(
    color: string,
    public radius: number
  ) {
    super(color);
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  draw(): void {
    console.log(`Drawing ${this.color} circle`);
  }
}

console.log('\n=== 추상 클래스 + 인터페이스 ===');
const circle = new Circle('red', 10);
circle.draw();
console.log(`Area: ${circle.getArea().toFixed(2)}`);

// 9. 함수 타입 인터페이스 구현
interface Comparator<T> {
  (a: T, b: T): number;
}

class NumberComparator {
  ascending: Comparator<number> = (a, b) => a - b;
  descending: Comparator<number> = (a, b) => b - a;
}

console.log('\n=== 함수 타입 인터페이스 ===');
const comparator = new NumberComparator();
const numbers = [3, 1, 4, 1, 5, 9];
console.log('Ascending:', [...numbers].sort(comparator.ascending));
console.log('Descending:', [...numbers].sort(comparator.descending));

// 10. 인터페이스 확장 + 구현
interface Entity {
  id: string;
  createdAt: Date;
}

interface Timestamped extends Entity {
  updatedAt: Date;
}

class Product implements Timestamped {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

console.log('\n=== 인터페이스 확장 + 구현 ===');
const product = new Product('prod-1', 'Laptop');
console.log('Product:', product);

// 11. 정적 인터페이스 (구조 패턴)
interface ClockConstructor {
  new (hour: number, minute: number): ClockInterface;
}

interface ClockInterface {
  tick(): void;
}

class DigitalClock implements ClockInterface {
  constructor(
    public hour: number,
    public minute: number
  ) {}

  tick(): void {
    console.log(`${this.hour}:${this.minute}`);
  }
}

function createClock(
  ctor: ClockConstructor,
  hour: number,
  minute: number
): ClockInterface {
  return new ctor(hour, minute);
}

console.log('\n=== 정적 인터페이스 패턴 ===');
const clock = createClock(DigitalClock, 12, 30);
clock.tick();

// 12. 인터페이스로 의존성 주입
interface Database {
  query<T>(sql: string): Promise<T[]>;
}

class MySQLDatabase implements Database {
  async query<T>(sql: string): Promise<T[]> {
    console.log(`MySQL: ${sql}`);
    return [];
  }
}

class PostgreSQLDatabase implements Database {
  async query<T>(sql: string): Promise<T[]> {
    console.log(`PostgreSQL: ${sql}`);
    return [];
  }
}

class UserService {
  constructor(private db: Database) {}

  async getUsers() {
    return this.db.query('SELECT * FROM users');
  }
}

console.log('\n=== 의존성 주입 ===');
const userService1 = new UserService(new MySQLDatabase());
const userService2 = new UserService(new PostgreSQLDatabase());

userService1.getUsers();
userService2.getUsers();

// 13. 인터페이스 분리 원칙 (ISP)
interface Printer {
  print(): void;
}

interface Scanner {
  scan(): void;
}

interface Fax {
  fax(): void;
}

// 복합기는 모두 구현
class MultiFunctionPrinter implements Printer, Scanner, Fax {
  print(): void {
    console.log('Printing...');
  }

  scan(): void {
    console.log('Scanning...');
  }

  fax(): void {
    console.log('Faxing...');
  }
}

// 단순 프린터는 필요한 것만 구현
class SimplePrinter implements Printer {
  print(): void {
    console.log('Simple printing...');
  }
}

console.log('\n=== 인터페이스 분리 원칙 ===');
const multiPrinter = new MultiFunctionPrinter();
const simplePrinter = new SimplePrinter();

multiPrinter.print();
multiPrinter.scan();
simplePrinter.print();

// 14. 인터페이스와 타입 가드
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

class Sparrow implements Bird {
  fly(): void {
    console.log('Sparrow flying');
  }
}

class Goldfish implements Fish {
  swim(): void {
    console.log('Goldfish swimming');
  }
}

function isBird(pet: Bird | Fish): pet is Bird {
  return (pet as Bird).fly !== undefined;
}

function movePet(pet: Bird | Fish): void {
  if (isBird(pet)) {
    pet.fly();
  } else {
    pet.swim();
  }
}

console.log('\n=== 타입 가드 ===');
movePet(new Sparrow());
movePet(new Goldfish());

// 15. 실전 예제: 플러그인 시스템
interface Plugin {
  name: string;
  version: string;
  initialize(): void;
  execute(context: any): void;
  cleanup(): void;
}

class LoggerPlugin implements Plugin {
  name = 'Logger';
  version = '1.0.0';

  initialize(): void {
    console.log(`[${this.name}] Initializing...`);
  }

  execute(context: any): void {
    console.log(`[${this.name}] Logging:`, context);
  }

  cleanup(): void {
    console.log(`[${this.name}] Cleaning up...`);
  }
}

class ValidationPlugin implements Plugin {
  name = 'Validator';
  version = '1.0.0';

  initialize(): void {
    console.log(`[${this.name}] Initializing...`);
  }

  execute(context: any): void {
    console.log(`[${this.name}] Validating:`, context);
  }

  cleanup(): void {
    console.log(`[${this.name}] Cleaning up...`);
  }
}

class PluginManager {
  private plugins: Plugin[] = [];

  register(plugin: Plugin): void {
    plugin.initialize();
    this.plugins.push(plugin);
  }

  executeAll(context: any): void {
    this.plugins.forEach((plugin) => plugin.execute(context));
  }

  cleanup(): void {
    this.plugins.forEach((plugin) => plugin.cleanup());
  }
}

console.log('\n=== 실전: 플러그인 시스템 ===');
const manager = new PluginManager();
manager.register(new LoggerPlugin());
manager.register(new ValidationPlugin());
manager.executeAll({ data: 'test' });
manager.cleanup();

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. implements 키워드
 *    class MyClass implements Interface { }
 *
 * 2. 인터페이스 계약
 *    - 인터페이스의 모든 멤버 구현 필수
 *    - 추가 멤버는 자유롭게 정의 가능
 *
 * 3. 다중 구현
 *    class C implements A, B, C { }
 *
 * 4. 상속 + 구현
 *    class C extends Parent implements Interface { }
 *
 * 5. 제네릭 인터페이스 구현
 *    class Repo implements Repository<User> { }
 *
 * 6. 타입으로 사용
 *    function f(param: Interface) { }
 *    - 느슨한 결합 (Loose Coupling)
 *
 * 7. 선택적 멤버
 *    - 선택적 프로퍼티/메서드는 구현 안 해도 됨
 *
 * 8. 추상 클래스 + 인터페이스
 *    - 상속과 구현 동시 사용 가능
 *    - 공통 로직 + 계약 강제
 *
 * 9. 함수 타입 인터페이스
 *    - 클래스 프로퍼티로 구현
 *
 * 10. 의존성 주입 (DI)
 *     - 인터페이스 타입으로 의존성 주입
 *     - 구현체 교체 용이
 *
 * 11. 인터페이스 분리 원칙 (ISP)
 *     - 작은 인터페이스로 분리
 *     - 필요한 것만 구현
 *
 * 12. 타입 가드
 *     - is 키워드로 타입 가드 함수
 *       function isBird(x): x is Bird { }
 *
 * 13. SOLID 원칙
 *     - Interface Segregation: 인터페이스 분리
 *     - Dependency Inversion: 인터페이스에 의존
 *
 * 14. 장점
 *     ✅ 계약 명확화
 *     ✅ 느슨한 결합
 *     ✅ 테스트 용이 (목 객체)
 *     ✅ 유연한 설계
 *     ✅ 코드 재사용성
 *
 * 15. Best Practices
 *     ✅ 인터페이스로 추상화
 *     ✅ 구현이 아닌 인터페이스에 의존
 *     ✅ 작은 인터페이스로 분리
 *     ✅ 의존성 주입 활용
 *     ✅ 플러그인 시스템 설계
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html#implements-clauses
 */
