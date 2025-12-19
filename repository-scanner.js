/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * REPOSITORY SCANNER
 * Automated Agent Deployment System
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Scans and indexes repositories to create links and enable resource sharing.
 * Part of the automated agent deployment system that helps developers in
 * intense development mode by automatically allocating resources and creating
 * agent networks across repositories.
 * 
 * Features:
 * - Automatic repository structure detection
 * - File indexing and categorization
 * - Resource demand detection
 * - Health and activity metrics
 * - Cross-repository linking capability
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class RepositoryScanner {
    constructor() {
        this.repositories = new Map();
        this.fileIndex = new Map();
        this.scanQueue = [];
        this.scanning = false;
        
        // Storage keys
        this.STORAGE_KEY = 'repo_scanner_v1';
        this.INDEX_KEY = 'repo_file_index_v1';
        
        // File patterns to analyze
        this.FILE_PATTERNS = {
            code: /\.(js|ts|jsx|tsx|py|java|cpp|c|go|rs|rb|php|cs)$/,
            config: /\.(json|yaml|yml|toml|ini|env)$/,
            docs: /\.(md|txt|rst|adoc)$/,
            styles: /\.(css|scss|sass|less|styl)$/,
            markup: /\.(html|htm|xml|svg)$/,
            data: /\.(csv|xlsx|xls|db|sql)$/,
            media: /\.(png|jpg|jpeg|gif|svg|mp4|mp3|wav)$/
        };
        
        // Resource indicators
        this.RESOURCE_INDICATORS = {
            highActivity: ['package.json', 'requirements.txt', 'go.mod', 'Cargo.toml'],
            infrastructure: ['docker-compose.yml', 'Dockerfile', 'kubernetes/', '.github/'],
            testing: ['test/', 'tests/', 'spec/', '__tests__/', 'cypress/'],
            documentation: ['docs/', 'README.md', 'CONTRIBUTING.md'],
            buildTools: ['webpack.config.js', 'vite.config.js', 'rollup.config.js']
        };
        
        this.loadFromStorage();
        console.log('📡 Repository Scanner initialized');
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // STORAGE MANAGEMENT
    // ═══════════════════════════════════════════════════════════════════════════
    
    loadFromStorage() {
        try {
            const repoData = localStorage.getItem(this.STORAGE_KEY);
            if (repoData) {
                const parsed = JSON.parse(repoData);
                this.repositories = new Map(Object.entries(parsed));
            }
            
            const indexData = localStorage.getItem(this.INDEX_KEY);
            if (indexData) {
                const parsed = JSON.parse(indexData);
                this.fileIndex = new Map(Object.entries(parsed));
            }
        } catch (error) {
            console.error('Error loading scanner data:', error);
        }
    }
    
    saveToStorage() {
        try {
            const repoObj = Object.fromEntries(this.repositories);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(repoObj));
            
            const indexObj = Object.fromEntries(this.fileIndex);
            localStorage.setItem(this.INDEX_KEY, JSON.stringify(indexObj));
        } catch (error) {
            console.error('Error saving scanner data:', error);
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REPOSITORY SCANNING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Register and scan a repository
     * @param {Object} repoInfo - Repository information
     * @returns {Promise<Object>} Scan results
     */
    async scanRepository(repoInfo) {
        const { owner, name, url, branch = 'main' } = repoInfo;
        const repoId = `${owner}/${name}`;
        
        console.log(`🔍 Scanning repository: ${repoId}`);
        
        try {
            // Create repository record
            const repo = {
                id: repoId,
                owner: owner,
                name: name,
                url: url || `https://github.com/${repoId}`,
                branch: branch,
                scannedAt: new Date().toISOString(),
                status: 'scanning',
                stats: {
                    totalFiles: 0,
                    codeFiles: 0,
                    configFiles: 0,
                    docFiles: 0,
                    totalLines: 0,
                    languages: {}
                },
                health: {
                    score: 0,
                    indicators: [],
                    resourceDemand: 'unknown'
                },
                files: [],
                links: [],
                agents: []
            };
            
            // Fallback: If GitHub API fails, use local scanning
            try {
                await this.scanGitHubRepo(repo);
            } catch (apiError) {
                console.warn('GitHub API scan failed, using local scanning:', apiError);
                await this.scanLocalRepo(repo);
            }
            
            // Analyze repository
            this.analyzeRepository(repo);
            
            // Calculate health score
            this.calculateHealthScore(repo);
            
            // Detect resource demand
            this.detectResourceDemand(repo);
            
            repo.status = 'active';
            this.repositories.set(repoId, repo);
            
            // Index all files
            this.indexRepositoryFiles(repo);
            
            this.saveToStorage();
            
            console.log(`✅ Repository scanned: ${repoId} (${repo.stats.totalFiles} files)`);
            
            return repo;
            
        } catch (error) {
            console.error(`Failed to scan repository ${repoId}:`, error);
            return null;
        }
    }
    
    /**
     * Scan repository using GitHub API
     * Fallback 1: Use GitHub API if available
     */
    async scanGitHubRepo(repo) {
        // This would connect to GitHub API in production
        // For now, simulate the structure
        console.log('Using GitHub API scan method');
        
        // Simulated file structure - would be fetched from GitHub API
        const sampleFiles = [
            'README.md',
            'package.json',
            'index.html',
            'src/main.js',
            'src/components/App.js',
            'docs/CONTRIBUTING.md',
            'tests/unit.test.js'
        ];
        
        repo.files = sampleFiles.map(path => ({
            path: path,
            type: this.detectFileType(path),
            size: Math.floor(Math.random() * 10000),
            lastModified: new Date().toISOString()
        }));
        
        repo.stats.totalFiles = repo.files.length;
    }
    
    /**
     * Scan local repository
     * Fallback 2: Use local file system if GitHub API unavailable
     */
    async scanLocalRepo(repo) {
        console.log('Using local scan method');
        
        // In a real implementation, this would use file system APIs
        // For browser environment, we simulate
        repo.files = [
            { path: 'index.html', type: 'markup', size: 2048 },
            { path: 'README.md', type: 'docs', size: 1024 }
        ];
        
        repo.stats.totalFiles = repo.files.length;
    }
    
    /**
     * Detect file type from path
     */
    detectFileType(filePath) {
        for (const [type, pattern] of Object.entries(this.FILE_PATTERNS)) {
            if (pattern.test(filePath)) {
                return type;
            }
        }
        return 'other';
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REPOSITORY ANALYSIS
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Analyze repository structure and content
     */
    analyzeRepository(repo) {
        console.log(`🔬 Analyzing repository: ${repo.id}`);
        
        // Count file types
        const typeCounts = {};
        repo.files.forEach(file => {
            typeCounts[file.type] = (typeCounts[file.type] || 0) + 1;
        });
        
        repo.stats.codeFiles = typeCounts.code || 0;
        repo.stats.configFiles = typeCounts.config || 0;
        repo.stats.docFiles = typeCounts.docs || 0;
        
        // Detect languages
        repo.files.forEach(file => {
            const ext = file.path.split('.').pop();
            if (file.type === 'code') {
                repo.stats.languages[ext] = (repo.stats.languages[ext] || 0) + 1;
            }
        });
        
        // Estimate total lines (approximation)
        repo.stats.totalLines = repo.stats.codeFiles * 150; // avg 150 lines per file
    }
    
    /**
     * Calculate repository health score (0-100)
     */
    calculateHealthScore(repo) {
        let score = 50; // baseline
        
        // Has README
        if (repo.files.some(f => f.path.match(/readme/i))) {
            score += 10;
            repo.health.indicators.push('Has README');
        }
        
        // Has tests
        if (repo.files.some(f => f.path.match(/test|spec/i))) {
            score += 15;
            repo.health.indicators.push('Has tests');
        }
        
        // Has documentation
        if (repo.files.some(f => f.path.match(/docs?\//i))) {
            score += 10;
            repo.health.indicators.push('Has documentation');
        }
        
        // Has CI/CD
        if (repo.files.some(f => f.path.match(/\.github\/workflows/i))) {
            score += 15;
            repo.health.indicators.push('Has CI/CD');
        }
        
        // Good file organization
        if (repo.stats.codeFiles > 5 && repo.files.some(f => f.path.includes('/'))) {
            score += 10;
            repo.health.indicators.push('Well organized');
        }
        
        repo.health.score = Math.min(100, score);
    }
    
    /**
     * Detect resource demand level
     */
    detectResourceDemand(repo) {
        let demand = 0;
        
        // High activity indicators
        this.RESOURCE_INDICATORS.highActivity.forEach(indicator => {
            if (repo.files.some(f => f.path.includes(indicator))) {
                demand += 2;
            }
        });
        
        // Infrastructure indicators
        this.RESOURCE_INDICATORS.infrastructure.forEach(indicator => {
            if (repo.files.some(f => f.path.includes(indicator))) {
                demand += 3;
            }
        });
        
        // Many files = high demand
        if (repo.stats.totalFiles > 100) demand += 3;
        if (repo.stats.totalFiles > 500) demand += 2;
        
        // Determine demand level
        if (demand >= 8) {
            repo.health.resourceDemand = 'critical';
        } else if (demand >= 5) {
            repo.health.resourceDemand = 'high';
        } else if (demand >= 3) {
            repo.health.resourceDemand = 'moderate';
        } else {
            repo.health.resourceDemand = 'low';
        }
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // FILE INDEXING
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Index all files for quick searching
     */
    indexRepositoryFiles(repo) {
        console.log(`📇 Indexing files for ${repo.id}`);
        
        repo.files.forEach(file => {
            const fileKey = `${repo.id}:${file.path}`;
            
            this.fileIndex.set(fileKey, {
                repoId: repo.id,
                path: file.path,
                type: file.type,
                size: file.size,
                indexedAt: new Date().toISOString(),
                searchTokens: this.generateSearchTokens(file.path)
            });
        });
    }
    
    /**
     * Generate search tokens for file path
     */
    generateSearchTokens(path) {
        const tokens = new Set();
        
        // Split by separators
        const parts = path.split(/[\/\-\_\.]/);
        parts.forEach(part => {
            if (part.length > 2) {
                tokens.add(part.toLowerCase());
            }
        });
        
        return Array.from(tokens);
    }
    
    /**
     * Search files across all repositories
     */
    searchFiles(query) {
        const results = [];
        const queryTokens = this.generateSearchTokens(query);
        
        this.fileIndex.forEach((file, key) => {
            const matchScore = queryTokens.filter(token =>
                file.searchTokens.some(fileToken => fileToken.includes(token))
            ).length;
            
            if (matchScore > 0) {
                results.push({
                    ...file,
                    matchScore: matchScore
                });
            }
        });
        
        // Sort by match score
        results.sort((a, b) => b.matchScore - a.matchScore);
        
        return results;
    }
    
    // ═══════════════════════════════════════════════════════════════════════════
    // REPOSITORY QUERIES
    // ═══════════════════════════════════════════════════════════════════════════
    
    /**
     * Get repository by ID
     */
    getRepository(repoId) {
        return this.repositories.get(repoId);
    }
    
    /**
     * Get all repositories
     */
    getAllRepositories() {
        return Array.from(this.repositories.values());
    }
    
    /**
     * Get repositories by resource demand
     */
    getRepositoriesByDemand(demandLevel) {
        return this.getAllRepositories().filter(
            repo => repo.health.resourceDemand === demandLevel
        );
    }
    
    /**
     * Get repository statistics
     */
    getStats() {
        const repos = this.getAllRepositories();
        
        return {
            totalRepositories: repos.length,
            totalFiles: repos.reduce((sum, r) => sum + r.stats.totalFiles, 0),
            totalLines: repos.reduce((sum, r) => sum + r.stats.totalLines, 0),
            averageHealth: repos.reduce((sum, r) => sum + r.health.score, 0) / repos.length || 0,
            demandBreakdown: {
                critical: this.getRepositoriesByDemand('critical').length,
                high: this.getRepositoriesByDemand('high').length,
                moderate: this.getRepositoriesByDemand('moderate').length,
                low: this.getRepositoriesByDemand('low').length
            }
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════

window.RepositoryScanner = RepositoryScanner;
window.repoScanner = new RepositoryScanner();

console.log('✅ Repository Scanner loaded');
console.log('📖 Usage: await window.repoScanner.scanRepository({owner: "user", name: "repo"})');
