# 06. 유틸리티 타입 (Utility Types)

TypeScript는 **타입 변환을 쉽게 하는 내장 유틸리티 타입**을 제공합니다. 이 모듈에서는 실무에서 가장 많이 사용되는 유틸리티 타입을 모두 다룹니다.

## 학습 목표

- **Partial, Required, Readonly** 등 기본 유틸리티 마스터
- **Pick, Omit, Exclude, Extract**로 타입 필터링
- **ReturnType, Parameters** 등으로 타입 추출
- **String Manipulation Types**로 문자열 타입 변환
- **유틸리티 타입 조합**으로 복잡한 타입 만들기

## 목차

### 기본 변환 유틸리티
- [01-partial-required.ts](#01-partial-requiredts) - Partial, Required
- [02-readonly-record.ts](#02-readonly-recordts) - Readonly, Record
- [03-pick-omit.ts](#03-pick-omitts) - Pick, Omit

### 타입 필터링
- [04-exclude-extract.ts](#04-exclude-extractts) - Exclude, Extract
- [05-nonnullable-returntype.ts](#05-nonnullable-returntypets) - NonNullable, ReturnType, Parameters

### 고급 유틸리티
- [06-awaited-promise.ts](#06-awaited-promisets) - Awaited, Promise 관련
- [07-string-manipulation.ts](#07-string-manipulationts) - Uppercase, Lowercase, Capitalize, Uncapitalize
- [08-advanced-utilities.ts](#08-advanced-utilitiest) - InstanceType, ConstructorParameters, ThisType

### 실전 응용
- [09-practical-examples.ts](#09-practical-examplests) - 유틸리티 타입 조합 패턴

## 예제 파일 개요

### 01-partial-required.ts
**Partial, Required - 선택적/필수 변환**

- Partial\<T\> - 모든 프로퍼티를 선택적으로
- Required\<T\> - 모든 프로퍼티를 필수로
- 실무 활용: DTO 업데이트, 폼 상태 관리
- 중첩 객체에서 Partial의 한계
- DeepPartial 커스텀 타입
- API 요청/응답 타입 변환

### 02-readonly-record.ts
**Readonly, Record - 불변성과 맵**

- Readonly\<T\> - 모든 프로퍼티를 읽기 전용으로
- Record\<K, T\> - 키-값 맵 타입
- Readonly의 얕은 불변성
- Record로 enum 대체
- 타입 안전한 Dictionary 패턴
- 상수 객체 타입 정의

### 03-pick-omit.ts
**Pick, Omit - 프로퍼티 선택/제외**

- Pick\<T, K\> - 특정 프로퍼티만 선택
- Omit\<T, K\> - 특정 프로퍼티 제외
- 유니온 키로 여러 프로퍼티 처리
- API 응답에서 필요한 필드만 추출
- 민감 정보 제거 (password, token 등)
- DTO 변환 패턴

### 04-exclude-extract.ts
**Exclude, Extract - 유니온 타입 필터링**

- Exclude\<T, U\> - T에서 U에 할당 가능한 타입 제외
- Extract\<T, U\> - T에서 U에 할당 가능한 타입만 추출
- 리터럴 유니온 필터링
- 함수 타입 필터링
- 조건부 타입과 조합
- 타입 좁히기 활용

### 05-nonnullable-returntype.ts
**NonNullable, ReturnType, Parameters**

- NonNullable\<T\> - null과 undefined 제거
- ReturnType\<T\> - 함수 반환 타입 추출
- Parameters\<T\> - 함수 매개변수 타입을 튜플로 추출
- 옵셔널 체이닝과 NonNullable
- 함수 타입에서 정보 추출
- 고차 함수 타입 정의

### 06-awaited-promise.ts
**Awaited, Promise 관련 타입**

- Awaited\<T\> - Promise를 풀어서 내부 타입 추출
- 중첩 Promise 처리
- async 함수 반환 타입
- Promise.all, Promise.race 타입
- 제네릭 async 함수
- 비동기 유틸리티 함수 타입

### 07-string-manipulation.ts
**String Manipulation Types**

- Uppercase\<T\> - 문자열을 대문자로
- Lowercase\<T\> - 문자열을 소문자로
- Capitalize\<T\> - 첫 글자만 대문자로
- Uncapitalize\<T\> - 첫 글자만 소문자로
- Template Literal Types와 조합
- 이벤트 이름 자동 생성 (`onClick`, `onSubmit`)
- HTTP 메서드 타입 변환

### 08-advanced-utilities.ts
**고급 유틸리티 타입**

- InstanceType\<T\> - 생성자 함수의 인스턴스 타입
- ConstructorParameters\<T\> - 생성자 매개변수 타입
- ThisParameterType\<T\> - 함수의 this 타입 추출
- OmitThisParameter\<T\> - this 매개변수 제거
- ThisType\<T\> - this 컨텍스트 타입 명시
- 팩토리 패턴 타입 정의

### 09-practical-examples.ts
**실전 유틸리티 조합 패턴**

- Partial + Pick으로 부분 업데이트
- Omit + Required로 필수 필드 변경
- Record + Readonly로 상수 맵
- ReturnType + Awaited로 async 함수 결과 타입
- 유틸리티 체인 (Partial\<Omit\<T, K\>\>)
- API 타입 변환 파이프라인
- 폼 상태 관리 타입
- DTO ↔ Entity 변환

## 핵심 개념 요약

### 프로퍼티 변환 유틸리티

| 유틸리티 | 변환 | 예시 | 활용 |
|----------|------|------|------|
| **Partial\<T\>** | 모든 프로퍼티 선택적 | `Partial<User>` | 업데이트 DTO |
| **Required\<T\>** | 모든 프로퍼티 필수 | `Required<Config>` | 기본값 적용 후 |
| **Readonly\<T\>** | 모든 프로퍼티 읽기 전용 | `Readonly<State>` | 불변 상태 |
| **Record\<K, T\>** | 키-값 맵 | `Record<string, number>` | Dictionary |

### 프로퍼티 선택/제외

| 유틸리티 | 동작 | 예시 | 활용 |
|----------|------|------|------|
| **Pick\<T, K\>** | K 프로퍼티만 선택 | `Pick<User, 'id' \| 'name'>` | DTO 생성 |
| **Omit\<T, K\>** | K 프로퍼티 제외 | `Omit<User, 'password'>` | 민감 정보 제거 |

### 타입 필터링

| 유틸리티 | 동작 | 예시 | 활용 |
|----------|------|------|------|
| **Exclude\<T, U\>** | T에서 U 제외 | `Exclude<'a'\|'b'\|'c', 'a'>` → `'b'\|'c'` | 타입 좁히기 |
| **Extract\<T, U\>** | T에서 U만 추출 | `Extract<'a'\|'b', 'a'\|'c'>` → `'a'` | 공통 타입 추출 |
| **NonNullable\<T\>** | null/undefined 제거 | `NonNullable<string \| null>` → `string` | null 체크 후 |

### 함수 타입 추출

| 유틸리티 | 추출 대상 | 예시 | 활용 |
|----------|-----------|------|------|
| **ReturnType\<T\>** | 함수 반환 타입 | `ReturnType<() => string>` → `string` | 함수 결과 타입 |
| **Parameters\<T\>** | 함수 매개변수 | `Parameters<(a: number) => void>` → `[number]` | 매개변수 타입 |
| **ConstructorParameters\<T\>** | 생성자 매개변수 | `ConstructorParameters<typeof Date>` | 팩토리 패턴 |
| **InstanceType\<T\>** | 인스턴스 타입 | `InstanceType<typeof MyClass>` | 클래스 타입 |

### 비동기 타입

| 유틸리티 | 동작 | 예시 | 활용 |
|----------|------|------|------|
| **Awaited\<T\>** | Promise 풀기 | `Awaited<Promise<string>>` → `string` | async 함수 |

### 문자열 변환

| 유틸리티 | 변환 | 예시 | 활용 |
|----------|------|------|------|
| **Uppercase\<T\>** | 대문자 | `Uppercase<'hello'>` → `'HELLO'` | 상수 이름 |
| **Lowercase\<T\>** | 소문자 | `Lowercase<'HELLO'>` → `'hello'` | 경로 이름 |
| **Capitalize\<T\>** | 첫 글자 대문자 | `Capitalize<'hello'>` → `'Hello'` | 메서드 이름 |
| **Uncapitalize\<T\>** | 첫 글자 소문자 | `Uncapitalize<'Hello'>` → `'hello'` | 변수 이름 |

## 언제 무엇을 쓸까?

| 상황 | 유틸리티 | 이유 |
|------|----------|------|
| 업데이트 API | Partial\<T\> | 일부 필드만 받기 |
| 응답 타입 | Pick\<T, K\> | 필요한 필드만 |
| 민감 정보 제거 | Omit\<T, K\> | password 등 제외 |
| 상수 객체 | Readonly\<T\> | 불변성 보장 |
| Dictionary | Record\<K, T\> | 키-값 맵 |
| null 체크 후 | NonNullable\<T\> | null/undefined 제거 |
| 함수 타입 추출 | ReturnType\<T\> | 반환 타입 재사용 |
| async 결과 | Awaited\<T\> | Promise 풀기 |

## 자주 하는 실수

### 1. Partial의 얕은 변환
❌ `Partial<T>`는 중첩 객체는 변환 안 됨
✅ DeepPartial 커스텀 타입 사용

### 2. Readonly의 얕은 불변성
❌ `Readonly<T>`는 중첩 객체 프로퍼티는 변경 가능
✅ DeepReadonly 커스텀 타입 사용

### 3. Pick/Omit에서 존재하지 않는 키
❌ `Pick<User, 'nonexistent'>` - 컴파일 에러
✅ keyof로 존재하는 키만 사용

### 4. Record의 타입 안전성
❌ `Record<string, any>` - any 사용
✅ `Record<string, unknown>` 후 타입 가드

### 5. ReturnType에 함수 타입 대신 함수 전달
❌ `ReturnType<myFunction>` - 에러
✅ `ReturnType<typeof myFunction>` - typeof 사용

## Best Practices

**✅ Partial로 업데이트 API 타입**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

function updateUser(id: string, data: Partial<User>) {
  // 일부 필드만 업데이트
}
```

**✅ Omit으로 민감 정보 제거**
```typescript
type UserResponse = Omit<User, 'password' | 'salt'>;
```

**✅ Pick으로 DTO 생성**
```typescript
type UserListItem = Pick<User, 'id' | 'name' | 'avatar'>;
```

**✅ Record로 타입 안전한 맵**
```typescript
const statusColors: Record<Status, string> = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
};
```

**✅ ReturnType + Awaited 조합**
```typescript
async function fetchUser() {
  return { id: '1', name: 'Alice' };
}

type User = Awaited<ReturnType<typeof fetchUser>>;
```

**✅ 유틸리티 체인**
```typescript
type UpdateUserDTO = Partial<Omit<User, 'id' | 'createdAt'>>;
```

## 유틸리티 타입 구현 원리

```typescript
// Partial 구현
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Pick 구현
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit 구현
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// ReturnType 구현
type MyReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any;
```

## 다음 단계

이 모듈을 완료했다면:
- **[07-tsconfig-deep-dive](../07-tsconfig-deep-dive/)** - tsconfig.json 완전 정복
- **[08-type-vs-runtime](../08-type-vs-runtime/)** - 타입 소거와 런타임 이해

## 참고 자료

### 공식 문서
- [TypeScript Handbook - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

### 소스 코드
- [lib.es5.d.ts](https://github.com/microsoft/TypeScript/blob/main/lib/lib.es5.d.ts) - 유틸리티 타입 구현

---

**시작하기:** [01-partial-required.ts](./01-partial-required.ts)
