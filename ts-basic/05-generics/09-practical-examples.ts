/**
 * 09-practical-examples.ts
 * 실전 제네릭 패턴
 *
 * 앞에서 배운 제네릭 함수, 클래스, 인터페이스, 조건부 타입, infer를 실무에서 어떻게 조합해 사용하는지 배웁니다.
 * 백엔드 개발에서 자주 쓰이는 Repository, Service, HTTP Client, State Management 같은 패턴을 제네릭으로 구현합니다.
 * 이 파일에서는
 * 제네릭 Repository 패턴으로 CRUD 재사용하기,
 * 제네릭 Service Layer로 비즈니스 로직 캡슐화하기,
 * 제네릭 HTTP Client로 타입 안전한 API 호출하기,
 * 제네릭 State Management로 상태 관리하기,
 * 제네릭 Form Validation으로 폼 검증하기,
 * 제네릭 Event Emitter로 타입 안전한 이벤트 처리하기,
 * 제네릭 Cache로 메모이제이션하기,
 * 그리고 제네릭 Builder 패턴으로 객체 생성을 유연하게 만드는 방법을 다룹니다.
 */

// 1. 제네릭 Repository 패턴
console.log('=== 1. 제네릭 Repository 패턴 ===');

interface Entity {
  id: number | string;
}

interface Repository<T extends Entity> {
  findById(id: T['id']): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: T['id'], entity: Partial<T>): Promise<T>;
  delete(id: T['id']): Promise<boolean>;
}

class InMemoryRepository<T extends Entity> implements Repository<T> {
  private items: T[] = [];
  private nextId = 1;

  async findById(id: T['id']): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async create(entity: Omit<T, 'id'>): Promise<T> {
    const newEntity = { ...entity, id: this.nextId++ } as T;
    this.items.push(newEntity);
    return newEntity;
  }

  async update(id: T['id'], updates: Partial<T>): Promise<T> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index === -1) throw new Error('Not found');

    this.items[index] = { ...this.items[index], ...updates };
    return this.items[index];
  }

  async delete(id: T['id']): Promise<boolean> {
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

const userRepo = new InMemoryRepository<User>();

(async () => {
  const user = await userRepo.create({ name: 'Alice', email: 'alice@example.com' });
  console.log('Created user:', user);

  const found = await userRepo.findById(user.id);
  console.log('Found user:', found);
})();

// 2. 제네릭 Service Layer
console.log('\n=== 2. 제네릭 Service Layer ===');

class BaseService<T extends Entity> {
  constructor(protected repository: Repository<T>) {}

  async getById(id: T['id']): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new Error('Not found');
    return entity;
  }

  async getAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async create(data: Omit<T, 'id'>): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: T['id'], data: Partial<T>): Promise<T> {
    return this.repository.update(id, data);
  }

  async delete(id: T['id']): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) throw new Error('Not found');
  }
}

class UserService extends BaseService<User> {
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.repository.findAll();
    return users.find((u) => u.email === email) || null;
  }
}

const userService = new UserService(userRepo);

(async () => {
  const users = await userService.getAll();
  console.log('All users:', users);
})();

// 3. 제네릭 HTTP Client
console.log('\n=== 3. 제네릭 HTTP Client ===');

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

class HttpClient {
  constructor(private baseUrl: string) {}

  async get<T>(path: string): Promise<T> {
    // 실제로는 fetch 사용
    console.log(`→ GET ${this.baseUrl}${path}`);
    return {} as T; // Mock
  }

  async post<T, D = unknown>(path: string, data: D): Promise<T> {
    console.log(`→ POST ${this.baseUrl}${path}`, data);
    return {} as T;
  }

  async put<T, D = unknown>(path: string, data: D): Promise<T> {
    console.log(`→ PUT ${this.baseUrl}${path}`, data);
    return {} as T;
  }

  async delete<T = void>(path: string): Promise<T> {
    console.log(`→ DELETE ${this.baseUrl}${path}`);
    return {} as T;
  }
}

const apiClient = new HttpClient('https://api.example.com');

(async () => {
  const user = await apiClient.get<User>('/users/1');
  await apiClient.post<User>('/users', { name: 'Bob', email: 'bob@example.com' });
})();

// 4. 제네릭 State Management
console.log('\n=== 4. 제네릭 State Management ===');

type Listener<T> = (state: T) => void;

class Store<T> {
  private state: T;
  private listeners: Listener<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(updater: (state: T) => T): void {
    this.state = updater(this.state);
    this.notify();
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }
}

interface AppState {
  user: User | null;
  loading: boolean;
}

const store = new Store<AppState>({ user: null, loading: false });

store.subscribe((state) => {
  console.log('State changed:', state);
});

