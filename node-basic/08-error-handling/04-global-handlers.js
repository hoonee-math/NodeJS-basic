/**
 * 04-global-handlers.js
 *
 * 전역 에러 핸들러와 프로세스 이벤트
 */

console.log('=== 전역 에러 핸들러 ===\n');

// 1. uncaughtException - 잡히지 않은 동기 에러
console.log('1. uncaughtException 핸들러\n');

process.on('uncaughtException', (err, origin) => {
  console.log(`\n[uncaughtException 발생!]`);
  console.log(`에러: ${err.message}`);
  console.log(`발생 위치: ${origin}`);
  console.log(`스택: ${err.stack.split('\n')[0]}`);

  // 로그 저장 등 정리 작업 후 프로세스 종료 권장
  // process.exit(1);
});

setTimeout(() => {
  console.log('→ 의도적으로 uncaughtException 발생');
  // throw new Error('잡히지 않은 에러!');
  console.log('   (주석 처리됨 - 프로세스 종료를 방지)');
}, 100);

// 2. unhandledRejection - 처리되지 않은 Promise rejection
console.log('\n2. unhandledRejection 핸들러\n');

process.on('unhandledRejection', (reason, promise) => {
  console.log(`\n[unhandledRejection 발생!]`);
  console.log(`사유: ${reason}`);
  console.log(`Promise: ${promise}`);
});

setTimeout(() => {
  console.log('→ 처리되지 않은 Promise rejection 발생');

  Promise.reject(new Error('처리되지 않은 rejection'));

  // 올바른 방법
  Promise.reject(new Error('처리된 rejection')).catch((err) => {
    console.log(`   [catch] ${err.message} (정상 처리)\n`);
  });
}, 200);

// 3. warning - Node.js 경고
console.log('\n3. warning 이벤트\n');

process.on('warning', (warning) => {
  console.log(`\n[경고 발생]`);
  console.log(`이름: ${warning.name}`);
  console.log(`메시지: ${warning.message}`);
});

setTimeout(() => {
  console.log('→ 커스텀 경고 발생');

  process.emitWarning('이것은 사용자 정의 경고입니다', {
    type: 'CustomWarning',
    code: 'CUSTOM_001'
  });
}, 400);

// 4. exit 이벤트
console.log('\n4. exit 이벤트\n');

process.on('exit', (code) => {
  // 동기 작업만 가능 (비동기 작업은 실행되지 않음)
  console.log(`\n[프로세스 종료] 코드: ${code}`);
});

// 5. beforeExit 이벤트
process.on('beforeExit', (code) => {
  console.log(`\n[beforeExit] 코드: ${code}`);
  console.log('   이벤트 루프가 비어있을 때 발생');
});

// 6. 신호 처리 (SIGINT, SIGTERM)
console.log('5. 신호 처리 (Ctrl+C)\n');

let cleanupCalled = false;

function cleanup() {
  if (cleanupCalled) return;
  cleanupCalled = true;

  console.log('\n[정리 작업 시작]');
  console.log('→ 데이터베이스 연결 종료');
  console.log('→ 파일 저장');
  console.log('→ 캐시 정리');
  console.log('[정리 작업 완료]\n');
}

process.on('SIGINT', () => {
  console.log('\n[SIGINT 신호 수신] Ctrl+C 감지');
  cleanup();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n[SIGTERM 신호 수신] 종료 요청');
  cleanup();
  process.exit(0);
});

console.log('→ Ctrl+C를 눌러 신호 처리 테스트 가능');
console.log('   (자동 종료를 위해 5초 후 종료)\n');

// 7. 실전: 전역 에러 핸들러 설정
console.log('6. 실전: 전역 에러 핸들러 통합\n');

class GlobalErrorHandler {
  constructor() {
    this.setupHandlers();
  }

  setupHandlers() {
    // uncaughtException
    process.on('uncaughtException', (err, origin) => {
      this.handleUncaughtException(err, origin);
    });

    // unhandledRejection
    process.on('unhandledRejection', (reason, promise) => {
      this.handleUnhandledRejection(reason, promise);
    });

    // 프로세스 신호
    process.on('SIGINT', () => this.handleShutdown('SIGINT'));
    process.on('SIGTERM', () => this.handleShutdown('SIGTERM'));

    // 경고
    process.on('warning', (warning) => {
      this.handleWarning(warning);
    });
  }

  handleUncaughtException(err, origin) {
    console.error('[FATAL] Uncaught Exception');
    console.error(`Error: ${err.message}`);
    console.error(`Origin: ${origin}`);
    console.error(err.stack);

    // 로그 저장
    this.logError('uncaughtException', err);

    // 정리 후 종료
    this.shutdown(1);
  }

  handleUnhandledRejection(reason, promise) {
    console.error('[WARNING] Unhandled Promise Rejection');
    console.error(`Reason: ${reason}`);

    // 로그 저장
    this.logError('unhandledRejection', reason);

    // 프로덕션에서는 종료 고려
    // this.shutdown(1);
  }

  handleWarning(warning) {
    console.warn(`[WARNING] ${warning.name}: ${warning.message}`);
  }

