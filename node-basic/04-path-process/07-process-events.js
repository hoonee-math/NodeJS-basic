/**
 * 07-process-events.js
 *
 * 프로세스 이벤트와 시그널
 * 종료, 에러, 시그널 처리
 */

console.log('=== 프로세스 이벤트 ===\n');

// ============================================
// 1. exit 이벤트
// ============================================
console.log('1. exit 이벤트\n');

process.on('exit', (code) => {
  // 주의: 비동기 작업은 여기서 실행 불가
  console.log(`\n   [exit] 프로세스 종료: 코드 ${code}`);
  console.log('   → 동기 작업만 가능 (cleanup)\n');
});

console.log('   exit 이벤트 리스너 등록 완료');
console.log('   프로세스 종료 시 실행됩니다\n');

// ============================================
// 2. beforeExit 이벤트
// ============================================
console.log('2. beforeExit 이벤트\n');

process.on('beforeExit', (code) => {
  console.log(`   [beforeExit] 이벤트 루프가 비었습니다: 코드 ${code}`);

  // beforeExit에서는 비동기 작업 가능!
  setTimeout(() => {
    console.log('   → beforeExit에서 비동기 작업 추가 가능');
  }, 100);
});

console.log('   beforeExit은 exit과 다릅니다:');
console.log('   - exit: 비동기 작업 불가');
console.log('   - beforeExit: 비동기 작업 가능\n');

// ============================================
// 3. uncaughtException 이벤트
// ============================================
console.log('3. uncaughtException 이벤트\n');

process.on('uncaughtException', (err, origin) => {
  console.error(`   [uncaughtException] 치명적 에러!`);
  console.error('   에러:', err.message);
  console.error('   발생 위치:', origin);
  console.error();

  // 로깅 후 종료하는 것이 안전
  console.error('   ⚠️  프로세스를 종료해야 안전합니다');
  // process.exit(1);  // 실제로는 종료해야 함
});

console.log('   uncaughtException 핸들러 등록 완료');
console.log('   → 처리되지 않은 예외를 잡습니다');

// 예외 발생 테스트 (주석 처리)
// setTimeout(() => {
//   throw new Error('처리되지 않은 에러!');
// }, 1000);

console.log();

// ============================================
// 4. unhandledRejection 이벤트
// ============================================
console.log('4. unhandledRejection 이벤트\n');

process.on('unhandledRejection', (reason, promise) => {
  console.error(`   [unhandledRejection] Promise rejection!`);
  console.error('   이유:', reason);
  console.error('   Promise:', promise);
  console.error();

  // 로깅 후 종료
  console.error('   ⚠️  .catch()를 빠뜨렸는지 확인하세요');
  // process.exit(1);
});

console.log('   unhandledRejection 핸들러 등록 완료');
console.log('   → .catch() 없는 Promise를 잡습니다');

// Promise rejection 테스트 (주석 처리)
// Promise.reject(new Error('처리되지 않은 rejection!'));

console.log();

// ============================================
// 5. warning 이벤트
// ============================================
console.log('5. warning 이벤트\n');

process.on('warning', (warning) => {
  console.warn('   [warning]', warning.name);
  console.warn('   메시지:', warning.message);
  console.warn('   스택:', warning.stack);
});

console.log('   warning 핸들러 등록 완료');
console.log('   → Node.js 경고를 감지합니다');

// 경고 발생 (EventEmitter 리스너 제한)
// process.setMaxListeners(1);
// process.on('test', () => {});
// process.on('test', () => {});  // 경고 발생

console.log();

// ============================================
// 6. SIGINT 시그널 (Ctrl+C)
// ============================================
console.log('6. SIGINT 시그널 (Ctrl+C)\n');

process.on('SIGINT', () => {
  console.log('\n   [SIGINT] Ctrl+C 감지!');
  console.log('   정리 작업을 수행합니다...');

  // Graceful shutdown
  setTimeout(() => {
    console.log('   ✅ 정리 완료, 종료합니다');
    process.exit(0);
  }, 1000);
});

console.log('   SIGINT 핸들러 등록 완료');
console.log('   → Ctrl+C 눌러서 테스트 가능\n');

// ============================================
// 7. SIGTERM 시그널 (종료 요청)
// ============================================
console.log('7. SIGTERM 시그널 (종료 요청)\n');

process.on('SIGTERM', () => {
  console.log('\n   [SIGTERM] 종료 신호 받음');
  console.log('   서버를 graceful하게 종료합니다...');

  // 서버 종료 예시
  // server.close(() => {
  //   console.log('   HTTP 서버 종료됨');
  //   process.exit(0);
  // });

  setTimeout(() => {
    console.log('   ✅ 종료 완료');
    process.exit(0);
  }, 1000);
});

console.log('   SIGTERM 핸들러 등록 완료');
console.log('   → kill 명령어로 테스트 가능');
console.log('   (kill -TERM <PID>)\n');

// ============================================
// 8. 여러 시그널 처리
// ============================================
console.log('8. 여러 시그널 통합 처리\n');

function gracefulShutdown(signal) {
  return () => {
    console.log(`\n   [${signal}] 종료 신호 감지`);
    console.log('   1. DB 연결 종료...');
    console.log('   2. 진행 중인 요청 완료 대기...');
    console.log('   3. 리소스 정리...');

    setTimeout(() => {
      console.log('   ✅ Graceful shutdown 완료');
      process.exit(0);
    }, 1500);
  };
}

// 주석 처리 (위에서 이미 등록됨)
// process.on('SIGINT', gracefulShutdown('SIGINT'));
// process.on('SIGTERM', gracefulShutdown('SIGTERM'));

console.log('   통합 shutdown 핸들러 준비 완료\n');

