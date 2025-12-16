"""
═══════════════════════════════════════════════════════════════════════════════
GEMBOT 15-DOMAIN CONFIG GENERATOR
═══════════════════════════════════════════════════════════════════════════════
Automatically generates customized Squarespace header code for all 15 domains
Owner: Ryan Barbrick / Barbrick Design
═══════════════════════════════════════════════════════════════════════════════
"""

import os

# Domain configurations
DOMAINS = [
    {
        'name': 'betterbook.co.uk',
        'theme': 'Knowledge Hub',
        'id': 'hub-001',
        'primary': '#8B4513',
        'secondary': '#F5DEB3',
        'accent': '#FFD700',
        'agents': ['librarian', 'critic', 'publisher', 'storyteller'],
        'count': 4,
        'prefix': 'Book',
        'personality': 'British Scholar',
        'greeting': 'Welcome to the library of knowledge, dear reader!',
        'avatar': '📚',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '📚'
    },
    {
        'name': 'electrical-airplane.com',
        'theme': 'Aviation Hub',
        'id': 'hub-002',
        'primary': '#4A90E2',
        'secondary': '#C0C0C0',
        'accent': '#00D4FF',
        'agents': ['aviator', 'engineer', 'navigator', 'designer'],
        'count': 4,
        'prefix': 'Sky',
        'personality': 'Aviation Engineer',
        'greeting': 'Cleared for takeoff! Welcome to electric aviation central.',
        'avatar': '✈️',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '✈️'
    },
    {
        'name': 'hermeticmicro.com',
        'theme': 'Esoteric Tech Hub',
        'id': 'hub-003',
        'primary': '#6A0DAD',
        'secondary': '#FFD700',
        'accent': '#9F7AEA',
        'agents': ['mystic', 'transmuter', 'seer', 'cryptographer'],
        'count': 4,
        'prefix': 'Hermes',
        'personality': 'Hermetic Master',
        'greeting': 'As above, so below. Welcome, seeker of hidden knowledge.',
        'avatar': '🔮',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '🔮'
    },
    {
        'name': 'madeinnatoalliance.org',
        'theme': 'Defense Hub',
        'id': 'hub-004',
        'primary': '#003366',
        'secondary': '#556B2F',
        'accent': '#4169E1',
        'agents': ['commander', 'guardian', 'analyst', 'coordinator'],
        'count': 4,
        'prefix': 'Defense',
        'personality': 'Military Strategist',
        'greeting': 'NATO Defense Hub operational. All systems secure.',
        'avatar': '🛡️',
        'marketplace': True,
        'wallet': True,
        '3d': False,
        'game': True,
        'icon': '🛡️'
    },
    {
        'name': 'messier-45.com',
        'theme': 'Space Hub',
        'id': 'hub-005',
        'primary': '#000033',
        'secondary': '#4682B4',
        'accent': '#00FFFF',
        'agents': ['astronomer', 'explorer', 'mapper', 'calculator'],
        'count': 4,
        'prefix': 'Star',
        'personality': 'Astronomer',
        'greeting': 'Welcome to the Pleiades. The stars await your discovery.',
        'avatar': '🌌',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '🌌'
    },
    {
        'name': 'oc-tc.com',
        'theme': 'Corporate Hub',
        'id': 'hub-006',
        'primary': '#2C3E50',
        'secondary': '#95A5A6',
        'accent': '#3498DB',
        'agents': ['executive', 'dealer', 'analyst', 'negotiator'],
        'count': 4,
        'prefix': 'Biz',
        'personality': 'Business Consultant',
        'greeting': 'Welcome to the corporate command center. Let\'s make deals.',
        'avatar': '🏢',
        'marketplace': True,
        'wallet': True,
        '3d': False,
        'game': True,
        'icon': '🏢'
    },
    {
        'name': 'orioncrusader.com',
        'theme': 'Military Strategy Hub',
        'id': 'hub-007',
        'primary': '#8B0000',
        'secondary': '#C0C0C0',
        'accent': '#FF4500',
        'agents': ['commander', 'tactician', 'coordinator', 'advisor'],
        'count': 4,
        'prefix': 'Crusader',
        'personality': 'War Strategist',
        'greeting': 'Onward, Crusader! Victory awaits the strategic mind.',
        'avatar': '⚔️',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '⚔️'
    },
    {
        'name': 'realhogwarts.com',
        'theme': 'Magic Education Hub',
        'id': 'hub-008',
        'primary': '#740001',
        'secondary': '#FFD700',
        'accent': '#FFFFFF',
        'agents': ['teacher', 'instructor', 'scholar', 'alchemist'],
        'count': 4,
        'prefix': 'Professor',
        'personality': 'Headmaster Wizard',
        'greeting': 'Welcome to Hogwarts! Your magical education begins now.',
        'avatar': '🏰',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '🏰'
    },
    {
        'name': 'robertcrobertsoniii.com',
        'theme': 'Personal Brand Hub',
        'id': 'hub-009',
        'primary': '#1C2841',
        'secondary': '#D4AF37',
        'accent': '#4A90E2',
        'agents': ['ambassador', 'curator', 'connector', 'archivist'],
        'count': 4,
        'prefix': 'Brand',
        'personality': 'Personal Advisor',
        'greeting': 'Welcome! Explore the portfolio and legacy of Robert C. Robertson III.',
        'avatar': '👤',
        'marketplace': True,
        'wallet': True,
        '3d': False,
        'game': False,
        'icon': '👤'
    },
    {
        'name': 'the-autobots.com',
        'theme': 'Robotics Hub',
        'id': 'hub-010',
        'primary': '#DC143C',
        'secondary': '#4169E1',
        'accent': '#00CED1',
        'agents': ['leader', 'scout', 'protector', 'engineer'],
        'count': 4,
        'prefix': 'Autobot',
        'personality': 'Cybertronian Sage',
        'greeting': 'Autobots, roll out! Welcome to the robotic revolution.',
        'avatar': '🤖',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '🤖'
    },
    {
        'name': 'theduesenberg.com',
        'theme': 'Luxury Craftsmanship Hub',
        'id': 'hub-011',
        'primary': '#800020',
        'secondary': '#FFD700',
        'accent': '#C0C0C0',
        'agents': ['curator', 'artisan', 'historian', 'dealer'],
        'count': 4,
        'prefix': 'Luxury',
        'personality': 'Luxury Connoisseur',
        'greeting': 'Welcome to the world of timeless elegance and craftsmanship.',
        'avatar': '🚗',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '🚗'
    },
    {
        'name': 'topofthepyramid.org',
        'theme': 'Elite Network Hub',
        'id': 'hub-012',
        'primary': '#FFD700',
        'secondary': '#FFFFFF',
        'accent': '#000000',
        'agents': ['executive', 'coordinator', 'strategist', 'advisor'],
        'count': 4,
        'prefix': 'Apex',
        'personality': 'Elite Mentor',
        'greeting': 'You\'ve reached the summit. Welcome to elite excellence.',
        'avatar': '🔺',
        'marketplace': True,
        'wallet': True,
        '3d': False,
        'game': True,
        'icon': '🔺'
    },
    {
        'name': 'trismegistus-capital.com',
        'theme': 'Finance Hub',
        'id': 'hub-013',
        'primary': '#228B22',
        'secondary': '#FFD700',
        'accent': '#32CD32',
        'agents': ['investor', 'trader', 'advisor', 'controller'],
        'count': 4,
        'prefix': 'Capital',
        'personality': 'Investment Wizard',
        'greeting': 'Welcome to Trismegistus Capital. Your wealth awaits.',
        'avatar': '💰',
        'marketplace': True,
        'wallet': True,
        '3d': False,
        'game': True,
        'icon': '💰'
    },
    {
        'name': 'trismegistustech.com',
        'theme': 'Technology Hub',
        'id': 'hub-014',
        'primary': '#0080FF',
        'secondary': '#00FFFF',
        'accent': '#FFFFFF',
        'agents': ['developer', 'innovator', 'architect', 'engineer'],
        'count': 4,
        'prefix': 'Dev',
        'personality': 'Tech Guru',
        'greeting': 'Welcome to the bleeding edge of technology innovation.',
        'avatar': '💻',
        'marketplace': True,
        'wallet': True,
        '3d': True,
        'game': True,
        'icon': '💻'
    },
    {
        'name': 'truetemple.org',
        'theme': 'Spiritual Hub',
        'id': 'hub-015',
        'primary': '#FFD700',
        'secondary': '#FFFFFF',
        'accent': '#9370DB',
        'agents': ['guardian', 'sage', 'coordinator', 'teacher'],
        'count': 4,
        'prefix': 'Temple',
        'personality': 'Spiritual Master',
        'greeting': 'Welcome, seeker. The temple doors are open to all.',
        'avatar': '🕉️',
        'marketplace': True,
        'wallet': True,
        '3d': False,
        'game': True,
        'icon': '🕉️'
    }
]

