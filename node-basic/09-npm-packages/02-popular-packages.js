/**
 * 02-popular-packages.js
 *
 * 인기 npm 패키지 활용
 *
 * 설치 필요:
 * npm install axios lodash chalk dayjs
 */

console.log('=== 인기 npm 패키지 ===\n');

// 패키지 가용성 확인
function checkPackage(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (err) {
    return false;
  }
}

// 1. axios - HTTP 클라이언트
console.log('1. axios - HTTP 클라이언트\n');

if (checkPackage('axios')) {
  const axios = require('axios');

  // GET 요청
  axios.get('https://jsonplaceholder.typicode.com/posts/1')
    .then((response) => {
      console.log('→ GET 요청 성공:');
      console.log(`   제목: ${response.data.title}`);
      console.log(`   내용: ${response.data.body.substring(0, 50)}...`);
    })
    .catch((error) => {
      console.log(`   [에러] ${error.message}`);
    });

  // POST 요청
  setTimeout(() => {
    console.log('\n→ POST 요청:');

    axios.post('https://jsonplaceholder.typicode.com/posts', {
      title: 'New Post',
      body: 'This is a new post',
      userId: 1
    })
      .then((response) => {
        console.log(`   생성된 ID: ${response.data.id}`);
        console.log(`   상태 코드: ${response.status}`);
      })
      .catch((error) => {
        console.log(`   [에러] ${error.message}`);
      });
  }, 500);
} else {
  console.log('→ axios가 설치되지 않았습니다');
  console.log('   설치: npm install axios\n');
}

// 2. lodash - 유틸리티 라이브러리
setTimeout(() => {
  console.log('\n2. lodash - 유틸리티 함수\n');

  if (checkPackage('lodash')) {
    const _ = require('lodash');

    // 배열 조작
    const numbers = [1, 2, 3, 4, 5];
    console.log('→ 배열:', numbers);
    console.log(`   합계: ${_.sum(numbers)}`);
    console.log(`   평균: ${_.mean(numbers)}`);
    console.log(`   최대: ${_.max(numbers)}`);
    console.log(`   최소: ${_.min(numbers)}`);

    // 배열 청크
    const chunked = _.chunk([1, 2, 3, 4, 5, 6], 2);
    console.log(`   청크 (2개씩): ${JSON.stringify(chunked)}`);

    // 객체 조작
    const user = {
      id: 1,
      name: 'Alice',
      profile: { age: 30, city: 'Seoul' }
    };

    console.log('\n→ 객체:', JSON.stringify(user));
    console.log(`   깊은 복사: ${JSON.stringify(_.cloneDeep(user))}`);
    console.log(`   중첩 값: ${_.get(user, 'profile.city')}`);

    // 디바운스
    console.log('\n→ 디바운스 (300ms):');
    const debouncedLog = _.debounce(() => {
      console.log('   디바운스 실행됨!');
    }, 300);

    debouncedLog();
    debouncedLog();
    debouncedLog();  // 마지막 호출만 실행됨
  } else {
    console.log('→ lodash가 설치되지 않았습니다');
    console.log('   설치: npm install lodash\n');
  }
}, 1000);

// 3. chalk - 터미널 색상
setTimeout(() => {
  console.log('\n3. chalk - 터미널 색상\n');

  if (checkPackage('chalk')) {
    const chalk = require('chalk');

    console.log(chalk.blue('→ 파란색 텍스트'));
    console.log(chalk.red('→ 빨간색 텍스트'));
    console.log(chalk.green('→ 초록색 텍스트'));
    console.log(chalk.yellow('→ 노란색 텍스트'));

    console.log(chalk.bold('\n→ 굵은 텍스트'));
    console.log(chalk.italic('→ 기울임 텍스트'));
    console.log(chalk.underline('→ 밑줄 텍스트'));

    console.log('\n→ 조합:');
    console.log(chalk.bold.blue('   굵은 파란색'));
    console.log(chalk.bgRed.white('   빨간 배경 흰 글자'));
    console.log(chalk.green.underline('   초록색 밑줄'));

    // 로그 레벨
    console.log('\n→ 로그 레벨:');
    console.log(chalk.blue('[INFO]'), '정보 메시지');
    console.log(chalk.yellow('[WARN]'), '경고 메시지');
    console.log(chalk.red('[ERROR]'), '에러 메시지');
    console.log(chalk.green('[SUCCESS]'), '성공 메시지');
  } else {
    console.log('→ chalk이 설치되지 않았습니다');
    console.log('   설치: npm install chalk');
    console.log('   주의: chalk v5는 ESM 전용, v4 사용 권장\n');
  }
}, 1500);

