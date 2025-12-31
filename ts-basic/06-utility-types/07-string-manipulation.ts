/**
 * 07-string-manipulation.ts
 * String Manipulation Types - 문자열 타입 변환
 *
 * 이벤트 핸들러 이름이나 CSS 프로퍼티처럼 명명 규칙이 있는 경우, 문자열 타입을 자동으로 변환할 수 있습니다.
 * Uppercase<T>, Lowercase<T>, Capitalize<T>, Uncapitalize<T>는 문자열 리터럴 타입의 대소문자를 변환합니다.
 * 이 파일에서는 Uppercase/Lowercase로 대소문자 변환, Capitalize/Uncapitalize로 첫 글자 변환, Template Literal Types와 조합, 이벤트 핸들러 이름 자동 생성, HTTP 메서드 변환, 그리고 실무 API 엔드포인트 타입 예제를 다룹니다.
 */

// ============================================================
// 1. Uppercase<T> 기본 - 문자열을 대문자로
// ============================================================
console.log('\n=== 1. Uppercase<T> 기본 ===');

type LowercaseStr = 'hello';
type UppercaseStr = Uppercase<LowercaseStr>; // 'HELLO'

const upper: UppercaseStr = 'HELLO';
// const invalid: UppercaseStr = 'hello'; // ❌ Error

console.log('Uppercase:', upper);

// 여러 문자열 리터럴
type Color = 'red' | 'green' | 'blue';
type ColorConstant = Uppercase<Color>; // 'RED' | 'GREEN' | 'BLUE'

const colorConst: ColorConstant = 'RED';
console.log('Color Constant:', colorConst);

// ============================================================
// 2. Lowercase<T> 기본 - 문자열을 소문자로
// ============================================================
console.log('\n=== 2. Lowercase<T> 기본 ===');

type UpperStr = 'WORLD';
type LowerStr = Lowercase<UpperStr>; // 'world'

const lower: LowerStr = 'world';
console.log('Lowercase:', lower);

// HTTP 메서드를 소문자로
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type HttpMethodLower = Lowercase<HttpMethod>; // 'get' | 'post' | 'put' | 'delete'

const method: HttpMethodLower = 'get';
console.log('HTTP Method (lowercase):', method);

// ============================================================
// 3. Capitalize<T> 기본 - 첫 글자만 대문자로
// ============================================================
console.log('\n=== 3. Capitalize<T> 기본 ===');

type LowerWord = 'hello';
type CapitalizedWord = Capitalize<LowerWord>; // 'Hello'

const capitalized: CapitalizedWord = 'Hello';
console.log('Capitalized:', capitalized);

// 프로퍼티 이름을 메서드 이름으로
type Property = 'name' | 'age' | 'email';
type Getter = `get${Capitalize<Property>}`; // 'getName' | 'getAge' | 'getEmail'

const getter: Getter = 'getName';
console.log('Getter:', getter);

// ============================================================
// 4. Uncapitalize<T> 기본 - 첫 글자만 소문자로
// ============================================================
console.log('\n=== 4. Uncapitalize<T> 기본 ===');

type CapitalWord = 'Hello';
type UncapitalizedWord = Uncapitalize<CapitalWord>; // 'hello'

const uncapitalized: UncapitalizedWord = 'hello';
console.log('Uncapitalized:', uncapitalized);

// 클래스 이름을 변수 이름으로
type ClassName = 'UserService' | 'ProductService';
type VariableName = Uncapitalize<ClassName>; // 'userService' | 'productService'

const varName: VariableName = 'userService';
console.log('Variable Name:', varName);

// ============================================================
// 5. Template Literal Types와 조합
// ============================================================
console.log('\n=== 5. Template Literal Types와 조합 ===');

type EventName = 'click' | 'submit' | 'change';

// on + Capitalize
type EventHandler = `on${Capitalize<EventName>}`; // 'onClick' | 'onSubmit' | 'onChange'

const handler: EventHandler = 'onClick';
console.log('Event Handler:', handler);

// handle + Capitalize
type HandlerFunction = `handle${Capitalize<EventName>}`; // 'handleClick' | 'handleSubmit' | 'handleChange'

const handlerFn: HandlerFunction = 'handleClick';
console.log('Handler Function:', handlerFn);

