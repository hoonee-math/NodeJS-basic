/**
 * 03-function-overloads.ts
 * 함수 오버로드로 다형성 구현
 */

// 1. 함수 오버로드 기본
// 오버로드 시그니처 (외부에 노출)
function add(a: number, b: number): number;
function add(a: string, b: string): string;

// 구현 시그니처 (외부에 노출 안 됨)
function add(a: any, b: any): any {
  return a + b;
}

console.log('=== 함수 오버로드 기본 ===');
console.log(`10 + 20 = ${add(10, 20)}`);
console.log(`"Hello" + "World" = ${add('Hello', 'World')}`);
// add(10, 'World'); // ❌ 에러: 오버로드 시그니처에 없음

// 2. 입력에 따라 다른 반환 타입
function double(value: string): string;
function double(value: number): number;
function double(value: boolean): string;

function double(value: string | number | boolean): string | number {
  if (typeof value === 'string') {
    return value + value;
  } else if (typeof value === 'number') {
    return value * 2;
  } else {
    return value ? 'true' : 'false';
  }
}

console.log('\n=== 다른 반환 타입 ===');
console.log(`double('TS') = ${double('TS')}`);
console.log(`double(10) = ${double(10)}`);
console.log(`double(true) = ${double(true)}`);

// 3. 오버로드 순서가 중요
function parse(value: string): string[];
function parse(value: number): number;
function parse(value: string | number): string[] | number {
  if (typeof value === 'string') {
    return value.split(',');
  }
  return value;
}

console.log('\n=== 오버로드 순서 ===');
console.log(`parse('a,b,c') =`, parse('a,b,c'));
console.log(`parse(123) =`, parse(123));

// 4. 선택적 매개변수와 오버로드
function createElement(tag: string): HTMLElement;
function createElement(tag: string, text: string): HTMLElement;
function createElement(tag: string, children: HTMLElement[]): HTMLElement;

function createElement(
  tag: string,
  textOrChildren?: string | HTMLElement[]
): HTMLElement {
  const element = { tag, content: textOrChildren };
  console.log('Element created:', element);
  return element as any;
}

console.log('\n=== 선택적 매개변수 오버로드 ===');
createElement('div');
createElement('p', 'Hello');
createElement('ul', [{ tag: 'li' } as any, { tag: 'li' } as any]);

// 5. 오버로드로 정확한 타입 제공
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month - 1, day);
  }
  return new Date(yearOrTimestamp);
}

console.log('\n=== 정확한 타입 제공 ===');
console.log('From timestamp:', makeDate(1609459200000));
console.log('From Y-M-D:', makeDate(2024, 1, 1));
// makeDate(2024, 1); // ❌ 에러: 이 오버로드 없음

// 6. 복잡한 오버로드
interface User {
  id: number;
  name: string;
}

// ID로 조회
function getUser(id: number): User | undefined;
// 이름으로 조회
function getUser(name: string): User[];
// 여러 ID로 조회
function getUser(ids: number[]): User[];

function getUser(
  idOrNameOrIds: number | string | number[]
): User | User[] | undefined {
  const users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Alice' },
  ];

  if (typeof idOrNameOrIds === 'number') {
    // 단일 ID
    return users.find((u) => u.id === idOrNameOrIds);
  } else if (typeof idOrNameOrIds === 'string') {
    // 이름
    return users.filter((u) => u.name === idOrNameOrIds);
  } else {
    // 여러 ID
    return users.filter((u) => idOrNameOrIds.includes(u.id));
  }
}

console.log('\n=== 복잡한 오버로드 ===');
console.log('By ID:', getUser(1));
console.log('By name:', getUser('Alice'));
console.log('By IDs:', getUser([1, 3]));

// 7. 제네릭과 오버로드
function reverse(value: string): string;
function reverse<T>(value: T[]): T[];

function reverse<T>(value: string | T[]): string | T[] {
  if (typeof value === 'string') {
    return value.split('').reverse().join('');
  }
  return value.slice().reverse();
}

console.log('\n=== 제네릭 오버로드 ===');
console.log(`reverse('hello') =`, reverse('hello'));
console.log(`reverse([1,2,3]) =`, reverse([1, 2, 3]));

// 8. 오버로드 vs 유니온 타입
// 유니온으로 충분한 경우
function printValue(value: string | number): void {
  console.log(value);
}

// 오버로드가 필요한 경우 (반환 타입이 다름)
function processValue(value: string): string;
function processValue(value: number): number;
function processValue(value: string | number): string | number {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value * 2;
}

console.log('\n=== 오버로드 vs 유니온 ===');
printValue('simple'); // 유니온으로 충분
console.log(processValue('hello')); // 오버로드 필요 (반환 타입 다름)
console.log(processValue(10));

// 9. 콜백 함수 오버로드
interface Options {
  success: (data: any) => void;
  error?: (error: Error) => void;
}

function fetch(url: string, callback: (data: any) => void): void;
function fetch(url: string, options: Options): void;

