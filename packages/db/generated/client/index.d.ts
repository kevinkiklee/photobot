
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Account
 * 
 */
export type Account = $Result.DefaultSelection<Prisma.$AccountPayload>
/**
 * Model Session
 * 
 */
export type Session = $Result.DefaultSelection<Prisma.$SessionPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model VerificationToken
 * 
 */
export type VerificationToken = $Result.DefaultSelection<Prisma.$VerificationTokenPayload>
/**
 * Model FeatureConfig
 * 
 */
export type FeatureConfig = $Result.DefaultSelection<Prisma.$FeatureConfigPayload>
/**
 * Model ConfigAuditLog
 * 
 */
export type ConfigAuditLog = $Result.DefaultSelection<Prisma.$ConfigAuditLogPayload>
/**
 * Model UserUsageMetric
 * 
 */
export type UserUsageMetric = $Result.DefaultSelection<Prisma.$UserUsageMetricPayload>
/**
 * Model DiscussionSchedule
 * 
 */
export type DiscussionSchedule = $Result.DefaultSelection<Prisma.$DiscussionSchedulePayload>
/**
 * Model AIAccessGrant
 * 
 */
export type AIAccessGrant = $Result.DefaultSelection<Prisma.$AIAccessGrantPayload>
/**
 * Model DiscussionPromptLog
 * 
 */
export type DiscussionPromptLog = $Result.DefaultSelection<Prisma.$DiscussionPromptLogPayload>
/**
 * Model Prompt
 * 
 */
export type Prompt = $Result.DefaultSelection<Prisma.$PromptPayload>
/**
 * Model PromptTag
 * 
 */
export type PromptTag = $Result.DefaultSelection<Prisma.$PromptTagPayload>
/**
 * Model PromptVote
 * 
 */
export type PromptVote = $Result.DefaultSelection<Prisma.$PromptVotePayload>
/**
 * Model PromptDuplicateFlag
 * 
 */
export type PromptDuplicateFlag = $Result.DefaultSelection<Prisma.$PromptDuplicateFlagPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TargetType: {
  SERVER: 'SERVER',
  ROLE: 'ROLE',
  CHANNEL: 'CHANNEL'
};

export type TargetType = (typeof TargetType)[keyof typeof TargetType]


export const AIGrantType: {
  ROLE: 'ROLE',
  USER: 'USER'
};

export type AIGrantType = (typeof AIGrantType)[keyof typeof AIGrantType]


export const VoteDirection: {
  UP: 'UP',
  DOWN: 'DOWN'
};

export type VoteDirection = (typeof VoteDirection)[keyof typeof VoteDirection]

}

export type TargetType = $Enums.TargetType

export const TargetType: typeof $Enums.TargetType

export type AIGrantType = $Enums.AIGrantType

export const AIGrantType: typeof $Enums.AIGrantType

export type VoteDirection = $Enums.VoteDirection

