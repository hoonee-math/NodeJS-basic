/**
 * 08-advanced-patterns.ts
 * 고급 클래스 패턴
 */

// 1. Getter와 Setter
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

console.log('=== Getter와 Setter ===');
const temp = new Temperature();
temp.celsius = 25;
console.log(`${temp.celsius}°C = ${temp.fahrenheit}°F`);
temp.fahrenheit = 77;
console.log(`${temp.fahrenheit}°F = ${temp.celsius}°C`);

// 2. static 프로퍼티와 메서드
class MathUtils {
  static readonly PI = 3.14159;
  static readonly E = 2.71828;

  static add(a: number, b: number): number {
    return a + b;
  }

  static circleArea(radius: number): number {
    return this.PI * radius ** 2;
  }
}

console.log('\n=== static 멤버 ===');
console.log(`PI: ${MathUtils.PI}`);
console.log(`10 + 20 = ${MathUtils.add(10, 20)}`);
console.log(`Circle area (r=5): ${MathUtils.circleArea(5).toFixed(2)}`);

// 3. 싱글톤 패턴
class Singleton {
  private static instance: Singleton;
  private constructor(private value: string) {}

  static getInstance(value?: string): Singleton {
    if (!Singleton.instance) {
      if (!value) {
        throw new Error('Initial value required');
      }
      Singleton.instance = new Singleton(value);
    }
    return Singleton.instance;
  }

  getValue(): string {
    return this.value;
  }
}

console.log('\n=== 싱글톤 패턴 ===');
const singleton1 = Singleton.getInstance('First');
const singleton2 = Singleton.getInstance('Second');
console.log('Same instance:', singleton1 === singleton2);
console.log('Value:', singleton1.getValue());

// 4. 믹스인 (Mixins)
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
    tags: string[] = [];
    addTag(tag: string) {
      this.tags.push(tag);
    }
  };
}

class BaseClass {
  constructor(public name: string) {}
}

const TimestampedClass = Timestamped(BaseClass);
const TaggedTimestampedClass = Tagged(Timestamped(BaseClass));

console.log('\n=== 믹스인 ===');
const obj = new TaggedTimestampedClass('Example');
obj.addTag('important');
console.log('Name:', obj.name);
console.log('Tags:', obj.tags);
console.log('Timestamp:', obj.getTimestamp());

// 5. 제네릭 클래스
class GenericBox<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return [...this.items];
  }
}

console.log('\n=== 제네릭 클래스 ===');
const numberBox = new GenericBox<number>();
numberBox.add(1);
numberBox.add(2);
numberBox.add(3);
console.log('Numbers:', numberBox.getAll());

const stringBox = new GenericBox<string>();
stringBox.add('a');
stringBox.add('b');
console.log('Strings:', stringBox.getAll());

// 6. 추상 팩토리 패턴
abstract class Animal {
  abstract makeSound(): string;
}

class Dog extends Animal {
  makeSound(): string {
    return 'Woof!';
  }
}

class Cat extends Animal {
  makeSound(): string {
    return 'Meow!';
  }
}

class AnimalFactory {
  static createAnimal(type: 'dog' | 'cat'): Animal {
    switch (type) {
      case 'dog':
        return new Dog();
      case 'cat':
        return new Cat();
    }
  }
}

console.log('\n=== 추상 팩토리 패턴 ===');
const dog = AnimalFactory.createAnimal('dog');
const cat = AnimalFactory.createAnimal('cat');
console.log('Dog:', dog.makeSound());
console.log('Cat:', cat.makeSound());

// 7. 빌더 패턴
class User {
  private constructor(
    public name: string,
    public email: string,
    public age?: number,
    public role?: string
  ) {}

  static builder() {
    return new UserBuilder();
  }
}

class UserBuilder {
  private name!: string;
  private email!: string;
  private age?: number;
  private role?: string;

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setEmail(email: string): this {
    this.email = email;
    return this;
  }

  setAge(age: number): this {
    this.age = age;
    return this;
  }

  setRole(role: string): this {
    this.role = role;
    return this;
  }

  build(): User {
    return new User(this.name, this.email, this.age, this.role);
  }
}

console.log('\n=== 빌더 패턴 ===');
const user = User.builder()
  .setName('Alice')
  .setEmail('alice@example.com')
  .setAge(30)
  .setRole('admin')
  .build();
console.log('User:', user);

// 8. 데코레이터 패턴 (함수형)
interface Component {
  operation(): string;
}

class ConcreteComponent implements Component {
  operation(): string {
    return 'Base';
  }
}

class Decorator implements Component {
  constructor(protected component: Component) {}

  operation(): string {
    return this.component.operation();
  }
}

class BoldDecorator extends Decorator {
  operation(): string {
    return `<b>${super.operation()}</b>`;
  }
}

class ItalicDecorator extends Decorator {
  operation(): string {
    return `<i>${super.operation()}</i>`;
  }
}

console.log('\n=== 데코레이터 패턴 ===');
let component: Component = new ConcreteComponent();
component = new BoldDecorator(component);
component = new ItalicDecorator(component);
console.log('Result:', component.operation());

// 9. 옵저버 패턴
interface Observer {
  update(data: any): void;
}

class Subject {
  private observers: Observer[] = [];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class ConcreteObserver implements Observer {
  constructor(private name: string) {}

  update(data: any): void {
    console.log(`${this.name} received:`, data);
  }
}

console.log('\n=== 옵저버 패턴 ===');
const subject = new Subject();
const observer1 = new ConcreteObserver('Observer 1');
const observer2 = new ConcreteObserver('Observer 2');

subject.attach(observer1);
subject.attach(observer2);
subject.notify({ event: 'data changed' });

// 10. 전략 패턴
interface SortStrategy {
  sort(data: number[]): number[];
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('Using bubble sort');
    return [...data].sort((a, b) => a - b);
  }
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    console.log('Using quick sort');
    return [...data].sort((a, b) => a - b);
  }
}

