import { Button } from "@/components/ui/button";
import { Briefcase, Star, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { Page } from "../components/BottomNav";

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const features = [
  {
    icon: Users,
    title: "Profissionais Verificados",
    desc: "Trabalhadores com selos de confiança",
  },
  {
    icon: Zap,
    title: "Resposta Rápida",
    desc: "Conecte-se em minutos, mesmo com internet fraca",
  },
  {
    icon: Star,
    title: "Avaliações Reais",
    desc: "Sistema de avaliações por clientes reais",
  },
  {
    icon: Briefcase,
    title: "Vagas Urgentes",
    desc: "Botão 'Preciso Agora' para alertas imediatos",
  },
];

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-primary px-5 pt-12 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 text-primary-foreground rounded-full px-3 py-1 text-xs font-medium mb-4">
            🇲🇿 Feito para Moçambique
          </div>
          <h1 className="font-heading text-3xl font-bold text-primary-foreground leading-tight mb-2">
            Encontre profissionais
            <br />
            <span className="text-primary-foreground/80">perto de você</span>
          </h1>
          <p className="text-primary-foreground/80 text-sm mb-6">
            MozWork conecta clientes a trabalhadores locais de forma rápida,
            segura e confiável.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              data-ocid="landing.register.primary_button"
              size="lg"
              className="bg-primary-foreground text-primary font-heading font-bold hover:bg-primary-foreground/90 w-full"
              onClick={() => onNavigate("register")}
            >
              Começar Agora
            </Button>
            <Button
              data-ocid="landing.home.secondary_button"
              variant="outline"
              size="lg"
              className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 w-full"
              onClick={() => onNavigate("home")}
            >
              Ver Profissionais
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        {[
          { value: "2.4K+", label: "Trabalhadores" },
          { value: "8.1K+", label: "Serviços" },
          { value: "4.8★", label: "Avaliação" },
        ].map(({ value, label }) => (
          <div key={label} className="py-4 text-center">
            <p className="font-heading font-bold text-lg text-primary">
              {value}
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="px-4 py-6">
        <h2 className="font-heading font-bold text-base mb-4 text-foreground">
          Por que usar o MozWork?
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-lg border border-border p-3"
            >
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                <Icon size={18} className="text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-xs text-foreground mb-1">
                {title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-snug">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Professions */}
      <div className="px-4 pb-6">
        <h2 className="font-heading font-bold text-base mb-3 text-foreground">
          Profissões Populares
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Canalizador",
            "Eletricista",
            "Pintor",
            "Carpinteiro",
            "Motorista",
            "Segurança",
            "Cozinheira",
            "Mecânico",
          ].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onNavigate("home")}
              className="px-3 py-1.5 rounded-full border border-primary/30 text-primary text-xs font-medium bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
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
