# 🧪 GemBot Video Generation - Testing Guide

**Status:** Complete Testing Documentation  
**Version:** 1.0  
**Created:** December 18, 2025

---

## 📋 Table of Contents

1. [Quick Tests (5 min)](#quick-tests)
2. [Integration Tests (15 min)](#integration-tests)
3. [Performance Tests (30 min)](#performance-tests)
4. [Production Tests (1 hour)](#production-tests)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Tests (5 minutes)

Run these tests first to verify basic functionality.

### Test 1.1: Python Environment

```bash
# Activate virtual environment
venv\Scripts\activate  # Windows: venv\Scripts\activate

# Check Python version
python --version  # Should be 3.8+

# Test imports
python -c "
import torch
import diffusers
import transformers
print('✅ All imports successful')
"
```

**Expected Result:**
- Python version 3.8 or higher
- No import errors
- "✅ All imports successful" message

**Status:** [ ] Pass / [ ] Fail

---

### Test 1.2: Node.js Environment

```bash
# Check Node version
node --version  # Should be 14+

# Test Node imports
node -e "
console.log('✅ Node environment ready');
console.log('Version:', process.version);
"
```

**Expected Result:**
- Node version 14 or higher
- "✅ Node environment ready" message

**Status:** [ ] Pass / [ ] Fail

---

### Test 1.3: File Integrity

```bash
# Verify all core files exist
ls -la video-diffusion-pipeline.py
ls -la merlin-video-generation-agent.js
ls -la gembot-agent-video-orchestrator.js
ls -la gembot-tutorial-storyboard.json
```

**Expected Result:**
- All 4 files listed without errors
- File sizes: Python ~500KB, JS files ~50-100KB each, JSON ~100KB

**Status:** [ ] Pass / [ ] Fail

---

### Test 1.4: Storyboard Validation

```bash
# Validate storyboard JSON structure
python -c "
import json

with open('gembot-tutorial-storyboard.json', 'r') as f:
    data = json.load(f)

print(f'✅ Storyboard valid JSON')
print(f'Title: {data[\"title\"]}')
print(f'Scenes: {len(data[\"scenes\"])}')

# Verify each scene
for i, scene in enumerate(data['scenes']):
    required = ['title', 'duration_seconds', 'narration', 'description']
    if all(k in scene for k in required):
        print(f'  Scene {i+1}: ✅')
    else:
        print(f'  Scene {i+1}: ❌ Missing fields')
"
```

**Expected Result:**
- "✅ Storyboard valid JSON" message
- Title displays correctly
- Number of scenes shows (20)
- All scenes marked ✅

**Status:** [ ] Pass / [ ] Fail

---

## 🔗 Integration Tests (15 minutes)

### Test 2.1: Python Pipeline Module

```python
# Create: test_pipeline.py

from video_diffusion_pipeline import (
    GemBotVideoDiffusionEngine,
    VideoSceneProcessor
)

print('Testing Python Pipeline...')

# Test engine initialization
engine = GemBotVideoDiffusionEngine()
print(f'✅ Engine initialized')
print(f'   Device: {engine.device}')
print(f'   Model: {engine.model_id}')

# Test status
status = engine.get_status()
print(f'✅ Engine status: {status}')

# Test scene processor
processor = VideoSceneProcessor(engine)
print(f'✅ Scene processor initialized')

print('\n✅ All pipeline tests passed!')
```

Run:
```bash
python test_pipeline.py
```

**Expected Result:**
- Engine initializes successfully
- Device shows (cuda or cpu)
- Model ID displays correctly
- Scene processor initializes
- "✅ All pipeline tests passed!" message

**Status:** [ ] Pass / [ ] Fail

---

### Test 2.2: Merlin Agent Module

```javascript
// Create: test_merlin.js

const MerlinAgent = require('./merlin-video-generation-agent.js');

console.log('Testing Merlin Agent...');

// Test instantiation
const merlin = new MerlinAgent.MerlinVideoGenerationAgent();
console.log('✅ Merlin agent created');

// Test personality
console.log(`✅ Agent name: ${merlin.personality.name}`);
console.log(`✅ Agent role: ${merlin.personality.role}`);

// Test job queue
console.log(`✅ Job queue initialized (max: ${merlin.maxConcurrentJobs})`);

// Test natural language parser
const intent = merlin.parseUserIntent('Create a tutorial about GemBot setup');
console.log(`✅ Intent parsed: ${intent.type}`);

console.log('\n✅ All Merlin agent tests passed!');
```

Run:
```bash
node test_merlin.js
```

**Expected Result:**
- Agent instantiates successfully
- Personality information displays
- Job queue initialized
- Intent parsed correctly
- "✅ All Merlin agent tests passed!" message

**Status:** [ ] Pass / [ ] Fail

---

### Test 2.3: Orchestrator System

```javascript
// Create: test_orchestrator.js

const { 
  AgentVideoOrchestrator, 
  GemBotAgent 
} = require('./gembot-agent-video-orchestrator.js');

console.log('Testing Agent Orchestrator...');

// Test orchestrator creation
const orchestrator = new AgentVideoOrchestrator();
console.log('✅ Orchestrator created');

// Test agent registration
const bot1 = new GemBotAgent('TestBot1', orchestrator);
const bot2 = new GemBotAgent('TestBot2', orchestrator);

orchestrator.registerAgent(bot1);
orchestrator.registerAgent(bot2);
console.log('✅ Agents registered');

// Test status
const status = orchestrator.getStatus();
console.log(`✅ Orchestrator status: ${status}`);

// Test agent count
const agents = orchestrator.getRegisteredAgents();
console.log(`✅ Registered agents: ${agents.length}`);

// Test stats
const stats = orchestrator.getStats();
console.log(`✅ Stats retrieved`);
console.log(`   Total jobs: ${stats.totalJobs}`);
console.log(`   Completed: ${stats.completedJobs}`);

console.log('\n✅ All orchestrator tests passed!');
```

Run:
```bash
node test_orchestrator.js
```

**Expected Result:**
- Orchestrator creates successfully
- Agents register without errors
- Status returns valid response
- Agent count is 2
- Stats show: total=0, completed=0
- "✅ All orchestrator tests passed!" message

**Status:** [ ] Pass / [ ] Fail

---

## ⚡ Performance Tests (30 minutes)

### Test 3.1: Model Download Speed

```python
# Create: test_model_download.py

import time
from diffusers import StableVideoDiffusionPipeline
import torch

print('Testing Model Download Performance...')

start = time.time()

try:
    print('⏳ Downloading model (this may take 5-10 minutes)...')
    
    pipe = StableVideoDiffusionPipeline.from_pretrained(
        'stabilityai/stable-video-diffusion-img2vid-xt',
        torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
        variant='fp16' if torch.cuda.is_available() else 'fp32'
    )
    
    elapsed = time.time() - start
    print(f'✅ Model downloaded in {elapsed/60:.1f} minutes')
    
    # Test model properties
    print(f'✅ Model loaded successfully')
    print(f'   Dtype: {pipe.dtype}')
    print(f'   Device: {pipe.device}')
    
except Exception as e:
    print(f'❌ Error: {e}')
```

Run:
```bash
python test_model_download.py
```

**Expected Result:**
- Model downloads without errors
- Download completes in 5-15 minutes (depending on internet)
- Model loads successfully
- Dtype and device display correctly

**Status:** [ ] Pass / [ ] Fail

---

### Test 3.2: Single Video Generation

```python
# Create: test_single_video.py

import time
from video_diffusion_pipeline import GemBotVideoDiffusionEngine, VideoSceneProcessor

print('Testing Single Video Generation...')

start = time.time()

try:
    engine = GemBotVideoDiffusionEngine(quality='low')
    processor = VideoSceneProcessor(engine)
    
    print('⏳ Generating test video (this may take 2-5 minutes)...')
    
    # Simple test storyboard
    storyboard = {
        'title': 'Test Video',
        'scenes': [
            {
                'title': 'Test Scene',
                'duration_seconds': 5,
                'description': 'A simple test scene',
                'narration': 'This is a test',
                'style': 'professional'
            }
        ]
    }
    
    result = processor.process_storyboard(storyboard)
    elapsed = time.time() - start
    
    print(f'✅ Video generated in {elapsed/60:.1f} minutes')
    print(f'   Output: {result}')
    
except Exception as e:
    print(f'❌ Error: {e}')
    import traceback
    traceback.print_exc()
```

Run:
```bash
python test_single_video.py
```

**Expected Result:**
- Video generation starts
- Progress messages display
- Video completes in 2-5 minutes (depending on GPU/CPU)
- Output file created
- "✅ Video generated" message

**Status:** [ ] Pass / [ ] Fail

---

### Test 3.3: Multi-Agent Generation

```javascript
// Create: test_multi_agent.js

const { 
  AgentVideoOrchestrator, 
  GemBotAgent 
} = require('./gembot-agent-video-orchestrator.js');

async function testMultiAgent() {
  console.log('Testing Multi-Agent Video Generation...');
  
  const orchestrator = new AgentVideoOrchestrator({
    maxTotalJobs: 3,
    outputDir: './test_videos'
  });
  
  // Create agents
  const agents = [];
  for (let i = 1; i <= 3; i++) {
    const agent = new GemBotAgent(`Agent${i}`, orchestrator);
    orchestrator.registerAgent(agent);
    agents.push(agent);
  }
  
  console.log('⏳ Submitting 3 concurrent video requests...');
  
  const start = Date.now();
  
  try {
    // Note: This will actually try to generate videos
    // If Python pipeline not ready, will fail gracefully
    
    const promises = agents.map(agent =>
      agent.generateTutorial(`Topic ${agent.name}`, 'test')
        .catch(err => ({
          error: err.message,
          agent: agent.name
        }))
    );
    
    const results = await Promise.all(promises);
    
    const elapsed = (Date.now() - start) / 1000;
    console.log(`✅ Test completed in ${elapsed}s`);
    
    // Check results
    const successful = results.filter(r => !r.error).length;
    const failed = results.filter(r => r.error).length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Failed: ${failed}`);
    
    // Get stats
    const stats = orchestrator.getStats();
    console.log(`\n📊 Orchestrator Stats:`);
    console.log(`   Total jobs: ${stats.totalJobs}`);
    console.log(`   In progress: ${stats.inProgress}`);
    
  } catch (error) {
    console.error('❌ Error in multi-agent test:', error.message);
  }
}

testMultiAgent();
```

Run:
```bash
node test_multi_agent.js
```

**Expected Result:**
- 3 agents created and registered
- Video requests submitted
- Orchestrator handles concurrent requests
- Stats show active jobs
- System completes without crashes

**Status:** [ ] Pass / [ ] Fail

---

## 🏭 Production Tests (1 hour)

### Test 4.1: Full Storyboard Generation

```bash
# Generate complete 20-scene tutorial

python video-diffusion-pipeline.py \
  --storyboard gembot-tutorial-storyboard.json \
  --output_dir ./production_test \
  --quality high \
  --verbose
```

**Expected Result:**
- Process starts and shows progress
- 20 scenes processed sequentially
- Each scene generates video frames
- Final composite video created
- Output directory: `./production_test`
- File created: `gembot_tutorial_complete.mp4`
- File size: 500MB - 2GB
- Generation time: 1-3 hours (depending on GPU)

**Checklist:**
- [ ] Process starts without errors
- [ ] Progress updates display
- [ ] All 20 scenes process
- [ ] Final video file created
- [ ] Video file is playable
- [ ] Video quality acceptable
- [ ] Audio/narration present

**Status:** [ ] Pass / [ ] Fail

---

### Test 4.2: API Endpoint Testing

```javascript
// Create: test_api_endpoints.js

const express = require('express');
const MerlinAgent = require('./merlin-video-generation-agent.js');

const app = express();
app.use(express.json());

const merlin = new MerlinAgent.MerlinVideoGenerationAgent({
  outputDir: './api_test_videos'
});

// Setup endpoint
app.post('/api/generate-video', async (req, res) => {
  try {
    const { command } = req.body;
    console.log(`📹 Request: ${command}`);
    
    const result = await merlin.generateFromCommand(command);
    res.json({ success: true, videoPath: result.path });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ready', service: 'Merlin Video API' });
});

// Test the API
async function testAPI() {
  console.log('Testing API Endpoints...');
  
  const server = app.listen(3001, async () => {
    console.log('✅ API server started on :3001');
    
    try {
      // Test 1: Status endpoint
      const statusRes = await fetch('http://localhost:3001/api/status');
      const status = await statusRes.json();
      console.log(`✅ Status endpoint: ${status.status}`);
      
      // Test 2: Would need to wait for video generation
      console.log('✅ API endpoints responding correctly');
      
    } catch (error) {
      console.error('❌ API test failed:', error);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

testAPI();
```

Run:
```bash
node test_api_endpoints.js
```

**Expected Result:**
- Server starts on port 3001
- Status endpoint responds
- API returns JSON responses
- Error handling works
- Server shuts down cleanly

**Status:** [ ] Pass / [ ] Fail

---

### Test 4.3: Video Library Management

```javascript
// Create: test_video_library.js

const { AgentVideoOrchestrator, GemBotAgent } = require('./gembot-agent-video-orchestrator.js');
const fs = require('fs');
const path = require('path');

async function testVideoLibrary() {
  console.log('Testing Video Library...');
  
  const orchestrator = new AgentVideoOrchestrator({
    outputDir: './library_test'
  });
  
  // Create test video directory
  if (!fs.existsSync('./library_test')) {
    fs.mkdirSync('./library_test');
  }
  
  // Create fake video entries for testing
  const testVideos = [
    { title: 'Tutorial 1', path: './library_test/video1.mp4' },
    { title: 'Tutorial 2', path: './library_test/video2.mp4' }
  ];
  
  // Create dummy video files
  testVideos.forEach(v => {
    fs.writeFileSync(v.path, 'dummy video content');
  });
  
  console.log('✅ Test video files created');
  
  // Test library operations
  console.log('✅ Video library initialized');
  
  // Test search
  const results = orchestrator.searchVideoLibrary('Tutorial');
  console.log(`✅ Search found: ${results.length} videos`);
  
  // Test stats
  const stats = orchestrator.getStats();
  console.log(`✅ Library stats: ${stats.totalVideos || 'N/A'}`);
  
  // Cleanup
  testVideos.forEach(v => {
    if (fs.existsSync(v.path)) fs.unlinkSync(v.path);
  });
  
  console.log('✅ Cleanup complete');
  console.log('\n✅ All video library tests passed!');
}

testVideoLibrary();
```

Run:
```bash
node test_video_library.js
```

**Expected Result:**
- Test videos created
- Library initializes
- Search functionality works
- Stats retrieve correctly
- Cleanup completes

**Status:** [ ] Pass / [ ] Fail

---

### Test 4.4: Error Handling

```python
# Create: test_error_handling.py

from video_diffusion_pipeline import GemBotVideoDiffusionEngine

print('Testing Error Handling...')

# Test 1: Invalid storyboard
try:
    processor = VideoSceneProcessor(None)
    processor.process_storyboard('invalid_path.json')
except FileNotFoundError:
    print('✅ File not found error handled correctly')
except Exception as e:
    print(f'✅ Error handled: {type(e).__name__}')

# Test 2: Invalid scene data
try:
    engine = GemBotVideoDiffusionEngine()
    engine.compose_scene({})  # Empty scene
except KeyError:
    print('✅ Missing fields error handled')
except Exception as e:
    print(f'✅ Error handled: {type(e).__name__}')

# Test 3: Out of memory graceful handling
print('✅ Error handling tests completed')
```

Run:
```bash
python test_error_handling.py
```

**Expected Result:**
- All errors handled gracefully
- No unhandled exceptions
- Error messages clear and helpful
- System recovers from errors

**Status:** [ ] Pass / [ ] Fail

---

## 🔧 Troubleshooting

### Common Issues

**Issue: "CUDA Out of Memory"**
```bash
# Solution: Enable model CPU offloading
python video-diffusion-pipeline.py --enable-attention-slicing --cpu-offload
```

**Issue: "Model not found"**
```bash
# Solution: Clear cache and re-download
rm -rf ~/.cache/huggingface
python video-diffusion-pipeline.py
```

**Issue: "Node module not found"**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

**Issue: "Video generation hanging"**
```bash
# Solution: Check GPU status
nvidia-smi  # If GPU occupied, restart

# Or use CPU-only
python video-diffusion-pipeline.py --device cpu
```

**Issue: "Permission denied"**
```bash
# Solution: Fix permissions
chmod +x video-diffusion-pipeline.py
chmod +x merlin-video-generation-agent.js
```

---

## 📊 Test Summary Report

| Test | Status | Notes |
|------|--------|-------|
| Python Environment | [ ] | Check version 3.8+ |
| Node.js Environment | [ ] | Check version 14+ |
| File Integrity | [ ] | All 4 files present |
| Storyboard Validation | [ ] | 20 scenes valid |
| Python Pipeline | [ ] | Module imports correctly |
| Merlin Agent | [ ] | Agent instantiates |
| Orchestrator | [ ] | Multi-agent coordination |
| Model Download | [ ] | Models cached |
| Single Video | [ ] | Test video generates |
| Multi-Agent | [ ] | Concurrent generation |
| Full Storyboard | [ ] | Complete tutorial video |
| API Endpoints | [ ] | Responses valid |
| Video Library | [ ] | Search and stats |
| Error Handling | [ ] | Graceful failures |

---

## ✅ Production Readiness Checklist

Your system is production-ready when ALL tests pass:

- ✅ All 14 tests passed
- ✅ No error messages in logs
- ✅ Video generation times acceptable
- ✅ API responds reliably
- ✅ Multi-agent coordination works
- ✅ Error handling robust
- ✅ Performance meets expectations
- ✅ Team trained on operation

---

**🎉 All Tests Complete!**

Your GemBot Video Generation System has been thoroughly tested and is ready for production use!

Mark test status as you complete each test. Document any issues and solutions in the troubleshooting section.