// ============================================================
// 6. 이벤트 핸들러 이름 생성
// ============================================================
console.log('\n=== 6. 이벤트 핸들러 이름 생성 ===');

type DOMEvent =
  | 'click'
  | 'dblclick'
  | 'mouseenter'
  | 'mouseleave'
  | 'keydown'
  | 'keyup'
  | 'focus'
  | 'blur';

type EventHandlerName = `on${Capitalize<DOMEvent>}`;

// EventHandlerName = 'onClick' | 'onDblclick' | 'onMouseenter' | ...

type EventHandlerMap = {
  [K in EventHandlerName]: (event: Event) => void;
};

const handlers: Partial<EventHandlerMap> = {
  onClick: (e) => console.log('Clicked', e),
  onKeydown: (e) => console.log('Key down', e),
};

console.log('Event Handler Map created');

// ============================================================
// 7. HTTP 메서드 변환
// ============================================================
console.log('\n=== 7. HTTP 메서드 변환 ===');

type HttpMethodUpper = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 소문자 메서드
type HttpMethodLowercase = Lowercase<HttpMethodUpper>;

// Axios 스타일 메서드 이름
type AxiosMethod = Lowercase<HttpMethodUpper>;

// 라우터 메서드 이름
type RouterMethod = Lowercase<HttpMethodUpper>;

const axiosMethod: AxiosMethod = 'post';
console.log('Axios Method:', axiosMethod);

// ============================================================
// 8. CSS 프로퍼티 변환
// ============================================================
console.log('\n=== 8. CSS 프로퍼티 변환 ===');

type CssProperty = 'backgroundColor' | 'fontSize' | 'marginTop';

// CSS 속성을 kebab-case로 (이건 복잡해서 실제로는 수동 매핑)
// 하지만 대소문자 변환은 가능
type CssVar = `--${Lowercase<CssProperty>}`; // '--backgroundcolor' | '--fontsize' | '--margintop'

const cssVar: CssVar = '--backgroundcolor';
console.log('CSS Variable:', cssVar);

// ============================================================
// 9. 실무 예제: API 엔드포인트 타입
// ============================================================
console.log('\n=== 9. 실무 예제: API 엔드포인트 타입 ===');

type Resource = 'user' | 'product' | 'order';
type Action = 'create' | 'update' | 'delete' | 'list';

// API 엔드포인트: /api/{resource}/{action}
type ApiEndpoint = `/api/${Resource}/${Action}`;

const endpoint: ApiEndpoint = '/api/user/create';
console.log('API Endpoint:', endpoint);

// REST 메서드 이름
type RestMethod = `${Lowercase<HttpMethodUpper>}${Capitalize<Resource>}`;
// 'getUser' | 'postUser' | 'putUser' | ... | 'getProduct' | ...

const restMethod: RestMethod = 'getUser';
console.log('REST Method:', restMethod);

// ============================================================
// 10. 타입 안전한 상수 생성
// ============================================================
console.log('\n=== 10. 타입 안전한 상수 생성 ===');

type Status = 'pending' | 'approved' | 'rejected';

// 상수 이름
type StatusConstant = `STATUS_${Uppercase<Status>}`;
// 'STATUS_PENDING' | 'STATUS_APPROVED' | 'STATUS_REJECTED'

const STATUS_CONSTANTS: Record<StatusConstant, Status> = {
  STATUS_PENDING: 'pending',
  STATUS_APPROVED: 'approved',
  STATUS_REJECTED: 'rejected',
};

console.log('Status Constants:', STATUS_CONSTANTS);

// ============================================================
// 11. 복합 변환
// ============================================================
console.log('\n=== 11. 복합 변환 ===');

type Model = 'user' | 'product';
type CrudAction = 'create' | 'read' | 'update' | 'delete';

// Service 메서드: createUser, readProduct, etc.
type ServiceMethod = `${CrudAction}${Capitalize<Model>}`;

// Repository 메서드: CREATE_USER, READ_PRODUCT, etc.
type RepositoryConstant = `${Uppercase<CrudAction>}_${Uppercase<Model>}`;

const serviceMethod: ServiceMethod = 'createUser';
const repoConstant: RepositoryConstant = 'CREATE_USER';

console.log('Service Method:', serviceMethod);
console.log('Repository Constant:', repoConstant);

