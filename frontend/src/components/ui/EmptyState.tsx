import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20 text-center px-6">
    <div className="w-16 h-16 rounded-full bg-elevated flex items-center justify-center text-dim text-2xl">
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="text-sm text-dim max-w-xs">{description}</p>
    </div>
    {action && (
      <button
        onClick={action.onClick}
        className="mt-2 px-5 py-2 bg-white text-black text-sm font-semibold
                   rounded-full hover:scale-[1.02] transition-transform duration-200"
      >
        {action.label}
      </button>
    )}
  </div>
);

export default EmptyState;
