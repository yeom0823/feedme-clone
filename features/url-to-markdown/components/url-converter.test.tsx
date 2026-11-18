import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import { UrlConverter } from "./url-converter";

const PAGE = {
  title: "예시 글",
  author: "",
  site: "example.com",
  url: "https://example.com/post",
  markdown: "## 소제목\n\n본문입니다.",
};

function stubApi(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

test("잘못된 주소는 변환하지 않고 오류를 보여 주며, 고치기 시작하면 사라진다", async () => {
  const fetchMock = stubApi(200, PAGE);
  const user = userEvent.setup();
  render(<UrlConverter />);

  await user.type(screen.getByLabelText("URL"), "example.com{Enter}");

  expect(
    screen.getByText("http:// 또는 https://로 시작하는 웹 페이지 주소를 입력해 주세요.")
  ).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();

  await user.type(screen.getByLabelText("URL"), "x");
  expect(screen.queryByText(/로 시작하는 웹 페이지 주소/)).not.toBeInTheDocument();
});

test("올바른 주소는 결과를 보여 주고 프롬프트 포함 표시가 따라온다", async () => {
  stubApi(200, PAGE);
  const user = userEvent.setup();
  render(<UrlConverter />);

  await user.type(screen.getByLabelText("URL"), "https://example.com/post{Enter}");

  expect(await screen.findByRole("heading", { name: "예시 글" })).toBeInTheDocument();
  expect(screen.queryByText("프롬프트 포함")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /프롬프트 추가하기/ }));
  await user.click(screen.getByRole("button", { name: "요약해줘" }));

  expect(screen.getByLabelText("프롬프트")).toHaveValue("요약해줘");
  expect(screen.getByText("프롬프트 포함")).toBeInTheDocument();
});

test("본문이 비면 경고와 다시 시도 버튼을 보여 준다", async () => {
  const fetchMock = stubApi(422, { error: "empty" });
  const user = userEvent.setup();
  render(<UrlConverter initialUrl="https://example.com/empty" />);

  expect(await screen.findByText("본문을 찾지 못했습니다")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "다시 시도" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "다시 시도" }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
});

test("지우기는 입력값과 결과를 모두 비운다", async () => {
  stubApi(200, PAGE);
  const user = userEvent.setup();
  render(<UrlConverter initialUrl="https://example.com/post" />);
  await screen.findByRole("heading", { name: "예시 글" });

  await user.click(screen.getByRole("button", { name: "입력 지우기" }));

  expect(screen.getByLabelText("URL")).toHaveValue("");
  expect(screen.queryByRole("heading", { name: "예시 글" })).not.toBeInTheDocument();
});
