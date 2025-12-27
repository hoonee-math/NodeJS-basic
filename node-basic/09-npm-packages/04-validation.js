/**
 * 04-validation.js
 *
 * 데이터 검증 패키지 (joi, validator)
 *
 * 설치 필요:
 * npm install joi validator
 */

console.log('=== 데이터 검증 패키지 ===\n');

// 패키지 가용성 확인
function checkPackage(packageName) {
  try {
    require.resolve(packageName);
    return true;
  } catch (err) {
    return false;
  }
}

// 1. joi - 스키마 기반 검증
console.log('1. joi - 스키마 기반 검증\n');

if (checkPackage('joi')) {
  const Joi = require('joi');

  // 사용자 스키마
  const userSchema = Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(0).max(150),
    password: Joi.string().min(8).pattern(/^[a-zA-Z0-9!@#$%^&*]+$/),
    role: Joi.string().valid('user', 'admin', 'moderator').default('user'),
    isActive: Joi.boolean().default(true)
  });

  console.log('→ 유효한 데이터:');
  const validUser = {
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
    password: 'Pass1234!',
    role: 'admin'
  };

  const { error: error1, value: value1 } = userSchema.validate(validUser);

  if (error1) {
    console.log(`   [에러] ${error1.message}`);
  } else {
    console.log('   검증 성공:', JSON.stringify(value1, null, 2));
  }

  console.log('\n→ 잘못된 데이터:');
  const invalidUser = {
    name: 'A',  // 너무 짧음
    email: 'invalid-email',  // 이메일 형식 아님
    age: 200,  // 범위 초과
    password: '123'  // 너무 짧음
  };

  const { error: error2, value: value2 } = userSchema.validate(invalidUser, {
    abortEarly: false  // 모든 에러 수집
  });

  if (error2) {
    console.log('   [에러] 검증 실패:');
    error2.details.forEach((detail) => {
      console.log(`   - ${detail.path.join('.')}: ${detail.message}`);
    });
  }

  console.log();
} else {
  console.log('→ joi가 설치되지 않았습니다');
  console.log('   설치: npm install joi\n');
}

// 2. joi - 중첩된 객체 검증
setTimeout(() => {
  console.log('2. joi - 중첩된 객체 검증\n');

  if (checkPackage('joi')) {
    const Joi = require('joi');

    const orderSchema = Joi.object({
      orderId: Joi.string().uuid().required(),
      customer: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        address: Joi.object({
          street: Joi.string().required(),
          city: Joi.string().required(),
          zipCode: Joi.string().pattern(/^\d{5}$/)
        }).required()
      }).required(),
      items: Joi.array().items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().integer().min(1).required(),
          price: Joi.number().positive().required()
        })
      ).min(1).required(),
      totalAmount: Joi.number().positive().required()
    });

    const order = {
      orderId: '550e8400-e29b-41d4-a716-446655440000',
      customer: {
        name: 'Bob',
        email: 'bob@example.com',
        address: {
          street: '123 Main St',
          city: 'Seoul',
          zipCode: '12345'
        }
      },
      items: [
        { productId: 'P001', quantity: 2, price: 10000 },
        { productId: 'P002', quantity: 1, price: 25000 }
      ],
      totalAmount: 45000
    };

    const { error, value } = orderSchema.validate(order);

    if (error) {
      console.log(`   [에러] ${error.message}`);
    } else {
      console.log('→ 주문 검증 성공');
      console.log(`   주문 ID: ${value.orderId}`);
      console.log(`   고객: ${value.customer.name}`);
      console.log(`   상품 개수: ${value.items.length}`);
      console.log(`   총액: ${value.totalAmount.toLocaleString()}원`);
    }

    console.log();
  }
}, 100);