// 4. dayjs - 날짜/시간 처리
setTimeout(() => {
  console.log('\n4. dayjs - 날짜/시간 라이브러리\n');

  if (checkPackage('dayjs')) {
    const dayjs = require('dayjs');
    const relativeTime = require('dayjs/plugin/relativeTime');
    const customParseFormat = require('dayjs/plugin/customParseFormat');

    dayjs.extend(relativeTime);
    dayjs.extend(customParseFormat);

    const now = dayjs();

    console.log('→ 현재 시간:');
    console.log(`   기본: ${now.format()}`);
    console.log(`   포맷: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
    console.log(`   한국어: ${now.format('YYYY년 MM월 DD일')}`);

    console.log('\n→ 날짜 조작:');
    console.log(`   7일 후: ${now.add(7, 'day').format('YYYY-MM-DD')}`);
    console.log(`   1개월 전: ${now.subtract(1, 'month').format('YYYY-MM-DD')}`);

    console.log('\n→ 날짜 비교:');
    const future = dayjs().add(10, 'day');
    console.log(`   10일 후가 현재보다 이후? ${future.isAfter(now)}`);
    console.log(`   현재가 10일 후보다 이후? ${now.isAfter(future)}`);

    console.log('\n→ 상대 시간:');
    console.log(`   1시간 전: ${dayjs().subtract(1, 'hour').fromNow()}`);
    console.log(`   2일 후: ${dayjs().add(2, 'day').fromNow()}`);

    // 파싱
    const parsed = dayjs('2024-01-15', 'YYYY-MM-DD');
    console.log(`\n→ 파싱: ${parsed.format('YYYY년 MM월 DD일')}`);
  } else {
    console.log('→ dayjs가 설치되지 않았습니다');
    console.log('   설치: npm install dayjs\n');
  }
}, 2000);

// 5. 패키지 선택 가이드
setTimeout(() => {
  console.log('\n5. 패키지 선택 가이드\n');

  const categories = [
    {
      category: 'HTTP 클라이언트',
      packages: [
        { name: 'axios', desc: '가장 인기, Promise 기반, 브라우저 호환' },
        { name: 'node-fetch', desc: 'Fetch API 구현, 가벼움' },
        { name: 'got', desc: '고급 기능, 재시도, 타임아웃' }
      ]
    },
    {
      category: '유틸리티',
      packages: [
        { name: 'lodash', desc: '배열/객체 조작, 가장 많이 사용' },
        { name: 'ramda', desc: '함수형 프로그래밍 스타일' },
        { name: 'underscore', desc: 'lodash의 원조, 더 가벼움' }
      ]
    },
    {
      category: '날짜/시간',
      packages: [
        { name: 'dayjs', desc: '가볍고 빠름, Moment.js 대체' },
        { name: 'date-fns', desc: '모듈화, 트리 셰이킹' },
        { name: 'luxon', desc: '국제화 지원 강력' }
      ]
    },
    {
      category: '터미널',
      packages: [
        { name: 'chalk', desc: '색상 출력' },
        { name: 'ora', desc: '로딩 스피너' },
        { name: 'inquirer', desc: '대화형 프롬프트' },
        { name: 'commander', desc: 'CLI 프레임워크' }
      ]
    }
  ];

  categories.forEach(({ category, packages }) => {
    console.log(`→ ${category}:`);
    packages.forEach(({ name, desc }) => {
      console.log(`   - ${name}: ${desc}`);
    });
    console.log();
  });
}, 2500);

// 6. 설치 안내
setTimeout(() => {
  console.log('6. 패키지 설치 방법\n');

  console.log('→ 이 예제를 실행하려면:');
  console.log('   npm install axios lodash chalk dayjs');
  console.log();
  console.log('→ 또는 개별 설치:');
  console.log('   npm install axios    # HTTP 클라이언트');
  console.log('   npm install lodash   # 유틸리티');
  console.log('   npm install chalk@4  # 터미널 색상 (v4)');
  console.log('   npm install dayjs    # 날짜/시간');
  console.log();
}, 3000);

/**
 * 실행:
 * npm install axios lodash chalk@4 dayjs
 * node 02-popular-packages.js
 *
 * 핵심 패키지:
 *
 * 1. axios:
 * - HTTP 요청을 간편하게
 * - Promise 기반
 * - 인터셉터, 타임아웃 등 지원
 * - GET, POST, PUT, DELETE 등
 *
 * 2. lodash:
 * - 배열/객체 조작 유틸리티
 * - 성능 최적화된 함수들
 * - 깊은 복사, 디바운스, 쓰로틀 등
 * - 함수형 프로그래밍 지원
 *
 * 3. chalk:
 * - 터미널 색상 출력
 * - 가독성 향상
 * - 로그 레벨 구분
 * - 주의: v5는 ESM 전용, v4 권장
 *
 * 4. dayjs:
 * - 경량 날짜 라이브러리
 * - Moment.js 대체품
 * - 플러그인 시스템
 * - 포맷, 파싱, 조작, 비교
 *
 * 패키지 선택 기준:
 * - 다운로드 수 (인기도)
 * - 마지막 업데이트 (유지보수)
 * - 이슈/PR 활성도
 * - 번들 크기
 * - TypeScript 지원
 * - 문서 품질
 *
 * Best Practices:
 * - 필요한 기능만 제공하는 가벼운 패키지 선호
 * - 메이저 버전 업데이트 주의
 * - 보안 취약점 확인 (npm audit)
 * - 너무 많은 의존성 지양
 *
 * 주의사항:
 * - ESM vs CommonJS 호환성 확인
 * - 번들 크기 고려
 * - 라이선스 확인
 * - 유지보수 상태 확인
 */
