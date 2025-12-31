/**
 * 09-practical-examples.ts
 * 실전 유틸리티 타입 조합 패턴
 *
 * 실무에서는 유틸리티 타입을 단독으로 쓰기보다는 여러 개를 조합해서 복잡한 타입 변환을 수행합니다.
 * 이 파일에서는 Partial + Pick으로 부분 업데이트 타입, Omit + Required로 필수 필드 변경, Record + Readonly로 불변 맵, ReturnType + Awaited로 async 결과 타입, API 타입 변환 파이프라인, 폼 상태 관리, DTO ↔ Entity 변환, 그리고 상태 관리 패턴을 다룹니다.
 */

// ============================================================
// 1. Partial + Pick 조합 - 부분 업데이트
// ============================================================
console.log('\n=== 1. Partial + Pick 조합 ===');

interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

// 프로필 업데이트: id, createdAt, updatedAt 제외, 나머지는 선택적
type ProfileUpdateDTO = Partial<
  Pick<User, 'username' | 'email' | 'firstName' | 'lastName'>
>;

const profileUpdate: ProfileUpdateDTO = {
  firstName: 'Alice',
  lastName: 'Wonder',
};

console.log('Profile Update:', profileUpdate);

// ============================================================
// 2. Omit + Required 조합 - 필수 필드 변경
// ============================================================
console.log('\n=== 2. Omit + Required 조합 ===');

interface Config {
  host?: string;
  port?: number;
  debug?: boolean;
  apiKey?: string;
}

// apiKey는 필수로, 나머지는 그대로
type SecureConfig = Required<Pick<Config, 'apiKey'>> & Omit<Config, 'apiKey'>;

const secureConfig: SecureConfig = {
  apiKey: 'required-key', // 필수
  host: 'localhost', // 선택적
};

console.log('Secure Config:', secureConfig);

// ============================================================
// 3. Record + Readonly 조합 - 불변 맵
// ============================================================
console.log('\n=== 3. Record + Readonly 조합 ===');

type HttpStatus = 200 | 400 | 401 | 403 | 404 | 500;

const HTTP_STATUS_MESSAGES: Readonly<Record<HttpStatus, string>> = {
  200: 'OK',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
};

// HTTP_STATUS_MESSAGES[200] = 'Changed'; // ❌ Error: read-only

console.log('HTTP Status Messages:', HTTP_STATUS_MESSAGES[404]);

// ============================================================
// 4. ReturnType + Awaited 조합 - async 결과 타입
// ============================================================
console.log('\n=== 4. ReturnType + Awaited 조합 ===');

async function fetchUserData(userId: string) {
  return {
    user: {
      id: userId,
      name: 'Alice',
      email: 'alice@example.com',
    },
    posts: [
      { id: 'p1', title: 'Post 1', likes: 10 },
      { id: 'p2', title: 'Post 2', likes: 20 },
    ],
    followers: 100,
  };
}

// async 함수의 반환 타입 추출
type UserData = Awaited<ReturnType<typeof fetchUserData>>;
type UserInfo = UserData['user'];
type Post = UserData['posts'][number];

const userData: UserData = {
  user: { id: 'u1', name: 'Bob', email: 'bob@example.com' },
  posts: [{ id: 'p1', title: 'Post', likes: 5 }],
  followers: 50,
};

console.log('User Data:', userData);

// ============================================================
// 5. 유틸리티 체인 - Partial<Omit<T, K>>
// ============================================================
console.log('\n=== 5. 유틸리티 체인 ===');

interface Article {
  id: string;
  title: string;
  content: string;
  authorId: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
}

// 업데이트 DTO: id 제외, 나머지는 선택적
type UpdateArticleDTO = Partial<Omit<Article, 'id'>>;

// 생성 DTO: id, publishedAt, updatedAt 제외
type CreateArticleDTO = Omit<Article, 'id' | 'publishedAt' | 'updatedAt'>;

// 목록 DTO: 일부 필드만 + 읽기 전용
type ArticleListItem = Readonly<Pick<Article, 'id' | 'title' | 'publishedAt'>>;

const updateDto: UpdateArticleDTO = {
  title: 'Updated Title',
  tags: ['typescript', 'utility-types'],
};

const createDto: CreateArticleDTO = {
  title: 'New Article',
  content: 'Content here',
  authorId: 'a1',
  tags: ['new'],
};

const listItem: ArticleListItem = {
  id: 'art1',
  title: 'Article',
  publishedAt: new Date(),
};

console.log('Update DTO:', updateDto);
console.log('Create DTO:', createDto);
console.log('List Item:', listItem);

// ============================================================
// 6. API 타입 변환 파이프라인
// ============================================================
console.log('\n=== 6. API 타입 변환 파이프라인 ===');

interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  supplierId: string;
  costPrice: number; // 내부용
  margin: number; // 내부용
  createdAt: Date;
  updatedAt: Date;
}

