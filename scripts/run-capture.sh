#!/bin/bash
# اسکریپت اجرای سرور و capture screenshots

set -e

# اطمینان از اجرای سرور
ensure_server() {
  if ! curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
    echo "🔄 سرور اجرا نیست. در حال اجرا..."
    pkill -9 -f "next" 2>/dev/null || true
    sleep 2
    cd /home/z/my-project
    PORT=3000 HOSTNAME=0.0.0.0 setsid node .next/standalone/server.js > /home/z/my-project/dev.log 2>&1 < /dev/null &
    disown
    # صبر برای آماده شدن سرور
    for i in 1 2 3 4 5 6 7 8 9 10; do
      sleep 2
      if curl -s -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
        echo "✅ سرور اجرا شد"
        return 0
      fi
    done
    echo "❌ سرور اجرا نشد"
    return 1
  fi
  echo "✅ سرور در حال اجراست"
}

# اجرای سرور
ensure_server

# اجرای اسکریپت Playwright
echo "📸 شروع capture screenshots..."
cd /home/z/my-project
node scripts/capture-endings.js 2>&1 || {
  echo "⚠️ خطا! تلاش مجدد..."
  ensure_server
  node scripts/capture-endings.js 2>&1
}

echo "✅ تمام شد"