// 3. validator - 문자열 검증
setTimeout(() => {
  console.log('3. validator - 문자열 검증\n');

  if (checkPackage('validator')) {
    const validator = require('validator');

    const testCases = [
      {
        type: '이메일',
        values: ['test@example.com', 'invalid-email', 'user@domain'],
        validate: validator.isEmail
      },
      {
        type: 'URL',
        values: ['https://example.com', 'http://test.co.kr', 'not-a-url'],
        validate: validator.isURL
      },
      {
        type: 'UUID',
        values: ['550e8400-e29b-41d4-a716-446655440000', 'abc-123', '12345'],
        validate: validator.isUUID
      },
      {
        type: 'IP 주소',
        values: ['192.168.1.1', '256.0.0.1', 'not-an-ip'],
        validate: validator.isIP
      },
      {
        type: '신용카드',
        values: ['4111111111111111', '1234567890123456', 'not-a-card'],
        validate: validator.isCreditCard
      }
    ];

    testCases.forEach(({ type, values, validate }) => {
      console.log(`→ ${type} 검증:`);
      values.forEach((value) => {
        const isValid = validate(value);
        const icon = isValid ? '✓' : '✗';
        console.log(`   ${icon} "${value}": ${isValid ? '유효' : '유효하지 않음'}`);
      });
      console.log();
    });
  } else {
    console.log('→ validator가 설치되지 않았습니다');
    console.log('   설치: npm install validator\n');
  }
}, 200);

// 4. validator - 문자열 정리
setTimeout(() => {
  console.log('4. validator - 문자열 정리 (sanitization)\n');

  if (checkPackage('validator')) {
    const validator = require('validator');

    const dirtyData = [
      {
        type: 'HTML 이스케이프',
        input: '<script>alert("XSS")</script>',
        output: validator.escape('<script>alert("XSS")</script>')
      },
      {
        type: '공백 제거',
        input: '  hello world  ',
        output: validator.trim('  hello world  ')
      },
      {
        type: '소문자 변환',
        input: 'HELLO@EXAMPLE.COM',
        output: validator.normalizeEmail('HELLO@EXAMPLE.COM')
      },
      {
        type: '불린 변환',
        input: 'yes',
        output: validator.toBoolean('yes', true)
      }
    ];

    dirtyData.forEach(({ type, input, output }) => {
      console.log(`→ ${type}:`);
      console.log(`   입력: "${input}"`);
      console.log(`   출력: "${output}"`);
      console.log();
    });
  }
}, 300);

// 5. 커스텀 검증 함수
setTimeout(() => {
  console.log('5. 커스텀 검증 함수\n');

  if (checkPackage('joi')) {
    const Joi = require('joi');

    // 한국 전화번호 검증
    const phoneSchema = Joi.string().custom((value, helpers) => {
      const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;

      if (!phoneRegex.test(value)) {
        return helpers.error('any.invalid');
      }

      return value;
    }, '한국 전화번호 검증').messages({
      'any.invalid': '유효한 전화번호 형식이 아닙니다 (예: 010-1234-5678)'
    });

    const testPhones = [
      '010-1234-5678',
      '011-123-4567',
      '010-12345678',
      '02-1234-5678'
    ];

    console.log('→ 한국 전화번호 검증:');
    testPhones.forEach((phone) => {
      const { error } = phoneSchema.validate(phone);
      const icon = error ? '✗' : '✓';
      console.log(`   ${icon} ${phone}`);
      if (error) {
        console.log(`      ${error.message}`);
      }
    });

    console.log();
  }
}, 400);

