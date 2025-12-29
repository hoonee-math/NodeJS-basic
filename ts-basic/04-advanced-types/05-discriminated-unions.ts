/**
 * 05-discriminated-unions.ts
 * 판별 유니온 (Discriminated Unions / Tagged Unions)
 *
 * 여러 상태를 하나의 타입으로 표현하되 각 상태를 명확히 구분하고 싶을 때 판별 유니온을 사용합니다.
 * 공통 프로퍼티(kind, type, status)로 상태를 구분하면 switch/case에서 TypeScript가 자동으로 타입을 좁혀줍니다.
 * 이 파일에서는 
 * 판별 유니온 기본 패턴, 
 * loading/success/error 상태 머신, 
 * Redux Action 타입 정의, 
 * API 응답 타입 설계, 
 * never 타입으로 모든 케이스 처리 강제하기(Exhaustiveness Checking), 
 * 그리고 폼 검증/네트워크 요청 같은 실무 상태 관리 패턴을 다룹니다.
 */

// 1. 기본 판별 유니온 (kind 프로퍼티)
console.log('=== 1. 기본 판별 유니온 ===');

interface Circle {
  kind: 'circle'; // 판별자 (discriminant)
  radius: number;
}

interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function calculateArea(shape: Shape): number {
  // kind 프로퍼티로 타입 자동 좁히기
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}

const circle: Circle = { kind: 'circle', radius: 5 };
const square: Square = { kind: 'square', size: 10 };
const rectangle: Rectangle = { kind: 'rectangle', width: 5, height: 20 };

console.log(`Circle area: ${calculateArea(circle).toFixed(2)}`);
console.log(`Square area: ${calculateArea(square)}`);
console.log(`Rectangle area: ${calculateArea(rectangle)}`);

// 2. 상태 머신 구현 (status 판별자)
console.log('\n=== 2. 상태 머신 (로딩/성공/실패) ===');

interface LoadingState {
  status: 'loading';
}

interface SuccessState<T> {
  status: 'success';
  data: T;
}

interface ErrorState {
  status: 'error';
  error: Error;
}

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function handleAsyncState<T>(state: AsyncState<T>): void {
  switch (state.status) {
    case 'loading':
      console.log('⏳ Loading...');
      break;
    case 'success':
      console.log('✅ Success:', state.data);
      break;
    case 'error':
      console.log('❌ Error:', state.error.message);
      break;
  }
}

const loadingState: AsyncState<string> = { status: 'loading' };
const successState: AsyncState<string> = { status: 'success', data: 'User data loaded' };
const errorState: AsyncState<string> = { status: 'error', error: new Error('Network error') };

handleAsyncState(loadingState);
handleAsyncState(successState);
handleAsyncState(errorState);

// 3. Redux Action 패턴
console.log('\n=== 3. Redux Action 패턴 ===');

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

interface UpdateProfileAction {
  type: 'UPDATE_PROFILE';
  payload: {
    name: string;
    email: string;
  };
}

type UserAction = LoginAction | LogoutAction | UpdateProfileAction;

function userReducer(action: UserAction): void {
  switch (action.type) {
    case 'LOGIN':
      console.log(`→ Login: ${action.payload.username}`);
      break;
    case 'LOGOUT':
      console.log('→ Logout');
      break;
    case 'UPDATE_PROFILE':
      console.log(`→ Update Profile: ${action.payload.name} (${action.payload.email})`);
      break;
  }
}

userReducer({ type: 'LOGIN', payload: { username: 'alice', password: 'secret' } });
userReducer({ type: 'LOGOUT' });
userReducer({ type: 'UPDATE_PROFILE', payload: { name: 'Alice', email: 'alice@example.com' } });

// 4. API 응답 타입 설계
console.log('\n=== 4. API 응답 타입 ===');

interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: Date;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: Date;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

function handleApiResponse<T>(response: ApiResponse<T>): T | null {
  if (response.success) {
    console.log(`✅ Success at ${response.timestamp.toISOString()}`);
    console.log('Data:', response.data);
    return response.data;
  } else {
    console.log(`❌ Error at ${response.timestamp.toISOString()}`);
    console.log(`[${response.error.code}]: ${response.error.message}`);
    return null;
  }
}

const apiSuccess: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: 'John' },
  timestamp: new Date(),
};

const apiError: ApiResponse<unknown> = {
  success: false,
  error: { code: 'NOT_FOUND', message: 'Resource not found' },
  timestamp: new Date(),
};

handleApiResponse(apiSuccess);
handleApiResponse(apiError);

// 5. 여러 판별자 조합
console.log('\n=== 5. 여러 판별자 조합 ===');

interface Admin {
  role: 'admin';
  permissions: string[];
}

interface Moderator {
  role: 'moderator';
  allowedSections: string[];
}

interface User {
  role: 'user';
  level: number;
}

type UserRole = Admin | Moderator | User;

