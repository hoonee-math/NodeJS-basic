/**
 * 09-practical-examples.ts
 * 실전 종합 패턴 - 고급 타입 활용
 */

// 1. API 응답 타입 설계 (Success/Error)
console.log('=== 1. API 응답 타입 ===');

interface ApiSuccess<T> {
  status: 'success';
  data: T;
  timestamp: string;
}

interface ApiError {
  status: 'error';
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

function handleApiResponse<T>(response: ApiResponse<T>): void {
  if (response.status === 'success') {
    console.log('✅ Success:', response.data);
  } else {
    console.log(`❌ Error [${response.error.code}]: ${response.error.message}`);
  }
}

const successResponse: ApiResponse<{ id: number; name: string }> = {
  status: 'success',
  data: { id: 1, name: 'Alice' },
  timestamp: new Date().toISOString(),
};

const errorResponse: ApiResponse<unknown> = {
  status: 'error',
  error: { code: 'NOT_FOUND', message: 'User not found' },
  timestamp: new Date().toISOString(),
};

handleApiResponse(successResponse);
handleApiResponse(errorResponse);

// 2. 상태 관리 타입 (AsyncState)
console.log('\n=== 2. 상태 관리 타입 ===');

interface IdleState {
  status: 'idle';
}

interface LoadingState {
  status: 'loading';
  progress?: number;
}

interface SuccessState<T> {
  status: 'success';
  data: T;
  loadedAt: Date;
}

interface ErrorState {
  status: 'error';
  error: Error;
  retryCount: number;
}

type AsyncState<T> = IdleState | LoadingState | SuccessState<T> | ErrorState;

function renderAsyncState<T>(state: AsyncState<T>): void {
  switch (state.status) {
    case 'idle':
      console.log('⚪ Idle');
      break;
    case 'loading':
      console.log(`⏳ Loading${state.progress ? ` (${state.progress}%)` : '...'}`);
      break;
    case 'success':
      console.log(`✅ Success (loaded at ${state.loadedAt.toISOString()}):`, state.data);
      break;
    case 'error':
      console.log(`❌ Error (retry: ${state.retryCount}):`, state.error.message);
      break;
  }
}

renderAsyncState<string>({ status: 'idle' });
renderAsyncState<string>({ status: 'loading', progress: 50 });
renderAsyncState<string>({ status: 'success', data: 'User data', loadedAt: new Date() });
renderAsyncState<string>({ status: 'error', error: new Error('Network error'), retryCount: 3 });

// 3. Redux Action 타입
console.log('\n=== 3. Redux Action 타입 ===');

interface LoginAction {
  type: 'LOGIN';
  payload: {
    username: string;
    password: string;
  };
}

interface LogoutAction {
  type: 'LOGOUT';
}

interface SetUserAction {
  type: 'SET_USER';
  payload: {
    id: number;
    name: string;
    email: string;
  };
}

interface UpdateSettingsAction {
  type: 'UPDATE_SETTINGS';
  payload: Partial<{
    theme: 'light' | 'dark';
    language: string;
    notifications: boolean;
  }>;
}

type UserAction = LoginAction | LogoutAction | SetUserAction | UpdateSettingsAction;

function userReducer(action: UserAction): void {
  switch (action.type) {
    case 'LOGIN':
      console.log(`→ LOGIN: ${action.payload.username}`);
      break;
    case 'LOGOUT':
      console.log('→ LOGOUT');
      break;
    case 'SET_USER':
      console.log(`→ SET_USER: ${action.payload.name} (${action.payload.email})`);
      break;
    case 'UPDATE_SETTINGS':
      console.log('→ UPDATE_SETTINGS:', action.payload);
      break;
  }
}

userReducer({ type: 'LOGIN', payload: { username: 'alice', password: 'secret' } });
userReducer({ type: 'SET_USER', payload: { id: 1, name: 'Alice', email: 'alice@example.com' } });
userReducer({ type: 'UPDATE_SETTINGS', payload: { theme: 'dark' } });

// 4. 폼 검증 타입
console.log('\n=== 4. 폼 검증 타입 ===');

type ValidationResult<T> =
  | { isValid: true; data: T }
  | { isValid: false; errors: Record<keyof T, string> };

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

function validateSignupForm(form: SignupForm): ValidationResult<SignupForm> {
  const errors: Partial<Record<keyof SignupForm, string>> = {};

  if (!form.email.includes('@')) {
    errors.email = 'Invalid email format';
  }
  if (form.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors: errors as Record<keyof SignupForm, string> };
  }

