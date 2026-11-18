/** LLM 새 대화 URL로 넘길 수 있는 텍스트 길이 한도(인코딩 전, 글자 수). */
export const URL_HANDOFF_LIMIT = 6000;

export const PROMPT_PRESETS = [
  "요약해줘",
  "한국어로 번역해줘",
  "쉽게 설명해줘",
] as const;

export type Llm = "chatgpt" | "claude";

export const LLM_LABEL: Record<Llm, string> = {
  chatgpt: "ChatGPT",
  claude: "Claude",
};

/** 복사·열기에 쓰는 텍스트. 프롬프트가 비어 있지 않으면 "프롬프트 + 빈 줄 + Markdown". */
export function buildSendText(markdown: string, prompt: string): string {
  const p = prompt.trim();
  return p ? `${p}\n\n${markdown}` : markdown;
}

export function buildLlmUrl(llm: Llm, text: string): string {
  const base = llm === "chatgpt" ? "https://chatgpt.com/" : "https://claude.ai/new";
  return `${base}?q=${encodeURIComponent(text)}`;
}

/** 페이지 제목으로 .md 파일 이름을 만든다. */
export function markdownFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${slug || "feed-me"}.md`;
}
