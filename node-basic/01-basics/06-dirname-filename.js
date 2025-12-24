/**
 * 06-dirname-filename.js
 *
 * __dirname과 __filename
 * Node.js에서만 사용 가능한 특별한 변수들
 */

console.log('=== __dirname과 __filename ===\n');

// 1. __filename - 현재 파일의 절대 경로
console.log('1. __filename (현재 파일 경로):');
console.log('   ', __filename);
console.log('   이 파일의 전체 경로를 나타냅니다.\n');

// 2. __dirname - 현재 파일이 있는 디렉토리의 절대 경로
console.log('2. __dirname (현재 디렉토리 경로):');
console.log('   ', __dirname);
console.log('   이 파일이 있는 폴더의 경로입니다.\n');

// 3. path 모듈과 함께 사용
const path = require('path');

console.log('3. path 모듈과 조합:');
console.log('   파일명만:', path.basename(__filename));
console.log('   확장자:', path.extname(__filename));
console.log('   디렉토리명:', path.basename(__dirname));

// 4. 상대 경로 vs 절대 경로
console.log('\n4. 경로 처리의 중요성:');
console.log(`
   ❌ 잘못된 방법 (상대 경로):
   const data = require('./data.json');
   → 현재 작업 디렉토리에 따라 경로가 달라짐!

   ✅ 올바른 방법 (절대 경로):
   const data = require(path.join(__dirname, 'data.json'));
   → 어디서 실행하든 항상 같은 파일을 가리킴
`);

// 5. 실제 사용 예제
console.log('5. 실제 사용 예제:\n');

// 같은 폴더의 다른 파일 참조
const configPath = path.join(__dirname, 'config.json');
console.log('   설정 파일 경로:', configPath);

// 상위 폴더 참조
const parentDir = path.join(__dirname, '..');
console.log('   상위 디렉토리:', parentDir);

// 하위 폴더 참조
const dataDir = path.join(__dirname, 'data', 'users.json');
console.log('   데이터 파일 경로:', dataDir);

// 6. process.cwd()와의 차이
console.log('\n6. process.cwd()와의 차이:');
console.log('   __dirname:', __dirname);
console.log('   process.cwd():', process.cwd());
console.log(`
   차이점:
   - __dirname: 현재 파일이 있는 폴더 (항상 동일)
   - process.cwd(): 명령어를 실행한 폴더 (실행 위치에 따라 변경됨)

   예시:
   C:/project> node src/app.js
   → __dirname: C:/project/src
   → process.cwd(): C:/project
`);

// 7. 실용적인 패턴
console.log('\n7. 실용적인 사용 패턴:\n');

console.log('패턴 1: 프로젝트 루트 찾기');
console.log(`
const path = require('path');
const projectRoot = path.join(__dirname, '..', '..');
console.log(projectRoot);
`);

console.log('\n패턴 2: 정적 파일 서빙');
console.log(`
const express = require('express');
const app = express();

// public 폴더의 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));
`);

console.log('\n패턴 3: 환경별 설정 파일 로드');
console.log(`
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, 'config', env + '.json');
const config = require(configPath);
`);

/**
 * 핵심 정리:
 *
 * __filename: 현재 파일의 절대 경로
 * - 예: /Users/name/project/src/app.js
 *
 * __dirname: 현재 디렉토리의 절대 경로
 * - 예: /Users/name/project/src
 *
 * 항상 절대 경로를 만들 때는:
 * path.join(__dirname, '상대경로')
 *
 * 주의:
 * - ES Modules에서는 __dirname, __filename이 없음
 * - 대신 import.meta.url 사용
 */

/**
 * 실행:
 * node 06-dirname-filename.js
 *
 * 다른 폴더에서도 실행해보세요:
 * cd ..
 * node 01-basics/06-dirname-filename.js
 * → __dirname은 동일, process.cwd()는 변경됨
 */
