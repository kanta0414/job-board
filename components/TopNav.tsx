"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isPost = pathname === "/post";

  const linkClass = (active: boolean) =>
    active
      ? "text-white underline underline-offset-4"
      : "text-slate-200 hover:text-white";

  return (
    <header className="w-full bg-slate-800 text-white">
      <div className="flex w-full items-center justify-between py-3">
        <div className="text-lg font-semibold tracking-tight">求人検索アプリ</div>
        <nav className="flex items-center gap-4 pr-4 text-sm">
          <Link href="/" className={linkClass(isHome)}>
            求人検索
          </Link>
          <Link href="/post" className={linkClass(isPost)}>
            求人投稿
          </Link>
        </nav>
      </div>
    </header>
  );
}
