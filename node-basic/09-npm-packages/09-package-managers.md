# 패키지 매니저 비교: npm vs yarn vs pnpm

## 개요

JavaScript 생태계에는 주로 3가지 패키지 매니저가 사용됩니다:
- **npm**: Node.js 기본 패키지 매니저
- **Yarn**: Facebook이 개발한 대안
- **pnpm**: 디스크 공간 효율적인 패키지 매니저

## npm (Node Package Manager)

### 개요
- Node.js와 함께 자동 설치
- 가장 많이 사용됨
- 공식 패키지 매니저

### 장점
- ✅ 추가 설치 불필요
- ✅ 가장 널리 사용됨 (커뮤니티 지원)
- ✅ 공식 지원
- ✅ 문서 풍부

### 단점
- ❌ 다른 패키지 매니저보다 느림
- ❌ 디스크 공간 많이 사용
- ❌ 과거에 보안 이슈 있었음

### 주요 명령어

```bash
# 초기화
npm init
npm init -y

# 패키지 설치
npm install
npm install <package>
npm install <package>@<version>
npm install --save-dev <package>

# 패키지 제거
npm uninstall <package>

# 업데이트
npm update
npm update <package>

# 정보 확인
npm list
npm outdated
npm view <package>

# 캐시 관리
npm cache clean --force

# 실행
npm run <script>
```

## Yarn

### 개요
- Facebook(Meta)이 개발
- npm의 성능/보안 문제 해결을 위해 탄생
- Yarn Classic (v1) 과 Yarn Berry (v2+) 존재

### 장점
- ✅ npm보다 빠름 (병렬 설치)
- ✅ yarn.lock으로 일관된 설치
- ✅ 오프라인 캐시
- ✅ 워크스페이스 지원 우수

### 단점
- ❌ 별도 설치 필요
- ❌ Yarn Berry는 호환성 이슈 가능
- ❌ npm보다 커뮤니티 작음

### 주요 명령어

```bash
# 초기화
yarn init
yarn init -y

# 패키지 설치
yarn
yarn install
yarn add <package>
yarn add <package>@<version>
yarn add --dev <package>

# 패키지 제거
yarn remove <package>

# 업데이트
yarn upgrade
yarn upgrade <package>

# 정보 확인
yarn list
yarn outdated
yarn info <package>

# 캐시 관리
yarn cache clean

# 실행
yarn <script>
yarn run <script>
```

## pnpm (Performant npm)

### 개요
- 디스크 공간 효율성에 집중
- 하드 링크 사용으로 중복 제거
- 빠르고 엄격한 의존성 관리

### 장점
- ✅ 매우 빠름
- ✅ 디스크 공간 절약 (하드 링크)
- ✅ 엄격한 의존성 관리
- ✅ 모노레포 지원 우수

### 단점
- ❌ 별도 설치 필요
- ❌ 상대적으로 작은 커뮤니티
- ❌ 학습 곡선

### 주요 명령어

```bash
# 초기화
pnpm init

# 패키지 설치
pnpm install
pnpm add <package>
pnpm add -D <package>

# 패키지 제거
pnpm remove <package>

# 업데이트
pnpm update
pnpm update <package>

# 정보 확인
pnpm list
pnpm outdated

# 캐시 관리
pnpm store prune

# 실행
pnpm <script>
pnpm run <script>
```

## 성능 비교

### 설치 속도 (100개 패키지 기준)

```
pnpm:  ~10초  ⚡⚡⚡
Yarn:  ~15초  ⚡⚡
npm:   ~25초  ⚡
```

### 디스크 사용량 (10개 프로젝트)

```
pnpm:  500MB  💾
Yarn:  2GB    💾💾💾
npm:   2.5GB  💾💾💾💾
```

## 명령어 비교표

| 작업 | npm | Yarn | pnpm |
|------|-----|------|------|
| 초기화 | `npm init` | `yarn init` | `pnpm init` |
| 설치 | `npm install` | `yarn` | `pnpm install` |
| 패키지 추가 | `npm install pkg` | `yarn add pkg` | `pnpm add pkg` |
| 개발 의존성 | `npm i -D pkg` | `yarn add -D pkg` | `pnpm add -D pkg` |
| 제거 | `npm uninstall pkg` | `yarn remove pkg` | `pnpm remove pkg` |
| 업데이트 | `npm update` | `yarn upgrade` | `pnpm update` |
| 스크립트 실행 | `npm run script` | `yarn script` | `pnpm script` |
| 전역 설치 | `npm i -g pkg` | `yarn global add pkg` | `pnpm add -g pkg` |

