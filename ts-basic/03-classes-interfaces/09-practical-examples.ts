/**
 * 09-practical-examples.ts
 * 실전 OOP 패턴
 */

// 1. Repository 패턴
interface Entity {
  id: string;
}

interface Repository<T extends Entity> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

interface User extends Entity {
  name: string;
  email: string;
}

class InMemoryUserRepository implements Repository<User> {
  private users: User[] = [];
  private nextId = 1;

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: String(this.nextId++),
      ...userData,
    };
    this.users.push(user);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = { ...this.users[index], ...userData };
    return this.users[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }
}

console.log('=== Repository 패턴 ===');
(async () => {
  const repo = new InMemoryUserRepository();

  const user1 = await repo.create({ name: 'Alice', email: 'alice@example.com' });
  const user2 = await repo.create({ name: 'Bob', email: 'bob@example.com' });

  console.log('All users:', await repo.findAll());
  console.log('User 1:', await repo.findById(user1.id));

  await repo.update(user1.id, { name: 'Alice Updated' });
  console.log('Updated user:', await repo.findById(user1.id));

  await repo.delete(user2.id);
  console.log('After delete:', await repo.findAll());
})();

// 2. Service Layer 패턴
class UserService {
  constructor(private userRepository: Repository<User>) {}

  async registerUser(name: string, email: string): Promise<User> {
    // 비즈니스 로직
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }

    const user = await this.userRepository.create({ name, email });
    console.log(`User registered: ${user.name}`);
    return user;
  }

  async getUserProfile(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async updateUserEmail(id: string, newEmail: string): Promise<User | null> {
    if (!newEmail.includes('@')) {
      throw new Error('Invalid email');
    }

    return this.userRepository.update(id, { email: newEmail });
  }
}

console.log('\n=== Service Layer 패턴 ===');
(async () => {
  const repo = new InMemoryUserRepository();
  const service = new UserService(repo);

  const user = await service.registerUser('Charlie', 'charlie@example.com');
  console.log('Registered:', user);

  const profile = await service.getUserProfile(user.id);
  console.log('Profile:', profile);
})();

// 3. DTO (Data Transfer Object) 패턴
interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

class UserMapper {
  static toResponseDTO(user: User & { createdAt: Date }): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
}

console.log('\n=== DTO 패턴 ===');
const userWithDate = {
  id: '1',
  name: 'Alice',
  email: 'alice@example.com',
  createdAt: new Date(),
};
const dto = UserMapper.toResponseDTO(userWithDate);
console.log('DTO:', dto);

// 4. Facade 패턴
class DatabaseService {
  connect(): void {
    console.log('  Database connected');
  }

  disconnect(): void {
    console.log('  Database disconnected');
  }
}

class CacheService {
  init(): void {
    console.log('  Cache initialized');
  }

  clear(): void {
    console.log('  Cache cleared');
  }
}

class LoggerService {
  setup(): void {
    console.log('  Logger setup');
  }
}

// Facade
class ApplicationFacade {
  private db = new DatabaseService();
  private cache = new CacheService();
  private logger = new LoggerService();

  start(): void {
    console.log('Starting application...');
    this.db.connect();
    this.cache.init();
    this.logger.setup();
    console.log('Application started!');
  }

  shutdown(): void {
    console.log('Shutting down...');
    this.cache.clear();
    this.db.disconnect();
    console.log('Application stopped!');
  }
}

console.log('\n=== Facade 패턴 ===');
const app = new ApplicationFacade();
app.start();
app.shutdown();

// 5. 의존성 주입 컨테이너
interface ServiceConstructor<T> {
  new (...args: any[]): T;
}

class DIContainer {
  private services = new Map<string, any>();

  register<T>(name: string, constructor: ServiceConstructor<T>): void {
    this.services.set(name, constructor);
  }

