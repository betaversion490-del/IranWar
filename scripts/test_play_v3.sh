#!/bin/bash
# Play through all 8 turns - assumes game is already started

play_turn() {
  # Flip first available card
  agent-browser eval "(function(){document.querySelector('button[aria-label*=ورق]')?.click(); return 'ok';})()" > /dev/null 2>&1
  sleep 1
  # Click play button
  agent-browser eval "(function(){document.querySelector('button.w-full.py-2')?.click(); return 'ok';})()" > /dev/null 2>&1
  sleep 2
  # Click continue
  agent-browser eval "(function(){const b = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ادامه نوبت') || b.textContent.includes('مشاهده نتیجه') || b.textContent.includes('نتیجه نهایی')); b?.click(); return 'ok';})()" > /dev/null 2>&1
  sleep 1.5
}

# Start game
agent-browser find text "شروع بازی" click > /dev/null 2>&1
sleep 1
agent-browser find text "شروع شبیه‌سازی" click > /dev/null 2>&1
sleep 2

# Play 8 turns
for i in 1 2 3 4 5 6 7 8; do
  play_turn
  echo "Turn $i: $(agent-browser eval "document.querySelector('[class*=text-center]')?.innerText || 'splash'" 2>&1 | head -1 | head -c 30)"
done

# Check final
echo "--- Final ---"
agent-browser eval "document.body.innerText.includes('پایان محتمل آینده')" 2>&1 | head -3
agent-browser snapshot -i 2>&1 | grep -E "heading.*level=1" | head -3
