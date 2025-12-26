/**
 * 03-process-info.js
 *
 * process 객체로 프로세스 정보 조회
 * 시스템 정보, 메모리, 실행 시간 등
 */

console.log('=== process 객체 - 정보 조회 ===\n');

// ============================================
// 1. Node.js 버전 정보
// ============================================
console.log('1. Node.js 버전 정보\n');

console.log('   Node.js 버전:', process.version);
console.log('   V8 엔진:', process.versions.v8);
console.log('   OpenSSL:', process.versions.openssl);
console.log('   전체 버전:', process.versions);
console.log('\n   → process.version으로 Node 버전 확인\n');

// ============================================
// 2. 플랫폼 정보
// ============================================
console.log('2. 플랫폼 정보\n');

console.log('   운영체제:', process.platform);
console.log('   CPU 아키텍처:', process.arch);
console.log('   프로세스 ID:', process.pid);
console.log('   부모 PID:', process.ppid);
console.log();

const platformInfo = {
  'win32': 'Windows',
  'darwin': 'macOS',
  'linux': 'Linux',
  'freebsd': 'FreeBSD',
  'openbsd': 'OpenBSD'
};

console.log('   현재 OS:', platformInfo[process.platform] || process.platform);
console.log('\n   → process.platform으로 OS별 분기 가능\n');

// ============================================
// 3. 디렉토리 정보
// ============================================
console.log('3. 디렉토리 정보\n');

console.log('   현재 작업 디렉토리:', process.cwd());
console.log('   실행 파일 경로:', process.execPath);
console.log();

// cwd vs __dirname 차이
console.log('   비교:');
console.log('   - process.cwd():', process.cwd());
console.log('   - __dirname:', __dirname);
console.log('   - __filename:', __filename);
console.log('\n   → cwd는 실행 위치, __dirname은 파일 위치\n');

// ============================================
// 4. 메모리 사용량
// ============================================
console.log('4. 메모리 사용량\n');

const memory = process.memoryUsage();

function formatBytes(bytes) {
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

console.log('   메모리 정보:');
console.log('   - RSS (Resident Set Size):', formatBytes(memory.rss));
console.log('   - Heap Total (V8 힙 총량):', formatBytes(memory.heapTotal));
console.log('   - Heap Used (V8 힙 사용):', formatBytes(memory.heapUsed));
console.log('   - External (C++ 객체):', formatBytes(memory.external));
console.log('   - Array Buffers:', formatBytes(memory.arrayBuffers));
console.log();

const heapPercent = ((memory.heapUsed / memory.heapTotal) * 100).toFixed(1);
console.log(`   힙 사용률: ${heapPercent}%`);
console.log('\n   → memoryUsage()로 메모리 모니터링\n');

// ============================================
// 5. 프로세스 실행 시간
// ============================================
console.log('5. 프로세스 실행 시간\n');

const uptimeSeconds = process.uptime();

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = (seconds % 60).toFixed(3);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분 ${secs}초`;
  } else if (minutes > 0) {
    return `${minutes}분 ${secs}초`;
  } else {
    return `${secs}초`;
  }
}

console.log('   실행 시간:', formatUptime(uptimeSeconds));
console.log('   초 단위:', uptimeSeconds);
console.log('\n   → uptime()으로 서버 가동 시간 확인\n');

// ============================================
// 6. CPU 사용 시간
// ============================================
console.log('6. CPU 사용 시간\n');

const cpuUsage = process.cpuUsage();

console.log('   CPU 사용 시간:');
console.log('   - User CPU:', (cpuUsage.user / 1000).toFixed(2), 'ms');
console.log('   - System CPU:', (cpuUsage.system / 1000).toFixed(2), 'ms');
console.log('   - Total:', ((cpuUsage.user + cpuUsage.system) / 1000).toFixed(2), 'ms');
console.log('\n   → cpuUsage()로 성능 측정\n');

// ============================================
// 7. 사용자 정보
// ============================================
console.log('7. 사용자 정보\n');

if (process.getuid) {  // Unix/Linux/macOS만
  console.log('   User ID:', process.getuid());
  console.log('   Group ID:', process.getgid());
} else {
  console.log('   (Windows에서는 지원하지 않음)');
}

console.log('\n   → getuid/getgid는 POSIX 시스템만 지원\n');

// ============================================
// 8. 시스템 리소스 제한
// ============================================
console.log('8. 시스템 리소스 제한\n');

if (process.getrlimit) {  // Node.js 16+
  try {
    const limits = process.getrlimit('nofile');
    console.log('   파일 디스크립터 제한:');
    console.log('   - Soft limit:', limits.soft);
    console.log('   - Hard limit:', limits.hard);
  } catch (err) {
    console.log('   (지원하지 않는 환경)');
  }
} else {
  console.log('   (Node.js 16 이상 필요)');
}

console.log('\n   → getrlimit()로 시스템 제한 확인\n');

// ============================================
// 9. 현재 작업 디렉토리 변경
// ============================================
console.log('9. 작업 디렉토리 변경\n');

const originalCwd = process.cwd();
console.log('   현재 디렉토리:', originalCwd);

try {
  // 상위 디렉토리로 이동
  const parentDir = require('path').dirname(originalCwd);
  process.chdir(parentDir);
  console.log('   변경 후:', process.cwd());

  // 원래대로 복구
  process.chdir(originalCwd);
  console.log('   복구 후:', process.cwd());
} catch (err) {
  console.error('   에러:', err.message);
}

console.log('\n   → chdir()로 작업 디렉토리 변경\n');

// ============================================
// 10. 종합 시스템 정보
// ============================================
setTimeout(() => {
  console.log('10. 종합 시스템 정보\n');

  const info = {
    'Node.js': process.version,
    '플랫폼': `${process.platform} (${process.arch})`,
    'PID': process.pid,
    '작업 디렉토리': process.cwd(),
    '실행 파일': process.execPath,
    '실행 시간': formatUptime(process.uptime()),
    '메모리 사용': formatBytes(process.memoryUsage().heapUsed),
    'CPU 시간': ((process.cpuUsage().user + process.cpuUsage().system) / 1000).toFixed(2) + ' ms'
  };

  console.log('   시스템 현황:');
  Object.entries(info).forEach(([key, value]) => {
    console.log(`   - ${key.padEnd(15)}: ${value}`);
  });

  console.log('\n');
}, 100);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('process 정보 조회 정리');
  console.log('='.repeat(60));
  console.log(`
✅ process.version - Node.js 버전
✅ process.platform - 운영체제
✅ process.arch - CPU 아키텍처
✅ process.pid - 프로세스 ID
✅ process.cwd() - 현재 작업 디렉토리
✅ process.memoryUsage() - 메모리 사용량
✅ process.uptime() - 실행 시간
✅ process.cpuUsage() - CPU 사용 시간

활용:
→ 모니터링 대시보드
→ 성능 프로파일링
→ 크로스 플랫폼 분기 처리
→ 로깅 및 디버깅

다음: 04-process-argv.js
커맨드라인 인자 처리를 배워봅시다!
  `);
}, 200);

/**
 * 핵심 정리:
 *
 * process 정보 조회:
 * - process.version: Node.js 버전
 * - process.platform: 'win32', 'darwin', 'linux'
 * - process.arch: 'x64', 'arm', 'arm64'
 * - process.pid: 프로세스 ID
 * - process.cwd(): 현재 작업 디렉토리
 * - process.memoryUsage(): 메모리 사용량
 * - process.uptime(): 실행 시간 (초)
 * - process.cpuUsage(): CPU 사용 시간
 */

/**
 * 실행:
 * node 03-process-info.js
 */
