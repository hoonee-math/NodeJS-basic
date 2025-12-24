# 03. 파일 시스템 (File System)

Node.js에서 파일과 디렉토리를 다루는 방법을 학습합니다.

## 학습 목표

- fs 모듈의 동기/비동기 메서드 이해
- 파일 읽기/쓰기/삭제 작업
- 디렉토리 생성 및 탐색
- fs.promises API 활용
- 파일 메타데이터 다루기
- 실전 파일 관리 패턴

## 예제 파일 순서

1. 01-read-file-sync.js - 동기 파일 읽기
2. 02-read-file-async.js - 비동기 파일 읽기
3. 03-write-file.js - 파일 쓰기
4. 04-file-operations.js - 파일 복사/이동/삭제
5. 05-directory-operations.js - 디렉토리 다루기
6. 06-file-stats.js - 파일 정보 조회
7. 07-fs-promises.js - fs.promises API

## 실행 방법

```bash
cd node-basic/03-fs
node 01-read-file-sync.js
node 02-read-file-async.js
# ...
```

## 핵심 개념 및 사용 메서드

### [01-read-file-sync.js](01-read-file-sync.js)

**주제**: 동기 파일 읽기

**동기 vs 비동기**:
- 동기: 작업이 완료될 때까지 다음 코드 실행 안 됨 (Blocking)
- 비동기: 작업 완료를 기다리지 않고 다음 코드 실행 (Non-blocking)

**fs.readFileSync()**:
- `fs.readFileSync(path, encoding)` - 파일을 동기적으로 읽음. 파일 읽기가 끝날 때까지 대기
- `encoding` 생략 시 Buffer 반환, 'utf-8' 지정 시 문자열 반환
- 에러 발생 시 예외를 throw하므로 try-catch 필요

**fs.writeFileSync()**:
- `fs.writeFileSync(path, data, encoding)` - 파일을 동기적으로 씀
- 파일이 없으면 생성, 있으면 덮어씀
- try-catch로 에러 처리

**언제 사용?**:
- 스크립트 초기화 시 설정 파일 읽기
- 간단한 CLI 도구
- 동기 처리가 필요한 경우
- ⚠️ 서버 애플리케이션에서는 피할 것 (모든 요청이 블록됨)

---

### [02-read-file-async.js](02-read-file-async.js)

**주제**: 비동기 파일 읽기

**fs.readFile() - Callback 방식**:
- `fs.readFile(path, encoding, callback)` - 파일을 비동기적으로 읽음
- `callback(err, data)` - Error-first callback 패턴
- 파일 읽는 동안 다른 코드 실행 가능

**fs.writeFile() - Callback 방식**:
- `fs.writeFile(path, data, encoding, callback)` - 파일을 비동기적으로 씀
- 파일이 없으면 생성, 있으면 덮어씀

**추가 메서드**:
- `fs.appendFile(path, data, callback)` - 파일 끝에 내용 추가 (append)
- `fs.unlink(path, callback)` - 파일 삭제
- `fs.rename(oldPath, newPath, callback)` - 파일 이름 변경 또는 이동

**언제 사용?**:
- 서버 애플리케이션 (Non-blocking 필수)
- 여러 파일을 동시에 처리
- I/O 작업이 많은 경우

---

### [03-write-file.js](03-write-file.js)

**주제**: 파일 쓰기 다양한 방법

**기본 쓰기 메서드**:
- `fs.writeFile(path, data, callback)` - 파일 전체를 새로 씀 (덮어쓰기)
- `fs.appendFile(path, data, callback)` - 파일 끝에 내용 추가
- `fs.writeFileSync(path, data)` - 동기 쓰기

**옵션**:
- `{ encoding: 'utf-8' }` - 인코딩 지정
- `{ flag: 'a' }` - append 모드 (writeFile에서)
- `{ mode: 0o666 }` - 파일 권한 설정

**JSON 파일 다루기**:
```javascript
// JSON 쓰기
const data = { name: 'Alice', age: 25 };
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

// JSON 읽기
const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
```

**CSV 파일 다루기**:
```javascript
const rows = [
  ['Name', 'Age'],
  ['Alice', '25'],
  ['Bob', '30']
];
const csv = rows.map(row => row.join(',')).join('\n');
fs.writeFileSync('data.csv', csv);
```

---

### [04-file-operations.js](04-file-operations.js)

**주제**: 파일 복사, 이동, 삭제

