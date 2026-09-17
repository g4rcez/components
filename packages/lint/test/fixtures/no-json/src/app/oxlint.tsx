// Linted by test/oxlint.test.ts: no components.json, components by
// import pattern, theme by discovery, variants through the barrel.
import { Button } from "@/ds"

export function OxlintCheck() {
  return <Button className="bg-highlight">Go</Button>
}
