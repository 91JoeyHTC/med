# Handoff: 藥輪 App（Medicine Wheel）— 知識盤 / 個人盤 / 合盤

## Overview
「藥輪 App」是一個把北美原住民藥輪（Sun Bear / 春花媽詮釋的台灣藥輪）數位化的瀏覽＋繪盤平台，給學員與一般使用者。核心是一張共用的 **36 位置藥輪盤**，搭配三種使用模式：

- **M1 知識盤**：點擊盤面任一節點 → 右側顯示該位置的知識卡（關鍵句、議題、動植礦、家族/方位/月份對應）。另含 7 篇「藥輪總論」基礎理論。
- **M2 個人盤**：輸入生日 → 自動推算「本命月份／本命方位／本命家族」三點並標在盤上；可再填 6 隻守護靈動物與其落點（1–36），即時繪環；自動計算「家族平衡」（主導元素／缺席元素＝此生課題）。
- **M3 合盤**：勾選合盤模式 → 同時疊合 A、B 兩人雙色標記，並判定兩人本命家族的相合關係（同族／半合／雙合對立）。

目前狀態：**可運作的前端原型**，所有計算（生日→本命、家族平衡、相合）都是真的在前端跑，無後端。

## About the Design Files
本資料夾的 `prototypes/*.dc.html` 是**用 HTML 製作的設計參考稿**（呈現預期外觀與互動的原型），**不是要直接搬進產品的程式碼**。任務是把這些設計**在目標程式環境中重建**——依《工程開發文件》規劃為 **React + Tailwind（Vercel）/ NestJS / Python FastAPI**。若你尚未建立環境，請依該文件選擇框架後實作。

> ⚠️ 這些 `.dc.html` 是一種「Design Component」格式：檔頭引用的 `support.js` 是預覽用的執行期 runtime，**不要移植它**。你只需要參考其中的「模板結構 + 樣式 + 演算法邏輯」並用你自己的框架重寫。直接用瀏覽器開啟 `.dc.html` 即可預覽原型（需連網載入 Google Fonts）。

## Fidelity
**High-fidelity（hifi）**。顏色、字體、間距、互動都是最終規格，請像素級重建。盤面幾何（極座標、半徑、角度）是精確的，照抄即可得到相同版面。

本包提供**兩個視覺版本**，邏輯/資料/幾何完全相同，只差配色與外框樣式：

| 檔案 | 風格 | 說明 |
|---|---|---|
| `藥輪 App BO.dc.html` | **Bang & Olufsen 純白藝廊風（推薦／最新）** | 白底、墨黑字、暖金屬點綴、銳角、髮絲線、底線分頁、無陰影。本 README 的 token 表以此版為準。 |
| `藥輪 App.dc.html` | 深色夜空風（初版備份） | 深紫夜空底、紫色主色、圓角卡片。保留作對照。 |

請以 **B&O 版**為實作基準，除非另有指示。

---

## Screens / Views

整個 App 是**單一頁面**：頂部置中頁首 → 底線分頁切換（知識盤／繪盤）→ 雙欄版面（左：sticky 藥輪 SVG＋圖例；右：依模式顯示的面板）。最大寬度 1280px，置中，桌面優先。

### 共用：藥輪盤（SVG，左欄）
- 容器 `flex:0 0 560px`，`position:sticky; top:10px`。SVG `viewBox="0 0 560 560"`，寬 100%。
- 幾何中心 `CX=CY=280`。極座標換算：`angle` 以「12 點鐘為 0°、順時針」計，公式 `x = CX + r·cos((a−90)°)`, `y = CY + r·sin((a−90)°)`。
- **節點層級與半徑**：
  - 中心「造物者」(id 1)：r=19，圓心 (280,280)。
  - 中央群集衛星 8 顆 (id 2–8)：半徑 `R_SAT=58`，固定角度 `CENTERANG = {2:102.86,3:154.29,4:205.71,5:257.14,6:308.57,7:0,8:51.43}`，節點 r=17。其中 2/3/4＝天群（大地/太陽/月亮），5/6/7/8＝地群四家族（海龜/青蛙/雷鳥/蝴蝶）。
  - 路徑 12 條 (id 25–36)：沿四方位輻條向內，半徑三段 `R_PATH=[154,119,84]`（外→內），方位角 `PATHDIR={北:0,東:90,南:180,西:270}`，節點 r=15。
  - 外圈 (半徑 `R_OUTER=196`)：四方位 (id 9–12，節點 r=25) ＋ 十二月亮 (id 13–24，節點 r=23)，依 `PERIM` 陣列每 22.5° 一個（共 16 格＝4 方位＋12 月）。
  - 外圈框線：`circle r=196 stroke #E8E4DD`。四條輻條：中心→方位節點，`stroke #E8E4DD strokeWidth 1.2`。
