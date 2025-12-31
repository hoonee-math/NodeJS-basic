/**
 * 05-multiple-type-parameters.ts
 * 다중 타입 매개변수
 *
 * 함수나 클래스가 여러 독립적인 타입을 다뤄야 할 때 타입 매개변수를 2개 이상 선언할 수 있습니다.
 * Map<K, V>처럼 키와 값의 타입이 다르거나, 함수 인자와 반환값의 타입이 다를 때 다중 제네릭을 사용합니다.
 * 이 파일에서는
 * 두 개 이상의 타입 매개변수 선언하기(<T, U>),
 * 타입 매개변수 간의 관계 정의하기,
 * 기본 타입 매개변수로 선택적 타입 지정하기(<T = string>),
 * 부분 타입 추론 활용하기,
 * 튜플과 다중 제네릭,
 * Swap, Pair, Map 패턴,
 * 그리고 제네릭 함수 합성 패턴을 다룹니다.
 */

// 1. 두 개 이상의 타입 매개변수 (<T, U>)
console.log('=== 1. 다중 타입 매개변수 ===');

function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair1 = pair('hello', 42); // [string, number]
const pair2 = pair(true, 'world'); // [boolean, string]

console.log('Pair 1:', pair1);
console.log('Pair 2:', pair2);

// 2. 타입 매개변수 간의 관계
console.log('\n=== 2. 타입 매개변수 간의 관계 ===');

function copyFields<T extends U, U>(target: T, source: U): T {
  return { ...target, ...source };
}

const base = { name: 'Alice' };
const extended = { name: 'Bob', age: 30 };

// extended는 base의 모든 필드를 가지고 있음
const result = copyFields(extended, base);
console.log('Copy fields:', result); // { name: "Alice", age: 30 }

// 3. 기본 타입 매개변수 (<T = string>)
console.log('\n=== 3. 기본 타입 매개변수 ===');

function createArray<T = string, U = number>(length: U, value: T): T[] {
  return Array(Number(length)).fill(value);
}

const defaultArray = createArray(3, 'x'); // string[] (기본값 사용)
const explicitArray = createArray<number, number>(3, 0); // number[] (명시적 지정)

console.log('Default array:', defaultArray); // ["x", "x", "x"]
console.log('Explicit array:', explicitArray); // [0, 0, 0]

// 4. 부분 타입 추론
console.log('\n=== 4. 부분 타입 추론 ===');

function map<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn);
}

// T는 추론됨, U도 추론됨
const numbers = [1, 2, 3, 4, 5];
const strings = map(numbers, (n) => n.toString()); // T: number, U: string

console.log('Mapped strings:', strings); // ["1", "2", "3", "4", "5"]

// U만 명시적으로 지정
const booleans = map<number, boolean>(numbers, (n) => n > 2);
console.log('Mapped booleans:', booleans); // [false, false, true, true, true]

// 5. 튜플과 다중 제네릭
console.log('\n=== 5. 튜플과 다중 제네릭 ===');

function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  const length = Math.min(arr1.length, arr2.length);
  const result: [T, U][] = [];

  for (let i = 0; i < length; i++) {
    result.push([arr1[i]!, arr2[i]!]);
  }

  return result;
}

const names = ['Alice', 'Bob', 'Charlie'];
const ages = [30, 25, 35];

const zipped = zip(names, ages);
console.log('Zipped:', zipped); // [["Alice", 30], ["Bob", 25], ["Charlie", 35]]

// 6. Swap 패턴
console.log('\n=== 6. Swap 패턴 ===');

function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

const original: [string, number] = ['hello', 42];
const swapped = swap(original);

console.log('Original:', original); // ["hello", 42]
console.log('Swapped:', swapped); // [42, "hello"]

// 7. Map 패턴
console.log('\n=== 7. Map 패턴 ===');

class CustomMap<K, V> {
  private items: Array<[K, V]> = [];

  set(key: K, value: V): void {
    const index = this.items.findIndex(([k]) => k === key);
    if (index !== -1) {
      this.items[index] = [key, value];
    } else {
      this.items.push([key, value]);
    }
  }

  get(key: K): V | undefined {
    const item = this.items.find(([k]) => k === key);
    return item?.[1];
  }

  has(key: K): boolean {
    return this.items.some(([k]) => k === key);
  }

