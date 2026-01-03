## ExpressJS vs NestJS 차이 비교

![Image](https://indapoint-livesite.b-cdn.net/wp-content/uploads/2022/09/Express-Js-Architecture.png)

![Image](https://miro.medium.com/v2/0%2Ax318bLrEpHGA5GxA.jpg)

![Image](https://docs.nestjs.com/assets/Components_1.png)

![Image](https://media.geeksforgeeks.org/wp-content/uploads/20211007175759/MiddlewareChaining.png)

Node.js 기반 백엔드 개발에서 **ExpressJS**와 **NestJS**는 가장 자주 비교되는 두 프레임워크야.
둘은 철학부터 규모 지향점까지 꽤 뚜렷하게 다르다.

---

## 1. 기본 개념과 철학

### ExpressJS

* **최소한의 추상화**
* HTTP 서버를 빠르게 만드는 데 집중
* 구조, 규칙, 패턴을 **개발자가 직접 결정**
* “필요한 것만 제공”

👉 *자유도 극대화, 대신 책임도 전부 개발자 몫*

### NestJS

* **아키텍처 중심 프레임워크**
* Angular에서 영향을 받은 구조
* Controller / Service / Module 기반
* **DI(의존성 주입)**, 데코레이터 적극 활용

👉 *규칙과 표준을 제공, 대규모 서비스에 최적화*

---

## 2. 구조와 코드 스타일

| 구분         | ExpressJS | NestJS   |
| ---------- | --------- | -------- |
| 프로젝트 구조    | 자유        | 강제된 구조   |
| 진입 장벽      | 매우 낮음     | 상대적으로 높음 |
| 코드 스타일     | 함수 중심     | 클래스 중심   |
| TypeScript | 선택        | 기본       |
| 확장성        | 설계에 따라 다름 | 기본적으로 높음 |

### 예시 차이 (개념)

**ExpressJS**

```js
app.get('/users', (req, res) => {
  res.send('users');
});
```

**NestJS**

```ts
@Controller('users')
export class UserController {
  @Get()
  findAll() {
    return 'users';
  }
}
```

---

## 3. 의존성 주입(DI)과 테스트

### ExpressJS

* DI 시스템 없음
* 직접 객체 생성하거나 외부 라이브러리 사용
* 테스트 코드 작성 시 구조 설계가 중요

### NestJS

* 프레임워크 내장 DI 컨테이너
* Service 간 의존성 자동 관리
* 단위 테스트, Mocking 매우 쉬움

👉 **테스트 친화성은 NestJS 압승**

---

## 4. 미들웨어 & 확장 생태계

| 항목     | ExpressJS  | NestJS          |
| ------ | ---------- | --------------- |
| 미들웨어   | Express 방식 | Express 기반 + 확장 |
| 파이프    | ❌          | ⭕               |
| 가드     | ❌          | ⭕               |
| 인터셉터   | ❌          | ⭕               |
| 필터(예외) | ❌          | ⭕               |

NestJS는 **HTTP 레이어를 넘어서 애플리케이션 레벨 추상화**를 제공함.

---

## 5. 규모별 적합도

### ExpressJS가 잘 맞는 경우

* 간단한 API 서버
* POC, 사이드 프로젝트
* 구조를 직접 설계하고 싶은 경우
* Node.js 개념 학습 목적

### NestJS가 잘 맞는 경우

* 중·대규모 서비스
* 팀 단위 개발
* 장기 운영 프로젝트
* Spring 경험자
* 명확한 아키텍처가 필요한 경우

---

## 6. Spring 경험자 관점에서의 비교

| Spring 개념  | NestJS | ExpressJS |
| ---------- | ------ | --------- |
| Controller | ⭕      | 직접 구현     |
| Service    | ⭕      | 직접 구현     |
| DI 컨테이너    | ⭕      | ❌         |
| Annotation | 데코레이터  | ❌         |
| 구조 강제      | ⭕      | ❌         |

👉 **Spring → NestJS 전환은 매우 자연스러움**

---

## 7. 한 줄 요약

* **ExpressJS**
  → *가볍고 자유로운 대신, 설계는 전부 네 책임*

* **NestJS**
  → *무겁지만 견고하고, 팀과 장기 운영에 최적*

---

## 추천 정리

* **학습 / 소규모** → ExpressJS
* **실무 / 확장 / 팀 개발** → NestJS