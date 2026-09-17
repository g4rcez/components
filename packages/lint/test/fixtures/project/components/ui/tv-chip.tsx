import { tv } from "tailwind-variants"

// tv() takes its config as the first argument.
export const chip = tv({
  slots: { root: "inline-flex rounded-full", label: "text-xs" },
  variants: {
    tone: {
      neutral: { root: "bg-muted" },
      loud: { root: "bg-primary text-primary-foreground" },
    },
  },
})

export function TvChip({ tone }: { tone?: "neutral" | "loud" }) {
  const { root, label } = chip({ tone })
  return (
    <span className={root()}>
      <span className={label()}>chip</span>
    </span>
  )
}
