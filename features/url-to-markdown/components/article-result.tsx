"use client";

import { useState, type ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportActions } from "./export-actions";
import { MarkdownView } from "./markdown-view";

export type ConvertedPage = {
  title: string;
  author: string;
  site: string;
  url: string;
  markdown: string;
};

type Props = {
  page: ConvertedPage;
  prompt?: string;
  /** 결과 머리에서 복사 버튼 묶음 왼쪽에 놓이는 action */
  actions?: ReactNode;
  /** 바이라인 아래 보조 정보 */
  meta?: ReactNode;
  /** 결과 머리와 탭 사이 (프롬프트 입력 등) */
  children?: ReactNode;
};

/** 변환 결과 한 건: 결과 머리, 내보내기, 미리보기/Markdown 탭. */
export function ArticleResult({ page, prompt = "", actions, meta, children }: Props) {
  const [tab, setTab] = useState("preview");
  return (
    <article className="flex flex-col gap-3.5 border-t pt-5">
      <div className="flex items-start justify-between gap-3 max-sm:flex-col">
        <header className="flex min-w-0 flex-col gap-1">
          <h2 className="text-[22px] leading-snug font-semibold text-balance">{page.title}</h2>
          <Byline page={page} />
          {meta}
        </header>
        <div className="flex flex-none items-start gap-2 max-sm:self-stretch">
          {actions}
          <ExportActions title={page.title} markdown={page.markdown} prompt={prompt} />
        </div>
      </div>
      {children}
      <Tabs value={tab} onValueChange={setTab} className="gap-3.5">
        <TabsList>
          <TabsTrigger value="preview">미리보기</TabsTrigger>
          <TabsTrigger value="raw">Markdown</TabsTrigger>
        </TabsList>
      </Tabs>
      {tab === "preview" ? (
        <MarkdownView markdown={page.markdown} />
      ) : (
        <pre className="max-h-[560px] overflow-auto rounded-md border bg-muted/40 px-4 py-3.5 font-mono text-[13px] leading-relaxed wrap-anywhere whitespace-pre-wrap">
          {page.markdown}
        </pre>
      )}
    </article>
  );
}

function Byline({ page }: { page: ConvertedPage }) {
  const names = page.author
    ? [page.author, page.site !== page.author ? page.site : ""]
    : [page.site];
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 text-[13px] text-muted-foreground">
      {names.filter(Boolean).map((name) => (
        <span key={name} className="after:ml-1.5 after:content-['·']">
          {name}
        </span>
      ))}
      <a
        href={page.url}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all underline underline-offset-3"
      >
        {page.url.replace(/^https?:\/\//, "")}
      </a>
    </div>
  );
}