- **點擊行為**：知識盤模式下，點任一節點 → 右側知識卡切換到該 id。繪盤模式下節點不可點（只顯示標記）。
- **節點標記層（繪盤模式）**：在本命/守護靈落點的節點外圈畫一個彩色 ring（`stroke=人物色, strokeWidth 3`）＋外側文字標籤（含白色描邊 halo `stroke #FFFFFF strokeWidth .7`）。合盤時 A/B 兩色 ring 以 5px 偏移錯開。
- **圖例**（盤下方）：5 個 11×11px 色塊（radius 2px）＋ 文字，對應四元素家族色與路徑色。

### M1 知識盤（右欄，預設）
- **知識卡**：白卡（`background #FFFFFF; border 1px #E8E4DD; border-radius 2px; padding 20px 22px`）。內含 h2 標題（Noto Serif TC, 18px, `#1A1A1A`）＋ 標籤列（小膠囊：`background #F4F1EC; border 1px #E8E4DD; color #6B6B6B; radius 2px; padding 3px 10px`）＋ 內文段落（`.kb`：13.5px，`b` 用 `#1A1A1A`，`.muted` 用 `#6B6B6B`，`.hint` 提示框用 `#FAF8F4` 底）。
- **藥輪總論卡**：白卡，h3「藥輪總論（基礎理論）」＋ 7 個 topic chip（`.topic-chip`：`#F4F1EC` 底、`#1A1A1A` 字、radius 2px、hover 底線）。點擊切換到對應總論長文。

### M2 個人盤（右欄，繪盤模式）
三張白卡（同上卡片樣式），間距 `margin-bottom:20px`：
1. **① 基本資料**：
   - 「對象」select（A／B）＋「暱稱」input，2 欄 grid。
   - 「生日」月 select ＋ 日 select（日數依月份動態：`[31,29,31,30,31,30,31,31,30,31,30,31]`）＋ **「推算本命」primary 按鈕**。
   - 按下後下方出現 natal 結果框（`#FAF8F4` 底、左側 3px 人物色邊、`border 1px #E8E4DD; radius 2px`）。
2. **② 七守護靈落點**：6 列 grid（`36px 1.25fr 1.45fr`，gap 10px）。每列：方位徽章（墨黑底白字方塊 `#1A1A1A`, radius 2px）＋ 動物名 input ＋ 落點 input（可逗號分隔多個，如 `18,23,32`）。第 1 隻「本命」由生日自動帶入。最下方有「合盤模式」checkbox（`accent-color #1A1A1A`）。
3. **盤面圖例與分析**：顯示守護靈清單、家族平衡統計、（合盤時）相合判定表。

### 表單/輸入元件樣式
`input, select`：`background #FFFFFF; border 1px #E8E4DD; color #1A1A1A; border-radius 2px; padding 8px 10px; font-size 14px`。focus 時 `border-color #1A1A1A`（無 outline）。
**Primary 按鈕**（推算本命）：`background #1A1A1A; color #fff; border 1px #1A1A1A; border-radius 2px; padding 9px 14px`。hover `filter brightness(0.9)`，active `scale(.98)`。

---

## Interactions & Behavior
- **分頁切換**：知識盤 ⇄ 繪盤。用 `mode` state（`'know'|'draw'`）。active 分頁＝墨黑字＋1px 墨黑底線；inactive＝灰字＋透明底線（B&O 底線式 tab，**不是填色膠囊**）。
  - ⚠️ 實作提醒：原型早期曾遇到「以物件樣式插值切 active 樣式不會在 re-render 更新」的坑；最終用 `mode` 條件直接渲染兩套字面樣式的按鈕解決。在 React 中用一般 conditional className 即可，無此問題。
