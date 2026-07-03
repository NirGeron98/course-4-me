# Course4Me Design System

Living reference for the "Elegant & Minimalist" UI system introduced in Phase 4.
All tokens live in [`tailwind.config.js`](./tailwind.config.js); all primitives
live under [`src/components/common/`](./src/components/common/). Prefer these
over raw utility classes or one-off components.

All user-facing copy is Hebrew/RTL. Wrap layout roots in `dir="rtl"` when the
parent does not already do so.

---

## Design tokens

### Colors (semantic)

| Token                  | Use                                             |
|------------------------|-------------------------------------------------|
| `bg-surface`           | App background (subtle tint)                    |
| `bg-surface-raised`    | Cards, modals, popovers                         |
| `bg-surface-sunken`    | Inset panels, disabled states, footer rows      |
| `text-muted`           | Secondary text, hints, metadata                 |
| `text-muted-strong`    | Secondary headings                              |
| `bg-brand` / `text-brand` | Primary brand (emerald-600)                  |
| `bg-brand-soft`        | Tinted brand backgrounds (badges, pills)        |
| `bg-brand-strong`      | Hover/pressed brand states                      |
| `bg-danger`            | Destructive actions / error states              |
| `bg-danger-soft`       | Error surfaces                                  |

Raw Tailwind palette classes (`gray-*`, `emerald-*`, `red-*`) still work for
one-off decorative gradients, but new features should reach for the semantic
tokens first so global color tweaks land in one place.

### Radii

| Token            | Value    | Use                         |
|------------------|----------|-----------------------------|
| `rounded-button` | 0.75rem  | Buttons, inputs, chips      |
| `rounded-card`   | 1rem     | Standard cards              |
| `rounded-card-lg`| 1.25rem  | Modals, hero containers     |

### Shadows

| Token               | Use                                    |
|---------------------|----------------------------------------|
| `shadow-card`       | Resting state for list rows / cards    |
| `shadow-card-hover` | Interactive card hover                 |
| `shadow-elevated`   | Modals, floating menus, popovers       |
| `shadow-elevated-lg`| Full-screen modals / overlays          |

### Motion

- `duration-ui` — 200ms; the single transition duration used across hovers,
  color swaps, shadow changes, and focus rings.
- `ease-ui` — easing curve paired with `duration-ui`.
- `animate-modalEnter` — entry animation for dialog panels.
- `animate-backdropEnter` — entry animation for modal backdrops.
- `animate-fadeIn` — generic fade-in for toasts / secondary surfaces.

### Typography scale

There is no dedicated typography component — pages compose Tailwind's font
scale directly. The conventions actually in use:

| Role                          | Classes                                              |
|--------------------------------|-------------------------------------------------------|
| Hero page title (centered header pages, e.g. `MyContactRequests`) | `text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold` |
| Banner page title (colored header band, e.g. `AdminPanel`) | `text-2xl sm:text-3xl font-bold` |
| Section header (`<h2>` inside a card) | `text-xl sm:text-2xl font-bold text-slate-800` (or `text-gray-800`) |
| Card/row title (`<h3>`) | `text-lg font-semibold` |
| Body text | `text-sm sm:text-base text-slate-600` / `text-gray-600` |
| Metadata / hint text | `text-xs sm:text-sm text-slate-500` / `text-gray-500` |

`slate-*` and `gray-*` are both in use for body/muted text depending on the
page's era — treat them as equivalent and don't do a mechanical find/replace
between them; only align them opportunistically inside a file you're
otherwise touching.

### Spacing rhythm

- Page content column padding: `px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8`.
- Vertical gap between major page sections: `mb-6 sm:mb-8`.
- Card padding: `p-4 sm:p-6` for list/section cards, `p-6` or `p-8` for
  standalone form cards (profile, password) — the larger `p-8` is reserved
  for single-card "settings form" pages, not list containers.
- Grid gaps: `gap-3 sm:gap-4` for dense stat-card grids, `gap-6` for
  content/review card grids.
- Modal body spacing: `space-y-4 sm:space-y-6` (see `ContactRequestDetailsModal`).

