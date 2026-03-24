import "./globals.css";
import type { ReactNode } from "react";
import {
  NATIVE_LANDING_BODY_CLASSNAME,
  NATIVE_LANDING_HEAD_STYLE,
  NATIVE_LANDING_HTML_CLASSNAME,
  NATIVE_LANDING_TAILWIND_CONFIG,
  NATIVE_LANDING_TITLE
} from "@/lib/native-original-head";

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi" className={NATIVE_LANDING_HTML_CLASSNAME}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{NATIVE_LANDING_TITLE}</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
        />
        <script
          type="text/javascript"
          src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r105/three.min.js" />
        <script src="https://cdn.jsdelivr.net/npm/panolens@0.11.0/build/panolens.min.js" />
        <script
          id="tailwind-config"
          dangerouslySetInnerHTML={{ __html: NATIVE_LANDING_TAILWIND_CONFIG }}
        />
        <style dangerouslySetInnerHTML={{ __html: NATIVE_LANDING_HEAD_STYLE }} />
      </head>
      <body className={NATIVE_LANDING_BODY_CLASSNAME}>{children}</body>
    </html>
  );
}