function fetch(
  url: string,
  callbackOrOptions: ((data: any) => void) | Options
): void {
  console.log(`Fetching ${url}...`);

  if (typeof callbackOrOptions === 'function') {
    callbackOrOptions({ status: 200, data: 'success' });
  } else {
    callbackOrOptions.success({ status: 200, data: 'success' });
  }
}

console.log('\n=== 콜백 함수 오버로드 ===');
fetch('https://api.example.com', (data) => console.log('Data:', data));
fetch('https://api.example.com', {
  success: (data) => console.log('Success:', data),
  error: (err) => console.error('Error:', err),
});

// 10. 구현 시그니처 타입 주의
// ❌ 잘못된 예: 구현 시그니처가 오버로드를 포함하지 못함
// function wrong(x: number): number;
// function wrong(x: string): string;
// function wrong(x: number): number {  // ❌ 에러
//   return x;
// }

// ✅ 올바른 예: 구현 시그니처가 모든 오버로드 포함
function correct(x: number): number;
function correct(x: string): string;
function correct(x: number | string): number | string {
  if (typeof x === 'number') {
    return x;
  }
  return x;
}

console.log('\n=== 구현 시그니처 포함 ===');
console.log(correct(10));
console.log(correct('test'));

// 11. 실전 예제: 이벤트 리스너
type EventMap = {
  click: MouseEvent;
  keypress: KeyboardEvent;
  load: Event;
};

interface EventEmitter {
  on(event: 'click', handler: (e: MouseEvent) => void): void;
  on(event: 'keypress', handler: (e: KeyboardEvent) => void): void;
  on(event: 'load', handler: (e: Event) => void): void;
}

function createEmitter(): EventEmitter {
  return {
    on(event: string, handler: (e: any) => void): void {
      console.log(`Registered ${event} event`);
    },
  };
}

console.log('\n=== 실전: 이벤트 리스너 ===');
const emitter = createEmitter();
emitter.on('click', (e) => console.log('Clicked at', e.clientX, e.clientY));
emitter.on('keypress', (e) => console.log('Key pressed:', e.key));

// 12. 오버로드 활용: 조건부 타입
function filter(arr: number[], predicate: (n: number) => boolean): number[];
function filter(arr: string[], predicate: (s: string) => boolean): string[];

function filter<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
}

console.log('\n=== 조건부 타입 오버로드 ===');
const numbers = filter([1, 2, 3, 4, 5], (n) => n > 2);
const strings = filter(['a', 'ab', 'abc'], (s) => s.length > 1);
console.log('Filtered numbers:', numbers);
console.log('Filtered strings:', strings);

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 함수 오버로드 구조
 *    // 오버로드 시그니처 (외부 노출)
 *    function f(x: number): number;
 *    function f(x: string): string;
 *
 *    // 구현 시그니처 (외부 노출 안 됨)
 *    function f(x: number | string): number | string { }
 *
 * 2. 오버로드 시그니처
 *    - 외부에 노출되는 타입
 *    - 실제 구현 없음
 *    - 여러 개 정의 가능
 *
 * 3. 구현 시그니처
 *    - 실제 함수 로직
 *    - 외부에 노출되지 않음
 *    - 모든 오버로드를 포함하는 타입
 *
 * 4. 오버로드 순서 규칙
 *    - 구체적인 시그니처를 위에
 *    - 넓은 시그니처를 아래
 *    - TypeScript는 위에서 아래로 매칭
 *
 * 5. 오버로드가 필요한 경우
 *    ✅ 입력에 따라 반환 타입이 다를 때
 *       function f(x: number): number;
 *       function f(x: string): string;
 *
 *    ✅ 매개변수 조합이 복잡할 때
 *       function f(a: number): Date;
 *       function f(a: number, b: number, c: number): Date;
 *
 * 6. 유니온으로 충분한 경우
 *    - 반환 타입이 동일
 *      function f(x: string | number): void { }
 *
 * 7. 구현 시그니처 주의사항
 *    - 모든 오버로드를 포함해야 함
 *    - 너무 넓은 타입 사용 (any, unknown)
 *
 * 8. 제네릭과 오버로드
 *    - 제네릭으로 해결 안 되면 오버로드
 *      function reverse(x: string): string;
 *      function reverse<T>(x: T[]): T[];
 *
 * 9. 콜백 함수 오버로드
 *    - 다양한 콜백 형태 지원
 *      function fetch(url: string, cb: Callback): void;
 *      function fetch(url: string, options: Options): void;
 *
 * 10. 실전 활용
 *     ✅ 이벤트 리스너 (이벤트별 타입)
 *     ✅ API 클라이언트 (메서드별 타입)
 *     ✅ 조건부 반환 (입력에 따라 다른 출력)
 *     ✅ 파서/변환기 (입력 형식에 따라 다른 출력)
 *
 * 11. Best Practices
 *     ✅ 간단하면 유니온 타입 사용
 *     ✅ 복잡하면 오버로드 사용
 *     ✅ 구체적인 시그니처를 위에 배치
 *     ✅ 구현 시그니처는 모든 케이스 포함
 *     ✅ 과도한 오버로드 지양 (유지보수 어려움)
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
 */
