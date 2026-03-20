import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({
  rating,
  max = 5,
  size = 14,
  interactive = false,
  onRate,
}: StarRatingProps) {
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={`star-pos-${star}`}
          size={size}
          className={`${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-none text-muted-foreground"
          } ${interactive ? "cursor-pointer hover:fill-yellow-300 hover:text-yellow-300" : ""}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );
}
