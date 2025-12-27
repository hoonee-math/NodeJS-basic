# Semantic Versioning (SemVer)

## 개요

Semantic Versioning(시맨틱 버전 관리, SemVer)은 소프트웨어 버전을 일관되게 관리하는 표준 규칙입니다.

## 버전 번호 구조

```
MAJOR.MINOR.PATCH
  1  .  2  .  3
```

- **MAJOR** (주 버전): 하위 호환성이 깨지는 변경
- **MINOR** (부 버전): 하위 호환성을 유지하는 기능 추가
- **PATCH** (패치 버전): 하위 호환성을 유지하는 버그 수정

### 예시

- `1.0.0` → 첫 정식 릴리스
- `1.0.1` → 버그 수정
- `1.1.0` → 새 기능 추가 (하위 호환)
- `2.0.0` → 하위 호환성 깨지는 변경

## 버전 증가 규칙

### 1. PATCH 증가 (1.0.0 → 1.0.1)

```
버그 수정
성능 개선
내부 리팩토링
문서 수정
```

### 2. MINOR 증가 (1.0.0 → 1.1.0)

```
새로운 기능 추가
기존 기능 개선
Deprecated 선언 (다음 메이저에서 제거 예정)
```

### 3. MAJOR 증가 (1.0.0 → 2.0.0)

```
API 변경 (하위 호환 불가)
함수 시그니처 변경
파라미터 제거 또는 변경
Deprecated 기능 제거
```

## npm의 버전 범위 표기법

### 1. 캐럿 (^) - 기본값

```json
{
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

- **의미**: MINOR와 PATCH 업데이트 허용
- **허용**: `4.18.0` 이상 `5.0.0` 미만
- **예시**: `4.18.1`, `4.19.0`, `4.99.99` 가능, `5.0.0` 불가

### 2. 틸드 (~)

```json
{
  "dependencies": {
    "lodash": "~4.17.0"
  }
}
```

- **의미**: PATCH 업데이트만 허용
- **허용**: `4.17.0` 이상 `4.18.0` 미만
- **예시**: `4.17.1`, `4.17.21` 가능, `4.18.0` 불가

### 3. 정확한 버전

```json
{
  "dependencies": {
    "axios": "1.6.0"
  }
}
```

- **의미**: 정확히 해당 버전만
- **허용**: `1.6.0`만
- **사용 시기**: 버전 고정이 필요한 경우

### 4. 범위 지정

```json
{
  "dependencies": {
    "react": ">=16.8.0 <18.0.0",
    "vue": ">2.0.0 <=3.0.0"
  }
}
```

- **연산자**: `>`, `>=`, `<`, `<=`, `=`
- **조합**: 공백으로 AND, `||`로 OR

### 5. 와일드카드 (*)

```json
{
  "dependencies": {
    "some-package": "*"
  }
}
```

- **의미**: 모든 버전 허용
- **주의**: 프로덕션에서 사용하지 않는 것을 권장

## 버전 표기법 비교

| 표기법 | 의미 | 1.2.3에서 허용되는 버전 |
|--------|------|-------------------------|
| `^1.2.3` | MINOR, PATCH 허용 | 1.2.3 ~ 1.x.x |
| `~1.2.3` | PATCH만 허용 | 1.2.3 ~ 1.2.x |
| `1.2.3` | 정확한 버전 | 1.2.3만 |
| `>=1.2.3` | 1.2.3 이상 | 1.2.3 ~ ∞ |
| `1.2.x` | 1.2 시리즈 | 1.2.0 ~ 1.2.x |
| `*` | 모든 버전 | 모두 |

## Pre-release 버전

### 알파 (Alpha)

```
1.0.0-alpha
1.0.0-alpha.1
```

- 초기 개발 버전
- 불안정, 기능 미완성

### 베타 (Beta)

```
1.0.0-beta
1.0.0-beta.1
```

- 기능 완성, 테스트 중
- 버그 가능

### RC (Release Candidate)

```
1.0.0-rc.1
1.0.0-rc.2
```

- 릴리스 후보
- 거의 완성, 최종 테스트 중

### 버전 순서

```
1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-beta < 1.0.0-rc.1 < 1.0.0
```

## 0.x.x 버전 (초기 개발)

```
0.1.0 → 초기 개발
0.2.0 → 기능 추가
0.9.0 → 거의 완성
1.0.0 → 첫 정식 릴리스
```

- `0.x.x`: 초기 개발 단계
- API가 변경될 수 있음
- `1.0.0`부터 SemVer 엄격히 적용

## Best Practices

### 1. 프로젝트 시작

```json
{
  "version": "0.1.0"
}
```

### 2. 첫 정식 릴리스

```json
{
  "version": "1.0.0"
}
```

### 3. 버그 수정

```bash
# 1.0.0 → 1.0.1
npm version patch
```

### 4. 기능 추가

```bash
# 1.0.0 → 1.1.0
npm version minor
```

### 5. Breaking Change

```bash
# 1.0.0 → 2.0.0
npm version major
```

## npm version 명령어

```bash
# 버전 확인
npm version

# PATCH 증가
npm version patch     # 1.0.0 → 1.0.1

# MINOR 증가
npm version minor     # 1.0.0 → 1.1.0

# MAJOR 증가
npm version major     # 1.0.0 → 2.0.0

# Pre-release
npm version prerelease  # 1.0.0 → 1.0.1-0

# 특정 버전 지정
npm version 2.0.0

# Git 태그 생성 (기본값)
npm version patch -m "Release %s"

# Git 태그 생성 안 함
npm version patch --no-git-tag-version
```

## 의존성 버전 선택 가이드

### 프로덕션 애플리케이션

```json
{
  "dependencies": {
    "express": "~4.18.0"    // PATCH만 (안정성 우선)
  }
}
```

### 라이브러리 개발

```json
{
  "dependencies": {
    "lodash": "^4.17.0"     // MINOR 허용 (유연성)
  },
  "peerDependencies": {
    "react": ">=16.8.0"     // 넓은 범위
  }
}
```

### 테스트 환경

```json
{
  "devDependencies": {
    "jest": "^29.0.0"       // 최신 기능 활용
  }
}
```

## 주의사항

### 1. 캐럿(^)의 특수한 경우

```
^0.2.3 → 0.2.3 이상 0.3.0 미만 (PATCH만)
^0.0.3 → 0.0.3만 (정확한 버전)
```

0.x.x 버전에서는 ^ 동작이 다름!

### 2. package-lock.json

```json
{
  "dependencies": {
    "express": "^4.18.0"  // package.json
  }
}
```

실제 설치된 버전은 package-lock.json에 기록:

```json
{
  "express": {
    "version": "4.18.2"   // 정확한 버전 고정
  }
}
```

## 실전 예제

### 시나리오 1: 버그 수정 릴리스

```
현재 버전: 1.2.3
변경사항: 로그인 버그 수정
새 버전: 1.2.4 (PATCH)
```

### 시나리오 2: 새 기능 추가

```
현재 버전: 1.2.4
변경사항: 다크모드 추가
새 버전: 1.3.0 (MINOR)
```

### 시나리오 3: API 변경

```
현재 버전: 1.3.0
변경사항: 함수 시그니처 변경
새 버전: 2.0.0 (MAJOR)
```

## 참고 자료

- [Semantic Versioning 공식 사이트](https://semver.org/)
- [npm semver calculator](https://semver.npmjs.com/)
- [npm version 문서](https://docs.npmjs.com/cli/version)
