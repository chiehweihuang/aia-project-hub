# AIA Logo Assets

更新日期:2026-05-17
源檔來自:`516-logo-update/`(設計師 5/16 交付,Drive 同步)

---

## 命名對照(hub repo asset name ↔ designer Drive 原檔名)

| Hub asset (英文) | Drive 原檔名 (中文) | 用途 |
|------|------|------|
| **`aia-logo-main.svg`** ★ | `★ 網站主視覺 - logo 淺色_白底 中英文.svg` | **網站主視覺(淺底)— nav 列、首頁、預設使用** |
| **`aia-logo-dark.svg`** ★ | `★ 深底主視覺 - logo 淺色_深色 中英文.svg` | **深底主視覺 — footer、深色 CTA、深底 hero** |
| `aia-logo-zh.svg` | `logo 淺色_白底中文.svg` | 純中文場合(淺底) |
| `aia-logo-en.svg` | `logo 淺色_白底英文.svg` | 純英文場合(淺底) |
| `aia-logo-dark-zh.svg` | `logo 淺色_深色中文.svg` | 深底純中文 |
| `aia-logo-dark-en.svg` | `logo 淺色_深色英文.svg` | 深底純英文 |
| `aia-logo-gradient.svg` | `logo 淺色_漸層中英文.svg` | 漸層 hero panel |
| `aia-logo-black.svg` | `logo 淺色_黑底 中英文.svg` | 極深色/黑底場合(自帶近黑面板) |
| `aia-logo-90k.svg` | `logo 淺色_90k 中英文.svg` | 印刷單色 90% K |
| `aia-logo-80k.svg` | `logo 淺色_80k 中英文.svg` | 印刷單色 80% K(備用,90K 對比更好) |
| `aia-logo-vertical-dark.svg` | `logo 淺色_直式 深中英文.svg` | 直式佈局 + 深色底 |
| `aia-logo-vertical-light.svg` | `logo 淺色_直式 淺中英文.svg` | 直式佈局 + 淺色底 |

---

## WCAG 對比結果(摘要)

| 變體 | 主要色 vs 底色 | 對比 | 判定 |
|------|---------------|------|------|
| `aia-logo-main.svg` 主視覺 | navy #003B5C / 白 | 11.80:1 | AAA ✓ |
| `aia-logo-main.svg` 主視覺 | 灰 #686868 / 白 | 5.57:1 | AA ✓ |
| `aia-logo-dark.svg` | 金 #F8B62D / navy #003B5C | 6.58:1 | AA ✓ |
| `aia-logo-dark.svg` | 灰白 #DFDFDF / navy | 8.85:1 | AAA ✓ |
| `aia-logo-90k.svg` | 灰白 / 90K 暗灰(面板上) | 7.72:1 | AAA ✓ |
| `aia-logo-80k.svg` | 金 / 80K 暗灰(面板上) | 3.94:1 | △ 邊界(small text 不過) |
| `aia-logo-gradient.svg` | 黃 / 漸層 sky-blue 區 | ~1.5:1 | ℹ logo 文字依 WCAG 1.4.3 logotype 豁免 |

詳細審計:`audit-r1/AIA-logo-主視覺與參考.png`(本地)

---

## 使用建議

### 網站(本 hub repo / 主站)
- **預設用 `aia-logo-main.svg`** — 已通過 AAA,適用所有白底場合
- 深底場合(footer / deep CTA section)用 `aia-logo-dark.svg`
- 不要用任何舊版含暖陽金 A 字的 logo(WCAG 1.79:1 不通過)

### HTML 引用範例
```html
<!-- 標準 nav logo -->
<img src="/assets/logos/aia-logo-main.svg"
     alt="亞太包容創新協會 APAC Authentic Inclusion Association"
     width="200" />

<!-- 深色 footer -->
<img src="/assets/logos/aia-logo-dark.svg"
     alt="亞太包容創新協會 APAC Authentic Inclusion Association" />
```

### 印刷品
- 一般彩印:`aia-logo-main.svg`(或 `aia-logo-dark.svg`,依底色)
- 單色印刷:**優先 `aia-logo-90k.svg`**,80K 是備用

---

## 更新流程

設計師之後若有新版,放回 `516-logo-update/`(或新版本資料夾),
**hub repo 端的檔名保持不變**(`aia-logo-main.svg` 等),只更新檔案內容。
這樣引用這些檔案的 HTML 不需要改。
