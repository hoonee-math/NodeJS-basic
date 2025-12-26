/**
 * 06-process-stdin.js
 *
 * 표준 입력 (Standard Input)
 * process.stdin으로 사용자 입력 받기
 */

const readline = require('readline');

console.log('=== 표준 입력 (process.stdin) ===\n');

// ============================================
// 1. process.stdin 기본
// ============================================
console.log('1. process.stdin 기본\n');

console.log('   process.stdin은 읽기 가능한 스트림입니다');
console.log('   - isTTY:', process.stdin.isTTY);
console.log('   - readable:', process.stdin.readable);
console.log('\n   → stdin은 Readable Stream\n');

// ============================================
// 2. 간단한 입력 받기 (한 줄)
// ============================================
console.log('2. 간단한 입력 받기\n');

function simpleInput() {
  console.log('   이름을 입력하세요:');

  process.stdin.once('data', (chunk) => {
    const input = chunk.toString().trim();
    console.log(`   안녕하세요, ${input}님!\n`);

    // 다음 예제로 진행
    readlineExample();
  });
}

// ============================================
// 3. readline 모듈 사용
// ============================================
console.log('3. readline 모듈 (권장)\n');

function readlineExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('   readline은 줄 단위 입력에 최적화되어 있습니다\n');

  rl.question('   나이를 입력하세요: ', (answer) => {
    const age = parseInt(answer, 10);

    if (isNaN(age)) {
      console.log('   ❌ 숫자가 아닙니다\n');
    } else {
      console.log(`   ${age}세시군요!\n`);
    }

    rl.close();
    questionSeriesExample();
  });
}

// ============================================
// 4. 연속 질문
// ============================================
console.log('4. 연속 질문\n');

function questionSeriesExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const questions = [
    '   좋아하는 색깔은?',
    '   좋아하는 음식은?',
    '   취미는?'
  ];

  const answers = [];
  let index = 0;

  function askQuestion() {
    if (index < questions.length) {
      rl.question(questions[index] + ' ', (answer) => {
        answers.push(answer);
        index++;
        askQuestion();
      });
    } else {
      console.log('\n   입력하신 답변:');
      questions.forEach((q, i) => {
        console.log(`   ${q} → ${answers[i]}`);
      });
      console.log();

      rl.close();
      yesNoExample();
    }
  }

  askQuestion();
}

// ============================================
// 5. Yes/No 질문
// ============================================
console.log('5. Yes/No 질문\n');

function yesNoExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askYesNo(question, callback) {
    rl.question(question + ' (y/n): ', (answer) => {
      const normalized = answer.toLowerCase().trim();

      if (normalized === 'y' || normalized === 'yes') {
        callback(true);
      } else if (normalized === 'n' || normalized === 'no') {
        callback(false);
      } else {
        console.log('   ⚠️  y 또는 n을 입력하세요');
        askYesNo(question, callback);  // 재귀 호출
      }
    });
  }

  askYesNo('   계속하시겠습니까?', (answer) => {
    if (answer) {
      console.log('   ✅ 계속합니다\n');
    } else {
      console.log('   ❌ 취소되었습니다\n');
    }

    rl.close();
    menuExample();
  });
}

// ============================================
// 6. 메뉴 선택
// ============================================
console.log('6. 메뉴 선택\n');

function menuExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function showMenu() {
    console.log('   메뉴를 선택하세요:');
    console.log('   1. 파일 읽기');
    console.log('   2. 파일 쓰기');
    console.log('   3. 파일 삭제');
    console.log('   0. 종료');
    console.log();

    rl.question('   선택: ', (choice) => {
      switch (choice) {
        case '1':
          console.log('   → 파일 읽기 실행\n');
          rl.close();
          passwordExample();
          break;
        case '2':
          console.log('   → 파일 쓰기 실행\n');
          rl.close();
          passwordExample();
          break;
        case '3':
          console.log('   → 파일 삭제 실행\n');
          rl.close();
          passwordExample();
          break;
        case '0':
          console.log('   → 종료합니다\n');
          rl.close();
          passwordExample();
          break;
        default:
          console.log('   ❌ 잘못된 선택입니다\n');
          showMenu();  // 다시 메뉴 표시
      }
    });
  }

  showMenu();
}

