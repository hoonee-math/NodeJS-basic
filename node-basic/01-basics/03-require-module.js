/**
 * 03-require-module.js
 *
 * CommonJS 모듈 시스템 - require()로 모듈 불러오기
 * Node.js의 전통적인 모듈 시스템입니다.
 */

console.log('=== require()로 모듈 불러오기 ===\n');

// 1. 내장 모듈 불러오기 (설치 불필요)
console.log('1. 내장 모듈:');
const os = require('os'); // 운영체제 정보
const path = require('path'); // 경로 처리

console.log('   운영체제:', os.platform());
console.log('   홈 디렉토리:', os.homedir());
console.log('   경로 결합:', path.join('/users', 'name', 'file.txt'));

// 2. 외부 모듈 불러오기 (npm install 필요)
console.log('\n2. 외부 모듈 (예시):');
// const express = require('express'); // npm install express 후 사용 가능
// const axios = require('axios');     // npm install axios 후 사용 가능
console.log('   외부 모듈은 먼저 npm install로 설치해야 합니다.');

// 3. 내가 만든 모듈 불러오기 (상대 경로 필요)
console.log('\n3. 사용자 정의 모듈:');
// const myModule = require('./my-module'); // 같은 폴더의 my-module.js
// const utils = require('../utils');        // 상위 폴더의 utils.js
console.log('   파일 경로: ./ (현재 폴더), ../ (상위 폴더)');

// 4. require의 동작 방식
console.log('\n4. require() 동작 방식:');
console.log('   - 모듈을 처음 로드할 때만 실행됩니다.');
console.log('   - 이후에는 캐시된 결과를 반환합니다.');

// 같은 모듈을 여러 번 require 해도 한 번만 실행됨
const os1 = require('os');
const os2 = require('os');
console.log('   os1 === os2:', os1 === os2); // true (같은 객체)

// 5. require 해결 순서
console.log('\n5. require 모듈 찾기 순서:');
console.log('   1) 내장 모듈 확인 (fs, path, http 등)');
console.log('   2) ./ 또는 ../ 로 시작하면 파일 경로로 인식');
console.log('   3) node_modules 폴더에서 검색');

// 6. 다양한 require 패턴
console.log('\n6. require 패턴:');

// 전체 모듈 가져오기
const filesystem = require('fs');
console.log('   전체:', typeof filesystem);

// 구조 분해로 필요한 것만 가져오기
const { readFile, writeFile } = require('fs');
console.log('   구조 분해:', typeof readFile);

// 7. require.cache - 로드된 모듈 캐시 확인
console.log('\n7. 모듈 캐시:');
console.log('   캐시된 모듈 수:', Object.keys(require.cache).length);
console.log('   현재 파일:', require.cache[__filename] ? '캐시됨' : '미캐시');

/**
 * 핵심 포인트:
 * - require()는 동기적으로 동작 (파일을 즉시 읽음)
 * - 확장자 .js는 생략 가능: require('./module') === require('./module.js')
 * - JSON 파일도 require 가능: const data = require('./data.json')
 * - 폴더를 require하면 그 안의 index.js를 찾음
 */

/**
 * 실행:
 * node 03-require-module.js
 */
