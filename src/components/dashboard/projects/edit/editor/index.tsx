"use client"

import { CharacterCount } from "@tiptap/extensions"
import {
  EditorContent,
  type Editor as TiptapEditor,
  useEditor,
  useEditorState,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { memo } from "react"
import CharacterCounter from "@/components/editor/character-counter"

interface EditorProps {
  initialValue?: string
  onChange?: (editor: TiptapEditor) => void
}

const extensions = [
  StarterKit,
  CharacterCount.configure({
    limit: 2000,
  }),
]

function Editor({ initialValue, onChange }: EditorProps) {
  const editor = useEditor({
    extensions,
    content: initialValue,
    immediatelyRender: false,
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "outline-none mt-12 mb-32 px-4 prose lg:prose-lg prose-zinc dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor)
    },
  })

  const { charactersCount = 0, wordsCount = 0 } =
    useEditorState({
      editor,
      selector: context => ({
        charactersCount: context.editor?.storage.characterCount.characters(),
        wordsCount: context.editor?.storage.characterCount.words(),
      }),
    }) || {}

  if (!editor) {
    return null
  }

  return (
    <>
      <EditorContent editor={editor} />

      <div className="absolute bottom-4 right-4">
        <CharacterCounter
          charactersCount={charactersCount}
          wordsCount={wordsCount}
        />
      </div>
    </>
  )
}

export default memo(Editor)
