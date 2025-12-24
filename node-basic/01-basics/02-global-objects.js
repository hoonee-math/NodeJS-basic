/**
 * 02-global-objects.js
 *
 * Node.js의 전역 객체 탐색
 * 브라우저의 window와 달리 Node.js는 global 객체를 사용합니다.
 */

console.log('=== Node.js 전역 객체 ===\n');

// 1. global 객체 (브라우저의 window와 유사)
console.log('1. global 객체 타입:', typeof global);
// console, setTimeout 등이 global 객체의 속성입니다
console.log('   global.console === console:', global.console === console);

// 2. process 객체 - 현재 Node.js 프로세스 정보
console.log('\n2. process 객체:');
console.log('   Node.js 버전:', process.version);
console.log('   플랫폼:', process.platform); // 'win32', 'darwin', 'linux'
console.log('   아키텍처:', process.arch); // 'x64', 'arm64' 등
console.log('   프로세스 ID:', process.pid);
console.log('   현재 작업 디렉토리:', process.cwd());

// 3. 환경 변수 (process.env)
console.log('\n3. 환경 변수 (process.env):');
console.log('   NODE_ENV:', process.env.NODE_ENV || '(설정되지 않음)');
console.log('   PATH 일부:', process.env.PATH.substring(0, 50) + '...');

// 4. 커맨드라인 인자 (process.argv)
console.log('\n4. 커맨드라인 인자:');
console.log('   process.argv:', process.argv);
console.log('   실행 명령:', process.argv[0]); // node 실행 파일 경로
console.log('   스크립트 파일:', process.argv[1]); // 현재 파일 경로
console.log('   추가 인자:', process.argv.slice(2)); // 사용자가 전달한 인자

// 5. console 객체의 다양한 메서드
console.log('\n5. console 메서드들:');
console.log('   일반 로그');
console.error('   에러 로그 (빨간색으로 표시될 수 있음)');
console.warn('   경고 로그 (노란색으로 표시될 수 있음)');
console.info('   정보 로그');

// 테이블 형식으로 출력
console.table([
  { 이름: '홍길동', 나이: 25 },
  { 이름: '김철수', 나이: 30 }
]);

// 시간 측정
console.time('작업 시간');
let sum = 0;
for (let i = 0; i < 1000000; i++) {
  sum += i;
}
console.timeEnd('작업 시간');

// 6. setTimeout, setInterval (브라우저와 동일)
console.log('\n6. 타이머 함수:');
console.log('   2초 후 메시지가 출력됩니다...');
setTimeout(() => {
  console.log('   ⏰ 2초가 지났습니다!');
}, 2000);

// 7. Buffer (Node.js 전용, 브라우저에는 없음)
console.log('\n7. Buffer (바이너리 데이터 처리):');
const buf = Buffer.from('Hello');
console.log('   Buffer:', buf);
console.log('   문자열로 변환:', buf.toString());

/**
 * 실행해보기:
 * node 02-global-objects.js
 * node 02-global-objects.js arg1 arg2  (커맨드라인 인자 전달)
 */

/**
 * 브라우저와의 차이점:
 * - 브라우저: window, document, DOM, localStorage 등
 * - Node.js: global, process, Buffer, __dirname, __filename 등
 */
