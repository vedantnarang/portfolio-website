/* GitHub's own bindings (spec §10 "Keyboard") — one table drives both the
   listener and the ? modal, so the modal can't advertise a key that
   doesn't work. `/` (focus search) is omitted: the site has no search. */
export type ShortcutAction = "next" | "prev" | "open" | "go-code" | "go-issues" | "go-pulls" | "help";

export interface Shortcut {
  keys: string[];
  action: ShortcutAction;
  description: string;
  group: "Site-wide" | "Lists";
}

export const SHORTCUTS: Shortcut[] = [
  { keys: ["g", "c"], action: "go-code", description: "Go to Code", group: "Site-wide" },
  { keys: ["g", "i"], action: "go-issues", description: "Go to Issues", group: "Site-wide" },
  { keys: ["g", "p"], action: "go-pulls", description: "Go to Pull requests", group: "Site-wide" },
  { keys: ["?"], action: "help", description: "Show keyboard shortcuts", group: "Site-wide" },
  { keys: ["j"], action: "next", description: "Move to the next item", group: "Lists" },
  { keys: ["k"], action: "prev", description: "Move to the previous item", group: "Lists" },
  { keys: ["Enter"], action: "open", description: "Open the selected item", group: "Lists" },
];

/** Destinations for the `g` chords, keyed by the second key. */
export const GO_TO: Record<string, string> = {
  c: "/",
  i: "/issues",
  p: "/pulls",
};
