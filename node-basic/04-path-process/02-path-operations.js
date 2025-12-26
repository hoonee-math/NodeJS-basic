/**
 * 02-path-operations.js
 *
 * path 모듈 고급 활용
 * 실전 예제와 패턴
 */

const path = require('path');
const fs = require('fs');

console.log('=== path 모듈 고급 활용 ===\n');

// ============================================
// 1. path.relative() - 상대 경로 계산
// ============================================
console.log('1. path.relative() - 상대 경로 계산\n');

const from1 = '/data/projects/app';
const to1 = '/data/projects/app/src/index.js';
const relative1 = path.relative(from1, to1);

console.log('   From:', from1);
console.log('   To:', to1);
console.log('   Relative:', relative1);
console.log();

const from2 = '/data/projects/app/src';
const to2 = '/data/projects/lib/utils.js';
const relative2 = path.relative(from2, to2);

console.log('   From:', from2);
console.log('   To:', to2);
console.log('   Relative:', relative2);
console.log('\n   → 한 경로에서 다른 경로로 가는 상대 경로 계산\n');

// ============================================
// 2. __dirname과 path.join 조합
// ============================================
console.log('2. __dirname과 path 조합\n');

// 현재 파일의 디렉토리
console.log('   __dirname:', __dirname);

// 현재 디렉토리의 파일들
const configPath = path.join(__dirname, 'config.json');
const dataPath = path.join(__dirname, '..', 'data', 'users.json');
const rootPath = path.join(__dirname, '..', '..');

console.log('   config.json 경로:', configPath);
console.log('   상위 폴더 data:', dataPath);
console.log('   루트 경로:', rootPath);
console.log('\n   → __dirname으로 현재 파일 기준 경로 생성\n');

// ============================================
// 3. 확장자 변경
// ============================================
console.log('3. 확장자 변경\n');

function changeExtension(filePath, newExt) {
  const parsed = path.parse(filePath);
  return path.format({
    dir: parsed.dir,
    name: parsed.name,
    ext: newExt.startsWith('.') ? newExt : '.' + newExt
  });
}

const original = '/documents/report.docx';
console.log('   원본:', original);
console.log('   PDF로:', changeExtension(original, '.pdf'));
console.log('   TXT로:', changeExtension(original, 'txt'));
console.log('\n   → parse + format으로 확장자 변경\n');

// ============================================
// 4. 파일명에 접미사 추가
// ============================================
console.log('4. 파일명에 접미사 추가\n');

function addSuffix(filePath, suffix) {
  const parsed = path.parse(filePath);
  return path.format({
    dir: parsed.dir,
    name: parsed.name + suffix,
    ext: parsed.ext
  });
}

const file = '/images/photo.jpg';
console.log('   원본:', file);
console.log('   썸네일:', addSuffix(file, '-thumbnail'));
console.log('   백업:', addSuffix(file, '.backup'));
console.log('   날짜:', addSuffix(file, '-2024-01-15'));
console.log('\n   → 파일명과 확장자 사이에 접미사 삽입\n');

// ============================================
// 5. 다중 확장자 처리
// ============================================
console.log('5. 다중 확장자 처리\n');

function getAllExtensions(filePath) {
  const basename = path.basename(filePath);
  const parts = basename.split('.');

  if (parts.length <= 1) return [];

  return parts.slice(1).map((ext, index) =>
    '.' + parts.slice(1, index + 2).join('.')
  );
}

const files = [
  'archive.tar.gz',
  'file.min.js',
  'data.backup.json',
  'simple.txt'
];

files.forEach(file => {
  const exts = getAllExtensions(file);
  console.log(`   ${file.padEnd(25)} → [${exts.join(', ')}]`);
});

console.log('\n   → extname은 마지막 확장자만 추출\n');

// ============================================
// 6. 안전한 경로 결합 (경로 이탈 방지)
// ============================================
console.log('6. 안전한 경로 결합 (보안)\n');

function safeJoin(base, userPath) {
  const joined = path.join(base, userPath);
  const normalized = path.normalize(joined);

  // 기본 경로 밖으로 벗어나는지 확인
  if (!normalized.startsWith(base)) {
    throw new Error('경로 이탈 시도 감지!');
  }

  return normalized;
}

const baseDir = '/app/public';

try {
  console.log('   ✅ 안전:', safeJoin(baseDir, 'images/photo.jpg'));
  console.log('   ✅ 안전:', safeJoin(baseDir, './css/style.css'));
  console.log('   ❌ 위험:', safeJoin(baseDir, '../../etc/passwd'));
} catch (err) {
  console.log('   ❌ 차단:', err.message);
}

