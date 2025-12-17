#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHECK IMPLEMENTATION - Verify Idea Artifacts Exist
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Verifies that code artifacts exist for a given idea:
 * - Spec file present
 * - Code files exist
 * - Tests present
 * - Pipeline linked
 * - Environment deployment flags set
 * 
 * Usage: node check-implementation.js IDEA-2025-XXXX
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../../docs/ideas/registry.json');
const ROOT_PATH = path.join(__dirname, '../..');

function checkImplementation(ideaId) {
    console.log(`\n🔍 Checking implementation for: ${ideaId}\n`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    // Load registry
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error('❌ Registry not found');
        process.exit(1);
    }
    
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    const idea = registry.ideas.find(i => i.id === ideaId);
    
    if (!idea) {
        console.error(`❌ Idea "${ideaId}" not found in registry`);
        console.log('\nAvailable ideas:');
        registry.ideas.forEach(i => console.log(`   • ${i.id}: ${i.title}`));
        process.exit(1);
    }
    
    console.log(`📌 ${idea.title}`);
    console.log(`   Status: ${idea.status}`);
    console.log(`   Priority: ${idea.priority}`);
    console.log(`   Owners: ${idea.owners.join(', ')}`);
    console.log('');
    
    let checks = {
        passed: 0,
        failed: 0,
        warnings: 0
    };
    
    // Check artifacts
    console.log('📁 Artifact Checks:');
    
    // Spec
    if (idea.artifacts?.spec) {
        const specPath = path.join(ROOT_PATH, idea.artifacts.spec);
        if (fs.existsSync(specPath)) {
            console.log(`   ✅ Spec: ${idea.artifacts.spec}`);
            checks.passed++;
        } else {
            console.log(`   ❌ Spec missing: ${idea.artifacts.spec}`);
            checks.failed++;
        }
    } else {
        console.log('   ⚠️ No spec defined');
        checks.warnings++;
    }
    
    // Code files
    if (idea.artifacts?.code && idea.artifacts.code.length > 0) {
        idea.artifacts.code.forEach(codePath => {
            const fullPath = path.join(ROOT_PATH, codePath);
            if (fs.existsSync(fullPath)) {
                console.log(`   ✅ Code: ${codePath}`);
                checks.passed++;
            } else {
                console.log(`   ❌ Code missing: ${codePath}`);
                checks.failed++;
            }
        });
    } else {
        console.log('   ⚠️ No code files defined');
        checks.warnings++;
    }
    
    // Tests
    if (idea.artifacts?.tests && idea.artifacts.tests.length > 0) {
        idea.artifacts.tests.forEach(testPath => {
            const fullPath = path.join(ROOT_PATH, testPath);
            if (fs.existsSync(fullPath)) {
                console.log(`   ✅ Test: ${testPath}`);
                checks.passed++;
            } else {
                console.log(`   ⚠️ Test missing: ${testPath}`);
                checks.warnings++;
            }
        });
    } else {
        console.log('   ⚠️ No tests defined');
        checks.warnings++;
    }
    
    // Pipelines
    if (idea.artifacts?.pipelines && idea.artifacts.pipelines.length > 0) {
        idea.artifacts.pipelines.forEach(pipelinePath => {
            const fullPath = path.join(ROOT_PATH, pipelinePath);
            if (fs.existsSync(fullPath)) {
                console.log(`   ✅ Pipeline: ${pipelinePath}`);
                checks.passed++;
            } else {
                console.log(`   ⚠️ Pipeline missing: ${pipelinePath}`);
                checks.warnings++;
            }
        });
    }
    
    // Prompt file
    if (idea.links?.prompt) {
        const promptPath = path.join(ROOT_PATH, idea.links.prompt);
        if (fs.existsSync(promptPath)) {
            console.log(`   ✅ Prompt: ${idea.links.prompt}`);
            checks.passed++;
        } else {
            console.log(`   ⚠️ Prompt missing: ${idea.links.prompt}`);
            checks.warnings++;
        }
    }
    
    console.log('');
    
    // Check use cases
    console.log('📋 Use Case Status:');
    if (idea.useCases && idea.useCases.length > 0) {
        idea.useCases.forEach(uc => {
            const status = uc.implemented ? '✅' : '⏳';
            console.log(`   ${status} ${uc.id}: ${uc.description}`);
        });
    } else {
        console.log('   ⚠️ No use cases defined');
    }
    
    console.log('');
    
    // Check environments
    console.log('🌍 Environment Status:');
    if (idea.environments) {
        Object.entries(idea.environments).forEach(([env, data]) => {
            const status = data.deployed ? '✅' : '⏳';
            const version = data.version || 'not deployed';
            console.log(`   ${status} ${env}: ${version}`);
        });
    }
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`📊 Summary: ${checks.passed} passed, ${checks.failed} failed, ${checks.warnings} warnings`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    
    if (checks.failed > 0) {
        console.log('❌ Implementation incomplete\n');
        process.exit(1);
    } else if (checks.warnings > 0) {
        console.log('⚠️ Implementation has warnings\n');
    } else {
        console.log('✅ Implementation complete!\n');
    }
}

// Get idea ID from command line
const ideaId = process.argv[2];

if (!ideaId) {
    console.log('Usage: node check-implementation.js IDEA-2025-XXXX');
    console.log('\nAvailable ideas:');
    
    if (fs.existsSync(REGISTRY_PATH)) {
        const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
        registry.ideas.forEach(i => console.log(`   • ${i.id}: ${i.title} [${i.status}]`));
    }
    
    process.exit(1);
}

checkImplementation(ideaId);
