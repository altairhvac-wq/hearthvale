"use client";

import type { RegionId } from "@/types";
import { RestorationProjectPanel } from "@/components/restoration/RestorationProjectPanel";
import {
  useRegionRestoration,
  useRestoreCurrentStage,
  useStartRestorationProject,
} from "./use-region-restoration";

interface RegionRestorationFooterProps {
  regionId: RegionId;
  compact?: boolean;
}

export function RegionRestorationFooter({
  regionId,
  compact = false,
}: RegionRestorationFooterProps) {
  const projects = useRegionRestoration(regionId);
  const startRestorationProject = useStartRestorationProject();
  const restoreCurrentStage = useRestoreCurrentStage();

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <RestorationProjectPanel
          key={project.id}
          project={project}
          compact={compact}
          onStart={startRestorationProject}
          onRestore={restoreCurrentStage}
        />
      ))}
    </div>
  );
}