  resolve<T>(name: string): T {
    const constructor = this.services.get(name);
    if (!constructor) {
      throw new Error(`Service ${name} not found`);
    }
    return new constructor();
  }
}

console.log('\n=== DI Container ===');
const container = new DIContainer();
container.register('UserRepository', InMemoryUserRepository);
const userRepo = container.resolve<Repository<User>>('UserRepository');
console.log('Resolved:', userRepo);

// 6. 이벤트 버스
interface Event {
  type: string;
  payload: any;
}

type EventHandler = (event: Event) => void;

class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  on(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  emit(event: Event): void {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach((handler) => handler(event));
  }
}

console.log('\n=== Event Bus ===');
const eventBus = new EventBus();

eventBus.on('user.created', (event) => {
  console.log('Handler 1:', event.payload);
});

eventBus.on('user.created', (event) => {
  console.log('Handler 2:', event.payload);
});

eventBus.emit({
  type: 'user.created',
  payload: { id: '1', name: 'Alice' },
});

// 7. Specification 패턴
interface Specification<T> {
  isSatisfiedBy(item: T): boolean;
  and(spec: Specification<T>): Specification<T>;
  or(spec: Specification<T>): Specification<T>;
}

abstract class BaseSpecification<T> implements Specification<T> {
  abstract isSatisfiedBy(item: T): boolean;

  and(spec: Specification<T>): Specification<T> {
    return new AndSpecification(this, spec);
  }

  or(spec: Specification<T>): Specification<T> {
    return new OrSpecification(this, spec);
  }
}

class AndSpecification<T> extends BaseSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    return this.left.isSatisfiedBy(item) && this.right.isSatisfiedBy(item);
  }
}

class OrSpecification<T> extends BaseSpecification<T> {
  constructor(
    private left: Specification<T>,
    private right: Specification<T>
  ) {
    super();
  }

  isSatisfiedBy(item: T): boolean {
    return this.left.isSatisfiedBy(item) || this.right.isSatisfiedBy(item);
  }
}

interface Product {
  name: string;
  price: number;
  category: string;
}

class PriceSpec extends BaseSpecification<Product> {
  constructor(private maxPrice: number) {
    super();
  }

  isSatisfiedBy(product: Product): boolean {
    return product.price <= this.maxPrice;
  }
}

class CategorySpec extends BaseSpecification<Product> {
  constructor(private category: string) {
    super();
  }

  isSatisfiedBy(product: Product): boolean {
    return product.category === this.category;
  }
}

console.log('\n=== Specification 패턴 ===');
const products: Product[] = [
  { name: 'Laptop', price: 1200, category: 'Electronics' },
  { name: 'Mouse', price: 25, category: 'Electronics' },
  { name: 'Desk', price: 300, category: 'Furniture' },
];

const cheapElectronics = new PriceSpec(100).and(new CategorySpec('Electronics'));
const filtered = products.filter((p) => cheapElectronics.isSatisfiedBy(p));
console.log('Filtered:', filtered);

// 8. Unit of Work 패턴
class UnitOfWork {
  private newEntities: any[] = [];
  private dirtyEntities: any[] = [];
  private removedEntities: any[] = [];

  registerNew(entity: any): void {
    this.newEntities.push(entity);
  }

  registerDirty(entity: any): void {
    this.dirtyEntities.push(entity);
  }

  registerRemoved(entity: any): void {
    this.removedEntities.push(entity);
  }

  async commit(): Promise<void> {
    console.log('Committing changes...');
    console.log(`  New: ${this.newEntities.length}`);
    console.log(`  Updated: ${this.dirtyEntities.length}`);
    console.log(`  Deleted: ${this.removedEntities.length}`);

    this.newEntities = [];
    this.dirtyEntities = [];
    this.removedEntities = [];
  }
}

console.log('\n=== Unit of Work 패턴 ===');
const uow = new UnitOfWork();
uow.registerNew({ id: '1', name: 'New User' });
uow.registerDirty({ id: '2', name: 'Updated User' });
uow.registerRemoved({ id: '3', name: 'Deleted User' });
uow.commit();

