# AIA Logo Assets

更新日期:2026-05-17
源檔來自:Google Drive `516-logo-update/`(設計師 2026-05-16 交付)

---

## 重要原則:網站永遠使用「中英文版」

AIA 同時是「社團法人亞太包容創新協會」(中文法定身份)
+「APAC Authentic Inclusion Association」(英文國際身份)。
**雙身份是組織本質,logo 必須同時呈現**。

| 場合 | 用哪個 |
|------|--------|
| **網站 nav / hero / 任何頁面** | **中英文雙語版** ★ |
| 文宣、簡報、社交媒體 | **中英文雙語版** ★ |
| 對外溝通預設 | **中英文雙語版** ★ |
| 純英文 partner 簽署文件(法律要單語) | 純英文版(備用) |
| 純中文政府公文(法律要單語) | 純中文版(備用) |

**不切換語言、不單獨用純中文版、不單獨用純英文版**(除非有法律/合約強制單語要求)。

---

## 主視覺 ★(中英文雙語版,網站使用)

兩個版本擇一,99% 場合用這兩個:

### `aia-logo-main.svg` — 淺底主視覺
- Drive 原檔:`《網站淺底主視覺》logo 淺色_白底 中英文.svg`
- 用於:nav 列、首頁、白底文宣、所有淺色背景
- 組成:灰 A + navy 文字「亞太包容創新協會」+「APAC Authentic Inclusion Association」
- WCAG:navy 11.80:1 AAA / 灰 5.57:1 AA ✓

### `aia-logo-dark.svg` — 深底主視覺
- Drive 原檔:`《網站深底主視覺》logo 淺色_深色 中英文.svg`
- 用於:footer、深色 CTA、深色 hero panel
- 組成:暖陽金 A + 灰白文字(中英文並陳)
- WCAG:暖陽金 6.58:1 AA / 灰白 8.85:1 AAA ✓

**兩個版本內容完全一致,只是配色針對底色調整。**

---

## 其他變體(各場景備用)

### 依佈局切版(仍是中英文雙語)

| Hub asset | Drive 原檔 | 用途 |
|-----------|-----------|------|
| `aia-logo-vertical-light.svg` | `logo 淺色_直式 淺中英文.svg` | 直式佈局 + 淺色底(垂直海報、側欄) |
| `aia-logo-vertical-dark.svg` | `logo 淺色_直式 深中英文.svg` | 直式佈局 + 深色底 |

### 特殊用途(仍是中英文雙語)

| Hub asset | Drive 原檔 | 用途 |
|-----------|-----------|------|
| `aia-logo-gradient.svg` | `logo 淺色_漸層中英文.svg` | ⚠ 漸層 hero panel。**網站避免使用**(內建漸層底,與設計衝突)。適合獨立 banner、社交媒體封面、印刷海報 |
| `aia-logo-black.svg` | `logo 淺色_黑底 中英文.svg` | 極深色/黑底場合(自帶近黑面板) |

### 印刷單色(仍是中英文雙語)

| Hub asset | Drive 原檔 | 用途 |
|-----------|-----------|------|
| `aia-logo-90k.svg` | `logo 淺色_90k 中英文.svg` | 印刷單色 90% K(優先用) |
| `aia-logo-80k.svg` | `logo 淺色_80k 中英文.svg` | 印刷單色 80% K(備用,90K 對比更好) |

### 單語版(僅特殊場合,不得已才用)

| Hub asset | Drive 原檔 | 何時用 |
|-----------|-----------|--------|
| `aia-logo-zh.svg` | `logo 淺色_白底中文.svg` | 純中文政府公文要求單語時 |
| `aia-logo-en.svg` | `logo 淺色_白底英文.svg` | 純英文 partner 文件要求單語時 |
| `aia-logo-dark-zh.svg` | `logo 淺色_深色中文.svg` | 同上,深底版 |
| `aia-logo-dark-en.svg` | `logo 淺色_深色英文.svg` | 同上,深底版 |

⚠ **網站、文宣、預設場景一律不用這四個。用中英文雙語版。**

---

## WCAG 對比結果(摘要)

| 變體 | 主要色 vs 底色 | 對比 | 判定 |
|------|---------------|------|------|
| `aia-logo-main.svg` 淺底主視覺 | navy #003B5C / 白 | 11.80:1 | AAA ✓ |
| `aia-logo-main.svg` 淺底主視覺 | 灰 #686868 / 白 | 5.57:1 | AA ✓ |
| `aia-logo-dark.svg` 深底主視覺 | 暖陽金 #F8B62D / navy #003B5C | 6.58:1 | AA ✓ |
| `aia-logo-dark.svg` 深底主視覺 | 灰白 #DFDFDF / navy | 8.85:1 | AAA ✓ |
| `aia-logo-90k.svg` | 灰白 / 90K 暗灰(面板上) | 7.72:1 | AAA ✓ |
| `aia-logo-80k.svg` | 暖陽金 / 80K 暗灰(面板上) | 3.94:1 | △ 邊界(small text 不過) |
| `aia-logo-gradient.svg` | 暖陽金 / 漸層 sky-blue 區 | ~1.5:1 | ℹ logo 文字依 WCAG 1.4.3 logotype 豁免 |

詳細審計:`audit-r1/AIA-logo-主視覺與參考.png`(本地)

---

## HTML 引用範例

```html
<!-- 標準 nav logo(淺底)-->
<img src="/assets/logos/aia-logo-main.svg"
     alt="亞太包容創新協會 APAC Authentic Inclusion Association"
     width="200" />

<!-- 深色 footer -->
<img src="/assets/logos/aia-logo-dark.svg"
     alt="亞太包容創新協會 APAC Authentic Inclusion Association" />
```

alt 文字一律包含中英文機構全名(讀屏使用者能聽到完整身份)。

---

## 設計決策歷史

為什麼 2026-05-16 全面換新版:

1. **中英文合併為單一雙語 logo**(核心決策)
   反映 AIA 雙重身份。不另做語言切換邏輯,降低實作成本,
   中英讀者一眼都能識別。

2. **移除暖陽金 A 字**(a11y 修正)
   舊版黃色 A 對白底對比 1.79:1,WCAG 2.2 AA 不通過。
   新版淺底改用 navy + 灰雙色,通過 AA + AAA。

3. **移除「社團法人」四字**
   (法律全名考量,不另記載詳細原因)

舊版已封存於 `pages/archive/brand-style-guide-2026-04.html`,
僅供歷史對照,不可引用為當前規範。

---

## 更新流程

設計師之後若有新版,放回 Drive `516-logo-update/`(或新版本資料夾),
**hub repo 端的檔名保持不變**(`aia-logo-main.svg` 等),只更新檔案內容。
這樣引用這些檔案的 HTML 不需要改。
