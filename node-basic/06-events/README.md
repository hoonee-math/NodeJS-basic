# 06. EventEmitter와 이벤트 기반 프로그래밍

Node.js의 `EventEmitter`를 사용한 이벤트 기반 프로그래밍을 학습합니다. 이벤트 리스너 등록, 발생, 제거 및 커스텀 EventEmitter 클래스 생성 방법을 다룹니다.

## 학습 목표

- EventEmitter의 기본 개념 이해하기
- 이벤트 리스너 등록/제거하기 (on, once, off)
- 이벤트에 데이터 전달하기
- error 이벤트의 특별한 처리 방법
- EventEmitter를 상속받는 커스텀 클래스 만들기
- Event-Driven 아키텍처 패턴 이해하기

## 목차

1. **[01-basic-emitter.js](#01-basic-emitterjs)** - EventEmitter 기본 사용법
2. **[02-on-once-off.js](#02-on-once-offjs)** - 리스너 등록/제거 (on, once, off)
3. **[03-event-arguments.js](#03-event-argumentsjs)** - 이벤트에 데이터 전달
4. **[04-error-events.js](#04-error-eventsjs)** - error 이벤트 특별 처리
5. **[05-custom-emitter.js](#05-custom-emitterjs)** - EventEmitter 상속 클래스
6. **[06-real-world-example.js](#06-real-world-examplejs)** - 실전: 주문 처리 시스템

---

## 예제 파일 상세

### [01-basic-emitter.js](01-basic-emitter.js)

**주제**: EventEmitter 기본 사용법

**사용 메서드/속성**:
- `EventEmitter` - Node.js 내장 이벤트 시스템 클래스
- `emitter.on(event, listener)` - 이벤트 리스너 등록. 같은 이벤트에 여러 리스너 등록 가능
- `emitter.emit(event, ...args)` - 이벤트 발생. 등록된 리스너들이 순서대로 실행됨
- `emitter.listenerCount(event)` - 특정 이벤트의 리스너 개수 반환
- `emitter.eventNames()` - 등록된 모든 이벤트 이름 배열 반환

---

### [02-on-once-off.js](02-on-once-off.js)

**주제**: 이벤트 리스너 등록/제거

**사용 메서드/속성**:
- `emitter.on(event, listener)` - 이벤트가 발생할 때마다 계속 실행
- `emitter.once(event, listener)` - 첫 번째 이벤트만 처리하고 자동으로 제거됨
- `emitter.off(event, listener)` - 특정 리스너 제거 (removeListener와 동일)
- `emitter.removeAllListeners(event)` - 특정 이벤트의 모든 리스너 제거
- **주의**: off()로 제거하려면 리스너가 named function이어야 함 (화살표 함수나 익명 함수는 제거 불가)

**활용**:
- `on()`: 지속적인 이벤트 처리 (데이터 수신, 상태 변경 등)
- `once()`: 일회성 이벤트 (초기화, 첫 연결, 타임아웃 등)

---

### [03-event-arguments.js](03-event-arguments.js)

**주제**: 이벤트에 데이터 전달하기

**사용 메서드/속성**:
- `emitter.emit(event, arg1, arg2, ...)` - 여러 인자를 이벤트와 함께 전달
- **단일 인자**: `emit('user:login', username)`
- **여러 인자**: `emit('order', orderId, amount, product)`
- **객체 (권장)**: `emit('task:done', { name, duration, success })` - 확장성과 가독성 좋음
- **배열**: `emit('data:batch', [...items])`

**실전 예제**:
- 진행률 업데이트: `emit('progress', { current, total })`
- 에러 전달: `emit('error', errorObject)`
- 상태 변경: `emit('state:change', { oldState, newState })`

---

### [04-error-events.js](04-error-events.js)

**주제**: error 이벤트의 특별한 처리

**사용 메서드/속성**:
- `emitter.on('error', (err) => { ... })` - **error 리스너는 필수!**
- **특별한 점**: error 이벤트에 리스너가 없으면 프로세스가 crash됨
- `Error` 객체 사용 - 문자열 대신 Error 객체로 전달 (err.message, err.code 등)
- `err.code` - 에러 타입 구분용 추가 속성 (NETWORK_ERROR, AUTH_FAILED 등)

**Best Practices**:
1. EventEmitter 생성 직후 error 리스너 먼저 등록
2. Error 객체에 code나 statusCode 추가
3. 에러 타입별로 다른 처리 로직 구현

---

### [05-custom-emitter.js](05-custom-emitter.js)

**주제**: EventEmitter를 상속받는 커스텀 클래스

**사용 메서드/속성**:
- `class MyClass extends EventEmitter` - EventEmitter 상속
- `super()` - 생성자에서 부모 클래스 호출 (필수!)
- `this.emit(event, data)` - 클래스 내부에서 이벤트 발생
- **return this** - 메서드 체이닝 패턴 구현

**실전 예제**:
- Timer 클래스: start, complete 이벤트
- HttpRequest 클래스: request, response, error 이벤트
- DataStream 클래스: data, end 이벤트
- Logger 클래스: log 이벤트 + 메서드 체이닝

---

### [06-real-world-example.js](06-real-world-example.js)

**주제**: Event-Driven 아키텍처 - 주문 처리 시스템

**이벤트 흐름**:
1. `order:created` → 주문 접수
2. `order:processing` → 결제 처리 시작
3. `payment:success` 또는 `payment:failed` → 결제 결과
4. `shipping:started` → 배송 시작
5. `order:completed` → 주문 완료

**Event-Driven 장점**:
- **느슨한 결합**: 각 모듈이 독립적으로 동작
- **확장성**: 새로운 리스너 추가 쉬움 (이메일, 로깅, 통계 등)
- **유지보수**: 기능 추가/수정이 기존 코드에 영향 없음

---

## 핵심 정리

### EventEmitter 기본

```javascript
const EventEmitter = require('events');
const emitter = new EventEmitter();

// 리스너 등록
emitter.on('event', (data) => {
  console.log('이벤트 발생:', data);
});

// 이벤트 발생
emitter.emit('event', 'Hello');
```

### on, once, off

```javascript
// on - 계속 실행
emitter.on('data', () => { /* ... */ });

// once - 한 번만 실행
emitter.once('connect', () => { /* ... */ });

// off - 리스너 제거
function handler() { /* ... */ }
emitter.on('message', handler);
emitter.off('message', handler);

// 모든 리스너 제거
emitter.removeAllListeners('event');
```

### 이벤트 인자 전달

```javascript
// 여러 인자
emitter.emit('user:login', userId, username, timestamp);

// 객체 (권장)
emitter.emit('order:created', {
  id: 1001,
  product: '노트북',
  amount: 1500000
});
```

### error 이벤트

```javascript
// error 리스너는 필수!
emitter.on('error', (err) => {
  console.error('에러:', err.message);
});

// error 발생
emitter.emit('error', new Error('문제 발생'));
```

### 커스텀 EventEmitter

```javascript
class MyEmitter extends EventEmitter {
  constructor() {
    super();  // 필수!
  }

  doSomething() {
    // 작업 수행
    this.emit('done', result);
  }
}

const emitter = new MyEmitter();
emitter.on('done', (result) => { /* ... */ });
emitter.doSomething();
```

---

## Event-Driven 아키텍처

### 장점

1. **느슨한 결합 (Loose Coupling)**
   - 모듈 간 직접적인 의존성 제거
   - 독립적으로 개발/테스트 가능

2. **확장성**
   - 새로운 리스너 추가가 쉬움
   - 기존 코드 수정 없이 기능 추가

3. **유연성**
   - 런타임에 리스너 등록/제거 가능
   - 동적인 동작 구성

### 주의사항

1. **메모리 누수 방지**
   ```javascript
   // 리스너가 더 이상 필요 없으면 제거
   emitter.off('event', handler);
   ```

2. **error 이벤트 필수 처리**
   ```javascript
   // error 리스너 없으면 프로세스 crash!
   emitter.on('error', (err) => { /* 처리 */ });
   ```

3. **과도한 리스너 경고**
   ```javascript
   // 기본값: 10개 초과 시 경고
   emitter.setMaxListeners(20);  // 조정 가능
   ```

---

## 실전 활용 사례

### HTTP 서버
```javascript
const server = http.createServer();
server.on('request', (req, res) => { /* ... */ });
server.on('error', (err) => { /* ... */ });
```

### 스트림
```javascript
const stream = fs.createReadStream('file.txt');
stream.on('data', (chunk) => { /* ... */ });
stream.on('end', () => { /* ... */ });
stream.on('error', (err) => { /* ... */ });
```

### 웹소켓
```javascript
const ws = new WebSocket(url);
ws.on('open', () => { /* ... */ });
ws.on('message', (data) => { /* ... */ });
ws.on('close', () => { /* ... */ });
ws.on('error', (err) => { /* ... */ });
```

---

## 참고 자료

- [Node.js Events 공식 문서](https://nodejs.org/api/events.html)
- [EventEmitter API](https://nodejs.org/api/events.html#class-eventemitter)
- [Event-Driven Programming](https://en.wikipedia.org/wiki/Event-driven_programming)

---

## 다음 단계

- **07-streams** - Stream을 활용한 효율적인 데이터 처리
- **08-error-handling** - 에러 처리 패턴과 디버깅
- **09-npm-packages** - 외부 패키지 활용
