/**
 * 09-practical-examples.ts
 * 실전 종합 예제
 * 지금까지 배운 TypeScript 기초를 활용한 실무 패턴
 */

// ============================================
// 예제 1: 사용자 관리 시스템
// ============================================

type UserRole = 'admin' | 'user' | 'guest';
type UserStatus = 'active' | 'inactive' | 'suspended';

type User = {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  lastLogin?: Date;
  profile?: {
    bio: string;
    avatar: string;
    phone?: string;
  };
};

function createUser(
  id: string | number,
  name: string,
  email: string,
  role: UserRole = 'user'
): User {
  return {
    id,
    name,
    email,
    role,
    status: 'active',
    createdAt: new Date(),
  };
}

function updateUserProfile(user: User, bio: string, avatar: string): User {
  return {
    ...user,
    profile: { bio, avatar },
  };
}

console.log('=== 예제 1: 사용자 관리 ===');
let user1 = createUser(1, 'Alice', 'alice@example.com');
console.log('새 사용자:', user1);

user1 = updateUserProfile(user1, 'Software Engineer', 'avatar.jpg');
console.log('프로필 업데이트:', user1.profile);

// ============================================
// 예제 2: API 응답 타입
// ============================================

type ApiResponse<T> = {
  status: number;
  success: boolean;
  data: T;
  error?: string;
  timestamp: Date;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
};

type PaginatedResponse<T> = ApiResponse<T> & {
  pagination: Pagination;
};

function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    status: 200,
    success: true,
    data,
    timestamp: new Date(),
  };
}

function createErrorResponse(status: number, error: string): ApiResponse<null> {
  return {
    status,
    success: false,
    data: null,
    error,
    timestamp: new Date(),
  };
}

console.log('\n=== 예제 2: API 응답 ===');
const todoResponse = createSuccessResponse<Todo>({
  id: 1,
  title: 'Learn TypeScript',
  completed: false,
  userId: 1,
});
console.log('Todo 응답:', todoResponse);

const errorResponse = createErrorResponse(404, 'Not Found');
console.log('에러 응답:', errorResponse);

// ============================================
// 예제 3: 상태 관리 패턴
// ============================================

type LoadingState = {
  type: 'loading';
};

type SuccessState<T> = {
  type: 'success';
  data: T;
};

