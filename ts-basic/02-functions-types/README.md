# 02. 함수 타입 (Function Types)

TypeScript에서 함수는 일급 객체입니다. 함수의 매개변수와 반환값에 타입을 지정하여 타입 안전성을 확보하는 방법을 학습합니다.

## 학습 목표

- 함수 타입 시그니처 작성 및 표기법 이해
- 다양한 매개변수 패턴 활용 (선택적, 기본값, 나머지)
- 함수 오버로드로 다형성 구현
- this 바인딩과 화살표 함수의 차이 이해
- 제네릭 함수로 범용성 확보
- async/await의 타입 처리
- 실전 함수 패턴 습득

## 목차

1. [01-function-basics.ts](#01-function-basicsts) - 기본 함수 타입
2. [02-optional-default-rest.ts](#02-optional-default-restts) - 매개변수 패턴
3. [03-function-overloads.ts](#03-function-overloadsts) - 함수 오버로드
4. [04-function-types.ts](#04-function-typests) - 함수 타입 별칭
5. [05-arrow-functions.ts](#05-arrow-functionsts) - 화살표 함수와 this
6. [06-callback-functions.ts](#06-callback-functionsts) - 콜백 함수
7. [07-generic-functions.ts](#07-generic-functionsts) - 제네릭 함수
8. [08-async-functions.ts](#08-async-functionsts) - async/await
9. [09-practical-examples.ts](#09-practical-examplests) - 실전 예제

## 예제 파일 개요

### 01-function-basics.ts
**함수의 기본 타입 지정 방법**

- **함수 선언문, 표현식, 화살표 함수**: 세 가지 함수 정의 방식(`function`, `const f = function`, `const f = () =>`)에 각각 타입을 지정하는 방법과 차이점
- **매개변수 타입 어노테이션**: 함수 매개변수에 타입을 명시하는 방법 (TypeScript에서 필수)
- **반환 타입 명시**: 함수가 반환하는 값의 타입 지정, `void` (반환값 없음), `never` (절대 반환하지 않음) 등 특수 타입 포함
- **익명 함수와 타입 추론**: 콜백이나 즉시 실행 함수에서 문맥적 타입 추론이 동작하는 방식

### 02-optional-default-rest.ts
**다양한 매개변수 패턴**

- **선택적 매개변수 (`?`)**: 생략 가능한 매개변수를 `?` 연산자로 정의, 필수 매개변수 뒤에 위치해야 함
- **기본 매개변수**: 기본값이 있는 매개변수는 타입이 자동 추론됨, ES6 기본 매개변수와 동일한 문법
- **나머지 매개변수 (`...`)**: 가변 인자를 배열로 수집, `...args: type[]` 형태로 타입 지정
- **매개변수 순서 규칙**: 필수 → 선택적 → 기본값 → 나머지 순서로 배치해야 하는 이유와 예외 케이스

### 03-function-overloads.ts
**함수 오버로드로 다형성 구현**

- **오버로드 시그니처 작성**: 여러 호출 시그니처를 정의하여 입력에 따라 다른 반환 타입을 제공
- **구현 시그니처**: 실제 함수 로직을 담은 시그니처, 외부에 노출되지 않으며 모든 오버로드를 포함해야 함
- **오버로드 순서 규칙**: 가장 구체적인 시그니처를 위에, 넓은 시그니처를 아래에 배치해야 하는 이유
- **오버로드 vs 유니온 타입**: 언제 오버로드를 사용하고, 언제 간단한 유니온 타입으로 충분한지 판단 기준

### 04-function-types.ts
**함수 타입 별칭과 고차 함수**

- **함수 타입 별칭**: `type MathOp = (a: number, b: number) => number` 형태로 재사용 가능한 함수 타입 정의
- **고차 함수 (Higher-Order Functions)**: 함수를 매개변수로 받거나 함수를 반환하는 함수의 타입 지정
- **함수 타입 재사용**: 타입 별칭으로 콜백, 이벤트 핸들러 등 반복되는 함수 시그니처를 재사용

### 05-arrow-functions.ts
**화살표 함수와 this 바인딩**

- **일반 함수 vs 화살표 함수**: 두 함수의 `this` 바인딩 메커니즘 차이 (동적 vs 렉시컬)
- **this 바인딩 차이**: 일반 함수는 호출 시점에 `this` 결정, 화살표 함수는 선언 위치의 `this` 캡처
- **this 타입 명시**: `function f(this: Type)` 문법으로 함수 내부에서 사용할 `this`의 타입을 보장
- **클래스 메서드에서 this**: 클래스 메서드를 일반 함수로 정의할지, 화살표 함수 필드로 정의할지 선택 기준

### 06-callback-functions.ts
**콜백 함수의 타입 정의**

- **콜백 함수 타입 정의**: 비동기 작업, 배열 메서드 등에서 사용되는 콜백 함수의 타입 시그니처 작성
- **에러 우선 콜백 (Error-First Callback)**: Node.js 스타일의 `(err, result) => void` 패턴 타입 지정
- **배열 메서드 콜백**: `map`, `filter`, `reduce` 등 배열 메서드의 콜백 타입 (매개변수: item, index, array)
- **이벤트 핸들러**: DOM 이벤트 핸들러, 커스텀 이벤트 리스너의 타입 정의

### 07-generic-functions.ts
**제네릭으로 범용 함수 작성**

- **제네릭 타입 매개변수**: `<T>` 문법으로 타입을 변수처럼 사용하여 범용적인 함수 작성
- **타입 추론**: 제네릭 함수 호출 시 타입 매개변수를 명시하거나, TypeScript가 자동으로 추론하도록 할 수 있음
- **제약 조건 (extends)**: `<T extends Type>` 문법으로 제네릭 타입의 범위를 제한하여 특정 프로퍼티/메서드 사용 보장
- **여러 제네릭 매개변수**: `<T, U>`, `<T, K extends keyof T>` 등 여러 타입 매개변수를 사용하는 복잡한 제네릭 함수

### 08-async-functions.ts
**비동기 함수의 타입 처리**

- **async 함수 반환 타입**: `async` 함수는 항상 `Promise<T>`를 반환, 직접 `T`를 반환해도 자동으로 래핑됨
- **await 타입 처리**: `await` 키워드로 Promise를 언래핑, 반환값이 `Promise<T>`에서 `T`로 좁혀지는 과정
- **에러 처리 패턴**: try/catch에서 `unknown` 타입인 error를 안전하게 처리하는 방법, 타입 가드 활용
- **Promise 타입 유틸리티**: `Awaited<T>`, `Promise.all`, `Promise.race` 등의 타입 처리

### 09-practical-examples.ts
**실전에서 자주 사용하는 함수 패턴**

- **API 클라이언트**: 타입 안전한 HTTP 요청 함수, 제네릭과 오버로드를 활용한 REST API 클라이언트 구현
- **디바운스/쓰로틀**: 함수 실행을 지연/제한하는 유틸리티, 제네릭과 `Parameters<T>`, `ReturnType<T>` 활용
- **파이프/컴포즈**: 여러 함수를 조합하는 함수형 프로그래밍 패턴, 타입 안전성을 유지하는 방법
- **메모이제이션**: 함수 결과를 캐싱하는 최적화 기법, 제네릭으로 모든 함수에 적용 가능하도록 구현

## 핵심 개념

### 1. 함수 타입 표기법

| 표기법 | 설명 | 사용 위치 |
|--------|------|-----------|
| `(a: type) => type` | 화살표 표기법 | 타입 별칭, 인라인 타입 |
| `function(a: type): type` | 함수 선언 표기법 | 함수 선언문 |
| `{ (a: type): type }` | 객체 메서드 표기법 | 인터페이스, 타입 |

### 2. 매개변수 종류

| 종류 | 문법 | 특징 | 예시 |
|------|------|------|------|
| **필수 매개변수** | `param: type` | 반드시 전달 필요 | `function f(a: number)` |
| **선택적 매개변수** | `param?: type` | 생략 가능, 필수 매개변수 뒤에 | `function f(a: number, b?: string)` |
| **기본 매개변수** | `param = value` | 기본값 제공, 타입 추론됨 | `function f(a = 10)` |
| **나머지 매개변수** | `...params: type[]` | 가변 인자, 배열로 수집 | `function f(...nums: number[])` |

### 3. 반환 타입

| 타입 | 의미 | 사용 시기 |
|------|------|-----------|
| `void` | 반환값 없음 | 로그 출력, 상태 변경 등 |
| `never` | 절대 반환하지 않음 | 항상 예외 발생, 무한 루프 |
| `Promise<T>` | 비동기 반환 | async 함수 |
| 구체적 타입 | 특정 타입 반환 | 대부분의 함수 |

### 4. 함수 오버로드 규칙

| 규칙 | 설명 |
|------|------|
| **오버로드 시그니처** | 외부에 노출되는 타입 (구현 없음) |
| **구현 시그니처** | 실제 구현 (외부에 노출 안 됨) |
| **순서** | 구체적인 시그니처를 위에, 넓은 시그니처를 아래 |
| **구현 타입** | 모든 오버로드를 포함할 수 있는 타입 |

### 5. this 타입

| 함수 종류 | this 바인딩 | 사용 시기 |
|-----------|-------------|-----------|
| **일반 함수** | 동적 바인딩 (호출 시 결정) | 메서드, 생성자 |
| **화살표 함수** | 렉시컬 바인딩 (선언 위치) | 콜백, 클래스 필드 |
| **this 명시** | `this: Type` 매개변수 | this 타입 보장 필요 시 |

### 6. 제네릭 함수

| 개념 | 문법 | 설명 |
|------|------|------|
| **타입 매개변수** | `<T>` | 타입을 변수처럼 사용 |
| **타입 추론** | 자동 추론 | 호출 시 타입 자동 결정 |
| **제약 조건** | `<T extends Type>` | 타입 범위 제한 |
| **여러 매개변수** | `<T, U>` | 여러 타입 동시 사용 |
| **keyof** | `<K extends keyof T>` | 객체 키 타입으로 제한 |

### 7. async/await 타입

| 항목 | 타입 | 설명 |
|------|------|------|
| **async 함수** | `Promise<T>` | 항상 Promise 반환 |
| **await 결과** | `T` | Promise가 언래핑됨 |
| **에러 타입** | `unknown` | catch 블록의 error |

## 함수 타입 작성 가이드

### 매개변수 타입 지정 (필수)

```typescript
✅ function greet(name: string) { }
❌ function greet(name) { }  // any 추론
```

### 반환 타입 명시 (권장: 공개 API)

```typescript
✅ export function calculate(x: number): number { }
✅ function helper(x: number) { return x * 2; }  // 내부 함수는 추론 허용
```

### 선택적 매개변수 순서

```typescript
❌ function wrong(a?: string, b: number) { }
✅ function correct(b: number, a?: string) { }
```

### 함수 오버로드 사용 판단

```typescript
// 오버로드 필요: 입력에 따라 반환 타입이 다름
✅ function parse(x: string): string[];
✅ function parse(x: number): number[];

// 유니온으로 충분: 반환 타입이 동일
✅ function print(value: string | number): void { }
```

### 제네릭 vs any

```typescript
✅ function first<T>(arr: T[]): T | undefined { }  // 타입 안전
❌ function first(arr: any[]): any { }  // 타입 안전성 상실
```

## 실습 가이드

```bash
# 순서대로 학습
npx ts-node 02-functions-types/01-function-basics.ts
npx ts-node 02-functions-types/02-optional-default-rest.ts
npx ts-node 02-functions-types/03-function-overloads.ts
npx ts-node 02-functions-types/04-function-types.ts
npx ts-node 02-functions-types/05-arrow-functions.ts
npx ts-node 02-functions-types/06-callback-functions.ts
npx ts-node 02-functions-types/07-generic-functions.ts
npx ts-node 02-functions-types/08-async-functions.ts
npx ts-node 02-functions-types/09-practical-examples.ts

# 타입 체크
npx tsc --noEmit 02-functions-types/*.ts
```

## 자주 하는 실수

### 1. 선택적 매개변수 위치
❌ 선택적 매개변수가 필수 매개변수보다 앞에
✅ 필수 → 선택적 → 기본값 → 나머지 순서

### 2. 오버로드 시그니처 순서
❌ 넓은 타입이 위에 있으면 구체적 타입이 무시됨
✅ 구체적인 타입부터 나열

### 3. 화살표 함수의 this
❌ 객체 메서드를 화살표 함수로 정의 → this가 상위 컨텍스트
✅ 일반 함수 메서드로 정의

### 4. async 함수 반환 타입
❌ `async function f(): User`
✅ `async function f(): Promise<User>`

### 5. 제네릭 제약 없이 사용
❌ `function f<T>(obj: T) { return obj.length; }`  // length 없을 수 있음
✅ `function f<T extends { length: number }>(obj: T) { return obj.length; }`

## 성능 및 최적화

### 함수 오버로드 vs 유니온
- **오버로드**: 타입이 복잡하거나 반환 타입이 입력에 의존
- **유니온**: 간단한 경우, 컴파일 시간 단축

### 제네릭 사용 시기
- 타입이 함수 내에서 일관되게 사용될 때
- 타입 안전성과 재사용성이 모두 필요할 때

### this 바인딩 성능
- 화살표 함수는 렉시컬 바인딩 → 약간 더 빠름
- 일반 함수는 호출 시마다 this 결정 → 유연함

## 다음 단계

02-functions-types를 완료했다면:
- **[03-classes-interfaces](../03-classes-interfaces/)** - 클래스와 인터페이스
- **[05-generics](../05-generics/)** - 제네릭 심화 학습

## 참고 자료

- [TypeScript Handbook - Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [TypeScript Deep Dive - Functions](https://basarat.gitbook.io/typescript/type-system/functions)
- [TypeScript - Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
