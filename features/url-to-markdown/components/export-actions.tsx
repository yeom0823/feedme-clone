"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  buildLlmUrl,
  buildSendText,
  LLM_LABEL,
  markdownFilename,
  URL_HANDOFF_LIMIT,
  type Llm,
} from "../lib/send";

type Props = { title: string; markdown: string; prompt: string };

export function ExportActions({ title, markdown, prompt }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const hasPrompt = prompt.trim().length > 0;

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildSendText(markdown, prompt));
    } catch {
      toast.error("복사하지 못했습니다", {
        description: "브라우저가 클립보드 접근을 막았습니다.",
      });
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
    toast.success("복사했습니다", {
      description: hasPrompt
        ? "프롬프트와 Markdown 본문이 클립보드에 있습니다."
        : "Markdown 본문이 클립보드에 있습니다.",
    });
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = markdownFilename(title);
    a.click();
    URL.revokeObjectURL(href);
    toast.success("다운로드했습니다", { description: a.download });
  }

  // 메뉴 클릭 직후(사용자 동작 안)에 복사와 새 탭 열기를 함께 처리한다.
  function openIn(llm: Llm) {
    const text = buildSendText(markdown, prompt);
    const name = LLM_LABEL[llm];
    if (text.length <= URL_HANDOFF_LIMIT) {
      window.open(buildLlmUrl(llm, text), "_blank", "noopener");
      toast(`${name}를 새 탭에서 열었습니다`, {
        description: hasPrompt
          ? "프롬프트와 본문이 입력창에 들어가 있습니다."
          : "본문이 입력창에 들어가 있습니다.",
      });
      return;
    }
    navigator.clipboard.writeText(text).catch(() => {});
    window.open(buildLlmUrl(llm, ""), "_blank", "noopener");
    toast("본문이 길어 클립보드에 복사했습니다", {
      description: `${name} 새 대화에 붙여넣기(Ctrl+V) 하세요.${hasPrompt ? " 프롬프트도 함께 복사됐습니다." : ""}`,
    });
  }

  return (
    <div className="flex flex-none flex-col items-end gap-1 max-sm:items-stretch max-sm:self-stretch">
      <ButtonGroup className="max-sm:w-full">
        <Button variant="outline" size="sm" className="max-sm:flex-1" onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "복사됨" : "복사하기"}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon-sm" aria-label="열기 옵션" />
            }
          >
            <ChevronDownIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-48">
            <DropdownMenuItem onClick={download}>
              <DownloadIcon />
              마크다운 다운로드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openIn("chatgpt")}>
              <ExternalLinkIcon />
              ChatGPT에서 열기
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openIn("claude")}>
              <ExternalLinkIcon />
              Claude에서 열기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      {hasPrompt && (
        <span className="text-xs text-muted-foreground">프롬프트 포함</span>
      )}
    </div>
  );
}
