# 02. 함수 타입 (Function Types)

TypeScript에서 함수는 일급 객체입니다. 함수의 매개변수와 반환값에 타입을 지정하여 타입 안전성을 확보하는 방법을 학습합니다.

## 학습 목표

- 함수 타입 시그니처 작성
- 선택적/기본/나머지 매개변수 활용
- 함수 오버로드로 다형성 구현
- 함수 타입 별칭으로 재사용성 향상
- 화살표 함수와 this 바인딩
- 콜백 함수 타입 정의
- 제네릭 함수로 범용성 확보
- async/await 타입 처리
- 실전 함수 패턴

## 목차

1. [01-function-basics.ts](#01-function-basicsts) - 기본 함수 타입
2. [02-optional-default-rest.ts](#02-optional-default-restts) - 선택적/기본/나머지 매개변수
3. [03-function-overloads.ts](#03-function-overloadsts) - 함수 오버로드
4. [04-function-types.ts](#04-function-typests) - 함수 타입 별칭
5. [05-arrow-functions.ts](#05-arrow-functionsts) - 화살표 함수와 this
6. [06-callback-functions.ts](#06-callback-functionsts) - 콜백 함수 타입
7. [07-generic-functions.ts](#07-generic-functionsts) - 제네릭 함수
8. [08-async-functions.ts](#08-async-functionsts) - async/await 타입
9. [09-practical-examples.ts](#09-practical-examplests) - 실전 예제

## 예제 파일 상세

### 01-function-basics.ts

함수의 기본 타입 지정 방법을 학습합니다.

**주요 내용:**
```typescript
// 기본 함수 타입
function add(a: number, b: number): number {
  return a + b;
}

// 함수 표현식
const multiply = function(a: number, b: number): number {
  return a * b;
};

// 화살표 함수
const subtract = (a: number, b: number): number => a - b;

// void 반환
function log(message: string): void {
  console.log(message);
}

// never 반환
function throwError(message: string): never {
  throw new Error(message);
}
```

**학습 포인트:**
- 매개변수 타입 (필수)
- 반환 타입 (권장)
- 함수 선언문 vs 표현식 vs 화살표 함수
- void vs never 구분

### 02-optional-default-rest.ts

다양한 매개변수 패턴을 학습합니다.

**선택적 매개변수:**
```typescript
// ? 연산자로 선택적 매개변수
function buildName(firstName: string, lastName?: string): string {
  return lastName ? `${firstName} ${lastName}` : firstName;
}

buildName('John');           // OK
buildName('John', 'Doe');    // OK
```

**기본 매개변수:**
```typescript
// 기본값이 있으면 타입 추론됨
function greet(name: string, greeting = 'Hello'): string {
  return `${greeting}, ${name}`;
}

greet('Alice');              // 'Hello, Alice'
greet('Bob', 'Hi');          // 'Hi, Bob'
```

**나머지 매개변수:**
```typescript
// ... 연산자로 가변 인자
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4, 5);         // 15
```

**학습 포인트:**
- 선택적 매개변수는 필수 매개변수 뒤에
- 기본 매개변수는 타입 추론됨
- 나머지 매개변수는 배열 타입

### 03-function-overloads.ts

함수 오버로드로 다형성을 구현합니다.

**핵심 개념:**
```typescript
// 오버로드 시그니처
function parse(value: string): string[];
function parse(value: number): number[];

// 구현 시그니처
function parse(value: string | number): string[] | number[] {
  if (typeof value === 'string') {
    return value.split('');
  } else {
    return String(value).split('').map(Number);
  }
}

parse('hello');   // string[]
parse(12345);     // number[]
```

**학습 포인트:**
- 오버로드 시그니처 vs 구현 시그니처
- 구현 시그니처는 외부에 노출 안 됨
- 가장 구체적인 시그니처를 위에 작성
- 언제 오버로드를 쓸까?

### 04-function-types.ts

함수 타입을 별칭으로 정의하여 재사용합니다.

**핵심 개념:**
```typescript
// 함수 타입 별칭
type MathOperation = (a: number, b: number) => number;
type Predicate<T> = (value: T) => boolean;
type Callback = () => void;

const add: MathOperation = (a, b) => a + b;
const isEven: Predicate<number> = (n) => n % 2 === 0;

// 함수를 받는 함수
function calculate(op: MathOperation, a: number, b: number): number {
  return op(a, b);
}
```

**학습 포인트:**
- 함수 타입 별칭으로 재사용성 향상
- 고차 함수 (함수를 받거나 반환하는 함수)
- 함수 타입 시그니처 표기법

### 05-arrow-functions.ts

화살표 함수와 this 바인딩을 학습합니다.

**핵심 개념:**
```typescript
// this 타입 명시
interface User {
  name: string;
  greet(this: User): void;
}

const user: User = {
  name: 'John',
  greet() {
    console.log(`Hello, ${this.name}`);
  }
};

// 화살표 함수는 this를 캡처
class Counter {
  count = 0;

  // 일반 메서드 - this 동적 바인딩
  increment() {
    this.count++;
  }

  // 화살표 함수 - this 렉시컬 바인딩
  incrementArrow = () => {
    this.count++;
  }
}
```

**학습 포인트:**
- 일반 함수 vs 화살표 함수의 this
- this 타입 명시
- 클래스 메서드에서 this 활용

### 06-callback-functions.ts

콜백 함수의 타입을 정의합니다.

**핵심 개념:**
```typescript
// 콜백 타입 정의
type Callback<T> = (value: T) => void;
type ErrorCallback = (error: Error | null, result?: any) => void;

function fetchData(url: string, callback: ErrorCallback): void {
  // 비동기 작업
  setTimeout(() => {
    callback(null, { data: 'result' });
  }, 1000);
}

// 배열 메서드 타입
function map<T, U>(
  array: T[],
  callback: (item: T, index: number, array: T[]) => U
): U[] {
  return array.map(callback);
}
```

**학습 포인트:**
- 콜백 함수 타입 패턴
- 에러 우선 콜백 (Node.js 스타일)
- 배열 메서드 콜백 타입
- 이벤트 핸들러 타입

### 07-generic-functions.ts

제네릭으로 범용적인 함수를 작성합니다.

**핵심 개념:**
```typescript
// 제네릭 함수
function identity<T>(value: T): T {
  return value;
}

identity<string>('hello');   // string
identity<number>(42);        // number
identity('auto');            // 타입 추론

// 제약 조건이 있는 제네릭
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'John', age: 30 };
getProperty(user, 'name');   // string
getProperty(user, 'age');    // number
```

**학습 포인트:**
- 제네릭 타입 매개변수
- 타입 추론
- 제약 조건 (extends)
- 여러 제네릭 타입 매개변수
- 실전 활용 (배열, 객체 유틸리티)

### 08-async-functions.ts

async/await의 타입 처리를 학습합니다.

**핵심 개념:**
```typescript
// async 함수는 항상 Promise 반환
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// 에러 처리
async function safelyFetchUser(id: number): Promise<User | null> {
  try {
    return await fetchUser(id);
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Promise 타입 유틸리티
type Awaited<T> = T extends Promise<infer U> ? U : T;
```

**학습 포인트:**
- async 함수 반환 타입은 Promise
- await로 Promise 언래핑
- try/catch 에러 처리
- Promise 타입 유틸리티

### 09-practical-examples.ts

실전에서 자주 사용하는 함수 패턴입니다.

**예제 1: API 클라이언트**
```typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

async function request<T>(
  method: HttpMethod,
  url: string,
  data?: any
): Promise<T> {
  const response = await fetch(url, {
    method,
    body: data ? JSON.stringify(data) : undefined,
  });
  return response.json();
}
```

**예제 2: 파이프라인**
```typescript
function pipe<T>(...functions: Array<(arg: T) => T>) {
  return (value: T) => functions.reduce((acc, fn) => fn(acc), value);
}
```

**예제 3: 디바운스/쓰로틀**
```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
```

**학습 포인트:**
- 타입 안전한 API 클라이언트
- 함수 합성 (파이프/컴포즈)
- 디바운스/쓰로틀 구현
- 고차 함수 패턴

## 실습 가이드

### 1. 예제 파일 실행

```bash
# 기본 함수 타입
npx ts-node 02-functions-types/01-function-basics.ts

# 선택적/기본/나머지 매개변수
npx ts-node 02-functions-types/02-optional-default-rest.ts

# 함수 오버로드
npx ts-node 02-functions-types/03-function-overloads.ts

# ... 순서대로
```

### 2. 타입 체크

```bash
# 타입 체크만
npx tsc --noEmit 02-functions-types/*.ts
```

## 핵심 정리

### 함수 타입 기본

```typescript
// 매개변수와 반환 타입 명시
function add(a: number, b: number): number {
  return a + b;
}

// 함수 타입 별칭
type MathOp = (a: number, b: number) => number;
const multiply: MathOp = (a, b) => a * b;
```

### 매개변수 패턴

```typescript
// 선택적 매개변수
function f1(a: string, b?: number) { }

// 기본 매개변수
function f2(a: string, b = 42) { }

// 나머지 매개변수
function f3(...nums: number[]) { }
```

### 함수 오버로드

```typescript
function parse(x: string): string[];
function parse(x: number): number[];
function parse(x: string | number): string[] | number[] {
  // 구현
}
```

### 제네릭 함수

```typescript
function identity<T>(value: T): T {
  return value;
}

function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
```

### async/await

```typescript
async function fetchData(): Promise<Data> {
  const response = await fetch('/api/data');
  return response.json();
}
```

## Best Practices

1. **매개변수 타입 필수 지정**
   ```typescript
   // ✅ 좋음
   function greet(name: string): string { }

   // ❌ 나쁨
   function greet(name): string { }  // any 추론
   ```

2. **반환 타입 명시 (공개 API)**
   ```typescript
   // ✅ 공개 함수는 반환 타입 명시
   export function calculate(x: number): number { }

   // ✅ 내부 함수는 추론 허용
   function helper(x: number) { return x * 2; }
   ```

3. **함수 오버로드는 꼭 필요할 때만**
   ```typescript
   // ✅ 오버로드가 필요한 경우
   function format(date: Date): string;
   function format(timestamp: number): string;

   // ✅ 유니온으로 충분한 경우
   function print(value: string | number): void { }
   ```

4. **제네릭으로 재사용성**
   ```typescript
   // ✅ 제네릭 사용
   function first<T>(arr: T[]): T | undefined {
     return arr[0];
   }

   // ❌ any 사용
   function first(arr: any[]): any {
     return arr[0];
   }
   ```

5. **콜백은 타입 별칭**
   ```typescript
   // ✅ 타입 별칭으로 재사용
   type Callback<T> = (value: T) => void;

   function process(callback: Callback<string>) { }
   ```

## 자주 하는 실수

### 1. 선택적 매개변수 순서

```typescript
// ❌ 에러: 선택적 매개변수는 뒤에
function wrong(a?: string, b: number) { }

// ✅ 올바름
function correct(b: number, a?: string) { }
```

### 2. 오버로드 순서

```typescript
// ❌ 나쁨: 넓은 타입이 위에
function parse(x: string | number): any;
function parse(x: string): string[];

// ✅ 좋음: 구체적인 타입이 위에
function parse(x: string): string[];
function parse(x: number): number[];
function parse(x: string | number): any;
```

### 3. this 타입

```typescript
// ❌ 화살표 함수에서 this 사용
const obj = {
  name: 'John',
  greet: () => {
    console.log(this.name);  // undefined!
  }
};

// ✅ 일반 함수 사용
const obj = {
  name: 'John',
  greet() {
    console.log(this.name);  // 'John'
  }
};
```

## 다음 단계

02-functions-types를 완료했다면:
- **[03-classes-interfaces](../03-classes-interfaces/)** - 클래스와 인터페이스 학습

## 참고 자료

- [TypeScript Handbook - Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TypeScript Deep Dive - Functions](https://basarat.gitbook.io/typescript/type-system/functions)
