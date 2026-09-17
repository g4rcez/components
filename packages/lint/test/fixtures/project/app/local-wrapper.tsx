import { Button } from "@/components/ui/button"

function LocalButton({ className }: { className?: string }) {
  return <Button className={className}>Go</Button>
}

export const A = () => <LocalButton className="bg-red-500" />
