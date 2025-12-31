/**
 * 01-partial-required.ts
 * Partial, Required - 선택적/필수 변환
 *
 * 업데이트 API는 모든 필드를 받지 않고, 설정 객체는 기본값을 적용한 후 모든 필드가 필수가 됩니다.
 * Partial<T>는 T의 모든 프로퍼티를 선택적(optional)으로 만들고, Required<T>는 모든 프로퍼티를 필수로 만듭니다.
 * 이 파일에서는 Partial<T>의 기본 사용법, Required<T>로 선택적 프로퍼티 필수화, API 업데이트 패턴, 폼 상태 관리, Partial의 얕은 변환 한계, DeepPartial 커스텀 타입, 그리고 실무 프로필 업데이트 예제를 다룹니다.
 */

// ============================================================
// 1. Partial<T> 기본 - 모든 프로퍼티를 선택적으로
// ============================================================
console.log('\n=== 1. Partial<T> 기본 ===');

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Partial<User> = { id?: string; name?: string; email?: string; age?: number; }
type PartialUser = Partial<User>;

const partialUser: PartialUser = {
  name: 'Alice', // 일부 프로퍼티만 제공 가능
};

console.log('Partial User:', partialUser);

// ============================================================
// 2. Required<T> 기본 - 모든 프로퍼티를 필수로
// ============================================================
console.log('\n=== 2. Required<T> 기본 ===');

interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
}

// 기본값 적용 후 모든 필드가 필수
type ResolvedConfig = Required<Config>;

function applyDefaults(config: Config): ResolvedConfig {
  return {
    host: config.host ?? 'localhost',
    port: config.port ?? 3000,
    debug: config.debug ?? false,
  };
}

const userConfig: Config = { port: 8080 };
const resolvedConfig = applyDefaults(userConfig);

console.log('Resolved Config:', resolvedConfig);
// resolvedConfig.host를 사용할 때 undefined 체크 불필요

// ============================================================
// 3. API 업데이트 패턴 (Partial)
// ============================================================
console.log('\n=== 3. API 업데이트 패턴 ===');

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// 업데이트는 일부 필드만 받음
function updateProduct(id: string, updates: Partial<Product>): Product {
  // 실제로는 DB에서 기존 데이터를 가져와 병합
  const existing: Product = {
    id,
    name: 'Old Product',
    price: 100,
    stock: 10,
    category: 'General',
  };

  return { ...existing, ...updates };
}

const updated = updateProduct('p1', {
  price: 150,
  stock: 20,
});

console.log('Updated Product:', updated);

// ============================================================
// 4. 폼 상태 관리
// ============================================================
console.log('\n=== 4. 폼 상태 관리 ===');

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 폼은 점진적으로 채워짐
type FormState = Partial<FormData>;

const formState: FormState = {};

// 사용자가 입력할 때마다 업데이트
formState.username = 'alice';
formState.email = 'alice@example.com';

console.log('Current Form State:', formState);

// 제출 전 검증
function isFormComplete(form: FormState): form is FormData {
  return !!(
    form.username &&
    form.email &&
    form.password &&
    form.confirmPassword
  );
}

if (isFormComplete(formState)) {
  // 여기서는 formState가 FormData 타입으로 좁혀짐
  console.log('Form is complete:', formState.username);
} else {
  console.log('Form is incomplete');
}

// ============================================================
// 5. Partial의 얕은 변환 문제
// ============================================================
console.log('\n=== 5. Partial의 얕은 변환 문제 ===');

interface UserProfile {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    zipCode: string;
  };
}

type PartialProfile = Partial<UserProfile>;

const partialProfile: PartialProfile = {
  name: 'Bob',
  address: {
    street: '123 Main St',
    city: 'Seoul',
    zipCode: '12345',
  },
};

// address는 선택적이지만, address 내부의 프로퍼티는 여전히 필수
// address: { street?: string; city?: string; }처럼 되지 않음

console.log('Partial Profile:', partialProfile);

// ============================================================
// 6. DeepPartial 커스텀 타입
// ============================================================
console.log('\n=== 6. DeepPartial 커스텀 타입 ===');

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepPartialProfile = DeepPartial<UserProfile>;

const deepPartial: DeepPartialProfile = {
  address: {
    city: 'Busan', // street, zipCode 생략 가능
  },
};

console.log('Deep Partial Profile:', deepPartial);

// ============================================================
// 7. Required로 기본값 적용 후 타입
// ============================================================
console.log('\n=== 7. Required로 기본값 적용 후 타입 ===');

interface ApiOptions {
  timeout?: number;
  retries?: number;
  baseURL?: string;
}

function createApiClient(options: ApiOptions): Required<ApiOptions> {
  const defaults: Required<ApiOptions> = {
    timeout: options.timeout ?? 5000,
    retries: options.retries ?? 3,
    baseURL: options.baseURL ?? 'https://api.example.com',
  };

  return defaults;
}

const apiClient = createApiClient({ timeout: 10000 });

