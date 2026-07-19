#!/bin/bash
# Quick play-through test: play 8 turns rapidly
# Each turn requires: click card to flip → click play → click continue

for i in 1 2 3 4 5 6 7 8; do
  # Check if continue button exists (after a turn has been played)
  CONT=$(agent-browser snapshot -i 2>&1 | grep -E "ادامه نوبت بعد|مشاهده نتیجه نهایی" | head -1 | sed -n 's/.*\[ref=\([^]]*\)\].*/\1/p')
  if [ -n "$CONT" ]; then
    agent-browser click @$CONT 2>&1 > /dev/null
    sleep 1.5
    continue
  fi

  # Check if we're in card selection phase (filter buttons exist)
  FILTER=$(agent-browser snapshot -i 2>&1 | grep -E "^- button \"همه\"" | head -1 | sed -n 's/.*\[ref=\([^]]*\)\].*/\1/p')
  if [ -n "$FILTER" ]; then
    # Find first available (not yet played) card
    # Look for cards that say "برای جزئیات ضربه" (means not flipped)
    CARD=$(agent-browser snapshot -i 2>&1 | grep -E "برای جزئیات ضربه" | grep -v "استفاده شد" | head -1 | sed -n 's/.*\[ref=\([^]]*\)\].*/\1/p')
    
    # If no unplayed cards, take any card
    if [ -z "$CARD" ]; then
      CARD=$(agent-browser snapshot -i 2>&1 | grep -E "برای جزئیات ضربه" | head -1 | sed -n 's/.*\[ref=\([^]]*\)\].*/\1/p')
    fi
    
    if [ -n "$CARD" ]; then
      agent-browser click @$CARD 2>&1 > /dev/null
      sleep 1
      # Now click play button
      PLAY=$(agent-browser snapshot -i 2>&1 | grep "بازی کردن این کارت" | head -1 | sed -n 's/.*\[ref=\([^]]*\)\].*/\1/p')
      if [ -n "$PLAY" ]; then
        agent-browser click @$PLAY 2>&1 > /dev/null
        sleep 2
      fi
    fi
  fi
done
echo "--- Final state ---"
agent-browser eval "document.querySelector('[class*=text-center]')?.innerText" 2>&1
agent-browser snapshot -i 2>&1 | grep -E "(heading.*level=1|مشاهده نتیجه|ادامه نوبت)" | head -5
