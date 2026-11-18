import {
  EmptyContentError,
  extractMarkdown,
} from "@/features/url-to-markdown/lib/extract";
import { isHttpUrl } from "@/features/url-to-markdown/lib/url";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url")?.trim() ?? "";
  if (!isHttpUrl(url)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  try {
    return Response.json(await extractMarkdown(url));
  } catch (e) {
    if (e instanceof EmptyContentError) {
      return Response.json({ error: "empty" }, { status: 422 });
    }
    return Response.json({ error: "fetch" }, { status: 502 });
  }
}
