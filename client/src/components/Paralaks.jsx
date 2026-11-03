export default function Paralaks() {
  const items = [
    "Lepas kunci",
    "Dengan driver",
    "Antar-jemput",
    "Harian & mingguan",
    "Unit terawat",
  ];

  return (
    <div className="overflow-hidden border-y border-line bg-bone/45 py-4">
      {/* Container animasi running text */}
      <div className="flex w-max animate-marquee-right gap-4 px-4 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-black">
        {/* Set 1 */}
        {items.map((item, idx) => (
          <div key={`first-${idx}`} className="flex items-center gap-4 shrink-0">
            <span>{item}</span>
            <span className="size-1 shrink-0 rounded-full bg-rust" />
          </div>
        ))}

        {/* Set 2 (Duplikasi agar efek looping tersambung tanpa jeda) */}
        {items.map((item, idx) => (
          <div key={`second-${idx}`} className="flex items-center gap-4 shrink-0">
            <span>{item}</span>
            <span className="size-1 shrink-0 rounded-full bg-rust" />
          </div>
        ))}
      </div>
    </div>
  );
}