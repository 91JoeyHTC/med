/** @type {import('tailwindcss').Config} */
// B&O 純白藝廊風 token（對齊《UIUX》§2 與 spec.colors）。
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: '#FFFFFF',
        tile: '#F4F1EC',
        paper: '#FAF8F4',
        ink: '#1A1A1A',
        muted: '#6B6B6B',
        muted3: '#9A9A9A',
        hairline: '#E8E4DD',
        thunderbird: '#B0714A', // 火・雷鳥（銅）
        turtle: '#8A8C5E',      // 土・海龜（橄欖）
        butterfly: '#7BA39A',   // 風・蝴蝶（尤加利）
        frog: '#5E7A8C',        // 水・青蛙（暖岩藍）
        cosmosgold: '#C8A77A',  // 中心造物者・標記 B
      },
      fontFamily: {
        sans: ['Inter', 'PingFang TC', 'Noto Sans TC', '-apple-system', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif TC', 'serif'],
      },
      borderRadius: { sharp: '2px' }, // B&O 銳角原則
      transitionTimingFunction: { standard: 'cubic-bezier(0.4,0,0.2,1)' },
    },
  },
  plugins: [],
};
