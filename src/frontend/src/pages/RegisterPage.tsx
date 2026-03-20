import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../components/BottomNav";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddClientMutation,
  useAddWorkerMutation,
} from "../hooks/useQueries";

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
}

const CITIES = [
  "Maputo",
  "Matola",
  "Beira",
  "Nampula",
  "Quelimane",
  "Tete",
  "Inhambane",
  "Chimoio",
];
const PROFESSIONS = [
  "Canalizador",
  "Eletricista",
  "Pintor",
  "Carpinteiro",
  "Motorista",
  "Segurança",
  "Cozinheira",
  "Mecânico",
  "Jardineiro",
  "Servente",
];

export function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { login, identity, isLoggingIn } = useInternetIdentity();
  const addWorker = useAddWorkerMutation();
  const addClient = useAddClientMutation();

  const [workerForm, setWorkerForm] = useState({
    name: "",
    phone: "",
    profession: PROFESSIONS[0],
    city: CITIES[0],
    neighborhood: "",
    hourlyRate: "",
    skills: "",
  });
  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    city: CITIES[0],
    neighborhood: "",
  });

  const handleWorkerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Faça login primeiro");
      return;
    }
    try {
      await addWorker.mutateAsync({
        name: workerForm.name,
        phone: workerForm.phone,
        profession: workerForm.profession,
        city: workerForm.city,
        neighborhood: workerForm.neighborhood,
        profilePhotoId: "",
        hourlyRate: BigInt(workerForm.hourlyRate || "0"),
      });
      toast.success("Perfil de trabalhador criado!");
      onNavigate("home");
    } catch {
      toast.error("Erro ao criar perfil. Tente novamente.");
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Faça login primeiro");
      return;
    }
    try {
      await addClient.mutateAsync({
        name: clientForm.name,
        phone: clientForm.phone,
        city: clientForm.city,
        neighborhood: clientForm.neighborhood,
        profilePhotoId: "",
      });
      toast.success("Perfil de cliente criado!");
      onNavigate("home");
    } catch {
      toast.error("Erro ao criar perfil. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-5">
        <button
          type="button"
          onClick={() => onNavigate("landing")}
          className="text-primary-foreground/80 mb-3 flex items-center gap-1"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Voltar</span>
        </button>
        <h1 className="font-heading text-2xl font-bold text-primary-foreground">
          Criar Conta
        </h1>
        <p className="text-primary-foreground/80 text-sm">
          Junte-se ao MozWork
        </p>
      </div>

      <div className="px-4 py-5">
        {!identity && (
          <div className="bg-card border border-border rounded-lg p-4 mb-5 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Para se registar, precisa de fazer login primeiro
            </p>
            <Button
              data-ocid="register.login.primary_button"
              onClick={login}
              disabled={isLoggingIn}
              className="w-full"
            >
              {isLoggingIn && (
                <Loader2 size={16} className="mr-2 animate-spin" />
              )}
              {isLoggingIn ? "A entrar..." : "Entrar com Internet Identity"}
            </Button>
          </div>
        )}

        <Tabs defaultValue="worker" data-ocid="register.type.tab">
          <TabsList className="w-full mb-5">
            <TabsTrigger
              value="worker"
              className="flex-1"
              data-ocid="register.worker.tab"
            >
              Trabalhador
            </TabsTrigger>
            <TabsTrigger
              value="client"
              className="flex-1"
              data-ocid="register.client.tab"
            >
              Cliente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="worker">
            <form onSubmit={handleWorkerSubmit} className="space-y-4">
              <div>
                <Label htmlFor="w-name">Nome Completo</Label>
                <Input
                  id="w-name"
                  data-ocid="register.worker.name.input"
                  placeholder="Ex: João Machava"
                  value={workerForm.name}
                  onChange={(e) =>
                    setWorkerForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="w-phone">Telefone</Label>
                <Input
                  id="w-phone"
                  data-ocid="register.worker.phone.input"
                  placeholder="Ex: 84 123 4567"
                  value={workerForm.phone}
                  onChange={(e) =>
                    setWorkerForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="w-prof">Profissão</Label>
                <select
                  id="w-prof"
                  data-ocid="register.worker.profession.select"
                  className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={workerForm.profession}
                  onChange={(e) =>
                    setWorkerForm((p) => ({ ...p, profession: e.target.value }))
                  }
                >
                  {PROFESSIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="w-city">Cidade</Label>
                  <select
                    id="w-city"
                    data-ocid="register.worker.city.select"
                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={workerForm.city}
                    onChange={(e) =>
                      setWorkerForm((p) => ({ ...p, city: e.target.value }))
                    }
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="w-neigh">Bairro</Label>
                  <Input
                    id="w-neigh"
                    data-ocid="register.worker.neighborhood.input"
                    placeholder="Ex: Polana"
                    value={workerForm.neighborhood}
                    onChange={(e) =>
                      setWorkerForm((p) => ({
                        ...p,
                        neighborhood: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="w-rate">Taxa por Hora (MT)</Label>
                <Input
                  id="w-rate"
                  data-ocid="register.worker.hourlyrate.input"
                  type="number"
                  placeholder="Ex: 500"
                  value={workerForm.hourlyRate}
                  onChange={(e) =>
                    setWorkerForm((p) => ({ ...p, hourlyRate: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="w-skills">
                  Habilidades (separadas por vírgula)
                </Label>
                <Input
                  id="w-skills"
                  data-ocid="register.worker.skills.input"
                  placeholder="Ex: Encanamento, Soldagem"
                  value={workerForm.skills}
                  onChange={(e) =>
                    setWorkerForm((p) => ({ ...p, skills: e.target.value }))
                  }
                />
              </div>
              <Button
                data-ocid="register.worker.submit_button"
                type="submit"
                className="w-full"
                disabled={addWorker.isPending || !identity}
              >
                {addWorker.isPending && (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                )}
                {addWorker.isPending
                  ? "A registar..."
                  : "Registar como Trabalhador"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="client">
            <form onSubmit={handleClientSubmit} className="space-y-4">
              <div>
                <Label htmlFor="c-name">Nome Completo</Label>
                <Input
                  id="c-name"
                  data-ocid="register.client.name.input"
                  placeholder="Ex: Maria Tembe"
                  value={clientForm.name}
                  onChange={(e) =>
                    setClientForm((p) => ({ ...p, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="c-phone">Telefone</Label>
                <Input
                  id="c-phone"
                  data-ocid="register.client.phone.input"
                  placeholder="Ex: 82 987 6543"
                  value={clientForm.phone}
                  onChange={(e) =>
                    setClientForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="c-city">Cidade</Label>
                  <select
                    id="c-city"
                    data-ocid="register.client.city.select"
                    className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    value={clientForm.city}
                    onChange={(e) =>
                      setClientForm((p) => ({ ...p, city: e.target.value }))
                    }
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="c-neigh">Bairro</Label>
                  <Input
                    id="c-neigh"
                    data-ocid="register.client.neighborhood.input"
                    placeholder="Ex: Sommerschield"
                    value={clientForm.neighborhood}
                    onChange={(e) =>
                      setClientForm((p) => ({
                        ...p,
                        neighborhood: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <Button
                data-ocid="register.client.submit_button"
                type="submit"
                className="w-full"
                disabled={addClient.isPending || !identity}
              >
                {addClient.isPending && (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                )}
                {addClient.isPending
                  ? "A registar..."
                  : "Registar como Cliente"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
