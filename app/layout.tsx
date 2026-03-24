import "./globals.css";
import type { ReactNode } from "react";
import { getOriginalLanding } from "@/lib/original-landing";

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const landing = getOriginalLanding();

  return (
    <html lang="vi" className={landing.htmlClassName}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{landing.title}</title>
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
          dangerouslySetInnerHTML={{ __html: landing.tailwindConfig }}
        />
        <style dangerouslySetInnerHTML={{ __html: landing.headStyle }} />
      </head>
      <body className={landing.bodyClassName}>{children}</body>
    </html>
  );
}
