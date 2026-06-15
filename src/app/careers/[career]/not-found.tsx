import Link from "next/link";

export default function CareerNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 text-center">
      <div className="max-w-xl rounded-3xl border border-white/20 bg-white/10 p-10 shadow-2xl backdrop-blur-xl">
        <h1 className="text-5xl font-extrabold text-white">Career Not Found</h1>
        <p className="mt-4 text-lg text-white/70">
          We could not find that career information page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-white px-7 py-4 font-extrabold text-slate-900 transition-all hover:scale-105"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
