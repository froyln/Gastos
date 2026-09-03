# CLAUDE.md — Repository Rules

Permanent rules for any AI writing code here. They apply to **every** change, with no exceptions and no reminders.

Before writing code: read `AGENTS.md` (domain and schemas) and `plan.md` (current phase).

---

## 1. Comments

- **Zero comments in generated code.**
- Only when a piece of logic is genuinely hard to follow is **a single, very brief one-line comment** allowed, placed above the line that needs it.
- Forbidden: `/** */` blocks, JSDoc, comments restating the function name, `// TODO`, `// here we do X`, separator banners.
- Code is explained by clear names, not by prose.

## 2. Clean and Modular Code

- One component per file. File name = component name.
- A component beyond ~120 lines gets split.
- Business logic lives in `store/` or `lib/`, never inside a component. Components render and dispatch.
- No `any`. Explicit types on props, returns and state.
- No speculative abstractions: no wrappers, factories or config layers for a single use case.
- Reuse what already exists in the repo before creating anything new. Look first.
- Do not add dependencies when the platform or an already-installed dependency solves the problem.
- No dead code, no unused exports, no "for later" files.

## 3. React Native Best Practices

- Functional components with hooks. No classes.
- Subscribe to Zustand with specific selectors, never the whole store: `useExpenseStore((s) => s.expenses)`.
- `FlatList` for lists; stable `key` from `id`. Never the index.
- Memoize only for a real, measured render problem.
- Derived computations in selectors or `useMemo`, not in the render body.
- `SafeAreaView` / insets on every screen.
- Effects with correct dependencies and cleanup where it applies.
- No inline styles except for runtime-computed values.
- Every destructive action asks for confirmation.

## 4. Interface

- Clean and minimalist. Whitespace before borders and shadows.
- Hierarchy through type size and weight, not decoration.
- Reduced palette: neutrals plus one accent; category color only on chips and indicators.
- No gradients, no heavy shadows, no decorative icons.
- Every screen has an empty state. An empty state is short text plus one action.
- Amounts are the dominant visual element in every row and card.
- Every action gives immediate feedback. No blocking spinners.
- Minimum 44pt touch targets.

## 5. Styling

- NativeWind (`className`) exclusively. `StyleSheet.create` only when NativeWind cannot do it.
- Theme tokens in `tailwind.config.js`. Raw hex values in components are forbidden.
- Support light and dark mode with `dark:` variants.

## 6. Conventions

- Components: `PascalCase.tsx`. Hooks and utilities: `camelCase.ts`. Stores: `useXStore.ts`.
- Absolute imports with the `@/` alias.
- All code, UI text, and documentation in English.
- Amounts as `number` (2 decimals, currency from settings). Dates as ISO 8601 strings.

## 7. Workflow

- Execute **one `plan.md` phase at a time**. Do not jump ahead.
- When a phase is done: verify the app boots, make the specified commit, and stop.
- Conventional Commits, short message.
- Do not sign commits as an AI and do not add automatic co-authors.
- Do not touch files outside the current phase scope.
- If `plan.md` contradicts `AGENTS.md`, `AGENTS.md` wins; report the discrepancy.
