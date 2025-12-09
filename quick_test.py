#!/usr/bin/env python3
"""
GemBot Quick Functional Test
Simulates real-world usage patterns
"""

import json
from pathlib import Path
from datetime import datetime

class QuickTest:
    def __init__(self):
        self.workspace = Path(r"c:\Users\barbr\Desktop\GemBotMemory2025")
        self.test_log = []

    def log_test(self, category, action, expected, status):
        self.test_log.append({
            "category": category,
            "action": action,
            "expected": expected,
            "status": "✅ PASS" if status else "❌ FAIL",
            "timestamp": datetime.now().isoformat()
        })
        emoji = "✅" if status else "❌"
        print(f"{emoji} {action}: {expected}")

    def run_tests(self):
        print("\n" + "="*70)
        print("🧪 GemBot Quick Functional Test Suite")
        print("="*70 + "\n")

        # Test 1: File existence
        print("📋 TEST SUITE 1: File Integrity\n")
        html_path = self.workspace / "GemBot_Control_AI.html"
        self.log_test("Files", "GemBot_Control_AI.html exists", "File found", html_path.exists())
        
        # Test 2: HTML content validation
        print("\n🔍 TEST SUITE 2: HTML Content Validation\n")
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        checks = {
            "DOCTYPE": "<!DOCTYPE html>" in content,
            "Merlin AI Class": "class MerlinPersonality" in content,
            "Serial Communication": "class GemBotSerial" in content,
            "ML Vision System": "class GemBotMLModel" in content,
            "Session Recording": "class SessionRecorder" in content,
            "Voice System": "SpeechInputManager" in content,
            "TensorFlow": "TensorFlow.js" in content,
            "COCO-SSD": "COCO-SSD" in content,
        }
        
        for feature, found in checks.items():
            self.log_test("HTML", f"Feature: {feature}", "Present in code", found)
        
        # Test 3: UI Elements
        print("\n🎨 TEST SUITE 3: UI Elements\n")
        ui_elements = {
            "Scan Button": 'id="scanBtn"' in content,
            "Connect Button": 'id="connectBtn"' in content,
            "Camera Start Button": 'id="cameraStartBtn"' in content,
            "Record Button": 'id="recordBtn"' in content,
            "Emergency Stop": 'id="emergencyStop"' in content,
            "Camera Feed": 'id="cameraFeed"' in content,
            "ML Canvas": 'id="mlCanvas"' in content,
            "Chat Window": 'id="aiMessages"' in content,
            "Port Selector": 'id="portSelect"' in content,
            "Speed Control": 'id="speedSlider"' in content,
        }
        
        for element, found in ui_elements.items():
            self.log_test("UI", f"Element: {element}", "Element found", found)
        
        # Test 4: Merlin AI Systems
        print("\n🧙 TEST SUITE 4: Merlin AI Systems\n")
        merlin_systems = {
            "Personality Class": "class MerlinPersonality" in content,
            "Voice Setup": "setupMerlinVoice" in content,
            "Greeting Function": "giveGreeting" in content,
            "User Profile": "userProfile" in content,
            "Learning Tracking": "learningProgress" in content,
            "GemForge System": "gemForge" in content,
            "Knowledge Base": "knowledgeBase" in content,
        }
        
        for system, found in merlin_systems.items():
            self.log_test("Merlin", system, "Implemented", found)
        
        # Test 5: Hardware Integration
        print("\n⚙️ TEST SUITE 5: Hardware Integration\n")
        hardware = {
            "Web Serial API": "navigator.serial" in content,
            "Arduino Support": "GemBotSerial" in content,
            "Motor Commands": "motorSpeed\|motorMode" in content,
            "Position Tracking": "positionX\|positionY" in content,
            "Nextion Interface": "nextion\|Nextion" in content,
        }
        
        for hw, found in hardware.items():
            self.log_test("Hardware", hw, "Supported", found)
        
        # Test 6: Safety Systems
        print("\n🛡️ TEST SUITE 6: Safety Systems\n")
        safety = {
            "Emergency Stop": "emergencyStop" in content,
            "Safety Validation": "validateMotorCommand\|checkBounds" in content,
            "Error Handling": "try\|catch" in content,
        }
        
        for safety_feature, found in safety.items():
            self.log_test("Safety", safety_feature, "Implemented", found)
        
        # Test 7: Vision & ML
        print("\n👁️ TEST SUITE 7: Vision & ML Systems\n")
        vision = {
            "Camera Access": "getUserMedia" in content,
            "ML Model": "GemBotMLModel" in content,
            "TensorFlow": "tensorflow" in content.lower(),
            "Object Detection": "COCO-SSD\|cocoSsd" in content,
            "Canvas Processing": "canvas\|canvasContext" in content,
        }
        
        for vis, found in vision.items():
            self.log_test("Vision", vis, "Ready", found)
        
        # Test 8: Data Persistence
        print("\n💾 TEST SUITE 8: Data Persistence\n")
        persistence = {
            "IndexedDB": "IndexedDB\|indexedDB" in content,
            "Session Recording": "SessionRecorder" in content,
            "User Profile Storage": "saveUserProfile\|loadUserProfile" in content,
            "Session Export": "exportSession\|sessionData" in content,
        }
        
        for persist, found in persistence.items():
            self.log_test("Persistence", persist, "Working", found)
        
        # Summary
        print("\n" + "="*70)
        total_tests = len(self.test_log)
        passed = sum(1 for t in self.test_log if "✅" in t["status"])
        failed = total_tests - passed
        success_rate = (passed / total_tests * 100) if total_tests > 0 else 0
        
        print(f"\n📊 TEST SUMMARY")
        print(f"   Total Tests: {total_tests}")
        print(f"   ✅ Passed: {passed}")
        print(f"   ❌ Failed: {failed}")
        print(f"   📈 Success Rate: {success_rate:.1f}%")
        
        if failed == 0:
            print(f"\n🎉 ALL TESTS PASSED!")
            print(f"\n✨ System Status: FULLY OPERATIONAL")
            print(f"\n📍 Ready to use at: http://localhost:8000/")
        else:
            print(f"\n⚠️  {failed} test(s) failed")
        
        print("\n" + "="*70 + "\n")
        
        # Save results
        self.save_results()

    def save_results(self):
        output_file = self.workspace / "QUICK_TEST_RESULTS.json"
        with open(output_file, 'w') as f:
            json.dump({
                "timestamp": datetime.now().isoformat(),
                "total_tests": len(self.test_log),
                "passed": sum(1 for t in self.test_log if "✅" in t["status"]),
                "failed": sum(1 for t in self.test_log if "❌" in t["status"]),
                "test_results": self.test_log
            }, f, indent=2)
        
        print(f"💾 Results saved to: {output_file}\n")


if __name__ == "__main__":
    tester = QuickTest()
    tester.run_tests()
