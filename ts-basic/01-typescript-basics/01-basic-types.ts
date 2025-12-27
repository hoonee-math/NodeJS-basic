/**
 * 01-basic-types.ts
 * TypeScript 기본 타입들
 */

// 1. 원시 타입 (Primitive Types)
const userName: string = 'John Doe';
const age: number = 30;
const isActive: boolean = true;

console.log('=== 원시 타입 ===');
console.log(`이름: ${userName} (${typeof userName})`);
console.log(`나이: ${age} (${typeof age})`);
console.log(`활성: ${isActive} (${typeof isActive})`);

// 2. null과 undefined
let emptyValue: null = null;
let notDefined: undefined = undefined;

console.log('\n=== null과 undefined ===');
console.log(`null: ${emptyValue}`);
console.log(`undefined: ${notDefined}`);

// strictNullChecks가 활성화되면 null과 undefined를 명시적으로 다뤄야 함
let nullableString: string | null = 'hello';
nullableString = null; // OK

let optionalNumber: number | undefined = 42;
optionalNumber = undefined; // OK

// 3. void - 반환값이 없는 함수
function logMessage(message: string): void {
  console.log(message);
  // return 문이 없거나, return만 있음
}

console.log('\n=== void 타입 ===');
logMessage('void 타입 함수는 값을 반환하지 않습니다');

// 4. never - 절대 반환하지 않는 함수
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // 무한 루프
  }
}

console.log('\n=== never 타입 ===');
console.log('never 타입은 함수가 절대 정상적으로 반환되지 않음을 의미합니다');
console.log('1) 항상 예외를 던지는 함수');
console.log('2) 무한 루프');

// never는 모든 타입의 하위 타입
// 하지만 어떤 타입도 never의 하위 타입이 아님 (never 자신 제외)

// 5. 리터럴 타입 (Literal Types)
let exactString: 'hello' = 'hello';
// exactString = 'world'; // ❌ 에러!

let exactNumber: 42 = 42;
// exactNumber = 100; // ❌ 에러!

let exactBoolean: true = true;
// exactBoolean = false; // ❌ 에러!

console.log('\n=== 리터럴 타입 ===');
console.log(`정확한 문자열: ${exactString}`);
console.log(`정확한 숫자: ${exactNumber}`);
console.log(`정확한 불린: ${exactBoolean}`);

// 6. 타입 시스템의 이점
// JavaScript에서는 런타임 에러
// function addJS(a, b) {
//   return a + b;
// }
// console.log(addJS(1, '2')); // '12' - 의도하지 않은 결과

// TypeScript는 컴파일 타임에 에러를 잡아냄
function addTS(a: number, b: number): number {
  return a + b;
}

console.log('\n=== 타입 안전성 ===');
console.log(`1 + 2 = ${addTS(1, 2)}`);
// console.log(addTS(1, '2')); // ❌ 컴파일 에러!

// 7. bigint와 symbol (ES2020+)
// bigint - 큰 정수
const bigNumber: bigint = 9007199254740991n;
console.log('\n=== bigint ===');
console.log(`큰 숫자: ${bigNumber}`);

// symbol - 고유한 값
const sym1: symbol = Symbol('key');
const sym2: symbol = Symbol('key');
console.log('\n=== symbol ===');
console.log(`sym1 === sym2: ${sym1 === sym2}`); // false - 각 심볼은 고유함

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. TypeScript 기본 타입
 *    - string: 문자열
 *    - number: 숫자 (정수, 실수 모두)
 *    - boolean: true/false
 *    - null: 명시적으로 값이 없음
 *    - undefined: 값이 할당되지 않음
 *    - bigint: 큰 정수
 *    - symbol: 고유한 식별자
 *
 * 2. 특수 타입
 *    - void: 반환값이 없는 함수
 *      function log(): void { console.log('...'); }
 *
 *    - never: 절대 반환하지 않는 함수
 *      function error(): never { throw new Error(); }
 *
 * 3. 리터럴 타입
 *    - 정확한 값으로 타입을 제한
 *      let status: 'success' = 'success';
 *
 * 4. null과 undefined 처리
 *    - strictNullChecks: true (권장)
 *      let value: string | null = null;  // 명시적 허용
 *
 * 5. TypeScript의 핵심 가치
 *    - 컴파일 타임에 타입 에러를 발견
 *    - 런타임 에러를 미리 방지
 *    - IDE 자동완성 향상
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 */
