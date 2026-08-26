import Link from "next/link";

export default function GuestLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="px-5 py-5 lg:px-12">
        <Link
          href="/welcome"
          className="inline-block rounded-md text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Vesper<span className="text-primary">.</span>
        </Link>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex flex-1 items-start justify-center px-5 pb-24 focus:outline-none sm:items-center"
      >
        {children}
      </main>
      <footer className="px-5 pb-6 text-center text-xs text-muted-foreground">
        Vesper — a portfolio build. Dark by design.
      </footer>
    </div>
  );
}
