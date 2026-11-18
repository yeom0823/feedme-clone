import { AuthLink } from "@/features/auth/components/auth-link";
import { UrlConverter } from "@/features/url-to-markdown/components/url-converter";
import { ThemeToggle } from "@/features/url-to-markdown/components/theme-toggle";

const REPO_URL = "https://github.com/yeom0823/feedme-clone";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { url } = await searchParams;
  const initialUrl = typeof url === "string" ? url : "";
  return (
    <div className="mx-auto flex w-full max-w-190 flex-1 flex-col gap-5 px-4 pt-3">
      <header className="flex items-center justify-end gap-1">
        <AuthLink />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col gap-5">
        <div>
          <h1 className="mb-2 text-4xl leading-tight font-extrabold tracking-tight sm:text-[44px]">
            FEED-ME
          </h1>
          <p className="text-[15px] text-muted-foreground">어떤 URL이든, Markdown으로.</p>
        </div>
        <UrlConverter initialUrl={initialUrl} />
      </main>
      <footer className="flex items-center justify-center gap-1.5 pt-10 pb-4 text-xs text-muted-foreground">
        <span>© 2026 feed-me</span>
        <span aria-hidden>·</span>
        <a
          href={`${REPO_URL}/issues/new`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          Feedback
        </a>
        <span aria-hidden>·</span>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}
