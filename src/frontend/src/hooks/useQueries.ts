import { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useAllWorkers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allWorkers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorkers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllJobListings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allJobListings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJobListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyWorkerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myWorkerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWorkerProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMyClientProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myClientProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyClientProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useWorkerProfile(workerPrincipal: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["workerProfile", workerPrincipal],
    queryFn: async () => {
      if (!actor || !workerPrincipal) return null;
      return actor.getWorkerProfile(Principal.fromText(workerPrincipal));
    },
    enabled: !!actor && !isFetching && !!workerPrincipal,
  });
}

export function useWorkerRatings(workerPrincipal: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["workerRatings", workerPrincipal],
    queryFn: async () => {
      if (!actor || !workerPrincipal) return [];
      return actor.getWorkerRatings(Principal.fromText(workerPrincipal));
    },
    enabled: !!actor && !isFetching && !!workerPrincipal,
  });
}

export function useAddWorkerMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phone: string;
      profession: string;
      city: string;
      neighborhood: string;
      profilePhotoId: string;
      hourlyRate: bigint;
    }) => {
      if (!actor) throw new Error("Não autenticado");
      return actor.addWorker(
        params.name,
        params.phone,
        params.profession,
        params.city,
        params.neighborhood,
        params.profilePhotoId,
        params.hourlyRate,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allWorkers"] });
      qc.invalidateQueries({ queryKey: ["myWorkerProfile"] });
      qc.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useAddClientMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      name: string;
      phone: string;
      city: string;
      neighborhood: string;
      profilePhotoId: string;
    }) => {
      if (!actor) throw new Error("Não autenticado");
      return actor.addClient(
        params.name,
        params.phone,
        params.city,
        params.neighborhood,
        params.profilePhotoId,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allClients"] });
      qc.invalidateQueries({ queryKey: ["myClientProfile"] });
      qc.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useAddJobListingMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      requiredSkills: string[];
      location: string;
      budget: bigint;
      urgency: boolean;
      category: string;
      profession: string;
      hourlyRate: bigint | null;
    }) => {
      if (!actor) throw new Error("Não autenticado");
      return actor.addJobListing(
        params.title,
        params.description,
        params.requiredSkills,
        params.location,
        params.budget,
        params.urgency,
        params.category,
        params.profession,
        params.hourlyRate,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allJobListings"] });
    },
  });
}

export function useAddJobCompletionMutation() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { worker: string; rating: number }) => {
      if (!actor) throw new Error("Não autenticado");
      return actor.addJobCompletionRecord(
        Principal.fromText(params.worker),
        params.rating,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allWorkers"] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Não autenticado");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}
