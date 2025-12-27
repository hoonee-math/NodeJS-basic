/**
 * 07-union-intersection.ts
 * 유니온과 인터섹션 타입 기초
 */

// 1. 유니온 타입 (Union Types) - "또는" 관계
type StringOrNumber = string | number;

let value1: StringOrNumber = 'hello';
let value2: StringOrNumber = 42;

console.log('=== 유니온 타입 기본 ===');
console.log(`value1 (string): ${value1}`);
console.log(`value2 (number): ${value2}`);

// value3 = true; // ❌ 에러: boolean은 허용 안됨

// 2. 유니온 타입 활용
function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

console.log('\n=== 유니온 타입 함수 ===');
printId('abc123');
printId(12345);

// 3. 리터럴 타입 유니온
type Status = 'pending' | 'approved' | 'rejected';
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

let orderStatus: Status = 'pending';
let method: HttpMethod = 'GET';

console.log('\n=== 리터럴 타입 유니온 ===');
console.log(`주문 상태: ${orderStatus}`);
console.log(`HTTP 메서드: ${method}`);

// orderStatus = 'invalid'; // ❌ 에러

// 4. 타입 가드 (Type Guards)
function processValue(value: string | number): void {
  // typeof로 타입 체크
  if (typeof value === 'string') {
    // 이 블록 안에서 value는 string
    console.log(`문자열 길이: ${value.length}`);
    console.log(`대문자: ${value.toUpperCase()}`);
  } else {
    // 이 블록 안에서 value는 number
    console.log(`숫자 값: ${value}`);
    console.log(`제곱: ${value * value}`);
  }
}

console.log('\n=== 타입 가드 ===');
processValue('hello');
processValue(10);

// 5. 여러 타입의 유니온
type Result = string | number | boolean | null;

let result1: Result = 'success';
let result2: Result = 200;
let result3: Result = true;
let result4: Result = null;

console.log('\n=== 여러 타입 유니온 ===');
console.log('result1:', result1);
console.log('result2:', result2);
console.log('result3:', result3);
console.log('result4:', result4);

// 6. 배열과 유니온
type MixedArray = (string | number)[];

let mixed: MixedArray = [1, 'two', 3, 'four', 5];

console.log('\n=== 배열 유니온 ===');
console.log('mixed:', mixed);

// 7. 유니온 객체 타입
type SuccessResponse = {
  status: 'success';
  data: any;
};

type ErrorResponse = {
  status: 'error';
  message: string;
  code: number;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
  if (response.status === 'success') {
    console.log('성공:', response.data);
  } else {
    console.log(`에러 [${response.code}]: ${response.message}`);
  }
}

console.log('\n=== 유니온 객체 타입 ===');
handleResponse({ status: 'success', data: { id: 1, name: 'Item' } });
handleResponse({ status: 'error', message: 'Not Found', code: 404 });

// 8. 인터섹션 타입 (Intersection Types) - "그리고" 관계
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type Staff = Person & Employee;

let staff: Staff = {
  name: 'John Doe',
  age: 30,
  employeeId: 12345,
  department: 'Engineering',
};

console.log('\n=== 인터섹션 타입 기본 ===');
console.log('staff:', staff);

// 9. 인터섹션으로 타입 결합
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type WithID = {
  id: string;
};

type Entity = WithID & Timestamped;

type Product = Entity & {
  name: string;
  price: number;
};

let product: Product = {
  id: 'prod-001',
  name: 'Laptop',
  price: 1200,
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('\n=== 인터섹션 타입 활용 ===');
console.log('product:', product);

// 10. 유니온 vs 인터섹션
type A = { a: string };
type B = { b: number };

// 유니온: A 또는 B
type UnionAB = A | B;
let union1: UnionAB = { a: 'hello' }; // A만
let union2: UnionAB = { b: 42 }; // B만
let union3: UnionAB = { a: 'hello', b: 42 }; // 둘 다 OK

// 인터섹션: A 그리고 B (모두 필요)
type IntersectionAB = A & B;
let intersection: IntersectionAB = { a: 'hello', b: 42 }; // 둘 다 필수

console.log('\n=== 유니온 vs 인터섹션 ===');
console.log('union1 (A만):', union1);
console.log('union2 (B만):', union2);
console.log('union3 (A, B 둘 다):', union3);
console.log('intersection (A, B 필수):', intersection);

// 11. 타입 좁히기 (Narrowing)
function formatValue(value: string | number | boolean): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  } else if (typeof value === 'number') {
    return value.toFixed(2);
  } else {
    return value ? 'TRUE' : 'FALSE';
  }
}

console.log('\n=== 타입 좁히기 ===');
console.log(formatValue('hello'));
console.log(formatValue(42.12345));
console.log(formatValue(true));

// 12. null과 undefined 처리
type NullableString = string | null | undefined;

function getLength(str: NullableString): number {
  // null 체크
  if (str === null || str === undefined) {
    return 0;
  }
  // 여기서는 str이 string으로 좁혀짐
  return str.length;
}

