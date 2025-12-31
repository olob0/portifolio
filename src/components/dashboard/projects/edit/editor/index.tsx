"use client"

import TextAlign from "@tiptap/extension-text-align"
import { CharacterCount, Placeholder } from "@tiptap/extensions"
import {
  EditorContent,
  type Editor as TiptapEditor,
  useEditor,
  useEditorState,
} from "@tiptap/react"
import { BubbleMenu } from "@tiptap/react/menus"
import StarterKit from "@tiptap/starter-kit"
import {
  LucideAlignCenter,
  LucideAlignJustify,
  LucideAlignLeft,
  LucideAlignRight,
  LucideBold,
  LucideItalic,
  LucideRotateCcw,
  LucideStrikethrough,
} from "lucide-react"
import { memo } from "react"
import CharacterCounter from "@/components/editor/character-counter"
import { Button } from "@/components/ui/button"

interface EditorProps {
  initialValue?: string
  onChange?: (editor: TiptapEditor) => void
}

const extensions = [
  StarterKit,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Describe your project...",
    showOnlyWhenEditable: true,
  }),
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

  function posText(pos: "center" | "left" | "right" | "justify") {
    if (!editor) return

    editor.commands.setTextAlign(pos)
  }

  const bubbleMenuOptions = [
    {
      id: "marks",
      options: [
        {
          icon: LucideBold,
          label: "Bold",
          command: () => {
            if (!editor) return
            editor.chain().focus().toggleBold().run()
          },
        },
        {
          icon: LucideItalic,
          label: "Italic",
          command: () => {
            if (!editor) return
            editor.chain().focus().toggleItalic().run()
          },
        },
        {
          icon: LucideStrikethrough,
          label: "Strike",
          command: () => {
            if (!editor) return
            editor.chain().focus().toggleStrike().run()
          },
        },
        {
          icon: LucideRotateCcw,
          label: "Reset",
          expanded: true,
          command: () => {
            if (!editor) return
            editor.chain().focus().unsetAllMarks().run()
          },
        },
      ],
    },
    {
      id: "align",
      options: [
        {
          icon: LucideAlignLeft,
          label: "Left",
          command: () => posText("left"),
        },
        {
          icon: LucideAlignCenter,
          label: "Center",
          command: () => posText("center"),
        },
        {
          icon: LucideAlignRight,
          label: "Right",
          command: () => posText("right"),
        },
        {
          icon: LucideAlignJustify,
          label: "Justify",
          command: () => posText("justify"),
        },
      ],
    },
  ]

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

      <BubbleMenu editor={editor}>
        <div className="flex bg-card border rounded-sm divide-x-4">
          {bubbleMenuOptions.map(section => (
            <div key={section.id} className="divide-x">
              {section.options.map(option => (
                <Button
                  key={option.label}
                  variant="ghost"
                  size="sm"
                  data-active={editor.isActive(option.label.toLowerCase())}
                  className="rounded-none data-[active=true]:bg-muted"
                  onClick={option.command}
                  aria-label={option.label}
                  title={option.label}
                >
                  <option.icon className="size-4" />
                  {option.expanded && <span>{option.label}</span>}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </BubbleMenu>
    </>
  )
}

export default memo(Editor)
