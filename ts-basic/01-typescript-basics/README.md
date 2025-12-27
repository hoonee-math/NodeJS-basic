# 01. TypeScript 기초

TypeScript의 핵심인 **타입 시스템**의 기본을 학습합니다. JavaScript에 타입을 더하면 어떤 장점이 있는지, 기본 타입들은 어떻게 사용하는지 단계별로 익혀봅니다.

## 학습 목표

- TypeScript의 기본 타입 시스템 이해
- 타입 추론과 타입 어노테이션 구분
- 배열, 튜플, 객체 타입 활용
- 타입 별칭으로 재사용 가능한 타입 정의
- any vs unknown - 언제 무엇을 써야 할까?
- 실전에서 자주 사용하는 타입 패턴

## 목차

1. [01-basic-types.ts](#01-basic-typests) - 기본 타입들
2. [02-type-inference.ts](#02-type-inferencets) - 타입 추론
3. [03-type-annotations.ts](#03-type-annotationsts) - 타입 어노테이션
4. [04-arrays-tuples.ts](#04-arrays-tuplests) - 배열과 튜플
5. [05-objects.ts](#05-objectsts) - 객체 타입
6. [06-type-alias.ts](#06-type-aliasts) - 타입 별칭
7. [07-union-intersection.ts](#07-union-intersectionts) - 유니온과 인터섹션 기초
8. [08-any-unknown.ts](#08-any-unknownts) - any vs unknown
9. [09-practical-examples.ts](#09-practical-examplests) - 실전 예제

## 예제 파일 상세

### 01-basic-types.ts

TypeScript의 기본 타입들을 학습합니다.

**주요 타입:**
```typescript
// 원시 타입
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;

// null과 undefined
let empty: null = null;
let notDefined: undefined = undefined;

// void - 반환값이 없는 함수
function log(message: string): void {
  console.log(message);
}

// never - 절대 반환하지 않는 함수
function throwError(message: string): never {
  throw new Error(message);
}
```

**학습 포인트:**
- JavaScript의 모든 타입을 TypeScript로 표현
- `void`와 `never`의 차이
- `null`과 `undefined`의 타입 처리

### 02-type-inference.ts

타입 추론(Type Inference) - TypeScript가 자동으로 타입을 추론하는 방식을 학습합니다.

**핵심 개념:**
```typescript
// 타입 추론 - TypeScript가 자동으로 타입 결정
let message = 'Hello';  // string으로 추론
let count = 42;         // number로 추론
let isValid = true;     // boolean으로 추론

// 함수 반환 타입 추론
function add(a: number, b: number) {
  return a + b;  // number로 추론
}

// 배열 타입 추론
let numbers = [1, 2, 3];  // number[]로 추론
let mixed = [1, 'two', true];  // (number | string | boolean)[]로 추론
```

**학습 포인트:**
- 언제 타입을 명시하고, 언제 추론에 맡길까?
- 타입 추론의 장점과 한계
- Best Practice: 명시적 타입 vs 추론

### 03-type-annotations.ts

타입 어노테이션(Type Annotations) - 명시적으로 타입을 지정하는 방법을 학습합니다.

**핵심 개념:**
```typescript
// 변수 타입 어노테이션
let username: string;
let age: number;
let isActive: boolean;

// 함수 매개변수와 반환 타입
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// 여러 매개변수
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// 선택적 매개변수
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}
```

**학습 포인트:**
- 변수, 함수 매개변수, 반환 타입 어노테이션
- 선택적 매개변수 (`?`)
- 기본값이 있는 매개변수

### 04-arrays-tuples.ts

배열과 튜플 타입을 학습합니다.

**배열 타입:**
```typescript
let numbers: number[] = [1, 2, 3, 4, 5];            // 배열 타입 표기법 1
let strings: Array<string> = ['a', 'b', 'c'];       // 배열 타입 표기법 2 (제네릭)
let readonlyNumbers: readonly number[] = [1, 2, 3]; // readonlyNumbers.push(4);  // ❌ 에러! 읽기 전용 배열
```

**튜플 타입:**
```typescript
let person: [string, number] = ['John', 30];        // 튜플 - 고정된 길이와 타입의 배열
let [name, age] = person;                           // 튜플의 구조 분해
let response: [number, string?] = [200];                    // 선택적 요소가 있는 튜플 1
let errorResponse: [number, string?] = [404, 'Not Found'];  // 선택적 요소가 있는 튜플 2
let data: [string, ...number[]] = ['scores', 90, 85, 95];   // 나머지 요소가 있는 튜플
```

**학습 포인트:**
- 배열 vs 튜플 - 언제 무엇을 쓸까?
- `readonly` 배열의 활용
- 튜플의 실전 사용 사례 (함수 다중 반환값 등)

### 05-objects.ts

객체 타입을 학습합니다.

**핵심 개념:**
```typescript
// 객체 타입 인라인 정의
let user: { name: string; age: number } = {
  name: 'John',
  age: 30
};

// 선택적 프로퍼티
let product: {
  name: string;
  price: number;
  description?: string;  // 선택적
} = {
  name: 'Laptop',
  price: 1200
};

// 읽기 전용 프로퍼티
let config: {
  readonly apiUrl: string;
  timeout: number;
} = {
  apiUrl: 'https://api.example.com',
  timeout: 3000
};
// config.apiUrl = 'new-url';  // ❌ 에러!

// 인덱스 시그니처 - 동적 프로퍼티
let scores: {
  [studentName: string]: number;
} = {
  john: 90,
  jane: 95,
  bob: 85
};
```

**학습 포인트:**
- 인라인 객체 타입 vs 타입 별칭/인터페이스
- 선택적 프로퍼티 (`?`)
- 읽기 전용 프로퍼티 (`readonly`)
- 인덱스 시그니처로 동적 키 처리

### 06-type-alias.ts

타입 별칭(Type Alias)으로 재사용 가능한 타입을 정의합니다.

**핵심 개념:**
```typescript
// 타입 별칭
type UserID = string | number;
type Point = { x: number; y: number };

// 사용
let id1: UserID = 'abc123';
let id2: UserID = 12345;

let point: Point = { x: 10, y: 20 };

// 복잡한 타입도 별칭으로
type User = {
  id: UserID;
  name: string;
  email: string;
  age?: number;
  isActive: boolean;
};

// 함수 타입 별칭
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const multiply: MathOperation = (a, b) => a * b;
```

**학습 포인트:**
- 타입 별칭으로 코드 재사용성 향상
- 복잡한 타입을 의미 있는 이름으로 표현
- 함수 타입 별칭
- **주의:** interface와의 차이는 03-classes-interfaces에서 다룸

### 07-union-intersection.ts

유니온과 인터섹션 타입의 기초를 학습합니다.

**유니온 타입:**
```typescript
// 여러 타입 중 하나
type ID = string | number;

let userId: ID = 'abc';
userId = 123;  // OK

// 함수 매개변수로 활용
function printId(id: string | number) {
  console.log(`ID: ${id}`);
}

// 리터럴 타입 유니온
type Status = 'pending' | 'approved' | 'rejected';

let orderStatus: Status = 'pending';
// orderStatus = 'invalid';  // ❌ 에러!
```

**인터섹션 타입:**
```typescript
// 여러 타입을 모두 만족
type Person = { name: string };
type Employee = { employeeId: number };

type Staff = Person & Employee;

let staff: Staff = {
  name: 'John',
  employeeId: 12345
};
```

**학습 포인트:**
- 유니온(`|`) - "또는" 관계
- 인터섹션(`&`) - "그리고" 관계
- 리터럴 타입과 유니온의 조합 (enum 대안)
- 상세한 내용은 04-advanced-types에서 다룸

### 08-any-unknown.ts

`any`와 `unknown`의 차이점과 올바른 사용법을 학습합니다.

**any - 타입 체크 비활성화:**
```typescript
let value: any = 'hello';
value = 42;
value = true;
value.toUpperCase();  // 타입 체크 없음, 런타임 에러 가능!
```

**unknown - 안전한 any:**
```typescript
let value: unknown = 'hello';

// ❌ 바로 사용 불가
// value.toUpperCase();  // 에러!

// ✅ 타입 가드 후 사용
if (typeof value === 'string') {
  value.toUpperCase();  // OK!
}

// ✅ 타입 단언
(value as string).toUpperCase();
```

**학습 포인트:**
- `any`는 타입 안전성을 포기 - 최대한 피하기
- `unknown`은 안전한 대안 - 타입 체크 강제
- 언제 `any`를 써도 되는가? (외부 라이브러리, 마이그레이션 중)
- 타입 가드로 `unknown`을 안전하게 사용

### 09-practical-examples.ts

지금까지 배운 내용을 종합한 실전 예제입니다.

**예제 1: 사용자 관리 시스템**
```typescript
type UserRole = 'admin' | 'user' | 'guest';

type User = {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  profile?: {
    bio: string;
    avatar: string;
  };
};

function createUser(
  id: string | number,
  name: string,
  email: string,
  role: UserRole = 'user'
): User {
  return {
    id,
    name,
    email,
    role,
    createdAt: new Date()
  };
}
```

**예제 2: API 응답 타입**
```typescript
type ApiResponse<T> = {
  status: number;
  data: T;
  error?: string;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

// 사용
const response: ApiResponse<Todo[]> = {
  status: 200,
  data: [
    { id: 1, title: 'Learn TypeScript', completed: false }
  ]
};
```

**학습 포인트:**
- 실무에서 자주 사용하는 타입 패턴
- 타입 별칭과 유니온의 조합
- 선택적 프로퍼티 활용
- 제네릭 기초 맛보기 (05-generics에서 상세히 다룸)

## 실습 가이드

### 1. 예제 파일 실행

```bash
# TypeScript 파일 직접 실행
npx ts-node 01-typescript-basics/01-basic-types.ts

# 또는 컴파일 후 실행
npx tsc 01-typescript-basics/01-basic-types.ts
node 01-typescript-basics/01-basic-types.js
```

### 2. 순서대로 학습

```bash
# 1. 기본 타입
npx ts-node 01-typescript-basics/01-basic-types.ts

# 2. 타입 추론
npx ts-node 01-typescript-basics/02-type-inference.ts

# 3. 타입 어노테이션
npx ts-node 01-typescript-basics/03-type-annotations.ts

# ... 계속
```

### 3. 타입 체크만 실행

```bash
# 컴파일 없이 타입만 체크
npx tsc --noEmit 01-typescript-basics/*.ts
```

## 핵심 정리

### TypeScript의 핵심 가치

```typescript
// ❌ JavaScript - 런타임 에러
function add(a, b) {
  return a + b;
}
add(1, '2');  // '12' - 의도하지 않은 문자열 연결

// ✅ TypeScript - 컴파일 타임 에러
function add(a: number, b: number): number {
  return a + b;
}
add(1, '2');  // ❌ 타입 에러! 컴파일 실패
```

### 기본 타입 체크리스트

- [x] `string`, `number`, `boolean` - 원시 타입
- [x] `null`, `undefined` - 값이 없음
- [x] `void` - 반환값 없음
- [x] `never` - 절대 반환하지 않음
- [x] `any` - 모든 타입 허용 (피하기)
- [x] `unknown` - 안전한 any (권장)

### 타입 정의 방법

```typescript
// 1. 인라인 타입
let user: { name: string; age: number };

// 2. 타입 별칭
type User = { name: string; age: number };

// 3. 인터페이스 (다음 챕터)
interface User {
  name: string;
  age: number;
}
```

### 자주 사용하는 패턴

**1. 리터럴 타입 유니온 (enum 대안):**
```typescript
type Status = 'pending' | 'success' | 'error';
```

**2. 선택적 프로퍼티:**
```typescript
type User = {
  name: string;
  email?: string;  // 있을 수도, 없을 수도
};
```

**3. 읽기 전용:**
```typescript
type Config = {
  readonly apiUrl: string;
};
```

**4. 유니온 타입:**
```typescript
type ID = string | number;
```

## 다음 단계

01-typescript-basics를 완료했다면:
- **[02-functions-types](../02-functions-types/)** - 함수 타입 시그니처, 오버로드 학습

## 참고 자료

- [TypeScript Handbook - Basic Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Deep Dive - Types](https://basarat.gitbook.io/typescript/type-system)
