interface InitialsAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const colorPairs = [
  { bg: "bg-primary/20", text: "text-primary" },
  { bg: "bg-blue-100", text: "text-blue-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
  { bg: "bg-purple-100", text: "text-purple-700" },
  { bg: "bg-pink-100", text: "text-pink-700" },
];

export function InitialsAvatar({
  name,
  size = "md",
  className = "",
}: InitialsAvatarProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colorIndex = name.charCodeAt(0) % colorPairs.length;
  const { bg, text } = colorPairs[colorIndex];

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${bg} ${text} rounded-full flex items-center justify-center font-heading font-bold flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}
