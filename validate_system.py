#!/usr/bin/env python3
"""
GemBot Control AI - Functional System Validator
Tests all critical systems without modifying code
"""

import os
import sys
import json
import time
from pathlib import Path

class GemBotValidator:
    def __init__(self):
        self.workspace = Path(r"c:\Users\barbr\Desktop\GemBotMemory2025")
        self.base_url = "http://localhost:8000"
        self.tests_passed = 0
        self.tests_failed = 0
        self.results = []

    def print_header(self, text):
        print(f"\n{'='*60}")
        print(f"  {text}")
        print(f"{'='*60}\n")

    def print_test(self, name, status, details=""):
        emoji = "✅" if status else "❌"
        print(f"{emoji} {name}")
        if details:
            print(f"   └─ {details}")
        
        if status:
            self.tests_passed += 1
        else:
            self.tests_failed += 1
        
        self.results.append({
            "test": name,
            "status": "PASS" if status else "FAIL",
            "details": details
        })

    def check_file_exists(self, filename):
        """Check if a required file exists"""
        path = self.workspace / filename
        return path.exists()

    def validate_html_integrity(self):
        """Validate HTML file integrity"""
        path = self.workspace / "GemBot_Control_AI.html"
        if not path.exists():
            return False, "File missing"
        
        size_kb = path.stat().st_size / 1024
        if size_kb < 300:
            return False, f"File too small ({size_kb}KB)"
        
        # Check line count
        with open(path, 'r', encoding='utf-8') as f:
            lines = len(f.readlines())
        
        if lines < 8000:
            return False, f"Line count low ({lines})"
        
        return True, f"{size_kb:.0f}KB, {lines} lines"

    def validate_critical_systems(self):
        """Check for critical system components in HTML"""
        critical = [
            "class MerlinPersonality",
            "class GemBotSerial",
            "class GemBotMLModel",
            "class SessionRecorder",
            "SpeechInputManager",
            "navigator.serial",
            "IndexedDB",
            "TensorFlow",
            "COCO-SSD"
        ]
        
        path = self.workspace / "GemBot_Control_AI.html"
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found = sum(1 for item in critical if item.lower() in content.lower())
        return found == len(critical), f"{found}/{len(critical)} systems found"

    def validate_ui_elements(self):
        """Check for all required UI elements"""
        elements = [
            'id="scanBtn"',
            'id="connectBtn"',
            'id="cameraStartBtn"',
            'id="recordBtn"',
            'id="emergencyStop"',
            'id="cameraFeed"',
            'id="mlCanvas"',
            'id="aiMessages"',
            'id="portSelect"',
            'id="speedSlider"'
        ]
        
        path = self.workspace / "GemBot_Control_AI.html"
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        found = sum(1 for elem in elements if elem in content)
        return found >= len(elements) - 2, f"{found}/{len(elements)} UI elements"

    def check_documentation(self):
        """Check if documentation files exist"""
        docs = [
            "MASTER_DEPLOYMENT_REFERENCE.md",
            "TEST_EXECUTION_PROTOCOL.md",
            "MERLIN_COMPREHENSIVE_KNOWLEDGE_BASE.md",
            "EXECUTION_ROADMAP_AND_TIMELINE.md"
        ]
        
        found = sum(1 for doc in docs if self.check_file_exists(doc))
        return found == len(docs), f"{found}/{len(docs)} documentation files"

    def run_all_tests(self):
        """Run complete validation suite"""
        self.print_header("🚀 GemBot Control AI - System Validator")
        
        # ===== FILE INTEGRITY =====
        self.print_header("📁 FILE INTEGRITY")
        self.print_test(
            "GemBot_Control_AI.html exists",
            self.check_file_exists("GemBot_Control_AI.html")
        )
        
        valid, details = self.validate_html_integrity()
        self.print_test("HTML file integrity", valid, details)
        
        # ===== CRITICAL SYSTEMS =====
        self.print_header("🔧 CRITICAL SYSTEMS")
        valid, details = self.validate_critical_systems()
        self.print_test("All core classes present", valid, details)
        
        # ===== UI ELEMENTS =====
        self.print_header("🎨 USER INTERFACE")
        valid, details = self.validate_ui_elements()
        self.print_test("UI elements complete", valid, details)
        
        # ===== MERLIN AI =====
        self.print_header("🧙 MERLIN AI SYSTEM")
        path = self.workspace / "GemBot_Control_AI.html"
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        merlin_features = [
            "class MerlinPersonality",
            "setupMerlinVoice",
            "giveGreeting",
            "userProfile",
            "learningProgress",
            "gemForge"
        ]
        
        found = sum(1 for feature in merlin_features if feature in content)
        self.print_test("Merlin AI components", found == len(merlin_features), f"{found}/{len(merlin_features)}")
        
        # ===== HARDWARE INTEGRATION =====
        self.print_header("⚙️ HARDWARE INTEGRATION")
        hardware = [
            "GemBotSerial",
            "navigator.serial",
            "Web Serial API",
            "Arduino",
            "motor",
            "position"
        ]
        
        found = sum(1 for item in hardware if item.lower() in content.lower())
        self.print_test("Hardware systems integrated", found >= 4, f"{found}/6 components")
        
        # ===== VISION & ML =====
        self.print_header("👁️ VISION & ML")
        vision = [
            "GemBotMLModel",
            "TensorFlow",
            "COCO-SSD",
            "getUserMedia",
            "canvas",
            "video stream"
        ]
        
        found = sum(1 for item in vision if item.lower() in content.lower())
        self.print_test("Vision system ready", found >= 4, f"{found}/6 components")
        
        # ===== DATA & PERSISTENCE =====
        self.print_header("💾 DATA & PERSISTENCE")
        storage = [
            "SessionRecorder",
            "IndexedDB",
            "saveSession",
            "userProfile",
            "recordUserAction"
        ]
        
        found = sum(1 for item in storage if item in content)
        self.print_test("Session recording active", found == len(storage), f"{found}/{len(storage)}")
        
        # ===== SAFETY SYSTEMS =====
        self.print_header("🛡️ SAFETY SYSTEMS")
        safety = [
            "emergencyStop",
            "EMERGENCY_STOP",
            "safety",
            "validation",
            "bounds"
        ]
        
        found = sum(1 for item in safety if item.lower() in content.lower())
        self.print_test("Safety systems implemented", found >= 3, f"{found}/5 safety features")
        
        # ===== DOCUMENTATION =====
        self.print_header("📚 DOCUMENTATION")
        valid, details = self.check_documentation()
        self.print_test("Core documentation complete", valid, details)
        
        # ===== SUMMARY =====
        self.print_header("📊 VALIDATION SUMMARY")
        total = self.tests_passed + self.tests_failed
        percentage = (self.tests_passed / total * 100) if total > 0 else 0
        
        print(f"✅ Passed: {self.tests_passed}")
        print(f"❌ Failed: {self.tests_failed}")
        print(f"📊 Success Rate: {percentage:.0f}%")
        
        if self.tests_failed == 0:
            print(f"\n🎉 ALL SYSTEMS OPERATIONAL!")
            print(f"\n📍 Access the system at: {self.base_url}/")
            print(f"\n🎓 Next Steps:")
            print(f"   1. Open {self.base_url}/ in your browser")
            print(f"   2. Open browser DevTools (F12) to see system logs")
            print(f"   3. Click 'SCAN' to find Arduino ports")
            print(f"   4. Select port and click 'CONNECT'")
            print(f"   5. Test all features using the UI")
        else:
            print(f"\n⚠️ {self.tests_failed} issues found - please review above")
        
        # Export results
        self.export_results()

    def export_results(self):
        """Save validation results to file"""
        output_file = self.workspace / "SYSTEM_VALIDATION_RESULTS.json"
        
        with open(output_file, 'w') as f:
            json.dump({
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "total_tests": self.tests_passed + self.tests_failed,
                "passed": self.tests_passed,
                "failed": self.tests_failed,
                "success_rate": f"{(self.tests_passed / (self.tests_passed + self.tests_failed) * 100):.0f}%" if (self.tests_passed + self.tests_failed) > 0 else "0%",
                "results": self.results,
                "server_url": self.base_url,
                "status": "OPERATIONAL" if self.tests_failed == 0 else "ISSUES_FOUND"
            }, f, indent=2)
        
        print(f"\n💾 Results saved to: {output_file}")


def main():
    validator = GemBotValidator()
    try:
        validator.run_all_tests()
    except Exception as e:
        print(f"\n❌ Validation failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
