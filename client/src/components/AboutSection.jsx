export default function AboutSection({ store }) {
  return (
    <section
      id="tentang"
      className="mx-auto w-full max-w-[1240px] scroll-mt-28 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="grid gap-10 border-t border-line pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <div>
          <p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
            Tentang
          </p>
          <h2 className="mt-3 max-w-md font-display text-[2.7rem] font-semibold leading-[0.92] tracking-[-0.055em] text-ink sm:text-[4rem]">
            Dekat, jelas, siap jalan.
          </h2>
        </div>
        <div className="max-w-2xl">
          <p className="text-base leading-8 text-ink-soft">
            {store?.tagline ||
              'Rental mobil harian di Sukabumi untuk perjalanan dalam kota, luar kota, atau antar-jemput.'}
          </p>
          <p className="mt-5 text-sm leading-7 text-muted">
            Kami berbasis di Cibadak, Sukabumi. Setiap unit dirawat dan dicek
            sebelum diserahkan, dengan pilihan lepas kunci atau dengan driver
            sesuai kebutuhan perjalanan Anda.
          </p>
          <dl className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { label: 'Layanan', value: 'Lepas kunci & driver' },
              { label: 'Area', value: 'Sukabumi & sekitar' },
              {
                label: 'Operasional',
                value: store?.operationalHours || '08.00–21.00 WIB',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-line bg-bone/60 p-4 shadow-sm"
              >
                {/* Tiga Titik Lingkaran Apple / macOS */}
                <div className="mb-3 flex items-center gap-1.5">
                  <span className="size-2.5 rounded-full bg-[#1e3a8a]" />
                  <span className="size-2.5 rounded-full bg-[#3c83f6]" />
                  <span className="size-2.5 rounded-full bg-[#93c5fd]" />
                </div>
                <dt className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {item.label}
                </dt>
                <dd className="mt-2 text-sm font-semibold leading-6 text-ink">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}