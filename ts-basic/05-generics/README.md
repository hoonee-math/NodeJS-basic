# 05. 제네릭 (Generics)

제네릭은 **재사용 가능한 컴포넌트**를 만드는 TypeScript의 핵심 기능입니다. 타입을 매개변수화하여 하나의 코드로 다양한 타입을 처리할 수 있습니다.

## 학습 목표

- **제네릭 함수/클래스/인터페이스**로 재사용성 높이기
- **제약 조건 (constraints)**으로 타입 안전성 확보
- **조건부 타입 (conditional types)** 마스터
- **infer 키워드**로 타입 추출하기
- **커스텀 유틸리티 타입** 만들기

## 목차

### 제네릭 기초
- [01-generic-functions.ts](#01-generic-functionsts) - 제네릭 함수 기초, any vs 제네릭, 타입 추론
- [02-generic-constraints.ts](#02-generic-constraintsts) - 제약 조건 (extends), keyof, 생성자 타입
- [03-generic-classes.ts](#03-generic-classests) - 제네릭 클래스, Stack, Queue, LinkedList
- [04-generic-interfaces.ts](#04-generic-interfacests) - 제네릭 인터페이스, Repository, Observable 패턴

### 고급 제네릭
- [05-multiple-type-parameters.ts](#05-multiple-type-parametersts) - 다중 타입 매개변수, 다중 제네릭, Either 패턴, 함수 합성
- [06-conditional-types.ts](#06-conditional-typests) - 조건부 타입 고급, 분배 법칙, 재귀, 내장 유틸리티
- [07-infer-keyword.ts](#07-infer-keywordts) - infer로 타입 추출, ReturnType, Parameters, Awaited

### 실전 응용
- [08-utility-type-creation.ts](#08-utility-type-creationts) - 커스텀 유틸리티 타입, DeepReadonly, PickByType
- [09-practical-examples.ts](#09-practical-examplests) - 실전 패턴 (Repository, Service, HTTP Client, Cache 등)

## 예제 파일 개요

### 01-generic-functions.ts
**제네릭 함수 기초**

- 기본 제네릭 함수 (`<T>`)
- 타입 매개변수 명명 규칙 (T, U, V, K 등)
- 제네릭 화살표 함수
- 타입 추론 vs 명시적 타입 지정
- 제네릭 배열 함수 (map, filter, reduce)
- 다중 반환 타입
- 제네릭 콜백 함수

### 02-generic-constraints.ts
**제약 조건으로 타입 제한**

- extends 키워드 (`T extends Type`)
- 인터페이스 제약 조건
- keyof 제약 조건 (`K extends keyof T`)
- 다중 제약 조건
- 제네릭 함수에서 프로퍼티 접근
- 생성자 타입 제약 (`new () => T`)
- 실무 패턴 (Repository, Validator)

### 03-generic-classes.ts
**제네릭 클래스**

- 기본 제네릭 클래스
- 제네릭 프로퍼티와 메서드
- 제약 조건이 있는 제네릭 클래스
- 제네릭 상속
- static 멤버와 제네릭
- 제네릭 클래스 인스턴스 타입
- 실전 패턴 (Stack, Queue, LinkedList)

### 04-generic-interfaces.ts
**제네릭 인터페이스**

- 기본 제네릭 인터페이스
- 제네릭 함수 시그니처
- 제네릭 인덱스 시그니처
- 제네릭 인터페이스 확장
- 제네릭 + 인터섹션 타입
- API 응답 인터페이스
- 제네릭 이벤트 핸들러

### 05-multiple-type-parameters.ts
**다중 타입 매개변수**

- 두 개 이상의 타입 매개변수 (`<T, U>`)
- 타입 매개변수 간의 관계
- 기본 타입 매개변수 (`<T = string>`)
- 부분 타입 추론
- 튜플과 다중 제네릭
- Swap, Pair, Map 패턴
- 제네릭 함수 합성

### 06-conditional-types.ts
**조건부 타입 고급**

- 기본 조건부 타입 (`T extends U ? X : Y`)
- 분배 법칙 (Distributive Conditional Types)
- 중첩 조건부 타입
- 조건부 타입과 never
- 내장 조건부 타입 (Exclude, Extract, NonNullable, ReturnType, Parameters)
- 재귀 조건부 타입
- 조건부 타입으로 유니온 필터링

### 07-infer-keyword.ts
**infer로 타입 추출**

- infer 키워드 기초
- 함수 반환 타입 추출 (`infer R`)
- 함수 매개변수 타입 추출
- 배열 요소 타입 추출
- Promise 타입 추출 (`Awaited<T>`)
- 중첩 타입 추출
- 튜플에서 첫/마지막 요소 추출
- 실전 패턴 (API 응답 타입 추출)

### 08-utility-type-creation.ts
**커스텀 유틸리티 타입 만들기**

- DeepReadonly - 깊은 불변성
- DeepPartial - 깊은 선택적 프로퍼티
- RequiredKeys, OptionalKeys - 키 추출
- Mutable - readonly 제거
- NonNullableProperties - null/undefined 제거
- PickByType - 타입으로 프로퍼티 선택
- FunctionKeys - 함수 프로퍼티만 추출
- Promisify - 함수를 Promise 반환으로 변환

### 09-practical-examples.ts
**실전 제네릭 패턴**

- 제네릭 Repository 패턴
- 제네릭 Service Layer
- 제네릭 HTTP Client
- 제네릭 State Management
- 제네릭 Form Validation
- 제네릭 Event Emitter
- 제네릭 Cache
- 제네릭 Builder 패턴

## 핵심 개념 요약

### 제네릭 기본 문법

| 종류 | 문법 | 예시 |
|------|------|------|
| **함수** | `function fn<T>(arg: T): T` | `identity<string>('hello')` |
| **클래스** | `class Box<T> { value: T }` | `new Box<number>(42)` |
| **인터페이스** | `interface Box<T> { value: T }` | `const box: Box<string>` |
| **타입 별칭** | `type Box<T> = { value: T }` | `type StringBox = Box<string>` |

### 제약 조건 (Constraints)

| 제약 조건 | 문법 | 의미 | 활용 |
|-----------|------|------|------|
| **기본 제약** | `T extends Type` | T는 Type의 서브타입 | 특정 프로퍼티 보장 |
| **keyof 제약** | `K extends keyof T` | K는 T의 키 | 객체 키 안전 접근 |
| **다중 제약** | `T extends A & B` | T는 A와 B 모두 만족 | 여러 조건 동시 적용 |
| **생성자 제약** | `T extends new () => any` | T는 생성 가능한 타입 | 팩토리 패턴 |

### 조건부 타입

| 패턴 | 문법 | 설명 |
|------|------|------|
| **기본** | `T extends U ? X : Y` | T가 U를 만족하면 X, 아니면 Y |
| **분배** | `T extends U ? X : Y` (T가 유니온일 때) | 유니온의 각 멤버에 적용 |
| **infer** | `T extends (infer R)[] ? R : never` | 타입에서 일부 추출 |
| **재귀** | `T extends object ? { [K in keyof T]: Deep<T[K]> } : T` | 깊은 타입 변환 |

### infer 키워드 패턴

| 추출 대상 | 패턴 | 결과 |
|-----------|------|------|
| **함수 반환 타입** | `T extends (...args: any[]) => infer R` | `R` |
| **함수 매개변수** | `T extends (arg: infer P) => any` | `P` |
| **배열 요소** | `T extends (infer U)[]` | `U` |
| **Promise 값** | `T extends Promise<infer U>` | `U` |
| **튜플 첫 요소** | `T extends [infer First, ...any[]]` | `First` |

## 언제 무엇을 쓸까?

| 상황 | 선택 | 이유 |
|------|------|------|
| 같은 타입 반환 | 제네릭 함수 | 타입 안전성 + 재사용 |
| 컬렉션 클래스 | 제네릭 클래스 | Array, Set처럼 범용적 |
| 타입 제한 필요 | extends 제약 | 특정 프로퍼티 보장 |
| 객체 키 접근 | keyof 제약 | 런타임 에러 방지 |
| 타입 분기 | 조건부 타입 | 동적 타입 결정 |
| 타입 추출 | infer 키워드 | 타입에서 정보 꺼내기 |

## 자주 하는 실수

### 1. 제네릭 없이 any 사용
❌ `function identity(arg: any): any { return arg; }`
✅ `function identity<T>(arg: T): T { return arg; }`

### 2. 불필요한 제네릭
❌ `function log<T>(message: T): void { console.log(message); }`
✅ `function log(message: string): void { console.log(message); }`

### 3. 제약 조건 없이 프로퍼티 접근
❌ `function getLength<T>(arg: T) { return arg.length; }` // 에러
✅ `function getLength<T extends { length: number }>(arg: T) { return arg.length; }`

### 4. 타입 추론에만 의존
❌ `const result = useState()` // 타입 불명확
✅ `const result = useState<number>(0)` // 명시적 타입

### 5. 조건부 타입에서 분배 법칙 오해
❌ `type Filter<T> = T extends string ? T : never;` 유니온 각각에 적용됨
✅ 분배를 막으려면 `[T] extends [string]` 사용

## Best Practices

**✅ 의미 있는 타입 매개변수 이름 사용**
```typescript
// ❌ 단순 T만
function merge<T, U>(a: T, b: U) { }

// ✅ 의미 있는 이름
function merge<TFirst, TSecond>(first: TFirst, second: TSecond) { }
```

**✅ 제약 조건으로 타입 안전성 확보**
```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];  // 안전
}
```

**✅ 기본 타입 매개변수 활용**
```typescript
function createArray<T = string>(length: number, value: T): T[] {
  return Array(length).fill(value);
}

createArray(3, 'x');  // string[] 추론
createArray<number>(3, 0);  // number[] 명시
```

**✅ 조건부 타입으로 유연한 API**
```typescript
type ApiResponse<T, TError = Error> =
  | { success: true; data: T }
  | { success: false; error: TError };
```

**✅ infer로 타입 추출 자동화**
```typescript
type Awaited<T> = T extends Promise<infer U> ? U : T;
type Result = Awaited<Promise<string>>;  // string
```

## 제네릭 vs any 비교

```typescript
// ❌ any: 타입 정보 손실
function badIdentity(arg: any): any {
  return arg;
}
const result1 = badIdentity("hello");  // any 타입

// ✅ 제네릭: 타입 정보 유지
function goodIdentity<T>(arg: T): T {
  return arg;
}
const result2 = goodIdentity("hello");  // string 타입
```

## 다음 단계

이 모듈을 완료했다면:
- **[06-utility-types](../06-utility-types/)** - 내장 유틸리티 타입 완전 정복
- **[07-tsconfig-deep-dive](../07-tsconfig-deep-dive/)** - tsconfig.json 설정 마스터

## 참고 자료

### 공식 문서
- [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Type Inference in Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)

### 추가 학습
- [Type Challenges](https://github.com/type-challenges/type-challenges) - 제네릭 연습 문제
- [Utility Types 소스 코드](https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts) - 내장 유틸리티 타입 구현 참고

---

**시작하기:** [01-generic-functions.ts](./01-generic-functions.ts)