  return { isValid: true, data: form };
}

const validForm: SignupForm = {
  email: 'alice@example.com',
  password: 'securePassword123',
  confirmPassword: 'securePassword123',
};

const invalidForm: SignupForm = {
  email: 'invalid-email',
  password: 'short',
  confirmPassword: 'different',
};

const result1 = validateSignupForm(validForm);
if (result1.isValid) {
  console.log('✅ Valid form:', result1.data);
} else {
  console.log('❌ Invalid form:', result1.errors);
}

const result2 = validateSignupForm(invalidForm);
if (result2.isValid) {
  console.log('✅ Valid form:', result2.data);
} else {
  console.log('❌ Invalid form:', result2.errors);
}

// 5. 라우팅 타입
console.log('\n=== 5. 라우팅 타입 ===');

type Route =
  | { path: '/'; params: undefined }
  | { path: '/users'; params: undefined }
  | { path: '/users/:id'; params: { id: string } }
  | { path: '/products/:category'; params: { category: string } }
  | {
      path: '/products/:category/:id';
      params: { category: string; id: string };
    };

function navigate(route: Route): void {
  if (route.params) {
    console.log(`Navigating to ${route.path} with params:`, route.params);
  } else {
    console.log(`Navigating to ${route.path}`);
  }
}

navigate({ path: '/', params: undefined });
navigate({ path: '/users/:id', params: { id: '123' } });
navigate({ path: '/products/:category/:id', params: { category: 'electronics', id: '456' } });

// 6. 이벤트 핸들러 타입
console.log('\n=== 6. 이벤트 핸들러 타입 ===');

interface ClickEvent {
  type: 'click';
  target: string;
  x: number;
  y: number;
}

interface KeyPressEvent {
  type: 'keypress';
  key: string;
  ctrlKey: boolean;
  shiftKey: boolean;
}

interface ScrollEvent {
  type: 'scroll';
  scrollTop: number;
  scrollLeft: number;
}

type DOMEvent = ClickEvent | KeyPressEvent | ScrollEvent;

function handleEvent(event: DOMEvent): void {
  switch (event.type) {
    case 'click':
      console.log(`→ Click at (${event.x}, ${event.y}) on ${event.target}`);
      break;
    case 'keypress':
      console.log(
        `→ Key: ${event.key} (Ctrl: ${event.ctrlKey}, Shift: ${event.shiftKey})`
      );
      break;
    case 'scroll':
      console.log(`→ Scroll to (top: ${event.scrollTop}, left: ${event.scrollLeft})`);
      break;
  }
}

handleEvent({ type: 'click', target: 'button', x: 100, y: 200 });
handleEvent({ type: 'keypress', key: 'Enter', ctrlKey: false, shiftKey: false });
handleEvent({ type: 'scroll', scrollTop: 500, scrollLeft: 0 });

// 7. 설정 객체 타입
console.log('\n=== 7. 설정 객체 타입 ===');

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

interface ServerConfig {
  port: number;
  host: string;
  cors: boolean;
}

interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  output: 'console' | 'file';
}

interface AppConfig {
  database: DatabaseConfig;
  server: ServerConfig;
  logging: LoggingConfig;
  features: {
    authentication: boolean;
    rateLimit: boolean;
    cache: boolean;
  };
}

