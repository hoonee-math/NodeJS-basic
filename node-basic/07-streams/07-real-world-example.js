/**
 * 07-real-world-example.js
 *
 * 실전 예제: CSV 파일 처리 파이프라인
 * - CSV 읽기 → 파싱 → 필터링 → 변환 → JSON 출력
 */

const { pipeline, Transform } = require('stream');
const fs = require('fs');
const readline = require('readline');
const { Readable, Writable } = require('stream');

console.log('=== CSV 처리 파이프라인 ===\n');

// 1. 테스트용 CSV 파일 생성
console.log('1. 테스트 데이터 생성\n');

const csvData = `id,name,age,city,salary
1,Alice,30,Seoul,5000000
2,Bob,25,Busan,4000000
3,Charlie,35,Seoul,6000000
4,David,28,Daegu,4500000
5,Eve,32,Seoul,5500000
6,Frank,27,Busan,4200000
7,Grace,29,Incheon,4800000
8,Henry,31,Seoul,5200000
9,Ivy,26,Busan,4100000
10,Jack,33,Seoul,5800000`;

fs.writeFileSync('employees.csv', csvData);
console.log('→ CSV 파일 생성 완료 (employees.csv)\n');

// 2. CSV 파싱 Transform
class CsvParserTransform extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this.headers = null;
    this.lineNumber = 0;
  }

  transform(line, encoding, callback) {
    this.lineNumber++;
    line = line.toString().trim();

    if (!line) {
      callback();
      return;
    }

    const values = line.split(',');

    // 첫 줄은 헤더
    if (!this.headers) {
      this.headers = values;
      console.log(`→ CSV 헤더: ${this.headers.join(', ')}`);
      callback();
      return;
    }

    // 데이터 행을 객체로 변환
    const obj = {};
    this.headers.forEach((header, index) => {
      const value = values[index];

      // 숫자 필드 변환
      if (header === 'id' || header === 'age' || header === 'salary') {
        obj[header] = parseInt(value);
      } else {
        obj[header] = value;
      }
    });

    console.log(`   라인 ${this.lineNumber}: ${obj.name} (${obj.city})`);
    this.push(obj);
    callback();
  }
}

// 3. 필터 Transform (서울 거주자만)
class CityFilterTransform extends Transform {
  constructor(city, options = {}) {
    super({ ...options, objectMode: true });
    this.targetCity = city;
    this.filtered = 0;
    this.passed = 0;
  }

  transform(obj, encoding, callback) {
    if (obj.city === this.targetCity) {
      this.passed++;
      this.push(obj);
    } else {
      this.filtered++;
    }
    callback();
  }

  flush(callback) {
    console.log(`\n→ 필터링 결과: ${this.passed}명 통과, ${this.filtered}명 제외`);
    callback();
  }
}

// 4. 급여 인상 Transform (+10%)
class SalaryIncreaseTransform extends Transform {
  constructor(rate = 0.1, options = {}) {
    super({ ...options, objectMode: true });
    this.rate = rate;
  }

  transform(obj, encoding, callback) {
    const oldSalary = obj.salary;
    obj.salary = Math.round(obj.salary * (1 + this.rate));
    console.log(`   ${obj.name}: ${oldSalary.toLocaleString()}원 → ${obj.salary.toLocaleString()}원`);
    this.push(obj);
    callback();
  }

  flush(callback) {
    console.log(`\n→ 급여 인상 완료 (+${this.rate * 100}%)`);
    callback();
  }
}

// 5. JSON 출력 Transform
class JsonWriterTransform extends Writable {
  constructor(filePath, options = {}) {
    super({ ...options, objectMode: true });
    this.filePath = filePath;
    this.items = [];
  }

  write(obj, encoding, callback) {
    this.items.push(obj);
    if (callback) callback();
    return true;
  }

  end() {
    const json = JSON.stringify(this.items, null, 2);
    fs.writeFileSync(this.filePath, json);
    console.log(`\n→ JSON 파일 저장: ${this.filePath} (${this.items.length}개 항목)\n`);
    super.end();
  }
}

