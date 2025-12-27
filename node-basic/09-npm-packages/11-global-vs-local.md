# 글로벌 vs 로컬 패키지 설치

## 개요

npm 패키지는 두 가지 방식으로 설치할 수 있습니다:
- **로컬 설치**: 프로젝트별로 설치
- **글로벌 설치**: 시스템 전체에서 사용

## 로컬 설치 (Local Installation)

### 기본 개념

```bash
# 로컬 설치 (기본값)
npm install <package-name>

# 또는
npm install <package-name> --save
```

### 설치 위치

```
my-project/
├── node_modules/     ← 여기에 설치됨
│   └── <package>/
├── package.json
└── package-lock.json
```

### 특징

- ✅ 프로젝트별로 독립적인 버전
- ✅ package.json에 기록
- ✅ 팀원 간 동일한 환경
- ✅ 버전 충돌 없음
- ✅ node_modules에서 자동 로드

### 사용 예시

```json
{
  "dependencies": {
    "express": "^4.18.0",
    "lodash": "^4.17.0"
  }
}
```

```javascript
// 코드에서 사용
const express = require('express');
const _ = require('lodash');
```

### 실행 방법

#### 1. npm scripts 사용 (권장)

```json
{
  "scripts": {
    "dev": "nodemon src/index.js",
    "test": "jest"
  }
}
```

```bash
npm run dev
npm test
```

#### 2. npx 사용

```bash
# 로컬 설치된 패키지 실행
npx nodemon src/index.js
npx jest

# 일회성 실행 (설치하지 않고)
npx create-react-app my-app
```

#### 3. node_modules/.bin 직접 실행

```bash
./node_modules/.bin/nodemon src/index.js
```

## 글로벌 설치 (Global Installation)

### 기본 개념

```bash
# 글로벌 설치
npm install -g <package-name>

# 또는
npm install --global <package-name>
```

### 설치 위치

```bash
# Windows
C:\Users\<Username>\AppData\Roaming\npm\node_modules

# macOS/Linux
/usr/local/lib/node_modules
```

### 확인 방법

```bash
# 글로벌 설치 위치
npm root -g

# 글로벌 패키지 목록
npm list -g --depth=0
```

### 특징

- ✅ 어디서나 CLI 명령어로 실행
- ✅ 한 번 설치로 모든 프로젝트에서 사용
- ❌ 프로젝트별 버전 관리 어려움
- ❌ 팀원 간 버전 불일치 가능
- ❌ package.json에 기록 안 됨

### 글로벌 설치가 적합한 패키지

```bash
# CLI 도구
npm install -g typescript
npm install -g nodemon
npm install -g pm2
npm install -g eslint
npm install -g prettier

# 프로젝트 생성 도구
npm install -g create-react-app
npm install -g @vue/cli
npm install -g @angular/cli

# 유틸리티
npm install -g http-server
npm install -g json-server
```

## 비교표

| 항목 | 로컬 설치 | 글로벌 설치 |
|------|-----------|-------------|
| 명령어 | `npm install pkg` | `npm install -g pkg` |
| 설치 위치 | `./node_modules` | 시스템 전역 |
| package.json | 기록됨 | 기록 안 됨 |
| 버전 관리 | 프로젝트별 | 시스템당 하나 |
| CLI 실행 | npx 또는 npm scripts | 바로 실행 가능 |
| 팀 협업 | 쉬움 | 어려움 |
| 권한 | 일반 사용자 | 관리자 필요 (경우에 따라) |

## npx - 더 나은 방법

### npx란?

npm 5.2+ 버전부터 포함된 패키지 실행 도구

### 장점

```bash
# 1. 로컬 패키지 실행
npx jest

# 2. 글로벌 설치 없이 일회성 실행
npx create-react-app my-app

# 3. 특정 버전 실행
npx typescript@4.9.0 --version

# 4. GitHub 저장소 직접 실행
npx github:user/repo
```

### 기존 방식 vs npx

```bash
# 기존 방식
npm install -g create-react-app
create-react-app my-app

# npx 방식 (권장)
npx create-react-app my-app
```

