import { Badge } from "@/components/ui/badge";

const badgeStyles: Record<string, string> = {
  Novo: "bg-blue-100 text-blue-700 border-blue-200",
  Confiável: "bg-primary/20 text-primary border-primary/30",
  Profissional: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

export function TrustBadge({ badge }: { badge: string }) {
  const style =
    badgeStyles[badge] ?? "bg-muted text-muted-foreground border-border";
  return (
    <Badge variant="outline" className={`text-xs font-medium ${style}`}>
      {badge}
    </Badge>
  );
}
