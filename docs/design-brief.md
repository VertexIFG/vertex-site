# Vertex Infrastructure Group Design Brief

This brief is the working standard for the `/test` redesign route. Build from references and a clear visual system before adding components.

## Audience

Utility owners, municipalities, general contractors, telecom/fiber teams, energy teams, and project managers who need a contractor that looks organized before crews arrive onsite.

## Page Job

Make Vertex Infrastructure Group feel like a modern underground infrastructure operator, not a legacy contractor brochure. The page should quickly communicate utility sectors, field discipline, equipment credibility, contact paths, and regional readiness.

## Visual References

- Q Industrial, Awwwards: red/white industrial direction, large typography, 3D/motion moments, clean content architecture.  
  https://www.awwwards.com/sites/q-industrial
- Valmont, Awwwards: infrastructure brand storytelling with confident user journeys and scroll interaction.  
  https://www.awwwards.com/sites/valmont
- TRUE, Godly: construction-tagged reference with large type, big background imagery, interactive transitions, parallax, 3D/WebGL, and GSAP.  
  https://godly.website/website/true-699
- Bee Home, Godly: construction/environmental reference using big background imagery, light UI, grid structure, and Neue Haas Unica.  
  https://godly.website/website/bee-home-317
- Typewolf Neue Haas Unica: serious grotesk direction and typography benchmark.  
  https://www.typewolf.com/neue-haas-unica

## Mood

Industrial precision, field confidence, premium utility operator, restrained motion, red-white-black clarity, real equipment as the hero asset.

## Layout Concept

- First screen: full-bleed or split hero dominated by actual Vertex fleet imagery and a heavy typographic claim.
- Navigation: minimal, compact, operational. No decorative nav clutter.
- Body: fewer sections with stronger hierarchy, wide image moments, and dense utility facts.
- Contact: direct project-start module with email, phone, location, and utility scope.

## Typography

- Display direction: serious grotesk, heavy weight, compact line-height.
- Text direction: readable grotesk with generous paragraph leading.
- Licensed option: Neue Haas Unica, Alliance No.1, or similar.
- Free/open fallback: Instrument Sans or Inter Tight for display; Inter for body until a licensed font is selected.
- Rules: no viewport-based font scaling, no negative letter spacing except rare logo-like lockups, no weak mid-weight hero type.

## Color And Material

- Core palette: Vertex red, white, black, cool gray.
- Materials: real imagery, hard panel edges, subtle shadows, fine lines, restrained grain/noise only if it improves depth.
- Red should behave like a brand signal and action color, not a generic gradient.

## Motion Moments

- Hero image entrance and headline reveal.
- Scroll-tied fleet/image movement.
- Section transitions that feel mechanical and precise.
- Contact module reveal with clear focus, not decorative motion.

## Stack Preference

- Radix UI only for accessible primitives when needed.
- shadcn/ui only as raw infrastructure after full restyling.
- Tailwind and CSS variables are acceptable for custom systems.
- Motion/Framer Motion for UI transitions.
- GSAP + ScrollTrigger for high-end landing page scroll motion.
- Lenis only if the page becomes editorial/immersive enough to justify smooth scroll.
- Three.js/React Three Fiber only for a full-bleed purposeful scene, not decoration.

## Explicitly Banned

- Default shadcn visual styling.
- Generic glass cards.
- Gradient orb backgrounds.
- Random bento grids.
- Badge/pill soup.
- AI SaaS purple or blue-purple gradients.
- Decorative SVG blobs.
- Cards inside cards.
- Component-library look.
- Motion that does not explain, focus, or elevate the brand.

## Review Loop

1. Build the local `/test` direction.
2. Capture desktop and mobile screenshots.
3. Compare against the references above.
4. Fix typography, spacing, density, imagery, overflow, and bland sections.
5. Repeat until the page looks intentionally designed.

## Implemented Direction (2026-06-10 — "AS-BUILT" redesign)

The shipped site follows this brief with these resolved decisions:

- Concept: the page behaves like an engineering document — surface photography above,
  technical drawing below; stationed, measured, stamped.
- Typography: Archivo variable (display, wdth 118 / wght 800-900) + Inter (body) +
  IBM Plex Mono (annotations), self-hosted latin subsets.
- Motion: GSAP ScrollTrigger + SplitText with Lenis smooth scroll (adopted); Motion retained
  for micro-interaction shells. All pins/scrubs disable under reduced motion and on mobile.
- 3D: a purposeful full-bleed React Three Fiber plan-view survey flythrough ("The route is
  the product."), lazy-loaded, with a static SVG fallback — paired with the 2D as-built bore
  profile chapter (the same route in section).
- The banned-elements list was honored: no gradients, glass cards, bento grids, pills, or
  border radii anywhere in the shipped system.
