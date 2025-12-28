# 09. 실무 핵심 패턴

TypeScript 초보자가 가장 헷갈리는 질문들: **"interface vs type, 뭘 써야 하지?"**, **"enum은 왜 안 쓰라는 거지?"**, **"readonly면 완전히 불변 아닌가?"** 이 모듈에서 모든 의문을 해결합니다.

## 학습 목표

- **interface vs type** 명확한 선택 기준
- **enum의 문제점**과 union literal 대안
- **readonly vs const** 차이와 불변성 한계
- **얕은 불변성 vs 깊은 불변성** 이해
- **실무 의사결정 가이드**

## 목차

### interface vs type
- [01-interface-vs-type.ts](#01-interface-vs-typets) - 완전 비교
- [02-when-to-use-interface.ts](#02-when-to-use-interfacets) - interface를 써야 할 때
- [03-when-to-use-type.ts](#03-when-to-use-typets) - type을 써야 할 때

### enum vs union literal
- [04-enum-problems.ts](#04-enum-problemsts) - enum의 문제점
- [05-union-literal-alternative.ts](#05-union-literal-alternativet) - union literal 대안

### readonly vs const
- [06-readonly-vs-const.ts](#06-readonly-vs-constts) - readonly vs const
- [07-shallow-immutability.ts](#07-shallow-immutabilityt) - 얕은 불변성 한계
- [08-deep-readonly.ts](#08-deep-readonlyt) - 깊은 불변성 구현

### 종합
- [09-practical-examples.ts](#09-practical-examplests) - 실전 선택 가이드

## 예제 파일 개요

### 01-interface-vs-type.ts
**interface vs type 완전 비교**

- 기본 문법 차이
- 확장 방법 (extends vs &)
- 선언 병합 (Declaration Merging)
- 유니온/인터섹션 지원
- 튜플, 원시 타입 별칭
- computed properties
- 성능 차이 (컴파일 속도)
- IDE 지원 차이

### 02-when-to-use-interface.ts
**interface를 써야 할 때**

- 객체 구조 정의
- 클래스 구현 (implements)
- 라이브러리 API 정의
- 선언 병합이 필요한 경우
- 확장 가능성이 중요한 경우
- React 컴포넌트 Props
- Public API 타입

### 03-when-to-use-type.ts
**type을 써야 할 때**

- 유니온 타입
- 인터섹션 타입
- 튜플 타입
- 원시 타입 별칭
- 유틸리티 타입 조합
- Mapped Types
- Conditional Types
- 함수 타입 별칭

### 04-enum-problems.ts
**enum의 문제점**

- 런타임 코드 생성 (번들 크기 증가)
- 트리 셰이킹 어려움
- 숫자 enum의 역방향 매핑 오버헤드
- 타입 안전성 문제 (숫자 enum)
- const enum의 한계
- 모듈 경계에서 문제
- TypeScript의 구조적 타이핑과 충돌
- 실제 번들 크기 비교

### 05-union-literal-alternative.ts
**union literal로 enum 대체**

- 기본 union literal
- as const로 값 배열 정의
- 타입 추출 (typeof, [number])
- 객체로 그룹화
- satisfies 연산자 활용
- 런타임 값 + 타입 동시 관리
- 번들 크기 0
- 완벽한 트리 셰이킹

### 06-readonly-vs-const.ts
**readonly vs const 차이**

- const: 재할당 금지
- readonly: 프로퍼티 수정 금지
- const는 변수, readonly는 프로퍼티
- const 객체의 프로퍼티는 변경 가능
- readonly 배열
- ReadonlyArray vs Array
- 사용 시기

### 07-shallow-immutability.ts
**얕은 불변성의 한계**

- readonly는 1레벨만
- 중첩 객체 프로퍼티는 변경 가능
- Readonly<T>의 한계
- 배열 요소 객체 변경 가능
- 실무에서 마주치는 문제
- 얕은 복사 vs 깊은 복사
- Immer 등 라이브러리 필요성

### 08-deep-readonly.ts
**깊은 불변성 구현**

- DeepReadonly 타입 구현
- 재귀 조건부 타입
- 배열, 객체, 원시 타입 처리
- ReadonlyArray와 조합
- 성능 고려사항
- 실용적인 깊은 불변성
- ts-essentials 라이브러리

### 09-practical-examples.ts
**실전 선택 가이드**

- 프로젝트 타입별 권장 사항
- API 응답 타입 (interface)
- 상태 관리 (type + union)
- 설정 객체 (type + union literal)
- 이벤트 타입 (union literal)
- Props 타입 (interface)
- 유틸리티 타입 (type)
- 일관성 있는 코드베이스 유지

## 핵심 개념 요약

### interface vs type

| 구분 | interface | type |
|------|-----------|------|
| **객체 구조** | ✅ 가능 | ✅ 가능 |
| **확장** | `extends` | `&` (intersection) |
| **선언 병합** | ✅ 가능 | ❌ 불가능 |
| **유니온** | ❌ 불가능 | ✅ 가능 |
| **튜플** | ⚠️ 가능하나 불편 | ✅ 간편 |
| **원시 타입 별칭** | ❌ 불가능 | ✅ 가능 |
| **Computed Properties** | ❌ 제한적 | ✅ 완전 지원 |
| **성능** | ⚠️ 약간 느림 (복잡한 경우) | ✅ 빠름 |
| **에러 메시지** | ✅ 명확 | ⚠️ 복잡할 수 있음 |

### 언제 무엇을 쓸까?

| 상황 | 선택 | 이유 |
|------|------|------|
| 객체 구조 (확장 가능성 중요) | **interface** | extends, 선언 병합 |
| 유니온/인터섹션 | **type** | interface는 불가능 |
| 튜플 | **type** | 더 간편 |
| 원시 타입 별칭 | **type** | interface는 불가능 |
| React Props | **interface** | 확장성, 컨벤션 |
| API 응답 | **interface** | 확장 가능성 |
| 상태 관리 | **type** | 유니온 필요 |
| 유틸리티 타입 | **type** | 조건부/매핑 타입 |
| 공개 라이브러리 API | **interface** | 선언 병합 활용 |

### enum vs union literal

| 구분 | enum | union literal |
|------|------|---------------|
| **런타임 코드** | ✅ 생성됨 | ❌ 없음 |
| **번들 크기** | 📈 증가 | 📉 0 |
| **트리 셰이킹** | ❌ 어려움 | ✅ 완벽 |
| **타입 안전성** | ⚠️ 숫자 enum 문제 | ✅ 완벽 |
| **자동완성** | ✅ 지원 | ✅ 지원 |
| **값 순회** | ✅ Object.keys() | ✅ as const 배열 |
| **추천 여부** | ⚠️ 레거시만 | ✅ 권장 |

```typescript
// ❌ enum (런타임 코드 생성, 번들 크기 증가)
enum Status {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

// ✅ union literal (타입만, 번들 크기 0)
type Status = 'pending' | 'approved' | 'rejected';
const STATUSES = ['pending', 'approved', 'rejected'] as const;
```

### readonly vs const

| 구분 | const | readonly |
|------|-------|----------|
| **적용 대상** | 변수 | 프로퍼티 |
| **재할당** | ❌ 금지 | - (변수가 아님) |
| **프로퍼티 수정** | ✅ 가능 | ❌ 금지 |
| **깊이** | 1레벨 (변수만) | 1레벨 (프로퍼티만) |
| **런타임** | ✅ let과 동일 | ❌ 타입만 |
| **사용 시기** | 변수 선언 | 타입 정의 |

```typescript
const obj = { name: 'Alice' };
obj.name = 'Bob';  // ✅ 가능 (const는 재할당만 막음)
obj = {};  // ❌ 불가능

interface User {
  readonly name: string;
}
const user: User = { name: 'Alice' };
user.name = 'Bob';  // ❌ 불가능 (readonly)
```

### 얕은 불변성 vs 깊은 불변성

| 구분 | 얕은 불변성 | 깊은 불변성 |
|------|-------------|-------------|
| **적용 깊이** | 1레벨만 | 모든 레벨 |
| **중첩 객체** | ⚠️ 변경 가능 | ✅ 변경 불가 |
| **TypeScript 기본** | readonly, Readonly<T> | - (직접 구현) |
| **구현** | 간단 | 재귀 타입 필요 |
| **성능** | ✅ 빠름 | ⚠️ 느림 |
| **실용성** | ✅ 대부분 충분 | ⚠️ 정말 필요할 때만 |

## 자주 하는 실수

### 1. interface와 type을 혼용
❌ 일관성 없이 섞어 쓰기
✅ 프로젝트 컨벤션 정하고 일관되게 사용

### 2. enum을 기본 선택
❌ 모든 상수를 enum으로
✅ union literal 우선, enum은 레거시 호환만

### 3. readonly면 완전 불변이라 착각
❌ `readonly obj: { data: string[] }` - data 배열 변경 가능
✅ 중첩 객체까지 불변이 필요하면 DeepReadonly

### 4. const면 불변이라 착각
❌ `const user = { name: 'Alice' }` - name 변경 가능
✅ const는 재할당만 막음, as const로 리터럴 타입

### 5. interface로 유니온 타입 시도
❌ `interface Status = 'pending' | 'approved'` - 문법 에러
✅ `type Status = 'pending' | 'approved'`

## Best Practices

**✅ 기본은 interface, 필요 시 type**
```typescript
// ✅ 객체는 interface
interface User {
  id: string;
  name: string;
}

// ✅ 유니온이 필요하면 type
type Status = 'pending' | 'approved' | 'rejected';

// ✅ 유틸리티 조합은 type
type PartialUser = Partial<User>;
```

**✅ enum 대신 union literal + as const**
```typescript
// ❌ enum
enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
}

// ✅ union literal
type Color = 'red' | 'green' | 'blue';
const COLORS = ['red', 'green', 'blue'] as const;
type Color = typeof COLORS[number];  // 'red' | 'green' | 'blue'

// ✅ 객체로 그룹화
const COLOR = {
  RED: 'red',
  GREEN: 'green',
  BLUE: 'blue',
} as const;
type Color = typeof COLOR[keyof typeof COLOR];
```

**✅ readonly는 얕음을 인지하고 사용**
```typescript
interface User {
  readonly name: string;
  readonly address: {
    city: string;  // ⚠️ 변경 가능!
  };
}

// 깊은 불변성이 필요하면
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

**✅ as const로 리터럴 타입 + 런타임 값**
```typescript
const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
} as const;

type Route = typeof ROUTES[keyof typeof ROUTES];  // '/' | '/about' | '/contact'

function navigate(route: Route) { }
navigate(ROUTES.HOME);  // ✅ 타입 안전 + 값 재사용
```

**✅ satisfies로 타입 체크 + 타입 추론**
```typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} satisfies Record<string, string | number>;

config.apiUrl;  // string으로 추론 (Record<string, string | number>가 아닌)
```

## 의사결정 플로우차트

```
타입을 정의해야 한다면?
│
├─ 유니온/인터섹션이 필요한가?
│  └─ YES → type 사용
│
├─ 튜플/원시 타입 별칭인가?
│  └─ YES → type 사용
│
├─ 객체 구조인가?
│  ├─ 확장 가능성이 중요한가?
│  │  └─ YES → interface 사용
│  ├─ 라이브러리 API인가?
│  │  └─ YES → interface 사용
│  └─ 그 외 → interface/type 팀 컨벤션 따르기
│
└─ 유틸리티 타입 조합인가?
   └─ YES → type 사용
```

```
상수를 정의해야 한다면?
│
├─ 런타임에 값이 필요한가?
│  ├─ NO → union literal type
│  └─ YES →
│     ├─ 값 배열이 필요한가?
│     │  └─ YES → as const 배열
│     └─ 값 객체가 필요한가?
│        └─ YES → as const 객체
│
└─ 레거시 코드와 호환이 필요한가?
   └─ YES → const enum (최후의 수단)
```

## 다음 단계

이 모듈을 완료했다면:
- **[10-node-with-ts](../10-node-with-ts/)** - Node.js API를 TypeScript로
- **[11-async-typescript](../11-async-typescript/)** - Promise, async/await 타입 처리

## 참고 자료

### 공식 문서
- [Interfaces vs Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [Enums Considered Harmful](https://www.youtube.com/watch?v=jjMbPt_H3RQ) - Matt Pocock
- [const assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)

### 추천 글
- [TypeScript: Prefer Interfaces](https://ncjamieson.com/prefer-interfaces/)
- [Why TypeScript Enums Suck](https://blog.bitsrc.io/why-typescript-enums-suck-7f0e7e3e2fcb)

---

**시작하기:** [01-interface-vs-type.ts](./01-interface-vs-type.ts)
