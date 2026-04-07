import { loginAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "invalid_credentials";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_30%),linear-gradient(180deg,_#05111f_0%,_#081828_52%,_#0f172a_100%)] px-4">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-300">
          Fitness4All CRM
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Use one of the seeded demo users to access the live CRM workspace.
        </p>

        {hasError ? (
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
            Incorrect email or password.
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="crm-input"
            defaultValue="admin@fitness4allcrm.com"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="crm-input"
            defaultValue="fitness4all123"
          />
          <button type="submit" className="crm-button w-full">
            Sign in
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          <p className="font-medium text-white">Seeded users</p>
          <p className="mt-2">`admin@fitness4allcrm.com`</p>
          <p>`manager@fitness4allcrm.com`</p>
          <p>`rep@fitness4allcrm.com`</p>
          <p className="mt-2">Password: `fitness4all123`</p>
        </div>
      </div>
    </main>
  );
}
