/**
 * 04-arrays-tuples.ts
 * 배열과 튜플 타입
 */

// 1. 배열 타입 - 표기법 1
let numbers: number[] = [1, 2, 3, 4, 5];
let strings: string[] = ['apple', 'banana', 'cherry'];
let booleans: boolean[] = [true, false, true];

console.log('=== 배열 타입 (표기법 1) ===');
console.log('numbers:', numbers);
console.log('strings:', strings);
console.log('booleans:', booleans);

// 2. 배열 타입 - 표기법 2 (제네릭)
let numbersGeneric: Array<number> = [10, 20, 30];
let stringsGeneric: Array<string> = ['a', 'b', 'c'];

console.log('\n=== 배열 타입 (표기법 2 - 제네릭) ===');
console.log('numbersGeneric:', numbersGeneric);
console.log('stringsGeneric:', stringsGeneric);

// 3. 다차원 배열
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

let grid: Array<Array<string>> = [
  ['A', 'B'],
  ['C', 'D'],
];

console.log('\n=== 다차원 배열 ===');
console.log('matrix:', matrix);
console.log('grid:', grid);

// 4. 읽기 전용 배열 (readonly)
let readonlyNumbers: readonly number[] = [1, 2, 3, 4, 5];

console.log('\n=== 읽기 전용 배열 ===');
console.log('readonlyNumbers:', readonlyNumbers);

// readonlyNumbers.push(6); // ❌ 에러: 읽기 전용 배열은 수정 불가
// readonlyNumbers[0] = 10; // ❌ 에러: 요소 수정 불가

// ReadonlyArray 제네릭 타입
let readonlyStrings: ReadonlyArray<string> = ['a', 'b', 'c'];
// readonlyStrings.push('d'); // ❌ 에러

// 5. 유니온 타입 배열
let mixed: (number | string)[] = [1, 'two', 3, 'four'];
let nullableNumbers: (number | null)[] = [1, 2, null, 4];

console.log('\n=== 유니온 타입 배열 ===');
console.log('mixed:', mixed);
console.log('nullableNumbers:', nullableNumbers);

// 6. 튜플 (Tuple) - 고정된 길이와 타입의 배열
let person: [string, number] = ['John', 30];

console.log('\n=== 튜플 기본 ===');
console.log('person:', person);
console.log(`이름: ${person[0]}, 나이: ${person[1]}`);

// 튜플의 구조 분해
let [personName, personAge] = person;
console.log(`구조 분해 - 이름: ${personName}, 나이: ${personAge}`);

// 7. 다양한 타입의 튜플
let response: [number, string, boolean] = [200, 'OK', true];
let coordinate: [number, number] = [10.5, 20.3];

console.log('\n=== 다양한 튜플 ===');
console.log('HTTP 응답:', response);
console.log('좌표:', coordinate);

// 8. 선택적 요소가 있는 튜플
let successResponse: [number, string?] = [200];
let errorResponse: [number, string?] = [404, 'Not Found'];

console.log('\n=== 선택적 요소 튜플 ===');
console.log('성공 응답:', successResponse);
console.log('에러 응답:', errorResponse);

// 9. 나머지 요소가 있는 튜플 (Rest Elements)
let scores: [string, ...number[]] = ['Math', 90, 85, 95, 88];
let userInfo: [number, string, ...boolean[]] = [1, 'John', true, false, true];

console.log('\n=== 나머지 요소 튜플 ===');
console.log('점수:', scores);
console.log('사용자 정보:', userInfo);

// 10. 읽기 전용 튜플
let readonlyPerson: readonly [string, number] = ['Jane', 25];

console.log('\n=== 읽기 전용 튜플 ===');
console.log('readonlyPerson:', readonlyPerson);

// readonlyPerson[0] = 'Alice'; // ❌ 에러: 읽기 전용
// readonlyPerson.push('extra'); // ❌ 에러: 읽기 전용

// 11. 튜플의 실전 사용 사례 1 - 함수 다중 반환값
function getUserInfo(id: number): [string, number, string] {
  // 실제로는 DB에서 조회
  return ['John Doe', 30, 'john@example.com'];
}

let [name, age, email] = getUserInfo(1);
console.log('\n=== 튜플 활용 1: 다중 반환값 ===');
console.log(`이름: ${name}, 나이: ${age}, 이메일: ${email}`);

