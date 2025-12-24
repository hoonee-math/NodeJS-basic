# 01. Node.js 기초

Node.js의 가장 기본적인 개념들을 학습합니다.

## 학습 목표

- Node.js 실행 환경 이해
- CommonJS 모듈 시스템 익히기
- 내장 모듈 사용법 배우기
- package.json의 역할 이해

## 예제 파일 순서

1. **01-hello-world.js** - Node.js 첫 실행
2. **02-global-objects.js** - 전역 객체 (global, process 등)
3. **03-require-module.js** - 모듈 불러오기 (require)
4. **04-exports-module.js** - 모듈 내보내기 (module.exports, exports)
5. **05-builtin-modules.js** - 내장 모듈 사용
6. **06-dirname-filename.js** - __dirname, __filename 이해

## 핵심 개념 및 사용 메서드

### [01-hello-world.js](01-hello-world.js)

**주제**: Node.js 첫 실행과 기본 출력

**사용 메서드/속성**:
- `console.log()` - 콘솔에 내용을 출력. 디버깅과 결과 확인에 사용
- `process.version` - 현재 실행 중인 Node.js 버전 정보를 반환
- `String.repeat(n)` - 문자열을 n번 반복. 구분선이나 패턴 만들 때 활용
- 템플릿 리터럴 `` `${변수}` `` - 문자열 안에 변수를 삽입할 때 사용

---

### [02-global-objects.js](02-global-objects.js)

**주제**: Node.js 전역 객체와 환경 정보

**1. global 객체**
- `global` - Node.js의 최상위 전역 객체 (브라우저의 window와 유사)
- `global.console` - console이 global의 속성임을 확인

**2. process 객체**
- `process.version` - Node.js 버전 (예: v20.0.0)
- `process.platform` - 운영체제 플랫폼 ('win32', 'darwin', 'linux')
- `process.arch` - CPU 아키텍처 ('x64', 'arm64')
- `process.pid` - 현재 프로세스 ID
- `process.cwd()` - 현재 작업 디렉토리 (명령어를 실행한 위치)
- `process.env` - 환경 변수 객체. API 키, DB 정보 등 설정값 저장
- `process.argv` - 커맨드라인 인자 배열. [0]: node 경로, [1]: 스크립트 경로, [2~]: 사용자 인자

**3. console 메서드**
- `console.log()` - 일반 로그 출력
- `console.error()` - 에러 메시지 출력 (stderr로 출력됨)
- `console.warn()` - 경고 메시지 출력
- `console.info()` - 정보 메시지 출력
- `console.table()` - 객체 배열을 테이블 형식으로 출력. 데이터 비교할 때 유용
- `console.time(label)` - 타이머 시작. label은 타이머 식별자
- `console.timeEnd(label)` - 타이머 종료하고 경과 시간 출력. time()과 같은 label 사용해야 함. **두 함수 호출 사이의 모든 코드 실행 시간을 측정**

**4. 타이머 함수**
- `setTimeout(callback, ms)` - ms 밀리초 후 callback 실행
- `setInterval(callback, ms)` - ms 밀리초마다 callback 반복 실행

**5. Buffer (Node.js 전용)**
- `Buffer.from(string)` - 문자열을 바이너리 데이터로 변환
- `buffer.toString()` - Buffer를 문자열로 변환

---

### [03-require-module.js](03-require-module.js)

**주제**: 모듈 불러오기 (require)

**require 메서드**:
- `require('module-name')` - 모듈을 불러옴. 내장/외부/사용자 모듈 모두 가능
  - 내장 모듈: `require('fs')`, `require('path')` - 설치 불필요
  - 외부 모듈: `require('express')` - npm install 필요
  - 사용자 모듈: `require('./myModule')` - 상대 경로 필수 (./ 또는 ../)

**모듈 시스템 특징**:
- `require.cache` - 로드된 모듈 캐시 객체. 같은 모듈을 여러 번 require해도 한 번만 실행됨
- 확장자 생략 가능 - `require('./module')`은 `require('./module.js')`와 동일
- JSON 파일도 가능 - `require('./data.json')`으로 JSON 데이터를 객체로 불러옴

**구조 분해 할당**:
- `const { readFile } = require('fs')` - 필요한 함수만 꺼내서 사용

---

### [04-exports-module.js](04-exports-module.js)

**주제**: 모듈 내보내기 (module.exports, exports)

**module.exports**:
- `module.exports = value` - 모듈에서 내보낼 값 지정. 객체, 함수, 클래스 등 모두 가능
- `module.exports = { a, b }` - 여러 개를 객체로 묶어서 내보내기
- `module.exports = function() {}` - 함수 하나만 내보내기
- `module.exports = class {}` - 클래스 내보내기

**exports 축약형**:
- `exports.name = value` - module.exports.name = value의 축약
- **주의**: `exports = {}` 처럼 재할당하면 안 됨 (module.exports와 연결이 끊김)
- 권장: 헷갈리면 `module.exports`만 사용

**내보내기 패턴**:
```javascript
// 패턴 1: 여러 함수 내보내기
module.exports = { add, subtract };

// 패턴 2: 단일 함수
module.exports = function() {};

// 패턴 3: 클래스
module.exports = class User {};

// 패턴 4: exports 축약
exports.func = () => {};
```

---

### [05-builtin-modules.js](05-builtin-modules.js)

**주제**: Node.js 내장 모듈 사용

