// شبیه‌سازی بازی و گرفتن screenshot از هر پایان
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/z/my-project/download/endings-screenshots';
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// مسیرهای برد (هر کدام به یک پایان خاص ختم می‌شوند)
const WIN_PATHS = [
  {
    name: 'nuclear_deterrence',
    label: 'بمب اتم - بازدارندگی هسته‌ای',
    cards: ['iran_npt_withdraw', 'iran_patience', 'iran_china_deal', 'iran_npt_withdraw', 'iran_patience', 'iran_russia_alliance', 'iran_nuclear_breakout'],
    expectedEnding: 'iran_nuclear_deterrence',
  },
  {
    name: 'comprehensive_peace',
    label: 'صلح جامع',
    cards: ['iran_diplomacy', 'iran_patience', 'iran_diplomacy'],
    expectedEnding: 'comprehensive_peace',
  },
  {
    name: 'us_withdrawal',
    label: 'خروج آمریکا از خاورمیانه',
    cards: ['iran_russia_alliance', 'iran_china_deal', 'iran_hezbollah_full', 'iran_patience'],
    expectedEnding: 'us_withdrawal_ambition',
  },
  {
    name: 'israel_weakening',
    label: 'انزوای استراتژیک اسرائیل',
    cards: ['iran_hezbollah_full', 'iran_houthi', 'iran_iraq_militias', 'iran_missile_strike', 'iran_patience'],
    expectedEnding: 'israel_strategic_weakening',
  },
  {
    name: 'strategic_defeat',
    label: 'شکست استراتژیک (بازی تهاجمی بی‌رویه)',
    cards: ['iran_hezbollah_full', 'iran_hormuz', 'iran_missile_strike', 'iran_houthi', 'iran_missile_strike', 'iran_hormuz', 'iran_hezbollah_full', 'iran_houthi'],
    expectedEnding: 'regime_change_from_within', // در واقع به این ختم می‌شود
  },
  {
    name: 'regime_change',
    label: 'تغییر رژیم (فروپاشی اقتصادی)',
    cards: ['iran_hormuz', 'iran_oil_weapon', 'iran_hormuz', 'iran_oil_weapon'],
    expectedEnding: 'regime_change_from_within',
  },
];

async function simulatePath(page, pathInfo) {
  console.log(`\n🎮 شبیه‌سازی: ${pathInfo.label}`);

  // اطمینان از اجرای سرور قبل از هر مسیر
  let retries = 3;
  while (retries > 0) {
    try {
      await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle', timeout: 15000 });
      break;
    } catch (e) {
      retries--;
      if (retries === 0) throw e;
      console.log(`  ⚠️ تلاش مجدد (${3 - retries}/3)...`);
      await page.waitForTimeout(3000);
    }
  }
  await page.waitForTimeout(1500);

  // شروع بازی از طریق store API
  await page.evaluate(() => {
    if (window.__gameStore) {
      window.__gameStore.getState().startGame();
    }
  });
  await page.waitForTimeout(2000);

  // گرفتن screenshot از صفحه بازی اولیه
  await page.screenshot({
    path: path.join(OUTPUT_DIR, `${pathInfo.name}-01-game-start.png`),
    fullPage: false,
  });

  // بازی کارت‌ها
  for (let i = 0; i < pathInfo.cards.length; i++) {
    const cardId = pathInfo.cards[i];
    console.log(`  نوبت ${i + 1}: بازی کارت ${cardId}`);

    // بازی کارت
    const result = await page.evaluate((id) => {
      if (!window.__gameStore) return { ok: false, reason: 'no store' };
      const store = window.__gameStore.getState();
      if (store.isResolving) return { ok: false, reason: 'resolving' };

      // بررسی آیا کارت قابل بازی است
      const cost = 4; // default
      if (store.iranElixir < cost) {
        // افزایش دستی elixir برای تست
        window.__gameStore.setState({ iranElixir: 10 });
      }

      try {
        store.playCard(id);
        return { ok: true };
      } catch (e) {
        return { ok: false, reason: e.message };
      }
    }, cardId);

    if (!result.ok) {
      console.log(`    ⚠️ کارت بازی نشد: ${result.reason}`);
      // اگر کارت بازی نشد، صبر کن و دوباره
      await page.waitForTimeout(2000);
      continue;
    }

    await page.waitForTimeout(1500);

    // screenshot از حالت resolve
    await page.screenshot({
      path: path.join(OUTPUT_DIR, `${pathInfo.name}-${String(i + 2).padStart(2, '0')}-after-card.png`),
      fullPage: false,
    });

    // چک کن آیا به پایان رسیده
    const phase = await page.evaluate(() => window.__gameStore?.getState().phase);
    if (phase === 'ending') {
      console.log(`  🏁 پایان بازی!`);
      break;
    }

    // ادامه به نوبت بعد
    await page.evaluate(() => {
      if (window.__gameStore) {
        window.__gameStore.getState().nextTurn();
      }
    });
    await page.waitForTimeout(1000);

    // چک دوباره
    const phase2 = await page.evaluate(() => window.__gameStore?.getState().phase);
    if (phase2 === 'ending') {
      console.log(`  🏁 پایان بازی!`);
      break;
    }
  }

  // صبر برای نمایش صفحه پایان
  await page.waitForTimeout(2000);

  // screenshot از صفحه پایان
  const endingPath = path.join(OUTPUT_DIR, `${pathInfo.name}-ENDING.png`);
  await page.screenshot({
    path: endingPath,
    fullPage: true,
  });
  console.log(`  📸 screenshot پایان: ${endingPath}`);

  // دریافت اطلاعات پایان
  const endingInfo = await page.evaluate(() => {
    const store = window.__gameStore?.getState();
    return {
      phase: store?.phase,
      endingId: store?.ending?.id,
      endingName: store?.ending?.name,
      probability: store?.endingProbability,
    };
  });
  console.log(`  📊 پایان: ${endingInfo.endingName || endingInfo.endingId || 'نامشخص'} (${(endingInfo.probability * 100 || 0).toFixed(0)}%)`);

  return endingInfo;
}

async function main() {
  console.log('🚀 راه‌اندازی مرورگر...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    locale: 'fa-IR',
  });
  const page = await context.newPage();

  const results = [];

  for (const pathInfo of WIN_PATHS) {
    try {
      const info = await simulatePath(page, pathInfo);
      results.push({ ...pathInfo, actual: info });
    } catch (e) {
      console.error(`❌ خطا در ${pathInfo.name}:`, e.message);
      results.push({ ...pathInfo, error: e.message });
    }
  }

  // گزارش نهایی
  console.log('\n=== گزارش نهایی ===');
  for (const r of results) {
    const status = r.actual?.endingId === r.expectedEnding ? '✅' : '⚠️';
    console.log(`${status} ${r.label}: ${r.actual?.endingName || r.error || 'نامشخص'}`);
  }

  await browser.close();
  console.log(`\n📸 تمام screenshots در: ${OUTPUT_DIR}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
