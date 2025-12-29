/**
 * 04-generic-interfaces.ts
 * 제네릭 인터페이스
 *
 * API 응답 형식이나 이벤트 핸들러처럼 구조는 같은데 담는 데이터 타입만 다를 때 제네릭 인터페이스를 사용합니다.
 * 인터페이스에 타입 매개변수를 선언하면 동일한 구조를 여러 타입에 재사용할 수 있어 중복을 줄일 수 있습니다.
 * 이 파일에서는
 * 기본 제네릭 인터페이스 선언하기,
 * 제네릭 함수 시그니처,
 * 제네릭 인덱스 시그니처,
 * 제네릭 인터페이스 확장,
 * 제네릭과 인터섹션 타입 조합,
 * API 응답 인터페이스 설계,
 * 그리고 제네릭 이벤트 핸들러 패턴을 다룹니다.
 */

// 1. 기본 제네릭 인터페이스
console.log('=== 1. 기본 제네릭 인터페이스 ===');

interface Box<T> {
  value: T;
}

const stringBox: Box<string> = { value: 'hello' };
const numberBox: Box<number> = { value: 42 };
const booleanBox: Box<boolean> = { value: true };

console.log('String box:', stringBox.value);
console.log('Number box:', numberBox.value);
console.log('Boolean box:', booleanBox.value);

// 2. 제네릭 함수 시그니처
console.log('\n=== 2. 제네릭 함수 시그니처 ===');

interface Transformer<T, U> {
  transform(input: T): U;
}

const numberToString: Transformer<number, string> = {
  transform(input: number): string {
    return input.toString();
  },
};

const stringToNumber: Transformer<string, number> = {
  transform(input: string): number {
    return parseInt(input, 10);
  },
};

console.log('Number to string:', numberToString.transform(42)); // "42"
console.log('String to number:', stringToNumber.transform('100')); // 100

// 3. 제네릭 인덱스 시그니처
console.log('\n=== 3. 제네릭 인덱스 시그니처 ===');

interface Dictionary<T> {
  [key: string]: T;
}

const stringDict: Dictionary<string> = {
  name: 'Alice',
  city: 'Seoul',
};

const numberDict: Dictionary<number> = {
  age: 30,
  score: 95,
};

console.log('String dictionary:', stringDict);
console.log('Number dictionary:', numberDict);

// 4. 제네릭 인터페이스 확장
console.log('\n=== 4. 제네릭 인터페이스 확장 ===');

interface Entity<T> {
  id: T;
}

interface Named {
  name: string;
}

interface User<T> extends Entity<T>, Named {
  email: string;
}

const user1: User<number> = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
};

const user2: User<string> = {
  id: 'user_123',
  name: 'Bob',
  email: 'bob@example.com',
};

console.log('User with number id:', user1);
console.log('User with string id:', user2);

// 5. 제네릭 + 인터섹션 타입
console.log('\n=== 5. 제네릭 + 인터섹션 타입 ===');

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface WithTimestamp<T> extends Timestamped {
  data: T;
}

const article: WithTimestamp<{ title: string; content: string }> = {
  data: {
    title: 'TypeScript Guide',
    content: 'Learn generics...',
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

console.log('Article:', article);

// 6. API 응답 인터페이스
console.log('\n=== 6. API 응답 인터페이스 ===');

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
}

const successResponse: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: 'Alice' },
  timestamp: new Date().toISOString(),
};

const errorResponse: ApiResponse<never> = {
  success: false,
  error: {
    code: 'NOT_FOUND',
    message: 'User not found',
  },
  timestamp: new Date().toISOString(),
};

console.log('Success response:', successResponse);
console.log('Error response:', errorResponse);

// 7. 제네릭 이벤트 핸들러
console.log('\n=== 7. 제네릭 이벤트 핸들러 ===');

interface EventHandler<T> {
  handle(event: T): void;
}

