/**
 * GemBot Sync UI Panel
 * Displays sync status, connected devices, and video feeds
 */

class GemBotSyncUI {
    constructor() {
        this.panel = null;
        this.init();
    }
    
    init() {
        console.log('🎨 GemBot Sync UI initializing...');
        this.createPanel();
        this.attachListeners();
    }
    
    createPanel() {
        // Create panel container
        const panel = document.createElement('div');
        panel.id = 'gembot-sync-panel';
        panel.className = 'sync-panel';
        panel.style.cssText = `
            background: #0f1629;
            border: 1px solid #2d3561;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 8px;
            font-size: 12px;
            color: #e0e6ed;
        `;
        
        // Header
        const header = document.createElement('div');
        header.className = 'sync-header';
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #2d3561;
        `;
        
        const title = document.createElement('h3');
        title.textContent = '🔗 Device Sync';
        title.style.cssText = 'margin: 0; color: #4a9eff; font-size: 13px; font-weight: bold;';
        
        const status = document.createElement('span');
        status.id = 'sync-status';
        status.className = 'status-badge';
        status.textContent = '⚪ Connecting...';
        status.style.cssText = `
            padding: 4px 8px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 4px;
            font-size: 11px;
        `;
        
        header.appendChild(title);
        header.appendChild(status);
        
        // Devices list
        const devicesContainer = document.createElement('div');
        devicesContainer.className = 'sync-devices';
        devicesContainer.style.cssText = `
            margin-bottom: 8px;
            max-height: 120px;
            overflow-y: auto;
        `;
        
        const devicesTitle = document.createElement('div');
        devicesTitle.textContent = 'Connected Devices:';
        devicesTitle.style.cssText = 'font-weight: bold; color: #4a9eff; margin-bottom: 4px; font-size: 11px;';
        devicesContainer.appendChild(devicesTitle);
        
        const devicesList = document.createElement('div');
        devicesList.id = 'devices-list';
        devicesList.style.cssText = 'display: flex; flex-direction: column; gap: 4px;';
        devicesContainer.appendChild(devicesList);
        
        // Hardware status
        const hardwareContainer = document.createElement('div');
        hardwareContainer.className = 'sync-hardware';
        hardwareContainer.style.cssText = `
            margin-bottom: 8px;
            padding: 6px;
            background: rgba(74, 158, 255, 0.1);
            border-left: 3px solid #4a9eff;
            border-radius: 3px;
        `;
        
        const hardwareTitle = document.createElement('div');
        hardwareTitle.textContent = 'Hardware:';
        hardwareTitle.style.cssText = 'font-weight: bold; color: #4a9eff; margin-bottom: 4px; font-size: 11px;';
        hardwareContainer.appendChild(hardwareTitle);
        
        const hardwareStatus = document.createElement('div');
        hardwareStatus.id = 'hardware-status';
        hardwareStatus.textContent = '⚪ Disconnected';
        hardwareStatus.style.cssText = 'font-size: 12px; color: #00ff88;';
        hardwareContainer.appendChild(hardwareStatus);
        
        // Video feed section
        const videoContainer = document.createElement('div');
        videoContainer.className = 'sync-video';
        videoContainer.style.cssText = `
            margin-top: 8px;
            padding: 6px;
            background: rgba(0, 255, 136, 0.05);
            border-radius: 4px;
        `;
        
        const videoTitle = document.createElement('div');
        videoTitle.textContent = 'Remote Video Feed:';
        videoTitle.style.cssText = 'font-weight: bold; color: #00ff88; margin-bottom: 4px; font-size: 11px;';
        videoContainer.appendChild(videoTitle);
        
        const videoPreview = document.createElement('video');
        videoPreview.id = 'remoteVideoFeed';
        videoPreview.style.cssText = `
            width: 100%;
            max-height: 200px;
            border-radius: 4px;
            background: #0a0e27;
            border: 1px solid #2d3561;
            display: none;
        `;
        videoContainer.appendChild(videoPreview);
        
        const videoStatus = document.createElement('div');
        videoStatus.id = 'video-status';
        videoStatus.textContent = 'No active video stream';
        videoStatus.style.cssText = 'font-size: 11px; color: #999; text-align: center; padding: 20px 0;';
        videoContainer.appendChild(videoStatus);
        
        // Stats
        const statsContainer = document.createElement('div');
        statsContainer.className = 'sync-stats';
        statsContainer.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            padding-top: 8px;
            border-top: 1px solid #2d3561;
        `;
        
        const syncLatency = document.createElement('div');
        syncLatency.style.cssText = 'font-size: 11px;';
        syncLatency.innerHTML = '<strong>Latency:</strong> <span id="sync-latency">-</span>ms';
        
        const queueSize = document.createElement('div');
        queueSize.style.cssText = 'font-size: 11px;';
        queueSize.innerHTML = '<strong>Queue:</strong> <span id="queue-size">0</span>';
        
        statsContainer.appendChild(syncLatency);
        statsContainer.appendChild(queueSize);
        
        // Assemble panel
        panel.appendChild(header);
        panel.appendChild(devicesContainer);
        panel.appendChild(hardwareContainer);
        panel.appendChild(videoContainer);
        panel.appendChild(statsContainer);
        
        this.panel = panel;
    }
    
