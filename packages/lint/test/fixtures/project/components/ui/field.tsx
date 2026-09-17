import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// An axis not named "variant", and a second definition in the same
// file — both cases the v0 regex extractor missed.
const fieldVariants = cva("group/field flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row items-center",
      responsive: "flex-col @md/field-group:flex-row",
    },
  },
  defaultVariants: { orientation: "vertical" },
})

const fieldLabelVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
  },
})

function Field({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      data-slot="field"
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  variant,
  ...props
}: React.ComponentProps<"label"> & VariantProps<typeof fieldLabelVariants>) {
  return (
    <label
      data-slot="field-label"
      className={cn(fieldLabelVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Field, FieldLabel, fieldVariants, fieldLabelVariants }
