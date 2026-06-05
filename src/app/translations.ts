import { DetailItem } from "./types";

// English / Japanese UI Static Text Dictionary
export const UI_TRANSLATIONS = {
  en: {
    module: "MODULE: AIO_LLMO_INGESTION_LAB_v1.2.0",
    system_status: "SYSTEM_SECURE // ONLINE",
    benchmark_title: "COGNITIVE INDEXABILITY DIAGNOSTIC BENCH",
    app_title: "LLMO Optimizer",
    app_subtitle: "Scientific auditing tool for parsing platform discoverability metrics across Generative Engine Indexes. Measures semantic indexability, schema entity coverage, and live Gemini ingestion accuracy.",
    cmd_prefix: "CMD://INIT_AUDIT",
    placeholder: "ENTER TARGET DOMAIN OR DIRECT URL (e.g. example.com)",
    btn_run: "RUN DIAGNOSTIC",
    btn_running: "PARSING_STREAM...",
    critical_fault: "[ CRITICAL SYSTEM FAULT ]",
    system_verdict: "[ SYSTEM_VERDICT // OVERALL_COMPREHENSION ]",
    sys_ok: "SYS_OK",
    score_label: "/ 100 SCORE",
    telemetry_gauge: "TELEMETRY LEVEL GAUGE",
    signal_label: "SIGNAL",
    composite_weight: "Composite index weighting represents 50% traditional search crawlability, 25% AI Overview structure parsing, and 25% dynamic LLM comprehension mapping.",
    status_optimized: "STATUS: FULLY OPTIMIZED",
    status_strong: "STATUS: STRONG FOUNDATION",
    status_warning: "STATUS: NEEDS URGENT OPTIMIZATION",
    status_critical: "STATUS: SEVERE CRITICAL DISCOVERY BLOCK",
    dimensional_header: "[ DIMENSIONAL_BREAKDOWN // INDEXABILITY_INDEX ]",
    modules_label: "3_MODULES",
    seo_label: "01. SEO READINESS INDEX",
    seo_sub: "Traditional Search Ingest",
    seo_weight: "Weight: 50%",
    aio_label: "02. AI OVERVIEW CAPTURE CRITERIA",
    aio_sub: "Snippet Structuring",
    aio_weight: "Weight: 25%",
    llmo_label: "03. COGNITIVE LLM COMPREHENSION",
    llmo_sub: "Agent Crawling & Retrieval",
    llmo_weight: "Weight: 25%",
    tab_seo: "[ 01 // SEO_METRICS ]",
    tab_aio: "[ 02 // AIO_STRUCTURE ]",
    tab_llmo: "[ 03 // LLMO_COGNITIVE ]",
    tab_verify: "[ 04 // HEX_VERIFY_BENCH ]",
    seo_tab_title: "Traditional Search Crawlability Diagnostics",
    seo_tab_sub: "Analyzes structural headers, meta robots configuration, responsive layout frameworks, and JSON-LD schema objects.",
    aio_tab_title: "AI Overview Extraction Target Structuring",
    aio_tab_sub: "Evaluates formatting compatibility for direct LLM synthesis, including list templates, authoritative claims, and question-first headings.",
    llmo_tab_title: "Cognitive Large Language Model Indexing Rubrics",
    llmo_tab_sub: "Measures crawl permission profiles (robots.txt), factual citation density, and structured semantic entity graph readability.",
    verify_tab_title: "Active Ingestion & Factual Extraction Bench",
    verify_tab_sub: "Fetches the raw document layout dynamically and initiates Gemini model query simulation to evaluate factual retrieval fidelity.",
    verify_coeff: "COMPREHENSION_FIDELITY_COEFFICIENT",
    verify_assessment: "[ EVALUATION_ASSESSMENT ]:",
    buffer_raw: "[ BUFFER_DUMP: RAW_HTML_TEXT ]",
    buffer_raw_sub: "UTF-8 // STREAM",
    buffer_extract: "[ COMPILATION: GEMINI_EXTRACT ]",
    buffer_extract_sub: "MODEL: FLASH_LITE",
    summary_label: "// INGESTION_SUMMARY",
    entities_label: "// KNOWLEDGE_GRAPH_ENTITIES",
    claims_label: "// CLAIMS_VERIFICATION_LOG",
    verify_assessment_text: "The model successfully parsed all structural data nodes without hallucination markers.",
    content_richness: "Content Richness",
    mock_warning_title: "API KEY NOT CONFIGURED / MOCK DATA IN USE",
    mock_warning_text: "Because GEMINI_API_KEY is not set or the API call failed, live LLM retrieval and cognitive analysis have been bypassed. Shown data is simulated using mock text, and LLMO scoring is penalized to 0."
  },
  ja: {
    module: "モジュール: AIO_LLMO_INGESTION_LAB_v1.2.0",
    system_status: "システム保護 // オンライン",
    benchmark_title: "検索認知インデックス診断ベンチマーク",
    app_title: "LLMO Optimizer",
    app_subtitle: "次世代生成AIエンジンにおけるプラットフォームの発見可能性指標を測定する科学的監査ツール。セマンティックインデックス適合性、スキーマエンティティカバー率、およびGeminiによるリアルタイムな情報解釈度を評価します。",
    cmd_prefix: "CMD://診断実行",
    placeholder: "ターゲットドメインまたはURLを入力してください（例：example.com）",
    btn_run: "診断を実行する",
    btn_running: "データストリーム解析中...",
    critical_fault: "[ 重大システムフォルト ]",
    system_verdict: "[ システム判定 // 総合理解度スコア ]",
    sys_ok: "SYS_良好",
    score_label: "/ 100 総合点",
    telemetry_gauge: "テレメトリレベル測定器",
    signal_label: "電波適合度",
    composite_weight: "総合評価は、従来型検索インデックス（SEO）50%、AI Overview構造適合（AIO）25%、動的LLM理解 fidelity（LLMO）25%の比率で機械的加重計算されています。",
    status_optimized: "ステータス: 最最適化完了 (FULLY OPTIMIZED)",
    status_strong: "ステータス: 強固な基盤あり (STRONG FOUNDATION)",
    status_warning: "ステータス: 要緊急最適化 (NEEDS URGENT OPTIMIZATION)",
    status_critical: "ステータス: 重大インデックス障害 (SEVERE DISCOVERY BLOCK)",
    dimensional_header: "[ 診断次元ブレイクダウン // 適合性インデックス ]",
    modules_label: "3要素",
    seo_label: "01. SEO 適合性インデックス",
    seo_sub: "従来型検索クローラビリティ",
    seo_weight: "配分比率: 50%",
    aio_label: "02. AI概要（AIO）抽出ターゲット構造化",
    aio_sub: "スニペット抽出性",
    aio_weight: "配分比率: 25%",
    llmo_label: "03. コグニティブLLM認知理解度",
    llmo_sub: "エージェント巡回と情報解釈",
    llmo_weight: "配分比率: 25%",
    tab_seo: "[ 01 // SEOメトリクス ]",
    tab_aio: "[ 02 // AIO構造検証 ]",
    tab_llmo: "[ 03 // LLMO認知検証 ]",
    tab_verify: "[ 04 // 整合性検証台 ]",
    seo_tab_title: "従来型SEO クローリング適合性診断",
    seo_tab_sub: "構造化ヘッダー、メタロボット設定、レスポンシブレイアウトフレームワーク、およびJSON-LDスキーマオブジェクトを分析します。",
    aio_tab_title: "AI Overview 抽出ターゲット構造化",
    aio_tab_sub: "ダイレクトなLLM合成のためのフォーマット互換性を評価します。リストテンプレート、オーソリティのある主張、および質問ファーストの見出しを含みます。",
    llmo_tab_title: "コグニティブ大規模言語モデルインデックス指標",
    llmo_tab_sub: "クロール許可プロファイル（robots.txt）、ファクトの引用密度、および構造化されたセマンティックエンティティグラフの可読性を測定します。",
    verify_tab_title: "アクティブなインジェスチョン＆ファクト抽出検証台",
    verify_tab_sub: "生のドキュメントレイアウトを動的に取得し、ファクト検索フィデリティを評価するためにGeminiモデルのクエリシミュレーションを開始します。",
    verify_coeff: "理解度フィデリティ係数",
    verify_assessment: "[ 評価アセスメント ]: ",
    buffer_raw: "[ バッファダンプ: 生のHTMLテキスト ]",
    buffer_raw_sub: "UTF-8 // ストリーム",
    buffer_extract: "[ コンパイル: GEMINI 抽出データ ]",
    buffer_extract_sub: "モデル: FLASH_LITE",
    summary_label: "// インジェスチョンサマリー",
    entities_label: "// ナレッジグラフエンティティ",
    claims_label: "// 主張検証ログ",
    verify_assessment_text: "モデルは事実誤認の兆候なしにすべての主要データノードを正確に解釈しています。",
    content_richness: "コンテンツ充実度",
    mock_warning_title: "APIキー未設定 / モックデータ使用中",
    mock_warning_text: "GEMINI_API_KEY が環境変数に設定されていないか、APIの呼び出しに失敗したため、リアルタイムのLLMインジェスチョンおよび認知解析はスキップされました。表示されているデータはシミュレートされたモックデータであり、LLMOスコアは0に制限されています。"
  }
};

