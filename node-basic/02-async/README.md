# 02. 비동기 처리 (Async)

Node.js의 핵심인 **비동기 프로그래밍**을 단계별로 학습합니다.

## 학습 목표

- Callback 함수의 개념과 사용법
- Callback Hell 문제점 이해
- Promise로 비동기 처리 개선하기
- async/await 문법 익히기
- 동시성 처리 (Promise.all, Promise.race)
- 비동기 에러 처리 패턴

## 예제 파일 순서

1. **[01-callback-basics.js](01-callback-basics.js)** - Callback 함수 기초
2. **[02-callback-hell.js](02-callback-hell.js)** - Callback Hell 문제
3. **[03-promise-basics.js](03-promise-basics.js)** - Promise 기초
4. **[04-promise-chaining.js](04-promise-chaining.js)** - Promise 체이닝
5. **[05-async-await.js](05-async-await.js)** - async/await 문법
6. **[06-promise-all-race.js](06-promise-all-race.js)** - 동시성 처리
7. **[07-error-handling.js](07-error-handling.js)** - 비동기 에러 처리

## 핵심 개념 및 사용 메서드

### [01-callback-basics.js](01-callback-basics.js)

**주제**: Callback 함수의 기초

**Callback이란?**:
- 다른 함수에 인자로 전달되는 함수
- 비동기 작업이 완료된 후 실행됨
- Node.js의 전통적인 비동기 처리 방식

**사용 메서드**:
- `setTimeout(callback, ms)` - ms 후 callback 실행
- `fs.readFile(path, encoding, callback)` - 파일 읽기 완료 후 callback 실행
- `callback(err, result)` - Node.js의 에러 우선 콜백 패턴 (Error-first callback)

**핵심 패턴**:
```javascript
// 에러 우선 콜백 패턴
function asyncOperation(callback) {
  if (error) {
    callback(error, null);  // 첫 번째 인자: 에러
  } else {
    callback(null, result); // 두 번째 인자: 결과
  }
}
```

---

### [02-callback-hell.js](02-callback-hell.js)

**주제**: Callback Hell (콜백 지옥)

**Callback Hell이란?**:
- 콜백 안에 콜백이 중첩되어 코드가 피라미드 형태로 깊어지는 현상
- 가독성 저하, 유지보수 어려움, 에러 처리 복잡

**문제점**:
- 들여쓰기가 깊어져서 코드 읽기 어려움
- 에러 처리를 각 단계마다 해야 함
- 코드 흐름 파악이 힘듦

**예시**:
```javascript
// Callback Hell
fs.readFile('file1.txt', (err1, data1) => {
  if (err1) return console.error(err1);
  fs.readFile('file2.txt', (err2, data2) => {
    if (err2) return console.error(err2);
    fs.readFile('file3.txt', (err3, data3) => {
      if (err3) return console.error(err3);
      // 더 깊어짐...
    });
  });
});
```

---

### [03-promise-basics.js](03-promise-basics.js)

**주제**: Promise 기초

**Promise란?**:
- 비동기 작업의 최종 완료 또는 실패를 나타내는 객체
- Callback Hell을 해결하기 위해 ES6에 추가됨
- 3가지 상태: Pending(대기), Fulfilled(이행), Rejected(거부)

**Promise 생성**:
- `new Promise((resolve, reject) => {})` - Promise 객체 생성
- `resolve(value)` - 성공 시 호출. value를 다음 then으로 전달
- `reject(error)` - 실패 시 호출. error를 catch로 전달

**Promise 사용**:
- `.then(callback)` - 성공 시 실행될 콜백 등록
- `.catch(callback)` - 실패 시 실행될 콜백 등록
- `.finally(callback)` - 성공/실패 관계없이 항상 실행

**Promise 상태**:
```javascript
// Pending → Fulfilled
const promise = new Promise((resolve) => {
  resolve('성공');
});

// Pending → Rejected
const promise2 = new Promise((_, reject) => {
  reject(new Error('실패'));
});
```

---

### [04-promise-chaining.js](04-promise-chaining.js)

**주제**: Promise 체이닝 (Chaining)

**Promise Chaining이란?**:
- `.then()`을 연속으로 연결하여 순차적 비동기 작업 수행
- 각 `.then()`은 새로운 Promise를 반환
- Callback Hell을 평탄하게 만듦

**체이닝 규칙**:
- `.then()`에서 값을 return하면 다음 `.then()`으로 전달됨
- `.then()`에서 Promise를 return하면 그 Promise가 완료될 때까지 대기
- 체인 어디서든 에러 발생 시 가장 가까운 `.catch()`로 이동

**예시**:
```javascript
fetchUser()
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => console.log(comments))
  .catch(error => console.error(error));
```

---

### [05-async-await.js](05-async-await.js)

**주제**: async/await 문법

**async/await란?**:
- ES2017(ES8)에 추가된 비동기 처리 문법
- Promise를 더 쉽게 사용할 수 있게 해주는 syntactic sugar
- 동기 코드처럼 보이지만 비동기로 동작