type ErrorState = {
  type: 'error';
  error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleAsyncState<T>(state: AsyncState<T>): string {
  switch (state.type) {
    case 'loading':
      return '로딩 중...';
    case 'success':
      return `성공: ${JSON.stringify(state.data)}`;
    case 'error':
      return `에러: ${state.error}`;
  }
}

console.log('\n=== 예제 3: 비동기 상태 관리 ===');
console.log(handleAsyncState<string>({ type: 'loading' }));
console.log(handleAsyncState({ type: 'success', data: { id: 1, name: 'Item' } }));
console.log(handleAsyncState({ type: 'error', error: 'Network error' }));

// ============================================
// 예제 4: 폼 검증
// ============================================

type ValidationResult = {
  isValid: boolean;
  errors: string[];
};

type LoginForm = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateLoginForm(form: LoginForm): ValidationResult {
  const errors: string[] = [];

  if (!form.email) {
    errors.push('이메일은 필수입니다');
  } else if (!validateEmail(form.email)) {
    errors.push('올바른 이메일 형식이 아닙니다');
  }

  if (!form.password) {
    errors.push('비밀번호는 필수입니다');
  } else if (form.password.length < 6) {
    errors.push('비밀번호는 최소 6자 이상이어야 합니다');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

console.log('\n=== 예제 4: 폼 검증 ===');
const validForm: LoginForm = {
  email: 'user@example.com',
  password: 'password123',
};
console.log('유효한 폼:', validateLoginForm(validForm));

const invalidForm: LoginForm = {
  email: 'invalid-email',
  password: '123',
};
console.log('무효한 폼:', validateLoginForm(invalidForm));

// ============================================
// 예제 5: 설정 관리
// ============================================

type Environment = 'development' | 'staging' | 'production';

type DatabaseConfig = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

type AppConfig = {
  env: Environment;
  apiUrl: string;
  database: DatabaseConfig;
  features: {
    analytics: boolean;
    notifications: boolean;
    darkMode: boolean;
  };
};

function createConfig(env: Environment): AppConfig {
  const baseConfig = {
    env,
    features: {
      analytics: true,
      notifications: true,
      darkMode: true,
    },
  };

  switch (env) {
    case 'development':
      return {
        ...baseConfig,
        apiUrl: 'http://localhost:3000',
        database: {
          host: 'localhost',
          port: 5432,
          database: 'dev_db',
          username: 'dev_user',
          password: 'dev_pass',
        },
      };
    case 'staging':
      return {
        ...baseConfig,
        apiUrl: 'https://staging-api.example.com',
        database: {
          host: 'staging-db.example.com',
          port: 5432,
          database: 'staging_db',
          username: 'staging_user',
          password: 'staging_pass',
        },
      };
    case 'production':
      return {
        ...baseConfig,
        apiUrl: 'https://api.example.com',
        database: {
          host: 'prod-db.example.com',
          port: 5432,
          database: 'prod_db',
          username: 'prod_user',
          password: 'prod_pass',
        },
      };
  }
}

console.log('\n=== 예제 5: 설정 관리 ===');
const devConfig = createConfig('development');
console.log('개발 환경:', devConfig.env, devConfig.apiUrl);

// ============================================
// 예제 6: 이벤트 시스템
// ============================================

type UserCreatedEvent = {
  type: 'user:created';
  userId: number;
  timestamp: Date;
};

type UserUpdatedEvent = {
  type: 'user:updated';
  userId: number;
  changes: string[];
  timestamp: Date;
};

type UserDeletedEvent = {
  type: 'user:deleted';
  userId: number;
  timestamp: Date;
};

type AppEvent = UserCreatedEvent | UserUpdatedEvent | UserDeletedEvent;

function handleEvent(event: AppEvent): void {
  switch (event.type) {
    case 'user:created':
      console.log(`사용자 생성: ${event.userId}`);
      break;
    case 'user:updated':
      console.log(`사용자 업데이트: ${event.userId}, 변경사항: ${event.changes.join(', ')}`);
      break;
    case 'user:deleted':
      console.log(`사용자 삭제: ${event.userId}`);
      break;
  }
}

console.log('\n=== 예제 6: 이벤트 시스템 ===');
handleEvent({ type: 'user:created', userId: 1, timestamp: new Date() });
handleEvent({
  type: 'user:updated',
  userId: 1,
  changes: ['email', 'name'],
  timestamp: new Date(),
});
handleEvent({ type: 'user:deleted', userId: 1, timestamp: new Date() });

// ============================================
// 예제 7: 데이터 변환 유틸리티
// ============================================

type RequestDTO = {
  user_id: number;
  user_name: string;
  created_at: string;
};

type UserModel = {
  userId: number;
  userName: string;
  createdAt: Date;
};

function transformDTOToModel(dto: RequestDTO): UserModel {
  return {
    userId: dto.user_id,
    userName: dto.user_name,
    createdAt: new Date(dto.created_at),
  };
}

function transformModelToDTO(model: UserModel): RequestDTO {
  return {
    user_id: model.userId,
    user_name: model.userName,
    created_at: model.createdAt.toISOString(),
  };
}

console.log('\n=== 예제 7: 데이터 변환 ===');
const dto: RequestDTO = {
  user_id: 1,
  user_name: 'John',
  created_at: '2024-01-01T00:00:00Z',
};
const model = transformDTOToModel(dto);
console.log('DTO → Model:', model);
console.log('Model → DTO:', transformModelToDTO(model));

// ============================================
// 예제 8: 타입 안전한 이벤트 에미터
// ============================================

type EventMap = {
  connect: { userId: number; timestamp: Date };
  disconnect: { userId: number; reason: string };
  message: { from: number; to: number; content: string };
};

type EventCallback<T> = (data: T) => void;

class TypedEventEmitter {
  private listeners: Map<string, EventCallback<any>[]> = new Map();

  on<K extends keyof EventMap>(event: K, callback: EventCallback<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }
}

console.log('\n=== 예제 8: 타입 안전한 이벤트 에미터 ===');
const emitter = new TypedEventEmitter();

emitter.on('connect', (data) => {
  console.log(`사용자 ${data.userId} 연결됨`);
});

emitter.on('message', (data) => {
  console.log(`메시지: ${data.from} → ${data.to}: ${data.content}`);
});

emitter.emit('connect', { userId: 1, timestamp: new Date() });
emitter.emit('message', { from: 1, to: 2, content: 'Hello!' });

// ============================================
// 예제 9: 페이지네이션 헬퍼
// ============================================

type PaginatedData<T> = {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedData<T> {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

console.log('\n=== 예제 9: 페이지네이션 ===');
const allItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
const page1 = paginate(allItems, 1, 10);
console.log(`페이지 1: ${page1.items.length}개 항목`);
console.log('페이지네이션:', page1.pagination);

// ============================================
// 예제 10: 타입 가드를 활용한 에러 처리
// ============================================

type NetworkError = {
  type: 'network';
  message: string;
  statusCode: number;
};

type ValidationError = {
  type: 'validation';
  message: string;
  fields: string[];
};

type AppError = NetworkError | ValidationError;

function isNetworkError(error: AppError): error is NetworkError {
  return error.type === 'network';
}

function isValidationError(error: AppError): error is ValidationError {
  return error.type === 'validation';
}

function handleAppError(error: AppError): void {
  if (isNetworkError(error)) {
    console.log(`네트워크 에러 [${error.statusCode}]: ${error.message}`);
  } else if (isValidationError(error)) {
    console.log(`검증 에러: ${error.message}, 필드: ${error.fields.join(', ')}`);
  }
}

console.log('\n=== 예제 10: 에러 처리 ===');
const networkError: NetworkError = {
  type: 'network',
  message: 'Connection failed',
  statusCode: 500,
};
handleAppError(networkError);

const validationError: ValidationError = {
  type: 'validation',
  message: 'Invalid input',
  fields: ['email', 'password'],
};
handleAppError(validationError);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 실전 TypeScript 패턴 10가지
 *
 * 1. 사용자 관리 시스템
 *    - 리터럴 유니온 타입으로 역할/상태 관리
 *    - 선택적 프로퍼티로 유연성 확보
 *
 * 2. API 응답 타입
 *    - 제네릭으로 재사용 가능한 응답 타입
 *    - 타입 별칭으로 복잡한 구조 간소화
 *
 * 3. 상태 관리 패턴
 *    - 판별 유니온으로 비동기 상태 표현
 *    - switch문으로 타입 안전하게 처리
 *
 * 4. 폼 검증
 *    - 명확한 검증 결과 타입
 *    - 타입 가드로 안전한 입력 처리
 *
 * 5. 설정 관리
 *    - 환경별 설정을 타입으로 보장
 *    - 리터럴 타입으로 환경 제한
 *
 * 6. 이벤트 시스템
 *    - 판별 유니온으로 이벤트 타입 정의
 *    - 타입 안전한 이벤트 처리
 *
 * 7. 데이터 변환
 *    - DTO와 도메인 모델 분리
 *    - 타입 안전한 변환 함수
 *
 * 8. 타입 안전한 이벤트 에미터
 *    - 제네릭과 keyof로 타입 안전성 확보
 *    - 이벤트 타입 맵으로 중앙 관리
 *
 * 9. 페이지네이션
 *    - 제네릭으로 모든 타입에 적용 가능
 *    - 명확한 페이지네이션 정보 타입
 *
 * 10. 타입 가드를 활용한 에러 처리
 *     - 사용자 정의 타입 가드
 *     - 판별 유니온으로 에러 타입 구분
 *
 * Best Practices
 * ===============
 *
 * 1. 리터럴 유니온으로 enum 대체
 *    type Status = 'pending' | 'approved' | 'rejected';
 *
 * 2. 제네릭으로 재사용성 향상
 *    type ApiResponse<T> = { data: T; ... };
 *
 * 3. 판별 유니온으로 상태/이벤트 관리
 *    type State = Loading | Success | Error;
 *    // type 필드로 구분
 *
 * 4. 타입 별칭으로 복잡한 타입 간소화
 *    type UserRole = 'admin' | 'user' | 'guest';
 *
 * 5. 타입 가드로 안전한 타입 좁히기
 *    function isNetworkError(e: Error): e is NetworkError
 *
 * 6. 선택적 프로퍼티로 유연성 확보
 *    type User = { profile?: ProfileInfo };
 *
 * 7. 의미 있는 타입 이름 사용
 *    type UserCreatedEvent (O)
 *    type Event1 (X)
 *
 * 8. 인터페이스보다 타입 별칭 우선
 *    (유니온, 튜플, 유틸리티 타입 활용 가능)
 *
 * 9. unknown으로 안전한 타입 체크
 *    function validate(data: unknown): Data
 *
 * 10. 도메인 용어로 타입 정의
 *     type OrderStatus, type PaymentMethod 등
 *
 * 다음 단계
 * =========
 * - 02-functions-types: 함수 타입 시그니처, 오버로드
 * - 03-classes-interfaces: 클래스와 인터페이스
 * - 09-practical-patterns: interface vs type, enum 문제점 등
 *
 * @see 실무에서 자주 사용하는 패턴들을 익혔습니다!
 */
