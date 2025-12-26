/**
 * 07-real-world-example.js
 *
 * 실전 예제: 사용자 관리 API 서버
 */

const http = require('http');
const { URL } = require('url');

console.log('=== 사용자 관리 API 서버 ===\n');

// 1. 커스텀 에러 클래스
class ApiError extends Error {
  constructor(statusCode, message, details = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.statusCode,
        message: this.message,
        details: this.details
      }
    };
  }
}

class NotFoundError extends ApiError {
  constructor(resource, id) {
    super(404, `${resource}를 찾을 수 없습니다: ${id}`);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends ApiError {
  constructor(errors) {
    super(400, '유효성 검사 실패', { errors });
    this.name = 'ValidationError';
  }
}

// 2. 사용자 데이터베이스 (메모리)
class UserDatabase {
  constructor() {
    this.users = new Map([
      [1, { id: 1, name: 'Alice', email: 'alice@example.com', age: 30 }],
      [2, { id: 2, name: 'Bob', email: 'bob@example.com', age: 25 }]
    ]);
    this.nextId = 3;
  }

  getAll() {
    return Array.from(this.users.values());
  }

  getById(id) {
    const user = this.users.get(id);

    if (!user) {
      throw new NotFoundError('사용자', id);
    }

    return user;
  }

  create(data) {
    const errors = this.validate(data);

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    const user = {
      id: this.nextId++,
      ...data
    };

    this.users.set(user.id, user);
    console.log(`→ 사용자 생성: #${user.id} ${user.name}`);

    return user;
  }

  update(id, data) {
    const user = this.getById(id);
    const errors = this.validate(data, true);

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }

    Object.assign(user, data);
    console.log(`→ 사용자 업데이트: #${id}`);

    return user;
  }

  delete(id) {
    const user = this.getById(id);
    this.users.delete(id);
    console.log(`→ 사용자 삭제: #${id}`);

    return user;
  }

  validate(data, partial = false) {
    const errors = [];

    if (!partial || 'name' in data) {
      if (!data.name || data.name.length < 2) {
        errors.push({ field: 'name', message: '이름은 2자 이상이어야 합니다' });
      }
    }

    if (!partial || 'email' in data) {
      if (!data.email || !data.email.includes('@')) {
        errors.push({ field: 'email', message: '유효한 이메일이 필요합니다' });
      }
    }

    if (!partial || 'age' in data) {
      if (data.age && (data.age < 0 || data.age > 150)) {
        errors.push({ field: 'age', message: '유효하지 않은 나이입니다' });
      }
    }

    return errors;
  }
}

// 3. 요청 파서
class RequestParser {
  static async parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();

        // 바디 크기 제한 (1MB)
        if (body.length > 1e6) {
          req.connection.destroy();
          reject(new ApiError(413, '요청이 너무 큽니다'));
        }
      });

      req.on('end', () => {
        try {
          const data = body ? JSON.parse(body) : {};
          resolve(data);
        } catch (err) {
          reject(new ApiError(400, 'JSON 파싱 실패'));
        }
      });

      req.on('error', (err) => {
        reject(new ApiError(500, '요청 처리 중 오류'));
      });
    });
  }
}

// 4. 라우터
class Router {
  constructor() {
    this.routes = [];
  }

  add(method, pattern, handler) {
    this.routes.push({ method, pattern, handler });
  }

  async match(req) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;

    for (const route of this.routes) {
      if (req.method !== route.method) continue;

      const match = path.match(route.pattern);

      if (match) {
        return { handler: route.handler, params: match.groups || {} };
      }
    }

    throw new NotFoundError('경로', path);
  }
}

// 5. API 서버
class ApiServer {
  constructor() {
    this.db = new UserDatabase();
    this.router = new Router();
    this.setupRoutes();
    this.setupErrorHandlers();
  }

  setupRoutes() {
    // GET /users - 모든 사용자 조회
    this.router.add('GET', /^\/users$/, () => {
      console.log('→ GET /users');
      return this.db.getAll();
    });

    // GET /users/:id - 사용자 조회
    this.router.add('GET', /^\/users\/(?<id>\d+)$/, (params) => {
      const id = parseInt(params.id);
      console.log(`→ GET /users/${id}`);
      return this.db.getById(id);
    });

    // POST /users - 사용자 생성
    this.router.add('POST', /^\/users$/, async (params, body) => {
      console.log('→ POST /users');
      return this.db.create(body);
    });

    // PUT /users/:id - 사용자 업데이트
    this.router.add('PUT', /^\/users\/(?<id>\d+)$/, async (params, body) => {
      const id = parseInt(params.id);
      console.log(`→ PUT /users/${id}`);
      return this.db.update(id, body);
    });

    // DELETE /users/:id - 사용자 삭제
    this.router.add('DELETE', /^\/users\/(?<id>\d+)$/, (params) => {
      const id = parseInt(params.id);
      console.log(`→ DELETE /users/${id}`);
      return this.db.delete(id);
    });
  }

