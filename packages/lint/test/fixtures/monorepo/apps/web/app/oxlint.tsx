// Linted by test/oxlint.test.ts: the ui alias resolves through tsconfig
// paths into the workspace package.
import { Button } from "@workspace/ui/components/button"

export function OxlintCheck() {
  return <Button className="bg-red-500">Go</Button>
}
