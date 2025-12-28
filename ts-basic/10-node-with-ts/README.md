# 10. Node.js + TypeScript

node-basic에서 배운 Node.js API를 이제 **TypeScript로 타입 안전하게** 작성합니다. 이 모듈에서는 fs, path, http 등 Node.js 핵심 모듈을 TypeScript로 다루는 방법을 익힙니다.

## 학습 목표

- **@types/node** 패키지 이해
- **fs, path, http** 등 Node.js API 타입
- **Buffer, Stream** 타입 처리
- **process, os** 타입 안전하게 사용
- **Node.js 프로젝트 설정** (tsconfig.json)

## 목차

### 기본 Node.js 타입
- [01-types-node-setup.ts](#01-types-node-setupts) - @types/node 설정
- [02-fs-types.ts](#02-fs-typests) - fs 모듈 타입
- [03-path-types.ts](#03-path-typests) - path 모듈 타입
- [04-process-types.ts](#04-process-typests) - process 객체 타입

### 고급 Node.js 타입
- [05-buffer-types.ts](#05-buffer-typests) - Buffer 타입
- [06-stream-types.ts](#06-stream-typests) - Stream 타입
- [07-http-types.ts](#07-http-typests) - http 서버 타입
- [08-events-types.ts](#08-events-typests) - EventEmitter 타입

### 실전
- [09-practical-examples.ts](#09-practical-examplests) - 실전 Node.js + TS 패턴

## 예제 파일 개요

### 01-types-node-setup.ts
**@types/node 설정**

- @types/node 패키지 설치
- tsconfig.json 설정 (types, lib)
- Node.js 버전별 타입
- ESM vs CommonJS 타입
- __dirname, __filename 타입
- NodeJS 네임스페이스
- global 객체 타입

### 02-fs-types.ts
**fs 모듈 타입**

- fs 동기 API 타입
- fs 콜백 API 타입
- fs/promises API 타입 (권장)
- Buffer vs string 반환 타입
- 에러 타입 (NodeJS.ErrnoException)
- PathLike 타입 (string | Buffer | URL)
- ReadStream, WriteStream 타입

### 03-path-types.ts
**path 모듈 타입**

- path.join, path.resolve 타입
- path.parse 반환 타입
- path.sep, path.delimiter 타입
- 크로스 플랫폼 경로 처리
- URL과 path 변환

### 04-process-types.ts
**process 객체 타입**

- process.argv 타입 (string[])
- process.env 타입 (NodeJS.ProcessEnv)
- process.cwd, process.chdir 타입
- process.exit 타입
- process.on 이벤트 타입
- 환경 변수 타입 안전하게 다루기

### 05-buffer-types.ts
**Buffer 타입**

- Buffer 생성 타입
- Buffer.from 타입
- Buffer vs Uint8Array
- Buffer 메서드 타입
- 인코딩 타입 (BufferEncoding)
- Buffer와 string 변환

### 06-stream-types.ts
**Stream 타입**

- Readable, Writable, Duplex, Transform
- stream.pipeline 타입
- stream.on 이벤트 타입
- 제네릭 스트림 타입
- 커스텀 스트림 타입
- async iterator 타입

### 07-http-types.ts
**http 서버 타입**

- http.Server 타입
- IncomingMessage, ServerResponse 타입
- RequestListener 타입
- http.get, http.request 타입
- Header 타입
- 미들웨어 타입 패턴

### 08-events-types.ts
**EventEmitter 타입**

- EventEmitter 타입
- on, emit 타입
- 제네릭 EventEmitter
- 타입 안전한 이벤트 맵
- 커스텀 이벤트 타입
- once, off 타입

### 09-practical-examples.ts
**실전 Node.js + TS 패턴**

- 타입 안전한 CLI 도구
- 타입 안전한 파일 처리
- 타입 안전한 HTTP 서버
- 환경 변수 검증
- 에러 처리 패턴
- Logger 유틸리티
- 설정 파일 로더

## 핵심 개념 요약

### Node.js 타입 패키지

| 패키지 | 용도 | 설치 |
|--------|------|------|
| **@types/node** | Node.js API 타입 | `npm i -D @types/node` |
| **tsx** | TypeScript 직접 실행 | `npm i -D tsx` |
| **ts-node** | TypeScript REPL, 실행 | `npm i -D ts-node` |

### 주요 Node.js 타입

| 모듈 | 타입 | 설명 |
|------|------|------|
| **fs** | `fs.promises.*` | Promise 기반 (권장) |
| **path** | `path.join(...)` | 경로 문자열 반환 |
| **process** | `NodeJS.Process` | 프로세스 객체 |
| **Buffer** | `Buffer` | 바이너리 데이터 |
| **http** | `http.Server`, `IncomingMessage` | HTTP 서버 |
| **events** | `EventEmitter` | 이벤트 에미터 |

### 환경 변수 타입

```typescript
// ❌ 타입 안전하지 않음
const port = process.env.PORT;  // string | undefined

// ✅ 타입 가드로 안전하게
const port = Number(process.env.PORT ?? '3000');

// ✅ Zod로 검증
import { z } from 'zod';
const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production']),
});
const env = envSchema.parse(process.env);
```

### 에러 타입

| 에러 타입 | 사용 위치 | 프로퍼티 |
|-----------|-----------|----------|
| **NodeJS.ErrnoException** | fs, net 등 | code, errno, syscall, path |
| **Error** | 일반 에러 | message, stack |

## 언제 무엇을 쓸까?

| 작업 | API | 타입 | 이유 |
|------|-----|------|------|
| 파일 읽기 | `fs.promises.readFile` | `Promise<Buffer \| string>` | async/await 사용 |
| 경로 조작 | `path.join` | `string` | 크로스 플랫폼 |
| 환경 변수 | `process.env` + Zod | 검증된 타입 | 런타임 안전성 |
| HTTP 서버 | Express/Fastify | 타입 지원 프레임워크 | 생산성 |
| CLI 인자 | `process.argv` | `string[]` | 파싱 필요 |

## 자주 하는 실수

### 1. process.env 타입 신뢰
❌ `const port = process.env.PORT;` - string | undefined
✅ Zod로 검증 또는 기본값 제공

### 2. fs 동기 API 사용
❌ `fs.readFileSync` - 블로킹
✅ `fs.promises.readFile` - 비동기

### 3. __dirname을 ESM에서 사용
❌ ESM에서 __dirname 없음
✅ `import.meta.url` + `fileURLToPath` 사용

### 4. Buffer vs string 혼동
❌ `fs.readFile` 기본 반환 타입은 Buffer
✅ 인코딩 지정: `fs.readFile(path, 'utf-8')`

### 5. 에러 타입 단언
❌ `catch (err) { (err as Error).message }`
✅ 타입 가드: `if (err instanceof Error)`

## Best Practices

**✅ fs.promises 사용**
```typescript
import { readFile, writeFile } from 'fs/promises';

async function processFile(path: string) {
  const content = await readFile(path, 'utf-8');  // string 반환
  await writeFile(path, content.toUpperCase());
}
```

**✅ 환경 변수 검증**
```typescript
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().regex(/^\d+$/).transform(Number),
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

**✅ 타입 안전한 이벤트 에미터**
```typescript
import { EventEmitter } from 'events';

interface Events {
  'data': (data: string) => void;
  'error': (error: Error) => void;
}

class TypedEmitter extends EventEmitter {
  on<K extends keyof Events>(event: K, listener: Events[K]): this {
    return super.on(event, listener);
  }

  emit<K extends keyof Events>(
    event: K,
    ...args: Parameters<Events[K]>
  ): boolean {
    return super.emit(event, ...args);
  }
}
```

**✅ PathLike 타입 활용**
```typescript
import { PathLike } from 'fs';

async function readConfig(path: PathLike): Promise<object> {
  const content = await readFile(path, 'utf-8');
  return JSON.parse(content);
}

// string, Buffer, URL 모두 가능
readConfig('./config.json');
readConfig(new URL('file:///path/to/config.json'));
```

**✅ 에러 타입 가드**
```typescript
function isNodeError(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error && 'code' in err;
}

try {
  await readFile('nonexistent.txt');
} catch (err) {
  if (isNodeError(err) && err.code === 'ENOENT') {
    console.error('File not found');
  }
}
```

## tsconfig.json 설정 (Node.js)

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "lib": ["esnext"],
    "types": ["node"],
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## 다음 단계

이 모듈을 완료했다면:
- **[11-async-typescript](../11-async-typescript/)** - Promise, async/await 타입 처리
- **[12-modules-imports](../12-modules-imports/)** - ES6 모듈, import/export

## 참고 자료

### 공식 문서
- [@types/node](https://www.npmjs.com/package/@types/node)
- [Node.js TypeScript Guide](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) - @types 소스

### 도구
- [tsx](https://github.com/privatenumber/tsx) - TypeScript 실행 (빠름, 권장)
- [ts-node](https://typestrong.org/ts-node/) - TypeScript 실행 (전통적)

---

**시작하기:** [01-types-node-setup.ts](./01-types-node-setup.ts)
