/**
 * 02-intersection-types.ts
 * 인터섹션 타입 (Intersection Types) - AND 관계
 *
 * 여러 타입의 기능을 하나로 합치고 싶을 때 인터섹션 타입(A & B)을 사용합니다.
 * 이 파일에서는 
 * 기본 인터섹션으로 타입 합치기, 
 * 믹스인 패턴으로 여러 기능 조합하기, 
 * 제네릭과 함께 사용해 동적으로 타입 확장하기, 
 * 같은 프로퍼티 이름이 충돌할 때 never 타입이 되는 문제, 
 * 그리고 실무에서 자주 쓰는 Timestamped(생성일/수정일), Deletable(소프트 삭제), Metadata(메타데이터) 패턴을 다룹니다.
 */

// 1. 기본 인터섹션 타입 (A & B)
console.log('=== 1. 기본 인터섹션 타입 ===');

interface Named {
  name: string;
}

interface Aged {
  age: number;
}

// Named AND Aged - 두 타입의 모든 프로퍼티를 가져야 함
type Person = Named & Aged;

const person: Person = {
  name: 'Alice',
  age: 30,
};

console.log(`Person: ${person.name}, ${person.age}세`);

// 2. 타입 확장 (믹스인 패턴)
console.log('\n=== 2. 타입 확장 (믹스인) ===');

interface Printable {
  print(): void;
}

interface Loggable {
  log(): void;
}

// 여러 기능을 조합
type Document = Named & Printable & Loggable;

const doc: Document = {
  name: 'Report.pdf',
  print: () => console.log('🖨️  Printing...'),
  log: () => console.log('📝 Logging...'),
};

console.log(`Document: ${doc.name}`);
doc.print();
doc.log();

// 3. 인터페이스 결합
console.log('\n=== 3. 인터페이스 결합 ===');

interface ContactInfo {
  email: string;
  phone: string;
}

interface Address {
  street: string;
  city: string;
  zipCode: string;
}

// 여러 인터페이스를 하나로 결합
type FullProfile = Named & Aged & ContactInfo & Address;

const profile: FullProfile = {
  name: 'Bob',
  age: 25,
  email: 'bob@example.com',
  phone: '010-1234-5678',
  street: '123 Main St',
  city: 'Seoul',
  zipCode: '12345',
};

console.log(`Profile: ${profile.name} (${profile.age}세)`);
console.log(`Contact: ${profile.email}, ${profile.phone}`);
console.log(`Address: ${profile.street}, ${profile.city} ${profile.zipCode}`);

// 4. 제네릭과 인터섹션
console.log('\n=== 4. 제네릭과 인터섹션 ===');

interface Identifiable {
  id: number;
}

// T 타입에 id 프로퍼티 추가
function addId<T>(obj: T, id: number): T & Identifiable {
  return { ...obj, id };
}

const user = { name: 'Charlie', age: 28 };
const userWithId = addId(user, 101);

console.log('Original user:', user);
console.log('User with ID:', userWithId); // { name, age, id }

// 5. 충돌하는 타입 처리
console.log('\n=== 5. 충돌하는 타입 처리 ===');

interface HasStringId {
  id: string;
}

interface HasNumberId {
  id: number;
}

// ❌ 같은 프로퍼티가 다른 타입이면 never 타입이 됨
type Conflict = HasStringId & HasNumberId; // { id: never }

// never 타입은 어떤 값도 할당할 수 없음
// const bad: Conflict = { id: 123 }; // ❌ Error
// const bad2: Conflict = { id: 'abc' }; // ❌ Error

console.log('⚠️  충돌하는 타입은 never가 됨 (사용 불가)');

// 6. 실무 패턴 1: Timestamped
console.log('\n=== 6. 실무 패턴: Timestamped ===');

interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Article {
  title: string;
  content: string;
  author: string;
}

type ArticleWithTimestamp = Article & Timestamped;

const article: ArticleWithTimestamp = {
  title: 'TypeScript Guide',
  content: 'Learn TypeScript...',
  author: 'John Doe',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
};

console.log(`Article: "${article.title}" by ${article.author}`);
console.log(`Created: ${article.createdAt.toISOString()}`);

// 7. 실무 패턴 2: Deletable (Soft Delete)
console.log('\n=== 7. 실무 패턴: Deletable (Soft Delete) ===');

interface Deletable {
  isDeleted: boolean;
  deletedAt: Date | null;
}

type User = Named & Aged & Deletable;

const activeUser: User = {
  name: 'Active User',
  age: 30,
  isDeleted: false,
  deletedAt: null,
};

const deletedUser: User = {
  name: 'Deleted User',
  age: 25,
  isDeleted: true,
  deletedAt: new Date(),
};

console.log(`Active: ${activeUser.name} (deleted: ${activeUser.isDeleted})`);
console.log(`Deleted: ${deletedUser.name} (deleted: ${deletedUser.isDeleted})`);

// 8. 실무 패턴 3: 메타데이터 추가
console.log('\n=== 8. 실무 패턴: 메타데이터 ===');

interface Metadata {
  version: number;
  tags: string[];
  metadata: Record<string, unknown>;
}

type EnrichedArticle = Article & Timestamped & Metadata;

const enrichedArticle: EnrichedArticle = {
  title: 'Advanced TypeScript',
  content: 'Deep dive into TS...',
  author: 'Jane Smith',
  createdAt: new Date('2024-02-01'),
  updatedAt: new Date('2024-02-10'),
  version: 2,
  tags: ['typescript', 'programming', 'tutorial'],
  metadata: {
    views: 1000,
    likes: 50,
    category: 'technology',
  },
};

console.log(`Enriched Article: "${enrichedArticle.title}" v${enrichedArticle.version}`);
console.log(`Tags: ${enrichedArticle.tags.join(', ')}`);
console.log(`Metadata:`, enrichedArticle.metadata);

// 9. 유니온 vs 인터섹션 비교
console.log('\n=== 9. Union vs Intersection 비교 ===');

interface Admin {
  role: 'admin';
  permissions: string[];
}

interface RegularUser {
  role: 'user';
  level: number;
}

// Union: Admin 또는 RegularUser (둘 중 하나만 만족해도 됨)
type UserUnion = Admin | RegularUser;

// Intersection: Admin이면서 RegularUser (둘 다 만족, 실제로는 불가능한 타입)
type UserIntersection = Admin & RegularUser; // role이 'admin'이면서 'user'일 수 없음

const admin: UserUnion = {
  role: 'admin',
  permissions: ['read', 'write', 'delete'],
};

const regularUser: UserUnion = {
  role: 'user',
  level: 5,
};

console.log('Union - Admin:', admin);
console.log('Union - User:', regularUser);

/**
 * 핵심 정리:
 *
 * 1. Intersection Type (A & B): 여러 타입 모두 만족
 * 2. 모든 프로퍼티를 가져야 함 (타입 확장)
 * 3. 믹스인 패턴: 여러 기능 조합
 * 4. 제네릭과 함께 사용하면 강력함
 * 5. 충돌하는 프로퍼티는 never 타입
 * 6. 실무 패턴:
 *    - Timestamped: createdAt, updatedAt
 *    - Deletable: isDeleted, deletedAt (soft delete)
 *    - Metadata: version, tags 등
 * 7. Union vs Intersection:
 *    - Union (|): 또는 (OR)
 *    - Intersection (&): 그리고 (AND)
 */