  delete(key: K): boolean {
    const index = this.items.findIndex(([k]) => k === key);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  entries(): Array<[K, V]> {
    return this.items;
  }
}

const userMap = new CustomMap<string, number>();
userMap.set('Alice', 30);
userMap.set('Bob', 25);

console.log('Get Alice:', userMap.get('Alice')); // 30
console.log('Has Bob:', userMap.has('Bob')); // true
console.log('All entries:', userMap.entries());

// 8. 제네릭 함수 합성
console.log('\n=== 8. 제네릭 함수 합성 ===');

function compose<T, U, V>(f: (arg: U) => V, g: (arg: T) => U): (arg: T) => V {
  return (arg: T) => f(g(arg));
}

const addOne = (n: number) => n + 1;
const double = (n: number) => n * 2;
const toString = (n: number) => n.toString();

// (n + 1) * 2
const addThenDouble = compose(double, addOne);
console.log('Add then double:', addThenDouble(5)); // 12

// ((n + 1) * 2).toString()
const addThenDoubleToString = compose(toString, compose(double, addOne));
console.log('Add then double to string:', addThenDoubleToString(5)); // "12"

// 9. Either 패턴 (Left/Right)
console.log('\n=== 9. Either 패턴 ===');

type Either<L, R> =
  | { type: 'left'; value: L }
  | { type: 'right'; value: R };

function left<L, R>(value: L): Either<L, R> {
  return { type: 'left', value };
}

function right<L, R>(value: R): Either<L, R> {
  return { type: 'right', value };
}

function mapEither<L, R, U>(
  either: Either<L, R>,
  fn: (value: R) => U
): Either<L, U> {
  if (either.type === 'left') {
    return left(either.value);
  }
  return right(fn(either.value));
}

const success = right<Error, number>(42);
const failure = left<Error, number>(new Error('Failed'));

const mappedSuccess = mapEither(success, (n) => n * 2);
const mappedFailure = mapEither(failure, (n) => n * 2);

console.log('Mapped success:', mappedSuccess); // { type: "right", value: 84 }
console.log('Mapped failure:', mappedFailure); // { type: "left", value: Error }

// 10. 실전: 타입 안전한 이벤트 에미터
console.log('\n=== 10. 실전: 타입 안전한 이벤트 에미터 ===');

type EventMap = {
  [eventName: string]: unknown;
};

class TypedEventEmitter<Events extends EventMap> {
  private listeners: { [K in keyof Events]?: Array<(data: Events[K]) => void> } = {};

  on<K extends keyof Events>(event: K, listener: (data: Events[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach((listener) => listener(data));
    }
  }
}

// EventMap 제약을 만족하려면 인덱스 시그니처 필요
// 실무에서는 Record나 type을 사용하는 것이 더 일반적
interface MyEvents {
  [eventName: string]: unknown; // 인덱스 시그니처 추가
  login: { username: string; timestamp: Date };
  logout: { userId: number };
  message: { text: string; from: string };
}

const emitter = new TypedEventEmitter<MyEvents>();

emitter.on('login', (data) => {
  console.log(`→ User logged in: ${data.username}`);
});

emitter.on('message', (data) => {
  console.log(`→ Message from ${data.from}: ${data.text}`);
});

emitter.emit('login', { username: 'Alice', timestamp: new Date() });
emitter.emit('message', { text: 'Hello!', from: 'Bob' });

/**
 * 핵심 정리:
 *
 * 1. 다중 타입 매개변수 문법:
 *    function fn<T, U>(a: T, b: U): [T, U] { ... }
 *
 * 2. 타입 매개변수 관계:
 *    <T extends U, U>: T는 U의 서브타입
 *
 * 3. 기본 타입 매개변수:
 *    <T = string, U = number>: 기본값 지정
 *
 * 4. 부분 타입 추론:
 *    fn<T, U>(a: T): U에서 T는 추론, U는 명시
 *
 * 5. 타입 매개변수 개수:
 *    - 1개: identity, map
 *    - 2개: pair, Either, Result
 *    - 3개 이상: compose, reduce
 *
 * 6. 실무 패턴:
 *    - Pair<T, U>: 두 값 묶기
 *    - Either<L, R>: 성공/실패 (Left/Right)
 *    - Map<K, V>: 키-값 저장소
 *    - TypedEventEmitter<Events>: 타입 안전한 이벤트
 *
 * 7. 함수 합성:
 *    compose<T, U, V>: (T → U) → (U → V) → (T → V)
 *
 * 8. 타입 안전성:
 *    - 각 타입 매개변수 독립적으로 추론
 *    - 타입 간 관계 명확히 표현
 *    - 컴파일 타임 에러 방지
 */
