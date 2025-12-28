# 15. 실전 프로젝트 (Real-World Project)

지금까지 배운 **모든 TypeScript 개념을 통합**하여 실전 프로젝트를 만듭니다. RESTful API 서버를 처음부터 끝까지 TypeScript로 구현하며 실무 패턴을 익힙니다.

## 학습 목표

- **전체 아키텍처** 설계 (Controller-Service-Repository)
- **타입 안전한 API** 구현
- **에러 처리**, **검증**, **로깅** 통합
- **테스트** 작성
- **NestJS로 넘어가기 위한 준비** 완료

## 프로젝트 개요

**Todo API 서버**를 TypeScript로 구현합니다.

- RESTful API (CRUD)
- 타입 안전한 요청/응답
- 에러 처리 및 검증
- 로깅 및 미들웨어
- 유닛/통합 테스트
- 환경 변수 관리

## 목차

### 프로젝트 구조
- [01-project-setup.ts](#01-project-setupts) - 프로젝트 초기 설정
- [02-architecture.ts](#02-architecturets) - 아키텍처 설계

### 계층별 구현
- [03-models.ts](#03-modelsts) - 타입/인터페이스 정의
- [04-repository.ts](#04-repositoryt) - 데이터 계층 (Repository)
- [05-service.ts](#05-servicet) - 비즈니스 로직 (Service)
- [06-controller.ts](#06-controllert) - API 엔드포인트 (Controller)

### 공통 기능
- [07-error-handling.ts](#07-error-handlingt) - 에러 처리
- [08-validation.ts](#08-validationt) - 입력 검증 (Zod)
- [09-logging-middleware.ts](#09-logging-middlewaret) - 로깅, 미들웨어

### 배포 준비
- [10-testing.ts](#10-testingt) - 테스트 작성
- [11-build-deploy.ts](#11-build-deployt) - 빌드 및 배포

## 예제 파일 개요

### 01-project-setup.ts
**프로젝트 초기 설정**

- package.json 설정
- tsconfig.json 설정
- 디렉토리 구조
- 의존성 설치 (express, zod, etc.)
- 스크립트 설정 (dev, build, test)
- ESLint, Prettier 설정

### 02-architecture.ts
**아키텍처 설계**

- 계층 분리 (Controller-Service-Repository)
- 의존성 흐름
- 폴더 구조
- 파일 명명 규칙
- SOLID 원칙 적용
- DI 패턴 적용

### 03-models.ts
**타입/인터페이스 정의**

- Entity 타입 (Todo, User)
- DTO 타입 (CreateTodoDto, UpdateTodoDto)
- 응답 타입 (ApiResponse, PaginatedResponse)
- 에러 타입 (AppError, ValidationError)
- 열거 타입 (Status, Priority)
- 유틸리티 타입 활용

### 04-repository.ts
**데이터 계층 (Repository)**

- Repository 인터페이스
- InMemory Repository 구현
- CRUD 메서드 타입
- 제네릭 Repository 패턴
- 에러 처리 (NotFoundError)
- 타입 안전한 쿼리

### 05-service.ts
**비즈니스 로직 (Service)**

- Service 클래스
- Repository 의존성 주입
- 비즈니스 규칙 검증
- DTO ↔ Entity 변환
- 에러 처리
- 트랜잭션 패턴 (미리보기)

### 06-controller.ts
**API 엔드포인트 (Controller)**

- Express Router 타입
- Request, Response 타입
- 라우트 핸들러 타입
- 쿼리 파라미터 파싱
- 타입 안전한 응답
- async 에러 래퍼

### 07-error-handling.ts
**에러 처리**

- 커스텀 에러 클래스
- 글로벌 에러 핸들러
- 에러 응답 표준화
- HTTP 상태 코드 매핑
- 개발/프로덕션 에러 메시지
- 스택 트레이스 처리

### 08-validation.ts
**입력 검증 (Zod)**

- Zod 스키마 정의
- 요청 바디 검증
- 쿼리 파라미터 검증
- 타입과 스키마 동기화
- 검증 에러 핸들링
- 커스텀 검증 규칙

### 09-logging-middleware.ts
**로깅, 미들웨어**

- 로거 구현 (Winston 스타일)
- 요청/응답 로깅 미들웨어
- 성능 측정 미들웨어
- CORS 미들웨어
- 타입 안전한 미들웨어 체이닝

### 10-testing.ts
**테스트 작성**

- Jest 설정
- 유닛 테스트 (Service, Repository)
- 통합 테스트 (API)
- Mock 객체 (Repository, Service)
- supertest로 HTTP 테스트
- 타입 안전한 테스트

### 11-build-deploy.ts
**빌드 및 배포**

- TypeScript 컴파일
- 환경 변수 관리 (Zod)
- 프로덕션 빌드 최적화
- Docker 설정
- 배포 체크리스트

## 프로젝트 구조

```
src/
├── models/
│   ├── todo.model.ts       # Entity 타입
│   ├── dto.ts              # DTO 타입
│   └── error.ts            # 에러 타입
├── repositories/
│   ├── base.repository.ts  # 제네릭 Repository
│   └── todo.repository.ts  # Todo Repository
├── services/
│   └── todo.service.ts     # Todo Service
├── controllers/
│   └── todo.controller.ts  # Todo Controller
├── middleware/
│   ├── error-handler.ts    # 에러 핸들러
│   ├── validation.ts       # 검증 미들웨어
│   └── logger.ts           # 로깅 미들웨어
├── utils/
│   ├── logger.ts           # Logger 유틸리티
│   └── env.ts              # 환경 변수 검증
├── app.ts                  # Express 앱 설정
└── server.ts               # 서버 시작

tests/
├── unit/
│   ├── todo.service.test.ts
│   └── todo.repository.test.ts
└── integration/
    └── todo.api.test.ts
```

## 핵심 패턴 요약

### Controller → Service → Repository

```typescript
// Controller: HTTP 요청/응답 처리
@Controller('/todos')
class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  async getTodos(req: Request, res: Response) {
    const todos = await this.todoService.findAll();
    res.json({ data: todos });
  }
}

// Service: 비즈니스 로직
class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }
}

// Repository: 데이터 접근
class TodoRepository {
  private todos: Todo[] = [];

  async findAll(): Promise<Todo[]> {
    return [...this.todos];
  }
}
```

### DTO 패턴

```typescript
// 입력 DTO
interface CreateTodoDto {
  title: string;
  description?: string;
}

// 응답 DTO
interface TodoResponseDto {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

// Mapper
class TodoMapper {
  static toResponseDto(todo: Todo): TodoResponseDto {
    return {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt,
    };
  }
}
```

### 에러 처리 패턴

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
  }
}

// 커스텀 에러
class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(404, `${resource} with id ${id} not found`);
  }
}

// 글로벌 에러 핸들러
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
```

### Zod 검증 패턴

```typescript
import { z } from 'zod';

const CreateTodoSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
});

type CreateTodoDto = z.infer<typeof CreateTodoSchema>;

// 미들웨어
function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      }
    }
  };
}

router.post('/todos', validate(CreateTodoSchema), todoController.create);
```

## API 엔드포인트

| 메서드 | 경로 | 설명 | 요청 | 응답 |
|--------|------|------|------|------|
| GET | `/todos` | 전체 조회 | - | `Todo[]` |
| GET | `/todos/:id` | 단일 조회 | - | `Todo` |
| POST | `/todos` | 생성 | `CreateTodoDto` | `Todo` |
| PUT | `/todos/:id` | 수정 | `UpdateTodoDto` | `Todo` |
| DELETE | `/todos/:id` | 삭제 | - | `204` |

## 테스트 패턴

```typescript
describe('TodoService', () => {
  let service: TodoService;
  let mockRepository: jest.Mocked<TodoRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as any;

    service = new TodoService(mockRepository);
  });

  it('should get all todos', async () => {
    const todos = [{ id: '1', title: 'Test' }];
    mockRepository.findAll.mockResolvedValue(todos);

    const result = await service.findAll();

    expect(result).toEqual(todos);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });
});
```

## 환경 변수 검증

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().regex(/^\d+$/).transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export const env = envSchema.parse(process.env);
```