// ============================================================
// 12. 실무 예제: 타입 안전한 이벤트 시스템
// ============================================================
console.log('\n=== 12. 실무 예제: 타입 안전한 이벤트 시스템 ===');

type AppEvent = 'userLogin' | 'userLogout' | 'dataUpdate' | 'errorOccurred';

// 이벤트 타입: USER_LOGIN, USER_LOGOUT, etc.
type EventType = Uppercase<AppEvent>;

// 이벤트 핸들러: onUserLogin, onUserLogout, etc.
type EventHandlerKey = `on${Capitalize<AppEvent>}`;

type EventMap = {
  [K in EventType]: {
    type: K;
    timestamp: Date;
    data?: unknown;
  };
};

type EventHandlers = {
  [K in EventHandlerKey]?: (event: EventMap[Uppercase<K extends `on${infer E}` ? Uncapitalize<E> : never>]) => void;
};

// 간단한 버전
type SimpleEventHandlers = {
  [K in AppEvent as `on${Capitalize<K>}`]: (data: unknown) => void;
};

const eventHandlers: Partial<SimpleEventHandlers> = {
  onUserLogin: (data) => console.log('User logged in', data),
  onDataUpdate: (data) => console.log('Data updated', data),
};

console.log('Type-safe Event System created');

// ============================================================
// 13. 조건부 문자열 변환
// ============================================================
console.log('\n=== 13. 조건부 문자열 변환 ===');

type MixedCase = 'helloWorld' | 'GOODBYE' | 'TypeScript';

// 모두 대문자로
type AllUpper = Uppercase<MixedCase>; // 'HELLOWORLD' | 'GOODBYE' | 'TYPESCRIPT'

// 모두 소문자로
type AllLower = Lowercase<MixedCase>; // 'helloworld' | 'goodbye' | 'typescript'

const allUpper: AllUpper = 'HELLOWORLD';
const allLower: AllLower = 'helloworld';

console.log('All Upper:', allUpper);
console.log('All Lower:', allLower);

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Uppercase<T>
 *    - 문자열 리터럴 타입을 대문자로 변환
 *    - 예: Uppercase<'hello'> → 'HELLO'
 *    - 용도: 상수 이름, 환경 변수 이름
 *
 * 2. Lowercase<T>
 *    - 문자열 리터럴 타입을 소문자로 변환
 *    - 예: Lowercase<'WORLD'> → 'world'
 *    - 용도: HTTP 메서드, URL 경로
 *
 * 3. Capitalize<T>
 *    - 첫 글자만 대문자로 변환
 *    - 예: Capitalize<'hello'> → 'Hello'
 *    - 용도: 클래스 이름, 메서드 이름 생성
 *
 * 4. Uncapitalize<T>
 *    - 첫 글자만 소문자로 변환
 *    - 예: Uncapitalize<'Hello'> → 'hello'
 *    - 용도: 변수 이름, 프로퍼티 이름
 *
 * 5. Template Literal Types 조합
 *    - `on${Capitalize<Event>}` → 'onClick', 'onSubmit'
 *    - `get${Capitalize<Prop>}` → 'getName', 'getAge'
 *    - `${Uppercase<T>}_CONSTANT` → 'USER_CONSTANT'
 *
 * 6. 실무 패턴
 *    - 이벤트 핸들러: `on${Capitalize<EventName>}`
 *    - API 메서드: `${Lowercase<Method>}${Capitalize<Resource>}`
 *    - 상수: `${Uppercase<Name>}_CONSTANT`
 *    - CSS 변수: `--${Lowercase<Property>}`
 *
 * 7. 제약사항
 *    - 문자열 리터럴 타입에만 적용 (string 타입에는 적용 안 됨)
 *    - 템플릿 리터럴과 함께 사용하면 강력
 */

console.log(`
예제:
  type EventHandler = \`on\${Capitalize<'click' | 'submit'>}\`; // 'onClick' | 'onSubmit'
  type HttpMethod = Lowercase<'GET' | 'POST'>; // 'get' | 'post'
  type Constant = \`STATUS_\${Uppercase<'pending'>}\`; // 'STATUS_PENDING'
  type Getter = \`get\${Capitalize<'name'>}\`; // 'getName'
`);
