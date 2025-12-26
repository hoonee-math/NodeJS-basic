/**
 * 06-real-world-example.js
 *
 * 실전 예제: 주문 처리 시스템
 */

const EventEmitter = require('events');

console.log('=== 주문 처리 시스템 (Event-Driven) ===\n');

// 주문 처리 시스템 클래스
class OrderProcessor extends EventEmitter {
  constructor() {
    super();
    this.orders = [];
  }

  // 주문 생성
  createOrder(order) {
    console.log(`→ 주문 생성: #${order.id}`);

    this.orders.push(order);
    this.emit('order:created', order);

    // 주문 처리 시작
    this.processOrder(order);
  }

  // 주문 처리
  processOrder(order) {
    console.log(`→ 결제 처리 중: #${order.id}`);
    this.emit('order:processing', order);

    // 결제 시뮬레이션
    setTimeout(() => {
      const success = Math.random() > 0.2;

      if (success) {
        console.log(`→ 결제 완료: #${order.id}`);
        this.emit('payment:success', order);
        this.shipOrder(order);
      } else {
        const error = new Error('결제 실패');
        console.log(`→ 결제 실패: #${order.id}`);
        this.emit('payment:failed', { order, error });
      }
    }, 1000);
  }

  // 배송 처리
  shipOrder(order) {
    console.log(`→ 배송 시작: #${order.id}`);
    this.emit('shipping:started', order);

    setTimeout(() => {
      console.log(`→ 배송 완료: #${order.id}`);
      this.emit('order:completed', order);
    }, 1500);
  }
}

// 주문 처리 시스템 생성
const processor = new OrderProcessor();

// 이벤트 리스너 등록

// 1. 주문 생성 시
processor.on('order:created', (order) => {
  console.log(`   [알림] 새 주문 접수: ${order.product}`);
});

// 2. 주문 처리 중
processor.on('order:processing', (order) => {
  console.log(`   [처리] ${order.customer}님 주문 처리 중...`);
});

// 3. 결제 성공
processor.on('payment:success', (order) => {
  console.log(`   [결제] ${order.amount}원 결제 완료`);

  // 이메일 발송 (시뮬레이션)
  console.log(`   [이메일] ${order.customer}님께 결제 확인 메일 발송`);
});

// 4. 결제 실패
processor.on('payment:failed', ({ order, error }) => {
  console.log(`   [실패] 결제 오류: ${error.message}`);
  console.log(`   [이메일] ${order.customer}님께 결제 실패 알림 발송`);
});

// 5. 배송 시작
processor.on('shipping:started', (order) => {
  console.log(`   [배송] ${order.address}로 배송 시작`);
});

// 6. 주문 완료
processor.on('order:completed', (order) => {
  console.log(`   [완료] 주문 #${order.id} 처리 완료!`);
  console.log(`   [이메일] 배송 완료 알림 발송\n`);
});

// 에러 처리
processor.on('error', (err) => {
  console.log(`   [에러] 시스템 오류: ${err.message}`);
});

// 주문 생성
console.log('주문 3건 생성\n');

processor.createOrder({
  id: 1001,
  customer: 'Alice',
  product: '노트북',
  amount: 1500000,
  address: '서울시 강남구'
});

setTimeout(() => {
  processor.createOrder({
    id: 1002,
    customer: 'Bob',
    product: '마우스',
    amount: 30000,
    address: '부산시 해운대구'
  });
}, 500);

setTimeout(() => {
  processor.createOrder({
    id: 1003,
    customer: 'Charlie',
    product: '키보드',
    amount: 120000,
    address: '대전시 유성구'
  });
}, 1000);

/**
 * 실행:
 * node 06-real-world-example.js
 *
 * 이벤트 흐름:
 * 1. order:created → 주문 접수
 * 2. order:processing → 결제 처리 시작
 * 3-a. payment:success → 결제 성공 → 배송
 * 3-b. payment:failed → 결제 실패 → 종료
 * 4. shipping:started → 배송 시작
 * 5. order:completed → 주문 완료
 *
 * Event-Driven 아키텍처 장점:
 * - 느슨한 결합: 각 모듈이 독립적으로 동작
 * - 확장성: 새로운 리스너 추가 쉬움
 * - 유지보수: 기능 추가/수정이 간단
 *
 * 실전 활용:
 * - 주문 처리 시스템
 * - 사용자 인증 플로우
 * - 파일 업로드 파이프라인
 * - 실시간 알림 시스템
 * - 게임 이벤트 처리
 *
 * 추가 가능한 리스너:
 * - 로깅 시스템 (모든 이벤트 기록)
 * - 통계 수집 (주문 건수, 성공률 등)
 * - 재고 관리 (주문 시 재고 차감)
 * - 포인트 적립 (완료 시 포인트 지급)
 */
