/**
 * 01-hello-world.js
 *
 * Node.js의 첫 번째 프로그램
 * 터미널에서 실행: node 01-hello-world.js
 */

// console.log는 브라우저와 Node.js 모두에서 사용 가능
console.log('Hello, Node.js!');

// 여러 줄 출력
console.log('='.repeat(50));
console.log('Node.js 기초 학습을 시작합니다.');
console.log('='.repeat(50));

// 변수와 함께 출력
const name = 'Node.js';
const version = process.version; // Node.js 버전 정보
console.log(`현재 ${name} 버전: ${version}`);

// 간단한 계산
const a = 10;
const b = 20;
console.log(`${a} + ${b} = ${a + b}`);

// 배열과 객체 출력
const fruits = ['apple', 'banana', 'orange'];
console.log('과일 목록:', fruits);

const user = {
  name: '홍길동',
  age: 25,
  job: 'Developer'
};
console.log('사용자 정보:', user);

/**
 * 실행 결과:
 * Hello, Node.js!
 * ==================================================
 * Node.js 기초 학습을 시작합니다.
 * ==================================================
 * 현재 Node.js 버전: v20.x.x
 * 10 + 20 = 30
 * 과일 목록: [ 'apple', 'banana', 'orange' ]
 * 사용자 정보: { name: '홍길동', age: 25, job: 'Developer' }
 */
