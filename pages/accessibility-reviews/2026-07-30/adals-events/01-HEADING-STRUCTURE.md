# ADALS 活動頁 Heading 結構建議

- 日期：2026-07-30
- 範圍：ADALS 活動頁 live rendered DOM
- 目的：逐項說明目前 38 個 heading，提供可直接在 WordPress／Kadence 執行的修改對照。

## 先說結論

目前共有 38 個 heading：H1 × 0、H2 × 24、H3 × 6、H4 × 8。

建議完成後：H1 × 1、H2 × 5、H3 × 21、H4 × 0。

- 活動正式名稱：唯一 H1。
- 關於本次論壇、講者、活動時程表、售票方案、社群媒體：H2。
- 三位講者姓名、14 個時程項目、4 種票券名稱：H3。
- 英文標語、「包含／Includes」、頁尾重複活動名稱與標語：一般文字，不進入 heading 導覽。
- `READ ENGLISH BIO`：維持展開控制，不是 heading；另依主報告補上講者姓名作為可辨識名稱。

## 判斷原則

Heading 是頁面大綱，不是控制字體大小的工具。

- 一頁使用一個 H1，代表此頁主題。
- 主要內容區塊使用 H2。
- 區塊內的人物、活動項目與票券卡片使用 H3。
- 說明文字、口號、重複宣傳文字與「包含／Includes」不需要成為 heading。
- 修改 HTML Tag 不代表需要改字級、顏色、留白或排版；現有視覺樣式可以保留。
- 不依字體大小選 H1–H6，而依內容的父子關係選擇。

## 目前的完整 heading map

```text
H2  2026亞太資訊無障礙與數位共融領導力論壇
  H3  Shaping Inclusive Futures For Asia Pacific
H2  關於本次論壇
H2  講者
H2  王馥明 Frances West
H2  植木真 | Makoto Ueki
H2  張凱萍 Claire Chang
H2  活動時程表
H2  報到、展區開放、早茶交流
H2  開幕（長官致詞）
H2  主軸破題（理事長）
H2  Keynote 1：AI × 無障礙（國際講者）
H2  Keynote 2：高齡 × 無障礙（日方視角）
H2  茶歇／展區交流
H2  高峰對談：亞太區域觀點（3–4 位與談）
H2  午餐／展區
H2  平行分軌（至多一條）＋主軸軌
H2  企業實踐案例（本地／國際）
H2  茶歇
H2  白皮書發表／政策對話
H2  閉幕與區域展望（理事長或副理事長）
H2  交流茶會／輕食
H2  售票方案 TickeTS
  H3  早鳥優惠 Early Bird
    H4  包含
    H4  Includes:
  H3  一般入場 Gen. Admission
    H4  包含
    H4  包含
  H3  學生 / 非營利組織 STUDENT / NGO
    H4  包含
    H4  包含
  H3  純線上參與 ONLINE ONLY
    H4  包含
    H4  包含
H2  2026亞太資訊無障礙與數位共融領導力論壇
  H3  Shaping Inclusive Futures For Asia Pacific
H2  社群媒體 SOCIALS
```

## 各區塊判斷與修改方式

| 位置 | 目前狀況 | 使用者在 heading 導覽中會得到的結構 | 建議 |
|---|---|---|---|
| 頁首活動名稱 | H2，頁面沒有 H1 | 無法從 heading 清單直接辨識此頁的唯一主題 | 改為全頁唯一 H1；外觀維持原設計 |
| 英文標語 | H3 | 會被當成活動名稱底下的子標題 | 改為一般文字並標示 `lang="en"` |
| 主要區塊 | 「關於本次論壇」「講者」「活動時程表」「售票方案」「社群媒體」皆為 H2 | 這五項適合作為頁面主要區塊 | 保留 H2 |
| 三位講者姓名 | 與「講者」區塊同為 H2 | 區塊名稱和人物姓名被視為同一層 | 三位姓名改為 H3 |
| 14 個時程項目 | 與「活動時程表」同為 H2 | 區塊名稱和每筆時程被視為同一層 | 14 個時程項目改為 H3 |
| 四種票券名稱 | 已使用 H3 | 正確表達「售票方案」底下的四個子項目 | 保留 H3 |
| 八個「包含／Includes」 | 使用 H4 | 每張票券出現兩個重複低階標題，但它們只是內容標籤 | 改為一般文字；需要強調時用粗體樣式 |
| 頁尾重複活動名稱與標語 | 再次使用 H2、H3 | heading 清單後段再次出現同一組活動名稱 | 改為一般文字，視覺可維持原樣 |
| `READ ENGLISH BIO` | `summary` 展開控制 | 它是互動控制，不屬於 heading 大綱 | 維持非 heading；可辨識名稱加入講者姓名 |

