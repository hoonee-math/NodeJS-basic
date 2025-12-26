/**
 * 07-static-file-server.js
 *
 * 정적 파일 서버 (Static File Server)
 * HTML, CSS, JS, 이미지 등을 제공
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// MIME 타입 매핑
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.pdf': 'application/pdf'
};

const server = http.createServer((req, res) => {
  // URL에서 경로 추출 (쿼리스트링 제거)
  let filePath = req.url.split('?')[0];

  // / 로 끝나면 index.html 추가
  if (filePath === '/') {
    filePath = '/index.html';
  }

  // 요청 로그
  console.log(`→ ${req.method} ${req.url} → ${filePath}`);

  // public 디렉토리 기준으로 절대 경로 생성
  const publicDir = path.join(__dirname, 'public');
  const fullPath = path.join(publicDir, filePath);

  // 보안: 경로 탐색 공격 방지 (../ 등)
  if (!fullPath.startsWith(publicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // 파일 읽기
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // 404 Not Found
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
          <h1>404 - Not Found</h1>
          <p>파일 <code>${filePath}</code>을 찾을 수 없습니다.</p>
        `);
      } else {
        // 500 Server Error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
      return;
    }

    // MIME 타입 결정
    const ext = path.extname(fullPath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // 파일 전송
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`✅ 정적 파일 서버 실행 중: http://localhost:${PORT}`);
  console.log(`\npublic/ 디렉토리의 파일들을 제공합니다.`);
  console.log('public/index.html 파일을 만들어 테스트해보세요!\n');
  console.log('종료: Ctrl+C\n');
});

/**
 * 실행:
 * node 07-static-file-server.js
 *
 * 테스트 준비:
 * 1. public 디렉토리 생성
 * 2. public/index.html 파일 생성
 * 3. public/style.css, public/script.js 등 추가
 *
 * 예시 파일 구조:
 * 05-http/
 * ├── 07-static-file-server.js
 * └── public/
 *     ├── index.html
 *     ├── style.css
 *     ├── script.js
 *     └── images/
 *         └── logo.png
 *
 * 핵심 개념:
 * - MIME 타입 : 파일 형식을 브라우저에 알려줌
 * - path.join() : 크로스 플랫폼 경로 생성
 * - 경로 탐색 방지 : fullPath.startsWith(publicDir)
 * - fs.readFile() : 파일 읽어서 전송
 *
 * 보안:
 * - ../ 경로 탐색 공격 차단
 * - public 디렉토리 밖 파일 접근 불가
 *
 * 실전:
 * - 실제로는 express.static() 또는 serve-static 사용
 * - 캐싱, gzip 압축 등 최적화 필요
 */
