# Page Builder & Customer-Facing Page Plan

## Goal
بناء نظام Page Builder كامل للـ CMS مع صفحة عرض عميل (customer-facing) مطابقة لتصميم demo12.wenqr.com

## Architecture Overview

```
Backend (موجود مسبقاً):
  Page → CRUD @ api/v1/cms/pages
  Content → CRUD @ api/v1/cms/contents
  ContentBlock → CRUD @ api/v1/cms/content-blocks
  Category → CRUD @ api/v1/cms/categories
  Template → CRUD @ api/v1/management/templates
  Module (=Component) → CRUD @ api/v1/cms/modules
  Delivery endpoints @ api/v1/delivery/...

Frontend (جديد):
  /admin/pages/          → Pages CRUD + Page Builder
  /admin/categories/     → Categories CRUD
  /admin/contents/       → Contents under a module
  /[slug]                → Customer-facing page
```

## Phase 1: إضافة TemplateId إلى Page

**ما يتغير:**
1. `CMS.Domain/Entities/Cms/Page.cs` — إضافة `public int? TemplateId` و `public Template? Template`
2. `CMS.Infrastructure/Persistence/EntityConfigurations/Cms/CmsEntityConfigurations.cs` — إضافة configuration للعلاقة مع Template (اختياري)
3. `CMS.Application/Features/Pages/Commands/Commands.cs` — إضافة `int? TemplateId` إلى CreatePageCommand
4. `CMS.Application/Features/Pages/DTOs/PageDto.cs` — إضافة `int? TemplateId`
5. `CMS.Application/Features/Pages/Handlers/CrudPageHandlers.cs` — تعيين TemplateId عند الإنشاء
6. `CMS.Application/Features/Pages/Queries/Queries.cs` — إضافة `GetPageBySlugQuery`
7. `CMS.Application/Features/Pages/Handlers/GetPagesHandler.cs` — إضافة GetPageBySlugHandler
8. إنشاء migration جديدة

## Phase 2: API Endpoints – إنشاء Page من Template

9. إضافة endpoint جديد في `PagesController`:
   - `POST api/v1/cms/pages/from-template` — ينشئ page + يقرأ ContentJson من template + ينشئ Contents
   - يقسم ContentJson sections → يبحث عن Module مطابق لكل section → ينشئ Content records

## Phase 3: Frontend – Categories CRUD

10. `panel/apps/cms/src/components/views/categories/index.tsx`
11. `panel/apps/cms/src/components/views/categories/columns.tsx`
12. `panel/apps/cms/src/components/views/categories/create-update.tsx`
13. `panel/apps/cms/src/app/admin/categories/page.tsx`
14. `panel/apps/cms/src/api/repostories/categories.ts`

## Phase 4: Frontend – Pages CRUD + Page Builder

15. `panel/apps/cms/src/components/views/pages/index.tsx` — قائمة الصفحات
16. `panel/apps/cms/src/components/views/pages/columns.tsx` — أعمدة
17. `panel/apps/cms/src/components/views/pages/create-update.tsx` — إنشاء/تعديل مع اختيار Template
18. `panel/apps/cms/src/app/admin/pages/[action]/[id]/page.tsx` — صفحة إنشاء
19. `panel/apps/cms/src/app/admin/pages/page.tsx` — الصفحة الرئيسية
20. `panel/apps/cms/src/api/repostories/pages.ts`

### Page Builder (Detail Page)
21. `panel/apps/cms/src/components/views/pages/detail/index.tsx` — يعرض هيكل الصفحة
    - إذا للصفحة Template → يعرض template sections
    - لكل section → يعرض Contents المرتبطة
    - يسمح بتحرير Content inline
22. `panel/apps/cms/src/app/admin/pages/detail/[id]/page.tsx`

## Phase 5: Customer-Facing Page

23. إنشاء صفحة عرض في Next.js (app router) matching demo design:
    - Header مع logo + navigation
    - Hero section
    - Categories grid (صور)
    - Contents list (menu items مع أسعار)
    - Theme colors من API
    - Footer مع info

## Phase 6: تحديث التكوين

24. تحديث `route_paths.ts` — إضافة paths للـ pages و categories
25. تحديث `sidebarItems.tsx` — إضافة Categories (Pages موجودة أصلاً)
26. تحديث `app.config.tsx` — إضافة Categories

## Key Design Decisions

1. **Template → Page → Contents flow:**
   - Template.ContentJson لها structure: `{ sections: [{ type: "hero", moduleSlug: "hero" }, ...] }`
   - عند إنشاء Page من Template، لكل section في ContentJson، يتم البحث عن Module بنفس الـ slug
   - يتم إنشاء Content record لكل section، مرتبط بالـ Module
   - الـ Page تختزن TemplateId للرجوع إليه لاحقاً

2. **Customer-facing page:**
   - تستخدم Delivery API endpoints (`api/v1/delivery/...`)
   - تجيب page data + contents + categories في طلبات متعددة
   - تطبق Theme CSS variables ك inline styles

3. **Frontend patterns (اتباع النمط):**
   - view components تتبع نفس نمط templates/components
   - استخدام ETable + ECard + DtDelete + DtEdit
   - التعامل مع PascalCase/camelCase
