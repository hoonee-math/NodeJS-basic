/**
 * 03-generic-classes.ts
 * 제네릭 클래스
 *
 * 배열(Array<T>)이나 Map<K, V>처럼 여러 타입의 데이터를 다루는 컬렉션 클래스를 만들 때 제네릭 클래스가 필요합니다.
 * 타입 매개변수를 클래스 레벨에서 선언하면 프로퍼티와 메서드 전체에서 동일한 타입을 사용할 수 있습니다.
 * 이 파일에서는
 * 기본 제네릭 클래스 선언하기,
 * 제네릭 프로퍼티와 메서드,
 * 제약 조건이 있는 제네릭 클래스,
 * 제네릭 클래스 상속,
 * static 멤버와 제네릭의 관계,
 * 제네릭 클래스 인스턴스 타입 추출,
 * 그리고 Stack, Queue, LinkedList 같은 실전 자료구조 패턴을 다룹니다.
 */

// 1. 기본 제네릭 클래스
console.log('=== 1. 기본 제네릭 클래스 ===');

class Box<T> {
  constructor(public value: T) {}

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    this.value = value;
  }
}

const stringBox = new Box('hello');
const numberBox = new Box(42);

console.log('String box:', stringBox.getValue()); // "hello"
console.log('Number box:', numberBox.getValue()); // 42

// 2. 제네릭 프로퍼티와 메서드
console.log('\n=== 2. 제네릭 프로퍼티와 메서드 ===');

class Pair<T, U> {
  constructor(
    public first: T,
    public second: U
  ) {}

  swap(): Pair<U, T> {
    return new Pair(this.second, this.first);
  }

  toString(): string {
    return `(${this.first}, ${this.second})`;
  }
}

const pair = new Pair('hello', 42);
console.log('Original pair:', pair.toString()); // "(hello, 42)"

const swapped = pair.swap();
console.log('Swapped pair:', swapped.toString()); // "(42, hello)"

// 3. 제약 조건이 있는 제네릭 클래스
console.log('\n=== 3. 제약 조건이 있는 제네릭 클래스 ===');

interface Comparable<T> {
  compareTo(other: T): number;
}

class SortedList<T extends Comparable<T>> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
    this.items.sort((a, b) => a.compareTo(b));
  }

  getAll(): T[] {
    return this.items;
  }
}

class NumberWrapper implements Comparable<NumberWrapper> {
  constructor(public value: number) {}

  compareTo(other: NumberWrapper): number {
    return this.value - other.value;
  }

  toString(): string {
    return this.value.toString();
  }
}

const sortedList = new SortedList<NumberWrapper>();
sortedList.add(new NumberWrapper(5));
sortedList.add(new NumberWrapper(2));
sortedList.add(new NumberWrapper(8));
sortedList.add(new NumberWrapper(1));

console.log(
  'Sorted list:',
  sortedList.getAll().map((n) => n.value)
); // [1, 2, 5, 8]

// 4. 제네릭 클래스 상속
console.log('\n=== 4. 제네릭 클래스 상속 ===');

class Container<T> {
  constructor(protected items: T[]) {}

  getItems(): T[] {
    return this.items;
  }
}

class SizedContainer<T> extends Container<T> {
  getSize(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numbers = new SizedContainer([1, 2, 3, 4, 5]);
console.log('Items:', numbers.getItems());
console.log('Size:', numbers.getSize());
console.log('Is empty:', numbers.isEmpty());

// 5. static 멤버와 제네릭
console.log('\n=== 5. static 멤버와 제네릭 ===');

class Factory<T> {
  // ❌ static 멤버는 제네릭 타입 매개변수 사용 불가
  // static create(value: T): Factory<T> { // Error
  //   return new Factory(value);
  // }

  // ✅ static 메서드에 별도의 제네릭 선언
  static create<U>(value: U): Factory<U> {
    return new Factory(value);
  }

  constructor(public value: T) {}
}

const factoryString = Factory.create('hello');
const factoryNumber = Factory.create(42);

console.log('Factory string:', factoryString.value);
console.log('Factory number:', factoryNumber.value);

// 6. 제네릭 클래스 인스턴스 타입
console.log('\n=== 6. 제네릭 클래스 인스턴스 타입 ===');

class Result<T, E = Error> {
  constructor(
    public success: boolean,
    public value?: T,
    public error?: E
  ) {}

  static ok<T>(value: T): Result<T> {
    return new Result(true, value);
  }

  static err<E = Error>(error: E): Result<never, E> {
    // never 타입을 명시적으로 지정하기 위해 타입 단언 사용
    // 에러 결과에는 값이 없으므로 never가 적절
    return new Result(false, undefined, error) as Result<never, E>;
  }

  isOk(): this is Result<T, never> {
    return this.success;
  }

  isErr(): this is Result<never, E> {
    return !this.success;
  }
}

const okResult = Result.ok(42);
const errResult = Result.err(new Error('Something went wrong'));

if (okResult.isOk()) {
  console.log('Success:', okResult.value);
}

if (errResult.isErr()) {
  console.log('Error:', errResult.error?.message);
}

// 7. 실전 패턴 1: Stack
console.log('\n=== 7. 실전: Stack ===');

class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

const stack = new Stack<number>();
stack.push(1);
stack.push(2);
stack.push(3);

console.log('Peek:', stack.peek()); // 3
console.log('Pop:', stack.pop()); // 3
console.log('Size:', stack.size()); // 2

// 8. 실전 패턴 2: Queue
console.log('\n=== 8. 실전: Queue ===');

class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

const queue = new Queue<string>();
queue.enqueue('first');
queue.enqueue('second');
queue.enqueue('third');

console.log('Front:', queue.front()); // "first"
console.log('Dequeue:', queue.dequeue()); // "first"
console.log('Size:', queue.size()); // 2

// 9. 실전 패턴 3: LinkedList Node
console.log('\n=== 9. 실전: LinkedList ===');

class ListNode<T> {
  constructor(
    public value: T,
    public next: ListNode<T> | null = null
  ) {}
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private tail: ListNode<T> | null = null;
  private length = 0;

  append(value: T): void {
    const node = new ListNode(value);

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      this.tail = node;
    }

    this.length++;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  size(): number {
    return this.length;
  }
}

const list = new LinkedList<number>();
list.append(1);
list.append(2);
list.append(3);

console.log('LinkedList:', list.toArray()); // [1, 2, 3]
console.log('Size:', list.size()); // 3

/**
 * 핵심 정리:
 *
 * 1. 제네릭 클래스 기본 문법:
 *    class ClassName<T> { ... }
 *
 * 2. 다중 타입 매개변수:
 *    class Pair<T, U> { ... }
 *
 * 3. 제약 조건:
 *    class SortedList<T extends Comparable<T>> { ... }
 *
 * 4. 제네릭 클래스 상속:
 *    class Child<T> extends Parent<T> { ... }
 *
 * 5. static 멤버:
 *    - 클래스 타입 매개변수 사용 불가
 *    - 메서드에 별도 제네릭 선언 필요
 *
 * 6. 실전 자료구조:
 *    - Stack<T>: LIFO (push/pop)
 *    - Queue<T>: FIFO (enqueue/dequeue)
 *    - LinkedList<T>: 연결 리스트
 *
 * 7. Result/Option 패턴:
 *    - Result<T, E>: 성공/실패
 *    - Option<T>: Some/None
 *
 * 8. 타입 안전성:
 *    - 컴파일 타임에 타입 체크
 *    - 런타임 에러 방지
 *    - 코드 재사용성 증가
 */