// 1. 공개 API 응답: 내부 필드 제거
type ProductPublicAPI = Omit<ProductEntity, 'costPrice' | 'margin'>;

// 2. 생성 요청: id, 날짜 제외
type CreateProductRequest = Omit<ProductEntity, 'id' | 'createdAt' | 'updatedAt'>;

// 3. 업데이트 요청: id 제외, 나머지 선택적
type UpdateProductRequest = Partial<Omit<ProductEntity, 'id'>>;

// 4. 목록 응답: 간략한 정보만
type ProductListResponse = Pick<ProductEntity, 'id' | 'name' | 'price' | 'stock'>;

// 5. 관리자 전용: 모든 필드 + 읽기 전용
type ProductAdminView = Readonly<ProductEntity>;

const publicProduct: ProductPublicAPI = {
  id: 'p1',
  name: 'Laptop',
  description: 'High-performance',
  price: 1500,
  stock: 10,
  categoryId: 'cat1',
  supplierId: 'sup1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

console.log('Public Product:', publicProduct);

// ============================================================
// 7. 폼 상태 관리 타입
// ============================================================
console.log('\n=== 7. 폼 상태 관리 타입 ===');

interface RegistrationForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// 폼 필드: 점진적으로 채워지므로 선택적
type FormFields = Partial<RegistrationForm>;

// 필드 에러: 각 필드마다 에러 메시지 (선택적)
type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

// 필드 터치 여부: boolean 맵
type FormTouched = Partial<Record<keyof RegistrationForm, boolean>>;

// 폼 상태
interface FormState {
  fields: FormFields;
  errors: FormErrors;
  touched: FormTouched;
  isSubmitting: boolean;
}

const formState: FormState = {
  fields: {
    username: 'alice',
    email: 'alice@example.com',
  },
  errors: {
    password: 'Password is required',
  },
  touched: {
    username: true,
    email: true,
  },
  isSubmitting: false,
};

console.log('Form State:', formState);

// ============================================================
// 8. DTO ↔ Entity 변환
// ============================================================
console.log('\n=== 8. DTO ↔ Entity 변환 ===');

interface OrderEntity {
  id: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO → Entity 변환을 위한 타입
type CreateOrderDTO = Omit<OrderEntity, 'id' | 'status' | 'createdAt' | 'updatedAt'>;

// Entity → Response DTO 변환
type OrderResponseDTO = Omit<OrderEntity, 'paymentMethod'> & {
  customerName: string;
};

// 목록용 DTO
type OrderListItemDTO = Pick<OrderEntity, 'id' | 'totalAmount' | 'status' | 'createdAt'>;

function createOrder(dto: CreateOrderDTO): OrderEntity {
  return {
    ...dto,
    id: 'o' + Math.random(),
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function toResponseDTO(entity: OrderEntity, customerName: string): OrderResponseDTO {
  const { paymentMethod, ...rest } = entity;
  return { ...rest, customerName };
}

const orderDto: CreateOrderDTO = {
  userId: 'u1',
  items: [{ productId: 'p1', quantity: 2, price: 100 }],
  totalAmount: 200,
  paymentMethod: 'credit_card',
  shippingAddress: '123 Main St',
};

const orderEntity = createOrder(orderDto);
const orderResponse = toResponseDTO(orderEntity, 'Alice');

console.log('Order Response:', orderResponse);

// ============================================================
// 9. 타입 안전한 이벤트 시스템
// ============================================================
console.log('\n=== 9. 타입 안전한 이벤트 시스템 ===');

type EventMap = {
  userLogin: { userId: string; timestamp: Date };
  userLogout: { userId: string };
  dataUpdate: { entityType: string; entityId: string };
  error: { code: string; message: string };
};

type EventType = keyof EventMap;
type EventPayload<T extends EventType> = EventMap[T];
type EventHandler<T extends EventType> = (payload: EventPayload<T>) => void;

type EventHandlers = {
  [K in EventType]?: EventHandler<K>[];
};

class TypedEventEmitter {
  private handlers: EventHandlers = {};

  on<T extends EventType>(event: T, handler: EventHandler<T>): void {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]!.push(handler as EventHandler<EventType>);
  }

  emit<T extends EventType>(event: T, payload: EventPayload<T>): void {
    const eventHandlers = this.handlers[event];
    if (eventHandlers) {
      eventHandlers.forEach((handler) => handler(payload));
    }
  }
}

const emitter = new TypedEventEmitter();

emitter.on('userLogin', (data) => {
  console.log(`User ${data.userId} logged in at ${data.timestamp}`);
});

emitter.emit('userLogin', { userId: 'u1', timestamp: new Date() });

// ============================================================
// 10. 상태 관리 패턴
// ============================================================
console.log('\n=== 10. 상태 관리 패턴 ===');

interface AppState {
  user: {
    id: string;
    name: string;
    isAuthenticated: boolean;
  } | null;
  products: Array<{ id: string; name: string; price: number }>;
  cart: Array<{ productId: string; quantity: number }>;
  ui: {
    isLoading: boolean;
    error: string | null;
  };
}

// 상태 업데이트는 Partial<AppState>
type StateUpdate = Partial<AppState>;

// 특정 슬라이스만 업데이트
type UserStateUpdate = Partial<AppState['user']>;
type UIStateUpdate = Partial<AppState['ui']>;

// 액션 타입
type Action =
  | { type: 'SET_USER'; payload: AppState['user'] }
  | { type: 'ADD_TO_CART'; payload: { productId: string; quantity: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, isLoading: action.payload },
      };
    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload },
      };
    default:
      return state;
  }
}

