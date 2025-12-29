/**
 * 03-literal-types.ts
 * 리터럴 타입 (Literal Types) - 정확한 값 지정
 *
 * 변수가 아무 문자열이나 받는 게 아니라 'pending' | 'success' | 'error' 같은 특정 값만 받아야 할 때 리터럴 타입을 사용합니다.
 * 이 파일에서는 
 * String/Number/Boolean Literal 기본 사용법, 
 * Template Literal Types로 패턴 문자열 만들기, 
 * const assertions(as const)로 타입 정확하게 고정하기, 
 * enum 대신 리터럴 유니온 쓰는 이유(런타임 코드 없어서 번들 크기 감소), 
 * 그리고 HTTP 메서드/상태 코드/라우팅 경로 등 실무 활용법을 다룹니다.
 */

// 1. String Literal Types
console.log('=== 1. String Literal Types ===');

type Direction = 'left' | 'right' | 'up' | 'down';

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

move('left'); // OK
move('right'); // OK
// move('forward'); // ❌ Error: 'forward'는 Direction에 없음

// 2. Number Literal Types
console.log('\n=== 2. Number Literal Types ===');

type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type HttpStatus = 200 | 201 | 400 | 401 | 403 | 404 | 500;

function rollDice(): DiceRoll {
  return (Math.floor(Math.random() * 6) + 1) as DiceRoll;
}

function handleStatus(status: HttpStatus): void {
  if (status === 200) {
    console.log('✅ OK');
  } else if (status >= 400 && status < 500) {
    console.log('⚠️  Client Error');
  } else if (status >= 500) {
    console.log('❌ Server Error');
  }
}

console.log(`Dice: ${rollDice()}`);
handleStatus(200);
handleStatus(404);

// 3. Boolean Literal Types
console.log('\n=== 3. Boolean Literal Types ===');

type AlwaysTrue = true;
type AlwaysFalse = false;

// 특정 불리언 값만 허용
function requireTrue(value: true): void {
  console.log('Value is always true:', value);
}

requireTrue(true); // OK
// requireTrue(false); // ❌ Error

// 4. 리터럴 유니온으로 정확한 값 제한
console.log('\n=== 4. 리터럴 유니온 ===');

type ButtonSize = 'small' | 'medium' | 'large';
type Theme = 'light' | 'dark' | 'auto';

interface ButtonProps {
  size: ButtonSize;
  theme: Theme;
  disabled: boolean;
}

const button: ButtonProps = {
  size: 'medium',
  theme: 'dark',
  disabled: false,
};

console.log(`Button: ${button.size} size, ${button.theme} theme`);

// 5. Template Literal Types (TypeScript 4.1+)
console.log('\n=== 5. Template Literal Types ===');

type EventName = `on${string}`; // "on"으로 시작하는 모든 문자열

// 특정 접두사 + 리터럴 조합
type Direction2 = 'top' | 'bottom' | 'left' | 'right';
type Alignment = `align-${Direction2}`; // "align-top", "align-bottom", ...

const alignment: Alignment = 'align-top';
console.log('Alignment:', alignment);

// 여러 리터럴 조합
type Color = 'red' | 'green' | 'blue';
type Shade = 'light' | 'dark';
type ColorVariant = `${Color}-${Shade}`; // "red-light", "red-dark", ...

const variant: ColorVariant = 'blue-light';
console.log('Color variant:', variant);

// 6. const assertions (as const)
console.log('\n=== 6. const assertions ===');

// ❌ 타입 추론 문제
let status1 = 'pending'; // 타입: string (너무 넓음)

// ✅ as const로 리터럴 타입 고정
const status2 = 'pending' as const; // 타입: "pending" (정확함)

// 객체에 as const 적용
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
} as const;

// config.timeout = 10000; // ❌ Error: readonly
console.log('Config:', config);

// 배열에 as const 적용
const directions = ['left', 'right', 'up', 'down'] as const;
type DirectionFromArray = (typeof directions)[number]; // "left" | "right" | "up" | "down"

console.log('Directions:', directions);

// 7. HTTP 메서드 타입
console.log('\n=== 7. HTTP 메서드 타입 ===');

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiRequest {
  method: HttpMethod;
  url: string;
  body?: unknown;
}

function sendRequest(request: ApiRequest): void {
  console.log(`→ ${request.method} ${request.url}`);
  if (request.body) {
    console.log('  Body:', request.body);
  }
}

sendRequest({ method: 'GET', url: '/users' });
sendRequest({ method: 'POST', url: '/users', body: { name: 'Alice' } });

// 8. 상태 코드 타입
console.log('\n=== 8. HTTP 상태 코드 타입 ===');

type SuccessStatus = 200 | 201 | 204;
type ClientErrorStatus = 400 | 401 | 403 | 404;
type ServerErrorStatus = 500 | 502 | 503;
type HttpStatusCode = SuccessStatus | ClientErrorStatus | ServerErrorStatus;

interface ApiResponse {
  status: HttpStatusCode;
  message: string;
}

function handleResponse(response: ApiResponse): void {
  if (response.status >= 200 && response.status < 300) {
    console.log(`✅ Success: ${response.message}`);
  } else if (response.status >= 400 && response.status < 500) {
    console.log(`⚠️  Client Error: ${response.message}`);
  } else {
    console.log(`❌ Server Error: ${response.message}`);
  }
}

handleResponse({ status: 200, message: 'OK' });
handleResponse({ status: 404, message: 'Not Found' });

// 9. enum 대신 리터럴 유니온 사용하기
console.log('\n=== 9. enum vs Literal Union ===');

// ❌ enum은 런타임 코드를 생성함 (번들 크기 증가)
enum ColorEnum {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE',
}

// ✅ Literal Union은 타입만 (런타임 코드 없음)
type ColorLiteral = 'RED' | 'GREEN' | 'BLUE';

// Literal Union 사용 권장
const colors = {
  Red: 'RED',
  Green: 'GREEN',
  Blue: 'BLUE',
} as const;

type ColorFromObject = (typeof colors)[keyof typeof colors]; // "RED" | "GREEN" | "BLUE"

console.log('Color Enum:', ColorEnum.Red); // 런타임 코드 존재
console.log('Color Literal:', colors.Red); // 단순 객체 접근

// 10. 실전 예제: 라우팅 경로
console.log('\n=== 10. 실전: 라우팅 경로 타입 ===');

type Route = '/' | '/about' | '/contact' | '/products' | '/products/:id';

function navigate(route: Route): void {
  console.log(`Navigating to: ${route}`);
}

navigate('/');
navigate('/products');
// navigate('/invalid'); // ❌ Error: 허용되지 않는 경로

/**
 * 핵심 정리:
 *
 * 1. Literal Types: 정확한 값만 허용
 *    - String Literal: 'left' | 'right'
 *    - Number Literal: 200 | 404 | 500
 *    - Boolean Literal: true | false
 *
 * 2. Template Literal Types: 패턴 기반 문자열
 *    - `on${string}`: "on"으로 시작
 *    - `${Color}-${Shade}`: 조합
 *
 * 3. const assertions (as const):
 *    - 리터럴 타입 고정
 *    - readonly 적용
 *
 * 4. enum 대신 Literal Union 사용 권장:
 *    - 런타임 코드 없음 (번들 크기 감소)
 *    - 타입 안전성 동일
 *
 * 5. 실무 활용:
 *    - HTTP 메서드, 상태 코드
 *    - 방향, 정렬, 색상
 *    - 라우팅 경로
 *    - 버튼 크기, 테마
 */
