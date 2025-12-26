# 04. Path & Process

Node.js의 path 모듈과 process 객체를 학습합니다.

## 학습 목표

- **path 모듈**: 크로스 플랫폼 경로 처리
- **process 객체**: 프로세스 정보, 환경 변수, 입출력

---

## 예제 파일

1. **[01-path-basics.js](./01-path-basics.js)** - path 모듈 기본
2. **[02-path-operations.js](./02-path-operations.js)** - path 고급 활용
3. **[03-process-info.js](./03-process-info.js)** - process 정보 조회
4. **[04-process-argv.js](./04-process-argv.js)** - 커맨드라인 인자
5. **[05-process-env.js](./05-process-env.js)** - 환경 변수
6. **[06-process-stdin.js](./06-process-stdin.js)** - 표준 입력
7. **[07-process-events.js](./07-process-events.js)** - 프로세스 이벤트

---

## 핵심 개념

### path 모듈

파일 경로를 OS에 무관하게 안전하게 다루는 모듈입니다.

#### 왜 path 모듈을 사용하나요?

| 문제 | 해결 |
|------|------|
| Windows: `C:\Users\...` | `path.join()`으로 자동 변환 |
| macOS/Linux: `/Users/...` | 플랫폼별 구분자 자동 처리 |
| 문자열 결합 실수 | 안전한 경로 결합 |

#### path 주요 메서드

