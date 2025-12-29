/**
 * 06-type-narrowing.ts
 * 타입 좁히기 (Type Narrowing) 종합 전략
 *
 * 타입 가드에서 배운 기법들을 종합하고, TypeScript의 제어 흐름 분석(Control Flow Analysis)이 어떻게 타입을 자동으로 좁혀주는지 이해합니다.
 * 이 파일에서는 
 * typeof/instanceof/in/등호(===) 좁히기, 
 * Truthiness 체크로 falsy 값 걸러내기, 
 * 옵셔널 체이닝(?.)으로 안전하게 접근하기, 
 * never 타입으로 완전성 검사하기, 
 * 제어 흐름 분석으로 return/break 후 타입 자동 좁히기, 
 * Array.isArray로 배열 구분하기, 
 * 타입 단언(as) 대신 타입 좁히기를 써야 하는 이유, 
 * 그리고 복잡한 유니온 타입을 안전하게 다루는 실무 패턴을 다룹니다.
 */

// 1. typeof 좁히기
console.log('=== 1. typeof 좁히기 ===');

function padLeft(padding: number | string, input: string): string {
  if (typeof padding === 'number') {
    // padding은 number 타입
    return ' '.repeat(padding) + input;
  }
  // padding은 string 타입
  return padding + input;
}

console.log(padLeft(4, 'Hello')); // "    Hello"
console.log(padLeft('>> ', 'Hello')); // ">> Hello"

// 2. instanceof 좁히기
console.log('\n=== 2. instanceof 좁히기 ===');

function formatDate(date: Date | string): string {
  if (date instanceof Date) {
    // date는 Date 타입
    return date.toISOString();
  }
  // date는 string 타입
  return new Date(date).toISOString();
}

console.log(formatDate(new Date()));
console.log(formatDate('2024-01-01'));

// 3. in 연산자 좁히기
console.log('\n=== 3. in 연산자 좁히기 ===');

interface Dog {
  name: string;
  bark(): void;
}

interface Cat {
  name: string;
  meow(): void;
}

function makeSound(animal: Dog | Cat): void {
  if ('bark' in animal) {
    // animal은 Dog 타입
    console.log(`${animal.name}:`);
    animal.bark();
  } else {
    // animal은 Cat 타입
    console.log(`${animal.name}:`);
    animal.meow();
  }
}

makeSound({ name: 'Buddy', bark: () => console.log('Woof!') });
makeSound({ name: 'Whiskers', meow: () => console.log('Meow!') });

// 4. 등호(===) 좁히기
console.log('\n=== 4. 등호(===) 좁히기 ===');

function printStatus(status: 'success' | 'error' | 'loading'): void {
  if (status === 'success') {
    console.log('✅ Success');
  } else if (status === 'error') {
    console.log('❌ Error');
  } else {
    // status는 'loading'
    console.log('⏳ Loading');
  }
}

printStatus('success');
printStatus('loading');

// 5. Truthiness 좁히기
console.log('\n=== 5. Truthiness 좁히기 ===');

function printMessage(message: string | null | undefined): void {
  // Falsy 값 체크: null, undefined, '', 0, false, NaN
  if (message) {
    // message는 string (빈 문자열 아님)
    console.log(`Message: ${message}`);
  } else {
    console.log('No message');
  }
}

printMessage('Hello');
printMessage(null);
printMessage(''); // Falsy이므로 "No message"

// 주의: 빈 문자열도 체크하려면 명시적으로
function printMessageStrict(message: string | null | undefined): void {
  if (message != null) {
    // message는 string (빈 문자열 포함)
    console.log(`Message: "${message}"`);
  } else {
    console.log('No message');
  }
}

console.log('\nStrict version:');
printMessageStrict('Hello');
printMessageStrict(''); // 빈 문자열도 출력

// 6. 옵셔널 체이닝과 타입 좁히기
console.log('\n=== 6. 옵셔널 체이닝 ===');

interface User {
  name: string;
  address?: {
    street: string;
    city: string;
  };
}

function printAddress(user: User): void {
  // 옵셔널 체이닝으로 안전하게 접근
  const city = user.address?.city;
  if (city) {
    console.log(`City: ${city}`);
  } else {
    console.log('No address');
  }
}

printAddress({ name: 'Alice', address: { street: '123 Main St', city: 'Seoul' } });
printAddress({ name: 'Bob' });

// 7. Never 타입 활용 (Exhaustiveness Checking)
console.log('\n=== 7. Never 타입과 완전성 검사 ===');

type Status = 'pending' | 'approved' | 'rejected';

function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x);
}

function handleStatus(status: Status): void {
  switch (status) {
    case 'pending':
      console.log('⏳ Pending');
      break;
    case 'approved':
      console.log('✅ Approved');
      break;
    case 'rejected':
      console.log('❌ Rejected');
      break;
    default:
      // 모든 케이스를 처리했으므로 never 타입
      assertNever(status);
  }
}

handleStatus('pending');
handleStatus('approved');

// 새로운 Status 타입 추가 시 컴파일 에러 발생 (완전성 보장)

