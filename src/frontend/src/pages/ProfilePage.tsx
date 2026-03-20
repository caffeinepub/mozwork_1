import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Clock, Loader2, LogOut, MapPin, Phone } from "lucide-react";
import { Variant_client_company_worker } from "../backend.d";
import type { Page } from "../components/BottomNav";
import { InitialsAvatar } from "../components/InitialsAvatar";
import { StarRating } from "../components/StarRating";
import { TrustBadge } from "../components/TrustBadge";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useCallerUserProfile } from "../hooks/useQueries";

interface ProfilePageProps {
  onNavigate: (page: Page) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerUserProfile();

  if (!identity) {
    return (
      <div className="pb-20">
        <div className="bg-primary px-4 pt-10 pb-5">
          <h1 className="font-heading font-bold text-xl text-primary-foreground">
            Meu Perfil
          </h1>
        </div>
        <div className="px-4 py-10 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="font-heading font-bold text-lg mb-2">
            Bem-vindo ao MozWork
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Entre para aceder ao seu perfil
          </p>
          <Button
            data-ocid="profile.login.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full"
            size="lg"
          >
            {isLoggingIn && <Loader2 size={16} className="mr-2 animate-spin" />}
            {isLoggingIn ? "A entrar..." : "Entrar"}
          </Button>
          <Button
            data-ocid="profile.register.secondary_button"
            variant="outline"
            className="w-full mt-3"
            onClick={() => onNavigate("register")}
          >
            Criar Conta
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 space-y-4" data-ocid="profile.loading_state">
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-3">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pb-20">
        <div className="bg-primary px-4 pt-10 pb-5">
          <h1 className="font-heading font-bold text-xl text-primary-foreground">
            Meu Perfil
          </h1>
        </div>
        <div className="px-4 py-8 text-center" data-ocid="profile.empty_state">
          <p className="text-muted-foreground text-sm mb-4">
            Você ainda não tem um perfil
          </p>
          <Button
            data-ocid="profile.create.primary_button"
            onClick={() => onNavigate("register")}
            className="w-full"
          >
            Criar Perfil
          </Button>
          <Button
            data-ocid="profile.logout.secondary_button"
            variant="ghost"
            className="w-full mt-2 text-muted-foreground"
            onClick={clear}
          >
            <LogOut size={14} className="mr-2" /> Sair
          </Button>
        </div>
      </div>
    );
  }

  const isWorker = profile.userType === Variant_client_company_worker.worker;

  return (
    <div className="pb-20">
      <div className="bg-primary px-4 pt-10 pb-5">
        <div className="flex items-start gap-4">
          <InitialsAvatar name={profile.name} size="lg" />
          <div className="flex-1">
            <h1 className="font-heading font-bold text-xl text-primary-foreground">
              {profile.name}
            </h1>
            {isWorker && profile.profession && (
              <p className="text-primary-foreground/80 text-sm">
                {profile.profession}
              </p>
            )}
            <p className="text-primary-foreground/70 text-xs mt-0.5">
              {profile.userType === Variant_client_company_worker.worker
                ? "Trabalhador"
                : profile.userType === Variant_client_company_worker.company
                  ? "Empresa"
                  : "Cliente"}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="bg-card rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={15} className="text-primary" />
            <span>{profile.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin size={15} className="text-primary" />
            <span>
              {profile.neighborhood}, {profile.city}
            </span>
          </div>
          {isWorker && profile.experienceYears !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Clock size={15} className="text-primary" />
              <span>{Number(profile.experienceYears)} anos de experiência</span>
            </div>
          )}
          {isWorker && profile.jobCount !== undefined && (
            <div className="flex items-center gap-2 text-sm">
              <Briefcase size={15} className="text-primary" />
              <span>{Number(profile.jobCount)} trabalhos realizados</span>
            </div>
          )}
        </div>

        {isWorker && profile.rating !== undefined && (
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-heading font-semibold text-sm mb-2">
              Avaliação
            </h3>
            <div className="flex items-center gap-2">
              <StarRating rating={profile.rating} size={16} />
              <span className="font-bold text-lg text-foreground">
                {profile.rating.toFixed(1)}
              </span>
            </div>
          </div>
        )}

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

        <div className="pt-2">
          <p className="text-xs text-muted-foreground mb-3">
            Principal: {identity.getPrincipal().toString().slice(0, 20)}...
          </p>
          <Button
            data-ocid="profile.logout.primary_button"
            variant="outline"
            className="w-full text-destructive border-destructive/30 hover:bg-destructive/5"
            onClick={clear}
          >
            <LogOut size={14} className="mr-2" /> Terminar Sessão
          </Button>
        </div>
      </div>

      <footer className="px-4 py-5 text-center text-xs text-muted-foreground border-t border-border">
        © {new Date().getFullYear()} MozWork.{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="hover:text-primary"
          target="_blank"
          rel="noreferrer"
        >
          Feito com ❤ usando caffeine.ai
        </a>
      </footer>
    </div>
  );
}
