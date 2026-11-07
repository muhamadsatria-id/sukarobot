import { useEffect, useState } from 'react'

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    quote:
      'Mobilnya bersih, wangi, dan sesuai deskripsi. Proses konfirmasi cepat, adminnya ramah, dan serah terima tepat waktu.',
    name: 'Rina Kusuma',
    role: 'Karyawan',
    company: 'Bandung',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 2,
    quote:
      'Sewa lepas kunci untuk perjalanan ke Pelabuhan Ratu. Unit nyaman, mesin halus, dan tarifnya jelas sejak awal.',
    name: 'Dimas Pratama',
    role: 'Mahasiswa',
    company: 'Jakarta',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 3,
    quote:
      'Antar-jemput ke stasiun tepat waktu. Driver ramah dan sabar, cocok untuk perjalanan keluarga.',
    name: 'Sari Wulandari',
    role: 'Wisatawan',
    company: 'Bogor',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
]

export default function TestimonialSection({
  testimonials = [],
  loading = false,
}) {
  const data =
    testimonials.length > 0
      ? testimonials
      : loading
        ? DEFAULT_TESTIMONIALS
        : []
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex > data.length - 1) {
      setCurrentIndex(Math.max(0, data.length - 1))
    }
  }, [currentIndex, data.length])

  if (data.length === 0) return null

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1))
  }

  const safeIndex = Math.min(currentIndex, data.length - 1)
  const current = data[safeIndex]
  const formattedNumber = String(safeIndex + 1).padStart(2, '0')
  const totalCount = String(data.length).padStart(2, '0')
  const avatarInitials = String(current.name || 'T')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

  return (
    <section
      id="testimoni"
      className="relative scroll-mt-24 overflow-hidden px-4 pb-16 pt-20 text-ink select-none sm:px-6 sm:pb-24 lg:px-8 lg:pt-28"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 top-10 size-[400px] rounded-full bg-[#3c83f6]/10 blur-[100px]" />
        <div className="absolute -right-32 top-20 size-[400px] rounded-full bg-leaf/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col justify-between gap-4 md:mb-16 md:flex-row md:items-end md:gap-8">
          <div>
            <span className="mb-2 block text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-leaf">
              Testimoni
            </span>
            <h2 className="max-w-xl font-display text-[2.7rem] font-semibold leading-[0.94] tracking-[-0.055em] text-ink sm:text-[3.8rem]">
              Kata mereka yang sudah jalan.
            </h2>
          </div>
          <p className="max-w-md pb-1 text-sm leading-7 text-ink-soft sm:text-base">
            Cerita singkat dari pelanggan yang sudah mempercayakan perjalanan
            mereka ke Sukabumi Drive.
          </p>
        </div>

        <div className="flex min-h-[260px] flex-col justify-between">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-12">
            <div className="md:col-span-3 lg:col-span-2">
              <span className="block select-none text-6xl font-black leading-none tracking-tighter text-line-strong/80 sm:text-7xl lg:text-8xl">
                {formattedNumber}
              </span>
            </div>

            <div className="pt-2 md:col-span-9 md:pt-1 lg:col-span-10">
              <div key={current.id} className="animate-fade">
                <blockquote
                  className="max-w-4xl text-xl font-medium leading-relaxed text-ink sm:text-2xl lg:text-3xl"
                  aria-live="polite"
                >
                  “{current.quote}”
                </blockquote>

                <div className="mt-8 flex items-center gap-4">
                  {current.avatar ? (
                    <img
                      src={current.avatar}
                      alt={current.name}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-full border-2 border-bone object-cover shadow-sm"
                    />
                  ) : (
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border-2 border-bone bg-leaf/10 text-sm font-bold text-leaf shadow-sm">
                      {avatarInitials}
                    </span>
                  )}
                  <div>
                    <h3 className="text-base font-bold text-ink">
                      {current.name}
                    </h3>
                    <p className="text-xs font-medium text-muted sm:text-sm">
                      {current.role}
                      {current.company ? ` / ${current.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-line pt-8 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {data.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Lihat testimoni ${index + 1}`}
                    aria-current={index === safeIndex ? 'true' : undefined}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === safeIndex
                        ? 'w-10 bg-leaf'
                        : 'w-4 bg-line-strong/80 hover:bg-muted'
                    }`}
                  />
                ))}
              </div>

              <span className="text-sm font-semibold tracking-wider text-muted tabular-nums">
                {formattedNumber} / {totalCount}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Testimoni sebelumnya"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-strong/80 bg-bone/70 text-ink-soft shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-leaf hover:bg-leaf hover:text-white active:scale-95"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                type="button"
                onClick={handleNext}
                aria-label="Testimoni berikutnya"
                className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-line-strong/80 bg-bone/70 text-ink-soft shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-leaf hover:bg-leaf hover:text-white active:scale-95"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