**파일 복사**:
- `fs.copyFile(src, dest, callback)` - 파일 복사
- `fs.copyFileSync(src, dest)` - 동기 복사
- 대상 파일이 있으면 덮어씀

**파일 이동/이름 변경**:
- `fs.rename(oldPath, newPath, callback)` - 파일 이동 또는 이름 변경
- 같은 디렉토리면 이름 변경, 다른 디렉토리면 이동

**파일 삭제**:
- `fs.unlink(path, callback)` - 파일 삭제
- `fs.unlinkSync(path)` - 동기 삭제
- 파일이 없으면 에러 발생

**파일 존재 확인**:
- `fs.existsSync(path)` - 파일/디렉토리 존재 여부 (동기, boolean 반환)
- ⚠️ `fs.exists()` (비동기)는 deprecated, `fs.access()` 사용 권장
- `fs.access(path, fs.constants.F_OK, callback)` - 접근 가능 여부 확인

---

### [05-directory-operations.js](05-directory-operations.js)

**주제**: 디렉토리 생성, 읽기, 삭제

**디렉토리 생성**:
- `fs.mkdir(path, callback)` - 디렉토리 생성
- `fs.mkdirSync(path, { recursive: true })` - 중첩 디렉토리 생성
- `recursive: true` 옵션으로 부모 디렉토리도 함께 생성

**디렉토리 읽기**:
- `fs.readdir(path, callback)` - 디렉토리 내 파일/폴더 목록 반환 (배열)
- `fs.readdirSync(path)` - 동기 버전
- 결과: `['file1.txt', 'file2.txt', 'folder1']`

**디렉토리 상세 읽기**:
- `fs.readdir(path, { withFileTypes: true }, callback)` - Dirent 객체 배열 반환
- Dirent 메서드: `isFile()`, `isDirectory()`, `isSymbolicLink()`

**디렉토리 삭제**:
- `fs.rmdir(path, callback)` - 빈 디렉토리 삭제
- `fs.rm(path, { recursive: true }, callback)` - 내용 포함 삭제 (Node.js 14.14+)
- `fs.rmdirSync(path, { recursive: true })` - 동기 버전

---

### [06-file-stats.js](06-file-stats.js)

**주제**: 파일/디렉토리 정보 조회

**fs.stat()**:
- `fs.stat(path, callback)` - 파일/디렉토리의 상세 정보 반환
- `fs.statSync(path)` - 동기 버전
- Stats 객체 반환

**Stats 객체 속성**:
- `stats.isFile()` - 파일인지 확인
- `stats.isDirectory()` - 디렉토리인지 확인
- `stats.isSymbolicLink()` - 심볼릭 링크인지 확인
- `stats.size` - 파일 크기 (바이트)
- `stats.birthtime` - 생성 시간
- `stats.mtime` - 수정 시간 (modified time)
- `stats.atime` - 접근 시간 (access time)
- `stats.ctime` - 변경 시간 (change time, 메타데이터 변경)

**파일 크기 변환**:
```javascript
const sizeInMB = stats.size / (1024 * 1024);
const sizeInKB = stats.size / 1024;
```

**시간 비교**:
```javascript
// 파일이 1시간 이내에 수정되었는지 확인
const oneHourAgo = Date.now() - (60 * 60 * 1000);
const isRecent = stats.mtimeMs > oneHourAgo;
```

---

### [07-fs-promises.js](07-fs-promises.js)

**주제**: Promise 기반 fs API

**fs.promises 모듈**:
- `const fs = require('fs').promises` - Promise 버전의 fs 모듈
- 모든 메서드가 Promise 반환
- async/await와 함께 사용하기 좋음

**주요 메서드**:
- `fs.readFile(path, encoding)` - Promise 반환
- `fs.writeFile(path, data)` - Promise 반환
- `fs.appendFile(path, data)` - Promise 반환
- `fs.unlink(path)` - Promise 반환
- `fs.copyFile(src, dest)` - Promise 반환
- `fs.rename(oldPath, newPath)` - Promise 반환
- `fs.mkdir(path, options)` - Promise 반환
- `fs.readdir(path, options)` - Promise 반환
- `fs.rm(path, options)` - Promise 반환
- `fs.stat(path)` - Promise 반환

**async/await 사용**:
```javascript
async function readAndWrite() {
  try {
    const data = await fs.readFile('input.txt', 'utf-8');
    await fs.writeFile('output.txt', data);
    console.log('완료');
  } catch (error) {
    console.error('에러:', error);
  }
}
```

