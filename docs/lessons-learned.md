# 開発で得た教訓

## 1. Spectrum Button の `type` 属性に注意

Spectrum の `Button` に `type="submit"` を付けると `Form` がsubmitされ、フォームがリセットされる。
`onPress` で独自処理を呼ぶ場合は `type="button"` を明示する。

```tsx
// NG: Formがsubmitされて入力が消える
<Button variant="cta" onPress={greet} type="submit">

// OK: onPressのみ発火する
<Button variant="cta" onPress={greet} type="button">
```

## 2. Tauri の `invoke` 引数名はRust側と完全一致させる

`invoke` に渡すオブジェクトのキー名は、Rust側の `#[tauri::command]` 関数の引数名と一致している必要がある。

```rust
// Rust側
#[tauri::command]
fn talk(message: &str) -> String { ... }
```

```typescript
// NG: キー名が一致しない
invoke("talk", { talkInput })       // { talkInput: talkInput }
invoke("talk", { input: talkInput }) // キー名が "input"

// OK: Rust側の引数名 "message" と一致
invoke("talk", { message: talkInput })
```

## 3. JSXの二重括弧 `return (( ... ))` を避ける

構文エラーにはならないが不要なネストで混乱の元になる。`return ( ... )` で十分。

## 4. Flexboxの中央寄せ

`flex-direction: column` のとき、水平方向の中央寄せは `align-items: center` を使う。

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* justify-content ではない */
}
```

## 5. Rust の `regex` crateは後方参照をサポートしない

`regex` crateは線形時間保証のため `\1` などの後方参照、先読み、後読みに非対応。
フル機能が必要な場合は `fancy-regex` crateを使う。

```toml
# Cargo.toml
# regex = "1"        # 後方参照非対応
fancy-regex = "0.14"  # 後方参照・先読み・後読み対応
```

`fancy-regex` は `find_iter` が `Result` を返すため、`.filter_map(|m| m.ok())` が必要。

```rust
use fancy_regex::Regex;

let matches: Vec<String> = re
    .find_iter(text)
    .filter_map(|m| m.ok())  // regex crateでは不要、fancy-regexでは必要
    .map(|m| m.as_str().to_string())
    .collect();
```

## 6. Tauri の `Result` 返却コマンドではフロントエンド側でエラーハンドリングする

Rust側が `Result<T, String>` を返すコマンドでエラーが発生すると、フロントエンドの `invoke` はrejectされる。
`try/catch` しないとエラーが握りつぶされ、何も表示されない。

```typescript
// NG: エラーが発生しても何も起きない
const results = await invoke<string[]>("regex_match", { pattern, text });

// OK: エラーをキャッチしてユーザーに表示
try {
  const results = await invoke<string[]>("regex_match", { pattern, text });
  setMatches(results);
} catch (e) {
  setMatches([`Error: ${e}`]);
}
```
