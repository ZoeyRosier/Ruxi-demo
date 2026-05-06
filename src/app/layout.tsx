// 此文件属于品牌层（根 layout，注入字体与主题上下文）
"use client";

// 离线字体：通过 @fontsource 在 build 期打包，避免依赖 Google Fonts 网络
import "@fontsource/orbitron/400.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/noto-serif-sc/400.css";
import "@fontsource/noto-serif-sc/700.css";
import "@fontsource/noto-serif-sc/900.css";

import { ThemeProvider } from "@/contexts/ThemeProvider";
import "./globals.css";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" data-theme="brand">
      <head>
        <title>入戏 Demo</title>
        <meta name="description" content="Step Into Drama demo app" />
      </head>
      <body>
        <ThemeProvider initial="brand">{children}</ThemeProvider>
      </body>
    </html>
  );
}
