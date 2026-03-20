import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useAddJobListingMutation } from "../hooks/useQueries";

const CATEGORIES = [
  "Reparação",
  "Construção",
  "Transporte",
  "Limpeza",
  "Cozinha",
  "Segurança",
  "Jardinagem",
  "Outros",
];
const PROFESSIONS = [
  "Canalizador",
  "Eletricista",
  "Pintor",
  "Carpinteiro",
  "Motorista",
  "Segurança",
  "Cozinheira",
  "Jardineiro",
  "Outro",
];

interface PostJobPageProps {
  onNavigate: (page: Page) => void;
}

export function PostJobPage({ onNavigate }: PostJobPageProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const addJob = useAddJobListingMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    profession: PROFESSIONS[0],
    location: "",
    budget: "",
    urgency: false,
    category: CATEGORIES[0],
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Faça login primeiro");
      return;
    }
    try {
      await addJob.mutateAsync({
        title: form.title,
        description: form.description,
        requiredSkills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        location: form.location,
        budget: BigInt(form.budget || "0"),
        urgency: form.urgency,
        category: form.category,
        profession: form.profession,
        hourlyRate: null,
      });
      toast.success("Vaga publicada com sucesso!");
      onNavigate("jobs");
    } catch {
      toast.error("Erro ao publicar vaga. Tente novamente.");
    }
  };

  return (
    <div className="pb-20">
      <div className="bg-primary px-4 pt-10 pb-5">
        <h1 className="font-heading font-bold text-xl text-primary-foreground">
          Publicar Vaga
        </h1>
        <p className="text-primary-foreground/80 text-sm">
          Encontre o profissional certo
        </p>
      </div>

      <div className="px-4 py-5">
        {!identity && (
          <div className="bg-card border border-border rounded-lg p-4 mb-5 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Faça login para publicar vagas
            </p>
            <Button
              data-ocid="postjob.login.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full"
            >
              {isLoggingIn && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              Entrar
            </Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="j-title">Título da Vaga</Label>
            <Input
              id="j-title"
              data-ocid="postjob.title.input"
              placeholder="Ex: Preciso de eletricista urgente"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="j-desc">Descrição</Label>
            <Textarea
              id="j-desc"
              data-ocid="postjob.description.textarea"
              placeholder="Descreva o trabalho em detalhe..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="j-cat">Categoria</Label>
              <select
                id="j-cat"
                data-ocid="postjob.category.select"
                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="j-prof">Profissão</Label>
              <select
                id="j-prof"
                data-ocid="postjob.profession.select"
                className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={form.profession}
                onChange={(e) =>
                  setForm((p) => ({ ...p, profession: e.target.value }))
                }
              >
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="j-loc">Localização</Label>
            <Input
              id="j-loc"
              data-ocid="postjob.location.input"
              placeholder="Ex: Polana, Maputo"
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="j-budget">Orçamento (MT)</Label>
            <Input
              id="j-budget"
              data-ocid="postjob.budget.input"
              type="number"
              placeholder="Ex: 2000"
              value={form.budget}
              onChange={(e) =>
                setForm((p) => ({ ...p, budget: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="j-skills">
              Habilidades necessárias (separadas por vírgula)
            </Label>
            <Input
              id="j-skills"
              data-ocid="postjob.skills.input"
              placeholder="Ex: Soldagem, Instalações"
              value={form.skills}
              onChange={(e) =>
                setForm((p) => ({ ...p, skills: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center justify-between bg-orange-50 rounded-lg border border-orange-100 p-3">
            <div>
              <p className="font-medium text-sm text-orange-800">Urgente</p>
              <p className="text-xs text-orange-600">
                Alerta trabalhadores próximos
              </p>
            </div>
            <Switch
              data-ocid="postjob.urgency.switch"
              checked={form.urgency}
              onCheckedChange={(v) => setForm((p) => ({ ...p, urgency: v }))}
            />
          </div>

          <Button
            data-ocid="postjob.submit_button"
            type="submit"
            className="w-full"
            size="lg"
            disabled={addJob.isPending || !identity}
          >
            {addJob.isPending && (
              <Loader2 size={16} className="mr-2 animate-spin" />
            )}
            {addJob.isPending ? "A publicar..." : "Publicar Vaga"}
          </Button>
        </form>
      </div>
    </div>
  );
}