interface ClickEvent {
  type: 'click';
  x: number;
  y: number;
}

interface KeyPressEvent {
  type: 'keypress';
  key: string;
}

const clickHandler: EventHandler<ClickEvent> = {
  handle(event) {
    console.log(`→ Click at (${event.x}, ${event.y})`);
  },
};

const keyPressHandler: EventHandler<KeyPressEvent> = {
  handle(event) {
    console.log(`→ Key pressed: ${event.key}`);
  },
};

clickHandler.handle({ type: 'click', x: 100, y: 200 });
keyPressHandler.handle({ type: 'keypress', key: 'Enter' });

// 8. Repository 인터페이스
console.log('\n=== 8. Repository 인터페이스 ===');

interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<boolean>;
}

class InMemoryRepository<T extends { id: ID }, ID> implements Repository<T, ID> {
  private items: T[] = [];

  async findById(id: ID): Promise<T | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async findAll(): Promise<T[]> {
    return this.items;
  }

  async save(entity: T): Promise<T> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
    } else {
      this.items.push(entity);
    }
    return entity;
  }

  async delete(id: ID): Promise<boolean> {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const productRepo = new InMemoryRepository<Product, number>();

(async () => {
  await productRepo.save({ id: 1, name: 'Laptop', price: 1000 });
  await productRepo.save({ id: 2, name: 'Mouse', price: 20 });

  const product = await productRepo.findById(1);
  console.log('Found product:', product);

  const allProducts = await productRepo.findAll();
  console.log('All products:', allProducts);
})();

// 9. Paginated Response
console.log('\n=== 9. Paginated Response ===');

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const userPage: PaginatedResponse<User<number>> = {
  items: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ],
  total: 100,
  page: 1,
  pageSize: 2,
  hasNext: true,
  hasPrevious: false,
};

console.log('Paginated users:', userPage);

// 10. Observable 패턴
console.log('\n=== 10. Observable 패턴 ===');

interface Observer<T> {
  next(value: T): void;
  error?(error: Error): void;
  complete?(): void;
}

interface Observable<T> {
  subscribe(observer: Observer<T>): void;
}

class SimpleObservable<T> implements Observable<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  emit(value: T): void {
    this.observers.forEach((observer) => observer.next(value));
  }

  complete(): void {
    this.observers.forEach((observer) => observer.complete?.());
  }
}

const numberObservable = new SimpleObservable<number>();

numberObservable.subscribe({
  next(value) {
    console.log('Observer received:', value);
  },
  complete() {
    console.log('Observer completed');
  },
});

numberObservable.emit(1);
numberObservable.emit(2);
numberObservable.emit(3);
numberObservable.complete();

/**
 * 핵심 정리:
 *
 * 1. 제네릭 인터페이스 기본 문법:
 *    interface Name<T> { ... }
 *
 * 2. 다중 타입 매개변수:
 *    interface Pair<T, U> { ... }
 *
 * 3. 제네릭 함수 시그니처:
 *    interface Fn<T, U> { (arg: T): U }
 *
 * 4. 제네릭 인덱스 시그니처:
 *    interface Dict<T> { [key: string]: T }
 *
 * 5. 인터페이스 확장:
 *    interface Child<T> extends Parent<T> { ... }
 *
 * 6. 실무 패턴:
 *    - ApiResponse<T>: API 응답 타입
 *    - Repository<T, ID>: 저장소 패턴
 *    - PaginatedResponse<T>: 페이지네이션
 *    - Observer<T>: Observable 패턴
 *
 * 7. 타입 안전성:
 *    - 컴파일 타임 타입 체크
 *    - 자동완성 지원
 *    - 리팩토링 안전성
 *
 * 8. 제네릭 인터페이스 vs 제네릭 타입:
 *    - 인터페이스: 확장 가능, 선언 병합
 *    - 타입: 유니온, 인터섹션, 조건부 타입
 */
