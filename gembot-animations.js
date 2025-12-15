/**
 * GemBot Animation Utility System
 * Integrates Animate.css for enhanced UI/UX
 * © 2024-2025 Ryan Barbrick / Barbrick Design
 */

const GemBotAnimations = {
    // Animation presets for different contexts
    presets: {
        // Merlin AI interactions
        merlin: {
            appear: 'animate__fadeInUp',
            disappear: 'animate__fadeOutDown',
            speak: 'animate__pulse',
            think: 'animate__headShake',
            alert: 'animate__tada',
            error: 'animate__shakeX'
        },
        
        // UI panels and modals
        panels: {
            open: 'animate__fadeInUp',
            close: 'animate__fadeOutDown',
            expand: 'animate__zoomIn',
            collapse: 'animate__zoomOut',
            slide: 'animate__slideInRight'
        },
        
        // Game elements
        game: {
            gemAppear: 'animate__bounceIn',
            gemCollect: 'animate__bounceOut',
            levelUp: 'animate__bounceIn',
            achievement: 'animate__tada',
            powerUp: 'animate__flash',
            damage: 'animate__shakeX',
            heal: 'animate__pulse'
        },
        
        // Notifications
        notifications: {
            info: 'animate__fadeInRight',
            success: 'animate__bounceInRight',
            warning: 'animate__headShake',
            error: 'animate__shakeX',
            dismiss: 'animate__fadeOutRight'
        },
        
        // Machine status
        machine: {
            connect: 'animate__bounceIn',
            disconnect: 'animate__fadeOut',
            working: 'animate__pulse',
            complete: 'animate__tada',
            error: 'animate__shakeX'
        },
        
        // Academy elements
        academy: {
            taskComplete: 'animate__bounceIn',
            levelUp: 'animate__tada',
            unlock: 'animate__flipInX',
            reward: 'animate__bounceIn',
            streak: 'animate__flash'
        }
    },
    
    // Default animation settings
    defaultSpeed: 'animate__faster', // or animate__fast, animate__slow, animate__slower
    defaultDelay: '', // e.g., animate__delay-1s, animate__delay-2s, etc.
    defaultRepeat: '', // e.g., animate__repeat-1, animate__repeat-2, animate__infinite
    
    /**
     * Apply animation to an element
     * @param {HTMLElement|string} element - Element or selector
     * @param {string} animation - Animation name from presets or custom
     * @param {Object} options - Animation options
     */
    animate(element, animation, options = {}) {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (!el) {
            console.warn('Animation target not found:', element);
            return Promise.reject('Element not found');
        }
        
        return new Promise((resolve) => {
            const {
                speed = this.defaultSpeed,
                delay = this.defaultDelay,
                repeat = this.defaultRepeat,
                callback = null,
                removeAfter = false
            } = options;
            
            // Build class list
            const classes = [
                'animate__animated',
                animation,
                speed,
                delay,
                repeat
            ].filter(c => c);
            
            // Add classes
            el.classList.add(...classes);
            
            // Handle animation end
            const handleAnimationEnd = (event) => {
                event.stopPropagation();
                el.classList.remove(...classes);
                
                if (removeAfter) {
                    el.remove();
                }
                
                if (callback) {
                    callback();
                }
                
                resolve(el);
            };
            
            el.addEventListener('animationend', handleAnimationEnd, { once: true });
        });
    },
    
    /**
     * Animate Merlin AI interactions
     */
    merlin: {
        appear(element = '.ai-avatar') {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.merlin.appear, {
                speed: 'animate__fast'
            });
        },
        
        speak(element = '.ai-avatar') {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.merlin.speak, {
                speed: 'animate__fast'
            });
        },
        
        think(element = '.ai-avatar') {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.merlin.think, {
                speed: 'animate__slow'
            });
        },
        
        alert(element = '.ai-avatar') {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.merlin.alert);
        },
        
        celebrate() {
            const avatar = document.querySelector('.ai-avatar');
            if (avatar) {
                GemBotAnimations.animate(avatar, 'animate__tada');
                GemBotAnimations.animate(avatar, 'animate__heartBeat', { delay: 'animate__delay-1s' });
            }
        }
    },
    
    /**
     * Animate chat messages
     */
    message: {
        add(messageElement) {
            return GemBotAnimations.animate(messageElement, 'animate__fadeInUp', {
                speed: 'animate__faster'
            });
        },
        
        typing(indicatorElement) {
            return GemBotAnimations.animate(indicatorElement, 'animate__pulse', {
                repeat: 'animate__infinite'
            });
        },
        
        stopTyping(indicatorElement) {
            if (indicatorElement) {
                indicatorElement.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
            }
        }
    },
    
    /**
     * Animate panels and modals
     */
    panel: {
        open(panelElement) {
            return GemBotAnimations.animate(panelElement, GemBotAnimations.presets.panels.open, {
                speed: 'animate__fast'
            });
        },
        
        close(panelElement, remove = false) {
            return GemBotAnimations.animate(panelElement, GemBotAnimations.presets.panels.close, {
                speed: 'animate__fast',
                removeAfter: remove
            });
        },
        
        expand(panelElement) {
            return GemBotAnimations.animate(panelElement, GemBotAnimations.presets.panels.expand);
        },
        
        collapse(panelElement) {
            return GemBotAnimations.animate(panelElement, GemBotAnimations.presets.panels.collapse);
        }
    },
    
    /**
     * Animate game elements
     */
    game: {
        gemAppear(gemElement) {
            return GemBotAnimations.animate(gemElement, GemBotAnimations.presets.game.gemAppear);
        },
        
        gemCollect(gemElement) {
            return GemBotAnimations.animate(gemElement, GemBotAnimations.presets.game.gemCollect, {
                removeAfter: true
            });
        },
        
        levelUp(element) {
            GemBotAnimations.animate(element, 'animate__tada');
            setTimeout(() => {
                GemBotAnimations.animate(element, 'animate__pulse');
            }, 500);
        },
        
        achievement(element) {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.game.achievement);
        },
        
        powerUp(element) {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.game.powerUp, {
                repeat: 'animate__repeat-2'
            });
        },
        
        damage(element) {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.game.damage);
        }
    },
    
    /**
     * Animate notifications
     */
    notification: {
        show(notificationElement, type = 'info') {
            const animation = GemBotAnimations.presets.notifications[type] || 
                            GemBotAnimations.presets.notifications.info;
            return GemBotAnimations.animate(notificationElement, animation);
        },
        
        dismiss(notificationElement) {
            return GemBotAnimations.animate(
                notificationElement, 
                GemBotAnimations.presets.notifications.dismiss,
                { removeAfter: true }
            );
        },
        
        success(message) {
            return this.createAndShow(message, 'success');
        },
        
        error(message) {
            return this.createAndShow(message, 'error');
        },
        
        warning(message) {
            return this.createAndShow(message, 'warning');
        },
        
        info(message) {
            return this.createAndShow(message, 'info');
        },
        
        createAndShow(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `gembot-notification gembot-notification-${type}`;
            notification.textContent = message;
            
            const container = document.getElementById('notificationContainer') || 
                            this.createNotificationContainer();
            container.appendChild(notification);
            
            this.show(notification, type);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                this.dismiss(notification);
            }, 5000);
            
            return notification;
        },
        
        createNotificationContainer() {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(container);
            return container;
        }
    },
    
    /**
     * Animate machine status changes
     */
    machine: {
        connect(statusElement) {
            return GemBotAnimations.animate(statusElement, GemBotAnimations.presets.machine.connect);
        },
        
        disconnect(statusElement) {
            return GemBotAnimations.animate(statusElement, GemBotAnimations.presets.machine.disconnect);
        },
        
        working(statusElement) {
            return GemBotAnimations.animate(statusElement, GemBotAnimations.presets.machine.working, {
                repeat: 'animate__infinite'
            });
        },
        
        stopWorking(statusElement) {
            if (statusElement) {
                statusElement.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
            }
        },
        
        complete(statusElement) {
            return GemBotAnimations.animate(statusElement, GemBotAnimations.presets.machine.complete);
        },
        
        error(statusElement) {
            return GemBotAnimations.animate(statusElement, GemBotAnimations.presets.machine.error);
        }
    },
    
    /**
     * Animate Academy elements
     */
    academy: {
        taskComplete(taskElement) {
            return GemBotAnimations.animate(taskElement, GemBotAnimations.presets.academy.taskComplete);
        },
        
        levelUp(levelElement) {
            return GemBotAnimations.animate(levelElement, GemBotAnimations.presets.academy.levelUp);
        },
        
        unlock(element) {
            return GemBotAnimations.animate(element, GemBotAnimations.presets.academy.unlock);
        },
        
        reward(rewardElement) {
            return GemBotAnimations.animate(rewardElement, GemBotAnimations.presets.academy.reward);
        },
        
        streak(streakElement) {
            return GemBotAnimations.animate(streakElement, GemBotAnimations.presets.academy.streak, {
                repeat: 'animate__repeat-2'
            });
        }
    },
    
    /**
     * Button click animations
     */
    button: {
        click(buttonElement) {
            return GemBotAnimations.animate(buttonElement, 'animate__pulse', {
                speed: 'animate__faster'
            });
        },
        
        success(buttonElement) {
            return GemBotAnimations.animate(buttonElement, 'animate__bounceIn', {
                speed: 'animate__fast'
            });
        },
        
        error(buttonElement) {
            return GemBotAnimations.animate(buttonElement, 'animate__shakeX', {
                speed: 'animate__fast'
            });
        }
    },
    
    /**
     * List item animations
     */
    list: {
        add(itemElement, index = 0) {
            return GemBotAnimations.animate(itemElement, 'animate__fadeInUp', {
                speed: 'animate__faster',
                delay: index > 0 ? `animate__delay-${Math.min(index, 5)}s` : ''
            });
        },
        
        remove(itemElement) {
            return GemBotAnimations.animate(itemElement, 'animate__fadeOutRight', {
                speed: 'animate__fast',
                removeAfter: true
            });
        },
        
        stagger(containerSelector, itemSelector) {
            const container = document.querySelector(containerSelector);
            if (!container) return;
            
            const items = container.querySelectorAll(itemSelector);
            items.forEach((item, index) => {
                this.add(item, index * 0.1);
            });
        }
    },
    
    /**
     * Attention seekers for important elements
     */
    attention: {
        bounce(element) {
            return GemBotAnimations.animate(element, 'animate__bounce');
        },
        
        flash(element) {
            return GemBotAnimations.animate(element, 'animate__flash');
        },
        
        pulse(element) {
            return GemBotAnimations.animate(element, 'animate__pulse');
        },
        
        rubberBand(element) {
            return GemBotAnimations.animate(element, 'animate__rubberBand');
        },
        
        shake(element) {
            return GemBotAnimations.animate(element, 'animate__shakeX');
        },
        
        swing(element) {
            return GemBotAnimations.animate(element, 'animate__swing');
        },
        
        tada(element) {
            return GemBotAnimations.animate(element, 'animate__tada');
        },
        
        wobble(element) {
            return GemBotAnimations.animate(element, 'animate__wobble');
        },
        
        jello(element) {
            return GemBotAnimations.animate(element, 'animate__jello');
        },
        
        heartBeat(element) {
            return GemBotAnimations.animate(element, 'animate__heartBeat');
        }
    },
    
    /**
     * Utility functions
     */
    utils: {
        /**
         * Remove all animation classes from an element
         */
        clear(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (el) {
                const animateClasses = Array.from(el.classList).filter(c => c.startsWith('animate__'));
                el.classList.remove(...animateClasses);
            }
        },
        
        /**
         * Check if element is currently animating
         */
        isAnimating(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            return el ? el.classList.contains('animate__animated') : false;
        },
        
        /**
         * Wait for animation to complete
         */
        waitForAnimation(element) {
            const el = typeof element === 'string' ? document.querySelector(element) : element;
            if (!el) return Promise.resolve();
            
            return new Promise(resolve => {
                el.addEventListener('animationend', () => resolve(el), { once: true });
            });
        }
    }
};

// Auto-enhance existing elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎬 GemBot Animation System initialized');
    
    // Animate initial UI elements
    setTimeout(() => {
        // Animate chat messages
        const messages = document.querySelectorAll('.chat-message');
        messages.forEach((msg, i) => {
            if (i < 3) { // Only animate first 3 messages
                GemBotAnimations.message.add(msg);
            }
        });
        
        // Animate avatar
        const avatar = document.querySelector('.ai-avatar');
        if (avatar) {
            GemBotAnimations.merlin.appear(avatar);
        }
    }, 100);
});

// Export for global use
if (typeof window !== 'undefined') {
    window.GemBotAnimations = GemBotAnimations;
}
