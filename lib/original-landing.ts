import { ORIGINAL_INDEX_HTML } from "@/lib/original-index-html";

export type OriginalLandingChunk = {
  type: "html" | "script";
  content: string;
};

export type OriginalLanding = {
  title: string;
  htmlClassName: string;
  bodyClassName: string;
  tailwindConfig: string;
  headStyle: string;
  bodyChunks: OriginalLandingChunk[];
};

let cachedLanding: OriginalLanding | null = null;

function normalizeContent(value: string): string {
  return value.replace(/\r\n/g, "\n").trim();
}

function matchOrDefault(source: string, pattern: RegExp, fallback = ""): string {
  const match = source.match(pattern);
  return match?.[1]?.trim() ?? fallback;
}

function splitBodyChunks(bodyInnerHtml: string): OriginalLandingChunk[] {
  const chunks: OriginalLandingChunk[] = [];
  const scriptPattern = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = scriptPattern.exec(bodyInnerHtml)) !== null) {
    const htmlBeforeScript = bodyInnerHtml.slice(lastIndex, match.index).trim();
    if (htmlBeforeScript) {
      chunks.push({ type: "html", content: htmlBeforeScript });
    }

    const inlineScript = match[1]?.trim();
    if (inlineScript) {
      chunks.push({ type: "script", content: inlineScript });
    }

    lastIndex = match.index + match[0].length;
  }

  const htmlAfterLastScript = bodyInnerHtml.slice(lastIndex).trim();
  if (htmlAfterLastScript) {
    chunks.push({ type: "html", content: htmlAfterLastScript });
  }

  return chunks;
}

export function getOriginalLanding(): OriginalLanding {
  if (cachedLanding) {
    return cachedLanding;
  }

  const html = normalizeContent(ORIGINAL_INDEX_HTML);
  const title = matchOrDefault(html, /<title>([\s\S]*?)<\/title>/i, "Sunshine Bay Retreat Vũng Tàu");
  const htmlClassName = matchOrDefault(html, /<html[^>]*class="([^"]*)"/i);
  const bodyClassName = matchOrDefault(html, /<body[^>]*class="([^"]*)"/i);
  const tailwindConfig = matchOrDefault(
    html,
    /<script[^>]*id="tailwind-config"[^>]*>([\s\S]*?)<\/script>/i
  );
  const headStyle = matchOrDefault(html, /<style>([\s\S]*?)<\/style>/i);
  const bodyInnerHtml = matchOrDefault(html, /<body[^>]*>([\s\S]*?)<\/body>/i);

  cachedLanding = {
    title,
    htmlClassName,
    bodyClassName,
    tailwindConfig,
    headStyle,
    bodyChunks: splitBodyChunks(bodyInnerHtml)
  };

  return cachedLanding;
}
