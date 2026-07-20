#!/bin/bash
# Package the game source code into a versioned zip file in the download folder.

set -e

PROJECT_DIR="/home/z/my-project"
DOWNLOAD_DIR="${PROJECT_DIR}/download"
VERSION="6.0.0"
ZIP_NAME="middle-east-strategic-game-v${VERSION}.zip"
ZIP_PATH="${DOWNLOAD_DIR}/${ZIP_NAME}"

mkdir -p "${DOWNLOAD_DIR}"
rm -f "${ZIP_PATH}"

# Create a staging folder with only the source files
STAGING=$(mktemp -d)
trap 'rm -rf "${STAGING}"' EXIT

echo "[1/4] Staging source files..."
mkdir -p "${STAGING}/middle-east-strategic-game"
cd "${PROJECT_DIR}"

# Copy only relevant source files (exclude build artifacts, caches, downloads, etc.)
COPY_PATHS=(
  "src"
  "public"
  "prisma"
  "mini-services"
  "examples"
  "RESEARCH.md"
  "GAME_TREE.md"
  "DECISION_TREE.pdf"
  "RESEARCH_DOCUMENT.pdf"
  "package.json"
  "package-lock.json"
  "bun.lock"
  "tsconfig.json"
  "next.config.ts"
  "tailwind.config.ts"
  "postcss.config.mjs"
  "eslint.config.mjs"
  "components.json"
  "Caddyfile"
  ".gitignore"
  ".env.example"
)

for path in "${COPY_PATHS[@]}"; do
  if [ -e "${path}" ]; then
    cp -r "${path}" "${STAGING}/middle-east-strategic-game/"
  fi
done

# Add a README
cat > "${STAGING}/middle-east-strategic-game/README.md" << 'README'
# بازی بزرگ خاورمیانه | ایران در برابر آمریکا و اسرائیل

یک بازی استراتژیک تعاملی تحت وب که تاریخچه کامل مناسبات و درگیری‌های ایران، آمریکا و
اسرائیل از ۱۹۵۳ تا ۲۰۲۵ را شبیه‌سازی می‌کند. بازیکن نقش ایران را بر عهده می‌گیرد و با
انتخاب کارت‌های استراتژیک، آینده منطقه را رقم می‌زند.

## ویژگی‌ها

- **تاریخچه گرافیکی**: ۷ دوران کلیدی از کودتای ۲۸ مرداد تا جنگ مستقیم ۲۰۲۴-۲۰۲۵
- **۲۸ کارت استراتژیک**: ۱۲ کارت ایران (بازیکن) + ۸ کارت آمریکا + ۸ کارت اسرائیل
- **۸ پایان محتمل**: از بمب اتم تا جنگ تمام‌عیار، از توافق تا تغییر رژیم
- **هوش مصنوعی**: دشمنان بر اساس وزن‌دهی احتمالی پاسخ می‌دهند
- **۶ شاخص حیاتی**: پیشرفت هسته‌ای، بازدارندگی، اقتصاد، حمایت داخلی، توان نظامی، نفوذ منطقه‌ای
- **واکنش‌گرا**: طراحی موبایل-اول با پشتیبانی کامل RTL و فونت فارسی Vazirmatn

## نصب و اجرا

```bash
# نصب وابستگی‌ها
bun install   # یا npm install

# اجرای محیط توسعه
bun run dev   # بازدید از http://localhost:3000

# ساخت نسخه تولید
bun run build

# اجرای نسخه تولید
bun run start
```

## ساختار پروژه

- `src/app/` - صفحات اصلی Next.js 16
- `src/components/game/` - کامپوننت‌های بازی (Splash, Intro, History, Game, Ending)
- `src/lib/game/` - داده‌ها و منطق بازی (تاریخ، کارت‌ها، پایان‌ها، Zustand store)
- `prisma/` - اسکیمای دیتابیس

## تکنولوژی‌ها

