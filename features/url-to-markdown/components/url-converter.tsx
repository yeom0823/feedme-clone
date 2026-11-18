"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRightIcon, CircleAlertIcon, Loader2Icon, XIcon } from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { isHttpUrl } from "../lib/url";
import { ArticleResult, type ConvertedPage } from "./article-result";
import { PromptPanel } from "./prompt-panel";

type Status = "idle" | "invalid" | "loading" | "result" | "fetchfail" | "nocontent";

const INVALID_MESSAGE = "http:// 또는 https://로 시작하는 웹 페이지 주소를 입력해 주세요.";

function setQuery(url: string) {
  const query = url ? `?url=${encodeURIComponent(url)}` : window.location.pathname;
  window.history.replaceState(null, "", query);
}

type Props = {
  initialUrl?: string;
  /** 변환 결과가 보일 때 결과 머리의 복사 버튼 왼쪽에 놓을 action */
  resultActions?: (page: ConvertedPage) => ReactNode;
};

export function UrlConverter({ initialUrl = "", resultActions }: Props) {
  const startUrl = initialUrl.trim();
  const [input, setInput] = useState(startUrl);
  const [status, setStatus] = useState<Status>(
    !startUrl ? "idle" : isHttpUrl(startUrl) ? "loading" : "invalid"
  );
  const [page, setPage] = useState<ConvertedPage | null>(null);
  const [resultKey, setResultKey] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [promptOpen, setPromptOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  async function load(url: string) {
    const id = ++requestId.current;
    try {
      const res = await fetch(`/api/convert?url=${encodeURIComponent(url)}`);
      const body = await res.json();
      if (id !== requestId.current) return;
      if (res.ok) {
        setPage(body);
        setResultKey(id); // 변환할 때마다 탭을 "미리보기"로 되돌린다
        setStatus("result");
      } else {
        setStatus(body.error === "empty" ? "nocontent" : "fetchfail");
      }
    } catch {
      if (id === requestId.current) setStatus("fetchfail");
    }
  }

  function convert(raw: string) {
    const url = raw.trim();
    setInput(url);
    if (!isHttpUrl(url)) {
      requestId.current++;
      setStatus("invalid");
      return;
    }
    setQuery(url);
    setStatus("loading");
    void load(url);
  }

  function clearAll() {
    requestId.current++;
    setInput("");
    setPage(null);
    setPrompt("");
    setPromptOpen(false);
    setStatus("idle");
    setQuery("");
    inputRef.current?.focus();
  }

  // ?url= 로 열면 곧바로 변환한다(초기 상태가 이미 변환 중이다).
  useEffect(() => {
    // 첫 마운트에서 한 번만 실행한다. 상태는 응답을 받은 뒤에만 바뀐다.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (startUrl && isHttpUrl(startUrl)) void load(startUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const el = e.currentTarget;
    const text = e.clipboardData.getData("text");
    const next = (
      input.slice(0, el.selectionStart ?? 0) + text + input.slice(el.selectionEnd ?? 0)
    ).trim();
    if (isHttpUrl(next)) {
      e.preventDefault();
      setInput(next);
      convert(next);
    }
  }

  const loading = status === "loading";

  return (
    <div className="flex flex-col gap-5">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          convert(input);
        }}
      >
        <InputGroup className="h-11" data-disabled={undefined}>
          <InputGroupInput
            ref={inputRef}
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://example.com"
            aria-label="URL"
            aria-invalid={status === "invalid"}
            value={input}
            onPaste={handlePaste}
            onChange={(e) => {
              setInput(e.target.value);
              if (status === "invalid") setStatus("idle");
            }}
          />
          <InputGroupAddon align="inline-end">
            {input && (
              <InputGroupButton
                size="icon-xs"
                aria-label="입력 지우기"
                onClick={clearAll}
              >
                <XIcon />
              </InputGroupButton>
            )}
            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-xs"
              aria-label="가져오기"
              disabled={loading || !input.trim()}
            >
              {loading ? <Loader2Icon className="animate-spin" /> : <ArrowRightIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        {status === "invalid" && (
          <p role="alert" className="mt-1.5 text-[13px] text-destructive">
            {INVALID_MESSAGE}
          </p>
        )}
      </form>

      {loading && <ResultSkeleton />}

      {(status === "fetchfail" || status === "nocontent") && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>
            {status === "fetchfail" ? "페이지를 가져오지 못했습니다" : "본문을 찾지 못했습니다"}
          </AlertTitle>
          <AlertDescription>
            {status === "fetchfail"
              ? "주소가 맞는지, 로그인 없이 열리는 공개 페이지인지 확인한 뒤 다시 시도해 주세요."
              : "이 페이지에서 읽을 수 있는 본문이 추출되지 않았습니다. 기사나 글 상세 페이지 주소로 다시 시도해 주세요."}
          </AlertDescription>
          <AlertAction>
            <Button variant="outline" size="sm" onClick={() => convert(input)}>
              다시 시도
            </Button>
          </AlertAction>
        </Alert>
      )}

      {status === "result" && page && (
        <ArticleResult
          key={resultKey}
          page={page}
          prompt={prompt}
          actions={resultActions?.(page)}
        >
          <PromptPanel
            open={promptOpen}
            onOpenChange={setPromptOpen}
            prompt={prompt}
            onPromptChange={setPrompt}
          />
        </ArticleResult>
      )}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3 border-t pt-5">
      <Skeleton className="h-6.5 w-[55%]" />
      <Skeleton className="h-3.5 w-[30%]" />
      <div className="h-1.5" />
      {[92, 100, 84, 0, 70, 96, 88].map((w, i) =>
        w ? (
          <Skeleton key={i} className="h-3.5" style={{ width: `${w}%` }} />
        ) : (
          <div key={i} className="h-1.5" />
        )
      )}
    </div>
  );
}
