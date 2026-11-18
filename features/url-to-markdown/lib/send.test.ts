import { expect, test } from "vitest";

import {
  buildLlmUrl,
  buildSendText,
  markdownFilename,
  URL_HANDOFF_LIMIT,
} from "./send";
import { isHttpUrl } from "./url";

test("프롬프트가 있으면 프롬프트 + 빈 줄 + Markdown, 공백뿐이면 Markdown만 보낸다", () => {
  expect(buildSendText("본문", "요약해줘")).toBe("요약해줘\n\n본문");
  expect(buildSendText("본문", "   ")).toBe("본문");
});

test("LLM 열기 URL은 서비스별 새 대화 주소에 인코딩된 q를 싣는다", () => {
  expect(buildLlmUrl("chatgpt", "a b&c")).toBe("https://chatgpt.com/?q=a%20b%26c");
  expect(buildLlmUrl("claude", "x")).toBe("https://claude.ai/new?q=x");
  expect(URL_HANDOFF_LIMIT).toBe(6000);
});

test("파일 이름은 제목을 바탕으로 만들고 비면 기본 이름을 쓴다", () => {
  expect(markdownFilename("Next.js 16 Cache Components, 3분!")).toBe(
    "next-js-16-cache-components-3분.md"
  );
  expect(markdownFilename("!!!")).toBe("feed-me.md");
});

test("http(s)로 시작하는 주소만 URL로 받는다", () => {
  expect(isHttpUrl("https://example.com/a?b=1")).toBe(true);
  expect(isHttpUrl("  http://example.com ")).toBe(true);
  expect(isHttpUrl("velog.io 글 링크")).toBe(false);
  expect(isHttpUrl("ftp://example.com")).toBe(false);
  expect(isHttpUrl("example.com")).toBe(false);
});