// 12. 튜플의 실전 사용 사례 2 - useState 패턴 (React)
type State<T> = [T, (value: T) => void];

function useState<T>(initial: T): State<T> {
  let state = initial;
  const setState = (value: T) => {
    state = value;
  };
  return [state, setState];
}

let [count, setCount] = useState(0);
console.log('\n=== 튜플 활용 2: useState 패턴 ===');
console.log(`초기 count: ${count}`);
setCount(5);

// 13. 튜플 vs 배열 - 언제 무엇을 쓸까?
// ✅ 배열: 같은 타입의 여러 요소, 길이 가변
let userNames: string[] = ['Alice', 'Bob', 'Charlie']; // 길이 자유

// ✅ 튜플: 서로 다른 타입, 고정된 길이와 의미
let user: [number, string, boolean] = [1, 'Alice', true]; // [id, name, isActive]

console.log('\n=== 배열 vs 튜플 ===');
console.log('배열 (같은 타입, 가변 길이):', userNames);
console.log('튜플 (다른 타입, 고정 길이):', user);

// 14. 배열 메서드와 타입 안전성
let numArray: number[] = [1, 2, 3, 4, 5];

// map - 타입이 추론됨
let doubled = numArray.map((n) => n * 2); // number[]
let stringified = numArray.map((n) => n.toString()); // string[]

// filter - 타입 유지
let filtered = numArray.filter((n) => n > 2); // number[]

// reduce - 반환 타입 추론
let sum = numArray.reduce((acc, n) => acc + n, 0); // number

console.log('\n=== 배열 메서드 타입 안전성 ===');
console.log('doubled:', doubled);
console.log('stringified:', stringified);
console.log('filtered:', filtered);
console.log('sum:', sum);

// 15. as const로 튜플 만들기
let mutableArray = [1, 2]; // number[]
let immutableTuple = [1, 2] as const; // readonly [1, 2]

console.log('\n=== as const ===');
console.log('mutableArray:', mutableArray);
console.log('immutableTuple:', immutableTuple);

// mutableArray[0] = 10; // OK
// immutableTuple[0] = 10; // ❌ 에러: 읽기 전용

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 배열 타입 표기법
 *    - 방법 1: type[]
 *      let numbers: number[] = [1, 2, 3];
 *
 *    - 방법 2: Array<type> (제네릭)
 *      let numbers: Array<number> = [1, 2, 3];
 *
 * 2. 읽기 전용 배열
 *    - readonly type[]
 *      let arr: readonly number[] = [1, 2, 3];
 *
 *    - ReadonlyArray<type>
 *      let arr: ReadonlyArray<number> = [1, 2, 3];
 *
 * 3. 튜플 (Tuple)
 *    - 고정된 길이와 각 요소의 타입이 정해진 배열
 *      let person: [string, number] = ['John', 30];
 *
 * 4. 튜플의 특징
 *    - 각 인덱스마다 다른 타입 가능
 *    - 구조 분해 할당 가능
 *      let [name, age] = person;
 *
 * 5. 선택적 요소 튜플
 *    - ? 연산자로 선택적 요소 표시
 *      let response: [number, string?] = [200];
 *
 * 6. 나머지 요소 튜플
 *    - ...type[] 으로 가변 길이 지원
 *      let scores: [string, ...number[]] = ['Math', 90, 85];
 *
 * 7. 읽기 전용 튜플
 *    - readonly 키워드
 *      let tuple: readonly [string, number] = ['a', 1];
 *
 * 8. 배열 vs 튜플 선택 기준
 *    ✅ 배열 사용:
 *      - 같은 타입의 여러 요소
 *      - 길이가 가변적
 *      - 반복 작업 (map, filter 등)
 *
 *    ✅ 튜플 사용:
 *      - 서로 다른 타입의 요소
 *      - 고정된 길이
 *      - 각 위치마다 의미가 다름
 *      - 함수 다중 반환값
 *      - useState 같은 패턴
 *
 * 9. 튜플 실전 활용
 *    - 함수 다중 반환값
 *      function getUser(): [string, number] { ... }
 *
 *    - useState 패턴
 *      const [value, setValue] = useState(0);
 *
 *    - API 응답
 *      type Response = [number, string, any];
 *
 * 10. as const
 *     - 리터럴 타입으로 좁히고 읽기 전용으로 만듦
 *       let tuple = [1, 2] as const;  // readonly [1, 2]
 *
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types
 */