  setupErrorHandlers() {
    // uncaughtException
    process.on('uncaughtException', (err) => {
      console.error('\n[FATAL] Uncaught Exception:');
      console.error(err);
      process.exit(1);
    });

    // unhandledRejection
    process.on('unhandledRejection', (reason) => {
      console.error('\n[ERROR] Unhandled Rejection:');
      console.error(reason);
    });

    // 종료 신호
    process.on('SIGINT', () => {
      console.log('\n\n서버 종료 중...');
      this.server.close(() => {
        console.log('서버 종료 완료');
        process.exit(0);
      });
    });
  }

  async handleRequest(req, res) {
    const startTime = Date.now();

    try {
      // 라우트 매칭
      const { handler, params } = await this.router.match(req);

      // 요청 바디 파싱
      const body = await RequestParser.parseBody(req);

      // 핸들러 실행
      const result = await handler(params, body);

      // 성공 응답
      this.sendResponse(res, 200, {
        success: true,
        data: result
      });

      const duration = Date.now() - startTime;
      console.log(`   ✓ ${req.method} ${req.url} - 200 (${duration}ms)\n`);
    } catch (err) {
      this.handleError(res, err, req, startTime);
    }
  }

  handleError(res, err, req, startTime) {
    const duration = Date.now() - startTime;

    if (err instanceof ApiError) {
      // 예상된 에러
      this.sendResponse(res, err.statusCode, err.toJSON());
      console.log(`   ✗ ${req.method} ${req.url} - ${err.statusCode} (${duration}ms)\n`);
    } else {
      // 예상치 못한 에러
      console.error('   [Internal Error]', err);

      this.sendResponse(res, 500, {
        error: {
          code: 500,
          message: '서버 내부 오류'
        }
      });

      console.log(`   ✗ ${req.method} ${req.url} - 500 (${duration}ms)\n`);
    }
  }

  sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data, null, 2));
  }

  start(port = 3000) {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(port, () => {
      console.log(`API 서버 시작: http://localhost:${port}\n`);
      console.log('사용 가능한 엔드포인트:');
      console.log('  GET    /users       - 모든 사용자');
      console.log('  GET    /users/:id   - 사용자 조회');
      console.log('  POST   /users       - 사용자 생성');
      console.log('  PUT    /users/:id   - 사용자 업데이트');
      console.log('  DELETE /users/:id   - 사용자 삭제');
      console.log('\nCtrl+C로 종료\n');
    });
  }
}

// 6. 서버 시작
const server = new ApiServer();
server.start(3000);

/**
 * 실행:
 * node 07-real-world-example.js
 *
 * 테스트:
 * # 모든 사용자 조회
 * curl http://localhost:3000/users
 *
 * # 사용자 조회
 * curl http://localhost:3000/users/1
 *
 * # 사용자 생성
 * curl -X POST http://localhost:3000/users \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"Charlie","email":"charlie@example.com","age":35}'
 *
 * # 사용자 업데이트
 * curl -X PUT http://localhost:3000/users/1 \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"Alice Updated"}'
 *
 * # 사용자 삭제
 * curl -X DELETE http://localhost:3000/users/2
 *
 * # 에러 테스트
 * curl http://localhost:3000/users/999          # 404
 * curl -X POST http://localhost:3000/users \
 *   -H "Content-Type: application/json" \
 *   -d '{"name":"","email":"invalid"}'          # 400
 *
 * 핵심 개념:
 * - 커스텀 에러 클래스로 체계적 에러 관리
 * - HTTP 상태 코드 매핑
 * - 유효성 검사와 에러 집계
 * - 전역 에러 핸들러
 * - 우아한 종료 (graceful shutdown)
 *
 * 에러 계층:
 * ApiError (기본 클래스)
 *  ├─ NotFoundError (404)
 *  └─ ValidationError (400)
 *
 * 에러 처리 전략:
 * 1. 예상된 에러 (ApiError):
 *    - HTTP 상태 코드로 응답
 *    - 상세 정보 포함
 *    - 클라이언트 친화적 메시지
 *
 * 2. 예상치 못한 에러:
 *    - 500 Internal Server Error
 *    - 스택 트레이스 로깅
 *    - 민감한 정보 숨김
 *
 * 3. 전역 에러:
 *    - uncaughtException: 프로세스 종료
 *    - unhandledRejection: 로깅
 *    - SIGINT/SIGTERM: 우아한 종료
 *
 * Best Practices:
 * - 일관된 에러 응답 형식
 * - 적절한 HTTP 상태 코드 사용
 * - 에러 로깅과 모니터링
 * - 민감한 정보 노출 방지
 * - 클라이언트 친화적 메시지
 *
 * 프로덕션 개선사항:
 * - 데이터베이스 연동
 * - 인증/인가
 * - Rate limiting
 * - Request ID 추적
 * - 구조화된 로깅
 * - 외부 에러 모니터링 (Sentry)
 * - 헬스 체크 엔드포인트
 * - CORS 설정
 */
