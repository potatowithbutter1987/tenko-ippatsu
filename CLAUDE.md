@AGENTS.md

# 点呼一発 — リポジトリ固有ルール

ワークスペース全体のルール（コーディングスタイル・命名・型設計・コメント・セキュリティ・デザインシステム）は `../../CLAUDE.md` および `../../.claude/rules/*.md` を参照する。

本リポジトリ固有のルールは `.claude/rules/*.md` に集約している。コード生成・レビュー・修正時は該当ルールを必ず読み取り、遵守すること。

## 本リポジトリのルール

- `.claude/rules/architecture.md` — Next.js App Router 構成、`features/` 分割、server/client 境界、データフロー
- `.claude/rules/component-design.md` — `components/ui` / `components/layout` / `features/*/components` / `app/.../Form` の責務分離
- `.claude/rules/validation.md` — フォームバリデーションのトリガ・送信ボタン活性制御・サーバ検証

## 技術スタック

- Next.js 16（App Router）/ React 19
- TypeScript 5（strict）
- Tailwind CSS 4
- Drizzle ORM + Neon (PostgreSQL)
- 日付: `date-fns`、カレンダー UI: `react-day-picker`

## 主要なディレクトリ

- `app/` — Next.js ルート。`(admin)` `(driver)` のルートグループでロール分割
- `components/ui/` — プリミティブ UI（`TextInput`、`DatePicker`、`Checkbox`、`PrimaryButton` 等）
- `components/layout/` — アプリ共通レイアウト（`AppHeader`、`ViewportSwitcher`）
- `features/{domain}/` — ドメインごとに `types.ts` / `server/` / `api/` / `components/` / `hooks/` を内包
- `db/` — Drizzle スキーマと接続
- `lib/` — 横断ユーティリティ（API クライアント、ロガー、エラー、日付）

## 開発時に必ず守る要点

- 新しい UI を作るときは **まず `components/ui/*` を見て再利用できないか確認**
- DB アクセスは `features/{domain}/server/repository.ts` に閉じ込める。pages や API ルートから直接 `db` を import しない
- サーバ専用モジュールは `import "server-only";` を最上行に置く
- フォームバリデーションは `app/(driver)/register/RegisterForm.tsx` の `validateField` パターンに従う
- DB スキーマと UI の制約（`maxLength` 等）は揃える（例: `phoneNumber: varchar(15)` ↔ `<TextInput maxLength={15} />`）
- `page.tsx` は原則 Server Component。インタラクションがある場合のみ、フォーム単位で `"use client"` を切り出す

## 参照実装

- フォーム + バリデーション + DatePicker + 活性制御: `app/(driver)/register/RegisterForm.tsx`
- features レイヤ（types / server / api）: `features/driver/`
- API ルート: `app/api/drivers/route.ts`