def load_template():
    """Load the template file"""
    with open('DOMAIN_TEMPLATE.html', 'r', encoding='utf-8') as f:
        return f.read()

def generate_config(domain, template):
    """Generate customized config for a domain"""
    config = template
    
    # Replace placeholders
    replacements = {
        '{{DOMAIN_NAME}}': domain['name'],
        '{{DOMAIN_THEME}}': domain['theme'],
        '{{DOMAIN_ID}}': domain['id'],
        '{{PRIMARY_COLOR}}': domain['primary'],
        '{{SECONDARY_COLOR}}': domain['secondary'],
        '{{ACCENT_COLOR}}': domain['accent'],
        '{{AGENT_TYPES}}': ', '.join([f"'{a}'" for a in domain['agents']]),
        '{{AGENT_COUNT}}': str(domain['count']),
        '{{AGENT_PREFIX}}': domain['prefix'],
        '{{MERLIN_PERSONALITY}}': domain['personality'],
        '{{MERLIN_GREETING}}': domain['greeting'],
        '{{MERLIN_AVATAR}}': domain['avatar'],
        '{{ENABLE_MARKETPLACE}}': 'true' if domain['marketplace'] else 'false',
        '{{ENABLE_WALLET}}': 'true' if domain['wallet'] else 'false',
        '{{ENABLE_3D}}': 'true' if domain['3d'] else 'false',
        '{{ENABLE_GAME}}': 'true' if domain['game'] else 'false',
        '{{DOMAIN_ICON}}': domain['icon']
    }
    
    for placeholder, value in replacements.items():
        config = config.replace(placeholder, value)
    
    return config

