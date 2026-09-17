import { Button } from "@/components/ui/button"

// A default-exported wrapper, imported under whatever name the page picks.
export default function DefaultSaveButton({ className }: { className?: string }) {
  return <Button className={className}>Save</Button>
}
