# 07. Stream으로 효율적인 데이터 처리

Node.js의 Stream을 사용한 효율적인 데이터 처리를 학습합니다. Readable, Writable, Transform 스트림의 개념과 활용법, pipe/pipeline을 통한 스트림 연결, 그리고 파일 및 HTTP 스트리밍 실전 예제를 다룹니다.

## 학습 목표

- Stream의 개념과 필요성 이해하기
- Readable, Writable, Transform 스트림 사용하기
- pipe와 pipeline으로 스트림 연결하기
- Backpressure 처리 이해하기
- 파일 스트리밍으로 대용량 파일 처리하기
- HTTP 스트리밍 서버 구축하기
- 실전 데이터 처리 파이프라인 만들기

## 목차

1. **[01-readable-stream.js](#01-readable-streamjs)** - Readable Stream 기본 사용법
2. **[02-writable-stream.js](#02-writable-streamjs)** - Writable Stream 기본 사용법
3. **[03-pipe-pipeline.js](#03-pipe-pipelinejs)** - pipe와 pipeline으로 스트림 연결
4. **[04-transform-stream.js](#04-transform-streamjs)** - Transform Stream으로 데이터 변환
5. **[05-file-streaming.js](#05-file-streamingjs)** - 파일 스트리밍 실전 활용
6. **[06-http-streaming.js](#06-http-streamingjs)** - HTTP 스트리밍 서버
7. **[07-real-world-example.js](#07-real-world-examplejs)** - 실전: CSV 처리 파이프라인

---

## 예제 파일 상세

### [01-readable-stream.js](01-readable-stream.js)

**주제**: Readable Stream 기본 사용법

**사용 메서드/속성**:
- `Readable` - 데이터를 읽을 수 있는 스트림 클래스
- `push(data)` - 스트림에 데이터 추가
- `push(null)` - 스트림 종료 신호
- `Readable.from(iterable)` - 이터러블(배열 등)을 스트림으로 변환
- `fs.createReadStream(path, options)` - 파일을 스트림으로 읽기
- `pause()` - 데이터 읽기 일시정지
- `resume()` - 데이터 읽기 재개
- `isPaused()` - 일시정지 상태 확인

**이벤트**:
- `'data'` - 데이터가 준비되면 발생 (chunk 단위)
- `'end'` - 모든 데이터를 읽었을 때 발생
- `'error'` - 에러 발생 시
- `'close'` - 스트림이 닫힐 때

**옵션**:
- `encoding` - 문자 인코딩 ('utf8', 'ascii' 등)
- `highWaterMark` - 내부 버퍼 크기 (기본 16KB)
- `objectMode` - 객체를 직접 스트리밍 (기본 false)

**활용**: 대용량 파일 읽기, HTTP 응답 스트리밍, 데이터베이스 결과 스트리밍

---

### [02-writable-stream.js](02-writable-stream.js)

**주제**: Writable Stream 기본 사용법

**사용 메서드/속성**:
- `Writable` - 데이터를 쓸 수 있는 스트림 클래스
- `write(chunk, callback)` - 데이터 쓰기, 반환값으로 버퍼 상태 확인
- `end()` - 스트림 종료 (더 이상 쓰기 없음)
- `fs.createWriteStream(path, options)` - 파일에 스트림으로 쓰기

**이벤트**:
- `'finish'` - end() 호출 후 모든 데이터가 쓰여졌을 때
- `'drain'` - 버퍼가 비워져서 다시 쓸 수 있을 때
- `'error'` - 쓰기 에러 발생 시
- `'close'` - 스트림이 닫힐 때

**write() 반환값**:
- `true` - 버퍼에 여유가 있어서 계속 쓸 수 있음
- `false` - 버퍼가 가득 찼음, 'drain' 이벤트를 기다려야 함

**Backpressure**:
- 쓰기 속도가 너무 빠르면 버퍼가 넘칠 수 있음
- write()가 false 반환 시 일시정지
- 'drain' 이벤트 후 쓰기 재개

**옵션**:
- `encoding` - 문자 인코딩
- `highWaterMark` - 버퍼 크기 (기본 16KB)
- `objectMode` - 객체를 직접 쓰기
- `flags` - 파일 열기 모드 ('w', 'a', 'wx' 등)

**활용**: 파일 쓰기 (로그, 데이터 저장), HTTP 응답 전송, 네트워크 전송

---

### [03-pipe-pipeline.js](03-pipe-pipeline.js)

**주제**: pipe와 pipeline으로 스트림 연결하기

**사용 메서드/속성**:
- `source.pipe(destination)` - 스트림 연결, destination 반환 (체이닝 가능)
- `pipeline(source, ...transforms, destination, callback)` - 에러 처리가 개선된 pipe (Node.js 10+)

**pipe vs pipeline**:

**pipe()**:
- 기본 스트림 연결 메서드
- 각 스트림의 에러를 개별적으로 처리해야 함
- 에러 발생 시 자동 정리 없음
- 반환값: destination 스트림

**pipeline()** (권장):
- 단일 에러 핸들러로 모든 스트림 처리
- 에러 발생 시 모든 스트림 자동 정리
- 메모리 누수 방지
- 반환값 없음

**사용 패턴**:
```javascript
// pipe
source.pipe(dest);
source.pipe(transform).pipe(dest);

// pipeline (권장)
pipeline(source, dest, callback);
pipeline(source, transform, dest, callback);
pipeline(source, transform1, transform2, dest, callback);
```

**활용**: 파일 복사, 파일 압축/압축 해제, 데이터 변환 파이프라인

---

### [04-transform-stream.js](04-transform-stream.js)

**주제**: Transform Stream으로 데이터 변환하기

**사용 메서드/속성**:
- `Transform` - Readable과 Writable의 조합 스트림 클래스
- `transform(chunk, encoding, callback)` - 변환 로직 구현 메서드
- `this.push(data)` - 변환된 데이터를 다음 스트림으로 전달
- `flush(callback)` - 스트림 종료 직전 호출되는 선택적 메서드

**transform() 메서드**:
- `chunk` - 입력 데이터
- `encoding` - 인코딩 타입
- `callback(err, data)` - 완료 콜백
  - `callback()` - push()로 전달한 데이터 사용
  - `callback(null, data)` - 이 데이터를 push
  - `callback(err)` - 에러 발생

**Transform vs Readable/Writable**:
- Readable: 데이터 생성만
- Writable: 데이터 소비만
- Transform: 데이터 입력 → 변환 → 출력

**주요 활용**:
- 데이터 포맷 변환 (CSV → JSON, XML → JSON)
- 텍스트 변환 (대문자, 소문자, 암호화)
- 필터링 (조건에 맞는 데이터만 통과)
- 집계/통계 (데이터 카운트, 합계)
- 파싱 (로그 파싱, 텍스트 파싱)

**flush() 메서드**:
- 스트림 종료 직전 호출
- 남은 데이터 처리 (버퍼링된 데이터 등)
- 통계 출력 등 마무리 작업

---

### [05-file-streaming.js](05-file-streaming.js)

**주제**: 파일 스트리밍 실전 활용

**사용 메서드/속성**:
- `fs.createReadStream(path, options)` - 파일 읽기 스트림
- `fs.createWriteStream(path, options)` - 파일 쓰기 스트림
- `zlib.createGzip()` - Gzip 압축 Transform
- `zlib.createGunzip()` - Gzip 압축 해제 Transform
- `crypto.createCipheriv(algorithm, key, iv)` - 암호화 Transform
- `crypto.createDecipheriv(algorithm, key, iv)` - 복호화 Transform
- `crypto.createHash(algorithm)` - 해시 계산

**스트림 vs 일반 파일 I/O**:

**일반 방식** (readFileSync/writeFileSync):
- 전체 파일을 메모리에 로드
- 간단하지만 대용량 파일에는 부적합
- 메모리 부족 에러 가능

**스트림 방식**:
- 청크 단위로 처리 (기본 64KB)
- 메모리 효율적
- 대용량 파일 처리 가능
- 실시간 처리 가능

**주요 옵션**:
- `encoding` - 문자 인코딩
- `highWaterMark` - 청크 크기 (기본 64KB)
- `start` - 읽기 시작 위치
- `end` - 읽기 종료 위치
- `flags` - 파일 열기 모드 ('r', 'w', 'a' 등)

**활용 사례**: 대용량 로그 파일 처리, 파일 복사/이동, 파일 압축/암호화, 파일 해시 계산

---

### [06-http-streaming.js](06-http-streaming.js)

**주제**: HTTP 스트리밍 서버

**사용 메서드/속성**:
- `req` (IncomingMessage) - Readable Stream
- `res` (ServerResponse) - Writable Stream
- `stream.pipe(res)` - 응답으로 스트림 전송
- `pipeline(stream, res, callback)` - 에러 처리 포함

**HTTP 스트리밍 장점**:
- 메모리 효율: 전체 파일을 메모리에 로드하지 않음
- 빠른 응답: 첫 청크를 즉시 전송
- 대용량 처리: 파일 크기에 제한 없음
- 실시간 전송: 데이터 생성 즉시 전송

**Content-Encoding**:
- `gzip` - Gzip 압축 전송 (대역폭 절약)
- `deflate` - Deflate 압축
- `br` - Brotli 압축 (더 효율적)

**Server-Sent Events (SSE)**:
- Content-Type: `text/event-stream`
- 단방향 실시간 스트림
- 자동 재연결
- EventSource API 사용

**Transfer-Encoding: chunked**:
- Content-Length 없이 전송
- 크기를 모를 때 유용
- 실시간 스트림에 적합

**활용 사례**: 대용량 파일 다운로드, 비디오/오디오 스트리밍, 로그 스트리밍, 실시간 데이터 전송

---

### [07-real-world-example.js](07-real-world-example.js)

**주제**: 실전 - CSV 처리 파이프라인

**파이프라인 흐름**:
1. CSV 파일 읽기 (Line Stream)
2. CSV 파싱 (CsvParserTransform)
   - 헤더 추출
   - 각 행을 객체로 변환
   - 숫자 필드 타입 변환
3. 필터링 (CityFilterTransform)
   - 특정 도시 거주자만 통과
   - 통계 수집
4. 데이터 변환 (SalaryIncreaseTransform)
   - 급여 인상 계산
   - 변경 내역 로깅
5. JSON 출력 (JsonWriterTransform)
   - 배열로 수집
   - JSON 파일로 저장

**스트림 파이프라인 장점**:
- 메모리 효율: 한 번에 한 줄씩 처리
- 모듈화: 각 변환이 독립적
- 재사용: Transform 클래스 재사용 가능
- 확장성: 새로운 Transform 쉽게 추가
- 에러 처리: pipeline()이 자동 처리

**Transform 클래스 패턴**:
```javascript
class MyTransform extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    // 초기화
  }

  transform(chunk, encoding, callback) {
    // 데이터 변환
    this.push(transformedData);
    callback();
  }

  flush(callback) {
    // 스트림 종료 전 처리 (선택)
    callback();
  }
}
```

**실전 활용**: CSV/JSON 데이터 처리, 로그 파일 분석, ETL 파이프라인, 데이터 정제 및 변환

---

## 핵심 정리

### Stream의 개념

**Stream이란?**
- 데이터를 작은 청크(chunk)로 나누어 순차적으로 처리하는 방식
- 전체 데이터를 메모리에 로드하지 않고 조금씩 처리
- Node.js의 핵심 개념 중 하나

**Stream을 사용하는 이유**:
- 메모리 효율: 큰 파일도 작은 메모리로 처리
- 시간 효율: 데이터가 도착하는 즉시 처리 시작
- 조합 가능: pipe/pipeline으로 여러 스트림 연결

### 4가지 Stream 타입

```javascript
// 1. Readable - 읽기 전용 스트림
const readable = fs.createReadStream('file.txt');
readable.on('data', (chunk) => {
  console.log(chunk);
});

// 2. Writable - 쓰기 전용 스트림
const writable = fs.createWriteStream('output.txt');
writable.write('Hello');
writable.end();

// 3. Duplex - 읽기/쓰기 가능 스트림
const net = require('net');
const socket = net.connect(1337, 'localhost');
socket.write('data');
socket.on('data', (data) => { /* ... */ });

// 4. Transform - 읽고 변환해서 쓰는 스트림
const { Transform } = require('stream');
const upperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});
```

### pipe와 pipeline

```javascript
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// pipe (기본)
fs.createReadStream('file.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('file.txt.gz'));

// pipeline (권장 - 에러 처리)
pipeline(
  fs.createReadStream('file.txt'),
  zlib.createGzip(),
  fs.createWriteStream('file.txt.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed:', err);
    } else {
      console.log('Pipeline succeeded');
    }
  }
);
```

### Backpressure 처리

```javascript
// write()의 반환값 확인
const writable = fs.createWriteStream('large.txt');

function writeData() {
  let canWrite = true;

  while (canWrite) {
    canWrite = writable.write('data\n');

    if (!canWrite) {
      console.log('버퍼 가득 참! drain 대기 중...');

      // drain 이벤트를 기다림
      writable.once('drain', () => {
        console.log('버퍼 비워짐! 계속 쓰기 가능');
        writeData();
      });
    }
  }
}
```

### Transform 스트림 만들기

```javascript
const { Transform } = require('stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
  }

  // 필수: transform 메서드 구현
  transform(chunk, encoding, callback) {
    // 변환 로직
    const transformed = chunk.toString().toUpperCase();

    // 다음 스트림으로 전달
    this.push(transformed);

    // 완료 신호 (필수!)
    callback();
  }

  // 선택: flush 메서드 (마무리 작업)
  flush(callback) {
    this.push('EOF\n');
    callback();
  }
}

// 사용
const myTransform = new MyTransform();
```

---

## Stream 활용 패턴

### 1. 파일 복사

```javascript
const { pipeline } = require('stream');
const fs = require('fs');

pipeline(
  fs.createReadStream('source.txt'),
  fs.createWriteStream('destination.txt'),
  (err) => {
    if (err) console.error(err);
    else console.log('복사 완료');
  }
);
```

### 2. 파일 압축

```javascript
const zlib = require('zlib');

pipeline(
  fs.createReadStream('file.txt'),
  zlib.createGzip(),
  fs.createWriteStream('file.txt.gz'),
  (err) => {
    if (err) console.error(err);
    else console.log('압축 완료');
  }
);
```

### 3. HTTP 파일 전송

```javascript
const http = require('http');

http.createServer((req, res) => {
  const stream = fs.createReadStream('large-file.txt');

  res.writeHead(200, { 'Content-Type': 'text/plain' });

  pipeline(stream, res, (err) => {
    if (err) console.error(err);
  });
}).listen(3000);
```

### 4. 데이터 변환 파이프라인

```javascript
pipeline(
  fs.createReadStream('data.csv'),      // 1. CSV 읽기
  csvParser,                             // 2. CSV 파싱
  dataFilter,                            // 3. 필터링
  dataTransformer,                       // 4. 변환
  fs.createWriteStream('output.json'),   // 5. JSON 저장
  (err) => {
    if (err) console.error(err);
    else console.log('파이프라인 완료');
  }
);
```

---

## Best Practices

### 1. 항상 pipeline() 사용

```javascript
// ❌ 나쁜 예 - 에러 처리 누락 가능
source.pipe(transform).pipe(dest);

// ✅ 좋은 예 - 통합 에러 처리
pipeline(source, transform, dest, (err) => {
  if (err) handleError(err);
});
```

### 2. 에러 처리는 필수

```javascript
stream.on('error', (err) => {
  console.error('Stream error:', err);
});
```

### 3. Backpressure 처리

```javascript
// write() 반환값 확인
if (!writable.write(data)) {
  // 버퍼 가득 참
  writable.once('drain', () => {
    // 계속 쓰기
  });
}
```

### 4. Transform의 callback 필수 호출

```javascript
transform(chunk, encoding, callback) {
  this.push(transformed);
  callback();  // 필수! 안 하면 스트림 멈춤
}
```

### 5. objectMode 필요할 때만 사용

```javascript
// 객체 스트림이 필요한 경우에만
const transform = new Transform({
  objectMode: true,
  transform(obj, encoding, callback) {
    // ...
  }
});
```

---

## 주의사항

### 1. 메모리 누수 방지

```javascript
// 스트림 사용 후 정리
stream.on('end', () => {
  stream.destroy();
});
```

### 2. 파일 리소스 정리

```javascript
// 에러 시에도 파일 닫기
stream.on('error', (err) => {
  stream.destroy();
  // 에러 처리
});
```

### 3. highWaterMark 적절히 조정

```javascript
// 기본값 (16KB)는 대부분의 경우 적절함
// 특수한 경우에만 조정
const stream = fs.createReadStream('file.txt', {
  highWaterMark: 64 * 1024  // 64KB
});
```

---

## 성능 비교

### 스트림 vs 일반 파일 I/O

```javascript
// 100MB 파일 처리 시

// 일반 방식
const data = fs.readFileSync('100mb.txt');  // 메모리: ~100MB
fs.writeFileSync('copy.txt', data);

// 스트림 방식
pipeline(
  fs.createReadStream('100mb.txt'),  // 메모리: ~64KB
  fs.createWriteStream('copy.txt'),
  (err) => { /* ... */ }
);
```

**결과**:
- 메모리 사용: 스트림이 약 1500배 적음
- 처리 시간: 비슷하거나 스트림이 더 빠름
- 확장성: 스트림은 파일 크기에 영향 없음

---

## 실전 활용 사례

### 1. 로그 분석 파이프라인

```javascript
pipeline(
  fs.createReadStream('access.log'),
  lineByLineParser,
  errorFilter,              // ERROR만 필터
  statisticsAggregator,     // 통계 수집
  fs.createWriteStream('error-report.json'),
  callback
);
```

### 2. 이미지 리사이징 서버

```javascript
http.createServer((req, res) => {
  pipeline(
    req,
    imageResizer,           // Sharp 등 사용
    res,
    callback
  );
});
```

### 3. 실시간 데이터 처리

```javascript
pipeline(
  kafkaConsumer,            // Kafka에서 데이터 읽기
  dataValidator,            // 유효성 검사
  dataEnricher,             // 데이터 보강
  databaseWriter,           // DB에 저장
  callback
);
```

---

## 참고 자료

- [Node.js Stream 공식 문서](https://nodejs.org/api/stream.html)
- [Stream Handbook](https://github.com/substack/stream-handbook)
- [Backpressure in Node.js](https://nodejs.org/en/docs/guides/backpressuring-in-streams/)

---

## 다음 단계

- **08-error-handling** - 에러 처리 패턴과 디버깅
- **09-npm-packages** - 외부 패키지 활용
- **10-mini-projects** - 실전 미니 프로젝트
