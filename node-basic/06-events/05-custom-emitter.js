/**
 * 05-custom-emitter.js
 *
 * EventEmitter를 상속받는 커스텀 클래스 만들기
 */

const EventEmitter = require('events');

console.log('=== 커스텀 EventEmitter 클래스 ===\n');

// 1. EventEmitter 상속
console.log('1. Timer 클래스 (EventEmitter 상속)\n');

class Timer extends EventEmitter {
  constructor(duration) {
    super();  // EventEmitter 생성자 호출
    this.duration = duration;
  }

  start() {
    console.log(`→ 타이머 시작 (${this.duration}ms)`);
    this.emit('start');

    setTimeout(() => {
      console.log(`→ 타이머 완료`);
      this.emit('complete');
    }, this.duration);
  }
}

const timer = new Timer(1000);

timer.on('start', () => {
  console.log('   이벤트: 시작됨');
});

timer.on('complete', () => {
  console.log('   이벤트: 완료됨');
});

timer.start();

// 2. 실전 예제: HTTP Request 클래스
setTimeout(() => {
  console.log('\n2. HTTP Request 시뮬레이션\n');

  class HttpRequest extends EventEmitter {
    constructor(url) {
      super();
      this.url = url;
    }

    send() {
      console.log(`→ 요청 전송: ${this.url}`);
      this.emit('request', { url: this.url, method: 'GET' });

      // 네트워크 요청 시뮬레이션
      setTimeout(() => {
        const success = Math.random() > 0.3;

        if (success) {
          const data = { status: 200, body: 'Success!' };
          console.log(`→ 응답 수신: ${data.status}`);
          this.emit('response', data);
        } else {
          const error = new Error('네트워크 에러');
          console.log(`→ 에러 발생: ${error.message}`);
          this.emit('error', error);
        }
      }, 500);
    }
  }

  const request = new HttpRequest('https://api.example.com/data');

  request.on('request', (data) => {
    console.log(`   요청 데이터:`, data);
  });

  request.on('response', (data) => {
    console.log(`   응답 데이터:`, data);
  });

  request.on('error', (err) => {
    console.log(`   에러 처리:`, err.message);
  });

  request.send();
}, 1200);

// 3. 실전 예제: 데이터 스트림
setTimeout(() => {
  console.log('\n3. 데이터 스트림 클래스\n');

  class DataStream extends EventEmitter {
    constructor() {
      super();
      this.data = [];
    }

    write(chunk) {
      console.log(`→ 데이터 쓰기: "${chunk}"`);
      this.data.push(chunk);
      this.emit('data', chunk);
    }

    end() {
      console.log(`→ 스트림 종료 (총 ${this.data.length}개)`);
      this.emit('end', this.data);
    }
  }

  const stream = new DataStream();

  stream.on('data', (chunk) => {
    console.log(`   수신: ${chunk}`);
  });

  stream.on('end', (allData) => {
    console.log(`   전체 데이터:`, allData);
  });

  stream.write('Hello');
  stream.write('World');
  stream.write('!');
  stream.end();
}, 1800);

// 4. 메서드 체이닝
setTimeout(() => {
  console.log('\n4. 메서드 체이닝 패턴\n');

  class Logger extends EventEmitter {
    log(message) {
      console.log(`→ 로그: ${message}`);
      this.emit('log', { level: 'info', message });
      return this;  // 체이닝을 위해 this 반환
    }

    warn(message) {
      console.log(`→ 경고: ${message}`);
      this.emit('log', { level: 'warn', message });
      return this;
    }

    error(message) {
      console.log(`→ 에러: ${message}`);
      this.emit('log', { level: 'error', message });
      return this;
    }
  }

  const logger = new Logger();

  logger.on('log', (data) => {
    console.log(`   [${data.level.toUpperCase()}] ${data.message}`);
  });

  // 메서드 체이닝
  logger
    .log('앱 시작')
    .warn('설정 파일 없음')
    .log('기본값 사용');
}, 2400);

/**
 * 실행:
 * node 05-custom-emitter.js
 *
 * 핵심 개념:
 * - class MyClass extends EventEmitter : 상속
 * - super() : 부모 생성자 호출 (필수)
 * - this.emit() : 이벤트 발생
 * - 클래스 내부에서 적절한 시점에 이벤트 발생
 *
 * 상속 패턴:
 * class MyEmitter extends EventEmitter {
 *   constructor() {
 *     super();  // 필수!
 *   }
 *
 *   doSomething() {
 *     this.emit('something', data);
 *   }
 * }
 *
 * 실전 활용:
 * - HTTP 클라이언트: request, response, error 이벤트
 * - 스트림: data, end, error 이벤트
 * - 웹소켓: open, message, close, error 이벤트
 * - 타이머: start, tick, complete 이벤트
 *
 * 장점:
 * - 캡슐화: 내부 구현을 숨기고 이벤트만 노출
 * - 유연성: 여러 리스너가 독립적으로 동작
 * - 확장성: 새로운 이벤트 추가 쉬움
 */