// 환경별 설정: Partial을 사용해 일부만 오버라이드
type EnvironmentConfig = Partial<AppConfig>;

const defaultConfig: AppConfig = {
  database: {
    host: 'localhost',
    port: 5432,
    username: 'admin',
    password: 'password',
    database: 'myapp',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    cors: true,
  },
  logging: {
    level: 'info',
    format: 'json',
    output: 'console',
  },
  features: {
    authentication: true,
    rateLimit: true,
    cache: true,
  },
};

const productionOverride: EnvironmentConfig = {
  database: {
    host: 'prod-db.example.com',
    port: 5432,
    username: 'prod_user',
    password: 'prod_password',
    database: 'prod_db',
  },
  logging: {
    level: 'error',
    format: 'json',
    output: 'file',
  },
};

function mergeConfig(base: AppConfig, override: EnvironmentConfig): AppConfig {
  return { ...base, ...override } as AppConfig;
}

const prodConfig = mergeConfig(defaultConfig, productionOverride);
console.log('Production config:', JSON.stringify(prodConfig, null, 2));

// 8. 실전 종합: Todo 앱 타입 시스템
console.log('\n=== 8. 실전 종합: Todo 앱 ===');

interface Todo {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

// Create: 일부 필드만 필요
type CreateTodoInput = Pick<Todo, 'title' | 'description' | 'priority' | 'tags'>;

// Update: 모든 필드 optional + id 필수
type UpdateTodoInput = Partial<Omit<Todo, 'id'>> & Pick<Todo, 'id'>;

// List 필터
type TodoFilter = Partial<Pick<Todo, 'status' | 'priority'>> & {
  search?: string;
  tags?: string[];
};

// Response
type TodoResponse = ApiResponse<Todo | Todo[]>;

function createTodo(input: CreateTodoInput): Todo {
  const todo: Todo = {
    id: Math.random().toString(36).substr(2, 9),
    ...input,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  console.log('Created todo:', todo);
  return todo;
}

function updateTodo(input: UpdateTodoInput): void {
  console.log(`Updating todo ${input.id}:`, input);
}

function listTodos(filter: TodoFilter): void {
  console.log('Listing todos with filter:', filter);
}

createTodo({
  title: 'Learn TypeScript',
  description: 'Study advanced types',
  priority: 'high',
  tags: ['learning', 'typescript'],
});

updateTodo({
  id: 'abc123',
  status: 'completed',
  updatedAt: new Date(),
});

listTodos({
  status: 'pending',
  priority: 'high',
  tags: ['urgent'],
});

/**
 * 핵심 정리:
 *
 * 1. API 응답 타입:
 *    - 판별 유니온 (status: 'success' | 'error')
 *    - 제네릭으로 데이터 타입 유연하게
 *
 * 2. 상태 관리:
 *    - 판별 유니온으로 상태 표현
 *    - 각 상태별 필요한 데이터 타입 정의
 *
 * 3. Redux Actions:
 *    - 판별 유니온 (type 기반)
 *    - switch/case로 타입 자동 좁히기
 *
 * 4. 폼 검증:
 *    - ValidationResult로 성공/실패 표현
 *    - Record<keyof T, string>로 필드별 에러 메시지
 *
 * 5. 라우팅:
 *    - 경로별 params 타입 정의
 *    - 판별 유니온으로 타입 안전성
 *
 * 6. 이벤트 핸들러:
 *    - 판별 유니온으로 이벤트 구분
 *    - 타입별 필요한 데이터 정의
 *
 * 7. 설정 객체:
 *    - 중첩된 타입 구조
 *    - Partial로 환경별 오버라이드
 *
 * 8. CRUD 타입:
 *    - Pick, Omit, Partial로 필요한 필드만 선택
 *    - Create, Update, List 등 용도별 타입 분리
 *
 * 이 패턴들을 조합하면 실무에서 안전하고 유지보수 가능한
 * 타입 시스템을 구축할 수 있습니다!
 */