console.log('\n=== null/undefined 처리 ===');
console.log(`"hello" 길이: ${getLength('hello')}`);
console.log(`null 길이: ${getLength(null)}`);
console.log(`undefined 길이: ${getLength(undefined)}`);

// 13. in 연산자로 타입 가드
type Dog = {
  bark: () => void;
};

type Cat = {
  meow: () => void;
};

type Pet = Dog | Cat;

function makeSound(pet: Pet): void {
  if ('bark' in pet) {
    // Dog
    pet.bark();
  } else {
    // Cat
    pet.meow();
  }
}

let dog: Dog = {
  bark() {
    console.log('Woof!');
  },
};

let cat: Cat = {
  meow() {
    console.log('Meow!');
  },
};

console.log('\n=== in 연산자 타입 가드 ===');
makeSound(dog);
makeSound(cat);

// 14. 판별 유니온 (Discriminated Unions)
type Circle = {
  kind: 'circle';
  radius: number;
};

type Rectangle = {
  kind: 'rectangle';
  width: number;
  height: number;
};

type Shape = Circle | Rectangle;

function getArea(shape: Shape): number {
  // kind 프로퍼티로 구분
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.width * shape.height;
  }
}

console.log('\n=== 판별 유니온 ===');
console.log(`원 면적 (r=5): ${getArea({ kind: 'circle', radius: 5 }).toFixed(2)}`);
console.log(`직사각형 면적 (4x6): ${getArea({ kind: 'rectangle', width: 4, height: 6 })}`);

// 15. 실전 예제: API 응답 처리
type LoadingState = {
  state: 'loading';
};

type SuccessState<T> = {
  state: 'success';
  data: T;
};

type ErrorState = {
  state: 'error';
  error: string;
};

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;

function renderData<T>(asyncState: AsyncState<T>): void {
  switch (asyncState.state) {
    case 'loading':
      console.log('로딩 중...');
      break;
    case 'success':
      console.log('데이터:', asyncState.data);
      break;
    case 'error':
      console.log('에러:', asyncState.error);
      break;
  }
}

console.log('\n=== 실전 예제: 비동기 상태 ===');
renderData<string>({ state: 'loading' });
renderData({ state: 'success', data: { id: 1, name: 'User' } });
renderData({ state: 'error', error: 'Network error' });

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 유니온 타입 (Union Types)
 *    - | 연산자로 "또는" 관계 표현
 *      type ID = string | number;
 *
 * 2. 유니온 타입 활용
 *    - 여러 타입 중 하나를 허용
 *      function print(value: string | number) { }
 *
 * 3. 리터럴 타입 유니온
 *    - 정확한 값들의 집합
 *      type Status = 'pending' | 'approved' | 'rejected';
 *
 * 4. 타입 가드 (Type Guards)
 *    - typeof로 타입 좁히기
 *      if (typeof value === 'string') { ... }
 *
 *    - in 연산자로 프로퍼티 체크
 *      if ('bark' in pet) { ... }
 *
 * 5. 인터섹션 타입 (Intersection Types)
 *    - & 연산자로 "그리고" 관계 표현
 *      type AB = A & B;
 *
 * 6. 인터섹션 활용
 *    - 여러 타입을 모두 만족
 *      type Staff = Person & Employee;
 *
 * 7. 유니온 vs 인터섹션
 *    유니온 (A | B):
 *    - A 또는 B
 *    - 둘 중 하나만 만족하면 됨
 *
 *    인터섹션 (A & B):
 *    - A 그리고 B
 *    - 둘 다 만족해야 함
 *
 * 8. 판별 유니온 (Discriminated Unions)
 *    - 공통 프로퍼티로 타입 구분
 *      type Shape = Circle | Rectangle;
 *      // kind 프로퍼티로 구분
 *
 * 9. 타입 좁히기 (Narrowing)
 *    - 조건문으로 타입 범위 줄이기
 *    - typeof, in, instanceof 등 활용
 *
 * 10. null/undefined 처리
 *     - 유니온으로 nullable 타입 표현
 *       type NullableString = string | null | undefined;
 *
 * 11. 실전 패턴
 *     ✅ API 응답 상태: LoadingState | SuccessState | ErrorState
 *     ✅ 다형성 데이터: Circle | Rectangle | Triangle
 *     ✅ 선택적 값: T | null | undefined
 *     ✅ 타입 확장: BaseType & ExtendedProperties
 *
 * 12. Best Practices
 *     ✅ 판별 유니온 사용 (kind, type 등)
 *     ✅ 타입 가드로 안전하게 타입 좁히기
 *     ✅ 리터럴 유니온으로 enum 대체
 *     ✅ 인터섹션으로 믹스인 패턴 구현
 *
 * 13. 고급 활용
 *     - 상세한 내용은 04-advanced-types에서 학습
 *     - 조건부 타입, 매핑 타입 등
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types
 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html
 */
