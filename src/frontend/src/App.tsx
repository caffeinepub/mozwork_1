import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { BottomNav } from "./components/BottomNav";
import type { Page } from "./components/BottomNav";
import { HomePage } from "./pages/HomePage";
import { JobsPage } from "./pages/JobsPage";
import { LandingPage } from "./pages/LandingPage";
import { PostJobPage } from "./pages/PostJobPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RankingPage } from "./pages/RankingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { WorkerProfilePage } from "./pages/WorkerProfilePage";

const BOTTOM_NAV_PAGES: Page[] = [
  "home",
  "jobs",
  "postJob",
  "ranking",
  "profile",
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [workerPrincipal, setWorkerPrincipal] = useState<string | null>(null);

  const navigate = (page: Page, extra?: { workerPrincipal?: string }) => {
    if (extra?.workerPrincipal) setWorkerPrincipal(extra.workerPrincipal);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const showBottomNav = BOTTOM_NAV_PAGES.includes(currentPage);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[480px] min-h-screen relative">
        {currentPage === "landing" && <LandingPage onNavigate={navigate} />}
        {currentPage === "register" && <RegisterPage onNavigate={navigate} />}
        {currentPage === "home" && <HomePage onNavigate={navigate} />}
        {currentPage === "workerProfile" && (
          <WorkerProfilePage
            workerPrincipal={workerPrincipal}
            onNavigate={navigate}
          />
        )}
        {currentPage === "postJob" && <PostJobPage onNavigate={navigate} />}
        {currentPage === "jobs" && <JobsPage />}
        {currentPage === "ranking" && <RankingPage onNavigate={navigate} />}
        {currentPage === "profile" && <ProfilePage onNavigate={navigate} />}

        {showBottomNav && (
          <BottomNav current={currentPage} onChange={navigate} />
        )}
      </div>
      <Toaster />
    </div>
  );
}
