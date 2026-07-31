import Link from "next/link";
import { conceptMetas } from "@/lib/concepts/public-data";

export default function ConceitosHubPage() {
  const items = [conceptMetas.a, conceptMetas.b, conceptMetas.c];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
        NTWS Labs · Direção visual v2
      </p>
      <h1 className="font-display mt-3 text-3xl sm:text-4xl">
        Três conceitos públicos
      </h1>
      <p className="mt-3 text-[var(--fg-muted)]">
        Mesmos dados fictícios. Compare atmosfera, conversão e aderência ao
        gastrobar + evento. O protótipo original permanece em{" "}
        <Link href="/demo" className="underline underline-offset-4">
          /demo
        </Link>
        .
      </p>
      <ul className="mt-8 space-y-4">
        {items.map((meta) => (
          <li key={meta.id}>
            <Link
              href={`/demo/conceitos/${meta.id}`}
              className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:bg-[var(--surface-2)] min-h-24"
            >
              <p className="text-xs uppercase tracking-wider text-[var(--accent)]">
                Conceito {meta.id.toUpperCase()}
              </p>
              <h2 className="mt-1 font-display text-2xl">{meta.name}</h2>
              <p className="mt-2 text-sm text-[var(--fg-muted)]">
                {meta.intention}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
