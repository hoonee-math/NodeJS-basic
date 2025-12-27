#!/usr/bin/env node

/**
 * 07-real-world-example.js
 *
 * 실전 예제: CLI 도구 (파일 정리 유틸리티)
 *
 * 설치 필요:
 * npm install commander inquirer ora chalk
 */

// 패키지 가용성 확인
function checkPackages() {
  const required = ['commander', 'inquirer', 'ora', 'chalk'];
  const missing = [];

  required.forEach((pkg) => {
    try {
      require.resolve(pkg);
    } catch (err) {
      missing.push(pkg);
    }
  });

  if (missing.length > 0) {
    console.log('필요한 패키지가 설치되지 않았습니다:');
    console.log(`  npm install ${missing.join(' ')}`);
    process.exit(1);
  }
}

checkPackages();

const { program } = require('commander');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

// 1. CLI 프로그램 설정 (commander)
program
  .name('file-organizer')
  .description('파일 정리 유틸리티 - 파일을 확장자별로 정리합니다')
  .version('1.0.0');

// 2. organize 명령어
program
  .command('organize')
  .description('디렉토리의 파일을 확장자별로 정리')
  .option('-d, --dir <directory>', '정리할 디렉토리', '.')
  .option('-y, --yes', '확인 없이 실행', false)
  .action(async (options) => {
    await organizeFiles(options);
  });

// 3. stats 명령어
program
  .command('stats')
  .description('디렉토리의 파일 통계')
  .option('-d, --dir <directory>', '분석할 디렉토리', '.')
  .action(async (options) => {
    await showStats(options);
  });

// 4. clean 명령어
program
  .command('clean')
  .description('빈 디렉토리 삭제')
  .option('-d, --dir <directory>', '정리할 디렉토리', '.')
  .action(async (options) => {
    await cleanEmptyDirs(options);
  });

// 5. 파일 정리 함수
async function organizeFiles(options) {
  const targetDir = path.resolve(options.dir);

  console.log(chalk.blue.bold('\n=== 파일 정리 유틸리티 ===\n'));
  console.log(`대상 디렉토리: ${chalk.cyan(targetDir)}\n`);

  // 디렉토리 존재 확인
  if (!fs.existsSync(targetDir)) {
    console.log(chalk.red('디렉토리가 존재하지 않습니다.'));
    return;
  }

  // 파일 목록 가져오기
  const files = fs.readdirSync(targetDir).filter((file) => {
    const filePath = path.join(targetDir, file);
    return fs.statSync(filePath).isFile();
  });

  if (files.length === 0) {
    console.log(chalk.yellow('정리할 파일이 없습니다.'));
    return;
  }

  // 확장자별 그룹화
  const filesByExt = {};
  files.forEach((file) => {
    const ext = path.extname(file).toLowerCase() || '.no-extension';
    if (!filesByExt[ext]) {
      filesByExt[ext] = [];
    }
    filesByExt[ext].push(file);
  });

  // 정리 계획 표시
  console.log(chalk.green('정리 계획:\n'));
  Object.entries(filesByExt).forEach(([ext, fileList]) => {
    console.log(chalk.cyan(`${ext} (${fileList.length}개):`));
    fileList.slice(0, 3).forEach((file) => {
      console.log(`  - ${file}`);
    });
    if (fileList.length > 3) {
      console.log(`  ... 외 ${fileList.length - 3}개`);
    }
    console.log();
  });

  // 확인 (--yes 옵션이 없으면)
  if (!options.yes) {
    const answers = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: '파일을 정리하시겠습니까?',
        default: false
      }
    ]);

    if (!answers.proceed) {
      console.log(chalk.yellow('작업이 취소되었습니다.'));
      return;
    }
  }

  // 정리 시작
  const spinner = ora('파일 정리 중...').start();

  let movedCount = 0;

  try {
    for (const [ext, fileList] of Object.entries(filesByExt)) {
      const folderName = ext.replace('.', '') || 'no-extension';
      const folderPath = path.join(targetDir, folderName);

      // 폴더 생성
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }

      // 파일 이동
      for (const file of fileList) {
        const srcPath = path.join(targetDir, file);
        const destPath = path.join(folderPath, file);

        fs.renameSync(srcPath, destPath);
        movedCount++;
      }
    }

    spinner.succeed(chalk.green(`파일 정리 완료! (${movedCount}개 파일 이동)`));
  } catch (err) {
    spinner.fail(chalk.red(`에러 발생: ${err.message}`));
  }

  console.log();
}

// 6. 통계 함수
async function showStats(options) {
  const targetDir = path.resolve(options.dir);

  console.log(chalk.blue.bold('\n=== 파일 통계 ===\n'));

  if (!fs.existsSync(targetDir)) {
    console.log(chalk.red('디렉토리가 존재하지 않습니다.'));
    return;
  }

  const spinner = ora('분석 중...').start();

  try {
    const stats = analyzeDirectory(targetDir);

    spinner.succeed('분석 완료');

    console.log();
    console.log(chalk.cyan('디렉토리:'), targetDir);
    console.log(chalk.cyan('총 파일:'), stats.totalFiles);
    console.log(chalk.cyan('총 디렉토리:'), stats.totalDirs);
    console.log(chalk.cyan('총 크기:'), formatBytes(stats.totalSize));

    if (stats.filesByExt.size > 0) {
      console.log(chalk.green('\n확장자별 파일:\n'));

      const sorted = Array.from(stats.filesByExt.entries())
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 10);

      sorted.forEach(([ext, data]) => {
        console.log(
          `${chalk.cyan(ext.padEnd(15))} ${data.count.toString().padStart(4)}개  ${formatBytes(
            data.size
          )}`
        );
      });
    }

    console.log();
  } catch (err) {
    spinner.fail(chalk.red(`에러: ${err.message}`));
  }
}

