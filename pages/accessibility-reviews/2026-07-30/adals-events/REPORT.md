# ADALS 活動頁完整測試報告

- 測試日期：2026-07-30
- 目標：https://aia.tinyoakstudio.com/adals%e6%b4%bb%e5%8b%95/
- 標準：WCAG 2.2 AA
- 測試姿態：read-only；未修改正式站

## 結論

目前頁面不適合把「開始報名」當成可用流程發布。最主要的原因不是分數，而是所有可見報名 CTA 都只是 `span`，沒有連結、按鈕角色或目的地；滑鼠、鍵盤與輔助科技使用者都無法完成報名。

另一個 blocking 問題是 responsive 文字欄：320px 的活動時程內容欄約 128px，768px 的票券英文清單欄約 39px，已形成近乎逐字換行。七種寬度都沒有水平捲軸，但「沒有橫向 overflow」不等於內容可讀。

## Beacon 版本確認

- Canonical repo：`C:\Code\personal\beacon`
- Repo HEAD：`6ea1c7e007e07675efdfec4754ae9dd7238aeaa8`
- `origin/master`：同一 commit
- Manifest 版本：`3.3.0`
- Build check：51 個 adapter outputs 全部與 core 相符
- `v3.3.0` tag：`38445876344e0ec17a61e17806b0ae6ced18e2d5`，落後目前 HEAD 6 commits
- Marketplace checkout：已在最新 HEAD
- Codex plugin：`beacon@beacon` 3.3.0，installed + enabled
- Installed cache：版本名仍為 3.3.0，但 `generate-report.mjs` 比 canonical repo 少 2 行

本次實際使用 canonical repo 最新 HEAD 的 Beacon 3.3.0 scripts，不使用落後的 installed cache script。

## Blocking findings

### 1. 報名流程不存在

- 影響：所有想報名的使用者；鍵盤與螢幕閱讀器使用者尤其無法判斷或啟動 CTA。
- 證據：hero 的兩個「立即報名｜Register」與四張票券的「報名 Register」皆為 `span`，最近祖先也沒有 `a`、`button`、button role 或 `tabindex`。
- 對應：WCAG 2.1.1、4.1.2。
- 修正：指定實際目的地後，以原生 `<a href>` 或 `<button>` 實作。

### 2. 文字欄在 320px 與 768px 失去可讀性

- 320px：時程說明欄約 128px。
- 320px：講者卡寬 224px，左右內距後正文只剩約 128px。
- 768px：三張講者卡仍並排，每張卡寬約 181px，正文只剩約 85px。
- 1024px：三張講者卡仍並排，正文約 171px。
- 768px：四張票券仍並排，英文清單欄約 39px。
- 1024px：票券清單欄仍只有約 92px。
- 七種寬度的 `scrollWidth <= clientWidth` 都通過，但可讀寬度硬閘失敗。
- 對應：WCAG 1.4.10。
- 修正：講者在 768px 使用單欄、1024px 使用兩欄，並縮小手機版水平內距；時程在窄螢幕改成上下堆疊；票券使用 `repeat(auto-fit, minmax(20rem, 1fr))` 或等價規則，空間不足時減少欄數。

### 3. 語言與 heading outline 錯誤

- 中文為主的頁面宣告 `html lang="en-US"`。
- 頁面沒有 H1；事件名稱、section title、講者姓名與每個時程項目大量共用 H2。
- 影響：螢幕閱讀器語音選擇錯誤，heading navigation 難以理解層級。
- 對應：WCAG 3.1.1、1.3.1、2.4.6。
- 修正：頁面使用 `zh-Hant`，英文段落局部標 `lang="en"`；事件名稱為唯一 H1，section 為 H2，講者與時程項目為 H3。

## 其他重要 findings

