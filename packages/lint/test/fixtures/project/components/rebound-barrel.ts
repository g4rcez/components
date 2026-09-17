// A barrel that imports and re-exports under new names, rather than
// re-exporting straight from the source.
import { Button } from "./ui/button"
import { SaveButton } from "./save-button"

export { Button as Action, SaveButton as Save2 }
