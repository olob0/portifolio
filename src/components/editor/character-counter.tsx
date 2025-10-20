import { Separator } from "@radix-ui/react-separator"

interface CharacterCounterProps {
  charactersCount: number
  wordsCount: number
}

export default function CharacterCounter({
  charactersCount,
  wordsCount,
}: CharacterCounterProps) {
  return (
    <div className="text-sm flex items-center h-8 bg-muted/20 rounded-2xl py-1 px-2 select-none">
      <p>{charactersCount}/2000</p>

      <Separator
        orientation="vertical"
        className="data-[orientation=vertical]:h-6 mx-2"
      />

      <p>
        {wordsCount} {wordsCount === 1 ? "word" : "words"}
      </p>
    </div>
  )
}
