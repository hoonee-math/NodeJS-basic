/**
 * 01-union-types.ts
 * 유니온 타입 (Union Types) - OR 관계
 *
 * 함수가 여러 타입을 받아야 하거나, API 응답이 성공/실패로 나뉠 때 유니온 타입(A | B)을 사용합니다.
 * 이 파일에서는 
 * 기본 유니온(string | number), 
 * 배열 유니온 vs 유니온 배열의 차이, 
 * 객체 유니온에서 공통 프로퍼티만 접근 가능한 이유, 
 * typeof/in 연산자로 타입 좁히기, 
 * null/undefined 안전하게 처리하기, 
 * 그리고 실무 API 응답 타입 패턴을 다룹니다.
 */

// 1. 기본 유니온 타입 (string | number)
console.log('=== 1. 기본 유니온 타입 ===');

function printId(id: string | number): void {
  console.log(`ID: ${id}`);
}

printId(123); // OK
printId('abc'); // OK
// printId(true); // ❌ Error: boolean은 허용 안 됨

// 2. 배열 유니온 vs 유니온 배열
console.log('\n=== 2. 배열 유니온 vs 유니온 배열 ===');

type ArrayUnion = string[] | number[]; // string 배열 또는 number 배열
type UnionArray = (string | number)[]; // string과 number 섞인 배열

const arr1: ArrayUnion = ['a', 'b']; // OK
const arr2: ArrayUnion = [1, 2, 3]; // OK
// const arr3: ArrayUnion = ['a', 1]; // ❌ Error: 섞을 수 없음

const arr4: UnionArray = ['a', 1, 'b', 2]; // ✅ OK: 섞을 수 있음

console.log('ArrayUnion (string[]만):', arr1);
console.log('ArrayUnion (number[]만):', arr2);
console.log('UnionArray (섞임):', arr4);

// 3. 객체 유니온과 공통 프로퍼티
console.log('\n=== 3. 객체 유니온과 공통 프로퍼티 ===');

interface Cat {
  name: string;
  meow(): void;
}

interface Dog {
  name: string;
  bark(): void;
}

function getPetName(pet: Cat | Dog): string {
  // 공통 프로퍼티인 name은 바로 접근 가능
  return pet.name;

  // ❌ pet.meow(); // Error: Dog에는 meow가 없음
  // ❌ pet.bark(); // Error: Cat에는 bark가 없음
}

const myCat: Cat = {
  name: 'Whiskers',
  meow: () => console.log('Meow!'),
};

const myDog: Dog = {
  name: 'Buddy',
  bark: () => console.log('Woof!'),
};

console.log(`Cat name: ${getPetName(myCat)}`);
console.log(`Dog name: ${getPetName(myDog)}`);

// 4. 타입 좁히기와 타입 가드
console.log('\n=== 4. 타입 좁히기 ===');

function processValue(value: string | number): string {
  // typeof 타입 가드로 타입 좁히기
  if (typeof value === 'string') {
    // 이 블록에서 value는 string 타입
    return value.toUpperCase();
  } else {
    // 이 블록에서 value는 number 타입
    return value.toFixed(2);
  }
}

console.log('String:', processValue('hello')); // HELLO
console.log('Number:', processValue(3.14159)); // 3.14

// 5. in 연산자로 객체 타입 좁히기
console.log('\n=== 5. in 연산자 타입 가드 ===');

function makeSound(pet: Cat | Dog): void {
  if ('meow' in pet) {
    // 이 블록에서 pet은 Cat
    pet.meow();
  } else {
    // 이 블록에서 pet은 Dog
    pet.bark();
  }
}

makeSound(myCat); // Meow!
makeSound(myDog); // Woof!

// 6. Null/Undefined 유니온
console.log('\n=== 6. Null/Undefined 유니온 ===');

function greet(name: string | null | undefined): string {
  // Null/Undefined 체크
  if (name == null) {
    // null 또는 undefined
    return 'Hello, Guest!';
  }
  // 이 시점에서 name은 string
  return `Hello, ${name}!`;
}

console.log(greet('Alice')); // Hello, Alice!
console.log(greet(null)); // Hello, Guest!
console.log(greet(undefined)); // Hello, Guest!

// 7. API 응답 타입 (성공/실패)
console.log('\n=== 7. API 응답 타입 ===');

interface SuccessResponse {
  success: true;
  data: {
    id: number;
    name: string;
  };
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleApiResponse(response: ApiResponse): void {
  // success 프로퍼티로 타입 좁히기
  if (response.success) {
    // 이 블록에서 response는 SuccessResponse
    console.log(`✅ Success: ID ${response.data.id}, Name: ${response.data.name}`);
  } else {
    // 이 블록에서 response는 ErrorResponse
    console.log(`❌ Error [${response.error.code}]: ${response.error.message}`);
  }
}

const successRes: ApiResponse = {
  success: true,
  data: { id: 1, name: 'John' },
};

const errorRes: ApiResponse = {
  success: false,
  error: { code: 'NOT_FOUND', message: 'User not found' },
};

handleApiResponse(successRes);
handleApiResponse(errorRes);

// 8. 유니온 타입과 함수 오버로드 비교
console.log('\n=== 8. 함수 매개변수의 유니온 타입 ===');

// 유니온을 사용한 유연한 입력
function formatInput(input: string | number | boolean): string {
  if (typeof input === 'string') {
    return `"${input}"`;
  } else if (typeof input === 'number') {
    return `Number: ${input}`;
  } else {
    return `Boolean: ${input}`;
  }
}

console.log(formatInput('hello')); // "hello"
console.log(formatInput(42)); // Number: 42
console.log(formatInput(true)); // Boolean: true

/**
 * 핵심 정리:
 *
 * 1. Union Type (A | B): 여러 타입 중 하나
 * 2. 공통 프로퍼티만 바로 접근 가능
 * 3. 타입 가드로 타입 좁히기 필요:
 *    - typeof: 원시 타입 (string, number, boolean 등)
 *    - in: 객체 프로퍼티 존재 여부
 *    - == null: null 또는 undefined 체크
 * 4. API 응답, 함수 매개변수에 유용
 */
