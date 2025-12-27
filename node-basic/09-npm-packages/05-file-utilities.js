/**
 * 05-file-utilities.js
 *
 * 파일 처리 유틸리티 패키지
 *
 * 설치 필요:
 * npm install fs-extra glob chokidar
 */

console.log('=== 파일 처리 유틸리티 ===\n');

const fs = require('fs');
const path = require('path');

// 패키지 가용성 확인
function checkPackage(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (err) {
    return false;
  }
}

// 테스트 디렉토리 생성
const testDir = path.join(__dirname, 'test-files');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir);
}

// 1. fs-extra - 향상된 파일 시스템
console.log('1. fs-extra - 향상된 파일 시스템\n');

if (checkPackage('fs-extra')) {
  const fse = require('fs-extra');

  // 디렉토리 보장 (존재하지 않으면 생성)
  const dir = path.join(testDir, 'nested/deep/path');
  fse.ensureDirSync(dir);
  console.log(`→ 디렉토리 생성: ${dir}`);

  // JSON 파일 읽기/쓰기
  const jsonPath = path.join(testDir, 'data.json');
  const data = {
    name: 'fs-extra test',
    timestamp: new Date().toISOString(),
    numbers: [1, 2, 3, 4, 5]
  };

  fse.writeJsonSync(jsonPath, data, { spaces: 2 });
  console.log('→ JSON 파일 작성 완료');

  const readData = fse.readJsonSync(jsonPath);
  console.log(`   읽기: ${readData.name}`);

  // 파일 복사
  const srcFile = path.join(testDir, 'source.txt');
  const destFile = path.join(testDir, 'destination.txt');

  fse.writeFileSync(srcFile, 'Hello fs-extra!');
  fse.copySync(srcFile, destFile);
  console.log(`→ 파일 복사: ${srcFile} → ${destFile}`);

  // 디렉토리 복사
  const srcDir = path.join(testDir, 'source-dir');
  const destDir = path.join(testDir, 'dest-dir');

  fse.ensureDirSync(srcDir);
  fse.writeFileSync(path.join(srcDir, 'file1.txt'), 'File 1');
  fse.writeFileSync(path.join(srcDir, 'file2.txt'), 'File 2');

  fse.copySync(srcDir, destDir);
  console.log(`→ 디렉토리 복사: ${srcDir} → ${destDir}`);

  // 파일 이동
  const moveFrom = path.join(testDir, 'move-from.txt');
  const moveTo = path.join(testDir, 'move-to.txt');

  fse.writeFileSync(moveFrom, 'Move me!');
  fse.moveSync(moveFrom, moveTo, { overwrite: true });
  console.log(`→ 파일 이동: ${moveFrom} → ${moveTo}`);

  // 디렉토리 비우기
  const emptyDir = path.join(testDir, 'empty-me');
  fse.ensureDirSync(emptyDir);
  fse.writeFileSync(path.join(emptyDir, 'temp.txt'), 'temp');
  fse.emptyDirSync(emptyDir);
  console.log(`→ 디렉토리 비우기: ${emptyDir}`);

  console.log();
} else {
  console.log('→ fs-extra가 설치되지 않았습니다');
  console.log('   설치: npm install fs-extra\n');
}

// 2. glob - 파일 패턴 매칭
setTimeout(() => {
  console.log('2. glob - 파일 패턴 매칭\n');

  if (checkPackage('glob')) {
    const glob = require('glob');

    // 테스트 파일 생성
    const patterns = ['file1.js', 'file2.js', 'test.txt', 'data.json'];
    patterns.forEach((file) => {
      fs.writeFileSync(path.join(testDir, file), `Content of ${file}`);
    });

    // 하위 디렉토리에도 파일 생성
    const subDir = path.join(testDir, 'subdir');
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir);
    }
    fs.writeFileSync(path.join(subDir, 'nested.js'), 'Nested file');

    console.log('→ 패턴 매칭 테스트:');

    // 모든 JS 파일
    const jsFiles = glob.sync(path.join(testDir, '*.js'));
    console.log(`   *.js (${jsFiles.length}개):`);
    jsFiles.forEach((file) => {
      console.log(`   - ${path.basename(file)}`);
    });

    // 모든 파일 (재귀적)
    const allFiles = glob.sync(path.join(testDir, '**/*'), { nodir: true });
    console.log(`\n   **/* (모든 파일, ${allFiles.length}개):`);
    allFiles.slice(0, 5).forEach((file) => {
      console.log(`   - ${path.relative(testDir, file)}`);
    });

    // JSON과 TXT 파일만
    const dataFiles = glob.sync(path.join(testDir, '*.{json,txt}'));
    console.log(`\n   *.{json,txt} (${dataFiles.length}개):`);
    dataFiles.forEach((file) => {
      console.log(`   - ${path.basename(file)}`);
    });

    console.log();
  } else {
    console.log('→ glob이 설치되지 않았습니다');
    console.log('   설치: npm install glob\n');
  }
}, 100);

