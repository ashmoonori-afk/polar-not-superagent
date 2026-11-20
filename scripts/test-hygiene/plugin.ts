import { eventDriven } from "./rules/event-driven.ts";
import { firstAttempt } from "./rules/first-attempt.ts";
import { realModules } from "./rules/real-modules.ts";

export default {
  meta: { name: "polar-tests" },
  rules: {
    "no-fixed-sleep": eventDriven,
    "no-flake-masking": firstAttempt,
    "no-module-mock": realModules,
  },
};
