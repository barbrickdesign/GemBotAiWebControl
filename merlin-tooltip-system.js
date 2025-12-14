/**
 * 🧙‍♂️ Merlin Tooltip System - Interactive Help Overlay
 * 
 * Provides hover tooltips on machines with:
 * - Current status and stage information
 * - Merlin's contextual advice
 * - Action needed indicators
 * - Time estimates
 * 
 * @version 1.0.0
 * @date December 13, 2025
 */

class MerlinTooltipSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.activeTooltips = new Map();
        this.tooltipContainer = null;
        
        // Tooltip configuration
        this.config = {
            showDelay: 500, // ms delay before showing
            hideDelay: 200, // ms delay before hiding
            maxWidth: 350,
            offset: { x: 10, y: -60 }
        };
        
        // Create UI container
        this.initializeTooltipContainer();
        
        console.log('📋 Merlin Tooltip System initialized');
    }
    
    /**
     * Initialize tooltip container in DOM
     */
    initializeTooltipContainer() {
        // Check if container already exists
        if (document.getElementById('merlin-tooltip-container')) {
            this.tooltipContainer = document.getElementById('merlin-tooltip-container');
            return;
        }
        
        const container = document.createElement('div');
        container.id = 'merlin-tooltip-container';
        container.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 10000;
            font-family: 'Courier New', monospace;
        `;
        
        document.body.appendChild(container);
        this.tooltipContainer = container;
    }
    
    /**
     * Create machine tooltip on hover
     * @param {Object} machine - The machine object
     * @param {Object} position - Mouse position {x, y}
     */
    createMachineTooltip(machine, position) {
        const status = this.analyzeMachineStatus(machine);
        const advice = this.getContextualAdvice(machine);
        const action = this.getRequiredAction(machine);
        const timeEstimate = this.calculateTimeRemaining(machine);
        
        return {
            type: 'machine_status',
            position: position,
            content: {
                status: status,
                merlinAdvice: advice,
                actionNeeded: action,
                timeEstimate: timeEstimate
            },
            style: action ? 'warning_tooltip' : 'info_tooltip'
        };
    }
    
    /**
     * Analyze machine status for tooltip
     */
    analyzeMachineStatus(machine) {
        const stone = machine.currentStone;
        
        if (!stone) {
            return {
                state: 'idle',
                message: 'Machine idle - ready for rough',
                color: '#00ff00'
            };
        }
        
        if (stone.awaitingInteraction) {
            return {
                state: 'awaiting_interaction',
                message: `⚠️ ${stone.interactionType || 'Human interaction needed'}`,
                color: '#ffaa00'
            };
        }
        
        const stage = this.game.cuttingStages[stone.currentStage];
        const stageTime = this.game.calculateStageTime(stone, stage, this.game.machineTypes[machine.type]);
        const progress = Math.min(100, (stone.stageProgress / stageTime) * 100);
        
        return {
            state: 'cutting',
            message: `${stage.name} (${Math.round(progress)}%)`,
            stageName: stage.name,
            progress: progress,
            gem: stone.gem.name,
            quality: stone.qualityScore,
            color: '#00aaff'
        };
    }
    
    /**
     * Get Merlin's contextual advice for machine
     */
    getContextualAdvice(machine) {
        const stone = machine.currentStone;
        if (!stone) {
            return "Click to start a new stone! Check your rough inventory first.";
        }
        
        const stage = this.game.cuttingStages[stone.currentStage];
        
        // Interaction-specific advice
        if (stone.awaitingInteraction) {
            return this.explainInteraction(stone);
        }
        
        // Stage-specific tips from audit document
        const tips = {
            'prep_rough': "Examine the rough carefully. Look for inclusions, color zones, and the best cutting axis.",
            'dop_stone': "Warm the wax slowly. A cold dop means a flying stone!",
            'mount_chuck': "Check alignment carefully - precision here saves headaches later.",
            'preform_girdle': "Fast cutting now - we're removing bulk material to define the outline.",
            'preform_pavilion': "Shaping the pavilion point. This determines final proportions.",
            'cut_pavilion_600': "600 grit cuts fast. Watch your angles closely at each index position.",
            'cut_pavilion_800': "Removing the 600 grit scratches. Facets becoming cleaner.",
            'cut_pavilion_1200': "Pre-polish stage. Almost ready for diamond paste!",
            'polish_pavilion_8k': "Beginning polish sequence. The stone starts to shine here.",
            'polish_pavilion_14k': "Brilliance emerging! Continue the polish progression.",
            'polish_pavilion_50k': "High polish - any contamination now will show!",
            'polish_pavilion_100k': "Near-mirror finish. Keep everything pristine.",
            'polish_pavilion_200k': "Final mirror polish - perfection is near!",
            'transfer_dop': "THIS IS IT! The most dangerous moment. Heat evenly, support everything, align precisely.",
            'preform_crown': "Crown shaping at ~42°. This affects the stone's fire and brilliance.",
            'cut_table': "The table must be perfectly flat and parallel to the girdle.",
            'cut_crown_600': "Crown facets determine how light returns to the eye. Critical stage!",
            'polish_crown_200k': "Final mirror polish - we're almost there! Steady hands.",
            'final_remove': "Heat the dop slowly to soften wax. No force - patience wins!",
            'clean_inspect': "Time to grade your work. Quality check determines value."
        };
        
        return tips[stone.currentStage] || `Cutting ${stage.name}... patience and precision!`;
    }
    
    /**
     * Explain required interaction
     */
    explainInteraction(stone) {
        const explanations = {
            'start_prep': "Examine the rough carefully. Look for inclusions, best axis, and plan your cut.",
            'complete_dop': "Check wax temperature - should be warm, not hot. Center stone and let cool slowly.",
            'mount_chuck': "Insert dop firmly. Verify it's straight and secure.",
            'transfer': "THE BIG MOMENT: Heat both dops evenly, align perfectly, support stone, release old dop.",
            'change_lap': "Time to swap laps. Clean the machine thoroughly before installing new lap.",
            'refill_water': "Water tank low! Refill now to maintain cooling.",
            'charge_paste': "Copper lap needs paste charged. Clean first, apply paste evenly.",
            'final_remove': "Heat dop gently to melt wax. Support stone, don't force it!"
        };
        
        return explanations[stone.interactionType] || "Click when ready to proceed.";
    }
    
    /**
     * Get required action for machine
     */
    getRequiredAction(machine) {
        const stone = machine.currentStone;
        
        if (!stone) return null;
        
        if (stone.awaitingInteraction) {
            return {
                type: stone.interactionType,
                description: `Click to ${stone.interactionType.replace(/_/g, ' ')}`,
                urgent: ['transfer', 'refill_water'].includes(stone.interactionType)
            };
        }
        
        // Check for warnings
        if (this.game.state.inventory.consumables.water < 15) {
            return {
                type: 'water_critical',
                description: 'Water tank critical! Refill immediately!',
                urgent: true
            };
        }
        
        if (machine.condition < 30) {
            return {
                type: 'maintenance',
                description: 'Machine needs maintenance',
                urgent: false
            };
        }
        
        return null;
    }
    
    /**
     * Calculate time remaining for current stage
     */
    calculateTimeRemaining(machine) {
        const stone = machine.currentStone;
        if (!stone || stone.awaitingInteraction) return null;
        
        const stage = this.game.cuttingStages[stone.currentStage];
        const machineType = this.game.machineTypes[machine.type];
        const stageTime = this.game.calculateStageTime(stone, stage, machineType);
        const remaining = stageTime - stone.stageProgress;
        
        // Convert from game seconds to real seconds
        const realSeconds = remaining / this.game.config.timeAcceleration;
        
        return {
            gameSeconds: remaining,
            realSeconds: realSeconds,
            display: this.formatTime(realSeconds)
        };
    }
    
    /**
     * Format time for display
     */
    formatTime(seconds) {
        if (seconds < 60) {
            return `${Math.ceil(seconds)}s`;
        } else if (seconds < 3600) {
            return `${Math.ceil(seconds / 60)}m`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const mins = Math.ceil((seconds % 3600) / 60);
            return `${hours}h ${mins}m`;
        }
    }
    
    /**
     * Show tooltip at position
     */
    showTooltip(tooltipId, machine, mouseX, mouseY) {
        // Create tooltip data
        const tooltipData = this.createMachineTooltip(machine, { x: mouseX, y: mouseY });
        
        // Remove existing tooltip for this machine
        this.hideTooltip(tooltipId);
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.id = `tooltip-${tooltipId}`;
        tooltip.className = 'merlin-tooltip';
        tooltip.style.cssText = `
            position: fixed;
            left: ${mouseX + this.config.offset.x}px;
            top: ${mouseY + this.config.offset.y}px;
            max-width: ${this.config.maxWidth}px;
            background: linear-gradient(135deg, rgba(0, 30, 50, 0.95), rgba(10, 10, 30, 0.95));
            border: 2px solid ${tooltipData.content.status.color};
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            color: #ffffff;
            font-size: 12px;
            line-height: 1.4;
            z-index: 10001;
            animation: tooltipFadeIn 0.2s ease-out;
        `;
        
        // Build tooltip content
        tooltip.innerHTML = this.buildTooltipHTML(tooltipData);
        
        // Add to container
        this.tooltipContainer.appendChild(tooltip);
        this.activeTooltips.set(tooltipId, tooltip);
    }
    
    /**
     * Build tooltip HTML content
     */
    buildTooltipHTML(tooltipData) {
        const { status, merlinAdvice, actionNeeded, timeEstimate } = tooltipData.content;
        
        let html = `
            <div style="border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 8px; margin-bottom: 8px;">
                <div style="color: ${status.color}; font-weight: bold; font-size: 14px;">
                    ${status.message}
                </div>
        `;
        
        if (status.gem) {
            html += `
                <div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">
                    💎 ${status.gem} | Quality: ${Math.round(status.quality)}%
                </div>
            `;
        }
        
        if (timeEstimate) {
            html += `
                <div style="margin-top: 4px; font-size: 11px; opacity: 0.8;">
                    ⏱️ ~${timeEstimate.display} remaining
                </div>
            `;
        }
        
        html += `</div>`;
        
        // Merlin's advice
        html += `
            <div style="padding: 8px; background: rgba(0, 255, 255, 0.05); border-left: 3px solid #00ffff; margin-bottom: 8px; border-radius: 4px;">
                <div style="color: #00ffff; font-size: 10px; font-weight: bold; margin-bottom: 4px;">
                    🧙 MERLIN'S ADVICE:
                </div>
                <div style="font-size: 11px;">
                    ${merlinAdvice}
                </div>
            </div>
        `;
        
        // Action needed
        if (actionNeeded) {
            const urgentStyle = actionNeeded.urgent ? 
                'background: rgba(255, 100, 0, 0.2); border-color: #ff6600;' : 
                'background: rgba(255, 200, 0, 0.1); border-color: #ffaa00;';
            
            html += `
                <div style="padding: 8px; ${urgentStyle} border-left: 3px solid; margin-top: 8px; border-radius: 4px;">
                    <div style="color: ${actionNeeded.urgent ? '#ff6600' : '#ffaa00'}; font-weight: bold; font-size: 11px;">
                        ${actionNeeded.urgent ? '⚠️ URGENT: ' : '⚡ ACTION: '}${actionNeeded.description}
                    </div>
                </div>
            `;
        }
        
        return html;
    }
    
    /**
     * Hide tooltip
     */
    hideTooltip(tooltipId) {
        const tooltip = this.activeTooltips.get(tooltipId);
        if (tooltip) {
            tooltip.style.animation = 'tooltipFadeOut 0.15s ease-out';
            setTimeout(() => {
                tooltip.remove();
                this.activeTooltips.delete(tooltipId);
            }, 150);
        }
    }
    
    /**
     * Hide all tooltips
     */
    hideAllTooltips() {
        this.activeTooltips.forEach((tooltip, id) => {
            this.hideTooltip(id);
        });
    }
    
    /**
     * Update tooltip position (for mouse movement)
     */
    updateTooltipPosition(tooltipId, mouseX, mouseY) {
        const tooltip = this.activeTooltips.get(tooltipId);
        if (tooltip) {
            tooltip.style.left = `${mouseX + this.config.offset.x}px`;
            tooltip.style.top = `${mouseY + this.config.offset.y}px`;
        }
    }
    
    /**
     * Create stage explanation popup (triggered on stage transitions)
     */
    showStageGuide(machine, stageName) {
        const stage = this.game.cuttingStages[stageName];
        if (!stage) return;
        
        const popup = document.createElement('div');
        popup.className = 'merlin-stage-guide';
        popup.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: linear-gradient(135deg, rgba(10, 10, 40, 0.98), rgba(20, 10, 50, 0.98));
            border: 3px solid #00ffff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.8);
            color: #ffffff;
            z-index: 10002;
            animation: popupSlideIn 0.3s ease-out;
        `;
        
        popup.innerHTML = `
            <div style="text-align: center; margin-bottom: 16px;">
                <div style="font-size: 24px; color: #00ffff;">🧙</div>
                <div style="font-size: 18px; font-weight: bold; color: #00ffff; margin-top: 8px;">
                    MERLIN'S STAGE GUIDE
                </div>
            </div>
            
            <div style="border-bottom: 2px solid rgba(0, 255, 255, 0.3); padding-bottom: 12px; margin-bottom: 12px;">
                <div style="font-size: 16px; font-weight: bold; color: #ffaa00;">
                    Entering: ${stage.name}
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <div style="color: #00ffff; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
                    WHAT'S HAPPENING:
                </div>
                <div style="font-size: 13px; line-height: 1.5;">
                    ${stage.description}
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <div style="color: #ffaa00; font-size: 12px; font-weight: bold; margin-bottom: 8px;">
                    WATCH FOR:
                </div>
                <div style="font-size: 12px; line-height: 1.5;">
                    ${this.getStageWarnings(stageName)}
                </div>
            </div>
            
            <button id="stage-guide-ok" style="
                width: 100%;
                padding: 12px;
                background: linear-gradient(135deg, #00aaff, #0088cc);
                border: none;
                border-radius: 6px;
                color: white;
                font-weight: bold;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            " onmouseover="this.style.background='linear-gradient(135deg, #00ccff, #00aaee)'" onmouseout="this.style.background='linear-gradient(135deg, #00aaff, #0088cc)'">
                Got it!
            </button>
        `;
        
        document.body.appendChild(popup);
        
        // Close button handler
        document.getElementById('stage-guide-ok').addEventListener('click', () => {
            popup.style.animation = 'popupSlideOut 0.2s ease-out';
            setTimeout(() => popup.remove(), 200);
        });
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(popup)) {
                popup.style.animation = 'popupSlideOut 0.2s ease-out';
                setTimeout(() => popup.remove(), 200);
            }
        }, 10000);
    }
    
    /**
     * Get stage-specific warnings
     */
    getStageWarnings(stageName) {
        const warnings = {
            'dop_stone': '• Wax temperature (warm, not hot)<br>• Clean stone surface<br>• Allow cooling time',
            'transfer_dop': '• Heat both dops evenly<br>• Perfect alignment critical<br>• Support stone at all times',
            'polish_pavilion_50k': '• Paste contamination (fatal!)<br>• Adequate water flow<br>• Clean lap surface',
            'polish_crown_200k': '• Final polish - no second chances<br>• Any scratch will show<br>• Maintain steady pressure',
            'final_remove': '• Slow heat application<br>• No force on stone<br>• Patience prevents chips'
        };
        
        return warnings[stageName] || '• Monitor progress<br>• Check water level<br>• Watch for issues';
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes tooltipFadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes tooltipFadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    @keyframes popupSlideIn {
        from {
            opacity: 0;
            transform: translate(-50%, -45%);
        }
        to {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
    }
    
    @keyframes popupSlideOut {
        from {
            opacity: 1;
            transform: translate(-50%, -50%);
        }
        to {
            opacity: 0;
            transform: translate(-50%, -55%);
        }
    }
`;
document.head.appendChild(style);

// Export for global access
if (typeof window !== 'undefined') {
    window.MerlinTooltipSystem = MerlinTooltipSystem;
}

console.log('📋 Merlin Tooltip System loaded - hover help ready!');