## 배포 체크리스트

- [ ] TypeScript 컴파일 (`npm run build`)
- [ ] 테스트 통과 (`npm test`)
- [ ] 환경 변수 검증
- [ ] 에러 처리 테스트
- [ ] 로깅 설정 확인
- [ ] CORS 설정
- [ ] Rate Limiting
- [ ] Docker 이미지 빌드
- [ ] Health Check 엔드포인트

## 다음 단계

이 모듈을 완료했다면:
- **nest-basic/** - NestJS로 더 강력한 백엔드 개발
  - 데코레이터, DI, 파이프, 가드, 인터셉터
  - TypeORM으로 데이터베이스 연동
  - JWT 인증, Role-based 권한
  - Swagger 문서 자동 생성

## 참고 자료

### 프레임워크
- [NestJS](https://nestjs.com/) - TypeScript 백엔드 프레임워크
- [Express + TypeScript](https://expressjs.com/)
- [Fastify + TypeScript](https://www.fastify.io/)

### 라이브러리
- [Zod](https://zod.dev/) - Schema validation
- [Winston](https://github.com/winstonjs/winston) - Logging
- [Jest](https://jestjs.io/) - Testing

### 아키텍처
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://en.wikipedia.org/wiki/Domain-driven_design)

---

**시작하기:** [01-project-setup.ts](./01-project-setup.ts)

**축하합니다! 🎉** ts-basic 학습 과정을 모두 완료했습니다. 이제 NestJS로 엔터프라이즈급 백엔드 개발을 시작할 준비가 되었습니다!
