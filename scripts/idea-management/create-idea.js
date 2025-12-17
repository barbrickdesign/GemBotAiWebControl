#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CREATE IDEA - Scaffold a New Idea with All Required Files
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Creates:
 * - Entry in registry.json
 * - Spec file in docs/ideas/specs/
 * - Prompt file in docs/ideas/prompts/
 * - Test stub in tests/
 * 
 * Usage: node create-idea.js "Your idea title"
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../../docs/ideas/registry.json');
const PROMPTS_PATH = path.join(__dirname, '../../docs/ideas/prompts');
const SPECS_PATH = path.join(__dirname, '../../docs/ideas/specs');
const TESTS_PATH = path.join(__dirname, '../../tests');

function createIdea(title) {
    console.log('\n🆕 Creating new idea...\n');
    
    // Load registry
    let registry;
    if (fs.existsSync(REGISTRY_PATH)) {
        registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    } else {
        registry = {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "title": "GemBot Idea Registry",
            "version": "1.0.0",
            "lastUpdated": new Date().toISOString(),
            "ideas": [],
            "nextId": "IDEA-2025-0001"
        };
    }
    
    // Generate new ID
    const year = new Date().getFullYear();
    const existingIds = registry.ideas.map(i => i.id);
    let nextNum = 1;
    
    if (registry.nextId) {
        const match = registry.nextId.match(/IDEA-\d+-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10);
        }
    }
    
    let newId;
    do {
        newId = `IDEA-${year}-${String(nextNum).padStart(4, '0')}`;
        nextNum++;
    } while (existingIds.includes(newId));
    
    registry.nextId = `IDEA-${year}-${String(nextNum).padStart(4, '0')}`;
    
    const now = new Date().toISOString();
    const dateShort = now.split('T')[0];
    
    // Create idea entry
    const newIdea = {
        "id": newId,
        "title": title,
        "status": "intake",
        "owners": ["ryan-barbrick"],
        "createdAt": now,
        "updatedAt": now,
        "priority": "medium",
        "tags": [],
        "description": "",
        "useCases": [
            {
                "id": "UC-01",
                "description": "Primary use case - describe what this enables",
                "audience": "users",
                "implemented": false
            }
        ],
        "artifacts": {
            "spec": `docs/ideas/specs/${newId}.md`,
            "code": [],
            "tests": [`tests/${newId}.test.js`],
            "pipelines": [],
            "dashboards": []
        },
        "links": {
            "prompt": `docs/ideas/prompts/${newId}.md`,
            "visualTree": null,
            "relatedIdeas": []
        },
        "environments": {
            "dev": { "deployed": false, "version": null },
            "staging": { "deployed": false, "version": null },
            "prod": { "deployed": false, "version": null }
        },
        "metrics": {
            "errorRate": null,
            "p95Latency": null,
            "coverage": null
        }
    };
    
    registry.ideas.push(newIdea);
    registry.lastUpdated = now;
    
    // Create directories if needed
    [PROMPTS_PATH, SPECS_PATH, TESTS_PATH].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
    
    // Create prompt file
    const promptContent = `# ${newId} — ${title}

## Quick Reference
| Field | Value |
|-------|-------|
| **Status** | \`intake\` |
| **Priority** | \`medium\` |
| **Owners** | @ryan-barbrick |
| **Created** | ${dateShort} |
| **Registry** | \`docs/ideas/registry.json#${newId}\` |

---

## Purpose
_Describe what this idea does and why it matters._

---

## Related Ideas
- None yet

---

## Use Cases

| ID | Description | Audience | Status |
|----|-------------|----------|--------|
| UC-01 | Primary use case | Users | ⏳ Not Started |

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

---

## Console Commands

\`\`\`bash
# Check implementation status
npm run check:idea ${newId}

# Get human-friendly status
npm run status:idea ${newId}

# Run tests for this idea
npm run test:idea ${newId}
\`\`\`

---

## Change Log

| Date | Version | Change | Author |
|------|---------|--------|--------|
| ${dateShort} | 0.1.0 | Initial creation | @ryan-barbrick |
`;
    
    fs.writeFileSync(path.join(PROMPTS_PATH, `${newId}.md`), promptContent);
    
    // Create spec file
    const specContent = `# ${newId}: ${title}
## Specification Document

**Status:** Draft  
**Author:** Ryan Barbrick  
**Created:** ${dateShort}  
**Last Updated:** ${dateShort}

---

## 1. Overview

### 1.1 Problem Statement
_What problem does this idea solve?_

### 1.2 Proposed Solution
_How will this idea solve the problem?_

### 1.3 Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## 2. Requirements

### 2.1 Functional Requirements
1. FR-01: _Requirement description_
2. FR-02: _Requirement description_

### 2.2 Non-Functional Requirements
1. NFR-01: Performance - _target_
2. NFR-02: Security - _requirements_
3. NFR-03: Reliability - _SLO_

---

## 3. Technical Design

### 3.1 Architecture
_Describe the technical approach_

### 3.2 Components
| Component | Description | Owner |
|-----------|-------------|-------|
| Component 1 | What it does | Who owns it |

### 3.3 Data Flow
\`\`\`
Input → Process → Output
\`\`\`

### 3.4 API/Interface
\`\`\`javascript
// Example API
function myFunction(input) {
    return output;
}
\`\`\`

---

## 4. Implementation Plan

### 4.1 Phases
1. **Phase 1:** Foundation (_estimated time_)
2. **Phase 2:** Core features (_estimated time_)
3. **Phase 3:** Polish and testing (_estimated time_)

### 4.2 Dependencies
- Dependency 1
- Dependency 2

### 4.3 Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High | Mitigation strategy |

---

## 5. Testing Strategy

### 5.1 Unit Tests
- Test case 1
- Test case 2

### 5.2 Integration Tests
- Test case 1

### 5.3 Agent Tests
- Scenario 1: Nominal
- Scenario 2: Edge case

---

## 6. Observability

### 6.1 Logging
- Log event 1
- Log event 2

### 6.2 Metrics
- Metric 1: _description_
- Metric 2: _description_

### 6.3 Alerts
- Alert 1: _trigger and action_

---

## 7. Rollback Plan

1. Step 1
2. Step 2
3. Step 3

---

## Appendix

### A. References
- Reference 1
- Reference 2

### B. Glossary
- Term 1: Definition
- Term 2: Definition
`;
    
    fs.writeFileSync(path.join(SPECS_PATH, `${newId}.md`), specContent);
    
    // Create test stub
    const testContent = `/**
 * Tests for ${newId}: ${title}
 * 
 * Run with: npm test -- --grep "${newId}"
 */

describe('${newId}: ${title}', () => {
    
    describe('Unit Tests', () => {
        
        it('should pass placeholder test', () => {
            // TODO: Implement actual tests
            expect(true).toBe(true);
        });
        
        it('should handle nominal input', () => {
            // TODO: Test nominal case
        });
        
        it('should handle edge cases', () => {
            // TODO: Test edge cases
        });
        
        it('should handle error conditions', () => {
            // TODO: Test error handling
        });
        
    });
    
    describe('Integration Tests', () => {
        
        it('should integrate with dependent systems', () => {
            // TODO: Integration tests
        });
        
    });
    
    describe('Agent Tests', () => {
        
        it('should complete nominal scenario', async () => {
            // TODO: Agent scenario test
        });
        
        it('should handle degraded dependencies', async () => {
            // TODO: Degraded scenario
        });
        
    });
    
});
`;
    
    fs.writeFileSync(path.join(TESTS_PATH, `${newId}.test.js`), testContent);
    
    // Save registry
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
    
    // Output summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`✅ Created idea: ${newId}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📁 Files created:');
    console.log(`   • docs/ideas/prompts/${newId}.md`);
    console.log(`   • docs/ideas/specs/${newId}.md`);
    console.log(`   • tests/${newId}.test.js`);
    console.log(`   • Updated docs/ideas/registry.json`);
    console.log('');
    console.log('📋 Next steps:');
    console.log(`   1. Edit the spec: docs/ideas/specs/${newId}.md`);
    console.log('   2. Define use cases and requirements');
    console.log('   3. Implement code artifacts');
    console.log('   4. Write tests');
    console.log(`   5. Run: npm run status:idea ${newId}`);
    console.log('');
}

// Get title from command line
const title = process.argv.slice(2).join(' ');

if (!title) {
    console.log('Usage: node create-idea.js "Your idea title"');
    console.log('');
    console.log('Example: node create-idea.js "Add user authentication"');
    process.exit(1);
}

createIdea(title);
