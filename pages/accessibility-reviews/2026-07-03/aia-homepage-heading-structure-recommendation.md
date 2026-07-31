# AIA 首頁 Headings 結構建議

日期：2026-07-03  
範圍：AIA 主站首頁 staging / mockup 的 heading 結構  
目的：讓頁面標題階層更清楚，方便鍵盤、螢幕閱讀器與後續維護。

## 判斷原則

Headings 不是拿來控制字體大小，而是拿來表示頁面結構。

比較好的做法是：

- 一頁只有一個 `h1`，通常是頁面主標題。
- 主要區塊用 `h2`。
- 區塊裡的卡片、時間軸項目、子項目用 `h3`。
- 不要因為字比較小，就用 `h5` 或 `h6`。
- 英文小字標籤，例如 `About Us`、`Our Values`、`JOIN US`，如果只是視覺標籤，建議用一般文字，不要設成 heading。
- 說明文字、口號、段落內文不要設成 heading。

## 目前看到的 heading map

```text
1 亞太包容創新協會
            4 連結國際無障礙領袖、台灣產業與政府及在地專業社群，落實數位包容，讓每個人都能平等共享。
    2 多元共融
    2 以人為本
    2 科技創新
                    6 About Us
    2 關於我們
    2 當生活幾乎一切都在螢幕上完成，有些人卻被擋在門外:
    2 許多人因身體狀況、年齡或數位落差，長期被排除在數位世界之外。
    2 打破現有的侷限，創造更友善的社會環境。
                    6 Our Values
    2 三大價值
                    6 Our Milestones
    2 協會大事記
                5 2024 / Apr
                5 2024 / Oct
                5 2024 / Nov
                5 2025 / Oct
                5 2026 / May
                5 2026 / Sep
                    6 What We Do
    2 我們創造什麼連結
                5 跨界對話Cross-Sector Dialogue
                5 國際接軌Global Standards
                5 從理念到落地Idea to Action
                    6 Areas of Focus
    2 我們關注的議題
                5 數位無障礙 Digital Accessibility
                5 包容性設計 Inclusive Design
                5 數位無障礙 International Standards
                5 齡共融科技 AgeTech & Aging-Friendly
                    6 JOIN US
    2 加入我們的行列
    2 社群媒體 SOCIALS
```

## 主要問題與建議

| 位置 | 目前狀況 | 為什麼是問題 | 建議 |
|---|---|---|---|
| Hero 說明文字 | `h4` | 這句是主標下的說明文字，不是下一層標題。從 `h1` 跳到 `h4` 也會讓標題階層變亂。 | 改成一般段落文字，例如 lead paragraph。 |
| `About Us`、`Our Values`、`Our Milestones`、`What We Do`、`Areas of Focus`、`JOIN US` | 都是 `h6` | 這些看起來像視覺上的英文小標籤，不是真的內容標題。用 `h6` 會讓螢幕閱讀器看到很多不必要的低階標題。 | 改成一般文字或 eyebrow label，不要設 heading。若要保留英文，建議加 `lang="en"`。 |
| `當生活幾乎一切都在螢幕上完成...` 等句子 | 多句段落被設成 `h2` | 這些是內文，不是區塊標題。使用者用 headings 導覽時，會聽到一串像標題的段落，反而不容易抓頁面結構。 | 改成 paragraph。 |
| `多元共融`、`以人為本`、`科技創新` | 目前是 `h2`，但出現在 `三大價值` 前面 | 如果它們是三大價值的卡片標題，應該放在 `三大價值` 下面，不應該和主要區塊同層。 | `三大價值` 用 `h2`，三個價值卡片用 `h3`。 |
| 大事記日期 | `h5` | `協會大事記` 是 `h2`，下面直接跳到 `h5`，中間跳過 `h3`、`h4`。 | 每個日期用 `h3`，日期下方說明用 paragraph。 |
| `What We Do` 卡片 | `h5` | 它們是 `我們創造什麼連結` 底下的子項目，不需要跳到 `h5`。 | `我們創造什麼連結` 用 `h2`，三張卡片用 `h3`。 |
| `Areas of Focus` 卡片 | `h5` | 同上，這些是 `我們關注的議題` 底下的子項目。 | `我們關注的議題` 用 `h2`，每個議題卡片用 `h3`。 |
| `數位無障礙 International Standards` | 中文與英文意思不一致 | 中文是「數位無障礙」，英文是「國際標準」，會讓內容理解不一致。 | 建議改成 `國際標準 International Standards`。 |
| `社群媒體 SOCIALS` | `h2` | 如果它是 footer 裡的獨立主要區塊，用 `h2` 可以；如果只是 `加入我們` 底下的子項目，用 `h3` 比較合理。 | 視版面決定：獨立 footer 區塊用 `h2`；屬於加入我們底下則用 `h3`。 |

## 建議 heading map

這是一個比較乾淨的版本。英文標籤可以保留在畫面上，但不要放進 heading 階層。

```text
1 亞太包容創新協會
    2 三大價值
        3 多元共融
        3 以人為本
        3 科技創新
    2 關於我們
    2 協會大事記
        3 2024 / Apr
        3 2024 / Oct
        3 2024 / Nov
        3 2025 / Oct
        3 2026 / May
        3 2026 / Sep
    2 我們創造什麼連結
        3 跨界對話 Cross-Sector Dialogue
        3 國際接軌 Global Standards
        3 從理念到落地 Idea to Action
    2 我們關注的議題
        3 數位無障礙 Digital Accessibility
        3 包容性設計 Inclusive Design
        3 國際標準 International Standards
        3 齡共融科技 AgeTech & Aging-Friendly
    2 加入我們的行列
    2 社群媒體 Socials
```

## 英文標籤建議

如果設計上想保留英文小字，例如 `About Us`、`Our Values`，建議這樣處理：

```html
<p class="section-label" lang="en">About Us</p>
<h2>關於我們</h2>
```

不要這樣處理：

```html
<h6>About Us</h6>
<h2>關於我們</h2>
```

原因是 `h6` 會進入 headings 導覽，但它其實只是視覺標籤，不是頁面結構。

## WordPress / Kadence 實作提醒

- 在 Kadence 或 WordPress block 裡，標題區塊要手動選正確 heading level。
- 視覺上想要小字，可以用樣式控制，不要用 `h5` / `h6` 來讓字變小。
- 卡片標題通常用 `h3`。
- 時間軸日期如果是每個里程碑的標題，建議用 `h3`。
- 段落、說明文字、口號不要設成 heading。

## 最小修改方向

如果時間有限，先做這幾件事就好：

1. 把 hero 說明文字從 `h4` 改成 paragraph。
2. 把所有英文 `h6` 小標籤改成一般文字。
3. 把 About Us 內文句子從 `h2` 改成 paragraph。
4. 把日期和卡片標題從 `h5` 改成 `h3`。
5. 保留主要區塊標題為 `h2`。