// 3. chokidar - 파일 감시
setTimeout(() => {
  console.log('3. chokidar - 파일 감시 (File Watcher)\n');

  if (checkPackage('chokidar')) {
    const chokidar = require('chokidar');

    const watchDir = path.join(testDir, 'watch');

    if (!fs.existsSync(watchDir)) {
      fs.mkdirSync(watchDir);
    }

    console.log(`→ 파일 감시 시작: ${watchDir}`);
    console.log('   (5초 동안 변경사항 모니터링)\n');

    const watcher = chokidar.watch(watchDir, {
      persistent: true,
      ignoreInitial: true
    });

    watcher
      .on('add', (filePath) => {
        console.log(`   [추가] ${path.basename(filePath)}`);
      })
      .on('change', (filePath) => {
        console.log(`   [변경] ${path.basename(filePath)}`);
      })
      .on('unlink', (filePath) => {
        console.log(`   [삭제] ${path.basename(filePath)}`);
      });

    // 테스트를 위한 파일 변경
    setTimeout(() => {
      console.log('\n→ 테스트 파일 작업 시작:');

      const testFile = path.join(watchDir, 'test.txt');

      // 파일 생성
      fs.writeFileSync(testFile, 'Initial content');

      // 파일 수정
      setTimeout(() => {
        fs.appendFileSync(testFile, '\nModified content');
      }, 500);

      // 파일 삭제
      setTimeout(() => {
        fs.unlinkSync(testFile);
      }, 1000);

      // 감시 종료
      setTimeout(() => {
        watcher.close();
        console.log('\n→ 파일 감시 종료\n');
      }, 1500);
    }, 100);
  } else {
    console.log('→ chokidar가 설치되지 않았습니다');
    console.log('   설치: npm install chokidar\n');
  }
}, 200);

// 4. 패키지 비교
setTimeout(() => {
  console.log('4. 패키지 비교\n');

  const comparison = [
    {
      package: 'fs (내장)',
      pros: [
        '추가 설치 불필요',
        '기본 파일 작업 충분',
        '가볍고 빠름'
      ],
      cons: [
        '콜백 기반 (복잡)',
        '에러 처리 번거로움',
        '고급 기능 부족'
      ]
    },
    {
      package: 'fs-extra',
      pros: [
        'Promise 지원',
        'JSON 읽기/쓰기 간편',
        '디렉토리 재귀 작업',
        '복사/이동 쉬움'
      ],
      cons: [
        '외부 의존성',
        'fs보다 약간 무거움'
      ]
    },
    {
      package: 'glob',
      pros: [
        '강력한 패턴 매칭',
        '재귀 검색',
        '크로스 플랫폼'
      ],
      cons: [
        '단일 목적 (파일 검색만)',
        '대량 파일 시 느릴 수 있음'
      ]
    },
    {
      package: 'chokidar',
      pros: [
        '안정적인 파일 감시',
        '크로스 플랫폼',
        '풍부한 이벤트',
        'fs.watch보다 안정적'
      ],
      cons: [
        '감시 중 리소스 사용',
        '설정이 다소 복잡'
      ]
    }
  ];

  comparison.forEach(({ package: pkg, pros, cons }) => {
    console.log(`→ ${pkg}:`);
    console.log('   장점:');
    pros.forEach((pro) => console.log(`   + ${pro}`));
    console.log('   단점:');
    cons.forEach((con) => console.log(`   - ${con}`));
    console.log();
  });
}, 2000);

