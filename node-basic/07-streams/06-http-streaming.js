/**
 * 06-http-streaming.js
 *
 * HTTP 스트리밍 서버
 */

const http = require('http');
const fs = require('fs');
const { pipeline, Transform } = require('stream');
const zlib = require('zlib');

console.log('=== HTTP 스트리밍 서버 ===\n');

// 테스트용 큰 파일 생성
const largeContent = 'This is a line of text.\n'.repeat(100000);
fs.writeFileSync('large.txt', largeContent);

console.log('→ 테스트 파일 생성 완료\n');

const server = http.createServer((req, res) => {
  const url = req.url;
  console.log(`→ ${req.method} ${url}`);

  // 1. 일반 응답 (메모리에 전체 로드)
  if (url === '/normal') {
    console.log('   [일반] 전체 파일을 메모리에 로드');

    const content = fs.readFileSync('large.txt', 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(content);

    console.log('   응답 완료\n');
  }

  // 2. 스트림 응답 (청크 단위)
  else if (url === '/stream') {
    console.log('   [스트림] 청크 단위로 전송');

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    const stream = fs.createReadStream('large.txt');
    let chunks = 0;

    stream.on('data', () => {
      chunks++;
    });

    stream.on('end', () => {
      console.log(`   응답 완료 (${chunks} chunks)\n`);
    });

    stream.pipe(res);
  }

  // 3. 압축 스트림 (gzip)
  else if (url === '/gzip') {
    console.log('   [Gzip] 압축하여 전송');

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Content-Encoding': 'gzip'
    });

    const stream = fs.createReadStream('large.txt');

    pipeline(
      stream,
      zlib.createGzip(),
      res,
      (err) => {
        if (err) {
          console.error('   에러:', err.message);
        } else {
          console.log('   압축 전송 완료\n');
        }
      }
    );
  }

  // 4. JSON 스트림 (청크 단위 JSON 배열)
  else if (url === '/json-stream') {
    console.log('   [JSON 스트림] 대용량 JSON 배열');

    res.writeHead(200, { 'Content-Type': 'application/json' });

    // JSON 배열 시작
    res.write('[');

    let count = 0;
    const totalItems = 1000;

    const interval = setInterval(() => {
      const item = {
        id: count + 1,
        name: `Item ${count + 1}`,
        timestamp: new Date().toISOString()
      };

      const json = JSON.stringify(item);
      res.write(count > 0 ? ',' + json : json);

      count++;

      if (count >= totalItems) {
        clearInterval(interval);
        res.write(']');
        res.end();
        console.log(`   JSON 스트림 완료 (${totalItems}개)\n`);
      }
    }, 1);
  }

  // 5. Server-Sent Events (SSE)
  else if (url === '/sse') {
    console.log('   [SSE] Server-Sent Events 스트림');

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    let count = 0;

    const interval = setInterval(() => {
      const data = {
        count: count++,
        time: new Date().toISOString()
      };

      res.write(`data: ${JSON.stringify(data)}\n\n`);

      if (count >= 5) {
        clearInterval(interval);
        res.end();
        console.log('   SSE 스트림 종료\n');
      }
    }, 500);

    req.on('close', () => {
      clearInterval(interval);
      console.log('   클라이언트 연결 종료\n');
    });
  }

  // 6. 파일 업로드 스트림
  else if (url === '/upload' && req.method === 'POST') {
    console.log('   [업로드] 파일 수신 시작');

    const writeStream = fs.createWriteStream('uploaded.txt');
    let bytesReceived = 0;

    req.on('data', (chunk) => {
      bytesReceived += chunk.length;
    });

    pipeline(req, writeStream, (err) => {
      if (err) {
        console.error('   업로드 실패:', err.message);
        res.writeHead(500);
        res.end('Upload failed');
      } else {
        console.log(`   업로드 완료 (${bytesReceived} bytes)`);

        res.writeHead(200);
        res.end('Upload successful');

        // 업로드된 파일 삭제
        setTimeout(() => {
          fs.unlinkSync('uploaded.txt');
        }, 1000);
      }
    });
  }

  // 7. 실시간 로그 스트림
  else if (url === '/logs') {
    console.log('   [로그] 실시간 로그 스트림');

    res.writeHead(200, {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked'
    });

    let logCount = 0;

    const logInterval = setInterval(() => {
      const log = `[${new Date().toISOString()}] Log entry #${++logCount}\n`;
      res.write(log);

      if (logCount >= 10) {
        clearInterval(logInterval);
        res.end();
        console.log('   로그 스트림 종료\n');
      }
    }, 300);

    req.on('close', () => {
      clearInterval(logInterval);
      console.log('   클라이언트 연결 종료\n');
    });
  }

  // 8. Transform 스트림 (대문자 변환)
  else if (url === '/transform') {
    console.log('   [Transform] 파일 내용 대문자 변환');

    res.writeHead(200, { 'Content-Type': 'text/plain' });

    const upperCaseTransform = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
      }
    });

    pipeline(
      fs.createReadStream('large.txt'),
      upperCaseTransform,
      res,
      (err) => {
        if (err) {
          console.error('   에러:', err.message);
        } else {
          console.log('   변환 완료\n');
        }
      }
    );
  }

  // 홈페이지
  else if (url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <h1>HTTP 스트리밍 예제</h1>
      <ul>
        <li><a href="/normal">/normal</a> - 일반 응답 (전체 로드)</li>
        <li><a href="/stream">/stream</a> - 스트림 응답 (청크)</li>
        <li><a href="/gzip">/gzip</a> - Gzip 압축 스트림</li>
        <li><a href="/json-stream">/json-stream</a> - JSON 스트림</li>
        <li><a href="/sse">/sse</a> - Server-Sent Events</li>
        <li><a href="/logs">/logs</a> - 실시간 로그 스트림</li>
        <li><a href="/transform">/transform</a> - Transform 스트림</li>
      </ul>
      <p>파일 업로드: POST /upload</p>
    `);
  }

  // 404
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('서버 실행 중: http://localhost:3000');
  console.log('\n테스트 방법:');
  console.log('1. 브라우저에서 http://localhost:3000 접속');
  console.log('2. 각 엔드포인트 테스트');
  console.log('3. Ctrl+C로 종료\n');
});

// 서버 종료 시 테스트 파일 삭제
process.on('SIGINT', () => {
  console.log('\n서버 종료 중...');

  if (fs.existsSync('large.txt')) {
    fs.unlinkSync('large.txt');
  }

  if (fs.existsSync('uploaded.txt')) {
    fs.unlinkSync('uploaded.txt');
  }

  process.exit(0);
});

/**
 * 실행:
 * node 06-http-streaming.js
 *
 * 테스트:
 * - 브라우저: http://localhost:3000
 * - curl: curl http://localhost:3000/stream
 * - 압축: curl http://localhost:3000/gzip --compressed
 * - 업로드: curl -X POST --data-binary @file.txt http://localhost:3000/upload
 *
 * 핵심 개념:
 * - req (IncomingMessage): Readable Stream
 * - res (ServerResponse): Writable Stream
 * - stream.pipe(res): 응답으로 스트림 전송
 * - pipeline(stream, res, callback): 에러 처리 포함
 *
 * HTTP 스트리밍 장점:
 * - 메모리 효율: 전체 파일을 메모리에 로드하지 않음
 * - 빠른 응답: 첫 청크를 즉시 전송
 * - 대용량 처리: 파일 크기에 제한 없음
 * - 실시간 전송: 데이터 생성 즉시 전송
 *
 * Content-Encoding:
 * - gzip: 압축 전송 (대역폭 절약)
 * - deflate: 다른 압축 방식
 * - br: Brotli 압축 (더 효율적)
 *
 * Server-Sent Events (SSE):
 * - Content-Type: text/event-stream
 * - 단방향 실시간 스트림
 * - 자동 재연결
 * - EventSource API 사용
 *
 * Transfer-Encoding: chunked:
 * - Content-Length 없이 전송
 * - 크기를 모를 때 유용
 * - 실시간 스트림에 적합
 *
 * 활용 사례:
 * - 대용량 파일 다운로드
 * - 비디오/오디오 스트리밍
 * - 로그 스트리밍
 * - 실시간 데이터 전송
 * - 파일 업로드
 * - API 응답 스트리밍
 *
 * Best Practices:
 * - pipeline() 사용 (에러 처리)
 * - Backpressure 자동 처리됨
 * - req.on('close') 처리
 * - 압축 사용 (gzip)
 * - 적절한 Content-Type 설정
 */
