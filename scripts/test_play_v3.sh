#!/bin/bash
# Play through all 8 turns - handles early endings

play_turn() {
  # Flip first available card
  agent-browser eval "(function(){document.querySelector('button[aria-label*=ورق]')?.click(); return 'ok';})()" > /dev/null 2>&1
  sleep 1
  # Click play button
  agent-browser eval "(function(){document.querySelector('button.w-full.py-2')?.click(); return 'ok';})()" > /dev/null 2>&1
  sleep 2
  # Click continue or end button
  agent-browser eval "(function(){
    const btn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('ادامه نوبت') ||
      b.textContent.includes('مشاهده نتیجه') ||
      b.textContent.includes('نتیجه نهایی') ||
      b.textContent.includes('مشاهده پایان')
    );
    if(btn) { btn.click(); return 'clicked: ' + btn.textContent; }
    return 'no button found';
  })()" 2>&1 | head -1
  sleep 2
}

# Start game
agent-browser find text "شروع بازی" click > /dev/null 2>&1
sleep 1
agent-browser find text "شروع شبیه‌سازی" click > /dev/null 2>&1
sleep 2

# Play up to 8 turns
for i in 1 2 3 4 5 6 7 8; do
  # Check if we're already at ending
  if agent-browser eval "document.body.innerText.includes('پایان محتمل')" 2>&1 | head -1 | grep -q "true"; then
    echo "Turn $i: Already at ending"
    break
  fi
  play_turn
  echo "Turn $i: $(agent-browser eval "document.querySelector('[class*=text-center]')?.innerText || 'ending'" 2>&1 | head -1 | head -c 40)"
done

# Check final
echo "--- Final ---"
agent-browser eval "document.body.innerText.includes('پایان محتمل')" 2>&1 | head -1
agent-browser snapshot -i 2>&1 | grep -E "heading.*level=1" | head -3