## 모범 사례 (Best Practices)

### 1. 대부분은 로컬 설치

```bash
# ✅ 로컬 설치
npm install eslint --save-dev
npm install webpack --save-dev
```

### 2. CLI 도구만 글로벌

```bash
# ✅ 글로벌 설치
npm install -g typescript
npm install -g nodemon
```

### 3. npx 활용

```bash
# ✅ 설치 없이 실행
npx create-react-app my-app
npx degit user/repo my-project
```

### 4. 버전 고정

```json
{
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

## 문제 상황 및 해결

### 문제 1: 글로벌 패키지 버전 충돌

```bash
# 프로젝트 A: TypeScript 4.x 필요
# 프로젝트 B: TypeScript 5.x 필요

# ❌ 글로벌 설치 (하나만 가능)
npm install -g typescript@4.x

# ✅ 로컬 설치 (각각 가능)
cd project-a && npm install typescript@4.x
cd project-b && npm install typescript@5.x
```

### 문제 2: 팀원 간 버전 불일치

```bash
# ❌ 글로벌 설치 (팀원마다 다를 수 있음)
npm install -g webpack

# ✅ 로컬 설치 + package.json
npm install webpack --save-dev
```

### 문제 3: CI/CD 환경

```yaml
# ❌ 글로벌 패키지 의존
- run: webpack build

# ✅ 로컬 패키지 + npm scripts
- run: npm install
- run: npm run build
```

## 권한 문제 해결

### macOS/Linux

```bash
# ❌ sudo 사용하지 말 것
sudo npm install -g <package>

# ✅ npm 디렉토리 권한 변경
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# ✅ nvm 사용 (권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install node
```

### Windows

```bash
# 관리자 권한으로 PowerShell 실행
npm install -g <package>
```

## 언제 어떤 것을 사용할까?

### 로컬 설치 선택 시

- ✅ 프로젝트 의존성
- ✅ 라이브러리
- ✅ 프레임워크
- ✅ 빌드 도구
- ✅ 테스트 프레임워크
- ✅ 린터/포매터

예시:
```bash
npm install express
npm install react
npm install webpack --save-dev
npm install jest --save-dev
```

### 글로벌 설치 선택 시

- ✅ CLI 도구 (자주 사용)
- ✅ 프로젝트 생성 도구
- ✅ 개발 유틸리티

예시:
```bash
npm install -g typescript
npm install -g nodemon
npm install -g http-server
```

### npx 사용 시

- ✅ 일회성 명령어
- ✅ 프로젝트 생성
- ✅ 최신 버전 사용

예시:
```bash
npx create-react-app my-app
npx prettier --write .
npx degit user/repo my-project
```

## package.json vs 글로벌

### package.json에 기록 (로컬)

```json
{
  "devDependencies": {
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "typescript": "^4.9.0"
  },
  "scripts": {
    "lint": "eslint .",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit"
  }
}
```

**장점**:
- 팀원 모두 동일한 버전
- CI/CD 자동화 쉬움
- 프로젝트 이동 시 npm install 한 번

### 글로벌 설치

```bash
npm install -g eslint prettier typescript
```

**단점**:
- 팀원마다 버전 다를 수 있음
- 새로운 개발자 온보딩 어려움
- CI/CD 설정 복잡

## 결론

### 원칙

1. **기본은 로컬 설치**
2. **CLI 도구만 글로벌 설치**
3. **일회성은 npx 사용**
4. **팀 프로젝트는 package.json에 모두 기록**

### 체크리스트

- [ ] 프로젝트 의존성 → 로컬 설치
- [ ] CLI 도구 → 글로벌 또는 npx
- [ ] package.json에 모든 의존성 기록
- [ ] npm scripts로 명령어 통일
- [ ] CI/CD에서 글로벌 설치 지양

## 참고 자료

- [npm install 문서](https://docs.npmjs.com/cli/install)
- [npx 가이드](https://docs.npmjs.com/cli/npx)
- [package.json 문서](https://docs.npmjs.com/cli/package-json)