## 38 個 heading 逐項修改對照

| # | 畫面文字 | 目前 | 建議 | 動作 |
|---:|---|---:|---:|---|
| 1 | 2026亞太資訊無障礙與數位共融領導力論壇（頁首） | H2 | H1 | 改 HTML Tag，保留樣式 |
| 2 | Shaping Inclusive Futures For Asia Pacific（頁首） | H3 | 一般文字 | 改 Paragraph／Advanced Text，標示 `lang="en"` |
| 3 | 關於本次論壇 | H2 | H2 | 不需修改 |
| 4 | 講者 | H2 | H2 | 不需修改 |
| 5 | 王馥明 Frances West | H2 | H3 | 改 HTML Tag，保留樣式 |
| 6 | 植木真 \| Makoto Ueki | H2 | H3 | 改 HTML Tag，保留樣式 |
| 7 | 張凱萍 Claire Chang | H2 | H3 | 改 HTML Tag，保留樣式 |
| 8 | 活動時程表 | H2 | H2 | 不需修改 |
| 9 | 報到、展區開放、早茶交流 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 10 | 開幕（長官致詞） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 11 | 主軸破題（理事長） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 12 | Keynote 1：AI × 無障礙（國際講者） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 13 | Keynote 2：高齡 × 無障礙（日方視角） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 14 | 茶歇／展區交流 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 15 | 高峰對談：亞太區域觀點（3–4 位與談） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 16 | 午餐／展區 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 17 | 平行分軌（至多一條）＋主軸軌 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 18 | 企業實踐案例（本地／國際） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 19 | 茶歇 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 20 | 白皮書發表／政策對話 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 21 | 閉幕與區域展望（理事長或副理事長） | H2 | H3 | 改 HTML Tag，保留樣式 |
| 22 | 交流茶會／輕食 | H2 | H3 | 改 HTML Tag，保留樣式 |
| 23 | 售票方案 TickeTS | H2 | H2 | 不需修改；英文大小寫可由內容團隊另行確認 |
| 24 | 早鳥優惠 Early Bird | H3 | H3 | 不需修改 |
| 25 | 包含（早鳥優惠） | H4 | 一般文字 | 改 Paragraph／Advanced Text，可保留粗體 |
| 26 | Includes:（早鳥優惠） | H4 | 一般文字 | 改 Paragraph／Advanced Text，標示 `lang="en"` |
| 27 | 一般入場 Gen. Admission | H3 | H3 | 不需修改 |
| 28 | 包含（一般入場，中文） | H4 | 一般文字 | 改 Paragraph／Advanced Text，可保留粗體 |
| 29 | 包含（一般入場，英文區） | H4 | 一般文字 | 改 Paragraph／Advanced Text；若原意是英文標籤，內容文字另行確認 |
| 30 | 學生 / 非營利組織 STUDENT / NGO | H3 | H3 | 不需修改 |
| 31 | 包含（學生／非營利組織，中文） | H4 | 一般文字 | 改 Paragraph／Advanced Text，可保留粗體 |
| 32 | 包含（學生／非營利組織，英文區） | H4 | 一般文字 | 改 Paragraph／Advanced Text；若原意是英文標籤，內容文字另行確認 |
| 33 | 純線上參與 ONLINE ONLY | H3 | H3 | 不需修改 |
| 34 | 包含（純線上參與，中文） | H4 | 一般文字 | 改 Paragraph／Advanced Text，可保留粗體 |
| 35 | 包含（純線上參與，英文區） | H4 | 一般文字 | 改 Paragraph／Advanced Text；若原意是英文標籤，內容文字另行確認 |
| 36 | 2026亞太資訊無障礙與數位共融領導力論壇（頁尾重複） | H2 | 一般文字 | 改 Paragraph／Advanced Text，保留樣式 |
| 37 | Shaping Inclusive Futures For Asia Pacific（頁尾） | H3 | 一般文字 | 改 Paragraph／Advanced Text，標示 `lang="en"` |
| 38 | 社群媒體 SOCIALS | H2 | H2 | 作為獨立 footer 區塊時保留 H2 |

