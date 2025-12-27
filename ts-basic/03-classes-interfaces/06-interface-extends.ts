/**
 * 06-interface-extends.ts
 * 인터페이스 확장과 결합
 */

// 1. 단일 인터페이스 확장
interface Animal {
  name: string;
  age: number;
}

interface Dog extends Animal {
  breed: string;
  bark(): void;
}

const dog: Dog = {
  name: 'Buddy',
  age: 3,
  breed: 'Golden Retriever',
  bark() {
    console.log('Woof!');
  },
};

console.log('=== 단일 인터페이스 확장 ===');
console.log(`${dog.name} (${dog.breed})`);
dog.bark();

// 2. 다중 인터페이스 확장
interface Flyable {
  fly(): void;
  maxAltitude: number;
}

interface Swimmable {
  swim(): void;
  maxDepth: number;
}

interface Duck extends Flyable, Swimmable {
  quack(): void;
}

const duck: Duck = {
  maxAltitude: 1000,
  maxDepth: 10,
  fly() {
    console.log('Flying...');
  },
  swim() {
    console.log('Swimming...');
  },
  quack() {
    console.log('Quack!');
  },
};

console.log('\n=== 다중 인터페이스 확장 ===');
duck.fly();
duck.swim();
duck.quack();

// 3. 프로퍼티 재정의 (타입 좁히기)
interface Vehicle {
  brand: string;
  speed: number | string;
}

interface Car extends Vehicle {
  speed: number; // 더 구체적인 타입으로 좁힘
  doors: number;
}

const car: Car = {
  brand: 'Toyota',
  speed: 180, // number만 가능
  doors: 4,
};

console.log('\n=== 프로퍼티 재정의 ===');
console.log('Car:', car);

// 4. 인터페이스 병합 (Declaration Merging)
interface User {
  name: string;
}

interface User {
  email: string;
}

interface User {
  age: number;
}

// 세 개의 User 인터페이스가 자동으로 병합됨
const user: User = {
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
};

console.log('\n=== 인터페이스 병합 ===');
console.log('User:', user);

// 5. 네임스페이스와 인터페이스 병합
namespace API {
  export interface Response {
    status: number;
  }
}

namespace API {
  export interface Response {
    data: any;
  }
}

const response: API.Response = {
  status: 200,
  data: { id: 1 },
};

console.log('\n=== 네임스페이스 병합 ===');
console.log('Response:', response);

// 6. 인터페이스 확장 체인
interface Entity {
  id: string;
  createdAt: Date;
}

interface TimestampedEntity extends Entity {
  updatedAt: Date;
}

interface Product extends TimestampedEntity {
  name: string;
  price: number;
}

const product: Product = {
  id: 'prod-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Laptop',
  price: 1200,
};

console.log('\n=== 인터페이스 확장 체인 ===');
console.log('Product:', product);

// 7. 제네릭과 확장
interface Repository<T> {
  getAll(): T[];
  getById(id: string): T | undefined;
}

interface CrudRepository<T> extends Repository<T> {
  create(item: T): T;
  update(id: string, item: Partial<T>): T | undefined;
  delete(id: string): boolean;
}

// UserRepository 구현은 생략 (07-class-implements에서 다룸)

console.log('\n=== 제네릭과 확장 ===');
console.log('CrudRepository interface defined');

// 8. 조건부 확장
interface BaseConfig {
  enabled: boolean;
}

interface ProductionConfig extends BaseConfig {
  ssl: true;
  domain: string;
}

interface DevelopmentConfig extends BaseConfig {
  ssl?: false;
  localPort: number;
}

const prodConfig: ProductionConfig = {
  enabled: true,
  ssl: true,
  domain: 'example.com',
};

const devConfig: DevelopmentConfig = {
  enabled: true,
  localPort: 3000,
};

console.log('\n=== 조건부 확장 ===');
console.log('Prod:', prodConfig);
console.log('Dev:', devConfig);

// 9. 인터페이스와 타입 인터섹션
interface Named {
  name: string;
}

interface Aged {
  age: number;
}

// 인터페이스는 extends, 타입은 &
type Person = Named & Aged & {
  email: string;
};

const person: Person = {
  name: 'Bob',
  age: 25,
  email: 'bob@example.com',
};

console.log('\n=== 인터페이스와 인터섹션 ===');
console.log('Person:', person);

// 10. 함수 시그니처 확장
interface Logger {
  log(message: string): void;
}

interface AdvancedLogger extends Logger {
  log(level: 'info' | 'warn' | 'error', message: string): void;
}

// 구현에서는 두 시그니처 모두 지원해야 함
const logger: AdvancedLogger = {
  log(levelOrMessage: string | 'info' | 'warn' | 'error', message?: string): void {
    if (message) {
      console.log(`[${levelOrMessage}] ${message}`);
    } else {
      console.log(levelOrMessage);
    }
  },
};

console.log('\n=== 함수 시그니처 확장 ===');
logger.log('Simple message');
logger.log('error', 'Error occurred');

// 11. 읽기 전용 확장
interface ReadonlyPoint {
  readonly x: number;
  readonly y: number;
}