  handleShutdown(signal) {
    console.log(`\n[SHUTDOWN] ${signal} received`);

    // 우아한 종료 (graceful shutdown)
    this.cleanup();
    process.exit(0);
  }

  logError(type, error) {
    const errorLog = {
      type,
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString()
    };

    // 실제로는 파일이나 외부 로깅 시스템에 기록
    console.log('   → 에러 로그 저장:', JSON.stringify(errorLog, null, 2));
  }

  cleanup() {
    console.log('   → 리소스 정리 중...');
    // 데이터베이스 연결 종료, 파일 저장 등
  }

  shutdown(code = 0) {
    this.cleanup();
    process.exit(code);
  }
}

// 핸들러 초기화
const errorHandler = new GlobalErrorHandler();
console.log('→ 전역 에러 핸들러 초기화 완료\n');

// 8. 테스트 케이스
setTimeout(() => {
  console.log('7. 테스트 케이스\n');

  // (a) 처리된 에러
  console.log('(a) 처리된 에러:');

  try {
    throw new Error('처리됨');
  } catch (err) {
    console.log(`   → [catch] ${err.message}`);
  }

  // (b) 처리된 Promise rejection
  console.log('\n(b) 처리된 Promise rejection:');

  Promise.reject(new Error('처리됨'))
    .catch((err) => {
      console.log(`   → [catch] ${err.message}`);
    });

  // (c) 경고 발생
  setTimeout(() => {
    console.log('\n(c) 경고 발생:');
    console.log('   → 경고 생성');
    process.emitWarning('테스트 경고', 'TestWarning');
  }, 100);
}, 600);

// 9. 프로세스 정보
setTimeout(() => {
  console.log('\n8. 프로세스 정보\n');

  console.log(`→ PID: ${process.pid}`);
  console.log(`   플랫폼: ${process.platform}`);
  console.log(`   Node 버전: ${process.version}`);
  console.log(`   메모리 사용량: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   실행 시간: ${(process.uptime() * 1000).toFixed(0)} ms`);
}, 800);

// 자동 종료 (5초 후)
setTimeout(() => {
  console.log('\n→ 프로그램 자동 종료 (5초 경과)');
  process.exit(0);
}, 5000);

/**
 * 실행:
 * node 04-global-handlers.js
 *
 * 핵심 개념:
 * - uncaughtException: 잡히지 않은 동기 에러
 * - unhandledRejection: 처리되지 않은 Promise rejection
 * - warning: Node.js 경고 이벤트
 * - exit/beforeExit: 프로세스 종료 이벤트
 * - SIGINT/SIGTERM: 프로세스 신호
 *
 * 프로세스 이벤트:
 *
 * uncaughtException:
 * - try-catch로 잡히지 않은 에러
 * - 프로세스가 불안정한 상태
 * - 로그 저장 후 종료 권장
 * - 복구 시도는 위험
 *
 * unhandledRejection:
 * - .catch()가 없는 Promise rejection
 * - Node.js 15+에서는 기본적으로 프로세스 종료
 * - 모든 Promise에 에러 처리 필수
 *
 * warning:
 * - Node.js가 발생시키는 경고
 * - process.emitWarning()으로 커스텀 경고
 * - deprecated API 사용 시 발생
 *
 * exit:
 * - 프로세스 종료 직전
 * - 동기 작업만 가능
 * - 종료 코드 전달
 *
 * beforeExit:
 * - 이벤트 루프가 비었을 때
 * - 비동기 작업 추가 가능
 * - process.exit()로는 발생 안 함
 *
 * 프로세스 신호:
 * - SIGINT: Ctrl+C (인터럽트)
 * - SIGTERM: 종료 요청
 * - SIGHUP: 터미널 연결 종료
 * - SIGKILL: 강제 종료 (처리 불가)
 *
 * Graceful Shutdown:
 * 1. 신호 수신
 * 2. 새 요청 거부
 * 3. 진행 중인 작업 완료 대기
 * 4. 리소스 정리 (DB 연결, 파일 등)
 * 5. 프로세스 종료
 *
 * 에러 로깅:
 * - 파일에 기록
 * - 외부 로깅 시스템 (Sentry, LogDNA 등)
 * - 구조화된 로그 (JSON)
 * - 타임스탬프, 스택 트레이스 포함
 *
 * Best Practices:
 * - 모든 Promise에 .catch() 또는 try-catch
 * - uncaughtException 발생 시 프로세스 종료
 * - SIGINT/SIGTERM 처리로 graceful shutdown
 * - 에러 로깅 시스템 구축
 * - 프로덕션에서는 프로세스 매니저 사용 (PM2, systemd)
 *
 * 주의사항:
 * - uncaughtException 후 복구는 위험
 * - exit 이벤트에서는 비동기 작업 불가
 * - SIGKILL은 처리할 수 없음
 * - 테스트 환경과 프로덕션 환경 구분
 *
 * 프로덕션 패턴:
 * - 프로세스 매니저로 자동 재시작
 * - 클러스터 모드로 무중단 배포
 * - 헬스 체크 엔드포인트
 * - 모니터링 및 알림 시스템
 */