    attachListeners() {
        if (!window.gembotSync) {
            console.warn('⚠️ gembotSync not available yet, retrying in 1s...');
            setTimeout(() => this.attachListeners(), 1000);
            return;
        }
        
        const sync = window.gembotSync;
        
        // Listen for sync events
        sync.on('device-registered', (device) => this.onDeviceRegistered(device));
        sync.on('machine-state-changed', (data) => this.onMachineStateChanged(data));
        sync.on('video-stream-start', (metadata) => this.onVideoStart(metadata));
        sync.on('video-stream-complete', (data) => this.onVideoComplete(data));
        sync.on('hardware-connected', (info) => this.onHardwareConnected(info));
        sync.on('hardware-disconnected', () => this.onHardwareDisconnected());
        
        // Update status
        setInterval(() => this.updateStatus(), 1000);
    }
    
    onDeviceRegistered(device) {
        console.log('📱 Device registered:', device);
        this.updateDevicesList();
    }
    
    onMachineStateChanged(data) {
        console.log('🔄 Machine state changed:', data);
    }
    
    onVideoStart(metadata) {
        console.log('🎥 Video stream starting...');
        const videoStatus = document.getElementById('video-status');
        if (videoStatus) {
            videoStatus.textContent = `Receiving video... (0%)`;
            videoStatus.style.color = '#4a9eff';
        }
    }
    
    onVideoComplete(data) {
        console.log('✅ Video stream complete');
        const video = document.getElementById('remoteVideoFeed');
        const videoStatus = document.getElementById('video-status');
        
        if (video && data.url) {
            video.src = data.url;
            video.style.display = 'block';
            videoStatus.style.display = 'none';
        }
    }
    
    onHardwareConnected(info) {
        console.log('🔗 Hardware connected:', info);
        const status = document.getElementById('hardware-status');
        if (status) {
            status.textContent = '🟢 Connected';
            status.style.color = '#00ff88';
        }
    }
    
    onHardwareDisconnected() {
        console.log('❌ Hardware disconnected');
        const status = document.getElementById('hardware-status');
        if (status) {
            status.textContent = '⚪ Disconnected';
            status.style.color = '#999';
        }
    }
    
    updateDevicesList() {
        if (!window.gembotSync) return;
        
        const list = document.getElementById('devices-list');
        if (!list) return;
        
        const devices = window.gembotSync.getLinkedDevices();
        
        // Clear except title
        while (list.children.length > 1) {
            list.removeChild(list.lastChild);
        }
        
        if (devices.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No other devices connected';
            emptyMsg.style.cssText = 'color: #666; font-size: 11px; padding: 4px 0;';
            list.appendChild(emptyMsg);
            return;
        }
        
        devices.forEach(device => {
            const deviceEl = document.createElement('div');
            deviceEl.style.cssText = `
                padding: 4px 6px;
                background: #1a2347;
                border: 1px solid #2d3561;
                border-radius: 3px;
                font-size: 11px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            
            const name = document.createElement('span');
            name.textContent = `${device.type === 'mobile' ? '📱' : '🖥️'} ${device.name || device.type}`;
            
            const status = document.createElement('span');
            status.textContent = '🟢';
            status.style.fontSize = '10px';
            
            deviceEl.appendChild(name);
            deviceEl.appendChild(status);
            list.appendChild(deviceEl);
        });
    }
    
    updateStatus() {
        if (!window.gembotSync) return;
        
        const syncStatus = window.gembotSync.getSyncStatus();
        
        // Update connection status
        const statusBadge = document.getElementById('sync-status');
        if (statusBadge) {
            if (syncStatus.isConnected) {
                statusBadge.textContent = '🟢 Connected';
                statusBadge.style.background = 'rgba(0, 255, 136, 0.2)';
            } else {
                statusBadge.textContent = '🔴 Disconnected';
                statusBadge.style.background = 'rgba(255, 107, 107, 0.2)';
            }
        }
        
        // Update queue size
        const queueSize = document.getElementById('queue-size');
        if (queueSize) {
            queueSize.textContent = syncStatus.queueLength;
        }
        
        // Update latency (mock for now)
        const latency = document.getElementById('sync-latency');
        if (latency) {
            latency.textContent = Math.floor(Math.random() * 50 + 10);
        }
    }
    
    insertIntoPage() {
        // Try to insert into left panel
        let target = document.querySelector('.left-panel');
        
        if (target) {
            target.insertBefore(this.panel, target.firstChild);
            console.log('✅ Sync panel inserted into page');
        } else {
            console.warn('⚠️ Could not find panel location, will retry');
            setTimeout(() => this.insertIntoPage(), 1000);
        }
    }
}

// Initialize sync UI
let gembotSyncUI = null;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            gembotSyncUI = new GemBotSyncUI();
            gembotSyncUI.insertIntoPage();
        }, 1000);
    });
} else {
    setTimeout(() => {
        gembotSyncUI = new GemBotSyncUI();
        gembotSyncUI.insertIntoPage();
    }, 1000);
}

console.log('📦 GemBot Sync UI module loaded');
