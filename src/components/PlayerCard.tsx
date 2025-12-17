"use client";

interface PlayerCardProps {
  name: string;
  picture?: string;
  count: number;
  limit: number;
  onClick: () => void;
  disabled: boolean;
  color: "pink" | "blue";
}

export function PlayerCard({
  name,
  picture,
  count,
  limit,
  onClick,
  disabled,
  color,
}: PlayerCardProps) {
  const initial = name.charAt(0).toUpperCase();
  const progress = (count / limit) * 100;
  const isClose = count >= limit - 3 && count < limit;
  
  const fallbackBg = color === "pink" 
    ? "bg-gradient-to-br from-rose-100 to-rose-50" 
    : "bg-gradient-to-br from-sky-100 to-sky-50";
  
  const colorOverlay = color === "pink"
    ? "bg-rose-500/20"
    : "bg-sky-500/20";
  
  const avatarBg = color === "pink"
    ? "bg-rose-200 text-rose-700"
    : "bg-sky-200 text-sky-700";

  const progressBg = color === "pink"
    ? "bg-rose-400"
    : "bg-sky-400";

  const progressTrack = color === "pink"
    ? "bg-rose-200/50"
    : "bg-sky-200/50";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative rounded-2xl p-6 flex flex-col items-center gap-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed w-full overflow-hidden ${!picture ? fallbackBg : ''}`}
    >
      {/* Blurred background image */}
      {picture && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center blur-2xl scale-110"
            style={{ backgroundImage: `url(${picture})` }}
          />
          {/* Color overlay */}
          <div className={`absolute inset-0 ${colorOverlay}`} />
          {/* Light overlay for better text readability */}
          <div className="absolute inset-0 bg-white/40" />
        </>
      )}

      {/* Content container */}
      <div className="relative z-10 flex flex-col items-center gap-4 w-full">
        {/* Avatar */}
        {picture ? (
          <img
            src={picture}
            alt={name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-white/50 shadow-lg"
          />
        ) : (
          <div
            className={`w-24 h-24 rounded-full ${avatarBg} flex items-center justify-center text-3xl font-semibold`}
          >
            {initial}
          </div>
        )}

        {/* Name */}
        <span className="font-medium text-lg text-neutral-800">{name}</span>

        {/* Count */}
        <div className="text-center">
          <span className={`text-4xl font-bold tabular-nums ${isClose ? "text-red-500" : "text-neutral-900"}`}>
            {count}
          </span>
          <span className="text-neutral-600 text-lg"> / {limit}</span>
        </div>

        {/* Progress bar */}
        <div className={`w-full h-2 ${picture ? progressTrack : 'bg-neutral-200'} rounded-full overflow-hidden backdrop-blur-sm`}>
          <div
            className={`h-full ${progressBg} transition-all duration-300`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Tap hint */}
        <span className="text-xs text-neutral-600">Tap when they say sorry</span>
      </div>
    </button>
  );
}