export const VoteDirection: typeof $Enums.VoteDirection

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Accounts
 * const accounts = await prisma.account.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Accounts
   * const accounts = await prisma.account.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.account`: Exposes CRUD operations for the **Account** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Accounts
    * const accounts = await prisma.account.findMany()
    * ```
    */
  get account(): Prisma.AccountDelegate<ExtArgs>;

  /**
   * `prisma.session`: Exposes CRUD operations for the **Session** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Sessions
    * const sessions = await prisma.session.findMany()
    * ```
    */
  get session(): Prisma.SessionDelegate<ExtArgs>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.verificationToken`: Exposes CRUD operations for the **VerificationToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more VerificationTokens
    * const verificationTokens = await prisma.verificationToken.findMany()
    * ```
    */
  get verificationToken(): Prisma.VerificationTokenDelegate<ExtArgs>;

  /**
   * `prisma.featureConfig`: Exposes CRUD operations for the **FeatureConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more FeatureConfigs
    * const featureConfigs = await prisma.featureConfig.findMany()
    * ```
    */
  get featureConfig(): Prisma.FeatureConfigDelegate<ExtArgs>;

  /**
   * `prisma.configAuditLog`: Exposes CRUD operations for the **ConfigAuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ConfigAuditLogs
    * const configAuditLogs = await prisma.configAuditLog.findMany()
    * ```
    */
  get configAuditLog(): Prisma.ConfigAuditLogDelegate<ExtArgs>;

  /**
   * `prisma.userUsageMetric`: Exposes CRUD operations for the **UserUsageMetric** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserUsageMetrics
    * const userUsageMetrics = await prisma.userUsageMetric.findMany()
    * ```
    */
  get userUsageMetric(): Prisma.UserUsageMetricDelegate<ExtArgs>;

  /**
   * `prisma.discussionSchedule`: Exposes CRUD operations for the **DiscussionSchedule** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiscussionSchedules
    * const discussionSchedules = await prisma.discussionSchedule.findMany()
    * ```
    */
  get discussionSchedule(): Prisma.DiscussionScheduleDelegate<ExtArgs>;

  /**
   * `prisma.aIAccessGrant`: Exposes CRUD operations for the **AIAccessGrant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AIAccessGrants
    * const aIAccessGrants = await prisma.aIAccessGrant.findMany()
    * ```
    */
  get aIAccessGrant(): Prisma.AIAccessGrantDelegate<ExtArgs>;

  /**
   * `prisma.discussionPromptLog`: Exposes CRUD operations for the **DiscussionPromptLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DiscussionPromptLogs
    * const discussionPromptLogs = await prisma.discussionPromptLog.findMany()
    * ```
    */
  get discussionPromptLog(): Prisma.DiscussionPromptLogDelegate<ExtArgs>;

  /**
   * `prisma.prompt`: Exposes CRUD operations for the **Prompt** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Prompts
    * const prompts = await prisma.prompt.findMany()
    * ```
    */
  get prompt(): Prisma.PromptDelegate<ExtArgs>;

  /**
   * `prisma.promptTag`: Exposes CRUD operations for the **PromptTag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PromptTags
    * const promptTags = await prisma.promptTag.findMany()
    * ```
    */
  get promptTag(): Prisma.PromptTagDelegate<ExtArgs>;

  /**
   * `prisma.promptVote`: Exposes CRUD operations for the **PromptVote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PromptVotes
    * const promptVotes = await prisma.promptVote.findMany()
    * ```
    */
  get promptVote(): Prisma.PromptVoteDelegate<ExtArgs>;

  /**
   * `prisma.promptDuplicateFlag`: Exposes CRUD operations for the **PromptDuplicateFlag** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PromptDuplicateFlags
    * const promptDuplicateFlags = await prisma.promptDuplicateFlag.findMany()
    * ```
    */
  get promptDuplicateFlag(): Prisma.PromptDuplicateFlagDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Account: 'Account',
    Session: 'Session',
    User: 'User',
    VerificationToken: 'VerificationToken',
    FeatureConfig: 'FeatureConfig',
    ConfigAuditLog: 'ConfigAuditLog',
    UserUsageMetric: 'UserUsageMetric',
    DiscussionSchedule: 'DiscussionSchedule',
    AIAccessGrant: 'AIAccessGrant',
    DiscussionPromptLog: 'DiscussionPromptLog',
    Prompt: 'Prompt',
    PromptTag: 'PromptTag',
    PromptVote: 'PromptVote',
    PromptDuplicateFlag: 'PromptDuplicateFlag'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "account" | "session" | "user" | "verificationToken" | "featureConfig" | "configAuditLog" | "userUsageMetric" | "discussionSchedule" | "aIAccessGrant" | "discussionPromptLog" | "prompt" | "promptTag" | "promptVote" | "promptDuplicateFlag"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Account: {
        payload: Prisma.$AccountPayload<ExtArgs>
        fields: Prisma.AccountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AccountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AccountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findFirst: {
            args: Prisma.AccountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AccountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          findMany: {
            args: Prisma.AccountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          create: {
            args: Prisma.AccountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          createMany: {
            args: Prisma.AccountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AccountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>[]
          }
          delete: {
            args: Prisma.AccountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          update: {
            args: Prisma.AccountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          deleteMany: {
            args: Prisma.AccountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AccountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AccountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AccountPayload>
          }
          aggregate: {
            args: Prisma.AccountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAccount>
          }
          groupBy: {
            args: Prisma.AccountGroupByArgs<ExtArgs>
            result: $Utils.Optional<AccountGroupByOutputType>[]
          }
          count: {
            args: Prisma.AccountCountArgs<ExtArgs>
            result: $Utils.Optional<AccountCountAggregateOutputType> | number
          }
        }
      }
      Session: {
        payload: Prisma.$SessionPayload<ExtArgs>
        fields: Prisma.SessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findFirst: {
            args: Prisma.SessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          findMany: {
            args: Prisma.SessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          create: {
            args: Prisma.SessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          createMany: {
            args: Prisma.SessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>[]
          }
          delete: {
            args: Prisma.SessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          update: {
            args: Prisma.SessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          deleteMany: {
            args: Prisma.SessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SessionPayload>
          }
          aggregate: {
            args: Prisma.SessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSession>
          }
          groupBy: {
            args: Prisma.SessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<SessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.SessionCountArgs<ExtArgs>
            result: $Utils.Optional<SessionCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      VerificationToken: {
        payload: Prisma.$VerificationTokenPayload<ExtArgs>
        fields: Prisma.VerificationTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VerificationTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VerificationTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findFirst: {
            args: Prisma.VerificationTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VerificationTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          findMany: {
            args: Prisma.VerificationTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          create: {
            args: Prisma.VerificationTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          createMany: {
            args: Prisma.VerificationTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VerificationTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>[]
          }
          delete: {
            args: Prisma.VerificationTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          update: {
            args: Prisma.VerificationTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          deleteMany: {
            args: Prisma.VerificationTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VerificationTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.VerificationTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VerificationTokenPayload>
          }
          aggregate: {
            args: Prisma.VerificationTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVerificationToken>
          }
          groupBy: {
            args: Prisma.VerificationTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.VerificationTokenCountArgs<ExtArgs>
            result: $Utils.Optional<VerificationTokenCountAggregateOutputType> | number
          }
        }
      }
      FeatureConfig: {
        payload: Prisma.$FeatureConfigPayload<ExtArgs>
        fields: Prisma.FeatureConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FeatureConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FeatureConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>
          }
          findFirst: {
            args: Prisma.FeatureConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FeatureConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>
          }
          findMany: {
            args: Prisma.FeatureConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>[]
          }
          create: {
            args: Prisma.FeatureConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>
          }
          createMany: {
            args: Prisma.FeatureConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FeatureConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>[]
          }
          delete: {
            args: Prisma.FeatureConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>
          }
          update: {
            args: Prisma.FeatureConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>
          }
          deleteMany: {
            args: Prisma.FeatureConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FeatureConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.FeatureConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FeatureConfigPayload>
          }
          aggregate: {
            args: Prisma.FeatureConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFeatureConfig>
          }
          groupBy: {
            args: Prisma.FeatureConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<FeatureConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.FeatureConfigCountArgs<ExtArgs>
            result: $Utils.Optional<FeatureConfigCountAggregateOutputType> | number
          }
        }
      }
      ConfigAuditLog: {
        payload: Prisma.$ConfigAuditLogPayload<ExtArgs>
        fields: Prisma.ConfigAuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ConfigAuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ConfigAuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>
          }
          findFirst: {
            args: Prisma.ConfigAuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ConfigAuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>
          }
          findMany: {
            args: Prisma.ConfigAuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>[]
          }
          create: {
            args: Prisma.ConfigAuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>
          }
          createMany: {
            args: Prisma.ConfigAuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ConfigAuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>[]
          }
          delete: {
            args: Prisma.ConfigAuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>
          }
          update: {
            args: Prisma.ConfigAuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>
          }
          deleteMany: {
            args: Prisma.ConfigAuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ConfigAuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ConfigAuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ConfigAuditLogPayload>
          }
          aggregate: {
            args: Prisma.ConfigAuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateConfigAuditLog>
          }
          groupBy: {
            args: Prisma.ConfigAuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<ConfigAuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.ConfigAuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<ConfigAuditLogCountAggregateOutputType> | number
          }
        }
      }
      UserUsageMetric: {
        payload: Prisma.$UserUsageMetricPayload<ExtArgs>
        fields: Prisma.UserUsageMetricFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserUsageMetricFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserUsageMetricFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>
          }
          findFirst: {
            args: Prisma.UserUsageMetricFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserUsageMetricFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>
          }
          findMany: {
            args: Prisma.UserUsageMetricFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>[]
          }
          create: {
            args: Prisma.UserUsageMetricCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>
          }
          createMany: {
            args: Prisma.UserUsageMetricCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserUsageMetricCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>[]
          }
          delete: {
            args: Prisma.UserUsageMetricDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>
          }
          update: {
            args: Prisma.UserUsageMetricUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>
          }
          deleteMany: {
            args: Prisma.UserUsageMetricDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUsageMetricUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUsageMetricUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserUsageMetricPayload>
          }
          aggregate: {
            args: Prisma.UserUsageMetricAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserUsageMetric>
          }
          groupBy: {
            args: Prisma.UserUsageMetricGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserUsageMetricGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserUsageMetricCountArgs<ExtArgs>
            result: $Utils.Optional<UserUsageMetricCountAggregateOutputType> | number
          }
        }
      }
      DiscussionSchedule: {
        payload: Prisma.$DiscussionSchedulePayload<ExtArgs>
        fields: Prisma.DiscussionScheduleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiscussionScheduleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiscussionScheduleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>
          }
          findFirst: {
            args: Prisma.DiscussionScheduleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiscussionScheduleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>
          }
          findMany: {
            args: Prisma.DiscussionScheduleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>[]
          }
          create: {
            args: Prisma.DiscussionScheduleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>
          }
          createMany: {
            args: Prisma.DiscussionScheduleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiscussionScheduleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>[]
          }
          delete: {
            args: Prisma.DiscussionScheduleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>
          }
          update: {
            args: Prisma.DiscussionScheduleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>
          }
          deleteMany: {
            args: Prisma.DiscussionScheduleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiscussionScheduleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiscussionScheduleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionSchedulePayload>
          }
          aggregate: {
            args: Prisma.DiscussionScheduleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiscussionSchedule>
          }
          groupBy: {
            args: Prisma.DiscussionScheduleGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiscussionScheduleGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiscussionScheduleCountArgs<ExtArgs>
            result: $Utils.Optional<DiscussionScheduleCountAggregateOutputType> | number
          }
        }
      }
      AIAccessGrant: {
        payload: Prisma.$AIAccessGrantPayload<ExtArgs>
        fields: Prisma.AIAccessGrantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AIAccessGrantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AIAccessGrantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>
          }
          findFirst: {
            args: Prisma.AIAccessGrantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AIAccessGrantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>
          }
          findMany: {
            args: Prisma.AIAccessGrantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>[]
          }
          create: {
            args: Prisma.AIAccessGrantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>
          }
          createMany: {
            args: Prisma.AIAccessGrantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AIAccessGrantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>[]
          }
          delete: {
            args: Prisma.AIAccessGrantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>
          }
          update: {
            args: Prisma.AIAccessGrantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>
          }
          deleteMany: {
            args: Prisma.AIAccessGrantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AIAccessGrantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AIAccessGrantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AIAccessGrantPayload>
          }
          aggregate: {
            args: Prisma.AIAccessGrantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAIAccessGrant>
          }
          groupBy: {
            args: Prisma.AIAccessGrantGroupByArgs<ExtArgs>
            result: $Utils.Optional<AIAccessGrantGroupByOutputType>[]
          }
          count: {
            args: Prisma.AIAccessGrantCountArgs<ExtArgs>
            result: $Utils.Optional<AIAccessGrantCountAggregateOutputType> | number
          }
        }
      }
      DiscussionPromptLog: {
        payload: Prisma.$DiscussionPromptLogPayload<ExtArgs>
        fields: Prisma.DiscussionPromptLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DiscussionPromptLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DiscussionPromptLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>
          }
          findFirst: {
            args: Prisma.DiscussionPromptLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DiscussionPromptLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>
          }
          findMany: {
            args: Prisma.DiscussionPromptLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>[]
          }
          create: {
            args: Prisma.DiscussionPromptLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>
          }
          createMany: {
            args: Prisma.DiscussionPromptLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DiscussionPromptLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>[]
          }
          delete: {
            args: Prisma.DiscussionPromptLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>
          }
          update: {
            args: Prisma.DiscussionPromptLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>
          }
          deleteMany: {
            args: Prisma.DiscussionPromptLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DiscussionPromptLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DiscussionPromptLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DiscussionPromptLogPayload>
          }
          aggregate: {
            args: Prisma.DiscussionPromptLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDiscussionPromptLog>
          }
          groupBy: {
            args: Prisma.DiscussionPromptLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<DiscussionPromptLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.DiscussionPromptLogCountArgs<ExtArgs>
            result: $Utils.Optional<DiscussionPromptLogCountAggregateOutputType> | number
          }
        }
      }
      Prompt: {
        payload: Prisma.$PromptPayload<ExtArgs>
        fields: Prisma.PromptFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromptFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromptFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>
          }
          findFirst: {
            args: Prisma.PromptFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromptFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>
          }
          findMany: {
            args: Prisma.PromptFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>[]
          }
          create: {
            args: Prisma.PromptCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>
          }
          createMany: {
            args: Prisma.PromptCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PromptCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>[]
          }
          delete: {
            args: Prisma.PromptDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>
          }
          update: {
            args: Prisma.PromptUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>
          }
          deleteMany: {
            args: Prisma.PromptDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromptUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromptUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptPayload>
          }
          aggregate: {
            args: Prisma.PromptAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrompt>
          }
          groupBy: {
            args: Prisma.PromptGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromptGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromptCountArgs<ExtArgs>
            result: $Utils.Optional<PromptCountAggregateOutputType> | number
          }
        }
      }
      PromptTag: {
        payload: Prisma.$PromptTagPayload<ExtArgs>
        fields: Prisma.PromptTagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromptTagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromptTagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>
          }
          findFirst: {
            args: Prisma.PromptTagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromptTagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>
          }
          findMany: {
            args: Prisma.PromptTagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>[]
          }
          create: {
            args: Prisma.PromptTagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>
          }
          createMany: {
            args: Prisma.PromptTagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PromptTagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>[]
          }
          delete: {
            args: Prisma.PromptTagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>
          }
          update: {
            args: Prisma.PromptTagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>
          }
          deleteMany: {
            args: Prisma.PromptTagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromptTagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromptTagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptTagPayload>
          }
          aggregate: {
            args: Prisma.PromptTagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePromptTag>
          }
          groupBy: {
            args: Prisma.PromptTagGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromptTagGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromptTagCountArgs<ExtArgs>
            result: $Utils.Optional<PromptTagCountAggregateOutputType> | number
          }
        }
      }
      PromptVote: {
        payload: Prisma.$PromptVotePayload<ExtArgs>
        fields: Prisma.PromptVoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromptVoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromptVoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>
          }
          findFirst: {
            args: Prisma.PromptVoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromptVoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>
          }
          findMany: {
            args: Prisma.PromptVoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>[]
          }
          create: {
            args: Prisma.PromptVoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>
          }
          createMany: {
            args: Prisma.PromptVoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PromptVoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>[]
          }
          delete: {
            args: Prisma.PromptVoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>
          }
          update: {
            args: Prisma.PromptVoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>
          }
          deleteMany: {
            args: Prisma.PromptVoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromptVoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromptVoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptVotePayload>
          }
          aggregate: {
            args: Prisma.PromptVoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePromptVote>
          }
          groupBy: {
            args: Prisma.PromptVoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromptVoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromptVoteCountArgs<ExtArgs>
            result: $Utils.Optional<PromptVoteCountAggregateOutputType> | number
          }
        }
      }
      PromptDuplicateFlag: {
        payload: Prisma.$PromptDuplicateFlagPayload<ExtArgs>
        fields: Prisma.PromptDuplicateFlagFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PromptDuplicateFlagFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PromptDuplicateFlagFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>
          }
          findFirst: {
            args: Prisma.PromptDuplicateFlagFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PromptDuplicateFlagFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>
          }
          findMany: {
            args: Prisma.PromptDuplicateFlagFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>[]
          }
          create: {
            args: Prisma.PromptDuplicateFlagCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>
          }
          createMany: {
            args: Prisma.PromptDuplicateFlagCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PromptDuplicateFlagCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>[]
          }
          delete: {
            args: Prisma.PromptDuplicateFlagDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>
          }
          update: {
            args: Prisma.PromptDuplicateFlagUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>
          }
          deleteMany: {
            args: Prisma.PromptDuplicateFlagDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PromptDuplicateFlagUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.PromptDuplicateFlagUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PromptDuplicateFlagPayload>
          }
          aggregate: {
            args: Prisma.PromptDuplicateFlagAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePromptDuplicateFlag>
          }
          groupBy: {
            args: Prisma.PromptDuplicateFlagGroupByArgs<ExtArgs>
            result: $Utils.Optional<PromptDuplicateFlagGroupByOutputType>[]
          }
          count: {
            args: Prisma.PromptDuplicateFlagCountArgs<ExtArgs>
            result: $Utils.Optional<PromptDuplicateFlagCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    accounts: number
    sessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | UserCountOutputTypeCountAccountsArgs
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAccountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
  }


  /**
   * Count Type PromptCountOutputType
   */

  export type PromptCountOutputType = {
    tags: number
    votes: number
    duplicateFlags: number
  }

  export type PromptCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tags?: boolean | PromptCountOutputTypeCountTagsArgs
    votes?: boolean | PromptCountOutputTypeCountVotesArgs
    duplicateFlags?: boolean | PromptCountOutputTypeCountDuplicateFlagsArgs
  }

  // Custom InputTypes
  /**
   * PromptCountOutputType without action
   */
  export type PromptCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptCountOutputType
     */
    select?: PromptCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PromptCountOutputType without action
   */
  export type PromptCountOutputTypeCountTagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptTagWhereInput
  }

  /**
   * PromptCountOutputType without action
   */
  export type PromptCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptVoteWhereInput
  }

  /**
   * PromptCountOutputType without action
   */
  export type PromptCountOutputTypeCountDuplicateFlagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptDuplicateFlagWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Account
   */

  export type AggregateAccount = {
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  export type AccountAvgAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountSumAggregateOutputType = {
    expires_at: number | null
  }

  export type AccountMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    provider: string | null
    providerAccountId: string | null
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
  }

  export type AccountCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    provider: number
    providerAccountId: number
    refresh_token: number
    access_token: number
    expires_at: number
    token_type: number
    scope: number
    id_token: number
    session_state: number
    _all: number
  }


  export type AccountAvgAggregateInputType = {
    expires_at?: true
  }

  export type AccountSumAggregateInputType = {
    expires_at?: true
  }

  export type AccountMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
  }

  export type AccountCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    provider?: true
    providerAccountId?: true
    refresh_token?: true
    access_token?: true
    expires_at?: true
    token_type?: true
    scope?: true
    id_token?: true
    session_state?: true
    _all?: true
  }

  export type AccountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Account to aggregate.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Accounts
    **/
    _count?: true | AccountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AccountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AccountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AccountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AccountMaxAggregateInputType
  }

  export type GetAccountAggregateType<T extends AccountAggregateArgs> = {
        [P in keyof T & keyof AggregateAccount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAccount[P]>
      : GetScalarType<T[P], AggregateAccount[P]>
  }




  export type AccountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithAggregationInput | AccountOrderByWithAggregationInput[]
    by: AccountScalarFieldEnum[] | AccountScalarFieldEnum
    having?: AccountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AccountCountAggregateInputType | true
    _avg?: AccountAvgAggregateInputType
    _sum?: AccountSumAggregateInputType
    _min?: AccountMinAggregateInputType
    _max?: AccountMaxAggregateInputType
  }

  export type AccountGroupByOutputType = {
    id: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token: string | null
    access_token: string | null
    expires_at: number | null
    token_type: string | null
    scope: string | null
    id_token: string | null
    session_state: string | null
    _count: AccountCountAggregateOutputType | null
    _avg: AccountAvgAggregateOutputType | null
    _sum: AccountSumAggregateOutputType | null
    _min: AccountMinAggregateOutputType | null
    _max: AccountMaxAggregateOutputType | null
  }

  type GetAccountGroupByPayload<T extends AccountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AccountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AccountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AccountGroupByOutputType[P]>
            : GetScalarType<T[P], AccountGroupByOutputType[P]>
        }
      >
    >


  export type AccountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["account"]>

  export type AccountSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    provider?: boolean
    providerAccountId?: boolean
    refresh_token?: boolean
    access_token?: boolean
    expires_at?: boolean
    token_type?: boolean
    scope?: boolean
    id_token?: boolean
    session_state?: boolean
  }

  export type AccountInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AccountIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AccountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Account"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      provider: string
      providerAccountId: string
      refresh_token: string | null
      access_token: string | null
      expires_at: number | null
      token_type: string | null
      scope: string | null
      id_token: string | null
      session_state: string | null
    }, ExtArgs["result"]["account"]>
    composites: {}
  }

  type AccountGetPayload<S extends boolean | null | undefined | AccountDefaultArgs> = $Result.GetResult<Prisma.$AccountPayload, S>

  type AccountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AccountFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AccountCountAggregateInputType | true
    }

  export interface AccountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Account'], meta: { name: 'Account' } }
    /**
     * Find zero or one Account that matches the filter.
     * @param {AccountFindUniqueArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AccountFindUniqueArgs>(args: SelectSubset<T, AccountFindUniqueArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Account that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AccountFindUniqueOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AccountFindUniqueOrThrowArgs>(args: SelectSubset<T, AccountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Account that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AccountFindFirstArgs>(args?: SelectSubset<T, AccountFindFirstArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Account that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindFirstOrThrowArgs} args - Arguments to find a Account
     * @example
     * // Get one Account
     * const account = await prisma.account.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AccountFindFirstOrThrowArgs>(args?: SelectSubset<T, AccountFindFirstOrThrowArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Accounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Accounts
     * const accounts = await prisma.account.findMany()
     * 
     * // Get first 10 Accounts
     * const accounts = await prisma.account.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const accountWithIdOnly = await prisma.account.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AccountFindManyArgs>(args?: SelectSubset<T, AccountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Account.
     * @param {AccountCreateArgs} args - Arguments to create a Account.
     * @example
     * // Create one Account
     * const Account = await prisma.account.create({
     *   data: {
     *     // ... data to create a Account
     *   }
     * })
     * 
     */
    create<T extends AccountCreateArgs>(args: SelectSubset<T, AccountCreateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Accounts.
     * @param {AccountCreateManyArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AccountCreateManyArgs>(args?: SelectSubset<T, AccountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Accounts and returns the data saved in the database.
     * @param {AccountCreateManyAndReturnArgs} args - Arguments to create many Accounts.
     * @example
     * // Create many Accounts
     * const account = await prisma.account.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Accounts and only return the `id`
     * const accountWithIdOnly = await prisma.account.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AccountCreateManyAndReturnArgs>(args?: SelectSubset<T, AccountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Account.
     * @param {AccountDeleteArgs} args - Arguments to delete one Account.
     * @example
     * // Delete one Account
     * const Account = await prisma.account.delete({
     *   where: {
     *     // ... filter to delete one Account
     *   }
     * })
     * 
     */
    delete<T extends AccountDeleteArgs>(args: SelectSubset<T, AccountDeleteArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Account.
     * @param {AccountUpdateArgs} args - Arguments to update one Account.
     * @example
     * // Update one Account
     * const account = await prisma.account.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AccountUpdateArgs>(args: SelectSubset<T, AccountUpdateArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Accounts.
     * @param {AccountDeleteManyArgs} args - Arguments to filter Accounts to delete.
     * @example
     * // Delete a few Accounts
     * const { count } = await prisma.account.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AccountDeleteManyArgs>(args?: SelectSubset<T, AccountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Accounts
     * const account = await prisma.account.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AccountUpdateManyArgs>(args: SelectSubset<T, AccountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Account.
     * @param {AccountUpsertArgs} args - Arguments to update or create a Account.
     * @example
     * // Update or create a Account
     * const account = await prisma.account.upsert({
     *   create: {
     *     // ... data to create a Account
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Account we want to update
     *   }
     * })
     */
    upsert<T extends AccountUpsertArgs>(args: SelectSubset<T, AccountUpsertArgs<ExtArgs>>): Prisma__AccountClient<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Accounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountCountArgs} args - Arguments to filter Accounts to count.
     * @example
     * // Count the number of Accounts
     * const count = await prisma.account.count({
     *   where: {
     *     // ... the filter for the Accounts we want to count
     *   }
     * })
    **/
    count<T extends AccountCountArgs>(
      args?: Subset<T, AccountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AccountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AccountAggregateArgs>(args: Subset<T, AccountAggregateArgs>): Prisma.PrismaPromise<GetAccountAggregateType<T>>

    /**
     * Group by Account.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AccountGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AccountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AccountGroupByArgs['orderBy'] }
        : { orderBy?: AccountGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AccountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAccountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Account model
   */
  readonly fields: AccountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Account.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AccountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Account model
   */ 
  interface AccountFieldRefs {
    readonly id: FieldRef<"Account", 'String'>
    readonly userId: FieldRef<"Account", 'String'>
    readonly type: FieldRef<"Account", 'String'>
    readonly provider: FieldRef<"Account", 'String'>
    readonly providerAccountId: FieldRef<"Account", 'String'>
    readonly refresh_token: FieldRef<"Account", 'String'>
    readonly access_token: FieldRef<"Account", 'String'>
    readonly expires_at: FieldRef<"Account", 'Int'>
    readonly token_type: FieldRef<"Account", 'String'>
    readonly scope: FieldRef<"Account", 'String'>
    readonly id_token: FieldRef<"Account", 'String'>
    readonly session_state: FieldRef<"Account", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Account findUnique
   */
  export type AccountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findUniqueOrThrow
   */
  export type AccountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account findFirst
   */
  export type AccountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findFirstOrThrow
   */
  export type AccountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Account to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Accounts.
     */
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account findMany
   */
  export type AccountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter, which Accounts to fetch.
     */
    where?: AccountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Accounts to fetch.
     */
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Accounts.
     */
    cursor?: AccountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Accounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Accounts.
     */
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * Account create
   */
  export type AccountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to create a Account.
     */
    data: XOR<AccountCreateInput, AccountUncheckedCreateInput>
  }

  /**
   * Account createMany
   */
  export type AccountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Account createManyAndReturn
   */
  export type AccountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Accounts.
     */
    data: AccountCreateManyInput | AccountCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Account update
   */
  export type AccountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The data needed to update a Account.
     */
    data: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
    /**
     * Choose, which Account to update.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account updateMany
   */
  export type AccountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Accounts.
     */
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyInput>
    /**
     * Filter which Accounts to update
     */
    where?: AccountWhereInput
  }

  /**
   * Account upsert
   */
  export type AccountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * The filter to search for the Account to update in case it exists.
     */
    where: AccountWhereUniqueInput
    /**
     * In case the Account found by the `where` argument doesn't exist, create a new Account with this data.
     */
    create: XOR<AccountCreateInput, AccountUncheckedCreateInput>
    /**
     * In case the Account was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AccountUpdateInput, AccountUncheckedUpdateInput>
  }

  /**
   * Account delete
   */
  export type AccountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    /**
     * Filter which Account to delete.
     */
    where: AccountWhereUniqueInput
  }

  /**
   * Account deleteMany
   */
  export type AccountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Accounts to delete
     */
    where?: AccountWhereInput
  }

  /**
   * Account without action
   */
  export type AccountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
  }


  /**
   * Model Session
   */

  export type AggregateSession = {
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  export type SessionMinAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionMaxAggregateOutputType = {
    id: string | null
    sessionToken: string | null
    userId: string | null
    expires: Date | null
  }

  export type SessionCountAggregateOutputType = {
    id: number
    sessionToken: number
    userId: number
    expires: number
    _all: number
  }


  export type SessionMinAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionMaxAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
  }

  export type SessionCountAggregateInputType = {
    id?: true
    sessionToken?: true
    userId?: true
    expires?: true
    _all?: true
  }

  export type SessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Session to aggregate.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Sessions
    **/
    _count?: true | SessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SessionMaxAggregateInputType
  }

  export type GetSessionAggregateType<T extends SessionAggregateArgs> = {
        [P in keyof T & keyof AggregateSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSession[P]>
      : GetScalarType<T[P], AggregateSession[P]>
  }




  export type SessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithAggregationInput | SessionOrderByWithAggregationInput[]
    by: SessionScalarFieldEnum[] | SessionScalarFieldEnum
    having?: SessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SessionCountAggregateInputType | true
    _min?: SessionMinAggregateInputType
    _max?: SessionMaxAggregateInputType
  }

  export type SessionGroupByOutputType = {
    id: string
    sessionToken: string
    userId: string
    expires: Date
    _count: SessionCountAggregateOutputType | null
    _min: SessionMinAggregateOutputType | null
    _max: SessionMaxAggregateOutputType | null
  }

  type GetSessionGroupByPayload<T extends SessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SessionGroupByOutputType[P]>
            : GetScalarType<T[P], SessionGroupByOutputType[P]>
        }
      >
    >


  export type SessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["session"]>

  export type SessionSelectScalar = {
    id?: boolean
    sessionToken?: boolean
    userId?: boolean
    expires?: boolean
  }

  export type SessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Session"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionToken: string
      userId: string
      expires: Date
    }, ExtArgs["result"]["session"]>
    composites: {}
  }

  type SessionGetPayload<S extends boolean | null | undefined | SessionDefaultArgs> = $Result.GetResult<Prisma.$SessionPayload, S>

  type SessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SessionCountAggregateInputType | true
    }

  export interface SessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Session'], meta: { name: 'Session' } }
    /**
     * Find zero or one Session that matches the filter.
     * @param {SessionFindUniqueArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SessionFindUniqueArgs>(args: SelectSubset<T, SessionFindUniqueArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Session that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SessionFindUniqueOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SessionFindUniqueOrThrowArgs>(args: SelectSubset<T, SessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Session that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SessionFindFirstArgs>(args?: SelectSubset<T, SessionFindFirstArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Session that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindFirstOrThrowArgs} args - Arguments to find a Session
     * @example
     * // Get one Session
     * const session = await prisma.session.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SessionFindFirstOrThrowArgs>(args?: SelectSubset<T, SessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Sessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Sessions
     * const sessions = await prisma.session.findMany()
     * 
     * // Get first 10 Sessions
     * const sessions = await prisma.session.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const sessionWithIdOnly = await prisma.session.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SessionFindManyArgs>(args?: SelectSubset<T, SessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Session.
     * @param {SessionCreateArgs} args - Arguments to create a Session.
     * @example
     * // Create one Session
     * const Session = await prisma.session.create({
     *   data: {
     *     // ... data to create a Session
     *   }
     * })
     * 
     */
    create<T extends SessionCreateArgs>(args: SelectSubset<T, SessionCreateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Sessions.
     * @param {SessionCreateManyArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SessionCreateManyArgs>(args?: SelectSubset<T, SessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Sessions and returns the data saved in the database.
     * @param {SessionCreateManyAndReturnArgs} args - Arguments to create many Sessions.
     * @example
     * // Create many Sessions
     * const session = await prisma.session.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Sessions and only return the `id`
     * const sessionWithIdOnly = await prisma.session.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SessionCreateManyAndReturnArgs>(args?: SelectSubset<T, SessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Session.
     * @param {SessionDeleteArgs} args - Arguments to delete one Session.
     * @example
     * // Delete one Session
     * const Session = await prisma.session.delete({
     *   where: {
     *     // ... filter to delete one Session
     *   }
     * })
     * 
     */
    delete<T extends SessionDeleteArgs>(args: SelectSubset<T, SessionDeleteArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Session.
     * @param {SessionUpdateArgs} args - Arguments to update one Session.
     * @example
     * // Update one Session
     * const session = await prisma.session.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SessionUpdateArgs>(args: SelectSubset<T, SessionUpdateArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Sessions.
     * @param {SessionDeleteManyArgs} args - Arguments to filter Sessions to delete.
     * @example
     * // Delete a few Sessions
     * const { count } = await prisma.session.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SessionDeleteManyArgs>(args?: SelectSubset<T, SessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Sessions
     * const session = await prisma.session.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SessionUpdateManyArgs>(args: SelectSubset<T, SessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Session.
     * @param {SessionUpsertArgs} args - Arguments to update or create a Session.
     * @example
     * // Update or create a Session
     * const session = await prisma.session.upsert({
     *   create: {
     *     // ... data to create a Session
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Session we want to update
     *   }
     * })
     */
    upsert<T extends SessionUpsertArgs>(args: SelectSubset<T, SessionUpsertArgs<ExtArgs>>): Prisma__SessionClient<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Sessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionCountArgs} args - Arguments to filter Sessions to count.
     * @example
     * // Count the number of Sessions
     * const count = await prisma.session.count({
     *   where: {
     *     // ... the filter for the Sessions we want to count
     *   }
     * })
    **/
    count<T extends SessionCountArgs>(
      args?: Subset<T, SessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SessionAggregateArgs>(args: Subset<T, SessionAggregateArgs>): Prisma.PrismaPromise<GetSessionAggregateType<T>>

    /**
     * Group by Session.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SessionGroupByArgs['orderBy'] }
        : { orderBy?: SessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Session model
   */
  readonly fields: SessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Session.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Session model
   */ 
  interface SessionFieldRefs {
    readonly id: FieldRef<"Session", 'String'>
    readonly sessionToken: FieldRef<"Session", 'String'>
    readonly userId: FieldRef<"Session", 'String'>
    readonly expires: FieldRef<"Session", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Session findUnique
   */
  export type SessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findUniqueOrThrow
   */
  export type SessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session findFirst
   */
  export type SessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findFirstOrThrow
   */
  export type SessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Session to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Sessions.
     */
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session findMany
   */
  export type SessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter, which Sessions to fetch.
     */
    where?: SessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Sessions to fetch.
     */
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Sessions.
     */
    cursor?: SessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Sessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Sessions.
     */
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * Session create
   */
  export type SessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to create a Session.
     */
    data: XOR<SessionCreateInput, SessionUncheckedCreateInput>
  }

  /**
   * Session createMany
   */
  export type SessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Session createManyAndReturn
   */
  export type SessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Sessions.
     */
    data: SessionCreateManyInput | SessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Session update
   */
  export type SessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The data needed to update a Session.
     */
    data: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
    /**
     * Choose, which Session to update.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session updateMany
   */
  export type SessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Sessions.
     */
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyInput>
    /**
     * Filter which Sessions to update
     */
    where?: SessionWhereInput
  }

  /**
   * Session upsert
   */
  export type SessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * The filter to search for the Session to update in case it exists.
     */
    where: SessionWhereUniqueInput
    /**
     * In case the Session found by the `where` argument doesn't exist, create a new Session with this data.
     */
    create: XOR<SessionCreateInput, SessionUncheckedCreateInput>
    /**
     * In case the Session was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SessionUpdateInput, SessionUncheckedUpdateInput>
  }

  /**
   * Session delete
   */
  export type SessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    /**
     * Filter which Session to delete.
     */
    where: SessionWhereUniqueInput
  }

  /**
   * Session deleteMany
   */
  export type SessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Sessions to delete
     */
    where?: SessionWhereInput
  }

  /**
   * Session without action
   */
  export type SessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    emailVerified: number
    image: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    emailVerified?: true
    image?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    name: string | null
    email: string | null
    emailVerified: Date | null
    image: string | null
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    emailVerified?: boolean
    image?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    accounts?: boolean | User$accountsArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      accounts: Prisma.$AccountPayload<ExtArgs>[]
      sessions: Prisma.$SessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      emailVerified: Date | null
      image: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    accounts<T extends User$accountsArgs<ExtArgs> = {}>(args?: Subset<T, User$accountsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AccountPayload<ExtArgs>, T, "findMany"> | Null>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly emailVerified: FieldRef<"User", 'DateTime'>
    readonly image: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data?: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.accounts
   */
  export type User$accountsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Account
     */
    select?: AccountSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AccountInclude<ExtArgs> | null
    where?: AccountWhereInput
    orderBy?: AccountOrderByWithRelationInput | AccountOrderByWithRelationInput[]
    cursor?: AccountWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AccountScalarFieldEnum | AccountScalarFieldEnum[]
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Session
     */
    select?: SessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SessionInclude<ExtArgs> | null
    where?: SessionWhereInput
    orderBy?: SessionOrderByWithRelationInput | SessionOrderByWithRelationInput[]
    cursor?: SessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SessionScalarFieldEnum | SessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model VerificationToken
   */

  export type AggregateVerificationToken = {
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  export type VerificationTokenMinAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenMaxAggregateOutputType = {
    identifier: string | null
    token: string | null
    expires: Date | null
  }

  export type VerificationTokenCountAggregateOutputType = {
    identifier: number
    token: number
    expires: number
    _all: number
  }


  export type VerificationTokenMinAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenMaxAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
  }

  export type VerificationTokenCountAggregateInputType = {
    identifier?: true
    token?: true
    expires?: true
    _all?: true
  }

  export type VerificationTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationToken to aggregate.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned VerificationTokens
    **/
    _count?: true | VerificationTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VerificationTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type GetVerificationTokenAggregateType<T extends VerificationTokenAggregateArgs> = {
        [P in keyof T & keyof AggregateVerificationToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVerificationToken[P]>
      : GetScalarType<T[P], AggregateVerificationToken[P]>
  }




  export type VerificationTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VerificationTokenWhereInput
    orderBy?: VerificationTokenOrderByWithAggregationInput | VerificationTokenOrderByWithAggregationInput[]
    by: VerificationTokenScalarFieldEnum[] | VerificationTokenScalarFieldEnum
    having?: VerificationTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VerificationTokenCountAggregateInputType | true
    _min?: VerificationTokenMinAggregateInputType
    _max?: VerificationTokenMaxAggregateInputType
  }

  export type VerificationTokenGroupByOutputType = {
    identifier: string
    token: string
    expires: Date
    _count: VerificationTokenCountAggregateOutputType | null
    _min: VerificationTokenMinAggregateOutputType | null
    _max: VerificationTokenMaxAggregateOutputType | null
  }

  type GetVerificationTokenGroupByPayload<T extends VerificationTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VerificationTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VerificationTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
            : GetScalarType<T[P], VerificationTokenGroupByOutputType[P]>
        }
      >
    >


  export type VerificationTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }, ExtArgs["result"]["verificationToken"]>

  export type VerificationTokenSelectScalar = {
    identifier?: boolean
    token?: boolean
    expires?: boolean
  }


  export type $VerificationTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "VerificationToken"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      identifier: string
      token: string
      expires: Date
    }, ExtArgs["result"]["verificationToken"]>
    composites: {}
  }

  type VerificationTokenGetPayload<S extends boolean | null | undefined | VerificationTokenDefaultArgs> = $Result.GetResult<Prisma.$VerificationTokenPayload, S>

  type VerificationTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<VerificationTokenFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: VerificationTokenCountAggregateInputType | true
    }

  export interface VerificationTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['VerificationToken'], meta: { name: 'VerificationToken' } }
    /**
     * Find zero or one VerificationToken that matches the filter.
     * @param {VerificationTokenFindUniqueArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VerificationTokenFindUniqueArgs>(args: SelectSubset<T, VerificationTokenFindUniqueArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one VerificationToken that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {VerificationTokenFindUniqueOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VerificationTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, VerificationTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first VerificationToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VerificationTokenFindFirstArgs>(args?: SelectSubset<T, VerificationTokenFindFirstArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first VerificationToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindFirstOrThrowArgs} args - Arguments to find a VerificationToken
     * @example
     * // Get one VerificationToken
     * const verificationToken = await prisma.verificationToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VerificationTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, VerificationTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more VerificationTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany()
     * 
     * // Get first 10 VerificationTokens
     * const verificationTokens = await prisma.verificationToken.findMany({ take: 10 })
     * 
     * // Only select the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.findMany({ select: { identifier: true } })
     * 
     */
    findMany<T extends VerificationTokenFindManyArgs>(args?: SelectSubset<T, VerificationTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a VerificationToken.
     * @param {VerificationTokenCreateArgs} args - Arguments to create a VerificationToken.
     * @example
     * // Create one VerificationToken
     * const VerificationToken = await prisma.verificationToken.create({
     *   data: {
     *     // ... data to create a VerificationToken
     *   }
     * })
     * 
     */
    create<T extends VerificationTokenCreateArgs>(args: SelectSubset<T, VerificationTokenCreateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many VerificationTokens.
     * @param {VerificationTokenCreateManyArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VerificationTokenCreateManyArgs>(args?: SelectSubset<T, VerificationTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many VerificationTokens and returns the data saved in the database.
     * @param {VerificationTokenCreateManyAndReturnArgs} args - Arguments to create many VerificationTokens.
     * @example
     * // Create many VerificationTokens
     * const verificationToken = await prisma.verificationToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many VerificationTokens and only return the `identifier`
     * const verificationTokenWithIdentifierOnly = await prisma.verificationToken.createManyAndReturn({ 
     *   select: { identifier: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VerificationTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, VerificationTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a VerificationToken.
     * @param {VerificationTokenDeleteArgs} args - Arguments to delete one VerificationToken.
     * @example
     * // Delete one VerificationToken
     * const VerificationToken = await prisma.verificationToken.delete({
     *   where: {
     *     // ... filter to delete one VerificationToken
     *   }
     * })
     * 
     */
    delete<T extends VerificationTokenDeleteArgs>(args: SelectSubset<T, VerificationTokenDeleteArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one VerificationToken.
     * @param {VerificationTokenUpdateArgs} args - Arguments to update one VerificationToken.
     * @example
     * // Update one VerificationToken
     * const verificationToken = await prisma.verificationToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VerificationTokenUpdateArgs>(args: SelectSubset<T, VerificationTokenUpdateArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more VerificationTokens.
     * @param {VerificationTokenDeleteManyArgs} args - Arguments to filter VerificationTokens to delete.
     * @example
     * // Delete a few VerificationTokens
     * const { count } = await prisma.verificationToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VerificationTokenDeleteManyArgs>(args?: SelectSubset<T, VerificationTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many VerificationTokens
     * const verificationToken = await prisma.verificationToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VerificationTokenUpdateManyArgs>(args: SelectSubset<T, VerificationTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one VerificationToken.
     * @param {VerificationTokenUpsertArgs} args - Arguments to update or create a VerificationToken.
     * @example
     * // Update or create a VerificationToken
     * const verificationToken = await prisma.verificationToken.upsert({
     *   create: {
     *     // ... data to create a VerificationToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the VerificationToken we want to update
     *   }
     * })
     */
    upsert<T extends VerificationTokenUpsertArgs>(args: SelectSubset<T, VerificationTokenUpsertArgs<ExtArgs>>): Prisma__VerificationTokenClient<$Result.GetResult<Prisma.$VerificationTokenPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of VerificationTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenCountArgs} args - Arguments to filter VerificationTokens to count.
     * @example
     * // Count the number of VerificationTokens
     * const count = await prisma.verificationToken.count({
     *   where: {
     *     // ... the filter for the VerificationTokens we want to count
     *   }
     * })
    **/
    count<T extends VerificationTokenCountArgs>(
      args?: Subset<T, VerificationTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VerificationTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VerificationTokenAggregateArgs>(args: Subset<T, VerificationTokenAggregateArgs>): Prisma.PrismaPromise<GetVerificationTokenAggregateType<T>>

    /**
     * Group by VerificationToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VerificationTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VerificationTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VerificationTokenGroupByArgs['orderBy'] }
        : { orderBy?: VerificationTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VerificationTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVerificationTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the VerificationToken model
   */
  readonly fields: VerificationTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for VerificationToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VerificationTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the VerificationToken model
   */ 
  interface VerificationTokenFieldRefs {
    readonly identifier: FieldRef<"VerificationToken", 'String'>
    readonly token: FieldRef<"VerificationToken", 'String'>
    readonly expires: FieldRef<"VerificationToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * VerificationToken findUnique
   */
  export type VerificationTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findUniqueOrThrow
   */
  export type VerificationTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken findFirst
   */
  export type VerificationTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findFirstOrThrow
   */
  export type VerificationTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationToken to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of VerificationTokens.
     */
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken findMany
   */
  export type VerificationTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter, which VerificationTokens to fetch.
     */
    where?: VerificationTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of VerificationTokens to fetch.
     */
    orderBy?: VerificationTokenOrderByWithRelationInput | VerificationTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing VerificationTokens.
     */
    cursor?: VerificationTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` VerificationTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` VerificationTokens.
     */
    skip?: number
    distinct?: VerificationTokenScalarFieldEnum | VerificationTokenScalarFieldEnum[]
  }

  /**
   * VerificationToken create
   */
  export type VerificationTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The data needed to create a VerificationToken.
     */
    data: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
  }

  /**
   * VerificationToken createMany
   */
  export type VerificationTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken createManyAndReturn
   */
  export type VerificationTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many VerificationTokens.
     */
    data: VerificationTokenCreateManyInput | VerificationTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * VerificationToken update
   */
  export type VerificationTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The data needed to update a VerificationToken.
     */
    data: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
    /**
     * Choose, which VerificationToken to update.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken updateMany
   */
  export type VerificationTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update VerificationTokens.
     */
    data: XOR<VerificationTokenUpdateManyMutationInput, VerificationTokenUncheckedUpdateManyInput>
    /**
     * Filter which VerificationTokens to update
     */
    where?: VerificationTokenWhereInput
  }

  /**
   * VerificationToken upsert
   */
  export type VerificationTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * The filter to search for the VerificationToken to update in case it exists.
     */
    where: VerificationTokenWhereUniqueInput
    /**
     * In case the VerificationToken found by the `where` argument doesn't exist, create a new VerificationToken with this data.
     */
    create: XOR<VerificationTokenCreateInput, VerificationTokenUncheckedCreateInput>
    /**
     * In case the VerificationToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VerificationTokenUpdateInput, VerificationTokenUncheckedUpdateInput>
  }

  /**
   * VerificationToken delete
   */
  export type VerificationTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
    /**
     * Filter which VerificationToken to delete.
     */
    where: VerificationTokenWhereUniqueInput
  }

  /**
   * VerificationToken deleteMany
   */
  export type VerificationTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which VerificationTokens to delete
     */
    where?: VerificationTokenWhereInput
  }

  /**
   * VerificationToken without action
   */
  export type VerificationTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VerificationToken
     */
    select?: VerificationTokenSelect<ExtArgs> | null
  }


  /**
   * Model FeatureConfig
   */

  export type AggregateFeatureConfig = {
    _count: FeatureConfigCountAggregateOutputType | null
    _min: FeatureConfigMinAggregateOutputType | null
    _max: FeatureConfigMaxAggregateOutputType | null
  }

  export type FeatureConfigMinAggregateOutputType = {
    id: string | null
    serverId: string | null
    targetType: $Enums.TargetType | null
    targetId: string | null
    featureKey: string | null
    isEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeatureConfigMaxAggregateOutputType = {
    id: string | null
    serverId: string | null
    targetType: $Enums.TargetType | null
    targetId: string | null
    featureKey: string | null
    isEnabled: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FeatureConfigCountAggregateOutputType = {
    id: number
    serverId: number
    targetType: number
    targetId: number
    featureKey: number
    isEnabled: number
    settings: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FeatureConfigMinAggregateInputType = {
    id?: true
    serverId?: true
    targetType?: true
    targetId?: true
    featureKey?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeatureConfigMaxAggregateInputType = {
    id?: true
    serverId?: true
    targetType?: true
    targetId?: true
    featureKey?: true
    isEnabled?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FeatureConfigCountAggregateInputType = {
    id?: true
    serverId?: true
    targetType?: true
    targetId?: true
    featureKey?: true
    isEnabled?: true
    settings?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FeatureConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FeatureConfig to aggregate.
     */
    where?: FeatureConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeatureConfigs to fetch.
     */
    orderBy?: FeatureConfigOrderByWithRelationInput | FeatureConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FeatureConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeatureConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeatureConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned FeatureConfigs
    **/
    _count?: true | FeatureConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FeatureConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FeatureConfigMaxAggregateInputType
  }

  export type GetFeatureConfigAggregateType<T extends FeatureConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateFeatureConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFeatureConfig[P]>
      : GetScalarType<T[P], AggregateFeatureConfig[P]>
  }




  export type FeatureConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FeatureConfigWhereInput
    orderBy?: FeatureConfigOrderByWithAggregationInput | FeatureConfigOrderByWithAggregationInput[]
    by: FeatureConfigScalarFieldEnum[] | FeatureConfigScalarFieldEnum
    having?: FeatureConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FeatureConfigCountAggregateInputType | true
    _min?: FeatureConfigMinAggregateInputType
    _max?: FeatureConfigMaxAggregateInputType
  }

  export type FeatureConfigGroupByOutputType = {
    id: string
    serverId: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    isEnabled: boolean
    settings: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: FeatureConfigCountAggregateOutputType | null
    _min: FeatureConfigMinAggregateOutputType | null
    _max: FeatureConfigMaxAggregateOutputType | null
  }

  type GetFeatureConfigGroupByPayload<T extends FeatureConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FeatureConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FeatureConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FeatureConfigGroupByOutputType[P]>
            : GetScalarType<T[P], FeatureConfigGroupByOutputType[P]>
        }
      >
    >


  export type FeatureConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    targetType?: boolean
    targetId?: boolean
    featureKey?: boolean
    isEnabled?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["featureConfig"]>

  export type FeatureConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    targetType?: boolean
    targetId?: boolean
    featureKey?: boolean
    isEnabled?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["featureConfig"]>

  export type FeatureConfigSelectScalar = {
    id?: boolean
    serverId?: boolean
    targetType?: boolean
    targetId?: boolean
    featureKey?: boolean
    isEnabled?: boolean
    settings?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $FeatureConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "FeatureConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serverId: string
      targetType: $Enums.TargetType
      targetId: string
      featureKey: string
      isEnabled: boolean
      settings: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["featureConfig"]>
    composites: {}
  }

  type FeatureConfigGetPayload<S extends boolean | null | undefined | FeatureConfigDefaultArgs> = $Result.GetResult<Prisma.$FeatureConfigPayload, S>

  type FeatureConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<FeatureConfigFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: FeatureConfigCountAggregateInputType | true
    }

  export interface FeatureConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['FeatureConfig'], meta: { name: 'FeatureConfig' } }
    /**
     * Find zero or one FeatureConfig that matches the filter.
     * @param {FeatureConfigFindUniqueArgs} args - Arguments to find a FeatureConfig
     * @example
     * // Get one FeatureConfig
     * const featureConfig = await prisma.featureConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FeatureConfigFindUniqueArgs>(args: SelectSubset<T, FeatureConfigFindUniqueArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one FeatureConfig that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {FeatureConfigFindUniqueOrThrowArgs} args - Arguments to find a FeatureConfig
     * @example
     * // Get one FeatureConfig
     * const featureConfig = await prisma.featureConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FeatureConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, FeatureConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first FeatureConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigFindFirstArgs} args - Arguments to find a FeatureConfig
     * @example
     * // Get one FeatureConfig
     * const featureConfig = await prisma.featureConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FeatureConfigFindFirstArgs>(args?: SelectSubset<T, FeatureConfigFindFirstArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first FeatureConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigFindFirstOrThrowArgs} args - Arguments to find a FeatureConfig
     * @example
     * // Get one FeatureConfig
     * const featureConfig = await prisma.featureConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FeatureConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, FeatureConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more FeatureConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all FeatureConfigs
     * const featureConfigs = await prisma.featureConfig.findMany()
     * 
     * // Get first 10 FeatureConfigs
     * const featureConfigs = await prisma.featureConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const featureConfigWithIdOnly = await prisma.featureConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FeatureConfigFindManyArgs>(args?: SelectSubset<T, FeatureConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a FeatureConfig.
     * @param {FeatureConfigCreateArgs} args - Arguments to create a FeatureConfig.
     * @example
     * // Create one FeatureConfig
     * const FeatureConfig = await prisma.featureConfig.create({
     *   data: {
     *     // ... data to create a FeatureConfig
     *   }
     * })
     * 
     */
    create<T extends FeatureConfigCreateArgs>(args: SelectSubset<T, FeatureConfigCreateArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many FeatureConfigs.
     * @param {FeatureConfigCreateManyArgs} args - Arguments to create many FeatureConfigs.
     * @example
     * // Create many FeatureConfigs
     * const featureConfig = await prisma.featureConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FeatureConfigCreateManyArgs>(args?: SelectSubset<T, FeatureConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many FeatureConfigs and returns the data saved in the database.
     * @param {FeatureConfigCreateManyAndReturnArgs} args - Arguments to create many FeatureConfigs.
     * @example
     * // Create many FeatureConfigs
     * const featureConfig = await prisma.featureConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many FeatureConfigs and only return the `id`
     * const featureConfigWithIdOnly = await prisma.featureConfig.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FeatureConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, FeatureConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a FeatureConfig.
     * @param {FeatureConfigDeleteArgs} args - Arguments to delete one FeatureConfig.
     * @example
     * // Delete one FeatureConfig
     * const FeatureConfig = await prisma.featureConfig.delete({
     *   where: {
     *     // ... filter to delete one FeatureConfig
     *   }
     * })
     * 
     */
    delete<T extends FeatureConfigDeleteArgs>(args: SelectSubset<T, FeatureConfigDeleteArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one FeatureConfig.
     * @param {FeatureConfigUpdateArgs} args - Arguments to update one FeatureConfig.
     * @example
     * // Update one FeatureConfig
     * const featureConfig = await prisma.featureConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FeatureConfigUpdateArgs>(args: SelectSubset<T, FeatureConfigUpdateArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more FeatureConfigs.
     * @param {FeatureConfigDeleteManyArgs} args - Arguments to filter FeatureConfigs to delete.
     * @example
     * // Delete a few FeatureConfigs
     * const { count } = await prisma.featureConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FeatureConfigDeleteManyArgs>(args?: SelectSubset<T, FeatureConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more FeatureConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many FeatureConfigs
     * const featureConfig = await prisma.featureConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FeatureConfigUpdateManyArgs>(args: SelectSubset<T, FeatureConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one FeatureConfig.
     * @param {FeatureConfigUpsertArgs} args - Arguments to update or create a FeatureConfig.
     * @example
     * // Update or create a FeatureConfig
     * const featureConfig = await prisma.featureConfig.upsert({
     *   create: {
     *     // ... data to create a FeatureConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the FeatureConfig we want to update
     *   }
     * })
     */
    upsert<T extends FeatureConfigUpsertArgs>(args: SelectSubset<T, FeatureConfigUpsertArgs<ExtArgs>>): Prisma__FeatureConfigClient<$Result.GetResult<Prisma.$FeatureConfigPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of FeatureConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigCountArgs} args - Arguments to filter FeatureConfigs to count.
     * @example
     * // Count the number of FeatureConfigs
     * const count = await prisma.featureConfig.count({
     *   where: {
     *     // ... the filter for the FeatureConfigs we want to count
     *   }
     * })
    **/
    count<T extends FeatureConfigCountArgs>(
      args?: Subset<T, FeatureConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FeatureConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a FeatureConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FeatureConfigAggregateArgs>(args: Subset<T, FeatureConfigAggregateArgs>): Prisma.PrismaPromise<GetFeatureConfigAggregateType<T>>

    /**
     * Group by FeatureConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FeatureConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FeatureConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FeatureConfigGroupByArgs['orderBy'] }
        : { orderBy?: FeatureConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FeatureConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFeatureConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the FeatureConfig model
   */
  readonly fields: FeatureConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for FeatureConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FeatureConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the FeatureConfig model
   */ 
  interface FeatureConfigFieldRefs {
    readonly id: FieldRef<"FeatureConfig", 'String'>
    readonly serverId: FieldRef<"FeatureConfig", 'String'>
    readonly targetType: FieldRef<"FeatureConfig", 'TargetType'>
    readonly targetId: FieldRef<"FeatureConfig", 'String'>
    readonly featureKey: FieldRef<"FeatureConfig", 'String'>
    readonly isEnabled: FieldRef<"FeatureConfig", 'Boolean'>
    readonly settings: FieldRef<"FeatureConfig", 'Json'>
    readonly createdAt: FieldRef<"FeatureConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"FeatureConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * FeatureConfig findUnique
   */
  export type FeatureConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * Filter, which FeatureConfig to fetch.
     */
    where: FeatureConfigWhereUniqueInput
  }

  /**
   * FeatureConfig findUniqueOrThrow
   */
  export type FeatureConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * Filter, which FeatureConfig to fetch.
     */
    where: FeatureConfigWhereUniqueInput
  }

  /**
   * FeatureConfig findFirst
   */
  export type FeatureConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * Filter, which FeatureConfig to fetch.
     */
    where?: FeatureConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeatureConfigs to fetch.
     */
    orderBy?: FeatureConfigOrderByWithRelationInput | FeatureConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FeatureConfigs.
     */
    cursor?: FeatureConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeatureConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeatureConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FeatureConfigs.
     */
    distinct?: FeatureConfigScalarFieldEnum | FeatureConfigScalarFieldEnum[]
  }

  /**
   * FeatureConfig findFirstOrThrow
   */
  export type FeatureConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * Filter, which FeatureConfig to fetch.
     */
    where?: FeatureConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeatureConfigs to fetch.
     */
    orderBy?: FeatureConfigOrderByWithRelationInput | FeatureConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for FeatureConfigs.
     */
    cursor?: FeatureConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeatureConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeatureConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of FeatureConfigs.
     */
    distinct?: FeatureConfigScalarFieldEnum | FeatureConfigScalarFieldEnum[]
  }

  /**
   * FeatureConfig findMany
   */
  export type FeatureConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * Filter, which FeatureConfigs to fetch.
     */
    where?: FeatureConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of FeatureConfigs to fetch.
     */
    orderBy?: FeatureConfigOrderByWithRelationInput | FeatureConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing FeatureConfigs.
     */
    cursor?: FeatureConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` FeatureConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` FeatureConfigs.
     */
    skip?: number
    distinct?: FeatureConfigScalarFieldEnum | FeatureConfigScalarFieldEnum[]
  }

  /**
   * FeatureConfig create
   */
  export type FeatureConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * The data needed to create a FeatureConfig.
     */
    data: XOR<FeatureConfigCreateInput, FeatureConfigUncheckedCreateInput>
  }

  /**
   * FeatureConfig createMany
   */
  export type FeatureConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many FeatureConfigs.
     */
    data: FeatureConfigCreateManyInput | FeatureConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FeatureConfig createManyAndReturn
   */
  export type FeatureConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many FeatureConfigs.
     */
    data: FeatureConfigCreateManyInput | FeatureConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * FeatureConfig update
   */
  export type FeatureConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * The data needed to update a FeatureConfig.
     */
    data: XOR<FeatureConfigUpdateInput, FeatureConfigUncheckedUpdateInput>
    /**
     * Choose, which FeatureConfig to update.
     */
    where: FeatureConfigWhereUniqueInput
  }

  /**
   * FeatureConfig updateMany
   */
  export type FeatureConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update FeatureConfigs.
     */
    data: XOR<FeatureConfigUpdateManyMutationInput, FeatureConfigUncheckedUpdateManyInput>
    /**
     * Filter which FeatureConfigs to update
     */
    where?: FeatureConfigWhereInput
  }

  /**
   * FeatureConfig upsert
   */
  export type FeatureConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * The filter to search for the FeatureConfig to update in case it exists.
     */
    where: FeatureConfigWhereUniqueInput
    /**
     * In case the FeatureConfig found by the `where` argument doesn't exist, create a new FeatureConfig with this data.
     */
    create: XOR<FeatureConfigCreateInput, FeatureConfigUncheckedCreateInput>
    /**
     * In case the FeatureConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FeatureConfigUpdateInput, FeatureConfigUncheckedUpdateInput>
  }

  /**
   * FeatureConfig delete
   */
  export type FeatureConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
    /**
     * Filter which FeatureConfig to delete.
     */
    where: FeatureConfigWhereUniqueInput
  }

  /**
   * FeatureConfig deleteMany
   */
  export type FeatureConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which FeatureConfigs to delete
     */
    where?: FeatureConfigWhereInput
  }

  /**
   * FeatureConfig without action
   */
  export type FeatureConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the FeatureConfig
     */
    select?: FeatureConfigSelect<ExtArgs> | null
  }


  /**
   * Model ConfigAuditLog
   */

  export type AggregateConfigAuditLog = {
    _count: ConfigAuditLogCountAggregateOutputType | null
    _min: ConfigAuditLogMinAggregateOutputType | null
    _max: ConfigAuditLogMaxAggregateOutputType | null
  }

  export type ConfigAuditLogMinAggregateOutputType = {
    id: string | null
    serverId: string | null
    userId: string | null
    action: string | null
    targetType: $Enums.TargetType | null
    targetId: string | null
    featureKey: string | null
    createdAt: Date | null
  }

  export type ConfigAuditLogMaxAggregateOutputType = {
    id: string | null
    serverId: string | null
    userId: string | null
    action: string | null
    targetType: $Enums.TargetType | null
    targetId: string | null
    featureKey: string | null
    createdAt: Date | null
  }

  export type ConfigAuditLogCountAggregateOutputType = {
    id: number
    serverId: number
    userId: number
    action: number
    targetType: number
    targetId: number
    featureKey: number
    oldValue: number
    newValue: number
    createdAt: number
    _all: number
  }


  export type ConfigAuditLogMinAggregateInputType = {
    id?: true
    serverId?: true
    userId?: true
    action?: true
    targetType?: true
    targetId?: true
    featureKey?: true
    createdAt?: true
  }

  export type ConfigAuditLogMaxAggregateInputType = {
    id?: true
    serverId?: true
    userId?: true
    action?: true
    targetType?: true
    targetId?: true
    featureKey?: true
    createdAt?: true
  }

  export type ConfigAuditLogCountAggregateInputType = {
    id?: true
    serverId?: true
    userId?: true
    action?: true
    targetType?: true
    targetId?: true
    featureKey?: true
    oldValue?: true
    newValue?: true
    createdAt?: true
    _all?: true
  }

  export type ConfigAuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfigAuditLog to aggregate.
     */
    where?: ConfigAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfigAuditLogs to fetch.
     */
    orderBy?: ConfigAuditLogOrderByWithRelationInput | ConfigAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ConfigAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfigAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfigAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ConfigAuditLogs
    **/
    _count?: true | ConfigAuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ConfigAuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ConfigAuditLogMaxAggregateInputType
  }

  export type GetConfigAuditLogAggregateType<T extends ConfigAuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateConfigAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateConfigAuditLog[P]>
      : GetScalarType<T[P], AggregateConfigAuditLog[P]>
  }




  export type ConfigAuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ConfigAuditLogWhereInput
    orderBy?: ConfigAuditLogOrderByWithAggregationInput | ConfigAuditLogOrderByWithAggregationInput[]
    by: ConfigAuditLogScalarFieldEnum[] | ConfigAuditLogScalarFieldEnum
    having?: ConfigAuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ConfigAuditLogCountAggregateInputType | true
    _min?: ConfigAuditLogMinAggregateInputType
    _max?: ConfigAuditLogMaxAggregateInputType
  }

  export type ConfigAuditLogGroupByOutputType = {
    id: string
    serverId: string
    userId: string
    action: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    oldValue: JsonValue | null
    newValue: JsonValue | null
    createdAt: Date
    _count: ConfigAuditLogCountAggregateOutputType | null
    _min: ConfigAuditLogMinAggregateOutputType | null
    _max: ConfigAuditLogMaxAggregateOutputType | null
  }

  type GetConfigAuditLogGroupByPayload<T extends ConfigAuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ConfigAuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ConfigAuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ConfigAuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], ConfigAuditLogGroupByOutputType[P]>
        }
      >
    >


  export type ConfigAuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    userId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    featureKey?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["configAuditLog"]>

  export type ConfigAuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    userId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    featureKey?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["configAuditLog"]>

  export type ConfigAuditLogSelectScalar = {
    id?: boolean
    serverId?: boolean
    userId?: boolean
    action?: boolean
    targetType?: boolean
    targetId?: boolean
    featureKey?: boolean
    oldValue?: boolean
    newValue?: boolean
    createdAt?: boolean
  }


  export type $ConfigAuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ConfigAuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serverId: string
      userId: string
      action: string
      targetType: $Enums.TargetType
      targetId: string
      featureKey: string
      oldValue: Prisma.JsonValue | null
      newValue: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["configAuditLog"]>
    composites: {}
  }

  type ConfigAuditLogGetPayload<S extends boolean | null | undefined | ConfigAuditLogDefaultArgs> = $Result.GetResult<Prisma.$ConfigAuditLogPayload, S>

  type ConfigAuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ConfigAuditLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ConfigAuditLogCountAggregateInputType | true
    }

  export interface ConfigAuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ConfigAuditLog'], meta: { name: 'ConfigAuditLog' } }
    /**
     * Find zero or one ConfigAuditLog that matches the filter.
     * @param {ConfigAuditLogFindUniqueArgs} args - Arguments to find a ConfigAuditLog
     * @example
     * // Get one ConfigAuditLog
     * const configAuditLog = await prisma.configAuditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ConfigAuditLogFindUniqueArgs>(args: SelectSubset<T, ConfigAuditLogFindUniqueArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ConfigAuditLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ConfigAuditLogFindUniqueOrThrowArgs} args - Arguments to find a ConfigAuditLog
     * @example
     * // Get one ConfigAuditLog
     * const configAuditLog = await prisma.configAuditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ConfigAuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, ConfigAuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ConfigAuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogFindFirstArgs} args - Arguments to find a ConfigAuditLog
     * @example
     * // Get one ConfigAuditLog
     * const configAuditLog = await prisma.configAuditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ConfigAuditLogFindFirstArgs>(args?: SelectSubset<T, ConfigAuditLogFindFirstArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ConfigAuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogFindFirstOrThrowArgs} args - Arguments to find a ConfigAuditLog
     * @example
     * // Get one ConfigAuditLog
     * const configAuditLog = await prisma.configAuditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ConfigAuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, ConfigAuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ConfigAuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ConfigAuditLogs
     * const configAuditLogs = await prisma.configAuditLog.findMany()
     * 
     * // Get first 10 ConfigAuditLogs
     * const configAuditLogs = await prisma.configAuditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const configAuditLogWithIdOnly = await prisma.configAuditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ConfigAuditLogFindManyArgs>(args?: SelectSubset<T, ConfigAuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ConfigAuditLog.
     * @param {ConfigAuditLogCreateArgs} args - Arguments to create a ConfigAuditLog.
     * @example
     * // Create one ConfigAuditLog
     * const ConfigAuditLog = await prisma.configAuditLog.create({
     *   data: {
     *     // ... data to create a ConfigAuditLog
     *   }
     * })
     * 
     */
    create<T extends ConfigAuditLogCreateArgs>(args: SelectSubset<T, ConfigAuditLogCreateArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ConfigAuditLogs.
     * @param {ConfigAuditLogCreateManyArgs} args - Arguments to create many ConfigAuditLogs.
     * @example
     * // Create many ConfigAuditLogs
     * const configAuditLog = await prisma.configAuditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ConfigAuditLogCreateManyArgs>(args?: SelectSubset<T, ConfigAuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ConfigAuditLogs and returns the data saved in the database.
     * @param {ConfigAuditLogCreateManyAndReturnArgs} args - Arguments to create many ConfigAuditLogs.
     * @example
     * // Create many ConfigAuditLogs
     * const configAuditLog = await prisma.configAuditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ConfigAuditLogs and only return the `id`
     * const configAuditLogWithIdOnly = await prisma.configAuditLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ConfigAuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, ConfigAuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a ConfigAuditLog.
     * @param {ConfigAuditLogDeleteArgs} args - Arguments to delete one ConfigAuditLog.
     * @example
     * // Delete one ConfigAuditLog
     * const ConfigAuditLog = await prisma.configAuditLog.delete({
     *   where: {
     *     // ... filter to delete one ConfigAuditLog
     *   }
     * })
     * 
     */
    delete<T extends ConfigAuditLogDeleteArgs>(args: SelectSubset<T, ConfigAuditLogDeleteArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ConfigAuditLog.
     * @param {ConfigAuditLogUpdateArgs} args - Arguments to update one ConfigAuditLog.
     * @example
     * // Update one ConfigAuditLog
     * const configAuditLog = await prisma.configAuditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ConfigAuditLogUpdateArgs>(args: SelectSubset<T, ConfigAuditLogUpdateArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ConfigAuditLogs.
     * @param {ConfigAuditLogDeleteManyArgs} args - Arguments to filter ConfigAuditLogs to delete.
     * @example
     * // Delete a few ConfigAuditLogs
     * const { count } = await prisma.configAuditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ConfigAuditLogDeleteManyArgs>(args?: SelectSubset<T, ConfigAuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ConfigAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ConfigAuditLogs
     * const configAuditLog = await prisma.configAuditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ConfigAuditLogUpdateManyArgs>(args: SelectSubset<T, ConfigAuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ConfigAuditLog.
     * @param {ConfigAuditLogUpsertArgs} args - Arguments to update or create a ConfigAuditLog.
     * @example
     * // Update or create a ConfigAuditLog
     * const configAuditLog = await prisma.configAuditLog.upsert({
     *   create: {
     *     // ... data to create a ConfigAuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ConfigAuditLog we want to update
     *   }
     * })
     */
    upsert<T extends ConfigAuditLogUpsertArgs>(args: SelectSubset<T, ConfigAuditLogUpsertArgs<ExtArgs>>): Prisma__ConfigAuditLogClient<$Result.GetResult<Prisma.$ConfigAuditLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of ConfigAuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogCountArgs} args - Arguments to filter ConfigAuditLogs to count.
     * @example
     * // Count the number of ConfigAuditLogs
     * const count = await prisma.configAuditLog.count({
     *   where: {
     *     // ... the filter for the ConfigAuditLogs we want to count
     *   }
     * })
    **/
    count<T extends ConfigAuditLogCountArgs>(
      args?: Subset<T, ConfigAuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ConfigAuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ConfigAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ConfigAuditLogAggregateArgs>(args: Subset<T, ConfigAuditLogAggregateArgs>): Prisma.PrismaPromise<GetConfigAuditLogAggregateType<T>>

    /**
     * Group by ConfigAuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ConfigAuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ConfigAuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ConfigAuditLogGroupByArgs['orderBy'] }
        : { orderBy?: ConfigAuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ConfigAuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetConfigAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ConfigAuditLog model
   */
  readonly fields: ConfigAuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ConfigAuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ConfigAuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ConfigAuditLog model
   */ 
  interface ConfigAuditLogFieldRefs {
    readonly id: FieldRef<"ConfigAuditLog", 'String'>
    readonly serverId: FieldRef<"ConfigAuditLog", 'String'>
    readonly userId: FieldRef<"ConfigAuditLog", 'String'>
    readonly action: FieldRef<"ConfigAuditLog", 'String'>
    readonly targetType: FieldRef<"ConfigAuditLog", 'TargetType'>
    readonly targetId: FieldRef<"ConfigAuditLog", 'String'>
    readonly featureKey: FieldRef<"ConfigAuditLog", 'String'>
    readonly oldValue: FieldRef<"ConfigAuditLog", 'Json'>
    readonly newValue: FieldRef<"ConfigAuditLog", 'Json'>
    readonly createdAt: FieldRef<"ConfigAuditLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ConfigAuditLog findUnique
   */
  export type ConfigAuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which ConfigAuditLog to fetch.
     */
    where: ConfigAuditLogWhereUniqueInput
  }

  /**
   * ConfigAuditLog findUniqueOrThrow
   */
  export type ConfigAuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which ConfigAuditLog to fetch.
     */
    where: ConfigAuditLogWhereUniqueInput
  }

  /**
   * ConfigAuditLog findFirst
   */
  export type ConfigAuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which ConfigAuditLog to fetch.
     */
    where?: ConfigAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfigAuditLogs to fetch.
     */
    orderBy?: ConfigAuditLogOrderByWithRelationInput | ConfigAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfigAuditLogs.
     */
    cursor?: ConfigAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfigAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfigAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfigAuditLogs.
     */
    distinct?: ConfigAuditLogScalarFieldEnum | ConfigAuditLogScalarFieldEnum[]
  }

  /**
   * ConfigAuditLog findFirstOrThrow
   */
  export type ConfigAuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which ConfigAuditLog to fetch.
     */
    where?: ConfigAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfigAuditLogs to fetch.
     */
    orderBy?: ConfigAuditLogOrderByWithRelationInput | ConfigAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ConfigAuditLogs.
     */
    cursor?: ConfigAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfigAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfigAuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ConfigAuditLogs.
     */
    distinct?: ConfigAuditLogScalarFieldEnum | ConfigAuditLogScalarFieldEnum[]
  }

  /**
   * ConfigAuditLog findMany
   */
  export type ConfigAuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * Filter, which ConfigAuditLogs to fetch.
     */
    where?: ConfigAuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ConfigAuditLogs to fetch.
     */
    orderBy?: ConfigAuditLogOrderByWithRelationInput | ConfigAuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ConfigAuditLogs.
     */
    cursor?: ConfigAuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ConfigAuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ConfigAuditLogs.
     */
    skip?: number
    distinct?: ConfigAuditLogScalarFieldEnum | ConfigAuditLogScalarFieldEnum[]
  }

  /**
   * ConfigAuditLog create
   */
  export type ConfigAuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to create a ConfigAuditLog.
     */
    data: XOR<ConfigAuditLogCreateInput, ConfigAuditLogUncheckedCreateInput>
  }

  /**
   * ConfigAuditLog createMany
   */
  export type ConfigAuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ConfigAuditLogs.
     */
    data: ConfigAuditLogCreateManyInput | ConfigAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfigAuditLog createManyAndReturn
   */
  export type ConfigAuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many ConfigAuditLogs.
     */
    data: ConfigAuditLogCreateManyInput | ConfigAuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ConfigAuditLog update
   */
  export type ConfigAuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * The data needed to update a ConfigAuditLog.
     */
    data: XOR<ConfigAuditLogUpdateInput, ConfigAuditLogUncheckedUpdateInput>
    /**
     * Choose, which ConfigAuditLog to update.
     */
    where: ConfigAuditLogWhereUniqueInput
  }

  /**
   * ConfigAuditLog updateMany
   */
  export type ConfigAuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ConfigAuditLogs.
     */
    data: XOR<ConfigAuditLogUpdateManyMutationInput, ConfigAuditLogUncheckedUpdateManyInput>
    /**
     * Filter which ConfigAuditLogs to update
     */
    where?: ConfigAuditLogWhereInput
  }

  /**
   * ConfigAuditLog upsert
   */
  export type ConfigAuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * The filter to search for the ConfigAuditLog to update in case it exists.
     */
    where: ConfigAuditLogWhereUniqueInput
    /**
     * In case the ConfigAuditLog found by the `where` argument doesn't exist, create a new ConfigAuditLog with this data.
     */
    create: XOR<ConfigAuditLogCreateInput, ConfigAuditLogUncheckedCreateInput>
    /**
     * In case the ConfigAuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ConfigAuditLogUpdateInput, ConfigAuditLogUncheckedUpdateInput>
  }

  /**
   * ConfigAuditLog delete
   */
  export type ConfigAuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
    /**
     * Filter which ConfigAuditLog to delete.
     */
    where: ConfigAuditLogWhereUniqueInput
  }

  /**
   * ConfigAuditLog deleteMany
   */
  export type ConfigAuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ConfigAuditLogs to delete
     */
    where?: ConfigAuditLogWhereInput
  }

  /**
   * ConfigAuditLog without action
   */
  export type ConfigAuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ConfigAuditLog
     */
    select?: ConfigAuditLogSelect<ExtArgs> | null
  }


  /**
   * Model UserUsageMetric
   */

  export type AggregateUserUsageMetric = {
    _count: UserUsageMetricCountAggregateOutputType | null
    _avg: UserUsageMetricAvgAggregateOutputType | null
    _sum: UserUsageMetricSumAggregateOutputType | null
    _min: UserUsageMetricMinAggregateOutputType | null
    _max: UserUsageMetricMaxAggregateOutputType | null
  }

  export type UserUsageMetricAvgAggregateOutputType = {
    totalCommands: number | null
    rateLimitHits: number | null
  }

  export type UserUsageMetricSumAggregateOutputType = {
    totalCommands: number | null
    rateLimitHits: number | null
  }

  export type UserUsageMetricMinAggregateOutputType = {
    userId: string | null
    lastActive: Date | null
    totalCommands: number | null
    rateLimitHits: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserUsageMetricMaxAggregateOutputType = {
    userId: string | null
    lastActive: Date | null
    totalCommands: number | null
    rateLimitHits: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserUsageMetricCountAggregateOutputType = {
    userId: number
    lastActive: number
    totalCommands: number
    rateLimitHits: number
    securityFlags: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserUsageMetricAvgAggregateInputType = {
    totalCommands?: true
    rateLimitHits?: true
  }

  export type UserUsageMetricSumAggregateInputType = {
    totalCommands?: true
    rateLimitHits?: true
  }

  export type UserUsageMetricMinAggregateInputType = {
    userId?: true
    lastActive?: true
    totalCommands?: true
    rateLimitHits?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserUsageMetricMaxAggregateInputType = {
    userId?: true
    lastActive?: true
    totalCommands?: true
    rateLimitHits?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserUsageMetricCountAggregateInputType = {
    userId?: true
    lastActive?: true
    totalCommands?: true
    rateLimitHits?: true
    securityFlags?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserUsageMetricAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserUsageMetric to aggregate.
     */
    where?: UserUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUsageMetrics to fetch.
     */
    orderBy?: UserUsageMetricOrderByWithRelationInput | UserUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserUsageMetrics
    **/
    _count?: true | UserUsageMetricCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserUsageMetricAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserUsageMetricSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserUsageMetricMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserUsageMetricMaxAggregateInputType
  }

  export type GetUserUsageMetricAggregateType<T extends UserUsageMetricAggregateArgs> = {
        [P in keyof T & keyof AggregateUserUsageMetric]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserUsageMetric[P]>
      : GetScalarType<T[P], AggregateUserUsageMetric[P]>
  }




  export type UserUsageMetricGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserUsageMetricWhereInput
    orderBy?: UserUsageMetricOrderByWithAggregationInput | UserUsageMetricOrderByWithAggregationInput[]
    by: UserUsageMetricScalarFieldEnum[] | UserUsageMetricScalarFieldEnum
    having?: UserUsageMetricScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserUsageMetricCountAggregateInputType | true
    _avg?: UserUsageMetricAvgAggregateInputType
    _sum?: UserUsageMetricSumAggregateInputType
    _min?: UserUsageMetricMinAggregateInputType
    _max?: UserUsageMetricMaxAggregateInputType
  }

  export type UserUsageMetricGroupByOutputType = {
    userId: string
    lastActive: Date
    totalCommands: number
    rateLimitHits: number
    securityFlags: JsonValue
    createdAt: Date
    updatedAt: Date
    _count: UserUsageMetricCountAggregateOutputType | null
    _avg: UserUsageMetricAvgAggregateOutputType | null
    _sum: UserUsageMetricSumAggregateOutputType | null
    _min: UserUsageMetricMinAggregateOutputType | null
    _max: UserUsageMetricMaxAggregateOutputType | null
  }

  type GetUserUsageMetricGroupByPayload<T extends UserUsageMetricGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserUsageMetricGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserUsageMetricGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserUsageMetricGroupByOutputType[P]>
            : GetScalarType<T[P], UserUsageMetricGroupByOutputType[P]>
        }
      >
    >


  export type UserUsageMetricSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    lastActive?: boolean
    totalCommands?: boolean
    rateLimitHits?: boolean
    securityFlags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userUsageMetric"]>

  export type UserUsageMetricSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    lastActive?: boolean
    totalCommands?: boolean
    rateLimitHits?: boolean
    securityFlags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userUsageMetric"]>

  export type UserUsageMetricSelectScalar = {
    userId?: boolean
    lastActive?: boolean
    totalCommands?: boolean
    rateLimitHits?: boolean
    securityFlags?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $UserUsageMetricPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserUsageMetric"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      lastActive: Date
      totalCommands: number
      rateLimitHits: number
      securityFlags: Prisma.JsonValue
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userUsageMetric"]>
    composites: {}
  }

  type UserUsageMetricGetPayload<S extends boolean | null | undefined | UserUsageMetricDefaultArgs> = $Result.GetResult<Prisma.$UserUsageMetricPayload, S>

  type UserUsageMetricCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserUsageMetricFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserUsageMetricCountAggregateInputType | true
    }

  export interface UserUsageMetricDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserUsageMetric'], meta: { name: 'UserUsageMetric' } }
    /**
     * Find zero or one UserUsageMetric that matches the filter.
     * @param {UserUsageMetricFindUniqueArgs} args - Arguments to find a UserUsageMetric
     * @example
     * // Get one UserUsageMetric
     * const userUsageMetric = await prisma.userUsageMetric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserUsageMetricFindUniqueArgs>(args: SelectSubset<T, UserUsageMetricFindUniqueArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserUsageMetric that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserUsageMetricFindUniqueOrThrowArgs} args - Arguments to find a UserUsageMetric
     * @example
     * // Get one UserUsageMetric
     * const userUsageMetric = await prisma.userUsageMetric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserUsageMetricFindUniqueOrThrowArgs>(args: SelectSubset<T, UserUsageMetricFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserUsageMetric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricFindFirstArgs} args - Arguments to find a UserUsageMetric
     * @example
     * // Get one UserUsageMetric
     * const userUsageMetric = await prisma.userUsageMetric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserUsageMetricFindFirstArgs>(args?: SelectSubset<T, UserUsageMetricFindFirstArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserUsageMetric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricFindFirstOrThrowArgs} args - Arguments to find a UserUsageMetric
     * @example
     * // Get one UserUsageMetric
     * const userUsageMetric = await prisma.userUsageMetric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserUsageMetricFindFirstOrThrowArgs>(args?: SelectSubset<T, UserUsageMetricFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserUsageMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserUsageMetrics
     * const userUsageMetrics = await prisma.userUsageMetric.findMany()
     * 
     * // Get first 10 UserUsageMetrics
     * const userUsageMetrics = await prisma.userUsageMetric.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const userUsageMetricWithUserIdOnly = await prisma.userUsageMetric.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends UserUsageMetricFindManyArgs>(args?: SelectSubset<T, UserUsageMetricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserUsageMetric.
     * @param {UserUsageMetricCreateArgs} args - Arguments to create a UserUsageMetric.
     * @example
     * // Create one UserUsageMetric
     * const UserUsageMetric = await prisma.userUsageMetric.create({
     *   data: {
     *     // ... data to create a UserUsageMetric
     *   }
     * })
     * 
     */
    create<T extends UserUsageMetricCreateArgs>(args: SelectSubset<T, UserUsageMetricCreateArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserUsageMetrics.
     * @param {UserUsageMetricCreateManyArgs} args - Arguments to create many UserUsageMetrics.
     * @example
     * // Create many UserUsageMetrics
     * const userUsageMetric = await prisma.userUsageMetric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserUsageMetricCreateManyArgs>(args?: SelectSubset<T, UserUsageMetricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserUsageMetrics and returns the data saved in the database.
     * @param {UserUsageMetricCreateManyAndReturnArgs} args - Arguments to create many UserUsageMetrics.
     * @example
     * // Create many UserUsageMetrics
     * const userUsageMetric = await prisma.userUsageMetric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserUsageMetrics and only return the `userId`
     * const userUsageMetricWithUserIdOnly = await prisma.userUsageMetric.createManyAndReturn({ 
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserUsageMetricCreateManyAndReturnArgs>(args?: SelectSubset<T, UserUsageMetricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a UserUsageMetric.
     * @param {UserUsageMetricDeleteArgs} args - Arguments to delete one UserUsageMetric.
     * @example
     * // Delete one UserUsageMetric
     * const UserUsageMetric = await prisma.userUsageMetric.delete({
     *   where: {
     *     // ... filter to delete one UserUsageMetric
     *   }
     * })
     * 
     */
    delete<T extends UserUsageMetricDeleteArgs>(args: SelectSubset<T, UserUsageMetricDeleteArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserUsageMetric.
     * @param {UserUsageMetricUpdateArgs} args - Arguments to update one UserUsageMetric.
     * @example
     * // Update one UserUsageMetric
     * const userUsageMetric = await prisma.userUsageMetric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUsageMetricUpdateArgs>(args: SelectSubset<T, UserUsageMetricUpdateArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserUsageMetrics.
     * @param {UserUsageMetricDeleteManyArgs} args - Arguments to filter UserUsageMetrics to delete.
     * @example
     * // Delete a few UserUsageMetrics
     * const { count } = await prisma.userUsageMetric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserUsageMetricDeleteManyArgs>(args?: SelectSubset<T, UserUsageMetricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserUsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserUsageMetrics
     * const userUsageMetric = await prisma.userUsageMetric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUsageMetricUpdateManyArgs>(args: SelectSubset<T, UserUsageMetricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserUsageMetric.
     * @param {UserUsageMetricUpsertArgs} args - Arguments to update or create a UserUsageMetric.
     * @example
     * // Update or create a UserUsageMetric
     * const userUsageMetric = await prisma.userUsageMetric.upsert({
     *   create: {
     *     // ... data to create a UserUsageMetric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserUsageMetric we want to update
     *   }
     * })
     */
    upsert<T extends UserUsageMetricUpsertArgs>(args: SelectSubset<T, UserUsageMetricUpsertArgs<ExtArgs>>): Prisma__UserUsageMetricClient<$Result.GetResult<Prisma.$UserUsageMetricPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of UserUsageMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricCountArgs} args - Arguments to filter UserUsageMetrics to count.
     * @example
     * // Count the number of UserUsageMetrics
     * const count = await prisma.userUsageMetric.count({
     *   where: {
     *     // ... the filter for the UserUsageMetrics we want to count
     *   }
     * })
    **/
    count<T extends UserUsageMetricCountArgs>(
      args?: Subset<T, UserUsageMetricCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserUsageMetricCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserUsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserUsageMetricAggregateArgs>(args: Subset<T, UserUsageMetricAggregateArgs>): Prisma.PrismaPromise<GetUserUsageMetricAggregateType<T>>

    /**
     * Group by UserUsageMetric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUsageMetricGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserUsageMetricGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserUsageMetricGroupByArgs['orderBy'] }
        : { orderBy?: UserUsageMetricGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserUsageMetricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserUsageMetricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserUsageMetric model
   */
  readonly fields: UserUsageMetricFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserUsageMetric.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserUsageMetricClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserUsageMetric model
   */ 
  interface UserUsageMetricFieldRefs {
    readonly userId: FieldRef<"UserUsageMetric", 'String'>
    readonly lastActive: FieldRef<"UserUsageMetric", 'DateTime'>
    readonly totalCommands: FieldRef<"UserUsageMetric", 'Int'>
    readonly rateLimitHits: FieldRef<"UserUsageMetric", 'Int'>
    readonly securityFlags: FieldRef<"UserUsageMetric", 'Json'>
    readonly createdAt: FieldRef<"UserUsageMetric", 'DateTime'>
    readonly updatedAt: FieldRef<"UserUsageMetric", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserUsageMetric findUnique
   */
  export type UserUsageMetricFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UserUsageMetric to fetch.
     */
    where: UserUsageMetricWhereUniqueInput
  }

  /**
   * UserUsageMetric findUniqueOrThrow
   */
  export type UserUsageMetricFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UserUsageMetric to fetch.
     */
    where: UserUsageMetricWhereUniqueInput
  }

  /**
   * UserUsageMetric findFirst
   */
  export type UserUsageMetricFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UserUsageMetric to fetch.
     */
    where?: UserUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUsageMetrics to fetch.
     */
    orderBy?: UserUsageMetricOrderByWithRelationInput | UserUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserUsageMetrics.
     */
    cursor?: UserUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUsageMetrics.
     */
    distinct?: UserUsageMetricScalarFieldEnum | UserUsageMetricScalarFieldEnum[]
  }

  /**
   * UserUsageMetric findFirstOrThrow
   */
  export type UserUsageMetricFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UserUsageMetric to fetch.
     */
    where?: UserUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUsageMetrics to fetch.
     */
    orderBy?: UserUsageMetricOrderByWithRelationInput | UserUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserUsageMetrics.
     */
    cursor?: UserUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUsageMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserUsageMetrics.
     */
    distinct?: UserUsageMetricScalarFieldEnum | UserUsageMetricScalarFieldEnum[]
  }

  /**
   * UserUsageMetric findMany
   */
  export type UserUsageMetricFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * Filter, which UserUsageMetrics to fetch.
     */
    where?: UserUsageMetricWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserUsageMetrics to fetch.
     */
    orderBy?: UserUsageMetricOrderByWithRelationInput | UserUsageMetricOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserUsageMetrics.
     */
    cursor?: UserUsageMetricWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserUsageMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserUsageMetrics.
     */
    skip?: number
    distinct?: UserUsageMetricScalarFieldEnum | UserUsageMetricScalarFieldEnum[]
  }

  /**
   * UserUsageMetric create
   */
  export type UserUsageMetricCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * The data needed to create a UserUsageMetric.
     */
    data: XOR<UserUsageMetricCreateInput, UserUsageMetricUncheckedCreateInput>
  }

  /**
   * UserUsageMetric createMany
   */
  export type UserUsageMetricCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserUsageMetrics.
     */
    data: UserUsageMetricCreateManyInput | UserUsageMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserUsageMetric createManyAndReturn
   */
  export type UserUsageMetricCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UserUsageMetrics.
     */
    data: UserUsageMetricCreateManyInput | UserUsageMetricCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserUsageMetric update
   */
  export type UserUsageMetricUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * The data needed to update a UserUsageMetric.
     */
    data: XOR<UserUsageMetricUpdateInput, UserUsageMetricUncheckedUpdateInput>
    /**
     * Choose, which UserUsageMetric to update.
     */
    where: UserUsageMetricWhereUniqueInput
  }

  /**
   * UserUsageMetric updateMany
   */
  export type UserUsageMetricUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserUsageMetrics.
     */
    data: XOR<UserUsageMetricUpdateManyMutationInput, UserUsageMetricUncheckedUpdateManyInput>
    /**
     * Filter which UserUsageMetrics to update
     */
    where?: UserUsageMetricWhereInput
  }

  /**
   * UserUsageMetric upsert
   */
  export type UserUsageMetricUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * The filter to search for the UserUsageMetric to update in case it exists.
     */
    where: UserUsageMetricWhereUniqueInput
    /**
     * In case the UserUsageMetric found by the `where` argument doesn't exist, create a new UserUsageMetric with this data.
     */
    create: XOR<UserUsageMetricCreateInput, UserUsageMetricUncheckedCreateInput>
    /**
     * In case the UserUsageMetric was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUsageMetricUpdateInput, UserUsageMetricUncheckedUpdateInput>
  }

  /**
   * UserUsageMetric delete
   */
  export type UserUsageMetricDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
    /**
     * Filter which UserUsageMetric to delete.
     */
    where: UserUsageMetricWhereUniqueInput
  }

  /**
   * UserUsageMetric deleteMany
   */
  export type UserUsageMetricDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserUsageMetrics to delete
     */
    where?: UserUsageMetricWhereInput
  }

  /**
   * UserUsageMetric without action
   */
  export type UserUsageMetricDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserUsageMetric
     */
    select?: UserUsageMetricSelect<ExtArgs> | null
  }


  /**
   * Model DiscussionSchedule
   */

  export type AggregateDiscussionSchedule = {
    _count: DiscussionScheduleCountAggregateOutputType | null
    _min: DiscussionScheduleMinAggregateOutputType | null
    _max: DiscussionScheduleMaxAggregateOutputType | null
  }

  export type DiscussionScheduleMinAggregateOutputType = {
    id: string | null
    serverId: string | null
    channelId: string | null
    timeUtc: string | null
    timezone: string | null
    categoryFilter: string | null
    useAi: boolean | null
    isActive: boolean | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiscussionScheduleMaxAggregateOutputType = {
    id: string | null
    serverId: string | null
    channelId: string | null
    timeUtc: string | null
    timezone: string | null
    categoryFilter: string | null
    useAi: boolean | null
    isActive: boolean | null
    createdBy: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DiscussionScheduleCountAggregateOutputType = {
    id: number
    serverId: number
    channelId: number
    days: number
    timeUtc: number
    timezone: number
    categoryFilter: number
    useAi: number
    isActive: number
    createdBy: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DiscussionScheduleMinAggregateInputType = {
    id?: true
    serverId?: true
    channelId?: true
    timeUtc?: true
    timezone?: true
    categoryFilter?: true
    useAi?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiscussionScheduleMaxAggregateInputType = {
    id?: true
    serverId?: true
    channelId?: true
    timeUtc?: true
    timezone?: true
    categoryFilter?: true
    useAi?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DiscussionScheduleCountAggregateInputType = {
    id?: true
    serverId?: true
    channelId?: true
    days?: true
    timeUtc?: true
    timezone?: true
    categoryFilter?: true
    useAi?: true
    isActive?: true
    createdBy?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DiscussionScheduleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiscussionSchedule to aggregate.
     */
    where?: DiscussionScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionSchedules to fetch.
     */
    orderBy?: DiscussionScheduleOrderByWithRelationInput | DiscussionScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiscussionScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiscussionSchedules
    **/
    _count?: true | DiscussionScheduleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiscussionScheduleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiscussionScheduleMaxAggregateInputType
  }

  export type GetDiscussionScheduleAggregateType<T extends DiscussionScheduleAggregateArgs> = {
        [P in keyof T & keyof AggregateDiscussionSchedule]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiscussionSchedule[P]>
      : GetScalarType<T[P], AggregateDiscussionSchedule[P]>
  }




  export type DiscussionScheduleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiscussionScheduleWhereInput
    orderBy?: DiscussionScheduleOrderByWithAggregationInput | DiscussionScheduleOrderByWithAggregationInput[]
    by: DiscussionScheduleScalarFieldEnum[] | DiscussionScheduleScalarFieldEnum
    having?: DiscussionScheduleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiscussionScheduleCountAggregateInputType | true
    _min?: DiscussionScheduleMinAggregateInputType
    _max?: DiscussionScheduleMaxAggregateInputType
  }

  export type DiscussionScheduleGroupByOutputType = {
    id: string
    serverId: string
    channelId: string
    days: JsonValue
    timeUtc: string
    timezone: string
    categoryFilter: string | null
    useAi: boolean
    isActive: boolean
    createdBy: string
    createdAt: Date
    updatedAt: Date
    _count: DiscussionScheduleCountAggregateOutputType | null
    _min: DiscussionScheduleMinAggregateOutputType | null
    _max: DiscussionScheduleMaxAggregateOutputType | null
  }

  type GetDiscussionScheduleGroupByPayload<T extends DiscussionScheduleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiscussionScheduleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiscussionScheduleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiscussionScheduleGroupByOutputType[P]>
            : GetScalarType<T[P], DiscussionScheduleGroupByOutputType[P]>
        }
      >
    >


  export type DiscussionScheduleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    channelId?: boolean
    days?: boolean
    timeUtc?: boolean
    timezone?: boolean
    categoryFilter?: boolean
    useAi?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["discussionSchedule"]>

  export type DiscussionScheduleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    channelId?: boolean
    days?: boolean
    timeUtc?: boolean
    timezone?: boolean
    categoryFilter?: boolean
    useAi?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["discussionSchedule"]>

  export type DiscussionScheduleSelectScalar = {
    id?: boolean
    serverId?: boolean
    channelId?: boolean
    days?: boolean
    timeUtc?: boolean
    timezone?: boolean
    categoryFilter?: boolean
    useAi?: boolean
    isActive?: boolean
    createdBy?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $DiscussionSchedulePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiscussionSchedule"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serverId: string
      channelId: string
      days: Prisma.JsonValue
      timeUtc: string
      timezone: string
      categoryFilter: string | null
      useAi: boolean
      isActive: boolean
      createdBy: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["discussionSchedule"]>
    composites: {}
  }

  type DiscussionScheduleGetPayload<S extends boolean | null | undefined | DiscussionScheduleDefaultArgs> = $Result.GetResult<Prisma.$DiscussionSchedulePayload, S>

  type DiscussionScheduleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DiscussionScheduleFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiscussionScheduleCountAggregateInputType | true
    }

  export interface DiscussionScheduleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiscussionSchedule'], meta: { name: 'DiscussionSchedule' } }
    /**
     * Find zero or one DiscussionSchedule that matches the filter.
     * @param {DiscussionScheduleFindUniqueArgs} args - Arguments to find a DiscussionSchedule
     * @example
     * // Get one DiscussionSchedule
     * const discussionSchedule = await prisma.discussionSchedule.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiscussionScheduleFindUniqueArgs>(args: SelectSubset<T, DiscussionScheduleFindUniqueArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DiscussionSchedule that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DiscussionScheduleFindUniqueOrThrowArgs} args - Arguments to find a DiscussionSchedule
     * @example
     * // Get one DiscussionSchedule
     * const discussionSchedule = await prisma.discussionSchedule.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiscussionScheduleFindUniqueOrThrowArgs>(args: SelectSubset<T, DiscussionScheduleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DiscussionSchedule that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleFindFirstArgs} args - Arguments to find a DiscussionSchedule
     * @example
     * // Get one DiscussionSchedule
     * const discussionSchedule = await prisma.discussionSchedule.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiscussionScheduleFindFirstArgs>(args?: SelectSubset<T, DiscussionScheduleFindFirstArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DiscussionSchedule that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleFindFirstOrThrowArgs} args - Arguments to find a DiscussionSchedule
     * @example
     * // Get one DiscussionSchedule
     * const discussionSchedule = await prisma.discussionSchedule.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiscussionScheduleFindFirstOrThrowArgs>(args?: SelectSubset<T, DiscussionScheduleFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DiscussionSchedules that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiscussionSchedules
     * const discussionSchedules = await prisma.discussionSchedule.findMany()
     * 
     * // Get first 10 DiscussionSchedules
     * const discussionSchedules = await prisma.discussionSchedule.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const discussionScheduleWithIdOnly = await prisma.discussionSchedule.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiscussionScheduleFindManyArgs>(args?: SelectSubset<T, DiscussionScheduleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DiscussionSchedule.
     * @param {DiscussionScheduleCreateArgs} args - Arguments to create a DiscussionSchedule.
     * @example
     * // Create one DiscussionSchedule
     * const DiscussionSchedule = await prisma.discussionSchedule.create({
     *   data: {
     *     // ... data to create a DiscussionSchedule
     *   }
     * })
     * 
     */
    create<T extends DiscussionScheduleCreateArgs>(args: SelectSubset<T, DiscussionScheduleCreateArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DiscussionSchedules.
     * @param {DiscussionScheduleCreateManyArgs} args - Arguments to create many DiscussionSchedules.
     * @example
     * // Create many DiscussionSchedules
     * const discussionSchedule = await prisma.discussionSchedule.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiscussionScheduleCreateManyArgs>(args?: SelectSubset<T, DiscussionScheduleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiscussionSchedules and returns the data saved in the database.
     * @param {DiscussionScheduleCreateManyAndReturnArgs} args - Arguments to create many DiscussionSchedules.
     * @example
     * // Create many DiscussionSchedules
     * const discussionSchedule = await prisma.discussionSchedule.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiscussionSchedules and only return the `id`
     * const discussionScheduleWithIdOnly = await prisma.discussionSchedule.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiscussionScheduleCreateManyAndReturnArgs>(args?: SelectSubset<T, DiscussionScheduleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DiscussionSchedule.
     * @param {DiscussionScheduleDeleteArgs} args - Arguments to delete one DiscussionSchedule.
     * @example
     * // Delete one DiscussionSchedule
     * const DiscussionSchedule = await prisma.discussionSchedule.delete({
     *   where: {
     *     // ... filter to delete one DiscussionSchedule
     *   }
     * })
     * 
     */
    delete<T extends DiscussionScheduleDeleteArgs>(args: SelectSubset<T, DiscussionScheduleDeleteArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DiscussionSchedule.
     * @param {DiscussionScheduleUpdateArgs} args - Arguments to update one DiscussionSchedule.
     * @example
     * // Update one DiscussionSchedule
     * const discussionSchedule = await prisma.discussionSchedule.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiscussionScheduleUpdateArgs>(args: SelectSubset<T, DiscussionScheduleUpdateArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DiscussionSchedules.
     * @param {DiscussionScheduleDeleteManyArgs} args - Arguments to filter DiscussionSchedules to delete.
     * @example
     * // Delete a few DiscussionSchedules
     * const { count } = await prisma.discussionSchedule.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiscussionScheduleDeleteManyArgs>(args?: SelectSubset<T, DiscussionScheduleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiscussionSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiscussionSchedules
     * const discussionSchedule = await prisma.discussionSchedule.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiscussionScheduleUpdateManyArgs>(args: SelectSubset<T, DiscussionScheduleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DiscussionSchedule.
     * @param {DiscussionScheduleUpsertArgs} args - Arguments to update or create a DiscussionSchedule.
     * @example
     * // Update or create a DiscussionSchedule
     * const discussionSchedule = await prisma.discussionSchedule.upsert({
     *   create: {
     *     // ... data to create a DiscussionSchedule
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiscussionSchedule we want to update
     *   }
     * })
     */
    upsert<T extends DiscussionScheduleUpsertArgs>(args: SelectSubset<T, DiscussionScheduleUpsertArgs<ExtArgs>>): Prisma__DiscussionScheduleClient<$Result.GetResult<Prisma.$DiscussionSchedulePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DiscussionSchedules.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleCountArgs} args - Arguments to filter DiscussionSchedules to count.
     * @example
     * // Count the number of DiscussionSchedules
     * const count = await prisma.discussionSchedule.count({
     *   where: {
     *     // ... the filter for the DiscussionSchedules we want to count
     *   }
     * })
    **/
    count<T extends DiscussionScheduleCountArgs>(
      args?: Subset<T, DiscussionScheduleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiscussionScheduleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiscussionSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiscussionScheduleAggregateArgs>(args: Subset<T, DiscussionScheduleAggregateArgs>): Prisma.PrismaPromise<GetDiscussionScheduleAggregateType<T>>

    /**
     * Group by DiscussionSchedule.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionScheduleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiscussionScheduleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiscussionScheduleGroupByArgs['orderBy'] }
        : { orderBy?: DiscussionScheduleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiscussionScheduleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiscussionScheduleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiscussionSchedule model
   */
  readonly fields: DiscussionScheduleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiscussionSchedule.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiscussionScheduleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiscussionSchedule model
   */ 
  interface DiscussionScheduleFieldRefs {
    readonly id: FieldRef<"DiscussionSchedule", 'String'>
    readonly serverId: FieldRef<"DiscussionSchedule", 'String'>
    readonly channelId: FieldRef<"DiscussionSchedule", 'String'>
    readonly days: FieldRef<"DiscussionSchedule", 'Json'>
    readonly timeUtc: FieldRef<"DiscussionSchedule", 'String'>
    readonly timezone: FieldRef<"DiscussionSchedule", 'String'>
    readonly categoryFilter: FieldRef<"DiscussionSchedule", 'String'>
    readonly useAi: FieldRef<"DiscussionSchedule", 'Boolean'>
    readonly isActive: FieldRef<"DiscussionSchedule", 'Boolean'>
    readonly createdBy: FieldRef<"DiscussionSchedule", 'String'>
    readonly createdAt: FieldRef<"DiscussionSchedule", 'DateTime'>
    readonly updatedAt: FieldRef<"DiscussionSchedule", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiscussionSchedule findUnique
   */
  export type DiscussionScheduleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionSchedule to fetch.
     */
    where: DiscussionScheduleWhereUniqueInput
  }

  /**
   * DiscussionSchedule findUniqueOrThrow
   */
  export type DiscussionScheduleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionSchedule to fetch.
     */
    where: DiscussionScheduleWhereUniqueInput
  }

  /**
   * DiscussionSchedule findFirst
   */
  export type DiscussionScheduleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionSchedule to fetch.
     */
    where?: DiscussionScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionSchedules to fetch.
     */
    orderBy?: DiscussionScheduleOrderByWithRelationInput | DiscussionScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiscussionSchedules.
     */
    cursor?: DiscussionScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiscussionSchedules.
     */
    distinct?: DiscussionScheduleScalarFieldEnum | DiscussionScheduleScalarFieldEnum[]
  }

  /**
   * DiscussionSchedule findFirstOrThrow
   */
  export type DiscussionScheduleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionSchedule to fetch.
     */
    where?: DiscussionScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionSchedules to fetch.
     */
    orderBy?: DiscussionScheduleOrderByWithRelationInput | DiscussionScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiscussionSchedules.
     */
    cursor?: DiscussionScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionSchedules.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiscussionSchedules.
     */
    distinct?: DiscussionScheduleScalarFieldEnum | DiscussionScheduleScalarFieldEnum[]
  }

  /**
   * DiscussionSchedule findMany
   */
  export type DiscussionScheduleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionSchedules to fetch.
     */
    where?: DiscussionScheduleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionSchedules to fetch.
     */
    orderBy?: DiscussionScheduleOrderByWithRelationInput | DiscussionScheduleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiscussionSchedules.
     */
    cursor?: DiscussionScheduleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionSchedules from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionSchedules.
     */
    skip?: number
    distinct?: DiscussionScheduleScalarFieldEnum | DiscussionScheduleScalarFieldEnum[]
  }

  /**
   * DiscussionSchedule create
   */
  export type DiscussionScheduleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * The data needed to create a DiscussionSchedule.
     */
    data: XOR<DiscussionScheduleCreateInput, DiscussionScheduleUncheckedCreateInput>
  }

  /**
   * DiscussionSchedule createMany
   */
  export type DiscussionScheduleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiscussionSchedules.
     */
    data: DiscussionScheduleCreateManyInput | DiscussionScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiscussionSchedule createManyAndReturn
   */
  export type DiscussionScheduleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DiscussionSchedules.
     */
    data: DiscussionScheduleCreateManyInput | DiscussionScheduleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiscussionSchedule update
   */
  export type DiscussionScheduleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * The data needed to update a DiscussionSchedule.
     */
    data: XOR<DiscussionScheduleUpdateInput, DiscussionScheduleUncheckedUpdateInput>
    /**
     * Choose, which DiscussionSchedule to update.
     */
    where: DiscussionScheduleWhereUniqueInput
  }

  /**
   * DiscussionSchedule updateMany
   */
  export type DiscussionScheduleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiscussionSchedules.
     */
    data: XOR<DiscussionScheduleUpdateManyMutationInput, DiscussionScheduleUncheckedUpdateManyInput>
    /**
     * Filter which DiscussionSchedules to update
     */
    where?: DiscussionScheduleWhereInput
  }

  /**
   * DiscussionSchedule upsert
   */
  export type DiscussionScheduleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * The filter to search for the DiscussionSchedule to update in case it exists.
     */
    where: DiscussionScheduleWhereUniqueInput
    /**
     * In case the DiscussionSchedule found by the `where` argument doesn't exist, create a new DiscussionSchedule with this data.
     */
    create: XOR<DiscussionScheduleCreateInput, DiscussionScheduleUncheckedCreateInput>
    /**
     * In case the DiscussionSchedule was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiscussionScheduleUpdateInput, DiscussionScheduleUncheckedUpdateInput>
  }

  /**
   * DiscussionSchedule delete
   */
  export type DiscussionScheduleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
    /**
     * Filter which DiscussionSchedule to delete.
     */
    where: DiscussionScheduleWhereUniqueInput
  }

  /**
   * DiscussionSchedule deleteMany
   */
  export type DiscussionScheduleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiscussionSchedules to delete
     */
    where?: DiscussionScheduleWhereInput
  }

  /**
   * DiscussionSchedule without action
   */
  export type DiscussionScheduleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionSchedule
     */
    select?: DiscussionScheduleSelect<ExtArgs> | null
  }


  /**
   * Model AIAccessGrant
   */

  export type AggregateAIAccessGrant = {
    _count: AIAccessGrantCountAggregateOutputType | null
    _min: AIAccessGrantMinAggregateOutputType | null
    _max: AIAccessGrantMaxAggregateOutputType | null
  }

  export type AIAccessGrantMinAggregateOutputType = {
    id: string | null
    serverId: string | null
    grantType: $Enums.AIGrantType | null
    targetId: string | null
    grantedBy: string | null
    createdAt: Date | null
  }

  export type AIAccessGrantMaxAggregateOutputType = {
    id: string | null
    serverId: string | null
    grantType: $Enums.AIGrantType | null
    targetId: string | null
    grantedBy: string | null
    createdAt: Date | null
  }

  export type AIAccessGrantCountAggregateOutputType = {
    id: number
    serverId: number
    grantType: number
    targetId: number
    grantedBy: number
    createdAt: number
    _all: number
  }


  export type AIAccessGrantMinAggregateInputType = {
    id?: true
    serverId?: true
    grantType?: true
    targetId?: true
    grantedBy?: true
    createdAt?: true
  }

  export type AIAccessGrantMaxAggregateInputType = {
    id?: true
    serverId?: true
    grantType?: true
    targetId?: true
    grantedBy?: true
    createdAt?: true
  }

  export type AIAccessGrantCountAggregateInputType = {
    id?: true
    serverId?: true
    grantType?: true
    targetId?: true
    grantedBy?: true
    createdAt?: true
    _all?: true
  }

  export type AIAccessGrantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIAccessGrant to aggregate.
     */
    where?: AIAccessGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAccessGrants to fetch.
     */
    orderBy?: AIAccessGrantOrderByWithRelationInput | AIAccessGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AIAccessGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAccessGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAccessGrants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AIAccessGrants
    **/
    _count?: true | AIAccessGrantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AIAccessGrantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AIAccessGrantMaxAggregateInputType
  }

  export type GetAIAccessGrantAggregateType<T extends AIAccessGrantAggregateArgs> = {
        [P in keyof T & keyof AggregateAIAccessGrant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAIAccessGrant[P]>
      : GetScalarType<T[P], AggregateAIAccessGrant[P]>
  }




  export type AIAccessGrantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AIAccessGrantWhereInput
    orderBy?: AIAccessGrantOrderByWithAggregationInput | AIAccessGrantOrderByWithAggregationInput[]
    by: AIAccessGrantScalarFieldEnum[] | AIAccessGrantScalarFieldEnum
    having?: AIAccessGrantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AIAccessGrantCountAggregateInputType | true
    _min?: AIAccessGrantMinAggregateInputType
    _max?: AIAccessGrantMaxAggregateInputType
  }

  export type AIAccessGrantGroupByOutputType = {
    id: string
    serverId: string
    grantType: $Enums.AIGrantType
    targetId: string
    grantedBy: string
    createdAt: Date
    _count: AIAccessGrantCountAggregateOutputType | null
    _min: AIAccessGrantMinAggregateOutputType | null
    _max: AIAccessGrantMaxAggregateOutputType | null
  }

  type GetAIAccessGrantGroupByPayload<T extends AIAccessGrantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AIAccessGrantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AIAccessGrantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AIAccessGrantGroupByOutputType[P]>
            : GetScalarType<T[P], AIAccessGrantGroupByOutputType[P]>
        }
      >
    >


  export type AIAccessGrantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    grantType?: boolean
    targetId?: boolean
    grantedBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aIAccessGrant"]>

  export type AIAccessGrantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    grantType?: boolean
    targetId?: boolean
    grantedBy?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aIAccessGrant"]>

  export type AIAccessGrantSelectScalar = {
    id?: boolean
    serverId?: boolean
    grantType?: boolean
    targetId?: boolean
    grantedBy?: boolean
    createdAt?: boolean
  }


  export type $AIAccessGrantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AIAccessGrant"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serverId: string
      grantType: $Enums.AIGrantType
      targetId: string
      grantedBy: string
      createdAt: Date
    }, ExtArgs["result"]["aIAccessGrant"]>
    composites: {}
  }

  type AIAccessGrantGetPayload<S extends boolean | null | undefined | AIAccessGrantDefaultArgs> = $Result.GetResult<Prisma.$AIAccessGrantPayload, S>

  type AIAccessGrantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AIAccessGrantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AIAccessGrantCountAggregateInputType | true
    }

  export interface AIAccessGrantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AIAccessGrant'], meta: { name: 'AIAccessGrant' } }
    /**
     * Find zero or one AIAccessGrant that matches the filter.
     * @param {AIAccessGrantFindUniqueArgs} args - Arguments to find a AIAccessGrant
     * @example
     * // Get one AIAccessGrant
     * const aIAccessGrant = await prisma.aIAccessGrant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AIAccessGrantFindUniqueArgs>(args: SelectSubset<T, AIAccessGrantFindUniqueArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one AIAccessGrant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AIAccessGrantFindUniqueOrThrowArgs} args - Arguments to find a AIAccessGrant
     * @example
     * // Get one AIAccessGrant
     * const aIAccessGrant = await prisma.aIAccessGrant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AIAccessGrantFindUniqueOrThrowArgs>(args: SelectSubset<T, AIAccessGrantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first AIAccessGrant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantFindFirstArgs} args - Arguments to find a AIAccessGrant
     * @example
     * // Get one AIAccessGrant
     * const aIAccessGrant = await prisma.aIAccessGrant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AIAccessGrantFindFirstArgs>(args?: SelectSubset<T, AIAccessGrantFindFirstArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first AIAccessGrant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantFindFirstOrThrowArgs} args - Arguments to find a AIAccessGrant
     * @example
     * // Get one AIAccessGrant
     * const aIAccessGrant = await prisma.aIAccessGrant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AIAccessGrantFindFirstOrThrowArgs>(args?: SelectSubset<T, AIAccessGrantFindFirstOrThrowArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more AIAccessGrants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AIAccessGrants
     * const aIAccessGrants = await prisma.aIAccessGrant.findMany()
     * 
     * // Get first 10 AIAccessGrants
     * const aIAccessGrants = await prisma.aIAccessGrant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aIAccessGrantWithIdOnly = await prisma.aIAccessGrant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AIAccessGrantFindManyArgs>(args?: SelectSubset<T, AIAccessGrantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a AIAccessGrant.
     * @param {AIAccessGrantCreateArgs} args - Arguments to create a AIAccessGrant.
     * @example
     * // Create one AIAccessGrant
     * const AIAccessGrant = await prisma.aIAccessGrant.create({
     *   data: {
     *     // ... data to create a AIAccessGrant
     *   }
     * })
     * 
     */
    create<T extends AIAccessGrantCreateArgs>(args: SelectSubset<T, AIAccessGrantCreateArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many AIAccessGrants.
     * @param {AIAccessGrantCreateManyArgs} args - Arguments to create many AIAccessGrants.
     * @example
     * // Create many AIAccessGrants
     * const aIAccessGrant = await prisma.aIAccessGrant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AIAccessGrantCreateManyArgs>(args?: SelectSubset<T, AIAccessGrantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AIAccessGrants and returns the data saved in the database.
     * @param {AIAccessGrantCreateManyAndReturnArgs} args - Arguments to create many AIAccessGrants.
     * @example
     * // Create many AIAccessGrants
     * const aIAccessGrant = await prisma.aIAccessGrant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AIAccessGrants and only return the `id`
     * const aIAccessGrantWithIdOnly = await prisma.aIAccessGrant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AIAccessGrantCreateManyAndReturnArgs>(args?: SelectSubset<T, AIAccessGrantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a AIAccessGrant.
     * @param {AIAccessGrantDeleteArgs} args - Arguments to delete one AIAccessGrant.
     * @example
     * // Delete one AIAccessGrant
     * const AIAccessGrant = await prisma.aIAccessGrant.delete({
     *   where: {
     *     // ... filter to delete one AIAccessGrant
     *   }
     * })
     * 
     */
    delete<T extends AIAccessGrantDeleteArgs>(args: SelectSubset<T, AIAccessGrantDeleteArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one AIAccessGrant.
     * @param {AIAccessGrantUpdateArgs} args - Arguments to update one AIAccessGrant.
     * @example
     * // Update one AIAccessGrant
     * const aIAccessGrant = await prisma.aIAccessGrant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AIAccessGrantUpdateArgs>(args: SelectSubset<T, AIAccessGrantUpdateArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more AIAccessGrants.
     * @param {AIAccessGrantDeleteManyArgs} args - Arguments to filter AIAccessGrants to delete.
     * @example
     * // Delete a few AIAccessGrants
     * const { count } = await prisma.aIAccessGrant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AIAccessGrantDeleteManyArgs>(args?: SelectSubset<T, AIAccessGrantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AIAccessGrants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AIAccessGrants
     * const aIAccessGrant = await prisma.aIAccessGrant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AIAccessGrantUpdateManyArgs>(args: SelectSubset<T, AIAccessGrantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one AIAccessGrant.
     * @param {AIAccessGrantUpsertArgs} args - Arguments to update or create a AIAccessGrant.
     * @example
     * // Update or create a AIAccessGrant
     * const aIAccessGrant = await prisma.aIAccessGrant.upsert({
     *   create: {
     *     // ... data to create a AIAccessGrant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AIAccessGrant we want to update
     *   }
     * })
     */
    upsert<T extends AIAccessGrantUpsertArgs>(args: SelectSubset<T, AIAccessGrantUpsertArgs<ExtArgs>>): Prisma__AIAccessGrantClient<$Result.GetResult<Prisma.$AIAccessGrantPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of AIAccessGrants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantCountArgs} args - Arguments to filter AIAccessGrants to count.
     * @example
     * // Count the number of AIAccessGrants
     * const count = await prisma.aIAccessGrant.count({
     *   where: {
     *     // ... the filter for the AIAccessGrants we want to count
     *   }
     * })
    **/
    count<T extends AIAccessGrantCountArgs>(
      args?: Subset<T, AIAccessGrantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AIAccessGrantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AIAccessGrant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AIAccessGrantAggregateArgs>(args: Subset<T, AIAccessGrantAggregateArgs>): Prisma.PrismaPromise<GetAIAccessGrantAggregateType<T>>

    /**
     * Group by AIAccessGrant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AIAccessGrantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AIAccessGrantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AIAccessGrantGroupByArgs['orderBy'] }
        : { orderBy?: AIAccessGrantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AIAccessGrantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAIAccessGrantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AIAccessGrant model
   */
  readonly fields: AIAccessGrantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AIAccessGrant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AIAccessGrantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AIAccessGrant model
   */ 
  interface AIAccessGrantFieldRefs {
    readonly id: FieldRef<"AIAccessGrant", 'String'>
    readonly serverId: FieldRef<"AIAccessGrant", 'String'>
    readonly grantType: FieldRef<"AIAccessGrant", 'AIGrantType'>
    readonly targetId: FieldRef<"AIAccessGrant", 'String'>
    readonly grantedBy: FieldRef<"AIAccessGrant", 'String'>
    readonly createdAt: FieldRef<"AIAccessGrant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AIAccessGrant findUnique
   */
  export type AIAccessGrantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * Filter, which AIAccessGrant to fetch.
     */
    where: AIAccessGrantWhereUniqueInput
  }

  /**
   * AIAccessGrant findUniqueOrThrow
   */
  export type AIAccessGrantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * Filter, which AIAccessGrant to fetch.
     */
    where: AIAccessGrantWhereUniqueInput
  }

  /**
   * AIAccessGrant findFirst
   */
  export type AIAccessGrantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * Filter, which AIAccessGrant to fetch.
     */
    where?: AIAccessGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAccessGrants to fetch.
     */
    orderBy?: AIAccessGrantOrderByWithRelationInput | AIAccessGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIAccessGrants.
     */
    cursor?: AIAccessGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAccessGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAccessGrants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIAccessGrants.
     */
    distinct?: AIAccessGrantScalarFieldEnum | AIAccessGrantScalarFieldEnum[]
  }

  /**
   * AIAccessGrant findFirstOrThrow
   */
  export type AIAccessGrantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * Filter, which AIAccessGrant to fetch.
     */
    where?: AIAccessGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAccessGrants to fetch.
     */
    orderBy?: AIAccessGrantOrderByWithRelationInput | AIAccessGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AIAccessGrants.
     */
    cursor?: AIAccessGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAccessGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAccessGrants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AIAccessGrants.
     */
    distinct?: AIAccessGrantScalarFieldEnum | AIAccessGrantScalarFieldEnum[]
  }

  /**
   * AIAccessGrant findMany
   */
  export type AIAccessGrantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * Filter, which AIAccessGrants to fetch.
     */
    where?: AIAccessGrantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AIAccessGrants to fetch.
     */
    orderBy?: AIAccessGrantOrderByWithRelationInput | AIAccessGrantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AIAccessGrants.
     */
    cursor?: AIAccessGrantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AIAccessGrants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AIAccessGrants.
     */
    skip?: number
    distinct?: AIAccessGrantScalarFieldEnum | AIAccessGrantScalarFieldEnum[]
  }

  /**
   * AIAccessGrant create
   */
  export type AIAccessGrantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * The data needed to create a AIAccessGrant.
     */
    data: XOR<AIAccessGrantCreateInput, AIAccessGrantUncheckedCreateInput>
  }

  /**
   * AIAccessGrant createMany
   */
  export type AIAccessGrantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AIAccessGrants.
     */
    data: AIAccessGrantCreateManyInput | AIAccessGrantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIAccessGrant createManyAndReturn
   */
  export type AIAccessGrantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many AIAccessGrants.
     */
    data: AIAccessGrantCreateManyInput | AIAccessGrantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AIAccessGrant update
   */
  export type AIAccessGrantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * The data needed to update a AIAccessGrant.
     */
    data: XOR<AIAccessGrantUpdateInput, AIAccessGrantUncheckedUpdateInput>
    /**
     * Choose, which AIAccessGrant to update.
     */
    where: AIAccessGrantWhereUniqueInput
  }

  /**
   * AIAccessGrant updateMany
   */
  export type AIAccessGrantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AIAccessGrants.
     */
    data: XOR<AIAccessGrantUpdateManyMutationInput, AIAccessGrantUncheckedUpdateManyInput>
    /**
     * Filter which AIAccessGrants to update
     */
    where?: AIAccessGrantWhereInput
  }

  /**
   * AIAccessGrant upsert
   */
  export type AIAccessGrantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * The filter to search for the AIAccessGrant to update in case it exists.
     */
    where: AIAccessGrantWhereUniqueInput
    /**
     * In case the AIAccessGrant found by the `where` argument doesn't exist, create a new AIAccessGrant with this data.
     */
    create: XOR<AIAccessGrantCreateInput, AIAccessGrantUncheckedCreateInput>
    /**
     * In case the AIAccessGrant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AIAccessGrantUpdateInput, AIAccessGrantUncheckedUpdateInput>
  }

  /**
   * AIAccessGrant delete
   */
  export type AIAccessGrantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
    /**
     * Filter which AIAccessGrant to delete.
     */
    where: AIAccessGrantWhereUniqueInput
  }

  /**
   * AIAccessGrant deleteMany
   */
  export type AIAccessGrantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AIAccessGrants to delete
     */
    where?: AIAccessGrantWhereInput
  }

  /**
   * AIAccessGrant without action
   */
  export type AIAccessGrantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AIAccessGrant
     */
    select?: AIAccessGrantSelect<ExtArgs> | null
  }


  /**
   * Model DiscussionPromptLog
   */

  export type AggregateDiscussionPromptLog = {
    _count: DiscussionPromptLogCountAggregateOutputType | null
    _min: DiscussionPromptLogMinAggregateOutputType | null
    _max: DiscussionPromptLogMaxAggregateOutputType | null
  }

  export type DiscussionPromptLogMinAggregateOutputType = {
    id: string | null
    serverId: string | null
    channelId: string | null
    promptText: string | null
    category: string | null
    source: string | null
    threadId: string | null
    postedAt: Date | null
  }

  export type DiscussionPromptLogMaxAggregateOutputType = {
    id: string | null
    serverId: string | null
    channelId: string | null
    promptText: string | null
    category: string | null
    source: string | null
    threadId: string | null
    postedAt: Date | null
  }

  export type DiscussionPromptLogCountAggregateOutputType = {
    id: number
    serverId: number
    channelId: number
    promptText: number
    category: number
    source: number
    threadId: number
    postedAt: number
    _all: number
  }


  export type DiscussionPromptLogMinAggregateInputType = {
    id?: true
    serverId?: true
    channelId?: true
    promptText?: true
    category?: true
    source?: true
    threadId?: true
    postedAt?: true
  }

  export type DiscussionPromptLogMaxAggregateInputType = {
    id?: true
    serverId?: true
    channelId?: true
    promptText?: true
    category?: true
    source?: true
    threadId?: true
    postedAt?: true
  }

  export type DiscussionPromptLogCountAggregateInputType = {
    id?: true
    serverId?: true
    channelId?: true
    promptText?: true
    category?: true
    source?: true
    threadId?: true
    postedAt?: true
    _all?: true
  }

  export type DiscussionPromptLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiscussionPromptLog to aggregate.
     */
    where?: DiscussionPromptLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPromptLogs to fetch.
     */
    orderBy?: DiscussionPromptLogOrderByWithRelationInput | DiscussionPromptLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DiscussionPromptLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPromptLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPromptLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DiscussionPromptLogs
    **/
    _count?: true | DiscussionPromptLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DiscussionPromptLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DiscussionPromptLogMaxAggregateInputType
  }

  export type GetDiscussionPromptLogAggregateType<T extends DiscussionPromptLogAggregateArgs> = {
        [P in keyof T & keyof AggregateDiscussionPromptLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDiscussionPromptLog[P]>
      : GetScalarType<T[P], AggregateDiscussionPromptLog[P]>
  }




  export type DiscussionPromptLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DiscussionPromptLogWhereInput
    orderBy?: DiscussionPromptLogOrderByWithAggregationInput | DiscussionPromptLogOrderByWithAggregationInput[]
    by: DiscussionPromptLogScalarFieldEnum[] | DiscussionPromptLogScalarFieldEnum
    having?: DiscussionPromptLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DiscussionPromptLogCountAggregateInputType | true
    _min?: DiscussionPromptLogMinAggregateInputType
    _max?: DiscussionPromptLogMaxAggregateInputType
  }

  export type DiscussionPromptLogGroupByOutputType = {
    id: string
    serverId: string
    channelId: string
    promptText: string
    category: string
    source: string
    threadId: string | null
    postedAt: Date
    _count: DiscussionPromptLogCountAggregateOutputType | null
    _min: DiscussionPromptLogMinAggregateOutputType | null
    _max: DiscussionPromptLogMaxAggregateOutputType | null
  }

  type GetDiscussionPromptLogGroupByPayload<T extends DiscussionPromptLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DiscussionPromptLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DiscussionPromptLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DiscussionPromptLogGroupByOutputType[P]>
            : GetScalarType<T[P], DiscussionPromptLogGroupByOutputType[P]>
        }
      >
    >


  export type DiscussionPromptLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    channelId?: boolean
    promptText?: boolean
    category?: boolean
    source?: boolean
    threadId?: boolean
    postedAt?: boolean
  }, ExtArgs["result"]["discussionPromptLog"]>

  export type DiscussionPromptLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    serverId?: boolean
    channelId?: boolean
    promptText?: boolean
    category?: boolean
    source?: boolean
    threadId?: boolean
    postedAt?: boolean
  }, ExtArgs["result"]["discussionPromptLog"]>

  export type DiscussionPromptLogSelectScalar = {
    id?: boolean
    serverId?: boolean
    channelId?: boolean
    promptText?: boolean
    category?: boolean
    source?: boolean
    threadId?: boolean
    postedAt?: boolean
  }


  export type $DiscussionPromptLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DiscussionPromptLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      serverId: string
      channelId: string
      promptText: string
      category: string
      source: string
      threadId: string | null
      postedAt: Date
    }, ExtArgs["result"]["discussionPromptLog"]>
    composites: {}
  }

  type DiscussionPromptLogGetPayload<S extends boolean | null | undefined | DiscussionPromptLogDefaultArgs> = $Result.GetResult<Prisma.$DiscussionPromptLogPayload, S>

  type DiscussionPromptLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DiscussionPromptLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DiscussionPromptLogCountAggregateInputType | true
    }

  export interface DiscussionPromptLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DiscussionPromptLog'], meta: { name: 'DiscussionPromptLog' } }
    /**
     * Find zero or one DiscussionPromptLog that matches the filter.
     * @param {DiscussionPromptLogFindUniqueArgs} args - Arguments to find a DiscussionPromptLog
     * @example
     * // Get one DiscussionPromptLog
     * const discussionPromptLog = await prisma.discussionPromptLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DiscussionPromptLogFindUniqueArgs>(args: SelectSubset<T, DiscussionPromptLogFindUniqueArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DiscussionPromptLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DiscussionPromptLogFindUniqueOrThrowArgs} args - Arguments to find a DiscussionPromptLog
     * @example
     * // Get one DiscussionPromptLog
     * const discussionPromptLog = await prisma.discussionPromptLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DiscussionPromptLogFindUniqueOrThrowArgs>(args: SelectSubset<T, DiscussionPromptLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DiscussionPromptLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogFindFirstArgs} args - Arguments to find a DiscussionPromptLog
     * @example
     * // Get one DiscussionPromptLog
     * const discussionPromptLog = await prisma.discussionPromptLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DiscussionPromptLogFindFirstArgs>(args?: SelectSubset<T, DiscussionPromptLogFindFirstArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DiscussionPromptLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogFindFirstOrThrowArgs} args - Arguments to find a DiscussionPromptLog
     * @example
     * // Get one DiscussionPromptLog
     * const discussionPromptLog = await prisma.discussionPromptLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DiscussionPromptLogFindFirstOrThrowArgs>(args?: SelectSubset<T, DiscussionPromptLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DiscussionPromptLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DiscussionPromptLogs
     * const discussionPromptLogs = await prisma.discussionPromptLog.findMany()
     * 
     * // Get first 10 DiscussionPromptLogs
     * const discussionPromptLogs = await prisma.discussionPromptLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const discussionPromptLogWithIdOnly = await prisma.discussionPromptLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DiscussionPromptLogFindManyArgs>(args?: SelectSubset<T, DiscussionPromptLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DiscussionPromptLog.
     * @param {DiscussionPromptLogCreateArgs} args - Arguments to create a DiscussionPromptLog.
     * @example
     * // Create one DiscussionPromptLog
     * const DiscussionPromptLog = await prisma.discussionPromptLog.create({
     *   data: {
     *     // ... data to create a DiscussionPromptLog
     *   }
     * })
     * 
     */
    create<T extends DiscussionPromptLogCreateArgs>(args: SelectSubset<T, DiscussionPromptLogCreateArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DiscussionPromptLogs.
     * @param {DiscussionPromptLogCreateManyArgs} args - Arguments to create many DiscussionPromptLogs.
     * @example
     * // Create many DiscussionPromptLogs
     * const discussionPromptLog = await prisma.discussionPromptLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DiscussionPromptLogCreateManyArgs>(args?: SelectSubset<T, DiscussionPromptLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DiscussionPromptLogs and returns the data saved in the database.
     * @param {DiscussionPromptLogCreateManyAndReturnArgs} args - Arguments to create many DiscussionPromptLogs.
     * @example
     * // Create many DiscussionPromptLogs
     * const discussionPromptLog = await prisma.discussionPromptLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DiscussionPromptLogs and only return the `id`
     * const discussionPromptLogWithIdOnly = await prisma.discussionPromptLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DiscussionPromptLogCreateManyAndReturnArgs>(args?: SelectSubset<T, DiscussionPromptLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a DiscussionPromptLog.
     * @param {DiscussionPromptLogDeleteArgs} args - Arguments to delete one DiscussionPromptLog.
     * @example
     * // Delete one DiscussionPromptLog
     * const DiscussionPromptLog = await prisma.discussionPromptLog.delete({
     *   where: {
     *     // ... filter to delete one DiscussionPromptLog
     *   }
     * })
     * 
     */
    delete<T extends DiscussionPromptLogDeleteArgs>(args: SelectSubset<T, DiscussionPromptLogDeleteArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DiscussionPromptLog.
     * @param {DiscussionPromptLogUpdateArgs} args - Arguments to update one DiscussionPromptLog.
     * @example
     * // Update one DiscussionPromptLog
     * const discussionPromptLog = await prisma.discussionPromptLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DiscussionPromptLogUpdateArgs>(args: SelectSubset<T, DiscussionPromptLogUpdateArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DiscussionPromptLogs.
     * @param {DiscussionPromptLogDeleteManyArgs} args - Arguments to filter DiscussionPromptLogs to delete.
     * @example
     * // Delete a few DiscussionPromptLogs
     * const { count } = await prisma.discussionPromptLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DiscussionPromptLogDeleteManyArgs>(args?: SelectSubset<T, DiscussionPromptLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DiscussionPromptLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DiscussionPromptLogs
     * const discussionPromptLog = await prisma.discussionPromptLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DiscussionPromptLogUpdateManyArgs>(args: SelectSubset<T, DiscussionPromptLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DiscussionPromptLog.
     * @param {DiscussionPromptLogUpsertArgs} args - Arguments to update or create a DiscussionPromptLog.
     * @example
     * // Update or create a DiscussionPromptLog
     * const discussionPromptLog = await prisma.discussionPromptLog.upsert({
     *   create: {
     *     // ... data to create a DiscussionPromptLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DiscussionPromptLog we want to update
     *   }
     * })
     */
    upsert<T extends DiscussionPromptLogUpsertArgs>(args: SelectSubset<T, DiscussionPromptLogUpsertArgs<ExtArgs>>): Prisma__DiscussionPromptLogClient<$Result.GetResult<Prisma.$DiscussionPromptLogPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of DiscussionPromptLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogCountArgs} args - Arguments to filter DiscussionPromptLogs to count.
     * @example
     * // Count the number of DiscussionPromptLogs
     * const count = await prisma.discussionPromptLog.count({
     *   where: {
     *     // ... the filter for the DiscussionPromptLogs we want to count
     *   }
     * })
    **/
    count<T extends DiscussionPromptLogCountArgs>(
      args?: Subset<T, DiscussionPromptLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DiscussionPromptLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DiscussionPromptLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DiscussionPromptLogAggregateArgs>(args: Subset<T, DiscussionPromptLogAggregateArgs>): Prisma.PrismaPromise<GetDiscussionPromptLogAggregateType<T>>

    /**
     * Group by DiscussionPromptLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DiscussionPromptLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DiscussionPromptLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DiscussionPromptLogGroupByArgs['orderBy'] }
        : { orderBy?: DiscussionPromptLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DiscussionPromptLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDiscussionPromptLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DiscussionPromptLog model
   */
  readonly fields: DiscussionPromptLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DiscussionPromptLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DiscussionPromptLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DiscussionPromptLog model
   */ 
  interface DiscussionPromptLogFieldRefs {
    readonly id: FieldRef<"DiscussionPromptLog", 'String'>
    readonly serverId: FieldRef<"DiscussionPromptLog", 'String'>
    readonly channelId: FieldRef<"DiscussionPromptLog", 'String'>
    readonly promptText: FieldRef<"DiscussionPromptLog", 'String'>
    readonly category: FieldRef<"DiscussionPromptLog", 'String'>
    readonly source: FieldRef<"DiscussionPromptLog", 'String'>
    readonly threadId: FieldRef<"DiscussionPromptLog", 'String'>
    readonly postedAt: FieldRef<"DiscussionPromptLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DiscussionPromptLog findUnique
   */
  export type DiscussionPromptLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionPromptLog to fetch.
     */
    where: DiscussionPromptLogWhereUniqueInput
  }

  /**
   * DiscussionPromptLog findUniqueOrThrow
   */
  export type DiscussionPromptLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionPromptLog to fetch.
     */
    where: DiscussionPromptLogWhereUniqueInput
  }

  /**
   * DiscussionPromptLog findFirst
   */
  export type DiscussionPromptLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionPromptLog to fetch.
     */
    where?: DiscussionPromptLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPromptLogs to fetch.
     */
    orderBy?: DiscussionPromptLogOrderByWithRelationInput | DiscussionPromptLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiscussionPromptLogs.
     */
    cursor?: DiscussionPromptLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPromptLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPromptLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiscussionPromptLogs.
     */
    distinct?: DiscussionPromptLogScalarFieldEnum | DiscussionPromptLogScalarFieldEnum[]
  }

  /**
   * DiscussionPromptLog findFirstOrThrow
   */
  export type DiscussionPromptLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionPromptLog to fetch.
     */
    where?: DiscussionPromptLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPromptLogs to fetch.
     */
    orderBy?: DiscussionPromptLogOrderByWithRelationInput | DiscussionPromptLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DiscussionPromptLogs.
     */
    cursor?: DiscussionPromptLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPromptLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPromptLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DiscussionPromptLogs.
     */
    distinct?: DiscussionPromptLogScalarFieldEnum | DiscussionPromptLogScalarFieldEnum[]
  }

  /**
   * DiscussionPromptLog findMany
   */
  export type DiscussionPromptLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * Filter, which DiscussionPromptLogs to fetch.
     */
    where?: DiscussionPromptLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DiscussionPromptLogs to fetch.
     */
    orderBy?: DiscussionPromptLogOrderByWithRelationInput | DiscussionPromptLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DiscussionPromptLogs.
     */
    cursor?: DiscussionPromptLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DiscussionPromptLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DiscussionPromptLogs.
     */
    skip?: number
    distinct?: DiscussionPromptLogScalarFieldEnum | DiscussionPromptLogScalarFieldEnum[]
  }

  /**
   * DiscussionPromptLog create
   */
  export type DiscussionPromptLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * The data needed to create a DiscussionPromptLog.
     */
    data: XOR<DiscussionPromptLogCreateInput, DiscussionPromptLogUncheckedCreateInput>
  }

  /**
   * DiscussionPromptLog createMany
   */
  export type DiscussionPromptLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DiscussionPromptLogs.
     */
    data: DiscussionPromptLogCreateManyInput | DiscussionPromptLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiscussionPromptLog createManyAndReturn
   */
  export type DiscussionPromptLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many DiscussionPromptLogs.
     */
    data: DiscussionPromptLogCreateManyInput | DiscussionPromptLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DiscussionPromptLog update
   */
  export type DiscussionPromptLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * The data needed to update a DiscussionPromptLog.
     */
    data: XOR<DiscussionPromptLogUpdateInput, DiscussionPromptLogUncheckedUpdateInput>
    /**
     * Choose, which DiscussionPromptLog to update.
     */
    where: DiscussionPromptLogWhereUniqueInput
  }

  /**
   * DiscussionPromptLog updateMany
   */
  export type DiscussionPromptLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DiscussionPromptLogs.
     */
    data: XOR<DiscussionPromptLogUpdateManyMutationInput, DiscussionPromptLogUncheckedUpdateManyInput>
    /**
     * Filter which DiscussionPromptLogs to update
     */
    where?: DiscussionPromptLogWhereInput
  }

  /**
   * DiscussionPromptLog upsert
   */
  export type DiscussionPromptLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * The filter to search for the DiscussionPromptLog to update in case it exists.
     */
    where: DiscussionPromptLogWhereUniqueInput
    /**
     * In case the DiscussionPromptLog found by the `where` argument doesn't exist, create a new DiscussionPromptLog with this data.
     */
    create: XOR<DiscussionPromptLogCreateInput, DiscussionPromptLogUncheckedCreateInput>
    /**
     * In case the DiscussionPromptLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DiscussionPromptLogUpdateInput, DiscussionPromptLogUncheckedUpdateInput>
  }

  /**
   * DiscussionPromptLog delete
   */
  export type DiscussionPromptLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
    /**
     * Filter which DiscussionPromptLog to delete.
     */
    where: DiscussionPromptLogWhereUniqueInput
  }

  /**
   * DiscussionPromptLog deleteMany
   */
  export type DiscussionPromptLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DiscussionPromptLogs to delete
     */
    where?: DiscussionPromptLogWhereInput
  }

  /**
   * DiscussionPromptLog without action
   */
  export type DiscussionPromptLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DiscussionPromptLog
     */
    select?: DiscussionPromptLogSelect<ExtArgs> | null
  }


  /**
   * Model Prompt
   */

  export type AggregatePrompt = {
    _count: PromptCountAggregateOutputType | null
    _min: PromptMinAggregateOutputType | null
    _max: PromptMaxAggregateOutputType | null
  }

  export type PromptMinAggregateOutputType = {
    id: string | null
    text: string | null
    originalCategory: string | null
    submittedBy: string | null
    submittedByUsername: string | null
    createdAt: Date | null
  }

  export type PromptMaxAggregateOutputType = {
    id: string | null
    text: string | null
    originalCategory: string | null
    submittedBy: string | null
    submittedByUsername: string | null
    createdAt: Date | null
  }

  export type PromptCountAggregateOutputType = {
    id: number
    text: number
    originalCategory: number
    submittedBy: number
    submittedByUsername: number
    createdAt: number
    _all: number
  }


  export type PromptMinAggregateInputType = {
    id?: true
    text?: true
    originalCategory?: true
    submittedBy?: true
    submittedByUsername?: true
    createdAt?: true
  }

  export type PromptMaxAggregateInputType = {
    id?: true
    text?: true
    originalCategory?: true
    submittedBy?: true
    submittedByUsername?: true
    createdAt?: true
  }

  export type PromptCountAggregateInputType = {
    id?: true
    text?: true
    originalCategory?: true
    submittedBy?: true
    submittedByUsername?: true
    createdAt?: true
    _all?: true
  }

  export type PromptAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Prompt to aggregate.
     */
    where?: PromptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prompts to fetch.
     */
    orderBy?: PromptOrderByWithRelationInput | PromptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prompts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prompts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Prompts
    **/
    _count?: true | PromptCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromptMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromptMaxAggregateInputType
  }

  export type GetPromptAggregateType<T extends PromptAggregateArgs> = {
        [P in keyof T & keyof AggregatePrompt]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrompt[P]>
      : GetScalarType<T[P], AggregatePrompt[P]>
  }




  export type PromptGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptWhereInput
    orderBy?: PromptOrderByWithAggregationInput | PromptOrderByWithAggregationInput[]
    by: PromptScalarFieldEnum[] | PromptScalarFieldEnum
    having?: PromptScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromptCountAggregateInputType | true
    _min?: PromptMinAggregateInputType
    _max?: PromptMaxAggregateInputType
  }

  export type PromptGroupByOutputType = {
    id: string
    text: string
    originalCategory: string
    submittedBy: string | null
    submittedByUsername: string | null
    createdAt: Date
    _count: PromptCountAggregateOutputType | null
    _min: PromptMinAggregateOutputType | null
    _max: PromptMaxAggregateOutputType | null
  }

  type GetPromptGroupByPayload<T extends PromptGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromptGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromptGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromptGroupByOutputType[P]>
            : GetScalarType<T[P], PromptGroupByOutputType[P]>
        }
      >
    >


  export type PromptSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    text?: boolean
    originalCategory?: boolean
    submittedBy?: boolean
    submittedByUsername?: boolean
    createdAt?: boolean
    tags?: boolean | Prompt$tagsArgs<ExtArgs>
    votes?: boolean | Prompt$votesArgs<ExtArgs>
    duplicateFlags?: boolean | Prompt$duplicateFlagsArgs<ExtArgs>
    _count?: boolean | PromptCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["prompt"]>

  export type PromptSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    text?: boolean
    originalCategory?: boolean
    submittedBy?: boolean
    submittedByUsername?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["prompt"]>

  export type PromptSelectScalar = {
    id?: boolean
    text?: boolean
    originalCategory?: boolean
    submittedBy?: boolean
    submittedByUsername?: boolean
    createdAt?: boolean
  }

  export type PromptInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tags?: boolean | Prompt$tagsArgs<ExtArgs>
    votes?: boolean | Prompt$votesArgs<ExtArgs>
    duplicateFlags?: boolean | Prompt$duplicateFlagsArgs<ExtArgs>
    _count?: boolean | PromptCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PromptIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PromptPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Prompt"
    objects: {
      tags: Prisma.$PromptTagPayload<ExtArgs>[]
      votes: Prisma.$PromptVotePayload<ExtArgs>[]
      duplicateFlags: Prisma.$PromptDuplicateFlagPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      text: string
      originalCategory: string
      submittedBy: string | null
      submittedByUsername: string | null
      createdAt: Date
    }, ExtArgs["result"]["prompt"]>
    composites: {}
  }

  type PromptGetPayload<S extends boolean | null | undefined | PromptDefaultArgs> = $Result.GetResult<Prisma.$PromptPayload, S>

  type PromptCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PromptFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromptCountAggregateInputType | true
    }

  export interface PromptDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Prompt'], meta: { name: 'Prompt' } }
    /**
     * Find zero or one Prompt that matches the filter.
     * @param {PromptFindUniqueArgs} args - Arguments to find a Prompt
     * @example
     * // Get one Prompt
     * const prompt = await prisma.prompt.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromptFindUniqueArgs>(args: SelectSubset<T, PromptFindUniqueArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Prompt that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PromptFindUniqueOrThrowArgs} args - Arguments to find a Prompt
     * @example
     * // Get one Prompt
     * const prompt = await prisma.prompt.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromptFindUniqueOrThrowArgs>(args: SelectSubset<T, PromptFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Prompt that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptFindFirstArgs} args - Arguments to find a Prompt
     * @example
     * // Get one Prompt
     * const prompt = await prisma.prompt.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromptFindFirstArgs>(args?: SelectSubset<T, PromptFindFirstArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Prompt that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptFindFirstOrThrowArgs} args - Arguments to find a Prompt
     * @example
     * // Get one Prompt
     * const prompt = await prisma.prompt.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromptFindFirstOrThrowArgs>(args?: SelectSubset<T, PromptFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Prompts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Prompts
     * const prompts = await prisma.prompt.findMany()
     * 
     * // Get first 10 Prompts
     * const prompts = await prisma.prompt.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promptWithIdOnly = await prisma.prompt.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromptFindManyArgs>(args?: SelectSubset<T, PromptFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Prompt.
     * @param {PromptCreateArgs} args - Arguments to create a Prompt.
     * @example
     * // Create one Prompt
     * const Prompt = await prisma.prompt.create({
     *   data: {
     *     // ... data to create a Prompt
     *   }
     * })
     * 
     */
    create<T extends PromptCreateArgs>(args: SelectSubset<T, PromptCreateArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Prompts.
     * @param {PromptCreateManyArgs} args - Arguments to create many Prompts.
     * @example
     * // Create many Prompts
     * const prompt = await prisma.prompt.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromptCreateManyArgs>(args?: SelectSubset<T, PromptCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Prompts and returns the data saved in the database.
     * @param {PromptCreateManyAndReturnArgs} args - Arguments to create many Prompts.
     * @example
     * // Create many Prompts
     * const prompt = await prisma.prompt.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Prompts and only return the `id`
     * const promptWithIdOnly = await prisma.prompt.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PromptCreateManyAndReturnArgs>(args?: SelectSubset<T, PromptCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a Prompt.
     * @param {PromptDeleteArgs} args - Arguments to delete one Prompt.
     * @example
     * // Delete one Prompt
     * const Prompt = await prisma.prompt.delete({
     *   where: {
     *     // ... filter to delete one Prompt
     *   }
     * })
     * 
     */
    delete<T extends PromptDeleteArgs>(args: SelectSubset<T, PromptDeleteArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Prompt.
     * @param {PromptUpdateArgs} args - Arguments to update one Prompt.
     * @example
     * // Update one Prompt
     * const prompt = await prisma.prompt.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromptUpdateArgs>(args: SelectSubset<T, PromptUpdateArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Prompts.
     * @param {PromptDeleteManyArgs} args - Arguments to filter Prompts to delete.
     * @example
     * // Delete a few Prompts
     * const { count } = await prisma.prompt.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromptDeleteManyArgs>(args?: SelectSubset<T, PromptDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Prompts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Prompts
     * const prompt = await prisma.prompt.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromptUpdateManyArgs>(args: SelectSubset<T, PromptUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Prompt.
     * @param {PromptUpsertArgs} args - Arguments to update or create a Prompt.
     * @example
     * // Update or create a Prompt
     * const prompt = await prisma.prompt.upsert({
     *   create: {
     *     // ... data to create a Prompt
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Prompt we want to update
     *   }
     * })
     */
    upsert<T extends PromptUpsertArgs>(args: SelectSubset<T, PromptUpsertArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Prompts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptCountArgs} args - Arguments to filter Prompts to count.
     * @example
     * // Count the number of Prompts
     * const count = await prisma.prompt.count({
     *   where: {
     *     // ... the filter for the Prompts we want to count
     *   }
     * })
    **/
    count<T extends PromptCountArgs>(
      args?: Subset<T, PromptCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromptCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Prompt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromptAggregateArgs>(args: Subset<T, PromptAggregateArgs>): Prisma.PrismaPromise<GetPromptAggregateType<T>>

    /**
     * Group by Prompt.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromptGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromptGroupByArgs['orderBy'] }
        : { orderBy?: PromptGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromptGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromptGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Prompt model
   */
  readonly fields: PromptFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Prompt.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromptClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tags<T extends Prompt$tagsArgs<ExtArgs> = {}>(args?: Subset<T, Prompt$tagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "findMany"> | Null>
    votes<T extends Prompt$votesArgs<ExtArgs> = {}>(args?: Subset<T, Prompt$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "findMany"> | Null>
    duplicateFlags<T extends Prompt$duplicateFlagsArgs<ExtArgs> = {}>(args?: Subset<T, Prompt$duplicateFlagsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Prompt model
   */ 
  interface PromptFieldRefs {
    readonly id: FieldRef<"Prompt", 'String'>
    readonly text: FieldRef<"Prompt", 'String'>
    readonly originalCategory: FieldRef<"Prompt", 'String'>
    readonly submittedBy: FieldRef<"Prompt", 'String'>
    readonly submittedByUsername: FieldRef<"Prompt", 'String'>
    readonly createdAt: FieldRef<"Prompt", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Prompt findUnique
   */
  export type PromptFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * Filter, which Prompt to fetch.
     */
    where: PromptWhereUniqueInput
  }

  /**
   * Prompt findUniqueOrThrow
   */
  export type PromptFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * Filter, which Prompt to fetch.
     */
    where: PromptWhereUniqueInput
  }

  /**
   * Prompt findFirst
   */
  export type PromptFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * Filter, which Prompt to fetch.
     */
    where?: PromptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prompts to fetch.
     */
    orderBy?: PromptOrderByWithRelationInput | PromptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Prompts.
     */
    cursor?: PromptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prompts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prompts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Prompts.
     */
    distinct?: PromptScalarFieldEnum | PromptScalarFieldEnum[]
  }

  /**
   * Prompt findFirstOrThrow
   */
  export type PromptFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * Filter, which Prompt to fetch.
     */
    where?: PromptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prompts to fetch.
     */
    orderBy?: PromptOrderByWithRelationInput | PromptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Prompts.
     */
    cursor?: PromptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prompts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prompts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Prompts.
     */
    distinct?: PromptScalarFieldEnum | PromptScalarFieldEnum[]
  }

  /**
   * Prompt findMany
   */
  export type PromptFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * Filter, which Prompts to fetch.
     */
    where?: PromptWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Prompts to fetch.
     */
    orderBy?: PromptOrderByWithRelationInput | PromptOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Prompts.
     */
    cursor?: PromptWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Prompts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Prompts.
     */
    skip?: number
    distinct?: PromptScalarFieldEnum | PromptScalarFieldEnum[]
  }

  /**
   * Prompt create
   */
  export type PromptCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * The data needed to create a Prompt.
     */
    data: XOR<PromptCreateInput, PromptUncheckedCreateInput>
  }

  /**
   * Prompt createMany
   */
  export type PromptCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Prompts.
     */
    data: PromptCreateManyInput | PromptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Prompt createManyAndReturn
   */
  export type PromptCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Prompts.
     */
    data: PromptCreateManyInput | PromptCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Prompt update
   */
  export type PromptUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * The data needed to update a Prompt.
     */
    data: XOR<PromptUpdateInput, PromptUncheckedUpdateInput>
    /**
     * Choose, which Prompt to update.
     */
    where: PromptWhereUniqueInput
  }

  /**
   * Prompt updateMany
   */
  export type PromptUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Prompts.
     */
    data: XOR<PromptUpdateManyMutationInput, PromptUncheckedUpdateManyInput>
    /**
     * Filter which Prompts to update
     */
    where?: PromptWhereInput
  }

  /**
   * Prompt upsert
   */
  export type PromptUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * The filter to search for the Prompt to update in case it exists.
     */
    where: PromptWhereUniqueInput
    /**
     * In case the Prompt found by the `where` argument doesn't exist, create a new Prompt with this data.
     */
    create: XOR<PromptCreateInput, PromptUncheckedCreateInput>
    /**
     * In case the Prompt was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromptUpdateInput, PromptUncheckedUpdateInput>
  }

  /**
   * Prompt delete
   */
  export type PromptDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
    /**
     * Filter which Prompt to delete.
     */
    where: PromptWhereUniqueInput
  }

  /**
   * Prompt deleteMany
   */
  export type PromptDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Prompts to delete
     */
    where?: PromptWhereInput
  }

  /**
   * Prompt.tags
   */
  export type Prompt$tagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    where?: PromptTagWhereInput
    orderBy?: PromptTagOrderByWithRelationInput | PromptTagOrderByWithRelationInput[]
    cursor?: PromptTagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromptTagScalarFieldEnum | PromptTagScalarFieldEnum[]
  }

  /**
   * Prompt.votes
   */
  export type Prompt$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    where?: PromptVoteWhereInput
    orderBy?: PromptVoteOrderByWithRelationInput | PromptVoteOrderByWithRelationInput[]
    cursor?: PromptVoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromptVoteScalarFieldEnum | PromptVoteScalarFieldEnum[]
  }

  /**
   * Prompt.duplicateFlags
   */
  export type Prompt$duplicateFlagsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    where?: PromptDuplicateFlagWhereInput
    orderBy?: PromptDuplicateFlagOrderByWithRelationInput | PromptDuplicateFlagOrderByWithRelationInput[]
    cursor?: PromptDuplicateFlagWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PromptDuplicateFlagScalarFieldEnum | PromptDuplicateFlagScalarFieldEnum[]
  }

  /**
   * Prompt without action
   */
  export type PromptDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Prompt
     */
    select?: PromptSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptInclude<ExtArgs> | null
  }


  /**
   * Model PromptTag
   */

  export type AggregatePromptTag = {
    _count: PromptTagCountAggregateOutputType | null
    _min: PromptTagMinAggregateOutputType | null
    _max: PromptTagMaxAggregateOutputType | null
  }

  export type PromptTagMinAggregateOutputType = {
    id: string | null
    promptId: string | null
    tag: string | null
  }

  export type PromptTagMaxAggregateOutputType = {
    id: string | null
    promptId: string | null
    tag: string | null
  }

  export type PromptTagCountAggregateOutputType = {
    id: number
    promptId: number
    tag: number
    _all: number
  }


  export type PromptTagMinAggregateInputType = {
    id?: true
    promptId?: true
    tag?: true
  }

  export type PromptTagMaxAggregateInputType = {
    id?: true
    promptId?: true
    tag?: true
  }

  export type PromptTagCountAggregateInputType = {
    id?: true
    promptId?: true
    tag?: true
    _all?: true
  }

  export type PromptTagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromptTag to aggregate.
     */
    where?: PromptTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptTags to fetch.
     */
    orderBy?: PromptTagOrderByWithRelationInput | PromptTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromptTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PromptTags
    **/
    _count?: true | PromptTagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromptTagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromptTagMaxAggregateInputType
  }

  export type GetPromptTagAggregateType<T extends PromptTagAggregateArgs> = {
        [P in keyof T & keyof AggregatePromptTag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromptTag[P]>
      : GetScalarType<T[P], AggregatePromptTag[P]>
  }




  export type PromptTagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptTagWhereInput
    orderBy?: PromptTagOrderByWithAggregationInput | PromptTagOrderByWithAggregationInput[]
    by: PromptTagScalarFieldEnum[] | PromptTagScalarFieldEnum
    having?: PromptTagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromptTagCountAggregateInputType | true
    _min?: PromptTagMinAggregateInputType
    _max?: PromptTagMaxAggregateInputType
  }

  export type PromptTagGroupByOutputType = {
    id: string
    promptId: string
    tag: string
    _count: PromptTagCountAggregateOutputType | null
    _min: PromptTagMinAggregateOutputType | null
    _max: PromptTagMaxAggregateOutputType | null
  }

  type GetPromptTagGroupByPayload<T extends PromptTagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromptTagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromptTagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromptTagGroupByOutputType[P]>
            : GetScalarType<T[P], PromptTagGroupByOutputType[P]>
        }
      >
    >


  export type PromptTagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    promptId?: boolean
    tag?: boolean
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promptTag"]>

  export type PromptTagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    promptId?: boolean
    tag?: boolean
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promptTag"]>

  export type PromptTagSelectScalar = {
    id?: boolean
    promptId?: boolean
    tag?: boolean
  }

  export type PromptTagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }
  export type PromptTagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }

  export type $PromptTagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PromptTag"
    objects: {
      prompt: Prisma.$PromptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      promptId: string
      tag: string
    }, ExtArgs["result"]["promptTag"]>
    composites: {}
  }

  type PromptTagGetPayload<S extends boolean | null | undefined | PromptTagDefaultArgs> = $Result.GetResult<Prisma.$PromptTagPayload, S>

  type PromptTagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PromptTagFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromptTagCountAggregateInputType | true
    }

  export interface PromptTagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PromptTag'], meta: { name: 'PromptTag' } }
    /**
     * Find zero or one PromptTag that matches the filter.
     * @param {PromptTagFindUniqueArgs} args - Arguments to find a PromptTag
     * @example
     * // Get one PromptTag
     * const promptTag = await prisma.promptTag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromptTagFindUniqueArgs>(args: SelectSubset<T, PromptTagFindUniqueArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PromptTag that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PromptTagFindUniqueOrThrowArgs} args - Arguments to find a PromptTag
     * @example
     * // Get one PromptTag
     * const promptTag = await prisma.promptTag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromptTagFindUniqueOrThrowArgs>(args: SelectSubset<T, PromptTagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PromptTag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagFindFirstArgs} args - Arguments to find a PromptTag
     * @example
     * // Get one PromptTag
     * const promptTag = await prisma.promptTag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromptTagFindFirstArgs>(args?: SelectSubset<T, PromptTagFindFirstArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PromptTag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagFindFirstOrThrowArgs} args - Arguments to find a PromptTag
     * @example
     * // Get one PromptTag
     * const promptTag = await prisma.promptTag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromptTagFindFirstOrThrowArgs>(args?: SelectSubset<T, PromptTagFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PromptTags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PromptTags
     * const promptTags = await prisma.promptTag.findMany()
     * 
     * // Get first 10 PromptTags
     * const promptTags = await prisma.promptTag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promptTagWithIdOnly = await prisma.promptTag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromptTagFindManyArgs>(args?: SelectSubset<T, PromptTagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PromptTag.
     * @param {PromptTagCreateArgs} args - Arguments to create a PromptTag.
     * @example
     * // Create one PromptTag
     * const PromptTag = await prisma.promptTag.create({
     *   data: {
     *     // ... data to create a PromptTag
     *   }
     * })
     * 
     */
    create<T extends PromptTagCreateArgs>(args: SelectSubset<T, PromptTagCreateArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PromptTags.
     * @param {PromptTagCreateManyArgs} args - Arguments to create many PromptTags.
     * @example
     * // Create many PromptTags
     * const promptTag = await prisma.promptTag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromptTagCreateManyArgs>(args?: SelectSubset<T, PromptTagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PromptTags and returns the data saved in the database.
     * @param {PromptTagCreateManyAndReturnArgs} args - Arguments to create many PromptTags.
     * @example
     * // Create many PromptTags
     * const promptTag = await prisma.promptTag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PromptTags and only return the `id`
     * const promptTagWithIdOnly = await prisma.promptTag.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PromptTagCreateManyAndReturnArgs>(args?: SelectSubset<T, PromptTagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PromptTag.
     * @param {PromptTagDeleteArgs} args - Arguments to delete one PromptTag.
     * @example
     * // Delete one PromptTag
     * const PromptTag = await prisma.promptTag.delete({
     *   where: {
     *     // ... filter to delete one PromptTag
     *   }
     * })
     * 
     */
    delete<T extends PromptTagDeleteArgs>(args: SelectSubset<T, PromptTagDeleteArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PromptTag.
     * @param {PromptTagUpdateArgs} args - Arguments to update one PromptTag.
     * @example
     * // Update one PromptTag
     * const promptTag = await prisma.promptTag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromptTagUpdateArgs>(args: SelectSubset<T, PromptTagUpdateArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PromptTags.
     * @param {PromptTagDeleteManyArgs} args - Arguments to filter PromptTags to delete.
     * @example
     * // Delete a few PromptTags
     * const { count } = await prisma.promptTag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromptTagDeleteManyArgs>(args?: SelectSubset<T, PromptTagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PromptTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PromptTags
     * const promptTag = await prisma.promptTag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromptTagUpdateManyArgs>(args: SelectSubset<T, PromptTagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PromptTag.
     * @param {PromptTagUpsertArgs} args - Arguments to update or create a PromptTag.
     * @example
     * // Update or create a PromptTag
     * const promptTag = await prisma.promptTag.upsert({
     *   create: {
     *     // ... data to create a PromptTag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PromptTag we want to update
     *   }
     * })
     */
    upsert<T extends PromptTagUpsertArgs>(args: SelectSubset<T, PromptTagUpsertArgs<ExtArgs>>): Prisma__PromptTagClient<$Result.GetResult<Prisma.$PromptTagPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PromptTags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagCountArgs} args - Arguments to filter PromptTags to count.
     * @example
     * // Count the number of PromptTags
     * const count = await prisma.promptTag.count({
     *   where: {
     *     // ... the filter for the PromptTags we want to count
     *   }
     * })
    **/
    count<T extends PromptTagCountArgs>(
      args?: Subset<T, PromptTagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromptTagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PromptTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromptTagAggregateArgs>(args: Subset<T, PromptTagAggregateArgs>): Prisma.PrismaPromise<GetPromptTagAggregateType<T>>

    /**
     * Group by PromptTag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptTagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromptTagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromptTagGroupByArgs['orderBy'] }
        : { orderBy?: PromptTagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromptTagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromptTagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PromptTag model
   */
  readonly fields: PromptTagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PromptTag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromptTagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prompt<T extends PromptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PromptDefaultArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PromptTag model
   */ 
  interface PromptTagFieldRefs {
    readonly id: FieldRef<"PromptTag", 'String'>
    readonly promptId: FieldRef<"PromptTag", 'String'>
    readonly tag: FieldRef<"PromptTag", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PromptTag findUnique
   */
  export type PromptTagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * Filter, which PromptTag to fetch.
     */
    where: PromptTagWhereUniqueInput
  }

  /**
   * PromptTag findUniqueOrThrow
   */
  export type PromptTagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * Filter, which PromptTag to fetch.
     */
    where: PromptTagWhereUniqueInput
  }

  /**
   * PromptTag findFirst
   */
  export type PromptTagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * Filter, which PromptTag to fetch.
     */
    where?: PromptTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptTags to fetch.
     */
    orderBy?: PromptTagOrderByWithRelationInput | PromptTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromptTags.
     */
    cursor?: PromptTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromptTags.
     */
    distinct?: PromptTagScalarFieldEnum | PromptTagScalarFieldEnum[]
  }

  /**
   * PromptTag findFirstOrThrow
   */
  export type PromptTagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * Filter, which PromptTag to fetch.
     */
    where?: PromptTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptTags to fetch.
     */
    orderBy?: PromptTagOrderByWithRelationInput | PromptTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromptTags.
     */
    cursor?: PromptTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptTags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromptTags.
     */
    distinct?: PromptTagScalarFieldEnum | PromptTagScalarFieldEnum[]
  }

  /**
   * PromptTag findMany
   */
  export type PromptTagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * Filter, which PromptTags to fetch.
     */
    where?: PromptTagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptTags to fetch.
     */
    orderBy?: PromptTagOrderByWithRelationInput | PromptTagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PromptTags.
     */
    cursor?: PromptTagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptTags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptTags.
     */
    skip?: number
    distinct?: PromptTagScalarFieldEnum | PromptTagScalarFieldEnum[]
  }

  /**
   * PromptTag create
   */
  export type PromptTagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * The data needed to create a PromptTag.
     */
    data: XOR<PromptTagCreateInput, PromptTagUncheckedCreateInput>
  }

  /**
   * PromptTag createMany
   */
  export type PromptTagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PromptTags.
     */
    data: PromptTagCreateManyInput | PromptTagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PromptTag createManyAndReturn
   */
  export type PromptTagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PromptTags.
     */
    data: PromptTagCreateManyInput | PromptTagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PromptTag update
   */
  export type PromptTagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * The data needed to update a PromptTag.
     */
    data: XOR<PromptTagUpdateInput, PromptTagUncheckedUpdateInput>
    /**
     * Choose, which PromptTag to update.
     */
    where: PromptTagWhereUniqueInput
  }

  /**
   * PromptTag updateMany
   */
  export type PromptTagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PromptTags.
     */
    data: XOR<PromptTagUpdateManyMutationInput, PromptTagUncheckedUpdateManyInput>
    /**
     * Filter which PromptTags to update
     */
    where?: PromptTagWhereInput
  }

  /**
   * PromptTag upsert
   */
  export type PromptTagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * The filter to search for the PromptTag to update in case it exists.
     */
    where: PromptTagWhereUniqueInput
    /**
     * In case the PromptTag found by the `where` argument doesn't exist, create a new PromptTag with this data.
     */
    create: XOR<PromptTagCreateInput, PromptTagUncheckedCreateInput>
    /**
     * In case the PromptTag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromptTagUpdateInput, PromptTagUncheckedUpdateInput>
  }

  /**
   * PromptTag delete
   */
  export type PromptTagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
    /**
     * Filter which PromptTag to delete.
     */
    where: PromptTagWhereUniqueInput
  }

  /**
   * PromptTag deleteMany
   */
  export type PromptTagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromptTags to delete
     */
    where?: PromptTagWhereInput
  }

  /**
   * PromptTag without action
   */
  export type PromptTagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptTag
     */
    select?: PromptTagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptTagInclude<ExtArgs> | null
  }


  /**
   * Model PromptVote
   */

  export type AggregatePromptVote = {
    _count: PromptVoteCountAggregateOutputType | null
    _min: PromptVoteMinAggregateOutputType | null
    _max: PromptVoteMaxAggregateOutputType | null
  }

  export type PromptVoteMinAggregateOutputType = {
    id: string | null
    promptId: string | null
    discordUserId: string | null
    discordUsername: string | null
    vote: $Enums.VoteDirection | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PromptVoteMaxAggregateOutputType = {
    id: string | null
    promptId: string | null
    discordUserId: string | null
    discordUsername: string | null
    vote: $Enums.VoteDirection | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PromptVoteCountAggregateOutputType = {
    id: number
    promptId: number
    discordUserId: number
    discordUsername: number
    vote: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PromptVoteMinAggregateInputType = {
    id?: true
    promptId?: true
    discordUserId?: true
    discordUsername?: true
    vote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PromptVoteMaxAggregateInputType = {
    id?: true
    promptId?: true
    discordUserId?: true
    discordUsername?: true
    vote?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PromptVoteCountAggregateInputType = {
    id?: true
    promptId?: true
    discordUserId?: true
    discordUsername?: true
    vote?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PromptVoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromptVote to aggregate.
     */
    where?: PromptVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptVotes to fetch.
     */
    orderBy?: PromptVoteOrderByWithRelationInput | PromptVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromptVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PromptVotes
    **/
    _count?: true | PromptVoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromptVoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromptVoteMaxAggregateInputType
  }

  export type GetPromptVoteAggregateType<T extends PromptVoteAggregateArgs> = {
        [P in keyof T & keyof AggregatePromptVote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromptVote[P]>
      : GetScalarType<T[P], AggregatePromptVote[P]>
  }




  export type PromptVoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptVoteWhereInput
    orderBy?: PromptVoteOrderByWithAggregationInput | PromptVoteOrderByWithAggregationInput[]
    by: PromptVoteScalarFieldEnum[] | PromptVoteScalarFieldEnum
    having?: PromptVoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromptVoteCountAggregateInputType | true
    _min?: PromptVoteMinAggregateInputType
    _max?: PromptVoteMaxAggregateInputType
  }

  export type PromptVoteGroupByOutputType = {
    id: string
    promptId: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt: Date
    updatedAt: Date
    _count: PromptVoteCountAggregateOutputType | null
    _min: PromptVoteMinAggregateOutputType | null
    _max: PromptVoteMaxAggregateOutputType | null
  }

  type GetPromptVoteGroupByPayload<T extends PromptVoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromptVoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromptVoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromptVoteGroupByOutputType[P]>
            : GetScalarType<T[P], PromptVoteGroupByOutputType[P]>
        }
      >
    >


  export type PromptVoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    promptId?: boolean
    discordUserId?: boolean
    discordUsername?: boolean
    vote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promptVote"]>

  export type PromptVoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    promptId?: boolean
    discordUserId?: boolean
    discordUsername?: boolean
    vote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promptVote"]>

  export type PromptVoteSelectScalar = {
    id?: boolean
    promptId?: boolean
    discordUserId?: boolean
    discordUsername?: boolean
    vote?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PromptVoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }
  export type PromptVoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }

  export type $PromptVotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PromptVote"
    objects: {
      prompt: Prisma.$PromptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      promptId: string
      discordUserId: string
      discordUsername: string
      vote: $Enums.VoteDirection
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["promptVote"]>
    composites: {}
  }

  type PromptVoteGetPayload<S extends boolean | null | undefined | PromptVoteDefaultArgs> = $Result.GetResult<Prisma.$PromptVotePayload, S>

  type PromptVoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PromptVoteFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromptVoteCountAggregateInputType | true
    }

  export interface PromptVoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PromptVote'], meta: { name: 'PromptVote' } }
    /**
     * Find zero or one PromptVote that matches the filter.
     * @param {PromptVoteFindUniqueArgs} args - Arguments to find a PromptVote
     * @example
     * // Get one PromptVote
     * const promptVote = await prisma.promptVote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromptVoteFindUniqueArgs>(args: SelectSubset<T, PromptVoteFindUniqueArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PromptVote that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PromptVoteFindUniqueOrThrowArgs} args - Arguments to find a PromptVote
     * @example
     * // Get one PromptVote
     * const promptVote = await prisma.promptVote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromptVoteFindUniqueOrThrowArgs>(args: SelectSubset<T, PromptVoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PromptVote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteFindFirstArgs} args - Arguments to find a PromptVote
     * @example
     * // Get one PromptVote
     * const promptVote = await prisma.promptVote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromptVoteFindFirstArgs>(args?: SelectSubset<T, PromptVoteFindFirstArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PromptVote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteFindFirstOrThrowArgs} args - Arguments to find a PromptVote
     * @example
     * // Get one PromptVote
     * const promptVote = await prisma.promptVote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromptVoteFindFirstOrThrowArgs>(args?: SelectSubset<T, PromptVoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PromptVotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PromptVotes
     * const promptVotes = await prisma.promptVote.findMany()
     * 
     * // Get first 10 PromptVotes
     * const promptVotes = await prisma.promptVote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promptVoteWithIdOnly = await prisma.promptVote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromptVoteFindManyArgs>(args?: SelectSubset<T, PromptVoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PromptVote.
     * @param {PromptVoteCreateArgs} args - Arguments to create a PromptVote.
     * @example
     * // Create one PromptVote
     * const PromptVote = await prisma.promptVote.create({
     *   data: {
     *     // ... data to create a PromptVote
     *   }
     * })
     * 
     */
    create<T extends PromptVoteCreateArgs>(args: SelectSubset<T, PromptVoteCreateArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PromptVotes.
     * @param {PromptVoteCreateManyArgs} args - Arguments to create many PromptVotes.
     * @example
     * // Create many PromptVotes
     * const promptVote = await prisma.promptVote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromptVoteCreateManyArgs>(args?: SelectSubset<T, PromptVoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PromptVotes and returns the data saved in the database.
     * @param {PromptVoteCreateManyAndReturnArgs} args - Arguments to create many PromptVotes.
     * @example
     * // Create many PromptVotes
     * const promptVote = await prisma.promptVote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PromptVotes and only return the `id`
     * const promptVoteWithIdOnly = await prisma.promptVote.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PromptVoteCreateManyAndReturnArgs>(args?: SelectSubset<T, PromptVoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PromptVote.
     * @param {PromptVoteDeleteArgs} args - Arguments to delete one PromptVote.
     * @example
     * // Delete one PromptVote
     * const PromptVote = await prisma.promptVote.delete({
     *   where: {
     *     // ... filter to delete one PromptVote
     *   }
     * })
     * 
     */
    delete<T extends PromptVoteDeleteArgs>(args: SelectSubset<T, PromptVoteDeleteArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PromptVote.
     * @param {PromptVoteUpdateArgs} args - Arguments to update one PromptVote.
     * @example
     * // Update one PromptVote
     * const promptVote = await prisma.promptVote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromptVoteUpdateArgs>(args: SelectSubset<T, PromptVoteUpdateArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PromptVotes.
     * @param {PromptVoteDeleteManyArgs} args - Arguments to filter PromptVotes to delete.
     * @example
     * // Delete a few PromptVotes
     * const { count } = await prisma.promptVote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromptVoteDeleteManyArgs>(args?: SelectSubset<T, PromptVoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PromptVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PromptVotes
     * const promptVote = await prisma.promptVote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromptVoteUpdateManyArgs>(args: SelectSubset<T, PromptVoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PromptVote.
     * @param {PromptVoteUpsertArgs} args - Arguments to update or create a PromptVote.
     * @example
     * // Update or create a PromptVote
     * const promptVote = await prisma.promptVote.upsert({
     *   create: {
     *     // ... data to create a PromptVote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PromptVote we want to update
     *   }
     * })
     */
    upsert<T extends PromptVoteUpsertArgs>(args: SelectSubset<T, PromptVoteUpsertArgs<ExtArgs>>): Prisma__PromptVoteClient<$Result.GetResult<Prisma.$PromptVotePayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PromptVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteCountArgs} args - Arguments to filter PromptVotes to count.
     * @example
     * // Count the number of PromptVotes
     * const count = await prisma.promptVote.count({
     *   where: {
     *     // ... the filter for the PromptVotes we want to count
     *   }
     * })
    **/
    count<T extends PromptVoteCountArgs>(
      args?: Subset<T, PromptVoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromptVoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PromptVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromptVoteAggregateArgs>(args: Subset<T, PromptVoteAggregateArgs>): Prisma.PrismaPromise<GetPromptVoteAggregateType<T>>

    /**
     * Group by PromptVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptVoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromptVoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromptVoteGroupByArgs['orderBy'] }
        : { orderBy?: PromptVoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromptVoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromptVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PromptVote model
   */
  readonly fields: PromptVoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PromptVote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromptVoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prompt<T extends PromptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PromptDefaultArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PromptVote model
   */ 
  interface PromptVoteFieldRefs {
    readonly id: FieldRef<"PromptVote", 'String'>
    readonly promptId: FieldRef<"PromptVote", 'String'>
    readonly discordUserId: FieldRef<"PromptVote", 'String'>
    readonly discordUsername: FieldRef<"PromptVote", 'String'>
    readonly vote: FieldRef<"PromptVote", 'VoteDirection'>
    readonly createdAt: FieldRef<"PromptVote", 'DateTime'>
    readonly updatedAt: FieldRef<"PromptVote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PromptVote findUnique
   */
  export type PromptVoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * Filter, which PromptVote to fetch.
     */
    where: PromptVoteWhereUniqueInput
  }

  /**
   * PromptVote findUniqueOrThrow
   */
  export type PromptVoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * Filter, which PromptVote to fetch.
     */
    where: PromptVoteWhereUniqueInput
  }

  /**
   * PromptVote findFirst
   */
  export type PromptVoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * Filter, which PromptVote to fetch.
     */
    where?: PromptVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptVotes to fetch.
     */
    orderBy?: PromptVoteOrderByWithRelationInput | PromptVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromptVotes.
     */
    cursor?: PromptVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromptVotes.
     */
    distinct?: PromptVoteScalarFieldEnum | PromptVoteScalarFieldEnum[]
  }

  /**
   * PromptVote findFirstOrThrow
   */
  export type PromptVoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * Filter, which PromptVote to fetch.
     */
    where?: PromptVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptVotes to fetch.
     */
    orderBy?: PromptVoteOrderByWithRelationInput | PromptVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromptVotes.
     */
    cursor?: PromptVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromptVotes.
     */
    distinct?: PromptVoteScalarFieldEnum | PromptVoteScalarFieldEnum[]
  }

  /**
   * PromptVote findMany
   */
  export type PromptVoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * Filter, which PromptVotes to fetch.
     */
    where?: PromptVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptVotes to fetch.
     */
    orderBy?: PromptVoteOrderByWithRelationInput | PromptVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PromptVotes.
     */
    cursor?: PromptVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptVotes.
     */
    skip?: number
    distinct?: PromptVoteScalarFieldEnum | PromptVoteScalarFieldEnum[]
  }

  /**
   * PromptVote create
   */
  export type PromptVoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * The data needed to create a PromptVote.
     */
    data: XOR<PromptVoteCreateInput, PromptVoteUncheckedCreateInput>
  }

  /**
   * PromptVote createMany
   */
  export type PromptVoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PromptVotes.
     */
    data: PromptVoteCreateManyInput | PromptVoteCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PromptVote createManyAndReturn
   */
  export type PromptVoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PromptVotes.
     */
    data: PromptVoteCreateManyInput | PromptVoteCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PromptVote update
   */
  export type PromptVoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * The data needed to update a PromptVote.
     */
    data: XOR<PromptVoteUpdateInput, PromptVoteUncheckedUpdateInput>
    /**
     * Choose, which PromptVote to update.
     */
    where: PromptVoteWhereUniqueInput
  }

  /**
   * PromptVote updateMany
   */
  export type PromptVoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PromptVotes.
     */
    data: XOR<PromptVoteUpdateManyMutationInput, PromptVoteUncheckedUpdateManyInput>
    /**
     * Filter which PromptVotes to update
     */
    where?: PromptVoteWhereInput
  }

  /**
   * PromptVote upsert
   */
  export type PromptVoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * The filter to search for the PromptVote to update in case it exists.
     */
    where: PromptVoteWhereUniqueInput
    /**
     * In case the PromptVote found by the `where` argument doesn't exist, create a new PromptVote with this data.
     */
    create: XOR<PromptVoteCreateInput, PromptVoteUncheckedCreateInput>
    /**
     * In case the PromptVote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromptVoteUpdateInput, PromptVoteUncheckedUpdateInput>
  }

  /**
   * PromptVote delete
   */
  export type PromptVoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
    /**
     * Filter which PromptVote to delete.
     */
    where: PromptVoteWhereUniqueInput
  }

  /**
   * PromptVote deleteMany
   */
  export type PromptVoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromptVotes to delete
     */
    where?: PromptVoteWhereInput
  }

  /**
   * PromptVote without action
   */
  export type PromptVoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptVote
     */
    select?: PromptVoteSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptVoteInclude<ExtArgs> | null
  }


  /**
   * Model PromptDuplicateFlag
   */

  export type AggregatePromptDuplicateFlag = {
    _count: PromptDuplicateFlagCountAggregateOutputType | null
    _min: PromptDuplicateFlagMinAggregateOutputType | null
    _max: PromptDuplicateFlagMaxAggregateOutputType | null
  }

  export type PromptDuplicateFlagMinAggregateOutputType = {
    id: string | null
    promptId: string | null
    discordUserId: string | null
    createdAt: Date | null
  }

  export type PromptDuplicateFlagMaxAggregateOutputType = {
    id: string | null
    promptId: string | null
    discordUserId: string | null
    createdAt: Date | null
  }

  export type PromptDuplicateFlagCountAggregateOutputType = {
    id: number
    promptId: number
    discordUserId: number
    createdAt: number
    _all: number
  }


  export type PromptDuplicateFlagMinAggregateInputType = {
    id?: true
    promptId?: true
    discordUserId?: true
    createdAt?: true
  }

  export type PromptDuplicateFlagMaxAggregateInputType = {
    id?: true
    promptId?: true
    discordUserId?: true
    createdAt?: true
  }

  export type PromptDuplicateFlagCountAggregateInputType = {
    id?: true
    promptId?: true
    discordUserId?: true
    createdAt?: true
    _all?: true
  }

  export type PromptDuplicateFlagAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromptDuplicateFlag to aggregate.
     */
    where?: PromptDuplicateFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptDuplicateFlags to fetch.
     */
    orderBy?: PromptDuplicateFlagOrderByWithRelationInput | PromptDuplicateFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromptDuplicateFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptDuplicateFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptDuplicateFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PromptDuplicateFlags
    **/
    _count?: true | PromptDuplicateFlagCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromptDuplicateFlagMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromptDuplicateFlagMaxAggregateInputType
  }

  export type GetPromptDuplicateFlagAggregateType<T extends PromptDuplicateFlagAggregateArgs> = {
        [P in keyof T & keyof AggregatePromptDuplicateFlag]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromptDuplicateFlag[P]>
      : GetScalarType<T[P], AggregatePromptDuplicateFlag[P]>
  }




  export type PromptDuplicateFlagGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PromptDuplicateFlagWhereInput
    orderBy?: PromptDuplicateFlagOrderByWithAggregationInput | PromptDuplicateFlagOrderByWithAggregationInput[]
    by: PromptDuplicateFlagScalarFieldEnum[] | PromptDuplicateFlagScalarFieldEnum
    having?: PromptDuplicateFlagScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromptDuplicateFlagCountAggregateInputType | true
    _min?: PromptDuplicateFlagMinAggregateInputType
    _max?: PromptDuplicateFlagMaxAggregateInputType
  }

  export type PromptDuplicateFlagGroupByOutputType = {
    id: string
    promptId: string
    discordUserId: string
    createdAt: Date
    _count: PromptDuplicateFlagCountAggregateOutputType | null
    _min: PromptDuplicateFlagMinAggregateOutputType | null
    _max: PromptDuplicateFlagMaxAggregateOutputType | null
  }

  type GetPromptDuplicateFlagGroupByPayload<T extends PromptDuplicateFlagGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PromptDuplicateFlagGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromptDuplicateFlagGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromptDuplicateFlagGroupByOutputType[P]>
            : GetScalarType<T[P], PromptDuplicateFlagGroupByOutputType[P]>
        }
      >
    >


  export type PromptDuplicateFlagSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    promptId?: boolean
    discordUserId?: boolean
    createdAt?: boolean
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promptDuplicateFlag"]>

  export type PromptDuplicateFlagSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    promptId?: boolean
    discordUserId?: boolean
    createdAt?: boolean
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["promptDuplicateFlag"]>

  export type PromptDuplicateFlagSelectScalar = {
    id?: boolean
    promptId?: boolean
    discordUserId?: boolean
    createdAt?: boolean
  }

  export type PromptDuplicateFlagInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }
  export type PromptDuplicateFlagIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prompt?: boolean | PromptDefaultArgs<ExtArgs>
  }

  export type $PromptDuplicateFlagPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PromptDuplicateFlag"
    objects: {
      prompt: Prisma.$PromptPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      promptId: string
      discordUserId: string
      createdAt: Date
    }, ExtArgs["result"]["promptDuplicateFlag"]>
    composites: {}
  }

  type PromptDuplicateFlagGetPayload<S extends boolean | null | undefined | PromptDuplicateFlagDefaultArgs> = $Result.GetResult<Prisma.$PromptDuplicateFlagPayload, S>

  type PromptDuplicateFlagCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PromptDuplicateFlagFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PromptDuplicateFlagCountAggregateInputType | true
    }

  export interface PromptDuplicateFlagDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PromptDuplicateFlag'], meta: { name: 'PromptDuplicateFlag' } }
    /**
     * Find zero or one PromptDuplicateFlag that matches the filter.
     * @param {PromptDuplicateFlagFindUniqueArgs} args - Arguments to find a PromptDuplicateFlag
     * @example
     * // Get one PromptDuplicateFlag
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PromptDuplicateFlagFindUniqueArgs>(args: SelectSubset<T, PromptDuplicateFlagFindUniqueArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one PromptDuplicateFlag that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PromptDuplicateFlagFindUniqueOrThrowArgs} args - Arguments to find a PromptDuplicateFlag
     * @example
     * // Get one PromptDuplicateFlag
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PromptDuplicateFlagFindUniqueOrThrowArgs>(args: SelectSubset<T, PromptDuplicateFlagFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first PromptDuplicateFlag that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagFindFirstArgs} args - Arguments to find a PromptDuplicateFlag
     * @example
     * // Get one PromptDuplicateFlag
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PromptDuplicateFlagFindFirstArgs>(args?: SelectSubset<T, PromptDuplicateFlagFindFirstArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first PromptDuplicateFlag that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagFindFirstOrThrowArgs} args - Arguments to find a PromptDuplicateFlag
     * @example
     * // Get one PromptDuplicateFlag
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PromptDuplicateFlagFindFirstOrThrowArgs>(args?: SelectSubset<T, PromptDuplicateFlagFindFirstOrThrowArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more PromptDuplicateFlags that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PromptDuplicateFlags
     * const promptDuplicateFlags = await prisma.promptDuplicateFlag.findMany()
     * 
     * // Get first 10 PromptDuplicateFlags
     * const promptDuplicateFlags = await prisma.promptDuplicateFlag.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const promptDuplicateFlagWithIdOnly = await prisma.promptDuplicateFlag.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PromptDuplicateFlagFindManyArgs>(args?: SelectSubset<T, PromptDuplicateFlagFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a PromptDuplicateFlag.
     * @param {PromptDuplicateFlagCreateArgs} args - Arguments to create a PromptDuplicateFlag.
     * @example
     * // Create one PromptDuplicateFlag
     * const PromptDuplicateFlag = await prisma.promptDuplicateFlag.create({
     *   data: {
     *     // ... data to create a PromptDuplicateFlag
     *   }
     * })
     * 
     */
    create<T extends PromptDuplicateFlagCreateArgs>(args: SelectSubset<T, PromptDuplicateFlagCreateArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many PromptDuplicateFlags.
     * @param {PromptDuplicateFlagCreateManyArgs} args - Arguments to create many PromptDuplicateFlags.
     * @example
     * // Create many PromptDuplicateFlags
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PromptDuplicateFlagCreateManyArgs>(args?: SelectSubset<T, PromptDuplicateFlagCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PromptDuplicateFlags and returns the data saved in the database.
     * @param {PromptDuplicateFlagCreateManyAndReturnArgs} args - Arguments to create many PromptDuplicateFlags.
     * @example
     * // Create many PromptDuplicateFlags
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PromptDuplicateFlags and only return the `id`
     * const promptDuplicateFlagWithIdOnly = await prisma.promptDuplicateFlag.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PromptDuplicateFlagCreateManyAndReturnArgs>(args?: SelectSubset<T, PromptDuplicateFlagCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "createManyAndReturn">>

    /**
     * Delete a PromptDuplicateFlag.
     * @param {PromptDuplicateFlagDeleteArgs} args - Arguments to delete one PromptDuplicateFlag.
     * @example
     * // Delete one PromptDuplicateFlag
     * const PromptDuplicateFlag = await prisma.promptDuplicateFlag.delete({
     *   where: {
     *     // ... filter to delete one PromptDuplicateFlag
     *   }
     * })
     * 
     */
    delete<T extends PromptDuplicateFlagDeleteArgs>(args: SelectSubset<T, PromptDuplicateFlagDeleteArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one PromptDuplicateFlag.
     * @param {PromptDuplicateFlagUpdateArgs} args - Arguments to update one PromptDuplicateFlag.
     * @example
     * // Update one PromptDuplicateFlag
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PromptDuplicateFlagUpdateArgs>(args: SelectSubset<T, PromptDuplicateFlagUpdateArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more PromptDuplicateFlags.
     * @param {PromptDuplicateFlagDeleteManyArgs} args - Arguments to filter PromptDuplicateFlags to delete.
     * @example
     * // Delete a few PromptDuplicateFlags
     * const { count } = await prisma.promptDuplicateFlag.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PromptDuplicateFlagDeleteManyArgs>(args?: SelectSubset<T, PromptDuplicateFlagDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PromptDuplicateFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PromptDuplicateFlags
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PromptDuplicateFlagUpdateManyArgs>(args: SelectSubset<T, PromptDuplicateFlagUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PromptDuplicateFlag.
     * @param {PromptDuplicateFlagUpsertArgs} args - Arguments to update or create a PromptDuplicateFlag.
     * @example
     * // Update or create a PromptDuplicateFlag
     * const promptDuplicateFlag = await prisma.promptDuplicateFlag.upsert({
     *   create: {
     *     // ... data to create a PromptDuplicateFlag
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PromptDuplicateFlag we want to update
     *   }
     * })
     */
    upsert<T extends PromptDuplicateFlagUpsertArgs>(args: SelectSubset<T, PromptDuplicateFlagUpsertArgs<ExtArgs>>): Prisma__PromptDuplicateFlagClient<$Result.GetResult<Prisma.$PromptDuplicateFlagPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of PromptDuplicateFlags.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagCountArgs} args - Arguments to filter PromptDuplicateFlags to count.
     * @example
     * // Count the number of PromptDuplicateFlags
     * const count = await prisma.promptDuplicateFlag.count({
     *   where: {
     *     // ... the filter for the PromptDuplicateFlags we want to count
     *   }
     * })
    **/
    count<T extends PromptDuplicateFlagCountArgs>(
      args?: Subset<T, PromptDuplicateFlagCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromptDuplicateFlagCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PromptDuplicateFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromptDuplicateFlagAggregateArgs>(args: Subset<T, PromptDuplicateFlagAggregateArgs>): Prisma.PrismaPromise<GetPromptDuplicateFlagAggregateType<T>>

    /**
     * Group by PromptDuplicateFlag.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromptDuplicateFlagGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromptDuplicateFlagGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromptDuplicateFlagGroupByArgs['orderBy'] }
        : { orderBy?: PromptDuplicateFlagGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromptDuplicateFlagGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromptDuplicateFlagGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PromptDuplicateFlag model
   */
  readonly fields: PromptDuplicateFlagFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PromptDuplicateFlag.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PromptDuplicateFlagClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prompt<T extends PromptDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PromptDefaultArgs<ExtArgs>>): Prisma__PromptClient<$Result.GetResult<Prisma.$PromptPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PromptDuplicateFlag model
   */ 
  interface PromptDuplicateFlagFieldRefs {
    readonly id: FieldRef<"PromptDuplicateFlag", 'String'>
    readonly promptId: FieldRef<"PromptDuplicateFlag", 'String'>
    readonly discordUserId: FieldRef<"PromptDuplicateFlag", 'String'>
    readonly createdAt: FieldRef<"PromptDuplicateFlag", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PromptDuplicateFlag findUnique
   */
  export type PromptDuplicateFlagFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * Filter, which PromptDuplicateFlag to fetch.
     */
    where: PromptDuplicateFlagWhereUniqueInput
  }

  /**
   * PromptDuplicateFlag findUniqueOrThrow
   */
  export type PromptDuplicateFlagFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * Filter, which PromptDuplicateFlag to fetch.
     */
    where: PromptDuplicateFlagWhereUniqueInput
  }

  /**
   * PromptDuplicateFlag findFirst
   */
  export type PromptDuplicateFlagFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * Filter, which PromptDuplicateFlag to fetch.
     */
    where?: PromptDuplicateFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptDuplicateFlags to fetch.
     */
    orderBy?: PromptDuplicateFlagOrderByWithRelationInput | PromptDuplicateFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromptDuplicateFlags.
     */
    cursor?: PromptDuplicateFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptDuplicateFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptDuplicateFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromptDuplicateFlags.
     */
    distinct?: PromptDuplicateFlagScalarFieldEnum | PromptDuplicateFlagScalarFieldEnum[]
  }

  /**
   * PromptDuplicateFlag findFirstOrThrow
   */
  export type PromptDuplicateFlagFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * Filter, which PromptDuplicateFlag to fetch.
     */
    where?: PromptDuplicateFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptDuplicateFlags to fetch.
     */
    orderBy?: PromptDuplicateFlagOrderByWithRelationInput | PromptDuplicateFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PromptDuplicateFlags.
     */
    cursor?: PromptDuplicateFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptDuplicateFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptDuplicateFlags.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PromptDuplicateFlags.
     */
    distinct?: PromptDuplicateFlagScalarFieldEnum | PromptDuplicateFlagScalarFieldEnum[]
  }

  /**
   * PromptDuplicateFlag findMany
   */
  export type PromptDuplicateFlagFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * Filter, which PromptDuplicateFlags to fetch.
     */
    where?: PromptDuplicateFlagWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PromptDuplicateFlags to fetch.
     */
    orderBy?: PromptDuplicateFlagOrderByWithRelationInput | PromptDuplicateFlagOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PromptDuplicateFlags.
     */
    cursor?: PromptDuplicateFlagWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PromptDuplicateFlags from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PromptDuplicateFlags.
     */
    skip?: number
    distinct?: PromptDuplicateFlagScalarFieldEnum | PromptDuplicateFlagScalarFieldEnum[]
  }

  /**
   * PromptDuplicateFlag create
   */
  export type PromptDuplicateFlagCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * The data needed to create a PromptDuplicateFlag.
     */
    data: XOR<PromptDuplicateFlagCreateInput, PromptDuplicateFlagUncheckedCreateInput>
  }

  /**
   * PromptDuplicateFlag createMany
   */
  export type PromptDuplicateFlagCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PromptDuplicateFlags.
     */
    data: PromptDuplicateFlagCreateManyInput | PromptDuplicateFlagCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PromptDuplicateFlag createManyAndReturn
   */
  export type PromptDuplicateFlagCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PromptDuplicateFlags.
     */
    data: PromptDuplicateFlagCreateManyInput | PromptDuplicateFlagCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PromptDuplicateFlag update
   */
  export type PromptDuplicateFlagUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * The data needed to update a PromptDuplicateFlag.
     */
    data: XOR<PromptDuplicateFlagUpdateInput, PromptDuplicateFlagUncheckedUpdateInput>
    /**
     * Choose, which PromptDuplicateFlag to update.
     */
    where: PromptDuplicateFlagWhereUniqueInput
  }

  /**
   * PromptDuplicateFlag updateMany
   */
  export type PromptDuplicateFlagUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PromptDuplicateFlags.
     */
    data: XOR<PromptDuplicateFlagUpdateManyMutationInput, PromptDuplicateFlagUncheckedUpdateManyInput>
    /**
     * Filter which PromptDuplicateFlags to update
     */
    where?: PromptDuplicateFlagWhereInput
  }

  /**
   * PromptDuplicateFlag upsert
   */
  export type PromptDuplicateFlagUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * The filter to search for the PromptDuplicateFlag to update in case it exists.
     */
    where: PromptDuplicateFlagWhereUniqueInput
    /**
     * In case the PromptDuplicateFlag found by the `where` argument doesn't exist, create a new PromptDuplicateFlag with this data.
     */
    create: XOR<PromptDuplicateFlagCreateInput, PromptDuplicateFlagUncheckedCreateInput>
    /**
     * In case the PromptDuplicateFlag was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromptDuplicateFlagUpdateInput, PromptDuplicateFlagUncheckedUpdateInput>
  }

  /**
   * PromptDuplicateFlag delete
   */
  export type PromptDuplicateFlagDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
    /**
     * Filter which PromptDuplicateFlag to delete.
     */
    where: PromptDuplicateFlagWhereUniqueInput
  }

  /**
   * PromptDuplicateFlag deleteMany
   */
  export type PromptDuplicateFlagDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PromptDuplicateFlags to delete
     */
    where?: PromptDuplicateFlagWhereInput
  }

  /**
   * PromptDuplicateFlag without action
   */
  export type PromptDuplicateFlagDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PromptDuplicateFlag
     */
    select?: PromptDuplicateFlagSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PromptDuplicateFlagInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AccountScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    provider: 'provider',
    providerAccountId: 'providerAccountId',
    refresh_token: 'refresh_token',
    access_token: 'access_token',
    expires_at: 'expires_at',
    token_type: 'token_type',
    scope: 'scope',
    id_token: 'id_token',
    session_state: 'session_state'
  };

  export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum]


  export const SessionScalarFieldEnum: {
    id: 'id',
    sessionToken: 'sessionToken',
    userId: 'userId',
    expires: 'expires'
  };

  export type SessionScalarFieldEnum = (typeof SessionScalarFieldEnum)[keyof typeof SessionScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    emailVerified: 'emailVerified',
    image: 'image'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const VerificationTokenScalarFieldEnum: {
    identifier: 'identifier',
    token: 'token',
    expires: 'expires'
  };

  export type VerificationTokenScalarFieldEnum = (typeof VerificationTokenScalarFieldEnum)[keyof typeof VerificationTokenScalarFieldEnum]


  export const FeatureConfigScalarFieldEnum: {
    id: 'id',
    serverId: 'serverId',
    targetType: 'targetType',
    targetId: 'targetId',
    featureKey: 'featureKey',
    isEnabled: 'isEnabled',
    settings: 'settings',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FeatureConfigScalarFieldEnum = (typeof FeatureConfigScalarFieldEnum)[keyof typeof FeatureConfigScalarFieldEnum]


  export const ConfigAuditLogScalarFieldEnum: {
    id: 'id',
    serverId: 'serverId',
    userId: 'userId',
    action: 'action',
    targetType: 'targetType',
    targetId: 'targetId',
    featureKey: 'featureKey',
    oldValue: 'oldValue',
    newValue: 'newValue',
    createdAt: 'createdAt'
  };

  export type ConfigAuditLogScalarFieldEnum = (typeof ConfigAuditLogScalarFieldEnum)[keyof typeof ConfigAuditLogScalarFieldEnum]


  export const UserUsageMetricScalarFieldEnum: {
    userId: 'userId',
    lastActive: 'lastActive',
    totalCommands: 'totalCommands',
    rateLimitHits: 'rateLimitHits',
    securityFlags: 'securityFlags',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserUsageMetricScalarFieldEnum = (typeof UserUsageMetricScalarFieldEnum)[keyof typeof UserUsageMetricScalarFieldEnum]


  export const DiscussionScheduleScalarFieldEnum: {
    id: 'id',
    serverId: 'serverId',
    channelId: 'channelId',
    days: 'days',
    timeUtc: 'timeUtc',
    timezone: 'timezone',
    categoryFilter: 'categoryFilter',
    useAi: 'useAi',
    isActive: 'isActive',
    createdBy: 'createdBy',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DiscussionScheduleScalarFieldEnum = (typeof DiscussionScheduleScalarFieldEnum)[keyof typeof DiscussionScheduleScalarFieldEnum]


  export const AIAccessGrantScalarFieldEnum: {
    id: 'id',
    serverId: 'serverId',
    grantType: 'grantType',
    targetId: 'targetId',
    grantedBy: 'grantedBy',
    createdAt: 'createdAt'
  };

  export type AIAccessGrantScalarFieldEnum = (typeof AIAccessGrantScalarFieldEnum)[keyof typeof AIAccessGrantScalarFieldEnum]


  export const DiscussionPromptLogScalarFieldEnum: {
    id: 'id',
    serverId: 'serverId',
    channelId: 'channelId',
    promptText: 'promptText',
    category: 'category',
    source: 'source',
    threadId: 'threadId',
    postedAt: 'postedAt'
  };

  export type DiscussionPromptLogScalarFieldEnum = (typeof DiscussionPromptLogScalarFieldEnum)[keyof typeof DiscussionPromptLogScalarFieldEnum]


  export const PromptScalarFieldEnum: {
    id: 'id',
    text: 'text',
    originalCategory: 'originalCategory',
    submittedBy: 'submittedBy',
    submittedByUsername: 'submittedByUsername',
    createdAt: 'createdAt'
  };

  export type PromptScalarFieldEnum = (typeof PromptScalarFieldEnum)[keyof typeof PromptScalarFieldEnum]


  export const PromptTagScalarFieldEnum: {
    id: 'id',
    promptId: 'promptId',
    tag: 'tag'
  };

  export type PromptTagScalarFieldEnum = (typeof PromptTagScalarFieldEnum)[keyof typeof PromptTagScalarFieldEnum]


  export const PromptVoteScalarFieldEnum: {
    id: 'id',
    promptId: 'promptId',
    discordUserId: 'discordUserId',
    discordUsername: 'discordUsername',
    vote: 'vote',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PromptVoteScalarFieldEnum = (typeof PromptVoteScalarFieldEnum)[keyof typeof PromptVoteScalarFieldEnum]


  export const PromptDuplicateFlagScalarFieldEnum: {
    id: 'id',
    promptId: 'promptId',
    discordUserId: 'discordUserId',
    createdAt: 'createdAt'
  };

  export type PromptDuplicateFlagScalarFieldEnum = (typeof PromptDuplicateFlagScalarFieldEnum)[keyof typeof PromptDuplicateFlagScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'TargetType'
   */
  export type EnumTargetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TargetType'>
    


  /**
   * Reference to a field of type 'TargetType[]'
   */
  export type ListEnumTargetTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TargetType[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'AIGrantType'
   */
  export type EnumAIGrantTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AIGrantType'>
    


  /**
   * Reference to a field of type 'AIGrantType[]'
   */
  export type ListEnumAIGrantTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AIGrantType[]'>
    


  /**
   * Reference to a field of type 'VoteDirection'
   */
  export type EnumVoteDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VoteDirection'>
    


  /**
   * Reference to a field of type 'VoteDirection[]'
   */
  export type ListEnumVoteDirectionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'VoteDirection[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type AccountWhereInput = {
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AccountOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AccountWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    provider_providerAccountId?: AccountProviderProviderAccountIdCompoundUniqueInput
    AND?: AccountWhereInput | AccountWhereInput[]
    OR?: AccountWhereInput[]
    NOT?: AccountWhereInput | AccountWhereInput[]
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "provider_providerAccountId">

  export type AccountOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    expires_at?: SortOrderInput | SortOrder
    token_type?: SortOrderInput | SortOrder
    scope?: SortOrderInput | SortOrder
    id_token?: SortOrderInput | SortOrder
    session_state?: SortOrderInput | SortOrder
    _count?: AccountCountOrderByAggregateInput
    _avg?: AccountAvgOrderByAggregateInput
    _max?: AccountMaxOrderByAggregateInput
    _min?: AccountMinOrderByAggregateInput
    _sum?: AccountSumOrderByAggregateInput
  }

  export type AccountScalarWhereWithAggregatesInput = {
    AND?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    OR?: AccountScalarWhereWithAggregatesInput[]
    NOT?: AccountScalarWhereWithAggregatesInput | AccountScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Account"> | string
    userId?: StringWithAggregatesFilter<"Account"> | string
    type?: StringWithAggregatesFilter<"Account"> | string
    provider?: StringWithAggregatesFilter<"Account"> | string
    providerAccountId?: StringWithAggregatesFilter<"Account"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    expires_at?: IntNullableWithAggregatesFilter<"Account"> | number | null
    token_type?: StringNullableWithAggregatesFilter<"Account"> | string | null
    scope?: StringNullableWithAggregatesFilter<"Account"> | string | null
    id_token?: StringNullableWithAggregatesFilter<"Account"> | string | null
    session_state?: StringNullableWithAggregatesFilter<"Account"> | string | null
  }

  export type SessionWhereInput = {
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type SessionOrderByWithRelationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: SessionWhereInput | SessionWhereInput[]
    OR?: SessionWhereInput[]
    NOT?: SessionWhereInput | SessionWhereInput[]
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type SessionOrderByWithAggregationInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
    _count?: SessionCountOrderByAggregateInput
    _max?: SessionMaxOrderByAggregateInput
    _min?: SessionMinOrderByAggregateInput
  }

  export type SessionScalarWhereWithAggregatesInput = {
    AND?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    OR?: SessionScalarWhereWithAggregatesInput[]
    NOT?: SessionScalarWhereWithAggregatesInput | SessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Session"> | string
    sessionToken?: StringWithAggregatesFilter<"Session"> | string
    userId?: StringWithAggregatesFilter<"Session"> | string
    expires?: DateTimeWithAggregatesFilter<"Session"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    accounts?: AccountOrderByRelationAggregateInput
    sessions?: SessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    emailVerified?: DateTimeNullableFilter<"User"> | Date | string | null
    image?: StringNullableFilter<"User"> | string | null
    accounts?: AccountListRelationFilter
    sessions?: SessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    emailVerified?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    emailVerified?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    image?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type VerificationTokenWhereInput = {
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    token?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }

  export type VerificationTokenOrderByWithRelationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenWhereUniqueInput = Prisma.AtLeast<{
    token?: string
    identifier_token?: VerificationTokenIdentifierTokenCompoundUniqueInput
    AND?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    OR?: VerificationTokenWhereInput[]
    NOT?: VerificationTokenWhereInput | VerificationTokenWhereInput[]
    identifier?: StringFilter<"VerificationToken"> | string
    expires?: DateTimeFilter<"VerificationToken"> | Date | string
  }, "token" | "identifier_token">

  export type VerificationTokenOrderByWithAggregationInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
    _count?: VerificationTokenCountOrderByAggregateInput
    _max?: VerificationTokenMaxOrderByAggregateInput
    _min?: VerificationTokenMinOrderByAggregateInput
  }

  export type VerificationTokenScalarWhereWithAggregatesInput = {
    AND?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    OR?: VerificationTokenScalarWhereWithAggregatesInput[]
    NOT?: VerificationTokenScalarWhereWithAggregatesInput | VerificationTokenScalarWhereWithAggregatesInput[]
    identifier?: StringWithAggregatesFilter<"VerificationToken"> | string
    token?: StringWithAggregatesFilter<"VerificationToken"> | string
    expires?: DateTimeWithAggregatesFilter<"VerificationToken"> | Date | string
  }

  export type FeatureConfigWhereInput = {
    AND?: FeatureConfigWhereInput | FeatureConfigWhereInput[]
    OR?: FeatureConfigWhereInput[]
    NOT?: FeatureConfigWhereInput | FeatureConfigWhereInput[]
    id?: StringFilter<"FeatureConfig"> | string
    serverId?: StringFilter<"FeatureConfig"> | string
    targetType?: EnumTargetTypeFilter<"FeatureConfig"> | $Enums.TargetType
    targetId?: StringFilter<"FeatureConfig"> | string
    featureKey?: StringFilter<"FeatureConfig"> | string
    isEnabled?: BoolFilter<"FeatureConfig"> | boolean
    settings?: JsonNullableFilter<"FeatureConfig">
    createdAt?: DateTimeFilter<"FeatureConfig"> | Date | string
    updatedAt?: DateTimeFilter<"FeatureConfig"> | Date | string
  }

  export type FeatureConfigOrderByWithRelationInput = {
    id?: SortOrder
    serverId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    isEnabled?: SortOrder
    settings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeatureConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serverId_targetType_targetId_featureKey?: FeatureConfigServerIdTargetTypeTargetIdFeatureKeyCompoundUniqueInput
    AND?: FeatureConfigWhereInput | FeatureConfigWhereInput[]
    OR?: FeatureConfigWhereInput[]
    NOT?: FeatureConfigWhereInput | FeatureConfigWhereInput[]
    serverId?: StringFilter<"FeatureConfig"> | string
    targetType?: EnumTargetTypeFilter<"FeatureConfig"> | $Enums.TargetType
    targetId?: StringFilter<"FeatureConfig"> | string
    featureKey?: StringFilter<"FeatureConfig"> | string
    isEnabled?: BoolFilter<"FeatureConfig"> | boolean
    settings?: JsonNullableFilter<"FeatureConfig">
    createdAt?: DateTimeFilter<"FeatureConfig"> | Date | string
    updatedAt?: DateTimeFilter<"FeatureConfig"> | Date | string
  }, "id" | "serverId_targetType_targetId_featureKey">

  export type FeatureConfigOrderByWithAggregationInput = {
    id?: SortOrder
    serverId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    isEnabled?: SortOrder
    settings?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FeatureConfigCountOrderByAggregateInput
    _max?: FeatureConfigMaxOrderByAggregateInput
    _min?: FeatureConfigMinOrderByAggregateInput
  }

  export type FeatureConfigScalarWhereWithAggregatesInput = {
    AND?: FeatureConfigScalarWhereWithAggregatesInput | FeatureConfigScalarWhereWithAggregatesInput[]
    OR?: FeatureConfigScalarWhereWithAggregatesInput[]
    NOT?: FeatureConfigScalarWhereWithAggregatesInput | FeatureConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"FeatureConfig"> | string
    serverId?: StringWithAggregatesFilter<"FeatureConfig"> | string
    targetType?: EnumTargetTypeWithAggregatesFilter<"FeatureConfig"> | $Enums.TargetType
    targetId?: StringWithAggregatesFilter<"FeatureConfig"> | string
    featureKey?: StringWithAggregatesFilter<"FeatureConfig"> | string
    isEnabled?: BoolWithAggregatesFilter<"FeatureConfig"> | boolean
    settings?: JsonNullableWithAggregatesFilter<"FeatureConfig">
    createdAt?: DateTimeWithAggregatesFilter<"FeatureConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"FeatureConfig"> | Date | string
  }

  export type ConfigAuditLogWhereInput = {
    AND?: ConfigAuditLogWhereInput | ConfigAuditLogWhereInput[]
    OR?: ConfigAuditLogWhereInput[]
    NOT?: ConfigAuditLogWhereInput | ConfigAuditLogWhereInput[]
    id?: StringFilter<"ConfigAuditLog"> | string
    serverId?: StringFilter<"ConfigAuditLog"> | string
    userId?: StringFilter<"ConfigAuditLog"> | string
    action?: StringFilter<"ConfigAuditLog"> | string
    targetType?: EnumTargetTypeFilter<"ConfigAuditLog"> | $Enums.TargetType
    targetId?: StringFilter<"ConfigAuditLog"> | string
    featureKey?: StringFilter<"ConfigAuditLog"> | string
    oldValue?: JsonNullableFilter<"ConfigAuditLog">
    newValue?: JsonNullableFilter<"ConfigAuditLog">
    createdAt?: DateTimeFilter<"ConfigAuditLog"> | Date | string
  }

  export type ConfigAuditLogOrderByWithRelationInput = {
    id?: SortOrder
    serverId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type ConfigAuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ConfigAuditLogWhereInput | ConfigAuditLogWhereInput[]
    OR?: ConfigAuditLogWhereInput[]
    NOT?: ConfigAuditLogWhereInput | ConfigAuditLogWhereInput[]
    serverId?: StringFilter<"ConfigAuditLog"> | string
    userId?: StringFilter<"ConfigAuditLog"> | string
    action?: StringFilter<"ConfigAuditLog"> | string
    targetType?: EnumTargetTypeFilter<"ConfigAuditLog"> | $Enums.TargetType
    targetId?: StringFilter<"ConfigAuditLog"> | string
    featureKey?: StringFilter<"ConfigAuditLog"> | string
    oldValue?: JsonNullableFilter<"ConfigAuditLog">
    newValue?: JsonNullableFilter<"ConfigAuditLog">
    createdAt?: DateTimeFilter<"ConfigAuditLog"> | Date | string
  }, "id">

  export type ConfigAuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    serverId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    oldValue?: SortOrderInput | SortOrder
    newValue?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ConfigAuditLogCountOrderByAggregateInput
    _max?: ConfigAuditLogMaxOrderByAggregateInput
    _min?: ConfigAuditLogMinOrderByAggregateInput
  }

  export type ConfigAuditLogScalarWhereWithAggregatesInput = {
    AND?: ConfigAuditLogScalarWhereWithAggregatesInput | ConfigAuditLogScalarWhereWithAggregatesInput[]
    OR?: ConfigAuditLogScalarWhereWithAggregatesInput[]
    NOT?: ConfigAuditLogScalarWhereWithAggregatesInput | ConfigAuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ConfigAuditLog"> | string
    serverId?: StringWithAggregatesFilter<"ConfigAuditLog"> | string
    userId?: StringWithAggregatesFilter<"ConfigAuditLog"> | string
    action?: StringWithAggregatesFilter<"ConfigAuditLog"> | string
    targetType?: EnumTargetTypeWithAggregatesFilter<"ConfigAuditLog"> | $Enums.TargetType
    targetId?: StringWithAggregatesFilter<"ConfigAuditLog"> | string
    featureKey?: StringWithAggregatesFilter<"ConfigAuditLog"> | string
    oldValue?: JsonNullableWithAggregatesFilter<"ConfigAuditLog">
    newValue?: JsonNullableWithAggregatesFilter<"ConfigAuditLog">
    createdAt?: DateTimeWithAggregatesFilter<"ConfigAuditLog"> | Date | string
  }

  export type UserUsageMetricWhereInput = {
    AND?: UserUsageMetricWhereInput | UserUsageMetricWhereInput[]
    OR?: UserUsageMetricWhereInput[]
    NOT?: UserUsageMetricWhereInput | UserUsageMetricWhereInput[]
    userId?: StringFilter<"UserUsageMetric"> | string
    lastActive?: DateTimeFilter<"UserUsageMetric"> | Date | string
    totalCommands?: IntFilter<"UserUsageMetric"> | number
    rateLimitHits?: IntFilter<"UserUsageMetric"> | number
    securityFlags?: JsonFilter<"UserUsageMetric">
    createdAt?: DateTimeFilter<"UserUsageMetric"> | Date | string
    updatedAt?: DateTimeFilter<"UserUsageMetric"> | Date | string
  }

  export type UserUsageMetricOrderByWithRelationInput = {
    userId?: SortOrder
    lastActive?: SortOrder
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
    securityFlags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserUsageMetricWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: UserUsageMetricWhereInput | UserUsageMetricWhereInput[]
    OR?: UserUsageMetricWhereInput[]
    NOT?: UserUsageMetricWhereInput | UserUsageMetricWhereInput[]
    lastActive?: DateTimeFilter<"UserUsageMetric"> | Date | string
    totalCommands?: IntFilter<"UserUsageMetric"> | number
    rateLimitHits?: IntFilter<"UserUsageMetric"> | number
    securityFlags?: JsonFilter<"UserUsageMetric">
    createdAt?: DateTimeFilter<"UserUsageMetric"> | Date | string
    updatedAt?: DateTimeFilter<"UserUsageMetric"> | Date | string
  }, "userId">

  export type UserUsageMetricOrderByWithAggregationInput = {
    userId?: SortOrder
    lastActive?: SortOrder
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
    securityFlags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserUsageMetricCountOrderByAggregateInput
    _avg?: UserUsageMetricAvgOrderByAggregateInput
    _max?: UserUsageMetricMaxOrderByAggregateInput
    _min?: UserUsageMetricMinOrderByAggregateInput
    _sum?: UserUsageMetricSumOrderByAggregateInput
  }

  export type UserUsageMetricScalarWhereWithAggregatesInput = {
    AND?: UserUsageMetricScalarWhereWithAggregatesInput | UserUsageMetricScalarWhereWithAggregatesInput[]
    OR?: UserUsageMetricScalarWhereWithAggregatesInput[]
    NOT?: UserUsageMetricScalarWhereWithAggregatesInput | UserUsageMetricScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"UserUsageMetric"> | string
    lastActive?: DateTimeWithAggregatesFilter<"UserUsageMetric"> | Date | string
    totalCommands?: IntWithAggregatesFilter<"UserUsageMetric"> | number
    rateLimitHits?: IntWithAggregatesFilter<"UserUsageMetric"> | number
    securityFlags?: JsonWithAggregatesFilter<"UserUsageMetric">
    createdAt?: DateTimeWithAggregatesFilter<"UserUsageMetric"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserUsageMetric"> | Date | string
  }

  export type DiscussionScheduleWhereInput = {
    AND?: DiscussionScheduleWhereInput | DiscussionScheduleWhereInput[]
    OR?: DiscussionScheduleWhereInput[]
    NOT?: DiscussionScheduleWhereInput | DiscussionScheduleWhereInput[]
    id?: StringFilter<"DiscussionSchedule"> | string
    serverId?: StringFilter<"DiscussionSchedule"> | string
    channelId?: StringFilter<"DiscussionSchedule"> | string
    days?: JsonFilter<"DiscussionSchedule">
    timeUtc?: StringFilter<"DiscussionSchedule"> | string
    timezone?: StringFilter<"DiscussionSchedule"> | string
    categoryFilter?: StringNullableFilter<"DiscussionSchedule"> | string | null
    useAi?: BoolFilter<"DiscussionSchedule"> | boolean
    isActive?: BoolFilter<"DiscussionSchedule"> | boolean
    createdBy?: StringFilter<"DiscussionSchedule"> | string
    createdAt?: DateTimeFilter<"DiscussionSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"DiscussionSchedule"> | Date | string
  }

  export type DiscussionScheduleOrderByWithRelationInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    days?: SortOrder
    timeUtc?: SortOrder
    timezone?: SortOrder
    categoryFilter?: SortOrderInput | SortOrder
    useAi?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiscussionScheduleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serverId_channelId?: DiscussionScheduleServerIdChannelIdCompoundUniqueInput
    AND?: DiscussionScheduleWhereInput | DiscussionScheduleWhereInput[]
    OR?: DiscussionScheduleWhereInput[]
    NOT?: DiscussionScheduleWhereInput | DiscussionScheduleWhereInput[]
    serverId?: StringFilter<"DiscussionSchedule"> | string
    channelId?: StringFilter<"DiscussionSchedule"> | string
    days?: JsonFilter<"DiscussionSchedule">
    timeUtc?: StringFilter<"DiscussionSchedule"> | string
    timezone?: StringFilter<"DiscussionSchedule"> | string
    categoryFilter?: StringNullableFilter<"DiscussionSchedule"> | string | null
    useAi?: BoolFilter<"DiscussionSchedule"> | boolean
    isActive?: BoolFilter<"DiscussionSchedule"> | boolean
    createdBy?: StringFilter<"DiscussionSchedule"> | string
    createdAt?: DateTimeFilter<"DiscussionSchedule"> | Date | string
    updatedAt?: DateTimeFilter<"DiscussionSchedule"> | Date | string
  }, "id" | "serverId_channelId">

  export type DiscussionScheduleOrderByWithAggregationInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    days?: SortOrder
    timeUtc?: SortOrder
    timezone?: SortOrder
    categoryFilter?: SortOrderInput | SortOrder
    useAi?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DiscussionScheduleCountOrderByAggregateInput
    _max?: DiscussionScheduleMaxOrderByAggregateInput
    _min?: DiscussionScheduleMinOrderByAggregateInput
  }

  export type DiscussionScheduleScalarWhereWithAggregatesInput = {
    AND?: DiscussionScheduleScalarWhereWithAggregatesInput | DiscussionScheduleScalarWhereWithAggregatesInput[]
    OR?: DiscussionScheduleScalarWhereWithAggregatesInput[]
    NOT?: DiscussionScheduleScalarWhereWithAggregatesInput | DiscussionScheduleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiscussionSchedule"> | string
    serverId?: StringWithAggregatesFilter<"DiscussionSchedule"> | string
    channelId?: StringWithAggregatesFilter<"DiscussionSchedule"> | string
    days?: JsonWithAggregatesFilter<"DiscussionSchedule">
    timeUtc?: StringWithAggregatesFilter<"DiscussionSchedule"> | string
    timezone?: StringWithAggregatesFilter<"DiscussionSchedule"> | string
    categoryFilter?: StringNullableWithAggregatesFilter<"DiscussionSchedule"> | string | null
    useAi?: BoolWithAggregatesFilter<"DiscussionSchedule"> | boolean
    isActive?: BoolWithAggregatesFilter<"DiscussionSchedule"> | boolean
    createdBy?: StringWithAggregatesFilter<"DiscussionSchedule"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DiscussionSchedule"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DiscussionSchedule"> | Date | string
  }

  export type AIAccessGrantWhereInput = {
    AND?: AIAccessGrantWhereInput | AIAccessGrantWhereInput[]
    OR?: AIAccessGrantWhereInput[]
    NOT?: AIAccessGrantWhereInput | AIAccessGrantWhereInput[]
    id?: StringFilter<"AIAccessGrant"> | string
    serverId?: StringFilter<"AIAccessGrant"> | string
    grantType?: EnumAIGrantTypeFilter<"AIAccessGrant"> | $Enums.AIGrantType
    targetId?: StringFilter<"AIAccessGrant"> | string
    grantedBy?: StringFilter<"AIAccessGrant"> | string
    createdAt?: DateTimeFilter<"AIAccessGrant"> | Date | string
  }

  export type AIAccessGrantOrderByWithRelationInput = {
    id?: SortOrder
    serverId?: SortOrder
    grantType?: SortOrder
    targetId?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AIAccessGrantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    serverId_grantType_targetId?: AIAccessGrantServerIdGrantTypeTargetIdCompoundUniqueInput
    AND?: AIAccessGrantWhereInput | AIAccessGrantWhereInput[]
    OR?: AIAccessGrantWhereInput[]
    NOT?: AIAccessGrantWhereInput | AIAccessGrantWhereInput[]
    serverId?: StringFilter<"AIAccessGrant"> | string
    grantType?: EnumAIGrantTypeFilter<"AIAccessGrant"> | $Enums.AIGrantType
    targetId?: StringFilter<"AIAccessGrant"> | string
    grantedBy?: StringFilter<"AIAccessGrant"> | string
    createdAt?: DateTimeFilter<"AIAccessGrant"> | Date | string
  }, "id" | "serverId_grantType_targetId">

  export type AIAccessGrantOrderByWithAggregationInput = {
    id?: SortOrder
    serverId?: SortOrder
    grantType?: SortOrder
    targetId?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
    _count?: AIAccessGrantCountOrderByAggregateInput
    _max?: AIAccessGrantMaxOrderByAggregateInput
    _min?: AIAccessGrantMinOrderByAggregateInput
  }

  export type AIAccessGrantScalarWhereWithAggregatesInput = {
    AND?: AIAccessGrantScalarWhereWithAggregatesInput | AIAccessGrantScalarWhereWithAggregatesInput[]
    OR?: AIAccessGrantScalarWhereWithAggregatesInput[]
    NOT?: AIAccessGrantScalarWhereWithAggregatesInput | AIAccessGrantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AIAccessGrant"> | string
    serverId?: StringWithAggregatesFilter<"AIAccessGrant"> | string
    grantType?: EnumAIGrantTypeWithAggregatesFilter<"AIAccessGrant"> | $Enums.AIGrantType
    targetId?: StringWithAggregatesFilter<"AIAccessGrant"> | string
    grantedBy?: StringWithAggregatesFilter<"AIAccessGrant"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AIAccessGrant"> | Date | string
  }

  export type DiscussionPromptLogWhereInput = {
    AND?: DiscussionPromptLogWhereInput | DiscussionPromptLogWhereInput[]
    OR?: DiscussionPromptLogWhereInput[]
    NOT?: DiscussionPromptLogWhereInput | DiscussionPromptLogWhereInput[]
    id?: StringFilter<"DiscussionPromptLog"> | string
    serverId?: StringFilter<"DiscussionPromptLog"> | string
    channelId?: StringFilter<"DiscussionPromptLog"> | string
    promptText?: StringFilter<"DiscussionPromptLog"> | string
    category?: StringFilter<"DiscussionPromptLog"> | string
    source?: StringFilter<"DiscussionPromptLog"> | string
    threadId?: StringNullableFilter<"DiscussionPromptLog"> | string | null
    postedAt?: DateTimeFilter<"DiscussionPromptLog"> | Date | string
  }

  export type DiscussionPromptLogOrderByWithRelationInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    promptText?: SortOrder
    category?: SortOrder
    source?: SortOrder
    threadId?: SortOrderInput | SortOrder
    postedAt?: SortOrder
  }

  export type DiscussionPromptLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DiscussionPromptLogWhereInput | DiscussionPromptLogWhereInput[]
    OR?: DiscussionPromptLogWhereInput[]
    NOT?: DiscussionPromptLogWhereInput | DiscussionPromptLogWhereInput[]
    serverId?: StringFilter<"DiscussionPromptLog"> | string
    channelId?: StringFilter<"DiscussionPromptLog"> | string
    promptText?: StringFilter<"DiscussionPromptLog"> | string
    category?: StringFilter<"DiscussionPromptLog"> | string
    source?: StringFilter<"DiscussionPromptLog"> | string
    threadId?: StringNullableFilter<"DiscussionPromptLog"> | string | null
    postedAt?: DateTimeFilter<"DiscussionPromptLog"> | Date | string
  }, "id">

  export type DiscussionPromptLogOrderByWithAggregationInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    promptText?: SortOrder
    category?: SortOrder
    source?: SortOrder
    threadId?: SortOrderInput | SortOrder
    postedAt?: SortOrder
    _count?: DiscussionPromptLogCountOrderByAggregateInput
    _max?: DiscussionPromptLogMaxOrderByAggregateInput
    _min?: DiscussionPromptLogMinOrderByAggregateInput
  }

  export type DiscussionPromptLogScalarWhereWithAggregatesInput = {
    AND?: DiscussionPromptLogScalarWhereWithAggregatesInput | DiscussionPromptLogScalarWhereWithAggregatesInput[]
    OR?: DiscussionPromptLogScalarWhereWithAggregatesInput[]
    NOT?: DiscussionPromptLogScalarWhereWithAggregatesInput | DiscussionPromptLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DiscussionPromptLog"> | string
    serverId?: StringWithAggregatesFilter<"DiscussionPromptLog"> | string
    channelId?: StringWithAggregatesFilter<"DiscussionPromptLog"> | string
    promptText?: StringWithAggregatesFilter<"DiscussionPromptLog"> | string
    category?: StringWithAggregatesFilter<"DiscussionPromptLog"> | string
    source?: StringWithAggregatesFilter<"DiscussionPromptLog"> | string
    threadId?: StringNullableWithAggregatesFilter<"DiscussionPromptLog"> | string | null
    postedAt?: DateTimeWithAggregatesFilter<"DiscussionPromptLog"> | Date | string
  }

  export type PromptWhereInput = {
    AND?: PromptWhereInput | PromptWhereInput[]
    OR?: PromptWhereInput[]
    NOT?: PromptWhereInput | PromptWhereInput[]
    id?: StringFilter<"Prompt"> | string
    text?: StringFilter<"Prompt"> | string
    originalCategory?: StringFilter<"Prompt"> | string
    submittedBy?: StringNullableFilter<"Prompt"> | string | null
    submittedByUsername?: StringNullableFilter<"Prompt"> | string | null
    createdAt?: DateTimeFilter<"Prompt"> | Date | string
    tags?: PromptTagListRelationFilter
    votes?: PromptVoteListRelationFilter
    duplicateFlags?: PromptDuplicateFlagListRelationFilter
  }

  export type PromptOrderByWithRelationInput = {
    id?: SortOrder
    text?: SortOrder
    originalCategory?: SortOrder
    submittedBy?: SortOrderInput | SortOrder
    submittedByUsername?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tags?: PromptTagOrderByRelationAggregateInput
    votes?: PromptVoteOrderByRelationAggregateInput
    duplicateFlags?: PromptDuplicateFlagOrderByRelationAggregateInput
  }

  export type PromptWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PromptWhereInput | PromptWhereInput[]
    OR?: PromptWhereInput[]
    NOT?: PromptWhereInput | PromptWhereInput[]
    text?: StringFilter<"Prompt"> | string
    originalCategory?: StringFilter<"Prompt"> | string
    submittedBy?: StringNullableFilter<"Prompt"> | string | null
    submittedByUsername?: StringNullableFilter<"Prompt"> | string | null
    createdAt?: DateTimeFilter<"Prompt"> | Date | string
    tags?: PromptTagListRelationFilter
    votes?: PromptVoteListRelationFilter
    duplicateFlags?: PromptDuplicateFlagListRelationFilter
  }, "id">

  export type PromptOrderByWithAggregationInput = {
    id?: SortOrder
    text?: SortOrder
    originalCategory?: SortOrder
    submittedBy?: SortOrderInput | SortOrder
    submittedByUsername?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PromptCountOrderByAggregateInput
    _max?: PromptMaxOrderByAggregateInput
    _min?: PromptMinOrderByAggregateInput
  }

  export type PromptScalarWhereWithAggregatesInput = {
    AND?: PromptScalarWhereWithAggregatesInput | PromptScalarWhereWithAggregatesInput[]
    OR?: PromptScalarWhereWithAggregatesInput[]
    NOT?: PromptScalarWhereWithAggregatesInput | PromptScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Prompt"> | string
    text?: StringWithAggregatesFilter<"Prompt"> | string
    originalCategory?: StringWithAggregatesFilter<"Prompt"> | string
    submittedBy?: StringNullableWithAggregatesFilter<"Prompt"> | string | null
    submittedByUsername?: StringNullableWithAggregatesFilter<"Prompt"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Prompt"> | Date | string
  }

  export type PromptTagWhereInput = {
    AND?: PromptTagWhereInput | PromptTagWhereInput[]
    OR?: PromptTagWhereInput[]
    NOT?: PromptTagWhereInput | PromptTagWhereInput[]
    id?: StringFilter<"PromptTag"> | string
    promptId?: StringFilter<"PromptTag"> | string
    tag?: StringFilter<"PromptTag"> | string
    prompt?: XOR<PromptRelationFilter, PromptWhereInput>
  }

  export type PromptTagOrderByWithRelationInput = {
    id?: SortOrder
    promptId?: SortOrder
    tag?: SortOrder
    prompt?: PromptOrderByWithRelationInput
  }

  export type PromptTagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    promptId_tag?: PromptTagPromptIdTagCompoundUniqueInput
    AND?: PromptTagWhereInput | PromptTagWhereInput[]
    OR?: PromptTagWhereInput[]
    NOT?: PromptTagWhereInput | PromptTagWhereInput[]
    promptId?: StringFilter<"PromptTag"> | string
    tag?: StringFilter<"PromptTag"> | string
    prompt?: XOR<PromptRelationFilter, PromptWhereInput>
  }, "id" | "promptId_tag">

  export type PromptTagOrderByWithAggregationInput = {
    id?: SortOrder
    promptId?: SortOrder
    tag?: SortOrder
    _count?: PromptTagCountOrderByAggregateInput
    _max?: PromptTagMaxOrderByAggregateInput
    _min?: PromptTagMinOrderByAggregateInput
  }

  export type PromptTagScalarWhereWithAggregatesInput = {
    AND?: PromptTagScalarWhereWithAggregatesInput | PromptTagScalarWhereWithAggregatesInput[]
    OR?: PromptTagScalarWhereWithAggregatesInput[]
    NOT?: PromptTagScalarWhereWithAggregatesInput | PromptTagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PromptTag"> | string
    promptId?: StringWithAggregatesFilter<"PromptTag"> | string
    tag?: StringWithAggregatesFilter<"PromptTag"> | string
  }

  export type PromptVoteWhereInput = {
    AND?: PromptVoteWhereInput | PromptVoteWhereInput[]
    OR?: PromptVoteWhereInput[]
    NOT?: PromptVoteWhereInput | PromptVoteWhereInput[]
    id?: StringFilter<"PromptVote"> | string
    promptId?: StringFilter<"PromptVote"> | string
    discordUserId?: StringFilter<"PromptVote"> | string
    discordUsername?: StringFilter<"PromptVote"> | string
    vote?: EnumVoteDirectionFilter<"PromptVote"> | $Enums.VoteDirection
    createdAt?: DateTimeFilter<"PromptVote"> | Date | string
    updatedAt?: DateTimeFilter<"PromptVote"> | Date | string
    prompt?: XOR<PromptRelationFilter, PromptWhereInput>
  }

  export type PromptVoteOrderByWithRelationInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    discordUsername?: SortOrder
    vote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    prompt?: PromptOrderByWithRelationInput
  }

  export type PromptVoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    promptId_discordUserId?: PromptVotePromptIdDiscordUserIdCompoundUniqueInput
    AND?: PromptVoteWhereInput | PromptVoteWhereInput[]
    OR?: PromptVoteWhereInput[]
    NOT?: PromptVoteWhereInput | PromptVoteWhereInput[]
    promptId?: StringFilter<"PromptVote"> | string
    discordUserId?: StringFilter<"PromptVote"> | string
    discordUsername?: StringFilter<"PromptVote"> | string
    vote?: EnumVoteDirectionFilter<"PromptVote"> | $Enums.VoteDirection
    createdAt?: DateTimeFilter<"PromptVote"> | Date | string
    updatedAt?: DateTimeFilter<"PromptVote"> | Date | string
    prompt?: XOR<PromptRelationFilter, PromptWhereInput>
  }, "id" | "promptId_discordUserId">

  export type PromptVoteOrderByWithAggregationInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    discordUsername?: SortOrder
    vote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PromptVoteCountOrderByAggregateInput
    _max?: PromptVoteMaxOrderByAggregateInput
    _min?: PromptVoteMinOrderByAggregateInput
  }

  export type PromptVoteScalarWhereWithAggregatesInput = {
    AND?: PromptVoteScalarWhereWithAggregatesInput | PromptVoteScalarWhereWithAggregatesInput[]
    OR?: PromptVoteScalarWhereWithAggregatesInput[]
    NOT?: PromptVoteScalarWhereWithAggregatesInput | PromptVoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PromptVote"> | string
    promptId?: StringWithAggregatesFilter<"PromptVote"> | string
    discordUserId?: StringWithAggregatesFilter<"PromptVote"> | string
    discordUsername?: StringWithAggregatesFilter<"PromptVote"> | string
    vote?: EnumVoteDirectionWithAggregatesFilter<"PromptVote"> | $Enums.VoteDirection
    createdAt?: DateTimeWithAggregatesFilter<"PromptVote"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PromptVote"> | Date | string
  }

  export type PromptDuplicateFlagWhereInput = {
    AND?: PromptDuplicateFlagWhereInput | PromptDuplicateFlagWhereInput[]
    OR?: PromptDuplicateFlagWhereInput[]
    NOT?: PromptDuplicateFlagWhereInput | PromptDuplicateFlagWhereInput[]
    id?: StringFilter<"PromptDuplicateFlag"> | string
    promptId?: StringFilter<"PromptDuplicateFlag"> | string
    discordUserId?: StringFilter<"PromptDuplicateFlag"> | string
    createdAt?: DateTimeFilter<"PromptDuplicateFlag"> | Date | string
    prompt?: XOR<PromptRelationFilter, PromptWhereInput>
  }

  export type PromptDuplicateFlagOrderByWithRelationInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    createdAt?: SortOrder
    prompt?: PromptOrderByWithRelationInput
  }

  export type PromptDuplicateFlagWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    promptId_discordUserId?: PromptDuplicateFlagPromptIdDiscordUserIdCompoundUniqueInput
    AND?: PromptDuplicateFlagWhereInput | PromptDuplicateFlagWhereInput[]
    OR?: PromptDuplicateFlagWhereInput[]
    NOT?: PromptDuplicateFlagWhereInput | PromptDuplicateFlagWhereInput[]
    promptId?: StringFilter<"PromptDuplicateFlag"> | string
    discordUserId?: StringFilter<"PromptDuplicateFlag"> | string
    createdAt?: DateTimeFilter<"PromptDuplicateFlag"> | Date | string
    prompt?: XOR<PromptRelationFilter, PromptWhereInput>
  }, "id" | "promptId_discordUserId">

  export type PromptDuplicateFlagOrderByWithAggregationInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    createdAt?: SortOrder
    _count?: PromptDuplicateFlagCountOrderByAggregateInput
    _max?: PromptDuplicateFlagMaxOrderByAggregateInput
    _min?: PromptDuplicateFlagMinOrderByAggregateInput
  }

  export type PromptDuplicateFlagScalarWhereWithAggregatesInput = {
    AND?: PromptDuplicateFlagScalarWhereWithAggregatesInput | PromptDuplicateFlagScalarWhereWithAggregatesInput[]
    OR?: PromptDuplicateFlagScalarWhereWithAggregatesInput[]
    NOT?: PromptDuplicateFlagScalarWhereWithAggregatesInput | PromptDuplicateFlagScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PromptDuplicateFlag"> | string
    promptId?: StringWithAggregatesFilter<"PromptDuplicateFlag"> | string
    discordUserId?: StringWithAggregatesFilter<"PromptDuplicateFlag"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PromptDuplicateFlag"> | Date | string
  }

  export type AccountCreateInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user: UserCreateNestedOneWithoutAccountsInput
  }

  export type AccountUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutAccountsNestedInput
  }

  export type AccountUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountCreateManyInput = {
    id?: string
    userId: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionCreateInput = {
    id?: string
    sessionToken: string
    expires: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type SessionUncheckedCreateInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type SessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionCreateManyInput = {
    id?: string
    sessionToken: string
    userId: string
    expires: Date | string
  }

  export type SessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    accounts?: AccountCreateNestedManyWithoutUserInput
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type VerificationTokenCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUncheckedCreateInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenCreateManyInput = {
    identifier: string
    token: string
    expires: Date | string
  }

  export type VerificationTokenUpdateManyMutationInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VerificationTokenUncheckedUpdateManyInput = {
    identifier?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeatureConfigCreateInput = {
    id?: string
    serverId: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    isEnabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeatureConfigUncheckedCreateInput = {
    id?: string
    serverId: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    isEnabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeatureConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeatureConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeatureConfigCreateManyInput = {
    id?: string
    serverId: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    isEnabled?: boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FeatureConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FeatureConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    isEnabled?: BoolFieldUpdateOperationsInput | boolean
    settings?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigAuditLogCreateInput = {
    id?: string
    serverId: string
    userId: string
    action: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ConfigAuditLogUncheckedCreateInput = {
    id?: string
    serverId: string
    userId: string
    action: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ConfigAuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigAuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigAuditLogCreateManyInput = {
    id?: string
    serverId: string
    userId: string
    action: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type ConfigAuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ConfigAuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    targetType?: EnumTargetTypeFieldUpdateOperationsInput | $Enums.TargetType
    targetId?: StringFieldUpdateOperationsInput | string
    featureKey?: StringFieldUpdateOperationsInput | string
    oldValue?: NullableJsonNullValueInput | InputJsonValue
    newValue?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUsageMetricCreateInput = {
    userId: string
    lastActive?: Date | string
    totalCommands?: number
    rateLimitHits?: number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUsageMetricUncheckedCreateInput = {
    userId: string
    lastActive?: Date | string
    totalCommands?: number
    rateLimitHits?: number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUsageMetricUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCommands?: IntFieldUpdateOperationsInput | number
    rateLimitHits?: IntFieldUpdateOperationsInput | number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUsageMetricUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCommands?: IntFieldUpdateOperationsInput | number
    rateLimitHits?: IntFieldUpdateOperationsInput | number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUsageMetricCreateManyInput = {
    userId: string
    lastActive?: Date | string
    totalCommands?: number
    rateLimitHits?: number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUsageMetricUpdateManyMutationInput = {
    userId?: StringFieldUpdateOperationsInput | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCommands?: IntFieldUpdateOperationsInput | number
    rateLimitHits?: IntFieldUpdateOperationsInput | number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUsageMetricUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    lastActive?: DateTimeFieldUpdateOperationsInput | Date | string
    totalCommands?: IntFieldUpdateOperationsInput | number
    rateLimitHits?: IntFieldUpdateOperationsInput | number
    securityFlags?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionScheduleCreateInput = {
    id?: string
    serverId: string
    channelId: string
    days: JsonNullValueInput | InputJsonValue
    timeUtc: string
    timezone?: string
    categoryFilter?: string | null
    useAi?: boolean
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiscussionScheduleUncheckedCreateInput = {
    id?: string
    serverId: string
    channelId: string
    days: JsonNullValueInput | InputJsonValue
    timeUtc: string
    timezone?: string
    categoryFilter?: string | null
    useAi?: boolean
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiscussionScheduleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    days?: JsonNullValueInput | InputJsonValue
    timeUtc?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    categoryFilter?: NullableStringFieldUpdateOperationsInput | string | null
    useAi?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionScheduleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    days?: JsonNullValueInput | InputJsonValue
    timeUtc?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    categoryFilter?: NullableStringFieldUpdateOperationsInput | string | null
    useAi?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionScheduleCreateManyInput = {
    id?: string
    serverId: string
    channelId: string
    days: JsonNullValueInput | InputJsonValue
    timeUtc: string
    timezone?: string
    categoryFilter?: string | null
    useAi?: boolean
    isActive?: boolean
    createdBy: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DiscussionScheduleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    days?: JsonNullValueInput | InputJsonValue
    timeUtc?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    categoryFilter?: NullableStringFieldUpdateOperationsInput | string | null
    useAi?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionScheduleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    days?: JsonNullValueInput | InputJsonValue
    timeUtc?: StringFieldUpdateOperationsInput | string
    timezone?: StringFieldUpdateOperationsInput | string
    categoryFilter?: NullableStringFieldUpdateOperationsInput | string | null
    useAi?: BoolFieldUpdateOperationsInput | boolean
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAccessGrantCreateInput = {
    id?: string
    serverId: string
    grantType: $Enums.AIGrantType
    targetId: string
    grantedBy: string
    createdAt?: Date | string
  }

  export type AIAccessGrantUncheckedCreateInput = {
    id?: string
    serverId: string
    grantType: $Enums.AIGrantType
    targetId: string
    grantedBy: string
    createdAt?: Date | string
  }

  export type AIAccessGrantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    grantType?: EnumAIGrantTypeFieldUpdateOperationsInput | $Enums.AIGrantType
    targetId?: StringFieldUpdateOperationsInput | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAccessGrantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    grantType?: EnumAIGrantTypeFieldUpdateOperationsInput | $Enums.AIGrantType
    targetId?: StringFieldUpdateOperationsInput | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAccessGrantCreateManyInput = {
    id?: string
    serverId: string
    grantType: $Enums.AIGrantType
    targetId: string
    grantedBy: string
    createdAt?: Date | string
  }

  export type AIAccessGrantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    grantType?: EnumAIGrantTypeFieldUpdateOperationsInput | $Enums.AIGrantType
    targetId?: StringFieldUpdateOperationsInput | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AIAccessGrantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    grantType?: EnumAIGrantTypeFieldUpdateOperationsInput | $Enums.AIGrantType
    targetId?: StringFieldUpdateOperationsInput | string
    grantedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPromptLogCreateInput = {
    id?: string
    serverId: string
    channelId: string
    promptText: string
    category: string
    source: string
    threadId?: string | null
    postedAt?: Date | string
  }

  export type DiscussionPromptLogUncheckedCreateInput = {
    id?: string
    serverId: string
    channelId: string
    promptText: string
    category: string
    source: string
    threadId?: string | null
    postedAt?: Date | string
  }

  export type DiscussionPromptLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    promptText?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPromptLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    promptText?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPromptLogCreateManyInput = {
    id?: string
    serverId: string
    channelId: string
    promptText: string
    category: string
    source: string
    threadId?: string | null
    postedAt?: Date | string
  }

  export type DiscussionPromptLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    promptText?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DiscussionPromptLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    serverId?: StringFieldUpdateOperationsInput | string
    channelId?: StringFieldUpdateOperationsInput | string
    promptText?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    source?: StringFieldUpdateOperationsInput | string
    threadId?: NullableStringFieldUpdateOperationsInput | string | null
    postedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptCreateInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    tags?: PromptTagCreateNestedManyWithoutPromptInput
    votes?: PromptVoteCreateNestedManyWithoutPromptInput
    duplicateFlags?: PromptDuplicateFlagCreateNestedManyWithoutPromptInput
  }

  export type PromptUncheckedCreateInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    tags?: PromptTagUncheckedCreateNestedManyWithoutPromptInput
    votes?: PromptVoteUncheckedCreateNestedManyWithoutPromptInput
    duplicateFlags?: PromptDuplicateFlagUncheckedCreateNestedManyWithoutPromptInput
  }

  export type PromptUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: PromptTagUpdateManyWithoutPromptNestedInput
    votes?: PromptVoteUpdateManyWithoutPromptNestedInput
    duplicateFlags?: PromptDuplicateFlagUpdateManyWithoutPromptNestedInput
  }

  export type PromptUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: PromptTagUncheckedUpdateManyWithoutPromptNestedInput
    votes?: PromptVoteUncheckedUpdateManyWithoutPromptNestedInput
    duplicateFlags?: PromptDuplicateFlagUncheckedUpdateManyWithoutPromptNestedInput
  }

  export type PromptCreateManyInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
  }

  export type PromptUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptTagCreateInput = {
    id?: string
    tag: string
    prompt: PromptCreateNestedOneWithoutTagsInput
  }

  export type PromptTagUncheckedCreateInput = {
    id?: string
    promptId: string
    tag: string
  }

  export type PromptTagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
    prompt?: PromptUpdateOneRequiredWithoutTagsNestedInput
  }

  export type PromptTagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptId?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
  }

  export type PromptTagCreateManyInput = {
    id?: string
    promptId: string
    tag: string
  }

  export type PromptTagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
  }

  export type PromptTagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptId?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
  }

  export type PromptVoteCreateInput = {
    id?: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt?: Date | string
    updatedAt?: Date | string
    prompt: PromptCreateNestedOneWithoutVotesInput
  }

  export type PromptVoteUncheckedCreateInput = {
    id?: string
    promptId: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromptVoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prompt?: PromptUpdateOneRequiredWithoutVotesNestedInput
  }

  export type PromptVoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptId?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptVoteCreateManyInput = {
    id?: string
    promptId: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromptVoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptVoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptId?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptDuplicateFlagCreateInput = {
    id?: string
    discordUserId: string
    createdAt?: Date | string
    prompt: PromptCreateNestedOneWithoutDuplicateFlagsInput
  }

  export type PromptDuplicateFlagUncheckedCreateInput = {
    id?: string
    promptId: string
    discordUserId: string
    createdAt?: Date | string
  }

  export type PromptDuplicateFlagUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prompt?: PromptUpdateOneRequiredWithoutDuplicateFlagsNestedInput
  }

  export type PromptDuplicateFlagUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptId?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptDuplicateFlagCreateManyInput = {
    id?: string
    promptId: string
    discordUserId: string
    createdAt?: Date | string
  }

  export type PromptDuplicateFlagUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptDuplicateFlagUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    promptId?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AccountProviderProviderAccountIdCompoundUniqueInput = {
    provider: string
    providerAccountId: string
  }

  export type AccountCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountAvgOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type AccountMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    provider?: SortOrder
    providerAccountId?: SortOrder
    refresh_token?: SortOrder
    access_token?: SortOrder
    expires_at?: SortOrder
    token_type?: SortOrder
    scope?: SortOrder
    id_token?: SortOrder
    session_state?: SortOrder
  }

  export type AccountSumOrderByAggregateInput = {
    expires_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SessionCountOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type SessionMinOrderByAggregateInput = {
    id?: SortOrder
    sessionToken?: SortOrder
    userId?: SortOrder
    expires?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type AccountListRelationFilter = {
    every?: AccountWhereInput
    some?: AccountWhereInput
    none?: AccountWhereInput
  }

  export type SessionListRelationFilter = {
    every?: SessionWhereInput
    some?: SessionWhereInput
    none?: SessionWhereInput
  }

  export type AccountOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    emailVerified?: SortOrder
    image?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type VerificationTokenIdentifierTokenCompoundUniqueInput = {
    identifier: string
    token: string
  }

  export type VerificationTokenCountOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMaxOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type VerificationTokenMinOrderByAggregateInput = {
    identifier?: SortOrder
    token?: SortOrder
    expires?: SortOrder
  }

  export type EnumTargetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TargetType | EnumTargetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTargetTypeFilter<$PrismaModel> | $Enums.TargetType
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FeatureConfigServerIdTargetTypeTargetIdFeatureKeyCompoundUniqueInput = {
    serverId: string
    targetType: $Enums.TargetType
    targetId: string
    featureKey: string
  }

  export type FeatureConfigCountOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    isEnabled?: SortOrder
    settings?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeatureConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FeatureConfigMinOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    isEnabled?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTargetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TargetType | EnumTargetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTargetTypeWithAggregatesFilter<$PrismaModel> | $Enums.TargetType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTargetTypeFilter<$PrismaModel>
    _max?: NestedEnumTargetTypeFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type ConfigAuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    oldValue?: SortOrder
    newValue?: SortOrder
    createdAt?: SortOrder
  }

  export type ConfigAuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    createdAt?: SortOrder
  }

  export type ConfigAuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    targetType?: SortOrder
    targetId?: SortOrder
    featureKey?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserUsageMetricCountOrderByAggregateInput = {
    userId?: SortOrder
    lastActive?: SortOrder
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
    securityFlags?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserUsageMetricAvgOrderByAggregateInput = {
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
  }

  export type UserUsageMetricMaxOrderByAggregateInput = {
    userId?: SortOrder
    lastActive?: SortOrder
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserUsageMetricMinOrderByAggregateInput = {
    userId?: SortOrder
    lastActive?: SortOrder
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserUsageMetricSumOrderByAggregateInput = {
    totalCommands?: SortOrder
    rateLimitHits?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type DiscussionScheduleServerIdChannelIdCompoundUniqueInput = {
    serverId: string
    channelId: string
  }

  export type DiscussionScheduleCountOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    days?: SortOrder
    timeUtc?: SortOrder
    timezone?: SortOrder
    categoryFilter?: SortOrder
    useAi?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiscussionScheduleMaxOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    timeUtc?: SortOrder
    timezone?: SortOrder
    categoryFilter?: SortOrder
    useAi?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DiscussionScheduleMinOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    timeUtc?: SortOrder
    timezone?: SortOrder
    categoryFilter?: SortOrder
    useAi?: SortOrder
    isActive?: SortOrder
    createdBy?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumAIGrantTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AIGrantType | EnumAIGrantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAIGrantTypeFilter<$PrismaModel> | $Enums.AIGrantType
  }

  export type AIAccessGrantServerIdGrantTypeTargetIdCompoundUniqueInput = {
    serverId: string
    grantType: $Enums.AIGrantType
    targetId: string
  }

  export type AIAccessGrantCountOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    grantType?: SortOrder
    targetId?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AIAccessGrantMaxOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    grantType?: SortOrder
    targetId?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type AIAccessGrantMinOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    grantType?: SortOrder
    targetId?: SortOrder
    grantedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumAIGrantTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AIGrantType | EnumAIGrantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAIGrantTypeWithAggregatesFilter<$PrismaModel> | $Enums.AIGrantType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAIGrantTypeFilter<$PrismaModel>
    _max?: NestedEnumAIGrantTypeFilter<$PrismaModel>
  }

  export type DiscussionPromptLogCountOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    promptText?: SortOrder
    category?: SortOrder
    source?: SortOrder
    threadId?: SortOrder
    postedAt?: SortOrder
  }

  export type DiscussionPromptLogMaxOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    promptText?: SortOrder
    category?: SortOrder
    source?: SortOrder
    threadId?: SortOrder
    postedAt?: SortOrder
  }

  export type DiscussionPromptLogMinOrderByAggregateInput = {
    id?: SortOrder
    serverId?: SortOrder
    channelId?: SortOrder
    promptText?: SortOrder
    category?: SortOrder
    source?: SortOrder
    threadId?: SortOrder
    postedAt?: SortOrder
  }

  export type PromptTagListRelationFilter = {
    every?: PromptTagWhereInput
    some?: PromptTagWhereInput
    none?: PromptTagWhereInput
  }

  export type PromptVoteListRelationFilter = {
    every?: PromptVoteWhereInput
    some?: PromptVoteWhereInput
    none?: PromptVoteWhereInput
  }

  export type PromptDuplicateFlagListRelationFilter = {
    every?: PromptDuplicateFlagWhereInput
    some?: PromptDuplicateFlagWhereInput
    none?: PromptDuplicateFlagWhereInput
  }

  export type PromptTagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PromptVoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PromptDuplicateFlagOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PromptCountOrderByAggregateInput = {
    id?: SortOrder
    text?: SortOrder
    originalCategory?: SortOrder
    submittedBy?: SortOrder
    submittedByUsername?: SortOrder
    createdAt?: SortOrder
  }

  export type PromptMaxOrderByAggregateInput = {
    id?: SortOrder
    text?: SortOrder
    originalCategory?: SortOrder
    submittedBy?: SortOrder
    submittedByUsername?: SortOrder
    createdAt?: SortOrder
  }

  export type PromptMinOrderByAggregateInput = {
    id?: SortOrder
    text?: SortOrder
    originalCategory?: SortOrder
    submittedBy?: SortOrder
    submittedByUsername?: SortOrder
    createdAt?: SortOrder
  }

  export type PromptRelationFilter = {
    is?: PromptWhereInput
    isNot?: PromptWhereInput
  }

  export type PromptTagPromptIdTagCompoundUniqueInput = {
    promptId: string
    tag: string
  }

  export type PromptTagCountOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    tag?: SortOrder
  }

  export type PromptTagMaxOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    tag?: SortOrder
  }

  export type PromptTagMinOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    tag?: SortOrder
  }

  export type EnumVoteDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteDirection | EnumVoteDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteDirectionFilter<$PrismaModel> | $Enums.VoteDirection
  }

  export type PromptVotePromptIdDiscordUserIdCompoundUniqueInput = {
    promptId: string
    discordUserId: string
  }

  export type PromptVoteCountOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    discordUsername?: SortOrder
    vote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromptVoteMaxOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    discordUsername?: SortOrder
    vote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PromptVoteMinOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    discordUsername?: SortOrder
    vote?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumVoteDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteDirection | EnumVoteDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteDirectionWithAggregatesFilter<$PrismaModel> | $Enums.VoteDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVoteDirectionFilter<$PrismaModel>
    _max?: NestedEnumVoteDirectionFilter<$PrismaModel>
  }

  export type PromptDuplicateFlagPromptIdDiscordUserIdCompoundUniqueInput = {
    promptId: string
    discordUserId: string
  }

  export type PromptDuplicateFlagCountOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type PromptDuplicateFlagMaxOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type PromptDuplicateFlagMinOrderByAggregateInput = {
    id?: SortOrder
    promptId?: SortOrder
    discordUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type UserCreateNestedOneWithoutAccountsInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    connect?: UserWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutAccountsNestedInput = {
    create?: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAccountsInput
    upsert?: UserUpsertWithoutAccountsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAccountsInput, UserUpdateWithoutAccountsInput>, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type AccountCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type AccountUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
  }

  export type SessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type AccountUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type AccountUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput> | AccountCreateWithoutUserInput[] | AccountUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AccountCreateOrConnectWithoutUserInput | AccountCreateOrConnectWithoutUserInput[]
    upsert?: AccountUpsertWithWhereUniqueWithoutUserInput | AccountUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AccountCreateManyUserInputEnvelope
    set?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    disconnect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    delete?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    connect?: AccountWhereUniqueInput | AccountWhereUniqueInput[]
    update?: AccountUpdateWithWhereUniqueWithoutUserInput | AccountUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AccountUpdateManyWithWhereWithoutUserInput | AccountUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AccountScalarWhereInput | AccountScalarWhereInput[]
  }

  export type SessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput> | SessionCreateWithoutUserInput[] | SessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: SessionCreateOrConnectWithoutUserInput | SessionCreateOrConnectWithoutUserInput[]
    upsert?: SessionUpsertWithWhereUniqueWithoutUserInput | SessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: SessionCreateManyUserInputEnvelope
    set?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    disconnect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    delete?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    connect?: SessionWhereUniqueInput | SessionWhereUniqueInput[]
    update?: SessionUpdateWithWhereUniqueWithoutUserInput | SessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: SessionUpdateManyWithWhereWithoutUserInput | SessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: SessionScalarWhereInput | SessionScalarWhereInput[]
  }

  export type EnumTargetTypeFieldUpdateOperationsInput = {
    set?: $Enums.TargetType
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumAIGrantTypeFieldUpdateOperationsInput = {
    set?: $Enums.AIGrantType
  }

  export type PromptTagCreateNestedManyWithoutPromptInput = {
    create?: XOR<PromptTagCreateWithoutPromptInput, PromptTagUncheckedCreateWithoutPromptInput> | PromptTagCreateWithoutPromptInput[] | PromptTagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptTagCreateOrConnectWithoutPromptInput | PromptTagCreateOrConnectWithoutPromptInput[]
    createMany?: PromptTagCreateManyPromptInputEnvelope
    connect?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
  }

  export type PromptVoteCreateNestedManyWithoutPromptInput = {
    create?: XOR<PromptVoteCreateWithoutPromptInput, PromptVoteUncheckedCreateWithoutPromptInput> | PromptVoteCreateWithoutPromptInput[] | PromptVoteUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptVoteCreateOrConnectWithoutPromptInput | PromptVoteCreateOrConnectWithoutPromptInput[]
    createMany?: PromptVoteCreateManyPromptInputEnvelope
    connect?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
  }

  export type PromptDuplicateFlagCreateNestedManyWithoutPromptInput = {
    create?: XOR<PromptDuplicateFlagCreateWithoutPromptInput, PromptDuplicateFlagUncheckedCreateWithoutPromptInput> | PromptDuplicateFlagCreateWithoutPromptInput[] | PromptDuplicateFlagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptDuplicateFlagCreateOrConnectWithoutPromptInput | PromptDuplicateFlagCreateOrConnectWithoutPromptInput[]
    createMany?: PromptDuplicateFlagCreateManyPromptInputEnvelope
    connect?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
  }

  export type PromptTagUncheckedCreateNestedManyWithoutPromptInput = {
    create?: XOR<PromptTagCreateWithoutPromptInput, PromptTagUncheckedCreateWithoutPromptInput> | PromptTagCreateWithoutPromptInput[] | PromptTagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptTagCreateOrConnectWithoutPromptInput | PromptTagCreateOrConnectWithoutPromptInput[]
    createMany?: PromptTagCreateManyPromptInputEnvelope
    connect?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
  }

  export type PromptVoteUncheckedCreateNestedManyWithoutPromptInput = {
    create?: XOR<PromptVoteCreateWithoutPromptInput, PromptVoteUncheckedCreateWithoutPromptInput> | PromptVoteCreateWithoutPromptInput[] | PromptVoteUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptVoteCreateOrConnectWithoutPromptInput | PromptVoteCreateOrConnectWithoutPromptInput[]
    createMany?: PromptVoteCreateManyPromptInputEnvelope
    connect?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
  }

  export type PromptDuplicateFlagUncheckedCreateNestedManyWithoutPromptInput = {
    create?: XOR<PromptDuplicateFlagCreateWithoutPromptInput, PromptDuplicateFlagUncheckedCreateWithoutPromptInput> | PromptDuplicateFlagCreateWithoutPromptInput[] | PromptDuplicateFlagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptDuplicateFlagCreateOrConnectWithoutPromptInput | PromptDuplicateFlagCreateOrConnectWithoutPromptInput[]
    createMany?: PromptDuplicateFlagCreateManyPromptInputEnvelope
    connect?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
  }

  export type PromptTagUpdateManyWithoutPromptNestedInput = {
    create?: XOR<PromptTagCreateWithoutPromptInput, PromptTagUncheckedCreateWithoutPromptInput> | PromptTagCreateWithoutPromptInput[] | PromptTagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptTagCreateOrConnectWithoutPromptInput | PromptTagCreateOrConnectWithoutPromptInput[]
    upsert?: PromptTagUpsertWithWhereUniqueWithoutPromptInput | PromptTagUpsertWithWhereUniqueWithoutPromptInput[]
    createMany?: PromptTagCreateManyPromptInputEnvelope
    set?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    disconnect?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    delete?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    connect?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    update?: PromptTagUpdateWithWhereUniqueWithoutPromptInput | PromptTagUpdateWithWhereUniqueWithoutPromptInput[]
    updateMany?: PromptTagUpdateManyWithWhereWithoutPromptInput | PromptTagUpdateManyWithWhereWithoutPromptInput[]
    deleteMany?: PromptTagScalarWhereInput | PromptTagScalarWhereInput[]
  }

  export type PromptVoteUpdateManyWithoutPromptNestedInput = {
    create?: XOR<PromptVoteCreateWithoutPromptInput, PromptVoteUncheckedCreateWithoutPromptInput> | PromptVoteCreateWithoutPromptInput[] | PromptVoteUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptVoteCreateOrConnectWithoutPromptInput | PromptVoteCreateOrConnectWithoutPromptInput[]
    upsert?: PromptVoteUpsertWithWhereUniqueWithoutPromptInput | PromptVoteUpsertWithWhereUniqueWithoutPromptInput[]
    createMany?: PromptVoteCreateManyPromptInputEnvelope
    set?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    disconnect?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    delete?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    connect?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    update?: PromptVoteUpdateWithWhereUniqueWithoutPromptInput | PromptVoteUpdateWithWhereUniqueWithoutPromptInput[]
    updateMany?: PromptVoteUpdateManyWithWhereWithoutPromptInput | PromptVoteUpdateManyWithWhereWithoutPromptInput[]
    deleteMany?: PromptVoteScalarWhereInput | PromptVoteScalarWhereInput[]
  }

  export type PromptDuplicateFlagUpdateManyWithoutPromptNestedInput = {
    create?: XOR<PromptDuplicateFlagCreateWithoutPromptInput, PromptDuplicateFlagUncheckedCreateWithoutPromptInput> | PromptDuplicateFlagCreateWithoutPromptInput[] | PromptDuplicateFlagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptDuplicateFlagCreateOrConnectWithoutPromptInput | PromptDuplicateFlagCreateOrConnectWithoutPromptInput[]
    upsert?: PromptDuplicateFlagUpsertWithWhereUniqueWithoutPromptInput | PromptDuplicateFlagUpsertWithWhereUniqueWithoutPromptInput[]
    createMany?: PromptDuplicateFlagCreateManyPromptInputEnvelope
    set?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    disconnect?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    delete?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    connect?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    update?: PromptDuplicateFlagUpdateWithWhereUniqueWithoutPromptInput | PromptDuplicateFlagUpdateWithWhereUniqueWithoutPromptInput[]
    updateMany?: PromptDuplicateFlagUpdateManyWithWhereWithoutPromptInput | PromptDuplicateFlagUpdateManyWithWhereWithoutPromptInput[]
    deleteMany?: PromptDuplicateFlagScalarWhereInput | PromptDuplicateFlagScalarWhereInput[]
  }

  export type PromptTagUncheckedUpdateManyWithoutPromptNestedInput = {
    create?: XOR<PromptTagCreateWithoutPromptInput, PromptTagUncheckedCreateWithoutPromptInput> | PromptTagCreateWithoutPromptInput[] | PromptTagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptTagCreateOrConnectWithoutPromptInput | PromptTagCreateOrConnectWithoutPromptInput[]
    upsert?: PromptTagUpsertWithWhereUniqueWithoutPromptInput | PromptTagUpsertWithWhereUniqueWithoutPromptInput[]
    createMany?: PromptTagCreateManyPromptInputEnvelope
    set?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    disconnect?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    delete?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    connect?: PromptTagWhereUniqueInput | PromptTagWhereUniqueInput[]
    update?: PromptTagUpdateWithWhereUniqueWithoutPromptInput | PromptTagUpdateWithWhereUniqueWithoutPromptInput[]
    updateMany?: PromptTagUpdateManyWithWhereWithoutPromptInput | PromptTagUpdateManyWithWhereWithoutPromptInput[]
    deleteMany?: PromptTagScalarWhereInput | PromptTagScalarWhereInput[]
  }

  export type PromptVoteUncheckedUpdateManyWithoutPromptNestedInput = {
    create?: XOR<PromptVoteCreateWithoutPromptInput, PromptVoteUncheckedCreateWithoutPromptInput> | PromptVoteCreateWithoutPromptInput[] | PromptVoteUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptVoteCreateOrConnectWithoutPromptInput | PromptVoteCreateOrConnectWithoutPromptInput[]
    upsert?: PromptVoteUpsertWithWhereUniqueWithoutPromptInput | PromptVoteUpsertWithWhereUniqueWithoutPromptInput[]
    createMany?: PromptVoteCreateManyPromptInputEnvelope
    set?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    disconnect?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    delete?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    connect?: PromptVoteWhereUniqueInput | PromptVoteWhereUniqueInput[]
    update?: PromptVoteUpdateWithWhereUniqueWithoutPromptInput | PromptVoteUpdateWithWhereUniqueWithoutPromptInput[]
    updateMany?: PromptVoteUpdateManyWithWhereWithoutPromptInput | PromptVoteUpdateManyWithWhereWithoutPromptInput[]
    deleteMany?: PromptVoteScalarWhereInput | PromptVoteScalarWhereInput[]
  }

  export type PromptDuplicateFlagUncheckedUpdateManyWithoutPromptNestedInput = {
    create?: XOR<PromptDuplicateFlagCreateWithoutPromptInput, PromptDuplicateFlagUncheckedCreateWithoutPromptInput> | PromptDuplicateFlagCreateWithoutPromptInput[] | PromptDuplicateFlagUncheckedCreateWithoutPromptInput[]
    connectOrCreate?: PromptDuplicateFlagCreateOrConnectWithoutPromptInput | PromptDuplicateFlagCreateOrConnectWithoutPromptInput[]
    upsert?: PromptDuplicateFlagUpsertWithWhereUniqueWithoutPromptInput | PromptDuplicateFlagUpsertWithWhereUniqueWithoutPromptInput[]
    createMany?: PromptDuplicateFlagCreateManyPromptInputEnvelope
    set?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    disconnect?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    delete?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    connect?: PromptDuplicateFlagWhereUniqueInput | PromptDuplicateFlagWhereUniqueInput[]
    update?: PromptDuplicateFlagUpdateWithWhereUniqueWithoutPromptInput | PromptDuplicateFlagUpdateWithWhereUniqueWithoutPromptInput[]
    updateMany?: PromptDuplicateFlagUpdateManyWithWhereWithoutPromptInput | PromptDuplicateFlagUpdateManyWithWhereWithoutPromptInput[]
    deleteMany?: PromptDuplicateFlagScalarWhereInput | PromptDuplicateFlagScalarWhereInput[]
  }

  export type PromptCreateNestedOneWithoutTagsInput = {
    create?: XOR<PromptCreateWithoutTagsInput, PromptUncheckedCreateWithoutTagsInput>
    connectOrCreate?: PromptCreateOrConnectWithoutTagsInput
    connect?: PromptWhereUniqueInput
  }

  export type PromptUpdateOneRequiredWithoutTagsNestedInput = {
    create?: XOR<PromptCreateWithoutTagsInput, PromptUncheckedCreateWithoutTagsInput>
    connectOrCreate?: PromptCreateOrConnectWithoutTagsInput
    upsert?: PromptUpsertWithoutTagsInput
    connect?: PromptWhereUniqueInput
    update?: XOR<XOR<PromptUpdateToOneWithWhereWithoutTagsInput, PromptUpdateWithoutTagsInput>, PromptUncheckedUpdateWithoutTagsInput>
  }

  export type PromptCreateNestedOneWithoutVotesInput = {
    create?: XOR<PromptCreateWithoutVotesInput, PromptUncheckedCreateWithoutVotesInput>
    connectOrCreate?: PromptCreateOrConnectWithoutVotesInput
    connect?: PromptWhereUniqueInput
  }

  export type EnumVoteDirectionFieldUpdateOperationsInput = {
    set?: $Enums.VoteDirection
  }

  export type PromptUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<PromptCreateWithoutVotesInput, PromptUncheckedCreateWithoutVotesInput>
    connectOrCreate?: PromptCreateOrConnectWithoutVotesInput
    upsert?: PromptUpsertWithoutVotesInput
    connect?: PromptWhereUniqueInput
    update?: XOR<XOR<PromptUpdateToOneWithWhereWithoutVotesInput, PromptUpdateWithoutVotesInput>, PromptUncheckedUpdateWithoutVotesInput>
  }

  export type PromptCreateNestedOneWithoutDuplicateFlagsInput = {
    create?: XOR<PromptCreateWithoutDuplicateFlagsInput, PromptUncheckedCreateWithoutDuplicateFlagsInput>
    connectOrCreate?: PromptCreateOrConnectWithoutDuplicateFlagsInput
    connect?: PromptWhereUniqueInput
  }

  export type PromptUpdateOneRequiredWithoutDuplicateFlagsNestedInput = {
    create?: XOR<PromptCreateWithoutDuplicateFlagsInput, PromptUncheckedCreateWithoutDuplicateFlagsInput>
    connectOrCreate?: PromptCreateOrConnectWithoutDuplicateFlagsInput
    upsert?: PromptUpsertWithoutDuplicateFlagsInput
    connect?: PromptWhereUniqueInput
    update?: XOR<XOR<PromptUpdateToOneWithWhereWithoutDuplicateFlagsInput, PromptUpdateWithoutDuplicateFlagsInput>, PromptUncheckedUpdateWithoutDuplicateFlagsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumTargetTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TargetType | EnumTargetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTargetTypeFilter<$PrismaModel> | $Enums.TargetType
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTargetTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TargetType | EnumTargetTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TargetType[] | ListEnumTargetTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumTargetTypeWithAggregatesFilter<$PrismaModel> | $Enums.TargetType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTargetTypeFilter<$PrismaModel>
    _max?: NestedEnumTargetTypeFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumAIGrantTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AIGrantType | EnumAIGrantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAIGrantTypeFilter<$PrismaModel> | $Enums.AIGrantType
  }

  export type NestedEnumAIGrantTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AIGrantType | EnumAIGrantTypeFieldRefInput<$PrismaModel>
    in?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.AIGrantType[] | ListEnumAIGrantTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumAIGrantTypeWithAggregatesFilter<$PrismaModel> | $Enums.AIGrantType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAIGrantTypeFilter<$PrismaModel>
    _max?: NestedEnumAIGrantTypeFilter<$PrismaModel>
  }

  export type NestedEnumVoteDirectionFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteDirection | EnumVoteDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteDirectionFilter<$PrismaModel> | $Enums.VoteDirection
  }

  export type NestedEnumVoteDirectionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.VoteDirection | EnumVoteDirectionFieldRefInput<$PrismaModel>
    in?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    notIn?: $Enums.VoteDirection[] | ListEnumVoteDirectionFieldRefInput<$PrismaModel>
    not?: NestedEnumVoteDirectionWithAggregatesFilter<$PrismaModel> | $Enums.VoteDirection
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVoteDirectionFilter<$PrismaModel>
    _max?: NestedEnumVoteDirectionFilter<$PrismaModel>
  }

  export type UserCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    sessions?: SessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAccountsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    sessions?: SessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAccountsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
  }

  export type UserUpsertWithoutAccountsInput = {
    update: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
    create: XOR<UserCreateWithoutAccountsInput, UserUncheckedCreateWithoutAccountsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAccountsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAccountsInput, UserUncheckedUpdateWithoutAccountsInput>
  }

  export type UserUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAccountsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    sessions?: SessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    accounts?: AccountCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    name?: string | null
    email?: string | null
    emailVerified?: Date | string | null
    image?: string | null
    accounts?: AccountUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    emailVerified?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    accounts?: AccountUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AccountCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type AccountCreateOrConnectWithoutUserInput = {
    where: AccountWhereUniqueInput
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountCreateManyUserInputEnvelope = {
    data: AccountCreateManyUserInput | AccountCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type SessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type SessionCreateOrConnectWithoutUserInput = {
    where: SessionWhereUniqueInput
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionCreateManyUserInputEnvelope = {
    data: SessionCreateManyUserInput | SessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type AccountUpsertWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    update: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
    create: XOR<AccountCreateWithoutUserInput, AccountUncheckedCreateWithoutUserInput>
  }

  export type AccountUpdateWithWhereUniqueWithoutUserInput = {
    where: AccountWhereUniqueInput
    data: XOR<AccountUpdateWithoutUserInput, AccountUncheckedUpdateWithoutUserInput>
  }

  export type AccountUpdateManyWithWhereWithoutUserInput = {
    where: AccountScalarWhereInput
    data: XOR<AccountUpdateManyMutationInput, AccountUncheckedUpdateManyWithoutUserInput>
  }

  export type AccountScalarWhereInput = {
    AND?: AccountScalarWhereInput | AccountScalarWhereInput[]
    OR?: AccountScalarWhereInput[]
    NOT?: AccountScalarWhereInput | AccountScalarWhereInput[]
    id?: StringFilter<"Account"> | string
    userId?: StringFilter<"Account"> | string
    type?: StringFilter<"Account"> | string
    provider?: StringFilter<"Account"> | string
    providerAccountId?: StringFilter<"Account"> | string
    refresh_token?: StringNullableFilter<"Account"> | string | null
    access_token?: StringNullableFilter<"Account"> | string | null
    expires_at?: IntNullableFilter<"Account"> | number | null
    token_type?: StringNullableFilter<"Account"> | string | null
    scope?: StringNullableFilter<"Account"> | string | null
    id_token?: StringNullableFilter<"Account"> | string | null
    session_state?: StringNullableFilter<"Account"> | string | null
  }

  export type SessionUpsertWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    update: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
    create: XOR<SessionCreateWithoutUserInput, SessionUncheckedCreateWithoutUserInput>
  }

  export type SessionUpdateWithWhereUniqueWithoutUserInput = {
    where: SessionWhereUniqueInput
    data: XOR<SessionUpdateWithoutUserInput, SessionUncheckedUpdateWithoutUserInput>
  }

  export type SessionUpdateManyWithWhereWithoutUserInput = {
    where: SessionScalarWhereInput
    data: XOR<SessionUpdateManyMutationInput, SessionUncheckedUpdateManyWithoutUserInput>
  }

  export type SessionScalarWhereInput = {
    AND?: SessionScalarWhereInput | SessionScalarWhereInput[]
    OR?: SessionScalarWhereInput[]
    NOT?: SessionScalarWhereInput | SessionScalarWhereInput[]
    id?: StringFilter<"Session"> | string
    sessionToken?: StringFilter<"Session"> | string
    userId?: StringFilter<"Session"> | string
    expires?: DateTimeFilter<"Session"> | Date | string
  }

  export type PromptTagCreateWithoutPromptInput = {
    id?: string
    tag: string
  }

  export type PromptTagUncheckedCreateWithoutPromptInput = {
    id?: string
    tag: string
  }

  export type PromptTagCreateOrConnectWithoutPromptInput = {
    where: PromptTagWhereUniqueInput
    create: XOR<PromptTagCreateWithoutPromptInput, PromptTagUncheckedCreateWithoutPromptInput>
  }

  export type PromptTagCreateManyPromptInputEnvelope = {
    data: PromptTagCreateManyPromptInput | PromptTagCreateManyPromptInput[]
    skipDuplicates?: boolean
  }

  export type PromptVoteCreateWithoutPromptInput = {
    id?: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromptVoteUncheckedCreateWithoutPromptInput = {
    id?: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromptVoteCreateOrConnectWithoutPromptInput = {
    where: PromptVoteWhereUniqueInput
    create: XOR<PromptVoteCreateWithoutPromptInput, PromptVoteUncheckedCreateWithoutPromptInput>
  }

  export type PromptVoteCreateManyPromptInputEnvelope = {
    data: PromptVoteCreateManyPromptInput | PromptVoteCreateManyPromptInput[]
    skipDuplicates?: boolean
  }

  export type PromptDuplicateFlagCreateWithoutPromptInput = {
    id?: string
    discordUserId: string
    createdAt?: Date | string
  }

  export type PromptDuplicateFlagUncheckedCreateWithoutPromptInput = {
    id?: string
    discordUserId: string
    createdAt?: Date | string
  }

  export type PromptDuplicateFlagCreateOrConnectWithoutPromptInput = {
    where: PromptDuplicateFlagWhereUniqueInput
    create: XOR<PromptDuplicateFlagCreateWithoutPromptInput, PromptDuplicateFlagUncheckedCreateWithoutPromptInput>
  }

  export type PromptDuplicateFlagCreateManyPromptInputEnvelope = {
    data: PromptDuplicateFlagCreateManyPromptInput | PromptDuplicateFlagCreateManyPromptInput[]
    skipDuplicates?: boolean
  }

  export type PromptTagUpsertWithWhereUniqueWithoutPromptInput = {
    where: PromptTagWhereUniqueInput
    update: XOR<PromptTagUpdateWithoutPromptInput, PromptTagUncheckedUpdateWithoutPromptInput>
    create: XOR<PromptTagCreateWithoutPromptInput, PromptTagUncheckedCreateWithoutPromptInput>
  }

  export type PromptTagUpdateWithWhereUniqueWithoutPromptInput = {
    where: PromptTagWhereUniqueInput
    data: XOR<PromptTagUpdateWithoutPromptInput, PromptTagUncheckedUpdateWithoutPromptInput>
  }

  export type PromptTagUpdateManyWithWhereWithoutPromptInput = {
    where: PromptTagScalarWhereInput
    data: XOR<PromptTagUpdateManyMutationInput, PromptTagUncheckedUpdateManyWithoutPromptInput>
  }

  export type PromptTagScalarWhereInput = {
    AND?: PromptTagScalarWhereInput | PromptTagScalarWhereInput[]
    OR?: PromptTagScalarWhereInput[]
    NOT?: PromptTagScalarWhereInput | PromptTagScalarWhereInput[]
    id?: StringFilter<"PromptTag"> | string
    promptId?: StringFilter<"PromptTag"> | string
    tag?: StringFilter<"PromptTag"> | string
  }

  export type PromptVoteUpsertWithWhereUniqueWithoutPromptInput = {
    where: PromptVoteWhereUniqueInput
    update: XOR<PromptVoteUpdateWithoutPromptInput, PromptVoteUncheckedUpdateWithoutPromptInput>
    create: XOR<PromptVoteCreateWithoutPromptInput, PromptVoteUncheckedCreateWithoutPromptInput>
  }

  export type PromptVoteUpdateWithWhereUniqueWithoutPromptInput = {
    where: PromptVoteWhereUniqueInput
    data: XOR<PromptVoteUpdateWithoutPromptInput, PromptVoteUncheckedUpdateWithoutPromptInput>
  }

  export type PromptVoteUpdateManyWithWhereWithoutPromptInput = {
    where: PromptVoteScalarWhereInput
    data: XOR<PromptVoteUpdateManyMutationInput, PromptVoteUncheckedUpdateManyWithoutPromptInput>
  }

  export type PromptVoteScalarWhereInput = {
    AND?: PromptVoteScalarWhereInput | PromptVoteScalarWhereInput[]
    OR?: PromptVoteScalarWhereInput[]
    NOT?: PromptVoteScalarWhereInput | PromptVoteScalarWhereInput[]
    id?: StringFilter<"PromptVote"> | string
    promptId?: StringFilter<"PromptVote"> | string
    discordUserId?: StringFilter<"PromptVote"> | string
    discordUsername?: StringFilter<"PromptVote"> | string
    vote?: EnumVoteDirectionFilter<"PromptVote"> | $Enums.VoteDirection
    createdAt?: DateTimeFilter<"PromptVote"> | Date | string
    updatedAt?: DateTimeFilter<"PromptVote"> | Date | string
  }

  export type PromptDuplicateFlagUpsertWithWhereUniqueWithoutPromptInput = {
    where: PromptDuplicateFlagWhereUniqueInput
    update: XOR<PromptDuplicateFlagUpdateWithoutPromptInput, PromptDuplicateFlagUncheckedUpdateWithoutPromptInput>
    create: XOR<PromptDuplicateFlagCreateWithoutPromptInput, PromptDuplicateFlagUncheckedCreateWithoutPromptInput>
  }

  export type PromptDuplicateFlagUpdateWithWhereUniqueWithoutPromptInput = {
    where: PromptDuplicateFlagWhereUniqueInput
    data: XOR<PromptDuplicateFlagUpdateWithoutPromptInput, PromptDuplicateFlagUncheckedUpdateWithoutPromptInput>
  }

  export type PromptDuplicateFlagUpdateManyWithWhereWithoutPromptInput = {
    where: PromptDuplicateFlagScalarWhereInput
    data: XOR<PromptDuplicateFlagUpdateManyMutationInput, PromptDuplicateFlagUncheckedUpdateManyWithoutPromptInput>
  }

  export type PromptDuplicateFlagScalarWhereInput = {
    AND?: PromptDuplicateFlagScalarWhereInput | PromptDuplicateFlagScalarWhereInput[]
    OR?: PromptDuplicateFlagScalarWhereInput[]
    NOT?: PromptDuplicateFlagScalarWhereInput | PromptDuplicateFlagScalarWhereInput[]
    id?: StringFilter<"PromptDuplicateFlag"> | string
    promptId?: StringFilter<"PromptDuplicateFlag"> | string
    discordUserId?: StringFilter<"PromptDuplicateFlag"> | string
    createdAt?: DateTimeFilter<"PromptDuplicateFlag"> | Date | string
  }

  export type PromptCreateWithoutTagsInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    votes?: PromptVoteCreateNestedManyWithoutPromptInput
    duplicateFlags?: PromptDuplicateFlagCreateNestedManyWithoutPromptInput
  }

  export type PromptUncheckedCreateWithoutTagsInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    votes?: PromptVoteUncheckedCreateNestedManyWithoutPromptInput
    duplicateFlags?: PromptDuplicateFlagUncheckedCreateNestedManyWithoutPromptInput
  }

  export type PromptCreateOrConnectWithoutTagsInput = {
    where: PromptWhereUniqueInput
    create: XOR<PromptCreateWithoutTagsInput, PromptUncheckedCreateWithoutTagsInput>
  }

  export type PromptUpsertWithoutTagsInput = {
    update: XOR<PromptUpdateWithoutTagsInput, PromptUncheckedUpdateWithoutTagsInput>
    create: XOR<PromptCreateWithoutTagsInput, PromptUncheckedCreateWithoutTagsInput>
    where?: PromptWhereInput
  }

  export type PromptUpdateToOneWithWhereWithoutTagsInput = {
    where?: PromptWhereInput
    data: XOR<PromptUpdateWithoutTagsInput, PromptUncheckedUpdateWithoutTagsInput>
  }

  export type PromptUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: PromptVoteUpdateManyWithoutPromptNestedInput
    duplicateFlags?: PromptDuplicateFlagUpdateManyWithoutPromptNestedInput
  }

  export type PromptUncheckedUpdateWithoutTagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: PromptVoteUncheckedUpdateManyWithoutPromptNestedInput
    duplicateFlags?: PromptDuplicateFlagUncheckedUpdateManyWithoutPromptNestedInput
  }

  export type PromptCreateWithoutVotesInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    tags?: PromptTagCreateNestedManyWithoutPromptInput
    duplicateFlags?: PromptDuplicateFlagCreateNestedManyWithoutPromptInput
  }

  export type PromptUncheckedCreateWithoutVotesInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    tags?: PromptTagUncheckedCreateNestedManyWithoutPromptInput
    duplicateFlags?: PromptDuplicateFlagUncheckedCreateNestedManyWithoutPromptInput
  }

  export type PromptCreateOrConnectWithoutVotesInput = {
    where: PromptWhereUniqueInput
    create: XOR<PromptCreateWithoutVotesInput, PromptUncheckedCreateWithoutVotesInput>
  }

  export type PromptUpsertWithoutVotesInput = {
    update: XOR<PromptUpdateWithoutVotesInput, PromptUncheckedUpdateWithoutVotesInput>
    create: XOR<PromptCreateWithoutVotesInput, PromptUncheckedCreateWithoutVotesInput>
    where?: PromptWhereInput
  }

  export type PromptUpdateToOneWithWhereWithoutVotesInput = {
    where?: PromptWhereInput
    data: XOR<PromptUpdateWithoutVotesInput, PromptUncheckedUpdateWithoutVotesInput>
  }

  export type PromptUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: PromptTagUpdateManyWithoutPromptNestedInput
    duplicateFlags?: PromptDuplicateFlagUpdateManyWithoutPromptNestedInput
  }

  export type PromptUncheckedUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: PromptTagUncheckedUpdateManyWithoutPromptNestedInput
    duplicateFlags?: PromptDuplicateFlagUncheckedUpdateManyWithoutPromptNestedInput
  }

  export type PromptCreateWithoutDuplicateFlagsInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    tags?: PromptTagCreateNestedManyWithoutPromptInput
    votes?: PromptVoteCreateNestedManyWithoutPromptInput
  }

  export type PromptUncheckedCreateWithoutDuplicateFlagsInput = {
    id?: string
    text: string
    originalCategory: string
    submittedBy?: string | null
    submittedByUsername?: string | null
    createdAt?: Date | string
    tags?: PromptTagUncheckedCreateNestedManyWithoutPromptInput
    votes?: PromptVoteUncheckedCreateNestedManyWithoutPromptInput
  }

  export type PromptCreateOrConnectWithoutDuplicateFlagsInput = {
    where: PromptWhereUniqueInput
    create: XOR<PromptCreateWithoutDuplicateFlagsInput, PromptUncheckedCreateWithoutDuplicateFlagsInput>
  }

  export type PromptUpsertWithoutDuplicateFlagsInput = {
    update: XOR<PromptUpdateWithoutDuplicateFlagsInput, PromptUncheckedUpdateWithoutDuplicateFlagsInput>
    create: XOR<PromptCreateWithoutDuplicateFlagsInput, PromptUncheckedCreateWithoutDuplicateFlagsInput>
    where?: PromptWhereInput
  }

  export type PromptUpdateToOneWithWhereWithoutDuplicateFlagsInput = {
    where?: PromptWhereInput
    data: XOR<PromptUpdateWithoutDuplicateFlagsInput, PromptUncheckedUpdateWithoutDuplicateFlagsInput>
  }

  export type PromptUpdateWithoutDuplicateFlagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: PromptTagUpdateManyWithoutPromptNestedInput
    votes?: PromptVoteUpdateManyWithoutPromptNestedInput
  }

  export type PromptUncheckedUpdateWithoutDuplicateFlagsInput = {
    id?: StringFieldUpdateOperationsInput | string
    text?: StringFieldUpdateOperationsInput | string
    originalCategory?: StringFieldUpdateOperationsInput | string
    submittedBy?: NullableStringFieldUpdateOperationsInput | string | null
    submittedByUsername?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tags?: PromptTagUncheckedUpdateManyWithoutPromptNestedInput
    votes?: PromptVoteUncheckedUpdateManyWithoutPromptNestedInput
  }

  export type AccountCreateManyUserInput = {
    id?: string
    type: string
    provider: string
    providerAccountId: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
  }

  export type SessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    expires: Date | string
  }

  export type AccountUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AccountUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    provider?: StringFieldUpdateOperationsInput | string
    providerAccountId?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    expires_at?: NullableIntFieldUpdateOperationsInput | number | null
    token_type?: NullableStringFieldUpdateOperationsInput | string | null
    scope?: NullableStringFieldUpdateOperationsInput | string | null
    id_token?: NullableStringFieldUpdateOperationsInput | string | null
    session_state?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type SessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    expires?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptTagCreateManyPromptInput = {
    id?: string
    tag: string
  }

  export type PromptVoteCreateManyPromptInput = {
    id?: string
    discordUserId: string
    discordUsername: string
    vote: $Enums.VoteDirection
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PromptDuplicateFlagCreateManyPromptInput = {
    id?: string
    discordUserId: string
    createdAt?: Date | string
  }

  export type PromptTagUpdateWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
  }

  export type PromptTagUncheckedUpdateWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
  }

  export type PromptTagUncheckedUpdateManyWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    tag?: StringFieldUpdateOperationsInput | string
  }

  export type PromptVoteUpdateWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptVoteUncheckedUpdateWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptVoteUncheckedUpdateManyWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    discordUsername?: StringFieldUpdateOperationsInput | string
    vote?: EnumVoteDirectionFieldUpdateOperationsInput | $Enums.VoteDirection
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptDuplicateFlagUpdateWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptDuplicateFlagUncheckedUpdateWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromptDuplicateFlagUncheckedUpdateManyWithoutPromptInput = {
    id?: StringFieldUpdateOperationsInput | string
    discordUserId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromptCountOutputTypeDefaultArgs instead
     */
    export type PromptCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromptCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AccountDefaultArgs instead
     */
    export type AccountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AccountDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SessionDefaultArgs instead
     */
    export type SessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use VerificationTokenDefaultArgs instead
     */
    export type VerificationTokenArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = VerificationTokenDefaultArgs<ExtArgs>
    /**
     * @deprecated Use FeatureConfigDefaultArgs instead
     */
    export type FeatureConfigArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = FeatureConfigDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ConfigAuditLogDefaultArgs instead
     */
    export type ConfigAuditLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ConfigAuditLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserUsageMetricDefaultArgs instead
     */
    export type UserUsageMetricArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserUsageMetricDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiscussionScheduleDefaultArgs instead
     */
    export type DiscussionScheduleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiscussionScheduleDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AIAccessGrantDefaultArgs instead
     */
    export type AIAccessGrantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AIAccessGrantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DiscussionPromptLogDefaultArgs instead
     */
    export type DiscussionPromptLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DiscussionPromptLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromptDefaultArgs instead
     */
    export type PromptArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromptDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromptTagDefaultArgs instead
     */
    export type PromptTagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromptTagDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromptVoteDefaultArgs instead
     */
    export type PromptVoteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromptVoteDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PromptDuplicateFlagDefaultArgs instead
     */
    export type PromptDuplicateFlagArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PromptDuplicateFlagDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}