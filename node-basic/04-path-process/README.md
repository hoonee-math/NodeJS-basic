# 04. Path & Process

Node.js의 **path 모듈**과 **process 객체**를 학습합니다.

## 학습 목표

- **path 모듈**: 크로스 플랫폼 경로 처리 (Windows/macOS/Linux 호환)
- **process 객체**: 프로세스 정보 조회, 환경 변수, 입출력, 이벤트 처리

---

## 목차

1. [path 모듈 기본](#01-path-basicsjs) - join, resolve, basename, dirname, extname, parse, format, normalize, isAbsolute
2. [path 고급 활용](#02-path-operationsjs) - relative, 확장자 변경, 경로 검증, 보안(경로 이탈 방지), 깊이 계산
3. [process 정보 조회](#03-process-infojs) - version, platform, arch, pid, cwd, memoryUsage, uptime, cpuUsage
4. [커맨드라인 인자](#04-process-argvjs) - 인자 파싱, 플래그 처리, 옵션 파서 구현
5. [환경 변수](#05-process-envjs) - 환경 변수 읽기/쓰기, 타입 변환, 환경별 설정 분기
6. [표준 입력](#06-process-stdinjs) - readline 모듈, 대화형 프로그램, 파이프 처리
7. [프로세스 이벤트](#07-process-eventsjs) - exit, beforeExit, uncaughtException, SIGINT/SIGTERM, Graceful Shutdown

---

## 예제 파일 상세

### [01-path-basics.js](./01-path-basics.js)

**path 모듈의 핵심 메서드를 학습합니다.**

크로스 플랫폼 경로 처리를 위한 기본 메서드들을 다룹니다. Windows의 `\`와 POSIX의 `/`를 자동으로 처리하며, 문자열 결합 대신 안전한 경로 조작을 제공합니다.

**주요 메서드:**
- `path.join()` - 경로 조각을 플랫폼에 맞게 결합
- `path.resolve()` - 절대 경로로 변환
- `path.basename()` - 파일명 추출
- `path.dirname()` - 디렉토리 경로 추출
- `path.extname()` - 확장자 추출
- `path.parse()` - 경로를 객체로 분해 (root, dir, base, name, ext)
- `path.format()` - 객체를 경로 문자열로 변환
- `path.normalize()` - 경로 정규화 (`..`, `.`, `//` 처리)
- `path.isAbsolute()` - 절대 경로 여부 확인

**속성:**
- `path.sep` - 경로 구분자 (`\` 또는 `/`)
- `path.delimiter` - 환경 변수 구분자 (`;` 또는 `:`)

---

### [02-path-operations.js](./02-path-operations.js)

**path 모듈의 고급 활용법과 실전 패턴을 학습합니다.**

실무에서 자주 사용되는 경로 조작 패턴들을 다룹니다. 보안(경로 이탈 방지), 확장자 변경, 파일 그룹핑 등의 실전 예제를 제공합니다.

**주요 내용:**
- `path.relative()` - 상대 경로 계산
- `__dirname` + `path.join()` - 현재 파일 기준 경로 생성
- 확장자 변경 - `parse()` + `format()` 조합
- 파일명에 접미사 추가 - 썸네일, 백업 파일 생성
- **경로 이탈 방지** - 사용자 입력 경로 검증 (보안)
- 디렉토리 깊이 계산 - 경로를 `sep`로 분할
- 공통 부모 경로 찾기 - 여러 경로의 공통 조상
- 파일 타입별 분류 - `extname()`으로 그룹핑
- 경로 검증 - 빈 경로, 정규화, 확장자 체크

**보안 원칙:**
- 사용자 입력 경로는 항상 검증
- 경로 이탈(`../`) 시도 차단
- 절대 경로 사용 권장

---

### [03-process-info.js](./03-process-info.js)

**process 객체로 프로세스 정보를 조회합니다.**

현재 실행 중인 Node.js 프로세스의 정보(버전, 플랫폼, 메모리, CPU 등)를 확인하는 방법을 학습합니다.

**주요 속성:**
- `process.version` - Node.js 버전
- `process.platform` - 운영체제 (`win32`, `darwin`, `linux`)
- `process.arch` - CPU 아키텍처 (`x64`, `arm`, `arm64`)
- `process.pid` - 프로세스 ID
- `process.cwd()` - 현재 작업 디렉토리
- `process.execPath` - Node.js 실행 파일 경로
- `process.memoryUsage()` - 메모리 사용량 (RSS, heap)
- `process.uptime()` - 실행 시간 (초 단위)
- `process.cpuUsage()` - CPU 사용 시간

**활용:**
- 모니터링 대시보드
- 성능 프로파일링
- OS별 분기 처리
- 로깅 및 디버깅

---

### [04-process-argv.js](./04-process-argv.js)

**커맨드라인 인자를 처리하는 방법을 학습합니다.**

CLI 프로그램 작성에 필수적인 인자 파싱, 플래그 처리, 옵션 파서 구현을 다룹니다.

**주요 내용:**
- `process.argv` 구조 - `[0]` Node 경로, `[1]` 스크립트 경로, `[2~]` 실제 인자
- `argv.slice(2)` - 실제 인자만 추출
- 플래그 파싱 - `--key=value`, `--key`, `-abc` 형식
- 필수 인자 검증 - `process.exit(1)`로 에러 종료
- 숫자 타입 변환 - `Number()`, `parseInt()`
- 옵션 파서 클래스 - 재사용 가능한 파서 구현
- help 메시지 - `--help` 플래그로 사용법 안내
- 실전 예제 - 계산기 CLI 프로그램

**우선순위:**
1. 커맨드라인 인자 (`--port 3000`)
2. 환경 변수 (`PORT=3000`)
3. 기본값 (`3000`)

---

### [05-process-env.js](./05-process-env.js)

**환경 변수를 읽고 쓰는 방법을 학습합니다.**

설정 값을 코드 외부에서 주입하는 환경 변수 활용법과 타입 변환, 환경별 분기 처리를 다룹니다.

**주요 내용:**
- `process.env` - 환경 변수 객체
- 기본값 패턴 - `env.KEY || defaultValue`
- **boolean 변환** - 반드시 `=== "true"` 사용 (문자열이므로)
- 숫자 변환 - `parseInt()`로 안전하게 변환
- 필수 변수 검증 - `requireEnv()` 함수로 시작 시 확인
- 리스트 파싱 - `split(',')`로 쉼표 구분 값 처리
- 민감 정보 보호 - 마스킹 또는 로그 출력 금지
- 환경별 설정 분기 - `NODE_ENV`로 development/production/test 분리

**환경별 분기:**
- `development` - 로컬 개발 환경
- `test` - 자동화 테스트 환경
- `production` - 실서버 환경

**보안:**
- `.env` 파일은 `.gitignore`에 추가
- API 키, 비밀번호 등은 로그에 출력 금지

---

### [06-process-stdin.js](./06-process-stdin.js)

**표준 입력으로 사용자 입력을 받는 방법을 학습합니다.**

대화형 CLI 프로그램 작성을 위한 입력 처리, readline 모듈 활용, 파이프 처리를 다룹니다.

**주요 내용:**
- `process.stdin` - 표준 입력 스트림 (Readable)
- `readline.createInterface()` - 줄 단위 입력 처리 (권장)
- `rl.question()` - 단일 질문으로 입력 받기
- 연속 질문 - 배열로 질문 관리
- Yes/No 질문 - 재귀로 유효한 입력까지 반복
- 메뉴 선택 - switch 문으로 선택지 처리
- 입력 검증 - 정규식, 타입 체크 후 재입력 요청
- 줄 단위 처리 - `rl.on('line')` 이벤트
- 파이프 입력 - `isTTY` 체크로 파이프 모드 감지

**실전 패턴:**
- 입력 검증 + 재입력 요청
- 메뉴 시스템 구현
- 파이프 입력 처리 (`echo "data" | node script.js`)

**외부 패키지:**
- `inquirer` - 인터랙티브 CLI
- `prompts` - 가벼운 프롬프트
- `read` - 비밀번호 입력 (숨김)

---

### [07-process-events.js](./07-process-events.js)

**프로세스 이벤트와 시그널 처리를 학습합니다.**

안전한 프로세스 종료(Graceful Shutdown), 에러 처리, 시그널 핸들링을 다룹니다.

**주요 이벤트:**
- `exit` - 프로세스 종료 직전 (동기 작업만 가능)
- `beforeExit` - 이벤트 루프가 비었을 때 (비동기 작업 가능)
- `uncaughtException` - 처리되지 않은 예외 발생
- `unhandledRejection` - 처리되지 않은 Promise rejection
- `warning` - Node.js 경고 발생
- `SIGINT` - Ctrl+C 감지
- `SIGTERM` - 종료 신호 (graceful shutdown)

**Graceful Shutdown 패턴:**
1. 새 요청 거부
2. 진행 중인 작업 완료 대기
3. 외부 연결 종료 (DB, Redis 등)
4. 리소스 정리
5. `process.exit(0)` 정상 종료

**주의사항:**
- `uncaughtException` 후에는 반드시 프로세스 종료
- `exit` 이벤트에서는 비동기 작업 금지
- `SIGKILL`은 처리 불가 (강제 종료)
- Windows는 `SIGTERM` 미지원

**종료 코드:**
- `0` - 정상 종료
- `1` - 일반 에러
- `130` - SIGINT (Ctrl+C)

---

## 실습 가이드

### path 모듈

```bash
node 01-path-basics.js
node 02-path-operations.js
```

### process 객체

```bash
# 커맨드라인 인자
node 04-process-argv.js arg1 arg2
node 04-process-argv.js --port=3000 --debug
node 04-process-argv.js 10 + 5

# 환경 변수 (Linux/macOS)
NODE_ENV=production PORT=8080 node 05-process-env.js

# 환경 변수 (Windows cmd)
set NODE_ENV=production && node 05-process-env.js

# 표준 입력
node 06-process-stdin.js
echo "Hello" | node 06-process-stdin.js

# 프로세스 이벤트
node 07-process-events.js
# Ctrl+C로 SIGINT 테스트
```

---

## 비교표

### path vs 문자열 결합

| 방법 | 코드 | Windows | POSIX |
|------|------|---------|-------|
| ❌ 문자열 | `'C:' + '\\' + 'file.txt'` | ✅ 작동 | ❌ 깨짐 |
| ❌ 템플릿 | `` `${dir}/${file}` `` | ❌ 깨짐 | ✅ 작동 |
| ✅ path | `path.join(dir, file)` | ✅ 작동 | ✅ 작동 |

**결론**: 항상 `path` 모듈을 사용하세요!

---

## 핵심 정리

### path 모듈

```javascript
const path = require('path');

// 경로 결합 (크로스 플랫폼)
path.join('users', 'john', 'file.txt');

// 절대 경로 변환
path.resolve('file.txt');  // /current/dir/file.txt

// 경로 분해
path.parse('/home/user/file.txt');
// { root, dir, base, name, ext }

// 상대 경로 계산
path.relative('/data/a', '/data/b/c');  // '../b/c'
```

### process 객체

```javascript
// 시스템 정보
process.version      // Node.js 버전
process.platform     // 'win32', 'darwin', 'linux'
process.arch         // 'x64', 'arm', 'arm64'
process.pid          // 프로세스 ID

// 커맨드라인
process.argv         // ['node', 'script.js', 'arg1', 'arg2']
process.argv.slice(2)  // ['arg1', 'arg2']

// 환경 변수
process.env.NODE_ENV || 'development'
process.env.PORT || 3000

// 표준 입력
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('이름? ', (answer) => {
  console.log(`안녕하세요, ${answer}님!`);
  rl.close();
});

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('정리 작업 중...');
  process.exit(0);
});
```

---

## ⚠️ 주의사항

### path 모듈
- 문자열 결합 대신 `path.join()` 사용
- 절대 경로 우선 (`path.resolve()`, `__dirname`)
- 사용자 입력 경로는 검증 필수 (경로 이탈 방지)

### process 객체
- `process.exit()` 사용 시 비동기 작업 완료 확인
- 환경 변수는 항상 문자열 (boolean은 `=== "true"` 비교)
- `uncaughtException` 후에는 반드시 프로세스 종료
- `.env` 파일은 `.gitignore`에 추가 (보안)

---

## 다음 단계

**05-http**에서 HTTP 서버 구축을 배웁니다!
