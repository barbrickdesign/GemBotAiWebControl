# GemBot Web Interface - Quick Command Reference
**December 6, 2025**

---

## 🎮 Web Command Cheat Sheet

### Menu Navigation (Existing)
```
'0'  →  ENTER / Select
'1'  →  LEFT  / Navigate Left
'2'  →  EXIT  / Close & Release Motors
'3'  →  RIGHT / Navigate Right
```

### Motor Control - NEW! (Web Only)
```
SPEED TOGGLE:
't'  →  Toggle PRECISION ↔ FAST mode

Y-AXIS (Up/Down):
'w'  →  Move Y UP    (1 step precision / 10 steps fast)
'z'  →  Move Y DOWN  (1 step precision / 10 steps fast)

X-AXIS (Left/Right):
'a'  →  Move X LEFT  (1 step precision / 5 steps fast)
'd'  →  Move X RIGHT (1 step precision / 5 steps fast)

P-AXIS (Angle Up/Down):
'q'  →  Move P UP    (1 step precision / 3 steps fast)
'e'  →  Move P DOWN  (1 step precision / 3 steps fast)
```

---

## 🔄 Quick Workflows

### Setup Facet (Fine Precision)
1. Start in PRECISION mode (default)
2. Send 'a' to move X left (fine-tune)
3. Send 'd' to move X right (fine-tune)
4. Send 'q' to adjust angle up
5. Send 'e' to adjust angle down
6. Send 'w' to move stone up from wheel

### Rapid Reposition (Fast Mode)
1. Send 't' → Switch to FAST mode
2. Send 'z' → Move stone to wheel quickly (10 steps)
3. Send 'a' → Move left rapidly (5 steps)
4. Send 'd' → Move right rapidly (5 steps)
5. Send 't' → Switch back to PRECISION mode
6. Fine-tune position with single steps

### Home Sequence (Safe)
1. Send menu ENTER to navigate to Home
2. If at 90°: Y automatically moves clear first
3. All axes home to zero position
4. P-axis homes to 90° safely

---

## 📊 Speed Comparison

| Mode | Y Movement | X Movement | P Movement | Best For |
|------|-----------|-----------|-----------|----------|
| **PRECISION** | 1 step | 1 step | 1 step | Fine-tuning, accuracy |
| **FAST** | 10 steps | 5 steps | 3 steps | Rapid repositioning |

---

## ⚡ Examples

**To move Y-axis to wheel quickly:**
```
t (switch to fast)
z z z (move down 30 steps total)
t (switch back to precision)
w (fine-tune up 1 step if needed)
```

**To index to next facet:**
```
t (switch to fast)
a (move left 5 steps)
e (rotate 3 steps)
t (switch back)
q (fine-tune 1 step if needed)
```

**To adjust angle precisely:**
```
(Already in precision mode)
q (move 1 step up)
q (move 1 step up)
e (move 1 step down)
(Perfect position ready for cutting)
```

---

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Movements too slow | Send 't' to toggle to FAST mode |
| Movements too fast | Send 't' to toggle to PRECISION mode |
| Can't fine-tune | Make sure in PRECISION mode ('t' to check) |
| Stone didn't move | Check motor power, verify command was sent |
| Home won't trigger | If at 90°, system auto-clears Y first (normal) |

---

## 📝 Notes

- Case INSENSITIVE: 'W' and 'w' do the same thing
- All motor commands work ONLY from web interface
- Touch screen manual control buttons are unchanged
- Menu commands (0,1,2,3) always work
- Speed mode affects ALL motors at once
- Each command is logged to Serial Monitor
