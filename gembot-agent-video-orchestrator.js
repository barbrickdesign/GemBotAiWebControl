/**
 * GemBot Agents Video Generation Orchestrator
 * Coordinates video generation requests from all agents
 * Manages job queue, resource allocation, and delivery
 */

const MerlinVideoGenerationAgent = require('./merlin-video-generation-agent');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');

class AgentVideoOrchestrator extends EventEmitter {
    constructor(config = {}) {
        super();
        
        this.config = {
            maxTotalJobs: config.maxTotalJobs || 5,
            maxQueueSize: config.maxQueueSize || 20,
            outputDir: config.outputDir || './generated_videos',
            videoLibraryPath: config.videoLibraryPath || './video_library',
            ...config
        };
        
        // Initialize Merlin video agent
        this.merlinAgent = new MerlinVideoGenerationAgent({
            outputDir: this.config.outputDir,
            maxConcurrentJobs: config.maxConcurrentJobs || 1
        });
        
        // Track jobs from all agents
        this.allJobs = new Map();
        this.agentStats = new Map();
        
        // Video library
        this.videoLibrary = new Map();
        this.loadVideoLibrary();
        
        // Listen to Merlin agent events
        this.merlinAgent.on('job_completed', (data) => {
            this.onJobCompleted(data, 'merlin');
        });
        
        this.merlinAgent.on('job_failed', (data) => {
            this.onJobFailed(data, 'merlin');
        });
        
        console.log('🎬 GemBot Agent Video Orchestrator Initialized');
        console.log(`   Max Total Jobs: ${this.config.maxTotalJobs}`);
        console.log(`   Max Queue Size: ${this.config.maxQueueSize}`);
    }
    
    /**
     * Register a new agent for video generation
     */
    registerAgent(agentName, agent) {
        console.log(`📍 Registering agent: ${agentName}`);
        this.agentStats.set(agentName, {
            name: agentName,
            totalRequests: 0,
            completedVideos: 0,
            failedVideos: 0,
            lastRequest: null
        });
    }
    
    /**
     * Submit video request from any agent
     */
    async submitVideoRequest(agentName, requestData) {
        console.log(`\n📹 Video request from ${agentName}`);
        console.log(`   Type: ${requestData.type}`);
        console.log(`   Title: ${requestData.title || 'Untitled'}`);
        
        // Update agent stats
        const stats = this.agentStats.get(agentName) || {
            name: agentName,
            totalRequests: 0,
            completedVideos: 0,
            failedVideos: 0
        };
        stats.totalRequests++;
        stats.lastRequest = new Date();
        this.agentStats.set(agentName, stats);
        
        // Prepare video request
        const videoRequest = {
            id: `${agentName}_${Date.now()}`,
            agent: agentName,
            ...requestData,
            submittedAt: new Date()
        };
        
        try {
            // Route to appropriate generation method
            let result;
            
            if (requestData.type === 'tutorial') {
                result = await this.merlinAgent.generateTutorial(
                    requestData.topic,
                    requestData.audience
                );
            } else if (requestData.type === 'character_demo') {
                result = await this.merlinAgent.generateCharacterDemo(
                    requestData.character,
                    requestData.action
                );
            } else if (requestData.type === 'step_guide') {
                result = await this.merlinAgent.generateStepByStepGuide(
                    requestData.steps,
                    requestData.title
                );
            } else if (requestData.type === 'from_command') {
                result = await this.merlinAgent.generateFromCommand(
                    requestData.command,
                    requestData.context
                );
            } else {
                result = await this.merlinAgent.generateVideo(
                    requestData.storyboard,
                    requestData.metadata
                );
            }
            
            videoRequest.result = result;
            videoRequest.status = 'completed';
            this.allJobs.set(videoRequest.id, videoRequest);
            
            return result;
            
        } catch (error) {
            videoRequest.status = 'failed';
            videoRequest.error = error.message;
            this.allJobs.set(videoRequest.id, videoRequest);
            throw error;
        }
    }
    
    /**
     * Handle completed video from Merlin agent
     */
    onJobCompleted(data, agentName) {
        const stats = this.agentStats.get(agentName);
        if (stats) {
            stats.completedVideos++;
            this.agentStats.set(agentName, stats);
        }
        
        // Add to library
        this.addToLibrary(data.path, agentName);
        
        // Broadcast completion
        this.emit('video_ready', {
            jobId: data.jobId,
            path: data.path,
            agent: agentName
        });
    }
    
    /**
     * Handle failed video
     */
    onJobFailed(data, agentName) {
        const stats = this.agentStats.get(agentName);
        if (stats) {
            stats.failedVideos++;
            this.agentStats.set(agentName, stats);
        }
        
        this.emit('video_failed', {
            jobId: data.jobId,
            error: data.error,
            agent: agentName
        });
    }
    
    /**
     * Add video to library for easy discovery
     */
    addToLibrary(videoPath, agentName) {
        const fileName = path.basename(videoPath);
        const libraryEntry = {
            filename: fileName,
            path: videoPath,
            agent: agentName,
            addedAt: new Date(),
            filesize: fs.statSync(videoPath).size
        };
        
        this.videoLibrary.set(fileName, libraryEntry);
        this.saveVideoLibrary();
        
        console.log(`📚 Added to library: ${fileName}`);
    }
    