// ============================================
// 7. 비밀번호 입력 (숨김)
// ============================================
console.log('7. 비밀번호 입력\n');

function passwordExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // 주의: 실제로는 muted가 표준 기능이 아님
  // 실무에서는 'read' 패키지 사용 권장

  console.log('   비밀번호 입력:');
  console.log('   (실제 입력은 보이지만, 실무에서는 read 패키지 사용)\n');

  rl.question('   Password: ', (password) => {
    console.log('   입력된 비밀번호 길이:', password.length);
    console.log('   ⚠️  실제 프로덕션에서는 npm의 read 패키지 사용\n');

    rl.close();
    validationExample();
  });
}

// ============================================
// 8. 입력 검증
// ============================================
console.log('8. 입력 검증\n');

function validationExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function askEmail() {
    rl.question('   이메일을 입력하세요: ', (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (emailRegex.test(email)) {
        console.log('   ✅ 유효한 이메일:', email);
        console.log();
        rl.close();
        lineByLineExample();
      } else {
        console.log('   ❌ 유효하지 않은 이메일입니다');
        askEmail();  // 다시 입력 받기
      }
    });
  }

  askEmail();
}

// ============================================
// 9. 줄 단위 처리
// ============================================
console.log('9. 줄 단위 처리\n');

function lineByLineExample() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '   입력> '
  });

  console.log('   여러 줄 입력 (exit 입력 시 종료)\n');

  const lines = [];
  rl.prompt();

  rl.on('line', (line) => {
    if (line.trim() === 'exit') {
      console.log('\n   입력된 줄들:');
      lines.forEach((l, i) => {
        console.log(`   ${i + 1}. ${l}`);
      });
      console.log();

      rl.close();
      pipeExample();
    } else {
      lines.push(line);
      rl.prompt();
    }
  });
}

// ============================================
// 10. 파이프 입력 처리
// ============================================
console.log('10. 파이프 입력 처리\n');

function pipeExample() {
  console.log('   파이프로 데이터를 받을 수 있습니다:');
  console.log('   echo "Hello" | node 06-process-stdin.js');
  console.log();

  // TTY가 아니면 파이프 입력
  if (!process.stdin.isTTY) {
    console.log('   파이프 모드 감지됨!\n');

    let data = '';
    process.stdin.on('data', (chunk) => {
      data += chunk.toString();
    });

    process.stdin.on('end', () => {
      console.log('   받은 데이터:', data);
      finish();
    });
  } else {
    console.log('   (현재는 TTY 모드)\n');
    finish();
  }
}

// ============================================
// 마무리
// ============================================
function finish() {
  setTimeout(() => {
    console.log('='.repeat(60));
    console.log('표준 입력 처리 정리');
    console.log('='.repeat(60));
    console.log(`
✅ process.stdin - 표준 입력 스트림
✅ readline - 줄 단위 입력 (권장)
✅ rl.question() - 단일 질문
✅ rl.on('line') - 연속 입력
✅ 입력 검증 - 정규식, 타입 체크
✅ Yes/No - 재귀로 재입력 요청
✅ 파이프 - isTTY 체크

실전 패턴:
→ readline.createInterface() 사용
→ 입력 검증 + 재입력 요청
→ 메뉴 시스템 구현
→ 파이프 입력 처리

외부 패키지:
→ inquirer - 인터랙티브 CLI
→ prompts - 가벼운 프롬프트
→ read - 비밀번호 입력

다음: 07-process-events.js
프로세스 이벤트와 신호 처리를 배워봅시다!
    `);

    // 예제 시작
    console.log('\n간단한 대화형 예제를 시작합니다...\n');
    setTimeout(() => {
      simpleInput();
    }, 500);
  }, 100);
}

// 초기 실행
finish();

/**
 * 실행 예시:
 *
 * # 기본 실행
 * node 06-process-stdin.js
 *
 * # 파이프 입력
 * echo "John" | node 06-process-stdin.js
 *
 * # 파일에서 입력
 * cat input.txt | node 06-process-stdin.js
 *
 * # 리다이렉션
 * node 06-process-stdin.js < input.txt
 */