// 6. 실전: API 요청 검증
setTimeout(() => {
  console.log('6. 실전: API 요청 검증\n');

  if (checkPackage('joi')) {
    const Joi = require('joi');

    // API 요청 스키마
    const createUserSchema = Joi.object({
      name: Joi.string().min(2).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
        .required()
        .messages({
          'string.pattern.base': '비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다'
        }),
      age: Joi.number().integer().min(18).max(100),
      terms: Joi.boolean().valid(true).required().messages({
        'any.only': '약관에 동의해야 합니다'
      })
    });

    function validateCreateUser(data) {
      console.log('→ 사용자 생성 요청 검증:');
      console.log(`   입력: ${JSON.stringify(data)}`);

      const { error, value } = createUserSchema.validate(data, {
        abortEarly: false
      });

      if (error) {
        console.log('   [실패] 검증 에러:');
        error.details.forEach((detail) => {
          console.log(`   - ${detail.path.join('.')}: ${detail.message}`);
        });
        return null;
      }

      console.log('   [성공] 검증 통과');
      return value;
    }

    // 테스트 1: 유효한 데이터
    validateCreateUser({
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'Pass1234!',
      age: 25,
      terms: true
    });

    console.log();

    // 테스트 2: 잘못된 데이터
    validateCreateUser({
      name: 'D',
      email: 'invalid',
      password: '123',
      age: 15,
      terms: false
    });

    console.log();
  }
}, 500);

// 7. joi vs validator 비교
setTimeout(() => {
  console.log('7. joi vs validator 비교\n');

  console.log('→ joi (스키마 기반):');
  console.log('   - 객체 전체 구조 검증');
  console.log('   - 중첩된 객체, 배열 지원');
  console.log('   - 기본값, 변환 지원');
  console.log('   - API 요청/응답 검증에 적합');
  console.log('   - TypeScript 지원 우수');
  console.log();

  console.log('→ validator (문자열 특화):');
  console.log('   - 문자열 검증/정리 전문');
  console.log('   - 가볍고 빠름');
  console.log('   - 단일 값 검증에 적합');
  console.log('   - 풍부한 내장 검증 함수');
  console.log('   - HTML 이스케이프 등 보안 기능');
  console.log();

  console.log('→ 사용 가이드:');
  console.log('   - 복잡한 객체 검증 → joi');
  console.log('   - 단일 문자열 검증 → validator');
  console.log('   - API 요청/응답 → joi');
  console.log('   - 폼 입력 정리 → validator');
  console.log('   - 함께 사용 가능 (joi + validator)');
  console.log();
}, 600);

/**
 * 실행:
 * npm install joi validator
 * node 04-validation.js
 *
 * 핵심 개념:
 * - 데이터 검증: 입력 데이터 유효성 확인
 * - 스키마: 데이터 구조 정의
 * - Sanitization: 데이터 정리/변환
 *
 * joi:
 * - 스키마 기반 검증 라이브러리
 * - 객체, 배열, 중첩 구조 지원
 * - 체이닝 API (fluent interface)
 * - 커스텀 검증 함수 지원
 * - 기본값, 변환 지원
 *
 * joi 주요 메서드:
 * - Joi.string() - 문자열
 * - Joi.number() - 숫자
 * - Joi.boolean() - 불린
 * - Joi.array() - 배열
 * - Joi.object() - 객체
 * - .required() - 필수
 * - .min(), .max() - 범위
 * - .pattern() - 정규식
 * - .valid() - 특정 값만 허용
 * - .default() - 기본값
 *
 * validator:
 * - 문자열 검증/정리 라이브러리
 * - 가볍고 빠름
 * - 풍부한 내장 함수
 *
 * validator 주요 함수:
 * - isEmail() - 이메일
 * - isURL() - URL
 * - isUUID() - UUID
 * - isIP() - IP 주소
 * - isCreditCard() - 신용카드
 * - escape() - HTML 이스케이프
 * - trim() - 공백 제거
 * - normalizeEmail() - 이메일 정규화
 *
 * Best Practices:
 * - 모든 사용자 입력 검증
 * - 클라이언트와 서버 모두 검증
 * - 명확한 에러 메시지
 * - 화이트리스트 방식 (허용할 것만)
 * - SQL Injection, XSS 방지
 *
 * 활용:
 * - API 요청 검증
 * - 폼 입력 검증
 * - 환경 변수 검증
 * - 파일 업로드 검증
 * - 데이터베이스 입력 전 검증
 */