console.log('\n   → 사용자 입력 경로는 검증 필수\n');

// ============================================
// 7. 디렉토리 깊이 계산
// ============================================
console.log('7. 디렉토리 깊이 계산\n');

function getDepth(filePath) {
  const normalized = path.normalize(filePath);
  const parts = normalized.split(path.sep).filter(Boolean);
  return parts.length;
}

const paths = [
  '/root',
  '/root/folder',
  '/root/folder/subfolder/file.txt',
  'C:\\Users\\Documents\\Projects\\app\\src\\index.js'
];

paths.forEach(p => {
  console.log(`   깊이 ${getDepth(p)}: ${p}`);
});

console.log('\n   → 경로를 구분자로 나눠 깊이 계산\n');

// ============================================
// 8. 공통 부모 경로 찾기
// ============================================
console.log('8. 공통 부모 경로 찾기\n');

function findCommonPath(...paths) {
  if (paths.length === 0) return '';

  const normalized = paths.map(p => path.normalize(p));
  const parts = normalized.map(p => p.split(path.sep));

  let common = [];
  for (let i = 0; i < parts[0].length; i++) {
    const part = parts[0][i];
    if (parts.every(p => p[i] === part)) {
      common.push(part);
    } else {
      break;
    }
  }

  return common.join(path.sep);
}

const projectPaths = [
  '/projects/myapp/src/components/Header.js',
  '/projects/myapp/src/utils/format.js',
  '/projects/myapp/tests/unit/test.js'
];

console.log('   경로들:');
projectPaths.forEach(p => console.log('   -', p));
console.log('\n   공통 부모:', findCommonPath(...projectPaths));
console.log('\n   → 여러 경로의 공통 조상 찾기\n');

// ============================================
// 9. 파일 타입별 분류
// ============================================
console.log('9. 파일 타입별 분류\n');

const fileList = [
  'document.pdf',
  'image.png',
  'script.js',
  'style.css',
  'data.json',
  'photo.jpg',
  'README.md',
  'app.ts'
];

const grouped = fileList.reduce((acc, file) => {
  const ext = path.extname(file).slice(1) || 'no-extension';
  if (!acc[ext]) acc[ext] = [];
  acc[ext].push(file);
  return acc;
}, {});

Object.entries(grouped).forEach(([ext, files]) => {
  console.log(`   .${ext}: ${files.join(', ')}`);
});

console.log('\n   → extname으로 파일 그룹핑\n');

// ============================================
// 10. 파일 경로 검증
// ============================================
console.log('10. 파일 경로 검증\n');

function validatePath(filePath) {
  const issues = [];

  // 빈 경로
  if (!filePath || filePath.trim() === '') {
    issues.push('경로가 비어있음');
  }

  // 절대 경로 확인
  if (!path.isAbsolute(filePath)) {
    issues.push('상대 경로임 (절대 경로 권장)');
  }

  // 확장자 확인
  if (!path.extname(filePath)) {
    issues.push('확장자 없음');
  }

  // 경로 정규화 확인
  const normalized = path.normalize(filePath);
  if (filePath !== normalized) {
    issues.push('정규화 필요 (' + normalized + ')');
  }

  return {
    valid: issues.length === 0,
    issues: issues
  };
}

const testPaths = [
  '/home/user/file.txt',
  'relative/path.js',
  '/messy//path/../file.pdf',
  ''
];

testPaths.forEach(p => {
  const result = validatePath(p);
  const status = result.valid ? '✅' : '⚠️';
  console.log(`   ${status} "${p}"`);
  result.issues.forEach(issue => console.log(`      - ${issue}`));
});

console.log('\n   → 경로 유효성 검사로 버그 예방\n');

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('path 모듈 고급 활용 정리');
  console.log('='.repeat(60));
  console.log(`
실전 패턴:
✅ path.relative() - 상대 경로 계산
✅ __dirname + path.join() - 안전한 경로 생성
✅ parse() + format() - 확장자/이름 변경
✅ normalize() + 검증 - 보안 (경로 이탈 방지)
✅ split(path.sep) - 깊이 계산, 공통 경로 찾기

보안 원칙:
→ 사용자 입력 경로는 항상 검증
→ 경로 이탈(../) 시도 차단
→ 절대 경로 사용 권장

다음: 03-process-info.js
process 객체의 정보 조회를 배워봅시다!
  `);
}, 100);

/**
 * 실행:
 * node 02-path-operations.js
 */
