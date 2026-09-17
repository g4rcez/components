import { cva, type VariantProps } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@workspace/ui/lib/utils"

const buttonVariants = cva("inline-flex rounded-md", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      brand: "bg-brand text-primary-foreground",
    },
  },
  defaultVariants: { variant: "default" },
})

function Button({
  className,
  variant,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={cn(buttonVariants({ variant }), className)} {...props} />
  )
}

export { Button, buttonVariants }
