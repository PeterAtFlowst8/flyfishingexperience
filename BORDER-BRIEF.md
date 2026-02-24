# Border System Rework Brief

## Reference
See `sea-harvest-reference.jpg` in this directory — this is the target aesthetic.

## Current Problem
- Cards each have `border: 2px solid` all around, so adjacent cards create 4px double borders
- Footer has `border-top: 8px solid` which looks too heavy
- Grid has `gap` spacing between items, creating visible gaps between borders
- Overall: borders are inconsistent, doubled, and don't look like a cohesive newspaper grid

## Target
Like the Sea Harvest reference:
- ALL borders should be consistent 2px (use `--border-main` variable)
- Adjacent elements share a single border (no doubling)
- No gaps between grid cells — the grid itself should look like a newspaper layout with cells touching
- The masthead, nav, content grid, and footer should all connect seamlessly with shared borders

## Approach
1. Remove individual `border` from cards (`.hero-card`, `.manifesto-card`, `.location-card`, `.testimonial-card`, `.service-menu-item`, `.faq-card`)
2. Use the `.content-grid` wrapper to provide the outer border
3. Use `border-right` and `border-bottom` on grid children to create internal cell divisions (like border-collapse in tables)
4. Set grid `gap: 0` and let borders create the visual separation
5. Footer border-top should be `var(--border-main)` (2px), not 8px
6. Ensure the masthead bottom border connects directly to the content grid top border (no margin gap)

## Files to Edit
- `src/style.css` — the main (and only) stylesheet

## Important
- Don't break the hover effects on `.service-menu-item` (invert colors, lift + shadow)
- Don't break mobile responsiveness — on mobile, cards stack vertically with full-width borders
- Keep all CSS variables (don't hardcode values)
- The site uses Vite — just edit CSS, it hot-reloads
- Test desktop (1024px+) grid layout carefully: hero spans full width, row 2 has mission/location/testimonials side by side, row 3 has 3 service cards, row 4 is FAQ full width
