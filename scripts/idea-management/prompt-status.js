#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PROMPT STATUS - Human-Friendly Idea Status Query
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Outputs current state of an idea:
 * - Status and versions per environment
 * - Last failing test
 * - Open issues
 * - Next action gate
 * 
 * Usage: node prompt-status.js IDEA-2025-XXXX
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(__dirname, '../../docs/ideas/registry.json');

function getStatusEmoji(status) {
    const emojis = {
        'intake': '📥',
        'triage': '🔍',
        'spec': '📝',
        'prototype': '🔧',
        'testing': '🧪',
        'staging': '🎭',
        'production': '🚀',
        'deprecated': '📦'
    };
    return emojis[status] || '❓';
}

function getNextGate(status) {
    const gates = {
        'intake': 'Triage review - validate uniqueness and impact',
        'triage': 'Spec authoring - define inputs/outputs/agents',
        'spec': 'Prototype implementation - create code with logging',
        'prototype': 'Agent testing - run scenario suites',
        'testing': 'Staging deployment - deploy with telemetry',
        'staging': 'Production promotion - human review required',
        'production': 'Monitoring - continuous improvement loop',
        'deprecated': 'No further action required'
    };
    return gates[status] || 'Unknown gate';
}

function promptStatus(ideaId) {
    // Load registry
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error('❌ Registry not found');
        process.exit(1);
    }
    
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    const idea = registry.ideas.find(i => i.id === ideaId);
    
    if (!idea) {
        console.error(`❌ Idea "${ideaId}" not found in registry`);
        process.exit(1);
    }
    
    const emoji = getStatusEmoji(idea.status);
    const nextGate = getNextGate(idea.status);
    
    // Calculate progress
    const totalUseCases = idea.useCases?.length || 0;
    const implementedUseCases = idea.useCases?.filter(uc => uc.implemented).length || 0;
    const progress = totalUseCases > 0 ? Math.round((implementedUseCases / totalUseCases) * 100) : 0;
    
    // Environment status
    const envStatus = [];
    if (idea.environments) {
        Object.entries(idea.environments).forEach(([env, data]) => {
            const icon = data.deployed ? '✅' : '⬜';
            envStatus.push(`${icon} ${env}: ${data.version || 'not deployed'}`);
        });
    }
    
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log(`║ ${emoji} ${idea.id}: ${idea.title.substring(0, 45).padEnd(45)} ║`);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║ Status:     ${idea.status.padEnd(49)} ║`);
    console.log(`║ Priority:   ${idea.priority.padEnd(49)} ║`);
    console.log(`║ Progress:   ${(progress + '% use cases implemented').padEnd(49)} ║`);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║ Environments:                                                 ║');
    envStatus.forEach(es => {
        console.log(`║   ${es.padEnd(59)} ║`);
    });
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║ Metrics:                                                      ║');
    console.log(`║   Error Rate: ${(idea.metrics?.errorRate || 'N/A').toString().padEnd(47)} ║`);
    console.log(`║   P95 Latency: ${(idea.metrics?.p95Latency || 'N/A').toString().padEnd(46)} ║`);
    console.log(`║   Coverage: ${(idea.metrics?.coverage || 'N/A').toString().padEnd(49)} ║`);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log(`║ Next Gate:                                                    ║`);
    console.log(`║   ${nextGate.substring(0, 59).padEnd(59)} ║`);
    console.log('╠═══════════════════════════════════════════════════════════════╣');
    console.log('║ Commands:                                                     ║');
    console.log(`║   npm run check:idea ${ideaId}                       ║`);
    console.log(`║   npm run test:idea ${ideaId}                        ║`);
    console.log(`║   npm run deploy:staging ${ideaId}                   ║`);
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
}

function listAllIdeas() {
    if (!fs.existsSync(REGISTRY_PATH)) {
        console.error('❌ Registry not found');
        process.exit(1);
    }
    
    const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
    
    console.log('\n📚 All Ideas in Registry:\n');
    console.log('═══════════════════════════════════════════════════════════════');
    
    // Group by status
    const byStatus = {};
    registry.ideas.forEach(idea => {
        if (!byStatus[idea.status]) {
            byStatus[idea.status] = [];
        }
        byStatus[idea.status].push(idea);
    });
    
    const statusOrder = ['production', 'staging', 'testing', 'prototype', 'spec', 'triage', 'intake', 'deprecated'];
    
    statusOrder.forEach(status => {
        if (byStatus[status] && byStatus[status].length > 0) {
            const emoji = getStatusEmoji(status);
            console.log(`\n${emoji} ${status.toUpperCase()}:`);
            byStatus[status].forEach(idea => {
                console.log(`   • ${idea.id}: ${idea.title}`);
            });
        }
    });
    
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`Total: ${registry.ideas.length} ideas\n`);
}

// Get idea ID from command line
const ideaId = process.argv[2];

if (!ideaId || ideaId === '--list' || ideaId === '-l') {
    listAllIdeas();
} else {
    promptStatus(ideaId);
}
