// A wrapper: forwards className to a design-system component, so from
// outside it is that component.
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

export function SaveButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button className={cn("w-full", className)} {...props} />
}

// Not a wrapper: className lands on a plain element.
export function Section({
  className,
  ...props
}: React.ComponentProps<"section">) {
  return <section className={cn("mx-auto max-w-4xl", className)} {...props} />
}

// A wrapper through props.className.
export const CancelButton = (props: React.ComponentProps<typeof Button>) => (
  <Button variant="ghost" className={props.className} />
)

// A wrapper of a wrapper.
export function PrimaryAction({ className }: { className?: string }) {
  return <SaveButton className={cn("mt-2", className)} />
}

// Not a wrapper: className is destructured out and never forwarded.
export function FixedButton({
  className: _ignored,
  ...props
}: React.ComponentProps<typeof Button>) {
  return <Button {...props} className="w-full" />
}