const initialState: AppState = {
  user: null,
  products: [],
  cart: [],
  ui: { isLoading: false, error: null },
};

const newState = reducer(initialState, {
  type: 'SET_USER',
  payload: { id: 'u1', name: 'Alice', isAuthenticated: true },
});

console.log('New State:', newState.user);

// ============================================================
// 11. 복잡한 타입 조합
// ============================================================
console.log('\n=== 11. 복잡한 타입 조합 ===');

interface Database {
  users: User;
  products: ProductEntity;
  orders: OrderEntity;
}

// 모든 테이블의 생성 DTO
type CreateDTOs = {
  [K in keyof Database]: Omit<Database[K], 'id' | 'createdAt' | 'updatedAt'>;
};

// 모든 테이블의 업데이트 DTO
type UpdateDTOs = {
  [K in keyof Database]: Partial<Omit<Database[K], 'id'>>;
};

// 모든 테이블의 응답 DTO (password 등 민감 정보 제거)
type ResponseDTOs = {
  [K in keyof Database]: Omit<Database[K], 'password' | 'passwordHash'>;
};

type CreateUserDTO = CreateDTOs['users'];
type UpdateUserDTO = UpdateDTOs['users'];

console.log('Complex type combinations created');

// ============================================================
// 12. Builder 패턴 타입
// ============================================================
console.log('\n=== 12. Builder 패턴 타입 ===');

interface QueryBuilder {
  select: string[];
  from: string;
  where: Record<string, unknown>;
  orderBy: string[];
  limit: number;
}

type PartialQueryBuilder = Partial<QueryBuilder>;
type RequiredQueryBuilder = Required<PartialQueryBuilder>;

class SqlQueryBuilder {
  private query: PartialQueryBuilder = {};

  select(...fields: string[]): this {
    this.query.select = fields;
    return this;
  }

  from(table: string): this {
    this.query.from = table;
    return this;
  }

  where(conditions: Record<string, unknown>): this {
    this.query.where = conditions;
    return this;
  }

  build(): Pick<QueryBuilder, 'select' | 'from'> & Partial<Omit<QueryBuilder, 'select' | 'from'>> {
    if (!this.query.select || !this.query.from) {
      throw new Error('select and from are required');
    }
    return this.query as any;
  }
}

const query = new SqlQueryBuilder()
  .select('id', 'name')
  .from('users')
  .where({ active: true })
  .build();

console.log('SQL Query:', query);

// ============================================================
// 핵심 정리
// ============================================================
console.log('\n=== 핵심 정리 ===');

/**
 * 1. Partial + Pick/Omit
 *    - Partial<Pick<T, K>>: 특정 필드만 선택 + 선택적
 *    - Partial<Omit<T, K>>: 특정 필드 제외 + 선택적
 *    - 용도: 업데이트 DTO
 *
 * 2. Required + Pick/Omit
 *    - Required<Pick<T, K>>: 특정 필드만 선택 + 필수
 *    - 용도: 부분적으로 필수 필드 지정
 *
 * 3. Readonly + Record
 *    - Readonly<Record<K, T>>: 불변 맵
 *    - 용도: 상수 설정, HTTP 상태 코드 맵
 *
 * 4. Awaited + ReturnType
 *    - Awaited<ReturnType<typeof asyncFn>>: async 함수 결과 타입
 *    - 용도: API 응답 타입 추출
 *
 * 5. 복합 조합
 *    - Readonly<Pick<T, K>>: 특정 필드만 + 읽기 전용
 *    - Partial<Omit<Required<T>, K>>: 필수화 후 특정 필드 제외 + 선택적
 *
 * 6. 실무 패턴
 *    - Create DTO: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
 *    - Update DTO: Partial<Omit<T, 'id'>>
 *    - Response DTO: Omit<T, 'password'>
 *    - List DTO: Pick<T, 'id' | 'name'> & Readonly
 *
 * 7. 타입 체인
 *    - 여러 유틸리티를 연결해서 복잡한 변환 수행
 *    - 가독성을 위해 type alias 사용
 */

console.log(`
예제:
  type UpdateDTO = Partial<Omit<Entity, 'id'>>;
  type CreateDTO = Omit<Entity, 'id' | 'createdAt' | 'updatedAt'>;
  type ResponseDTO = Readonly<Omit<Entity, 'password'>>;
  type ApiResult = Awaited<ReturnType<typeof fetchData>>;
`);
