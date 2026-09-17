import { cn } from "cn"
import type { ComponentProps } from "react"

function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-lg border border-line", className)} {...props} />
}

function CardBody({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />
}

export { Card, CardBody }
