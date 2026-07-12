import os
import re

files_to_fix = [
    r"C:\Users\kesha\OneDrive\Desktop\nyay-setu\src\pages\citizen\StatusTracker.js",
    r"C:\Users\kesha\OneDrive\Desktop\nyay-setu\src\pages\citizen\RightsBot.js",
    r"C:\Users\kesha\OneDrive\Desktop\nyay-setu\src\pages\citizen\CourtCalendar.js",
    r"C:\Users\kesha\OneDrive\Desktop\nyay-setu\src\pages\citizen\LegalAidFinder.js",
    r"C:\Users\kesha\OneDrive\Desktop\nyay-setu\src\pages\citizen\FileComplaint.js",
]

replacements = [
    (r"'#08120f'", "'var(--bg-citizen)'"),
    (r'"#08120f"', "'var(--bg-citizen)'"),
    (r"'#d8ede6'", "'var(--text-citizen)'"),
    (r'"#d8ede6"', "'var(--text-citizen)'"),
    
    (r"'rgba\(216,237,230,0\.5\)'", "'var(--text-muted)'"),
    (r'"rgba\(216,237,230,0\.5\)"', "'var(--text-muted)'"),
    (r"'rgba\(216,237,230,0\.45\)'", "'var(--text-muted)'"),
    (r'"rgba\(216,237,230,0\.45\)"', "'var(--text-muted)'"),
    (r"'rgba\(216,237,230,0\.4\)'", "'var(--text-muted)'"),
    (r'"rgba\(216,237,230,0\.4\)"', "'var(--text-muted)'"),
    (r"'rgba\(216,237,230,0\.6\)'", "'var(--text-muted)'"),
    (r'"rgba\(216,237,230,0\.6\)"', "'var(--text-muted)'"),
    
    (r"'rgba\(216,237,230,0\.25\)'", "'var(--text-dim)'"),
    (r'"rgba\(216,237,230,0\.25\)"', "'var(--text-dim)'"),
    (r"'rgba\(216,237,230,0\.3\)'", "'var(--text-dim)'"),
    
    (r"'rgba\(255,255,255,0\.02\)'", "'var(--bg-card)'"),
    (r'"rgba\(255,255,255,0\.02\)"', "'var(--bg-card)'"),
    (r"'rgba\(255,255,255,0\.03\)'", "'var(--bg-card)'"),
    (r'"rgba\(255,255,255,0\.03\)"', "'var(--bg-card)'"),
    
    (r"'rgba\(255,255,255,0\.04\)'", "'var(--bg-input)'"),
    (r'"rgba\(255,255,255,0\.04\)"', "'var(--bg-input)'"),
    
    (r"'rgba\(255,255,255,0\.08\)'", "'var(--border-card)'"),
    (r'"rgba\(255,255,255,0\.08\)"', "'var(--border-card)'"),
    
    (r"border: '1px solid rgba\(255,255,255,0\.06\)'", "border: '1px solid var(--border-subtle)'"),
    (r"border: `1px solid \$\{?rgba\(255,255,255,0\.06\)\}?`", "border: '1px solid var(--border-subtle)'"),
    (r"'rgba\(255,255,255,0\.06\)'", "'var(--bg-card-hover)'"), # Assuming the remaining are backgrounds
]

for file_path in files_to_fix:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old, new in replacements:
            content = re.sub(old, new, content)
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {file_path}")
    else:
        print(f"File not found: {file_path}")
