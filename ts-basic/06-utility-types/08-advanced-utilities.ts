/**
 * 08-advanced-utilities.ts
 * 고급 유틸리티 타입 - InstanceType, ConstructorParameters, This 관련
 *
 * 팩토리 패턴이나 플러그인 시스템에서는 클래스의 인스턴스 타입이나 생성자 매개변수 타입이 필요하고, this 컨텍스트를 명시해야 할 때가 있습니다.
 * InstanceType<T>는 생성자 함수의 인스턴스 타입을, ConstructorParameters<T>는 생성자 매개변수 타입을 튜플로 추출합니다.
 * 이 파일에서는 InstanceType<T>로 클래스 인스턴스 타입 추출, ConstructorParameters<T>로 생성자 매개변수 추출, ThisParameterType/OmitThisParameter로 this 타입 조작, ThisType<T>로 this 컨텍스트 명시, 그리고 실무 팩토리 패턴 예제를 다룹니다.
 */

// ============================================================
// 1. InstanceType<T> 기본 - 클래스 인스턴스 타입
// ============================================================
console.log('\n=== 1. InstanceType<T> 기본 ===');

class User {
  constructor(
    public id: string,
    public name: string
  ) {}

  greet() {
    return `Hello, ${this.name}`;
  }
}

// User 클래스의 인스턴스 타입 추출
type UserInstance = InstanceType<typeof User>;

const user: UserInstance = new User('u1', 'Alice');
console.log('User Instance:', user.greet());

// ============================================================
// 2. ConstructorParameters<T> 기본 - 생성자 매개변수
// ============================================================
console.log('\n=== 2. ConstructorParameters<T> 기본 ===');

class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number
  ) {}
}

// Product 생성자의 매개변수 타입 → [string, string, number]
type ProductParams = ConstructorParameters<typeof Product>;

const params: ProductParams = ['p1', 'Laptop', 1500];
const product = new Product(...params);

console.log('Product:', product);

// ============================================================
// 3. ThisParameterType<T> 기본 - this 타입 추출
// ============================================================
console.log('\n=== 3. ThisParameterType<T> 기본 ===');

function greet(this: { name: string }, message: string) {
  return `${message}, ${this.name}`;
}

// 함수의 this 타입 추출 → { name: string }
type GreetThis = ThisParameterType<typeof greet>;

const context: GreetThis = { name: 'Alice' };
const greeting = greet.call(context, 'Hello');

console.log('Greeting:', greeting);

// ============================================================
// 4. OmitThisParameter<T> 기본 - this 매개변수 제거
// ============================================================
console.log('\n=== 4. OmitThisParameter<T> 기본 ===');

function logMessage(this: { userId: string }, message: string): void {
  console.log(`[${this.userId}] ${message}`);
}

// this를 제거한 함수 타입 → (message: string) => void
type LogWithoutThis = OmitThisParameter<typeof logMessage>;

const log: LogWithoutThis = (msg) => console.log(msg);
log('Hello without this');

// ============================================================
// 5. ThisType<T> 기본 - this 컨텍스트 명시
// ============================================================
console.log('\n=== 5. ThisType<T> 기본 ===');

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // methods 내부의 this는 D & M 타입
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  const data = desc.data || {};
  const methods = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

const obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // this는 { x: number, y: number } & methods 타입
      this.y += dy;
    },
  },
});

obj.moveBy(5, 10);
console.log('Object position:', obj.x, obj.y);

// ============================================================
// 6. 팩토리 패턴
// ============================================================
console.log('\n=== 6. 팩토리 패턴 ===');

class DatabaseConnection {
  constructor(
    public host: string,
    public port: number
  ) {}

  connect() {
    console.log(`Connecting to ${this.host}:${this.port}`);
  }
}

function createInstance<T extends new (...args: any[]) => any>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ctor(...args);
}

const connection = createInstance(DatabaseConnection, 'localhost', 5432);
connection.connect();

// ============================================================
// 7. 클래스 유틸리티 타입
// ============================================================
console.log('\n=== 7. 클래스 유틸리티 타입 ===');

abstract class BaseService {
  constructor(public name: string) {}
  abstract execute(): void;
}

class UserService extends BaseService {
  constructor(
    name: string,
    public userId: string
  ) {
    super(name);
  }

  execute() {
    console.log(`UserService executing for ${this.userId}`);
  }
}

// UserService의 생성자 매개변수
type UserServiceParams = ConstructorParameters<typeof UserService>; // [string, string]

// UserService의 인스턴스 타입
type UserServiceInstance = InstanceType<typeof UserService>;

const userService: UserServiceInstance = new UserService('users', 'u1');
userService.execute();

// ============================================================
// 8. this 바인딩 타입
// ============================================================
console.log('\n=== 8. this 바인딩 타입 ===');

interface Logger {
  prefix: string;
  log(message: string): void;
}

function createLogger(prefix: string): Logger {
  return {
    prefix,
    log(this: Logger, message: string) {
      console.log(`[${this.prefix}] ${message}`);
    },
  };
}

const logger = createLogger('INFO');
logger.log('Application started');

// this를 명시한 함수 타입
type LogFunction = (this: Logger, message: string) => void;

const logFn: LogFunction = function (message) {
  console.log(`[${this.prefix}] ${message}`);
};

// ============================================================
// 9. 실무 예제: 플러그인 시스템
// ============================================================
console.log('\n=== 9. 실무 예제: 플러그인 시스템 ===');

