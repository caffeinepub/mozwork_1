import { Briefcase, Home, PlusCircle, Trophy, User } from "lucide-react";

export type Page =
  | "home"
  | "jobs"
  | "postJob"
  | "ranking"
  | "profile"
  | "landing"
  | "register"
  | "workerProfile";

interface BottomNavProps {
  current: Page;
  onChange: (page: Page) => void;
}

const navItems: {
  page: Page;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}[] = [
  { page: "home", label: "Início", Icon: Home },
  { page: "jobs", label: "Vagas", Icon: Briefcase },
  { page: "postJob", label: "Publicar", Icon: PlusCircle },
  { page: "ranking", label: "Ranking", Icon: Trophy },
  { page: "profile", label: "Perfil", Icon: User },
];

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ page, label, Icon }) => (
          <button
            key={page}
            type="button"
            data-ocid={`nav.${page}.link`}
            onClick={() => onChange(page)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
              current === page
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon
              size={22}
              className={current === page ? "stroke-[2.5]" : "stroke-2"}
            />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
