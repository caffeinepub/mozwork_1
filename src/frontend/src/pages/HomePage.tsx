import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { Search, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { WorkerProfile } from "../backend.d";
import type { Page } from "../components/BottomNav";
import { WorkerCard } from "../components/WorkerCard";
import { useAllWorkers } from "../hooks/useQueries";

const SAMPLE_WORKERS: [Principal, WorkerProfile][] = [
  [
    Principal.anonymous(),
    {
      name: "Carlos Mondlane",
      profession: "Eletricista",
      city: "Maputo",
      neighborhood: "Polana",
      phone: "84 111 2222",
      hourlyRate: 600n,
      rating: 4.8,
      isAvailable: true,
      trustBadges: ["Confiável", "Profissional"],
      skills: ["Instalações", "Manutenção"],
      experienceYears: 8n,
      jobCount: 124n,
      profilePhotoId: "",
    },
  ],
  [
    Principal.anonymous(),
    {
      name: "Ana Sitoe",
      profession: "Cozinheira",
      city: "Maputo",
      neighborhood: "Sommerschield",
      phone: "82 333 4444",
      hourlyRate: 400n,
      rating: 4.9,
      isAvailable: true,
      trustBadges: ["Confiável"],
      skills: ["Culinária moçambicana", "Buffet"],
      experienceYears: 5n,
      jobCount: 89n,
      profilePhotoId: "",
    },
  ],
  [
    Principal.anonymous(),
    {
      name: "Pedro Nhavene",
      profession: "Canalizador",
      city: "Matola",
      neighborhood: "Liberdade",
      phone: "86 555 6666",
      hourlyRate: 500n,
      rating: 4.5,
      isAvailable: false,
      trustBadges: ["Profissional"],
      skills: ["Canalização", "Soldagem"],
      experienceYears: 10n,
      jobCount: 201n,
      profilePhotoId: "",
    },
  ],
  [
    Principal.anonymous(),
    {
      name: "Fátima Matusse",
      profession: "Pintor",
      city: "Beira",
      neighborhood: "Ponta Gêa",
      phone: "84 777 8888",
      hourlyRate: 350n,
      rating: 4.6,
      isAvailable: true,
      trustBadges: ["Novo", "Confiável"],
      skills: ["Pintura interna", "Pintura externa"],
      experienceYears: 3n,
      jobCount: 45n,
      profilePhotoId: "",
    },
  ],
  [
    Principal.anonymous(),
    {
      name: "José Cossa",
      profession: "Motorista",
      city: "Maputo",
      neighborhood: "Alto Maé",
      phone: "82 999 0000",
      hourlyRate: 800n,
      rating: 4.7,
      isAvailable: true,
      trustBadges: ["Confiável", "Profissional"],
      skills: ["Licença B", "Licença C"],
      experienceYears: 12n,
      jobCount: 310n,
      profilePhotoId: "",
    },
  ],
];

const CITIES = ["Todas", "Maputo", "Matola", "Beira", "Nampula", "Quelimane"];
const PROFESSIONS = [
  "Todas",
  "Canalizador",
  "Eletricista",
  "Pintor",
  "Cozinheira",
  "Motorista",
  "Carpinteiro",
];

interface HomePageProps {
  onNavigate: (page: Page, extra?: { workerPrincipal?: string }) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { data: workers, isLoading } = useAllWorkers();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("Todas");
  const [profFilter, setProfFilter] = useState("Todas");

  const displayWorkers = useMemo(() => {
    const source = workers && workers.length > 0 ? workers : SAMPLE_WORKERS;
    return source.filter(([, p]) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.profession.toLowerCase().includes(search.toLowerCase());
      const matchCity = cityFilter === "Todas" || p.city === cityFilter;
      const matchProf = profFilter === "Todas" || p.profession === profFilter;
      return matchSearch && matchCity && matchProf;
    });
  }, [workers, search, cityFilter, profFilter]);

  return (
    <div className="pb-20">
      <div className="bg-primary px-4 pt-10 pb-4">
        <h1 className="font-heading font-bold text-xl text-primary-foreground mb-3">
          Encontrar Profissionais
        </h1>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            data-ocid="home.search_input"
            className="pl-9 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground"
            placeholder="Buscar por nome ou profissão..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 py-3 bg-orange-50 border-b border-orange-100">
        <Button
          data-ocid="home.urgent.primary_button"
          onClick={() => onNavigate("jobs")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-heading font-semibold"
          size="sm"
        >
          <Zap size={15} className="mr-2" />
          Preciso Agora! — Ver Vagas Urgentes
        </Button>
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <select
          data-ocid="home.city.select"
          className="border border-input bg-card rounded-full px-3 py-1.5 text-xs focus:outline-none flex-shrink-0"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          data-ocid="home.profession.select"
          className="border border-input bg-card rounded-full px-3 py-1.5 text-xs focus:outline-none flex-shrink-0"
          value={profFilter}
          onChange={(e) => setProfFilter(e.target.value)}
        >
          {PROFESSIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div className="px-4 space-y-3">
        <p className="text-xs text-muted-foreground">
          {displayWorkers.length} profissionais encontrados
        </p>

        {isLoading &&
          Array.from({ length: 4 }, (_, i) => i + 1).map((n) => (
            <div
              key={`loading-worker-${n}`}
              data-ocid={`workers.loading_state.${n}`}
              className="bg-card border border-border rounded-lg p-3 flex gap-3"
            >
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}

        {!isLoading && displayWorkers.length === 0 && (
          <div
            data-ocid="workers.empty_state"
            className="text-center py-10 text-muted-foreground"
          >
            <p className="text-sm">Nenhum profissional encontrado</p>
          </div>
        )}

        {!isLoading &&
          displayWorkers.map(([principal, profile], idx) => (
            <WorkerCard
              key={`worker-${profile.name}`}
              principal={principal}
              profile={profile}
              index={idx + 1}
              onClick={() =>
                onNavigate("workerProfile", {
                  workerPrincipal: principal.toString(),
                })
              }
            />
          ))}
      </div>
    </div>
  );
}
