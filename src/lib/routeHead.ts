/**
 * Per-route document head data. Single source of truth for the client
 * (App keeps the head in sync) and the prerender step (scripts/prerender.mjs
 * bakes these into each route's static HTML).
 */
export const ROUTE_HEAD: Record<string, { title: string; description: string }> = {
  '/safety': {
    title: 'Safety Program | Vertex Infrastructure Group',
    description:
      'How Vertex Infrastructure Group runs HDD jobsites: PPE standards, utility verification, excavation controls, traffic plans, and zero tolerance for negligence.',
  },
  '/environment': {
    title: 'Environmental Practices | Vertex Infrastructure Group',
    description:
      'Trenchless installation with full fluid containment, spill prevention, stormwater protection, and EPA-compliant disposal on every Vertex HDD project.',
  },
}
