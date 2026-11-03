const FAQS = [
  {
    question: 'Apakah bisa lepas kunci?',
    answer:
      'Bisa. Untuk lepas kunci wajib menunjukkan KTP dan SIM A yang masih berlaku. Unit tertentu punya minimal sewa 2 hari.',
  },
  {
    question: 'Apakah tarif sudah termasuk BBM?',
    answer:
      'Belum. Tarif sewa belum termasuk BBM, tol, parkir, dan biaya jalan lain. Untuk layanan driver, tarif driver sudah tertera terpisah.',
  },
  {
    question: 'Bisa antar-jemput?',
    answer:
      'Bisa untuk area Sukabumi, stasiun, terminal, hotel, dan bandara dengan biaya menyesuaikan lokasi. Tulis lokasi jemput saat memesan.',
  },
  {
    question: 'Bagaimana cara pembayarannya?',
    answer:
      'Konfirmasi lewat WhatsApp, lalu DP via transfer. Pelunasan dilakukan saat serah terima unit.',
  },
]

export default function FaqSection({ storeWhatsApp }) {
  return (
    <section className="border-t border-line bg-bone/35">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
            Pertanyaan umum
          </p>
          <h2 className="mt-3 max-w-sm font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[3.6rem]">
            Sebelum berangkat.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
            Belum ketemu jawabannya? Kirim pertanyaan lewat WhatsApp, kami bantu
            langsung.
          </p>
          {storeWhatsApp ? (
            <a
              href={storeWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-leaf underline decoration-leaf/30 underline-offset-4 transition hover:decoration-leaf"
            >
              Tanya admin
              <span aria-hidden="true">→</span>
            </a>
          ) : null}
        </div>

        <div className="border-y border-line">
          {FAQS.map((item) => (
            <details
              key={item.question}
              className="group border-b border-line/80 last:border-b-0"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-xl font-semibold tracking-[-0.03em] text-ink [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45 group-open:border-leaf group-open:text-leaf">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 5v14M5 12h14"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="1.9"
                    />
                  </svg>
                </span>
              </summary>
              <p className="max-w-xl pb-5 text-sm leading-7 text-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
