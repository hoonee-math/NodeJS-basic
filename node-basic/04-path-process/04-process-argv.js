/**
 * 04-process-argv.js
 *
 * 커맨드라인 인자 처리
 * process.argv 활용법
 */

console.log('=== 커맨드라인 인자 (process.argv) ===\n');

// ============================================
// 1. process.argv 기본
// ============================================
console.log('1. process.argv 기본\n');

console.log('   전체 argv:');
process.argv.forEach((arg, index) => {
  console.log(`   [${index}] ${arg}`);
});

console.log('\n   구조:');
console.log('   - argv[0]: Node.js 실행 파일 경로');
console.log('   - argv[1]: 현재 스크립트 파일 경로');
console.log('   - argv[2~]: 실제 전달된 인자\n');

console.log('   실제 인자만 추출:');
const args = process.argv.slice(2);
console.log('   ', args);
console.log('\n   → slice(2)로 인자만 추출\n');

// ============================================
// 2. 인자 개수 확인
// ============================================
console.log('2. 인자 개수 확인\n');

const userArgs = process.argv.slice(2);

console.log(`   전달된 인자 개수: ${userArgs.length}`);

if (userArgs.length === 0) {
  console.log('   ⚠️  인자가 없습니다');
  console.log('   사용법: node 04-process-argv.js <arg1> <arg2>...\n');
} else {
  console.log('   ✅ 인자:');
  userArgs.forEach((arg, index) => {
    console.log(`      ${index + 1}. ${arg}`);
  });
  console.log();
}

console.log('   → 인자 검증으로 사용법 안내\n');

// ============================================
// 3. 플래그 파싱 (--key=value)
// ============================================
console.log('3. 플래그 파싱 (--key=value)\n');

function parseFlags(argv) {
  const flags = {};
  const positional = [];

  argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      // --key=value 형식
      const [key, value] = arg.slice(2).split('=');
      flags[key] = value || true;
    } else if (arg.startsWith('-')) {
      // -k 형식
      const key = arg.slice(1);
      flags[key] = true;
    } else {
      // 일반 인자
      positional.push(arg);
    }
  });

  return { flags, positional };
}

const parsed = parseFlags(process.argv);

console.log('   파싱 결과:');
console.log('   - 플래그:', parsed.flags);
console.log('   - 위치 인자:', parsed.positional);

console.log('\n   예시:');
console.log('   node script.js --port=3000 --debug file.txt');
console.log('   → flags: { port: "3000", debug: true }');
console.log('   → positional: ["file.txt"]\n');

// ============================================
// 4. 필수 인자 검증
// ============================================
console.log('4. 필수 인자 검증\n');

function requireArgs(count, message) {
  const args = process.argv.slice(2);
  if (args.length < count) {
    console.error(`   ❌ ${message}`);
    console.error(`   전달됨: ${args.length}개, 필요: ${count}개`);
    process.exit(1);  // 에러 코드와 함께 종료
  }
  return args;
}

// 예시: 최소 1개 인자 필요
try {
  const validArgs = requireArgs(0, '최소 0개의 인자가 필요합니다');
  console.log('   ✅ 인자 검증 통과');
} catch (err) {
  // 에러 발생 시 프로세스 종료됨
}

console.log('\n   → 필수 인자 없으면 process.exit(1)\n');

// ============================================
// 5. 숫자 인자 변환
// ============================================
console.log('5. 숫자 인자 변환\n');

const numberArgs = process.argv.slice(2).map(arg => {
  const num = Number(arg);
  return isNaN(num) ? arg : num;
});

console.log('   원본:', process.argv.slice(2));
console.log('   변환:', numberArgs);

console.log('\n   예시:');
console.log('   node script.js 10 20 hello 30.5');
console.log('   → [10, 20, "hello", 30.5]\n');

// ============================================
// 6. 옵션 파서 구현
// ============================================
console.log('6. 간단한 옵션 파서\n');

class ArgParser {
  constructor() {
    this.options = {};
    this.args = [];
    this.parse();
  }

  parse() {
    const argv = process.argv.slice(2);

    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i];

      if (arg.startsWith('--')) {
        // --key value 또는 --key=value
        if (arg.includes('=')) {
          const [key, value] = arg.slice(2).split('=');
          this.options[key] = value;
        } else {
          const key = arg.slice(2);
          const nextArg = argv[i + 1];

          if (nextArg && !nextArg.startsWith('-')) {
            this.options[key] = nextArg;
            i++;  // 다음 인자 건너뛰기
          } else {
            this.options[key] = true;
          }
        }
      } else if (arg.startsWith('-')) {
        // -abc 형식 (여러 플래그)
        const flags = arg.slice(1).split('');
        flags.forEach(flag => {
          this.options[flag] = true;
        });
      } else {
        this.args.push(arg);
      }
    }
  }

  get(key, defaultValue) {
    return this.options[key] !== undefined ? this.options[key] : defaultValue;
  }

  has(key) {
    return this.options[key] !== undefined;
  }
}

