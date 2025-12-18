#!/usr/bin/env python3
"""
GemBot Video Generation Pipeline - Quick Start
This script provides an easy way to get started with video generation
"""

import os
import sys
import json
import subprocess
import platform

def print_header(text):
    """Print styled header"""
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")

def check_python_version():
    """Verify Python version is 3.8+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print(f"❌ Python 3.8+ required, you have {version.major}.{version.minor}")
        return False
    print(f"✅ Python version: {version.major}.{version.minor}")
    return True

def check_dependencies():
    """Check if all required dependencies are installed"""
    print_header("Checking Dependencies")
    
    required = {
        'torch': 'PyTorch',
        'diffusers': 'Diffusers',
        'transformers': 'Transformers',
        'PIL': 'Pillow',
        'cv2': 'OpenCV',
        'numpy': 'NumPy'
    }
    
    missing = []
    for module, name in required.items():
        try:
            __import__(module)
            print(f"✅ {name} installed")
        except ImportError:
            print(f"❌ {name} NOT installed")
            missing.append(module)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("\nRun: pip install -r requirements.txt")
        return False
    
    return True

def check_models():
    """Check if video diffusion models are downloaded"""
    print_header("Checking Models")
    
    cache_dir = os.path.expanduser("~/.cache/huggingface/hub")
    svd_model = "stabilityai/stable-video-diffusion-img2vid-xt"
    
    if os.path.exists(cache_dir):
        print(f"✅ HuggingFace cache exists: {cache_dir}")
        
        # Check for SVD model
        if any(svd_model.replace('/', '--') in d for d in os.listdir(cache_dir)):
            print(f"✅ Video Diffusion model cached")
            return True
    
    print(f"⚠️  Models not yet cached")
    print("\nModels will be downloaded on first use (~7GB)")
    print("This takes 5-10 minutes depending on internet speed\n")
    return True

def check_disk_space():
    """Check available disk space"""
    print_header("Checking Disk Space")
    
    import shutil
    total, used, free = shutil.disk_usage("/")
    free_gb = free / (1024**3)
    
    print(f"📊 Total: {total / (1024**3):.1f} GB")
    print(f"📊 Used: {used / (1024**3):.1f} GB")
    print(f"📊 Free: {free_gb:.1f} GB")
    
    if free_gb < 50:
        print(f"⚠️  Warning: Only {free_gb:.1f} GB free (recommend 50+ GB)")
        return False
    
    print(f"✅ Sufficient disk space available")
    return True

def check_gpu():
    """Check if NVIDIA GPU is available"""
    print_header("Checking GPU")
    
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✅ CUDA available")
            print(f"   Device: {torch.cuda.get_device_name(0)}")
            print(f"   VRAM: {torch.cuda.get_device_properties(0).total_memory / (1024**3):.1f} GB")
            return True
        else:
            print(f"ℹ️  No GPU detected (will use CPU)")
            print(f"   CPU generation will be slower (~5-10 min per video)")
            return True
    except Exception as e:
        print(f"❌ Error checking GPU: {e}")
        return False

def test_imports():
    """Test that all modules can be imported"""
    print_header("Testing Imports")
    
    try:
        print("Testing video-diffusion-pipeline...")
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        
        # Try importing the main pipeline
        exec(open('video-diffusion-pipeline.py').read())
        print("✅ Python pipeline ready")
    except Exception as e:
        print(f"❌ Error importing pipeline: {e}")
        return False
    
    try:
        print("Testing merlin-video-generation-agent...")
        # Just verify the file exists and is valid JavaScript
        with open('merlin-video-generation-agent.js', 'r') as f:
            content = f.read()
            if 'MerlinVideoGenerationAgent' in content:
                print("✅ Merlin agent ready")
                return True
    except Exception as e:
        print(f"❌ Error checking Merlin agent: {e}")
        return False

def suggest_next_steps():
    """Suggest what to do next"""
    print_header("🎬 Next Steps")
    
    print("""
1. GENERATE YOUR FIRST VIDEO (fastest option):
   
   python video-diffusion-pipeline.py \\
     --storyboard gembot-tutorial-storyboard.json \\
     --output_dir ./my_first_video \\
     --quality medium

2. OR USE MERLIN AI AGENT:
   
   node -e "
   const Agent = require('./merlin-video-generation-agent.js');
   const m = new Agent.MerlinVideoGenerationAgent();
   m.generateFromCommand('Create a tutorial about GemBot basics');
   "

3. OR USE COLAB (Free GPU):
   
   Go to: https://colab.research.google.com
   Create new notebook and paste the setup code from VIDEO_GENERATION_SETUP_GUIDE.md

4. READ THE FULL GUIDE:
   
   See: VIDEO_GENERATION_SETUP_GUIDE.md (complete setup instructions)
   See: VIDEO_GENERATION_DEPLOYMENT_CHECKLIST.md (production deployment)

5. CUSTOMIZE YOUR CONTENT:
   
   Edit: gembot-tutorial-storyboard.json
   Create your own storyboard with different topics and scenes
""")

def main():
    """Run all checks and provide setup summary"""
    print_header("GemBot Video Generation - System Check")
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Models", check_models),
        ("Disk Space", check_disk_space),
        ("GPU/CUDA", check_gpu),
    ]
    
    results = {}
    for name, check_fn in checks:
        try:
            result = check_fn()
            results[name] = "✅ PASS" if result else "⚠️  WARN"
        except Exception as e:
            print(f"❌ Error in {name}: {e}")
            results[name] = "❌ FAIL"
    
    # Summary
    print_header("System Check Summary")
    for name, result in results.items():
        print(f"{result} - {name}")
    
    failed = sum(1 for r in results.values() if "FAIL" in r)
    warned = sum(1 for r in results.values() if "WARN" in r)
    
    print(f"\n📊 Total: {len(results)} checks")
    print(f"✅ Passed: {len(results) - failed - warned}")
    if warned:
        print(f"⚠️  Warned: {warned}")
    if failed:
        print(f"❌ Failed: {failed}")
    
    if failed > 0:
        print("\n❌ Please fix failed checks before proceeding")
        sys.exit(1)
    
    if warned > 0:
        print("\n⚠️  Some warnings detected, but you can continue")
    else:
        print("\n✅ All systems ready!")
    
    suggest_next_steps()
    
    print_header("Ready to Generate Videos! 🎬")
    print("""
Your system is configured and ready to generate unlimited,
free, professional educational videos for GemBot!

Start now with:
  python video-diffusion-pipeline.py --storyboard gembot-tutorial-storyboard.json

Or run the interactive demo:
  node test-video-generation.js

Good luck! 🚀
""")

if __name__ == '__main__':
    main()
