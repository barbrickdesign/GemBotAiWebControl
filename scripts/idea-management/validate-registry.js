#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VALIDATE REGISTRY - Schema Enforcement for Idea Registry
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Validates the idea registry JSON against required schema:
 * - Required fields present
 * - Unique IDs
 * - Valid status values
 * - Link integrity
 * 
 * Usage: node validate-registry.js
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../../docs/ideas/registry.json');
const VALID_STATUSES = ['intake', 'triage', 'spec', 'prototype', 'testing', 'staging', 'production', 'deprecated'];
const VALID_PRIORITIES = ['critical', 'high', 'medium', 'low'];

function validateRegistry() {
    console.log('📋 Validating Idea Registry...\n');
    
    let errors = [];
    let warnings = [];
    
    // Check file exists
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error('❌ Registry file not found:', REGISTRY_PATH);
        process.exit(1);
    }
    
    // Parse JSON
    let registry;
    try {
        const content = fs.readFileSync(REGISTRY_PATH, 'utf8');
        registry = JSON.parse(content);
    } catch (e) {
        console.error('❌ Invalid JSON:', e.message);
        process.exit(1);
    }
    
    // Validate top-level structure
    if (!registry.ideas || !Array.isArray(registry.ideas)) {
        errors.push('Missing or invalid "ideas" array');
    }
    
    if (!registry.version) {
        warnings.push('Missing "version" field');
    }
    
    // Validate each idea
    const seenIds = new Set();
    
    registry.ideas.forEach((idea, index) => {
        const prefix = `Idea [${index}]`;
        
        // Required fields
        if (!idea.id) {
            errors.push(`${prefix}: Missing "id"`);
        } else {
            // Check ID format
            if (!/^IDEA-\d{4}-\d{4}$/.test(idea.id)) {
                warnings.push(`${prefix}: ID "${idea.id}" doesn't match format IDEA-YYYY-NNNN`);
            }
            
            // Check for duplicates
            if (seenIds.has(idea.id)) {
                errors.push(`${prefix}: Duplicate ID "${idea.id}"`);
            }
            seenIds.add(idea.id);
        }
        
        if (!idea.title) {
            errors.push(`${prefix}: Missing "title"`);
        }
        
        if (!idea.status) {
            errors.push(`${prefix}: Missing "status"`);
        } else if (!VALID_STATUSES.includes(idea.status)) {
            errors.push(`${prefix}: Invalid status "${idea.status}". Valid: ${VALID_STATUSES.join(', ')}`);
        }
        
        if (!idea.owners || !Array.isArray(idea.owners) || idea.owners.length === 0) {
            warnings.push(`${prefix}: Missing or empty "owners" array`);
        }
        
        if (!idea.priority) {
            warnings.push(`${prefix}: Missing "priority"`);
        } else if (!VALID_PRIORITIES.includes(idea.priority)) {
            warnings.push(`${prefix}: Invalid priority "${idea.priority}". Valid: ${VALID_PRIORITIES.join(', ')}`);
        }
        
        // Validate use cases
        if (idea.useCases && Array.isArray(idea.useCases)) {
            idea.useCases.forEach((uc, ucIndex) => {
                if (!uc.id) {
                    warnings.push(`${prefix} UseCase[${ucIndex}]: Missing "id"`);
                }
                if (!uc.description) {
                    warnings.push(`${prefix} UseCase[${ucIndex}]: Missing "description"`);
                }
            });
        }
        
        // Validate environments
        if (idea.environments) {
            ['dev', 'staging', 'prod'].forEach(env => {
                if (!idea.environments[env]) {
                    warnings.push(`${prefix}: Missing environment "${env}"`);
                }
            });
        }
    });
    
    // Output results
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Registry Validation Results`);
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   Ideas Found: ${registry.ideas.length}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (errors.length > 0) {
        console.log('❌ ERRORS:');
        errors.forEach(e => console.log(`   • ${e}`));
        console.log('');
    }
    
    if (warnings.length > 0) {
        console.log('⚠️ WARNINGS:');
        warnings.forEach(w => console.log(`   • ${w}`));
        console.log('');
    }
    
    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Registry is valid!\n');
    }
    
    // Exit with error code if errors found
    if (errors.length > 0) {
        process.exit(1);
    }
    
    console.log('✅ Validation complete\n');
}

// Run validation
validateRegistry();