store.setState((state) => ({ ...state, loading: true }));

// 5. 제네릭 Form Validation
console.log('\n=== 5. 제네릭 Form Validation ===');

type ValidationRule<T> = (value: T) => string | null;
type FieldErrors<T> = Partial<Record<keyof T, string>>;

class FormValidator<T extends Record<string, unknown>> {
  private rules: Partial<Record<keyof T, ValidationRule<T[keyof T]>[]>> = {};

  addRule<K extends keyof T>(field: K, rule: ValidationRule<T[K]>): this {
    if (!this.rules[field]) {
      this.rules[field] = [];
    }
    (this.rules[field] as ValidationRule<T[K]>[]).push(rule);
    return this;
  }

  validate(data: T): FieldErrors<T> {
    const errors: FieldErrors<T> = {};

    for (const field in this.rules) {
      const fieldRules = this.rules[field];
      if (fieldRules) {
        for (const rule of fieldRules) {
          const error = rule(data[field]);
          if (error) {
            errors[field] = error;
            break;
          }
        }
      }
    }

    return errors;
  }
}

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const signupValidator = new FormValidator<SignupForm>()
  .addRule('email', (email) => (email.includes('@') ? null : 'Invalid email'))
  .addRule('password', (pwd) => (pwd.length >= 8 ? null : 'Password too short'))
  .addRule('confirmPassword', (confirm) => (confirm ? null : 'Confirm password required'));

const formData: SignupForm = {
  email: 'test@example.com',
  password: 'password123',
  confirmPassword: 'password123',
};

const errors = signupValidator.validate(formData);
console.log('Validation errors:', errors);

// 6. 제네릭 Event Emitter
console.log('\n=== 6. 제네릭 Event Emitter ===');

type EventMap = Record<string, unknown>;

class TypedEventEmitter<Events extends EventMap> {
  private listeners: {
    [K in keyof Events]?: Array<(data: Events[K]) => void>;
  } = {};

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }

  off<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      this.listeners[event] = eventListeners.filter((l) => l !== listener) as Array<
        (data: Events[K]) => void
      >;
    }
  }
}

interface AppEvents {
  userLogin: { userId: number; timestamp: Date };
  userLogout: { userId: number };
  dataUpdate: { entity: string; id: number };
}

const emitter = new TypedEventEmitter<AppEvents>();

emitter.on('userLogin', (data) => {
  console.log(`→ User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('userLogin', { userId: 1, timestamp: new Date() });

// 7. 제네릭 Cache
console.log('\n=== 7. 제네릭 Cache ===');

class Cache<K, V> {
  private cache = new Map<K, { value: V; expiresAt: number }>();

  set(key: K, value: V, ttl: number = 60000): void {
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const userCache = new Cache<number, User>();
userCache.set(1, { id: 1, name: 'Alice', email: 'alice@example.com' }, 5000);

console.log('Cached user:', userCache.get(1));

// 8. 제네릭 Builder 패턴
console.log('\n=== 8. 제네릭 Builder 패턴 ===');

class Builder<T> {
  private obj: Partial<T> = {};

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.obj[key] = value;
    return this;
  }

  build(): T {
    return this.obj as T;
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

const product = new Builder<Product>()
  .set('id', 1)
  .set('name', 'Laptop')
  .set('price', 1000)
  .set('description', 'High-performance laptop')
  .build();

console.log('Built product:', product);

/**
 * 핵심 정리:
 *
 * 1. Repository 패턴:
 *    - 제네릭으로 CRUD 재사용
 *    - Entity 제약으로 id 보장
 *    - Omit<T, 'id'>로 생성 시 id 제외
 *
 * 2. Service Layer:
 *    - BaseService<T>로 공통 로직
 *    - 상속으로 도메인 로직 추가
 *
 * 3. HTTP Client:
 *    - 메서드별 제네릭 타입
 *    - 요청/응답 타입 분리
 *
 * 4. State Management:
 *    - Store<T>로 타입 안전한 상태
 *    - 구독/알림 패턴
 *
 * 5. Form Validation:
 *    - 필드별 규칙 추가
 *    - FieldErrors<T>로 타입 안전한 에러
 *
 * 6. Event Emitter:
 *    - EventMap으로 이벤트 타입 정의
 *    - 타입 안전한 on/emit
 *
 * 7. Cache:
 *    - TTL 기반 캐시
 *    - 제네릭 키/값
 *
 * 8. Builder 패턴:
 *    - 유연한 객체 생성
 *    - 체이닝 API
 *
 * 이 패턴들을 조합하면 타입 안전하고 재사용 가능한
 * 엔터프라이즈 애플리케이션을 구축할 수 있습니다!
 */