**장점**:
- Callback Hell 방지
- 에러 처리 간편 (try-catch)
- 여러 파일 병렬 처리 (Promise.all)
- 현대적인 코드 스타일

---

## fs 모듈 메서드 비교

### 동기 vs 비동기

| 작업 | 동기 (Sync) | 비동기 (Callback) | 비동기 (Promise) |
|------|------------|------------------|------------------|
| **파일 읽기** | `readFileSync()` | `readFile(cb)` | `promises.readFile()` |
| **파일 쓰기** | `writeFileSync()` | `writeFile(cb)` | `promises.writeFile()` |
| **파일 삭제** | `unlinkSync()` | `unlink(cb)` | `promises.unlink()` |
| **디렉토리 생성** | `mkdirSync()` | `mkdir(cb)` | `promises.mkdir()` |
| **디렉토리 읽기** | `readdirSync()` | `readdir(cb)` | `promises.readdir()` |

### 언제 무엇을 사용?

| 상황 | 권장 방식 |
|------|----------|
| 서버 애플리케이션 | **비동기 (Promise)** |
| 스크립트/CLI 도구 | 동기 또는 Promise |
| 설정 파일 로드 (시작 시) | 동기 가능 |
| 여러 파일 동시 처리 | **Promise.all** |
| 순차적 파일 처리 | **async/await** |

---

## 실전 패턴

### 1. 안전한 파일 쓰기
```javascript
const fs = require('fs').promises;

async function safeWrite(path, data) {
  const tempPath = path + '.tmp';
  try {
    await fs.writeFile(tempPath, data);
    await fs.rename(tempPath, path);  // atomic operation
  } catch (error) {
    await fs.unlink(tempPath).catch(() => {});  // cleanup
    throw error;
  }
}
```

### 2. 재귀적 파일 검색
```javascript
async function findFiles(dir, ext) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const file of files) {
    const path = `${dir}/${file.name}`;
    if (file.isDirectory()) {
      results.push(...await findFiles(path, ext));
    } else if (file.name.endsWith(ext)) {
      results.push(path);
    }
  }

  return results;
}
```

### 3. 파일 존재 확인 후 처리
```javascript
async function readIfExists(path) {
  try {
    await fs.access(path);  // 접근 가능한지 확인
    return await fs.readFile(path, 'utf-8');
  } catch {
    return null;  // 파일 없음
  }
}
```

---

## 주의사항

### ⚠️ 경로 처리
```javascript
// ❌ 잘못된 방법
const path = './data/' + filename;

// ✅ 올바른 방법
const path = require('path');
const filePath = path.join(__dirname, 'data', filename);
```

### ⚠️ 인코딩 지정
```javascript
// ❌ 인코딩 생략 시 Buffer 반환
const data = fs.readFileSync('file.txt');

// ✅ 문자열로 읽으려면 인코딩 지정
const data = fs.readFileSync('file.txt', 'utf-8');
```

### ⚠️ 에러 처리
```javascript
// ❌ 에러 처리 없음
fs.readFile('file.txt', (err, data) => {
  console.log(data);  // err 체크 안 함!
});

// ✅ 항상 에러 체크
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('에러:', err);
    return;
  }
  console.log(data);
});
```

---

## 핵심 정리

### fs 모듈의 세 가지 API
1. **동기 (Sync)**: 간단한 스크립트, 초기화 코드
2. **비동기 (Callback)**: 레거시 코드
3. **비동기 (Promise)**: 현대적인 방법, 권장 ⭐

### 주요 작업
- **읽기**: `readFile()`, `readdir()`
- **쓰기**: `writeFile()`, `appendFile()`
- **삭제**: `unlink()`, `rm()`
- **복사/이동**: `copyFile()`, `rename()`
- **정보**: `stat()`, `access()`

### Best Practices
- ✅ 서버에서는 비동기 필수
- ✅ fs.promises + async/await 사용
- ✅ 항상 에러 처리
- ✅ path 모듈로 경로 생성
- ✅ 인코딩 명시적으로 지정

---

## 참고 자료

- [Node.js fs 모듈 공식 문서](https://nodejs.org/api/fs.html)
- [fs.promises API](https://nodejs.org/api/fs.html#promises-api)
- [File System Flags](https://nodejs.org/api/fs.html#file-system-flags)
