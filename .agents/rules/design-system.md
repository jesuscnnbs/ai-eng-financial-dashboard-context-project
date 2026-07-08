# Design System Rules

## Scope
CSS variables, color system, and visual consistency in `frontend/src/index.css`.

## Color space
All colors use **Oklch** color space for perceptual uniformity. Examples:
- `--background: oklch(0.13 0.01 240);`
- `--primary: oklch(0.6 0.2 255);`

## Variable naming pattern
All custom properties follow `--<scope>-<property>`:
- Backgrounds/foregrounds: `--background`, `--foreground`, `--card`, `--card-foreground`
- Semantic colors: `--primary`, `--destructive`, `--muted`, `--accent`
- Chart colors: `--chart-income`, `--chart-outcome`, `--chart-profit`, `--chart-1` through `--chart-5`
- Badge colors: `--income-badge`, `--income-badge-fg`, `--outcome-badge`, `--outcome-badge-fg`, `--profit-badge`, `--profit-badge-fg`
- Borders/radius: `--border`, `--input`, `--ring`, `--radius`

## Dark theme
Dark overrides live under the `.dark` selector and override the same variable names. All components MUST use `var(--<variable>)` and never hardcode color values.

## Adding new colors
1. Define both light and dark values under `:root` and `.dark` respectively
2. Register the variable in the `@theme inline { --color-<name>: var(--<variable>); }` block
3. Use `var(--<variable>)` or the Tailwind utility `text-<name>` / `bg-<name>` in components
4. Never hardcode hex/rgb/oklch values in component files

## Radius
Base radius `--radius: 0.75rem` produces derived values:
- `--radius-sm = calc(var(--radius) - 4px)`
- `--radius-md = calc(var(--radius) - 2px)`
- `--radius-lg = var(--radius)`
- `--radius-xl = calc(var(--radius) + 4px)`
