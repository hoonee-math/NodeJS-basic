# 11. 비동기 TypeScript (Async TypeScript)

Promise와 async/await를 **타입 안전하게** 다루는 방법을 배웁니다. 비동기 코드의 타입 처리는 TypeScript 실무에서 가장 중요한 스킬 중 하나입니다.

## 학습 목표

- **Promise 제네릭 타입** 완전 이해
- **async/await 타입 추론**
- **Promise.all/race/allSettled** 타입
- **에러 처리**와 타입
- **비동기 제네릭 함수** 작성

## 목차

### Promise 기초
- [01-promise-types.ts](#01-promise-typests) - Promise 제네릭 타입
- [02-async-await-types.ts](#02-async-await-typests) - async/await 타입 추론
- [03-promise-combinators.ts](#03-promise-combinatorsts) - Promise.all/race/allSettled

### 에러 처리
- [04-async-error-handling.ts](#04-async-error-handlingts) - try/catch 타입
- [05-result-type-pattern.ts](#05-result-type-patternts) - Result 타입 패턴

### 고급 패턴
- [06-async-generators.ts](#06-async-generatorsts) - AsyncIterator, AsyncGenerator
- [07-async-utility-functions.ts](#07-async-utility-functionsts) - 비동기 유틸리티 함수
- [08-concurrent-control.ts](#08-concurrent-controlts) - 동시성 제어

### 실전
- [09-practical-examples.ts](#09-practical-examplests) - 실전 비동기 패턴

## 예제 파일 개요

### 01-promise-types.ts
**Promise 제네릭 타입**

- Promise\<T\> 기본 타입
- Promise 생성 타입
- then, catch, finally 타입
- Promise 체이닝 타입
- void Promise
- never Promise
- Promise\<Promise\<T\>\> 평탄화

### 02-async-await-types.ts
**async/await 타입 추론**

- async 함수 반환 타입 (항상 Promise)
- await 타입 추론
- Awaited\<T\> 유틸리티 타입
- async 함수 에러 타입
- void vs Promise\<void\>
- async IIFE 타입

### 03-promise-combinators.ts
**Promise 조합 함수**

- Promise.all 타입 (튜플 유지)
- Promise.race 타입
- Promise.allSettled 타입
- Promise.any 타입
- 제네릭 Promise 배열
- 타입 추론 최적화

### 04-async-error-handling.ts
**비동기 에러 처리**

- try/catch 타입
- unknown vs Error 타입
- 타입 가드로 에러 좁히기
- Promise.catch 타입
- 커스텀 에러 타입
- 에러 래핑 패턴

### 05-result-type-pattern.ts
**Result 타입 패턴**

- Result\<T, E\> 타입 정의
- Success, Failure 판별 유니온
- 에러를 값으로 처리
- Railway Oriented Programming
- Option 타입 (Some, None)
- Rust 스타일 Result

### 06-async-generators.ts
**AsyncIterator, AsyncGenerator**

- AsyncIterator\<T\> 타입
- AsyncGenerator\<T\> 타입
- async function* 타입
- for await...of 타입
- 무한 스트림 타입
- 페이지네이션 제너레이터

### 07-async-utility-functions.ts
**비동기 유틸리티 함수**

- 제네릭 retry 함수
- 제네릭 timeout 함수
- 제네릭 debounce/throttle
- 제네릭 cache 함수
- 제네릭 queue 함수
- parallel/sequential 실행

### 08-concurrent-control.ts
**동시성 제어**

- 동시 실행 수 제한
- Promise pool 구현
- 순차 실행 vs 병렬 실행
- 타입 안전한 워커 풀
- Semaphore 패턴
- 배압(backpressure) 처리

### 09-practical-examples.ts
**실전 비동기 패턴**

- API 호출 타입
- 파일 I/O 비동기 타입
- 데이터베이스 쿼리 타입
- 캐싱 전략 타입
- 재시도 로직 타입
- 타임아웃 처리 타입
- 배치 처리 타입

## 핵심 개념 요약

### Promise 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| **Promise\<T\>** | T를 resolve하는 Promise | `Promise<number>` |
| **Promise\<void\>** | 값 없이 완료 | `Promise<void>` |
| **Promise\<never\>** | 절대 resolve 안 됨 | 무한 대기 |
| **Awaited\<T\>** | Promise를 unwrap | `Awaited<Promise<string>>` → `string` |

### async 함수 타입

```typescript
// async 함수는 항상 Promise 반환
async function fetchUser(): Promise<User> {
  return { id: '1', name: 'Alice' };
}

// await는 Promise를 unwrap
async function main() {
  const user = await fetchUser();  // User 타입 (Promise 아님)
}
```

### Promise 조합 함수 타입

| 함수 | 입력 | 반환 타입 |
|------|------|-----------|
| **Promise.all([p1, p2])** | `[Promise<A>, Promise<B>]` | `Promise<[A, B]>` (튜플 유지) |
| **Promise.race([p1, p2])** | `[Promise<A>, Promise<B>]` | `Promise<A \| B>` |
| **Promise.allSettled([...])** | `Promise<T>[]` | `Promise<PromiseSettledResult<T>[]>` |
| **Promise.any([...])** | `Promise<T>[]` | `Promise<T>` |

### 에러 타입

| 패턴 | 타입 | 장단점 |
|------|------|--------|
| **try/catch** | `unknown` (catch 블록) | 간단, 타입 가드 필요 |
| **Result\<T, E\>** | `Success<T> \| Failure<E>` | 명시적, 함수형 |
| **.catch()** | `Promise<T>` | 체이닝, 타입 보존 어려움 |

## 언제 무엇을 쓸까?

| 상황 | 선택 | 이유 |
|------|------|------|
| 여러 Promise 동시 실행 | Promise.all | 모두 성공 필요 |
| 첫 성공한 Promise | Promise.race | 가장 빠른 것 |
| 일부 실패 허용 | Promise.allSettled | 모든 결과 확인 |
| 하나라도 성공하면 | Promise.any | 첫 성공만 |
| 순차 실행 | for...of + await | 의존성 있을 때 |
| 에러를 값으로 | Result\<T, E\> | 함수형 접근 |

## 자주 하는 실수

### 1. async 없이 Promise 반환
❌ `function fetchUser(): Promise<User> { return { ... }; }` - 에러
✅ `async function fetchUser(): Promise<User> { return { ... }; }`

### 2. Promise.all에서 타입 손실
❌ `Promise.all(promises)` - `Promise<any[]>`로 추론
✅ `Promise.all([p1, p2] as const)` - 튜플 타입 유지

### 3. await 없이 Promise 사용
❌ `const user = fetchUser();` - Promise\<User\> 타입
✅ `const user = await fetchUser();` - User 타입

### 4. catch 블록에서 타입 단언
❌ `catch (err) { (err as Error).message }`
✅ `catch (err) { if (err instanceof Error) { err.message } }`

### 5. void vs Promise\<void\> 혼동
❌ `function process(): void { return doAsync(); }` - Promise\<void\> 반환
✅ `async function process(): Promise<void> { await doAsync(); }`

## Best Practices

**✅ async 함수는 Promise\<T\> 명시**
```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/users/${id}`);
  return response.json();
}
```

**✅ Promise.all로 병렬 실행**
```typescript
async function loadUserData(userId: string) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchPosts(userId),
    fetchComments(userId),
  ]);
  return { user, posts, comments };
}
```

**✅ Result 타입으로 에러 처리**
```typescript
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

async function safeF fetch<T>(url: string): Promise<Result<T>> {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

// 사용
const result = await safeFetch<User>('/api/user');
if (result.success) {
  console.log(result.data);  // User 타입
} else {
  console.error(result.error);  // Error 타입
}
```

**✅ Awaited로 중첩 Promise 평탄화**
```typescript
type NestedPromise = Promise<Promise<string>>;
type Unwrapped = Awaited<NestedPromise>;  // string
```

**✅ 제네릭 비동기 함수**
```typescript
async function retry<T>(
  fn: () => Promise<T>,
  times: number = 3
): Promise<T> {
  for (let i = 0; i < times; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === times - 1) throw err;
    }
  }
  throw new Error('Unreachable');
}

// 사용
const user = await retry(() => fetchUser('123'));  // User 타입
```

**✅ AsyncIterator로 스트림 처리**
```typescript
async function* fetchPages<T>(url: string): AsyncGenerator<T[]> {
  let page = 1;
  while (true) {
    const response = await fetch(`${url}?page=${page}`);
    const data: T[] = await response.json();
    if (data.length === 0) break;
    yield data;
    page++;
  }
}

// 사용
for await (const users of fetchPages<User>('/api/users')) {
  console.log(users);  // User[] 타입
}
```

## 다음 단계

이 모듈을 완료했다면:
- **[12-modules-imports](../12-modules-imports/)** - ES6 모듈, import/export
- **[13-decorators](../13-decorators/)** - 데코레이터 패턴

## 참고 자료

### 공식 문서
- [TypeScript Handbook - Promises](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#promises)
- [Awaited Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)
- [Promise API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

### 추가 학습
- [Async Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
- [Railway Oriented Programming](https://fsharpforfunandprofit.com/rop/)

---

**시작하기:** [01-promise-types.ts](./01-promise-types.ts)
