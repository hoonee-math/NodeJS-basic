/**
 * 03-pick-omit.ts
 * Pick, Omit - 프로퍼티 선택/제외
 *
 * API 응답에서 필요한 필드만 가져오거나, 민감한 정보를 제거해야 하는 경우가 많습니다.
 * Pick<T, K>는 T에서 K 프로퍼티만 선택하고, Omit<T, K>는 T에서 K 프로퍼티를 제외합니다.
 * 이 파일에서는 Pick<T, K>로 필요한 필드만 추출, Omit<T, K>로 민감 정보 제거, 유니온 키로 여러 프로퍼티 처리, DTO 변환 패턴, Pick + Omit 조합, 그리고 실무 사용자 타입 변환 예제를 다룹니다.
 */

// ============================================================
// 1. Pick<T, K> 기본 - 특정 프로퍼티만 선택
// ============================================================
console.log('\n=== 1. Pick<T, K> 기본 ===');

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// id와 username만 선택
type UserPreview = Pick<User, 'id' | 'username'>;

const preview: UserPreview = {
  id: 'u1',
  username: 'alice',
};

console.log('User Preview:', preview);

// ============================================================
// 2. Omit<T, K> 기본 - 특정 프로퍼티 제외
// ============================================================
console.log('\n=== 2. Omit<T, K> 기본 ===');

// password를 제외한 모든 프로퍼티
type UserWithoutPassword = Omit<User, 'password'>;

const safeUser: UserWithoutPassword = {
  id: 'u2',
  username: 'bob',
  email: 'bob@example.com',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('Safe User (no password):', safeUser.username);

// ============================================================
// 3. 유니온 키로 여러 프로퍼티 처리
// ============================================================
console.log('\n=== 3. 유니온 키로 여러 프로퍼티 처리 ===');

// 여러 필드를 동시에 선택
type UserBasicInfo = Pick<User, 'id' | 'username' | 'email'>;

// 여러 필드를 동시에 제외
type UserPublic = Omit<User, 'password' | 'createdAt' | 'updatedAt'>;

const basicInfo: UserBasicInfo = {
  id: 'u3',
  username: 'charlie',
  email: 'charlie@example.com',
};

const publicInfo: UserPublic = {
  id: 'u3',
  username: 'charlie',
  email: 'charlie@example.com',
};

console.log('Basic Info:', basicInfo);
console.log('Public Info:', publicInfo);

// ============================================================
// 4. API 응답에서 필요한 필드만 추출
// ============================================================
console.log('\n=== 4. API 응답에서 필요한 필드만 추출 ===');

interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  tags: string[];
  publishedAt: Date;
  updatedAt: Date;
  viewCount: number;
  likeCount: number;
}

// 목록 표시용: 제목, 작성자 이름, 날짜만
type ArticleListItem = Pick<Article, 'id' | 'title' | 'publishedAt'> & {
  authorName: string;
};

const articleItem: ArticleListItem = {
  id: 'a1',
  title: 'TypeScript Utility Types',
  publishedAt: new Date(),
  authorName: 'Alice',
};

console.log('Article List Item:', articleItem);

// ============================================================
// 5. 민감 정보 제거
// ============================================================
console.log('\n=== 5. 민감 정보 제거 ===');

interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  apiToken: string;
  lastLoginIp: string;
}

// 클라이언트로 보낼 응답에서 민감 정보 제거
type UserResponse = Omit<
  UserEntity,
  'passwordHash' | 'passwordSalt' | 'apiToken' | 'lastLoginIp'
>;

const userResponse: UserResponse = {
  id: 'u4',
  email: 'user@example.com',
};

console.log('User Response (safe):', userResponse);

// ============================================================
// 6. DTO 변환 패턴
// ============================================================
console.log('\n=== 6. DTO 변환 패턴 ===');

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 생성 요청: id, createdAt, updatedAt 제외
type CreateProductDTO = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

// 업데이트 요청: id 제외, 나머지는 선택적
type UpdateProductDTO = Partial<Omit<Product, 'id'>>;

// 목록 응답: 간략한 정보만
type ProductListDTO = Pick<Product, 'id' | 'name' | 'price' | 'stock'>;

const createDto: CreateProductDTO = {
  name: 'Laptop',
  description: 'High-performance laptop',
  price: 1500,
  stock: 10,
  categoryId: 'cat1',
};

const updateDto: UpdateProductDTO = {
  price: 1400,
  stock: 8,
};

const listDto: ProductListDTO = {
  id: 'p1',
  name: 'Laptop',
  price: 1500,
  stock: 10,
};

console.log('Create DTO:', createDto);
console.log('Update DTO:', updateDto);
console.log('List DTO:', listDto);

// ============================================================
// 7. Pick + Omit 조합
// ============================================================
console.log('\n=== 7. Pick + Omit 조합 ===');

