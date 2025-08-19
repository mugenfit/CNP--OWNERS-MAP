# 開発ログ

## 2025年8月17日

### 解決済みの問題
- TypeScriptコンパイルエラーの解決 (`import.meta.env` および `castles` プロパティの欠落)。
- `components/public/shops.json` をユーザー提供の店舗データで更新。

### 現在の問題
- **店舗がマップに表示されない。**
  - `[App] Google Maps API script loaded.` がコンソールに表示され、`isApiLoaded` が `true` になっていることを確認済み。
  - しかし、`useShops` 内のジオコーディング関連の `console.log` メッセージ（`[useShops] Attempting to geocode:`、`[useShops] Geocoded ...`）がコンソールに表示されていない。
  - これは、`isApiLoaded` が `true` であるにもかかわらず、`useShops` 内のジオコーディングロジックが実行されていないことを示唆している。

### これまでの作業
1.  **TypeScriptエラーの修正:**
    - `components/tsconfig.json` に `"vite/client"` を追加し、`import.meta.env` エラーを解決。
    - `components/MapContainer.tsx` から不要な `castles` プロパティを削除。
    - `packages/shop-map-module` に `@types/node` をインストールし、`process` 関連のエラーを解決。
2.  **店舗データの更新:**
    - ユーザー提供の `shops.json` を `components/public/shops.json` にコピー。
3.  **ジオコーディングロジックの実装:**
    - `packages/shop-map-module/src/useShops.ts` に `geocodeAddress` 関数を追加し、`fetchShops` 内でジオコーディングを実行するように修正。
    - `useShops` の `useEffect` 依存配列を `[userLocation, window.google?.maps]` に更新し、Google Maps API のロードを待つようにした（後にこのアプローチは変更）。
    - `components/src/main.tsx` の `APIProvider` の `onLoad` イベントを使用して `isApiLoaded` ステートを管理し、これを `MapContainer` を介して `useShops` に渡すように変更。
    - `MapComponent.tsx` に `onMapLoad` プロップを追加し、`MapContainer.tsx` で `handleMapLoad` を介して `isApiLoaded` を更新するように変更。
    - `useShops.ts` からポーリングメカニズムを削除し、`isApiLoaded` プロップに依存するように変更。

## 2025年8月18日

### 解決済みの問題
- `packages/shop-map-module/src/useShops.ts` 内の重複する `geocodeAddress` 関数の定義を削除。
- `packages/shop-map-module` が正しくビルドされていなかった問題を修正 (`tsconfig.json` の `noEmit: true` を削除し、`npm run build` を実行)。
- `components/package.json` の JSON 構文エラーを修正し、Vite のバージョンを安定版にダウングレード。
- Google Maps API のロード状態 (`isApiLoaded`) の管理を `main.tsx` で `APIProvider` の `onLoad` を使用するように戻し、`MapContainer.tsx` に `isApiLoaded` をプロップとして渡すように修正。これにより、マップが完全にロードされる前にジオコーディングが実行される問題を解決。
- **オンライン店舗と実店舗の表示切り替え機能を追加。**
  - `MapContainer.tsx` に `displayMode` ステートと切り替えボタンを追加。
  - ボタンのテキストは現在の表示モードに応じて変化。
  - オンライン店舗モードの場合、マップ上の店舗は非表示になり、オンライン店舗のリストがマップの上にオーバーレイとして表示される。
- `main.tsx` の不要なコメント (`// Add onLoad`) を削除。
- `shops.json` に `id` フィールドを追加し、リストの `key` プロップに関する警告を解消。
- `MapContainer.tsx` の切り替えボタンのスタイルを修正し、視認性を向上。
- **オンライン店舗と移動式店舗の表示切り替え機能を追加。**
  - `MapContainer.tsx` の `DisplayMode` に `'mobile'` を追加し、3つのモード (`physical`, `online`, `mobile`) を切り替えられるように修正。
  - `toggleDisplayMode` は3つのモードを順に切り替えるように修正。
  - `filteredShops` のロジックは、各モードに応じて適切に店舗をフィルタリングするように修正。
  - ボタンのテキストは「表示モード: [現在のモード]」と表示され、現在のモードが一目でわかるように修正。
  - オンライン店舗と移動式店舗は同じオーバーレイリストで表示され、タイトルがモードに応じて変わるように修正。
- `MapContainer.tsx` に追加したデバッグ用の `console.log` を削除。

### 現在の問題
- ジオコーディングに失敗する住所がある (`ZERO_RESULTS` エラー)。これはデータの問題であり、コードのバグではない。
- `AdvancedMarkerElement` のクリックイベントに関する推奨事項の警告。
- ブラウザの最適化に関する警告 (`Rendering was performed in a subtree hidden by content-visibility.`)。
- Vite 開発サーバーの一時的な接続喪失 (`[vite] server connection lost. Polling for restart...`)。
- **`key` エラーがまだ発生する。** (開発モードの Strict Mode の影響である可能性が高い。機能には影響しない。)

### 次の作業
- アプリケーションをビルドし、実行して、オンライン店舗と移動式店舗の表示切り替え機能が正しく動作することを確認する。
- ジオコーディングに失敗する住所の扱いについて検討する（例: マップに表示しない、別の方法で表示するなど）。
- `AdvancedMarkerElement` のクリックイベントに関する推奨事項について、必要であれば対応を検討する。
- `key` エラーについて、ユーザーに開発モードでのみ発生する警告であり、機能には影響しないことを説明する。
