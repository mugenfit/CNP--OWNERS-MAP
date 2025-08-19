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
- `packages/shop-map-module/src/useShops.ts` に追加したデバッグ用の `console.log` を削除。
- GitHub Pages へのデプロイ設定 (`vite.config.ts` の `base` オプション、`package.json` の `build` スクリプト、`docs` フォルダの作成) を追加。
- React のバージョンを安定版の v18 にダウングレード。
- `@vis.gl/react-google-maps` のバージョンを `1.0.0` に固定。

### 現在の問題
- **GitHub Pages で `TypeError: Cannot read properties of null (reading 'useState')` エラーが発生し、画面が真っ白になる。**
  - React のフックがコンポーネントのコンテキスト外で呼び出されている可能性。
  - ビルドされたコードで発生しているため、原因の特定が困難。
  - **推測される原因:**
      1.  **React のコンテキスト問題:** `APIProvider` や `MapContainer`、`MapComponent` の間で、React のコンテキストが正しく伝播されていない可能性。
      2.  **Vite のビルド設定の深層的な問題:** Vite のビルドプロセスが、React のフックの解決に何らかの悪影響を与えている可能性。特に、Vite のバージョンが `5.4.19` と比較的新しいことや、`@vitejs/plugin-react` の設定が影響しているかもしれない。
      3.  **`@vis.gl/react-google-maps` の内部的な問題:** `1.0.0` にダウングレードしたが、このバージョン自体に特定の環境下で問題がある可能性もゼロではない。
      4.  **モジュールのバンドル問題:** `packages/shop-map-module` が正しくバンドルされていないか、`components` プロジェクトで正しくインポートされていない可能性。特に、`useShops` フックが原因でエラーが発生している可能性。
- ジオコーディングに失敗する住所がある (`ZERO_RESULTS` エラー)。これはデータの問題であり、コードのバグではない。
- `AdvancedMarkerElement` のクリックイベントに関する推奨事項の警告。
- ブラウザの最適化に関する警告 (`Rendering was performed in a subtree hidden by content-visibility.`)。
- Vite 開発サーバーの一時的な接続喪失 (`[vite] server connection lost. Polling for restart...`)。
- `key` エラーがまだ発生する。 (開発モードの Strict Mode の影響である可能性が高い。機能には影響しない。)

### 今後の調査方針
1.  **エラーの発生源を特定する:**
    - ビルドされた `index-DCYdBAfe.js` のエラー箇所を、元のソースコードにマッピングする方法を検討する。
    - 例えば、Vite の `sourcemap` 設定を確認し、デプロイされた環境でソースマップが利用できるか確認する。
2.  **最小限の再現コードを作成する:**
    - `useState` を使用する最小限の React コンポーネントを作成し、それが GitHub Pages で動作するか確認する。
    - これにより、問題が `useState` 自体にあるのか、それとも `MapComponent` や `useShops` のような特定のコンポーネントやフックにあるのかを切り分ける。
3.  **Vite の設定をさらにシンプルにする:**
    - `vite.config.ts` の `resolve.alias` などの設定を一時的に削除し、問題が解決するか確認する。
4.  **別のデプロイ方法を試す:**
    - Vercel や Netlify のような、よりモダンなデプロイサービスを試してみる。これらのサービスは、Vite プロジェクトのデプロイに特化しており、GitHub Pages よりも設定が容易な場合がある。

### 次の作業
- 上記の調査方針に基づき、問題の解決に取り組む。