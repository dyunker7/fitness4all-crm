import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.12),_transparent_30%),linear-gradient(180deg,_#05111f_0%,_#081828_52%,_#0f172a_100%)] px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-slate-950/70 p-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.28)] backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">
          Access Restricted
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white">
          This role does not have access to that area.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Ask an admin or sales manager if you need broader Fitness4All CRM
          permissions, or head back to a section that matches your role.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="crm-button">
            Back to dashboard
          </Link>
          <Link
            href="/login"
            className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white"
          >
            Switch account
          </Link>
        </div>
      </div>
    </main>
  );
}
