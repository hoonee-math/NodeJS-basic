/**
 * 04-type-guards.ts
 * 타입 가드 (Type Guards) - 런타임에 타입 좁히기
 *
 * 유니온 타입을 사용할 때 런타임에 실제 타입이 무엇인지 확인하고 안전하게 사용하려면 타입 가드가 필요합니다.
 * 이 파일에서는 
 * typeof로 원시 타입 체크하기, 
 * instanceof로 클래스 인스턴스 구분하기, 
 * in 연산자로 객체 프로퍼티 존재 여부 확인하기, 
 * is 키워드로 사용자 정의 타입 가드 만들기, 
 * Array.isArray로 배열 체크하기, 
 * asserts 키워드로 타입 단언 함수 만들기, 
 * 그리고 제네릭과 타입 가드를 조합한 실무 API 응답 처리 패턴을 다룹니다.
 */

// 1. typeof 타입 가드 (원시 타입)
console.log('=== 1. typeof 타입 가드 ===');

function printValue(value: string | number | boolean): void {
  if (typeof value === 'string') {
    console.log(`String: "${value.toUpperCase()}"`);
  } else if (typeof value === 'number') {
    console.log(`Number: ${value.toFixed(2)}`);
  } else {
    console.log(`Boolean: ${value ? 'true' : 'false'}`);
  }
}

printValue('hello');
printValue(3.14159);
printValue(true);

// 2. instanceof 타입 가드 (클래스 인스턴스)
console.log('\n=== 2. instanceof 타입 가드 ===');

class Dog {
  bark(): void {
    console.log('Woof!');
  }
}

class Cat {
  meow(): void {
    console.log('Meow!');
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark(); // animal은 Dog 타입
  } else {
    animal.meow(); // animal은 Cat 타입
  }
}

makeSound(new Dog());
makeSound(new Cat());

// 3. in 연산자 타입 가드 (객체 프로퍼티)
console.log('\n=== 3. in 연산자 타입 가드 ===');

interface Fish {
  swim(): void;
  layEggs(): void;
}

interface Bird {
  fly(): void;
  layEggs(): void;
}

function move(animal: Fish | Bird): void {
  if ('swim' in animal) {
    animal.swim(); // animal은 Fish 타입
  } else {
    animal.fly(); // animal은 Bird 타입
  }
}

const fish: Fish = {
  swim: () => console.log('🐟 Swimming...'),
  layEggs: () => console.log('Laying fish eggs'),
};

const bird: Bird = {
  fly: () => console.log('🐦 Flying...'),
  layEggs: () => console.log('Laying bird eggs'),
};

move(fish);
move(bird);

// 4. 사용자 정의 타입 가드 (is 키워드)
console.log('\n=== 4. 사용자 정의 타입 가드 (is) ===');

interface Square {
  kind: 'square';
  size: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Square | Rectangle;

// 사용자 정의 타입 가드 함수
function isSquare(shape: Shape): shape is Square {
  return shape.kind === 'square';
}

function isRectangle(shape: Shape): shape is Rectangle {
  return shape.kind === 'rectangle';
}

function calculateArea(shape: Shape): number {
  if (isSquare(shape)) {
    // shape는 Square 타입으로 좁혀짐
    return shape.size * shape.size;
  } else {
    // shape는 Rectangle 타입으로 좁혀짐
    return shape.width * shape.height;
  }
}

const square: Square = { kind: 'square', size: 10 };
const rectangle: Rectangle = { kind: 'rectangle', width: 5, height: 20 };

console.log(`Square area: ${calculateArea(square)}`);
console.log(`Rectangle area: ${calculateArea(rectangle)}`);

// 5. 배열 타입 가드 (Array.isArray)
console.log('\n=== 5. Array.isArray 타입 가드 ===');

function processInput(input: string | string[]): void {
  if (Array.isArray(input)) {
    // input은 string[] 타입
    console.log(`Array with ${input.length} items:`, input.join(', '));
  } else {
    // input은 string 타입
    console.log(`String: ${input}`);
  }
}

processInput('hello');
processInput(['apple', 'banana', 'cherry']);

// 6. Null/Undefined 체크
console.log('\n=== 6. Null/Undefined 체크 ===');

function printName(name: string | null | undefined): void {
  // null과 undefined를 동시에 체크
  if (name == null) {
    console.log('No name provided');
    return;
  }

  // 여기서 name은 string 타입
  console.log(`Name: ${name}`);
}

printName('Alice');
printName(null);
printName(undefined);

// 7. 타입 단언 함수 (Assertion Functions)
console.log('\n=== 7. 타입 단언 함수 ===');

// asserts 키워드 사용
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Value is not a string');
  }
}

