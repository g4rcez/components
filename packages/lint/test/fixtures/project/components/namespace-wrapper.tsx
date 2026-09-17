import * as UI from "@/components/ui/button"

// Forwards through a namespace import.
export function NamespaceButton(props: React.ComponentProps<typeof UI.Button>) {
  return <UI.Button {...props} />
}
