import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WorkerProfile {
    city: string;
    neighborhood: string;
    name: string;
    profilePhotoId: string;
    hourlyRate: bigint;
    profession: string;
    isAvailable: boolean;
    trustBadges: Array<string>;
    experienceYears: bigint;
    rating: number;
    phone: string;
    jobCount: bigint;
    skills: Array<string>;
}
export interface JobCompletionRecord {
    client: Principal;
    rating: number;
    worker: Principal;
}
export interface ClientProfile {
    city: string;
    neighborhood: string;
    name: string;
    profilePhotoId: string;
    phone: string;
}
export interface JobListing {
    title: string;
    urgency: boolean;
    hourlyRate?: bigint;
    profession: string;
    description: string;
    isVerified: boolean;
    category: string;
    budget: bigint;
    requiredSkills: Array<string>;
    location: string;
}
export interface UserProfile {
    userType: Variant_client_company_worker;
    city: string;
    neighborhood: string;
    name: string;
    profilePhotoId: string;
    hourlyRate?: bigint;
    profession?: string;
    isAvailable?: boolean;
    trustBadges: Array<string>;
    experienceYears?: bigint;
    rating?: number;
    phone: string;
    jobCount?: bigint;
    skills: Array<string>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_client_company_worker {
    client = "client",
    company = "company",
    worker = "worker"
}
export interface backendInterface {
    addClient(name: string, phone: string, city: string, neighborhood: string, profilePhotoId: string): Promise<void>;
    addJobCompletionRecord(worker: Principal, rating: number): Promise<void>;
    addJobListing(title: string, description: string, requiredSkills: Array<string>, location: string, budget: bigint, urgency: boolean, category: string, profession: string, hourlyRate: bigint | null): Promise<void>;
    addWorker(name: string, phone: string, profession: string, city: string, neighborhood: string, profilePhotoId: string, hourlyRate: bigint): Promise<void>;
    addWorkerSkill(skill: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllClients(): Promise<Array<[Principal, ClientProfile]>>;
    getAllJobListings(): Promise<Array<[Principal, JobListing]>>;
    getAllWorkers(): Promise<Array<[Principal, WorkerProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientProfile(client: Principal): Promise<ClientProfile | null>;
    getJobCompletionRecords(): Promise<Array<JobCompletionRecord>>;
    getJobListing(jobOwner: Principal): Promise<JobListing | null>;
    getMyClientProfile(): Promise<ClientProfile | null>;
    getMyJobListings(): Promise<Array<JobListing>>;
    getMyWorkerProfile(): Promise<WorkerProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkerProfile(worker: Principal): Promise<WorkerProfile | null>;
    getWorkerRatings(worker: Principal): Promise<Array<JobCompletionRecord>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateWorkerAvailability(isAvailable: boolean): Promise<boolean>;
    verifyJobListing(jobOwner: Principal): Promise<boolean>;
}
