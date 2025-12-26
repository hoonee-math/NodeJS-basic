# 05. HTTP 서버 (HTTP Server)

Node.js의 `http` 모듈로 웹 서버를 만드는 방법을 학습합니다. 프레임워크 없이 순수 Node.js만으로 HTTP 서버를 구축하며, 웹의 기본 동작 원리를 이해합니다.

## 학습 목표

- `http.createServer()`로 웹 서버 생성하기
- 요청(Request)과 응답(Response) 객체 다루기
- URL 라우팅 구현하기
- HTTP 메서드(GET, POST, PUT, DELETE) 처리하기
- HTTP 헤더와 상태 코드 활용하기
- RESTful JSON API 만들기
- 정적 파일 서버 구현하기

## 목차

1. [기본 서버 생성](#1-기본-서버-생성)
2. [요청과 응답](#2-요청과-응답)
3. [URL 라우팅](#3-url-라우팅)
4. [HTTP 메서드](#4-http-메서드)
5. [HTTP 헤더](#5-http-헤더)
6. [JSON API](#6-json-api)
7. [정적 파일 서버](#7-정적-파일-서버)

---

## 예제 파일 상세

### 1. 기본 서버 생성

**파일:** `01-basic-server.js`

가장 간단한 HTTP 서버를 만듭니다.

**주요 개념:**
- `http.createServer(callback)` - 서버 인스턴스 생성
- `server.listen(port)` - 포트에서 요청 수신 대기
- `res.writeHead()` - 응답 헤더 설정
- `res.end()` - 응답 전송 및 연결 종료

**실행:**
```bash
node 01-basic-server.js
# 브라우저에서 http://localhost:3000 접속
```

---

### 2. 요청과 응답

**파일:** `02-request-response.js`

요청 객체(req)에서 정보를 읽고, 응답 객체(res)로 HTML을 전송합니다.

**주요 개념:**
- `req.method` - HTTP 메서드 (GET, POST 등)
- `req.url` - 요청 경로
- `req.headers` - 요청 헤더 객체
- HTML 응답 생성

**실행:**
```bash
node 02-request-response.js
# 다양한 경로로 접속: /about, /contact 등
```

---

### 3. URL 라우팅

**파일:** `03-routing.js`

URL 경로에 따라 다른 페이지를 보여주는 라우팅을 구현합니다.

**주요 개념:**
- `url.parse()` - URL 파싱
- `pathname` - 경로 추출
- `query` - 쿼리스트링 파싱
- 404 Not Found 처리

**실행:**
```bash
node 03-routing.js
# http://localhost:3000/user?name=Alice&age=25
```

---

### 4. HTTP 메서드

**파일:** `04-methods.js`

GET, POST, PUT, DELETE 등 다양한 HTTP 메서드를 처리합니다.

**주요 개념:**
- GET - 데이터 조회
- POST - 데이터 생성 (body 읽기)
- PUT - 데이터 수정
- DELETE - 데이터 삭제
- `req.on('data')` - Stream으로 body 읽기

**실행:**
```bash
node 04-methods.js
# 브라우저에서 폼 전송 테스트
# 터미널: curl -X POST -d "username=Alice" http://localhost:3000/submit
```

---

### 5. HTTP 헤더

**파일:** `05-headers.js`

요청 헤더를 읽고 응답 헤더를 설정합니다.

**주요 개념:**
- 커스텀 헤더 설정
- `Set-Cookie` - 쿠키 설정
- `Access-Control-*` - CORS 설정
- `Content-Disposition` - 파일 다운로드

**실행:**
```bash
node 05-headers.js
# 개발자 도구(F12) > Network 탭에서 헤더 확인
```

---

### 6. JSON API

**파일:** `06-json-api.js`

RESTful JSON API를 만듭니다. 메모리 기반 TODO API 예제입니다.

**주요 개념:**
- RESTful API 설계
- CRUD 작업 (Create, Read, Update, Delete)
- JSON 요청/응답 처리
- 상태 코드 (200, 201, 404 등)

**API Endpoints:**
```
GET    /api/todos       - 전체 조회
GET    /api/todos/:id   - 개별 조회
POST   /api/todos       - 생성
PUT    /api/todos/:id   - 수정
DELETE /api/todos/:id   - 삭제
```

**실행:**
```bash
node 06-json-api.js
# 테스트: curl http://localhost:3000/api/todos
```

---

### 7. 정적 파일 서버

**파일:** `07-static-file-server.js`

HTML, CSS, JavaScript, 이미지 등의 정적 파일을 제공하는 서버입니다.

**주요 개념:**
- MIME 타입 매핑
- `fs.readFile()` - 파일 읽기
- 경로 탐색 공격 방지
- 404/500 에러 처리

**디렉토리 구조:**
```
05-http/
├── 07-static-file-server.js
└── public/
    ├── index.html
    ├── style.css
    └── script.js
```

**실행:**
```bash
node 07-static-file-server.js
# 브라우저에서 http://localhost:3000
```

---

## 실습 가이드

### 순서대로 실행하기
```bash
cd node-basic/05-http

# 1. 기본 서버
node 01-basic-server.js

# 2. 요청과 응답
node 02-request-response.js

# 3. 라우팅
node 03-routing.js

# 4. HTTP 메서드
node 04-methods.js

# 5. 헤더
node 05-headers.js

# 6. JSON API
node 06-json-api.js

# 7. 정적 파일 서버
node 07-static-file-server.js
```

### curl로 테스트하기
```bash
# GET 요청
curl http://localhost:3000

# 헤더 확인
curl -v http://localhost:3000

# POST 요청
curl -X POST -H "Content-Type: application/json" \
  -d '{"title":"Test"}' \
  http://localhost:3000/api/todos

# PUT 요청
curl -X PUT -H "Content-Type: application/json" \
  -d '{"completed":true}' \
  http://localhost:3000/api/todos/1

# DELETE 요청
curl -X DELETE http://localhost:3000/api/todos/1
```

---

## 핵심 정리

### http 모듈 기본

```javascript
const http = require('http');

// 서버 생성
const server = http.createServer((req, res) => {
  // 요청 처리
  const { method, url, headers } = req;

  // 응답 전송
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

// 서버 시작
server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### 요청 객체 (req)

```javascript
req.method        // 'GET', 'POST', 'PUT', 'DELETE'
req.url           // '/about?name=Alice'
req.headers       // { 'user-agent': '...', ... }

// POST body 읽기
let body = '';
req.on('data', chunk => body += chunk.toString());
req.on('end', () => {
  const data = JSON.parse(body);
  // body 처리
});
```

### 응답 객체 (res)

```javascript
// 헤더 설정
res.writeHead(200, {
  'Content-Type': 'application/json',
  'Set-Cookie': 'name=value'
});

// 응답 전송
res.write('Data 1');
res.write('Data 2');
res.end('Final data');

// 또는 한 번에
res.end('All data');
```

### 상태 코드

```javascript
res.writeHead(200);  // OK
res.writeHead(201);  // Created
res.writeHead(400);  // Bad Request
res.writeHead(404);  // Not Found
res.writeHead(500);  // Internal Server Error
```

### JSON 응답

```javascript
const data = { success: true, message: 'OK' };
res.writeHead(200, { 'Content-Type': 'application/json' });
res.end(JSON.stringify(data));
```

---

## 프레임워크와의 비교

순수 Node.js HTTP 서버와 Express 프레임워크 비교:

**순수 Node.js (학습용):**
```javascript
// 수동 라우팅, 수동 파싱
if (method === 'GET' && pathname === '/user') {
  // ...
}
```

**Express (실전 권장):**
```javascript
// 간결한 라우팅
app.get('/user', (req, res) => {
  res.json({ user: 'Alice' });
});
```

**학습 포인트:**
- 순수 Node.js로 HTTP 동작 원리 이해
- 실전에서는 Express, Koa, Fastify 등 프레임워크 사용 권장

---

## 보안 고려사항

1. **경로 탐색 공격 방지**
   ```javascript
   // public 디렉토리 밖 접근 차단
   if (!fullPath.startsWith(publicDir)) {
     return res.end('403 Forbidden');
   }
   ```

2. **CORS 설정**
   ```javascript
   res.setHeader('Access-Control-Allow-Origin', '*');
   ```

3. **입력 검증**
   ```javascript
   // JSON 파싱 에러 처리
   try {
     const data = JSON.parse(body);
   } catch (err) {
     return res.end('Invalid JSON');
   }
   ```

---

## 참고 자료

- [Node.js HTTP 공식 문서](https://nodejs.org/api/http.html)
- [MDN - HTTP 개요](https://developer.mozilla.org/ko/docs/Web/HTTP/Overview)
- [HTTP 상태 코드](https://developer.mozilla.org/ko/docs/Web/HTTP/Status)
- [MIME 타입 목록](https://developer.mozilla.org/ko/docs/Web/HTTP/Basics_of_HTTP/MIME_types)

---

## 다음 단계

- **06-events** - EventEmitter와 이벤트 기반 프로그래밍
- **07-streams** - Stream을 활용한 효율적인 데이터 처리
- **08-error-handling** - 에러 처리 패턴과 디버깅
- **09-npm-packages** - 외부 패키지 활용 (Express 등)
