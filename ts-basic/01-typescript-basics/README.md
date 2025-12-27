# 01. TypeScript 기초

TypeScript의 핵심인 **타입 시스템**의 기본을 학습합니다. JavaScript에 타입을 더하면 어떤 장점이 있는지, 기본 타입들은 어떻게 사용하는지 단계별로 익혀봅니다.

## 학습 목표

- TypeScript의 기본 타입 시스템 완전 이해
- 타입 추론과 타입 어노테이션 구분 및 활용
- 배열, 튜플, 객체 타입 마스터
- 타입 별칭으로 재사용 가능한 타입 정의
- any vs unknown - 언제 무엇을 써야 할까?
- 유니온/인터섹션 타입 기초
- 실전에서 자주 사용하는 타입 패턴

## 목차

1. [01-basic-types.ts](#01-basic-typests) - 기본 타입들
2. [02-type-inference.ts](#02-type-inferencets) - 타입 추론
3. [03-type-annotations.ts](#03-type-annotationsts) - 타입 어노테이션
4. [04-arrays-tuples.ts](#04-arrays-tuplests) - 배열과 튜플
5. [05-objects.ts](#05-objectsts) - 객체 타입
6. [06-type-alias.ts](#06-type-aliasts) - 타입 별칭
7. [07-union-intersection.ts](#07-union-intersectionts) - 유니온과 인터섹션
8. [08-any-unknown.ts](#08-any-unknownts) - any vs unknown
9. [09-practical-examples.ts](#09-practical-examplests) - 실전 예제

## 예제 파일 개요

### 01-basic-types.ts
**TypeScript 기본 타입 시스템**

- **원시 타입**: `string`, `number`, `boolean` - JavaScript의 기본 타입을 TypeScript로 표현
- **null과 undefined**: 값이 없음을 나타내는 두 타입의 차이와 `strictNullChecks` 옵션에 따른 처리 방법
- **void**: 반환값이 없는 함수에 사용, `console.log`처럼 부수 효과만 있는 함수
- **never**: 절대 반환하지 않는 함수 (항상 예외를 던지거나 무한 루프), 타입 시스템에서 "일어날 수 없음"을 표현
- **리터럴 타입**: 정확한 값(`'hello'`, `42`, `true`)으로 타입을 제한하여 더 엄격한 타입 체크
- **bigint와 symbol**: ES2020+ 타입인 큰 정수와 고유 식별자 타입

### 02-type-inference.ts
**타입 추론 - TypeScript의 자동 타입 결정**

- **기본 타입 추론**: 초기값을 기반으로 변수 타입이 자동으로 결정되는 방식 (`let x = 10` → `number`)
- **함수 반환 타입 추론**: 함수 본문의 `return` 문을 분석하여 반환 타입 자동 추론
- **배열과 객체 타입 추론**: 배열 요소나 객체 프로퍼티를 보고 전체 구조의 타입 결정
- **Best Type (최적 공통 타입)**: 여러 타입이 섞인 배열에서 가장 적합한 공통 타입 선택 (`[0, 1, null]` → `(number | null)[]`)
- **문맥적 타입 추론 (Contextual Typing)**: 코드의 위치를 기반으로 타입 추론 (이벤트 핸들러의 `event` 매개변수 등)
- **const vs let**: `const`는 리터럴 타입으로, `let`은 넓은 타입으로 추론되는 차이
- **타입 추론 vs 명시**: 언제 타입 추론에 맡기고, 언제 명시적으로 타입을 지정해야 하는지 판단 기준

### 03-type-annotations.ts
**타입 어노테이션 - 명시적 타입 지정**

- **변수 타입 어노테이션**: `: type` 문법으로 변수에 타입을 명시적으로 지정, 나중에 할당될 변수에 필수
- **함수 매개변수 타입**: TypeScript에서 함수 매개변수는 반드시 타입 지정 필요, `any` 추론 방지
- **함수 반환 타입**: 함수가 반환하는 값의 타입 명시, 공개 API에서는 필수, 내부 함수는 추론 허용
- **선택적 매개변수 (`?`)**: 생략 가능한 매개변수, 필수 매개변수 뒤에 위치, `undefined`를 허용하는 유니온 타입으로 변환됨
- **기본 매개변수**: ES6 기본 매개변수와 동일, 타입이 자동 추론되며 선택적 매개변수처럼 동작
- **나머지 매개변수 (`...`)**: 가변 인자를 배열로 수집, `...args: type[]` 형태로 타입 지정
- **유니온 타입 매개변수**: 여러 타입을 허용하는 매개변수 (`id: string | number`)
- **리터럴 타입 매개변수**: 정확한 값으로 제한된 매개변수 (`status: 'pending' | 'approved'`)

### 04-arrays-tuples.ts
**배열과 튜플 타입**

- **배열 타입 표기법**: `type[]`와 `Array<type>` 두 가지 문법, 동일한 의미이지만 일관성 유지 권장
- **다차원 배열**: 배열의 배열 (`number[][]`), 행렬이나 그리드 구조 표현
- **읽기 전용 배열 (`readonly`)**: `push`, `pop` 등 변경 메서드 사용 불가, 불변성 보장
- **튜플 (Tuple)**: 고정된 길이와 각 위치마다 정해진 타입의 배열, 함수 다중 반환값에 유용
- **구조 분해 할당**: 튜플의 각 요소를 개별 변수로 분리 (`let [name, age] = person`)
- **선택적 요소**: `[number, string?]` 형태로 튜플의 일부 요소를 선택적으로 지정
- **나머지 요소**: `[string, ...number[]]` 형태로 튜플의 나머지를 가변 길이로 처리
- **배열 vs 튜플 선택**: 같은 타입의 가변 길이는 배열, 다른 타입의 고정 길이는 튜플
- **as const**: 배열을 읽기 전용 튜플로 변환, 리터럴 타입 유지

### 05-objects.ts
**객체 타입 정의**

- **인라인 객체 타입**: `{ name: string; age: number }` 형태로 직접 타입 정의, 간단한 경우 유용
- **선택적 프로퍼티 (`?`)**: 있을 수도 없을 수도 있는 프로퍼티, `undefined`를 허용하는 유니온 타입
- **읽기 전용 프로퍼티 (`readonly`)**: 초기화 후 변경 불가, 설정 객체나 상수에 활용
- **인덱스 시그니처**: `[key: string]: type` 형태로 동적 프로퍼티 허용, 키를 미리 알 수 없을 때 사용
- **중첩 객체**: 객체 안에 객체, 복잡한 데이터 구조를 타입으로 표현
- **메서드 타입**: 객체의 메서드 타입 정의 (`add: (n: number) => void`)
- **객체 구조 분해와 타입**: 매개변수 구조 분해 시 타입 지정 방법
- **교집합 타입 (Intersection)**: `A & B` - 여러 타입을 결합하여 모든 프로퍼티를 포함하는 타입 생성
- **Readonly 유틸리티**: `Readonly<T>`로 모든 프로퍼티를 읽기 전용으로 만드는 유틸리티 타입

### 06-type-alias.ts
**타입 별칭으로 재사용성 향상**

- **기본 타입 별칭**: `type UserID = string | number` - 유니온 타입에 의미 있는 이름 부여
- **객체 타입 별칭**: 복잡한 객체 구조를 별칭으로 정의하여 재사용, 코드 가독성 향상
- **함수 타입 별칭**: `type MathOp = (a: number, b: number) => number` - 함수 시그니처를 재사용
- **배열/튜플 타입 별칭**: 배열이나 튜플 타입에 도메인 의미를 부여 (`type RGB = [number, number, number]`)
- **제네릭 타입 별칭**: `type Container<T> = { value: T }` - 타입 매개변수로 범용적인 타입 정의
- **중첩 타입 별칭**: 타입 별칭을 조합하여 복잡한 구조 표현
- **유니온 타입 별칭**: 여러 타입 중 하나를 표현, 리터럴 유니온으로 enum 대체 가능
- **교집합 타입 별칭**: 여러 타입을 결합, 믹스인 패턴 구현
- **API 응답 패턴**: `type ApiResponse<T> = { status: number; data: T }` - 실무에서 자주 사용하는 제네릭 패턴

### 07-union-intersection.ts
**유니온과 인터섹션 타입 기초**

- **유니온 타입 (`|`)**: "또는" 관계, 여러 타입 중 하나를 허용 (`string | number`)
- **리터럴 유니온**: 정확한 값들의 집합으로 타입 제한 (`'pending' | 'approved' | 'rejected'`), enum의 현대적 대안
- **타입 가드 (Type Guards)**: `typeof`, `in`, `instanceof` 등으로 유니온 타입을 좁혀서 안전하게 사용
- **타입 좁히기 (Narrowing)**: 조건문을 통해 TypeScript가 타입 범위를 자동으로 줄이는 메커니즘
- **인터섹션 타입 (`&`)**: "그리고" 관계, 여러 타입의 모든 프로퍼티를 포함 (`Person & Employee`)
- **유니온 vs 인터섹션**: 유니온은 "둘 중 하나", 인터섹션은 "둘 다 필요"
- **판별 유니온 (Discriminated Unions)**: 공통 프로퍼티(`kind`, `type` 등)로 타입 구분, 상태 머신 패턴에 유용
- **null/undefined 처리**: 유니온으로 nullable 타입 표현 후 타입 가드로 안전하게 처리
- **in 연산자**: 객체에 특정 프로퍼티가 있는지 확인하여 타입 좁히기

### 08-any-unknown.ts
**any vs unknown - 타입 안전성**

- **any의 특징**: 모든 타입 허용, 모든 연산 허용, 타입 체크 완전히 비활성화 - 타입 안전성 포기
- **any의 문제점**: 런타임 에러 가능성, IDE 자동완성 불가, 리팩토링 어려움, TypeScript 사용 의미 상실
- **unknown의 특징**: 모든 타입 허용하지만 사용 전 타입 체크 필수, 안전한 any
- **타입 가드 필수**: unknown은 `typeof`, `instanceof` 등으로 타입 좁힌 후에만 사용 가능
- **타입 단언 (Type Assertion)**: `as` 또는 `<type>` 문법으로 개발자가 타입을 확신할 때 사용, 남용 주의
- **사용자 정의 타입 가드**: `value is Type` 반환 타입으로 재사용 가능한 타입 체크 함수 작성
- **any 사용이 허용되는 경우**: 타입 정의 없는 외부 라이브러리, JSON 파싱, JS→TS 마이그레이션 중
- **unknown 사용 권장 사례**: 사용자 입력, API 응답 (검증 전), 에러 핸들링 (`catch` 블록의 `error`)
- **instanceof와 Array.isArray**: 클래스 인스턴스와 배열 체크로 unknown 안전하게 좁히기

### 09-practical-examples.ts
**실전 타입 패턴 종합**

- **사용자 관리 시스템**: 리터럴 유니온으로 역할(`UserRole`)과 상태 관리, 선택적 프로퍼티로 유연성 확보
- **API 응답 타입**: 제네릭 `ApiResponse<T>`로 재사용 가능한 응답 구조, 성공/에러 상태 표현
- **비동기 상태 관리**: 판별 유니온으로 `LoadingState | SuccessState | ErrorState` 패턴 구현
- **폼 검증**: 명확한 검증 결과 타입 정의, 타입 가드로 안전한 입력 처리
- **환경별 설정**: 리터럴 타입으로 환경 제한 (`'development' | 'staging' | 'production'`)
- **이벤트 시스템**: 판별 유니온으로 타입 안전한 이벤트 정의 및 처리
- **데이터 변환 (DTO ↔ Model)**: snake_case API와 camelCase 도메인 모델 간 변환 함수 타입 정의
- **타입 안전한 이벤트 에미터**: 제네릭과 `keyof`로 이벤트 타입 맵 중앙 관리
- **페이지네이션**: 제네릭으로 모든 데이터 타입에 적용 가능한 페이지네이션 유틸리티
- **에러 처리**: 사용자 정의 타입 가드로 다양한 에러 타입 안전하게 구분

## 핵심 개념

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

### 1. TypeScript 기본 타입

| 타입 | 설명 | 사용 예시 |
|------|------|-----------|
| `string` | 문자열 | `let name: string = 'John'` |
| `number` | 숫자 (정수, 실수) | `let age: number = 30` |
| `boolean` | 참/거짓 | `let isActive: boolean = true` |
| `null` | 명시적으로 값이 없음 | `let value: null = null` |
| `undefined` | 값이 할당되지 않음 | `let value: undefined` |
| `void` | 반환값 없는 함수 | `function log(): void { }` |
| `never` | 절대 반환하지 않음 | `function error(): never { throw new Error(); }` |
| `any` | 모든 타입 허용 (피하기) | `let value: any = anything` |
| `unknown` | 안전한 any (권장) | `let value: unknown = anything` |

### 2. 타입 추론 vs 타입 어노테이션

| 구분 | 타입 추론 | 타입 어노테이션 |
|------|-----------|----------------|
| **문법** | `let x = 10` | `let x: number = 10` |
| **장점** | 간결함, 코드 가독성 | 명확성, 의도 표현 |
| **사용 시기** | 간단한 변수, 로컬 변수 | 함수 매개변수, 공개 API, 나중에 할당될 변수 |
| **타입 결정** | 초기값 기반 자동 | 개발자가 명시 |

### 3. 배열 vs 튜플

| 구분 | 배열 | 튜플 |
|------|------|------|
| **길이** | 가변 | 고정 |
| **타입** | 모든 요소 동일 타입 | 각 위치마다 다른 타입 가능 |
| **문법** | `number[]`, `Array<number>` | `[string, number]` |
| **사용 사례** | 같은 종류의 데이터 목록 | 함수 다중 반환, 좌표, useState 패턴 |
| **예시** | `[1, 2, 3, 4, 5]` | `['John', 30]` |

### 4. 유니온 vs 인터섹션

| 구분 | 유니온 (`\|`) | 인터섹션 (`&`) |
|------|--------------|---------------|
| **의미** | "또는" (OR) | "그리고" (AND) |
| **타입 범위** | 둘 중 하나만 만족 | 둘 다 만족 |
| **결과** | 타입이 넓어짐 | 타입이 좁아짐 |
| **예시** | `string \| number` | `Person & Employee` |
| **사용** | 여러 가능성 허용 | 타입 결합, 믹스인 |

### 5. any vs unknown

| 구분 | any | unknown |
|------|-----|---------|
| **타입 체크** | 비활성화 | 활성화 |
| **안전성** | 위험 (런타임 에러 가능) | 안전 (컴파일 타임 체크) |
| **사용 전 체크** | 불필요 | 필수 (타입 가드) |
| **권장 여부** | 최대한 피하기 | 권장 |
| **사용 사례** | 타입 없는 라이브러리, 마이그레이션 | 사용자 입력, API 응답, 에러 |

### 6. 타입 정의 방법

| 방법 | 문법 | 특징 | 사용 시기 |
|------|------|------|-----------|
| **인라인** | `let x: { name: string }` | 간단, 재사용 불가 | 일회성 타입 |
| **타입 별칭** | `type User = { name: string }` | 재사용 가능, 유니온/튜플 가능 | 대부분의 경우 |
| **인터페이스** | `interface User { name: string }` | 확장 가능, 선언 병합 | 객체 구조, 라이브러리 |

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

## 타입 작성 가이드

### 타입 추론 vs 명시

```typescript
let count = 0;                    // 추론 (간단한 경우)
let userId: string;               // 명시 (나중에 할당)
function add(a: number, b: number): number { }  // 매개변수와 반환 타입 명시
```

### 배열 vs 튜플 선택

```typescript
let scores: number[] = [90, 85, 95];        // 배열: 같은 타입, 가변 길이
let user: [number, string] = [1, 'John'];   // 튜플: 다른 타입, 고정 길이
```

### any vs unknown 선택

```typescript
let data: any = fetchData();      // ❌ any: 타입 안전성 포기
let data: unknown = fetchData();  // ✅ unknown: 타입 체크 강제
if (typeof data === 'object') { /* 사용 */ }
```

### 유니온 vs 인터섹션

```typescript
type ID = string | number;        // 유니온: 둘 중 하나
type Employee = Person & Worker;  // 인터섹션: 둘 다 포함
```

## 실습 가이드

```bash
# 순서대로 학습
npx ts-node 01-typescript-basics/01-basic-types.ts
npx ts-node 01-typescript-basics/02-type-inference.ts
npx ts-node 01-typescript-basics/03-type-annotations.ts
npx ts-node 01-typescript-basics/04-arrays-tuples.ts
npx ts-node 01-typescript-basics/05-objects.ts
npx ts-node 01-typescript-basics/06-type-alias.ts
npx ts-node 01-typescript-basics/07-union-intersection.ts
npx ts-node 01-typescript-basics/08-any-unknown.ts
npx ts-node 01-typescript-basics/09-practical-examples.ts

# 타입 체크만
npx tsc --noEmit 01-typescript-basics/*.ts
```

## 자주 하는 실수

### 1. any 남용
❌ 타입 모르면 무조건 `any` 사용</br>
✅ `unknown` 사용 후 타입 가드로 좁히기

### 2. 선택적 프로퍼티와 undefined 혼동
❌ `age?: number` 는 `age: number | undefined`와 미묘하게 다름</br>
✅ 선택적은 프로퍼티 자체가 없을 수 있음, undefined는 값이 undefined

### 3. 배열과 튜플 혼용
❌ `let user = ['John', 30]` → `(string | number)[]` 로 추론</br>
✅ `let user: [string, number] = ['John', 30]` → 튜플로 명시

### 4. readonly 얕은 불변성
❌ `readonly` 프로퍼티의 중첩 객체는 변경 가능</br>
✅ 깊은 불변성 필요 시 재귀적으로 `Readonly` 적용

### 5. 타입 단언 남용
❌ `value as Type` 으로 강제 변환 남발</br>
✅ 타입 가드로 안전하게 좁히기, 단언은 확신할 때만

## 다음 단계

01-typescript-basics를 완료했다면:
- **[02-functions-types](../02-functions-types/)** - 함수 타입 시그니처, 오버로드 학습
- **[03-classes-interfaces](../03-classes-interfaces/)** - 클래스와 인터페이스
- **[09-practical-patterns](../09-practical-patterns/)** - interface vs type, enum 문제점 상세

## 참고 자료

- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Deep Dive - Type System](https://basarat.gitbook.io/typescript/type-system)
- [TypeScript - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
