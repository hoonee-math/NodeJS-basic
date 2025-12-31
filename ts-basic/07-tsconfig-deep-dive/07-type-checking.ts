/**
 * 07-type-checking.ts
 * 타입 체크 옵션
 *
 * strict 이외에도 코드 품질을 높이는 타입 체크 옵션들이 있습니다.
 * 이 파일에서는 noUnusedLocals/Parameters(사용하지 않는 변수/매개변수 경고), noImplicitReturns(모든 경로에서 반환 강제), noUncheckedIndexedAccess(인덱스 접근 시 undefined 체크), 그리고 exactOptionalPropertyTypes(옵셔널 프로퍼티 엄격 처리)를 다룹니다.
 */

// ============================================================
// 1. noUnusedLocals / noUnusedParameters
// ============================================================
console.log('\n=== 1. noUnusedLocals / noUnusedParameters ===');

/*
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}

// ❌ noUnusedLocals: true
function example() {
  const unused = 42;  // Error: 사용하지 않음
  return 'result';
}

// ❌ noUnusedParameters: true
function greet(name: string, age: number) {  // age Error
  return `Hello, ${name}`;
}

// ✅ _ 접두사로 의도적 미사용 표시
function greet(name: string, _age: number) {
  return `Hello, ${name}`;
}
*/

console.log('noUnusedLocals: 사용하지 않는 변수 경고');
console.log('noUnusedParameters: 사용하지 않는 매개변수 경고');
console.log('_ 접두사로 의도적 미사용 표시 가능');
console.log('');
console.log('코드 품질 향상, 리팩토링 시 유용');

// ============================================================
// 2. noImplicitReturns - 모든 경로에서 반환
// ============================================================
console.log('\n=== 2. noImplicitReturns ===');

/*
{
  "compilerOptions": {
    "noImplicitReturns": true
  }
}

// ❌ noImplicitReturns: true
function getValue(x: number): string {
  if (x > 0) {
    return 'positive';
  }
  // Error: 모든 경로에서 반환해야 함
}

// ✅ 모든 경로에서 반환
function getValue(x: number): string {
  if (x > 0) {
    return 'positive';
  }
  return 'non-positive';
}
*/

console.log('noImplicitReturns: 모든 경로에서 명시적 반환 강제');
console.log('반환 타입이 void가 아닌 함수에서 암시적 undefined 방지');
console.log('실수로 반환 누락 방지');

// ============================================================
// 3. noUncheckedIndexedAccess
// ============================================================
console.log('\n=== 3. noUncheckedIndexedAccess ===');

/*
{
  "compilerOptions": {
    "noUncheckedIndexedAccess": true
  }
}

// ❌ noUncheckedIndexedAccess: false
const arr = [1, 2, 3];
const item = arr[10];  // type: number (잘못됨, 실제로는 undefined)

// ✅ noUncheckedIndexedAccess: true
const arr = [1, 2, 3];
const item = arr[10];  // type: number | undefined (정확함)

if (item !== undefined) {
  console.log(item + 1);  // OK
}

// 또는 non-null assertion
console.log(arr[0]! + 1);  // 확실할 때만
*/

console.log('noUncheckedIndexedAccess:');
console.log('배열/객체 인덱스 접근 시 | undefined 추가');
console.log('런타임 에러 방지 (범위 밖 접근)');
console.log('엄격한 타입 체크 (권장)');

// ============================================================
// 4. exactOptionalPropertyTypes
// ============================================================
console.log('\n=== 4. exactOptionalPropertyTypes ===');

/*
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": true,
    "strictNullChecks": true  // 필요
  }
}

interface Config {
  name: string;
  debug?: boolean;
}

// ❌ exactOptionalPropertyTypes: true
const config: Config = {
  name: 'app',
  debug: undefined,  // Error: undefined 명시 불가
};

// ✅ 옵셔널 프로퍼티는 생략만 가능
const config: Config = {
  name: 'app',
  // debug 생략
};

// undefined 허용하려면 명시적으로 타입에 추가
interface ConfigWithUndefined {
  debug?: boolean | undefined;
}
*/

console.log('exactOptionalPropertyTypes:');
console.log('옵셔널 프로퍼티에 undefined 명시 금지');
console.log('생략과 undefined 명시를 구분');
console.log('엄격한 타입 체크 (고급)');

// ============================================================
// 5. noFallthroughCasesInSwitch
// ============================================================
console.log('\n=== 5. noFallthroughCasesInSwitch ===');

/*
{
  "compilerOptions": {
    "noFallthroughCasesInSwitch": true
  }
}

// ❌ noFallthroughCasesInSwitch: true
function getDiscount(status: string): number {
  switch (status) {
    case 'vip':
      console.log('VIP');
      // Error: fallthrough (break 없음)
    case 'member':
      return 0.1;
    default:
      return 0;
  }
}

// ✅ break 추가
switch (status) {
  case 'vip':
    console.log('VIP');
    break;  // OK
  case 'member':
    return 0.1;
  default:
    return 0;
}
*/

console.log('noFallthroughCasesInSwitch:');
console.log('switch문에서 fallthrough 금지');
console.log('각 case는 break, return, throw 필요');
console.log('실수로 break 누락 방지');

// ============================================================
// 6. 실무 권장 설정
// ============================================================
console.log('\n=== 6. 실무 권장 설정 ===');

console.log('추천 타입 체크 옵션:');
console.log('');
console.log('필수:');
console.log('  "strict": true  (기본)');
console.log('  "noUncheckedIndexedAccess": true');
console.log('');
console.log('권장:');
console.log('  "noUnusedLocals": true');
console.log('  "noUnusedParameters": true');
console.log('  "noImplicitReturns": true');
console.log('  "noFallthroughCasesInSwitch": true');
console.log('');
console.log('선택:');
console.log('  "exactOptionalPropertyTypes": true  (엄격)');

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. noUnusedLocals / noUnusedParameters
 *    - 사용하지 않는 코드 경고
 *    - _ 접두사로 의도적 미사용 표시
 *
 * 2. noImplicitReturns
 *    - 모든 경로에서 반환 강제
 *    - 암시적 undefined 방지
 *
 * 3. noUncheckedIndexedAccess
 *    - 배열/객체 인덱스 접근 시 | undefined
 *    - 범위 밖 접근 에러 방지
 *    - 권장!
 *
 * 4. exactOptionalPropertyTypes
 *    - 옵셔널에 undefined 명시 금지
 *    - 생략 vs undefined 구분
 *
 * 5. noFallthroughCasesInSwitch
 *    - switch fallthrough 금지
 *    - break 누락 방지
 *
 * 6. 권장사항
 *    - strict + noUncheckedIndexedAccess는 필수
 *    - noUnused*, noImplicitReturns 권장
 */

console.log(`
권장 설정:
  {
    "compilerOptions": {
      "strict": true,
      "noUncheckedIndexedAccess": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noImplicitReturns": true
    }
  }
`);
