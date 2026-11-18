// @vitest-environment node
import { afterEach, expect, test, vi } from "vitest";

import { EmptyContentError, extractMarkdown, FetchFailedError } from "./extract";

afterEach(() => vi.unstubAllGlobals());

function stubFetch(res: Response) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(res));
}

test("HTML에서 제목과 본문을 Markdown으로 추출한다", async () => {
  const html = `<html><head><title>테스트 글 - 사이트</title></head><body><article><h1>테스트 글</h1><p>첫 문단입니다. 본문 내용이 충분히 길어야 추출됩니다. 본문 내용이 충분히 길어야 추출됩니다. 본문 내용이 충분히 길어야 추출됩니다.</p><p>둘째 문단에는 <a href="https://example.com/x">링크</a>가 있습니다.</p></article></body></html>`;
  stubFetch(new Response(html, { status: 200 }));

  const page = await extractMarkdown("https://example.com/post");

  expect(page.title).toContain("테스트 글");
  expect(page.markdown).toContain("첫 문단입니다");
  expect(page.markdown).toContain("[링크](https://example.com/x)");
});

test("본문이 비어 있으면 EmptyContentError를 던진다", async () => {
  stubFetch(new Response("<html><head><title>x</title></head><body></body></html>"));
  await expect(extractMarkdown("https://example.com/")).rejects.toBeInstanceOf(
    EmptyContentError
  );
});

test("4xx·5xx 응답이나 네트워크 오류는 FetchFailedError다", async () => {
  stubFetch(new Response("no", { status: 404 }));
  await expect(extractMarkdown("https://example.com/")).rejects.toBeInstanceOf(
    FetchFailedError
  );

  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));
  await expect(extractMarkdown("https://example.com/")).rejects.toBeInstanceOf(
    FetchFailedError
  );
});
