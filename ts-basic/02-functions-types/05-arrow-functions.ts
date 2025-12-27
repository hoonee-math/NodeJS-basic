/**
 * 05-arrow-functions.ts
 * 화살표 함수와 this 바인딩
 */

// 1. 일반 함수 vs 화살표 함수 기본
function regularFunction(name: string): string {
  return `Hello, ${name}`;
}

const arrowFunction = (name: string): string => {
  return `Hello, ${name}`;
};

// 단축 문법
const shortArrow = (name: string): string => `Hello, ${name}`;

console.log('=== 일반 함수 vs 화살표 함수 ===');
console.log(regularFunction('Alice'));
console.log(arrowFunction('Bob'));
console.log(shortArrow('Charlie'));

// 2. this 바인딩 차이 - 일반 함수
const obj1 = {
  name: 'Object 1',
  regularMethod: function () {
    console.log('Regular method this.name:', this.name);
  },
};

console.log('\n=== 일반 함수의 this ===');
obj1.regularMethod(); // this는 obj1

const extracted1 = obj1.regularMethod;
// extracted1(); // ❌ this가 undefined (strict mode)

// 3. this 바인딩 차이 - 화살표 함수
const obj2 = {
  name: 'Object 2',
  arrowMethod: () => {
    // 화살표 함수는 자신의 this를 가지지 않음
    // 상위 스코프의 this 사용 (여기서는 전역)
    console.log('Arrow method this:', this);
  },
};

console.log('\n=== 화살표 함수의 this ===');
obj2.arrowMethod(); // this는 상위 스코프

// 4. 클래스 메서드에서 this
class Counter {
  count = 0;

  // 일반 메서드
  incrementRegular() {
    this.count++;
    console.log(`Regular: ${this.count}`);
  }

  // 화살표 함수 필드
  incrementArrow = () => {
    this.count++;
    console.log(`Arrow: ${this.count}`);
  };
}

console.log('\n=== 클래스 메서드의 this ===');
const counter = new Counter();

counter.incrementRegular();
counter.incrementArrow();

// 메서드 추출
const regularMethod = counter.incrementRegular;
const arrowMethod = counter.incrementArrow;

// regularMethod(); // ❌ this가 undefined
arrowMethod(); // ✅ this가 counter 인스턴스

// 5. this 타입 명시
interface Person {
  name: string;
  greet(this: Person): void;
}

const person: Person = {
  name: 'John',
  greet(this: Person) {
    // this가 Person 타입임을 보장
    console.log(`Hello, I'm ${this.name}`);
  },
};

console.log('\n=== this 타입 명시 ===');
person.greet();

// const greetFunc = person.greet;
// greetFunc(); // ❌ 에러: this가 void

// 6. 콜백에서 this 문제
class Button {
  label = 'Click me';

  // ❌ 일반 함수 - this 문제 발생
  handleClickWrong() {
    console.log(`Clicked: ${this.label}`);
  }

  // ✅ 화살표 함수 - this 보존
  handleClickCorrect = () => {
    console.log(`Clicked: ${this.label}`);
  };
}

console.log('\n=== 콜백에서 this ===');
const button = new Button();

// 이벤트 핸들러로 전달 (시뮬레이션)
setTimeout(button.handleClickCorrect, 0);
// setTimeout(button.handleClickWrong, 0); // ❌ this.label undefined

// 7. bind, call, apply와 화살표 함수
const boundRegular = {
  value: 42,
  getValue: function () {
    return this.value;
  },
};

const boundArrow = {
  value: 42,
  getValue: () => {
    return this; // 화살표 함수는 bind 무시
  },
};

console.log('\n=== bind와 화살표 함수 ===');
const regularGet = boundRegular.getValue;
console.log('Regular (unbound):', regularGet.call({ value: 100 }));

const arrowGet = boundArrow.getValue;
console.log('Arrow (call ignored):', arrowGet.call({ value: 100 }));

// 8. 화살표 함수와 arguments
function regularWithArgs() {
  console.log('Regular arguments:', arguments);

  const arrow = () => {
    // 화살표 함수는 자신의 arguments가 없음
    // 상위 함수의 arguments 사용
    console.log('Arrow arguments:', arguments);
  };

  arrow();
}

console.log('\n=== arguments 객체 ===');
regularWithArgs(1, 2, 3);

// 화살표 함수는 나머지 매개변수 사용
const arrowWithRest = (...args: number[]) => {
  console.log('Arrow rest params:', args);
};
arrowWithRest(1, 2, 3);

// 9. 생성자로 사용 불가
function RegularConstructor(this: any, name: string) {
  this.name = name;
}

// const ArrowConstructor = (name: string) => {
//   this.name = name; // ❌ 화살표 함수는 생성자로 사용 불가
// };

console.log('\n=== 생성자 함수 ===');
const instance = new (RegularConstructor as any)('Test');
console.log('Instance:', instance);

// 10. 메서드 정의 시 선택 가이드
class Example {
  value = 'instance value';

  // ✅ 일반 메서드: 프로토타입에 정의됨 (메모리 효율적)
  regularMethod() {
    return this.value;
  }

  // ✅ 화살표 필드: 각 인스턴스마다 생성 (this 바인딩 안전)
  arrowField = () => {
    return this.value;
  };
}

