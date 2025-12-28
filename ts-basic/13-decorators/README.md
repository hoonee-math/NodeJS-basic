# 13. 데코레이터 (Decorators)

데코레이터는 **클래스, 메서드, 프로퍼티에 메타데이터를 추가**하는 특수 문법입니다. NestJS의 핵심 문법이므로 완전히 이해해야 합니다.

## 학습 목표

- **데코레이터 개념**과 사용법
- **클래스/메서드/프로퍼티/매개변수** 데코레이터
- **데코레이터 팩토리** 패턴
- **메타데이터** API
- **NestJS 데코레이터** 이해 준비

## 목차

### 데코레이터 기초
- [01-decorator-basics.ts](#01-decorator-basicsts) - 데코레이터 개념
- [02-class-decorators.ts](#02-class-decoratorsts) - 클래스 데코레이터
- [03-method-decorators.ts](#03-method-decoratorsts) - 메서드 데코레이터
- [04-property-decorators.ts](#04-property-decoratorsts) - 프로퍼티 데코레이터
- [05-parameter-decorators.ts](#05-parameter-decoratorsts) - 매개변수 데코레이터

### 고급 패턴
- [06-decorator-factory.ts](#06-decorator-factoryt) - 데코레이터 팩토리
- [07-decorator-composition.ts](#07-decorator-compositiont) - 데코레이터 조합
- [08-metadata-reflection.ts](#08-metadata-reflectiont) - 메타데이터 API

### 실전
- [09-practical-examples.ts](#09-practical-examplests) - 실전 데코레이터 패턴

## 예제 파일 개요

### 01-decorator-basics.ts
**데코레이터 개념**

- 데코레이터란?
- @ 문법
- experimentalDecorators 설정
- 데코레이터 실행 순서
- 데코레이터 vs 함수
- 런타임 동작
- JavaScript로 컴파일된 코드

### 02-class-decorators.ts
**클래스 데코레이터**

- 클래스 데코레이터 문법
- constructor 타입
- 클래스 수정/확장
- sealed 데코레이터
- singleton 데코레이터
- 로깅 데코레이터
- 클래스 메타데이터 추가

### 03-method-decorators.ts
**메서드 데코레이터**

- 메서드 데코레이터 문법
- target, propertyKey, descriptor
- PropertyDescriptor 타입
- writable, enumerable, configurable 수정
- 메서드 실행 전후 로직
- @log 데코레이터
- @measure 성능 측정
- @cache 메모이제이션

### 04-property-decorators.ts
**프로퍼티 데코레이터**

- 프로퍼티 데코레이터 문법
- target, propertyKey
- 프로퍼티 메타데이터
- @readonly 데코레이터
- @validate 데코레이터
- @column (ORM 스타일)
- getter/setter와 함께 사용

### 05-parameter-decorators.ts
**매개변수 데코레이터**

- 매개변수 데코레이터 문법
- target, propertyKey, parameterIndex
- 매개변수 메타데이터
- @required 데코레이터
- @validate 매개변수 검증
- NestJS @Param, @Body 스타일

### 06-decorator-factory.ts
**데코레이터 팩토리**

- 데코레이터 팩토리 패턴
- 매개변수 받는 데코레이터
- @Component(options) 스타일
- @Route(path) 스타일
- 옵션 기본값
- 타입 안전한 팩토리

### 07-decorator-composition.ts
**데코레이터 조합**

- 여러 데코레이터 동시 사용
- 실행 순서 (아래→위, 안→밖)
- 데코레이터 체이닝
- @Auth + @Route 조합
- 데코레이터 우선순위
- 의존성 있는 데코레이터

### 08-metadata-reflection.ts
**메타데이터 API (reflect-metadata)**

- reflect-metadata 패키지
- Reflect.defineMetadata
- Reflect.getMetadata
- emitDecoratorMetadata 설정
- 타입 메타데이터
- 디자인 타임 타입 정보
- DI 컨테이너 구현 기초

### 09-practical-examples.ts
**실전 데코레이터 패턴**

- REST API 라우팅 (@Get, @Post)
- 인증/인가 (@Auth, @Roles)
- 유효성 검증 (@Validate)
- 트랜잭션 (@Transactional)
- 캐싱 (@Cacheable)
- 로깅/모니터링 (@Log)
- ORM 엔티티 (@Entity, @Column)
- NestJS 스타일 컨트롤러

## 핵심 개념 요약

### 데코레이터 종류

| 종류 | 적용 대상 | 시그니처 | 예시 |
|------|-----------|----------|------|
| **클래스** | class | `(constructor: Function) => void` | `@Component` |
| **메서드** | method | `(target, key, descriptor) => void` | `@Get('/users')` |
| **프로퍼티** | property | `(target, key) => void` | `@Column()` |
| **매개변수** | parameter | `(target, key, index) => void` | `@Body()` |
| **접근자** | get/set | `(target, key, descriptor) => void` | `@observable` |

### 데코레이터 실행 순서

```typescript
@ClassDecorator
class Example {
  @PropertyDecorator
  prop: string;

  @MethodDecorator
  method(@ParameterDecorator param: string) {}
}

// 실행 순서:
// 1. PropertyDecorator
// 2. ParameterDecorator
// 3. MethodDecorator
// 4. ClassDecorator
```

### tsconfig.json 설정

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true  // reflect-metadata 사용 시
  }
}
```

### PropertyDescriptor

| 속성 | 타입 | 설명 |
|------|------|------|
| **value** | any | 프로퍼티 값 (메서드 함수) |
| **writable** | boolean | 쓰기 가능 여부 |
| **enumerable** | boolean | 열거 가능 여부 |
| **configurable** | boolean | 재정의 가능 여부 |
| **get** | () => any | getter 함수 |
| **set** | (v: any) => void | setter 함수 |

## 언제 무엇을 쓸까?

| 상황 | 데코레이터 종류 | 활용 |
|------|----------------|------|
| 클래스에 메타데이터 | 클래스 데코레이터 | @Component, @Controller |
| 라우팅 정의 | 메서드 데코레이터 | @Get, @Post |
| ORM 컬럼 정의 | 프로퍼티 데코레이터 | @Column, @PrimaryKey |
| 매개변수 검증 | 매개변수 데코레이터 | @Body, @Param, @Query |
| 옵션 필요 | 데코레이터 팩토리 | @Route('/users') |

## 자주 하는 실수

### 1. experimentalDecorators 미설정
❌ tsconfig.json에 설정 없이 데코레이터 사용
✅ `"experimentalDecorators": true` 추가

### 2. 데코레이터 팩토리와 데코레이터 혼동
❌ `@log` - 호출 안 함 (팩토리인 경우 에러)
✅ `@log()` - 팩토리는 호출 필요

### 3. 메서드 데코레이터에서 descriptor 수정 안 함
❌ descriptor 수정 없이 로직만 실행
✅ descriptor.value 교체하여 메서드 래핑

### 4. target 타입 혼동
❌ target을 클래스 인스턴스로 착각
✅ target은 프로토타입 (인스턴스 메서드) 또는 생성자 (정적 메서드)

### 5. 실행 순서 무시
❌ 데코레이터가 위→아래 실행된다고 착각
✅ 아래→위, 안→밖 순서

## Best Practices

**✅ 데코레이터 팩토리로 재사용성 향상**
```typescript
function Route(path: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    // 메타데이터 저장
    Reflect.defineMetadata('path', path, target, propertyKey);
  };
}

class UserController {
  @Route('/users')
  getUsers() {}
}
```

**✅ 메서드 래핑으로 실행 전후 로직**
```typescript
function Log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    console.log(`Calling ${propertyKey} with`, args);
    const result = await originalMethod.apply(this, args);
    console.log(`Result:`, result);
    return result;
  };

  return descriptor;
}
```

**✅ reflect-metadata로 타입 정보 저장**
```typescript
import 'reflect-metadata';

function Injectable() {
  return function (target: any) {
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    Reflect.defineMetadata('injectable', true, target);
    Reflect.defineMetadata('dependencies', paramTypes, target);
  };
}
```

**✅ 데코레이터 조합**
```typescript
class UserController {
  @Auth()
  @Roles('admin')
  @Get('/users')
  @Cache(60)
  async getUsers() {}
}
```

**✅ 타입 안전한 데코레이터**
```typescript
function Get(path: string): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) => {
    // 구현
  };
}
```

## NestJS 데코레이터 미리보기

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('users')  // 클래스 데코레이터
export class UserController {
  @Get()  // 메서드 데코레이터
  findAll() {
    return 'This action returns all users';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {  // 매개변수 데코레이터
    return `This action returns user #${id}`;
  }

  @Post()
  create(@Body() createUserDto: any) {  // 매개변수 데코레이터
    return 'This action adds a new user';
  }
}
```

## 다음 단계

이 모듈을 완료했다면:
- **[14-dependency-injection](../14-dependency-injection/)** - DI 패턴 이해
- **[15-real-world-project](../15-real-world-project/)** - 종합 실전 프로젝트
- **nest-basic/** - NestJS 프레임워크 학습

## 참고 자료

### 공식 문서
- [TypeScript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TC39 Decorator Proposal](https://github.com/tc39/proposal-decorators)
- [reflect-metadata](https://github.com/rbuckton/reflect-metadata)

### NestJS
- [NestJS Decorators](https://docs.nestjs.com/custom-decorators)
- [NestJS Controllers](https://docs.nestjs.com/controllers)

---

**시작하기:** [01-decorator-basics.ts](./01-decorator-basics.ts)
