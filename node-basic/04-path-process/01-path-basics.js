/**
 * 01-path-basics.js
 *
 * path 모듈 기본 사용법
 * 크로스 플랫폼 경로 처리의 핵심
 */

const path = require('path');

console.log('=== path 모듈 기본 ===\n');

// ============================================
// 1. path.join() - 경로 결합
// ============================================
console.log('1. path.join() - 경로 결합\n');

const joined1 = path.join('users', 'john', 'documents');
const joined2 = path.join('users', 'john', 'documents', 'file.txt');
const joined3 = path.join('/users', 'john', '..', 'jane', 'file.txt');

console.log('   기본 결합:', joined1);
console.log('   파일 포함:', joined2);
console.log('   .. 처리:', joined3);
console.log('\n   → join은 플랫폼별 구분자를 자동 처리\n');

// ============================================
// 2. path.resolve() - 절대 경로 생성
// ============================================
console.log('2. path.resolve() - 절대 경로\n');

const resolved1 = path.resolve('file.txt');
const resolved2 = path.resolve('users', 'john', 'file.txt');
const resolved3 = path.resolve('/foo', '/bar', 'baz');

console.log('   현재 디렉토리 기준:', resolved1);
console.log('   상대 경로 변환:', resolved2);
console.log('   절대 경로 우선:', resolved3);
console.log('\n   → resolve는 항상 절대 경로 반환\n');

// ============================================
// 3. path.basename() - 파일명 추출
// ============================================
console.log('3. path.basename() - 파일명 추출\n');

const fullPath = '/users/john/documents/report.pdf';

console.log('   전체 경로:', fullPath);
console.log('   파일명:', path.basename(fullPath));
console.log('   확장자 제외:', path.basename(fullPath, '.pdf'));
console.log('\n   → basename은 경로의 마지막 부분 반환\n');

// ============================================
// 4. path.dirname() - 디렉토리 경로 추출
// ============================================
console.log('4. path.dirname() - 디렉토리 경로\n');

const filePath = '/users/john/documents/report.pdf';

console.log('   전체 경로:', filePath);
console.log('   디렉토리:', path.dirname(filePath));
console.log('   상위 디렉토리:', path.dirname(path.dirname(filePath)));
console.log('\n   → dirname은 파일이 속한 디렉토리 반환\n');

// ============================================
// 5. path.extname() - 확장자 추출
// ============================================
console.log('5. path.extname() - 확장자 추출\n');

const files = [
  'document.txt',
  'archive.tar.gz',
  'image.png',
  'script.min.js',
  'README'
];

files.forEach(file => {
  console.log(`   ${file.padEnd(20)} → ${path.extname(file) || '(없음)'}`);
});

console.log('\n   → extname은 마지막 . 이후 문자열 반환\n');

// ============================================
// 6. path.parse() - 경로 분해
// ============================================
console.log('6. path.parse() - 경로 분해\n');

const parsedPath = '/home/user/documents/file.txt';
const parsed = path.parse(parsedPath);

console.log('   원본 경로:', parsedPath);
console.log('   분해 결과:');
console.log('   - root:', parsed.root);
console.log('   - dir:', parsed.dir);
console.log('   - base:', parsed.base);
console.log('   - ext:', parsed.ext);
console.log('   - name:', parsed.name);
console.log('\n   → parse는 경로를 5개 속성으로 분해\n');

// ============================================
// 7. path.format() - 경로 조합
// ============================================
console.log('7. path.format() - 경로 조합\n');

const pathObject = {
  dir: '/home/user/documents',
  base: 'report.pdf'
};

const formatted = path.format(pathObject);
console.log('   입력 객체:', pathObject);
console.log('   결과 경로:', formatted);

// name과 ext를 사용하는 방법
const pathObject2 = {
  dir: '/home/user',
  name: 'file',
  ext: '.txt'
};

const formatted2 = path.format(pathObject2);
console.log('\n   name + ext 방식:', pathObject2);
console.log('   결과 경로:', formatted2);
console.log('\n   → format은 parse의 반대 작업\n');

// ============================================
// 8. path.normalize() - 경로 정규화
// ============================================
console.log('8. path.normalize() - 경로 정규화\n');

const messy1 = '/foo/bar//baz/asdf/quux/..';
const messy2 = './users/../documents/./file.txt';
const messy3 = 'C:\\temp\\\\foo\\bar\\..\\..\\file.txt';

console.log('   복잡한 경로:');
console.log('   -', messy1);
console.log('   정규화:', path.normalize(messy1));
console.log();
console.log('   상대 경로:');
console.log('   -', messy2);
console.log('   정규화:', path.normalize(messy2));
console.log('\n   → ..과 .을 처리하고 구분자 정리\n');

// ============================================
// 9. path.isAbsolute() - 절대 경로 확인
// ============================================
console.log('9. path.isAbsolute() - 절대 경로 확인\n');

const paths = [
  '/foo/bar',
  'C:\\Users\\john',
  './relative/path',
  'folder/file.txt',
  '/root'
];

paths.forEach(p => {
  const isAbs = path.isAbsolute(p);
  const mark = isAbs ? '✅' : '❌';
  console.log(`   ${mark} ${p.padEnd(25)} → ${isAbs}`);
});

console.log('\n   → 경로가 루트부터 시작하는지 확인\n');

// ============================================
// 10. path 속성
// ============================================
console.log('10. path 속성\n');

console.log('   플랫폼별 구분자:');
console.log('   - path.sep:', JSON.stringify(path.sep));
console.log('   - path.delimiter:', JSON.stringify(path.delimiter));
console.log();

console.log('   예시:');
console.log('   - 경로 구분:', `foo${path.sep}bar${path.sep}baz`);
console.log('   - PATH 환경 변수:', process.env.PATH.split(path.delimiter).slice(0, 3));
console.log('\n   → Windows: sep=\\, delimiter=;');
console.log('   → POSIX: sep=/, delimiter=:\n');

// ============================================
// 마무리
// ============================================
setTimeout(() => {
  console.log('='.repeat(60));
  console.log('path 모듈 기본 정리');
  console.log('='.repeat(60));
  console.log(`
✅ 경로 결합: path.join()
✅ 절대 경로: path.resolve()
✅ 파일명: path.basename()
✅ 디렉토리: path.dirname()
✅ 확장자: path.extname()
✅ 분해: path.parse()
✅ 조합: path.format()
✅ 정규화: path.normalize()
✅ 절대 경로 확인: path.isAbsolute()

핵심 원칙:
→ 문자열 결합 대신 path.join() 사용
→ 크로스 플랫폼 호환성 보장
→ ..과 . 자동 처리

다음: 02-path-operations.js
path 모듈의 고급 활용을 배워봅시다!
  `);
}, 100);

/**
 * 실행:
 * node 01-path-basics.js
 */