// apiClient의 모든 프로퍼티는 확정적으로 존재
console.log(`API Client - timeout: ${apiClient.timeout}ms`);

// ============================================================
// 8. Partial + Required 조합
// ============================================================
console.log('\n=== 8. Partial + Required 조합 ===');

interface Article {
  id: string;
  title: string;
  content: string;
  author?: string;
  publishedAt?: Date;
}

// author와 publishedAt을 필수로 만들기
type PublishedArticle = Required<Article>;

// id를 제외한 나머지를 선택적으로 (업데이트용)
type ArticleUpdate = Partial<Omit<Article, 'id'>>;

const articleUpdate: ArticleUpdate = {
  title: 'Updated Title',
};

console.log('Article Update:', articleUpdate);

// ============================================================
// 9. API 요청/응답 타입 변환
// ============================================================
console.log('\n=== 9. API 요청/응답 타입 변환 ===');

interface UserEntity {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

// 생성 요청: id, createdAt, updatedAt 제외
type CreateUserRequest = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>;

// 업데이트 요청: id 제외, 나머지는 선택적
type UpdateUserRequest = Partial<Omit<UserEntity, 'id'>>;

// 응답: passwordHash 제외
type UserResponse = Omit<UserEntity, 'passwordHash'>;

const createReq: CreateUserRequest = {
  username: 'charlie',
  email: 'charlie@example.com',
  passwordHash: 'hashed_password',
};

const updateReq: UpdateUserRequest = {
  email: 'newemail@example.com',
};

console.log('Create Request:', createReq);
console.log('Update Request:', updateReq);

// ============================================================
// 10. 실무 예제: 사용자 프로필 업데이트
// ============================================================
console.log('\n=== 10. 실무 예제: 사용자 프로필 업데이트 ===');

interface UserProfileFull {
  userId: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

type UpdateProfileDTO = Partial<Omit<UserProfileFull, 'userId'>>;

function updateUserProfile(
  userId: string,
  updates: UpdateProfileDTO
): UserProfileFull {
  const current: UserProfileFull = {
    userId,
    displayName: 'Old Name',
    bio: 'Old Bio',
    avatarUrl: 'https://example.com/old.png',
    socialLinks: {},
  };

  return {
    ...current,
    ...updates,
    socialLinks: {
      ...current.socialLinks,
      ...updates.socialLinks,
    },
  };
}

const profileUpdates: UpdateProfileDTO = {
  displayName: 'Alice Wonder',
  socialLinks: {
    github: 'https://github.com/alice',
  },
};

const updatedProfile = updateUserProfile('u1', profileUpdates);

console.log('Updated Profile:', updatedProfile);

// ============================================================
// 11. 타입 가드와 함께 사용
// ============================================================
console.log('\n=== 11. 타입 가드와 함께 사용 ===');

interface DatabaseRecord {
  id: string;
  data: string;
  timestamp: Date;
}

type PartialRecord = Partial<DatabaseRecord>;

function isCompleteRecord(record: PartialRecord): record is DatabaseRecord {
  return !!(record.id && record.data && record.timestamp);
}

function saveRecord(record: PartialRecord): void {
  if (isCompleteRecord(record)) {
    // 여기서는 record가 DatabaseRecord로 타입이 좁혀짐
    console.log(`Saving record ${record.id} at ${record.timestamp}`);
  } else {
    console.log('Incomplete record, cannot save');
  }
}

saveRecord({ id: 'r1', data: 'test data', timestamp: new Date() });
saveRecord({ id: 'r2' }); // incomplete

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Partial<T>
 *    - 모든 프로퍼티를 선택적으로 만듦
 *    - 용도: 업데이트 API, 폼 상태 관리
 *    - 구현: { [P in keyof T]?: T[P] }
 *
 * 2. Required<T>
 *    - 모든 프로퍼티를 필수로 만듦
 *    - 용도: 기본값 적용 후 타입, 설정 객체
 *    - 구현: { [P in keyof T]-?: T[P] }
 *
 * 3. Partial의 한계
 *    - 얕은 변환: 중첩 객체의 프로퍼티는 선택적으로 만들지 않음
 *    - 해결책: DeepPartial 커스텀 타입
 *
 * 4. 실무 패턴
 *    - 업데이트 DTO: Partial<Omit<T, 'id'>>
 *    - 생성 요청: Omit<T, 'id' | 'createdAt'>
 *    - 응답 타입: Omit<T, 'password'>
 *
 * 5. 타입 가드
 *    - Partial<T>에서 완전한 T로 좁히기
 *    - is 키워드로 타입 가드 함수 작성
 *
 * 6. 조합 패턴
 *    - Partial + Omit: 특정 필드 제외하고 선택적으로
 *    - Required + Pick: 특정 필드만 필수로
 */

console.log(`
예제:
  type UpdateDTO = Partial<Omit<User, 'id'>>;
  type ResolvedConfig = Required<Config>;
  type DeepPartial<T> = { [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P] };
`);
