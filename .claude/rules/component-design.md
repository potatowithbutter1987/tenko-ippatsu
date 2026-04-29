# コンポーネント設計

## 4 層分離

| 層                           | 配置                                 | 責務                                                                |
| ---------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| **プリミティブ UI**          | `components/ui/*.tsx`                | 汎用入力・ボタン・モーダル等。ドメイン知識を持たない                |
| **レイアウト**               | `components/layout/*.tsx`            | アプリ共通のヘッダー・ナビ・ビューポート制御                        |
| **ドメインコンポーネント**   | `features/{domain}/components/*.tsx` | ドメイン知識を含む UI（例: ドライバー一覧テーブル）                 |
| **ページオーケストレーター** | `app/{route}/{Name}.tsx`             | ページ単位で状態と送信処理を保持。原則「`"use client"` なフォーム」 |

## プリミティブ UI のルール

### Props 設計

- ラップする HTML 要素の属性をスプレッドで透過させる
  - 例: `TextInput` は `React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }`
  - 親が `onBlur`、`maxLength`、`autoComplete` などを直接渡せる
- 独自プロパティは命名衝突に注意する（`error`、`label` 等は許容、`type` は HTML 属性と整合）
- `className` を受け取り、内部 className に追記する形で結合する（上書きはしない）

```tsx
// OK: 内部 className を保ったまま追記
<input className={`...内部クラス... ${className ?? ""}`} />
```

### 振る舞い

- 内部状態を持つ場合は controlled / uncontrolled の両対応を検討する（`SelectInput` 参照）
- ドメイン値（電話番号フィルタ、日付フォーマット等）に踏み込む場合は **type で判別して分岐する**（`TextInput` の `type === "tel"` フィルタ参照）
- ビジネスバリデーションはここで行わない（プリミティブの責務外）。エラー表示は `error: boolean` を受け取って色だけ切り替える

### スタイル

- Tailwind ベース、`design-system.md` のカラー・サイズに従う
- 高さは HUG（`padding + content`）。`h-[45px]` のようなハードコードは禁止
- エラー状態は `border` 切り替えのみ。メッセージ表示は親 `FormField` 側で行う

## クリック可能要素の hover / cursor 規約

`<button>` または `role="button"` を持つ要素は、押せることが視覚的に伝わるよう **すべて** 以下を満たす:

1. `cursor-pointer` を付与してマウスカーソルを手のマークに
2. `transition-colors` で色変化をなめらかに
3. `hover:bg-[...]` で背景色を**わずかに**変える
4. `disabled` 状態では `cursor-not-allowed` に切り替え、hover を効かせない（`enabled:hover:bg-[...]` を使う）

### hover 色の選び方

| 通常時の背景            | hover 時の背景             |
| ----------------------- | -------------------------- |
| `#9fe870`（Wise Green） | `#8edc5e`（少し濃い緑）    |
| `#e2f6d5`（Light Mint） | `#d4ebc6`（少し濃い mint） |
| `#ffffff`（白）         | `#f7f7f5`（Surface）       |

design-system.md にないトーンを新規に作らない。上記マッピングで揃える。

### 例

```tsx
// PrimaryButton（disabled あり）
className =
  "bg-[#9fe870] cursor-pointer transition-colors enabled:hover:bg-[#8edc5e] disabled:bg-[#e8ebe6] disabled:cursor-not-allowed";

// SelectInput / DatePicker のトリガ（白カード）
className = "bg-white hover:bg-[#f7f7f5] cursor-pointer transition-colors";

// SegmentedToggle / InspectionItem の active セグメント
className = "bg-[#9fe870] hover:bg-[#8edc5e] cursor-pointer transition-colors";

// CheckCard（チェック済み）
className = "bg-[#e2f6d5] hover:bg-[#d4ebc6] cursor-pointer transition-colors";
```

### アンチパターン

- ネイティブ `<button>` のデフォルトカーソルに任せる（ブラウザ差異あり、`cursor-pointer` を明示する）
- hover を付けない（押せるのか不安になる）
- `transition-colors` を省略してパッと色が変わる（ジャンプ感が出る）
- `disabled` 時にも hover が効く（押せないのに反応するように見える）

## ドメインコンポーネントのルール

- プリミティブ UI と組み合わせて、ドメイン語彙の API を提供する
- API 呼び出しを直接行ってよい（`features/{domain}/api/client.ts` 経由）
- ページ間で再利用される UI はここに置く

## ページオーケストレーター（`app/.../*.tsx`）

- 同一 route 配下に同居させる（例: `app/(driver)/register/RegisterForm.tsx`）
- フォーム送信、ページ全体の state、副作用を保持
- ファイル名は内容を表す PascalCase（`RegisterForm`、`DriverEditModal` 等）
- 対応する `page.tsx` は原則 Server Component で、これらをマウントするだけにする

## 命名

- プリミティブ UI: 役割を表す単語（`TextInput`、`DatePicker`、`PrimaryButton`）
- ドメインコンポーネント: ドメイン名 + 役割（`DriverList`、`TenkoStartForm`）
- props は呼び出し側で意味が読み取れる名前にする（→ ワークスペース `naming.md`）

## 切り出しの判断基準

新しい UI を書くとき:

1. 既存の `components/ui/*` で表現できないか？ → できれば再利用
2. ドメイン知識を含むか？ → Yes なら `features/{domain}/components/`
3. そのページでしか使わない複合 UI か？ → ページ同居の `app/.../Name.tsx`
4. 純粋な見た目部品で他画面でも使いそうか？ → `components/ui/`

## 既存プリミティブの一覧

| コンポーネント  | 役割                                                                           |
| --------------- | ------------------------------------------------------------------------------ |
| `TextInput`     | テキスト系入力。`type="tel"` で全角→半角フィルタ自動適用                       |
| `DatePicker`    | カレンダー選択。値は `YYYY-MM-DD`、表示は `YYYY/MM/DD`                         |
| `SelectInput`   | プルダウン。controlled / uncontrolled 両対応、options 不在時はトリガボタン代用 |
| `Checkbox`      | チェックボックス。children に同意文等のリッチテキストを置ける                  |
| `FormField`     | ラベル + 子入力 + エラーメッセージのラッパー。`required` で `*` 付与           |
| `PrimaryButton` | プライマリ用 Pill ボタン。`disabled` で muted 表示                             |

## アンチパターン

- プリミティブ UI に API 呼び出し（`fetch`、`useSWR` 等）を入れる
- プリミティブ UI が `Errors` 型のような呼び出し側の都合に依存する
- ページコンポーネント（`page.tsx`）に `"use client"` を付けてしまう（インタラクション部分だけ切り出す）
- 同一ファイル内に複数のページオーケストレーターを詰め込む
- `components/ui/*` から `features/*` を import する（依存方向の逆転）
