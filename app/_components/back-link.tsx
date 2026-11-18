import Link from 'next/link'
import { ChevronLeftIcon } from 'lucide-react'

export function BackLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 self-start text-[13px] text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
    >
      <ChevronLeftIcon />
      {children}
    </Link>
  )
}