**1. os 모듈** (운영체제 정보)
- `os.platform()` - 운영체제 종류 ('win32', 'darwin', 'linux')
- `os.arch()` - CPU 아키텍처
- `os.cpus()` - CPU 정보 배열. `.length`로 코어 수 확인
- `os.totalmem()` - 전체 메모리 (바이트). 1024로 나눠서 GB 단위로 변환
- `os.freemem()` - 사용 가능한 메모리
- `os.homedir()` - 사용자 홈 디렉토리 경로
- `os.hostname()` - 컴퓨터 이름
- `os.uptime()` - 시스템 가동 시간 (초)

**2. path 모듈** (경로 처리)
- `path.sep` - 경로 구분자 (Windows: `\`, Unix: `/`)
- `path.basename(path)` - 파일명만 추출 (예: 'file.txt')
- `path.extname(path)` - 확장자만 추출 (예: '.txt')
- `path.dirname(path)` - 디렉토리 경로만 추출
- `path.join(...paths)` - 경로 결합. 플랫폼에 맞게 자동으로 구분자 처리
- `path.resolve(...paths)` - 절대 경로로 변환
- `path.parse(path)` - 경로를 객체로 분해 (root, dir, base, ext, name)

**3. url 모듈** (URL 처리)
- `new URL(urlString)` - URL 문자열을 파싱
- `url.protocol` - 프로토콜 ('https:', 'http:')
- `url.host` - 호스트명과 포트 ('example.com:8080')
- `url.hostname` - 호스트명만 ('example.com')
- `url.port` - 포트 번호
- `url.pathname` - 경로 부분 ('/path/to/page')
- `url.search` - 쿼리 문자열 ('?key=value')
- `url.hash` - 해시 부분 ('#section')
- `url.searchParams.get(key)` - 쿼리 파라미터 값 가져오기

**4. util 모듈** (유틸리티)
- `util.inspect(obj, options)` - 객체를 문자열로 변환. depth, colors 옵션으로 상세도 조절
- `util.types.isAsyncFunction(func)` - 함수 타입 체크

**5. crypto 모듈** (암호화)
- `crypto.createHash(algorithm)` - 해시 생성기 만들기 (algorithm: 'sha256', 'md5' 등)
- `.update(data)` - 해시할 데이터 입력
- `.digest(encoding)` - 해시 결과 출력 (encoding: 'hex', 'base64' 등)
- `crypto.randomBytes(size)` - 암호학적으로 안전한 랜덤 바이트 생성. 토큰, Salt 생성에 사용

**6. querystring 모듈** (쿼리 문자열)
- `querystring.parse(str)` - 쿼리 문자열을 객체로 변환
- `querystring.stringify(obj)` - 객체를 쿼리 문자열로 변환

**7. 타이머 함수**
- `setTimeout(callback, ms)` - ms 후 실행
- `setInterval(callback, ms)` - ms마다 반복 실행
- `setImmediate(callback)` - 다음 이벤트 루프 사이클에서 실행 (Node.js 전용)
- `process.nextTick(callback)` - 현재 작업 직후 가장 빨리 실행 (Node.js 전용)

**실행 순서**: 동기 코드 → nextTick → setImmediate → setTimeout

---

### [06-dirname-filename.js](06-dirname-filename.js)

**주제**: 파일 경로 관련 특수 변수

**특수 변수**:
- `__filename` - 현재 실행 중인 파일의 **절대 경로** (전체 경로 + 파일명)
- `__dirname` - 현재 파일이 있는 **디렉토리의 절대 경로**
- 두 변수 모두 어디서 실행하든 항상 동일한 값. 파일의 위치가 기준

**path 모듈과 조합**:
- `path.basename(__filename)` - 현재 파일명만 추출
- `path.extname(__filename)` - 현재 파일의 확장자
- `path.basename(__dirname)` - 현재 디렉토리명만 추출
- `path.join(__dirname, 'file.txt')` - 현재 폴더의 파일 경로 생성 (절대 경로)
- `path.join(__dirname, '..')` - 상위 폴더 경로

**__dirname vs process.cwd()**:
- `__dirname` - **파일이 있는 위치** (항상 동일)
- `process.cwd()` - **명령어를 실행한 위치** (실행 위치에 따라 변경됨)

**활용 패턴**:
```javascript
// 프로젝트 루트 찾기
const root = path.join(__dirname, '..', '..');

// 같은 폴더의 파일 참조
const config = require(path.join(__dirname, 'config.json'));

// 정적 파일 경로 (어디서 실행해도 동일)
const publicPath = path.join(__dirname, 'public');
```

**주의**: ES Modules에서는 `__dirname`, `__filename` 없음. 대신 `import.meta.url` 사용

---

## [CommonJS 모듈 시스템 정리](CommonJS-vs-ESM.md)

01-basics에서 배운 가장 핵심적인 개념인 **모듈 시스템**을 요약 정리합니다.
위 예제에서 `os`, `path`, `url` 등을 사용했지만, Node.js에는 이 외에도 수십 가지 내장 모듈이 있으며, npm을 통해 설치 가능한 외부 모듈은 수백만 개에 달합니다. 모듈 시스템은 이 모든 것을 일관된 방식으로 사용할 수 있게 해줍니다.

### 모듈 불러오기
```javascript
const module = require('module-name');
```

### 모듈 내보내기
```javascript
module.exports = { func1, func2 };
// 또는
exports.func = () => {};
```

### 모듈 종류
1. **내장 모듈**: `require('fs')` - 설치 불필요, Node.js에 기본 포함
2. **외부 모듈**: `require('express')` - npm install 필요, 커뮤니티에서 제공
3. **사용자 모듈**: `require('./myModule')` - 상대 경로 필수, 직접 작성한 파일

---

## 참고 자료
- [Node.js 모듈 시스템](https://nodejs.org/api/modules.html)
- [전역 객체](https://nodejs.org/api/globals.html)
- [내장 모듈 API](https://nodejs.org/docs/latest/api/)
