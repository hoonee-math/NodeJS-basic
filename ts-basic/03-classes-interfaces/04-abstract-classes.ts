/**
 * 04-abstract-classes.ts
 * 추상 클래스로 공통 구조 정의
 */

// 1. 추상 클래스 기본
abstract class Animal {
  constructor(public name: string) {}

  // 추상 메서드 - 자식 클래스에서 반드시 구현
  abstract makeSound(): string;

  // 구체 메서드 - 바로 사용 가능
  move(): void {
    console.log(`${this.name} is moving`);
  }
}

class Dog extends Animal {
  // 추상 메서드 구현 필수
  makeSound(): string {
    return 'Woof!';
  }
}

class Cat extends Animal {
  makeSound(): string {
    return 'Meow!';
  }
}

console.log('=== 추상 클래스 기본 ===');
// const animal = new Animal('Generic'); // ❌ 에러: 추상 클래스는 인스턴스화 불가

const dog = new Dog('Buddy');
const cat = new Cat('Whiskers');

console.log(`${dog.name} says: ${dog.makeSound()}`);
dog.move();
console.log(`${cat.name} says: ${cat.makeSound()}`);
cat.move();

// 2. 추상 프로퍼티
abstract class Shape {
  constructor(public color: string) {}

  // 추상 프로퍼티
  abstract readonly name: string;

  // 추상 메서드
  abstract getArea(): number;
  abstract getPerimeter(): number;

  // 구체 메서드
  getInfo(): string {
    return `${this.name} (${this.color}): Area=${this.getArea().toFixed(2)}`;
  }
}

class Circle extends Shape {
  readonly name = 'Circle';

