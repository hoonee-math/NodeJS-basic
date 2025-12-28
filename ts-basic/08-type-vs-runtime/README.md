# 08. 타입 vs 런타임 (Type Erasure & Runtime)

TypeScript의 **타입은 컴파일 타임에만 존재**합니다. 이 근본적인 사실을 이해하지 못하면 런타임 에러를 만나게 됩니다. 이 모듈에서는 타입 소거와 런타임 타입 체크 전략을 완전히 이해합니다.

## 학습 목표

- **타입 소거 (Type Erasure)** 개념 완전 이해
- **컴파일 타임 vs 런타임** 명확한 구분
- **인터페이스와 타입 별칭**은 런타임에 존재하지 않음
- **enum은 런타임 코드 생성** - 유일한 예외
- **런타임 타입 체크** 전략 (타입 가드, Zod, Branded Types)

## 목차

### 타입 소거 이해
- [01-type-erasure.ts](#01-type-erasurets) - 타입 소거 개념
- [02-compile-vs-runtime.ts](#02-compile-vs-runtimerts) - 컴파일 타임 vs 런타임
- [03-interface-at-runtime.ts](#03-interface-at-runtimerts) - 인터페이스는 런타임에 없음
- [04-enum-at-runtime.ts](#04-enum-at-runtimerts) - enum은 런타임 코드 생성

### 런타임 타입 체크
- [05-type-guards-runtime.ts](#05-type-guards-runtimerts) - 런타임 타입 가드
- [06-zod-validation.ts](#06-zod-validationts) - Zod로 런타임 검증
- [07-branded-types.ts](#07-branded-typests) - Branded Types 패턴

### 고급 패턴
- [08-assertion-functions.ts](#08-assertion-functionsts) - Assertion Functions
- [09-practical-examples.ts](#09-practical-examplests) - 실전 런타임 검증

## 예제 파일 개요

### 01-type-erasure.ts
**타입 소거 (Type Erasure)**

- 타입 소거란 무엇인가?
- TypeScript → JavaScript 컴파일 과정
- 타입 어노테이션이 모두 제거됨
- 인터페이스, 타입 별칭 → 사라짐
- 제네릭 타입 매개변수 → 사라짐
- 컴파일 전후 코드 비교
- 런타임에 남는 것 vs 사라지는 것

### 02-compile-vs-runtime.ts
**컴파일 타임 vs 런타임**

- 컴파일 타임 에러 vs 런타임 에러
- 타입 체크는 컴파일 타임에만
- 런타임에는 JavaScript만 실행됨
- typeof로 확인 가능한 것 (클래스, 함수)
- typeof로 확인 불가능한 것 (인터페이스, 타입)
- 타입 단언의 위험성
- 런타임 보장이 필요한 경우

### 03-interface-at-runtime.ts
**인터페이스는 런타임에 없음**

- interface는 컴파일 후 완전히 사라짐
- instanceof로 체크 불가능
- 런타임에 인터페이스 타입 체크 방법
- 타입 가드 함수로 해결
- in 연산자로 프로퍼티 존재 확인
- 구조적 타이핑 활용
- API 응답 검증의 필요성

### 04-enum-at-runtime.ts
**enum은 런타임 코드 생성 - 유일한 예외**

- enum은 객체로 컴파일됨
- const enum vs enum 차이
- enum의 런타임 오버헤드
- 왜 enum을 피해야 하나?
- union literal types로 대체
- enum을 써야 하는 경우 (레거시 호환)
- as const로 enum 대체
- 번들 크기 비교

### 05-type-guards-runtime.ts
**런타임 타입 가드 전략**

- typeof 가드 (원시 타입)
- instanceof 가드 (클래스)
- in 연산자 가드 (프로퍼티)
- Array.isArray() 가드
- 사용자 정의 타입 가드 (`is` 키워드)
- 판별 유니온 활용
- 런타임 타입 체크 패턴
- API 응답 검증

### 06-zod-validation.ts
**Zod로 런타임 검증**

- Zod 스키마 정의
- 타입과 스키마 동시 생성
- parse vs safeParse
- 중첩 객체 검증
- 배열, 튜플 검증
- API 응답 검증 패턴
- 폼 데이터 검증
- 에러 핸들링

### 07-branded-types.ts
**Branded Types 패턴**

- Nominal Typing vs Structural Typing
- Branded Types로 타입 구분
- UserId, Email 등 타입 안전성
- 런타임 검증 + 컴파일 타입 체크
- 스마트 생성자 패턴
- 타입 안전한 ID 관리
- 유효성 검증 + 타입 브랜딩

### 08-assertion-functions.ts
**Assertion Functions**

- Assertion Functions란?
- asserts 키워드
- 런타임 체크 + 타입 좁히기
- assert vs 타입 가드 차이
- Non-null assertion
- 커스텀 assertion 함수
- 에러 던지기 vs 타입 좁히기

### 09-practical-examples.ts
**실전 런타임 검증 패턴**

- API 응답 검증 (fetch + Zod)
- 폼 데이터 검증
- 환경 변수 검증
- localStorage 데이터 검증
- WebSocket 메시지 검증
- 타입 안전한 이벤트 핸들링
- 런타임 타입 체크 유틸리티
- 타입 + 런타임 검증 조합

## 핵심 개념 요약

### 컴파일 타임 vs 런타임

| 구분 | 컴파일 타임 | 런타임 |
|------|-------------|--------|
| **언어** | TypeScript | JavaScript |
| **타입 체크** | ✅ 가능 | ❌ 불가능 |
| **존재하는 것** | 타입, 인터페이스, 타입 별칭 | 클래스, 함수, enum 객체 |
| **체크 도구** | tsc, IDE | typeof, instanceof, 타입 가드 |
| **에러** | 컴파일 에러 | 런타임 에러 |

### 타입 소거 (Type Erasure)

| TypeScript | 컴파일 후 JavaScript | 런타임 존재 |
|------------|---------------------|------------|
| `interface User { name: string }` | (삭제됨) | ❌ 없음 |
| `type ID = string \| number` | (삭제됨) | ❌ 없음 |
| `<T>` (제네릭) | (삭제됨) | ❌ 없음 |
| `enum Color { Red, Green }` | `{ Red: 0, Green: 1 }` | ✅ 객체로 존재 |
| `class User { }` | `class User { }` | ✅ 클래스로 존재 |

### enum vs union literal

| 구분 | enum | union literal |
|------|------|---------------|
| **런타임 코드** | ✅ 객체 생성 | ❌ 없음 (타입만) |
| **번들 크기** | 증가 | 변화 없음 |
| **역방향 매핑** | ✅ 가능 (숫자 enum) | ❌ 불가능 |
| **트리 셰이킹** | ❌ 어려움 | ✅ 완벽 |
| **추천 여부** | ❌ 피하기 | ✅ 권장 |

```typescript
// ❌ enum (런타임 코드 생성)
enum Color { Red, Green, Blue }
// 컴파일 후: var Color; (function (Color) { Color[Color["Red"] = 0] = "Red"; ... })(Color || (Color = {}));

// ✅ union literal (타입만)
type Color = 'red' | 'green' | 'blue';
// 컴파일 후: (완전히 사라짐)
```

### 런타임 타입 체크 전략

| 방법 | 대상 | 신뢰도 | 활용 |
|------|------|--------|------|
| **typeof** | 원시 타입 | ✅ 높음 | 간단한 체크 |
| **instanceof** | 클래스 | ✅ 높음 | 클래스 인스턴스 |
| **in 연산자** | 프로퍼티 | ⚠️ 중간 | 객체 구조 확인 |
| **타입 가드 함수** | 커스텀 | ⚠️ 중간 | 수동 검증 |
| **Zod/Yup** | 모든 타입 | ✅ 높음 | 복잡한 검증 |
| **Branded Types** | ID 등 | ✅ 높음 | 타입 구분 |

## 언제 무엇을 쓸까?

| 상황 | 전략 | 도구 |
|------|------|------|
| API 응답 검증 | 런타임 스키마 검증 | Zod, Yup |
| 사용자 입력 검증 | 런타임 스키마 검증 | Zod, React Hook Form |
| 간단한 타입 체크 | 타입 가드 | typeof, instanceof, in |
| ID 타입 구분 | Branded Types | 스마트 생성자 |
| 환경 변수 검증 | 런타임 검증 | Zod, envalid |
| 에러 처리 | Assertion Functions | asserts |

## 자주 하는 실수

### 1. 인터페이스를 instanceof로 체크
❌ `if (obj instanceof User)` - 인터페이스는 런타임에 없음
✅ `if (isUser(obj))` - 타입 가드 함수 사용

### 2. 타입 단언으로 런타임 검증 생략
❌ `const user = data as User;` - 런타임 체크 없음
✅ `const user = userSchema.parse(data);` - Zod로 검증

### 3. enum 과다 사용
❌ 모든 상수를 enum으로
✅ union literal 사용, 정말 필요할 때만 const enum

### 4. 타입 체크를 런타임 보장으로 착각
❌ 타입만 정의하고 검증 안 함
✅ API 응답, 사용자 입력은 반드시 런타임 검증

### 5. typeof로 복잡한 객체 체크
❌ `typeof obj === 'object'` - null도 object
✅ `obj !== null && typeof obj === 'object'` 또는 Zod

## Best Practices

**✅ API 응답은 반드시 런타임 검증**
```typescript
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return UserSchema.parse(data);  // 런타임 검증!
}
```

**✅ enum 대신 union literal + as const**
```typescript
// ❌ enum
enum Color { Red, Green, Blue }

// ✅ union literal
type Color = 'red' | 'green' | 'blue';
const COLORS = ['red', 'green', 'blue'] as const;
```

**✅ Branded Types로 타입 안전 ID**
```typescript
type UserId = string & { __brand: 'UserId' };
type ProductId = string & { __brand: 'ProductId' };

function createUserId(id: string): UserId {
  if (!id.startsWith('user_')) throw new Error('Invalid UserId');
  return id as UserId;
}

function getUser(id: UserId) { }  // ProductId 전달 시 컴파일 에러
```

**✅ 타입 가드로 안전한 체크**
```typescript
function isUser(obj: unknown): obj is User {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'id' in obj &&
    'name' in obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string'
  );
}
```

**✅ Assertion Functions로 에러 처리**
```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string');
  }
}

const value: unknown = 'hello';
assertIsString(value);
value.toUpperCase();  // 타입이 string으로 좁혀짐
```

## 타입 시스템의 한계 이해

```typescript
// ❌ 이렇게 하면 런타임 에러!
interface User {
  name: string;
  email: string;
}

// 컴파일은 성공하지만...
const data: any = { name: 'Alice' };  // email 없음!
const user: User = data;  // 타입 단언

console.log(user.email.toLowerCase());  // 💥 런타임 에러!

// ✅ 올바른 방법
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string(),
  email: z.string(),
});

const user = UserSchema.parse(data);  // 런타임 검증, email 없으면 에러
```

## 다음 단계

이 모듈을 완료했다면:
- **[09-practical-patterns](../09-practical-patterns/)** - interface vs type, enum 문제점 상세
- **[10-node-with-ts](../10-node-with-ts/)** - Node.js API를 TypeScript로

## 참고 자료

### 공식 문서
- [TypeScript FAQ - Type Erasure](https://github.com/microsoft/TypeScript/wiki/FAQ#what-is-type-erasure)
- [Enums at Runtime](https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime)

### 런타임 검증 라이브러리
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Yup](https://github.com/jquense/yup) - JavaScript schema builder
- [io-ts](https://github.com/gcanti/io-ts) - Runtime type system for IO decoding/encoding

### 추가 학습
- [Branded Types in TypeScript](https://egghead.io/blog/using-branded-types-in-typescript)
- [TypeScript Deep Dive - Type Assertion](https://basarat.gitbook.io/typescript/type-system/type-assertion)

---

**시작하기:** [01-type-erasure.ts](./01-type-erasure.ts)