- Next.js 16 با App Router
- TypeScript 5
- Tailwind CSS 4 + shadcn/ui
- Framer Motion برای انیمیشن‌ها
- Zustand برای مدیریت وضعیت
- فونت Vazirmatn برای فارسی RTL

## نکته

این بازی بر اساس وقایع مستند تاریخی ساخته شده اما سناریوهای آینده تحلیلی-احتمالی هستند
و منعکس‌کننده موقعیت رسمی هیچ‌یک از طرف‌ها نیست. هدف، درک بهتر پیچیدگی‌های ژئوپلیتیک منطقه است.

نسخه: 2.0.0

## تغییرات نسخه 2.0.0 - بازنویسی جامع

### تحقیق پایه
بر اساس تحلیل ژئوپلیتیک کامل (نظریه بازدارندگی، مدل‌های کره شمالی/پاکستان/هند،
سابقه پاسخ‌های آمریکا/اسرائیل/ناتو/عربستان) بازنویسی شد.

### ۱. حذف شاخص فشار دشمن
- حذف کامل «فشار آمریکا» و «تهدید اسرائیل» به‌عنوان شاخص
- تمرکز روی ۶ شاخص ایران: هسته‌ای، بازدارندگی، نظامی، اقتصاد، حمایت داخلی، نفوذ منطقه‌ای

### ۲. ۴۰+ کارت استراتژیک
- ۲۰ کارت ایران (شامل کارت‌های جدید: دریافت کلاهک از کره شمالی، اتحاد با روسیه، پکت چین، عادی‌سازی با عربستان)
- ۱۵ کارت آمریکا
- ۱۵ کارت اسرائیل
- ۸ کارت ائتلاف عربی (عربستان، امارات، بحرین، اردن، پاکستان)
- ۵ کارت ناتو (بریتانیا، فرانسه، اتحادیه اروپا)
- ۵ کارت متحدان: کره شمالی، روسیه، چین

### ۳. سیستم counter پیشرفته
- هر کارت ایران ۲-۳ کارت پاسخ واقعی از دشمنان دریافت می‌کند
- احتمالات بر اساس تحقیق (مثلاً بستن هرمز → ۸۵-۹۰٪ عملیات آزادسازی آمریکا)
- کارت‌های افراطی فقط در war escalation بالا انتخاب می‌شوند

### ۴. ۸ پایان نهایی واقعی
- جنگ فرسایشی طولانی (۴۰-۵۰٪ - محتمل‌ترین)
- ظهور بمب اتم ایران و بازدارندگی متقابل (۲۰-۲۵٪)
- خروج تدریجی آمریکا از خاورمیانه (۲۰-۲۵٪)
- توافق جامع و صلح پایدار (۱۵-۲۰٪)
- تغییر رژیم در ایران (۱۰-۱۵٪)
- شکست استراتژیک ایران (۱۰-۱۵٪)
- جنگ هسته‌ای منطقه‌ای (۵-۸٪)
- تضعیف استراتژیک اسرائیل (۳-۵٪)

### ۵. بهبودهای فنی
- کارت‌های ورق‌خور با نمایش جزئیات و گذشته مرتبط
- فیلتر کارت‌ها بر اساس ۱۰ دسته‌بندی
- گرافیک بهبودیافته با color coding بر اساس فاعل (آمریکا، اسرائیل، ائتلاف عربی، ناتو، کره شمالی، روسیه، چین)
- واکنش‌گرا روی موبایل و دسکتاپ
- فونت Vazirmatn، RTL کامل
README

echo "[2/4] Creating zip archive..."
cd "${STAGING}"
zip -r "${ZIP_PATH}" "middle-east-strategic-game" -x "*/node_modules/*" -x "*/.next/*" -x "*/dev.log" -x "*/server.log" -q

echo "[3/4] Cleaning up..."
rm -rf "${STAGING}"

echo "[4/4] Done!"
echo "Archive saved to: ${ZIP_PATH}"
ls -lh "${ZIP_PATH}"