// ============================================
// 9. 프로세스 종료 코드
// ============================================
console.log('9. 프로세스 종료 코드\n');

// process.exitCode로 종료 코드 설정
// process.exit()보다 안전 (이벤트 루프 비움)

function exitWithCode(code, reason) {
  console.log(`   종료 준비: ${reason}`);
  console.log(`   종료 코드: ${code}`);

  process.exitCode = code;
  // 이벤트 루프가 비면 자동 종료

  // 즉시 종료하려면:
  // process.exit(code);
}

console.log('   종료 코드:');
console.log('   - 0: 정상 종료');
console.log('   - 1: 일반 에러');
console.log('   - 2: 잘못된 사용');
console.log('   - 130: SIGINT (Ctrl+C)');
console.log();

// 예시 (주석 처리)
// exitWithCode(0, '정상 완료');

// ============================================
// 10. 종합 예제: Graceful Shutdown
// ============================================
setTimeout(() => {
  console.log('10. Graceful Shutdown 예제\n');

  class Application {
    constructor() {
      this.isShuttingDown = false;
      this.setupSignalHandlers();
    }

    setupSignalHandlers() {
      const signals = ['SIGINT', 'SIGTERM'];

      signals.forEach(signal => {
        // 이미 등록된 핸들러가 있으므로 주석 처리
        // process.on(signal, () => this.shutdown(signal));
      });

      process.on('uncaughtException', (err) => {
        console.error('   Uncaught Exception:', err);
        this.shutdown('EXCEPTION', 1);
      });

      process.on('unhandledRejection', (reason) => {
        console.error('   Unhandled Rejection:', reason);
        this.shutdown('REJECTION', 1);
      });
    }

    async shutdown(signal, exitCode = 0) {
      if (this.isShuttingDown) {
        console.log('   이미 종료 중입니다...');
        return;
      }

      this.isShuttingDown = true;
      console.log(`\n   [${signal}] 애플리케이션 종료 시작...`);

      try {
        // 1. 새 요청 거부
        console.log('   1. 새 요청 거부');

        // 2. 진행 중인 작업 완료 대기
        console.log('   2. 진행 중인 작업 완료 대기');
        await this.waitForPendingTasks();

        // 3. 외부 연결 종료
        console.log('   3. DB/Redis 연결 종료');
        await this.closeConnections();

        // 4. 정리 작업
        console.log('   4. 임시 파일 정리');
        await this.cleanup();

        console.log('   ✅ 모든 정리 작업 완료');
        process.exit(exitCode);
      } catch (err) {
        console.error('   ❌ 종료 중 에러:', err);
        process.exit(1);
      }
    }

    async waitForPendingTasks() {
      // 대기 로직 구현
      return new Promise(resolve => setTimeout(resolve, 500));
    }

    async closeConnections() {
      // 연결 종료 로직
      return new Promise(resolve => setTimeout(resolve, 500));
    }

    async cleanup() {
      // 정리 로직
      return new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  console.log('   Application 클래스:');
  console.log('   - setupSignalHandlers(): 시그널 등록');
  console.log('   - shutdown(): 단계별 종료');
  console.log('   - waitForPendingTasks(): 작업 완료 대기');
  console.log('   - closeConnections(): 연결 종료');
  console.log('   - cleanup(): 리소스 정리');
  console.log();

  // const app = new Application();
  console.log('   실제 서버에서 이 패턴을 사용하세요!\n');
}, 100);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('프로세스 이벤트 정리');
  console.log('='.repeat(60));
  console.log(`
✅ exit - 프로세스 종료 (동기만)
✅ beforeExit - 이벤트 루프 비었을 때 (비동기 가능)
✅ uncaughtException - 처리 안 된 예외
✅ unhandledRejection - 처리 안 된 Promise
✅ SIGINT - Ctrl+C
✅ SIGTERM - 종료 신호
✅ warning - Node.js 경고

Graceful Shutdown 패턴:
1. 새 요청 거부
2. 진행 중인 작업 완료 대기
3. 외부 연결 종료 (DB, Redis 등)
4. 리소스 정리
5. process.exit(0)

주의사항:
→ uncaughtException 후에는 반드시 종료
→ exit 이벤트에서는 비동기 작업 금지
→ SIGKILL은 처리 불가 (강제 종료)
→ Windows는 SIGTERM 미지원

테스트 방법:
→ Ctrl+C: SIGINT
→ kill <PID>: SIGTERM
→ kill -9 <PID>: SIGKILL (처리 불가)

다음 단계:
04-path-process 폴더 완료!
05-http 폴더에서 HTTP 서버를 배워봅시다!
  `);

  console.log('\n프로세스 ID:', process.pid);
  console.log('Ctrl+C를 눌러 SIGINT 핸들러를 테스트해보세요!\n');
}, 200);

/**
 * 핵심 정리:
 *
 * 이벤트 종류:
 * - exit: 종료 직전 (동기만)
 * - beforeExit: 이벤트 루프 비었을 때 (비동기 가능)
 * - uncaughtException: 처리 안 된 예외
 * - unhandledRejection: 처리 안 된 Promise
 *
 * 시그널:
 * - SIGINT: Ctrl+C
 * - SIGTERM: 정상 종료 요청
 * - SIGKILL: 강제 종료 (처리 불가)
 *
 * Graceful Shutdown:
 * 1. 시그널 감지
 * 2. 새 요청 거부
 * 3. 진행 중인 작업 완료
 * 4. 연결 종료
 * 5. 정리 후 종료
 */

/**
 * 실행:
 * node 07-process-events.js
 *
 * 테스트:
 * - Ctrl+C 눌러서 SIGINT 확인
 * - 다른 터미널에서: kill <PID>
 */
