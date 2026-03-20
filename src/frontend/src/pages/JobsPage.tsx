import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { Banknote, MapPin, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { JobListing } from "../backend.d";
import { useAllJobListings } from "../hooks/useQueries";

const SAMPLE_JOBS: [Principal, JobListing][] = [
  [
    Principal.anonymous(),
    {
      title: "Reparação eléctrica urgente em escritório",
      description:
        "Curto-circuito no escritório. Preciso de eletricista experiente AGORA.",
      profession: "Eletricista",
      category: "Reparação",
      location: "Polana, Maputo",
      budget: 3000n,
      urgency: true,
      isVerified: true,
      requiredSkills: ["Instalações"],
    },
  ],
  [
    Principal.anonymous(),
    {
      title: "Canalização para casa nova em Matola",
      description:
        "Preciso de canalizador para instalar tubagens em casa nova de 3 quartos.",
      profession: "Canalizador",
      category: "Construção",
      location: "Liberdade, Matola",
      budget: 8000n,
      urgency: false,
      isVerified: true,
      requiredSkills: ["Canalização", "Soldagem"],
    },
  ],
  [
    Principal.anonymous(),
    {
      title: "Pintura de apartamento T2",
      description:
        "Apartamento T2 precisa de pintura completa interior. Material fornecido.",
      profession: "Pintor",
      category: "Construção",
      location: "Sommerschield, Maputo",
      budget: 5000n,
      urgency: false,
      isVerified: false,
      requiredSkills: ["Pintura interna"],
    },
  ],
  [
    Principal.anonymous(),
    {
      title: "Motorista para viagem Maputo–Inhambane",
      description:
        "Preciso de motorista com carro próprio para viagem amanhã cedo.",
      profession: "Motorista",
      category: "Transporte",
      location: "Maputo Centro",
      budget: 4500n,
      urgency: true,
      isVerified: true,
      requiredSkills: ["Licença B"],
    },
  ],
];

const CATEGORIES = [
  "Todas",
  "Reparação",
  "Construção",
  "Transporte",
  "Limpeza",
  "Cozinha",
  "Segurança",
];

export function JobsPage() {
  const { data: jobs, isLoading } = useAllJobListings();
  const [catFilter, setCatFilter] = useState("Todas");
  const [showUrgent, setShowUrgent] = useState(false);

  const displayJobs = useMemo(() => {
    const source = jobs && jobs.length > 0 ? jobs : SAMPLE_JOBS;
    return source.filter(([, j]) => {
      const matchCat = catFilter === "Todas" || j.category === catFilter;
      const matchUrgent = !showUrgent || j.urgency;
      return matchCat && matchUrgent;
    });
  }, [jobs, catFilter, showUrgent]);

  return (
    <div className="pb-20">
      <div className="bg-primary px-4 pt-10 pb-4">
        <h1 className="font-heading font-bold text-xl text-primary-foreground mb-3">
          Vagas Disponíveis
        </h1>
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="jobs.all.tab"
            onClick={() => setShowUrgent(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              !showUrgent
                ? "bg-primary-foreground text-primary"
                : "bg-primary-foreground/20 text-primary-foreground"
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            data-ocid="jobs.urgent.tab"
            onClick={() => setShowUrgent(true)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-colors ${
              showUrgent
                ? "bg-orange-400 text-white"
                : "bg-primary-foreground/20 text-primary-foreground"
            }`}
          >
            <Zap size={11} /> Urgentes
          </button>
        </div>
      </div>

      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            data-ocid="jobs.category.tab"
            onClick={() => setCatFilter(c)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
              catFilter === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3">
        {isLoading &&
          Array.from({ length: 3 }, (_, i) => i + 1).map((n) => (
            <div
              key={`loading-${n}`}
              data-ocid="jobs.loading_state"
              className="bg-card border border-border rounded-lg p-4 space-y-2"
            >
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}

        {!isLoading && displayJobs.length === 0 && (
          <div
            data-ocid="jobs.empty_state"
            className="text-center py-10 text-muted-foreground"
          >
            <p className="text-sm">Nenhuma vaga encontrada</p>
          </div>
        )}

        {!isLoading &&
          displayJobs.map(([, job], idx) => (
            <div
              key={job.title}
              data-ocid={`jobs.item.${idx + 1}`}
              className={`bg-card rounded-lg border p-4 ${
                job.urgency ? "border-orange-300 bg-orange-50" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-heading font-semibold text-sm text-foreground flex-1">
                  {job.title}
                </h3>
                {job.urgency && (
                  <Badge className="bg-orange-500 text-white text-[10px] flex-shrink-0 flex items-center gap-0.5">
                    <Zap size={9} /> Urgente
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {job.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin size={11} />
                    <span>{job.location}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">
                    {job.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold text-sm">
                  <Banknote size={13} />
                  <span>{Number(job.budget).toLocaleString("pt-MZ")} MT</span>
                </div>
              </div>
              {job.requiredSkills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.requiredSkills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-[10px]">
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
