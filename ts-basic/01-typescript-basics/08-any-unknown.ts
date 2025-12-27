/**
 * 08-any-unknown.ts
 * any vs unknown - 언제 무엇을 써야 할까?
 */

// 1. any - 타입 체크 비활성화
let anyValue: any = 'hello';

console.log('=== any 타입 ===');
console.log(`초기값 (string): ${anyValue}`);

anyValue = 42;
console.log(`변경 (number): ${anyValue}`);

anyValue = true;
console.log(`변경 (boolean): ${anyValue}`);

anyValue = { name: 'John' };
console.log(`변경 (object):`, anyValue);

// any는 모든 연산 허용 (타입 체크 없음)
anyValue.toUpperCase(); // 런타임 에러 가능!
anyValue.nonExistentMethod(); // 컴파일 에러 없음, 런타임 에러!

// 2. any의 문제점
function processAny(value: any): void {
  // 어떤 메서드든 호출 가능 (타입 체크 없음)
  console.log(value.toUpperCase()); // value가 string이 아니면 런타임 에러!
}

console.log('\n=== any의 위험성 ===');
console.log('any는 타입 안전성을 완전히 포기');
// processAny(123); // 런타임 에러 발생!

// 3. unknown - 안전한 any
let unknownValue: unknown = 'hello';

console.log('\n=== unknown 타입 ===');
console.log(`초기값: ${unknownValue}`);

unknownValue = 42;
unknownValue = true;
unknownValue = { name: 'Jane' };

// unknown은 바로 사용 불가
// unknownValue.toUpperCase(); // ❌ 컴파일 에러!
// unknownValue.length; // ❌ 컴파일 에러!

console.log('unknown은 사용 전 타입 체크 필수');

// 4. unknown 안전하게 사용하기 - 타입 가드
function processUnknown(value: unknown): void {
  // typeof로 타입 체크 후 사용
  if (typeof value === 'string') {
    console.log(`문자열: ${value.toUpperCase()}`);
  } else if (typeof value === 'number') {
    console.log(`숫자: ${value.toFixed(2)}`);
  } else if (typeof value === 'boolean') {
    console.log(`불린: ${value}`);
  } else {
    console.log('알 수 없는 타입');
  }
}

console.log('\n=== unknown 타입 가드 ===');
processUnknown('hello');
processUnknown(42.12345);
processUnknown(true);
processUnknown({ name: 'Object' });

// 5. 타입 단언 (Type Assertion)
let unknownStr: unknown = 'TypeScript';

// as 키워드로 타입 단언
let str1 = (unknownStr as string).toUpperCase();

// angle-bracket 문법 (JSX와 충돌 가능)
let str2 = (<string>unknownStr).toLowerCase();

console.log('\n=== 타입 단언 ===');
console.log('대문자:', str1);
console.log('소문자:', str2);
console.log('주의: 잘못된 타입 단언은 런타임 에러 유발!');

// 6. instanceof로 클래스 타입 체크
class User {
  constructor(public name: string) {}
}

function processInstance(value: unknown): void {
  if (value instanceof User) {
    console.log(`사용자: ${value.name}`);
  } else if (value instanceof Date) {
    console.log(`날짜: ${value.toISOString()}`);
  } else {
    console.log('알 수 없는 인스턴스');
  }
}

console.log('\n=== instanceof 타입 가드 ===');
processInstance(new User('Alice'));
processInstance(new Date());
processInstance('not a class');

// 7. in 연산자로 객체 프로퍼티 체크
function processObject(value: unknown): void {
  if (typeof value === 'object' && value !== null) {
    if ('name' in value) {
      console.log('name 프로퍼티 있음:', (value as any).name);
    }
    if ('age' in value) {
      console.log('age 프로퍼티 있음:', (value as any).age);
    }
  }
}

console.log('\n=== in 연산자 타입 가드 ===');
processObject({ name: 'Bob', age: 30 });
processObject({ title: 'Book' });

