/**
 * 04-methods.js
 *
 * HTTP 메서드 처리 (GET, POST, PUT, DELETE)
 */

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const { method } = req;
  const pathname = url.parse(req.url).pathname;

  // 요청 로그
  console.log(`→ ${method} ${req.url}`);

  // GET 요청 처리
  if (method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>HTTP 메서드 테스트</h1>

      <!-- GET 요청 -->
      <h2>1. GET 요청</h2>
      <a href="/data">데이터 조회</a>

      <!-- POST 요청 -->
      <h2>2. POST 요청</h2>
      <form method="POST" action="/submit">
        <input name="username" placeholder="이름" required>
        <input name="email" type="email" placeholder="이메일" required>
        <button type="submit">전송</button>
      </form>

      <!-- PUT/DELETE는 터미널에서 테스트 -->
      <h2>3. PUT/DELETE 요청</h2>
      <p>터미널에서 curl 명령으로 테스트하세요:</p>
      <pre>
curl -X PUT http://localhost:3000/update
curl -X DELETE http://localhost:3000/delete
      </pre>
    `);

  } else if (method === 'GET' && pathname === '/data') {
    // GET - 데이터 조회
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'GET 요청 성공', data: [1, 2, 3] }));

  } else if (method === 'POST' && pathname === '/submit') {
    // POST - 데이터 생성 (body 읽기)
    let body = '';

    // 데이터 수신 중
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    // 데이터 수신 완료
    req.on('end', () => {
      console.log('POST body:', body);  // username=Alice&email=alice@example.com

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <h1>POST 요청 받음</h1>
        <p>전송된 데이터: <code>${body}</code></p>
        <a href="/">돌아가기</a>
      `);
    });

  } else if (method === 'PUT' && pathname === '/update') {
    // PUT - 데이터 수정
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'PUT 요청 성공', updated: true }));

  } else if (method === 'DELETE' && pathname === '/delete') {
    // DELETE - 데이터 삭제
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'DELETE 요청 성공', deleted: true }));

  } else {
    // 지원하지 않는 메서드 또는 경로
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
  console.log('\n테스트 방법:');
  console.log('1. 브라우저: http://localhost:3000');
  console.log('2. 터미널:');
  console.log('   curl http://localhost:3000/data');
  console.log('   curl -X POST -d "username=Alice&email=alice@example.com" http://localhost:3000/submit');
  console.log('   curl -X PUT http://localhost:3000/update');
  console.log('   curl -X DELETE http://localhost:3000/delete');
  console.log('\n종료: Ctrl+C\n');
});

/**
 * 실행:
 * node 04-methods.js
 *
 * HTTP 메서드:
 * - GET    : 데이터 조회 (읽기)
 * - POST   : 데이터 생성 (쓰기)
 * - PUT    : 데이터 수정 (전체)
 * - DELETE : 데이터 삭제
 *
 * POST 요청 body 읽기:
 * req.on('data', (chunk) => { body += chunk })
 * req.on('end', () => { // body 처리 })
 *
 * 참고:
 * - req는 Stream이므로 data 이벤트로 조각조각 받음
 * - end 이벤트에서 완전한 body를 처리
 * - 큰 파일 업로드 시 chunk로 처리하는 게 효율적
 */
