/**
 * 06-json-api.js
 *
 * JSON API 만들기 (RESTful API)
 * 간단한 TODO API (메모리 기반)
 */

const http = require('http');
const url = require('url');

// 메모리 DB (서버 재시작 시 초기화됨)
let todos = [
  { id: 1, title: 'Node.js 공부', completed: false },
  { id: 2, title: 'HTTP 서버 만들기', completed: true }
];
let nextId = 3;

// JSON 응답 헬퍼 함수
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// POST/PUT body 읽기 헬퍼 함수
function getRequestBody(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      callback(null, data);
    } catch (err) {
      callback(err);
    }
  });
}

const server = http.createServer((req, res) => {
  const { method } = req;
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 요청 로그
  console.log(`→ ${method} ${pathname}`);

  // CORS 헤더 (모든 응답에 포함)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS 요청 처리 (CORS preflight)
  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // GET /api/todos - 전체 조회
  if (method === 'GET' && pathname === '/api/todos') {
    sendJSON(res, 200, { success: true, data: todos });

  // GET /api/todos/:id - 개별 조회
  } else if (method === 'GET' && pathname.startsWith('/api/todos/')) {
    const id = parseInt(pathname.split('/')[3]);
    const todo = todos.find(t => t.id === id);

    if (todo) {
      sendJSON(res, 200, { success: true, data: todo });
    } else {
      sendJSON(res, 404, { success: false, error: 'Todo not found' });
    }

  // POST /api/todos - 생성
  } else if (method === 'POST' && pathname === '/api/todos') {
    getRequestBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
        return;
      }

      const newTodo = {
        id: nextId++,
        title: body.title,
        completed: body.completed || false
      };
      todos.push(newTodo);

      sendJSON(res, 201, { success: true, data: newTodo });
    });

  // PUT /api/todos/:id - 수정
  } else if (method === 'PUT' && pathname.startsWith('/api/todos/')) {
    const id = parseInt(pathname.split('/')[3]);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
      sendJSON(res, 404, { success: false, error: 'Todo not found' });
      return;
    }

    getRequestBody(req, (err, body) => {
      if (err) {
        sendJSON(res, 400, { success: false, error: 'Invalid JSON' });
        return;
      }

      todos[index] = { ...todos[index], ...body };
      sendJSON(res, 200, { success: true, data: todos[index] });
    });

  // DELETE /api/todos/:id - 삭제
  } else if (method === 'DELETE' && pathname.startsWith('/api/todos/')) {
    const id = parseInt(pathname.split('/')[3]);
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
      sendJSON(res, 404, { success: false, error: 'Todo not found' });
      return;
    }

    const deleted = todos.splice(index, 1)[0];
    sendJSON(res, 200, { success: true, data: deleted });

  // 기본 페이지 (API 문서)
  } else if (method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>TODO API</h1>
      <h2>Endpoints:</h2>
      <ul>
        <li>GET /api/todos - 전체 조회</li>
        <li>GET /api/todos/:id - 개별 조회</li>
        <li>POST /api/todos - 생성</li>
        <li>PUT /api/todos/:id - 수정</li>
        <li>DELETE /api/todos/:id - 삭제</li>
      </ul>
      <p>아래 터미널 명령으로 테스트하세요:</p>
      <pre>
# 전체 조회
curl http://localhost:3000/api/todos

# 개별 조회
curl http://localhost:3000/api/todos/1

# 생성
curl -X POST -H "Content-Type: application/json" \\
  -d '{"title":"New Todo"}' \\
  http://localhost:3000/api/todos

# 수정
curl -X PUT -H "Content-Type: application/json" \\
  -d '{"completed":true}' \\
  http://localhost:3000/api/todos/1

# 삭제
curl -X DELETE http://localhost:3000/api/todos/1
      </pre>
    `);

  } else {
    sendJSON(res, 404, { success: false, error: 'Not Found' });
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ TODO API 서버 실행 중: http://localhost:${PORT}`);
  console.log('\nAPI 테스트:');
  console.log('  curl http://localhost:3000/api/todos');
  console.log('\n종료: Ctrl+C\n');
});

/**
 * 실행:
 * node 06-json-api.js
 *
 * RESTful API 패턴:
 * - GET    /api/todos       : 전체 조회 (List)
 * - GET    /api/todos/:id   : 개별 조회 (Read)
 * - POST   /api/todos       : 생성 (Create)
 * - PUT    /api/todos/:id   : 수정 (Update)
 * - DELETE /api/todos/:id   : 삭제 (Delete)
 *
 * 상태 코드:
 * - 200 : 성공
 * - 201 : 생성 성공
 * - 400 : 잘못된 요청
 * - 404 : 찾을 수 없음
 * - 500 : 서버 에러
 *
 * 참고:
 * - 메모리 기반이므로 서버 재시작 시 데이터 초기화됨
 * - 실전에서는 데이터베이스 사용
 */