**async 함수**:
- `async function name() {}` - 항상 Promise를 반환하는 함수
- 함수 내부에서 `await` 키워드 사용 가능
- return 값은 자동으로 Promise.resolve()로 감싸짐

**await 키워드**:
- `await promise` - Promise가 완료될 때까지 기다림
- Promise의 결과값을 반환 (동기 코드처럼 보임)
- async 함수 내부에서만 사용 가능
- Top-level await는 ES Modules에서만 가능

**에러 처리**:
- `try-catch` 문으로 에러 처리
- Promise의 `.catch()`와 동일한 역할

**예시**:
```javascript
async function fetchData() {
  try {
    const user = await fetchUser();
    const posts = await fetchPosts(user.id);
    return posts;
  } catch (error) {
    console.error(error);
  }
}
```

---

### [06-promise-all-race.js](06-promise-all-race.js)

**주제**: 동시성 처리 (Concurrency)

**동시에 여러 비동기 작업 처리**:

**1. Promise.all()**:
- `Promise.all([promise1, promise2, ...])` - 모든 Promise가 완료될 때까지 대기
- 모든 Promise가 성공하면 결과 배열 반환
- 하나라도 실패하면 즉시 reject (fail-fast)
- 병렬 처리로 시간 절약 가능

**2. Promise.race()**:
- `Promise.race([promise1, promise2, ...])` - 가장 먼저 완료되는 Promise 반환
- 성공/실패 관계없이 가장 빠른 것 반환
- 타임아웃 구현에 유용

**3. Promise.allSettled()**:
- `Promise.allSettled([promise1, promise2, ...])` - 모든 Promise가 완료될 때까지 대기
- 성공/실패 관계없이 모든 결과 반환
- 각 결과는 `{ status, value/reason }` 형태

**4. Promise.any()**:
- `Promise.any([promise1, promise2, ...])` - 가장 먼저 성공하는 Promise 반환
- 모두 실패해야 reject

**사용 예시**:
```javascript
// 병렬 처리로 시간 절약
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);

// 타임아웃 구현
const result = await Promise.race([
  fetchData(),
  timeout(5000)  // 5초 안에 완료 안 되면 실패
]);
```

---

### [07-error-handling.js](07-error-handling.js)

**주제**: 비동기 에러 처리

**1. Callback 에러 처리**:
- Error-first callback 패턴 사용
- 첫 번째 인자로 에러 체크

**2. Promise 에러 처리**:
- `.catch(error => {})` - 체인 어디서든 에러 발생 시 포착
- `.then(success, error)` - 두 번째 인자로 에러 핸들러
- `.finally()` - 성공/실패 관계없이 항상 실행 (정리 작업)

**3. async/await 에러 처리**:
- `try-catch` 블록 사용
- catch 블록에서 에러 처리
- finally 블록으로 정리 작업

**에러 처리 패턴**:
```javascript
// Promise
fetchData()
  .then(result => processData(result))
  .catch(error => console.error('에러 발생:', error))
  .finally(() => console.log('작업 완료'));

// async/await
async function getData() {
  try {
    const result = await fetchData();
    return processData(result);
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    console.log('작업 완료');
  }
}
```

**주의사항**:
- 반드시 에러 처리를 해야 함 (안 하면 UnhandledPromiseRejection)
- async 함수는 자동으로 Promise를 반환하므로 .catch() 필요할 수 있음

---

## 비동기 처리 방식 비교

### 발전 과정
```
Callback → Promise → async/await
(2009)     (2015)     (2017)
```

### 같은 작업을 다르게 표현

```javascript
// 1. Callback
fs.readFile('file.txt', 'utf-8', (err, data) => {
  if (err) return console.error(err);
  console.log(data);
});

// 2. Promise
fs.promises.readFile('file.txt', 'utf-8')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// 3. async/await
async function readFile() {
  try {
    const data = await fs.promises.readFile('file.txt', 'utf-8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### 언제 무엇을 사용할까?

| 상황 | 권장 방식 |
|------|----------|
| 최신 코드 작성 | **async/await** |
| 레거시 코드 | Callback (이해 필요) |
| 여러 작업 병렬 처리 | **Promise.all** + async/await |
| 에러 처리 중요 | **async/await** + try-catch |
| 라이브러리 API | Promise 반환 권장 |

---

## 핵심 정리

### Callback
- ✅ Node.js 전통 방식
- ❌ Callback Hell 발생
- ❌ 에러 처리 복잡

### Promise
- ✅ Callback Hell 해결
- ✅ 체이닝으로 깔끔한 코드
- ✅ 에러 처리 간편 (.catch)
- ❌ 여전히 .then() 중첩 가능

### async/await
- ✅ 가장 읽기 쉬운 코드
- ✅ 동기 코드처럼 작성
- ✅ try-catch로 직관적 에러 처리
- ✅ 현대적인 JavaScript 표준

**결론**: 새로운 코드는 **async/await**를 사용하되, Callback과 Promise도 이해해야 합니다!

---

## 참고 자료

- [MDN - Callback Functions](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)
- [MDN - Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN - async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info - Async/await](https://javascript.info/async-await)
- [Node.js 비동기 프로그래밍](https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control)
