/**
 * 05-headers.js
 *
 * HTTP 헤더 다루기 (요청/응답 헤더, CORS, 쿠키)
 */

const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname;

  // 요청 로그
  console.log(`→ ${req.method} ${req.url}`);

  if (pathname === '/') {
    // 1. 요청 헤더 읽기
    console.log('\n--- 요청 헤더 ---');
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('Accept:', req.headers['accept']);
    console.log('Cookie:', req.headers['cookie'] || '(없음)');

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>HTTP 헤더 테스트</h1>
      <ul>
        <li><a href="/custom-headers">커스텀 헤더 설정</a></li>
        <li><a href="/set-cookie">쿠키 설정</a></li>
        <li><a href="/cors">CORS 헤더</a></li>
        <li><a href="/download">파일 다운로드</a></li>
      </ul>
    `);

  } else if (pathname === '/custom-headers') {
    // 2. 커스텀 응답 헤더 설정
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Custom-Header': 'MyValue',
      'X-Powered-By': 'Node.js',
      'X-Response-Time': '50ms'
    });
    res.end('응답 헤더를 확인해보세요!\n(개발자 도구 > Network 탭)');

  } else if (pathname === '/set-cookie') {
    // 3. 쿠키 설정
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': [
        'username=Alice; Max-Age=3600; HttpOnly',
        'theme=dark; Max-Age=86400'
      ]
    });
    res.end(`
      <h1>쿠키 설정 완료</h1>
      <p>username=Alice (1시간 유지)</p>
      <p>theme=dark (24시간 유지)</p>
      <p><a href="/">홈으로</a> (쿠키가 전송됩니다)</p>
    `);

  } else if (pathname === '/cors') {
    // 4. CORS 헤더 설정
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',  // 모든 도메인 허용
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify({
      message: 'CORS 활성화됨',
      cors: true
    }));

  } else if (pathname === '/download') {
    // 5. 파일 다운로드 헤더
    const fileContent = 'This is a sample file content.\nLine 2\nLine 3';

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Disposition': 'attachment; filename="sample.txt"',  // 다운로드 유도
      'Content-Length': Buffer.byteLength(fileContent)
    });
    res.end(fileContent);

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
  console.log('\n각 경로에서 개발자 도구(F12) > Network 탭을 확인해보세요!');
  console.log('\n종료: Ctrl+C\n');
});

/**
 * 실행:
 * node 05-headers.js
 *
 * 주요 응답 헤더:
 * - Content-Type : 콘텐츠 타입 (text/html, application/json 등)
 * - Content-Length : 콘텐츠 크기 (바이트)
 * - Set-Cookie : 쿠키 설정
 * - Content-Disposition : 다운로드 유도 (attachment)
 * - Access-Control-* : CORS 설정
 *
 * 주요 요청 헤더:
 * - User-Agent : 브라우저/클라이언트 정보
 * - Accept : 받을 수 있는 콘텐츠 타입
 * - Cookie : 쿠키 데이터
 * - Authorization : 인증 토큰
 *
 * 쿠키 옵션:
 * - Max-Age : 유효 시간(초)
 * - HttpOnly : JavaScript 접근 차단 (보안)
 * - Secure : HTTPS에서만 전송
 * - SameSite : CSRF 방어
 *
 * 테스트:
 * curl -v http://localhost:3000/custom-headers
 * (헤더 확인 가능)
 */