  constructor(
    color: string,
    public radius: number
  ) {
    super(color);
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

class Rectangle extends Shape {
  readonly name = 'Rectangle';

  constructor(
    color: string,
    public width: number,
    public height: number
  ) {
    super(color);
  }

  getArea(): number {
    return this.width * this.height;
  }

  getPerimeter(): number {
    return 2 * (this.width + this.height);
  }
}

console.log('\n=== 추상 프로퍼티 ===');
const shapes: Shape[] = [new Circle('red', 10), new Rectangle('blue', 5, 10)];

shapes.forEach((shape) => {
  console.log(shape.getInfo());
  console.log(`  Perimeter: ${shape.getPerimeter().toFixed(2)}`);
});

// 3. 템플릿 메서드 패턴
abstract class DataProcessor {
  // 템플릿 메서드 - 알고리즘 골격 정의
  process(): void {
    console.log('=== Processing Data ===');
    this.loadData();
    this.validateData();
    this.transform();
    this.save();
    console.log('Processing complete\n');
  }

  // 추상 메서드 - 자식이 구현
  protected abstract loadData(): void;
  protected abstract validateData(): void;
  protected abstract transform(): void;

  // 구체 메서드 - 공통 로직
  protected save(): void {
    console.log('Saving processed data...');
  }
}

class CsvProcessor extends DataProcessor {
  protected loadData(): void {
    console.log('Loading CSV file...');
  }

  protected validateData(): void {
    console.log('Validating CSV format...');
  }

  protected transform(): void {
    console.log('Transforming CSV to objects...');
  }
}

class JsonProcessor extends DataProcessor {
  protected loadData(): void {
    console.log('Loading JSON file...');
  }

  protected validateData(): void {
    console.log('Validating JSON schema...');
  }

  protected transform(): void {
    console.log('Transforming JSON structure...');
  }
}

console.log('\n=== 템플릿 메서드 패턴 ===');
const csvProcessor = new CsvProcessor();
const jsonProcessor = new JsonProcessor();

csvProcessor.process();
jsonProcessor.process();

// 4. 추상 생성자와 팩토리
abstract class Vehicle {
  constructor(
    public brand: string,
    public model: string
  ) {}

  abstract getType(): string;
  abstract getMaxSpeed(): number;

  getDetails(): string {
    return `${this.brand} ${this.model} (${this.getType()})`;
  }
}

class Car extends Vehicle {
  getType(): string {
    return 'Car';
  }

  getMaxSpeed(): number {
    return 200;
  }
}

class Motorcycle extends Vehicle {
  getType(): string {
    return 'Motorcycle';
  }

  getMaxSpeed(): number {
    return 180;
  }
}

// 팩토리 함수
function createVehicle(
  type: 'car' | 'motorcycle',
  brand: string,
  model: string
): Vehicle {
  if (type === 'car') {
    return new Car(brand, model);
  }
  return new Motorcycle(brand, model);
}

console.log('\n=== 추상 클래스와 팩토리 ===');
const vehicle = createVehicle('car', 'Toyota', 'Camry');
console.log(vehicle.getDetails());
console.log(`Max speed: ${vehicle.getMaxSpeed()}km/h`);

// 5. 다중 추상 메서드
abstract class Database {
  protected connected: boolean = false;

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T>(sql: string): Promise<T[]>;

  async execute<T>(sql: string): Promise<T[]> {
    if (!this.connected) {
      await this.connect();
    }
    return this.query<T>(sql);
  }
}

class MySQLDatabase extends Database {
  async connect(): Promise<void> {
    console.log('Connecting to MySQL...');
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    console.log('Disconnecting from MySQL...');
    this.connected = false;
  }

  async query<T>(sql: string): Promise<T[]> {
    console.log(`MySQL Query: ${sql}`);
    return [] as T[];
  }
}

console.log('\n=== 다중 추상 메서드 ===');
const db = new MySQLDatabase();
db.execute('SELECT * FROM users').then(() => {
  db.disconnect();
});

// 6. 추상 클래스 상속 체인
abstract class LivingBeing {
  abstract breathe(): void;

  live(): void {
    console.log('Living...');
  }
}

abstract class Mammal extends LivingBeing {
  breathe(): void {
    console.log('Breathing air...');
  }

  abstract feedYoung(): void;
}

class Human extends Mammal {
  feedYoung(): void {
    console.log('Feeding baby with milk...');
  }

  think(): void {
    console.log('Thinking...');
  }
}

console.log('\n=== 추상 클래스 체인 ===');
const human = new Human();
human.live();
human.breathe();
human.feedYoung();
human.think();

// 7. 추상 클래스와 접근 제어자
abstract class BaseRepository<T> {
  protected items: T[] = [];

  abstract validate(item: T): boolean;

  add(item: T): boolean {
    if (this.validate(item)) {
      this.items.push(item);
      return true;
    }
    return false;
  }

  getAll(): T[] {
    return [...this.items];
  }

  protected findById(id: any): T | undefined {
    return this.items.find((item: any) => item.id === id);
  }
}

interface User {
  id: number;
  name: string;
  email: string;
}

class UserRepository extends BaseRepository<User> {
  validate(user: User): boolean {
    return user.name.length > 0 && user.email.includes('@');
  }

  findByEmail(email: string): User | undefined {
    return this.items.find((user) => user.email === email);
  }
}

console.log('\n=== 추상 Repository 패턴 ===');
const userRepo = new UserRepository();
userRepo.add({ id: 1, name: 'Alice', email: 'alice@example.com' });
userRepo.add({ id: 2, name: 'Bob', email: 'invalid' }); // 검증 실패

console.log('Users:', userRepo.getAll());

// 8. 추상 클래스 vs 인터페이스 미리보기
// 추상 클래스: 일부 구현 포함 가능
abstract class Logger {
  protected logLevel: string = 'info';

  abstract log(message: string): void;

  // 공통 로직
  protected formatMessage(message: string): string {
    return `[${this.logLevel.toUpperCase()}] ${message}`;
  }
}

class ConsoleLogger extends Logger {
  log(message: string): void {
    console.log(this.formatMessage(message));
  }
}

console.log('\n=== 추상 클래스의 장점 ===');
const logger = new ConsoleLogger();
logger.log('Application started');

// 9. 정적 메서드와 추상 클래스
abstract class MathOperation {
  abstract calculate(a: number, b: number): number;

  // 정적 메서드는 추상화 불가
  static createOperation(type: string): MathOperation {
    if (type === 'add') {
      return new Addition();
    }
    return new Subtraction();
  }
}

class Addition extends MathOperation {
  calculate(a: number, b: number): number {
    return a + b;
  }
}

class Subtraction extends MathOperation {
  calculate(a: number, b: number): number {
    return a - b;
  }
}

console.log('\n=== 정적 팩토리 메서드 ===');
const addOp = MathOperation.createOperation('add');
const subOp = MathOperation.createOperation('sub');

console.log(`10 + 5 = ${addOp.calculate(10, 5)}`);
console.log(`10 - 5 = ${subOp.calculate(10, 5)}`);

// 10. 실전 예제: HTTP 핸들러
abstract class HttpHandler {
  async handle(request: any): Promise<any> {
    // 템플릿 메서드
    this.logRequest(request);

    if (!await this.authenticate(request)) {
      return { status: 401, body: 'Unauthorized' };
    }

    if (!this.validate(request)) {
      return { status: 400, body: 'Bad Request' };
    }

    const response = await this.process(request);
    this.logResponse(response);

    return response;
  }

  protected logRequest(request: any): void {
    console.log(`→ ${request.method} ${request.url}`);
  }

  protected logResponse(response: any): void {
    console.log(`← ${response.status}`);
  }

  // 추상 메서드 - 자식이 구현
  protected abstract authenticate(request: any): Promise<boolean>;
  protected abstract validate(request: any): boolean;
  protected abstract process(request: any): Promise<any>;
}

class UserHandler extends HttpHandler {
  protected async authenticate(request: any): Promise<boolean> {
    // 인증 로직
    return request.headers?.authorization !== undefined;
  }

  protected validate(request: any): boolean {
    // 검증 로직
    return request.body !== undefined;
  }

  protected async process(request: any): Promise<any> {
    // 비즈니스 로직
    return {
      status: 200,
      body: { message: 'User processed successfully' },
    };
  }
}

console.log('\n=== 실전: HTTP 핸들러 ===');
const handler = new UserHandler();
handler
  .handle({
    method: 'POST',
    url: '/api/users',
    headers: { authorization: 'Bearer token' },
    body: { name: 'Alice' },
  })
  .then((response) => console.log('Response:', response));

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 추상 클래스 정의
 *    - abstract 키워드로 선언
 *      abstract class ClassName { }
 *
 *    - 직접 인스턴스화 불가
 *      new AbstractClass(); // ❌ 에러
 *
 * 2. 추상 메서드
 *    - 구현 없이 시그니처만 정의
 *    - 자식 클래스에서 반드시 구현
 *      abstract method(): returnType;
 *
 * 3. 추상 프로퍼티
 *    - 자식에서 반드시 정의
 *      abstract readonly name: string;
 *
 * 4. 구체 메서드
 *    - 추상 클래스에서 구현 포함
 *    - 자식 클래스에서 그대로 사용
 *      method(): void { ... }
 *
 * 5. 템플릿 메서드 패턴
 *    - 추상 클래스에서 알고리즘 골격 정의
 *    - 자식에서 세부 구현
 *      process() {
 *        this.step1();  // 추상
 *        this.step2();  // 추상
 *        this.step3();  // 구체
 *      }
 *
 * 6. 추상 클래스의 장점
 *    ✅ 공통 로직 재사용
 *    ✅ 계약 강제 (추상 메서드)
 *    ✅ 템플릿 메서드 패턴 구현
 *    ✅ 타입으로 사용 가능
 *
 * 7. 추상 클래스 vs 인터페이스
 *    추상 클래스:
 *    - 일부 구현 포함 가능
 *    - 단일 상속만 가능
 *    - 생성자 있음
 *    - 접근 제어자 사용 가능
 *
 *    인터페이스:
 *    - 구현 없음 (구조만)
 *    - 다중 구현 가능
 *    - 생성자 없음
 *    - 모두 public
 *
 * 8. 사용 시기
 *    추상 클래스:
 *    ✅ 공통 로직 공유 필요
 *    ✅ 템플릿 메서드 패턴
 *    ✅ protected 멤버 필요
 *
 *    인터페이스:
 *    ✅ 계약만 정의
 *    ✅ 다중 구현 필요
 *    ✅ 타입만 필요
 *
 * 9. 추상 클래스 체인
 *    - 추상 → 추상 → 구체 클래스
 *    - 단계적 추상화 가능
 *
 * 10. 정적 멤버
 *     - 정적 메서드는 추상화 불가
 *     - 팩토리 패턴에 활용
 *
 * 11. Best Practices
 *     ✅ 공통 로직은 구체 메서드로
 *     ✅ 강제 구현은 추상 메서드로
 *     ✅ protected로 확장 포인트 제공
 *     ✅ 템플릿 메서드 패턴 활용
 *     ✅ 단일 책임 원칙 준수
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members
 */
