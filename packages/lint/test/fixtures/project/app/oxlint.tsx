// Linted by test/oxlint.test.ts through Oxlint's jsPlugins, to check
// that the built plugin resolves the project the same way under Oxlint.
import { SaveButton } from "@/components/save-button"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function OxlintCheck({ cls }: { cls: string }) {
  return (
    <>
      <Button className="bg-red-500 text-[13px]">Go</Button>
      <Button className={cls}>Go</Button>
      <SaveButton className="rounded-full">Save</SaveButton>
      <Card className="bg-highlight flex-cols">Hi</Card>
      <svg>
        <path fill="#ff00aa" />
      </svg>
      <div style={{ color: "#333" }} />
    </>
  )
}
