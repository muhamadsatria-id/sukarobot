const STEPS = [
  {
    title: 'Pilih mobil & layanan',
    body: 'Tentukan unit, tanggal mulai, dan mau lepas kunci atau dengan driver. Tarif muncul otomatis.',
  },
  {
    title: 'Kirim detail via WhatsApp',
    body: 'Kami cek ketersediaan unit, konfirmasi tarif akhir, dan jadwal antar-jemput.',
  },
  {
    title: 'Ambil atau minta antar',
    body: 'Unit bisa diambil di Cibadak atau diantar sesuai kesepakatan. Siap jalan.',
  },
]

export default function CaraSewaSection({ storeWhatsApp }) {
  return (
    <section
      id="cara-sewa"
      className="relative scroll-mt-24 overflow-hidden bg-[#1e3a8a] text-white"
    >
      <div className="pointer-events-none absolute inset-0 grain opacity-[0.05]" />
      <div className="relative mx-auto grid w-full max-w-[1240px] gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
            Cara sewa
          </p>
          <h2 className="mt-4 max-w-lg font-display text-[2.8rem] font-semibold leading-[0.92] tracking-[-0.055em] text-white sm:text-[4rem]">
            Tiga langkah, tanpa ribet.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-blue-100/75">
            Semua percakapan dimulai dari WhatsApp. Kami bantu cek unit, hitung
            tarif, dan atur serah terima.
          </p>

          {storeWhatsApp ? (
            <a
              href={storeWhatsApp}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-bold text-[#1e3a8a] transition hover:-translate-y-0.5 hover:bg-[#3c83f6] hover:text-white"
            >
              Tanya ketersediaan
              <span aria-hidden="true">→</span>
            </a>
          ) : null}

          <div className="mt-8 max-w-md rounded-2xl border border-white/15 bg-white/5 p-5">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-blue-200/60">
              Yang perlu disiapkan
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-blue-100/80">
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#3c83f6]" />
                KTP dan SIM A untuk layanan lepas kunci.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#3c83f6]" />
                Konfirmasi jadwal dan lokasi serah terima.
              </li>
              <li className="flex gap-2">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#3c83f6]" />
                BBM, tol, dan parkir di luar tarif sewa.
              </li>
            </ul>
          </div>
        </div>

        <ol className="space-y-0 border-t border-white/15">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="group grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[3.5rem_1fr]"
            >
              <span className="text-sm font-medium text-[#3c83f6] transition group-hover:text-blue-300">
                0{index + 1}
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white sm:text-3xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-lg text-sm leading-7 text-blue-100/75">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}