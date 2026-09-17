// A wrapper of an open container: forwards className to CardContent,
// so from outside it accepts spacing the way CardContent does.
import { cn } from "@/lib/utils"

import { CardContent } from "@/components/ui/card"

export function Panel({
  className,
  ...props
}: React.ComponentProps<typeof CardContent>) {
  return <CardContent className={cn("py-6", className)} {...props} />
}
