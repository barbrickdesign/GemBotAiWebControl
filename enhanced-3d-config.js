/**
 * Enhanced 3D Configuration for GemBot Virtual Machine
 * Provides settings for High-Fidelity graphics using Babylon.js
 */

window.GemBot3DConfig = {
    // Quality Presets
    presets: {
        low: {
            pbr: false,
            shadows: false,
            postProcessing: false,
            antialiasing: false,
            resolutionScale: 0.8
        },
        medium: {
            pbr: true,
            shadows: true,
            postProcessing: false,
            antialiasing: true,
            resolutionScale: 1.0,
            shadowMapSize: 1024
        },
        high: {
            pbr: true,
            shadows: true,
            postProcessing: true,
            antialiasing: true,
            resolutionScale: 1.0,
            shadowMapSize: 2048,
            bloom: true,
            fxaa: true
        },
        ultra: {
            pbr: true,
            shadows: true,
            postProcessing: true,
            antialiasing: true,
            resolutionScale: 1.5,
            shadowMapSize: 4096,
            bloom: true,
            fxaa: true,
            ssr: true // Screen Space Reflections (if supported)
        }
    },

    // Current active settings (default to medium for performance)
    current: null,

    // Materials Library (PBR Definitions)
    materials: {
        metalAluminum: {
            albedoColor: "#C0C0C0",
            metallic: 0.9,
            roughness: 0.3,
            microSurface: 0.85
        },
        metalSteel: {
            albedoColor: "#808080",
            metallic: 0.8,
            roughness: 0.4,
            microSurface: 0.8
        },
        plasticBlack: {
            albedoColor: "#1a1a1a",
            metallic: 0.1,
            roughness: 0.6,
            microSurface: 0.5
        },
        gemstoneDiamond: {
            albedoColor: "#FFFFFF",
            metallic: 0.1,
            roughness: 0.0,
            alpha: 0.3,
            indexOfRefraction: 2.42,
            subSurface: true
        },
        gemstoneRuby: {
            albedoColor: "#FF0000",
            metallic: 0.1,
            roughness: 0.1,
            alpha: 0.6,
            indexOfRefraction: 1.77
        }
    },

    // Initialize with default
    init() {
        this.current = { ...this.presets.medium };
        console.log('✨ 3D Graphics Config Initialized (Medium Preset)');
    },

    // Apply a preset
    setQuality(level) {
        if (this.presets[level]) {
            this.current = { ...this.presets[level] };
            console.log(`✨ 3D Quality set to: ${level.toUpperCase()}`);
            return true;
        }
        return false;
    }
};

// Auto-init
window.GemBot3DConfig.init();
