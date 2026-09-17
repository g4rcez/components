import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type { ComponentProps } from "react"

export const buttonVariants = cva("inline-flex rounded-md", {
  variants: {
    variant: {
      primary: "bg-accent text-accent-ink",
      secondary: "border border-line bg-paper text-ink",
    },
    size: { sm: "h-8", md: "h-10" },
  },
  defaultVariants: { variant: "primary", size: "md" },
})

export function Button({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
