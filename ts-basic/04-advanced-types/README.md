# 04. 고급 타입 (Advanced Types)

TypeScript의 진짜 강력함은 **타입을 조합하고 변환하는 능력**에서 나옵니다. 이 모듈에서는 유니온, 인터섹션, 리터럴 타입 등 실무에서 가장 많이 사용되는 고급 타입 시스템을 다룹니다.

## 학습 목표

- **유니온/인터섹션 타입**으로 타입 조합하기
- **리터럴 타입**으로 정확한 값 표현하기
- **타입 가드**로 런타임에 타입 좁히기
- **판별 유니온**으로 안전한 상태 관리
- **조건부 타입**과 **매핑 타입** 기초 이해

## 목차

### 기본 타입 조합
- [01-union-types.ts](#01-union-typests) - 유니온 타입 (OR), 타입 좁히기
- [02-intersection-types.ts](#02-intersection-typests) - 인터섹션 타입 (AND), 믹스인 패턴
- [03-literal-types.ts](#03-literal-typests) - 리터럴 타입 (정확한 값), Template Literal, const assertions

### 타입 좁히기 (Type Narrowing)
- [04-type-guards.ts](#04-type-guardsts) - 타입 가드 함수, typeof, instanceof, in, 사용자 정의 타입 가드
- [05-discriminated-unions.ts](#05-discriminated-unionsts) - 판별 유니온, 상태 머신, Redux 패턴
- [06-type-narrowing.ts](#06-type-narrowingts) - 타입 좁히기 전략, 제어 흐름 분석

### 고급 타입 변환
- [07-conditional-types-basic.ts](#07-conditional-types-basicts) - 조건부 타입, infer, Exclude/Extract
- [08-mapped-types-basic.ts](#08-mapped-types-basicts) - 매핑 타입, 프로퍼티 수정자, Partial/Pick/Omit
- [09-practical-examples.ts](#09-practical-examplests) - 실전 종합 (API, 상태 관리, Redux, 폼 검증, 라우팅)

## 예제 파일 개요

### 01-union-types.ts
**유니온 타입 (OR 관계)**

- 기본 유니온 타입 (`string | number`)
- 배열 유니온 vs 유니온 배열
- 객체 유니온과 공통 프로퍼티
- 타입 좁히기와 타입 가드
- Null/Undefined 유니온
- API 응답 타입 (성공/실패)

### 02-intersection-types.ts
**인터섹션 타입 (AND 관계)**

- 기본 인터섹션 타입 (`A & B`)
- 타입 확장 (믹스인 패턴)
- 인터페이스 결합
- 제네릭과 인터섹션
- 충돌하는 타입 처리
- 실무 패턴 (Timestamped, Deletable, 메타데이터)

### 03-literal-types.ts
**리터럴 타입 (정확한 값)**

- String/Number/Boolean Literal Types
- 리터럴 유니온 (`'left' | 'right' | 'up' | 'down'`)
- Template Literal Types
- const assertions (`as const`)
- HTTP 메서드, 상태 코드, 방향 타입
- enum 대신 리터럴 유니온 사용하기

### 04-type-guards.ts
**타입 가드로 런타임 타입 좁히기**

- typeof, instanceof, in 연산자
- 사용자 정의 타입 가드 (`is` 키워드)
- 배열 타입 가드 (Array.isArray)
- Null/Undefined 체크
- 타입 단언 함수 (Assertion Functions)
- 제네릭 타입 가드

### 05-discriminated-unions.ts
**판별 유니온 (Tagged Unions)**

- 공통 판별 속성 (`kind`, `type`, `status`)
- switch/case로 타입 자동 좁히기
- 여러 판별자 조합
- Redux Action 패턴
- 상태 머신 구현 (로딩/성공/실패)
- API 응답 타입 설계

### 06-type-narrowing.ts
**타입 좁히기 종합 전략**

- typeof, instanceof, in 좁히기
- 등호(===) 좁히기
- Truthiness 좁히기
- 옵셔널 체이닝과 타입 좁히기
- Never 타입 활용 (Exhaustiveness Checking)
- 제어 흐름 분석 (Control Flow Analysis)

### 07-conditional-types-basic.ts
**조건부 타입 기초**

- 기본 조건부 타입 (`T extends U ? X : Y`)
- extends 키워드 이해
- 타입 분배 (Distributive)
- infer 키워드 기초
- 내장 조건부 타입 (Exclude, Extract, NonNullable)
- 함수 반환 타입 추출

*참고: 고급 내용은 `05-generics`에서 다룹니다.*

### 08-mapped-types-basic.ts
**매핑 타입 기초**

- 기본 매핑 타입 (`{ [K in keyof T]: ... }`)
- keyof, in 연산자
- 프로퍼티 수정자 (`readonly`, `?`) 추가/제거
- 타입 변환 (모든 속성을 string으로)
- 템플릿 리터럴과 매핑 타입
- 내장 매핑 타입 (Partial, Required, Readonly, Pick, Omit)

*참고: 고급 내용은 `06-utility-types`에서 다룹니다.*

### 09-practical-examples.ts
**실전 종합 패턴**

- API 응답 타입 설계 (Success/Error)
- 상태 관리 타입 (AsyncState)
- Redux Action 타입
- 폼 검증 타입
- 라우팅 타입
- 이벤트 핸들러 타입
- 설정 객체 타입

## 핵심 개념 요약

### Union vs Intersection

| 구분 | Union (`A \| B`) | Intersection (`A & B`) |
|------|------------------|------------------------|
| **의미** | A 또는 B (OR) | A 그리고 B (AND) |
| **사용 시점** | 여러 타입 중 하나 | 여러 타입 모두 만족 |
| **프로퍼티** | 공통 프로퍼티만 접근 | 모든 프로퍼티 접근 |
| **예시** | `string \| number` | `Named & Aged` |
| **활용** | 매개변수, 반환값 | 타입 확장, 믹스인 |

### 타입 좁히기 (Type Narrowing) 전략

| 방법 | 문법 | 적용 대상 | 예시 |
|------|------|-----------|------|
| **typeof** | `typeof x === 'string'` | 원시 타입 | string, number, boolean |
| **instanceof** | `x instanceof Date` | 클래스 인스턴스 | Date, Error, Array |
| **in** | `'property' in obj` | 객체 프로퍼티 | 인터페이스 구분 |
| **사용자 정의** | `is` 키워드 | 커스텀 타입 | `x is Fish` |
| **판별 속성** | `kind` 필드 | 유니온 타입 | Discriminated Union |
| **truthiness** | `if (x)` | null/undefined | 옵셔널 체이닝 |

### Literal Types

| 타입 | 설명 | 예시 | 활용 |
|------|------|------|------|
| **String Literal** | 정확한 문자열 값 | `'success' \| 'error'` | 상태, 모드, 방향 |
| **Number Literal** | 정확한 숫자 값 | `200 \| 404 \| 500` | HTTP 상태 코드 |
| **Boolean Literal** | true 또는 false | `true` | 플래그 타입 |
| **Template Literal** | 패턴 문자열 | `` `on${string}` `` | 이벤트 이름 |

### 고급 타입

| 타입 | 형태 | 용도 |
|------|------|------|
| **조건부 타입** | `T extends U ? X : Y` | 타입 분기, 필터링 |
| **매핑 타입** | `{ [K in keyof T]: ... }` | 타입 변환, 순회 |

## 언제 무엇을 쓸까?

| 상황 | 타입 선택 | 이유 |
|------|-----------|------|
| 여러 타입 중 하나 허용 | Union | 유연한 입력 |
| 여러 타입 모두 만족 | Intersection | 타입 확장 |
| 정확한 값만 허용 | Literal | 오타 방지, 자동완성 |
| 런타임 타입 검사 | Type Guard | 안전성 |
| 상태 관리 | Discriminated Union | switch/case 활용 |
| 타입 변환 | Mapped Type | 자동화 |
| 조건부 타입 결정 | Conditional Type | 동적 타입 |

## 자주 하는 실수

### 1. Union에서 타입 좁히기 없이 접근
❌ `function process(input: string | number) { return input.toUpperCase(); }`
✅ typeof로 좁힌 후 접근

### 2. Intersection 충돌
❌ `type Wrong = { a: string } & { a: number };` → never 타입
✅ 겹치지 않는 프로퍼티로 확장

### 3. 리터럴 타입 추론 실패
❌ `let status = 'pending';` → string 타입
✅ `const status = 'pending' as const;` → 'pending' 타입

### 4. enum 남용
❌ enum은 런타임 코드 생성 (번들 크기 증가)
✅ Literal Union 사용 (`type Color = 'red' | 'green' | 'blue'`)

### 5. 타입 가드 없이 unknown 사용
❌ unknown 값을 바로 사용
✅ typeof/instanceof로 타입 좁힌 후 사용

## Best Practices

**✅ Literal Union으로 정확한 값 제한**
```typescript
type Status = 'pending' | 'approved' | 'rejected';  // string보다 안전
```

**✅ 판별 유니온으로 상태 관리**
```typescript
type State =
  | { status: 'loading' }
  | { status: 'success'; data: Data }
  | { status: 'error'; error: Error };
```

**✅ Exhaustiveness Checking**
```typescript
function assertNever(x: never): never {
  throw new Error("Unexpected: " + x);
}
// switch에서 default: assertNever(value) 사용
```

**✅ 타입 가드로 런타임 안전성**
```typescript
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
```

## 다음 단계

이 모듈을 완료했다면:
- **[05-generics](../05-generics/)** - 제네릭, 제약 조건, 고급 조건부 타입
- **[06-utility-types](../06-utility-types/)** - 내장 유틸리티 타입 완전 정복

## 참고 자료

### 공식 문서
- [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

### 추가 학습
- [Type Challenges](https://github.com/type-challenges/type-challenges) - 타입 레벨 연습 문제
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

---

**시작하기:** [01-union-types.ts](./01-union-types.ts)