// 6. 라인 스트림 (CSV를 줄 단위로 읽기)
function createLineStream(filePath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity
  });

  return Readable.from(
    (async function* () {
      for await (const line of rl) {
        yield line;
      }
    })()
  );
}

// 7. 파이프라인 실행
console.log('2. CSV 파싱\n');

const lineStream = createLineStream('employees.csv');
const csvParser = new CsvParserTransform();
const cityFilter = new CityFilterTransform('Seoul');
const salaryIncrease = new SalaryIncreaseTransform(0.1);
const jsonWriter = new JsonWriterTransform('output.json');

console.log('\n3. 필터링 (서울 거주자만)\n');

pipeline(
  lineStream,
  csvParser,
  cityFilter,
  salaryIncrease,
  jsonWriter,
  (err) => {
    if (err) {
      console.error('\n[에러]', err.message);
    } else {
      console.log('4. 파이프라인 완료!\n');

      // 결과 출력
      const result = JSON.parse(fs.readFileSync('output.json', 'utf8'));

      console.log('=== 최종 결과 ===\n');
      result.forEach((emp, index) => {
        console.log(`${index + 1}. ${emp.name} (${emp.age}세)`);
        console.log(`   도시: ${emp.city}`);
        console.log(`   급여: ${emp.salary.toLocaleString()}원`);
      });

      console.log('\n=== 통계 ===');
      const avgAge = result.reduce((sum, e) => sum + e.age, 0) / result.length;
      const avgSalary = result.reduce((sum, e) => sum + e.salary, 0) / result.length;

      console.log(`평균 나이: ${avgAge.toFixed(1)}세`);
      console.log(`평균 급여: ${avgSalary.toLocaleString()}원`);
      console.log();

      // 테스트 파일 정리
      fs.unlinkSync('employees.csv');
      fs.unlinkSync('output.json');

      console.log('테스트 파일 정리 완료');
    }
  }
);

/**
 * 실행:
 * node 07-real-world-example.js
 *
 * 파이프라인 흐름:
 * 1. CSV 파일 읽기 (Line Stream)
 * 2. CSV 파싱 (CsvParserTransform)
 *    - 헤더 추출
 *    - 각 행을 객체로 변환
 *    - 숫자 필드 타입 변환
 * 3. 필터링 (CityFilterTransform)
 *    - 특정 도시 거주자만 통과
 *    - 통계 수집
 * 4. 데이터 변환 (SalaryIncreaseTransform)
 *    - 급여 10% 인상
 *    - 변경 내역 로깅
 * 5. JSON 출력 (JsonWriterTransform)
 *    - 배열로 수집
 *    - JSON 파일로 저장
 *
 * 스트림 파이프라인 장점:
 * - 메모리 효율: 한 번에 한 줄씩 처리
 * - 모듈화: 각 변환이 독립적
 * - 재사용: Transform 클래스 재사용 가능
 * - 확장성: 새로운 Transform 쉽게 추가
 * - 에러 처리: pipeline()이 자동 처리
 *
 * Transform 클래스 패턴:
 *
 * class MyTransform extends Transform {
 *   constructor(options = {}) {
 *     super({ ...options, objectMode: true });
 *     // 초기화
 *   }
 *
 *   transform(chunk, encoding, callback) {
 *     // 데이터 변환
 *     this.push(transformedData);
 *     callback();
 *   }
 *
 *   flush(callback) {
 *     // 스트림 종료 전 처리 (선택)
 *     callback();
 *   }
 * }
 *
 * 실전 활용:
 * - CSV/JSON 데이터 처리
 * - 로그 파일 분석
 * - ETL (Extract, Transform, Load) 파이프라인
 * - 데이터 정제 및 변환
 * - 실시간 데이터 처리
 *
 * 확장 아이디어:
 * - 여러 CSV 파일 병합
 * - 데이터베이스에 저장
 * - 이메일 발송
 * - 통계 리포트 생성
 * - 실시간 대시보드 업데이트
 *
 * Best Practices:
 * - objectMode: true (객체 스트리밍)
 * - flush() 메서드로 마무리 작업
 * - 에러 처리 (callback(err))
 * - 통계 수집 (flush에서 출력)
 * - 재사용 가능한 Transform 클래스
 */
