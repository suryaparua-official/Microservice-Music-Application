const FEATURES = [
  { title: "Ad-free listening", desc: "No interruptions, ever." },
  { title: "Offline mode", desc: "Download and listen anywhere." },
  { title: "High-quality audio", desc: "Up to 320 kbps streaming." },
  { title: "Unlimited skips", desc: "Skip as many tracks as you like." },
];

const Premium = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg flex flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold">
            Premium
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Music without limits
          </h1>
          <p className="text-dim text-base max-w-sm mx-auto">
            Enjoy ad-free music, offline listening, and high-quality audio.
          </p>
        </div>

        {/* Feature list */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map(({ title, desc }) => (
            <div
              key={title}
              className="bg-surface border border-divider rounded-xl p-4 flex flex-col gap-1"
            >
              <span className="text-sm font-semibold text-white">{title}</span>
              <span className="text-xs text-dim">{desc}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          disabled
          className="px-8 py-3 bg-accent text-black font-bold rounded-full
                     text-sm cursor-not-allowed opacity-60"
        >
          Coming Soon
        </button>
      </div>
    </div>
  );
};

export default Premium;
