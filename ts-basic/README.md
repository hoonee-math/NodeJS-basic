# TypeScript 기본 학습 (ts-basic)

Node.js 기초를 마스터했다면, 이제 TypeScript로 타입 안전성을 더할 차례입니다. 이 모듈은 **node-basic의 JavaScript 지식에 TypeScript 타입 시스템을 더하고**, nest-basic으로 자연스럽게 넘어가기 위한 체계적인 학습 경로를 제공합니다.

## 학습 목표

- TypeScript 타입 시스템 완전 이해
- 컴파일 타임 vs 런타임 명확한 구분
- 실무에서 마주치는 핵심 패턴 습득
- tsconfig.json 설정 마스터
- NestJS 학습을 위한 데코레이터와 DI 패턴 이해

## 학습 로드맵

### 1단계: TypeScript 기초
- **[01-typescript-basics](./01-typescript-basics/)** - 기본 타입, 타입 추론, 타입 어노테이션
- **[02-functions-types](./02-functions-types/)** - 함수 타입, 오버로드, 시그니처
- **[03-classes-interfaces](./03-classes-interfaces/)** - 클래스, 인터페이스, 추상 클래스

### 2단계: 고급 타입 시스템
- **[04-advanced-types](./04-advanced-types/)** - 유니온, 인터섹션, 리터럴 타입
- **[05-generics](./05-generics/)** - 제네릭, 제약 조건, 조건부 타입
- **[06-utility-types](./06-utility-types/)** - Partial, Required, Pick, Omit 등 내장 유틸리티

### 3단계: 실무 핵심 개념 ⭐
- **[07-tsconfig-deep-dive](./07-tsconfig-deep-dive/)** - tsconfig.json 완전 정복
  - 기본 설정 vs Node.js 전용 설정
  - strict 옵션들의 의미
  - 컴파일러 옵션별 영향 분석

- **[08-type-vs-runtime](./08-type-vs-runtime/)** - 타입 소거와 런타임
  - 타입은 컴파일 타임에만 존재
  - instanceof가 불가능한 이유
  - 런타임 타입 체크 전략

- **[09-practical-patterns](./09-practical-patterns/)** - 실무 핵심 패턴
  - `interface` vs `type` - 언제 무엇을 쓸까?
  - `enum`은 왜 꺼려지나? `union literal`과의 비교
  - `readonly` vs `const` - 불변성의 한계와 활용

### 4단계: Node.js + TypeScript
- **[10-node-with-ts](./10-node-with-ts/)** - Node.js API를 TypeScript로 작성
- **[11-async-typescript](./11-async-typescript/)** - Promise, async/await 타입 처리
- **[12-modules-imports](./12-modules-imports/)** - ES6 모듈, import/export, CommonJS 호환

### 5단계: NestJS 준비
- **[13-decorators](./13-decorators/)** - 데코레이터 패턴 (NestJS 핵심 문법)
- **[14-dependency-injection](./14-dependency-injection/)** - DI 패턴 이해
- **[15-real-world-project](./15-real-world-project/)** - 종합 실전 프로젝트

## 학습 순서

```
node-basic (완료)
    ↓
ts-basic (현재)
    ↓
nest-basic (다음)
```

**권장 학습 흐름:**
1. 1-2단계로 TypeScript 타입 시스템 기초 다지기
2. **3단계는 필수!** 실무에서 자주 겪는 혼란 해소
3. 4단계에서 Node.js와 TypeScript 결합
4. 5단계로 NestJS를 위한 고급 패턴 준비

## 환경 설정

### 이미 준비된 것들

```bash
# 패키지 이미 설치됨
npm install  # 또는 패키지 확인
```

**설치된 패키지:**
- `typescript` - TypeScript 컴파일러
- `ts-node` - TypeScript 파일 직접 실행
- `@types/node` - Node.js 타입 정의

**tsconfig.json:**
- `strict: true` - 엄격한 타입 체크
- `module: "nodenext"` - 최신 Node.js 모듈 시스템
- `target: "esnext"` - 최신 JavaScript 기능 사용

## 실행 방법

```bash
# TypeScript 파일 직접 실행
npx ts-node src/01-typescript-basics/01-basic-types.ts

# 컴파일 후 실행
npx tsc
node dist/01-typescript-basics/01-basic-types.js

# 타입 체크만
npx tsc --noEmit
```

## 핵심 차별점

이 학습 과정은 단순히 TypeScript 문법을 배우는 것이 아닙니다:

✅ **타입 vs 런타임 명확한 구분** - 가장 흔한 실수 방지
✅ **interface vs type 실전 선택 기준** - 언제 무엇을 쓸지 판단 능력
✅ **enum 대신 union literal 사용 이유** - 번들 크기와 성능
✅ **readonly의 한계** - 얕은 불변성 이해
✅ **tsconfig 실전 설정** - 프로젝트마다 다른 설정 능력

## 3단계가 특별한 이유

대부분의 TypeScript 초보자가 겪는 혼란:

```typescript
// ❓ 왜 이렇게 하면 안 될까?
interface User {
  name: string;
}

function checkUser(obj: any) {
  if (obj instanceof User) {  // ❌ 에러!
    // ...
  }
}

// ❓ enum vs union, 뭐가 다를까?
enum Color { Red, Green, Blue }           // 런타임 코드 생성
type ColorLiteral = 'red' | 'green' | 'blue';  // 타입만 존재

// ❓ interface vs type, 언제 뭘 쓸까?
interface A extends B { }       // interface는 extends
type A = B & { }                // type은 intersection
```

**→ 3단계에서 이 모든 의문을 해결합니다!**

## 실습 체크리스트

각 단계를 완료하며 체크해보세요:

**1단계: TypeScript 기초**
- [ ] 기본 타입 시스템 이해 (string, number, boolean, array, object 등)
- [ ] 함수 타입 시그니처 작성
- [ ] 클래스와 인터페이스 활용

**2단계: 고급 타입**
- [ ] 유니온/인터섹션 타입 활용
- [ ] 제네릭 함수/클래스 작성
- [ ] 유틸리티 타입으로 타입 변환

**3단계: 실무 핵심 ⭐**
- [ ] tsconfig.json 옵션 이해하고 조정 가능
- [ ] 타입 소거 이해 및 런타임 체크 전략 수립
- [ ] interface vs type 선택 기준 습득
- [ ] enum 문제점 인지 및 대안 활용
- [ ] readonly/const 적재적소 사용

**4단계: Node.js + TypeScript**
- [ ] Node.js 내장 모듈을 TypeScript로 작성
- [ ] async/await 타입 안전하게 처리
- [ ] 모듈 시스템 이해

**5단계: 고급 패턴**
- [ ] 데코레이터 이해 및 활용
- [ ] DI 패턴 구현
- [ ] 실전 프로젝트 완성

## 참고 자료

### 공식 문서
- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [tsconfig 레퍼런스](https://www.typescriptlang.org/tsconfig)

### 도구
- [TypeScript Playground](https://www.typescriptlang.org/play) - 온라인 테스트
- [TS Node REPL](https://typestrong.org/ts-node/) - 대화형 실행

## 다음 단계

ts-basic을 완료하면:
- **nest-basic/** - NestJS 프레임워크로 실전 애플리케이션 개발
- TypeScript + Dependency Injection + 데코레이터를 활용한 엔터프라이즈급 백엔드 개발

---

**학습 시작:** [01-typescript-basics](./01-typescript-basics/)로 이동하여 TypeScript 여정을 시작하세요!
