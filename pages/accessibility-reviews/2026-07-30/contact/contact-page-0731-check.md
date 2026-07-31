# 聯繫頁無障礙與響應式版面檢查

測試日期：2026-07-31  
測試網址：https://aia.tinyoakstudio.com/%e8%81%af%e7%b9%ab/

## 先看結論

聯繫頁有 2 項 P0：**「主題」被設定成 Email 欄位**，可能阻擋一般表單內容送出；**頁面沒有 H1**，螢幕閱讀器的標題導覽缺少代表本頁主題的最高層標題。兩項都列為上線前修正。

版面在 320／768／1024／1280／1440／1742／1920px 都沒有水平捲軸，套用 WCAG 文字間距測試值後也沒有溢出。其餘調整集中在鍵盤 focus、文字對比、頁面語言與社群連結。

## 修正項目

### P0：將「主題」從 Email Field 改成 Text Field

目前「主題*」的 HTML 是 `<input type="email">`。在 Kadence Advanced Form 將它改成 Text Field；若不能直接切換型別，就刪除原本 Email Field，在同一位置新增必填 Text Field，標籤仍用「主題」。

同一輪替名字加入 `autocomplete="name"`，Email 加入 `autocomplete="email"`。

完成標準：一般文字主題可以通過瀏覽器驗證；空白主題仍會顯示必填提示。

### P0：將「聯繫我們」改為 H1，頁面標示為繁體中文

目前只有 H2，沒有 H1；螢幕閱讀器的標題清單看不到代表本頁主題的最高層標題。HTML 根節點是 `lang="en-US"`。將「聯繫我們」改為 H1，視覺位置仍可保留在表單左側，不必移動版面；「社群媒體 SOCIALS」保留 H2。WordPress 網站語言設為繁體中文，使頁面輸出 `zh-TW` 或 `zh-Hant`。

完成標準：頁面只有一個 H1「聯繫我們」，且在 DOM 閱讀順序中位於表單之前。

### P1：讓輸入欄位有清楚的鍵盤 focus

Tab 進入五個欄位時，computed style 是 `outline: none 0px`。在 Kadence Input Fields 的 Focus Colors 設定明顯邊框；若內建設定不足，可在 staging 加入：

```css
.kb-advanced-form input:focus-visible,
.kb-advanced-form select:focus-visible,
.kb-advanced-form textarea:focus-visible {
  outline: 3px solid #ffbf47;
  outline-offset: 3px;
}
```

### P1：加深送出按鈕、必填星號與桌面導覽文字

- 送出按鈕白字／橘底：約 3.55:1。
- 必填星號／深藍底：約 2.08:1。
- 桌面導覽灰字／黃色底：約 4.16:1。

可保留原色系：按鈕底色加深到接近 `#b83b22`；必填星號改為 `#ffb4ab`；導覽文字改用較深的藍灰或深藍。

### P1：Facebook 補正確網址；X 與 Instagram 先不顯示

三個社群連結目前都是空 `href`。Facebook 設為 https://www.facebook.com/apacaia/；X 與 Instagram 尚未建立，先隱藏，建立並確認網址後再顯示。

## 已通過

- 五個表單欄位都有可見且已關聯的 label。
- 五個欄位都有原生 `required`。
- 表單控制項使用原生 input、select、textarea、button。
- 七種寬度一般狀態與文字間距測試都沒有水平捲軸。
- Skip link、main 與 footer 存在。
- 圖片替代文字配置合理。

## 網站開發與 staging 複查

背景圖仍使用 `http://`，Chrome 目前會自動升級為 HTTPS。請在媒體或區塊背景設定中改成 HTTPS；這是網站維護項目，不列為本頁的無障礙失敗。

本次沒有從正式站送出表單。修正後需在 staging 驗證一般文字主題、必填錯誤、成功訊息、錯誤訊息、實際寄信與收信結果。

Kadence 設定位置可參考：https://www.kadencewp.com/help-center/docs/non-knowledgebase/advanced-form-block/

## 測試資料

- `contact-live-audit.json`
- `lighthouse-desktop.json`
- `lighthouse-mobile.json`
- `axe-results.json`
- `contact-1440-accessibility-tree.md`
- `console-warnings-errors.txt`

axe 本次回報 0 violations，但沒有抓到主題欄位型別、focus、H1 等人工檢查項目。0 violations 不代表整頁已無障礙。

尚未涵蓋正式寄信流程、成功／錯誤訊息 live announcement、NVDA／JAWS／VoiceOver 真人操作、真實手機觸控與身心障礙使用者測試。