## Lock 파일 비교

### package-lock.json (npm)

```json
{
  "name": "project",
  "version": "1.0.0",
  "lockfileVersion": 3,
  "packages": {
    "node_modules/express": {
      "version": "4.18.2",
      "resolved": "https://...",
      "integrity": "sha512-..."
    }
  }
}
```

### yarn.lock (Yarn)

```yaml
express@^4.18.0:
  version "4.18.2"
  resolved "https://..."
  integrity sha512-...
  dependencies:
    accepts "~1.3.8"
```

### pnpm-lock.yaml (pnpm)

```yaml
dependencies:
  express: 4.18.2

packages:
  /express/4.18.2:
    resolution: {integrity: sha512-...}
    dependencies:
      accepts: 1.3.8
```

## 워크스페이스 (Monorepo) 지원

### npm (v7+)

```json
{
  "name": "monorepo",
  "workspaces": [
    "packages/*"
  ]
}
```

### Yarn

```json
{
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

### pnpm

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

## 설치 방법

### npm

```bash
# Node.js와 함께 자동 설치
node --version
npm --version
```

### Yarn

```bash
# npm으로 설치
npm install -g yarn

# 또는 다른 방법
corepack enable  # Node.js 16.10+
```

### pnpm

```bash
# npm으로 설치
npm install -g pnpm

# 또는 스크립트 사용
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

## 어떤 것을 선택할까?

### npm 선택 시기

- ✅ 간단한 프로젝트
- ✅ 추가 도구 설치 원하지 않음
- ✅ 최대 호환성 필요
- ✅ 초보자

### Yarn 선택 시기

- ✅ 빠른 설치 속도 필요
- ✅ 모노레포 프로젝트
- ✅ 오프라인 작업
- ✅ 팀에서 이미 사용 중

### pnpm 선택 시기

- ✅ 디스크 공간 절약 중요
- ✅ 엄격한 의존성 관리
- ✅ 모노레포 프로젝트
- ✅ 성능 최우선

## 마이그레이션

### npm → Yarn

```bash
# npm 삭제
rm -rf node_modules package-lock.json

# Yarn 설치
yarn install
```

### npm → pnpm

```bash
# npm 삭제
rm -rf node_modules package-lock.json

# pnpm 설치
pnpm install
```

### Yarn → npm

```bash
# Yarn 삭제
rm -rf node_modules yarn.lock

# npm 설치
npm install
```

## Best Practices

### 1. Lock 파일 커밋

```bash
# Git에 커밋 필수
git add package-lock.json  # npm
git add yarn.lock          # Yarn
git add pnpm-lock.yaml     # pnpm
```

### 2. 팀 내 통일

```json
{
  "engines": {
    "npm": ">=8.0.0",
    "node": ">=16.0.0"
  }
}
```

### 3. CI/CD 설정

```yaml
# GitHub Actions 예시
- name: Install dependencies
  run: npm ci  # 또는 yarn install --frozen-lockfile
```

## 2025년 현재 상황

### 사용률
1. **npm**: ~60% (여전히 가장 많이 사용)
2. **Yarn**: ~30% (안정적인 선택)
3. **pnpm**: ~10% (빠르게 성장 중)

### 트렌드
- pnpm이 빠르게 성장 중
- Yarn Berry (v2+) 채택 증가
- npm 성능 개선 지속

## 추천

| 프로젝트 유형 | 추천 |
|--------------|------|
| 개인 프로젝트 | npm 또는 pnpm |
| 팀 프로젝트 | Yarn 또는 pnpm |
| 모노레포 | pnpm 또는 Yarn |
| 엔터프라이즈 | Yarn Classic |
| 오픈소스 | npm (호환성) |

## 참고 자료

- [npm 공식 문서](https://docs.npmjs.com/)
- [Yarn 공식 문서](https://yarnpkg.com/)
- [pnpm 공식 문서](https://pnpm.io/)
