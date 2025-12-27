# 03. 클래스와 인터페이스 (Classes and Interfaces)

TypeScript에서 클래스는 객체 지향 프로그래밍의 핵심이며, 인터페이스는 구조를 정의하는 강력한 도구입니다. 두 개념을 함께 활용하여 타입 안전하고 확장 가능한 코드를 작성하는 방법을 학습합니다.

## 학습 목표

- 클래스의 구조와 접근 제어자 이해
- 상속과 추상 클래스로 재사용성 확보
- 인터페이스로 계약 정의
- 클래스와 인터페이스의 조합 패턴 습득
- 실전에서 활용되는 OOP 패턴 이해

## 목차

1. [01-class-basics.ts](#01-class-basicsts) - 클래스 기본
2. [02-access-modifiers.ts](#02-access-modifiersts) - 접근 제어자
3. [03-inheritance.ts](#03-inheritancets) - 상속
4. [04-abstract-classes.ts](#04-abstract-classests) - 추상 클래스
5. [05-interface-basics.ts](#05-interface-basicsts) - 인터페이스 기본
6. [06-interface-extends.ts](#06-interface-extendsts) - 인터페이스 확장
7. [07-class-implements.ts](#07-class-implementsts) - 인터페이스 구현
8. [08-advanced-patterns.ts](#08-advanced-patternsts) - 고급 패턴
9. [09-practical-examples.ts](#09-practical-examplests) - 실전 예제

## 예제 파일 개요

### 01-class-basics.ts
**클래스의 기본 구조와 사용법**

- **클래스 선언**: `class` 키워드로 클래스 정의, 생성자 함수와 프로퍼티를 캡슐화하는 방법
- **생성자 (constructor)**: 인스턴스 생성 시 실행되는 초기화 메서드, 매개변수로 초기값 전달
- **프로퍼티**: 클래스 내부 변수, 타입 어노테이션으로 타입 지정, 초기값 설정 방법
- **메서드**: 클래스 내부 함수, `this`로 프로퍼티 접근, 인스턴스별로 공유되지 않음
- **인스턴스 생성**: `new` 키워드로 객체 생성, 타입 추론과 명시적 타입 지정

### 02-access-modifiers.ts
**접근 제어자로 캡슐화 구현**

- **public**: 기본값, 어디서나 접근 가능, 명시하지 않아도 public으로 처리
- **private**: 클래스 내부에서만 접근, 외부에서 접근 시 컴파일 에러, `#` 문법도 사용 가능
- **protected**: 클래스와 하위 클래스에서 접근 가능, 외부에서는 접근 불가
- **readonly**: 초기화 후 변경 불가, `const`와 유사하지만 프로퍼티에 사용, 생성자에서만 할당 가능
- **매개변수 프로퍼티**: 생성자 매개변수에 접근 제어자를 붙여 자동으로 프로퍼티 생성 및 할당하는 단축 문법

### 03-inheritance.ts
**클래스 상속으로 재사용성 확보**

- **extends 키워드**: 부모 클래스를 상속받아 기능 확장, 단일 상속만 가능 (다중 상속 불가)
- **super 키워드**: 부모 클래스의 생성자와 메서드 호출, 생성자에서 `super()` 필수 호출
- **메서드 오버라이딩**: 부모 메서드를 자식에서 재정의, `super.method()`로 부모 메서드 호출 가능
- **타입 호환성**: 자식 클래스는 부모 타입으로 사용 가능 (다형성), 부모는 자식 타입으로 사용 불가
- **프로퍼티 오버라이드**: 부모 프로퍼티를 자식에서 재정의할 때 타입 호환성 유지 필요

### 04-abstract-classes.ts
**추상 클래스로 공통 구조 정의**

- **abstract 클래스**: 직접 인스턴스화 불가, 상속받은 클래스만 인스턴스화 가능
- **추상 메서드**: 구현 없이 시그니처만 정의, 자식 클래스에서 반드시 구현해야 함
- **구체 메서드**: 추상 클래스 내에서 구현된 메서드, 자식 클래스에서 그대로 사용하거나 오버라이드
- **템플릿 메서드 패턴**: 추상 클래스에서 알고리즘 골격 정의, 자식 클래스에서 세부 구현
- **추상 프로퍼티**: 자식 클래스에서 반드시 정의해야 하는 프로퍼티

### 05-interface-basics.ts
**인터페이스로 객체 구조 정의**

- **인터페이스 선언**: `interface` 키워드로 객체 타입 정의, 프로퍼티와 메서드 시그니처 포함
- **선택적 프로퍼티 (`?`)**: 있어도 되고 없어도 되는 프로퍼티, `property?: type` 문법
- **readonly 프로퍼티**: 초기화 후 변경 불가, 객체 리터럴에서만 할당 가능
- **인덱스 시그니처**: 동적 프로퍼티 이름 허용, `[key: string]: type` 형태로 정의
- **함수 타입 인터페이스**: 함수 시그니처를 인터페이스로 정의, 호출 가능한 객체 타입

### 06-interface-extends.ts
**인터페이스 확장과 결합**

- **extends로 확장**: 기존 인터페이스를 확장하여 새 인터페이스 생성, 여러 인터페이스 동시 확장 가능
- **다중 확장**: `interface C extends A, B` 형태로 여러 인터페이스 결합
- **프로퍼티 재정의**: 확장 시 부모 프로퍼티를 더 구체적인 타입으로 좁힐 수 있음 (타입 호환 필요)
- **인터페이스 병합 (Declaration Merging)**: 같은 이름의 인터페이스를 여러 번 선언하면 자동으로 병합됨
- **하이브리드 타입**: 함수이면서 프로퍼티도 가진 타입, 인터페이스로 표현 가능

### 07-class-implements.ts
**클래스로 인터페이스 구현**

- **implements 키워드**: 클래스가 인터페이스의 구조를 따르도록 강제, 여러 인터페이스 동시 구현 가능
- **인터페이스 계약**: 인터페이스에 정의된 모든 프로퍼티와 메서드를 클래스에서 구현해야 함
- **다중 구현**: `class C implements A, B` 형태로 여러 인터페이스 동시 구현
- **인터페이스 vs 추상 클래스**: 인터페이스는 구현 없이 계약만, 추상 클래스는 일부 구현 포함 가능
- **타입으로 사용**: 클래스 대신 인터페이스 타입으로 변수 선언, 느슨한 결합 (Loose Coupling)

### 08-advanced-patterns.ts
**고급 클래스 패턴**

- **Getter와 Setter**: `get`/`set` 키워드로 프로퍼티 접근 제어, 유효성 검사나 로깅 추가 가능
- **static 프로퍼티/메서드**: 인스턴스가 아닌 클래스 자체에 속함, 유틸리티 함수나 싱글톤 패턴에 사용
- **믹스인 (Mixins)**: 여러 클래스의 기능을 조합, 다중 상속 대안, 함수로 클래스를 확장
- **제네릭 클래스**: 타입 매개변수로 재사용 가능한 클래스 작성, 컬렉션 클래스에 주로 사용
- **private 생성자**: 외부에서 인스턴스 생성 불가, 싱글톤 패턴이나 팩토리 패턴에 활용

### 09-practical-examples.ts
**실전 OOP 패턴**

- **Repository 패턴**: 데이터 접근 로직 캡슐화, CRUD 인터페이스 정의, 구체 구현은 클래스에서
- **Builder 패턴**: 복잡한 객체 생성을 단계별로, 메서드 체이닝으로 가독성 향상
- **Factory 패턴**: 객체 생성 로직 캡슐화, 조건에 따라 다른 인스턴스 반환
- **Singleton 패턴**: 클래스의 인스턴스가 하나만 존재, private 생성자와 static 메서드 활용
- **Observer 패턴**: 이벤트 기반 통신, 구독자 패턴, 인터페이스로 느슨한 결합 구현

## 핵심 개념

### 1. 접근 제어자

| 제어자 | 클래스 내부 | 자식 클래스 | 외부 | 설명 |
|--------|-------------|-------------|------|------|
| **public** | ✅ | ✅ | ✅ | 어디서나 접근 가능 (기본값) |
| **protected** | ✅ | ✅ | ❌ | 클래스와 자식에서만 |
| **private** | ✅ | ❌ | ❌ | 클래스 내부에서만 |
| **readonly** | ✅ | ✅ | ✅ | 읽기 전용 (초기화 후 변경 불가) |

### 2. 클래스 vs 인터페이스

| 특징 | 클래스 (class) | 인터페이스 (interface) |
|------|----------------|------------------------|
| **구현** | 로직 포함 | 구조만 정의 (로직 없음) |
| **인스턴스화** | `new` 키워드로 생성 가능 | 불가능 |
| **상속** | `extends` (단일 상속) | `extends` (다중 확장 가능) |
| **구현** | - | 클래스에서 `implements` |
| **런타임** | 존재 | 컴파일 후 제거 (타입만) |
| **사용 시기** | 인스턴스 생성 필요 시 | 타입 정의, 계약 명시 시 |

### 3. abstract vs interface

| 항목 | 추상 클래스 (abstract) | 인터페이스 (interface) |
|------|------------------------|------------------------|
| **구현** | 일부 메서드 구현 가능 | 구현 불가 (구조만) |
| **상속** | `extends` (단일) | `implements` (다중 가능) |
| **생성자** | 있음 | 없음 |
| **접근 제어자** | 사용 가능 | 모두 public |
| **사용 시기** | 공통 로직 공유 | 계약만 정의 |

### 4. 상속 vs 구성

| 방식 | 문법 | 장점 | 단점 |
|------|------|------|------|
| **상속 (Inheritance)** | `extends` | 코드 재사용 간편 | 강한 결합, 단일 상속만 |
| **구성 (Composition)** | 객체를 프로퍼티로 | 느슨한 결합, 유연함 | 위임 코드 필요 |

### 5. 클래스 멤버 종류

| 멤버 | 선언 위치 | 접근 방법 | 예시 |
|------|-----------|-----------|------|
| **인스턴스 프로퍼티** | 클래스 내부 | `this.prop` | `name: string` |
| **인스턴스 메서드** | 클래스 내부 | `this.method()` | `getName() { }` |
| **static 프로퍼티** | `static` 키워드 | `ClassName.prop` | `static MAX = 100` |
| **static 메서드** | `static` 키워드 | `ClassName.method()` | `static create() { }` |

### 6. 생성자 패턴

| 패턴 | 문법 | 설명 |
|------|------|------|
| **일반 생성자** | `constructor(name: string) { this.name = name; }` | 수동으로 프로퍼티 할당 |
| **매개변수 프로퍼티** | `constructor(public name: string) { }` | 자동으로 프로퍼티 생성 및 할당 |
| **private 생성자** | `private constructor() { }` | 외부 인스턴스 생성 차단 (싱글톤) |

## 클래스/인터페이스 작성 가이드

### 클래스 프로퍼티 초기화

```typescript
class User {
    name: string;  // ✅ 생성자에서 초기화
    constructor(name: string) { this.name = name; }
}

class User {
    name: string = 'Unknown';  // ✅ 기본값 제공
}

class User {
    name: string;  // ❌ 초기화 안 됨 (strictPropertyInitialization 에러)
}
```

### 접근 제어자 선택

```typescript
✅ private로 시작, 필요할 때만 public/protected
❌ 모든 것을 public으로 (캡슐화 무시)
```

### 상속 vs 구성

```typescript
// 상속: "is-a" 관계
class Dog extends Animal { }  // ✅ Dog은 Animal이다

// 구성: "has-a" 관계
class Car {
    engine: Engine;  // ✅ Car는 Engine을 가진다
}
```

### 인터페이스 vs 타입 별칭

```typescript
// 인터페이스: 확장 가능, 객체 구조
interface User {
    name: string;
}

// 타입: 유니온, 인터섹션, 유틸리티
type ID = string | number;
```

### 추상 클래스 사용 시기

```typescript
// 공통 로직 + 강제 구현
abstract class Animal {
    eat() { }  // 공통 로직
    abstract makeSound(): void;  // 강제 구현
}

// 계약만 필요하면 인터페이스
interface Flyable {
    fly(): void;
}
```

## 자주 하는 실수

### 1. 프로퍼티 초기화 누락
❌ `strictPropertyInitialization`에서 에러
✅ 생성자에서 초기화 또는 기본값 제공

### 2. private 대신 public 남용
❌ 모든 프로퍼티를 public으로
✅ 기본은 private, 필요시에만 public

### 3. 상속 남용
❌ 모든 관계를 상속으로
✅ "is-a" 관계만 상속, 나머지는 구성

### 4. 인터페이스에 구현 포함 시도
❌ `interface User { getName() { return this.name; } }`
✅ 인터페이스는 구조만, 구현은 클래스에서

### 5. abstract 클래스 인스턴스화
❌ `new AbstractClass()`
✅ 자식 클래스만 인스턴스화 가능

## 실습 가이드

```bash
# 순서대로 학습
npx ts-node 03-classes-interfaces/01-class-basics.ts
npx ts-node 03-classes-interfaces/02-access-modifiers.ts
npx ts-node 03-classes-interfaces/03-inheritance.ts
npx ts-node 03-classes-interfaces/04-abstract-classes.ts
npx ts-node 03-classes-interfaces/05-interface-basics.ts
npx ts-node 03-classes-interfaces/06-interface-extends.ts
npx ts-node 03-classes-interfaces/07-class-implements.ts
npx ts-node 03-classes-interfaces/08-advanced-patterns.ts
npx ts-node 03-classes-interfaces/09-practical-examples.ts

# 타입 체크
npx tsc --noEmit 03-classes-interfaces/*.ts
```

## 디자인 원칙

### SOLID 원칙과 TypeScript

- **S - Single Responsibility**: 클래스는 하나의 책임만
- **O - Open/Closed**: 확장에 열려있고 수정에 닫혀있게 (인터페이스, 추상 클래스)
- **L - Liskov Substitution**: 자식은 부모를 대체 가능해야 함
- **I - Interface Segregation**: 인터페이스를 작게 나누기
- **D - Dependency Inversion**: 구체가 아닌 추상에 의존

## 다음 단계

03-classes-interfaces를 완료했다면:
- **[04-advanced-types](../04-advanced-types/)** - 고급 타입 시스템
- **[05-generics](../05-generics/)** - 제네릭 심화 학습

## 참고 자료

- [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Deep Dive - Classes](https://basarat.gitbook.io/typescript/future-javascript/classes)
- [SOLID Principles in TypeScript](https://www.digitalocean.com/community/conceptual_articles/s-o-l-i-d-the-first-five-principles-of-object-oriented-design)
