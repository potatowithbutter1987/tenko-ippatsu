# フォームバリデーション

参照実装: `app/(driver)/register/RegisterForm.tsx`

## 設計原則

1. **検証ロジックはモジュールスコープの純粋関数に置く**（コンポーネント外）
2. **トリガはフィールド種別で使い分ける**:
   - テキスト入力 → `onBlur`（任意）
   - 選択 UI（`DatePicker`、`Checkbox` 等） → `onChange`（任意）
   - 送信時 → 全フィールド一括（**必須**）
3. **送信ボタンは常時活性化**する。`disabled` で未入力時に押せなくしない
   - 理由: disabled だと「何を埋めれば送信できるか」が分からず、ユーザーが詰む
   - submit クリック → `validateForm` → エラーを各フィールドに表示、で十分なフィードバックになる
4. エラー文言は宣言的に一元管理する

## 実装パターン

### 1. フィールド定義（モジュールレベル）

```ts
const REQUIRED_FIELD_KEYS = [
  "name",
  "company",
  "vehicle",
  "birthDate",
  "phone",
  "email",
] as const;
type RequiredFieldKey = (typeof REQUIRED_FIELD_KEYS)[number];

const FIELD_LABELS: Record<RequiredFieldKey, string> = {
  name: "氏名",
  company: "所属会社",
  vehicle: "車両番号",
  birthDate: "生年月日",
  phone: "電話番号",
  email: "メールアドレス",
};

const requiredMessage = (label: string): string => `${label}を入力してください`;

const validateField = (key: RequiredFieldKey, value: string): string | null => {
  if (value === "") return requiredMessage(FIELD_LABELS[key]);
  if (key === "email" && !EMAIL_PATTERN.test(value)) {
    return "正しいメールアドレスを入力してください";
  }
  return null;
};
```

- フィールド追加時は `REQUIRED_FIELD_KEYS` と `FIELD_LABELS` の両方に追記する
- フォーマット検証は `validateField` 内で `key === ...` で分岐する
- ブール系（同意チェック等）は別関数に分ける（`validateConsent(checked)`）

### 2. エラー更新ヘルパー（コンポーネント内）

```ts
const updateFieldError = (key: RequiredFieldKey, value: string) => {
  setErrors((prev) => {
    const error = validateField(key, value);
    const next = { ...prev };
    if (error === null) {
      delete next[key];
    } else {
      next[key] = error;
    }
    return next;
  });
};
```

### 3. トリガ配線

| 入力 UI      | トリガ     | 例                                                         |
| ------------ | ---------- | ---------------------------------------------------------- |
| `TextInput`  | `onBlur`   | `onBlur={() => updateFieldError("name", name)}`            |
| `DatePicker` | `onChange` | onChange 内で `setValue` + `updateFieldError(key, value)`  |
| `Checkbox`   | `onChange` | onChange 内で `setChecked` + `updateConsentError(checked)` |

選択 UI は値が変わる瞬間が「ユーザーの確定操作」なので、blur ではなく change で検証する。

### 4. 送信ボタン

```tsx
<PrimaryButton type="submit">登録する</PrimaryButton>
```

- `disabled` を付けない。常に押せる
- 押すと `handleSubmit` が走り、`validateForm` で全フィールドを検証
- 未入力フィールドはエラー表示（赤ボーダー + メッセージ）に切り替わるので、ユーザーは何を埋めるべきか即座に把握できる

### 5. 送信時のバリデーション

```ts
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const nextErrors = validateForm(formState);

  if (Object.keys(nextErrors).length > 0) {
    setErrors(nextErrors);
    return;
  }

  setErrors({});
  // 送信処理
};
```

`validateForm` はフィールドごとの validator を集約する純粋関数:

```ts
const VALIDATORS: ReadonlyArray<{
  key: keyof Errors;
  validate: (s: FormState) => string | null;
}> = [
  { key: "inspector", validate: validateInspector },
  { key: "method", validate: validateMethod },
  // ...
];

const validateForm = (s: FormState): Errors =>
  VALIDATORS.reduce<Errors>((acc, { key, validate }) => {
    const error = validate(s);
    return error === null ? acc : { ...acc, [key]: error };
  }, {});
```

**フィールドが多いフォーム**ではこのデータ駆動パターン（`VALIDATORS` 配列 + reduce）を推奨。複雑度（cyclomatic complexity）も抑えられる。

## DB スキーマとの整合

- `db/schema.ts` の長さ制約と入力側の `maxLength` を揃える
  - 例: `phoneNumber: varchar("phone_number", { length: 15 })` ↔ `<TextInput maxLength={15} />`
- `varchar(N)` を変更したら、対応する入力フィールドの `maxLength` を必ず連動させる
- `date` 型は `YYYY-MM-DD` 文字列で扱う（`DatePicker` の `value` フォーマットと一致）

## サーバ側検証

- フロント検証は **UX のため**。**信頼境界はサーバ**
- Route Handler では受け取った値を必ず再検証してから `service` に渡す
- 同じバリデーション関数（`validateField` 等）をサーバから import して使うのが望ましい
- DB の制約違反（一意制約等）は `repository` 層で `AppError` に変換する

## アンチパターン

- **送信ボタンを未入力時に `disabled` にする**
  → 何を埋めれば押せるようになるか分からずユーザーが詰む。常に活性化し、submit 時にエラーを表示すること
- フィールドごとにバラバラのバリデーション関数を書く（`validateName`, `validateEmail`, ...）
  → 小さなフォームなら `validateField(key, value)` に集約。フィールドが多いフォームは `VALIDATORS` 配列 + reduce
- onChange のたびにテキスト入力を検証する（うるさいフィードバック）
  → blur で一度、必要に応じてエラー時のみ change で再評価する
- 送信時のみ検証してエラー一括表示しつつ、何も他のフィードバックがない
  → 大きなフォームなら submit 時の per-field エラー表示で十分。小さなフォームなら blur / change の逐次フィードバックも追加
- エラー文言を JSX 内にハードコード
  → `validateField` 内（または定数）に集約する
- フロント検証だけで安心してサーバ検証を省く
  → **必ず両方で検証**する

## 共通化の進め方

複数フォームで同じバリデーションパターンが必要になったら、ジェネリックなヘルパー（`useFormValidation` 的な hook）への抽出を検討する。ただし最初の 1 画面は本ドキュメントの素朴なパターンで実装し、再利用機会が複数発生してから抽象化する（過剰汎化を避ける）。