// 7. 빈 디렉토리 정리
async function cleanEmptyDirs(options) {
  const targetDir = path.resolve(options.dir);

  console.log(chalk.blue.bold('\n=== 빈 디렉토리 정리 ===\n'));

  if (!fs.existsSync(targetDir)) {
    console.log(chalk.red('디렉토리가 존재하지 않습니다.'));
    return;
  }

  const emptyDirs = findEmptyDirs(targetDir);

  if (emptyDirs.length === 0) {
    console.log(chalk.green('빈 디렉토리가 없습니다.'));
    return;
  }

  console.log(chalk.yellow(`발견된 빈 디렉토리 (${emptyDirs.length}개):\n`));
  emptyDirs.forEach((dir) => {
    console.log(`  - ${path.relative(targetDir, dir)}`);
  });

  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'delete',
      message: '빈 디렉토리를 삭제하시겠습니까?',
      default: false
    }
  ]);

  if (answers.delete) {
    const spinner = ora('삭제 중...').start();

    emptyDirs.forEach((dir) => {
      fs.rmdirSync(dir);
    });

    spinner.succeed(chalk.green(`${emptyDirs.length}개 디렉토리 삭제 완료`));
  } else {
    console.log(chalk.yellow('작업이 취소되었습니다.'));
  }

  console.log();
}

// 8. 헬퍼 함수
function analyzeDirectory(dir) {
  const stats = {
    totalFiles: 0,
    totalDirs: 0,
    totalSize: 0,
    filesByExt: new Map()
  };

  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);

    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        stats.totalDirs++;
        walk(fullPath);
      } else {
        stats.totalFiles++;
        stats.totalSize += stat.size;

        const ext = path.extname(item).toLowerCase() || '.no-extension';
        if (!stats.filesByExt.has(ext)) {
          stats.filesByExt.set(ext, { count: 0, size: 0 });
        }

        const extData = stats.filesByExt.get(ext);
        extData.count++;
        extData.size += stat.size;
      }
    });
  }

  walk(dir);
  return stats;
}

function findEmptyDirs(dir) {
  const emptyDirs = [];

  function walk(currentDir) {
    const items = fs.readdirSync(currentDir);

    if (items.length === 0) {
      emptyDirs.push(currentDir);
      return;
    }

    items.forEach((item) => {
      const fullPath = path.join(currentDir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      }
    });

    // 재확인 (하위 디렉토리가 삭제되어 비었을 수 있음)
    if (fs.readdirSync(currentDir).length === 0) {
      emptyDirs.push(currentDir);
    }
  }

  const items = fs.readdirSync(dir);
  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    }
  });

  return emptyDirs;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 9. CLI 실행
program.parse(process.argv);

// 명령어 없이 실행 시 도움말 표시
if (!process.argv.slice(2).length) {
  program.outputHelp();
}

/**
 * 사용법:
 *
 * 설치:
 * npm install commander inquirer ora chalk
 *
 * 실행:
 * node 07-real-world-example.js organize
 * node 07-real-world-example.js organize -d ./test
 * node 07-real-world-example.js organize -y
 * node 07-real-world-example.js stats
 * node 07-real-world-example.js clean
 *
 * 전역 설치 (선택):
 * chmod +x 07-real-world-example.js
 * npm link
 * file-organizer organize
 *
 * 핵심 패키지:
 *
 * 1. commander:
 * - CLI 프레임워크
 * - 명령어, 옵션, 인자 파싱
 * - 자동 도움말 생성
 * - 서브커맨드 지원
 *
 * 주요 메서드:
 * - program.name() - 프로그램 이름
 * - program.version() - 버전
 * - program.description() - 설명
 * - program.command() - 명령어 추가
 * - .option() - 옵션 추가
 * - .action() - 실행 함수
 *
 * 2. inquirer:
 * - 대화형 프롬프트
 * - 사용자 입력 수집
 * - 검증 지원
 *
 * 프롬프트 타입:
 * - input - 텍스트 입력
 * - confirm - yes/no
 * - list - 선택 목록
 * - checkbox - 다중 선택
 * - password - 비밀번호
 *
 * 3. ora:
 * - 로딩 스피너
 * - 진행 상태 표시
 * - 성공/실패 아이콘
 *
 * 메서드:
 * - ora(text).start() - 시작
 * - spinner.succeed() - 성공
 * - spinner.fail() - 실패
 * - spinner.warn() - 경고
 *
 * 4. chalk:
 * - 터미널 색상
 * - 스타일링
 * - 가독성 향상
 *
 * CLI 도구 패턴:
 * - commander로 명령어 구조
 * - inquirer로 사용자 확인
 * - ora로 진행 상태
 * - chalk로 색상 출력
 *
 * Best Practices:
 * - 명확한 명령어 이름
 * - 도움말 제공
 * - 확인 프롬프트 (위험한 작업)
 * - 진행 상태 표시
 * - 에러 처리
 * - 색상으로 가독성 향상
 *
 * 활용:
 * - 파일 관리 도구
 * - 빌드 도구
 * - 데이터 처리 도구
 * - 배포 스크립트
 * - 개발 유틸리티
 */
