/**
 * GemBot Panel Manager - Draggable & Resizable Panels
 * Allows users to customize their layout and save preferences
 * 
 * © 2024-2025 Ryan Barbrick / Barbrick Design
 */

const GemBotPanelManager = {
    version: '1.0.0',
    initialized: false,
    
    // Default panel configurations
    defaultLayouts: {
        desktop: {
            leftPanel: { x: 10, y: 80, width: 260, height: 'auto', visible: true },
            centerPanel: { x: 280, y: 80, width: 'flex', height: 'auto', visible: true },
            rightPanel: { x: 'right', y: 80, width: 300, height: 'auto', visible: true }
        },
        mobile: {
            leftPanel: { x: 0, y: 60, width: '100%', height: 120, visible: true },
            centerPanel: { x: 0, y: 190, width: '100%', height: '35vh', visible: true },
            rightPanel: { x: 0, y: 'auto', width: '100%', height: '40vh', visible: true }
        }
    },
    
    // Current layout state
    currentLayout: {},
    
    // Active drag state
    dragState: {
        active: false,
        element: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    },
    
    // Resize state
    resizeState: {
        active: false,
        element: null,
        direction: null,
        startWidth: 0,
        startHeight: 0,
        startX: 0,
        startY: 0
    },
    
    // Panels registry
    panels: {},
    
    /**
     * Initialize the panel manager
     */
    init() {
        if (this.initialized) return;
        
        console.log('🎛️ GemBot Panel Manager initializing...');
        
        // Load saved layout
        this.loadLayout();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Make panels draggable
        this.setupDraggablePanels();
        
        this.initialized = true;
        console.log('✅ Panel Manager initialized');
    },
    
    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Mouse events for drag
        document.addEventListener('mousemove', (e) => this.handleDrag(e));
        document.addEventListener('mouseup', (e) => this.endDrag(e));
        
        // Touch events for mobile
        document.addEventListener('touchmove', (e) => this.handleDrag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.endDrag(e));
        
        // Resize events
        document.addEventListener('mousemove', (e) => this.handleResize(e));
        document.addEventListener('mouseup', (e) => this.endResize(e));
    },
    
    /**
     * Setup draggable panels
     */
    setupDraggablePanels() {
        // Find all panels that should be draggable
        const panelClasses = ['.left-panel', '.center-panel', '.right-panel', '.game-panel'];
        
        panelClasses.forEach(selector => {
            const panels = document.querySelectorAll(selector);
            panels.forEach(panel => {
                this.makeDraggable(panel);
                this.makeResizable(panel);
            });
        });
    },
    
    /**
     * Make an element draggable
     */
    makeDraggable(element) {
        if (!element || element.dataset.draggable === 'true') return;
        
        // Add drag handle
        const handle = document.createElement('div');
        handle.className = 'panel-drag-handle';
        handle.innerHTML = '⋮⋮';
        handle.title = 'Drag to move';
        
        // Style the handle
        Object.assign(handle.style, {
            position: 'absolute',
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'grab',
            padding: '2px 8px',
            background: 'rgba(102, 126, 234, 0.3)',
            borderRadius: '4px',
            fontSize: '10px',
            color: '#667eea',
            zIndex: '10',
            userSelect: 'none',
            letterSpacing: '2px'
        });
        
        // Insert handle at the beginning of the panel
        if (element.firstChild) {
            element.insertBefore(handle, element.firstChild);
        } else {
            element.appendChild(handle);
        }
        
        // Store original position
        const rect = element.getBoundingClientRect();
        element.dataset.originalX = rect.left;
        element.dataset.originalY = rect.top;
        element.dataset.draggable = 'true';
        
        // Add drag events
        handle.addEventListener('mousedown', (e) => this.startDrag(e, element));
        handle.addEventListener('touchstart', (e) => this.startDrag(e, element), { passive: false });
        
        // Register panel
        const panelId = element.id || element.className.split(' ')[0] + '_' + Math.random().toString(36).substr(2, 9);
        element.id = panelId;
        this.panels[panelId] = {
            element,
            handle,
            position: { x: rect.left, y: rect.top },
            size: { width: rect.width, height: rect.height }
        };
    },
    
    /**
     * Make an element resizable
     */
    makeResizable(element) {
        if (!element || element.dataset.resizable === 'true') return;
        
        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'panel-resize-handle';
        
        Object.assign(resizeHandle.style, {
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: '16px',
            height: '16px',
            cursor: 'nwse-resize',
            background: 'linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.5) 50%)',
            borderRadius: '0 0 8px 0',
            zIndex: '10'
        });
        
        element.appendChild(resizeHandle);
        element.dataset.resizable = 'true';
        
        // Add resize events
        resizeHandle.addEventListener('mousedown', (e) => this.startResize(e, element, 'se'));
        resizeHandle.addEventListener('touchstart', (e) => this.startResize(e, element, 'se'), { passive: false });
    },
    
    /**
     * Start dragging a panel
     */
    startDrag(e, element) {
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const rect = element.getBoundingClientRect();
        
        this.dragState = {
            active: true,
            element,
            startX: touch.clientX,
            startY: touch.clientY,
            offsetX: touch.clientX - rect.left,
            offsetY: touch.clientY - rect.top
        };
        
        // Make position absolute if not already
        if (getComputedStyle(element).position !== 'absolute' && getComputedStyle(element).position !== 'fixed') {
            element.style.position = 'absolute';
            element.style.left = rect.left + 'px';
            element.style.top = rect.top + 'px';
            element.style.width = rect.width + 'px';
        }
        
        element.style.zIndex = '1000';
        element.classList.add('panel-dragging');
        
        // Change cursor on handle
        const handle = element.querySelector('.panel-drag-handle');
        if (handle) handle.style.cursor = 'grabbing';
    },
    
    /**
     * Handle drag movement
     */
    handleDrag(e) {
        if (!this.dragState.active) return;
        
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const element = this.dragState.element;
        
        const newX = touch.clientX - this.dragState.offsetX;
        const newY = touch.clientY - this.dragState.offsetY;
        
        // Constrain to viewport
        const maxX = window.innerWidth - element.offsetWidth;
        const maxY = window.innerHeight - element.offsetHeight;
        
        element.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
        element.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
    },
    
    /**
     * End dragging
     */
    endDrag(e) {
        if (!this.dragState.active) return;
        
        const element = this.dragState.element;
        element.style.zIndex = '';
        element.classList.remove('panel-dragging');
        
        // Change cursor back
        const handle = element.querySelector('.panel-drag-handle');
        if (handle) handle.style.cursor = 'grab';
        
        // Save position
        if (this.panels[element.id]) {
            this.panels[element.id].position = {
                x: parseInt(element.style.left) || 0,
                y: parseInt(element.style.top) || 0
            };
        }
        
        this.dragState.active = false;
        this.saveLayout();
    },
    
    /**
     * Start resizing a panel
     */
    startResize(e, element, direction) {
        e.preventDefault();
        e.stopPropagation();
        
        const touch = e.touches ? e.touches[0] : e;
        const rect = element.getBoundingClientRect();
        
        this.resizeState = {
            active: true,
            element,
            direction,
            startWidth: rect.width,
            startHeight: rect.height,
            startX: touch.clientX,
            startY: touch.clientY
        };
        
        element.classList.add('panel-resizing');
    },
    
    /**
     * Handle resize movement
     */
    handleResize(e) {
        if (!this.resizeState.active) return;
        
        e.preventDefault();
        
        const touch = e.touches ? e.touches[0] : e;
        const element = this.resizeState.element;
        
        const deltaX = touch.clientX - this.resizeState.startX;
        const deltaY = touch.clientY - this.resizeState.startY;
        
        // Minimum sizes
        const minWidth = 150;
        const minHeight = 100;
        
        const newWidth = Math.max(minWidth, this.resizeState.startWidth + deltaX);
        const newHeight = Math.max(minHeight, this.resizeState.startHeight + deltaY);
        
        element.style.width = newWidth + 'px';
        element.style.height = newHeight + 'px';
    },
    
    /**
     * End resizing
     */
    endResize(e) {
        if (!this.resizeState.active) return;
        
        const element = this.resizeState.element;
        element.classList.remove('panel-resizing');
        
        // Save size
        if (this.panels[element.id]) {
            this.panels[element.id].size = {
                width: parseInt(element.style.width) || element.offsetWidth,
                height: parseInt(element.style.height) || element.offsetHeight
            };
        }
        
        this.resizeState.active = false;
        this.saveLayout();
    },
    
    /**
     * Save current layout to localStorage
     */
    saveLayout() {
        const layout = {};
        
        Object.entries(this.panels).forEach(([id, panel]) => {
            layout[id] = {
                position: panel.position,
                size: panel.size
            };
        });
        
        try {
            localStorage.setItem('gembot_panel_layout', JSON.stringify(layout));
            console.log('💾 Layout saved');
        } catch (e) {
            console.warn('Could not save layout:', e);
        }
    },
    
    /**
     * Load layout from localStorage
     */
    loadLayout() {
        try {
            const saved = localStorage.getItem('gembot_panel_layout');
            if (saved) {
                this.currentLayout = JSON.parse(saved);
                console.log('📂 Layout loaded');
            }
        } catch (e) {
            console.warn('Could not load layout:', e);
            this.currentLayout = {};
        }
    },
    
    /**
     * Apply saved layout to panels
     */
    applyLayout() {
        Object.entries(this.currentLayout).forEach(([id, config]) => {
            const element = document.getElementById(id);
            if (!element) return;
            
            if (config.position) {
                element.style.position = 'absolute';
                element.style.left = config.position.x + 'px';
                element.style.top = config.position.y + 'px';
            }
            
            if (config.size) {
                element.style.width = config.size.width + 'px';
                if (config.size.height !== 'auto') {
                    element.style.height = config.size.height + 'px';
                }
            }
        });
    },
    
    /**
     * Reset layout to default
     */
    resetLayout() {
        try {
            localStorage.removeItem('gembot_panel_layout');
            window.location.reload();
        } catch (e) {
            console.warn('Could not reset layout:', e);
        }
    },
    
    /**
     * Toggle panel visibility
     */
    togglePanel(panelId) {
        const panel = this.panels[panelId];
        if (!panel) return;
        
        const element = panel.element;
        const isHidden = element.style.display === 'none';
        
        element.style.display = isHidden ? '' : 'none';
        this.saveLayout();
    }
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GemBotPanelManager.init());
} else {
    // Small delay to ensure all panels are rendered
    setTimeout(() => GemBotPanelManager.init(), 500);
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GemBotPanelManager;
}

window.GemBotPanelManager = GemBotPanelManager;