// 8. 제어 흐름 분석 (Control Flow Analysis)
console.log('\n=== 8. 제어 흐름 분석 ===');

function processValue(value: string | number | null): void {
  // 초기: string | number | null

  if (value === null) {
    console.log('Value is null');
    return; // 여기서 함수 종료
  }

  // 이 시점: string | number (null 제외)

  if (typeof value === 'string') {
    console.log(`String: ${value.toUpperCase()}`);
    return;
  }

  // 이 시점: number (string과 null 제외)
  console.log(`Number: ${value.toFixed(2)}`);
}

processValue(null);
processValue('hello');
processValue(3.14159);

// 9. Array.isArray로 배열 좁히기
console.log('\n=== 9. Array.isArray 좁히기 ===');

function processInput(input: string | string[] | number[]): void {
  if (Array.isArray(input)) {
    // input은 string[] | number[]
    console.log(`Array with ${input.length} items`);

    // 배열 내부 타입 좁히기
    if (input.length > 0 && typeof input[0] === 'string') {
      // input은 string[]
      console.log('String array:', input.join(', '));
    } else {
      // input은 number[]
      console.log('Number array:', input);
    }
  } else {
    // input은 string
    console.log(`String: ${input}`);
  }
}

processInput('hello');
processInput(['apple', 'banana']);
processInput([1, 2, 3]);

// 10. 복잡한 타입 좁히기 조합
console.log('\n=== 10. 복잡한 타입 좁히기 ===');

interface Square {
  kind: 'square';
  size: number;
}

interface Circle {
  kind: 'circle';
  radius: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Circle | Rectangle;

function calculateArea(shape: Shape): number {
  // 판별 유니온으로 좁히기
  switch (shape.kind) {
    case 'square':
      return shape.size ** 2;
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      assertNever(shape);
  }
}

console.log('Square area:', calculateArea({ kind: 'square', size: 5 }));
console.log('Circle area:', calculateArea({ kind: 'circle', radius: 3 }).toFixed(2));

// 11. 타입 단언 vs 타입 좁히기
console.log('\n=== 11. 타입 단언 vs 타입 좁히기 ===');

interface ApiResponse {
  data: unknown;
}

// ❌ 타입 단언 (위험 - 런타임 에러 가능)
function processResponseUnsafe(response: ApiResponse): void {
  const user = response.data as { name: string; age: number };
  console.log(`Name: ${user.name}`); // 런타임에 에러 날 수 있음
}

// ✅ 타입 좁히기 (안전)
function processResponseSafe(response: ApiResponse): void {
  const data = response.data;

  if (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'age' in data &&
    typeof (data as { name: unknown }).name === 'string' &&
    typeof (data as { age: unknown }).age === 'number'
  ) {
    // data는 { name: string; age: number }
    console.log(`Name: ${data.name}, Age: ${data.age}`);
  } else {
    console.log('Invalid data format');
  }
}

processResponseSafe({ data: { name: 'Alice', age: 30 } });
processResponseSafe({ data: null });

// 12. 실전: 유니온 타입 좁히기 패턴
console.log('\n=== 12. 실전: 유니온 타입 좁히기 ===');

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

function renderData<T>(state: AsyncState<T>, render: (data: T) => void): void {
  // 1차 좁히기: status로 상태 구분
  if (state.status === 'loading') {
    console.log('⏳ Loading...');
    return;
  }

  if (state.status === 'error') {
    console.log('❌ Error:', state.error.message);
    return;
  }

  // 여기서 state는 SuccessState<T>
  console.log('✅ Success:');
  render(state.data);
}

renderData<string>({ status: 'loading' }, (data) => console.log(`Data: ${data}`));
renderData<string>(
  { status: 'success', data: 'Hello' },
  (data) => console.log(`Data: ${data}`)
);
renderData<string>(
  { status: 'error', error: new Error('Failed') },
  (data) => console.log(`Data: ${data}`)
);

/**
 * 핵심 정리:
 *
 * 1. 타입 좁히기 방법:
 *    - typeof: 원시 타입
 *    - instanceof: 클래스 인스턴스
 *    - in: 프로퍼티 존재 여부
 *    - ===: 리터럴 값 비교
 *    - Truthiness: falsy 값 체크
 *    - Array.isArray: 배열 체크
 *
 * 2. 제어 흐름 분석 (CFA):
 *    - TypeScript가 코드 흐름을 추적해 자동으로 타입 좁힘
 *    - return, break, continue 등으로 분기 처리
 *
 * 3. Exhaustiveness Checking:
 *    - never 타입으로 모든 케이스 처리 강제
 *    - 새로운 타입 추가 시 컴파일 에러
 *
 * 4. 옵셔널 체이닝 (?.):
 *    - 안전한 프로퍼티 접근
 *    - undefined 반환 (에러 없음)
 *
 * 5. 타입 단언 vs 타입 좁히기:
 *    - 타입 단언 (as): 위험, 런타임 에러 가능
 *    - 타입 좁히기: 안전, 런타임 체크
 */