interface MutablePoint extends ReadonlyPoint {
  // x, y는 여전히 readonly
  move(dx: number, dy: number): void;
}

const point: MutablePoint = {
  x: 10,
  y: 20,
  move(dx, dy) {
    // point.x += dx; // ❌ 에러: readonly
    console.log(`Moving by (${dx}, ${dy})`);
  },
};

console.log('\n=== 읽기 전용 확장 ===');
point.move(5, 10);

// 12. 인덱스 시그니처 확장
interface StringMap {
  [key: string]: string | number;
}

interface TypedStringMap extends StringMap {
  name: string;
  count: number;
}

const typedMap: TypedStringMap = {
  name: 'Example',
  count: 42,
  extra: 'Additional value',
  another: 100,
};

console.log('\n=== 인덱스 시그니처 확장 ===');
console.log('TypedMap:', typedMap);

// 13. 부분 확장 (Partial)
interface FullConfig {
  host: string;
  port: number;
  ssl: boolean;
}

interface OptionalConfig extends Partial<FullConfig> {
  name: string; // 필수
}

const config: OptionalConfig = {
  name: 'MyApp',
  port: 3000, // 나머지는 선택적
};

console.log('\n=== 부분 확장 ===');
console.log('Config:', config);

// 14. 확장과 오버라이드
interface BaseResponse {
  status: number;
  message: string;
}

interface SuccessResponse extends BaseResponse {
  status: 200; // 리터럴 타입으로 좁힘
  data: any;
}

interface ErrorResponse extends BaseResponse {
  status: 400 | 500; // 유니온 리터럴로 좁힘
  error: string;
}

const success: SuccessResponse = {
  status: 200,
  message: 'OK',
  data: { id: 1 },
};

const error: ErrorResponse = {
  status: 404 as 400 | 500,
  message: 'Not Found',
  error: 'Resource not found',
};

console.log('\n=== 확장과 오버라이드 ===');
console.log('Success:', success);
console.log('Error:', error);

// 15. 실전 예제: 모델 계층 구조
interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SoftDeletableModel extends BaseModel {
  deletedAt?: Date;
  isDeleted: boolean;
}

interface AuditableModel extends SoftDeletableModel {
  createdBy: string;
  updatedBy: string;
}

interface BlogPost extends AuditableModel {
  title: string;
  content: string;
  tags: string[];
  published: boolean;
}

const blogPost: BlogPost = {
  id: 'post-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  createdBy: 'user-1',
  updatedBy: 'user-1',
  title: 'Introduction to TypeScript',
  content: 'TypeScript is a typed superset of JavaScript...',
  tags: ['typescript', 'programming'],
  published: true,
};

console.log('\n=== 실전: 모델 계층 구조 ===');
console.log('Blog Post:', {
  title: blogPost.title,
  tags: blogPost.tags,
  author: blogPost.createdBy,
});

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 인터페이스 확장
 *    interface Child extends Parent {
 *      newProperty: type;
 *    }
 *
 * 2. 다중 확장
 *    - 여러 인터페이스 동시 확장
 *      interface C extends A, B { }
 *
 * 3. 프로퍼티 재정의
 *    - 더 구체적인 타입으로 좁히기
 *      interface Parent { speed: number | string; }
 *      interface Child extends Parent { speed: number; }
 *
 * 4. 인터페이스 병합
 *    - 같은 이름 여러 번 선언
 *    - 자동으로 병합됨
 *      interface User { name: string; }
 *      interface User { age: number; }
 *
 * 5. 네임스페이스 병합
 *    - 네임스페이스 안의 인터페이스도 병합
 *
 * 6. 확장 체인
 *    - A → B → C 형태로 연쇄 확장
 *    - 모든 부모의 프로퍼티 상속
 *
 * 7. 제네릭과 확장
 *    interface Child<T> extends Parent<T> { }
 *
 * 8. 함수 시그니처 확장
 *    - 오버로드 시그니처 추가 가능
 *
 * 9. readonly 확장
 *    - readonly 프로퍼티는 유지됨
 *    - 새 메서드 추가는 가능
 *
 * 10. 인덱스 시그니처 확장
 *     - 인덱스 시그니처 + 구체적 프로퍼티
 *
 * 11. 유틸리티 타입과 확장
 *     - Partial, Required, Pick, Omit 등 조합
 *
 * 12. 인터페이스 vs 타입 확장
 *     인터페이스:
 *     - extends 키워드
 *     - 병합 가능
 *     - 확장 명확
 *
 *     타입:
 *     - & 연산자
 *     - 병합 불가
 *     - 유연함
 *
 * 13. Best Practices
 *     ✅ 확장으로 계층 구조 명확히
 *     ✅ 다중 확장으로 믹스인 효과
 *     ✅ 프로퍼티 재정의로 타입 좁히기
 *     ✅ 병합 기능 신중하게 사용
 *     ✅ 확장 체인은 얕게 유지
 *
 * 14. 사용 시기
 *     ✅ 공통 속성 추상화
 *     ✅ 도메인 모델 계층 구조
 *     ✅ API 응답 타입 확장
 *     ✅ 설정 객체 확장
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html#extending-types
 */