interface Plugin {
  name: string;
  install(): void;
}

abstract class BasePlugin implements Plugin {
  constructor(public name: string) {}
  abstract install(): void;
}

class AuthPlugin extends BasePlugin {
  constructor(
    name: string,
    public apiKey: string
  ) {
    super(name);
  }

  install() {
    console.log(`Installing auth plugin with API key: ${this.apiKey}`);
  }
}

class LoggingPlugin extends BasePlugin {
  constructor(
    name: string,
    public level: 'info' | 'debug' | 'error'
  ) {
    super(name);
  }

  install() {
    console.log(`Installing logging plugin with level: ${this.level}`);
  }
}

// 플러그인 레지스트리
type PluginConstructor = new (...args: any[]) => Plugin;

class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();

  register<T extends PluginConstructor>(
    ctor: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T> {
    const plugin = new ctor(...args) as InstanceType<T>;
    this.plugins.set(plugin.name, plugin);
    plugin.install();
    return plugin;
  }

  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }
}

const registry = new PluginRegistry();
registry.register(AuthPlugin, 'auth', 'secret-key');
registry.register(LoggingPlugin, 'logger', 'debug');

// ============================================================
// 10. 고급 패턴: 믹스인
// ============================================================
console.log('\n=== 10. 고급 패턴: 믹스인 ===');

type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = new Date();

    getTimestamp() {
      return this.timestamp;
    }
  };
}

function Tagged<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    tag = 'default';

    setTag(tag: string) {
      this.tag = tag;
    }
  };
}

class BaseEntity {
  constructor(public id: string) {}
}

const TimestampedEntity = Timestamped(BaseEntity);
const TaggedTimestampedEntity = Tagged(TimestampedEntity);

// 믹스인 적용 후 인스턴스 타입
type EntityInstance = InstanceType<typeof TaggedTimestampedEntity>;

const entity: EntityInstance = new TaggedTimestampedEntity('e1');
entity.setTag('important');

console.log('Entity:', entity.id, entity.tag, entity.getTimestamp());

// ============================================================
// 11. 제네릭 클래스와 함께 사용
// ============================================================
console.log('\n=== 11. 제네릭 클래스와 함께 사용 ===');

class Container<T> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value;
  }
}

// 제네릭 클래스의 인스턴스 타입
type StringContainer = InstanceType<typeof Container<string>>;
// 하지만 위처럼 쓸 수 없음 (typeof는 제네릭 인자를 받지 않음)

// 올바른 방법
const stringContainer = new Container('hello');
type StringContainerType = typeof stringContainer; // Container<string>

console.log('String Container:', stringContainer.getValue());

// ============================================================
// 12. Abstract 클래스와 팩토리
// ============================================================
console.log('\n=== 12. Abstract 클래스와 팩토리 ===');

abstract class Shape {
  constructor(public name: string) {}
  abstract area(): number;
}

class Circle extends Shape {
  constructor(
    name: string,
    public radius: number
  ) {
    super(name);
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(
    name: string,
    public width: number,
    public height: number
  ) {
    super(name);
  }

  area() {
    return this.width * this.height;
  }
}

type ShapeConstructor = new (...args: any[]) => Shape;

function createShape<T extends ShapeConstructor>(
  ctor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new ctor(...args);
}

const circle = createShape(Circle, 'circle1', 5);
const rectangle = createShape(Rectangle, 'rect1', 10, 20);

console.log('Circle area:', circle.area());
console.log('Rectangle area:', rectangle.area());

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. InstanceType<T>
 *    - 생성자 함수 T의 인스턴스 타입 추출
 *    - 용도: 팩토리 패턴, 플러그인 시스템
 *    - 예: InstanceType<typeof MyClass>
 *
 * 2. ConstructorParameters<T>
 *    - 생성자 함수 T의 매개변수 타입을 튜플로 추출
 *    - 용도: 팩토리 함수, 인스턴스 생성 래퍼
 *    - 예: ConstructorParameters<typeof MyClass> → [string, number]
 *
 * 3. ThisParameterType<T>
 *    - 함수 T의 this 타입 추출
 *    - 용도: this 컨텍스트 분리
 *    - 예: ThisParameterType<(this: Context) => void> → Context
 *
 * 4. OmitThisParameter<T>
 *    - 함수 T에서 this 매개변수 제거
 *    - 용도: this 바인딩 없는 함수 타입
 *    - 예: OmitThisParameter<(this: Ctx, msg: string) => void> → (msg: string) => void
 *
 * 5. ThisType<T>
 *    - 객체 리터럴의 this 컨텍스트 명시
 *    - 용도: 메서드 내부 this 타입 지정
 *    - --noImplicitThis 옵션과 함께 사용
 *
 * 6. 실무 패턴
 *    - 팩토리: createInstance<T>(ctor: T, ...args: ConstructorParameters<T>)
 *    - 플러그인: register<T>(ctor: T, ...args): InstanceType<T>
 *    - 믹스인: type Constructor<T> = new (...args: any[]) => T
 *
 * 7. 제약사항
 *    - typeof는 제네릭 인자를 받지 않음
 *    - abstract 클래스는 인스턴스화 불가
 */

console.log(`
예제:
  type UserInstance = InstanceType<typeof User>;
  type Params = ConstructorParameters<typeof Product>;
  type ThisContext = ThisParameterType<typeof fn>;
  type NoThis = OmitThisParameter<typeof fn>;
`);
