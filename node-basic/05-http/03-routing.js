/**
 * 03-routing.js
 *
 * URL 라우팅 - 경로에 따라 다른 응답 보내기
 */

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  // 요청 로그
  console.log(`→ ${req.method} ${req.url}`);

  // URL 파싱 (쿼리스트링 포함)
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // 라우팅 처리
  if (pathname === '/') {
    // 홈 페이지
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>홈 페이지</h1>
      <nav>
        <a href="/">Home</a> |
        <a href="/about">About</a> |
        <a href="/contact">Contact</a> |
        <a href="/user?name=Alice&age=25">User</a>
      </nav>
    `);

  } else if (pathname === '/about') {
    // About 페이지
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>About</h1><p>Node.js HTTP 서버 예제입니다.</p><a href="/">홈으로</a>');

  } else if (pathname === '/contact') {
    // Contact 페이지
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Contact</h1><p>이메일: contact@example.com</p><a href="/">홈으로</a>');

  } else if (pathname === '/user') {
    // 쿼리스트링 처리
    const name = query.name || 'Guest';
    const age = query.age || 'Unknown';

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>User Info</h1>
      <p>Name: ${name}</p>
      <p>Age: ${age}</p>
      <a href="/">홈으로</a>
    `);

  } else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>404 - Not Found</h1>
      <p>요청한 페이지 <code>${pathname}</code>를 찾을 수 없습니다.</p>
      <a href="/">홈으로</a>
    `);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
  console.log('\n사용 가능한 경로:');
  console.log('  - http://localhost:3000/');
  console.log('  - http://localhost:3000/about');
  console.log('  - http://localhost:3000/contact');
  console.log('  - http://localhost:3000/user?name=Alice&age=25');
  console.log('\n종료: Ctrl+C\n');
});

/**
 * 실행:
 * node 03-routing.js
 *
 * 테스트:
 * 브라우저에서 위의 경로들을 직접 접속해보세요.
 * 존재하지 않는 경로도 시도해보세요: /notfound
 *
 * 핵심 개념:
 * - url.parse(req.url, true) : URL 파싱 (쿼리스트링 포함)
 * - pathname : 경로 부분 (/about)
 * - query : 쿼리스트링 객체 ({ name: 'Alice', age: '25' })
 * - if/else 문으로 간단한 라우팅
 * - 404 응답 처리
 *
 * 참고:
 * - url.parse()는 deprecated되었지만 학습용으로는 간단함
 * - 실전에서는 URL 객체 또는 프레임워크(Express) 사용 권장
 */
