/**
 * 05-builtin-modules.js
 *
 * Node.js 내장 모듈 사용하기
 * npm install 없이 바로 사용할 수 있는 핵심 모듈들
 */

console.log('=== Node.js 내장 모듈 ===\n');

// 1. os - 운영체제 정보
console.log('1. os 모듈 (운영체제 정보)');
const os = require('os');

console.log('   플랫폼:', os.platform()); // 'win32', 'darwin', 'linux'
console.log('   CPU 아키텍처:', os.arch()); // 'x64', 'arm64'
console.log('   CPU 코어 수:', os.cpus().length);
console.log('   총 메모리:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('   사용 가능 메모리:', (os.freemem() / 1024 / 1024 / 1024).toFixed(2), 'GB');
console.log('   홈 디렉토리:', os.homedir());
console.log('   호스트네임:', os.hostname());
console.log('   시스템 가동 시간:', (os.uptime() / 3600).toFixed(2), '시간');

// 2. path - 경로 처리 (플랫폼 독립적)
console.log('\n2. path 모듈 (경로 처리)');
const path = require('path');

console.log('   경로 구분자:', path.sep); // Windows: \, Unix: /
console.log('   현재 파일명:', path.basename(__filename)); // '05-builtin-modules.js'
console.log('   확장자:', path.extname(__filename)); // '.js'
console.log('   디렉토리:', path.dirname(__filename));

// 경로 결합 (플랫폼에 맞게 자동으로 처리)
const fullPath = path.join('users', 'john', 'documents', 'file.txt');
console.log('   경로 결합:', fullPath);

// 절대 경로로 변환
const absolutePath = path.resolve('file.txt');
console.log('   절대 경로:', absolutePath);

// 경로 분석
const parsed = path.parse('/users/john/file.txt');
console.log('   경로 분석:', parsed);

// 3. url - URL 파싱
console.log('\n3. url 모듈 (URL 처리)');
const url = require('url');

const myUrl = new URL('https://example.com:8080/path?name=john&age=30#section');
console.log('   프로토콜:', myUrl.protocol); // 'https:'
console.log('   호스트:', myUrl.host); // 'example.com:8080'
console.log('   호스트네임:', myUrl.hostname); // 'example.com'
console.log('   포트:', myUrl.port); // '8080'
console.log('   경로:', myUrl.pathname); // '/path'
console.log('   쿼리 문자열:', myUrl.search); // '?name=john&age=30'
console.log('   해시:', myUrl.hash); // '#section'

// 쿼리 파라미터 접근
console.log('   name 파라미터:', myUrl.searchParams.get('name')); // 'john'
console.log('   age 파라미터:', myUrl.searchParams.get('age')); // '30'

// 4. util - 유틸리티 함수들
console.log('\n4. util 모듈 (유틸리티)');
const util = require('util');

// 객체를 문자열로 변환 (깊이 제한 없음)
const obj = { a: 1, b: { c: 2, d: { e: 3 } } };
console.log('   객체 출력:', util.inspect(obj, { depth: null, colors: true }));

// 함수 타입 체크
console.log('   함수 체크:', util.types.isAsyncFunction(async () => {})); // true

// 5. crypto - 암호화
console.log('\n5. crypto 모듈 (암호화)');
const crypto = require('crypto');

// 해시 생성
const hash = crypto.createHash('sha256').update('password123').digest('hex');
console.log('   SHA-256 해시:', hash);

// 랜덤 문자열 생성
const randomStr = crypto.randomBytes(16).toString('hex');
console.log('   랜덤 문자열:', randomStr);

// 6. querystring - 쿼리 문자열 파싱
console.log('\n6. querystring 모듈');
const querystring = require('querystring');

const qs = 'name=john&age=30&city=seoul';
const parsed_qs = querystring.parse(qs);
console.log('   파싱된 쿼리:', parsed_qs);

const obj_to_qs = { name: 'jane', age: 25 };
const stringified = querystring.stringify(obj_to_qs);
console.log('   객체를 쿼리로:', stringified);

// 7. timers - 타이머 함수들
console.log('\n7. timers 모듈');
console.log('   setTimeout, setInterval, setImmediate 등');
console.log('   (브라우저와 거의 동일하게 사용)');

// setTimeout 예제
setTimeout(() => {
  console.log('   ⏰ 1초 후 실행!');
}, 1000);

// setImmediate (Node.js 전용)
setImmediate(() => {
  console.log('   ⚡ setImmediate - 다음 이벤트 루프에서 실행');
});

// process.nextTick (가장 빠르게 실행)
process.nextTick(() => {
  console.log('   🚀 process.nextTick - 현재 작업 직후 즉시 실행');
});

console.log('   💡 실행 순서: 동기 코드 → nextTick → setImmediate → setTimeout');

/**
 * 주요 내장 모듈 요약:
 *
 * - os: 운영체제 정보
 * - path: 경로 처리 (플랫폼 독립적)
 * - fs: 파일 시스템 (다음 챕터에서 자세히)
 * - http/https: HTTP 서버/클라이언트
 * - url: URL 파싱
 * - querystring: 쿼리 문자열 처리
 * - util: 유틸리티 함수들
 * - crypto: 암호화/해시
 * - events: 이벤트 발생/처리
 * - stream: 스트림 처리
 *
 * 전체 목록: https://nodejs.org/docs/latest/api/
 */

/**
 * 실행:
 * node 05-builtin-modules.js
 */
