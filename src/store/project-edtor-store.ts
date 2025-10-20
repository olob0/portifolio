import { create } from "zustand"

import type { ProjectType } from "@/utils/db"

interface ProjectEditorState {
  project: ProjectType | null
  setProject: (project: ProjectType) => void
}

const useProjectEditorStore = create<ProjectEditorState>(set => ({
  project: null,
  setProject: project => set({ project }),
}))

export default useProjectEditorStore
