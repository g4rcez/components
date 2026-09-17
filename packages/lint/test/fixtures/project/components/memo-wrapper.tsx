import * as React from "react"
import { Button } from "@/components/ui/button"

function Save(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} />
}

// The wrapper is the memoized named function.
export const MemoButton = React.memo(Save)