    /**
     * Save video library to disk
     */
    saveVideoLibrary() {
        const libraryData = {
            timestamp: new Date().toISOString(),
            totalVideos: this.videoLibrary.size,
            videos: Array.from(this.videoLibrary.values())
        };
        
        const libraryPath = path.join(this.config.videoLibraryPath, 'library.json');
        const dir = path.dirname(libraryPath);
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(libraryPath, JSON.stringify(libraryData, null, 2));
    }
    
    /**
     * Load video library from disk
     */
    loadVideoLibrary() {
        const libraryPath = path.join(this.config.videoLibraryPath, 'library.json');
        
        if (fs.existsSync(libraryPath)) {
            const libraryData = JSON.parse(fs.readFileSync(libraryPath, 'utf8'));
            libraryData.videos.forEach(video => {
                this.videoLibrary.set(video.filename, video);
            });
            console.log(`📚 Loaded ${this.videoLibrary.size} videos from library`);
        }
    }
    
    /**
     * Get videos for a specific agent
     */
    getAgentVideos(agentName) {
        const videos = [];
        for (const [_, video] of this.videoLibrary) {
            if (video.agent === agentName) {
                videos.push(video);
            }
        }
        return videos;
    }
    
    /**
     * Search videos in library
     */
    searchVideos(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        for (const [filename, video] of this.videoLibrary) {
            if (filename.toLowerCase().includes(lowerQuery) ||
                (video.metadata && JSON.stringify(video.metadata).toLowerCase().includes(lowerQuery))) {
                results.push(video);
            }
        }
        
        return results;
    }
    
    /**
     * Get orchestrator statistics
     */
    getStats() {
        let totalRequests = 0;
        let totalCompleted = 0;
        let totalFailed = 0;
        
        for (const [_, stats] of this.agentStats) {
            totalRequests += stats.totalRequests;
            totalCompleted += stats.completedVideos;
            totalFailed += stats.failedVideos;
        }
        
        return {
            timestamp: new Date().toISOString(),
            totalRequests,
            totalCompleted,
            totalFailed,
            librarySize: this.videoLibrary.size,
            activeJobs: this.merlinAgent.activeJobs.size,
            queuedJobs: this.merlinAgent.jobQueue.length,
            agents: Array.from(this.agentStats.values()),
            successRate: totalRequests > 0 ? ((totalCompleted / totalRequests) * 100).toFixed(1) + '%' : 'N/A'
        };
    }
    
    /**
     * Get system status
     */
    getSystemStatus() {
        const stats = this.getStats();
        
        return {
            status: 'operational',
            timestamp: new Date().toISOString(),
            merlinAgent: 'ready',
            orchestrator: 'ready',
            statistics: stats,
            health: {
                cpuUsage: process.cpuUsage(),
                memoryUsage: process.memoryUsage()
            }
        };
    }
}

/**
 * GemBot Agent Interface
 * Base class for GemBot agents to submit video requests
 */
class GemBotAgent extends EventEmitter {
    constructor(agentName, orchestrator) {
        super();
        this.name = agentName;
        this.orchestrator = orchestrator;
        
        // Register with orchestrator
        orchestrator.registerAgent(agentName, this);
        
        console.log(`🤖 ${agentName} agent initialized`);
    }
    
    /**
     * Generate a tutorial
     */
    async generateTutorial(topic, audience = 'general') {
        return this.orchestrator.submitVideoRequest(this.name, {
            type: 'tutorial',
            topic,
            audience,
            requestedBy: this.name
        });
    }
    
    /**
     * Generate a character demonstration
     */
    async generateCharacterDemo(character, action) {
        return this.orchestrator.submitVideoRequest(this.name, {
            type: 'character_demo',
            character,
            action,
            requestedBy: this.name
        });
    }
    
    /**
     * Generate from natural language command
     */
    async generateFromCommand(command, context = {}) {
        return this.orchestrator.submitVideoRequest(this.name, {
            type: 'from_command',
            command,
            context,
            requestedBy: this.name
        });
    }
    
    /**
     * Generate step-by-step guide
     */
    async generateGuide(steps, title) {
        return this.orchestrator.submitVideoRequest(this.name, {
            type: 'step_guide',
            steps,
            title,
            requestedBy: this.name
        });
    }
}

// Example usage and demonstration
if (require.main === module) {
    console.log('🎬 GemBot Agent Video Orchestrator - Demonstration\n');
    
    // Initialize orchestrator
    const orchestrator = new AgentVideoOrchestrator({
        outputDir: './gembot_videos',
        videoLibraryPath: './video_library'
    });
    
    // Create different agent types
    const tutorialAgent = new GemBotAgent('TutorialGenerator', orchestrator);
    const educationAgent = new GemBotAgent('EducationAssistant', orchestrator);
    const marketingAgent = new GemBotAgent('MarketingAgent', orchestrator);
    
    console.log('\n📊 System Status:');
    console.log(orchestrator.getSystemStatus());
    
    console.log('\n✅ Orchestrator ready for video generation requests from any agent!');
}

module.exports = { AgentVideoOrchestrator, GemBotAgent };
