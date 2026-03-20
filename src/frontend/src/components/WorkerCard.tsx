import { Card, CardContent } from "@/components/ui/card";
import type { Principal } from "@icp-sdk/core/principal";
import { MapPin } from "lucide-react";
import type { WorkerProfile } from "../backend.d";
import { InitialsAvatar } from "./InitialsAvatar";
import { StarRating } from "./StarRating";
import { TrustBadge } from "./TrustBadge";

interface WorkerCardProps {
  principal: Principal;
  profile: WorkerProfile;
  onClick: () => void;
  index: number;
}

export function WorkerCard({ profile, onClick, index }: WorkerCardProps) {
  return (
    <Card
      data-ocid={`workers.item.${index}`}
      className="cursor-pointer hover:shadow-card transition-shadow border-border"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="relative">
            <InitialsAvatar name={profile.name} size="md" />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                profile.isAvailable ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground truncate">
                  {profile.name}
                </h3>
                <p className="text-xs text-primary font-medium">
                  {profile.profession}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-foreground">
                  {Number(profile.hourlyRate).toLocaleString("pt-MZ")} MT
                </p>
                <p className="text-[10px] text-muted-foreground">/hora</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <MapPin
                size={11}
                className="text-muted-foreground flex-shrink-0"
              />
              <span className="text-xs text-muted-foreground truncate">
                {profile.neighborhood}, {profile.city}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <StarRating rating={profile.rating} size={12} />
              <div className="flex gap-1 flex-wrap justify-end">
                {profile.trustBadges.slice(0, 2).map((b) => (
                  <TrustBadge key={b} badge={b} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
