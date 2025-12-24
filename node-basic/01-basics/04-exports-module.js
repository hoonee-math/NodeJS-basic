/**
 * 04-exports-module.js
 *
 * CommonJS 모듈 시스템 - module.exports와 exports
 * 내가 만든 기능을 다른 파일에서 사용할 수 있게 내보내기
 */

console.log('=== 모듈 내보내기 (Exports) ===\n');

// 이 파일은 exports의 개념을 설명하는 파일입니다.
// 실제로 다른 파일에서 require 할 수 있는 예제를 만들어봅시다.

console.log('1. module.exports 이해하기:');
console.log('   - 모듈에서 내보낼 값을 지정합니다.');
console.log('   - 다른 파일에서 require()로 가져갈 수 있습니다.\n');

// 예제를 위해 별도 모듈 파일들을 참조합니다
console.log('2. 내보내기 패턴들:\n');

// 패턴 1: 객체로 여러 함수 내보내기
console.log('패턴 1: 객체로 내보내기');
console.log(`
// math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add,
  subtract
};

// 사용하기
const math = require('./math');
math.add(5, 3); // 8
`);

// 패턴 2: 하나의 함수만 내보내기
console.log('\n패턴 2: 단일 함수 내보내기');
console.log(`
// greet.js
module.exports = function(name) {
  return 'Hello, ' + name;
};

// 사용하기
const greet = require('./greet');
greet('World'); // 'Hello, World'
`);

// 패턴 3: 클래스 내보내기
console.log('\n패턴 3: 클래스 내보내기');
console.log(`
// User.js
class User {
  constructor(name) {
    this.name = name;
  }

  sayHello() {
    return 'Hello, I am ' + this.name;
  }
}

module.exports = User;

// 사용하기
const User = require('./User');
const user = new User('Alice');
user.sayHello(); // 'Hello, I am Alice'
`);

// 패턴 4: exports 축약형 사용
console.log('\n패턴 4: exports 축약형');
console.log(`
// utils.js
exports.uppercase = function(str) {
  return str.toUpperCase();
};

exports.lowercase = function(str) {
  return str.toLowerCase();
};

// 사용하기
const utils = require('./utils');
utils.uppercase('hello'); // 'HELLO'
`);

console.log('\n3. module.exports vs exports 차이:');
console.log(`
   - module.exports: 실제로 내보내지는 객체
   - exports: module.exports를 가리키는 별칭 (shortcut)

   ✅ 가능:
   exports.func = () => {}

   ❌ 불가능 (exports를 재할당하면 연결이 끊김):
   exports = { func: () => {} }

   ✅ 올바른 방법:
   module.exports = { func: () => {} }
`);

console.log('\n4. 내부 동작 원리:');
console.log(`
// Node.js가 내부적으로 하는 일
(function(exports, require, module, __filename, __dirname) {
  // 여기에 우리의 코드가 들어감

  // exports는 module.exports의 참조
  // 그래서 exports.foo = 'bar'는 동작하지만
  // exports = { foo: 'bar' }는 동작하지 않음
});
`);

/**
 * 핵심 정리:
 *
 * 1. 여러 개 내보내기: module.exports = { a, b, c }
 * 2. 하나만 내보내기: module.exports = function() {}
 * 3. 축약형: exports.name = value (단, 재할당은 안 됨)
 * 4. 권장: 헷갈리지 않게 module.exports만 사용하기
 */

// 다음 파일에서 실제 동작하는 예제를 볼 수 있습니다:
console.log('\n📌 다음 단계:');
console.log('   다음 예제 파일들에서 실제로 모듈을 만들고 사용해봅시다!');
