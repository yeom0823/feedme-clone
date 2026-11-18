import { listSavedUrls } from "@/features/saved-articles/queries";
import { createClient } from "@/lib/supabase/server";
import { HomeConverter } from "./_components/home-converter";
import { PageShell } from "./_components/page-shell";

const REPO_URL = "https://github.com/yeom0823/feedme-clone";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { url } = await searchParams;
  const initialUrl = typeof url === "string" ? url : "";

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const savedUrls = signedIn ? await listSavedUrls(supabase) : [];

  return (
    <PageShell
      signedIn={signedIn}
      footer={
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
      }
    >
      <div>
        <h1 className="mb-2 text-4xl leading-tight font-extrabold tracking-tight sm:text-[44px]">
          FEED-ME
        </h1>
        <p className="text-[15px] text-muted-foreground">어떤 URL이든, Markdown으로.</p>
      </div>
      <HomeConverter initialUrl={initialUrl} signedIn={signedIn} savedUrls={savedUrls} />
    </PageShell>
  );
}
