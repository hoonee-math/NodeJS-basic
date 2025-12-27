/**
 * 02-type-inference.ts
 * 타입 추론 (Type Inference)
 * TypeScript가 자동으로 타입을 결정하는 방식
 */

// 1. 기본 타입 추론
let message = 'Hello, TypeScript'; // string으로 추론
let count = 42; // number로 추론
let isValid = true; // boolean으로 추론

console.log('=== 기본 타입 추론 ===');
console.log(`message: ${typeof message}`);
console.log(`count: ${typeof count}`);
console.log(`isValid: ${typeof isValid}`);

// 타입이 추론되었으므로 다른 타입 할당 불가
// message = 123; // ❌ 에러: number를 string에 할당 불가

// 2. 배열 타입 추론
let numbers = [1, 2, 3, 4, 5]; // number[]로 추론
let strings = ['a', 'b', 'c']; // string[]로 추론
let mixed = [1, 'two', true]; // (number | string | boolean)[]로 추론

console.log('\n=== 배열 타입 추론 ===');
console.log('numbers:', numbers);
console.log('strings:', strings);
console.log('mixed:', mixed);

// 3. 객체 타입 추론
let user = {
  name: 'John',
  age: 30,
  isActive: true,
};
// user의 타입: { name: string; age: number; isActive: boolean; }

console.log('\n=== 객체 타입 추론 ===');
console.log('user:', user);
// user.email = 'test@example.com'; // ❌ 에러: email 프로퍼티 없음

// 4. 함수 반환 타입 추론
function add(a: number, b: number) {
  return a + b; // 반환 타입이 number로 추론됨
}

function greet(name: string) {
  return `Hello, ${name}`; // 반환 타입이 string으로 추론됨
}

console.log('\n=== 함수 반환 타입 추론 ===');
console.log(`add(10, 20) = ${add(10, 20)}`);
console.log(greet('TypeScript'));

// 5. Best Type (최적 공통 타입)
// 여러 타입이 있을 때 가장 적합한 공통 타입을 추론
let mixedArray = [0, 1, null]; // (number | null)[]로 추론
let zoo = [new Error(), new Date()]; // (Error | Date)[]로 추론

console.log('\n=== Best Type 추론 ===');
console.log('mixedArray:', mixedArray);
console.log('zoo:', zoo);

// 6. Contextual Typing (문맥적 타입 추론)
// 코드의 위치를 기반으로 타입을 추론
window.onclick = function (event) {
  // event의 타입이 MouseEvent로 추론됨
  console.log(event.button); // OK
  // console.log(event.invalidProperty); // ❌ 에러
};

// 배열 메서드도 문맥적 타입 추론
const nums = [1, 2, 3, 4, 5];
nums.forEach((num) => {
  // num의 타입이 number로 추론됨
  console.log(num.toFixed(2));
});

// 7. 타입 추론의 한계
let value; // any로 추론됨 (초기값이 없으면)
value = 'hello';
value = 123;
value = true;

console.log('\n=== 타입 추론의 한계 ===');
console.log(`value (초기값 없음): ${value}`);

// 초기값을 제공하면 타입 추론됨
let betterValue = 'hello'; // string으로 추론
// betterValue = 123; // ❌ 에러

// 8. const vs let
// const는 더 좁은 타입으로 추론됨
let letString = 'hello'; // string 타입
const constString = 'hello'; // 'hello' 리터럴 타입

let letNumber = 42; // number 타입
const constNumber = 42; // 42 리터럴 타입

console.log('\n=== const vs let 타입 추론 ===');
console.log('let은 넓은 타입으로 추론 (string, number)');
console.log('const는 리터럴 타입으로 추론 ("hello", 42)');

// 9. 명시적 타입 vs 타입 추론 - 언제 무엇을 쓸까?
// ✅ 타입 추론에 맡기기 (간결함)
let name1 = 'John'; // 추론 권장
let age1 = 30; // 추론 권장

// ✅ 명시적 타입 (명확성, 의도 표현)
let name2: string; // 나중에 할당될 예정
name2 = 'Jane';

function calculateTotal(price: number, quantity: number): number {
  // 반환 타입 명시 (함수 시그니처 명확히)
  return price * quantity;
}

// 복잡한 객체는 타입 별칭 사용
type User = {
  id: number;
  name: string;
  email: string;
};

const user1: User = {
  // 명시적 타입으로 오타 방지
  id: 1,
  name: 'John',
  email: 'john@example.com',
};

console.log('\n=== Best Practice ===');
console.log('간단한 경우: 타입 추론 활용');
console.log('복잡한 경우: 명시적 타입 지정');
console.log('공개 API: 반드시 타입 명시');

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 타입 추론 (Type Inference)
 *    - TypeScript가 자동으로 타입을 결정
 *    - 초기값을 기반으로 추론
 *      let message = 'hello';  // string으로 추론
 *
 * 2. 타입 추론의 종류
 *    - 기본 타입 추론: let x = 3;  // number
 *    - 배열 타입 추론: let arr = [1, 2];  // number[]
 *    - 함수 반환 타입 추론: function add(a, b) { return a + b; }
 *    - 문맥적 타입 추론: arr.forEach(x => ...)  // x는 number
 *
 * 3. Best Type
 *    - 여러 타입이 있을 때 가장 적합한 공통 타입 선택
 *      let arr = [0, 1, null];  // (number | null)[]
 *
 * 4. const vs let
 *    - let: 넓은 타입 (string, number)
 *    - const: 리터럴 타입 ('hello', 42)
 *
 * 5. 타입 추론의 한계
 *    - 초기값 없으면 any로 추론
 *      let value;  // any
 *
 * 6. 명시적 타입 vs 타입 추론
 *    ✅ 타입 추론 사용:
 *      - 간단한 변수 초기화
 *      - 로컬 변수
 *
 *    ✅ 명시적 타입 사용:
 *      - 함수 매개변수 (필수)
 *      - 함수 반환 타입 (공개 API)
 *      - 복잡한 객체 (타입 별칭/인터페이스)
 *      - 나중에 할당될 변수
 *
 * 7. Best Practice
 *    - 가능하면 타입 추론 활용 (간결함)
 *    - 공개 API는 명시적 타입 (명확성)
 *    - 복잡한 타입은 타입 별칭 사용
 *
 * @see https://www.typescriptlang.org/docs/handbook/type-inference.html
 */