const parser = new ArgParser();
console.log('   옵션:', parser.options);
console.log('   인자:', parser.args);

console.log('\n   예시:');
console.log('   node script.js --port 3000 -vd file.txt');
console.log('   → options: { port: "3000", v: true, d: true }');
console.log('   → args: ["file.txt"]\n');

// ============================================
// 7. help 메시지
// ============================================
console.log('7. help 메시지 구현\n');

function showHelp() {
  console.log(`
사용법: node 04-process-argv.js [옵션] [파일...]

옵션:
  --port <번호>    포트 번호 지정 (기본값: 3000)
  --host <주소>    호스트 주소 (기본값: localhost)
  --debug          디버그 모드 활성화
  -v, --verbose    자세한 출력
  -h, --help       이 도움말 표시

예시:
  node 04-process-argv.js --port=8080 --debug
  node 04-process-argv.js file1.txt file2.txt
  node 04-process-argv.js -vh --port 9000
  `);
}

if (parser.has('h') || parser.has('help')) {
  showHelp();
  // process.exit(0); 실제로는 여기서 종료
}

console.log('   → --help 플래그로 사용법 안내\n');

// ============================================
// 8. 실전 예제: 계산기
// ============================================
console.log('8. 실전 예제: 계산기\n');

function calculator() {
  const args = process.argv.slice(2);

  if (args.length < 3) {
    console.log('   사용법: node script.js <숫자1> <연산자> <숫자2>');
    console.log('   예시: node script.js 10 + 5');
    return;
  }

  const [num1Str, operator, num2Str] = args;
  const num1 = parseFloat(num1Str);
  const num2 = parseFloat(num2Str);

  if (isNaN(num1) || isNaN(num2)) {
    console.log('   ❌ 숫자가 아닙니다');
    return;
  }

  let result;
  switch (operator) {
    case '+': result = num1 + num2; break;
    case '-': result = num1 - num2; break;
    case '*': result = num1 * num2; break;
    case '/': result = num1 / num2; break;
    default:
      console.log('   ❌ 지원하지 않는 연산자:', operator);
      return;
  }

  console.log(`   ${num1} ${operator} ${num2} = ${result}`);
}

calculator();
console.log('\n   → 실제 동작하는 CLI 프로그램\n');

// ============================================
// 9. 환경별 기본값
// ============================================
console.log('9. 환경별 기본값\n');

const config = {
  port: parser.get('port', process.env.PORT || 3000),
  host: parser.get('host', process.env.HOST || 'localhost'),
  debug: parser.has('debug') || process.env.DEBUG === 'true'
};

console.log('   설정:');
console.log('   - Port:', config.port);
console.log('   - Host:', config.host);
console.log('   - Debug:', config.debug);

console.log('\n   우선순위:');
console.log('   1. 커맨드라인 인자 (--port 3000)');
console.log('   2. 환경 변수 (PORT=3000)');
console.log('   3. 기본값 (3000)\n');

// ============================================
// 10. 인자 검증 및 타입 변환
// ============================================
setTimeout(() => {
  console.log('10. 인자 검증 및 타입 변환\n');

  function validatePort(value) {
    const port = parseInt(value, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      throw new Error(`잘못된 포트 번호: ${value}`);
    }
    return port;
  }

  function validateHost(value) {
    if (typeof value !== 'string' || value.length === 0) {
      throw new Error('호스트 주소가 비어있습니다');
    }
    return value;
  }

  try {
    const port = validatePort(parser.get('port', '3000'));
    const host = validateHost(parser.get('host', 'localhost'));

    console.log('   ✅ 검증 통과');
    console.log(`   서버: ${host}:${port}`);
  } catch (err) {
    console.log('   ❌', err.message);
  }

  console.log('\n   → 타입 검증으로 런타임 에러 방지\n');
}, 100);

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('커맨드라인 인자 처리 정리');
  console.log('='.repeat(60));
  console.log(`
✅ process.argv - 인자 배열
✅ slice(2) - 실제 인자만 추출
✅ 플래그 파싱 - --key=value, -k
✅ 필수 인자 검증 - process.exit(1)
✅ 타입 변환 - Number(), parseInt()
✅ help 메시지 - --help
✅ 기본값 - 환경 변수 또는 상수

실전 패턴:
→ 인자 파서 클래스 구현
→ 필수 인자 검증 + 종료
→ 우선순위: CLI > 환경변수 > 기본값
→ help 메시지로 사용법 안내

다음: 05-process-env.js
환경 변수 처리를 배워봅시다!
  `);
}, 200);

/**
 * 실행 예시:
 *
 * node 04-process-argv.js
 * node 04-process-argv.js arg1 arg2
 * node 04-process-argv.js --port=3000 --debug
 * node 04-process-argv.js 10 + 5
 * node 04-process-argv.js --help
 */
