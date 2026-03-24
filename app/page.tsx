import { Fragment } from "react";
import Script from "next/script";
import { getOriginalLanding } from "@/lib/original-landing";

export default function HomePage() {
  const landing = getOriginalLanding();

  return (
    <>
      {landing.bodyChunks.map((chunk, index) => {
        if (chunk.type === "script") {
          return (
            <Script
              id={`original-inline-script-${index}`}
              key={`script-${index}`}
              strategy={index === 0 ? "beforeInteractive" : "afterInteractive"}
            >
              {chunk.content}
            </Script>
          );
        }

        return (
          <Fragment key={`html-${index}`}>
            <div
              suppressHydrationWarning
              style={{ display: "contents" }}
              dangerouslySetInnerHTML={{ __html: chunk.content }}
            />
          </Fragment>
        );
      })}
    </>
  );
}