// 8. Array.isArray로 배열 체크
function processArray(value: unknown): void {
  if (Array.isArray(value)) {
    console.log(`배열 길이: ${value.length}`);
    console.log('첫 번째 요소:', value[0]);
  } else {
    console.log('배열이 아님');
  }
}

console.log('\n=== Array.isArray 타입 가드 ===');
processArray([1, 2, 3, 4, 5]);
processArray('not an array');

// 9. 사용자 정의 타입 가드
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function processWithCustomGuard(value: unknown): void {
  if (isString(value)) {
    // value는 여기서 string으로 좁혀짐
    console.log(`문자열 길이: ${value.length}`);
  } else if (isNumber(value)) {
    // value는 여기서 number로 좁혀짐
    console.log(`숫자의 제곱: ${value * value}`);
  }
}

console.log('\n=== 사용자 정의 타입 가드 ===');
processWithCustomGuard('TypeScript');
processWithCustomGuard(10);

// 10. any vs unknown 비교
console.log('\n=== any vs unknown 비교 ===');

// any: 모든 연산 허용 (위험)
let anyVal: any = 'hello';
anyVal.toUpperCase(); // OK (타입 체크 없음)
anyVal.nonExistent(); // 컴파일 OK, 런타임 에러!

// unknown: 타입 체크 필수 (안전)
let unknownVal: unknown = 'hello';
// unknownVal.toUpperCase(); // ❌ 컴파일 에러
if (typeof unknownVal === 'string') {
  unknownVal.toUpperCase(); // ✅ OK
}

console.log('any: 타입 체크 비활성화 (위험)');
console.log('unknown: 타입 체크 강제 (안전)');

// 11. any를 써도 되는 경우
console.log('\n=== any 사용이 허용되는 경우 ===');

// 1) 타입 정의가 없는 외부 라이브러리
// const externalLib: any = require('no-types-library');

// 2) JSON 파싱 (구조를 모르는 경우)
const jsonData: any = JSON.parse('{"name": "John", "age": 30}');
console.log('JSON 파싱:', jsonData);

// 3) JavaScript에서 TypeScript로 마이그레이션 중
// function legacyFunction(): any { ... }

// 4) 임시로 타입 체크 우회 (나중에 수정 예정)
// let temp: any = complexExpression;

console.log('하지만 가능하면 unknown 사용 권장!');

// 12. unknown을 써야 하는 경우
console.log('\n=== unknown 사용 권장 사례 ===');

// 1) 타입을 알 수 없는 사용자 입력
function processUserInput(input: unknown): void {
  if (typeof input === 'string') {
    console.log('사용자 입력:', input);
  }
}

// 2) API 응답 (스키마 검증 전)
async function fetchData(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json(); // unknown으로 반환
}

// 3) 에러 핸들링
try {
  throw new Error('Something went wrong');
} catch (error: unknown) {
  if (error instanceof Error) {
    console.log('에러 메시지:', error.message);
  }
}

// 13. 타입 좁히기 종합 예제
function comprehensiveTypeGuard(value: unknown): string {
  // 1. null/undefined 체크
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  // 2. 원시 타입 체크
  if (typeof value === 'string') return `문자열: ${value}`;
  if (typeof value === 'number') return `숫자: ${value}`;
  if (typeof value === 'boolean') return `불린: ${value}`;

  // 3. 배열 체크
  if (Array.isArray(value)) return `배열 (길이 ${value.length})`;

  // 4. 객체 체크
  if (typeof value === 'object') return '객체';

  return '알 수 없는 타입';
}

console.log('\n=== 종합 타입 가드 예제 ===');
console.log(comprehensiveTypeGuard('hello'));
console.log(comprehensiveTypeGuard(42));
console.log(comprehensiveTypeGuard(true));
console.log(comprehensiveTypeGuard([1, 2, 3]));
console.log(comprehensiveTypeGuard({ name: 'John' }));
console.log(comprehensiveTypeGuard(null));