##### `path.join(...paths)`
**무엇을**: 여러 경로 조각을 결합하여 하나의 경로로 만듭니다.
**왜**: 플랫폼별 경로 구분자(`\` vs `/`)를 자동 처리하고, `..`와 `.`를 해석합니다.
**어떻게**:
```javascript
const path = require('path');
const fullPath = path.join('users', 'john', 'docs', 'file.txt');
// Windows: users\john\docs\file.txt
// POSIX: users/john/docs/file.txt
```

##### `path.resolve(...paths)`
**무엇을**: 절대 경로로 변환합니다.
**왜**: 상대 경로를 절대 경로로 바꾸거나, 현재 작업 디렉토리 기준으로 경로를 계산합니다.
**어떻게**:
```javascript
path.resolve('file.txt');  // /current/working/directory/file.txt
path.resolve('/foo', 'bar', 'baz');  // /foo/bar/baz
```

##### `path.basename(path, [ext])`
**무엇을**: 경로의 마지막 부분(파일명)을 추출합니다.
**왜**: 전체 경로에서 파일명만 필요할 때 사용합니다.
**어떻게**:
```javascript
path.basename('/user/docs/file.txt');  // 'file.txt'
path.basename('/user/docs/file.txt', '.txt');  // 'file'
```

##### `path.dirname(path)`
**무엇을**: 경로에서 디렉토리 부분만 추출합니다.
**왜**: 파일이 있는 폴더 경로를 얻고 싶을 때 사용합니다.
**어떻게**:
```javascript
path.dirname('/user/docs/file.txt');  // '/user/docs'
```

##### `path.extname(path)`
**무엇을**: 파일 확장자를 추출합니다.
**왜**: 파일 타입을 확인하거나 필터링할 때 유용합니다.
**어떻게**:
```javascript
path.extname('file.txt');  // '.txt'
path.extname('archive.tar.gz');  // '.gz'
```

##### `path.parse(path)`
**무엇을**: 경로를 객체로 분해합니다.
**왜**: 경로의 각 부분(root, dir, base, name, ext)을 개별적으로 다룰 때 사용합니다.
**어떻게**:
```javascript
path.parse('/home/user/file.txt');
// {
//   root: '/',
//   dir: '/home/user',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
```

##### `path.format(pathObject)`
**무엇을**: 객체를 경로 문자열로 변환합니다.
**왜**: `path.parse()`의 반대 작업, 동적으로 경로를 생성할 때 사용합니다.
**어떻게**:
```javascript
path.format({
  dir: '/home/user',
  base: 'file.txt'
});  // '/home/user/file.txt'
```

##### `path.normalize(path)`
**무엇을**: 경로를 정규화합니다(`..`, `.`, `//` 등 처리).
**왜**: 복잡하거나 중복된 경로 구분자를 정리합니다.
**어떻게**:
```javascript
path.normalize('/foo/bar//baz/../qux');  // '/foo/bar/qux'
```

##### `path.isAbsolute(path)`
**무엇을**: 절대 경로인지 확인합니다.
**왜**: 경로가 루트부터 시작하는지 판단할 때 사용합니다.
**어떻게**:
```javascript
path.isAbsolute('/foo/bar');  // true
path.isAbsolute('foo/bar');   // false
```

##### `path.relative(from, to)`
**무엇을**: 한 경로에서 다른 경로로의 상대 경로를 계산합니다.
**왜**: 두 경로 간의 관계를 표현할 때 사용합니다.
**어떻게**:
```javascript
path.relative('/data/orandea', '/data/impl/bbb');
// '../impl/bbb'
```

#### path 속성

##### `path.sep`
**무엇을**: 현재 플랫폼의 경로 구분자입니다.
**왜**: 동적으로 경로 구분자가 필요할 때 사용합니다.
**어떻게**:
```javascript
// Windows: path.sep === '\\'
// POSIX: path.sep === '/'
'foo/bar/baz'.split(path.sep);
```

##### `path.delimiter`
**무엇을**: 환경 변수 경로 구분자입니다.
**왜**: `PATH` 같은 환경 변수를 파싱할 때 사용합니다.
**어떻게**:
```javascript
// Windows: path.delimiter === ';'
// POSIX: path.delimiter === ':'
process.env.PATH.split(path.delimiter);
```

---

### process 객체

현재 Node.js 프로세스에 대한 정보를 제공하는 전역 객체입니다.

#### process 주요 속성

##### `process.version`
**무엇을**: Node.js 버전 정보입니다.
**왜**: 버전에 따라 다른 동작을 해야 할 때 사용합니다.
**어떻게**:
```javascript
console.log(process.version);  // 'v18.17.0'
```

##### `process.platform`
**무엇을**: 운영체제 플랫폼 이름입니다.
**왜**: OS별 분기 처리가 필요할 때 사용합니다.
**어떻게**:
```javascript
console.log(process.platform);  // 'win32', 'darwin', 'linux'
```

##### `process.arch`
**무엇을**: CPU 아키텍처입니다.
**왜**: 아키텍처별로 다른 바이너리를 로드할 때 사용합니다.
**어떻게**:
```javascript
console.log(process.arch);  // 'x64', 'arm', 'arm64'
```

##### `process.pid`
**무엇을**: 현재 프로세스의 PID(Process ID)입니다.
**왜**: 프로세스 식별이나 로깅에 사용합니다.
**어떻게**:
```javascript
console.log(process.pid);  // 12345
```

##### `process.cwd()`
**무엇을**: 현재 작업 디렉토리(Current Working Directory)를 반환합니다.
**왜**: 상대 경로의 기준점을 알아야 할 때 사용합니다.
**어떻게**:
```javascript
console.log(process.cwd());  // '/Users/john/project'
```

##### `process.argv`
**무엇을**: 커맨드라인 인자 배열입니다.
**왜**: 프로그램 실행 시 전달된 인자를 읽어야 할 때 사용합니다.
**어떻게**:
```javascript
// node script.js arg1 arg2
console.log(process.argv);
// ['/usr/local/bin/node', '/path/to/script.js', 'arg1', 'arg2']
```

##### `process.env`
**무엇을**: 환경 변수 객체입니다.
**왜**: 설정 값을 코드 외부에서 주입할 때 사용합니다(API 키, DB 연결 등).
**어떻게**:
```javascript
console.log(process.env.NODE_ENV);  // 'development', 'production'
console.log(process.env.PORT);      // '3000'
```

##### `process.memoryUsage()`
**무엇을**: 메모리 사용량을 반환합니다.
**왜**: 메모리 누수를 추적하거나 성능을 모니터링할 때 사용합니다.
**어떻게**:
```javascript
const mem = process.memoryUsage();
// {
//   rss: 30334976,        // Resident Set Size
//   heapTotal: 6537216,   // V8 힙 총량
//   heapUsed: 4190696,    // V8 힙 사용량
//   external: 8772        // C++ 객체 메모리
// }
```

##### `process.uptime()`
**무엇을**: 프로세스가 실행된 시간(초 단위)을 반환합니다.
**왜**: 서버 가동 시간이나 성능 측정에 사용합니다.
**어떻게**:
```javascript
console.log(process.uptime());  // 123.456 (초)
```

#### process 주요 메서드

##### `process.exit([code])`
**무엇을**: 프로세스를 종료합니다.
**왜**: 에러 발생 시 즉시 종료하거나, 작업 완료 후 종료할 때 사용합니다.
**어떻게**:
```javascript
process.exit(0);  // 정상 종료
process.exit(1);  // 에러로 종료
```

##### `process.chdir(directory)`
**무엇을**: 현재 작업 디렉토리를 변경합니다.
**왜**: 프로그램 실행 중 작업 위치를 바꿔야 할 때 사용합니다.
**어떻게**:
```javascript
console.log(process.cwd());  // '/foo'
process.chdir('/bar');
console.log(process.cwd());  // '/bar'
```

#### process 표준 입출력

##### `process.stdout`
**무엇을**: 표준 출력 스트림입니다.
**왜**: `console.log()`보다 세밀한 출력 제어가 필요할 때 사용합니다.
**어떻게**:
```javascript
process.stdout.write('Hello\n');
```

##### `process.stderr`
**무엇을**: 표준 에러 스트림입니다.
**왜**: 에러 메시지를 별도로 출력해야 할 때 사용합니다.
**어떻게**:
```javascript
process.stderr.write('Error occurred\n');
```

##### `process.stdin`
**무엇을**: 표준 입력 스트림입니다.
**왜**: 사용자 입력을 받아야 할 때 사용합니다.
**어떻게**:
```javascript
process.stdin.on('data', (chunk) => {
  console.log('입력:', chunk.toString());
});
```

#### process 이벤트

##### `exit`
**무엇을**: 프로세스가 종료될 때 발생합니다.
**왜**: 종료 전 정리 작업(cleanup)을 수행할 때 사용합니다.
**어떻게**:
```javascript
process.on('exit', (code) => {
  console.log(`종료 코드: ${code}`);
});
```

##### `beforeExit`
**무엇을**: 이벤트 루프가 비었을 때 발생합니다.
**왜**: 비동기 작업을 추가로 예약할 수 있습니다(exit과 다른 점).
**어떻게**:
```javascript
process.on('beforeExit', (code) => {
  console.log('곧 종료됩니다');
});
```

##### `uncaughtException`
**무엇을**: 처리되지 않은 예외가 발생했을 때 발생합니다.
**왜**: 애플리케이션이 크래시되기 전 마지막 에러 로깅 기회입니다.
**어떻게**:
```javascript
process.on('uncaughtException', (err) => {
  console.error('치명적 에러:', err);
  process.exit(1);
});
```

##### `unhandledRejection`
**무엇을**: 처리되지 않은 Promise rejection이 발생했을 때 발생합니다.
**왜**: Promise에서 `.catch()`를 빠뜨린 경우를 잡아냅니다.
**어떻게**:
```javascript
process.on('unhandledRejection', (reason, promise) => {
  console.error('처리 안 된 rejection:', reason);
});
```

##### `SIGINT` / `SIGTERM`
**무엇을**: Unix 시그널을 받았을 때 발생합니다.
**왜**: Ctrl+C나 프로세스 종료 시그널을 받아 graceful shutdown을 구현할 때 사용합니다.
**어떻게**:
```javascript
process.on('SIGINT', () => {
  console.log('Ctrl+C 감지, 정리 작업 중...');
  process.exit(0);
});
```

---

## 실습 가이드

### path 모듈 실습

```bash
node 01-path-basics.js
node 02-path-operations.js
```

### process 객체 실습

```bash
# 커맨드라인 인자 전달
node 04-process-argv.js arg1 arg2

# 환경 변수 설정
NODE_ENV=production PORT=8080 node 05-process-env.js

# 표준 입력 테스트
echo "Hello World" | node 06-process-stdin.js
```

---

## path vs 문자열 결합

| 방법 | 코드 | Windows | POSIX |
|------|------|---------|-------|
| ❌ 문자열 | `'C:' + '\\' + 'file.txt'` | ✅ 작동 | ❌ 깨짐 |
| ❌ 템플릿 | `` `${dir}/${file}` `` | ❌ 깨짐 | ✅ 작동 |
| ✅ path | `path.join(dir, file)` | ✅ 작동 | ✅ 작동 |

**결론**: 항상 `path` 모듈을 사용하세요!

---

## process.argv 구조

```bash
node script.js --name=John --age=30
```

```javascript
process.argv = [
  '/usr/local/bin/node',    // [0] Node.js 실행 파일 경로
  '/path/to/script.js',     // [1] 실행된 스크립트 경로
  '--name=John',            // [2] 첫 번째 인자
  '--age=30'                // [3] 두 번째 인자
]
```

**Tip**: 실제 인자는 `process.argv.slice(2)`로 추출합니다.

---

## 환경 변수 사용 예시

```javascript
// .env 파일 없이 환경 변수 사용
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const dbUrl = process.env.DATABASE_URL;

console.log(`서버 포트: ${port}`);
console.log(`환경: ${nodeEnv}`);
```

**실행**:
```bash
PORT=8080 NODE_ENV=production node server.js
```

---

## ⚠️ 주의사항

### path 모듈

1. **절대 경로 우선**: 가능하면 `path.resolve()`나 `__dirname` 사용
2. **플랫폼 독립적**: `path.join()` 사용, 문자열 결합 금지
3. **경로 검증**: `path.isAbsolute()`로 경로 유형 확인

### process 객체

1. **process.exit() 주의**: 비동기 작업이 완료되기 전에 종료될 수 있음
2. **환경 변수 보안**: 민감한 정보(API 키 등)는 `.env` 파일에 저장하고 `.gitignore`에 추가
3. **uncaughtException**: 이 이벤트 후에는 반드시 프로세스를 종료해야 안전함

---

## 다음 단계

**05-http**에서 HTTP 서버 구축을 배웁니다!