export const TRANSLATIONS: Record<string, Record<string, { name: string; description: (desc: string) => string }>> = {
  ja: {
    "Robots Indexation Tag": {
      name: "Robots インデックス設定タグ",
      description: (desc) => desc.includes("Detected 'noindex'") 
        ? "ロボットメタタグに 'noindex' が検出されました。検索エンジンによるページのインデックス登録がブロックされています。"
        : "noindex タグは検出されませんでした。検索エンジンによる巡回・登録が許可されています。"
    },
    "Canonical Link Tag": {
      name: "Canonical 正規化リンクタグ",
      description: (desc) => desc.includes("Canonical tag exists")
        ? `正規化タグ（Canonical）が存在します。重複コンテンツ問題を防ぎます。`
        : "Canonicalタグが見つかりません。検索エンジンから重複コンテンツとしてマークされるリスクがあります。"
    },
    "Viewport Tag (Mobile Friendly)": {
      name: "Viewport タグ（モバイルフレンドリー）",
      description: (desc) => desc.includes("Viewport tag exists")
        ? "ビューポートタグが存在し、モバイル端末での正しいレンダリングと検索適合性が保証されています。"
        : "ビューポートタグがありません。モバイルフレンドリーテストでペナルティを受ける可能性があります。"
    },
    "HTTPS Security Encryption": {
      name: "HTTPS 暗号化セキュリティ",
      description: (desc) => desc.includes("securely via HTTPS")
        ? "SSL/TLSによる安全な暗号化HTTPS接続で配信されています。"
        : "暗号化されていないHTTP接続です。SSL証明書の導入を強く推奨します。"
    },
    "Image Performance Optimization": {
      name: "画像パフォーマンス最適化",
      description: (desc) => {
        const match = desc.match(/(\d+)\/(\d+) images use lazy loading\.\s+(\d+)\/(\d+) images/);
        if (match) {
          return `検出画像中、${match[1]}/${match[2]}枚でLazy Loading（遅延読み込み）が有効。${match[3]}/${match[4]}枚で画像サイズ（width/height/srcset）が最適に定義され、レイアウトシフトを防ぎます。`;
        }
        const fallbackMatch = desc.match(/(\d+)\/(\d+) images/);
        if (fallbackMatch) {
          return `${fallbackMatch[2]}枚中${fallbackMatch[1]}枚の画像でLazy Loading（遅延読み込み）が有効です。定義済みの幅/高さ/srcset属性によりレイアウトシフトが防がれています。`;
        }
        return "画像が見つからないか、すべての画像が適切に最適化されています。";
      }
    },
    "Clean URL Parameters": {
      name: "クリーンURLパラメータ",
      description: (desc) => desc.includes("query parameters")
        ? "URLにクエリーパラメータが含まれています。クローラの巡回効率低下や重複URL認定のリスクがあります。"
        : "URLにパラメータが含まれず、無駄のないディレクトリ構造に整理されています。"
    },
    "Internal Navigation Links": {
      name: "内部ナビゲーションリンク",
      description: (desc) => {
        const match = desc.match(/Found (\d+) internal/);
        if (match) {
          return `ページ内に ${match[1]} 個の内部リンクが検出されました。適切なナビゲーション設計です。`;
        }
        return "内部ナビゲーションリンクが見つかりませんでした。";
      }
    },
    "SEO Title Tag": {
      name: "SEO タイトルタグ（<title>）",
      description: (desc) => {
        const match = desc.match(/Found title tag: "([^"]+)" \((\d+) chars\)/);
        if (match) {
          return `タイトルタグを検出: "${match[1]}" (${match[2]}文字)。最適な文字数（10〜60文字）の範囲内です。`;
        }
        return "HTML内にタイトル（<title>）タグが存在しません。";
      }
    },
    "Meta Description Tag": {
      name: "メタディスクリプションタグ",
      description: (desc) => {
        const match = desc.match(/Found description tag: "([^"]+)..." \((\d+) chars\)/);
        if (match) {
          return `メタ説明タグを検出: "${match[1]}..." (${match[2]}文字)。最適な文字数（50〜160文字）の範囲内です。`;
        }
        return "HTML内にメタディスクリプション（meta description）が存在しません。";
      }
    },
    "Single H1 Tag Check": {
      name: "H1タグ単一性チェック",
      description: (desc) => {
        if (desc.includes("Exactly one H1 tag")) {
          return "ページ内にH1見出しタグが正確に1つだけ設定されています。検索エンジンにテーマが明確に伝わります。";
        }
        const match = desc.match(/Found (\d+) H1/);
        if (match) {
          return `H1タグが ${match[1]} 個検出されました。ページの関連性を正しく伝えるため、H1タグは正確に1つにすることを推奨します。`;
        }
        return "H1タグが検出されませんでした。ページの主要な見出しを明記してください。";
      }
    },
    "JSON-LD Schema Markup": {
      name: "JSON-LD 構造化データマークアップ",
      description: (desc) => {
        const match = desc.match(/Found (\d+) JSON-LD/);
        if (match) {
          return `ページ内に ${match[1]} 個 of JSON-LD構造化データスキーマを検出しました。AIエンジンの実体抽出を促進します。`;
        }
        return "JSON-LD等の構造化データスキーマが検出されませんでした。";
      }
    },
    "Snippet Bait Content (30-80 words)": {
      name: "スニペット用要約文（30〜80単語）",
      description: (desc) => desc.includes("concise, answer-first paragraph")
        ? "見出しの直下に要約された段落（30〜80単語）が存在し、AI Overview（AIO）による抽出準備が整っています。"
        : "見出しの直後に要約された段落がありません。AIに抽出されやすい箇条書きや結論ファーストの段落を配置することを推奨します。"
    },
    "Extractable Lists & Tables": {
      name: "AI用リスト・テーブル構造",
      description: (desc) => desc.includes("structured <ul>")
        ? "ページ内に<ul>, <ol>, <table>タグを使用しており、AIエンジンが箇条書きや表形式の要約回答を作りやすい構造になっています。"
        : "リストまたは表が検出されませんでした。AIエージェントによる段階的な情報の要約・提示が難しくなります。"
    },
    "Conversational Question Headings": {
      name: "会話型質問見出し",
      description: (desc) => desc.includes("question-based headings")
        ? "質問形式の見出し（例: 'What', 'How', 'なぜ'等）が存在します。ユーザーの自然言語クエリとの直接的なマッチングに有効です。"
        : "質問形式の見出しが見つかりませんでした。一般的な検索クエリの疑問文に呼応する見出し設計を検討してください。"
    },
    "Heading Hierarchy Consistency": {
      name: "見出し階層構造の一貫性",
      description: (desc) => desc.includes("nests and builds H1 -> H2")
        ? "H1 -> H2 と正しく階層化されてネストされています。クローラーが主題を容易に理解できます。"
        : "不完全な見出し階層構造です。AIクローラーが理解しやすいよう、階層は連続して記述してください。"
    },
    "Content-to-Code Ratio (>15%)": {
      name: "コンテンツ・コード比率 (>15%)",
      description: (desc) => {
        const match = desc.match(/ratio is ([\d\.]+)%/);
        const val = match ? match[1] : "0.0";
        return `テキストとコードの比率は ${val}% です。HTML構造がシンプルでテキスト密度が高いページは、AIクローラーに優先されやすいです。`;
      }
    },
    "Semantic HTML5 Elements": {
      name: "セマンティック HTML5 要素",
      description: (desc) => desc.includes("block containers (article")
        ? "標準セマンティックコンテナ（article, section, main等）が適切に使用され、ページのレイアウト構造が明確です。"
        : "セマンティックタグがありません。すべてdivで囲まれているため、AIクローラーがレイアウト内の各ブロックの役割を判別しにくいです。"
    },
    "High-Authority Reference Outlinks": {
      name: "高権威サイトへのアウトリンク",
      description: (desc) => desc.includes("referencing high-authority")
        ? "信頼性の高い情報源（.edu, .gov, wikipediaなど）へのアウトリンクが検出されました。コンテンツの根拠・信頼性を高めます。"
        : "信頼できる外部ソースへの参照リンクがありません。根拠となる文献や統計データへリンクさせることで、客観的信頼性が向上します。"
    },
    "Author Credentials & Bylines (E-E-A-T)": {
      name: "著者情報タグ・バイライン (E-E-A-T)",
      description: (desc) => desc.includes("Author credentials, byline")
        ? "著者情報、署名欄（byline）、または著者のメタデータスキーマが正しく検出されました。"
        : "著者の署名やメタデータ情報が見つかりません。作成者の信頼性（EEAT）を高めるために署名属性の明記を推奨します。"
    },
    "LLM Bot-Blocker Exemption": {
      name: "LLMボット ブロック設定 of 除外",
      description: (desc) => desc.includes("successfully bypassed all firewalls")
        ? "Geminiクローラーがサイト制限にブロックされず、正常にWebページ内容をロードしました。"
        : "GeminiクローラーのURLへのアクセスが拒否されました。robots.txtやCloudflare WAF制限などを確認してください。"
    },
    "LLM Extraction Fidelity (Accuracy)": {
      name: "LLM情報抽出忠実度 (正確性)",
      description: (desc) => {
        const match = desc.match(/rate: (\d+)%\. (.*)/);
        if (match) {
          return `抽出の忠実性: ${match[1]}%。評価分析: ${match[2]}`;
        }
        return desc;
      }
    },
    "Factual Data & Statistics Density": {
      name: "数値データ・統計情報の密度",
      description: (desc) => {
        const matchSuccess = desc.match(/Detected (\d+) numbers/);
        if (matchSuccess) {
          return `豊富な統計データを検出！${matchSuccess[1]}個の数値・統計情報が認識されました。LLMによる引用や出典として選択されやすい状態です。`;
        }
        const matchFail = desc.match(/Only found (\d+) numeric/);
        if (matchFail) {
          return `検出された数値・統計情報はごく僅かです（${matchFail[1]}個の数値トークンのみ検出）。客観的な数値指標を明記することで、AIエンジンの信用スコアが高まります。`;
        }
        return "検出された数値や統計情報はごく僅かでした。客観的な数値指標を明記することで、AIエンジンの信用スコアが高まります。";
      }
    },
    "Proper Noun Entity Density": {
      name: "固有名詞・ナレッジグラフエンティティ密度",
      description: (desc) => {
        const matchSuccess = desc.match(/Found (\d+) proper/);
        if (matchSuccess) {
          return `固有名詞・エンティティを豊富に検出！${matchSuccess[1]}個の固有名詞が識別されました。LLMのナレッジグラフにおける実体関係性の特定に極めて有利です。`;
        }
        const matchFail = desc.match(/Low entity count \((\d+) proper/);
        if (matchFail) {
          return `固有名詞の検出数が少ない状態です（${matchFail[1]}個の固有名詞のみ検出）。製品名やコアエンティティを主語として明確に記述することを推奨します。`;
        }
        return "固有名詞が少ない状態です。サービス名や製品名などを明確な主語として記述することを推奨します。";
      }
    },
    "LLM URL Context Extraction": {
      name: "LLM URLコンテキスト抽出",
      description: (desc) => desc.includes("successfully parsed")
        ? "Geminiがウェブページのテキストコンテキストを正常に解析しました。"
        : "Geminiがこのページのテキストコンテキストから有効な構造化データを抽出できませんでした。"
    },
    "LLM Content Richness Score": {
      name: "LLM コンテンツ充実度スコア",
      description: (desc) => {
        const match = desc.match(/Evaluated Content Richness: (HIGH|MEDIUM|LOW)\. (.*)/);
        if (match) {
          const level = match[1] === "HIGH" ? "高" : (match[1] === "MEDIUM" ? "中" : "低");
          return `評価されたコンテンツ充実度: ${level}。${match[1] === "HIGH" ? "ユーザーの意図に対して十分な詳細情報を提供しています。" : "詳細情報または深みが不足しています。"}`;
        }
        return desc;
      }
    },
    "Factual Claims & Data Density": {
      name: "事実の主張とデータ密度",
      description: (desc) => {
        if (desc.includes("Rich data density!")) {
          const match = desc.match(/Detected (\d+) specific/);
          const count = match ? match[1] : "0";
          return `豊富なデータ密度！${count}個の具体的な事実の主張を検出しました。LLMの引用に非常に有益です。`;
        } else {
          const match = desc.match(/Only found (\d+) factual/);
          const count = match ? match[1] : "0";
          return `事実の主張は ${count}個しか検出されませんでした。AIシステムは主張に対して明確な事実や統計指標を優先します。`;
        }
      }
    },
    "Core Topic Density": {
      name: "コアトピック密度",
      description: (desc) => {
        if (desc.includes("Found sufficient")) {
          return "十分なコアトピックが検出されました。LLMナレッジグラフにおける実体関係の特定に最適です。";
        } else {
          const match = desc.match(/Low topic count \((\d+) topics\)/);
          const count = match ? match[1] : "0";
          return `トピック検出数が少ないです（${count}トピック）。重要なサービスやトピックが明確であることを確認してください。`;
        }
      }
    }
  }
};

export const getLocalizedItem = (item: DetailItem, lang: "en" | "ja") => {
  if (lang === "en") return item;
  const translation = TRANSLATIONS.ja[item.name];
  if (translation) {
    return {
      ...item,
      name: translation.name,
      description: translation.description(item.description)
    };
  }
  return item;
};

export type UIBenchmarkTranslations = typeof UI_TRANSLATIONS.en;