interface Order {
  id: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  paymentMethod: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

// 사용자가 볼 수 있는 주문 정보 (내부 필드 제외)
type UserOrderView = Omit<Order, 'paymentMethod'> &
  Pick<Order, 'id' | 'status' | 'totalAmount'>;

// 실제로는:
type SimpleUserOrderView = Pick<
  Order,
  'id' | 'items' | 'totalAmount' | 'status' | 'shippingAddress'
>;

const orderView: SimpleUserOrderView = {
  id: 'o1',
  items: [{ productId: 'p1', quantity: 2 }],
  totalAmount: 3000,
  status: 'shipped',
  shippingAddress: '123 Main St',
};

console.log('Order View:', orderView);

// ============================================================
// 8. 실무 예제: 사용자 타입 변환
// ============================================================
console.log('\n=== 8. 실무 예제: 사용자 타입 변환 ===');

interface FullUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 1. 로그인 응답: 민감 정보 제외
type LoginResponse = Omit<FullUser, 'passwordHash'>;

// 2. 프로필 수정 폼: 수정 가능한 필드만
type ProfileUpdateDTO = Pick<
  FullUser,
  'firstName' | 'lastName' | 'phoneNumber' | 'address'
>;

// 3. 사용자 목록: 간략한 정보
type UserListItem = Pick<FullUser, 'id' | 'username' | 'email' | 'role'>;

// 4. 관리자 뷰: 모든 정보 (password 제외)
type AdminUserView = Omit<FullUser, 'passwordHash'>;

const loginRes: LoginResponse = {
  id: 'u5',
  username: 'david',
  email: 'david@example.com',
  firstName: 'David',
  lastName: 'Kim',
  dateOfBirth: new Date('1990-01-01'),
  phoneNumber: '010-1234-5678',
  address: 'Seoul',
  role: 'user',
  isActive: true,
  lastLogin: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

const profileUpdate: ProfileUpdateDTO = {
  firstName: 'David',
  lastName: 'Lee',
  phoneNumber: '010-9876-5432',
  address: 'Busan',
};

console.log('Login Response:', loginRes.username);
console.log('Profile Update:', profileUpdate);

// ============================================================
// 9. Nested Pick (중첩 타입)
// ============================================================
console.log('\n=== 9. Nested Pick (중첩 타입) ===');

interface Company {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
    zipCode: string;
  };
  employees: Array<{
    id: string;
    name: string;
    position: string;
  }>;
}

// 회사명과 도시만 필요
type CompanyLocation = Pick<Company, 'id' | 'name'> & {
  city: string;
};

const companyLoc: CompanyLocation = {
  id: 'c1',
  name: 'Tech Corp',
  city: 'Seoul',
};

console.log('Company Location:', companyLoc);

// ============================================================
// 10. Pick/Omit with keyof
// ============================================================
console.log('\n=== 10. Pick/Omit with keyof ===');

interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
  debug: boolean;
}

// keyof를 사용한 동적 Pick
type ConfigKeys = keyof Config; // 'apiUrl' | 'timeout' | 'retries' | 'debug'
type RuntimeConfig = Pick<Config, 'apiUrl' | 'timeout'>;

const runtimeConfig: RuntimeConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
};

console.log('Runtime Config:', runtimeConfig);

// 특정 타입의 키만 선택 (고급 패턴)
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type ConfigStringKeys = StringKeys<Config>; // 'apiUrl'
type StringOnlyConfig = Pick<Config, ConfigStringKeys>;

const stringConfig: StringOnlyConfig = {
  apiUrl: 'https://api.example.com',
};

console.log('String Config:', stringConfig);

// ============================================================
// 11. 타입 안전성 보장
// ============================================================
console.log('\n=== 11. 타입 안전성 보장 ===');

interface Database {
  users: User[];
  products: Product[];
  orders: Order[];
}

// 존재하지 않는 키를 선택하면 컴파일 에러
// type InvalidPick = Pick<User, 'id' | 'nonexistent'>; // ❌ Error

// 올바른 사용
type ValidPick = Pick<User, 'id' | 'username'>;

// Omit은 존재하지 않는 키도 허용 (제거할 게 없으면 원본 유지)
type ValidOmit = Omit<User, 'nonexistent'>; // ✅ OK (User와 동일)

console.log('Type safety ensured at compile time');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Pick<T, K>
 *    - T에서 K 프로퍼티만 선택
 *    - 용도: DTO 생성, 목록 응답, 필요한 필드만 추출
 *    - 구현: { [P in K]: T[P] }
 *    - K는 keyof T의 부분집합이어야 함
 *
 * 2. Omit<T, K>
 *    - T에서 K 프로퍼티를 제외
 *    - 용도: 민감 정보 제거, 생성/업데이트 DTO
 *    - 구현: Pick<T, Exclude<keyof T, K>>
 *    - K는 keyof any (모든 키 허용)
 *
 * 3. 유니온 키
 *    - Pick<User, 'id' | 'name' | 'email'>
 *    - Omit<User, 'password' | 'token'>
 *
 * 4. 실무 패턴
 *    - 응답 타입: Omit<Entity, 'password'>
 *    - 생성 DTO: Omit<Entity, 'id' | 'createdAt'>
 *    - 업데이트 DTO: Partial<Omit<Entity, 'id'>>
 *    - 목록 DTO: Pick<Entity, 'id' | 'name'>
 *
 * 5. Pick vs Omit 선택
 *    - 필요한 필드가 적으면 Pick
 *    - 제외할 필드가 적으면 Omit
 *
 * 6. 타입 안전성
 *    - Pick은 존재하는 키만 허용
 *    - Omit은 존재하지 않는 키도 허용
 */

console.log(`
예제:
  type UserPreview = Pick<User, 'id' | 'name'>;
  type SafeUser = Omit<User, 'password'>;
  type CreateDTO = Omit<Entity, 'id' | 'createdAt'>;
  type UpdateDTO = Partial<Omit<Entity, 'id'>>;
`);
