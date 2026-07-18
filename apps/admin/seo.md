# 📘 خطة SEO للـ Backend في منصة CMS

هذا الملف مرجع عملي لتصميم وتنفيذ دعم SEO على مستوى **Backend** داخل منصة **CMS متعددة المواقع**.
يمكن استخدامه كـ:

- مرجع تقني
- خطة تنفيذ (Roadmap)
- Checklist للمراجعة قبل الإطلاق

---

## 🎯 الهدف

بناء CMS:

- يفرض SEO الجيد افتراضيًا
- يخدم عشرات / مئات المواقع
- يسهّل على Frontend (خصوصًا Next.js) العمل بدون منطق SEO معقّد

---

## 1️⃣ SEO ككيان أساسي (First-Class Feature)

### 📦 SEO Object (إجباري لكل محتوى)

```json
{
  "metaTitle": "",
  "metaDescription": "",
  "keywords": [],
  "canonical": null,
  "index": true,
  "follow": true,
  "ogImage": null
}
```

🔒 قواعد:

- لا نشر بدون Meta Title
- Description ≤ 160 حرف
- fallback من العنوان الأساسي إن لم يُحدد

---

## 2️⃣ إدارة الـ Slug (حرج جدًا)

### المتطلبات:

- فريد داخل نفس الموقع
- ثابت بعد النشر
- دعم العربي والإنجليزي

### عند التغيير:

- إنشاء Redirect تلقائي (301)
- تخزين السجل

```json
{
  "oldSlug": "/blog/old",
  "newSlug": "/blog/new",
  "type": 301
}
```

---

## 3️⃣ إعدادات SEO على مستوى الموقع (Global)

```json
{
  "siteName": "Example Site",
  "defaultMetaTitle": "%title% | Example",
  "defaultMetaDescription": "",
  "defaultOgImage": "",
  "language": "ar",
  "timezone": "Asia/Riyadh"
}
```

🧠 تستخدم تلقائيًا إذا لم يُحدد SEO خاص بالمحتوى.

---

## 4️⃣ Sitemap Generator (لكل موقع)

### خصائص:

- ديناميكي
- يدعم أنواع المحتوى
- يدعم اللغات

```txt
/site/{siteId}/sitemap.xml
/site/{siteId}/sitemap-ar.xml
```

لكل URL:

- loc
- lastmod
- changefreq
- priority

---

## 5️⃣ Robots.txt Manager

إعدادات قابلة للتحكم من لوحة التحكم:

- Allow / Disallow
- noindex للمواقع التجريبية

```txt
User-agent: *
Allow: /
Disallow: /admin
```

---

## 6️⃣ Structured Data (Schema Builder)

### الأنواع المدعومة:

- Article
- Page
- Product
- Course
- FAQ
- Organization

Backend يُرجع JSON جاهز:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "",
  "author": "",
  "datePublished": ""
}
```

---

## 7️⃣ Multi-language SEO (i18n)

لكل محتوى:

```json
{
  "lang": "ar",
  "slug": "",
  "alternates": {
    "en": "/en/blog/example"
  }
}
```

🔗 استخدام hreflang في Frontend.

---

## 8️⃣ SEO Validation قبل النشر ⭐

### Checks:

- Title length
- Description length
- Slug صالح
- محتوى غير فارغ
- OG Image موجودة

```json
{
  "seoScore": 85,
  "warnings": ["Meta description too long"]
}
```

ميزة تنافسية قوية جدًا.

---

## 9️⃣ Status Codes & Visibility

| الحالة    | HTTP          | SEO |
| --------- | ------------- | --- |
| Draft     | 404           | ❌  |
| Published | 200           | ✅  |
| Archived  | 410           | ❌  |
| Private   | 401 / noindex | ❌  |

---

## 🔌 API Contract مع Frontend

```json
{
  "render": {
    "title": "",
    "meta": {},
    "schema": {},
    "content": ""
  }
}
```

Frontend = عرض فقط، بدون منطق SEO.

---

## 🗺️ Roadmap تنفيذ مقترح

### Phase 1 (Core)

- SEO Object
- Slug system
- Global SEO

### Phase 2 (Search Engines)

- Sitemap
- Robots
- Status Codes

### Phase 3 (Advanced)

- Schema Builder
- i18n SEO
- Redirect Manager

### Phase 4 (Pro Features)

- SEO Validation
- SEO Score
- Warnings & Tips

---

## ✅ Checklist قبل الإطلاق

- [ ] لا محتوى بدون SEO
- [ ] Slug فريد + Redirects
- [ ] Sitemap يعمل
- [ ] Robots مضبوط
- [ ] Schema مفعّل
- [ ] i18n جاهز
- [ ] Status codes صحيحة

---

📌 **ملاحظة:**
إذا نُفّذت هذه الخطة صح → منصتك تتفوّق على أغلب Headless CMS الموجودة.