// 14. 실전 예제: API 응답 처리
type ApiData = {
  id: number;
  name: string;
};

function validateApiResponse(data: unknown): ApiData | null {
  // 타입 검증
  if (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'name' in data &&
    typeof (data as any).id === 'number' &&
    typeof (data as any).name === 'string'
  ) {
    return data as ApiData;
  }
  return null;
}

console.log('\n=== 실전: API 응답 검증 ===');
const validData: unknown = { id: 1, name: 'Product' };
const invalidData: unknown = { id: '1', name: 123 };

console.log('유효한 데이터:', validateApiResponse(validData));
console.log('무효한 데이터:', validateApiResponse(invalidData));

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. any 타입
 *    - 타입 체크 완전히 비활성화
 *    - 모든 타입 허용, 모든 연산 허용
 *      let value: any = 'hello';
 *      value.anyMethod(); // 컴파일 OK, 런타임 에러 가능!
 *
 * 2. any의 문제점
 *    - 타입 안전성 포기
 *    - 런타임 에러 가능성
 *    - IDE 자동완성 불가
 *    - 리팩토링 어려움
 *
 * 3. unknown 타입
 *    - 안전한 any
 *    - 모든 타입 허용하지만 사용 전 타입 체크 필수
 *      let value: unknown = 'hello';
 *      // value.toUpperCase(); // ❌ 에러!
 *      if (typeof value === 'string') {
 *        value.toUpperCase(); // ✅ OK
 *      }
 *
 * 4. unknown 사용법
 *    - typeof로 타입 체크
 *      if (typeof value === 'string') { ... }
 *
 *    - instanceof로 클래스 체크
 *      if (value instanceof Date) { ... }
 *
 *    - Array.isArray로 배열 체크
 *      if (Array.isArray(value)) { ... }
 *
 *    - in 연산자로 프로퍼티 체크
 *      if ('name' in value) { ... }
 *
 * 5. 타입 단언 (Type Assertion)
 *    - 개발자가 타입을 확신할 때
 *      (value as string).toUpperCase()
 *    - 주의: 잘못된 단언은 런타임 에러!
 *
 * 6. 사용자 정의 타입 가드
 *    - value is Type 패턴
 *      function isString(x: unknown): x is string {
 *        return typeof x === 'string';
 *      }
 *
 * 7. any 사용이 허용되는 경우
 *    ✅ 타입이 없는 외부 라이브러리
 *    ✅ JSON.parse() 결과
 *    ✅ JavaScript → TypeScript 마이그레이션 중
 *    ✅ 임시 우회 (나중에 수정 예정)
 *
 * 8. unknown 사용 권장 사례
 *    ✅ 사용자 입력
 *    ✅ API 응답 (검증 전)
 *    ✅ 에러 핸들링 (catch 블록)
 *    ✅ 타입을 모르는 모든 경우
 *
 * 9. any vs unknown 선택 기준
 *    - 기본: unknown 사용 (안전)
 *    - 예외: any (위의 허용 사례만)
 *    - 원칙: 타입 안전성 유지
 *
 * 10. Best Practices
 *     ✅ any 최대한 피하기
 *     ✅ unknown 사용 후 타입 가드
 *     ✅ 사용자 정의 타입 가드 활용
 *     ✅ 런타임 검증 라이브러리 사용 (Zod, io-ts)
 *     ✅ any 사용 시 주석으로 이유 명시
 *
 * 11. 타입 좁히기 방법 정리
 *     - typeof value === 'type'
 *     - value instanceof Class
 *     - Array.isArray(value)
 *     - 'property' in value
 *     - value === null
 *     - 사용자 정의 타입 가드
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/narrowing.html
 * @see 08-type-vs-runtime 에서 타입 소거와 런타임 체크 상세히 학습
 */
