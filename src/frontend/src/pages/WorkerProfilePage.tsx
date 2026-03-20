import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Briefcase, Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../components/BottomNav";
import { InitialsAvatar } from "../components/InitialsAvatar";
import { StarRating } from "../components/StarRating";
import { TrustBadge } from "../components/TrustBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddJobCompletionMutation,
  useWorkerProfile,
} from "../hooks/useQueries";

interface WorkerProfilePageProps {
  workerPrincipal: string | null;
  onNavigate: (page: Page) => void;
}

export function WorkerProfilePage({
  workerPrincipal,
  onNavigate,
}: WorkerProfilePageProps) {
  const { data: profile, isLoading } = useWorkerProfile(workerPrincipal);
  const { identity } = useInternetIdentity();
  const addCompletion = useAddJobCompletionMutation();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const handleRate = async () => {
    if (!identity) {
      toast.error("Faça login para avaliar");
      return;
    }
    if (!workerPrincipal || selectedRating === 0) {
      toast.error("Selecione uma avaliação");
      return;
    }
    try {
      await addCompletion.mutateAsync({
        worker: workerPrincipal,
        rating: selectedRating,
      });
      setHasRated(true);
      toast.success("Avaliação enviada!");
    } catch {
      toast.error("Erro ao enviar avaliação");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4" data-ocid="worker_profile.loading_state">
        <Skeleton className="h-6 w-20" />
        <div className="flex gap-3">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center" data-ocid="worker_profile.error_state">
        <p className="text-muted-foreground mb-4">Perfil não encontrado</p>
        <Button onClick={() => onNavigate("home")}>Voltar ao Início</Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-5">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="text-primary-foreground/80 mb-4 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Voltar</span>
        </button>
        <div className="flex items-start gap-4">
          <div className="relative">
            <InitialsAvatar name={profile.name} size="lg" />
            <span
              className={`absolute bottom-1 right-0 w-4 h-4 rounded-full border-2 border-primary ${
                profile.isAvailable ? "bg-green-400" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex-1">
            <h1 className="font-heading font-bold text-xl text-primary-foreground">
              {profile.name}
            </h1>
            <p className="text-primary-foreground/80 text-sm">
              {profile.profession}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <StarRating rating={profile.rating} size={14} />
              <span className="text-primary-foreground/80 text-xs">
                ({profile.rating.toFixed(1)})
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-heading font-bold text-xl text-primary-foreground">
              {Number(profile.hourlyRate).toLocaleString("pt-MZ")} MT
            </p>
            <p className="text-primary-foreground/70 text-xs">/hora</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Info */}
        <div className="bg-card rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={15} className="text-primary" />
            <span>
              {profile.neighborhood}, {profile.city}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone size={15} className="text-primary" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock size={15} className="text-primary" />
            <span>{Number(profile.experienceYears)} anos de experiência</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Briefcase size={15} className="text-primary" />
            <span>{Number(profile.jobCount)} trabalhos realizados</span>
          </div>
        </div>

        {/* Trust badges */}
        {profile.trustBadges.length > 0 && (
          <div>
            <h3 className="font-heading font-semibold text-sm mb-2">
              Selos de Confiança
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.trustBadges.map((b) => (
                <TrustBadge key={b} badge={b} />
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <div>
            <h3 className="font-heading font-semibold text-sm mb-2">
              Habilidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s) => (
                <Badge key={s} variant="secondary" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Rate */}
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-heading font-semibold text-sm mb-3">
            Avaliar este profissional
          </h3>
          {hasRated ? (
            <p
              data-ocid="worker_profile.rating.success_state"
              className="text-primary text-sm font-medium text-center"
            >
              ✓ Avaliação enviada com sucesso!
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <StarRating
                  rating={selectedRating}
                  size={28}
                  interactive
                  onRate={setSelectedRating}
                />
              </div>
              <Button
                data-ocid="worker_profile.rate.submit_button"
                onClick={handleRate}
                className="w-full"
                disabled={selectedRating === 0 || addCompletion.isPending}
              >
                {addCompletion.isPending
                  ? "A enviar..."
                  : `Avaliar com ${selectedRating} estrela${selectedRating !== 1 ? "s" : ""}`}
              </Button>
            </div>
          )}
        </div>

        {/* Contact */}
        <Button
          data-ocid="worker_profile.contact.primary_button"
          className="w-full"
          size="lg"
        >
          Contactar via WhatsApp
        </Button>
      </div>
    </div>
  );
}