// 5. 실전 활용 예시
setTimeout(() => {
  console.log('5. 실전 활용 예시\n');

  const examples = [
    {
      scenario: '프로젝트 빌드',
      packages: ['fs-extra', 'glob'],
      description: '소스 파일 복사, dist 폴더 정리, 빌드 결과물 생성'
    },
    {
      scenario: '파일 업로드',
      packages: ['fs-extra'],
      description: '임시 디렉토리 생성, 파일 이동, 메타데이터 저장'
    },
    {
      scenario: '개발 서버',
      packages: ['chokidar', 'nodemon'],
      description: '파일 변경 감지, 자동 재시작, 핫 리로드'
    },
    {
      scenario: '로그 관리',
      packages: ['fs-extra', 'glob'],
      description: '로그 파일 순환, 오래된 파일 삭제, 압축'
    },
    {
      scenario: 'CLI 도구',
      packages: ['glob', 'fs-extra'],
      description: '파일 검색, 일괄 처리, 결과 저장'
    }
  ];

  examples.forEach(({ scenario, packages, description }) => {
    console.log(`→ ${scenario}:`);
    console.log(`   패키지: ${packages.join(', ')}`);
    console.log(`   설명: ${description}`);
    console.log();
  });
}, 2500);

// 정리
setTimeout(() => {
  console.log('6. 테스트 파일 정리\n');

  if (checkPackage('fs-extra')) {
    const fse = require('fs-extra');

    if (fs.existsSync(testDir)) {
      fse.removeSync(testDir);
      console.log(`→ 테스트 디렉토리 삭제: ${testDir}`);
    }
  } else {
    // fs-extra가 없으면 기본 fs 사용
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
      console.log(`→ 테스트 디렉토리 삭제: ${testDir}`);
    }
  }
}, 3000);

/**
 * 실행:
 * npm install fs-extra glob chokidar
 * node 05-file-utilities.js
 *
 * 핵심 패키지:
 *
 * 1. fs-extra:
 * - fs 모듈의 확장판
 * - Promise 지원 (async/await)
 * - 편리한 헬퍼 함수
 *
 * 주요 메서드:
 * - ensureDir(path) - 디렉토리 보장
 * - copy(src, dest) - 파일/디렉토리 복사
 * - move(src, dest) - 이동
 * - remove(path) - 삭제
 * - emptyDir(path) - 비우기
 * - readJson/writeJson - JSON 파일
 * - pathExists(path) - 존재 확인
 *
 * 2. glob:
 * - Unix 스타일 패턴 매칭
 * - 파일 검색
 *
 * 패턴:
 * - * : 파일명 (슬래시 제외)
 * - ** : 모든 경로 (재귀)
 * - ? : 단일 문자
 * - {a,b} : a 또는 b
 * - [abc] : a, b, c 중 하나
 * - *.{js,ts} : JS 또는 TS 파일
 *
 * 옵션:
 * - nodir: 디렉토리 제외
 * - ignore: 무시할 패턴
 * - dot: 숨김 파일 포함
 *
 * 3. chokidar:
 * - 크로스 플랫폼 파일 감시
 * - fs.watch보다 안정적
 *
 * 이벤트:
 * - add: 파일 추가
 * - change: 파일 변경
 * - unlink: 파일 삭제
 * - addDir: 디렉토리 추가
 * - unlinkDir: 디렉토리 삭제
 *
 * 옵션:
 * - persistent: 프로세스 유지
 * - ignoreInitial: 초기 파일 무시
 * - ignored: 무시할 파일/폴더
 *
 * Best Practices:
 * - fs-extra로 기본 작업 간소화
 * - glob으로 파일 검색
 * - chokidar로 개발 환경 자동화
 * - 큰 파일은 스트림 사용
 * - 에러 처리 필수
 *
 * 활용:
 * - 빌드 도구
 * - 파일 업로드 처리
 * - 개발 서버 (핫 리로드)
 * - 로그 관리
 * - CLI 도구
 * - 파일 동기화
 */