- **點節點看知識**：知識盤模式下點 SVG 節點 → 設定 `activeKB=id`，右卡更新。
- **推算本命**：讀月/日 → 比對 `MONTHS[].range`（`[起月,起日,迄月,迄日]`，含跨年區間）找出月份 → 帶出 `本命月份 id / 方位 / 家族（由元素映射）/ 星座`。
- **即時繪環**：守護靈 input 變更 → 解析落點字串（分隔符 `, ，、空白`）→ 過濾合法 id（1–36）→ 重畫標記層。
- **合盤**：checkbox 開 → 標記層同時畫 A、B；分析區顯示兩人家族平衡 ＋ 相合判定。
- **動效**：B&O 取向，緩慢無彈跳。`--ease-standard: cubic-bezier(0.4,0,0.2,1)`，時長 150/300/600ms。節點 hover `filter brightness(0.93)`（輕微壓暗，非高亮）。

## State Management
單一元件的 state：
```
{
  mode: 'know' | 'draw',          // 分頁
  activeKB: number,               // 知識盤目前位置 id（1–36 或 'path'）
  activeGeneral: string | null,   // 目前選中的總論篇名（覆蓋 activeKB 顯示）
  who: 'A' | 'B',                 // 繪盤目前編輯對象
  overlay: boolean,               // 合盤模式
  people: {
    A: Person, B: Person
  }
}
Person = {
  name: string,
  bMon: string, bDay: string,
  natal: { id, fullmonth, dir, fam, elem, zod, famId, dirId } | null,
  g: [ { dir, name, posStr } × 6 ]   // 守護靈：天/地/北/東/南/西
}
```
- `natal` 只在按「推算本命」後產生。
- `people` 應可序列化存 localStorage / 後端（對應《PM》R1「我的盤」儲存）。

## Algorithms（前端，照《工程開發文件》§4）
1. **生日 → 本命月份**：遍歷 `MONTHS`，比對 `range=[m0,d0,m1,d1]`；正常區間 `m0<=m1` 用 AND 範圍，跨年（如 12/22–1/19）用 OR 範圍。找到月份後：
   - 本命家族 = 元素映射 `ELEM[elem].fam`，本命方位 = 月份 `dir`。
   - `famId = {海龜:5,青蛙:6,雷鳥:7,蝴蝶:8}`，`dirId = {北:9,東:10,南:11,西:12}`。
2. **家族平衡**：收集（本命月份 id ＋ 所有守護靈落點 id），對每個 id 取所屬家族（月份用元素→家族；5–8 直接是家族），累計四家族計數 → 標出「主導（最多）」與「缺席（為 0，＝此生課題）」。
3. **相合判定**（A、B 本命家族）：
   - 同族 → 「天生理解，能量加乘」。
   - 對立（`雷鳥↔蝴蝶`、`海龜↔青蛙`，即元素相反 火↔風 / 土↔水）→ 「雙合（對立）：互補極強、張力也大」。
   - 其餘相鄰 → 「半合（相鄰）：有共同語言，需磨合」。
   - 文案強調藥輪不採二元對立、無嚴格不合。
4. **金標測試案例**：生日 **10/15** → 本命「群鴨飛遷之月（渡鴉）／天秤／西方／蝴蝶家族・風」，盤上標出 月份 id 22、家族 id 8、方位 id 12。實作後請用此案例回歸測試。

完整資料表（`MONTHS` 12 筆含中英對應、`PATHNAME`/`PATHGLOSS` 路徑名與釋義、`KB` 知識卡內文、`GENERAL` 7 篇總論）已內嵌在原型 logic class，請直接從 `prototypes/藥輪 App BO.dc.html` 抽出沿用。逐字稿未深入處已在內文標註「未深入／待教材核對」。

---

## Design Tokens（B&O 版，與設計系統 `colors_and_type.css` 對齊）

