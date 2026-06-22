import type { LegalDoc } from '@/lib/legal';

export function LegalView({ doc }: { doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900">{doc.title}</h1>
      <p className="mt-1 text-xs text-gray-400">{doc.updated}</p>
      <p className="mt-4 text-sm text-gray-600">{doc.intro}</p>
      <div className="mt-8 space-y-6">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-sm font-bold text-gray-900">{s.h}</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{s.p}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 rounded-lg bg-gray-50 px-3 py-2 text-center text-xs text-gray-400">
        {doc.disclaimer}
      </p>
    </div>
  );
}