## 建議的完整 heading map

```text
H1  2026亞太資訊無障礙與數位共融領導力論壇
    一般文字  Shaping Inclusive Futures For Asia Pacific
H2  關於本次論壇
H2  講者
  H3  王馥明 Frances West
  H3  植木真 | Makoto Ueki
  H3  張凱萍 Claire Chang
H2  活動時程表
  H3  報到、展區開放、早茶交流
  H3  開幕（長官致詞）
  H3  主軸破題（理事長）
  H3  Keynote 1：AI × 無障礙（國際講者）
  H3  Keynote 2：高齡 × 無障礙（日方視角）
  H3  茶歇／展區交流
  H3  高峰對談：亞太區域觀點（3–4 位與談）
  H3  午餐／展區
  H3  平行分軌（至多一條）＋主軸軌
  H3  企業實踐案例（本地／國際）
  H3  茶歇
  H3  白皮書發表／政策對話
  H3  閉幕與區域展望（理事長或副理事長）
  H3  交流茶會／輕食
H2  售票方案 TickeTS
  H3  早鳥優惠 Early Bird
      一般文字  包含／Includes
  H3  一般入場 Gen. Admission
      一般文字  包含／Includes
  H3  學生 / 非營利組織 STUDENT / NGO
      一般文字  包含／Includes
  H3  純線上參與 ONLINE ONLY
      一般文字  包含／Includes
    一般文字  頁尾重複活動名稱與英文標語
H2  社群媒體 SOCIALS
```

## WordPress／Kadence 實作步驟

1. 進入「頁面 → 全部頁面 → 論壇活動 → 編輯」。
2. 打開左上角「清單檢視」，依本文件的 38 項對照尋找對應文字。
3. 選取 Kadence Advanced Heading 時，在右側區塊設定尋找 `HTML Tag`／`Heading Tag`，只更改 H1、H2、H3。
4. 使用 WordPress 核心 Heading block 時，從區塊工具列更改 heading level。
5. 需要改成一般文字的英文標語、「包含／Includes」與頁尾重複標題：
   - 若現有區塊可把 HTML Tag 設為 `p` 或 `div`，直接改 tag。
   - 若該區塊只支援 H1–H6，改用 Paragraph／Kadence Advanced Text，再套用原本字級、顏色與間距。
6. 不要以 H1–H6 控制視覺大小。先確定語意層級，再以 typography 設定維持原設計。
7. `READ ENGLISH BIO` 保持 `details/summary` 展開控制，不要改成 heading。
8. 儲存草稿後先預覽，確認 heading tag 調整後既有版面樣式維持一致。

## 複查清單

- DOM 中 H1 正好 1 個，文字為活動正式名稱。
- H2 正好 5 個：關於本次論壇、講者、活動時程表、售票方案、社群媒體。
- H3 正好 21 個：3 位講者、14 個時程項目、4 種票券。
- H4 為 0；「包含／Includes」仍看得到，但不出現在 heading 清單。
- 頁尾重複活動名稱與英文標語仍看得到，但不出現在 heading 清單。
- `READ ENGLISH BIO` 可展開，但不出現在 heading 清單；每個控制名稱可辨識講者。
- heading 層級依序為 H1 → H2 → H3，沒有從 H1 直接跳到 H3/H4。
- 更改 tag 後，桌面與手機的字級、顏色、間距和原設計一致。
- 以瀏覽器 Accessibility Tree 或螢幕閱讀器 heading list 複查完整順序。
