# 14. 의존성 주입 (Dependency Injection)

의존성 주입(DI)은 **느슨한 결합**과 **테스트 용이성**을 위한 핵심 디자인 패턴입니다. NestJS의 기반이 되는 DI 패턴을 TypeScript로 완전히 이해합니다.

## 학습 목표

- **의존성 주입 개념**과 장점
- **DI 컨테이너** 구현
- **생성자 주입** vs 프로퍼티 주입
- **IoC (Inversion of Control)** 이해
- **NestJS DI 시스템** 준비

## 목차

### DI 기초
- [01-di-concepts.ts](#01-di-conceptsts) - DI 개념과 장점
- [02-without-di.ts](#02-without-dit) - DI 없는 코드의 문제점
- [03-with-di.ts](#03-with-dit) - DI 적용 후 개선

### DI 패턴
- [04-constructor-injection.ts](#04-constructor-injectiont) - 생성자 주입 (권장)
- [05-property-injection.ts](#05-property-injectiont) - 프로퍼티 주입
- [06-method-injection.ts](#06-method-injectiont) - 메서드 주입

### DI 컨테이너
- [07-simple-container.ts](#07-simple-containert) - 간단한 DI 컨테이너
- [08-advanced-container.ts](#08-advanced-containert) - 고급 DI 컨테이너 (reflect-metadata)

### 실전
- [09-practical-examples.ts](#09-practical-examplests) - 실전 DI 패턴

## 예제 파일 개요

### 01-di-concepts.ts
**DI 개념과 장점**

- 의존성이란?
- 강한 결합 vs 느슨한 결합
- DI의 장점 (테스트, 유연성, 재사용성)
- IoC (제어의 역전) 개념
- DIP (의존성 역전 원칙)
- SOLID 원칙과 DI
- DI 컨테이너 역할

### 02-without-di.ts
**DI 없는 코드의 문제점**

- 강한 결합 문제
- 테스트 어려움
- 구현 변경 시 파급 효과
- 재사용성 낮음
- Mock 객체 사용 불가
- 순환 의존성 문제

### 03-with-di.ts
**DI 적용 후 개선**

- 인터페이스로 추상화
- 생성자로 의존성 주입
- 테스트 용이성 (Mock 주입)
- 구현 교체 쉬움
- 느슨한 결합
- 단일 책임 원칙 준수

### 04-constructor-injection.ts
**생성자 주입 (권장)**

- 생성자 매개변수로 주입
- 필수 의존성 보장
- 불변성 유지 (readonly)
- 타입 안전성
- 순환 의존성 조기 발견
- NestJS 스타일 생성자 주입

### 05-property-injection.ts
**프로퍼티 주입**

- 프로퍼티로 주입
- 선택적 의존성
- 상속 시 편의성
- 불변성 보장 어려움
- 테스트 복잡도 증가
- 사용 시기

### 06-method-injection.ts
**메서드 주입**

- 메서드 매개변수로 주입
- 호출 시점 의존성
- 전략 패턴과 조합
- 일시적 의존성
- 컨텍스트 기반 의존성

### 07-simple-container.ts
**간단한 DI 컨테이너**

- 컨테이너 구현
- register, resolve 메서드
- 싱글톤 vs 트랜지언트
- 의존성 그래프 해석
- 생명주기 관리
- 간단한 자동 주입

### 08-advanced-container.ts
**고급 DI 컨테이너**

- reflect-metadata 활용
- 데코레이터 기반 DI (@Injectable, @Inject)
- 자동 의존성 해석
- 타입 기반 주입
- 순환 의존성 감지
- 스코프 관리 (Singleton, Transient, Scoped)

### 09-practical-examples.ts
**실전 DI 패턴**

- Repository 패턴 + DI
- Service Layer + DI
- Controller + DI
- 테스트 더블 (Mock, Stub)
- 팩토리 패턴 + DI
- NestJS 스타일 아키텍처
- 실전 모듈 구조

## 핵심 개념 요약

### DI 주입 방법 비교

| 방법 | 문법 | 장점 | 단점 | 권장 |
|------|------|------|------|------|
| **생성자 주입** | `constructor(private dep: Dep)` | 필수 의존성, 불변성, 타입 안전 | - | ✅ 권장 |
| **프로퍼티 주입** | `@Inject() dep: Dep` | 선택적 의존성, 상속 | 불변성 X, 복잡 | ⚠️ 선택적 |
| **메서드 주입** | `method(dep: Dep)` | 일시적 의존성 | 번거로움 | ⚠️ 특수 경우 |

### DI 컨테이너 생명주기

| 스코프 | 설명 | 사용 시기 |
|--------|------|-----------|
| **Singleton** | 앱 전체에서 하나의 인스턴스 | 상태 없는 서비스, 설정 |
| **Transient** | 매번 새 인스턴스 | 상태 있는 객체 |
| **Scoped** | 요청/스코프당 하나의 인스턴스 | HTTP 요청 단위 (Request Scope) |

### SOLID 원칙과 DI

| 원칙 | 설명 | DI 관계 |
|------|------|---------|
| **SRP** | 단일 책임 | DI로 책임 분리 |
| **OCP** | 개방-폐쇄 | 인터페이스로 확장 |
| **LSP** | 리스코프 치환 | 서브타입 주입 가능 |
| **ISP** | 인터페이스 분리 | 작은 인터페이스 주입 |
| **DIP** | 의존성 역전 | 추상화에 의존 (DI 핵심) |

## 언제 무엇을 쓸까?

| 상황 | 선택 | 이유 |
|------|------|------|
| 필수 의존성 | 생성자 주입 | 불변성, 명확성 |
| 선택적 의존성 | 프로퍼티 주입 | 유연성 |
| 호출 시점 의존성 | 메서드 주입 | 동적 의존성 |
| 자동 의존성 해석 | DI 컨테이너 | 편의성 |
| 테스트 | Mock 주입 | 독립 테스트 |

## 자주 하는 실수

### 1. new 키워드로 직접 생성
❌ `const service = new UserService(new UserRepository())` - 강한 결합
✅ DI 컨테이너로 주입

### 2. 인터페이스 없이 구체 클래스에 의존
❌ `constructor(private userRepo: MySQLUserRepository)`
✅ `constructor(private userRepo: IUserRepository)` - 인터페이스에 의존

### 3. 순환 의존성
❌ A → B → A
✅ 인터페이스로 분리 또는 아키텍처 재설계

### 4. DI 컨테이너 없이 수동 주입 복잡도
❌ 깊은 의존성 그래프를 수동으로 관리
✅ DI 컨테이너 사용

### 5. 싱글톤 남용
❌ 모든 서비스를 싱글톤으로
✅ 상태 없는 서비스만 싱글톤

## Best Practices

**✅ 생성자 주입으로 필수 의존성**
```typescript
interface IUserRepository {
  findById(id: string): Promise<User>;
}

class UserService {
  constructor(
    private readonly userRepository: IUserRepository  // 인터페이스에 의존
  ) {}

  async getUser(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }
}
```

**✅ DI 컨테이너로 자동 주입**
```typescript
import 'reflect-metadata';

function Injectable() {
  return (target: any) => {
    Reflect.defineMetadata('injectable', true, target);
  };
}

@Injectable()
class UserService {
  constructor(private userRepository: UserRepository) {}
}

class Container {
  resolve<T>(target: new (...args: any[]) => T): T {
    const params = Reflect.getMetadata('design:paramtypes', target) || [];
    const instances = params.map((param: any) => this.resolve(param));
    return new target(...instances);
  }
}
```

**✅ Mock 주입으로 테스트**
```typescript
class MockUserRepository implements IUserRepository {
  async findById(id: string): Promise<User> {
    return { id, name: 'Test User', email: 'test@example.com' };
  }
}

describe('UserService', () => {
  it('should get user', async () => {
    const mockRepo = new MockUserRepository();
    const service = new UserService(mockRepo);  // Mock 주입

    const user = await service.getUser('123');
    expect(user.name).toBe('Test User');
  });
});
```

**✅ NestJS 스타일 DI**
```typescript
@Injectable()
class UserRepository {
  findById(id: string): Promise<User> {
    // 구현
  }
}

@Injectable()
class UserService {
  constructor(private readonly userRepository: UserRepository) {}  // 자동 주입

  getUser(id: string) {
    return this.userRepository.findById(id);
  }
}

@Controller('users')
class UserController {
  constructor(private readonly userService: UserService) {}  // 자동 주입

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
```

**✅ 싱글톤 vs 트랜지언트 명확히**
```typescript
// Singleton (상태 없음)
@Injectable({ scope: Scope.DEFAULT })  // NestJS
class ConfigService {}

// Transient (상태 있음)
@Injectable({ scope: Scope.TRANSIENT })
class FileProcessor {}

// Request Scoped (HTTP 요청 단위)
@Injectable({ scope: Scope.REQUEST })
class RequestContext {}
```

## DI 없음 vs 있음 비교

```typescript
// ========== DI 없음 (강한 결합) ==========
class UserService {
  private userRepository = new UserRepository();  // 강한 결합!

  getUser(id: string) {
    return this.userRepository.findById(id);
  }
}

// 테스트 불가능, 구현 교체 어려움

// ========== DI 있음 (느슨한 결합) ==========
interface IUserRepository {
  findById(id: string): Promise<User>;
}

class UserService {
  constructor(private userRepository: IUserRepository) {}  // 느슨한 결합!

  getUser(id: string) {
    return this.userRepository.findById(id);
  }
}

// 테스트 가능, Mock 주입, 구현 교체 쉬움
const service = new UserService(new MockUserRepository());
```

## 다음 단계

이 모듈을 완료했다면:
- **[15-real-world-project](../15-real-world-project/)** - 종합 실전 프로젝트
- **nest-basic/** - NestJS 프레임워크로 실전 DI

## 참고 자료

### 공식 문서
- [NestJS Dependency Injection](https://docs.nestjs.com/fundamentals/custom-providers)
- [InversifyJS](https://inversify.io/) - TypeScript DI 컨테이너
- [TSyringe](https://github.com/microsoft/tsyringe) - Microsoft DI 컨테이너

### 디자인 패턴
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Dependency Injection Pattern](https://refactoring.guru/design-patterns/dependency-injection)

---

**시작하기:** [01-di-concepts.ts](./01-di-concepts.ts)