def main():
    """Generate all domain configs"""
    print("🚀 GemBot Multi-Domain Config Generator")
    print("═" * 60)
    
    # Load template
    print("\n📄 Loading template...")
    template = load_template()
    print("✅ Template loaded!")
    
    # Create output directory
    output_dir = 'domain-configs'
    os.makedirs(output_dir, exist_ok=True)
    print(f"\n📁 Output directory: {output_dir}/")
    
    # Generate configs
    print("\n🔧 Generating configurations...")
    for i, domain in enumerate(DOMAINS, 1):
        config = generate_config(domain, template)
        
        # Save to file
        filename = f"{domain['name'].replace('.', '_')}_INJECT.html"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(config)
        
        print(f"  [{i:2d}/15] ✅ {domain['name']:<30} → {filename}")
    
    print("\n" + "═" * 60)
    print("✅ All 15 domain configs generated successfully!")
    print(f"\n📂 Files saved to: ./{output_dir}/")
    print("\n🚀 Next Steps:")
    print("  1. Open each file in the domain-configs/ folder")
    print("  2. Copy the entire contents")
    print("  3. Go to Squarespace: Settings → Advanced → Code Injection")
    print("  4. Paste in HEADER section")
    print("  5. Save and visit your site!")
    print("\n💡 Tip: Deploy to 2-3 pilot domains first, test, then scale!")
    print("═" * 60)

if __name__ == '__main__':
    main()
