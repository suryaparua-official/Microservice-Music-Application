import { FiSmartphone } from "react-icons/fi";

const PLATFORMS = [
  { label: "Android", desc: "Google Play Store" },
  { label: "iOS", desc: "Apple App Store" },
];

const InstallApp = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm flex flex-col items-center gap-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-elevated flex items-center justify-center">
          <FiSmartphone size={28} className="text-white" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold text-white">Install the app</h1>
          <p className="text-dim text-sm max-w-xs mx-auto">
            Native apps for Android and iOS are on the way. Stay tuned.
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          {PLATFORMS.map(({ label, desc }) => (
            <div
              key={label}
              className="w-full flex items-center justify-between
                         bg-surface border border-divider rounded-xl px-5 py-4"
            >
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-dim">{desc}</p>
              </div>
              <span className="text-xs text-dim border border-divider rounded-full px-3 py-1">
                Soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstallApp;
