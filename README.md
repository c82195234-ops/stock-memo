# ストック管理 PWA（Android向け）

## 中身
- index.html … アプリ本体
- manifest.webmanifest … アプリ名・アイコン・色の設定
- sw.js … オフライン動作用のサービスワーカー
- icon-192.png / icon-512.png / icon-maskable-512.png … お花のアイコン

## 公開する（どれか1つ）
### A. Netlify Drop（いちばん簡単・無料・登録だけ）
1. https://app.netlify.com/drop を開く
2. このフォルダ（zipを解凍したもの）をそのままドラッグ＆ドロップ
3. 発行された https://xxxx.netlify.app が公開URLです

### B. GitHub Pages（無料）
1. GitHubで新しいリポジトリを作り、このフォルダの中身をすべてアップロード
2. Settings → Pages → Branch を main / (root) にして Save
3. https://ユーザー名.github.io/リポジトリ名/ が公開URLです

※ HTTPSで公開されることが必須です（上の2つは自動でHTTPS）。

## Androidにインストールする
1. Chromeで公開URLを開く
2. 右上の︙メニュー →「アプリをインストール」（または「ホーム画面に追加」）
3. ホーム画面のお花アイコンから、全画面のアプリとして起動できます

## 更新するとき
index.html などを差し替えたら、sw.js の `VERSION = 'stock-v8'` を `stock-v9` のように（毎回違う値に）変えて再公開してください。
次回起動時に新しい版へ入れ替わります。

## データについて
- データは端末のChrome内（localStorage）に保存されます。
- Chromeのサイトデータを消すと、アプリのデータも消えます。
- URLを変えると別アプリ扱いになり、データは引き継がれません。