class Sorter {
  constructor(private strategy: SortStrategy) {}

  setStrategy(strategy: SortStrategy): void {
    this.strategy = strategy;
  }

  sort(data: number[]): number[] {
    return this.strategy.sort(data);
  }
}

console.log('\n=== 전략 패턴 ===');
const sorter = new Sorter(new BubbleSort());
console.log(sorter.sort([3, 1, 4, 1, 5]));

sorter.setStrategy(new QuickSort());
console.log(sorter.sort([9, 2, 6, 5, 3]));

// 11. 체인 오브 리스폰시빌리티 패턴
abstract class Handler {
  protected next?: Handler;

  setNext(handler: Handler): Handler {
    this.next = handler;
    return handler;
  }

  handle(request: string): string | null {
    if (this.next) {
      return this.next.handle(request);
    }
    return null;
  }
}

class ConcreteHandler1 extends Handler {
  handle(request: string): string | null {
    if (request === 'One') {
      return `Handler1 processed: ${request}`;
    }
    return super.handle(request);
  }
}

class ConcreteHandler2 extends Handler {
  handle(request: string): string | null {
    if (request === 'Two') {
      return `Handler2 processed: ${request}`;
    }
    return super.handle(request);
  }
}

console.log('\n=== 체인 오브 리스폰시빌리티 ===');
const handler1 = new ConcreteHandler1();
const handler2 = new ConcreteHandler2();
handler1.setNext(handler2);

console.log(handler1.handle('One'));
console.log(handler1.handle('Two'));

// 12. 커맨드 패턴
interface Command {
  execute(): void;
  undo(): void;
}

class Light {
  on(): void {
    console.log('Light is ON');
  }

  off(): void {
    console.log('Light is OFF');
  }
}

class LightOnCommand implements Command {
  constructor(private light: Light) {}

  execute(): void {
    this.light.on();
  }

  undo(): void {
    this.light.off();
  }
}

class RemoteControl {
  private history: Command[] = [];

  execute(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    const command = this.history.pop();
    command?.undo();
  }
}

console.log('\n=== 커맨드 패턴 ===');
const light = new Light();
const lightOn = new LightOnCommand(light);
const remote = new RemoteControl();

remote.execute(lightOn);
remote.undo();

// 13. 메멘토 패턴 (상태 저장)
class Memento {
  constructor(private state: string) {}

  getState(): string {
    return this.state;
  }
}

class Originator {
  private state: string = '';

  setState(state: string): void {
    console.log(`Setting state: ${state}`);
    this.state = state;
  }

  save(): Memento {
    return new Memento(this.state);
  }

  restore(memento: Memento): void {
    this.state = memento.getState();
    console.log(`Restored state: ${this.state}`);
  }
}

console.log('\n=== 메멘토 패턴 ===');
const originator = new Originator();
originator.setState('State 1');
const saved = originator.save();

originator.setState('State 2');
originator.restore(saved);

// 14. 플루언트 인터페이스
class QueryBuilder {
  private query: string[] = [];

  select(...fields: string[]): this {
    this.query.push(`SELECT ${fields.join(', ')}`);
    return this;
  }

  from(table: string): this {
    this.query.push(`FROM ${table}`);
    return this;
  }

  where(condition: string): this {
    this.query.push(`WHERE ${condition}`);
    return this;
  }

  build(): string {
    return this.query.join(' ');
  }
}

console.log('\n=== 플루언트 인터페이스 ===');
const query = new QueryBuilder()
  .select('id', 'name')
  .from('users')
  .where('age > 18')
  .build();
console.log('Query:', query);

// 15. 실전 예제: 상태 기계
interface State {
  handle(context: Context): void;
}

class Context {
  private state: State;

  constructor(initialState: State) {
    this.state = initialState;
  }

  setState(state: State): void {
    this.state = state;
  }

  request(): void {
    this.state.handle(this);
  }
}

class StateA implements State {
  handle(context: Context): void {
    console.log('State A handling request');
    context.setState(new StateB());
  }
}

class StateB implements State {
  handle(context: Context): void {
    console.log('State B handling request');
    context.setState(new StateA());
  }
}

console.log('\n=== 실전: 상태 기계 ===');
const context = new Context(new StateA());
context.request();
context.request();
context.request();

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. Getter/Setter
 *    get property() { return this._property; }
 *    set property(value) { this._property = value; }
 *
 * 2. static 멤버
 *    static property: type;
 *    static method() { }
 *
 * 3. 싱글톤 패턴
 *    - private 생성자
 *    - static getInstance()
 *
 * 4. 믹스인
 *    - 함수로 클래스 확장
 *    - 다중 상속 대안
 *
 * 5. 제네릭 클래스
 *    class Box<T> { }
 *
 * 6. 디자인 패턴
 *    - Factory: 객체 생성 캡슐화
 *    - Builder: 복잡한 객체 단계별 생성
 *    - Decorator: 동적 기능 추가
 *    - Observer: 이벤트 구독/발행
 *    - Strategy: 알고리즘 교체
 *    - Command: 작업 캡슐화
 *    - State: 상태별 동작 분리
 *
 * 7. Best Practices
 *    ✅ Getter/Setter로 검증 로직
 *    ✅ static으로 유틸리티 메서드
 *    ✅ 싱글톤은 신중하게
 *    ✅ 믹스인으로 기능 조합
 *    ✅ 디자인 패턴 적절히 활용
 *
 * @see https://refactoring.guru/design-patterns
 */
