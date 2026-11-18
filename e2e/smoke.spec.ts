import { expect, test } from "@playwright/test";

test("홈 화면에 워드마크와 URL 입력칸이 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("FEED-ME");
  await expect(page.getByLabel("URL")).toBeVisible();
  await expect(page.getByRole("button", { name: "가져오기" })).toBeDisabled();
});
