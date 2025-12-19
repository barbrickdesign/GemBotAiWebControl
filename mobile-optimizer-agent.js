/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MOBILE OPTIMIZER AGENT
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * AI Agent for Mobile Optimization
 * - Detects mobile devices and network conditions
 * - Optimizes UI/UX for mobile screens
 * - Reduces resource usage on mobile
 * - Enhances touch controls
 * - Tests mobile compatibility
 * 
 * Owner: Ryan Barbrick / Barbrick Design
 * Contact: BarbrickDesign@gmail.com
 * © 2024-2025 Ryan Barbrick. All Rights Reserved.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

window.MobileOptimizerAgent = {
    version: '1.0.0',
    agentName: 'Mobile Optimizer',
    initialized: false,
    
    // Device detection
    deviceInfo: {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        screenWidth: 0,
        screenHeight: 0,
        pixelRatio: 1,
        touchEnabled: false,
        orientation: 'portrait',
        connection: null
    },
    
    // Optimization settings
    optimizations: {
        reducedAnimations: false,
        compressedAssets: false,
        lazyLoading: true,
        simplifiedUI: false,
        offlineMode: false,
        lowPowerMode: false
    },
    
    // Performance metrics
    metrics: {
        pageLoadTime: 0,
        frameRate: 0,
        memoryUsage: 0,
        networkSpeed: 0,
        batteryLevel: null
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIALIZATION
    // ═══════════════════════════════════════════════════════════════════════════
    
    async init() {
        console.log('📱 Mobile Optimizer Agent initializing...');
        
        // Detect device
        this.detectDevice();
        
        // Detect network
        await this.detectNetwork();
        
        // Detect battery
        await this.detectBattery();
        
        // Apply optimizations
        if (this.deviceInfo.isMobile) {
            this.applyMobileOptimizations();
        }
        
        // Setup monitoring
        this.setupMonitoring();
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.initialized = true;
        console.log('✅ Mobile Optimizer Agent ready');
        console.log('Device:', this.deviceInfo.isMobile ? 'Mobile' : 'Desktop');
        
        return this;
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // DEVICE DETECTION
    // ═══════════════════════════════════════════════════════════════════════════
    
    detectDevice() {
        const ua = navigator.userAgent;
        
        // Mobile detection
        this.deviceInfo.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        this.deviceInfo.isTablet = /iPad|Android/i.test(ua) && !/Mobile/i.test(ua);
        this.deviceInfo.isDesktop = !this.deviceInfo.isMobile && !this.deviceInfo.isTablet;
        
        // Screen info
        this.deviceInfo.screenWidth = window.innerWidth;
        this.deviceInfo.screenHeight = window.innerHeight;
        this.deviceInfo.pixelRatio = window.devicePixelRatio || 1;
        
        // Touch detection
        this.deviceInfo.touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Orientation
        this.deviceInfo.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        
        console.log('📱 Device detected:', this.deviceInfo);
    },
    
    async detectNetwork() {
        if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            
            this.deviceInfo.connection = {
                type: connection.effectiveType || 'unknown',
                downlink: connection.downlink || 0,
                rtt: connection.rtt || 0,
                saveData: connection.saveData || false
            };
            
            console.log('📶 Network detected:', this.deviceInfo.connection);
            
            // Enable optimizations for slow connections
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' || connection.saveData) {
                this.optimizations.compressedAssets = true;
                this.optimizations.simplifiedUI = true;
                console.log('⚡ Slow network detected - enabling optimizations');
            }
        }
    },
    
    async detectBattery() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                
                this.metrics.batteryLevel = battery.level * 100;
                
                // Enable low power mode if battery is low
                if (battery.level < 0.2) {
                    this.optimizations.lowPowerMode = true;
                    this.optimizations.reducedAnimations = true;
                    console.log('🔋 Low battery detected - enabling power saving');
                }
                
                // Listen for battery changes
                battery.addEventListener('levelchange', () => {
                    this.metrics.batteryLevel = battery.level * 100;
                    if (battery.level < 0.2 && !this.optimizations.lowPowerMode) {
                        this.enableLowPowerMode();
                    }
                });
                
            } catch (error) {
                console.log('Battery API not available');
            }
        }
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MOBILE OPTIMIZATIONS
    // ═══════════════════════════════════════════════════════════════════════════
    
    applyMobileOptimizations() {
        console.log('⚡ Applying mobile optimizations...');
        
        // Viewport meta tag
        this.ensureViewportMeta();
        
        // Touch-friendly UI
        this.enhanceTouchControls();
        
        // Reduce animations on mobile
        if (this.optimizations.reducedAnimations) {
            this.reduceAnimations();
        }
        
        // Simplify UI for small screens
        if (this.deviceInfo.screenWidth < 768) {
            this.simplifyUI();
        }
        
        // Lazy load images
        if (this.optimizations.lazyLoading) {
            this.enableLazyLoading();
        }
        
        // Optimize 3D rendering
        this.optimize3DRendering();
        
        console.log('✅ Mobile optimizations applied');
    },
    
    ensureViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    },
    
    enhanceTouchControls() {
        // Add touch-friendly styles
        const style = document.createElement('style');
        style.textContent = `
            /* Mobile-optimized touch controls */
            .mobile-optimized button,
            .mobile-optimized .btn,
            .mobile-optimized input[type="button"],
            .mobile-optimized input[type="submit"] {
                min-height: 44px !important;
                min-width: 44px !important;
                padding: 12px 20px !important;
                font-size: 16px !important;
                touch-action: manipulation;
            }
            
            .mobile-optimized input,
            .mobile-optimized textarea,
            .mobile-optimized select {
                min-height: 44px !important;
                font-size: 16px !important;
                padding: 10px !important;
            }
            
            /* Prevent zoom on input focus */
            @media screen and (max-width: 768px) {
                input, textarea, select {
                    font-size: 16px !important;
                }
            }
            
            /* Touch feedback */
            .mobile-optimized button:active,
            .mobile-optimized .btn:active {
                transform: scale(0.95);
                opacity: 0.8;
            }
            
            /* Increase spacing on mobile */
            .mobile-optimized .control-panel {
                padding: 15px !important;
                gap: 15px !important;
            }
            
            /* Larger joystick on mobile */
            .mobile-optimized .joystick-container {
                width: 150px !important;
                height: 150px !important;
            }
        `;
        document.head.appendChild(style);
        
        // Add mobile-optimized class to body
        document.body.classList.add('mobile-optimized');
    },
    
    reduceAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            /* Reduce animations for performance */
            * {
                animation-duration: 0.3s !important;
                transition-duration: 0.3s !important;
            }
            
            .reduced-motion {
                animation: none !important;
                transition: none !important;
            }
        `;
        document.head.appendChild(style);
    },
    
    simplifyUI() {
        console.log('🎨 Simplifying UI for mobile...');
        
        // Hide non-essential elements
        const hideSelectors = [
            '.desktop-only',
            '.advanced-controls',
            '.decorative-element'
        ];
        
        hideSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
            });
        });
        
        // Collapse sidebars by default
        document.querySelectorAll('.sidebar').forEach(sidebar => {
            sidebar.classList.add('collapsed');
        });
    },
    
    enableLazyLoading() {
        // Use Intersection Observer for lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },
    
    optimize3DRendering() {
        // Reduce 3D quality on mobile
        if (window.BABYLON && window.BABYLON.Engine) {
            console.log('⚙️ Optimizing 3D rendering for mobile...');
            
            // These settings would be applied to Babylon.js engine
            const mobileSettings = {
                hardwareScalingLevel: 2, // Reduce resolution
                antialias: false,
                alpha: false,
                stencil: false,
                depth: true,
                desynchronized: true
            };
            
            // Store settings for use when engine initializes
            window.mobileRenderSettings = mobileSettings;
        }
    },
    
    enableLowPowerMode() {
        console.log('🔋 Enabling low power mode...');
        
        this.optimizations.lowPowerMode = true;
        this.optimizations.reducedAnimations = true;
        
        // Reduce frame rate
        if (window.requestAnimationFrame) {
            const originalRAF = window.requestAnimationFrame;
            let lastFrame = 0;
            const targetFPS = 30;
            const interval = 1000 / targetFPS;
            
            window.requestAnimationFrame = function(callback) {
                return originalRAF(function(time) {
                    if (time - lastFrame >= interval) {
                        lastFrame = time;
                        callback(time);
                    }
                });
            };
        }
        
        // Disable non-essential features
        document.body.classList.add('low-power-mode');
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // MONITORING
    // ═══════════════════════════════════════════════════════════════════════════
    
    setupMonitoring() {
        // Monitor performance
        setInterval(() => {
            this.checkPerformance();
        }, 5000);
        
        // Monitor frame rate
        this.monitorFrameRate();
    },
    
    checkPerformance() {
        if (performance.memory) {
            this.metrics.memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
            
            // Warn if memory usage is high
            if (this.metrics.memoryUsage > 0.8) {
                console.warn('⚠️ High memory usage detected:', (this.metrics.memoryUsage * 100).toFixed(1) + '%');
            }
        }
    },
    
    monitorFrameRate() {
        let lastTime = performance.now();
        let frames = 0;
        
        const checkFPS = () => {
            const currentTime = performance.now();
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                this.metrics.frameRate = Math.round((frames * 1000) / (currentTime - lastTime));
                frames = 0;
                lastTime = currentTime;
                
                // Warn if FPS is low
                if (this.metrics.frameRate < 30) {
                    console.warn('⚠️ Low frame rate detected:', this.metrics.frameRate, 'fps');
                }
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // EVENT LISTENERS
    // ═══════════════════════════════════════════════════════════════════════════
    
    setupEventListeners() {
        // Orientation change
        window.addEventListener('orientationchange', () => {
            this.deviceInfo.orientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            console.log('📱 Orientation changed:', this.deviceInfo.orientation);
            this.handleOrientationChange();
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.deviceInfo.screenWidth = window.innerWidth;
            this.deviceInfo.screenHeight = window.innerHeight;
            this.handleResize();
        });
        
        // Network change
        if (navigator.connection) {
            navigator.connection.addEventListener('change', () => {
                this.detectNetwork();
            });
        }
        
        // Visibility change (for performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseNonEssentialFeatures();
            } else {
                this.resumeFeatures();
            }
        });
    },
    
    handleOrientationChange() {
        // Reapply optimizations after orientation change
        if (this.deviceInfo.isMobile) {
            this.applyMobileOptimizations();
        }
    },
    
    handleResize() {
        // Adjust UI based on new size
        if (this.deviceInfo.screenWidth < 768 && !this.optimizations.simplifiedUI) {
            this.simplifyUI();
        }
    },
    
    pauseNonEssentialFeatures() {
        console.log('⏸️ Pausing non-essential features (tab hidden)');
        // Pause animations, 3D rendering, etc.
        document.body.classList.add('paused');
    },
    
    resumeFeatures() {
        console.log('▶️ Resuming features (tab visible)');
        document.body.classList.remove('paused');
    },
    
    // ═══════════════════════════════════════════════════════════════════════════
    // PUBLIC API
    // ═══════════════════════════════════════════════════════════════════════════
    
    getStatus() {
        return {
            agent: this.agentName,
            version: this.version,
            initialized: this.initialized,
            deviceInfo: this.deviceInfo,
            optimizations: this.optimizations,
            metrics: this.metrics
        };
    },
    
    isMobile() {
        return this.deviceInfo.isMobile;
    },
    
    isTablet() {
        return this.deviceInfo.isTablet;
    },
    
    getOptimizationLevel() {
        if (this.optimizations.lowPowerMode) return 'maximum';
        if (this.optimizations.simplifiedUI) return 'high';
        if (this.deviceInfo.isMobile) return 'medium';
        return 'none';
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.MobileOptimizerAgent.init();
    });
} else {
    window.MobileOptimizerAgent.init();
}

console.log('📱 Mobile Optimizer Agent loaded');
