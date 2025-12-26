/**
 * 02-request-response.js
 *
 * 요청(Request)과 응답(Response) 객체 다루기
 */

const http = require('http');

const server = http.createServer((req, res) => {
  // 1. 요청 정보 추출
  const { method, url, headers } = req;

  console.log('\n--- 새로운 요청 ---');
  console.log('Method:', method);      // GET, POST, PUT, DELETE 등
  console.log('URL:', url);            // 요청 경로
  console.log('User-Agent:', headers['user-agent']);  // 브라우저 정보
  console.log('Host:', headers.host);  // 호스트 정보

  // 2. 응답 작성
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  // HTML 응답
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>요청 정보</title>
</head>
<body>
  <h1>요청 정보 확인</h1>
  <ul>
    <li><strong>Method:</strong> ${method}</li>
    <li><strong>URL:</strong> ${url}</li>
    <li><strong>User-Agent:</strong> ${headers['user-agent']}</li>
  </ul>
  <p>다른 URL을 시도해보세요: <a href="/about">/about</a>, <a href="/contact">/contact</a></p>
</body>
</html>
  `;

  res.end(html);
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
  console.log('여러 경로를 시도해보세요: /, /about, /contact');
  console.log('종료: Ctrl+C\n');
});

/**
 * 실행:
 * node 02-request-response.js
 *
 * 테스트:
 * 브라우저에서:
 * - http://localhost:3000
 * - http://localhost:3000/about
 * - http://localhost:3000/contact
 *
 * 터미널에서:
 * curl http://localhost:3000
 * curl http://localhost:3000/about
 *
 * 요청 객체 (req) 주요 속성:
 * - req.method : HTTP 메서드 (GET, POST 등)
 * - req.url : 요청 경로 (/about, /contact 등)
 * - req.headers : 요청 헤더 객체
 *
 * 응답 객체 (res) 주요 메서드:
 * - res.writeHead(statusCode, headers) : 상태 코드와 헤더 설정
 * - res.write(data) : 응답 본문 작성 (여러 번 호출 가능)
 * - res.end(data) : 응답 완료 (데이터 선택적)
 */
