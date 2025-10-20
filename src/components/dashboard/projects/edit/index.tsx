"use client"

import type { Editor as TiptapEditor } from "@tiptap/react"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import useProjectEditorStore from "@/store/project-edtor-store"
import type { ProjectType } from "@/utils/db"
import Editor from "./editor"

export default function ProjectEditor({ project }: { project: ProjectType }) {
  const setProject = useProjectEditorStore(state => state.setProject)

  const [description, setDescription] = useState<string>(
    project.description ?? ""
  )

  const debouncedDescription = useDebounce(description, 500)

  useEffect(() => {
    setProject(project)
  }, [project])

  useEffect(() => {
    if (debouncedDescription !== project.description) {
      setProject({
        ...project,
        description: debouncedDescription,
      })
    }
  }, [debouncedDescription, project, setProject])

  function handleEditorChange(editor: TiptapEditor) {
    setDescription(editor.getHTML())
  }

  return (
    <Editor
      initialValue={project.description ?? undefined}
      onChange={handleEditorChange}
    />
  )
}
