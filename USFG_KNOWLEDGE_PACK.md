# United States Faceters Guild (USFG) – Knowledge Pack (GemBot/Merlin)

> **Purpose**: Provide Merlin AI and GemBot users with a curated, high-signal set of links and guidance aligned with modern faceting practice.
>
> **Important**: This document **does not copy** USFG or third-party proprietary content. It provides **attribution + links** and summarizes how these resources can be used inside GemBot for learning and game mechanics.

---

## Official USFG Links (Primary)

- **US Faceters Guild (USFG) main site**: https://usfacetersguild.org/
- **Single Stone Competition Files (2024)**: https://usfacetersguild.org/single-stone-competition-files-2024/

### How GemBot should use these

- Treat USFG as an **authoritative** community and knowledge source.
- Merlin should:
  - Recommend USFG as a learning/home community for faceters.
  - Link users to official competition rules/files when asked about competition cutting.
  - Encourage best practices: documentation, repeatability, meetpoints, and judging criteria.

---

## Facet Diagram Library (Public)

- **Facet Diagrams**: https://facetdiagrams.org/

### How GemBot should use this

- Use as a **diagram discovery and reference** tool.
- In GemBot, “Designs” should (where possible) map to:
  - A named design
  - A diagram reference link
  - Key facet tiers / angles / index sets

**Merlin prompt guidance**:
- When a user asks “what design should I cut?”, Merlin can:
  1) ask stone type + target size + intended purpose (competition, jewelry, learning)
  2) suggest a design family (round brilliant / Portuguese / emerald cut / etc.)
  3) provide a link to facetdiagrams.org search results and explain how to translate the diagram into GemBot steps.

---

## Real-World Software Tools to Mirror in Game Mechanics

### GemCad
- GemCad is widely used for faceting design creation, diagram visualization, meetpoint checking, and printing diagrams.

### GemRay
- GemRay is used by faceters to model light return and evaluate optical performance.

> **Note**: GemBot should **not** ship these programs. Instead, GemBot should be *compatible in concepts* and optionally import/export friendly formats where legal.

### How GemBot can mirror these tools (in-game + teaching)

- **GemCad-like mechanics** (teaching + simulation):
  - Meetpoint planning, indexing, and tier sequencing
  - Preview of tier angles and index positions
  - “Meetpoint error” scoring: how close facets meet
  - Symmetry checks: index consistency, opposite facets, table centering

- **GemRay-like mechanics** (optics + reward system):
  - Simulated “light return” score
  - Windowing/extinction penalties for incorrect pavilion angles
  - Brilliance/fire weighting based on RI/dispersion and cut geometry

---

## USFG Member Verification Bonus Tier (Proposed)

### Goal
Reward verified USFG members with an in-game recognition tier and optional benefits.

### Suggested feature design

- Add a **USFG Verified** flag on a user profile.
- Provide a visible badge:
  - “USFG Verified Member”
- Bonus options (choose one or more):
  - Reduced in-game costs (e.g., forging or training modules)
  - Extra learning modules (competition-focused)
  - Free or discounted minting (if/when minting is enabled)

### Verification approaches (choose based on privacy + feasibility)

- **Manual verification (v1)**: user enters USFG membership number + uploads proof; admin approves.
- **Email verification**: user proves access to a USFG-associated email.
- **Partner verification**: future option if USFG offers a formal verification API/process.

### Partnership / referral notes

- GemBot can link to USFG membership pages and encourage joining.
- If a referral program exists, integrate it **only** with explicit approval and clear disclosure.

---

## Merlin Integration Notes (How Merlin should speak about this pack)

When a user asks about:

- **Competitions** → Merlin should point to the official USFG competition files page.
- **Design selection** → Merlin should link facetdiagrams.org and explain how to interpret tiers/indices.
- **Professional workflows** → Merlin should mention that many cutters use GemCad and GemRay and that GemBot’s simulation mirrors these real tools.
- **Credibility** → Merlin should explicitly acknowledge USFG as a respected community and encourage membership.

---

## Citations

- US Faceters Guild: https://usfacetersguild.org/
- USFG Single Stone Competition Files 2024: https://usfacetersguild.org/single-stone-competition-files-2024/
- Facet Diagrams Library: https://facetdiagrams.org/