function describeRole(user: UserRole): void {
  switch (user.role) {
    case 'admin':
      console.log(`Admin with permissions: ${user.permissions.join(', ')}`);
      break;
    case 'moderator':
      console.log(`Moderator for: ${user.allowedSections.join(', ')}`);
      break;
    case 'user':
      console.log(`User level: ${user.level}`);
      break;
  }
}

describeRole({ role: 'admin', permissions: ['read', 'write', 'delete'] });
describeRole({ role: 'moderator', allowedSections: ['forum', 'comments'] });
describeRole({ role: 'user', level: 5 });

// 6. Exhaustiveness Checking (완전성 검사)
console.log('\n=== 6. Exhaustiveness Checking ===');

// never 타입을 이용한 완전성 검사
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x);
}

type PaymentMethod = 'credit_card' | 'paypal' | 'bank_transfer';

function processPayment(method: PaymentMethod): void {
  switch (method) {
    case 'credit_card':
      console.log('Processing credit card payment');
      break;
    case 'paypal':
      console.log('Processing PayPal payment');
      break;
    case 'bank_transfer':
      console.log('Processing bank transfer');
      break;
    default:
      // 모든 케이스를 처리했으므로 여기는 도달 불가
      assertNever(method);
  }
}

processPayment('credit_card');
processPayment('paypal');

// 7. 실전: 폼 검증 상태
console.log('\n=== 7. 실전: 폼 검증 상태 ===');

interface FormIdle {
  state: 'idle';
}

interface FormValidating {
  state: 'validating';
  field: string;
}

interface FormValid {
  state: 'valid';
  values: Record<string, unknown>;
}

interface FormInvalid {
  state: 'invalid';
  errors: Record<string, string>;
}

type FormState = FormIdle | FormValidating | FormValid | FormInvalid;

function renderForm(formState: FormState): void {
  switch (formState.state) {
    case 'idle':
      console.log('📝 Form is idle');
      break;
    case 'validating':
      console.log(`🔄 Validating field: ${formState.field}`);
      break;
    case 'valid':
      console.log('✅ Form is valid:', formState.values);
      break;
    case 'invalid':
      console.log('❌ Form has errors:', formState.errors);
      break;
  }
}

renderForm({ state: 'idle' });
renderForm({ state: 'validating', field: 'email' });
renderForm({ state: 'valid', values: { name: 'Alice', email: 'alice@example.com' } });
renderForm({ state: 'invalid', errors: { email: 'Invalid email format' } });

// 8. 실전: 네트워크 요청 상태
console.log('\n=== 8. 실전: 네트워크 요청 상태 ===');

interface RequestIdle {
  status: 'idle';
}

interface RequestPending {
  status: 'pending';
  controller: AbortController;
}

interface RequestSuccess<T> {
  status: 'success';
  data: T;
  cachedAt: Date;
}

interface RequestError {
  status: 'error';
  error: Error;
  retryCount: number;
}

type RequestState<T> = RequestIdle | RequestPending | RequestSuccess<T> | RequestError;

function displayRequestState<T>(state: RequestState<T>): void {
  switch (state.status) {
    case 'idle':
      console.log('⚪ Request not started');
      break;
    case 'pending':
      console.log('⏳ Request in progress (can abort)');
      break;
    case 'success':
      console.log(`✅ Request succeeded (cached at ${state.cachedAt.toISOString()})`);
      console.log('Data:', state.data);
      break;
    case 'error':
      console.log(`❌ Request failed (retry count: ${state.retryCount})`);
      console.log('Error:', state.error.message);
      break;
  }
}

displayRequestState<string>({ status: 'idle' });
displayRequestState<string>({ status: 'pending', controller: new AbortController() });
displayRequestState<string>({ status: 'success', data: 'Response data', cachedAt: new Date() });
displayRequestState<string>({
  status: 'error',
  error: new Error('Timeout'),
  retryCount: 3,
});

/**
 * 핵심 정리:
 *
 * 1. 판별 유니온 (Discriminated Union):
 *    - 공통 프로퍼티(kind, type, status)로 유니온 타입 구분
 *    - switch/case로 타입 자동 좁히기
 *
 * 2. 판별자 네이밍:
 *    - kind: 도형, 엔티티 종류
 *    - type: Redux 액션, 이벤트 타입
 *    - status: 상태 머신, 비동기 상태
 *
 * 3. 실무 패턴:
 *    - 상태 머신: loading/success/error
 *    - Redux 액션: type 기반 액션 구분
 *    - API 응답: success/error 구분
 *    - 폼 검증: idle/validating/valid/invalid
 *    - 네트워크 요청: idle/pending/success/error
 *
 * 4. Exhaustiveness Checking:
 *    - never 타입으로 모든 케이스 처리 강제
 *    - 새로운 타입 추가 시 컴파일 에러 발생
 *
 * 5. 장점:
 *    - 타입 안전성 (switch에서 자동 타입 좁히기)
 *    - 명확한 상태 표현
 *    - 런타임 오류 방지
 */
