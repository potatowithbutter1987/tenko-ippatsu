# アーキテクチャ

## ディレクトリ構成

```
tenko-ippatsu/
├── app/                           Next.js App Router
│   ├── admin/                     管理者向け（/admin/*）
│   ├── driver/                    ドライバー向け（/driver/*、LIFF経由必須）
│   ├── api/                       Route Handlers
│   ├── layout.tsx                 ルートレイアウト
│   └── page.tsx
├── components/
│   ├── ui/                        プリミティブ UI（TextInput, DatePicker, Checkbox, ...）
│   └── layout/                    アプリ共通レイアウト（AppHeader, ViewportSwitcher）
├── features/                      ドメイン別モジュール
│   └── {domain}/
│       ├── types.ts               ドメイン型
│       ├── server/                server-only
│       │   ├── repository.ts      DB アクセス
│       │   └── service.ts         ユースケース
│       ├── api/                   クライアント呼び出し
│       │   └── client.ts
│       ├── components/            ドメイン固有 UI（任意）
│       └── hooks/                 ドメイン固有 Hooks（任意）
├── db/
│   ├── schema.ts                  Drizzle スキーマ
│   └── index.ts                   接続
├── drizzle/                       マイグレーション
└── lib/                           横断ユーティリティ
    ├── api-client.ts              apiFetch
    ├── date.ts
    ├── errors.ts                  AppError / HttpError
    └── logger.ts
```

## レイヤー責務

### `app/`（Next.js）

- ルーティング、ページレンダリング、レイアウトのみ
- ページ固有のクライアントコンポーネントは同一ディレクトリに同居（例: `app/driver/register/RegisterForm.tsx`）
- `page.tsx` は原則 **Server Component**。インタラクションがある場合のみ、フォーム単位で `"use client"` を切り出す

### `app/api/`（Route Handlers）

- リクエストパース → `features/{domain}/server/service.ts` 呼び出し → レスポンス整形 のみを行う
- ビジネスロジックを Route Handler に書かない

### `features/{domain}/server/`

- **`import "server-only";` を最上行に必ず置く**
- `service.ts` がユースケース層、`repository.ts` が DB アクセス層
- 依存方向: API ルート → service → repository → db

### `features/{domain}/api/`

- クライアント／サーバ両方から呼べる API ラッパー
- `lib/api-client.ts` の `apiFetch` を使い、戻り値型は `features/{domain}/types.ts` に揃える

### `features/{domain}/components/`

- ドメイン知識を持つ UI（例: ドライバー一覧テーブル）
- `components/ui/` のプリミティブを組み合わせる

### `db/`

- Drizzle スキーマ定義と接続のみ
- 直接 import するのは `features/{domain}/server/repository.ts` のみ。ページや Route Handler から `db` を直接呼ばない

### `lib/`

- ドメイン非依存のユーティリティのみ。ドメイン処理は `features/` に置く

## データフロー（クライアント → DB）

```
[Client Component]
   ↓ features/{domain}/api/client.ts → lib/api-client.ts (apiFetch)
[app/api/{domain}/route.ts]
   ↓ features/{domain}/server/service.ts
   ↓ features/{domain}/server/repository.ts
[db/schema.ts]（Drizzle）
```

各境界をスキップしないこと。例えば `service` を経由せず Route Handler から直接 `repository` を呼ぶのは禁止（横展開で重複が発生する）。

## Server / Client 境界

- **Server-only モジュール** は `import "server-only";` を必ず先頭に置く（誤って Client から import するとビルドエラーで気づける）
- **Client Component** は `"use client"` を最上行に
- DB / 認証情報 / シークレットを扱うモジュールはサーバ側（`features/{domain}/server/` 配下）に閉じ込める
- ユーザ入力検証は **クライアント／サーバ両方** で実装する（フロントは UX、サーバは信頼境界）

## エラー設計

- ドメインエラーは `lib/errors.ts` の `AppError` / `HttpError` を継承
- `apiFetch` は `!res.ok` で `HttpError` をスロー
- Route Handler では `AppError` をステータスコードに変換して返す
- クライアントは `try/catch` で `HttpError` を捕捉し、UI に反映

## URL 構造とロール別ガード

- `/admin/*` — 管理者画面（M-XXX）
  - `/admin/login` のみ未認証でアクセス可
  - それ以外は管理者セッション + LINE 認証を要求
- `/driver/*` — ドライバー画面（D-XXX）
  - 全ページ LIFF（LINE Front-end Framework）経由のアクセスを要求
- ロール別アクセス制御は `proxy.ts`（Next.js 16 で `middleware.ts` から rename）で行う

## ID と日時

- 主キーは UUID（`uuid("id").primaryKey().defaultRandom()`）
- タイムスタンプは `timestamp({ withTimezone: true })`、日付は `date(...)` を使い分ける
- 日付の JST 変換は `lib/date.ts` の `toJstDateString` を使う
