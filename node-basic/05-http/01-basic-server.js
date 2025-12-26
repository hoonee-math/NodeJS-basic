/**
 * 01-basic-server.js
 *
 * 가장 간단한 HTTP 서버 만들기
 */

const http = require('http');

// 서버 생성 - 요청이 올 때마다 콜백 실행
const server = http.createServer((req, res) => {
  // 요청 로그
  console.log(`→ ${req.method} ${req.url}`);

  // 응답 헤더 설정 (상태 코드 200, Content-Type)
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  // 응답 본문 전송 및 종료
  res.end('Hello from Node.js HTTP Server!\n안녕하세요!');
});

// 포트 3000에서 서버 시작
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ 서버 실행 중: http://localhost:${PORT}`);
  console.log('종료: Ctrl+C\n');
});

// 서버 에러 처리
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 포트 ${PORT}가 이미 사용 중입니다.`);
  } else {
    console.error('서버 에러:', err);
  }
});

/**
 * 실행:
 * node 01-basic-server.js
 *
 * 테스트:
 * 브라우저에서 http://localhost:3000 접속
 * 또는 터미널에서: curl http://localhost:3000
 *
 * 핵심 메서드:
 * - http.createServer(callback) : 서버 생성
 * - server.listen(port, callback) : 포트에서 수신 대기
 * - res.writeHead(statusCode, headers) : 응답 헤더 설정
 * - res.end(data) : 응답 전송 및 연결 종료
 *
 * 콜백 파라미터:
 * - req (IncomingMessage) : 요청 객체
 * - res (ServerResponse) : 응답 객체
 */