### Colors — 介面
| 用途 | Hex |
|---|---|
| 頁面底 | `#FFFFFF` |
| 暖米卡/標籤底 (tile) | `#F4F1EC` |
| 淺紙底（提示框/路徑節點/natal 框） | `#FAF8F4` |
| 主前景墨黑 | `#1A1A1A` |
| 次要灰字 | `#6B6B6B` |
| 三級灰（免責聲明） | `#9A9A9A` |
| 髮絲線/分隔 | `#E8E4DD` |

### Colors — 盤面語意（暖金屬調，白字節點）
| 元素・家族 | Hex |
|---|---|
| 火・雷鳥 | `#B0714A`（銅） |
| 土・海龜 | `#8A8C5E`（橄欖） |
| 風・蝴蝶 | `#7BA39A`（尤加利） |
| 水・青蛙 | `#5E7A8C`（暖岩藍） |
| 路徑 25–36 節點 | 底 `#FAF8F4`、框/字 `#1A1A1A`；圖例方塊 `#3A3A3A` |
| 中心造物者 | 底 `#C8A77A`（宇宙金）、框/字 `#1A1A1A` |
| 天群衛星（大地/太陽/月亮） | 底 `#CFC9BD`（鋁）、字 `#1A1A1A` |
| 四方位節點 | 底 `#2A2A2A`、框＝該方位元素色、白字 |
| 標記 A | `#1A1A1A`（墨） |
| 標記 B | `#C8A77A`（金） |

> 家族衛星（5–8）填色＝對應元素色 ×0.82（壓暗）＋白字。

### Typography
- 頁首 eyebrow「Medicine Wheel」：Inter, 12px, `letter-spacing .24em`, uppercase, `#6B6B6B`, weight 500。
- H1 標題：Noto Serif TC, 40px, weight **300**, `letter-spacing .02em`, `#1A1A1A`。
- 卡片 h2：Noto Serif TC, 18px。
- 分頁/正文：Inter（西文）/ PingFang TC / Noto Sans TC，15px，`line-height 1.65`。
- 知識卡內文 `.kb`：13.5px。標籤/圖例/說明：12px。
- 字體載入：Google Fonts `Cormorant+Garamond`（B&O 顯示替代字，本介面標題實際用 Noto Serif TC）, `Inter`, `Noto Serif TC`, `Noto Sans TC`。

### Spacing / Radius / Shadow / Motion
- 容器最大寬 1280px，左右 padding 28px。雙欄 gap 34px。卡片內距 20–22px、卡間距 20px。分頁 gap 44px。
- Radius：介面元件一律 **2px**（B&O 銳角原則）；圖例色塊 2px。
- Shadow：**無**（flat，靠髮絲線分隔）。
- Motion：`cubic-bezier(0.4,0,0.2,1)`，150/300/600ms，無彈跳。

## Assets
- **無圖片資產**。藥輪盤完全由 SVG（`React.createElement` 繪製的 circle/line/text）生成，請在目標框架以 SVG 或 Canvas 重建。
- 字體全部來自 Google Fonts（見上）。
- 無 icon set（介面未用圖示）。

## Files
- `prototypes/藥輪 App BO.dc.html` — **B&O 版（實作基準）**。瀏覽器可直接開啟預覽。
- `prototypes/藥輪 App.dc.html` — 深色版（對照）。
- `prototypes/support.js` — 預覽用 runtime，**勿移植**。
- `source_docs/01_PM_功能架構說明書.md` — 產品願景、使用者、功能模組與 R1/R2 範圍。
- `source_docs/02_UIUX_介面設計文件.md` — 原始 UI/UX 規格（含 §2 設計 tokens、§5 盤面座標規格）。
- `source_docs/03_工程開發文件.md` — 技術棧、§4 演算法、§12 測試案例（金標）。
- `source_docs/00_README_交付索引.md` — 原始交付索引。

## 內容/倫理注意
工具以「能量互動模式」呈現，採**陪伴而非預言**原則；非醫療、心理諮商或法律建議。知識內容以春花媽詮釋與 Sun Bear 傳統為本，逐字稿未深入處務必保留「未深入／待教材核對」標註，勿自行補述。
