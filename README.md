# AIO & LLMO Analyzer (llm-site-optimizer)

このプロジェクトは、Webサイトが従来の検索エンジン（SEO）や、最新のAIモデル（LLM/AIO）に対してどの程度最適化されているかを評価・分析するツールです。指定されたURLを分析し、Next.jsとGemini APIを用いてサイトの構造、コンテンツの可読性、LLMによる理解度を複合的に採点します。

## 主な機能 (Features)

*   **SEO（検索エンジン最適化）分析**:
    *   タイトル、メタディスクリプション、見出し構造(H1-H6)の適切な使用をチェック。
    *   画像の代替テキスト(alt属性)やセマンティックHTMLタグの有無など、基本的なSEO要素を評価。
*   **AIO（AI最適化）分析**:
    *   コンテンツの可読性、リストや表構造を用いた情報の整理度を評価。
    *   AIエージェントやLLMがクロールした際の情報抽出のしやすさ(Scannability)を判定。
*   **LLMO（大規模言語モデル最適化）分析**:
    *   Google Gemini APIを用いて、実際にLLMが対象ページのコンテンツをどう解釈するかをシミュレーション。
    *   ページ全体の要約、主要トピックの抽出、主張や事実関係の明確さを評価。
    *   LLMにとっての「リッチネススコア（理解度スコア）」を算出。
*   **バイリンガルUI**:
    *   英語と日本語のUI切り替えをサポート。
*   **Cloudflare Workers対応**:
    *   OpenNextを利用し、エッジ環境(Cloudflare Workers)での高速な実行・デプロイに対応。

## 技術スタック (Tech Stack)

*   **フレームワーク**: Next.js 16 (App Router)
*   **スタイリング**: Tailwind CSS
*   **HTMLパース**: Cheerio
*   **AI API**: Google Gemini API (`@google/genai`)
*   **アイコン**: Lucide React
*   **デプロイ**: Cloudflare Workers / OpenNext (`@opennextjs/cloudflare`)

## 開発環境のセットアップ (Getting Started)

### 1. 依存関係のインストール

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env.local` ファイルを作成し、Gemini APIキーを設定してください。

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 開発サーバーの起動

標準のNext.js開発サーバーを起動する場合：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスするとアプリケーションが表示されます。

## Cloudflare Workersへのデプロイ (Deploy on Cloudflare)

このプロジェクトは `OpenNext` を利用して Cloudflare Workers 上で実行するように構成されています。

### ワーカーとしてのローカルプレビュー

ビルドしてWranglerを用いたローカル環境でテストする場合：

```bash
npm run preview:worker
```

### Cloudflareへのデプロイ

```bash
npm run deploy:worker
# または
npm run deploy
```

> **Note**: デプロイ前にWranglerの認証 (`npx wrangler login`) と、CloudflareのダッシュボードまたはWrangler経由での環境変数 (`GEMINI_API_KEY`) の設定が必要です。
