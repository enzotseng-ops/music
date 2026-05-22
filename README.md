# Metronome

傳統鐘擺式節拍器，以 SVG 動畫呈現不同速度的節拍。

- **BPM 範圍**：40–240
- **視覺**：SVG 鐘擺左右擺動，端點與節拍同步
- **音效**：Web Audio API 排程播放，與動畫精準對齊
- **主題**：深淺色切換，localStorage 持久化
- **技術棧**：Vite + React + TypeScript

## 開發

```bash
npm install
npm run sounds   # 生成 tick.wav / tick-accent.wav 到 public/sounds/
npm run dev      # http://localhost:5173
```

## 建置

```bash
npm run build
npm run preview
```

## 結構

```
src/
├── lib/
│   ├── audio.ts          # AudioContext singleton + buffer loader
│   └── tempo.ts          # BPM 範圍與速度術語 (Largo, Allegro ...)
├── hooks/
│   ├── useMetronome.ts   # rAF + Web Audio scheduler 核心
│   ├── useAudioBuffers.ts
│   └── useTheme.ts
├── components/
│   ├── Metronome.tsx     # 主容器
│   ├── Pendulum.tsx      # SVG 鐘擺
│   ├── BpmDisplay.tsx
│   ├── BpmControls.tsx
│   ├── PlayButton.tsx
│   └── ThemeToggle.tsx
└── styles/theme.css      # CSS variables，深淺色主題
```

## 核心邏輯

- 一拍週期 `T = 60 / BPM` 秒
- 擺臂角度 `angle(t) = ±30° × cos(πt / T)` — 端點剛好對應拍點
- 音效排程使用 Web Audio scheduler pattern：每 25 ms 排程未來 100 ms 內的拍點，避免 timer drift
- BPM 即時變更會反推 startTime 保證擺臂位置連續、不跳位

## 自訂音效

`public/sounds/tick.wav` 是 `scripts/generate-sounds.mjs` 用 Web Audio 合成的簡單 click 聲。想換成真實 wood block 錄音，直接覆蓋同名檔案即可（保留 `.wav` 副檔名）。
