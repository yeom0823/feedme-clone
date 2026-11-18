"use client";

import { useRef } from "react";
import { ChevronDownIcon, ChevronRightIcon, PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  InputGroup,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Toggle } from "@/components/ui/toggle";
import { PROMPT_PRESETS } from "../lib/send";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
};

/** 접히는 프롬프트 입력. 프리셋 칩은 입력칸을 채운다. 저장하지 않는다. */
export function PromptPanel({ open, onOpenChange, prompt, onPromptChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Collapsible
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next) setTimeout(() => textareaRef.current?.focus(), 0);
      }}
      className="flex flex-col gap-2"
    >
      <CollapsibleTrigger
        render={<Button variant="ghost" size="xs" className="self-start" />}
      >
        <PlusIcon />
        프롬프트 추가하기
        {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">
        <InputGroup className="relative">
          <InputGroupTextarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="ex) 이 글을 요약해줘"
            aria-label="프롬프트"
            rows={2}
            className="min-h-16 pr-10"
          />
          {prompt && (
            <InputGroupButton
              size="icon-xs"
              aria-label="프롬프트 지우기"
              className="absolute top-1.5 right-1.5"
              onClick={() => {
                onPromptChange("");
                textareaRef.current?.focus();
              }}
            >
              <XIcon />
            </InputGroupButton>
          )}
        </InputGroup>
        <div className="flex flex-wrap gap-1.5">
          {PROMPT_PRESETS.map((preset) => (
            <Toggle
              key={preset}
              variant="outline"
              size="sm"
              className="h-7 rounded-full px-3 text-[13px]"
              pressed={prompt.trim() === preset}
              onPressedChange={() => onPromptChange(preset)}
            >
              {preset}
            </Toggle>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
