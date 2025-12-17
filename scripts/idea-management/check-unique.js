#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHECK UNIQUE - Uniqueness Validation for New Ideas
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Searches the registry for potential duplicates:
 * - Exact title matches
 * - Similar descriptions (fuzzy match)
 * - Overlapping use cases
 * - Conflicting implementations
 * 
 * Usage: node check-unique.js "Your idea description"
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../../docs/ideas/registry.json');

/**
 * Simple similarity score between two strings (0-1)
 */
function similarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    const longerLower = longer.toLowerCase();
    const shorterLower = shorter.toLowerCase();
    
    // Check for substring match
    if (longerLower.includes(shorterLower)) {
        return 0.8;
    }
    
    // Word overlap
    const words1 = new Set(longerLower.split(/\s+/).filter(w => w.length > 3));
    const words2 = new Set(shorterLower.split(/\s+/).filter(w => w.length > 3));
    
    const intersection = [...words1].filter(w => words2.has(w));
    const union = new Set([...words1, ...words2]);
    
    if (union.size === 0) return 0;
    
    return intersection.length / union.size;
}

function checkUnique(description) {
    console.log('\n🔍 Checking for similar ideas...\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Query: "${description}"`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Load registry
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.log('✅ Registry is empty or not found - idea is unique!\n');
        return;
    }
    
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    
    if (!registry.ideas || registry.ideas.length === 0) {
        console.log('✅ Registry is empty - idea is unique!\n');
        return;
    }
    
    const matches = [];
    
    registry.ideas.forEach(idea => {
        // Check title similarity
        const titleSim = similarity(description, idea.title);
        
        // Check description similarity
        const descSim = idea.description ? similarity(description, idea.description) : 0;
        
        // Check use case overlap
        let useCaseSim = 0;
        if (idea.useCases) {
            const ucSims = idea.useCases.map(uc => 
                similarity(description, uc.description)
            );
            useCaseSim = Math.max(...ucSims, 0);
        }
        
        // Overall score
        const score = Math.max(titleSim, descSim, useCaseSim);
        
        if (score > 0.3) {
            matches.push({
                idea,
                score,
                titleSim,
                descSim,
                useCaseSim
            });
        }
    });
    
    // Sort by score
    matches.sort((a, b) => b.score - a.score);
    
    if (matches.length === 0) {
        console.log('✅ No similar ideas found - your idea appears to be unique!\n');
        console.log('Next step: Run `npm run idea:create "Your idea title"` to create it.\n');
        return;
    }
    
    console.log(`⚠️ Found ${matches.length} potentially similar idea(s):\n`);
    
    matches.forEach((match, index) => {
        const { idea, score, titleSim, descSim, useCaseSim } = match;
        const confidence = score >= 0.7 ? '🔴 HIGH' : score >= 0.5 ? '🟡 MEDIUM' : '🟢 LOW';
        
        console.log(`${index + 1}. ${idea.id}: ${idea.title}`);
        console.log(`   Status: ${idea.status} | Priority: ${idea.priority}`);
        console.log(`   Similarity: ${(score * 100).toFixed(0)}% (${confidence})`);
        console.log(`   - Title match: ${(titleSim * 100).toFixed(0)}%`);
        console.log(`   - Description match: ${(descSim * 100).toFixed(0)}%`);
        console.log(`   - Use case overlap: ${(useCaseSim * 100).toFixed(0)}%`);
        
        if (idea.description) {
            console.log(`   Description: ${idea.description.substring(0, 80)}...`);
        }
        console.log('');
    });
    
    console.log('═══════════════════════════════════════════════════════════════');
    
    const highMatches = matches.filter(m => m.score >= 0.7);
    if (highMatches.length > 0) {
        console.log('\n⚠️ HIGH similarity matches found. Consider:');
        console.log('   1. Contributing to the existing idea instead');
        console.log('   2. Linking your idea as "related" or "depends_on"');
        console.log('   3. Clearly differentiating your idea in the spec\n');
    } else {
        console.log('\n✅ Similar ideas exist but are sufficiently different.');
        console.log('   Consider linking as "related" in your idea spec.\n');
    }
}

function checkAllDuplicates() {
    console.log('\n🔍 Checking registry for duplicate IDs...\n');
    
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.log('✅ Registry not found - no duplicates possible.\n');
        return;
    }
    
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    
    const ids = new Map();
    const duplicates = [];
    
    registry.ideas.forEach(idea => {
        if (ids.has(idea.id)) {
            duplicates.push(idea.id);
        }
        ids.set(idea.id, (ids.get(idea.id) || 0) + 1);
    });
    
    if (duplicates.length === 0) {
        console.log('✅ No duplicate IDs found in registry.\n');
    } else {
        console.log(`❌ Found ${duplicates.length} duplicate ID(s):`);
        duplicates.forEach(id => console.log(`   • ${id} (appears ${ids.get(id)} times)`));
        console.log('');
        process.exit(1);
    }
}

// Get description from command line
const description = process.argv.slice(2).join(' ');

if (!description) {
    // Run duplicate check on registry
    checkAllDuplicates();
} else {
    checkUnique(description);
}