// 9. Value Object 패턴
class Email {
  private readonly value: string;

  constructor(email: string) {
    if (!email.includes('@')) {
      throw new Error('Invalid email');
    }
    this.value = email;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  toString(): string {
    return `${this.currency} ${this.amount}`;
  }
}

console.log('\n=== Value Object 패턴 ===');
const email1 = new Email('user@example.com');
const email2 = new Email('user@example.com');
console.log('Emails equal:', email1.equals(email2));

const money1 = new Money(100, 'USD');
const money2 = new Money(50, 'USD');
const total = money1.add(money2);
console.log('Total:', total.toString());

// 10. 실전 종합: E-Commerce 시스템
interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

class Order {
  private items: OrderItem[] = [];
  private _status: 'pending' | 'confirmed' | 'shipped' = 'pending';

  constructor(public readonly id: string) {}

  addItem(item: OrderItem): void {
    if (this._status !== 'pending') {
      throw new Error('Cannot modify confirmed order');
    }
    this.items.push(item);
  }

  get total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get status(): string {
    return this._status;
  }

  confirm(): void {
    if (this.items.length === 0) {
      throw new Error('Cannot confirm empty order');
    }
    this._status = 'confirmed';
    console.log(`Order ${this.id} confirmed`);
  }

  ship(): void {
    if (this._status !== 'confirmed') {
      throw new Error('Can only ship confirmed orders');
    }
    this._status = 'shipped';
    console.log(`Order ${this.id} shipped`);
  }
}

class OrderService {
  private orders = new Map<string, Order>();

  createOrder(id: string): Order {
    const order = new Order(id);
    this.orders.set(id, order);
    return order;
  }

  getOrder(id: string): Order | undefined {
    return this.orders.get(id);
  }

  processOrder(id: string): void {
    const order = this.orders.get(id);
    if (!order) {
      throw new Error('Order not found');
    }

    order.confirm();
    order.ship();
  }
}

console.log('\n=== 실전: E-Commerce ===');
const orderService = new OrderService();
const order = orderService.createOrder('ORD-001');

order.addItem({ productId: 'P1', quantity: 2, price: 100 });
order.addItem({ productId: 'P2', quantity: 1, price: 50 });

console.log(`Total: $${order.total}`);
orderService.processOrder('ORD-001');
console.log(`Final status: ${order.status}`);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. Repository 패턴
 *    - 데이터 접근 로직 캡슐화
 *    - CRUD 인터페이스 정의
 *
 * 2. Service Layer
 *    - 비즈니스 로직 캡슐화
 *    - Repository 사용
 *
 * 3. DTO 패턴
 *    - 데이터 전송 객체
 *    - 계층 간 데이터 전달
 *
 * 4. Facade 패턴
 *    - 복잡한 시스템 단순화
 *    - 통합 인터페이스 제공
 *
 * 5. DI Container
 *    - 의존성 주입 관리
 *    - 느슨한 결합
 *
 * 6. Event Bus
 *    - 이벤트 기반 통신
 *    - 발행/구독 패턴
 *
 * 7. Specification 패턴
 *    - 비즈니스 규칙 캡슐화
 *    - 조합 가능한 조건
 *
 * 8. Unit of Work
 *    - 트랜잭션 관리
 *    - 변경 사항 추적
 *
 * 9. Value Object
 *    - 불변 값 객체
 *    - 도메인 개념 표현
 *
 * 10. Best Practices
 *     ✅ SOLID 원칙 준수
 *     ✅ 계층 분리 (Controller-Service-Repository)
 *     ✅ 의존성 주입 활용
 *     ✅ 인터페이스로 추상화
 *     ✅ 불변성 유지 (Value Object)
 *
 * @see https://martinfowler.com/eaaCatalog/
 */
