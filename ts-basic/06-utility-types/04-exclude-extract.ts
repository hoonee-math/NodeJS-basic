/**
 * 04-exclude-extract.ts
 * Exclude, Extract - 유니온 타입 필터링
 *
 * 유니온 타입에서 특정 타입만 제외하거나 추출해야 할 때가 있습니다.
 * Exclude<T, U>는 T에서 U에 할당 가능한 타입을 제외하고, Extract<T, U>는 T에서 U에 할당 가능한 타입만 추출합니다.
 * 이 파일에서는 Exclude<T, U>로 유니온에서 타입 제거, Extract<T, U>로 공통 타입 추출, 리터럴 유니온 필터링, 함수 타입 필터링, 조건부 타입과 조합, 그리고 실무 이벤트 타입 필터링 예제를 다룹니다.
 */

// ============================================================
// 1. Exclude<T, U> 기본 - T에서 U 제외
// ============================================================
console.log('\n=== 1. Exclude<T, U> 기본 ===');

type AllColors = 'red' | 'green' | 'blue' | 'yellow';
type PrimaryColors = 'red' | 'green' | 'blue';

// AllColors에서 PrimaryColors 제외 → 'yellow'
type SecondaryColors = Exclude<AllColors, PrimaryColors>;

const secondary: SecondaryColors = 'yellow';
// const invalid: SecondaryColors = 'red'; // ❌ Error

console.log('Secondary Color:', secondary);

// ============================================================
// 2. Extract<T, U> 기본 - T에서 U만 추출
// ============================================================
console.log('\n=== 2. Extract<T, U> 기본 ===');

type AllTypes = string | number | boolean | null | undefined;
type PrimitiveTypes = string | number | boolean;

// AllTypes에서 PrimitiveTypes만 추출
type OnlyPrimitives = Extract<AllTypes, PrimitiveTypes>;

const primitive: OnlyPrimitives = 'hello'; // string | number | boolean
// const invalid2: OnlyPrimitives = null; // ❌ Error

console.log('Primitive:', primitive);

// ============================================================
// 3. 리터럴 유니온 필터링
// ============================================================
console.log('\n=== 3. 리터럴 유니온 필터링 ===');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 읽기 전용 메서드만
type ReadOnlyMethods = Extract<HttpMethod, 'GET'>;

// 수정 메서드 (GET 제외)
type MutationMethods = Exclude<HttpMethod, 'GET'>;

const readMethod: ReadOnlyMethods = 'GET';
const mutateMethod: MutationMethods = 'POST'; // 'POST' | 'PUT' | 'DELETE' | 'PATCH'

console.log('Read Method:', readMethod);
console.log('Mutation Method:', mutateMethod);

// ============================================================
// 4. 함수 타입 필터링
// ============================================================
console.log('\n=== 4. 함수 타입 필터링 ===');

type MixedTypes = string | number | (() => void) | ((x: number) => number);

// 함수 타입만 추출
type OnlyFunctions = Extract<MixedTypes, Function>;

// 함수가 아닌 타입만
type NonFunctions = Exclude<MixedTypes, Function>;

const func: OnlyFunctions = () => console.log('function');
const nonFunc: NonFunctions = 'string'; // string | number

console.log('Function type extracted');

// ============================================================
// 5. Exclude와 Extract 비교
// ============================================================
console.log('\n=== 5. Exclude와 Extract 비교 ===');

type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';
type ActiveStatus = 'pending' | 'approved';

// Exclude: Status에서 ActiveStatus 제거 → 'rejected' | 'cancelled'
type InactiveStatus = Exclude<Status, ActiveStatus>;

// Extract: Status에서 ActiveStatus만 추출 → 'pending' | 'approved'
type OnlyActiveStatus = Extract<Status, ActiveStatus>;

const inactive: InactiveStatus = 'rejected';
const active: OnlyActiveStatus = 'pending';

console.log('Inactive Status:', inactive);
console.log('Active Status:', active);

// Exclude + Extract = 원본 타입
type Reconstructed = Exclude<Status, ActiveStatus> | Extract<Status, ActiveStatus>;
const recon: Reconstructed = 'pending'; // Status와 동일

console.log('Reconstructed:', recon);

// ============================================================
// 6. 조건부 타입과 조합
// ============================================================
console.log('\n=== 6. 조건부 타입과 조합 ===');

type User = {
  id: string;
  name: string;
  age: number;
  email: string;
};

// User의 키 중 string 타입인 것만
type StringKeys = {
  [K in keyof User]: User[K] extends string ? K : never;
}[keyof User];

// StringKeys = 'id' | 'name' | 'email'
type UserStringProps = Pick<User, StringKeys>;

const stringProps: UserStringProps = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
};

console.log('String Props:', stringProps);

// ============================================================
// 7. 실무 예제: 이벤트 타입 필터링
// ============================================================
console.log('\n=== 7. 실무 예제: 이벤트 타입 필터링 ===');

type ClickEvent = { type: 'click'; x: number; y: number };
type KeyEvent = { type: 'keydown' | 'keyup'; key: string };
type MouseEvent = { type: 'mousemove' | 'mouseenter'; x: number; y: number };
type FocusEvent = { type: 'focus' | 'blur' };

type AllEvents = ClickEvent | KeyEvent | MouseEvent | FocusEvent;

// 마우스 관련 이벤트만 (x, y 좌표가 있는 이벤트)
type MouseRelatedEvents = Extract<AllEvents, { x: number }>;

// 키보드 이벤트가 아닌 것
type NonKeyEvents = Exclude<AllEvents, KeyEvent>;

