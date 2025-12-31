/**
 * 03-strict-flags.ts
 * strict 플래그 상세
 *
 * strict 플래그는 모든 엄격한 타입 체크 옵션을 한 번에 활성화합니다.
 * 이 파일에서는 strict 플래그가 활성화하는 개별 옵션들(noImplicitAny, strictNullChecks, strictFunctionTypes, strictPropertyInitialization, noImplicitThis)과 각 옵션의 효과를 다룹니다.
 */

// ============================================================
// 1. strict - 모든 엄격 모드 활성화
// ============================================================
console.log('\n=== 1. strict - 모든 엄격 모드 활성화 ===');

/*
{
  "compilerOptions": {
    "strict": true  // 아래 모든 옵션을 true로 설정
  }
}

strict: true는 다음 옵션들을 활성화:
- noImplicitAny
- strictNullChecks
- strictFunctionTypes
- strictBindCallApply
- strictPropertyInitialization
- noImplicitThis
- alwaysStrict
*/

console.log('strict: true는 7개 옵션을 한 번에 활성화');
console.log('모든 프로젝트에서 strict: true 권장');
console.log('개별 옵션을 false로 오버라이드 가능');

// ============================================================
// 2. noImplicitAny - 암시적 any 금지
// ============================================================
console.log('\n=== 2. noImplicitAny ===');

/*
// ❌ noImplicitAny: false
function add(a, b) {  // a, b가 암시적 any
  return a + b;
}

// ✅ noImplicitAny: true
function add(a: number, b: number) {  // 명시적 타입 필요
  return a + b;
}
*/

console.log('noImplicitAny: 타입을 추론할 수 없을 때 any 금지');
console.log('암시적 any는 타입 안전성을 해침');
console.log('모든 매개변수, 변수에 타입 명시 필요');

// ============================================================
// 3. strictNullChecks - null/undefined 엄격 체크
// ============================================================
console.log('\n=== 3. strictNullChecks ===');

/*
// ❌ strictNullChecks: false
let name: string = null;  // OK

// ✅ strictNullChecks: true
let name: string = null;  // Error
let name: string | null = null;  // OK

// 옵셔널 체이닝 필요
const user: User | null = getUser();
console.log(user.name);  // Error
console.log(user?.name);  // OK
*/

console.log('strictNullChecks: null/undefined를 다른 타입과 구분');
console.log('null 허용 시 명시적으로 | null 추가');
console.log('옵셔널 체이닝(?.), nullish coalescing(??) 필수');

// ============================================================
// 4. strictFunctionTypes - 함수 타입 엄격 체크
// ============================================================
console.log('\n=== 4. strictFunctionTypes ===');

/*
// 함수 매개변수의 반공변성 체크

interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

// ❌ strictFunctionTypes: false
let f: (x: Animal) => void = (x: Dog) => {};  // OK (잘못됨)

// ✅ strictFunctionTypes: true
let f: (x: Animal) => void = (x: Dog) => {};  // Error
*/

console.log('strictFunctionTypes: 함수 매개변수 타입을 엄격하게 체크');
console.log('함수 매개변수는 반공변성(contravariance) 적용');
console.log('타입 안전한 콜백 함수 보장');

// ============================================================
// 5. strictPropertyInitialization - 클래스 프로퍼티 초기화
// ============================================================
console.log('\n=== 5. strictPropertyInitialization ===');

/*
// ❌ strictPropertyInitialization: false
class User {
  name: string;  // OK (초기화 안 해도 됨)
}

// ✅ strictPropertyInitialization: true
class User {
  name: string;  // Error: 초기화 필요

  // 해결 방법 1: 선언 시 초기화
  name: string = '';

  // 해결 방법 2: 생성자에서 초기화
  constructor(name: string) {
    this.name = name;
  }

  // 해결 방법 3: definite assignment assertion
  name!: string;  // 나중에 초기화할 것임을 명시
}
*/

console.log('strictPropertyInitialization: 클래스 프로퍼티 초기화 강제');
console.log('생성자에서 초기화하거나 선언 시 초기화 필요');
console.log('!로 나중에 초기화할 것임을 명시 가능');

// ============================================================
// 6. noImplicitThis - this 타입 명시
// ============================================================
console.log('\n=== 6. noImplicitThis ===');

/*
// ❌ noImplicitThis: false
function logName() {
  console.log(this.name);  // this가 암시적 any
}

// ✅ noImplicitThis: true
function logName(this: { name: string }) {
  console.log(this.name);  // OK
}

// 사용
const user = { name: 'Alice' };
logName.call(user);
*/

console.log('noImplicitThis: 함수 내 this 타입 명시 강제');
console.log('첫 번째 매개변수로 this 타입 지정');
console.log('메서드, 콜백에서 this 타입 안전성 확보');

// ============================================================
// 7. 실무 권장 사항
// ============================================================
console.log('\n=== 7. 실무 권장 사항 ===');

console.log('strict 플래그 사용 가이드:');
console.log('');
console.log('1. 새 프로젝트: strict: true 필수');
console.log('2. 레거시 프로젝트: 점진적으로 활성화');
console.log('   - 먼저 noImplicitAny');
console.log('   - 다음 strictNullChecks');
console.log('   - 마지막에 strict: true');
console.log('');
console.log('3. strict: true 후 개별 옵션 비활성화 가능:');
console.log('   "strict": true,');
console.log('   "strictPropertyInitialization": false');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. strict: true
 *    - 7개 엄격 모드 옵션 한 번에 활성화
 *    - 모든 프로젝트에서 필수
 *
 * 2. noImplicitAny
 *    - 암시적 any 금지
 *    - 모든 타입 명시 필요
 *
 * 3. strictNullChecks
 *    - null/undefined를 별도 타입으로 처리
 *    - 옵셔널 체이닝 필수
 *
 * 4. strictFunctionTypes
 *    - 함수 매개변수 반공변성 체크
 *    - 타입 안전한 콜백
 *
 * 5. strictPropertyInitialization
 *    - 클래스 프로퍼티 초기화 강제
 *    - 생성자 or ! 사용
 *
 * 6. noImplicitThis
 *    - this 타입 명시 필요
 *    - 함수 첫 매개변수로 지정
 *
 * 7. 권장사항
 *    - 새 프로젝트: strict: true
 *    - 레거시: 점진적 활성화
 */

console.log(`
권장 설정:
  {
    "compilerOptions": {
      "strict": true
    }
  }
`);
