/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * GEMBOT COMPLETE SYSTEM VERIFICATION SCRIPT
 * ═══════════════════════════════════════════════════════════════════════════════
 * Run this in browser console to check all systems
 * Copyright © 2024-2025 Ryan Barbrick / Barbrick Design
 * ═══════════════════════════════════════════════════════════════════════════════
 */

console.log(`
═══════════════════════════════════════════════════════════════════════════════
🔍 GEMBOT COMPLETE SYSTEM VERIFICATION
═══════════════════════════════════════════════════════════════════════════════
Starting comprehensive system check...
`);

const verificationReport = {
    timestamp: new Date().toISOString(),
    systems: {},
    errors: [],
    warnings: [],
    criticalIssues: [],
    summary: {}
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. CHECK AI AGENT SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n📊 [1/8] Checking AI Agent System...');
try {
    const aiAgentCheck = {
        loaded: false,
        managerExists: false,
        loggerExists: false,
        activeAgents: 0,
        totalLogs: 0,
        errors: 0,
        status: 'UNKNOWN'
    };

    // Check if AIAgentLogger exists
    if (window.AIAgentLogger) {
        aiAgentCheck.loggerExists = true;
        aiAgentCheck.totalLogs = window.AIAgentLogger.logs ? window.AIAgentLogger.logs.length : 0;
        aiAgentCheck.errors = window.AIAgentLogger.errors ? window.AIAgentLogger.errors.length : 0;
        console.log(`  ✓ AI Agent Logger found: ${aiAgentCheck.totalLogs} logs, ${aiAgentCheck.errors} errors`);
    } else {
        aiAgentCheck.warnings = ['AIAgentLogger not loaded'];
        console.warn('  ⚠️ AIAgentLogger not found');
    }

    // Check if AIAgentManager exists
    if (window.AIAgentManager) {
        aiAgentCheck.managerExists = true;
        const stats = window.AIAgentManager.getStatistics ? window.AIAgentManager.getStatistics() : null;
        if (stats) {
            aiAgentCheck.activeAgents = stats.activeAgents || 0;
            console.log(`  ✓ AI Agent Manager found: ${aiAgentCheck.activeAgents} active agents`);
        }
    } else {
        aiAgentCheck.warnings = aiAgentCheck.warnings || [];
        aiAgentCheck.warnings.push('AIAgentManager not loaded');
        console.warn('  ⚠️ AIAgentManager not found');
    }

    // Check localStorage for AI agent data
    const aiLogs = localStorage.getItem('ai_agent_logs');
    const aiErrors = localStorage.getItem('ai_agent_errors');
    if (aiLogs) {
        const parsedLogs = JSON.parse(aiLogs);
        console.log(`  ✓ Found ${parsedLogs.length} saved logs in localStorage`);
        aiAgentCheck.savedLogs = parsedLogs.length;
    }
    if (aiErrors) {
        const parsedErrors = JSON.parse(aiErrors);
        console.log(`  ⚠️ Found ${parsedErrors.length} saved errors in localStorage`);
        aiAgentCheck.savedErrors = parsedErrors.length;
    }

    aiAgentCheck.status = (aiAgentCheck.loggerExists && aiAgentCheck.managerExists) ? 'WORKING' : 'PARTIAL';
    aiAgentCheck.loaded = true;
    verificationReport.systems.aiAgents = aiAgentCheck;
    console.log(`  Status: ${aiAgentCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking AI Agent system:', error);
    verificationReport.errors.push({ system: 'aiAgents', error: error.message });
    verificationReport.systems.aiAgents = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CHECK FARM GAME SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n🎮 [2/8] Checking Farm Game System...');
try {
    const gameCheck = {
        loaded: false,
        initialized: false,
        saveExists: false,
        machineCount: 0,
        playerLevel: 0,
        gems: 0,
        status: 'UNKNOWN'
    };

    // Check if GemBotFarmGame class exists
    if (typeof GemBotFarmGame !== 'undefined') {
        gameCheck.loaded = true;
        console.log('  ✓ GemBotFarmGame class loaded');
    } else {
        console.warn('  ⚠️ GemBotFarmGame class not found');
        verificationReport.warnings.push('Farm game class not loaded');
    }

    // Check if game instance exists
    if (window.farmGame) {
        gameCheck.initialized = true;
        console.log('  ✓ Farm game instance found');
        
        // Get game state
        if (window.farmGame.state) {
            gameCheck.playerLevel = window.farmGame.state.player.level || 0;
            gameCheck.gems = window.farmGame.state.player.gems || 0;
            gameCheck.machineCount = window.farmGame.state.machines ? window.farmGame.state.machines.length : 0;
            console.log(`  ✓ Player Level: ${gameCheck.playerLevel}, Gems: ${gameCheck.gems}, Machines: ${gameCheck.machineCount}`);
        }
    } else {
        console.warn('  ⚠️ Farm game instance not initialized');
        verificationReport.warnings.push('Farm game not initialized');
    }

    // Check localStorage for save data
    const saveKeys = ['farmGame_save', 'gembot_farm_save'];
    for (const key of saveKeys) {
        const saveData = localStorage.getItem(key);
        if (saveData) {
            gameCheck.saveExists = true;
            const parsed = JSON.parse(saveData);
            console.log(`  ✓ Save data found in ${key}: ${parsed.state?.player?.level ? 'Level ' + parsed.state.player.level : 'Data exists'}`);
            break;
        }
    }

    gameCheck.status = (gameCheck.loaded && gameCheck.initialized) ? 'WORKING' : gameCheck.loaded ? 'LOADED' : 'NOT_LOADED';
    verificationReport.systems.farmGame = gameCheck;
    console.log(`  Status: ${gameCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking Farm Game system:', error);
    verificationReport.errors.push({ system: 'farmGame', error: error.message });
    verificationReport.systems.farmGame = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CHECK WALLET SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n💰 [3/8] Checking Wallet System...');
try {
    const walletCheck = {
        loaded: false,
        totalWallets: 0,
        totalBalance: 0,
        wallets: [],
        status: 'UNKNOWN'
    };

    // Check if WalletManager exists
    if (window.walletManager || window.WalletManager) {
        walletCheck.loaded = true;
        console.log('  ✓ Wallet Manager loaded');
    } else {
        console.warn('  ⚠️ Wallet Manager not found');
    }

    // Check localStorage for wallet data
    const walletData = localStorage.getItem('gembot_wallets');
    if (walletData) {
        const parsedWallets = JSON.parse(walletData);
        walletCheck.totalWallets = Array.isArray(parsedWallets) ? parsedWallets.length : Object.keys(parsedWallets).length;
        walletCheck.wallets = parsedWallets;
        
        // Calculate total balance
        if (Array.isArray(parsedWallets)) {
            walletCheck.totalBalance = parsedWallets.reduce((sum, w) => sum + (w.balance || 0), 0);
        } else {
            walletCheck.totalBalance = Object.values(parsedWallets).reduce((sum, w) => sum + (w.balance || 0), 0);
        }
        
        console.log(`  ✓ Found ${walletCheck.totalWallets} wallets, Total balance: ${walletCheck.totalBalance} GBUV`);
    } else {
        console.warn('  ⚠️ No wallet data in localStorage');
        verificationReport.warnings.push('No wallet data found');
    }

    walletCheck.status = walletCheck.totalWallets > 0 ? 'WORKING' : 'NO_DATA';
    verificationReport.systems.wallets = walletCheck;
    console.log(`  Status: ${walletCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking Wallet system:', error);
    verificationReport.errors.push({ system: 'wallets', error: error.message });
    verificationReport.systems.wallets = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. CHECK SECURITY/ANTI-FRAUD SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n🔒 [4/8] Checking Security System...');
try {
    const securityCheck = {
        loaded: false,
        totalUsers: 0,
        suspiciousCount: 0,
        flaggedIPs: 0,
        status: 'UNKNOWN'
    };

    // Check if SecurityManager exists
    if (window.securityManager || window.SecurityManager) {
        securityCheck.loaded = true;
        console.log('  ✓ Security Manager loaded');
    } else {
        console.warn('  ⚠️ Security Manager not found');
    }

    // Check localStorage for security data
    const securityData = localStorage.getItem('gembot_security');
    if (securityData) {
        const parsed = JSON.parse(securityData);
        securityCheck.totalUsers = parsed.users ? parsed.users.length : 0;
        securityCheck.suspiciousCount = parsed.flagged ? parsed.flagged.length : 0;
        console.log(`  ✓ Security data found: ${securityCheck.totalUsers} users, ${securityCheck.suspiciousCount} flagged`);
    }

    // Check for IP tracking
    const ipData = localStorage.getItem('gembot_ip_tracking');
    if (ipData) {
        const parsed = JSON.parse(ipData);
        securityCheck.flaggedIPs = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
        console.log(`  ✓ IP tracking: ${securityCheck.flaggedIPs} tracked IPs`);
    }

    securityCheck.status = securityCheck.loaded ? 'WORKING' : 'NOT_LOADED';
    verificationReport.systems.security = securityCheck;
    console.log(`  Status: ${securityCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking Security system:', error);
    verificationReport.errors.push({ system: 'security', error: error.message });
    verificationReport.systems.security = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CHECK 3D VISUALIZATION
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n🎨 [5/8] Checking 3D Visualization...');
try {
    const visualCheck = {
        babylonLoaded: false,
        sceneExists: false,
        engineRunning: false,
        meshCount: 0,
        status: 'UNKNOWN'
    };

    // Check if Babylon.js loaded
    if (typeof BABYLON !== 'undefined') {
        visualCheck.babylonLoaded = true;
        console.log('  ✓ Babylon.js loaded');
    } else {
        console.warn('  ⚠️ Babylon.js not loaded');
        verificationReport.criticalIssues.push('Babylon.js not loaded - 3D features unavailable');
    }

    // Check if scene exists
    if (window.scene || window.gemBotScene) {
        visualCheck.sceneExists = true;
        const scene = window.scene || window.gemBotScene;
        visualCheck.meshCount = scene.meshes ? scene.meshes.length : 0;
        console.log(`  ✓ 3D Scene exists: ${visualCheck.meshCount} meshes`);
        
        // Check if engine is running
        if (scene.getEngine && scene.getEngine().isDisposed === false) {
            visualCheck.engineRunning = true;
            console.log('  ✓ Render engine running');
        }
    } else {
        console.warn('  ⚠️ 3D Scene not initialized');
        verificationReport.warnings.push('3D scene not initialized');
    }

    visualCheck.status = (visualCheck.babylonLoaded && visualCheck.sceneExists) ? 'WORKING' : 'NOT_INITIALIZED';
    verificationReport.systems.visualization = visualCheck;
    console.log(`  Status: ${visualCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking 3D Visualization:', error);
    verificationReport.errors.push({ system: 'visualization', error: error.message });
    verificationReport.systems.visualization = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. CHECK MERLIN AI SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n🧙 [6/8] Checking Merlin AI System...');
try {
    const merlinCheck = {
        loaded: false,
        initialized: false,
        knowledgeLoaded: false,
        tooltipsActive: false,
        status: 'UNKNOWN'
    };

    // Check if Merlin classes exist
    if (window.MerlinIntelligenceSystem || typeof MerlinIntelligenceSystem !== 'undefined') {
        merlinCheck.loaded = true;
        console.log('  ✓ Merlin Intelligence System loaded');
    } else {
        console.warn('  ⚠️ Merlin Intelligence System not found');
    }

    // Check if Merlin instance exists
    if (window.merlin || window.merlinAI) {
        merlinCheck.initialized = true;
        console.log('  ✓ Merlin AI instance found');
    } else {
        console.warn('  ⚠️ Merlin AI not initialized');
    }

    // Check if knowledge base loaded
    if (window.knowledgeBase || window.merlinKnowledge) {
        merlinCheck.knowledgeLoaded = true;
        const kb = window.knowledgeBase || window.merlinKnowledge;
        const topicCount = kb.topics ? Object.keys(kb.topics).length : 0;
        console.log(`  ✓ Knowledge base loaded: ${topicCount} topics`);
    }

    // Check if tooltip system active
    if (window.MerlinTooltipSystem || window.tooltipSystem) {
        merlinCheck.tooltipsActive = true;
        console.log('  ✓ Tooltip system active');
    }

    merlinCheck.status = (merlinCheck.loaded && merlinCheck.initialized) ? 'WORKING' : 'PARTIAL';
    verificationReport.systems.merlin = merlinCheck;
    console.log(`  Status: ${merlinCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking Merlin AI:', error);
    verificationReport.errors.push({ system: 'merlin', error: error.message });
    verificationReport.systems.merlin = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. CHECK ACADEMY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n📚 [7/8] Checking Academy System...');
try {
    const academyCheck = {
        loaded: false,
        initialized: false,
        courseCount: 0,
        lessonCount: 0,
        userProgress: {},
        status: 'UNKNOWN'
    };

    // Check if Academy classes exist
    if (window.GemBotAcademy || typeof GemBotAcademy !== 'undefined') {
        academyCheck.loaded = true;
        console.log('  ✓ Academy system loaded');
    } else {
        console.warn('  ⚠️ Academy system not found');
    }

    // Check if Academy instance exists
    if (window.academy || window.gembotAcademy) {
        academyCheck.initialized = true;
        const academy = window.academy || window.gembotAcademy;
        
        if (academy.courses) {
            academyCheck.courseCount = academy.courses.length;
            academyCheck.lessonCount = academy.courses.reduce((sum, c) => sum + (c.lessons ? c.lessons.length : 0), 0);
            console.log(`  ✓ Academy initialized: ${academyCheck.courseCount} courses, ${academyCheck.lessonCount} lessons`);
        }
    } else {
        console.warn('  ⚠️ Academy not initialized');
    }

    // Check localStorage for user progress
    const progress = localStorage.getItem('gembot_academy_progress');
    if (progress) {
        academyCheck.userProgress = JSON.parse(progress);
        const completedLessons = Object.keys(academyCheck.userProgress).length;
        console.log(`  ✓ User progress: ${completedLessons} lessons tracked`);
    }

    academyCheck.status = (academyCheck.loaded && academyCheck.courseCount > 0) ? 'WORKING' : 'PARTIAL';
    verificationReport.systems.academy = academyCheck;
    console.log(`  Status: ${academyCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking Academy:', error);
    verificationReport.errors.push({ system: 'academy', error: error.message });
    verificationReport.systems.academy = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. CHECK ADMIN DASHBOARD (if present)
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n⚙️ [8/8] Checking Admin Dashboard...');
try {
    const adminCheck = {
        loaded: false,
        authenticated: false,
        apiConnected: false,
        githubConfigured: false,
        status: 'UNKNOWN'
    };

    // Check if admin API exists
    if (window.gemBotAdminAPI) {
        adminCheck.loaded = true;
        adminCheck.apiConnected = true;
        console.log('  ✓ Admin API loaded');
    } else {
        console.log('  ℹ️ Admin API not present (not on admin page)');
    }

    // Check authentication
    const adminHash = localStorage.getItem('gembot_admin_hash');
    if (adminHash) {
        adminCheck.authenticated = true;
        console.log('  ✓ Admin credentials stored');
    }

    // Check GitHub config
    const githubConfig = localStorage.getItem('gembot_github_config');
    if (githubConfig) {
        const parsed = JSON.parse(githubConfig);
        adminCheck.githubConfigured = !!(parsed.token && parsed.token.trim());
        console.log(`  ${adminCheck.githubConfigured ? '✓' : 'ℹ️'} GitHub ${adminCheck.githubConfigured ? 'configured' : 'not configured'}`);
    }

    adminCheck.status = adminCheck.loaded ? 'WORKING' : 'NOT_APPLICABLE';
    verificationReport.systems.admin = adminCheck;
    console.log(`  Status: ${adminCheck.status}`);
} catch (error) {
    console.error('  ❌ Error checking Admin Dashboard:', error);
    verificationReport.errors.push({ system: 'admin', error: error.message });
    verificationReport.systems.admin = { status: 'ERROR', error: error.message };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERATE SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════
console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log('📋 VERIFICATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════════════════');

const systemNames = Object.keys(verificationReport.systems);
const workingSystems = systemNames.filter(s => verificationReport.systems[s].status === 'WORKING').length;
const totalSystems = systemNames.length;
const healthScore = Math.round((workingSystems / totalSystems) * 100);

verificationReport.summary = {
    totalSystems,
    workingSystems,
    partialSystems: systemNames.filter(s => verificationReport.systems[s].status === 'PARTIAL').length,
    errorSystems: systemNames.filter(s => verificationReport.systems[s].status === 'ERROR').length,
    healthScore,
    criticalIssueCount: verificationReport.criticalIssues.length,
    warningCount: verificationReport.warnings.length,
    errorCount: verificationReport.errors.length
};

console.log(`\n🎯 Overall Health Score: ${healthScore}%`);
console.log(`✅ Working Systems: ${workingSystems}/${totalSystems}`);
console.log(`⚠️ Warnings: ${verificationReport.warnings.length}`);
console.log(`❌ Errors: ${verificationReport.errors.length}`);
console.log(`🔥 Critical Issues: ${verificationReport.criticalIssues.length}`);

// Display system status
console.log('\n📊 System Status:');
for (const [system, data] of Object.entries(verificationReport.systems)) {
    const icon = data.status === 'WORKING' ? '✅' : data.status === 'PARTIAL' ? '⚠️' : data.status === 'ERROR' ? '❌' : 'ℹ️';
    console.log(`  ${icon} ${system}: ${data.status}`);
}

// Display warnings
if (verificationReport.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    verificationReport.warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
}

// Display critical issues
if (verificationReport.criticalIssues.length > 0) {
    console.log('\n🔥 Critical Issues:');
    verificationReport.criticalIssues.forEach((c, i) => console.log(`  ${i + 1}. ${c}`));
}

// Display errors
if (verificationReport.errors.length > 0) {
    console.log('\n❌ Errors:');
    verificationReport.errors.forEach((e, i) => console.log(`  ${i + 1}. ${e.system}: ${e.error}`));
}

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log('✅ Verification complete! Report stored in: window.verificationReport');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

// Store report globally
window.verificationReport = verificationReport;

// Return report
verificationReport;