- 對比：Beacon Tier 2 確認 18 個 viewport occurrences 低於 4.5:1；主要是 `#718096` 對白底約 4.02:1，以及導覽文字約 4.16:1。
- Touch target：3 個講者連結在兩種 viewport 約為 80×22px／83×22px，共 6 個 occurrences；它們未直接達到 24×24px 的尺寸條件，但尚未依 WCAG 2.5.8 檢查周圍間距例外，因此不能僅憑高度判定不符合。
- 連結：Makoto Ueki 的 `Text link →` 指向 `#`，應改為 `LinkedIn →` 並連到 `https://jp.linkedin.com/in/makoto-ueki-weba11y`；Facebook 應連到 `https://www.facebook.com/apacaia/`；X 與 Instagram 尚未建立，應先移除。
- Disclosure label：三個講者展開元件都叫 `READ ENGLISH BIO`，未包含講者姓名；鍵盤展開功能本身通過。
- Mixed content：7 個圖片／背景資產以 HTTP 寫入，瀏覽器目前自動升級到 HTTPS。
- **P1｜時程內容錯誤：**閉幕列為 16:30–16:45，交流茶會卻從 16:40 開始，重疊 5 分鐘。確認正確時間後，中文與英文時程都要同步修正。
- 字體：未發現 PMingLiU、MingLiU、裸 serif 或裸 monospace；但頁面只明列 Open Sans／系統 sans，沒有明列繁中與日文 sans fallback。

## AEO / SEO

- 有 canonical URL。
- 缺 meta description。
- 缺 JSON-LD；活動頁沒有 Event schema。
- 未找到 Open Graph / social preview metadata。
- `<title>` 只有「論壇活動」，不能清楚識別 ADALS 2026。

## Performance

| 模式 | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Desktop | 82 | 92 | 77 | 92 | 1.2s | 2.5s | 0ms | 0.001 |
| Mobile | 71 | 92 | 77 | 92 | 2.3s | 8.6s | 0ms | 0 |

Mobile LCP 8.6s 是主要性能風險。Lighthouse 估計圖片傳輸可省約 591KiB；Claire Chang PNG 約 562KiB，其中約 455KiB 可省，hero background 約 659KiB，其中約 101KiB 可省。Hero background 是 mobile LCP element，且沒有 `fetchpriority=high`。

## 已通過

- 320／768／1024／1280／1440／1742／1920：全部沒有水平捲軸。
- Skip link 可用，啟動後下一個 Tab 進入 main 內容。
- Mobile menu 可用鍵盤開啟，狀態有 `aria-expanded`，焦點移到 Close menu。
- 三個 English bio disclosure 都可用鍵盤展開。
- 可見 focus indicator 存在。
- 站內首頁、活動頁、聯絡頁都回傳 HTTP 200。
- 頁面載入時沒有 browser console warning/error。
- 沒有表單、影音內容，因此相關條件不適用於本頁。

## 分數解讀

- Beacon complete baseline：28 / 100，57% 權重覆蓋。
- 原始 findings：121（3 critical、28 warning、90 tip）。
- 其中 74 筆是「圖片／gradient 背景使對比無法自動解析」的 review items，不是 74 個已確認失敗。
- Lighthouse accessibility：desktop/mobile 都是 92；它只抓到對比與 target size，沒有發現報名 CTA 根本不是互動元件，也沒有判斷 768px 文字欄是否可讀。因此不能只看 Lighthouse 92。

## 尚未驗證

- 尚未用 NVDA、JAWS、VoiceOver 做真人 task walkthrough。
- 尚未做真實手機觸控與身心障礙使用者測試。
- LinkedIn 對自動請求回傳 999，屬反自動化回應；未判定為斷鏈。
- Lighthouse JSON 已完整產生並可解析，但 CLI 在 Windows 清理自己的 temp 目錄時回傳 EPERM。
- Beacon HTML report 已生成；因 browser security policy 阻擋本機 `file://` 頁面，未完成報告本身的全寬度視覺驗收，因此本次以 Markdown、JSON 與目標頁 screenshots 為正式交付。

## 證據檔

- `audit-results-complete.json`：Beacon 合併結果
- `tier2-results.json`：Beacon computed contrast / touch evidence
- `manual-runtime-findings.json`：可重現的 runtime findings
- `llm-judgment.json`：不進分數的內容與認知判讀
- `lighthouse-desktop.json` / `lighthouse-mobile.json`
- `responsive-width-scan-exact.json`
- `keyboard-focus-trace-mobile.json`
- `runtime-structure.json`
- `viewport-exact-*.png`
