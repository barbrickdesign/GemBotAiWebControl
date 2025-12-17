# IDEA-{{ID}} — {{TITLE}}

## Quick Reference
| Field | Value |
|-------|-------|
| **Status** | `intake` |
| **Priority** | `medium` |
| **Owners** | @ryan-barbrick |
| **Created** | {{DATE}} |
| **Registry** | `docs/ideas/registry.json#IDEA-{{ID}}` |

---

## Purpose
_Describe what this idea does and why it matters._

---

## Related Ideas
- `IDEA-XXXX` - (dependency/enables/conflicts)

---

## Use Cases

| ID | Description | Audience | Status |
|----|-------------|----------|--------|
| UC-01 | _What this enables_ | _Who benefits_ | ⏳ Not Started |
| UC-02 | _Another use case_ | _Another audience_ | ⏳ Not Started |

---

## Implementation Status

### Checklist
- [ ] Spec complete and approved
- [ ] Code artifacts created
- [ ] Unit tests written (≥85% coverage)
- [ ] Agent tests written and passing
- [ ] Logging implemented
- [ ] Error handling complete
- [ ] Staging deployed
- [ ] Production deployed

### Artifacts
| Type | Path | Status |
|------|------|--------|
| Spec | `docs/ideas/specs/IDEA-{{ID}}.md` | ⏳ |
| Code | `path/to/implementation.js` | ⏳ |
| Tests | `tests/IDEA-{{ID}}.test.js` | ⏳ |
| Dashboard | `docs/ideas/dashboards/IDEA-{{ID}}.json` | ⏳ |

---

## Console Commands

```bash
# Check if this idea is implemented
npm run check:idea IDEA-{{ID}}

# Get human-friendly status
npm run status:idea IDEA-{{ID}}

# Run tests for this idea
npm run test:idea IDEA-{{ID}}

# Deploy to staging
npm run deploy:staging IDEA-{{ID}}

# Check implementation status
node scripts/idea-management/check-implementation.js IDEA-{{ID}}
```

---

## Technical Notes

### Dependencies
- List any required systems/services

### Environment Variables
- List any required env vars

### Database Changes
- List any schema changes

---

## Metrics & Observability

### Key Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Error Rate | < 0.5% | - |
| P95 Latency | < 200ms | - |
| Coverage | ≥ 85% | - |

### Alerts
- List any alerts to be configured

---

## Rollback Plan

1. Run `npm run rollback IDEA-{{ID}} --env [env]`
2. Verify health checks pass
3. Notify stakeholders

---

## Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| {{DATE}} | 0.1.0 | Initial creation | @ryan-barbrick |

---

*Template version: 1.0.0*