console.log('\n=== 메서드 정의 선택 ===');
const ex1 = new Example();
const ex2 = new Example();

console.log('regularMethod 공유:', ex1.regularMethod === ex2.regularMethod);
console.log('arrowField 개별:', ex1.arrowField === ex2.arrowField);

// 11. React 스타일 이벤트 핸들러
class Component {
  state = { count: 0 };

  // ❌ 일반 메서드 - bind 필요
  handleClickBind() {
    this.state.count++;
  }

  // ✅ 화살표 필드 - bind 불필요
  handleClickArrow = () => {
    this.state.count++;
    console.log(`Count: ${this.state.count}`);
  };
}

console.log('\n=== React 스타일 핸들러 ===');
const component = new Component();
const handler = component.handleClickArrow;
handler(); // this가 component를 가리킴

// 12. 즉시 실행 화살표 함수
const result = ((x: number, y: number) => {
  return x + y;
})(10, 20);

console.log('\n=== 즉시 실행 화살표 함수 ===');
console.log('Result:', result);

// 13. 타입 추론과 화살표 함수
const numbers = [1, 2, 3, 4, 5];

// 매개변수 타입 자동 추론
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log('\n=== 타입 추론 ===');
console.log('Doubled:', doubled);
console.log('Evens:', evens);
console.log('Sum:', sum);

// 14. 비동기 화살표 함수
const fetchData = async (url: string): Promise<string> => {
  console.log(`Fetching ${url}...`);
  return `Data from ${url}`;
};

console.log('\n=== 비동기 화살표 함수 ===');
fetchData('https://api.example.com').then((data) => console.log(data));

// 15. 실전 예제: 타이머 클래스
class Timer {
  seconds = 0;

  start() {
    // 화살표 함수로 this 보존
    setInterval(() => {
      this.seconds++;
      console.log(`Timer: ${this.seconds}s`);
    }, 1000);
  }

  startWrong() {
    // ❌ 일반 함수 - this가 setInterval의 컨텍스트
    setInterval(function () {
      // this.seconds++; // ❌ this가 undefined
    }, 1000);
  }
}

console.log('\n=== 실전: 타이머 클래스 ===');
const timer = new Timer();
// timer.start(); // 1초마다 증가 (주석 해제하여 테스트)

/**
 * ============================================
 * 핵심 정리
 * ============================================
 *
 * 1. 화살표 함수 기본 문법
 *    - 기본: (params) => { return value; }
 *    - 단축: (params) => value
 *    - 단일 매개변수: param => value
 *
 * 2. 일반 함수의 this
 *    - 호출 시점에 동적으로 결정
 *    - 호출 방식에 따라 달라짐
 *      obj.method() → this는 obj
 *      method() → this는 undefined (strict mode)
 *
 * 3. 화살표 함수의 this
 *    - 선언 위치의 this를 캡처 (렉시컬 바인딩)
 *    - 자신의 this를 가지지 않음
 *    - bind, call, apply 무시
 *
 * 4. this 타입 명시
 *    - 첫 번째 매개변수로 this 타입 지정
 *      function f(this: Type, param: string) { }
 *
 * 5. 클래스 메서드 선택
 *    일반 메서드:
 *    - 프로토타입에 정의
 *    - 모든 인스턴스가 공유
 *    - 메모리 효율적
 *
 *    화살표 필드:
 *    - 각 인스턴스마다 생성
 *    - this 자동 바인딩
 *    - 콜백으로 전달 시 안전
 *
 * 6. 사용 시기
 *    일반 함수 사용:
 *    ✅ 메서드 정의 (프로토타입 메서드)
 *    ✅ 생성자 함수
 *    ✅ this가 동적으로 변해야 할 때
 *
 *    화살표 함수 사용:
 *    ✅ 콜백 함수
 *    ✅ 배열 메서드 (map, filter, reduce)
 *    ✅ 타이머 함수 (setTimeout, setInterval)
 *    ✅ 이벤트 핸들러 (React 등)
 *    ✅ this를 보존해야 할 때
 *
 * 7. arguments 객체
 *    - 일반 함수: 자신의 arguments 있음
 *    - 화살표 함수: 상위 함수의 arguments 사용
 *    - 화살표 함수는 나머지 매개변수 권장
 *
 * 8. 생성자
 *    - 일반 함수: 생성자로 사용 가능
 *    - 화살표 함수: 생성자로 사용 불가
 *
 * 9. bind, call, apply
 *    - 일반 함수: this 변경 가능
 *    - 화살표 함수: 무시됨
 *
 * 10. React 패턴
 *     class Component {
 *       // 화살표 필드로 자동 바인딩
 *       handleClick = () => { this.setState(...); }
 *     }
 *
 * 11. Best Practices
 *     ✅ 콜백은 화살표 함수
 *     ✅ 클래스 메서드는 일반 함수 (프로토타입)
 *     ✅ 이벤트 핸들러는 화살표 필드
 *     ✅ this가 필요 없으면 화살표 함수
 *     ✅ this 바인딩 명확히 이해하고 선택
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 * @see https://www.typescriptlang.org/docs/handbook/2/functions.html
 */
