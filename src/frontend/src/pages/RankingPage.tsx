import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { Trophy } from "lucide-react";
import { useMemo } from "react";
import type { WorkerProfile } from "../backend.d";
import type { Page } from "../components/BottomNav";
import { InitialsAvatar } from "../components/InitialsAvatar";
import { StarRating } from "../components/StarRating";
import { TrustBadge } from "../components/TrustBadge";
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
      rating: 4.9,
      isAvailable: true,
      trustBadges: ["Confiável", "Profissional"],
      skills: [],
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
      skills: [],
      experienceYears: 5n,
      jobCount: 89n,
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
      rating: 4.8,
      isAvailable: true,
      trustBadges: ["Confiável", "Profissional"],
      skills: [],
      experienceYears: 12n,
      jobCount: 310n,
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
      rating: 4.7,
      isAvailable: false,
      trustBadges: ["Profissional"],
      skills: [],
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
      trustBadges: ["Confiável"],
      skills: [],
      experienceYears: 3n,
      jobCount: 45n,
      profilePhotoId: "",
    },
  ],
  [
    Principal.anonymous(),
    {
      name: "Manuel Macuamba",
      profession: "Carpinteiro",
      city: "Nampula",
      neighborhood: "Cidade Alta",
      phone: "85 111 3333",
      hourlyRate: 450n,
      rating: 4.5,
      isAvailable: true,
      trustBadges: ["Novo"],
      skills: [],
      experienceYears: 2n,
      jobCount: 30n,
      profilePhotoId: "",
    },
  ],
];

const medals = ["🥇", "🥈", "🥉"];
const medalBg = [
  "bg-yellow-50 border-yellow-200",
  "bg-gray-50 border-gray-200",
  "bg-orange-50 border-orange-200",
];

interface RankingPageProps {
  onNavigate: (page: Page, extra?: { workerPrincipal?: string }) => void;
}

export function RankingPage({ onNavigate }: RankingPageProps) {
  const { data: workers, isLoading } = useAllWorkers();

  const ranked = useMemo(() => {
    const source = workers && workers.length > 0 ? workers : SAMPLE_WORKERS;
    return [...source].sort(([, a], [, b]) => b.rating - a.rating).slice(0, 10);
  }, [workers]);

  return (
    <div className="pb-20">
      <div className="bg-primary px-4 pt-10 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-primary-foreground" />
          <h1 className="font-heading font-bold text-xl text-primary-foreground">
            Ranking
          </h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">
          Top profissionais da cidade
        </p>
      </div>

      <div className="px-4 py-4 space-y-2">
        {isLoading &&
          Array.from({ length: 5 }, (_, i) => i + 1).map((n) => (
            <div
              key={`loading-rank-${n}`}
              data-ocid="ranking.loading_state"
              className="bg-card border border-border rounded-lg p-3 flex gap-3"
            >
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}

        {!isLoading &&
          ranked.map(([principal, profile], idx) => (
            <button
              type="button"
              key={`rank-${profile.name}`}
              data-ocid={`ranking.item.${idx + 1}`}
              onClick={() =>
                onNavigate("workerProfile", {
                  workerPrincipal: principal.toString(),
                })
              }
              className={`w-full text-left cursor-pointer rounded-lg border p-3 flex items-center gap-3 ${
                idx < 3 ? medalBg[idx] : "bg-card border-border"
              }`}
            >
              <div className="w-8 text-center">
                {idx < 3 ? (
                  <span className="text-xl">{medals[idx]}</span>
                ) : (
                  <span className="font-heading font-bold text-muted-foreground text-sm">
                    {idx + 1}
                  </span>
                )}
              </div>
              <InitialsAvatar name={profile.name} size="md" />
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-sm">
                  {profile.name}
                </h3>
                <p className="text-xs text-primary">
                  {profile.profession} · {profile.city}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating rating={profile.rating} size={11} />
                  <span className="text-xs text-muted-foreground">
                    {profile.rating.toFixed(1)} · {Number(profile.jobCount)}{" "}
                    trabalhos
                  </span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm text-foreground">
                  {Number(profile.hourlyRate).toLocaleString("pt-MZ")} MT
                </p>
                <div className="flex gap-1 justify-end mt-1">
                  {profile.trustBadges.slice(0, 1).map((b) => (
                    <TrustBadge key={b} badge={b} />
                  ))}
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