### Accessibility

- Use `focus-visible:ring-2 focus-visible:ring-brand` on anything clickable.
- Every modal must set `role="dialog"` and `aria-modal="true"` (the `Modal`
  primitive does this automatically).
- Disabled controls must set `aria-disabled` and keep layout stable.
- Nested modals: only the topmost dialog responds to <kbd>Escape</kbd> (see
  `Modal`'s escape-stack, above) — never add a second, independent
  `keydown` listener for Escape in feature code.
- `Button`'s `loading` state sets `aria-busy` and disables the control without
  changing its size, so a spinner swap never shifts layout.
- Every native `<select>` and dropdown-like control still needs a visible or
  `aria-label`'d label — `Input` provides this for text/textarea, but raw
  `<select>` elements (used where `Input` has no select variant) must keep
  their own `<label>`.
- Icon-only buttons (carousel arrows, close buttons, toggle chips) must keep
  a `title` or `aria-label` — check this whenever you touch one, since it's
  easy to drop when refactoring markup.

---

## Primitives

All primitives live in [`src/components/common/`](./src/components/common/) and
are the default way to build new UI. They read the tokens above so you never
need to hand-roll shadows, radii, or focus rings.

### `<Card />`

Content container with consistent padding + elevation.

```jsx
import Card from "../common/Card";

<Card variant="default" padding="md">
  <h3 className="text-lg font-semibold">כותרת כרטיס</h3>
  <p className="text-muted">תיאור קצר</p>
</Card>

<Card variant="raised" interactive onClick={handleOpen}>
  {/* clickable card with hover elevation */}
</Card>
```

Props:

- `variant`: `"default" | "raised" | "sunken" | "flat"` (default `"default"`).
- `padding`: `"none" | "sm" | "md" | "lg"` (default `"md"`).
- `interactive`: toggles hover lift + cursor pointer.
- `as`: override the wrapper element (e.g. `as="article"`).

### `<Button />`

Single source of truth for actionable buttons. Handles loading state,
icons, and focus rings so feature code never touches those directly.

```jsx
import Button from "../common/Button";
import { Save, Trash2 } from "lucide-react";

<Button variant="primary" leftIcon={Save} onClick={handleSave}>
  שמור שינויים
</Button>

<Button variant="danger" leftIcon={Trash2} loading={isDeleting}>
  מחק
</Button>

<Button variant="ghost" size="sm">
  ביטול
</Button>
```

Props:

- `variant`: `"primary" | "secondary" | "ghost" | "danger"`.
- `size`: `"sm" | "md" | "lg"`.
- `leftIcon` / `rightIcon`: pass a **component reference** (lucide icon), not
  a JSX element.
- `loading`: disables the button and shows a spinner in-place.
- `fullWidth`, `as` (e.g. `as={Link}` for router links).

### `<Input />`

Text input / textarea with built-in label, hint, and error state.

```jsx
import Input from "../common/Input";
import { Search } from "lucide-react";

<Input
  label="שם הקורס"
  placeholder="הכנס שם קורס"
  leftIcon={Search}
  value={value}
  onChange={(e) => setValue(e.target.value)}
  hint="לפחות 2 תווים"
  required
/>

<Input
  as="textarea"
  label="הערות"
  rows={4}
  error={errors.comment}
/>
```

Props: `label`, `hint`, `error`, `leftIcon`, `rightIcon`, `as`, plus every
native input/textarea attribute.

### `<Modal />`

Accessible dialog primitive. Handles the portal, escape key, body scroll lock,
backdrop click, and ARIA plumbing.

```jsx
import Modal, { ModalFooter } from "../common/Modal";
import Button from "../common/Button";

<Modal
  isOpen={isOpen}
  onClose={closeModal}
  title="עריכת ביקורת"
  description="עדכן את הפרטים ולחץ שמור"
  size="lg"
>
  <form onSubmit={handleSubmit}>
    {/* form body */}
  </form>
  <ModalFooter>
    <Button variant="ghost" onClick={closeModal}>ביטול</Button>
    <Button variant="primary" onClick={handleSubmit}>שמור</Button>
  </ModalFooter>
</Modal>
```

Props:

- `isOpen`, `onClose` (required).
- `title`, `description` — wired to `aria-labelledby` / `aria-describedby`.
- `size`: `"sm" | "md" | "lg" | "xl" | "full"`.
- `closeOnBackdrop` (default `true`), `showCloseButton` (default `true`).
- `initialFocusRef` — optional ref for initial focus target.

Nested modals are supported: each open `Modal` pushes onto an internal escape
stack, so pressing <kbd>Escape</kbd> only closes the topmost dialog. Body
scroll is locked while any modal is open and restored once the stack is
empty — this is what keeps the page from scrolling behind an open modal on
mobile.

### `<ConfirmDialog />`

Thin wrapper over `Modal` for "are you sure?" confirmations (delete, discard,
destructive status changes). Use this instead of hand-building a `Modal` +
`ModalFooter` pair for a yes/no prompt.

```jsx
import ConfirmDialog from "../common/ConfirmDialog";

<ConfirmDialog
  isOpen={Boolean(deleteTargetId)}
  title="מחיקת פנייה"
  message="האם אתה בטוח? לא ניתן יהיה לשחזר את הפעולה."
  confirmLabel="מחק סופית"
  variant="danger"
  loading={isDeleting}
  onConfirm={handleDelete}
  onClose={() => setDeleteTargetId(null)}
/>
```

Props: `isOpen`, `title`, `message` (or `children` for a richer body),
`confirmLabel` (default `"אישור"`), `cancelLabel` (default `"ביטול"`),
`variant` (passed through to the confirm `Button`, e.g. `"danger"`),
`loading` — while `true` the dialog cannot be dismissed (no backdrop click,
no `onClose`), `onConfirm`, `onClose`.

### `<Skeleton />` family

`src/components/common/Skeleton.jsx` exports layout-matched loading
placeholders so lists don't jump when data arrives: `SkeletonLine`,
`SkeletonCard` / `SkeletonCardGrid`, `SkeletonStatCard` / `SkeletonStatGrid`,
`SkeletonSection`, `SkeletonResultGrid`, `SkeletonReviewList`, `SkeletonForm`.
Prefer the grid/section variant that matches the real layout (e.g.
`SkeletonResultGrid` for search results) over a generic spinner when the
final content is a list/grid — it reduces layout shift.

For full-page or full-section loading (no meaningful layout to preserve),
use `<LoadingSpinner message="..." />` (full-screen) or
`<ElegantLoadingSpinner message="..." size="..." />` (inline, sized) instead
of a hand-rolled `Loader2` + `animate-spin` block.

### `<EmptyState />`

Reusable empty state for lists/sections with no data.

```jsx
import EmptyState from "../common/EmptyState";
import { MessageSquare } from "lucide-react";

<EmptyState
  icon={MessageSquare}
  title="אין פניות עדיין"
  description="לא יצרת עדיין פניות למערכת"
  actionLabel="צור פנייה חדשה"
  onAction={openCreateModal}
/>
```

Props: `icon` (lucide component reference), `title`, `description`,
`actionLabel` + `onAction` (renders a CTA button only when both are given),
`className`. The action button is fixed to the brand (emerald) palette —
**do not** force `EmptyState` onto a section that uses a different accent
color (e.g. the lecturer pages' purple), since there's no way to recolor the
CTA without fighting the primitive. Also skip it for elaborate, custom-built
hero empty states (illustrated icon, multi-line copy, secondary footnote) —
those are intentionally bespoke, not a "simple hand-rolled" case.

### `<Alert />`

Inline banner for error/success/info messages. Replaces raw colored
`<div>` banners and native `window.alert()` calls.

```jsx
import Alert from "../common/Alert";

<Alert type="error" message={error} onDismiss={() => setError("")} />
<Alert type="success" message="הפנייה עודכנה בהצלחה!" />
```

Props: `type` (`"error" | "success" | "info"`, default `"error"`), `message`,
`onDismiss` (renders a dismiss "X" only when provided), `className`.

---

## Icon policy

**Lucide React is the only icon library.** FontAwesome was removed in Phase 4
and must not be re-added. When you need a new icon:

1. Import from `lucide-react` — e.g. `import { Pencil, Trash2 } from "lucide-react"`.
2. Size with utility classes (`w-4 h-4`, `w-5 h-5`).
3. Color with `text-*` utilities, not inline SVG attributes.

Avoid raw `<svg>` blocks inside feature components. If you genuinely need a
custom mark (logo, illustration), put it in `src/components/common/` as a
standalone component and document it here.

---

## Admin primitives

Admin panels are thin shells over the shared primitives in
[`src/components/common/admin/`](./src/components/common/admin/):

- `<FilterBar />` — search box + filter controls for list screens.
- `<ListTable />` — table renderer that owns empty/loading states.
- `<RowActions />` — trailing actions column (edit / delete / details).

Each admin panel (e.g. [`src/components/admin/CourseManagement.jsx`](./src/components/admin/CourseManagement.jsx))
is a shell that composes these primitives plus feature-specific sub-modals
(`*FormModal.jsx`, `*DetailsModal.jsx`) and a row-config helper. Keep every
file under ~250 LOC; extract helpers when you cross that line.

Concretely, each admin resource lives in its own folder under
`src/components/admin/<Resource>Management/`:

```
<Resource>Management/
  <Resource>Management.jsx   # shell: owns state, API calls, composes below
  <Resource>Row.jsx           # row-config helper for ListTable
  <Resource>FormModal.jsx     # create/edit form (Modal + Input + Button)
  <Resource>DetailsModal.jsx  # read-only detail view (Modal + Button)
  index.js                    # re-export so the import path stays flat
```

Delete confirmations in the admin panels are currently hand-built with raw
`Modal`/`ModalFooter` rather than `ConfirmDialog` — `ConfirmDialog` was
introduced later (Phase 6) and is the preferred pattern for **new** delete
flows, but existing admin panels haven't been migrated yet. Migrate
opportunistically rather than as a dedicated pass.

---

## Feature-folder structure

Outside of `admin/`, feature-specific components live in their own folder
under `src/components/<feature>/`, following the same "thin page shell +
extracted presentational pieces + shared primitives" shape:

- **Contact requests** ([`src/components/contact-requests/`](./src/components/contact-requests/))
  — introduced in Phase 6 as the reference pattern for user-facing (non-admin)
  features: `contactRequestDisplay.js` (shared status/subject maps and
  formatters), `ContactRequestRow.jsx` (presentational row), `ContactRequestsList.jsx`
  (loading/empty/list container), `ContactRequestDetailsModal.jsx` and
  `ContactRequestEditModal.jsx` (Modal-based), with the page
  ([`src/pages/MyContactRequests.jsx`](./src/pages/MyContactRequests.jsx))
  as a thin shell owning state and mutations. The delete confirmation uses
  `ConfirmDialog` directly in the shell — no dedicated dialog file, since a
  generic confirmation doesn't need one.
- **Auth screens** ([`src/pages/Login.jsx`](./src/pages/Login.jsx),
  `Signup.jsx`, `ForgotPassword.jsx`, `ResetPassword.jsx`) are self-contained
  pages (no feature subfolder) built directly from `Card`, `Input`,
  `PasswordInput`, `Button`, and `Alert`. They're simple enough that they
  don't warrant extraction into sub-components.

## Page wrapper pattern

There is no shared `PageContainer` component — introducing one was evaluated
for Phase 7 and intentionally skipped (see below). Instead, follow this
by-hand convention for a new top-level page:

```jsx
<div className="min-h-screen bg-gradient-to-br from-<theme>-50 via-white to-<theme>-100" dir="rtl">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
    {/* page content */}
  </div>
</div>
```

- `dir="rtl"` on the outermost element of every page.
- `max-w-7xl mx-auto` for the content column; admin pages instead put a
  colored `py-6 sm:py-8` header band above this wrapper (see `AdminPanel.jsx`).
- The `<theme>` gradient stops vary by page (emerald for courses/dashboard,
  purple for lecturer pages, indigo for contact requests) — this is
  intentional per-section color-coding, not an inconsistency to fix.

**Why no `PageContainer` was added:** every page already differs in its
gradient theme and header treatment (plain wrapper vs. colored header band vs.
centered hero header), so a real shared component would need enough props
(theme, header variant, max-width) that it wouldn't meaningfully reduce
repeated markup — it would mostly move the same class strings behind a prop
API. Documenting the pattern above gets the consistency benefit without the
indirection risk of changing every page's outer wrapper in one pass.

---

## Phase 6 guardrails (ESLint)

Enforced from [`client/package.json`](./package.json) `eslintConfig`:

- **`no-restricted-imports`** — blocks direct `axios` imports. Use
  `apiFetch` / `useApi` from [`src/hooks/useApi.js`](./src/hooks/useApi.js).
- **`no-restricted-syntax`** (error) — blocks deprecated Tailwind utilities
  (`rounded-lg`, `shadow-lg`, `duration-300`, …) in both string literals and
  template literals. Use the Phase 4 tokens above. Also blocks hardcoded
  English JSX text runs of 4+ letters — user-facing copy must be Hebrew.
  Wrap non-translatable tokens (brand names, emails, codes) in `{'...'}` to
  suppress.
- **`no-warning-comments`** (error) — blocks Hebrew characters in comments.
  Code comments must be in English so grep, diffs, and CI logs stay
  machine-readable; user-facing copy in JSX remains Hebrew.
- **`no-console`** (warn) — only `console.warn` / `console.error` allowed in
  committed code.

These rules surface in the CRA dev-server overlay and in `npm run build`.
Fix them — do not paper over with `eslint-disable`.

---

## Adoption checklist for new UI

- [ ] Container: `<Card />` with the appropriate `variant` / `padding`.
- [ ] Buttons: `<Button />` — never hand-roll `bg-emerald-500 px-4 py-2`.
- [ ] Inputs: `<Input />` — get labels, hints, and error states for free.
- [ ] Modals: `<Modal />` — never reimplement the portal + escape + focus dance.
- [ ] Confirmations: `<ConfirmDialog />` for yes/no prompts instead of a
      hand-built `Modal` + `ModalFooter` pair.
- [ ] Loading: `<Skeleton />` variants for list/grid layouts,
      `<LoadingSpinner />` / `<ElegantLoadingSpinner />` for full-page/section
      loading — not a raw `Loader2` + `animate-spin` block.
- [ ] Empty lists: `<EmptyState />` — but only when the section uses the
      brand (emerald) accent and the empty state is a simple icon+text+CTA,
      not a bespoke illustrated hero.
- [ ] Errors/success messages: `<Alert />` instead of a raw colored `<div>`
      or `window.alert()`.
- [ ] Icons: lucide-react only.
- [ ] Colors: semantic tokens (`bg-surface-raised`, `text-muted`, `bg-brand`)
      where practical; per-section accent colors (purple for lecturer pages,
      indigo for contact requests) are intentional and should be preserved.
- [ ] Motion: `duration-ui` + `ease-ui`; no ad-hoc `transition duration-300`.
- [ ] RTL: every layout root has `dir="rtl"`; every user-facing string is Hebrew.
- [ ] A11y: focus rings via `focus-visible:ring-2 focus-visible:ring-brand`;
      icon-only buttons keep a `title`/`aria-label`.

When an older screen still uses raw utilities, migrate it opportunistically
rather than editing around it. If a primitive doesn't support a custom accent
color a section relies on (e.g. `EmptyState`'s emerald CTA, `Button`'s fixed
variant palette), don't force the swap — either leave the raw markup, or (for
`Button`) use `variant="ghost"` with a `className` override that applies
`!`-prefixed Tailwind utilities (e.g. `!bg-red-100`) for every property the
base variant also sets. Without the `!` prefix the override is not guaranteed
to win the cascade, since Tailwind resolves same-specificity conflicts by
stylesheet order, not by the order classes appear in the `className` string.