function handleMouseEvent(event: MouseRelatedEvents) {
  console.log(`Mouse event at (${event.x}, ${event.y})`);
}

handleMouseEvent({ type: 'click', x: 100, y: 200 });
handleMouseEvent({ type: 'mousemove', x: 150, y: 250 });

// ============================================================
// 8. Union 타입 조작
// ============================================================
console.log('\n=== 8. Union 타입 조작 ===');

type Role = 'admin' | 'user' | 'guest' | 'moderator';

// 관리 권한이 있는 역할
type AdminRoles = Extract<Role, 'admin' | 'moderator'>;

// 일반 사용자 역할 (관리 권한 제외)
type RegularRoles = Exclude<Role, AdminRoles>;

const adminRole: AdminRoles = 'admin';
const regularRole: RegularRoles = 'user'; // 'user' | 'guest'

console.log('Admin Role:', adminRole);
console.log('Regular Role:', regularRole);

// ============================================================
// 9. 타입 좁히기와 함께 사용
// ============================================================
console.log('\n=== 9. 타입 좁히기와 함께 사용 ===');

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; sideLength: number }
  | { kind: 'rectangle'; width: number; height: number };

// Circle과 Square만
type SimpleShapes = Extract<Shape, { kind: 'circle' | 'square' }>;

// Rectangle 제외
type NonRectangleShapes = Exclude<Shape, { kind: 'rectangle' }>;

function getArea(shape: SimpleShapes): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
  }
}

const circle: SimpleShapes = { kind: 'circle', radius: 5 };
console.log('Circle area:', getArea(circle));

// ============================================================
// 10. never 타입과의 관계
// ============================================================
console.log('\n=== 10. never 타입과의 관계 ===');

type A = 'a' | 'b' | 'c';
type B = 'd' | 'e';

// A와 B에 공통 요소가 없으면 Extract는 never
type Common = Extract<A, B>; // never

// 모두 제외하면 never
type Empty = Exclude<A, A>; // never

// never는 유니온에서 사라짐
type WithNever = 'a' | 'b' | never; // 'a' | 'b'

console.log('Never type is eliminated from unions');

// ============================================================
// 11. 고급 패턴: Nullable 제거
// ============================================================
console.log('\n=== 11. 고급 패턴: Nullable 제거 ===');

type MaybeString = string | null | undefined;

// null과 undefined 제거 (NonNullable과 동일)
type DefinitelyString = Exclude<MaybeString, null | undefined>;

const definite: DefinitelyString = 'hello';
// const invalid3: DefinitelyString = null; // ❌ Error

console.log('Definitely String:', definite);

// 객체 프로퍼티에서 nullable 제거
type NullableUser = {
  id: string | null;
  name: string | undefined;
  email: string;
};

type NonNullableUser = {
  [K in keyof NullableUser]: Exclude<NullableUser[K], null | undefined>;
};

const nonNullUser: NonNullableUser = {
  id: 'u1',
  name: 'Alice',
  email: 'alice@example.com',
};

console.log('Non-nullable User:', nonNullUser);

// ============================================================
// 12. 실무 예제: API 응답 타입 필터링
// ============================================================
console.log('\n=== 12. 실무 예제: API 응답 타입 필터링 ===');

type SuccessResponse = { status: 'success'; data: unknown };
type ErrorResponse = { status: 'error'; message: string };
type LoadingResponse = { status: 'loading' };

type ApiResponse = SuccessResponse | ErrorResponse | LoadingResponse;

// 성공 응답만
type OnlySuccess = Extract<ApiResponse, { status: 'success' }>;

// 에러가 아닌 응답
type NonErrorResponses = Exclude<ApiResponse, ErrorResponse>;

function handleSuccess(response: OnlySuccess) {
  console.log('Success data:', response.data);
}

function handleNonError(response: NonErrorResponses) {
  if (response.status === 'success') {
    console.log('Data:', response.data);
  } else {
    console.log('Loading...');
  }
}

handleSuccess({ status: 'success', data: { id: 1 } });
handleNonError({ status: 'loading' });

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Exclude<T, U>
 *    - T에서 U에 할당 가능한 타입 제거
 *    - 용도: 유니온에서 특정 타입 제외
 *    - 구현: T extends U ? never : T
 *    - 예: Exclude<'a'|'b'|'c', 'a'> → 'b'|'c'
 *
 * 2. Extract<T, U>
 *    - T에서 U에 할당 가능한 타입만 추출
 *    - 용도: 유니온에서 특정 타입만 선택
 *    - 구현: T extends U ? T : never
 *    - 예: Extract<'a'|'b'|'c', 'a'|'b'> → 'a'|'b'
 *
 * 3. 차이점
 *    - Exclude: 차집합 (T - U)
 *    - Extract: 교집합 (T ∩ U)
 *    - Exclude<T, U> | Extract<T, U> = T
 *
 * 4. 실무 패턴
 *    - 리터럴 유니온 필터링
 *    - 함수 타입 필터링
 *    - 이벤트 타입 분류
 *    - API 응답 타입 좁히기
 *
 * 5. never 타입
 *    - 공통 요소가 없으면 Extract는 never
 *    - 모두 제외하면 Exclude는 never
 *    - never는 유니온에서 자동 제거
 *
 * 6. NonNullable
 *    - Exclude<T, null | undefined>와 동일
 *    - null과 undefined 제거
 */

console.log(`
예제:
  type NonAdmin = Exclude<Role, 'admin'>;
  type StringsOnly = Extract<string | number | boolean, string>;
  type NonNullable<T> = Exclude<T, null | undefined>;
  type ActiveEvents = Extract<AllEvents, { status: 'active' }>;
`);
