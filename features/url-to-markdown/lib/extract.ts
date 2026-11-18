import { Defuddle } from "defuddle/node";
import { parseHTML } from "linkedom";

export type Extracted = {
  title: string;
  author: string;
  site: string;
  url: string;
  markdown: string;
};

export class FetchFailedError extends Error {}
export class EmptyContentError extends Error {}

/** 페이지 HTML을 가져와 defuddle로 본문만 Markdown으로 추출한다. */
export async function extractMarkdown(url: string): Promise<Extracted> {
  let html: string;
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; FeedMeBot/1.0; +https://github.com/yeom0823/feedme-clone)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    if (!res.ok) throw new FetchFailedError(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    if (e instanceof FetchFailedError) throw e;
    throw new FetchFailedError(e instanceof Error ? e.message : "fetch failed");
  }

  const { document } = parseHTML(html);
  const result = await Defuddle(document as unknown as Document, url, {
    markdown: true,
  });
  const markdown = (result.content ?? "").trim();
  if (!markdown) throw new EmptyContentError();

  return {
    title: (result.title ?? "").trim() || new URL(url).hostname,
    author: (result.author ?? "").trim(),
    site: (result.site ?? "").trim() || new URL(url).hostname,
    url,
    markdown,
  };
}