function processUnknown(value: unknown): void {
  // 타입 단언 후 value는 string으로 확정됨
  assertIsString(value);
  console.log(`String length: ${value.length}`); // value는 string 타입
}

try {
  processUnknown('hello');
  // processUnknown(123); // ❌ Error throw
} catch (error) {
  if (error instanceof Error) {
    console.log('Error:', error.message);
  }
}

// 8. 제네릭 타입 가드
console.log('\n=== 8. 제네릭 타입 가드 ===');

function isArray<T>(value: T | T[]): value is T[] {
  return Array.isArray(value);
}

function processValue<T>(value: T | T[]): void {
  if (isArray(value)) {
    console.log(`Array of ${value.length} items`);
  } else {
    console.log(`Single value: ${value}`);
  }
}

processValue('hello');
processValue(['a', 'b', 'c']);
processValue(42);
processValue([1, 2, 3]);

// 9. 복잡한 타입 가드 조합
console.log('\n=== 9. 복잡한 타입 가드 조합 ===');

interface Success {
  status: 'success';
  data: string;
}

interface Loading {
  status: 'loading';
}

interface Error {
  status: 'error';
  error: string;
}

type AsyncState = Success | Loading | Error;

function isSuccess(state: AsyncState): state is Success {
  return state.status === 'success';
}

function isLoading(state: AsyncState): state is Loading {
  return state.status === 'loading';
}

function isError(state: AsyncState): state is Error {
  return state.status === 'error';
}

function handleState(state: AsyncState): void {
  if (isSuccess(state)) {
    console.log(`✅ Success: ${state.data}`);
  } else if (isLoading(state)) {
    console.log('⏳ Loading...');
  } else if (isError(state)) {
    console.log(`❌ Error: ${state.error}`);
  }
}

handleState({ status: 'success', data: 'Data loaded' });
handleState({ status: 'loading' });
handleState({ status: 'error', error: 'Network error' });

// 10. 실전: API 응답 타입 가드
console.log('\n=== 10. 실전: API 응답 타입 가드 ===');

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccess<T> {
  return response.success === true;
}

function handleApiResponse<T>(response: ApiResponse<T>): T | null {
  if (isApiSuccess(response)) {
    console.log('✅ API Success');
    return response.data;
  } else {
    console.log(`❌ API Error [${response.error.code}]: ${response.error.message}`);
    return null;
  }
}

const successResponse: ApiResponse<{ id: number; name: string }> = {
  success: true,
  data: { id: 1, name: 'John' },
};

const errorResponse: ApiResponse<{ id: number; name: string }> = {
  success: false,
  error: { code: 'NOT_FOUND', message: 'User not found' },
};

handleApiResponse(successResponse);
handleApiResponse(errorResponse);

/**
 * 핵심 정리:
 *
 * 1. 내장 타입 가드:
 *    - typeof: 원시 타입 (string, number, boolean, symbol, bigint, undefined, function)
 *    - instanceof: 클래스 인스턴스
 *    - in: 객체 프로퍼티 존재 여부
 *    - Array.isArray: 배열 체크
 *
 * 2. 사용자 정의 타입 가드 (is 키워드):
 *    - function isType(value: unknown): value is Type { ... }
 *    - 복잡한 타입 체크에 유용
 *
 * 3. 타입 단언 함수 (asserts):
 *    - function assertType(value: unknown): asserts value is Type { ... }
 *    - 예외를 던져 타입 확정
 *
 * 4. 제네릭과 타입 가드:
 *    - 재사용 가능한 타입 가드 함수
 *
 * 5. 실무 활용:
 *    - API 응답 처리
 *    - 상태 관리
 *    - 유니온 타입 좁히기
 */
